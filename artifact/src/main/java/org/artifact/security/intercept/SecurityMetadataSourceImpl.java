/**
 * 
 */
package org.artifact.security.intercept;

import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.artifact.security.domain.Permission;
import org.artifact.security.domain.RolePermission;
import org.artifact.security.service.PermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.ConfigAttribute;
import org.springframework.security.access.SecurityConfig;
import org.springframework.security.web.FilterInvocation;
import org.springframework.security.web.access.intercept.FilterInvocationSecurityMetadataSource;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.stereotype.Component;

/**
 * 获得当前请求对应的权限
 * <p>
 * 日期：2015年8月26日
 * 
 * @version 0.1
 * @author Netbug
 */
@Component
public class SecurityMetadataSourceImpl implements
		FilterInvocationSecurityMetadataSource {

	private static LinkedHashMap<RequestMatcher, Collection<ConfigAttribute>> sourceMap = null;

	@Autowired
	private PermissionService permissionService;

	public Collection<ConfigAttribute> getAttributes(Object object)
			throws IllegalArgumentException {
		HttpServletRequest request = ((FilterInvocation) object).getRequest();
		if (null == sourceMap) {
			initSourceMap();
		}
		for (Map.Entry<RequestMatcher, Collection<ConfigAttribute>> entry : sourceMap
				.entrySet()) {
			if (entry.getKey().matches(request)) {
				return entry.getValue();
			}
		}
		return null;
	}

	public Collection<ConfigAttribute> getAllConfigAttributes() {
		return null;
	}

	public boolean supports(Class<?> clazz) {
		return true;
	}

	/**
	 * 初始查询所有的资源权限对应关系
	 * <p>
	 * 日期：2015年8月26日
	 * 
	 * @author Netbug
	 */
	private void initSourceMap() {
		sourceMap = new LinkedHashMap<RequestMatcher, Collection<ConfigAttribute>>();
		for (Permission permission : permissionService.find()) {
			Collection<ConfigAttribute> configAttributes = new ArrayList<ConfigAttribute>();
			for (RolePermission rolePermission : permission
					.getRolePermissionList()) {
				configAttributes.add(new SecurityConfig(rolePermission
						.getRole().getName()));
			}
			AntPathRequestMatcher matcher = new AntPathRequestMatcher(
					permission.getUrl());
			if (sourceMap.containsKey(matcher)) {
				sourceMap.get(matcher).addAll(configAttributes);
			} else {
				sourceMap.put(matcher, configAttributes);
			}
		}
	}
}
