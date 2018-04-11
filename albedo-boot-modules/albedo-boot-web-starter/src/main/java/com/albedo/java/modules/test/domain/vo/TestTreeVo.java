/**
 * Copyright &copy; 2018 <a href="https://github.com/somewhereMrli/albedo-boot">albedo-boot</a> All rights reserved.
 */
package com.albedo.java.modules.test.domain.vo;

import com.albedo.java.vo.base.TreeEntityVo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Date;
/**
 * 测试树管理Entity 测试树管理
 * @author admin
 * @version 2018-03-23
 */
@Data @ToString @NoArgsConstructor @AllArgsConstructor
public class TestTreeVo extends TreeEntityVo {

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
	/** code 机构编码 */
 @NotBlank @Length(max=64)
	private String code;
	/** grade 机构等级 */
 @NotBlank @Length(max=255)
	private String grade;
	/** en 英文 */
 @Length(max=255)
	private String en;
	/** type 组织类型 */
 @Length(max=64)
	private String type;
	/** defaultData 默认日期 */
 @NotNull 
	private Date defaultData;
	//columns END

	public TestTreeVo(String id) {
		this.setId(id);
	}

    @Override
	public boolean equals(Object obj) {
		if(obj instanceof TestTreeVo == false){ return false;}
		if(this == obj) {return true;}
		TestTreeVo other = (TestTreeVo)obj;
		return new EqualsBuilder()
			.append(getId(),other.getId())
			.isEquals();
	}
}
