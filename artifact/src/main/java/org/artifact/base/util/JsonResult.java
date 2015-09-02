package org.artifact.base.util;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Json返回结果封装类，带有主动过滤Json属性功能
 * <p>
 * 日期：2015年8月25日
 * 
 * @version 0.1
 * @author Netbug
 */
public class JsonResult {

	public final static int SUCCESS = 0;
	public final static int ERROR = -1;

	private int code = SUCCESS;

	private String message = "";

	private Object result = null;

	@JsonIgnore
	private List<JsonFilter> jsonFilterList = null;

	public JsonResult() {
	}

	public JsonResult(Object result) {
		this.result = result;
	}

	public JsonResult(int code, String message, Object result) {
		this.code = code;
		this.message = message;
		this.result = result;
	}

	public JsonResult fail(String message) {
		this.code = ERROR;
		this.message = message;
		return this;
	}

	public JsonResult fail(int code, String message) {
		this.code = code;
		this.message = message;
		return this;
	}

	public int getCode() {
		return code;
	}

	public void setCode(int code) {
		this.code = code;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public Object getResult() {
		return result;
	}

	public void setResult(Object result) {
		this.result = result;
	}

	public List<JsonFilter> getJsonFilterList() {
		return jsonFilterList;
	}

	public void setJsonFilterList(List<JsonFilter> jsonFilterList) {
		this.jsonFilterList = jsonFilterList;
	}

}