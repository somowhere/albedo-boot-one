/**
 * Copyright &copy; 2018 <a href="https://github.com/somewhereMrli/albedo-boot">albedo-boot</a> All rights reserved.
 */
package com.albedo.java.modules.test.web;

import com.albedo.java.common.security.SecurityUtil;
import com.albedo.java.modules.test.domain.vo.TestTreeVo;
import com.albedo.java.modules.test.service.TestTreeService;
import com.albedo.java.util.JsonUtil;
import com.albedo.java.util.PublicUtil;
import com.albedo.java.util.StringUtil;
import com.albedo.java.util.domain.Globals;
import com.albedo.java.util.domain.PageModel;
import com.albedo.java.util.exception.RuntimeMsgException;
import com.albedo.java.vo.sys.query.TreeQuery;
import com.albedo.java.vo.sys.query.TreeResult;
import com.albedo.java.web.rest.ResultBuilder;
import com.albedo.java.web.rest.base.TreeVoResource;
import com.alibaba.fastjson.JSON;
import com.codahale.metrics.annotation.Timed;
import com.google.common.collect.Lists;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;


/**
 * 测试树管理Controller 测试树管理
 * @author admin
 * @version 2018-03-23
 */
@Controller
@RequestMapping(value = "${albedo.adminPath}/test/testTree")
public class TestTreeResource extends TreeVoResource<TestTreeService, TestTreeVo> {
    public TestTreeResource(TestTreeService service) {
        super(service);
    }
    /**
	 * GET / : 获取树型结构数据 测试树管理.
	 *
	 * @param treeQuery
	 * @return the ResponseEntity with status 200 (OK) and with body all testTree
	 */
	@GetMapping(value = "findTreeData")
	public ResponseEntity findTreeData(TreeQuery treeQuery) {
		List<TreeResult> treeResultList = service.findTreeData(treeQuery);
		return ResultBuilder.buildOk(treeResultList);
	}

	/**
	 * GET / : 获取分页数据源 测试树管理.
	 *
	 * @param pm the pagination information
	 * @return the ResponseEntity with status 200 (OK) and with body all testTree
	 */
	@GetMapping(value = "/")
	@Timed
	public ResponseEntity getPage(PageModel pm) {
	    service.findPage(pm, SecurityUtil.dataScopeFilter());
		JSON json = JsonUtil.getInstance().setRecurrenceStr().toJsonObject(pm);
		return ResultBuilder.buildObject(json);
	}
    @GetMapping(value = "/formData")
    @Timed
    public ResponseEntity formData(TestTreeVo testTreeVo) {
        if (testTreeVo == null) {
            throw new RuntimeMsgException(PublicUtil.toAppendStr("查询失败，原因：无法查找到编号测试树管理"));
        }
        if (PublicUtil.isEmpty(testTreeVo.getId()) && PublicUtil.isNotEmpty(testTreeVo.getParentId())) {
            service.findOneById(testTreeVo.getParentId()).ifPresent(item -> testTreeVo.setParentName(item.getName()));
            service.findOptionalTopByParentId(testTreeVo.getParentId()).ifPresent(item -> testTreeVo.setSort(item.getSort() + 30));
        }
        if (testTreeVo.getSort() == null) {
            testTreeVo.setSort(30);
        }
        return ResultBuilder.buildOk(testTreeVo);
    }
	/**
	 * POST / : 保存 a 测试树管理Vo.
	 *
	 * @param {className}Vo
	 */
	@PostMapping(value = "/", produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity save(@Valid @RequestBody TestTreeVo testTreeVo) {
		log.debug("REST request to save TestTree : {}", testTreeVo);
		TestTreeVo testTreeValidate = new TestTreeVo(testTreeVo.getId());
		testTreeValidate.setName(testTreeVo.getName());
		if (PublicUtil.isNotEmpty(testTreeVo.getName()) && !checkByProperty(testTreeValidate)) {
			throw new RuntimeMsgException(PublicUtil.toAppendStr("保存测试树管理'", testTreeVo.getName(),"'失败，name_已存在"));
		}
		service.save(testTreeVo);
        return ResultBuilder.buildOk("保存测试树管理成功");
	}

	/**
	 * DELETE //:id : delete the "id" TestTree.
	 *
	 * @param ids the id of the testTree to delete
	 * @return the ResponseEntity with status 200 (OK)
	 */
	@DeleteMapping(value = "/{ids:" + Globals.LOGIN_REGEX
			+ "}", produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity delete(@PathVariable String ids) {
		log.debug("REST request to delete TestTree: {}", ids);
		service.deleteByParentIds(Lists.newArrayList(ids.split(StringUtil.SPLIT_DEFAULT)), SecurityUtil.getCurrentUserId());
		return ResultBuilder.buildOk("删除测试树管理成功");
	}
	/**
	 * lock //:id : lockOrUnLock the "id" TestTree.
	 *
	 * @param ids the id of the testTree to lock
	 * @return the ResponseEntity with status 200 (OK)
	 */
	@PutMapping(value = "/{ids:" + Globals.LOGIN_REGEX
			+ "}", produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity lockOrUnLock(@PathVariable String ids) {
		log.debug("REST request to lockOrUnLock TestTree: {}", ids);
		service.lockOrUnLockByParentIds(Lists.newArrayList(ids.split(StringUtil.SPLIT_DEFAULT)), SecurityUtil.getCurrentUserId());
		return ResultBuilder.buildOk("操作测试树管理成功");
	}

}