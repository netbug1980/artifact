package org.artifact.security.dao;

import java.util.List;

import org.artifact.base.condition.BaseCondition;
import org.artifact.base.dao.BaseDao;
import org.artifact.security.condition.OrganizationCondition;
import org.artifact.security.domain.Organization;
import org.springframework.stereotype.Repository;

/**
 * 部门持久化类
 * <p>
 * 日期：2015年8月6日
 * 
 * @version 0.1
 * @author Netbug
 */
@Repository
public class OrganizationDao extends BaseDao<Organization> {

	/**
	 * 查询所有部门
	 * <p>
	 * 日期：2015年8月6日
	 * 
	 * @return list Or null
	 * @author Netbug
	 */
	@SuppressWarnings("unchecked")
	public List<Organization> find() {
		BaseCondition condition = new BaseCondition();
		condition.setHql("from Organization");
		return (List<Organization>) super.find(condition);

	}

	/**
	 * 批量更新部门全路径
	 * <p>
	 * 日期：2015年8月18日
	 * 
	 * @param organization
	 * @return
	 * @author Netbug
	 */
	public void updateFullPath(Organization organization) {
		String fullPath = "/" + organization.getName();
		OrganizationCondition condition = new OrganizationCondition();
		String oldFullPath = organization.getFullPath();
		if (organization.getParentOrg() != null) {
			Integer parentId = organization.getParentOrg().getId();
			if (parentId != null) {
				Organization parentOrg = super.getEntity(parentId,
						Organization.class);
				if (parentOrg != null) {
					fullPath = parentOrg.getFullPath() + fullPath;
				}
			}
		}
		condition.setFullPath(fullPath);
		condition.setOldFullPath(oldFullPath);
		condition.setSql("UPDATE sec_organization "
				+ "SET fullpath=REPLACE(fullpath,:oldFullPath,:fullPath) "
				+ "WHERE fullpath LIKE CONCAT(:oldFullPath,'%')");
		// TODO Netbug 注意此处为SQL语句，并且存在部门重名进而导致替换后的全路径不准确的BUG
		super.updateOrDelete(condition);
		organization.setFullPath(fullPath);
	}
}
