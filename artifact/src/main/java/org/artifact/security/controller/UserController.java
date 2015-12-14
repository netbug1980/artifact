/**
 * 
 */
package org.artifact.security.controller;

import java.util.HashMap;
import java.util.Map;

import org.artifact.base.annotation.JsonResult;
import org.artifact.security.condition.UserCondition;
import org.artifact.security.domain.User;
import org.artifact.security.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 用户Controller
 * <p>
 * 日期：2015年8月7日
 * 
 * @version 0.1
 * @author Netbug
 */
@Controller
@RequestMapping(value = "/security/user")
public class UserController {

	@Autowired
	private UserService userService;

	@RequestMapping(value = "/search", method = RequestMethod.POST)
	@ResponseBody
	@JsonResult("搜索人员")
	public Object search(@RequestBody UserCondition condition) {
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("list", userService.findUsers(condition));
		result.put("total", userService.findUsersCount(condition));
		return result;
	}

	@RequestMapping(value = "/verify", method = RequestMethod.POST)
	@ResponseBody
	@JsonResult("验证人员")
	public Object verify(@RequestBody UserCondition condition) {
		return userService.verify(condition.getAccount(),
				condition.getPassword());
	}

	@RequestMapping(value = "/saveorupdate", method = RequestMethod.POST)
	@ResponseBody
	@JsonResult("新增或更新人员")
	public Object saveOrUpdate(@RequestBody User user) {
		userService.saveOrUpdate(user);
		return user.getId();
	}

	@RequestMapping(value = "/updatepassword", method = RequestMethod.POST)
	@ResponseBody
	@JsonResult("更新用户密码")
	public Object updatePassword(@RequestBody UserCondition userCondition) {
		userService.updatePassword(userCondition);
		return userCondition.getId();
	}

	@RequestMapping(value = "/relaterole", method = RequestMethod.POST)
	@ResponseBody
	@JsonResult("人员关联角色")
	public Object relateRole(@RequestBody User user) {
		userService.saveOrUpdate(user, true);
		return user.getId();
	}

	@RequestMapping(value = "/get/{id}", method = RequestMethod.GET)
	@ResponseBody
	@JsonResult("根据主键获得用户信息")
	public Object get(@PathVariable Integer id) {
		return userService.getUserById(id);
	}

	@RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE)
	@ResponseBody
	@JsonResult("根据主键删除用户")
	public Object delete(@PathVariable Integer id) {
		userService.deleteUserById(id);
		return id;
	}
}
