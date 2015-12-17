(function($){
	jQuery.fn.MyTree = function(options){
		jQuery.fn.getCheckedData = function(){
			var myTree =$(this).data('myTree');
			return myTree.getCheckedData();
		};
		return this.each(function(){
			var $this = $(this);
//			if(!$this.data('MyTree')){
				var myTree = null;
				switch (options.treeType) {
				case 'org':
					myTree = new NovaOrgTree($this,options);
					break;
				default:
					myTree = new NovaOrgTree($this,options);
				break;
				};
				$this.data('myTree',myTree);
//			}
		});
	};
})(jQuery);

/**
 * 抽象树，不可更改
 * 
 */
function AbstractTree($container, options) {
	this.defaults = {
		treeType : 'org',// org:组织机构；user：用户；
		showCheck : false,
		enableSearch : false,
		spread : false,
		spreadLevel : 0,
		checkedData : [],
		data : [ {
			text : '组织机构',
			checkState : false,// 复选框选中状态
			checkable : true,// 是否可用于提取最终结果
			complete : false,// 是否已经加载过
			hasChild : true,
			icon : 'fa fa-sitemap',
			originalData : {
				organizationID : '',
				organizationName : '组织机构'
			},// 原始数据 用于自定义用途 如封装请求参数等 可选
			data : []
		// 子数据 可选
		} ]
	};
	this.options = $.extend({}, this.defaults, options);
	this.init = function() {
		var $obj = this;
		$container.empty();
		var $nova_tree = $('<div>').addClass('abs-tree').appendTo($container);
		if($obj.options.enableSearch){
			$obj.initSearch($nova_tree);
		}
		var $ol = $('<ol>').appendTo($nova_tree);
		$obj.appendChild($ol, this.options.data);
	};
	/**
	 * 初始化搜索框
	 */
	this.initSearch = function($nova_tree){
		var $obj = this;
		$nova_tree.scroll(function(){
			if(this.scrollTop>=$container.find('.abs-tree-search').get(0).offsetHeight){
				$container.find('.abs-tree-search').css('top',this.scrollTop+'px');
			}else{
				$container.find('.abs-tree-search').css('top','0px');
			}
		});
		var $search = $('<div>').addClass('abs-tree-search input-group').appendTo($nova_tree);
		$('<input type="text" placeholder="请输入定位关键字" class="form-control input-sm">').appendTo($search);
		$('<span class="input-group-btn" style="z-index: 2;">\
				<button type="button" class="btn btn-default btn-sm" title="辅助定位">\
				<span class="fa fa-crosshairs"></span>\
				</button>\
				</span>').appendTo($search);
		$search.find('input').keydown(function(e){
			if(this==e.target&&e.keyCode==13){
				$obj.localSearch();
				return false;//处理自动提交form表单问题
			}
		});
		$search.find('button').click(function(){
			$obj.localSearch();
		});
	};
	this.appendChild = function($this, dataArr) {
		var $obj = this;
		var data = $this.data('data');
		var $target;
		if (data) {//非首次append
			data.complete = true;
			$this.data('data', data);
			$target = $this.next();
		} else {//首次append
			$target = $this;
		}
		dataArr.sort(function(a1, a2) {
			return a1.text.localeCompare(a2.text);
		});
		
		$(dataArr).each(function(index, data) {
			var $li = $obj.renderItem(data).appendTo($target);
			
			/**
			 * 某级最后一个节点生成后，处理父级节点复选框状态
			 */

			if ($obj.options.showCheck) {
				if(index==dataArr.length-1){
					$obj.checkParent($li);
				}
			}
			/**
			 * 自动展开
			 */
			if($obj.options.spread){
				var $btn = $li.find('.btn-collapse');
				if($obj.options.spreadLevel==0||$btn.parents('ol').length<=$obj.options.spreadLevel){
					$btn.click();
				}
			}
			var $ol = $('<ol>').appendTo($target);
			if (data.data) {
				$obj.appendChild($ol, data.data);
			}
		});

		if (data) {//非首次append
			if ($target.find('li').length > 0) {
				$obj.collapseClass($this.find('.btn-collapse'), 'minus');
			} else {
				$obj.collapseClass($this.find('.btn-collapse'), 'blank');
			}
		}
	};
	this.renderItem = function(data) {
		var $obj = this;
		var li = $('<li>').data('data', data);
		li.click(function() {
			$obj.liClick($(this));
		}).dblclick(function(event) {// 双击操作
			event.preventDefault();
			event.stopPropagation();
			$obj.collapseClick($(this).find('.btn-collapse'));
		});
		var $btn = $('<i class="fa fa-blank btn-collapse">').appendTo(li)
				.click(function(event) {
					event.preventDefault();
					event.stopPropagation();
					$obj.collapseClick($(this));
				});

		if (data.hasChild) {
			$obj.collapseClass($btn, 'plus');
		}
		if (data.data.length>0) {
			$obj.collapseClass($btn, 'minus');
		}
		// 加入复选框
		if ($obj.options.showCheck) {
			var $check = $('<i class="fa checkbox">').appendTo(li);
			if (data.checkState) {
				$check.addClass("fa-check-square-o");
			} else {
				$check.addClass("fa-square-o");
			}
			$check.click(function(){
				$obj.checkClick($(this).parent());
			});
		}
		$('<i class="' + data.icon + '">').appendTo(li);

		$('<font>').html(data.text).appendTo(li);
		return li;
	};
	/**
	 * 复选框单击事件
	 */
	this.checkClick = function($this){
		var $obj = this;
		$obj.checkboxControl($this);
	};
	/**
	 * 行单击事件
	 */
	this.liClick = function($this) {
		if ($this.is('.active')) {
			$this.removeClass('active');
		} else {
			$container.find('.abs-tree > ol').find('li.active').removeClass(
					'active');
			$this.addClass('active');
		}
	};
	this.localSearchResult = {
			value:'',//搜索关键字
			index:0,//遍历下标
			liIndexArr:[]//搜索命中的li下标数组
	};
	/**
	 * 搜索 并 循环选中某条
	 */
	this.localSearch = function(){
		var $obj = this;
		var value = $container.find('.abs-tree-search').find('input').val().trim();
		if(value!=''){
			if(value!=$obj.localSearchResult.value){
				
				$obj.localSearchResult.value = value;
				$obj.localSearchResult.index = 0;
				$obj.localSearchResult.liIndexArr = [];
				
				$container.find('.abs-tree > ol').find('li:visible').each(function(index,item){
					var text = $(this).text();
					if(text.indexOf(value)>=0){
						$obj.localSearchResult.liIndexArr.push(index);
					}
				});
				if($obj.localSearchResult.liIndexArr.length>0){
					$obj.scrollToLi($obj.localSearchResult.liIndexArr[$obj.localSearchResult.index]);
				}
			}else{
				if($obj.localSearchResult.liIndexArr.length>0){
					$obj.localSearchResult.index = $obj.localSearchResult.index + 1;
					if($obj.localSearchResult.index>=$obj.localSearchResult.liIndexArr.length){
						$obj.localSearchResult.index = 0;
					}
					$obj.scrollToLi($obj.localSearchResult.liIndexArr[$obj.localSearchResult.index]);
				}
			}
		}
	};
	/**
	 * 滚动到目标li位置
	 */
	this.scrollToLi = function(index){
		var container = $container.find('.abs-tree');
		var scrollTo = $($container.find('.abs-tree > ol').find('li:visible')[index]);
		$container.find('.abs-tree > ol').find('li.active').removeClass('active');
		scrollTo.addClass('active');
		$container.find('.abs-tree').animate({
			scrollTop:scrollTo.offset().top - container.offset().top + container.scrollTop() - $container.find('.abs-tree-search').get(0).offsetHeight
		});
	};
	/**
	 * 复选框控制
	 */
	this.checkboxControl = function($this) {
		if ($this.find('.checkbox').hasClass('fa-square-o')
				|| $this.find('.checkbox').hasClass('fa-dot-circle-o')) {// 勾选
			/**
			 * 当前
			 */
			$this.find('.checkbox').removeClass(
					'fa-square-o fa-check-square-o fa-dot-circle-o').addClass(
					'fa-check-square-o');
			/**
			 * 孩子
			 */
			var $next = $this.next();
			$next.find('.checkbox').removeClass(
					'fa-square-o fa-check-square-o fa-dot-circle-o').addClass(
					'fa-check-square-o');

		} else {// 撤销
			/**
			 * 当前
			 */
			$this.find('.checkbox').removeClass(
					'fa-square-o fa-check-square-o fa-dot-circle-o').addClass(
					'fa-square-o');
			/**
			 * 孩子
			 */
			var $next = $this.next();
			$next.find('.checkbox').removeClass(
					'fa-square-o fa-check-square-o fa-dot-circle-o').addClass(
					'fa-square-o');
		}
		
		this.checkParent($this);
		
	};
	/**
	 * 同步更新父节点复选框状态
	 */
	this.checkParent = function($this) {
		var parentPrev = $this.parent().prev();
		if (parentPrev.length > 0) {
			switch (whetherAllChecked($this)) {
			case 1:
				parentPrev.find('.checkbox').removeClass(
						'fa-square-o fa-check-square-o fa-dot-circle-o')
						.addClass('fa-check-square-o');
				break;
			case -1:
				parentPrev.find('.checkbox').removeClass(
						'fa-square-o fa-check-square-o fa-dot-circle-o')
						.addClass('fa-square-o');
				break;

			default:
				parentPrev.find('.checkbox').removeClass(
						'fa-square-o fa-check-square-o fa-dot-circle-o')
						.addClass('fa-dot-circle-o');
				break;
			}
			this.checkParent($this.parent());
		}
		/**
		 * 判断当前节点以及兄弟节点是否全部被选中：0表示部分选中；1表示全部选中；-1表示全部未选中
		 */
		function whetherAllChecked($this) {
			var $parent = $this.parent();
			var l1 = $parent.children('li').length;
			var l2 = $parent.children('li').find('.fa-check-square-o').length;
			var l3 = $parent.children('li').find('.fa-square-o').length;
			if (l1 - l2 == 0) {
				return 1;
			}
			if (l1 - l3 == 0) {
				return -1;
			}
			return 0;
		}
	};
	/**
	 * 展开、关闭、加载逻辑控制
	 */
	this.collapseClick = function($this) {
		var $obj = this;
		var data = $this.closest('li').data('data');
		if (!data.complete) {
			if ('undefined' === typeof $obj.load) {
				console.error('未加载过节点（complete=false），需要提供load函数！');
			} else {
				$obj.load($this.closest('li'));// 调用父类的加载函数
			}

		} else {
			if ($this.hasClass('fa-blank')) {
				return;
			} else if ($this.hasClass('fa-minus-square-o')) {
				$this.closest('li').next().hide();
				$obj.collapseClass($this, 'plus');
			} else if ($this.hasClass('fa-plus-square-o')) {
				$this.closest('li').next().show();
				$obj.collapseClass($this, 'minus');
			}
		}
	};
	/**
	 * 展开、关闭、加载、出错样式控制
	 */
	this.collapseClass = function($this, type) {
		$this
				.removeClass('fa-plus-square-o fa-minus-square-o fa-spinner fa-spin fa-ban fa-blank');
		switch (type) {
		case 'plus':
			$this.addClass('fa-plus-square-o');
			break;
		case 'minus':
			$this.addClass('fa-minus-square-o');
			break;
		case 'blank':
			$this.addClass('fa-blank');
			break;
		case 'loading':
			$this.addClass('fa-spinner').addClass('fa-spin');
			break;
		case 'error':
			$this.addClass('fa-ban');
			break;
		default:
			break;
		}
	};
	/**
	 * 获得选中的数据
	 */
	this.getCheckedData = function() {
		var $obj = this;
		var selectedData = new Array();
		if (!$obj.options.showCheck) {
			selectedData.push($container.find('.active').data('data'));
		} else {
			$container.find('.fa-check-square-o').each(function() {
				if ($(this).parent().data('data').checkable) {
					selectedData.push($(this).parent().data('data'));
				}
			});
		}
		return selectedData;
	};
	this.init();
};

