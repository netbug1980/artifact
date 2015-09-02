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
}
