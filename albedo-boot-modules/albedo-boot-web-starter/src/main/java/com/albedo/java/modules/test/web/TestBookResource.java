/**
 * Copyright &copy; 2018 <a href="https://github.com/somewhereMrli/albedo-boot">albedo-boot</a> All rights reserved.
 */
package com.albedo.java.modules.test.web;

import com.albedo.java.common.security.SecurityUtil;
import com.albedo.java.util.StringUtil;
import com.google.common.collect.Lists;
import com.albedo.java.modules.test.domain.vo.TestBookVo;
import com.albedo.java.modules.test.service.TestBookService;
import com.albedo.java.util.JsonUtil;
import com.albedo.java.util.PublicUtil;
import com.albedo.java.util.domain.Globals;
import com.albedo.java.util.domain.PageModel;
import com.albedo.java.util.exception.RuntimeMsgException;
import com.albedo.java.web.rest.ResultBuilder;
import com.albedo.java.web.rest.base.DataVoResource;
import com.alibaba.fastjson.JSON;
import com.codahale.metrics.annotation.Timed;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;

/**
 * 测试书籍Controller 测试书籍
 * @author admin
 * @version 2018-03-23
 */
@Controller
@RequestMapping(value = "${albedo.adminPath}/test/testBook")
public class TestBookResource extends DataVoResource<TestBookService, TestBookVo> {

    public TestBookResource(TestBookService service) {
        super(service);
    }

	/**
	 * GET / : get all testBook.
	 *
	 * @param pm
	 *            the pagination information
	 * @return the ResponseEntity with status 200 (OK) and with body all testBook
	 */
	@GetMapping(value = "/")
	@Timed
	public ResponseEntity getPage(PageModel pm) {
	    service.findPage(pm, SecurityUtil.dataScopeFilter());
		JSON json = JsonUtil.getInstance().setRecurrenceStr().toJsonObject(pm);
		return ResultBuilder.buildObject(json);
	}

	/**
	 * POST / : Save a testBookVo.
	 *
	 * @param testBookVo the HTTP testBook
	 */
	@PostMapping(value = "/", produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity save(@Valid @RequestBody TestBookVo testBookVo) {
		log.debug("REST request to save TestBookForm : {}", testBookVo);
		TestBookVo testBookValidate = new TestBookVo(testBookVo.getId());
		testBookValidate.setEmail(testBookVo.getEmail());
		if (PublicUtil.isNotEmpty(testBookVo.getEmail()) && !checkByProperty(testBookValidate)) {
			throw new RuntimeMsgException(PublicUtil.toAppendStr("保存测试书籍'", testBookVo.getEmail(),"'失败，邮箱已存在"));
		}
		service.save(testBookVo);
		return ResultBuilder.buildOk("保存测试书籍成功");

	}

	/**
	 * DELETE //:id : delete the "id" TestBook.
	 *
	 * @param ids the id of the testBook to delete
	 * @return the ResponseEntity with status 200 (OK)
	 */
	@DeleteMapping(value = "/{ids:" + Globals.LOGIN_REGEX
			+ "}")
	@Timed
	public ResponseEntity delete(@PathVariable String ids) {
		log.debug("REST request to delete TestBook: {}", ids);
		service.delete(Lists.newArrayList(ids.split(StringUtil.SPLIT_DEFAULT)));
		return ResultBuilder.buildOk("删除测试书籍成功");
	}
	/**
	 * lock //:id : lockOrUnLock the "id" TestBook.
	 *
	 * @param ids the id of the testBook to lock
	 * @return the ResponseEntity with status 200 (OK)
	 */
	@PutMapping(value = "/{ids:" + Globals.LOGIN_REGEX
			+ "}")
	@Timed
	public ResponseEntity lockOrUnLock(@PathVariable String ids) {
		log.debug("REST request to lockOrUnLock TestBook: {}", ids);
		service.lockOrUnLock(Lists.newArrayList(ids.split(StringUtil.SPLIT_DEFAULT)));
		return ResultBuilder.buildOk("操作测试书籍成功");
	}

}