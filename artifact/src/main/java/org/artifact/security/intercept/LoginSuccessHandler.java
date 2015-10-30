package org.artifact.security.intercept;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;

import org.artifact.security.domain.User;

/**
 * 用于登陆成功后返回自定义数据，该接口的实现类须在spring-security.xml中进行配置才能生效
 * <p>
 * 日期：2015年10月30日
 * 
 * @version 0.1
 * @author Netbug
 */
public interface LoginSuccessHandler {
	/**
	 * 
	 * <p>
	 * 日期：2015年10月30日
	 * 
	 * @param request
	 * @param user
	 *            当前登录用户信息
	 * @param result
	 *            result的Key建议将实现类路径作为前缀，避免冲突
	 * @author Netbug
	 */
	public void buildLoginSuccessResult(HttpServletRequest request, User user,
			HashMap<String, Object> result);
}
