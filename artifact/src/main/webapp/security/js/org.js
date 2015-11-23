OrgContent.CUR_ORG = null;
function OrgContent(options){
	AbstractContent.apply(this, arguments);
	this.$nav=null;
	this.$orgPanel=null;
	this.$userPanel=null;
	this.panelDemo='<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title"></h3><div class="btn-group btn-group-sm pull-right"></div></div><table class="table table-hover table-striped"><tbody></tbody></table></div>';
	this.init=function(){
		this.$nav = $('<ol class="breadcrumb org">').appendTo(this.$header);
		this.$orgPanel = $(this.panelDemo).addClass('panel-org').appendTo(this.$container);
		this.$orgPanel.find('.panel-title').text('部门');
		this.$orgPanel.find('.btn-group').Buttons([{
			clazz:'btn-primary',
			glyphicon:'glyphicon-plus',
			text:'部门',
			title:'新增子部门',
			data:{},
			callback:function(){
				new OrgDetailContent({
					hasHeader:true,
					hasTitle:true,
					hasBtnGroup:true
				});
			}
		}]);
		this.$userPanel = $(this.panelDemo).addClass('panel-user').appendTo(this.$container);
		this.$userPanel.find('.panel-title').text('用户');
		this.$userPanel.find('.btn-group').Buttons([{
			clazz:'btn-primary',
			glyphicon:'glyphicon-plus',
			text:'用户',
			title:'新增用户',
			data:{},
			callback:function(){
				
			}
		}]);
	};
	this.load=function(orgID,cache){
		var obj = this;
		Proxy.getOrg(orgID,cache, function(res){
			var org = res.result;
			//部门路径导航
			obj.buildNav(org);
			//子部门列表
			obj.buildOrg(org.childOrgList);
			//用户列表
			obj.buildUser(org.userList);
			
			OrgContent.CUR_ORG = org;
		});
	};
	this.buildNav=function(org){
		var obj = this;
		if(this.$nav.find('#'+org.id).length>0){
			this.$nav.find('#'+org.id).nextAll().remove();
		}else{
			var $li = $('<li id="'+org.id+'"><a href="#">'+org.name+'</a></li>').appendTo(this.$nav);
			$li.click(function(){
				var orgID = $(this).attr('id');
				obj.load(orgID,true);
			});
		}
	};
	this.buildOrg=function(list){
		var obj = this;
		var $tbody = this.$orgPanel.find('tbody').empty();
		if(list.length==0){
			$('<tr><td>无数据</td></tr>').appendTo($tbody);
			return ;
		}
		$(list).each(function(i,item){
			var $tr = $('<tr><td><a href="#" id="'+item.id+'">'+item.name+'</a></td><td><div class="btn-group btn-group-xs pull-right"></div></td></tr>').appendTo($tbody);
			$tr.find('.btn-group').Buttons([{
				clazz:'btn-link',
				glyphicon:'glyphicon-edit',
				text:'部门',
				title:'修改部门',
				data:{id:item.id},
				callback:function(){
					new OrgDetailContent({
						hasHeader:true,
						hasTitle:true,
						hasBtnGroup:true,
						id:$(this).data('data').id
					});
				}
			},{
				clazz:'btn-danger',
				glyphicon:'glyphicon-remove',
				text:'部门',
				title:'删除部门',
				data:{id:item.id},
				callback:function(){
					
				}
			}]);
		});
		$tbody.find('a[id]').click(function(){
			var orgID = $(this).attr('id');
			obj.load(orgID,false);
		});
	};
	this.buildUser=function(list){
		var $tbody = this.$userPanel.find('tbody').empty();
		if(list.length==0){
			$('<tr><td>无数据</td></tr>').appendTo($tbody);
			return ;
		}
		$(list).each(function(i,item){
			var roles = $(item.userRoleList).map(function(i,userRole){
				if(i<3)
					return userRole.role.name;
			}).get().join(',');
			if(item.userRoleList.length>3){
				roles += '…';
			}
			var $tr = $('<tr><td><a href="#" id="'+item.id+'">'+item.account+'</a></td><td>'+item.name+'</td><td class="hidden-xs">'+item.age+'</td><td class="hidden-xs">'+roles+'</td><td><div class="btn-group btn-group-xs pull-right"></div></td></tr>').appendTo($tbody);
			$tr.find('.btn-group').Buttons([{
				clazz:'btn-link',
				glyphicon:'glyphicon-edit',
				text:'用户',
				title:'修改用户',
				data:{id:item.id},
				callback:function(){
					
				}
			},{
				clazz:'btn-danger',
				glyphicon:'glyphicon-remove',
				text:'用户',
				title:'删除用户',
				data:{id:item.id},
				callback:function(){
					
				}
			}]);
		});
	};
}
OrgDetailContent.DEMO = '\
	<form>\
	  <div class="form-group">\
		<label for="orgInputName">部门名称</label>\
		<input type="text" class="form-control" id="orgInputName" placeholder="名称" value="${name}">\
		</div>\
		<div class="form-group">\
		<label for="orgInputFullPath">全路径</label>\
		<input type="text" readonly class="form-control" id="orgInputFullPath" placeholder="全路径" value="${fullPath}">\
		</div>\
	</form>';
function OrgDetailContent(options){
	var obj = this;
	var demo = OrgDetailContent.DEMO;
	AbstractContent.apply(this, arguments);
	this.$header.find('.btn-group').Buttons([{
		clazz:'btn-primary',
		glyphicon:'glyphicon-floppy-disk',
		text:'保存',
		title:'保存部门',
//		data:{id:item.id},
		callback:function(){
			obj.saveOrUpdate();
		}
	},{
		clazz:'btn-warning',
		glyphicon:'glyphicon-ok',
		text:'提交',
		title:'提交部门',
//		data:{id:item.id},
		callback:function(){
			
		}
	}]);
	var title = '新增';
	if(options.id){
		title = '编辑';
	}
	this.$header.find('.title').text(title+'部门');
	function renderOrg(org){
		for(var key in org){
			demo = demo.replace('${'+key+'}',(org[key]?org[key]:''));;
		}
		obj.$container.html(demo);
		$('#orgInputName').change(function(){
			var arr = $("#orgInputFullPath").val().split('/');
			arr[arr.length-1]=$(this).val();
			$("#orgInputFullPath").val(arr.join('/'));
			//TODO ajax部门名称判重
		});
		obj.slipIn();
	}
	if(options.id){
		Proxy.getOrg(options.id,false, function(res){
			var org = res.result;
			renderOrg(org);
		});
	}else{
		var org = {
				name:"",
				fullPath:OrgContent.CUR_ORG.fullPath+'/'
		};
		renderOrg(org);
	}
	this.saveOrUpdate = function(){
		var param = {
				id:obj.options.id?obj.options.id:'',
				name:$('#orgInputName').val().trim(),
				parentOrg:{
					id:OrgContent.CUR_ORG.id
				}
		};
		Proxy.saveOrUpdateOrg(param,function(res){
			obj.slipOut();
			obj.parent.load(OrgContent.CUR_ORG.id,false);
		});
	};
	
//	OrgContent.CUR_ORG
}