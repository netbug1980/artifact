/**
 * 
 */
package org.artifact.security.controller;

import org.artifact.base.annotation.JsonFilter;
import org.artifact.base.annotation.JsonResult;
import org.artifact.security.condition.RoleCondition;
import org.artifact.security.domain.Role;
import org.artifact.security.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 角色Controller
 * <p>
 * 日期：2015年8月28日
 * 
 * @version 0.1
 * @author Netbug
 */
@Controller
@RequestMapping(value = "/security/role")
public class RoleController {

	@Autowired
	private RoleService roleService;

	@RequestMapping(value = "/search", method = RequestMethod.POST)
	@ResponseBody
	@JsonResult(value = "查询所有角色", filter = { @JsonFilter(value = {
			"userRoleList", "rolePermissionList" }, target = Role.class) })
	public Object search(@RequestBody RoleCondition condition) {
		return this.roleService.find();
	}

	@RequestMapping(value = "/saveorupdate", method = RequestMethod.POST)
	@ResponseBody
	@JsonResult("新增或更新角色")
	public Object saveOrUpdate(@RequestBody Role role) {
		roleService.saveOrUpdate(role);
		return role.getId();
	}

	@RequestMapping(value = "/relatepermission", method = RequestMethod.POST)
	@ResponseBody
	@JsonResult("角色关联资源")
	public Object relatePermission(@RequestBody Role role) {
		roleService.saveOrUpdate(role, true);
		return role.getId();
	}

	@RequestMapping(value = "/get/{id}", method = RequestMethod.GET)
	@ResponseBody
	@JsonResult("根据主键获得角色信息")
	public Object get(@PathVariable Integer id) {
		return roleService.getRoleById(id);
	}

	@RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE)
	@ResponseBody
	@JsonResult("根据主键删除角色")
	public Object delete(@PathVariable Integer id) {
		roleService.deleteRoleById(id);
		return id;
	}
}
