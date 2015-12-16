require('../../base/js/jquery.mypopover');
var AjaxProxy = require('../../base/js/ajax-proxy');
var Message = require('../../base/js/message');
function Role(){
	
}
Role.selectPopover = function(options){
	var defaults = {
			$btn:$('button'),
			checkedArr:[],
			callback:function(data){
				console.log(data);
			}
	};
	var options = $.extend({},defaults,options);
	options.$btn.MyPopover({
		checkedArr : options.checkedArr,
		callback : function(pop) {
			var $content = pop.$tip.find('.popover-content-content');

			new AjaxProxy({
				url : '/api/security/role/search',
				type : 'POST',
				$loadingContainer : $content,
				data : JSON.stringify({})
			}).done(function(res) {
				pop.defaultRender(res.result);// 调用默认的pop渲染方法
			});

			var $btn = pop.$tip.find('.popover-content-footer .btn-ok');
			$btn.click(function() {
				var dataArr = pop.defaultGetData();// 调用默认的pop取值方法
				if (dataArr && dataArr.length > 0) {
					options.callback(dataArr);
					pop.destroy();
				} else {
					Message.warning('请选择角色');
				}
			});
		}
	});
};

Role.buildTr = function(roles){
	var compile = require('../handlebars/role-tr.handlebars');
	return compile({data:roles});
};

module.exports = Role;