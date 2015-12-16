var AjaxProxy = require('./ajax-proxy');
module.exports =  {
	login : function(user, callback) {
		new AjaxProxy({
			url : '/login',
			type : 'POST',
			data : JSON.stringify(user)
		}).done(function(response) {
			switch (response.code) {
				case 0 : {
					var user = response.result.CUR_USER;
					var roleNameArr = new Array();
					var permissionPathArr = new Array();
					var permissionPathMap = new Object();
					$(user.userRoleList).each(function(i,userRole){
						var role = userRole.role;
						roleNameArr.push(role.name);
						$(role.rolePermissionList).each(function(j,rolePermission){
							permissionPathMap[rolePermission.permission.path] = ''; 
						});
					});
					for(var key in permissionPathMap){
						permissionPathArr.push(key);
					}
					response.result.CUR_USER.roleNameArr = roleNameArr;
					response.result.CUR_USER.permissionPathArr = permissionPathArr;
					sessionStorage.currentSession = JSON
							.stringify(response.result);
					//还原之前需要登录的请求
					while(AJAX_PROXY.ajaxStack.length>0){
						AJAX_PROXY.ajaxStack.pop().start();
					}
				}
				default : {
					callback(response);
					break;
				}
			}
		});
	},
	logout : function(callback) {
		new AjaxProxy({
			url : '/logout',
			type : 'POST'
		}).done(callback);
	}
};
