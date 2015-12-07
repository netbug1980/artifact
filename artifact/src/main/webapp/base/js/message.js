/**
 * 提示信息
 */
module.exports = {
		_buildOpt :function(options){
			if(typeof(options)=="string"){
				var temp = {};
				temp.text = options;
				options = temp;
			}
			return options;
		},
		success :function(options){
			options = this._buildOpt(options);
			options.clazz = "alert-success";
			return new MessageAlert(options);
		},
		info :function(options){
			options = this._buildOpt(options);
			options.clazz = "alert-info";
			return new MessageAlert(options);
		},
		warning :function(options){
			options = this._buildOpt(options);
			options.clazz = "alert-warning";
			return new MessageAlert(options);
		},
		confirm :function(options){
			options = this._buildOpt(options);
			options.clazz = "alert-warning";
			options.title = options.text;
			options.text = '';
			var message =   new MessageAlert(options);
			$('<h4>').html(options.title).appendTo(message.$alert);
			if(options.help){
				$('<p>').html(options.help).appendTo(message.$alert);
			}
			var $btns = $('<p style="text-align: right;">').appendTo(message.$alert);
			$('<button type="button" class="btn btn-default">取消</button>').appendTo($btns).click(function(){
				message.$alert.alert('close');
			});
			$('<button type="button" class="btn btn-warning">确定</button>').appendTo($btns).click(function(){
				message.$alert.alert('close');
				options.callback();
			});
			return message;
		},
		danger :function(options){
			options = this._buildOpt(options);
			options.clazz = "alert-danger";
			return new MessageAlert(options);
		}
};
function MessageAlert(options) {
	var obj = this;
	this.defaults = {
			text : "",
			help : "",//confirm
			clazz : "alert-success",
			closable : true,
			selfClosing : true,
			callback:function(){}//confirm
	};
	this.options = $.extend({}, this.defaults, options);
	this.$alert = $('<div class="alert alert-dismissible fade in" role="alert">').appendTo($(".layout-message"));
	this.$alert.addClass(options.clazz);
	if (this.options.closable) {
		$('<button type="button" class="close" data-dismiss="alert" aria-label="Close">\
				<span aria-hidden="true">&times;</span>\
		</button>')
		.appendTo(this.$alert);
	}
	this.$alert.append(this.options.text);
	if (this.options.closable&&this.options.selfClosing) {
		setTimeout(function(){
			obj.$alert.alert('close');
		},3000);
	}
	return this;
}