var Org = {
		$header :null,
		$container :null,
		$nav:null,
		$orgPanel:null,
		$userPanel:null,
		panelDemo:'<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title"></h3><div class="btn-group btn-group-sm pull-right"></div></div><table class="table table-hover table-striped"><tbody></tbody></table></div>',
		init:function(){
			Org.$header = $('.content-header').empty();
			Org.$container = $('.content-container').empty();
			Org.$nav = $('<ol class="breadcrumb org">').appendTo(Org.$header);
			$('<div role="group" class="btn-group pull-right">').appendTo(Org.$nav);
			Org.$orgPanel = $(Org.panelDemo).addClass('panel-org').appendTo(Org.$container);
			Org.$orgPanel.find('.panel-title').text('部门');
			Org.$userPanel = $(Org.panelDemo).addClass('panel-user').appendTo(Org.$container);
			Org.$userPanel.find('.panel-title').text('用户');
		},
		load:function(orgID){
			Proxy.getOrg(orgID, function(res){
				var org = res.result;
				//部门路径导航
				Org.buildNav(org);
				//子部门列表
				Org.buildOrg(org.childOrgList);
				//用户列表
				Org.buildUser(org.userList);
				
			});
		},
		buildNav:function(org){
			if(Org.$nav.find('#'+org.id).length>0){
				Org.$nav.find('#'+org.id).nextAll().remove();
			}else{
				var $li = $('<li id="'+org.id+'"><a href="#">'+org.name+'</a></li>').appendTo(Org.$nav);
				$li.click(function(){
					var orgID = $(this).attr('id');
					Org.load(orgID);
				});
			}
		},
		buildOrg:function(list){
			var $tbody = Org.$orgPanel.find('tbody').empty();
			if(list.length==0){
				$('<tr><td>无数据</td></tr>').appendTo($tbody);
				return ;
			}
			$(list).each(function(i,item){
				$('<tr><td><a href="#" id="'+item.id+'">'+item.name+'</a></td><td>操作</td></tr>').appendTo($tbody);
			});
			$tbody.find('a').click(function(){
				var orgID = $(this).attr('id');
				Org.load(orgID);
			});
		},
		buildUser:function(list){
			var $tbody = Org.$userPanel.find('tbody').empty();
			if(list.length==0){
				$('<tr><td>无数据</td></tr>').appendTo($tbody);
				return ;
			}
			$(list).each(function(i,item){
				$('<tr><td><a href="#" id="'+item.id+'">'+item.account+'</a></td><td>'+item.name+'</td><td class="hidden-xs">'+item.age+'</td><td>操作</td></tr>').appendTo($tbody);
			});
		},
}