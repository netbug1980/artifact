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
			minWidth : 50, // 此处与layout.less中的layout-lefter-min-width变量相等
			CurrentNav : null,
			TopperNav : [{
				title : "系统管理",
				icon : "",
				count:0,
				permission:true,
				childNav : [{
					title : "部门管理",
					icon : "",
					count:0,
					permission:true,
					childNav : [],
					callback : function() {
						//organication Class
						var OrgContent = require('../../security/js/org');
						var Org = new OrgContent({
							hasHeader:true,
							hasTitle:false,
							hasBtnGroup:false
						});
						Org.$content.addClass('organization');
						Org.init();
						Org.load(1);
					}
				}, {
					title : "导航12",
					icon : "",
					count:0,
					permission:true,
					childNav : [],
					callback : function() {
						console.log("导航12");
					}
				}, {
					title : "导航13",
					icon : "",
					count:0,
					permission:true,
					childNav : [],
					callback : function() {
						console.log("导航13");
					}
				}],
				callback : function() {
					console.log("导航1");
				}
			}, {
				title : "导航2",
				icon : "",
				count:99,
				permission:true,
				childNav : [{
					title : "导航21",
					permission:true,
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
				childNav : [],
				callback : function() {
					console.log("导航3");
				}
			}, {
				title : "导航4",
				icon : "",
				count:0,
				permission:true,
				childNav : [],
				callback : function() {
					console.log("导航4");
				}
			}],
			BottomerNav : [{
				title : "付磊森",
				permission:false,
				icon : "",
				count:0,
				childNav : [{
					title : "个人信息",
					permission:false,
					icon : "",
					count:0,
					childNav : [],
					callback : function() {
						console.log("登陆");
						$("#singleModal").modal("show");
						$("#btn_login").unbind();
						$("#btn_login").click(function(){
							var username = $('#singleModal form input[name="username"]').val().trim();
							var password = $('#singleModal form input[name="password"]').val().trim();
							require("./proxy").login({username:username,password:password}, function(response){
								switch (response.code) {
									case 0 :{
										$("#singleModal").modal("hide");
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
					}
				}, {
					title : "注销",
					icon : "",
					count:0,
					permission:false,
					childNav : [],
					callback : function() {
						console.log("注销");
						require("./proxy").logout(function(res){
							switch (res.code) {
								case 0 :{
									require('./message').success(res.result);
									break;
								}
								
								default :
									break;
							}
						});
					}
				}],
				callback : function() {
					
				}
			}, {
				title : "设置",
				icon : "",
				count:0,
				permission:false,
				childNav : [],
				callback : function() {
					console.log("设置");
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
						if(Layout.Lefter.CurrentNav==null){
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
				Layout.Lefter.buildTopper();
				Layout.Lefter.buildBottomer();
				if(!refresh){
					Layout.Lefter.CurrentNav.callback();
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
$(function() {
	Layout.Lefter.build(false);
	$("#btn_layout").click(function(e) {
		if(!$(".layout").hasClass("in")&&!$(".layout").hasClass("out")){
			if($(window).width() >= 768){//大屏
				$(".layout").addClass("out");
			}else{//小屏
				$(".layout").addClass("in");
			}
		}else{
			if ($(".layout").hasClass("in")) {
				$(".layout").removeClass("in");
				$(".layout").addClass("out");
			} else {
				$(".layout").removeClass("out");
				$(".layout").addClass("in");
			}
		}
	});
	$("#btn_nav_back").click(function(){
		Layout.Backer.clickFun(true);
	});
	console.log($(window).width());
});
