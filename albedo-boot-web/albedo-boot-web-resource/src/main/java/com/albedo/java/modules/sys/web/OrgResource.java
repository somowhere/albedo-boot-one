package com.albedo.java.modules.sys.web;

import com.albedo.java.common.persistence.domain.DataEntity;
import com.albedo.java.common.security.SecurityUtil;
import com.albedo.java.modules.sys.service.OrgService;
import com.albedo.java.util.JsonUtil;
import com.albedo.java.util.PublicUtil;
import com.albedo.java.util.StringUtil;
import com.albedo.java.util.base.Reflections;
import com.albedo.java.util.domain.Globals;
import com.albedo.java.util.domain.PageModel;
import com.albedo.java.util.exception.RuntimeMsgException;
import com.albedo.java.vo.sys.OrgVo;
import com.albedo.java.web.rest.ResultBuilder;
import com.albedo.java.web.rest.base.TreeVoResource;
import com.alibaba.fastjson.JSON;
import com.codahale.metrics.annotation.Timed;
import com.google.common.collect.Lists;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * REST controller for managing Station.
 *
 * @author somewhere
 */
@Controller
@RequestMapping("${albedo.adminPath}/sys/org")
public class OrgResource extends TreeVoResource<OrgService, OrgVo> {

    public OrgResource(OrgService service) {
        super(service);
    }

    /**
     * @param pm
     * @return
     */
    @GetMapping(value = "/")
    public ResponseEntity getPage(PageModel pm) {
        pm.setSortDefaultName(Direction.DESC, DataEntity.F_LASTMODIFIEDDATE);
        service.findPage(pm, SecurityUtil.dataScopeFilter(
                SecurityUtil.getCurrentUserId(), "this", ""));
        JSON json = JsonUtil.getInstance().toJsonObject(pm);
        return ResultBuilder.buildObject(json);
    }
    @GetMapping(value = "/formData")
    @Timed
    public ResponseEntity formData(OrgVo orgVo) {
        if (orgVo == null) {
            throw new RuntimeMsgException(PublicUtil.toAppendStr("查询失败，原因：无法查找到编号组织"));
        }
        if (PublicUtil.isEmpty(orgVo.getId()) && PublicUtil.isNotEmpty(orgVo.getParentId())) {
            service.findOneById(orgVo.getParentId()).ifPresent(item -> orgVo.setParentName(item.getName()));
            service.findOptionalTopByParentId(orgVo.getParentId()).ifPresent(item -> orgVo.setSort(item.getSort() + 30));
        }
        if (orgVo.getSort() == null) {
            orgVo.setSort(30);
        }
        return ResultBuilder.buildOk(orgVo);
    }
    /**
     * @param orgVo
     * @return
     */
    @PostMapping(value = "/", produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity save(@Valid @RequestBody OrgVo orgVo) {
        log.debug("REST request to save orgVo : {}", orgVo);
        // Lowercase the org login before comparing with database
        if (!checkByProperty(Reflections.createObj(OrgVo.class, Lists.newArrayList(OrgVo.F_ID, OrgVo.F_CODE),
                orgVo.getId(), orgVo.getCode()))) {
            throw new RuntimeMsgException(HttpStatus.BAD_REQUEST, "编码已存在");
        }
        service.save(orgVo);
        SecurityUtil.clearUserJedisCache();
        return ResultBuilder.buildOk("保存", orgVo.getName(), "成功");
    }

    /**
     * @param ids
     * @return
     */
    @DeleteMapping(value = "/{ids:" + Globals.LOGIN_REGEX
            + "}")
    @Timed
    public ResponseEntity delete(@PathVariable String ids) {
        log.debug("REST request to delete Org: {}", ids);
        service.deleteByParentIds(Lists.newArrayList(ids.split(StringUtil.SPLIT_DEFAULT)), SecurityUtil.getCurrentUserId());
        SecurityUtil.clearUserJedisCache();
        return ResultBuilder.buildOk("删除成功");
    }

    /**
     * @param ids
     * @return
     */
    @PutMapping(value = "/{ids:" + Globals.LOGIN_REGEX
            + "}")
    @Timed
    public ResponseEntity lockOrUnLock(@PathVariable String ids) {
        log.debug("REST request to lockOrUnLock User: {}", ids);
        service.lockOrUnLockByParentIds(Lists.newArrayList(ids.split(StringUtil.SPLIT_DEFAULT)), SecurityUtil.getCurrentUserId());
        SecurityUtil.clearUserJedisCache();
        return ResultBuilder.buildOk("操作成功");
    }

}
