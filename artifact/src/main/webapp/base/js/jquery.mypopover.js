(function($) {
	$.fn.MyPopover = function(options){
		return this.each(function(){
			new MyPopover($(this),options);
		});
	};
	function MyPopover($this,options){
		var defaults = {
				showCheck:true,
				checkedArr:[],
				callback:function(popover){
					
				}
		};
		this.options = $.extend({},defaults,options);
		var obj = this;
		var compile = require('../handlebars/popover.handlebars');
		var tpl = compile(this.options);
		$this.attr('data-content',tpl);
		$this.popover({
			html:true,
			placement:'left',
			trigger:'manual'
		});
		/**
		 * 隐藏时销毁
		 */
		$this.on('hidden.bs.popover', function () {
			$(this).popover('destroy');
		});
		
		/**
		 * 显示后绑定事件
		 */
		$this.on('shown.bs.popover', function () {
			var popover = $this.data('bs.popover');
			var $tip = popover.$tip;
			var $content = $tip.find('.popover-content-content');
			$([document.body,window]).on('mousedown.popover',function arguments_calleeasd() {
				$this.popover('destroy');
				$([document.body,window]).off('mousedown.popover',arguments_calleeasd);
			});
			$('.popover').on('mousedown.popover',function (event) {
				event.stopPropagation();
			});
			/**
			 * 关闭按钮
			 */
			var $close = $('<button type="button" class="close" aria-label="Close"><span aria-hidden="true">×</span></button>').appendTo($tip.find('.popover-title'));
			$close.click(function(){
				popover.destroy();
			});
			
			/**
			 * 全选按钮
			 */
			if(obj.options.showCheck){
				var $btn = $tip.find('.popover-content-footer .btn-check');
				$btn.click(function(){
					var $gly = $(this).find('.glyphicon');
					if($gly.hasClass('glyphicon-unchecked')){
						$gly.removeClass('glyphicon-unchecked');
						$gly.addClass('glyphicon-check');
						$content.find('li .glyphicon').removeClass('glyphicon-unchecked glyphicon-check').addClass('glyphicon-check');
					}else{
						$gly.removeClass('glyphicon-check');
						$gly.addClass('glyphicon-unchecked');
						$content.find('li .glyphicon').removeClass('glyphicon-unchecked glyphicon-check').addClass('glyphicon-unchecked');
					}
				});
			}
			/**
			 * 默认渲染方法
			 */
			popover.defaultRender = function(data){

				var compile = require('../handlebars/popover-li.handlebars');
				var res = {
						data:data,
						showCheck:obj.options.showCheck,
						checkedArr:obj.options.checkedArr
				};
				var helperOptions = {
						helpers : {
								isExist:function(value,arr,options) {
									for(var i in arr){
										if(value==arr[i]){
											return options.fn(this);
										}
									}
									return options.inverse(this);
								}
						}
						
				};
				var html = compile(res,helperOptions);
				$content.append(html);
				$content.find('li').click(function(){
					$content.find('li').removeClass('active');
					$(this).addClass('active');
					if(obj.options.showCheck){
						var $gly = $(this).find('.glyphicon');
						if($gly.hasClass('glyphicon-unchecked')){
							$gly.removeClass('glyphicon-unchecked');
							$gly.addClass('glyphicon-check');
						}else{
							$gly.removeClass('glyphicon-check');
							$gly.addClass('glyphicon-unchecked');
						}
					}
				});
			};
			
			/**
			 * 默认取值方法
			 */
			popover.defaultGetData = function(){
				function getData($li){
					return {id:$li.attr('id'),name:$li.text()};
				};
				if(obj.options.showCheck){
					return $content.find('.glyphicon-check').map(function(){
						var $li = $(this).parent();
						return getData($li);
					}).get();
				}else{
					if($content.find('.active').length>0){
						return getData($content.find('.active'));
					}else{
						return null;
					}
				}
			};
			
			//显示后处理自定义回调
			if(obj.options.callback){
				obj.options.callback(popover);
			}
		});
		
		$this.popover('toggle');
	}
})(jQuery);