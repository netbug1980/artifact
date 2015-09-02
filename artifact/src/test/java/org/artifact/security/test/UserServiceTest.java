package org.artifact.security.test;

import org.artifact.security.bean.UserBean;
import org.artifact.security.domain.Organization;
import org.artifact.security.domain.User;
import org.artifact.security.service.UserService;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * UserService测试类
 * <p>
 * 日期：2015年8月7日
 * 
 * @version 0.1
 * @author Netbug
 */
public class UserServiceTest extends BaseTest {
	private static final Logger logger = LoggerFactory
			.getLogger(UserServiceTest.class);
	private UserService userService = null;
	private User user = null;

	@Before
	public void testSaveOrUpdate() {
		userService = (UserService) ctx.getBean("userService");
		user = new User();
		user.setAccount("fuNetbugtest");
		user.setAge(25);
		user.setName("付磊森");
		user.setPassword("123456");
		Organization organization = new Organization();
		organization.setId(1);
		user.setOrganization(organization );
		try {
			userService.saveOrUpdate(user);
		} catch (Exception e) {
			logger.debug(e.getMessage(), e);
			logger.error(e.getMessage());
			Assert.assertTrue("新增用户失败", false);
		}
	}

	@Test
	public void testGetUserById() {
		try {
			userService.getUserById(user.getId());
		} catch (Exception e) {
			logger.debug(e.getMessage(), e);
			logger.error(e.getMessage());
			Assert.assertTrue("根据ID查询用户失败", false);
		}
	}

	@Test
	public void testFindUser() {
		try {
			user = userService.findUser(user.getAccount(), user.getPassword());
			System.out.println(user.getAge());
		} catch (Exception e) {
			logger.debug(e.getMessage(), e);
			logger.error(e.getMessage());
			Assert.assertTrue("根据账户、密码查询用户失败", false);
		}
	}

	@Test
	public void testFindUserWithSql() {
		try {
			UserBean userBean = userService.findUserWithSql(user.getAccount(),
					user.getPassword());
			System.out.println(userBean.getAge());
		} catch (Exception e) {
			logger.debug(e.getMessage(), e);
			logger.error(e.getMessage());
			Assert.assertTrue("根据账户、密码查询用户失败,通过SQl进行查询", false);
		}
	}

	@Test
	public void testFind() {
		try {
			userService.find();
		} catch (Exception e) {
			logger.debug(e.getMessage(), e);
			logger.error(e.getMessage());
			Assert.assertTrue("查询用户失败", false);
		}
	}

	@After
	public void testDeleteUserById() {
		try {
			userService.deleteUserById(user.getId());
		} catch (Exception e) {
			logger.debug(e.getMessage(), e);
			logger.error(e.getMessage());
			Assert.assertTrue("根据ID删除用户失败", false);
		}
	}
}
