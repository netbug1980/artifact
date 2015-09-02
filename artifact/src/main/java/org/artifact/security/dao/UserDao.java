package org.artifact.security.dao;

import java.util.List;

import org.artifact.base.condition.BaseCondition;
import org.artifact.base.dao.BaseDao;
import org.artifact.security.bean.UserBean;
import org.artifact.security.condition.UserCondition;
import org.artifact.security.domain.User;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

/**
 * 用户持久化类
 * <p>
 * 日期：2015年8月6日
 * 
 * @version 0.1
 * @author Netbug
 */
@Repository
public class UserDao extends BaseDao<User> {
	/**
	 * 根据账号和密码获得User对象
	 * <p>
	 * 日期：2015年8月7日
	 * 
	 * @param condition
	 * @return user Or null
	 * @author Netbug
	 */
	public User findUser(UserCondition condition) {
		String hql = "from User where 1<>1 ";
		if (StringUtils.hasText(condition.getAccount())
				&& !StringUtils.hasText(condition.getPassword())) {
			hql = hql + "or account = :account ";
		}
		if (StringUtils.hasText(condition.getAccount())
				&& StringUtils.hasText(condition.getPassword())) {
			hql = hql + "or (account=:account and password=:password) ";
		}
		condition.setHql(hql);
		return (User) this.findUnique(condition);
	}

	/**
	 * 根据账号和姓名模糊搜索用户列表
	 * <p>
	 * 日期：2015年8月25日
	 * 
	 * @param condition
	 * @return
	 * @author Netbug
	 */
	@SuppressWarnings("unchecked")
	public List<User> findUsers(UserCondition condition) {
		condition.setHql(this.buildHql(condition));
		return (List<User>) this.find(condition);
	}

	/**
	 * 根据账号和姓名模糊搜索用户总数
	 * <p>
	 * 日期：2015年8月25日
	 * 
	 * @param condition
	 * @return
	 * @author Netbug
	 */
	public Long findUsersCount(UserCondition condition) {
		condition.setHql("select count(*) " + this.buildHql(condition));
		condition.setLimit(-1);
		return (Long) this.findUnique(condition);
	}

	/**
	 * 根据搜索条件拼接hql
	 * <p>
	 * 日期：2015年8月25日
	 * 
	 * @param condition
	 * @return
	 * @author Netbug
	 */
	private String buildHql(UserCondition condition) {
		String hql = "from User where 1=1 ";
		if (StringUtils.hasText(condition.getAccount())) {
			hql = hql + "and account like :account ";
		}
		if (StringUtils.hasText(condition.getName())) {
			hql = hql + "and name like :name ";
		}
		return hql;
	}

	/**
	 * 根据账号和密码获得User对象，通过SQL进行查询。
	 * <p>
	 * 日期：2015年8月7日
	 * 
	 * @param condition
	 * @return user Or null
	 * @author Netbug
	 */
	public UserBean findUserWithSql(BaseCondition condition) {
		condition
				.setSql("select u.name,u.account,u.password,u.age from sec_user u where u.account=:account and u.password=:password");
		condition.setClassNameOfBean(UserBean.class.getName());
		return (UserBean) this.findUnique(condition);
	}

	/**
	 * 查询所有用户
	 * <p>
	 * 日期：2015年8月6日
	 * 
	 * @return list Or null
	 * @author Netbug
	 */
	@SuppressWarnings("unchecked")
	public List<User> find() {
		BaseCondition condition = new BaseCondition();
		condition.setHql("from User");
		return (List<User>) this.find(condition);

	}
}
