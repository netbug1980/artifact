/**
 * 提示信息
 */
var Message = {
		_buildOpt :function(options){
			if(typeof(options)=="string"){
				var temp = {};
				temp.text = options;
				options = temp;
			}
			return options;
		},
		success :function(options){
			options = Message._buildOpt(options);
			options.clazz = "alert-success";
			return new MessageAlert(options);
		},
		info :function(options){
			options = Message._buildOpt(options);
			options.clazz = "alert-info";
			return new MessageAlert(options);
		},
		warning :function(options){
			options = Message._buildOpt(options);
			options.clazz = "alert-warning";
			return new MessageAlert(options);
		},
		danger :function(options){
			options = Message._buildOpt(options);
			options.clazz = "alert-danger";
			return new MessageAlert(options);
		}
};
function MessageAlert(options) {
	this.defaults = {
			text : "",
			clazz : "alert-success",
			closable : true,
			selfClosing : true
	};
	this.options = $.extend({}, this.defaults, options);
	var $alert = $('<div class="alert alert-dismissible fade in" role="alert">').appendTo($(".layout-message"));
	$alert.addClass(options.clazz);
	if (this.options.closable) {
		$('<button type="button" class="close" data-dismiss="alert" aria-label="Close">\
				<span aria-hidden="true">&times;</span>\
		</button>')
		.appendTo($alert);
	}
	$alert.append(this.options.text);
	if (this.options.closable&&this.options.selfClosing) {
		setTimeout(function(){
			$alert.alert('close');
		},3000);
	}
	return this;
}