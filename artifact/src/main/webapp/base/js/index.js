window.Layout = {
		/**
		 * 回退按钮
		 */
		Backer:{
			Type : {NAV:'NAV',CONTENT:'CONTENT'},
			Stack : new Array(),
			clickFun : function(flag) {
				var backObj = Layout.Backer.Stack.pop();
				if (flag) {
					backObj.callback();
				}
				if (Layout.Backer.Stack.length == 0) {
					$("#btn_nav_back").addClass("invisible");
				}
			},
			cleanByType:function(type){
				Layout.Backer.Stack = $(Layout.Backer.Stack).map(function(i,item){
					if(item.type!=type){
						return item;
					}
				}).get();
				if (Layout.Backer.Stack.length == 0) {
					$("#btn_nav_back").addClass("invisible");
				}
			}
		},
		/**
		 * 左侧导航
		 */
		Lefter : {
			minWidth : 55, // 此处与layout.less中的layout-lefter-min-width变量相等
			CurrentNav : null, // 非link导航
			TopperNav : [{
				title : "导航2",
				icon : "",
				count:99,
				permission:true,
				link:true,
				childNav : [{
					title : "导航21",
					permission:true,
					link:true,
					icon : "",
					count:0,
					childNav : [],
					callback : function() {
						console.log("导航21");
					}
				}, {
					title : "导航22",
					icon : "",
					count:0,
					permission:true,
					link:true,
					childNav : [],
					callback : function() {
						console.log("导航22");
					}
				}],
				callback : function() {
					console.log("导航2");
				}
			}, {
				title : "导航3",
				icon : "",
				count:0,
				permission:true,
				link:true,
				childNav : [],
				callback : function() {
					console.log("导航3");
				}
			}, {
				title : "导航4",
				icon : "",
				count:0,
				permission:true,
				link:true,
				childNav : [],
				callback : function() {
					console.log("导航4");
				}
			}],
			BottomerNav : [ {
				title : "设置",
				icon : "",
				count:0,
				permission:false,
				link:true,
				childNav : [],
				callback : function() {
					console.log("设置");
				}
			},{
				title : "登陆",
				permission:false,
				link:false,
				icon : "",
				count:0,
				childNav : [],
				callback : function() {
					Login();
				}
			}],
			_flatNav:function(nav,path){
				$(nav).each(function(i,item){
					var temp = path;
					item.path = path + item.title;
					if(item.childNav.length==0){
						if(item.permission){
							if(!SessionHelper.hasPermission('/导航'+item.path)){
								return true;
							}
						}
						if(Layout.Lefter.CurrentNav==null&&item.link){
							Layout.Lefter.CurrentNav = item;
						}
						return true;
					}else{
						path = path + item.title + "/";
						Layout.Lefter._flatNav(item.childNav,path);
						path = temp;
					}
					
				});
			},
			_buildNav : function($this,nav){
				$this.addClass("out");
				setTimeout(function(){
					$this.empty();
					$(nav).each(function(i,item){
						if(item.permission){
							if(!SessionHelper.hasPermission('/导航'+item.path)){
								return true;
							}
						}
						var $li = $("<li>").appendTo($this);
						var $a = $("<a>").attr("href","#").appendTo($li);
						item.icon = item.icon.trim()?item.icon:"glyphicon glyphicon-question-sign";
						$("<span>").addClass(item.icon).addClass("margin-right-15").appendTo($a);
						var $detail = $("<span>").addClass("detail").appendTo($a);
						$("<span>").addClass("title").text(item.title).appendTo($detail);
						var $title_ext = $("<span>").addClass("title-ext").appendTo($detail);
						var $badge = $("<span>").addClass("badge").appendTo($title_ext);
						if(item.count){
							$badge.text(item.count);
						}else{
							$badge.addClass("invisible");
						}
						var $right = $("<span>").addClass("glyphicon glyphicon-chevron-right").appendTo($title_ext);
						if(item.childNav.length==0){
							$right.addClass("invisible");
						}
						$li.data('data',item);
						$li.click(function(){
							var item = $(this).data('data');
							if(item.childNav.length>0){
								
								Layout.Lefter._buildNav($this,item.childNav);//创建二级菜单
								Layout.Backer.Stack.push({
									callback : function() {
										Layout.Lefter._buildNav($this,nav);
									},
									type : Layout.Backer.Type.NAV
								});
								$("#btn_nav_back").removeClass("invisible");
								
							}else{
								if(item.link){//非链接操作，仅仅执行回调函数
									if(!$(this).hasClass("active")){
										Layout.Lefter.CurrentNav = item;
										$(".layout .layout-lefter .active").removeClass("active");
										$(this).addClass("active");
									}
									$(".layout-container").removeClass("in out");
									setTimeout(function(){
										$(".layout-container").empty();
										Layout.Backer.cleanByType(Layout.Backer.Type.CONTENT);//回退堆栈清除content相关数据
										$(".layout-container").addClass("in");
										item.callback();
									}, 350);
								}else{
									item.callback();
								}
							}
						});
						if(Layout.Lefter.CurrentNav.path.indexOf(item.path)>=0){
							$(".layout .layout-lefter .active").removeClass("active");
							$li.addClass("active");
						}
					});
					$this.removeClass("out");
				}, 350);
			},
			buildTopper:function(){
				
				Layout.Lefter._flatNav(Layout.Lefter.TopperNav,"/");
				
				Layout.Lefter._buildNav($(".layout .layout-lefter .toper"),Layout.Lefter.TopperNav);
			},
			buildBottomer:function(){
				
				Layout.Lefter._flatNav(Layout.Lefter.BottomerNav,"/");
				
				Layout.Lefter._buildNav($(".layout .layout-lefter .bottomer"),Layout.Lefter.BottomerNav);
			},
			/**
			 * 构建左侧导航
			 */
			build:function(refresh){
				Layout.Backer.cleanByType(Layout.Backer.Type.NAV);
				if(!refresh){
					//登陆成功后个人信息展示
					Layout.Lefter.logined();
				}
				Layout.Lefter.buildTopper();
				Layout.Lefter.buildBottomer();
				if(!refresh){
					Layout.Lefter.CurrentNav.callback();
				}
			},
			logined:function(){
				var session = sessionStorage.currentSession;
				if (!!session) {
					session = JSON.parse(session);
					var user = session["CUR_USER"];
					if (!!user) {
						var nav = {
								title : user.name,
								permission:false,
								link:true,
								icon : "",
								count:0,
								childNav : [{
									title : "个人信息",
									permission:false,
									link:true,
									icon : "",
									count:0,
									childNav : [],
									callback : function() {
										
									}
								}, {
									title : "注销",
									icon : "",
									count:0,
									permission:false,
									link:false,
									childNav : [],
									callback : function() {
										Logout();
									}
								}],
								callback : function() {
									
								}
							};
						Layout.Lefter.BottomerNav.splice(1,1,nav);
					}
				}
			}
		}
};
/**
 * Session相关辅助类
 */
