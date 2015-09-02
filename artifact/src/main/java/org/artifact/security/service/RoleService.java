/**
 * 
 */
package org.artifact.security.service;

import java.util.List;

import org.artifact.security.dao.RoleDao;
import org.artifact.security.domain.Role;
import org.artifact.security.domain.RolePermission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 角色业务逻辑类
 * <p>
 * 日期：2015年8月26日
 * 
 * @version 0.1
 * @author Netbug
 */
@Service
public class RoleService {
	@Autowired
	private RoleDao roleDao;

	public List<Role> find() {
		return roleDao.find();
	}

	public void saveOrUpdate(Role role) {
		this.saveOrUpdate(role, false);
	}

	/**
	 * 新增或修改角色
	 * <p>
	 * 日期：2015年8月28日
	 * 
	 * @param role
	 * @param relatePermissionFlag
	 *            是否关联资源
	 * @author Netbug
	 */
	public void saveOrUpdate(Role role, boolean relatePermissionFlag) {
		roleDao.saveOrUpdate(role);
		if (relatePermissionFlag) {
			/**
			 * 移除旧的关联资源
			 */
			Role oldRole = this.getRoleById(role.getId());
			for (RolePermission rolePermission : oldRole
					.getRolePermissionList()) {
				this.roleDao.delete(rolePermission.getId(),
						RolePermission.class);
			}
			/**
			 * 添加新的关联资源
			 */
			for (RolePermission rolePermission : role.getRolePermissionList()) {
				rolePermission.setId(null);
				rolePermission.setRole(role);
				this.roleDao.saveOrUpdate(rolePermission);
			}
		}
	}

	public Role getRoleById(Integer id) {
		return roleDao.getEntity(id, Role.class);
	}

	public void deleteRoleById(Integer id) {
		roleDao.delete(id, Role.class);
	}
}
