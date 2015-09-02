/**
 * 
 */
package org.artifact.base.util;

import java.lang.reflect.Method;

import org.aspectj.lang.JoinPoint;

/**
 * Aspect工具类
 * <p>
 * 日期：2015年8月20日
 * 
 * @version 0.1
 * @author Netbug
 */
public class AspectUtil {
	/**
	 * 从JoinPoint获取Method
	 * <p>
	 * 日期：2015年8月20日
	 * 
	 * @param joinPoint
	 * @return
	 * @throws Exception
	 * @author Netbug
	 */
	public static Method getMethod(JoinPoint joinPoint) throws Exception {
		String targetName = joinPoint.getTarget().getClass().getName();
		String methodName = joinPoint.getSignature().getName();
		Class<?> targetClass = Class.forName(targetName);
		Method[] methods = targetClass.getMethods();
		for (Method method : methods) {
			if (method.getName().equals(methodName)) {
				return method;
			}
		}
		return null;
	}
}
