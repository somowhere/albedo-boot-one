/**
 * Copyright &copy; 2018 <a href="https://github.com/somewhereMrli/albedo-boot">albedo-boot</a> All rights reserved.
 */
package com.albedo.java.modules.test.domain.vo;

import com.albedo.java.vo.base.DataEntityVo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Date;

/**
 * 测试书籍EntityVo 测试书籍
 * @author admin
 * @version 2018-03-23
 */
@Data @ToString @NoArgsConstructor @AllArgsConstructor
public class TestBookVo extends DataEntityVo<String> {

	private static final long serialVersionUID = 1L;
	/** F_TITLE title_  :  标题 */
	public static final String F_TITLE = "title";
	/** F_AUTHOR author_  :  作者 */
	public static final String F_AUTHOR = "author";
	/** F_NAME name_  :  名称 */
	public static final String F_NAME = "name";
	/** F_EMAIL email_  :  邮箱 */
	public static final String F_EMAIL = "email";
	/** F_PHONE phone_  :  手机 */
	public static final String F_PHONE = "phone";
	/** F_ACTIVATED activated_  :  activated_ */
	public static final String F_ACTIVATED = "activated";
	/** F_LANGKEY lang_key  :  key */
	public static final String F_LANGKEY = "langKey";
	/** F_ACTIVATIONKEY activation_key  :  activation_key */
	public static final String F_ACTIVATIONKEY = "activationKey";
	/** F_RESETKEY reset_key  :  reset_key */
	public static final String F_RESETKEY = "resetKey";
	/** F_RESETDATE reset_date  :  reset_date */
	public static final String F_RESETDATE = "resetDate";

	//columns START
	/** title 标题 */
 @Length(max=32)
	private String title;
	/** author 作者 */
 @NotBlank @Length(max=50)
	private String author;
	/** name 名称 */
 @Length(max=50)
	private String name;
	/** email 邮箱 */
 @Email @Length(max=100)
	private String email;
	/** phone 手机 */
 @Length(max=32)
	private String phone;
	/** activated activated_ */
 @NotNull 
	private Integer activated;
	/** langKey key */
 @Length(max=5)
	private String langKey;
	/** activationKey activation_key */
 @Length(max=20)
	private String activationKey;
	/** resetKey reset_key */
 @Length(max=20)
	private String resetKey;
	/** resetDate reset_date */
 
	private Date resetDate;
	//columns END

	public TestBookVo(String id) {
		this.setId(id);
	}

	@Override
	public boolean equals(Object obj) {
		if(obj instanceof TestBookVo == false){ return false;}
		if(this == obj) {return true;}
		TestBookVo other = (TestBookVo)obj;
		return new EqualsBuilder()
			.append(getId(),other.getId())
			.isEquals();
	}
}
