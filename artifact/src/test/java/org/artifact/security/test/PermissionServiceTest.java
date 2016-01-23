package org.artifact.security.test;

import java.util.List;

import org.artifact.security.domain.Permission;
import org.artifact.security.service.PermissionService;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * PermissionService测试类
 * <p>
 * 日期：2015年8月7日
 * 
 * @version 0.1
 * @author Netbug
 */
public class PermissionServiceTest extends BaseTest {
	private static final Logger logger = LoggerFactory
			.getLogger(PermissionServiceTest.class);
	private PermissionService permissionService = null;

	@Before
	public void testInit() {
		permissionService = (PermissionService) ctx
				.getBean("permissionService");
	}

	@Test
	public void testFindByRoleIds() {
		try {
			Integer[] roleIds = { 1, 2 };
			List<Permission> aa = permissionService.findByRoleIds(roleIds);
			System.out.println(aa.size());
		} catch (Exception e) {
			logger.debug(e.getMessage(), e);
			logger.error(e.getMessage());
			Assert.assertTrue("根据角色ID数组获取权限列表", false);
		}
	}
}
