/**
 * 
 */
package org.artifact.security.controller;

import org.artifact.base.annotation.JsonFilter;
import org.artifact.base.annotation.JsonResult;
import org.artifact.security.domain.Organization;
import org.artifact.security.domain.User;
import org.artifact.security.service.OrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 部门Controller
 * <p>
 * 日期：2015年8月7日
 * 
 * @version 0.1
 * @author Netbug
 */
@Controller
@RequestMapping(value = "/security/organization")
public class OrganizationController {

	@Autowired
	private OrganizationService organizationService;

	@RequestMapping(value = "/saveorupdate", method = RequestMethod.POST)
	@ResponseBody
	@JsonResult("新增或更新部门")
	public Object saveOrUpdate(@RequestBody Organization organization) {
		organizationService.saveOrUpdate(organization);
		return organization.getId();
	}

	@RequestMapping(value = "/get/{id}", method = RequestMethod.GET)
	@ResponseBody
	@JsonResult(value = "根据ID查询部门", filter = {
			@JsonFilter(value = { "parentOrg" }, target = Organization.class),
			@JsonFilter(value = { "password" }, target = User.class) })
	public Object get(@PathVariable Integer id) {
		return organizationService.getOrganizationById(id);
	}

	@RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE)
	@ResponseBody
	@JsonResult("根据ID删除部门")
	public Object delete(@PathVariable Integer id) {
		organizationService.deleteOrganizationById(id);
		return id;
	}
}
