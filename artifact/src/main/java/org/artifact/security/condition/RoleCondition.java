/**
 * 
 */
package org.artifact.security.condition;

import org.artifact.base.condition.BaseCondition;

/**
 * 角色查询条件封装类
 * <p>
 * 日期：2015年8月7日
 * 
 * @version 0.1
 * @author Netbug
 */
public class RoleCondition extends BaseCondition {
	private String name;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

}
