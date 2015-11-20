(function($){
	$.fn.Buttons = function(buttons){
		return this.each(function(){
			var $this = $(this);
			$this.empty();
			new Buttons($this,buttons);
		});
	};
	Buttons.LENGTH = 1;
	Buttons.DROPDOWM_BTN = '\
		<button type="button" class="btn btn-link visible-xs-block dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
			<span class="glyphicon glyphicon-option-vertical"></span>\
		</button>\
		';
	Buttons.DROPDOWM_UL = '\
		<ul class="dropdown-menu pull-right">\
		</ul>\
		';
	function Buttons($container,buttons){
		var obj = this;
		this.buttonDemo = {
				clazz:'btn-primary',
				glyphicon:'glyphicon-question-sign',
				text:'',
				title:'',
				data:{},
				callback:function(){
					
				}
		};
		this.buildBtn = function(item){
			var $btn = $('<button>').addClass('btn '+item.clazz).attr('title',item.title?item.title:item.text).appendTo($container);
			$btn.append('<span')
			$('<span>').addClass('glyphicon '+ item.glyphicon).appendTo($btn);
			$btn.append(' '+item.text);
			$btn.data('data',item.data);
			$btn.click(item.callback());
			return $btn;
		};
		this.buildLi = function($ul,item){
			var $li = $('<li>').appendTo($ul);
			var $a = $('<a href="#">').appendTo($li).attr('title',item.title?item.title:item.text);
			$('<span>').addClass('glyphicon '+ item.glyphicon).appendTo($a);
			$('<font>').addClass('add-title').text(' '+item.text).appendTo($a);
			$li.data('data',item.data);
			$li.click(item.callback());
			return $li;
		};
		if(buttons instanceof Array){
			buttons = $(buttons).map(function(i,item){
				return $.extend({},obj.buttonDemo,item);
			}).get();
			if(buttons.length<=Buttons.LENGTH){//如果按钮个数较少直接显示
				$(buttons).each(function(i,item){
					obj.buildBtn(item);
				});
			}else{//如果按钮个数较多，考虑响应式
				var $dropdown_ul = $(Buttons.DROPDOWM_UL).appendTo($container);
				$(buttons).each(function(i,item){
					if(i<Buttons.LENGTH-1){
						obj.buildBtn(item);
					}else{
						obj.buildBtn(item).addClass('hidden-xs');
						obj.buildLi($dropdown_ul, item);
					}
				});
				$(Buttons.DROPDOWM_BTN).appendTo($container); 
			}
		}
		
	}
})(jQuery);