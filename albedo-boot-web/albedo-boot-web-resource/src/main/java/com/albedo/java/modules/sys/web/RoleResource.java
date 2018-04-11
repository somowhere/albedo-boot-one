package com.albedo.java.modules.sys.web;

import com.albedo.java.common.config.template.tag.FormDirective;
import com.albedo.java.common.security.SecurityUtil;
import com.albedo.java.modules.sys.domain.Role;
import com.albedo.java.modules.sys.service.RoleService;
import com.albedo.java.util.JsonUtil;
import com.albedo.java.util.StringUtil;
import com.albedo.java.util.base.Reflections;
import com.albedo.java.util.domain.Globals;
import com.albedo.java.util.domain.PageModel;
import com.albedo.java.util.exception.RuntimeMsgException;
import com.albedo.java.vo.sys.RoleVo;
import com.albedo.java.web.rest.ResultBuilder;
import com.albedo.java.web.rest.base.DataVoResource;
import com.alibaba.fastjson.JSON;
import com.codahale.metrics.annotation.Timed;
import com.google.common.collect.Lists;
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
@RequestMapping("${albedo.adminPath}/sys/role")
public class RoleResource extends DataVoResource<RoleService, RoleVo> {

    public RoleResource(RoleService service) {
        super(service);
    }

    @GetMapping(value = "/comboData")
    public ResponseEntity comboData() {
        return ResultBuilder.buildDataOk(FormDirective.convertComboDataList(SecurityUtil.getRoleList(), Role.F_ID, Role.F_NAME));
    }

    /**
     * @param pm
     * @return
     */
    @GetMapping(value = "/")
    public ResponseEntity getPage(PageModel pm) {
        service.findPage(pm, SecurityUtil.dataScopeFilter(SecurityUtil.getCurrentUserId(), "org", "creator"));
        JSON rs = JsonUtil.getInstance().setRecurrenceStr("org_name").toJsonObject(pm);
        return ResultBuilder.buildObject(rs);
    }

    /**
     * @param roleVo
     * @return
     */
    @PostMapping(value = "/", produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity save(@Valid @RequestBody RoleVo roleVo) {
        log.debug("REST request to save RoleVo : {}", roleVo);
        // Lowercase the role login before comparing with database
        if (!checkByProperty(Reflections.createObj(RoleVo.class, Lists.newArrayList(RoleVo.F_ID, RoleVo.F_NAME),
                roleVo.getId(), roleVo.getName()))) {
            throw new RuntimeMsgException("名称已存在");
        }
        if(!RoleVo.DATA_SCOPE_CUSTOM.equals(roleVo.getDataScope())&& roleVo.getOrgIdList()!=null){
            roleVo.getOrgIdList().clear();
        }
        service.save(roleVo);
        SecurityUtil.clearUserJedisCache();
        return ResultBuilder.buildOk("保存", roleVo.getName(), "成功");
    }

    /**
     * @param ids
     * @return
     */
    @DeleteMapping(value = "/{ids:" + Globals.LOGIN_REGEX
            + "}")
    @Timed
    public ResponseEntity delete(@PathVariable String ids) {
        log.debug("REST request to delete Role: {}", ids);
        service.deleteBatchIds(Lists.newArrayList(ids.split(StringUtil.SPLIT_DEFAULT)));
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
        service.lockOrUnLock(Lists.newArrayList(ids.split(StringUtil.SPLIT_DEFAULT)));
        SecurityUtil.clearUserJedisCache();
        return ResultBuilder.buildOk("操作成功");
    }

}
