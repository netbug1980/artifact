/**
 * 
 */
package org.artifact.base.aspect;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

import javassist.CannotCompileException;
import javassist.ClassPool;
import javassist.CtClass;
import javassist.bytecode.AnnotationsAttribute;
import javassist.bytecode.ClassFile;
import javassist.bytecode.ConstPool;
import javassist.bytecode.annotation.Annotation;
import javassist.bytecode.annotation.ArrayMemberValue;
import javassist.bytecode.annotation.MemberValue;
import javassist.bytecode.annotation.StringMemberValue;

import org.artifact.base.util.AspectUtil;
import org.artifact.base.util.JsonFilter;
import org.artifact.base.util.JsonResult;
import org.artifact.base.util.JsonUtil;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * JsonResult返回结果Aspect
 * <p>
 * 日期：2015年8月19日
 * 
 * @version 0.1
 * @author Netbug
 */
@Aspect
@Component
public class JsonResultAspect {
	private static final Logger logger = LoggerFactory
			.getLogger(JsonResultAspect.class);
	public static Map<String, Class<?>> GeneratedMixinSourceClazzMap = new HashMap<String, Class<?>>();

	@Pointcut("@annotation(org.artifact.base.annotation.JsonResult)")
	public void JsonResultPointcut() {

	}

	@Around(value = "JsonResultPointcut()")
	public org.artifact.base.util.JsonResult doAround(
			ProceedingJoinPoint joinPoint) {
		logger.debug("根据JsonResult注解，统一封装返回结果。");
		String desc = "";
		String argsJson = "无";
		try {
			Method method = AspectUtil.getMethod(joinPoint);
			org.artifact.base.annotation.JsonResult jsonResultAnno = method
					.getAnnotation(org.artifact.base.annotation.JsonResult.class);
			desc = jsonResultAnno.value();
			Object[] args = joinPoint.getArgs();
			if (args != null && args.length > 0) {
				argsJson = JsonUtil.stringify(args);
			}
			Object returnValue = joinPoint.proceed();
			JsonResult jsonResult = new JsonResult(returnValue);
			this.filterJsonResult(jsonResultAnno, method, jsonResult);
			return jsonResult;
		} catch (Throwable e) {
			logger.debug("异常方法【{}】异常类型【{}】异常信息【{}】参数【{}】", joinPoint
					.getTarget().getClass().getName()
					+ "." + joinPoint.getSignature().getName(), e.getClass()
					.getName(), e.getMessage(), argsJson, e);
			logger.error("异常方法【{}】异常类型【{}】异常信息【{}】参数【{}】", joinPoint
					.getTarget().getClass().getName()
					+ "." + joinPoint.getSignature().getName(), e.getClass()
					.getName(), e.getMessage(), argsJson);
			return new JsonResult().fail(desc + "出错");
		}
	}

	/**
	 * 根据JsonResult注解,设置JsonResult过滤条件
	 * <p>
	 * 日期：2015年8月25日
	 * 
	 * @param jsonResultAnno
	 * @param method
	 * @param jsonResult
	 * @throws CannotCompileException
	 * @author Netbug
	 */
	public void filterJsonResult(
			org.artifact.base.annotation.JsonResult jsonResultAnno,
			Method method, JsonResult jsonResult) throws CannotCompileException {
		org.artifact.base.annotation.JsonFilter[] jsonFilterAnnos = jsonResultAnno
				.filter();
		if (jsonFilterAnnos != null && jsonFilterAnnos.length > 0) {
			logger.debug("根据JsonResult注解,设置JsonResult过滤条件。");
			List<JsonFilter> jsonFilterList = new ArrayList<JsonFilter>();
			for (org.artifact.base.annotation.JsonFilter jsonFilterAnno : jsonFilterAnnos) {
				String[] names = jsonFilterAnno.value();
				if (names != null && names.length > 0) {
					Class<?> target = jsonFilterAnno.target() != null ? jsonFilterAnno
							.target() : method.getReturnType();
					String mixinSourceName = "GeneratedMixinSource$"
							+ (target.getName().hashCode() + "$" + Arrays
									.hashCode(names));
					Class<?> mixinSource = this.generateMixinSource(names,
							mixinSourceName);
					JsonFilter jsonFilter = new JsonFilter(target, mixinSource);
					jsonFilterList.add(jsonFilter);
				}
			}
			jsonResult.setJsonFilterList(jsonFilterList);
		}
	}

	/**
	 * 利用Java动态代理机制，自动生成带有“JsonIgnoreProperties”注解的接口</br> TODO 并发时可能会存在问题
	 * <p>
	 * 日期：2015年8月24日
	 * 
	 * @param names
	 * @return 动态生成的接口
	 * @throws CannotCompileException
	 * @author Netbug
	 */
	public Class<?> generateMixinSource(String[] names, String mixinSourceName)
			throws CannotCompileException {
		if (GeneratedMixinSourceClazzMap.containsKey(mixinSourceName)) {
			return GeneratedMixinSourceClazzMap.get(mixinSourceName);
		} else {
			ClassPool classpool = ClassPool.getDefault();
			CtClass mixinSource = classpool.makeInterface(mixinSourceName);
			ClassFile classFile = mixinSource.getClassFile();
			ConstPool constPool = classFile.getConstPool();
			AnnotationsAttribute annotationsAttribute = new AnnotationsAttribute(
					constPool, AnnotationsAttribute.visibleTag);
			Annotation annotation = new Annotation(
					JsonIgnoreProperties.class.getName(), constPool);
			ArrayMemberValue value = new ArrayMemberValue(constPool);
			Collection<MemberValue> memberValues = new HashSet<MemberValue>();
			for (String name : names) {
				StringMemberValue element = new StringMemberValue(constPool);
				element.setValue(name);
				memberValues.add(element);
			}
			value.setValue(memberValues.toArray(new MemberValue[] {}));
			annotation.addMemberValue("value", value);
			annotationsAttribute.addAnnotation(annotation);
			classFile.addAttribute(annotationsAttribute);
			Class<?> clazz = mixinSource.toClass();
			logger.debug("自动生成带有“JsonIgnoreProperties”注解的接口:{}",
					clazz.getName());
			GeneratedMixinSourceClazzMap.put(mixinSourceName, clazz);
			return clazz;
		}
	}
}
