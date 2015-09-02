/**
 * 
 */
package org.artifact.security.condition;

import org.artifact.base.condition.BaseCondition;

/**
 * 部门查询条件封装类
 * <p>
 * 日期：2015年8月7日
 * 
 * @version 0.1
 * @author Netbug
 */
public class OrganizationCondition extends BaseCondition {
	private Integer id;
	private String fullPath;
	private String oldFullPath;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getFullPath() {
		return fullPath;
	}

	public void setFullPath(String fullPath) {
		this.fullPath = fullPath;
	}

	public String getOldFullPath() {
		return oldFullPath;
	}

	public void setOldFullPath(String oldFullPath) {
		this.oldFullPath = oldFullPath;
	}

}
