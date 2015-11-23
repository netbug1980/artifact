var Proxy = {
	login : function(user, callback) {
		new AjaxProxy({
			url : '/login',
			type : 'POST',
			data : JSON.stringify(user),
//			$loadingContainer:$('#singleModal .modal-body'),
			callback : function(response) {
				switch (response.code) {
					case 0 : {
						sessionStorage.currentSession = JSON
								.stringify(response.result);
						//还原之前需要登录的请求
						while(AjaxProxy.ajaxStack.length>0){
							AjaxProxy.ajaxStack.pop().start();
						}
					}
					default : {
						callback(response);
						break;
					}
				}
			}
		});
	},
	logout : function(callback) {
		new AjaxProxy({
			url : '/logout',
			type : 'POST',
//			$loadingContainer:$('#singleModal .modal-body'),
			callback : callback
		});
	},
	getOrg : function(orgID,cache,callback){
		new AjaxProxy({
			url:'/api/security/organization/get/'+orgID,
			type:'GET',
			cache:cache,
			callback:callback
		});
	},
	saveOrUpdateOrg : function(param,callback){
		new AjaxProxy({
			url:'/api/security/organization/saveorupdate',
			type:'POST',
			data:JSON.stringify(param),
			callback:callback
		});
	}
};
AjaxProxy.project = '/artifact';
AjaxProxy.ajaxStack = new Array();
function AjaxProxy(options) {
	this.defaults = {
		url : '',
		type : 'POST',
		async : true,
		cache : false,
		contentType : 'application/json; charset=UTF-8',
		dataType : 'json',
		timeout : 8000,
		data : null,
		$loadingContainer : $('.layout-message'),
		callback : function(response) {
			
		}
	};
	this.options = $.extend({}, this.defaults, options);
	var obj = this;
	var $loadingContainer = obj.options.$loadingContainer;
	var uuid = $loadingContainer.getUID('loading');
	this.options.url = AjaxProxy.project + this.options.url;
	this.options.xhr = function() {
		/* 创建增强了得XMLHttpRequest对象 */
		var xhr = null;
		if (window.ActiveXObject) {
			xhr = new ActiveXObject("Microsoft.XMLHTTP");
		} else if (window.XMLHttpRequest) {
			xhr = new XMLHttpRequest();
		}
		$loadingContainer.Loading(uuid);// Loading初始化
		var percent = 21;
		var intervalId = null;
		var timeoutId1 = null;
		var timeoutId2 = null;
		xhr.onreadystatechange = function() {
			switch (xhr.readyState) {
				case 0 : { // (未初始化)：(XMLHttpRequest)对象已经创建，但还没有调用open()方法。
					$loadingContainer.progress(uuid, "0%");
					break;
				}
				case 1 : { // （载入）已调用send()方法，正在发送请求
					$loadingContainer.progress(uuid, "20%");
					intervalId = setInterval(function(){
						$loadingContainer.progress(uuid, percent+"%");
						percent = percent + 1;
					},parseInt(obj.options.timeout/60));
					timeoutId1 = setTimeout(function(){
						$loadingContainer.warning(uuid);
					},parseInt(obj.options.timeout*0.8));
					timeoutId2 = setTimeout(function(){
						window.clearInterval(intervalId);
					},obj.options.timeout);
					break;
				}
				case 2 : { // （载入完成）send()方法执行完成，已经接收到全部响应内容
					window.clearInterval(intervalId);
					window.clearTimeout(timeoutId1);
					window.clearTimeout(timeoutId2);
					$loadingContainer.progress(uuid, "80%");
					break;
				}
				case 3 : { // 正在解析响应内容
					$loadingContainer.progress(uuid, "90%");
					break;
				}
				case 4 : { // 响应内容解析完成，可以在客户端调用了
					$loadingContainer.progress(uuid, "100%");
					break;
				}
				default :
					break;
			}
		};
		return xhr;
	};
	this.options.complete = function(xhr, text) {
		setTimeout(function() {
			$loadingContainer.removeLoading(uuid);
		}, 600);
	};
	this.options.success = function(response) {
		$loadingContainer.success(uuid);
		switch (response.code) {
			case -1 : {//服务器错误
				Message.danger(response.message);
				break;
			}
			case -22 : {//没有登录
				AjaxProxy.ajaxStack.push(obj);
				Message.danger(response.message);
				break;
			}
			case -30 : {//Session失效
				AjaxProxy.ajaxStack.push(obj);
				Message.danger(response.message);
				break;
			}
			case -31 : {//Session过期，您已在别处登陆
				Message.danger(response.message);
				break;
			}
			case -40 : {//权限拒绝
				Message.danger(response.message);
				break;
			}
			case -41 : {//CSRF
				Message.danger(response.message);
				break;
			}
			default : {
				obj.options.callback(response);
				break;
			}
		}
	};
	this.options.error = function(jqXHR, textStatus, errorThrown) {
		$loadingContainer.danger(uuid);
		switch (textStatus) {
			case null :
				// 这种情况还未遇到过
				errorThrown = (errorThrown == '')
						? 'jQuery.ajax返回的错误状态值是null，我们也不知道发生了什么'
						: errorThrown;
				Message.danger('出错啦:' + errorThrown);
				break;
			case "timeout" :
				Message.danger('啊哦，连接超时啦，呆会再试试吧');
				break;
			case "error" :
				// 'Not Found'基本不会发生，除非请求地址写错了
				// 'Internal Server Error'基本不会发生，除非服务端Controller没catch
				// Throwable
				if (errorThrown === 'Not Found'
						|| errorThrown === 'Internal Server Error') {
					// NO-OP
				} else if (jqXHR.readyState === 0) {
					Message
							.danger('请求没成功，可能的错误有：1.失去网络连接,2.域名解析错误啦,3.跨域访问了,4.请求建立超时了');
				} else {
					errorThrown = (errorThrown == '')
							? 'sorry, jQuery也没有给提示信息'
							: errorThrown;
					Message.danger('出现了未知错误:' + errorThrown);
				}
				break;
			case "abort" :
				// NO-OP
				Message.warning('客户端取消');
				break;
			case "parsererror" :
				Message.danger('啊哦，返回的数据解析不了啦，找程序员吧');
				break;
		}
	};
	this.start = function(){
		$.ajax(obj.options);
	};
	this.start();
}

