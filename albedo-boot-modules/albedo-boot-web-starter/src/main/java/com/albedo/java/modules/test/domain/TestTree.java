/**
 * Copyright &copy; 2018 <a href="https://github.com/somewhereMrli/albedo-boot">albedo-boot</a> All rights reserved.
 */
package com.albedo.java.modules.test.domain;

import com.albedo.java.common.persistence.domain.TreeEntity;
import com.albedo.java.util.annotation.DictType;
import com.albedo.java.util.annotation.SearchField;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import javax.persistence.*;
import java.util.Date;
import java.util.Objects;

/**
 * 测试树管理Entity 测试树管理
 * @author admin
 * @version 2018-03-23
 */
@Entity
@Table(name = "test_tree")
@DynamicInsert @DynamicUpdate
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@Data @ToString @NoArgsConstructor @AllArgsConstructor
public class TestTree extends TreeEntity<TestTree> {

	private static final long serialVersionUID = 1L;
	/** F_CODE code_  :  机构编码 */
	public static final String F_CODE = "code";
	/** F_GRADE grade_  :  机构等级 */
	public static final String F_GRADE = "grade";
	/** F_EN en_  :  英文 */
	public static final String F_EN = "en";
	/** F_TYPE type_  :  组织类型 */
	public static final String F_TYPE = "type";
	/** F_DEFAULTDATA default_data  :  默认日期 */
	public static final String F_DEFAULTDATA = "defaultData";

	//columns START
	/** code 机构编码 */@NotBlank @Length(max=64)@Column(name = "code_", unique = false, nullable = false, length = 64)
	private String code;
	/** grade 机构等级 */@NotBlank @Length(max=255)@Column(name = "grade_", unique = false, nullable = false, length = 255)
	private String grade;
	/** en 英文 */@Length(max=255)@Column(name = "en_", unique = false, nullable = true, length = 255)
	private String en;
	/** type 组织类型 */@Length(max=64)@Column(name = "type_", unique = false, nullable = true, length = 64)
	private String type;
	/** defaultData 默认日期 */@NotNull @Column(name = "default_data", unique = false, nullable = false)
	private Date defaultData;
	//columns END

	public TestTree(String id) {
		this.setId(id);
	}

	@Override
    public boolean equals(Object o) {
        return super.equals(o);
    }
    @Override
    public int hashCode() {
        return super.hashCode();
    }
}
