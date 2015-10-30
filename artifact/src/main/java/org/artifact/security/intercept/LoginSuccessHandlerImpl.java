package org.artifact.security.intercept;

import java.io.IOException;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.artifact.base.util.JsonResult;
import org.artifact.base.util.JsonUtil;
import org.artifact.base.util.RequestUtil;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.stereotype.Component;

/**
 * 登陆成功Handler
 * <p>
 * 日期：2015年9月6日
 * 
 * @version 0.1
 * @author Netbug
 */
@Component
public class LoginSuccessHandlerImpl implements AuthenticationSuccessHandler {

	public void onAuthenticationSuccess(HttpServletRequest request,
			HttpServletResponse response, Authentication authentication)
			throws IOException, ServletException {
		RequestUtil.traverseSession(request);
		response.setCharacterEncoding("UTF-8");
		response.setContentType("application/json;charset=UTF-8");
		HashMap<String, Object> result = new HashMap<String, Object>();
		CsrfToken csrfToken = (CsrfToken) request.getSession().getAttribute(
				"CSRF_TOKEN");
		if (csrfToken != null) {
			result.put("CSRF_TOKEN", csrfToken);
		}
		response.getWriter().write(JsonUtil.stringify(new JsonResult(result)));
		response.getWriter().flush();
	}

}
