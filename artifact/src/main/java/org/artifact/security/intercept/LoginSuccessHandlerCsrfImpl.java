package org.artifact.security.intercept;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;

import org.artifact.security.domain.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.stereotype.Component;

/**
 * 登陆成功后返回CsrfToken的信息
 * <p>
 * 日期：2015年10月30日
 * 
 * @version 0.1
 * @author Netbug
 */
@Component
public class LoginSuccessHandlerCsrfImpl implements LoginSuccessHandler {
	private static final Logger logger = LoggerFactory
			.getLogger(LoginSuccessHandlerCsrfImpl.class);

	public void buildLoginSuccessResult(HttpServletRequest request, User user,
			HashMap<String, Object> result) {

		try {
			CsrfToken csrfToken = (CsrfToken) request.getSession()
					.getAttribute("CSRF_TOKEN");
			if (csrfToken != null) {
				result.put("CSRF_TOKEN", csrfToken);
			}
		} catch (Exception e) {
			logger.warn("登陆成功后返回CsrfToken的信息异常", e);
		}

	}
}
