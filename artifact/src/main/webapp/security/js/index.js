var nav = {
	title : "系统管理",
	icon : "",
	count:0,
	permission:true,
	link:true,
	childNav : [{
		title : "部门管理",
		icon : "",
		count:0,
		permission:true,
		link:true,
		childNav : [],
		callback : function() {
			//organication Class
			var OrgContent = require('./org');
			var Org = new OrgContent({
				hasHeader:true,
				hasTitle:false,
				hasBtnGroup:true
			});
			Org.$content.addClass('organization');
			Org.init();
			Org.load(1);
		}
	}],
	callback : function() {
		console.log("导航1");
	}
};
window.Layout.Lefter.TopperNav.push(nav);