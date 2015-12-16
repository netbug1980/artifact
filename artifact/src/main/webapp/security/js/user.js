var Content = require("../../base/js/content");
var AjaxProxy = require('../../base/js/ajax-proxy');
var Message = require('../../base/js/message');
module.exports = function UserContent(options){
	var obj = this;
	Content.apply(this,arguments);
	var id = options.id;
	var verifypw = options.verifypw;//当用户自主修改密码时，需要验证密码
	var title = '新增';
	if(id){
		title = '编辑';
	}
	this.$header.find('.title').text(title+'用户');
	
	/**
	 * 渲染角色列表
	 */
	this.randerRoleTr = function(roles){
		var trs = require('./role').buildTr(roles);
		var $tbody = obj.$container.find('.panel-role tbody');
		$tbody.empty();
		$tbody.append(trs);
		//移除角色
		$tbody.find('.btn-group').Buttons([{
			clazz : 'btn-danger',
			glyphicon : 'glyphicon-remove',
			text : '删除',
			title : '临时删除',
			callback : function() {
				$(this).closest('tr').remove();
			}
		}
		]);
	};
	this.getRoleIds = function(){
		return obj.$container.find('.panel-role tbody a').map(function(){
			return $(this).attr('id');
		}).get();
	};
	/**
	 * 渲染用户详情
	 */
	this.randerUser = function(user){
		var compile = require('../handlebars/user-detail.handlebars');
		user.verifypw = verifypw;
		var tpl = compile(user);
		delete user.verifypw;
		obj.$container.html(tpl);
		
		var roles = $(user.userRoleList).map(function(i,item){
			return item.role;
		}).get();
		
		this.randerRoleTr(roles);
		
		//保存基本信息
		this.$header.find('.btn-group').Buttons([{
			clazz:'btn-primary',
			glyphicon:'glyphicon-floppy-save',
			text:'保存',
			title:'保存用户',
			callback:function(){
				obj.saveOrUpdateUser(user).done(function(res){
					obj.slipOut();
					obj.parent.load(CUR_ORG.id);
					
				});
			}
		}
		]);
		
		//选择角色
		obj.$container.find('.panel-role .panel-heading .btn-group').Buttons([{
			clazz : 'btn-info',
			glyphicon : 'glyphicon-check',
			text : '角色',
			title : '选择角色',
			callback : function() {
				var checkedArr = obj.getRoleIds();
				require('./role').selectPopover({
					$btn : $(this),
					checkedArr : checkedArr,
					callback : function(data) {
						obj.randerRoleTr(data);
					}
				});
			}
		}]);
		
		//关联角色
		obj.$container.find("#btn_relate_role").click(function(){
			if(user.id){
				obj.relaterole(user);
			}else{
				//先保存用户，再关联角色
				obj.saveOrUpdateUser(user).done(function(res) {
					user.id = res.result;
					obj.relaterole(user);
				});
			}
		});
		
		//更新密码
		obj.$container.find("#btn_update_password").click(function(){
			// verifypw
			if (verifypw) {
				obj.verifyAndupdatePassword(user);
			} else if (user.id) {
				obj.updatePassword(user);
			} else {
				// 先保存用户，再更新密码
				obj.saveOrUpdateUser(user).done(function(res) {
					user.id = res.result;
					obj.updatePassword(user);
				});
			}
		});
		obj.slipIn();
	};
	this.loadUser = function(id) {
		if (id) {
			new AjaxProxy({
				url : '/api/security/user/get/' + id,
				type : 'GET'
			}).done(function(res) {
				obj.randerUser(res.result);
			});
		} else {
			var user = {
				id : '',
				account : '',
				name : '',
				age : 20,
				organization : window.CUR_ORG
			};

			obj.randerUser(user);
		}
	};
	
	/**
	 * flag 是否点击了“更新密码”按钮
	 */
	this.saveOrUpdateUser = function(user) {
		var dfd = $.Deferred(); // 生成Deferred对象
		user.account = $("#account").val().trim();
		user.name = $("#name").val().trim();
		user.age = $("#age").val();
		if (!!user.account) {// 判空
			// 保存前需要验证账号唯一性
			new AjaxProxy({
				url : '/api/security/user/getby/' + user.account,
				type : 'GET'
			}).done(function(res) {
				if (!!res.result && res.result.id != user.id) {// 排除自己
					$("#account").parent().addClass("has-error");
					Message.warning("账号“" + user.account + "”已存在！");
					$("#account").focus();
				} else {
					$("#account").parent().removeClass("has-error");
					new AjaxProxy({
						url : '/api/security/user/saveorupdate',
						type : 'POST',
						data : JSON.stringify(user)
					}).done(function(res) {
						dfd.resolve(res);
					}).fail(function() {
						dfd.reject();
					});
				}
			}).fail(function() {
				dfd.reject();
			});
		}
		return dfd.promise();
	};
	
	this.updatePassword = function(user){
		
		var pw = $("#password").val().trim();
		var repw = $("#repassword").val().trim();
		if(!pw||!repw){//判空
			return false;
		}
		if(pw!=repw){
			$("#password").parent().addClass("has-error");
			$("#repassword").parent().addClass("has-error");
			Message.warning("新密码与确认密码不相同！");
			$("#repassword").focus();
			return false;
		}
		new AjaxProxy({
			url:'/api/security/user/updatepassword',
			type:'POST',
			data:JSON.stringify({id:user.id,password:pw})
		}).done(function(res){
			Message.success("更新密码成功。");
			$("#password").parent().removeClass("has-error");
			$("#repassword").parent().removeClass("has-error");
		});
	};
	
	this.relaterole = function(user) {
		var userRoleList = [];
		$(this.getRoleIds()).each(function(i, roleId) {
			userRoleList.push({
				id : null,
				role : {
					id : roleId
				}
			});
		});
		user.userRoleList = userRoleList;
		new AjaxProxy({
			url : '/api/security/user/relaterole',
			type : 'POST',
			data : JSON.stringify(user)
		}).done(function(res) {
			Message.success("关联角色成功。");
		});
	};
	
	this.verifyAndupdatePassword = function(user){
		var opw = $("#oldpassword").val().trim();
		if (!opw) {// 判空
			return false;
		}
		new AjaxProxy({
			url : '/api/security/user/verify',
			type : 'POST',
			data : JSON.stringify({
				account : user.account,
				password : opw
			})
		}).done(function(res) {
			if (res.result) {
				$("#oldpassword").parent().removeClass("has-error");
				obj.updatePassword(user);
			} else {
				$("#oldpassword").parent().addClass("has-error");
				Message.warning("旧密码不正确，请重新输入！");
				$("#oldpassword").focus();
			}
		});
	};
	
	this.loadUser(id);
};