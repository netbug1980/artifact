package org.artifact.security.test;

import java.util.ArrayList;
import java.util.List;

import org.artifact.base.util.JsonUtil;
import org.artifact.security.domain.Organization;
import org.artifact.security.domain.User;
import org.artifact.security.service.OrganizationService;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * OrganizationService测试类
 * <p>
 * 日期：2015年8月7日
 * 
 * @version 0.1
 * @author Netbug
 */
public class OrganizationServiceTest extends BaseTest {
	private static final Logger logger = LoggerFactory
			.getLogger(OrganizationServiceTest.class);
	private OrganizationService organizationService = null;
	private Organization organization = null;

	@Before
	public void testSaveOrUpdate() {
		organizationService = (OrganizationService) ctx
				.getBean("organizationService");
		organization = new Organization();
		organization.setName("CDV");
		organization.setFullPath("/CDV");
		List<User> userList = new ArrayList<User>();
		User user = new User();
		user.setAccount("fuNetbug");
		user.setAge(25);
		user.setName("付磊森");
		user.setPassword("123456");
		user.setOrganization(organization);
		userList.add(user);
		organization.setUserList(userList);
		try {
			organizationService.saveOrUpdate(organization);
		} catch (Exception e) {
			logger.debug(e.getMessage(), e);
			logger.error(e.getMessage());
			Assert.assertTrue("新增部门失败", false);
		}
	}

	@Test
	public void testGetOrganizationById() {
		try {
			organizationService.getOrganizationById(organization.getId());
			System.out.println(JsonUtil.stringify(organization));
		} catch (Exception e) {
			logger.debug(e.getMessage(), e);
			logger.error(e.getMessage());
			Assert.assertTrue("根据ID查询部门失败", false);
		}
	}

	@Test
	public void testFind() {
		try {
			organizationService.find();
		} catch (Exception e) {
			logger.debug(e.getMessage(), e);
			logger.error(e.getMessage());
			Assert.assertTrue("查询部门失败", false);
		}
	}

	@After
	public void testDeleteOrganizationById() {
		try {
			organizationService.deleteOrganizationById(organization.getId());
		} catch (Exception e) {
			logger.debug(e.getMessage(), e);
			logger.error(e.getMessage());
			Assert.assertTrue("根据ID删除部门失败", false);
		}
	}
}
