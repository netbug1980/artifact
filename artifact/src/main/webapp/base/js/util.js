+function($) {
	jQuery.fn.getUID = function(prefix) {
		var $this = $(this);
		do
			prefix += ~~(Math.random() * 1000000);
		while ($this.data(prefix));
		return prefix;
	};
}(jQuery);
+function() {
	// Private array of chars to use
	var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
			.split('');

	Math.uuid = function(len, radix) {
		var chars = CHARS, uuid = [], i;
		radix = radix || chars.length;

		if (len) {
			// Compact form
			for (i = 0; i < len; i++)
				uuid[i] = chars[0 | Math.random() * radix];
		} else {
			// rfc4122, version 4 form
			var r;

			// rfc4122 requires these characters
			uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
			uuid[14] = '4';

			// Fill in random data.  At i==19 set the high bits of clock sequence as
			// per rfc4122, sec. 4.1.5
			for (i = 0; i < 36; i++) {
				if (!uuid[i]) {
					r = 0 | Math.random() * 16;
					uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
				}
			}
		}

		return uuid.join('');
	};
}();
+function() {
	var Sys = {};
	var ua = navigator.userAgent.toLowerCase();
	console.log(ua);
	var s;
	(s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] : "Do nothing";
	(s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] : "Do nothing";
	(s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] : "Do nothing";
	(s = ua.match(/edge\/([\d.]+)/)) ? Sys.edge = s[1] : "Do nothing";
	(s = ua.match(/safari\/([\d.]+)/)) ? Sys.safari = s[1] : (s = ua
			.match(/version\/([\d.]+).*safari/))
			? Sys.safari = s[1]
			: "Do nothing";
	(s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] : "Do nothing";

	//以下进行测试
	if (Sys.ie)
		console.log('IE: ' + Sys.ie);
	if (Sys.firefox)
		console.log('Firefox: ' + Sys.firefox);
	if (Sys.chrome)
		console.log('Chrome: ' + Sys.chrome);
	if (Sys.edge)
		console.log('Edge: ' + Sys.edge);
	if (Sys.opera)
		console.log('Opera: ' + Sys.opera);
	if (Sys.safari)
		console.log('Safari: ' + Sys.safari);
	window.browser = Sys;
}();