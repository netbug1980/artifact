/**
 * 
 */
package org.artifact.security.service;

import java.util.List;

import org.artifact.security.dao.PermissionDao;
import org.artifact.security.domain.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 资源业务逻辑类
 * <p>
 * 日期：2015年8月26日
 * 
 * @version 0.1
 * @author Netbug
 */
@Service
public class PermissionService {
	@Autowired
	private PermissionDao permissionDao;

	public List<Permission> find() {
		return permissionDao.find();

	}

	public void saveOrUpdate(Permission permission) {
		permissionDao.saveOrUpdate(permission);
	}

	public Permission getPermissionById(Integer id) {
		return permissionDao.getEntity(id, Permission.class);
	}

	public void deletePermissionById(Integer id) {
		permissionDao.delete(id, Permission.class);
	}
}
