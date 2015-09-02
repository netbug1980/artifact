/**
 * 
 */
package org.artifact.security.domain;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.artifact.base.domain.IdEntity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * 角色实体类
 * <p>
 * 日期：2015年8月14日
 * 
 * @version 0.1
 * @author Netbug
 */
@SuppressWarnings("serial")
@Entity
@Table(name = "sec_role")
public class Role extends IdEntity {
	private String name;// 名称
	private String desc;// 描述
	@JsonIgnoreProperties(value = { "role" })
	private List<UserRole> userRoleList;
	@JsonIgnoreProperties(value = { "role" })
	private List<RolePermission> rolePermissionList;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDesc() {
		return desc;
	}

	public void setDesc(String desc) {
		this.desc = desc;
	}

	@OneToMany(mappedBy = "role", fetch = FetchType.LAZY, cascade = {
			CascadeType.REFRESH, CascadeType.REMOVE })
	public List<UserRole> getUserRoleList() {
		return userRoleList;
	}

	public void setUserRoleList(List<UserRole> userRoleList) {
		this.userRoleList = userRoleList;
	}

	@OneToMany(mappedBy = "role", fetch = FetchType.LAZY, cascade = {
			CascadeType.REFRESH, CascadeType.REMOVE })
	public List<RolePermission> getRolePermissionList() {
		return rolePermissionList;
	}

	public void setRolePermissionList(List<RolePermission> rolePermissionList) {
		this.rolePermissionList = rolePermissionList;
	}

}
