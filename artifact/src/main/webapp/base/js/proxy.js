var Proxy = {
	project : '/artifact',
	login: function(user, callback){
		$.ajax({
			url		: Proxy.project+'/login',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			dataType: 'json',
			data	: JSON.stringify(user),
			success	: function(response){
				switch (response.code) {
					case 0 :{
						sessionStorage.currentSession = JSON.stringify(response.result);
						break;
					}
						
					default :{
						
						break;
					}
				}
			}
		});
	}
};

$.ajaxSetup({
	beforeSend: function(jqXHR, settings) {
		try {
			var session = sessionStorage.currentSession;
			if(!!session) {
				session = JSON.parse(session);
				var CsrfToken = session["org.artifact.security.intercept.LoginSuccessHandlerCsrfImpl.CSRF_TOKEN"];
				if(!!CsrfToken){
					jqXHR.setRequestHeader(CsrfToken.headerName, CsrfToken.token);
				}
				jqXHR.setRequestHeader('Accept', 'application/json');
//				jqXHR.setRequestHeader('sessionID', session.sessionID);
//				jqXHR.setRequestHeader('userID', session.userID);
//				jqXHR.setRequestHeader('userName', encodeURIComponent(session.userName));
				return true;
			} else {
				Message.show('本地会话为空，你还没有登录吧？请求就不发给服务端啦！', {cls : 'warning', closable: true});
				return false;
			}
		} catch(e) {
			Message.show('解析本地会话出错啦，请求发不到服务端啦，刷新下试试吧', {cls : 'danger', closable: true});
			return false;
		}
	},
//	jqXHR.readyState
//	0 (未初始化)： (XMLHttpRequest)对象已经创建，但还没有调用open()方法。
//	1 (载入)：已经调用open() 方法，但尚未发送请求。
//	2 (载入完成)： 请求已经发送完成。
//	3 (交互)：可以接收到部分响应数据。
//	4 (完成)：已经接收到了全部数据，并且连接已经关闭。
	error : function(jqXHR, textStatus, errorThrown) {
		if(jqXHR.status === 403) {
			if(jqXHR.getResponseHeader('Location')) {
				top.location.href = jqXHR.getResponseHeader('Location');
			} else {
				Message.danger('会话过期啦，要重新登录哦');
				Proxy.showLogin();
			}
			return;
		}
		switch(textStatus) {
		case null:
			// 这种情况还未遇到过
			errorThrown = (errorThrown == '') ? 'jQuery.ajax返回的错误状态值是null，我们也不知道发生了什么' : errorThrown;
			Message.show('出错啦:' + errorThrown,
					{cls : 'danger', closable: true});
			break;
		case "timeout":
			Message.show('啊哦，连接超时啦，呆会再试试吧', {cls : 'warning'});
			break;
		case "error":
			// 'Not Found'基本不会发生，除非请求地址写错了
			// 'Internal Server Error'基本不会发生，除非服务端Controller没catch Throwable
			if(errorThrown === 'Not Found' || errorThrown === 'Internal Server Error') {
				// NO-OP
			} else if(jqXHR.readyState === 0) {
				Message.show('请求没成功，可能的错误有：1.失去网络连接,2.域名解析错误啦,3.跨域访问了,4.请求建立超时了',
						{cls : 'danger', closable: true});
			} else {
				errorThrown = (errorThrown == '') ? 'sorry, jQuery也没有给提示信息' : errorThrown;
				Message.show('出现了未知错误:' + errorThrown, {cls : 'danger', closable: true});
			}
			break;
		case "abort":
			// NO-OP
			// Message.show('客户端取消', {cls : 'danger'});
			break;
		case "parsererror":
			Message.show('啊哦，返回的数据解析不了啦，找程序员吧', {cls : 'danger'});
			break;
		}
	},
//	statusCode
//	100——客户必须继续发出请求
//	101——客户要求服务器根据请求转换HTTP协议版本
//
//	200——成功
//	201——提示知道新文件的URL
//
//	300——请求的资源可在多处得到
//	301——删除请求数据
//
//	404——没有发现文件、查询或URl
//	500——服务器产生内部错误
	statusCode : {
		404 : function() {
			Message.show('后台请求的地址不对哦', {cls : 'danger', closable: true});
		},
		500 : function() {
			Message.show('后台服务出错啦，联系网络运维人员吧', {cls : 'danger', closable: true});
		}
	}
});
