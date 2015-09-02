package org.artifact.base.condition;

/**
 * 搜索条件基础类
 * <p>
 * 日期：2015年8月6日
 * 
 * @version 0.1
 * @author Netbug
 */
public class BaseCondition {
	private int start = 0;
	private int limit = -1;
	private String hql;
	private String sql;
	private String classNameOfBean; // 查询结果封装对象className，需要支持序列化

	public int getStart() {
		return start;
	}

	public void setStart(int start) {
		this.start = start;
	}

	public int getLimit() {
		return limit;
	}

	public void setLimit(int limit) {
		this.limit = limit;
	}

	public String getHql() {
		return hql;
	}

	public void setHql(String hql) {
		this.hql = hql;
	}

	public String getSql() {
		return sql;
	}

	public void setSql(String sql) {
		this.sql = sql;
	}

	public String getClassNameOfBean() {
		return classNameOfBean;
	}

	public void setClassNameOfBean(String classNameOfBean) {
		this.classNameOfBean = classNameOfBean;
	}
}
