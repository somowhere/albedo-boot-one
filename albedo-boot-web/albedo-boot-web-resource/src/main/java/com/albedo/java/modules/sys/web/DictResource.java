package com.albedo.java.modules.sys.web;

import com.albedo.java.common.security.SecurityUtil;
import com.albedo.java.modules.sys.domain.Dict;
import com.albedo.java.modules.sys.service.DictService;
import com.albedo.java.util.DictUtil;
import com.albedo.java.util.JsonUtil;
import com.albedo.java.util.StringUtil;
import com.albedo.java.util.base.Reflections;
import com.albedo.java.util.domain.Globals;
import com.albedo.java.util.domain.PageModel;
import com.albedo.java.util.exception.RuntimeMsgException;
import com.albedo.java.vo.sys.DictVo;
import com.albedo.java.web.rest.ResultBuilder;
import com.albedo.java.web.rest.base.TreeVoResource;
import com.alibaba.fastjson.JSON;
import com.codahale.metrics.annotation.Timed;
import com.google.common.collect.Lists;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URISyntaxException;

/**
 * REST controller for managing Station.
 *
 * @author somewhere
 */
@Controller
@RequestMapping("${albedo.adminPath}/sys/dict")
public class DictResource extends TreeVoResource<DictService, DictVo> {

    public DictResource(DictService service) {
        super(service);
    }

    /**
     * @param pm
     * @return
     * @throws URISyntaxException
     */
    @GetMapping(value = "/")
    public ResponseEntity getPage(PageModel<Dict> pm) {
        pm.setSortDefaultName(Direction.DESC, Dict.F_SORT, Dict.F_LASTMODIFIEDDATE);
        service.findPage(pm);
        JSON rs = JsonUtil.getInstance().setRecurrenceStr("parent_name").toJsonObject(pm);
        return ResultBuilder.buildObject(rs);
    }

    /**
     * @param dictVo
     * @return
     * @throws URISyntaxException
     */
    @PostMapping(value = "/", produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity save(@Valid @RequestBody DictVo dictVo)
            throws URISyntaxException {
        log.debug("REST request to save Dict : {}", dictVo);
        // Lowercase the dictVo login before comparing with database
        if (!checkByProperty(Reflections.createObj(DictVo.class, Lists.newArrayList(DictVo.F_ID, DictVo.F_CODE),
                dictVo.getId(), dictVo.getName()))) {
            throw new RuntimeMsgException("编码已存在");
        }
        service.save(dictVo);
        DictUtil.clearCache();
        return ResultBuilder.buildOk("保存", dictVo.getName(), "成功");
    }

    /**
     * @param ids
     * @return
     */
    @DeleteMapping(value = "/{ids:" + Globals.LOGIN_REGEX
            + "}")
    @Timed
    public ResponseEntity delete(@PathVariable String ids) {
        log.debug("REST request to delete Dict: {}", ids);
        service.deleteByParentIds(Lists.newArrayList(ids.split(StringUtil.SPLIT_DEFAULT)), SecurityUtil.getCurrentUserId());
        DictUtil.clearCache();
        return ResultBuilder.buildOk("删除成功");
    }


    @PutMapping(value = "/{ids:" + Globals.LOGIN_REGEX
            + "}")
    @Timed
    public ResponseEntity lockOrUnLock(@PathVariable String ids) {
        log.debug("REST request to lockOrUnLock Dict: {}", ids);
        service.lockOrUnLockByParentIds(Lists.newArrayList(ids.split(StringUtil.SPLIT_DEFAULT)), SecurityUtil.getCurrentUserId());
        DictUtil.clearCache();
        return ResultBuilder.buildOk("操作成功");
    }

}
