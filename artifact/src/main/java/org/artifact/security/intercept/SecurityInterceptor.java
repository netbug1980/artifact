/**
 * 
 */
package org.artifact.security.intercept;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import org.springframework.security.access.SecurityMetadataSource;
import org.springframework.security.access.intercept.AbstractSecurityInterceptor;
import org.springframework.security.access.intercept.InterceptorStatusToken;
import org.springframework.security.web.FilterInvocation;

/**
 * 请求权限验证拦截器
 * <p>
 * 日期：2015年8月26日
 * 
 * @version 0.1
 * @author Netbug
 */
public class SecurityInterceptor extends AbstractSecurityInterceptor implements
		Filter {

	private SecurityMetadataSourceImpl securityMetadataSource;

	@Override
	public Class<?> getSecureObjectClass() {
		return FilterInvocation.class;
	}

	@Override
	public SecurityMetadataSource obtainSecurityMetadataSource() {
		return this.securityMetadataSource;
	}

	public SecurityMetadataSourceImpl getSecurityMetadataSource() {
		return securityMetadataSource;
	}

	public void setSecurityMetadataSource(
			SecurityMetadataSourceImpl securityMetadataSource) {
		this.securityMetadataSource = securityMetadataSource;
	}

	public void init(FilterConfig filterConfig) throws ServletException {

	}

	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
		FilterInvocation fi = new FilterInvocation(request, response, chain);
		InterceptorStatusToken token = null;
		token = super.beforeInvocation(fi);
		try {
			fi.getChain().doFilter(fi.getRequest(), fi.getResponse());
		} finally {
			super.afterInvocation(token, null);
		}
	}

	public void destroy() {

	}

}