window.SessionHelper = {
		/**
		 * 是否有权限
		 * @author netbug
		 * @param path
		 * @returns {Boolean}
		 */
		hasPermission :function(path){
			var session = sessionStorage.currentSession;
			var flag = false;
			if (!!session) {
				session = JSON.parse(session);
				var user = session["CUR_USER"];
				if (!!user) {
					$(user.permissionPathArr).each(function(i,item){
						if(item.indexOf(path)>=0){
							flag = true;
							return false;
						}
					});
				}
			}
			return flag;
		}
};
/**
 * 登陆
 */
window.Login = function(){
	var compile = require('../handlebars/login.handlebars');
	var tpl = compile();
	$("#singleModal .modal-content").html(tpl);
	$("#singleModal").modal("show");
	$("#btn_login").unbind();
	$("#btn_login").click(function(){
		var username = $('#singleModal form input[name="username"]').val().trim();
		var password = $('#singleModal form input[name="password"]').val().trim();
		require("./proxy").login({username:username,password:password}, function(response){
			switch (response.code) {
				case 0 :{
					$("#singleModal").modal("hide");
					//登陆成功后个人信息展示
					Layout.Lefter.logined();
					
					Layout.Lefter.build(true);
					break;
				}
				case -2 :{
					require('./message').danger(response.message);
					break;
				}
				case -20 :{
					require('./message').danger(response.message);
					break;
				}
				case -21 :{
					require('./message').danger(response.message);
					break;
				}
				default :
					break;
			}
		});
	});
};
window.Logout = function(){
	require("./proxy").logout(function(res){
		switch (res.code) {
			case 0 :{
				require('./message').success(res.result);
				var nav = {
						title : "登陆",
						permission:false,
						link:false,
						icon : "",
						count:0,
						childNav : [],
						callback : function() {
							Login();
						}
					};
				Layout.Lefter.BottomerNav.splice(1,1,nav);
				delete sessionStorage.currentSession;
				Layout.Lefter.build(true);
				break;
			}
			
			default :
				break;
		}
	});
};
