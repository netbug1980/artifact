/**
 * 
 */
package org.artifact.security.bean;

import org.artifact.base.bean.BaseBean;

/**
 * <p>
 * 日期：2015年8月14日
 * 
 * @version 0.1
 * @author Netbug
 */
@SuppressWarnings("serial")
public class UserBean extends BaseBean {
	private String name;// 名称
	private String account;// 账号
	private String password;// 密码
	private Integer age;// 年龄

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getAccount() {
		return account;
	}

	public void setAccount(String account) {
		this.account = account;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Integer getAge() {
		return age;
	}

	public void setAge(Integer age) {
		this.age = age;
	}

}
