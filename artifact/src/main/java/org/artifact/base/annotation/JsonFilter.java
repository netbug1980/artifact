/**
 * 
 */
package org.artifact.base.annotation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Jackson属性过滤注解
 * <p>
 * 日期：2015年8月19日
 * 
 * @version 0.1
 * @author Netbug
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface JsonFilter {
	String[] value();

	Class<?> target() default Object.class;
}
