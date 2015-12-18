/**
 * 
 */
package org.artifact.security.controller;

import org.artifact.base.annotation.JsonFilter;
import org.artifact.base.annotation.JsonResult;
import org.artifact.security.condition.PermissionCondition;
import org.artifact.security.domain.Permission;
import org.artifact.security.service.PermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 资源Controller
 * <p>
 * 日期：2015年8月28日
 * 
 * @version 0.1
 * @author Netbug
 */
@Controller
@RequestMapping(value = "/security/permission")
public class PermissionController {

	@Autowired
	private PermissionService permissionService;

	@RequestMapping(value = "/search", method = RequestMethod.POST)
	@ResponseBody
	@JsonResult(value = "查询所有资源", filter = { @JsonFilter(value = { "rolePermissionList" }, target = Permission.class) })
	public Object search(@RequestBody PermissionCondition condition) {
		return this.permissionService.find();
	}

	@RequestMapping(value = "/findbyroleids", method = RequestMethod.POST)
	@ResponseBody
	@JsonResult(value = "根据角色ID数组获取权限列表", filter = { @JsonFilter(value = { "rolePermissionList" }, target = Permission.class) })
	public Object search(@RequestBody Integer[] roleIds) {
		return this.permissionService.findByRoleIds(roleIds);
	}

	@RequestMapping(value = "/saveorupdate", method = RequestMethod.POST)
	@ResponseBody
	@JsonResult("新增或更新资源")
	public Object saveOrUpdate(@RequestBody Permission permission) {
		permissionService.saveOrUpdate(permission);
		return permission.getId();
	}

	@RequestMapping(value = "/get/{id}", method = RequestMethod.GET)
	@ResponseBody
	@JsonResult("根据主键获得资源信息")
	public Object get(@PathVariable Integer id) {
		return permissionService.getPermissionById(id);
	}

	@RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE)
	@ResponseBody
	@JsonResult("根据主键删除资源")
	public Object delete(@PathVariable Integer id) {
		permissionService.deletePermissionById(id);
		return id;
	}
}
