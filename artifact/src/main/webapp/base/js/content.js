function AbstractContent(options){
	var obj = this;
	this.defaults = {
			hasHeader:true,
			hasTitle:true,
			hasBtnGroup:true
	};
	this.options = $.extend({},this.defaults,options);
	this.parent = null;
	this.$content = $('<div class="content">').appendTo('.layout-container');
	if(this.$content.prev().length>0){
		this.parent = this.$content.prev().data('content');//当前内容的父内容，用于操作父内容
	}else{
		this.$content.addClass('in');
	}
	
	if(this.options.hasHeader){
		var $header = $('<div class="content-header">').appendTo(this.$content);
		this.$header = $header;
		if(this.options.hasTitle){
			$('<span class="title">').appendTo($header);
		}
		if(this.options.hasBtnGroup){
			$('<div role="group" class="btn-group pull-right">').appendTo($header);
		}
		
	}
	this.$container = $('<div class="content-container">').appendTo(this.$content);
	this.slipIn = function(){
		obj.$content.removeClass('in out');
		obj.$content.addClass('in');
		if($('.layout-container').find('.content').length>1){
			Layout.Backer.Stack.push({
				callback : function() {
					obj.slipOut(true);
				},
				type : Layout.Backer.Type.CONTENT
			});
			
			$("#btn_nav_back").removeClass("invisible");
		}
	};
	this.slipOut = function(flag){
		obj.$content.removeClass('in out');
		obj.$content.addClass('out');
		setTimeout(function(){
			if(!flag){
				Layout.Backer.clickFun(false);
			}
			obj.$content.remove();
		}, 350);
	};
	this.$content.data('content',obj);
	return this;
}