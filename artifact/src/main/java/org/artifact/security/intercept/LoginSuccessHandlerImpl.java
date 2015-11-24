package org.artifact.security.intercept;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.artifact.base.util.JsonResult;
import org.artifact.base.util.JsonUtil;
import org.artifact.base.util.RequestUtil;
import org.artifact.security.domain.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

/**
 * 登陆成功Handler
 * <p>
 * 日期：2015年9月6日
 * 
 * @version 0.1
 * @author Netbug
 */
public class LoginSuccessHandlerImpl implements AuthenticationSuccessHandler {

	private List<LoginSuccessHandler> loginSuccessHandlerList;

	public void onAuthenticationSuccess(HttpServletRequest request,
			HttpServletResponse response, Authentication authentication)
			throws IOException, ServletException {
		RequestUtil.traverseSession(request);
		response.setCharacterEncoding("UTF-8");
		response.setContentType("application/json;charset=UTF-8");
		HashMap<String, Object> result = new HashMap<String, Object>();
		User user = (User) authentication.getPrincipal();
		result.put("CUR_USER", user);
		for (LoginSuccessHandler loginSuccessHandler : loginSuccessHandlerList) {
			loginSuccessHandler.buildLoginSuccessResult(request, user, result);
		}

		response.getWriter().write(JsonUtil.stringify(new JsonResult(result)));
		response.getWriter().flush();
	}

	public void setLoginSuccessHandlerList(
			List<LoginSuccessHandler> loginSuccessHandlerList) {
		if (loginSuccessHandlerList == null) {
			loginSuccessHandlerList = new ArrayList<LoginSuccessHandler>();
		}
		this.loginSuccessHandlerList = loginSuccessHandlerList;
	}
}
