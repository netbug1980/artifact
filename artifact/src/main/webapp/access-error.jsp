<%@ page language="java" import="org.artifact.base.util.*" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	response.setCharacterEncoding("UTF-8");
	response.setContentType("application/json;charset=UTF-8");
	JsonResult result = new JsonResult(-2, "权限不足", null);
	out.write(JsonUtil.stringify(result));
%>