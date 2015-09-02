package org.artifact.base.dao;

import java.util.Collection;

import org.artifact.base.condition.BaseCondition;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.transform.Transformers;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.support.HibernateDaoSupport;
import org.springframework.util.StringUtils;

/**
 * 持久化基础类。</br> 所有持久化类需要继承该类，进而操作数据库。
 * <p>
 * 日期：2015年8月6日
 * 
 * @version 0.1
 * @author Netbug
 */
public class BaseDao<T> extends HibernateDaoSupport {
	private static final Logger logger = LoggerFactory.getLogger(BaseDao.class);

	@Autowired
	public void setSessionFactoryBase(SessionFactory sessionFactory) {
		super.setSessionFactory(sessionFactory);
	}

	public BaseDao() {

	}

	public Session getSession() {
		return super.currentSession();
	}

	/**
	 * 增删改查之增改。</br>根据主键存在与否自动进行新增或修改操作。
	 * <p>
	 * 日期：2015年8月6日
	 * 
	 * @param obj
	 * @author Netbug
	 */
	public void saveOrUpdate(Object o) {
		this.getHibernateTemplate().saveOrUpdate(o);
	}

	/**
	 * 增删改查之删。</br>根据主键删除数据
	 * <p>
	 * 日期：2015年8月6日
	 * 
	 * @param id
	 *            数据主键
	 * @param clazz
	 *            类
	 * @author Netbug
	 */
	public void delete(Integer id, Class<?> clazz) {
		Object obj = this.loadEntity(id, clazz);
		this.getHibernateTemplate().delete(obj);

	}

	/**
	 * 增删改查之查。</br>根据主键查询数据
	 * <p>
	 * 日期：2015年8月6日
	 * 
	 * @param id
	 *            数据主键
	 * @param clazz
	 *            类
	 * @author Netbug
	 */
	@SuppressWarnings("unchecked")
	public T getEntity(Integer id, Class<?> clazz) {
		return (T) this.getHibernateTemplate().get(clazz, id);
	}

	/**
	 * 增删改查之查。<b>延时加载</b></br>根据主键查询数据
	 * <p>
	 * 日期：2015年8月6日
	 * 
	 * @param id
	 *            数据主键
	 * @param clazz
	 *            类
	 * @author Netbug
	 */
	@SuppressWarnings("unchecked")
	public T loadEntity(Integer id, Class<?> clazz) {
		return (T) this.getHibernateTemplate().load(clazz, id);
	}

	/**
	 * 增删改查之删改。</br>自定义更新删除语句
	 * <p>
	 * 日期：2015年8月18日
	 * 
	 * @param condition
	 * @return 更新或删除数量
	 * @author Netbug
	 */
	public int updateOrDelete(BaseCondition condition) {
		Query query = this.createQuery(condition);
		if (query != null) {
			return query.executeUpdate();
		}
		return 0;
	}

	/**
	 * 将对象从session中清除
	 * <p>
	 * 日期：2015年8月18日
	 * 
	 * @param object
	 * @author Netbug
	 */
	public void evict(Object object) {
		this.getSession().evict(object);
	}

	/**
	 * 增删改查之查。</br>根据搜索条件查询数据集
	 * <p>
	 * 日期：2015年8月6日
	 * 
	 * @param condition
	 * @return Collection Or null
	 * @author Netbug
	 */
	public Collection<?> find(BaseCondition condition) {
		Collection<?> result = null;
		Query query = this.createQuery(condition);
		if (query != null) {
			result = query.list();
		}
		return result;
	}

	/**
	 * 增删改查之查。</br>根据搜索条件查询数据
	 * <p>
	 * 日期：2015年8月6日
	 * 
	 * @param condition
	 * @return object Or null
	 * @author Netbug
	 */
	public Object findUnique(BaseCondition condition) {
		Object result = null;
		Query query = this.createQuery(condition);
		if (query != null) {
			result = query.uniqueResult();
		}
		return result;
	}

	/**
	 * 根据搜索条件创建Query
	 * <p>
	 * 日期：2015年8月6日
	 * 
	 * @param condition
	 * @return query Or null
	 * @author Netbug
	 */
	private Query createQuery(BaseCondition condition) {
		Query query = null;
		if (condition != null) {
			if (StringUtils.hasLength(condition.getHql())) {
				query = this.getSession().createQuery(condition.getHql());// 创建HqlQuery
			}

			if (query == null && StringUtils.hasLength(condition.getSql())) {
				query = this.getSession().createSQLQuery(condition.getSql());// 创建SqlQuery
				if (StringUtils.hasLength(condition.getClassNameOfBean())) {
					Class<?> bean = null;
					try {
						bean = Class.forName(condition.getClassNameOfBean());
					} catch (ClassNotFoundException e) {
						logger.debug(e.getMessage(), e);
						logger.error(e.getMessage());
					}
					if (bean != null) {
						query.setResultTransformer(Transformers
								.aliasToBean(bean)); // 设置SqlQuery结果映射
					}
				}
			}
			if (query != null) {
				query.setProperties(condition); // 通过占位符写入参数
				if (condition.getLimit() > 0) {
					query.setFirstResult(condition.getStart()).setMaxResults(
							condition.getLimit()); // 分页查询
				}
			}
		}
		return query;
	}
}