$.ajaxSetup({
			beforeSend : function(jqXHR, settings) {
				var session = sessionStorage.currentSession;
				if (!!session) {
					session = JSON.parse(session);
					var CsrfToken = session["CSRF_TOKEN"];
					if (!!CsrfToken) {
						jqXHR.setRequestHeader(CsrfToken.headerName,
								CsrfToken.token);
					}
					jqXHR.setRequestHeader('Accept', 'application/json');
					// jqXHR.setRequestHeader('sessionID', session.sessionID);
					// jqXHR.setRequestHeader('userID', session.userID);
					// jqXHR.setRequestHeader('userName',
					// encodeURIComponent(session.userName));

				}
				jqXHR.setRequestHeader('Cache-Control', 'public');
				return true;
			},
			statusCode : {
				// statusCode
				// 100——客户必须继续发出请求
				// 101——客户要求服务器根据请求转换HTTP协议版本
				//
				// 200——成功
				// 201——提示知道新文件的URL
				//
				// 300——请求的资源可在多处得到
				// 301——删除请求数据
				//
				// 404——没有发现文件、查询或URl
				// 500——服务器产生内部错误
				403 : function() {
					Message.danger('会话过期啦，要重新登录哦');
				},
				404 : function() {
					Message.danger('后台请求的地址不对哦');
				},
				500 : function() {
					Message.danger('后台服务出错啦，联系网络运维人员吧');
				}
			}

		});
