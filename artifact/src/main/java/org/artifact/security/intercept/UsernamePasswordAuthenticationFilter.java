package org.artifact.security.intercept;

import java.io.IOException;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.artifact.base.util.JsonUtil;
import org.artifact.base.util.RequestUtil;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

/**
 * 登陆验证及权限拦截器
 * <p>
 * 日期：2015年10月28日
 * 
 * @version 0.1
 * @author Netbug
 */
public class UsernamePasswordAuthenticationFilter extends
		AbstractAuthenticationProcessingFilter {

	protected UsernamePasswordAuthenticationFilter() {
		super(new AntPathRequestMatcher("/login", "POST"));
	}

	@Override
	public Authentication attemptAuthentication(HttpServletRequest request,
			HttpServletResponse response) throws AuthenticationException,
			IOException, ServletException {
		String username = "";
		String password = "";
		boolean requestType = RequestUtil.isXMLHttpRequest(request);
		if (requestType) {// ajax登陆
			@SuppressWarnings("unchecked")
			HashMap<String, String> map = JsonUtil.parse(
					request.getInputStream(), HashMap.class);
			username = map.get("username");
			password = map.get("password");

		} else {// form表单登陆
			username = request.getParameter("username");
			password = request.getParameter("password");
		}

		username = username.trim();

		UsernamePasswordAuthenticationToken authRequest = new UsernamePasswordAuthenticationToken(
				username, password);

		authRequest.setDetails(authenticationDetailsSource
				.buildDetails(request));

		return this.getAuthenticationManager().authenticate(authRequest);
	}

}
