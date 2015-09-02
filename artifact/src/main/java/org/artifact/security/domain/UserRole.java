/**
 * 
 */
package org.artifact.security.domain;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.artifact.base.domain.IdEntity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * 用户与角色关系实体类
 * <p>
 * 日期：2015年8月14日
 * 
 * @version 0.1
 * @author Netbug
 */
@Entity
@Table(name = "sec_user_role")
@SuppressWarnings("serial")
public class UserRole extends IdEntity {
	@JsonIgnoreProperties(value = { "userRoleList" })
	private User user;
	@JsonIgnoreProperties(value = { "rolePermissionList", "userRoleList" })
	private Role role;

	@ManyToOne(cascade = CascadeType.REFRESH)
	@JoinColumn(name = "userid")
	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	@ManyToOne(cascade = CascadeType.REFRESH)
	@JoinColumn(name = "roleid")
	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

}
