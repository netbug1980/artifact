package org.artifact.security.intercept;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.artifact.base.util.JsonResult;
import org.artifact.base.util.JsonUtil;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

/**
 * 登陆失败Handler
 * <p>
 * 日期：2015年9月6日
 * 
 * @version 0.1
 * @author Netbug
 */

@Component
public class LoginFailureHandlerImpl implements
		AuthenticationFailureHandler {

	public void onAuthenticationFailure(HttpServletRequest request,
			HttpServletResponse response, AuthenticationException exception)
			throws IOException, ServletException {
		JsonResult result = JsonResult.LOGIN_FAILURE_RESULT;
		if (exception instanceof InternalAuthenticationServiceException) { // 用户不存在
			result = JsonResult.LOGIN_FAILURE_NOUSER_RESULT;
		} else if (exception instanceof BadCredentialsException) {// 密码不正确
			result = JsonResult.LOGIN_FAILURE_ERRPASSORD_RESULT;
		}
		response.setCharacterEncoding("UTF-8");
		response.setContentType("application/json;charset=UTF-8");
		response.getWriter().write(JsonUtil.stringify(result));
		response.getWriter().flush();
	}

}
