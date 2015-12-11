require('./base/js/index');
require('./security/js/index');

$(function() {
	Layout.Lefter.build(false);
	$("#btn_layout").click(function(e) {
		if(!$(".layout").hasClass("in")&&!$(".layout").hasClass("out")){
			if($(window).width() >= 768){//大屏
				$(".layout").addClass("out");
			}else{//小屏
				$(".layout").addClass("in");
			}
		}else{
			if ($(".layout").hasClass("in")) {
				$(".layout").removeClass("in");
				$(".layout").addClass("out");
			} else {
				$(".layout").removeClass("out");
				$(".layout").addClass("in");
			}
		}
	});
	$("#btn_nav_back").click(function(){
		Layout.Backer.clickFun(true);
	});
	console.log($(window).width());
});
