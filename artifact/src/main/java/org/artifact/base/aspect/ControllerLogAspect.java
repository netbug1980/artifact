/**
 * 
 */
package org.artifact.base.aspect;

import org.artifact.base.util.JsonUtil;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Controller日志Aspect
 * <p>
 * 日期：2015年8月19日
 * 
 * @version 0.1
 * @author Netbug
 */
@Aspect
@Component
public class ControllerLogAspect {
	private static final Logger logger = LoggerFactory
			.getLogger(ControllerLogAspect.class);

	@Pointcut("execution(* org.*.*.controller.*.*(..))&&!@annotation(org.artifact.base.annotation.JsonResult)")
	public void ControllerLogPointcut() {

	}

	@Around(value = "ControllerLogPointcut()")
	public Object doAround(ProceedingJoinPoint joinPoint) {
		String argsJson = "无";
		try {
			Object[] args = joinPoint.getArgs();
			if (args != null && args.length > 0) {
				argsJson = JsonUtil.stringify(args);
			}
			return joinPoint.proceed();
		} catch (Throwable e) {
			logger.warn("异常方法【{}】异常类型【{}】异常信息【{}】参数【{}】", joinPoint
					.getTarget().getClass().getName()
					+ "." + joinPoint.getSignature().getName(), e.getClass()
					.getName(), e.getMessage(), argsJson, e);
			logger.error("异常方法【{}】异常类型【{}】异常信息【{}】参数【{}】", joinPoint
					.getTarget().getClass().getName()
					+ "." + joinPoint.getSignature().getName(), e.getClass()
					.getName(), e.getMessage(), argsJson);
			return null;
		}
	}

}
