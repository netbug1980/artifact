/**
 * 
 */
package org.artifact.security.dao;

import java.util.List;

import org.artifact.base.condition.BaseCondition;
import org.artifact.base.dao.BaseDao;
import org.artifact.security.domain.Role;
import org.springframework.stereotype.Repository;

/**
 * 角色持久化类
 * <p>
 * 日期：2015年8月26日
 * 
 * @version 0.1
 * @author Netbug
 */
@Repository
public class RoleDao extends BaseDao<Role> {
	@SuppressWarnings("unchecked")
	public List<Role> find() {
		BaseCondition condition = new BaseCondition();
		condition.setHql("from Role");
		return (List<Role>) this.find(condition);

	}
}
