/**
 * 
 */
package org.artifact.base.util;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Json工具类
 * <p>
 * 日期：2015年8月14日
 * 
 * @version 0.1
 * @author Netbug
 */
public class JsonUtil {
	private static ObjectMapper mapper = new ObjectMapper();

	/**
	 * 对象转换为JSON字符串
	 * <p>
	 * 日期：2015年8月14日
	 * 
	 * @param object
	 * @return
	 * @throws JsonProcessingException
	 * @author Netbug
	 */
	public static String stringify(Object object)
			throws JsonProcessingException {
		return mapper.writeValueAsString(object);
	}

	/**
	 * JSON字符串转对象
	 * <p>
	 * 日期：2015年8月14日
	 * 
	 * @param json
	 * @param clazz
	 * @return
	 * @throws JsonParseException
	 * @throws JsonMappingException
	 * @throws IOException
	 * @author Netbug
	 */
	public static <T> T parse(String json, Class<T> clazz)
			throws JsonParseException, JsonMappingException, IOException {
		return mapper.readValue(json, clazz);
	}
}
