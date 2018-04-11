/**
 * Copyright &copy; 2018 <a href="https://github.com/somewhereMrli/albedo-boot">albedo-boot</a> All rights reserved.
 */
package com.albedo.java.modules.test.domain;

import com.albedo.java.common.persistence.domain.IdEntity;
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
import org.hibernate.validator.constraints.Email;
import javax.validation.constraints.NotNull;

import javax.persistence.*;
import java.util.Date;
import java.util.Objects;



/**
 * 测试书籍Entity 测试书籍
 * @author admin
 * @version 2018-03-23
 */
@Entity
@Table(name = "test_book")
@DynamicInsert @DynamicUpdate
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@Data @ToString @NoArgsConstructor @AllArgsConstructor
public class TestBook extends IdEntity<String> {

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

	/** F_SQL_TITLE title_  :  标题 */
	public static final String F_SQL_TITLE = "title_";
	/** F_SQL_AUTHOR author_  :  作者 */
	public static final String F_SQL_AUTHOR = "author_";
	/** F_SQL_NAME name_  :  名称 */
	public static final String F_SQL_NAME = "name_";
	/** F_SQL_EMAIL email_  :  邮箱 */
	public static final String F_SQL_EMAIL = "email_";
	/** F_SQL_PHONE phone_  :  手机 */
	public static final String F_SQL_PHONE = "phone_";
	/** F_SQL_ACTIVATED activated_  :  activated_ */
	public static final String F_SQL_ACTIVATED = "activated_";
	/** F_SQL_LANGKEY lang_key  :  key */
	public static final String F_SQL_LANGKEY = "lang_key";
	/** F_SQL_ACTIVATIONKEY activation_key  :  activation_key */
	public static final String F_SQL_ACTIVATIONKEY = "activation_key";
	/** F_SQL_RESETKEY reset_key  :  reset_key */
	public static final String F_SQL_RESETKEY = "reset_key";
	/** F_SQL_RESETDATE reset_date  :  reset_date */
	public static final String F_SQL_RESETDATE = "reset_date";

	//columns START
	/** title 标题 */@Length(max=32)@Column(name = "title_", unique = false, nullable = true, length = 32)
	private String title;
	/** author 作者 */@NotBlank @Length(max=50)@Column(name = "author_", unique = false, nullable = false, length = 50)
	private String author;
	/** name 名称 */@Length(max=50)@Column(name = "name_", unique = false, nullable = true, length = 50)
	private String name;
	/** email 邮箱 */@Email @Length(max=100)@Column(name = "email_", unique = true, nullable = true, length = 100)@SearchField
	private String email;
	/** phone 手机 */@Length(max=32)@Column(name = "phone_", unique = false, nullable = true, length = 32)
	private String phone;
	/** activated activated_ */@NotNull @Column(name = "activated_", unique = false, nullable = false)
	private Integer activated;
	/** langKey key */@Length(max=5)@Column(name = "lang_key", unique = false, nullable = true, length = 5)
	private String langKey;
	/** activationKey activation_key */@Length(max=20)@Column(name = "activation_key", unique = false, nullable = true, length = 20)
	private String activationKey;
	/** resetKey reset_key */@Length(max=20)@Column(name = "reset_key", unique = false, nullable = true, length = 20)
	private String resetKey;
	/** resetDate reset_date */@Temporal(TemporalType.DATE)@Column(name = "reset_date", unique = false, nullable = true)
	private Date resetDate;
	//columns END

	public TestBook(String id) {
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
