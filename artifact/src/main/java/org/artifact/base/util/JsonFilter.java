/**
 * 
 */
package org.artifact.base.util;

/**
 * 调用<b>mapper.addMixIn(target, mixinSource);</b>方法动态过滤Json属性
 * <p>
 * 日期：2015年8月25日
 * 
 * @version 0.1
 * @author Netbug
 */
public class JsonFilter {
	Class<?> target;// 待过滤的目标对象
	Class<?> mixinSource; // 利用Java动态代理机制，自动生成带有“JsonIgnoreProperties”注解的接口

	/**
	 * @param target2
	 * @param mixinSource2
	 */
	public JsonFilter(Class<?> target, Class<?> mixinSource) {
		this.target = target;
		this.mixinSource = mixinSource;
	}

	public Class<?> getMixinSource() {
		return mixinSource;
	}

	public void setMixinSource(Class<?> mixinSource) {
		this.mixinSource = mixinSource;
	}

	public Class<?> getTarget() {
		return target;
	}

	public void setTarget(Class<?> target) {
		this.target = target;
	}

}
