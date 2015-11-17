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
	public final static JsonResult LOGIN_FAILURE_RESULT = new JsonResult(-2,
			"登陆失败", null);
	public final static JsonResult LOGIN_FAILURE_NOUSER_RESULT = new JsonResult(
			-20, "用户不存在", null);
	public final static JsonResult LOGIN_FAILURE_ERRPASSORD_RESULT = new JsonResult(
			-21, "密码不正确", null);
	public final static JsonResult LOGIN_FAILURE_NOTLOGIN_RESULT = new JsonResult(
			-22, "请先登录", null);
	public final static JsonResult SESSION_INVALID_RESULT = new JsonResult(-30,
			"Session失效", null);
	public final static JsonResult SESSION_EXPIRED_RESULT = new JsonResult(-31,
			"Session过期，您已在别处登陆", null);
	public final static JsonResult ACCESS_DENIED_RESULT = new JsonResult(-40,
			"权限拒绝", null);
	public final static JsonResult ACCESS_DENIED_CSRF_RESULT = new JsonResult(
			-41, "权限拒绝之CSRF", null);
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