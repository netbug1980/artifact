package org.artifact.security.intercept;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.artifact.base.util.JsonResult;
import org.artifact.base.util.JsonUtil;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.csrf.CsrfException;
import org.springframework.stereotype.Component;

/**
 * 权限拒绝Handler
 * <p>
 * 日期：2015年10月28日
 * 
 * @version 0.1
 * @author Netbug
 */
@Component
public class AccessDeniedHandlerImpl implements AccessDeniedHandler {

	public void handle(HttpServletRequest request,
			HttpServletResponse response,
			AccessDeniedException accessDeniedException) throws IOException,
			ServletException {
		JsonResult result = JsonResult.ACCESS_DENIED_RESULT;
		if (accessDeniedException instanceof CsrfException) {
			result = JsonResult.ACCESS_DENIED_CSRF_RESULT;
		}
		response.setCharacterEncoding("UTF-8");
		response.setContentType("application/json;charset=UTF-8");
		response.getWriter().write(JsonUtil.stringify(result));
		response.getWriter().flush();
	}

}
