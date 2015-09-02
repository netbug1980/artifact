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
 * 功能权限实体类
 * <p>
 * 日期：2015年8月14日
 * 
 * @version 0.1
 * @author Netbug
 */
@SuppressWarnings("serial")
@Entity
@Table(name = "sec_permission")
public class Permission extends IdEntity {
	private String path;
	private String url;
	@JsonIgnoreProperties(value = { "permission" })
	private List<RolePermission> rolePermissionList;

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	@OneToMany(mappedBy = "permission", fetch = FetchType.LAZY, cascade = {
			CascadeType.REFRESH, CascadeType.REMOVE })
	public List<RolePermission> getRolePermissionList() {
		return rolePermissionList;
	}

	public void setRolePermissionList(List<RolePermission> rolePermissionList) {
		this.rolePermissionList = rolePermissionList;
	}
}
