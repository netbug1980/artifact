/**
 * 
 */
package org.artifact.base.converter;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.List;

import org.artifact.base.util.JsonFilter;
import org.artifact.base.util.JsonResult;
import org.springframework.http.HttpInputMessage;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.http.converter.json.MappingJacksonInputMessage;

import com.fasterxml.jackson.core.JsonEncoding;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.databind.type.TypeFactory;

/**
 * SpringMVC jackson返回信息转换Converter </br>
 * 根据JsonResult中的jsonFilterList属性主动过滤目标对象属性
 * <p>
 * 日期：2015年8月25日
 * 
 * @version 0.1
 * @author Netbug
 */
public class JsonResult2HttpMessageConverter extends
		MappingJackson2HttpMessageConverter {
	private ObjectMapper objectMapperForRead;

	public JsonResult2HttpMessageConverter() {
		super();
		this.objectMapperForRead = new ObjectMapper();
	}

	@Override
	protected void writeInternal(Object object, Type type,
			HttpOutputMessage outputMessage) throws IOException,
			HttpMessageNotWritableException {

		JsonEncoding encoding = getJsonEncoding(outputMessage.getHeaders()
				.getContentType());
		JsonGenerator generator = this.objectMapper.getFactory()
				.createGenerator(outputMessage.getBody(), encoding);
		try {
			Object value = object;
			if (object instanceof JsonResult) {
				List<JsonFilter> jsonFilterList = ((JsonResult) object)
						.getJsonFilterList();
				if (jsonFilterList != null && jsonFilterList.size() > 0) {
					for (JsonFilter jsonFilter : jsonFilterList) {
						this.objectMapper.addMixIn(jsonFilter.getTarget(),
								jsonFilter.getMixinSource());
					}
				}
			}
			ObjectWriter objectWriter = this.objectMapper.writer();
			objectWriter.writeValue(generator, value);

			generator.flush();

		} catch (JsonProcessingException ex) {
			throw new HttpMessageNotWritableException(
					"Could not write content: " + ex.getMessage(), ex);
		}
	}

	@Override
	protected Object readInternal(Class<?> clazz, HttpInputMessage inputMessage)
			throws IOException, HttpMessageNotReadableException {
		// TODO Auto-generated method stub
		return super.readInternal(clazz, inputMessage);
	}

	@SuppressWarnings("deprecation")
	@Override
	public Object read(Type type, Class<?> contextClass,
			HttpInputMessage inputMessage) throws IOException,
			HttpMessageNotReadableException {
		try {
			JavaType javaType = TypeFactory.defaultInstance().constructType(
					type, contextClass);
			if (inputMessage instanceof MappingJacksonInputMessage) {
				Class<?> deserializationView = ((MappingJacksonInputMessage) inputMessage)
						.getDeserializationView();
				if (deserializationView != null) {
					return this.objectMapperForRead
							.readerWithView(deserializationView)
							.withType(javaType)
							.readValue(inputMessage.getBody());
				}
			}
			return this.objectMapperForRead.readValue(inputMessage.getBody(),
					javaType);
		} catch (IOException ex) {
			throw new HttpMessageNotReadableException(
					"Could not read document: " + ex.getMessage(), ex);
		}
	}

}
