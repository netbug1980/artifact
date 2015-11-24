var Layout = {
		Lefter : {
			minWidth : 50, // 此处与layout.less中的layout-lefter-min-width变量相等
			CurrentNav : null,
			BackStack : new Array(),//导航返回按钮栈
			BackFun:function(flag){
				var backFun = Layout.Lefter.BackStack.pop();
			if(flag){	backFun();}//恢复一级菜单
				if(Layout.Lefter.BackStack.length==0){
					$("#btn_nav_back").addClass("invisible");
				}
			},
			TopperNav : [{
				title : "导航1",
				icon : "",
				count:0,
				childNav : [{
					title : "导航11",
					icon : "",
					count:0,
					childNav : [],
					callback : function() {
						console.log("导航11");
					}
				}, {
					title : "导航12",
					icon : "",
					count:0,
					childNav : [],
					callback : function() {
						console.log("导航12");
					}
				}, {
					title : "导航13",
					icon : "",
					count:0,
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
				childNav : [{
					title : "导航21",
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
				childNav : [],
				callback : function() {
					console.log("导航3");
				}
			}, {
				title : "导航4",
				icon : "",
				count:0,
				childNav : [],
				callback : function() {
					console.log("导航4");
				}
			}],
			BottomerNav : [{
				title : "付磊森",
				icon : "",
				count:0,
				childNav : [{
					title : "登陆",
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
							Proxy.login({username:username,password:password}, function(response){
								switch (response.code) {
									case 0 :{
										$("#singleModal").modal("hide");
										break;
									}
									case -2 :{
										Message.danger(response.message);
										break;
									}
									case -20 :{
										Message.danger(response.message);
										break;
									}
									case -21 :{
										Message.danger(response.message);
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
					childNav : [],
					callback : function() {
						console.log("注销");
						Proxy.logout(function(res){
							switch (res.code) {
								case 0 :{
									Message.success(res.result);
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
				childNav : [],
				callback : function() {
					console.log("设置");
				}
			}],
		}
};
$(function() {
	function flatNav(nav,path){
		$(nav).each(function(i,item){
			var temp = path;
			item.path = path + item.title;
			if(item.childNav.length==0){
				if(Layout.Lefter.CurrentNav==null){
					Layout.Lefter.CurrentNav = item;
				}
				return true;
			}else{
				path = path + item.title + "/";
				flatNav(item.childNav,path);
				path = temp;
			}
		});
	}
	flatNav(Layout.Lefter.TopperNav,"/");
	flatNav(Layout.Lefter.BottomerNav,"/");
	
	function buildNav($this,nav){
		$this.addClass("out");
		setTimeout(function(){
			$this.empty();
			$(nav).each(function(i,item){
				var $li = $("<li>").appendTo($this);
				var $a = $("<a>").attr("href","#").appendTo($li);
				item.icon = item.icon.trim()?item.icon:"glyphicon glyphicon-question-sign";
				$("<span>").addClass(item.icon).addClass("margin-right-15").appendTo($a);
				var $detail = $("<span>").addClass("detail").appendTo($a);
				$("<span>").addClass("title").text(item.title).appendTo($detail);
				var $title_ext = $("<span>").addClass("title-ext").appendTo($detail);
				$badge = $("<span>").addClass("badge").appendTo($title_ext);
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
						
						buildNav($this,item.childNav);//创建二级菜单
						Layout.Lefter.BackStack.push(function(){
							buildNav($this,nav);
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
	}
	buildNav($(".layout .layout-lefter .toper"),Layout.Lefter.TopperNav);
	buildNav($(".layout .layout-lefter .bottomer"),Layout.Lefter.BottomerNav);
	Layout.Lefter.CurrentNav.callback();
	
	
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
		Layout.Lefter.BackFun(true);
	});
	console.log($(window).width());
	var Org = new OrgContent({
		hasHeader:true,
		hasTitle:false,
		hasBtnGroup:false
	});
	Org.init();
	Org.load(1);
});
