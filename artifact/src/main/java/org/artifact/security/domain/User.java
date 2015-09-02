package org.artifact.security.domain;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.artifact.base.domain.IdEntity;
import org.artifact.security.intercept.GrantedAuthorityImpl;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * 用户实体类
 * <p>
 * 日期：2015年8月6日
 * 
 * @version 0.1
 * @author Netbug
 */
@SuppressWarnings("serial")
@Entity
@Table(name = "sec_user")
public class User extends IdEntity implements UserDetails {
	private String name;// 名称
	private String account;// 账号
	private String password;// 密码
	private Integer age;// 年龄
	@JsonIgnoreProperties(value = { "childOrgList", "userList" })
	private Organization organization;// 部门
	@JsonIgnoreProperties(value = { "user" })
	private List<UserRole> userRoleList;

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

	@JsonIgnore
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

	@ManyToOne(cascade = CascadeType.REFRESH)
	@JoinColumn(name = "orgid", nullable = false)
	public Organization getOrganization() {
		return organization;
	}

	public void setOrganization(Organization organization) {
		this.organization = organization;
	}

	@OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = {
			CascadeType.REFRESH, CascadeType.REMOVE })
	public List<UserRole> getUserRoleList() {
		return userRoleList;
	}

	public void setUserRoleList(List<UserRole> userRoleList) {
		this.userRoleList = userRoleList;
	}

	/**
	 * 拥有的权限集合
	 */
	@Transient
	@JsonIgnore
	public Collection<? extends GrantedAuthority> getAuthorities() {
		Set<GrantedAuthority> authSet = new HashSet<GrantedAuthority>();
		for (UserRole userRole : userRoleList) {
			authSet.add(new GrantedAuthorityImpl(userRole.getRole().getName()));
		}
		return authSet;
	}

	@Transient
	@JsonIgnore
	public String getUsername() {
		return this.name;
	}

	/**
	 * 是否过期
	 */
	@Transient
	@JsonIgnore
	public boolean isAccountNonExpired() {
		return true;
	}

	/**
	 * 是否被锁
	 */
	@Transient
	@JsonIgnore
	public boolean isAccountNonLocked() {
		return true;
	}

	/**
	 * 证书是否过期
	 */
	@Transient
	@JsonIgnore
	public boolean isCredentialsNonExpired() {
		return true;
	}

	/**
	 * 是否禁用
	 */
	@Transient
	@JsonIgnore
	public boolean isEnabled() {
		return true;
	}

	@Override
	public boolean equals(Object rhs) {
		if (rhs instanceof User) {
			return this.account.equals(((User) rhs).account);
		}
		return false;
	}

	@Override
	public int hashCode() {
		return this.account.hashCode();
	}

}
