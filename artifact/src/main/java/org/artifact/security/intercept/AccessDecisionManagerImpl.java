/**
 * 
 */
package org.artifact.security.intercept;

import java.util.Collection;
import java.util.Iterator;

import org.springframework.security.access.AccessDecisionManager;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.ConfigAttribute;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

/**
 * 验证当前用户是否有权限访问该请求
 * <p>
 * 日期：2015年8月26日
 * 
 * @version 0.1
 * @author Netbug
 */
@Component
public class AccessDecisionManagerImpl implements AccessDecisionManager {
	/**
	 * <p>
	 * 日期：2015年8月26日 Override
	 * 
	 * @param authentication
	 *            用户具有的权限
	 * @param object
	 * @param configAttributes
	 *            请求需要的权限
	 * @throws AccessDeniedException
	 * @throws InsufficientAuthenticationException
	 * @author Netbug
	 */
	public void decide(Authentication authentication, Object object,
			Collection<ConfigAttribute> configAttributes)
			throws AccessDeniedException, InsufficientAuthenticationException {
		if (configAttributes == null) {
			return;
		}
		Iterator<ConfigAttribute> iterator = configAttributes.iterator();
		while (iterator.hasNext()) {
			ConfigAttribute configAttribute = iterator.next();
			String needPermission = configAttribute.getAttribute();
			for (GrantedAuthority ga : authentication.getAuthorities()) {
				if (needPermission.contains((ga.getAuthority()))) {
					return;
				}
			}
		}
		throw new AccessDeniedException("权限不足");
	}

	public boolean supports(ConfigAttribute attribute) {
		return true;
	}

	public boolean supports(Class<?> clazz) {
		return true;
	}

}
