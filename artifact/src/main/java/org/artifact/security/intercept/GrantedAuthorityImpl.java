/**
 * 
 */
package org.artifact.security.intercept;

import org.springframework.security.core.GrantedAuthority;

/**
 * 用户权限封装对象
 * <p>
 * 日期：2015年8月26日
 * 
 * @version 0.1
 * @author Netbug
 */
public class GrantedAuthorityImpl implements GrantedAuthority {
	private static final long serialVersionUID = 1L;

	public GrantedAuthorityImpl(String authority) {
		this.authority = authority;
	}

	private String authority;

	public String getAuthority() {
		return authority;
	}

	public void setAuthority(String authority) {
		this.authority = authority;
	}

}
