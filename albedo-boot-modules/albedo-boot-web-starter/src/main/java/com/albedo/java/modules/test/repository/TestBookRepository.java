/**
 * Copyright &copy; 2018 <a href="https://github.com/somewhereMrli/albedo-boot">albedo-boot</a> All rights reserved.
 */
package com.albedo.java.modules.test.repository;

import java.util.Optional;

import com.albedo.java.common.persistence.repository.DataRepository;
import com.albedo.java.modules.test.domain.TestBook;

/**
 * 测试书籍Repository 测试书籍
 * @author admin
 * @version 2018-03-23
 */
public interface TestBookRepository extends DataRepository<TestBook, String> {

}