/**
 * 组织机构树
 * 需要实现加载函数load与数据模型渲染函数renderData
 */
function NovaOrgTree($this, options) {
	/**
	 * 数据加载 参数$this表示当前操作行
	 */
	this.load = function($this) {
		var $obj = this;
		$obj.collapseClass($this.find('.btn-collapse'), 'loading');// 显示loading
		var flag = false;
		if ($obj.options.treeType == 'user') {
			flag = true;
		}
		var param = {
			orgID : $this.data('data').originalData.organizationID,// 利用原始数据封装请求参数
			flag : flag
		};
		Proxy.getChildrenOrgAndUser(param, function(resp) {
			if (resp.code !== 0) {
				$obj.collapseClass($this.find('.btn-collapse'), 'error');// 显示error
			} else {
				/**
				 * 展示子部门
				 */
				var orgList = resp.result.organizationList;
				var dataArr = new Array();
				$(orgList).each(function(index, org) {
					org = $obj.renderData(org);
					dataArr.push(org);
				});
				$obj.appendChild($this, dataArr);
				/**
				 * 展示该部门人员
				 */
				if ($obj.options.treeType == 'user') {
					var userList = resp.result.userList;
					var userDataArr = new Array();
					$(userList).each(function(index, user) {
						user.orgId = $this.data('data').value;
						user.orgName = $this.data('data').text;// 特殊逻辑，临时保存所属部门信息:originalData
						user = $obj.renderUserData(user);
						userDataArr.push(user);
					});
					$obj.appendChild($this, userDataArr);
				}
			}
		});
	};
	/**
	 * 数据模型渲染函数
	 */
	this.renderData = function(org) {
		var $obj = this;
		var hasChild = true;
		var complete = false;
		var checkable = true;
		var checkState = false;
		var icon = 'fa ';

		// 默认选中代码
		$($obj.options.checkedData).each(function(index, item) {
			if (item == org.organizationID) {
				checkState = true;
				return;
			}
		});

		if (org.organizationType == '用户组') {
			icon = icon + 'fa-group';
		} else if (org.organizationType == '栏目') {
			icon = icon + 'fa-columns';
			hasChild = false;
			complete = true;
		} else {
			icon = icon + 'fa-sitemap';
		}
		;

		if ($obj.options.treeType == 'user') {
			hasChild = true;
			complete = false;
			checkable = false;
		}
		;
		return {
			text : org.organizationName,
			checkState : checkState,
			checkable : checkable,
			complete : complete,
			hasChild : hasChild,
			icon : icon,
			originalData : org
		// 原始数据
		};
	};
	/**
	 * 渲染用户数据模型
	 */
	this.renderUserData = function(user) {
		var $obj = this;
		// 默认选中代码
		var checkState = false;
		$($obj.options.checkedData).each(function(index, item) {
			if (item == user.userID) {
				checkState = true;
				return;
			}
		});
		return {
			text : user.userName,
			checkState : checkState,
			checkable : true,
			complete : true,
			hasChild : false,
			icon : 'fa fa-user',
			originalData : user
		// 原始数据
		};
	};

	AbstractTree.apply(this, arguments);// 继承至抽象树，一定要放到最后
};

/**
 * 在这里添加新的树类型实现
 * 需要实现加载函数load与数据模型渲染函数renderData
 */

