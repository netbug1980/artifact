function Permission() {
	this.root = [ {
		text : '权限控制',
		checkState : false,
		checkable : false,
		complete : true,
		hasChild : false,
		icon : 'fa fa-lock',
		originalData : {
			id : '',
			path : ''
		},
		data : []
	} ];
}
Permission.prototype.renderData = function(node, pmsList) {
	var regStr = '';
	regStr = '^'
			+ (node.originalData.path).replace(new RegExp('\/', 'g'), '\/')
			+ '\/[^\/]*';
	var regExp = new RegExp(regStr);
	var data = new Array();
	var last = '';
	for (var i = 0; i < pmsList.length; i++) {
		if (regExp.test(pmsList[i].path)) {
			var temp = regExp.exec(pmsList[i].path)[0];
			var arr = temp.split('/');
			var newNode = {
				text : arr[arr.length - 1],
				checkState : false,
				checkable : false,
				complete : true,
				hasChild : false,
				icon : 'fa fa-object-group',
				originalData : {
					id : pmsList[i].id,
					path : temp
				},
				data : []
			};
			if (temp == pmsList[i].path) {
				newNode.checkable = true;
				newNode.icon = 'fa fa-file-o';
				// newNode.checkState = true;
				pmsList.splice(i, 1);
				i--;
			}
			if (last != temp) {
				data.push(newNode);
				last = temp;
			}
		}
	}
	if (data.length > 0) {
		node.hasChild = true;
		node.data = data;
	}
	for ( var i in data) {
		this.renderData(data[i], pmsList);
	}
};
Permission.structTreeData = function(pmsList) {
	var p = new Permission();
	p.renderData(p.root[0], pmsList);
	return p.root;
};

module.exports = Permission;
