package org.artifact.base.util;

import java.util.Enumeration;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.core.JsonProcessingException;

public class RequestUtil {
	private static final Logger logger = LoggerFactory
			.getLogger(RequestUtil.class);

	/**
	 * 遍历Session中键值对
	 * <p>
	 * 日期：2015年10月23日
	 * 
	 * @param request
	 * @author Netbug
	 */
	public static void traverseSession(HttpServletRequest request) {
		Enumeration<?> enumeration = request.getSession().getAttributeNames();
		while (enumeration.hasMoreElements()) {
			String name = (String) enumeration.nextElement();
			Object value = request.getSession().getAttribute(name);
			String valueStr = "";
			try {
				valueStr = JsonUtil.stringify(value);
			} catch (JsonProcessingException e) {

			}
			logger.info("Session.{}={}", name, valueStr);
		}
	}

	/**
	 * 遍历Header中键值对
	 * <p>
	 * 日期：2015年10月23日
	 * 
	 * @param request
	 * @author Netbug
	 */
	public static void traverseHeader(HttpServletRequest request) {
		Enumeration<?> enumeration = request.getHeaderNames();
		while (enumeration.hasMoreElements()) {
			String name = (String) enumeration.nextElement();
			Object value = request.getHeader(name);
			String valueStr = "";
			try {
				valueStr = JsonUtil.stringify(value);
			} catch (JsonProcessingException e) {

			}
			logger.info("HttpHeader.{}={}", name, valueStr);
		}
	}

	/**
	 * 判断是否是Ajax请求
	 * <p>
	 * 日期：2015年10月28日
	 * 
	 * @param request
	 * @return
	 * @author Netbug
	 */
	public static boolean isXMLHttpRequest(HttpServletRequest request) {
		traverseHeader(request);
		String value = request.getHeader("X-Requested-With");
		if (value != null && "XMLHttpRequest".equals(value)) {
			return true;
		} else {
			return false;
		}
	}
}
