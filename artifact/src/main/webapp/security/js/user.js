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
	this.randerUser = function(user){
		var compile = require('../handlebars/user-detail.handlebars');
		user.verifypw = verifypw;
		var tpl = compile(user);
		delete user.verifypw;
		obj.$container.html(tpl);
		
		//保存基本信息
		this.$header.find('.btn-group').Buttons([{
			clazz:'btn-primary',
			glyphicon:'glyphicon-floppy-save',
			text:'保存',
			title:'保存用户',
			callback:function(){
				obj.saveOrUpdateUser(user);
			}
		}
		]);
		
		obj.$container.find('.panel-role .panel-heading .btn-group').Buttons([{
			clazz:'btn-info',
			glyphicon:'glyphicon-check',
			text:'角色',
			title:'选择角色',
			callback:function(){
				require('./role').selectPopover($(this));
			}
		}
		]);
		
		//更新密码
		obj.$container.find("#btn_update_password").click(function(){
			//verifypw
			if(verifypw){
				obj.verifyAndupdatePassword(user);
			}else if(user.id){
				obj.updatePassword(user);
			}else{
				obj.saveOrUpdateUser(user,true);//先保存用户，再更新密码
			}
		});
		obj.slipIn();
	};
	this.loadUser = function(id){
		if(id){
			new AjaxProxy({
				url:'/api/security/user/get/'+id,
				type:'GET',
				callback:function(res){
					obj.randerUser(res.result);
				}
			});
		}else{
			var user = {
					id:'',
					account:'',
					name:'',
					age:20,
					organization:window.CUR_ORG
			};

			obj.randerUser(user);
		}
	};
	
	/**
	 * flag 是否点击了“更新密码”按钮
	 */
	this.saveOrUpdateUser = function(user,flag){
		user.account = $("#account").val().trim();
		user.name = $("#name").val().trim();
		user.age = $("#age").val();
		if(!user.account){//判空
			return false;
		}
		//保存前需要验证账号唯一性
		new AjaxProxy({
			url:'/api/security/user/getby/'+user.account,
			type:'GET',
			callback:function(res){
				if(!!res.result&&res.result.id!=user.id){//排除自己
					$("#account").parent().addClass("has-error");
					Message.warning("账号“" +user.account+ "”已存在！");
					$("#account").focus();
				}else{
					$("#account").parent().removeClass("has-error");
					new AjaxProxy({
						url:'/api/security/user/saveorupdate',
						type:'POST',
						data:JSON.stringify(user),
						callback:function(res){
							if(flag){
								user.id = res.result;
								obj.updatePassword(user);
							}else{
								obj.slipOut();
								obj.parent.load(CUR_ORG.id);
							}
						}
					});
				}
			}
		});
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
			data:JSON.stringify({id:user.id,password:pw}),
			callback:function(res){
				Message.success("更新密码成功。");
				$("#password").parent().removeClass("has-error");
				$("#repassword").parent().removeClass("has-error");
			}
		});
	};
	
	this.verifyAndupdatePassword = function(user){
		var opw = $("#oldpassword").val().trim();
		if(!opw){//判空
			return false;
		}
		new AjaxProxy({
			url:'/api/security/user/verify',
			type:'POST',
			data:JSON.stringify({account:user.account,password:opw}),
			callback:function(res){
				if(res.result){
					$("#oldpassword").parent().removeClass("has-error");
					obj.updatePassword(user);
				}else{
					$("#oldpassword").parent().addClass("has-error");
					Message.warning("旧密码不正确，请重新输入！");
					$("#oldpassword").focus();
				}
			}
		});
	};
	
	this.loadUser(id);
};