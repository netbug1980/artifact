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
 * 使用JsonResult返回结果、过滤属性</br>注意：使用此注解时需要将方法返回类型改为<b>Object</b>类型
 * <p>
 * 日期：2015年8月19日
 * 
 * @version 0.1
 * @author Netbug
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface JsonResult {
	String value() default "";

	JsonFilter[] filter() default {};
}
