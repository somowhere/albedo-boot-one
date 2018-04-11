package com.albedo.java.modules.gen.web;

import com.albedo.java.common.security.AuthoritiesConstants;
import com.albedo.java.common.security.SecurityUtil;
import com.albedo.java.modules.gen.domain.GenTemplate;
import com.albedo.java.modules.gen.service.GenTemplateService;
import com.albedo.java.util.JsonUtil;
import com.albedo.java.util.StringUtil;
import com.albedo.java.util.base.Reflections;
import com.albedo.java.util.domain.Globals;
import com.albedo.java.util.domain.PageModel;
import com.albedo.java.util.exception.RuntimeMsgException;
import com.albedo.java.web.rest.ResultBuilder;
import com.albedo.java.web.rest.base.DataResource;
import com.alibaba.fastjson.JSON;
import com.codahale.metrics.annotation.Timed;
import com.google.common.collect.Lists;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;

/**
 * 代码模板Controller
 *
 * @author somewhere
 */
@Controller
@RequestMapping(value = "${albedo.adminPath}/gen/genTemplate")
public class GenTemplateResource extends DataResource<GenTemplateService, GenTemplate> {


    public GenTemplateResource(GenTemplateService service) {
        super(service);
    }

    /**
     * @param pm
     * @return
     */
    @GetMapping(value = "/")
    public ResponseEntity getPage(PageModel<GenTemplate> pm) {

        service.findPage(pm);
        JSON rs = JsonUtil.getInstance().setRecurrenceStr("org_name").toJsonObject(pm);
        return ResultBuilder.buildObject(rs);
    }


    /**
     * @param genTemplate
     * @return
     * @throws URISyntaxException
     */
    @PostMapping(value = "/", produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity save(GenTemplate genTemplate)
            throws URISyntaxException {
        log.debug("REST request to save GenTemplateVo : {}", genTemplate);
        // Lowercase the genTable login before comparing with database
        if (!checkByProperty(Reflections.createObj(GenTemplate.class, Lists.newArrayList(GenTemplate.F_ID, GenTemplate.F_NAME), genTemplate.getId(),
                genTemplate.getName()))) {
            throw new RuntimeMsgException("名称已存在");
        }
        service.save(genTemplate);
        SecurityUtil.clearUserJedisCache();
        return ResultBuilder.buildOk("保存", genTemplate.getName(), "成功");
    }

    /**
     * @param ids
     * @return
     */
    @DeleteMapping(value = "/{ids:" + Globals.LOGIN_REGEX
            + "}")
    @Timed
    public ResponseEntity delete(@PathVariable String ids) {
        log.debug("REST request to delete GenTemplateVo: {}", ids);
        service.deleteBatchIds(Lists.newArrayList(ids.split(StringUtil.SPLIT_DEFAULT)));
        SecurityUtil.clearUserJedisCache();
        return ResultBuilder.buildOk("删除成功");
    }

    @PutMapping(value = "/{ids:" + Globals.LOGIN_REGEX
            + "}")
    @Timed
    @Secured(AuthoritiesConstants.ADMIN)
    public ResponseEntity lockOrUnLock(@PathVariable String ids) {
        log.debug("REST request to lockOrUnLock GenTemplateVo: {}", ids);
        service.lockOrUnLock(Lists.newArrayList(ids.split(StringUtil.SPLIT_DEFAULT)));
        SecurityUtil.clearUserJedisCache();
        return ResultBuilder.buildOk("操作成功");
    }

}
