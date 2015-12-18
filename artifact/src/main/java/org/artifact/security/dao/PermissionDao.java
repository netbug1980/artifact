/**
 * 
 */
package org.artifact.security.dao;

import java.util.List;

import org.artifact.base.condition.BaseCondition;
import org.artifact.base.dao.BaseDao;
import org.artifact.security.domain.Permission;
import org.springframework.stereotype.Repository;

/**
 * 资源持久化类
 * <p>
 * 日期：2015年8月26日
 * 
 * @version 0.1
 * @author Netbug
 */
@Repository
public class PermissionDao extends BaseDao<Permission> {
	@SuppressWarnings("unchecked")
	public List<Permission> find() {
		BaseCondition condition = new BaseCondition();
		condition.setHql("from Permission");
		return (List<Permission>) this.find(condition);

	}

	/**
	 * 根据角色ID数组获取权限列表
	 * <p>
	 * 日期：2015年12月18日
	 * 
	 * @param condition
	 * @return
	 * @author Netbug
	 */
	@SuppressWarnings("unchecked")
	public List<Permission> findByRoleIds(BaseCondition condition) {
		condition
				.setHql("select p from RolePermission rp inner join rp.permission p on rp.role.id in (:roleIds)");
		return (List<Permission>) super.find(condition);
	}
}
