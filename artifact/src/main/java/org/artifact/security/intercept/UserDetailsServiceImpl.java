/**
 * 
 */
package org.artifact.security.intercept;

import org.artifact.security.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

/**
 * 查询当前用户所具有的权限
 * <p>
 * 日期：2015年8月26日
 * 
 * @version 0.1
 * @author Netbug
 */
@Component
public class UserDetailsServiceImpl implements UserDetailsService {
	@Autowired
	private UserService userService;

	public UserDetails loadUserByUsername(String username)
			throws UsernameNotFoundException {
		return userService.findUser(username, null);
	}

}
