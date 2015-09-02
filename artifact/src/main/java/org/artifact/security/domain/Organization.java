/**
 * 
 */
package org.artifact.security.domain;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.artifact.base.domain.IdEntity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * 部门实体类
 * <p>
 * 日期：2015年8月14日
 * 
 * @version 0.1
 * @author Netbug
 */
@SuppressWarnings("serial")
@Entity
@Table(name = "sec_organization")
public class Organization extends IdEntity {
	private String name;// 名称
	private String fullPath;// 全路径
	@JsonIgnoreProperties(value = { "childOrgList", "userList" })
	private Organization parentOrg;// 上级部门
	private List<Organization> childOrgList;// 下级部门
	@JsonIgnoreProperties(value = { "organization" })
	private List<User> userList;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "fullpath")
	public String getFullPath() {
		return fullPath;
	}

	public void setFullPath(String fullPath) {
		this.fullPath = fullPath;
	}

	@ManyToOne(cascade = CascadeType.REFRESH)
	@JoinColumn(name = "parentid")
	public Organization getParentOrg() {
		return parentOrg;
	}

	public void setParentOrg(Organization parentOrg) {
		this.parentOrg = parentOrg;
	}

	@OneToMany(mappedBy = "parentOrg", fetch = FetchType.LAZY, cascade = {
			CascadeType.REFRESH, CascadeType.REMOVE })
	public List<Organization> getChildOrgList() {
		return childOrgList;
	}

	public void setChildOrgList(List<Organization> childOrgList) {
		this.childOrgList = childOrgList;
	}

	@OneToMany(mappedBy = "organization", fetch = FetchType.LAZY, cascade = {
			CascadeType.REFRESH, CascadeType.REMOVE })
	public List<User> getUserList() {
		return userList;
	}

	public void setUserList(List<User> userList) {
		this.userList = userList;
	}

}
