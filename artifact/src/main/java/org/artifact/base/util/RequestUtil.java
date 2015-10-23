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
}
