
//刷新页面
garen_define("js/lib/scmurl",function (require, exports, module) {
	
	var url='';
	
	function getQueryString(name) { 
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
		var r = window.location.search.substr(1).match(reg); 
		if (r != null) return unescape(r[2]); return null; 
	} 
	
	try { 
		url = window.top.location.href;//IE
	} catch(e) { 
		url = "http://" + getQueryString("wtop") + "/BS_manage.asp";//谷歌火狐跨域
	} 
	return url;
});
