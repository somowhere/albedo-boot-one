package com.albedo.java.modules.gen.web;

import com.albedo.java.common.security.AuthoritiesConstants;
import com.albedo.java.common.security.SecurityUtil;
import com.albedo.java.modules.gen.service.GenSchemeService;
import com.albedo.java.modules.gen.service.GenTableService;
import com.albedo.java.modules.sys.service.ModuleService;
import com.albedo.java.util.JsonUtil;
import com.albedo.java.util.PublicUtil;
import com.albedo.java.util.StringUtil;
import com.albedo.java.util.domain.Globals;
import com.albedo.java.util.domain.PageModel;
import com.albedo.java.vo.gen.GenSchemeVo;
import com.albedo.java.vo.gen.GenTableVo;
import com.albedo.java.web.rest.ResultBuilder;
import com.albedo.java.web.rest.base.DataVoResource;
import com.alibaba.fastjson.JSON;
import com.codahale.metrics.annotation.Timed;
import com.google.common.collect.Lists;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Map;

/**
 * 生成方案Controller
 *
 * @author somewhere
 */
@Controller
@RequestMapping(value = "${albedo.adminPath}/gen/genScheme")
public class GenSchemeResource extends DataVoResource<GenSchemeService, GenSchemeVo> {

    private final GenTableService genTableService;

    private final ModuleService moduleService;

    public GenSchemeResource(GenSchemeService genSchemeService, GenTableService genTableService, ModuleService moduleService) {
        super(genSchemeService);
        this.genTableService = genTableService;
        this.moduleService = moduleService;
    }

    /**
     * @param pm
     * @return
     */
    @GetMapping(value = "/")
    @Timed
    public ResponseEntity getPage(PageModel pm) {
        service.findPage(pm);
        JSON rs = JsonUtil.getInstance().setRecurrenceStr("genTable_name").toJsonObject(pm);
        return ResultBuilder.buildObject(rs);
    }
    @GetMapping(value = "/formData")
    @Timed
    public ResponseEntity formData(GenSchemeVo genSchemeVo) {
        Map<String, Object> formData = service.findFormData(genSchemeVo, SecurityUtil.getCurrentUser().getLoginId());
        return ResultBuilder.buildOk(formData);
    }

    @PostMapping(value = "/", produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity save(@Valid @RequestBody GenSchemeVo genSchemeVo) {
        service.save(genSchemeVo);
        SecurityUtil.clearUserJedisCache();
        if (genSchemeVo.getSyncModule()) {
            GenTableVo genTableVo = genSchemeVo.getGenTable();
            if (genTableVo == null || PublicUtil.isEmpty(genTableVo.getClassName())) {
                genTableVo = genTableService.findOneVo(genSchemeVo.getGenTableId());
            }
            String url = PublicUtil.toAppendStr("/", StringUtil.lowerCase(genSchemeVo.getModuleName()), (StringUtil.isNotBlank(genSchemeVo.getSubModuleName()) ? "/" + StringUtil.lowerCase(genSchemeVo.getSubModuleName()) : ""), "/",
                    StringUtil.uncapitalize(genTableVo.getClassName()), "/");
            moduleService.generatorModuleData(genSchemeVo.getName(), genSchemeVo.getParentModuleId(), url);
            SecurityUtil.clearUserJedisCache();
        }
        // 生成代码
        if (genSchemeVo.getGenCode()) {
            service.generateCode(genSchemeVo);
        }
        return ResultBuilder.buildOk("保存", genSchemeVo.getName(), "成功");
    }

    @DeleteMapping(value = "/{ids:" + Globals.LOGIN_REGEX
            + "}")
    @Timed
    public ResponseEntity lockOrUnLock(@PathVariable String ids) {
        log.debug("REST request to lockOrUnLock genTable: {}", ids);
        service.lockOrUnLock(Lists.newArrayList(ids.split(StringUtil.SPLIT_DEFAULT)));
        SecurityUtil.clearUserJedisCache();
        return ResultBuilder.buildOk("操作成功");
    }

    @PutMapping(value = "/{ids:" + Globals.LOGIN_REGEX
            + "}")
    @Timed
    @Secured(AuthoritiesConstants.ADMIN)
    public ResponseEntity delete(@PathVariable String ids) {
        log.debug("REST request to delete User: {}", ids);
        service.deleteBatchIds(Lists.newArrayList(ids.split(StringUtil.SPLIT_DEFAULT)));
        return ResultBuilder.buildOk("删除成功");
    }


}
