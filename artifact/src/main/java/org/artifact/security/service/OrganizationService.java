package org.artifact.security.service;

import java.util.List;

import org.artifact.security.dao.OrganizationDao;
import org.artifact.security.domain.Organization;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 部门业务逻辑类
 * <p>
 * 日期：2015年8月6日
 * 
 * @version 0.1
 * @author Netbug
 */
@Service
public class OrganizationService {
	@Autowired
	private OrganizationDao organizationDao;

	/**
	 * 新增或修改Organization
	 * <p>
	 * 日期：2015年8月6日
	 * 
	 * @param organization
	 * @author Netbug
	 */
	public void saveOrUpdate(Organization organization) {

		/**
		 * 维护fullPath；fullPath由部门名称、层级来维护
		 */
		if (organization.getId() == null) {
			String fullPath = "/" + organization.getName();
			if (organization.getParentOrg() != null) {
				Integer parentId = organization.getParentOrg().getId();
				if (parentId != null) {
					Organization parentOrg = organizationDao.getEntity(
							parentId, Organization.class);
					if (parentOrg != null) {
						fullPath = parentOrg.getFullPath() + fullPath;
					}

				}
			}
			organization.setFullPath(fullPath);
		} else {
			Organization oldOrg = organizationDao.getEntity(
					organization.getId(), Organization.class);
			organization.setFullPath(oldOrg.getFullPath());
			organization.setParentOrg(oldOrg.getParentOrg());
			organizationDao.evict(oldOrg);
			organizationDao.updateFullPath(organization);// 批量更新fullPath
		}
		organizationDao.saveOrUpdate(organization);

	}

	/**
	 * 根据主键获得Organization
	 * <p>
	 * 日期：2015年8月6日
	 * 
	 * @param id
	 * @return
	 * @author Netbug
	 */
	public Organization getOrganizationById(Integer id) {
		return organizationDao.getEntity(id, Organization.class);
	}

	/**
	 * 根据主键删除Organization
	 * <p>
	 * 日期：2015年8月6日
	 * 
	 * @param id
	 * @author Netbug
	 */
	public void deleteOrganizationById(Integer id) {
		organizationDao.delete(id, Organization.class);
	}

	/**
	 * 查询所有部门
	 * <p>
	 * 日期：2015年8月6日
	 * 
	 * @return list Or null
	 * @author Netbug
	 */
	public List<Organization> find() {
		return organizationDao.find();
	}

}
