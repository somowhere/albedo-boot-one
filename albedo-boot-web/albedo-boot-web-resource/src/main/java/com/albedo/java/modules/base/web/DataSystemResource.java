package com.albedo.java.modules.base.web;

import com.albedo.java.common.config.AlbedoProperties;
import com.albedo.java.common.security.SecurityUtil;
import com.albedo.java.modules.sys.domain.Dict;
import com.albedo.java.modules.sys.service.DictService;
import com.albedo.java.modules.sys.service.ModuleService;
import com.albedo.java.modules.sys.service.OrgService;
import com.albedo.java.util.DictUtil;
import com.albedo.java.util.PublicUtil;
import com.albedo.java.util.StringUtil;
import com.albedo.java.util.base.Reflections;
import com.albedo.java.util.domain.ComboData;
import com.albedo.java.util.domain.ComboSearch;
import com.albedo.java.vo.base.SelectResult;
import com.albedo.java.vo.sys.ModuleVo;
import com.albedo.java.vo.sys.query.*;
import com.albedo.java.web.rest.ResultBuilder;
import com.alibaba.fastjson.JSON;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Controller for view and managing Log Level at runtime.
 */
@RestController
@RequestMapping("${albedo.adminPath}/dataSystem")
public class DataSystemResource {

    private ModuleService moduleService;
    private DictService dictService;
    private OrgService orgService;
    private AlbedoProperties albedoProperties;

    public DataSystemResource(ModuleService moduleService, DictService dictService, OrgService orgService, AlbedoProperties albedoProperties) {
        this.moduleService = moduleService;
        this.dictService = dictService;
        this.orgService = orgService;
        this.albedoProperties = albedoProperties;
    }

    @GetMapping(value = "module/data")
    public ResponseEntity data(ModuleTreeQuery moduleTreeQuery) {
        List<ModuleVo> rs = moduleService.findMenuDataVo(moduleTreeQuery, SecurityUtil.getModuleList());
        List<ModuleVo> list = Lists.newArrayList();
        PublicUtil.sortTreeList(list,  rs, ModuleVo.ROOT_ID, false);
        Map<String, Object> rsMap = Maps.newHashMap();
        rsMap.put("gatewayModel",albedoProperties.getGatewayModel());
        rsMap.put("moduleList",list);
        return ResultBuilder.buildOk(rsMap);
    }

    @GetMapping(value = "module/findTreeData")
    public ResponseEntity findTreeData(ModuleTreeQuery moduleTreeQuery) {
        List<TreeResult> rs = moduleService.findTreeData(moduleTreeQuery, SecurityUtil.getModuleList());
        return ResultBuilder.buildOk(rs);
    }

    @GetMapping(value = "dict/findTreeData")
    public ResponseEntity findTreeData(DictTreeQuery dictTreeQuery) {
        List<DictTreeResult> rs = dictService.findTreeData(dictTreeQuery, DictUtil.getDictList());
        return ResultBuilder.buildOk(rs);
    }

    @GetMapping(value = "dict/findSelectData")
    public ResponseEntity findSelectData(DictQuerySearch dictQuerySearch) {
        Map<String, Object> map = Maps.newHashMap();
        if (PublicUtil.isNotEmpty(dictQuerySearch.getDictQueries())) {
            List<DictQuery> dictQueries = JSON.parseArray(dictQuerySearch.getDictQueries(), DictQuery.class);
            dictQueries.forEach(dictQuery -> map.put(StringUtil.toCamelCase(dictQuery.getCode()),
                DictUtil.getDictList(dictQuery).
                    stream().map(item -> new SelectResult(item.getVal(), item.getName())).collect(Collectors.toList())));
        }
        return ResultBuilder.buildOk(map);
    }
    @GetMapping(value = "dict/codes")
    public ResponseEntity codes(DictQuery dictQuery, ComboSearch comboSearch) {

        List<ComboData> dataList = Lists.newArrayList();
        if(dictQuery!=null && PublicUtil.isNotEmpty(dictQuery.getCode())){
            List<Dict> dictList = DictUtil.getDictListFilterVal(dictQuery.getCode(),
                dictQuery.getFilter());
            if (PublicUtil.isNotEmpty(dictList)) {

                dictList.forEach(item -> dataList.add(Reflections.createObj(ComboData.class,
                    Lists.newArrayList(ComboData.F_ID, ComboData.F_NAME), item.getVal(), item.getName())));
            }
        }else if(comboSearch !=null){
            dataList.addAll(dictService.findJson(comboSearch));
        }
        return ResultBuilder.buildOk(dataList);
    }
    @GetMapping(value = "org/findTreeData")
    public ResponseEntity findTreeData(OrgTreeQuery orgTreeQuery) {
        List<TreeResult> treeResultList = orgService.findTreeData(orgTreeQuery, SecurityUtil.getOrgList());
        return ResultBuilder.buildOk(treeResultList);
    }
}
