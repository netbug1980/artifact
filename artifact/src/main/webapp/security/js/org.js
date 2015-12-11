require('../../base/js/jquery.buttons');
var Message = require('../../base/js/message');
window.CUR_ORG = null;
module.exports = function OrgContent(options){
	require('../../base/js/content').apply(this, arguments);
	this.$nav=null;
	this.$orgPanel=null;
	this.$userPanel=null;
	this.panelDemo='<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title"></h3><div class="btn-group btn-group-sm pull-right"></div></div><table class="table table-hover table-striped"><tbody></tbody></table></div>';
	this.init=function(){
		var $row = $('<div class="row"></div>').appendTo(this.$container);
		this.$nav = $('<ol class="breadcrumb org">').appendTo(this.$header);
		this.$orgPanel = $(this.panelDemo).addClass('panel-org').appendTo($('<div class="col-md-5"></div>').appendTo($row));
		this.$orgPanel.find('.panel-title').text('部门');
		this.$orgPanel.find('.btn-group').Buttons([{
			clazz:'btn-info',
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
		this.$userPanel = $(this.panelDemo).addClass('panel-user').appendTo($('<div class="col-md-7"></div>').appendTo($row));
		this.$userPanel.find('.panel-title').text('用户');
		this.$userPanel.find('.btn-group').Buttons([{
			clazz:'btn-info',
			glyphicon:'glyphicon-plus',
			text:'用户',
			title:'新增用户',
			data:{},
			callback:function(){
				
			}
		}]);
	};
	this.load=function(orgID){
		var obj = this;
		require("./proxy").getOrg(orgID, function(res){
			var org = res.result;
			//部门路径导航
			obj.buildNav(org);
			//子部门列表
			obj.buildOrg(org.childOrgList);
			//用户列表
			obj.buildUser(org.userList);
			
			CUR_ORG = org;
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
				obj.load(orgID);
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
				clazz:'btn-info',
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
				data:item,
				callback:function(){
					var $btn = $(this);
					var orgid = $btn.data('data').id;
					var orgname = $btn.data('data').name;
					Message.confirm({selfClosing:false,
						text:'确定删除“'+orgname+'”吗？',
						help:'删除会将该部门下的所有子部门和用户一起删除。',
						callback:function(){
							require("./proxy").deleteOrg(orgid, function(res){
								$btn.closest('tr').remove();
							});
						}});
				}
			}]);
		});
		$tbody.find('a[id]').click(function(){
			var orgID = $(this).attr('id');
			obj.load(orgID);
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
				clazz:'btn-info',
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
};
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
	require('../../base/js/content').apply(this, arguments);
	this.$header.find('.btn-group').Buttons([{
		clazz:'btn-primary',
		glyphicon:'glyphicon-floppy-disk',
		text:'保存',
		title:'保存部门',
//		data:{id:item.id},
		callback:function(){
			obj.saveOrUpdate();
		}
	}
//	,{
//		clazz:'btn-warning',
//		glyphicon:'glyphicon-ok',
//		text:'提交',
//		title:'提交部门',
////		data:{id:item.id},
//		callback:function(){
//			
//		}
//	}
	]);
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
		require("./proxy").getOrg(options.id, function(res){
			var org = res.result;
			renderOrg(org);
		});
	}else{
		var org = {
				name:"",
				fullPath:CUR_ORG.fullPath+'/'
		};
		renderOrg(org);
	}
	this.saveOrUpdate = function(){
		var param = {
				id:obj.options.id?obj.options.id:'',
				name:$('#orgInputName').val().trim(),
				parentOrg:{
					id:CUR_ORG.id
				}
		};
		require("./proxy").saveOrUpdateOrg(param,function(res){
			obj.slipOut();
			obj.parent.load(CUR_ORG.id);
		});
	};
	
//	OrgContent.CUR_ORG
}