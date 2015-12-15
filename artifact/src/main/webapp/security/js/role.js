require('../../base/js/jquery.mypopover');
var AjaxProxy = require('../../base/js/ajax-proxy');
function Role(){
	
}
Role.selectPopover = function($btn){
	$btn.MyPopover({
		callback:function(pop){
			var $content = pop.$tip.find('.popover-content-content');
			
			new AjaxProxy({
				url:'/api/security/role/search',
				type:'POST',
				$loadingContainer:$content,
				data:JSON.stringify({}),
				callback:function(res){
					pop.defaultRender(res.result);
				}
			});
			
			var $btn = pop.$tip.find('.popover-content-footer .btn');
			$btn.click(function(){
				pop.destroy();
			});
		}
	});
};

module.exports = Role;