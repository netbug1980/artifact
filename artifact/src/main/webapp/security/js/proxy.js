var AjaxProxy = require('../../base/js/ajax-proxy');
module.exports =  {
	getOrg : function(orgID,callback){
		new AjaxProxy({
			url:'/api/security/organization/get/'+orgID,
			type:'GET',
			callback:callback
		});
	},
	deleteOrg : function(orgID,callback){
		new AjaxProxy({
			url:'/api/security/organization/delete/'+orgID,
			type:'DELETE',
			callback:callback
		});
	},
	saveOrUpdateOrg : function(param,callback){
		new AjaxProxy({
			url:'/api/security/organization/saveorupdate',
			type:'POST',
			data:JSON.stringify(param),
			callback:callback
		});
	}
};
