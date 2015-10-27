package org.artifact.security.intercept;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.artifact.base.util.JsonResult;
import org.artifact.base.util.JsonUtil;
import org.artifact.base.util.RequestUtil;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.stereotype.Component;

/**
 * 登出成功Handler
 * <p>
 * 日期：2015年10月27日
 * 
 * @version 0.1
 * @author Netbug
 */
@Component
public class LogoutSuccessHandlerImpl implements LogoutSuccessHandler {

	public void onLogoutSuccess(HttpServletRequest request,
			HttpServletResponse response, Authentication authentication)
			throws IOException, ServletException {
		RequestUtil.traverseSession(request);
		response.setCharacterEncoding("UTF-8");
		response.setContentType("application/json;charset=UTF-8");
		response.getWriter().write(JsonUtil.stringify(new JsonResult("登出成功")));
		response.getWriter().flush();
	}

}
