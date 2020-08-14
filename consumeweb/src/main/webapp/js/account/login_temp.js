garen_define("js/account/login_temp",function (jqObj,loadParams) {
	
	var mainUI = {
		eName:"div",
		cssStyle:"margin-top:50px;",
		elements:[{
			eName:"linkbutton",
			width:80,
			height:35,
			cssStyle:"margin-right:20px;",
			text:"admin",
			onClick:function(){
				loginTemp("admin");
			}
		}]
	}
	
	jqObj.loadUI(mainUI);
	
	//默认admin
	loadInit();
	function loadInit(){
		param = {};
		param['user_name'] = "admin";
		$.postEx("account/login.do",param,function(retJson){
			
		});
	}
	
	function loginTemp(user_name){
		param = {};
		param['user_name'] = user_name || "admin";
		$.postEx("account/login.do",param,function(retJson){
			$.alert("登录成功！");
		});
	}
});