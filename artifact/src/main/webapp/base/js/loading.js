(function($){
	jQuery.fn.Loading = function(uuid){
		jQuery.fn.progress = function(uuid,width){
			var loading =$(this).data(uuid);
			return loading.progress(width);
		};
		jQuery.fn.success = function(uuid){
			var loading =$(this).data(uuid);
			return loading.success();
		};
		jQuery.fn.warning = function(uuid){
			var loading =$(this).data(uuid);
			return loading.warning();
		};
		jQuery.fn.danger = function(uuid){
			var loading =$(this).data(uuid);
			return loading.danger();
		};
		jQuery.fn.removeLoading = function(uuid){
			var loading =$(this).data(uuid);
			$(this).removeData(uuid);
			return loading.remove();
		};
		return this.each(function(){
			var $this = $(this);
			var loading = new Loading($this,null);
			$this.data(uuid,loading);
		});
	};
})(jQuery);
function Loading($container,options){
	var obj = this;
	this.defaults = {
			
	};
	this.options = $.extend({},this.defaults,options);
	this.progress = function(width){
		obj._$progressBar.width(width);
	},
	this.remove = function(){
		this._$progressBar.parent().remove();
	};
	this.info = function(){
		this._$progressBar.removeClass("progress-bar-success progress-bar-info progress-bar-warning progress-bar-danger");
		this._$progressBar.addClass("progress-bar-info");
	};
	this.success = function(){
		this._$progressBar.removeClass("progress-bar-success progress-bar-info progress-bar-warning progress-bar-danger");
		this._$progressBar.addClass("progress-bar-success");
	};
	this.warning = function(){
		this._$progressBar.removeClass("progress-bar-success progress-bar-info progress-bar-warning progress-bar-danger");
		this._$progressBar.addClass("progress-bar-warning");
	};
	this.danger = function(){
		this._$progressBar.removeClass("progress-bar-success progress-bar-info progress-bar-warning progress-bar-danger");
		this._$progressBar.addClass("progress-bar-danger");
	};
	this._$progressBar = $('<div class="progress-bar progress-bar-info progress-bar-striped active" role="progressbar">').appendTo($('<div class="progress loading">').prependTo($container));
}