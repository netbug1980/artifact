var Content = require("../../base/js/content");
var AjaxProxy = require('../../base/js/ajax-proxy');
var Message = require('../../base/js/message');
module.exports = function UserContent(options){
	var obj = this;
	Content.apply(this,arguments);
	var id = options.id;
	var verifypw = options.verifypw;
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
		
		//更新密码
		obj.$container.find("#btn_update_password").click(function(){
			//verifypw
			if(verifypw){
				obj.verifyAndupdatePassword(user);
			}else{
				obj.updatePassword(user);
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
	
	this.saveOrUpdateUser = function(user){
		user.account = $("#account").val();
		user.name = $("#name").val();
		user.age = $("#age").val();
		new AjaxProxy({
			url:'/api/security/user/saveorupdate',
			type:'POST',
			data:JSON.stringify(user),
			callback:function(res){
				obj.slipOut();
				obj.parent.load(CUR_ORG.id);
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