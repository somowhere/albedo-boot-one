/**
 * Copyright &copy; 2018 <a href="https://github.com/somewhereMrli/albedo-boot">albedo-boot</a> All rights reserved.
 */
package com.albedo.java.modules.test.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.albedo.java.common.persistence.service.TreeVoService;
import com.albedo.java.modules.test.domain.vo.TestTreeVo;
import com.albedo.java.modules.test.domain.TestTree;
import com.albedo.java.modules.test.repository.TestTreeRepository;
/**
 * 测试树管理Service 测试树管理
 * @author admin
 * @version 2018-03-23
 */
@Service
@Transactional
public class TestTreeService extends TreeVoService<TestTreeRepository, TestTree, String, TestTreeVo>{


}