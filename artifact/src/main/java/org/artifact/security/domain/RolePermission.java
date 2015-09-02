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
 * 角色与权限关系实体类
 * <p>
 * 日期：2015年8月14日
 * 
 * @version 0.1
 * @author Netbug
 */
@SuppressWarnings("serial")
@Entity
@Table(name = "sec_role_permission")
public class RolePermission extends IdEntity {
	@JsonIgnoreProperties(value = { "rolePermissionList", "userRoleList" })
	private Role role;
	@JsonIgnoreProperties(value = { "rolePermissionList" })
	private Permission permission;

	@ManyToOne(cascade = CascadeType.REFRESH)
	@JoinColumn(name = "roleid")
	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	@ManyToOne(cascade = CascadeType.REFRESH)
	@JoinColumn(name = "permissionid")
	public Permission getPermission() {
		return permission;
	}

	public void setPermission(Permission permission) {
		this.permission = permission;
	}

}
