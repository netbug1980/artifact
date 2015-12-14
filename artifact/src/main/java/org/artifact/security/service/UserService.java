package org.artifact.security.service;

import java.util.List;

import org.artifact.security.bean.UserBean;
import org.artifact.security.condition.UserCondition;
import org.artifact.security.dao.UserDao;
import org.artifact.security.domain.User;
import org.artifact.security.domain.UserRole;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * 用户业务逻辑类
 * <p>
 * 日期：2015年8月6日
 * 
 * @version 0.1
 * @author Netbug
 */
@Service
public class UserService {
	@Autowired
	private UserDao userDao;

	/**
	 * 新增或修改User
	 * <p>
	 * 日期：2015年8月28日
	 * 
	 * @param user
	 * @author Netbug
	 */
	public void saveOrUpdate(User user) {
		if (user.getId() != null) {
			User oldUser = userDao.getEntity(user.getId(), User.class);
			BeanUtils.copyProperties(user, oldUser, new String[] { "account",
					"password" });
			userDao.saveOrUpdate(oldUser);
		} else {
			BCryptPasswordEncoder pe = new BCryptPasswordEncoder();
			user.setPassword(pe.encode("123456"));
			userDao.saveOrUpdate(user);
		}
	}

	/**
	 * 更新用户密码
	 * <p>
	 * 日期：2015年12月13日
	 * 
	 * @param user
	 * @author Netbug
	 */
	public void updatePassword(UserCondition userCondition) {
		User oldUser = userDao.getEntity(userCondition.getId(), User.class);
		BCryptPasswordEncoder pe = new BCryptPasswordEncoder();
		oldUser.setPassword(pe.encode(userCondition.getPassword()));
	}

	/**
	 * 新增或修改User
	 * <p>
	 * 日期：2015年8月28日
	 * 
	 * @param user
	 * @param relateRoleFlag
	 *            是否关联角色
	 * @author Netbug
	 */
	public void saveOrUpdate(User user, boolean relateRoleFlag) {
		userDao.saveOrUpdate(user);
		if (relateRoleFlag) {
			/**
			 * 移除旧的关联角色
			 */
			User oldUser = this.getUserById(user.getId());
			for (UserRole userRole : oldUser.getUserRoleList()) {
				this.userDao.delete(userRole.getId(), UserRole.class);
			}
			/**
			 * 添加新的关联角色
			 */
			for (UserRole userRole : user.getUserRoleList()) {
				userRole.setId(null);
				userRole.setUser(user);
				this.userDao.saveOrUpdate(userRole);
			}
		}
	}

	/**
	 * 根据主键获得User
	 * <p>
	 * 日期：2015年8月6日
	 * 
	 * @param id
	 * @return
	 * @author Netbug
	 */
	public User getUserById(Integer id) {
		return userDao.getEntity(id, User.class);
	}

	/**
	 * 根据主键删除User
	 * <p>
	 * 日期：2015年8月6日
	 * 
	 * @param id
	 * @author Netbug
	 */
	public void deleteUserById(Integer id) {
		userDao.delete(id, User.class);
	}

	/**
	 * 根据账号和密码查询User
	 * <p>
	 * 日期：2015年8月6日
	 * 
	 * @param account
	 * @param password
	 * @return user Or null
	 * @author Netbug
	 */
	public User findUser(String account, String password) {
		UserCondition condition = new UserCondition();
		condition.setAccount(account);
		condition.setPassword(password);
		return userDao.findUser(condition);
	}

	/**
	 * 根据条件搜索用户列表
	 * <p>
	 * 日期：2015年8月25日
	 * 
	 * @param condition
	 * @return
	 * @author Netbug
	 */
	public List<User> findUsers(UserCondition condition) {
		return userDao.findUsers(condition);
	}

	/**
	 * 根据条件搜索用户总数
	 * <p>
	 * 日期：2015年8月25日
	 * 
	 * @param condition
	 * @return
	 * @author Netbug
	 */
	public Long findUsersCount(UserCondition condition) {
		return userDao.findUsersCount(condition);
	}

	/**
	 * 根据账号和密码查询User,通过SQL进行查询
	 * <p>
	 * 日期：2015年8月7日
	 * 
	 * @param account
	 * @param password
	 * @return user Or null
	 * @author Netbug
	 */
	public UserBean findUserWithSql(String account, String password) {
		UserCondition condition = new UserCondition();
		condition.setAccount(account);
		condition.setPassword(password);
		return userDao.findUserWithSql(condition);
	}

	/**
	 * 查询所有用户
	 * <p>
	 * 日期：2015年8月6日
	 * 
	 * @return list Or null
	 * @author Netbug
	 */
	public List<User> find() {
		return userDao.find();
	}

}
