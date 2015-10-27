package org.artifact.security.intercept;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.artifact.base.util.JsonResult;
import org.artifact.base.util.JsonUtil;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

/**
 * 验证异常处理实现
 * <p>
 * 日期：2015年10月27日
 * 
 * @version 0.1
 * @author Netbug
 */
@Component
public class AuthenticationEntryPointImpl implements AuthenticationEntryPoint {

	public void commence(HttpServletRequest request,
			HttpServletResponse response, AuthenticationException authException)
			throws IOException, ServletException {
		response.setCharacterEncoding("UTF-8");
		response.setContentType("application/json;charset=UTF-8");
		JsonResult result = JsonResult.LOGIN_FAILURE_NOTLOGIN_RESULT;
		response.getWriter().write(JsonUtil.stringify(result));
		response.getWriter().flush();
	}

}
