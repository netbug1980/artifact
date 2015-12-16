var AjaxProxy = require('../../base/js/ajax-proxy');
module.exports =  {
	getOrg : function(orgID,callback){
		new AjaxProxy({
			url:'/api/security/organization/get/'+orgID,
			type:'GET'
		}).done(callback);
	},
	deleteOrg : function(orgID,callback){
		new AjaxProxy({
			url:'/api/security/organization/delete/'+orgID,
			type:'DELETE'
		}).done(callback);
	},
	saveOrUpdateOrg : function(param,callback){
		new AjaxProxy({
			url:'/api/security/organization/saveorupdate',
			type:'POST',
			data:JSON.stringify(param)
		}).done(callback);
	},
	deleteUser : function(userID,callback){
		new AjaxProxy({
			url:'/api/security/user/delete/'+userID,
			type:'DELETE'
		}).done(callback);
	},
};
