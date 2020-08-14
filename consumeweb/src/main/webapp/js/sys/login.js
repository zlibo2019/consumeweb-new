
//加载初始化
$(function(){
	var mainBody = $("body");
	//创建组件工厂
	var myform = null,divMsg = null;
	var userBox = null,pwdBox = null;
	var loginTime = 1;//异常登录次数
	var formUI = {
		eName:'formUI',
		cssClass:'login_form',
		url:'sys/login.do',
		alertFlag:false,
		onSave:function(data){//表单提交回调函数
			switch(data.id){
			case 0://登录成功
				$.cookie("loginName",userBox.textbox("getValue"));//cookie记住帐号
				//$.getScript("js/sys/index.js");
				break;
			case -3://登录异常，重新登录
				if(loginTime++ > 3) {
					loginTime = 1;
					$.alert("登录异常 !");
					return;
				}
				myform.submit();//重新登录
				break;
			case -10://验证码错误
				divMsg.text(data.info);
				break;
			case -30://密码错误
				divMsg.text(data.info);
				pwdBox.textbox('setValue','');
				pwdBox.textbox('textbox').focus();//设置焦点
				break;
			default:
				divMsg.text(data.info);
				mainBody.loadJs("js/sys/index.js",null,{});
				break;
			}
		},
		elements:[{
			eName:'div',
			cssClass:'login_input',
			elements:{
				eName:'textbox',
				required: true,
				iconCls:'icon-man',
				height:30,
				width:210,
				name:"userName"
			}
		},{
		    eName:'div',
		    cssClass:'login_input',
		    elements:{
		    	eName:'textbox',
		    	type:'password',
		    	required: true,
		    	iconCls:'icon-lock',		    		  
		    	height:30,
		    	width:210,
		    	name:"password",
		    	validType:'length[3,20]',
		    	invalidMessage:'密码长度不正确 !'
		    }
		},{
		    eName:'div',
		    cssClass:'login_input',
		    elements:{
		    	eName:'div',
		    	cssClass:'login_btn',
		    	onClick:function(){
		    		myform.submit();
		    	},
		    	elements:{
		    		eName:'span',
		    		text:"登录"
		    	}
		    }
		},{
		    eName:'div',
		    cssClass:'login_input',
		    elements:{
		    	eName:'div',
		    	cssClass:'login_btn',
		    	onClick:function(){
		    		mainBody.loadJs("js/account/openAccount.js",null,{});
		    	},
		    	elements:{
		    		eName:'span',
		    		text:"开户"
		    	}
		    }
		},{
		    eName:'div',
		    cssClass:'login_input',
		    id:"msg",
		    cssStyle:"color:red;margin-top:3px;height:30px;"
		}]
	};
	mainBody.loadUI({
		eName:"div",
		addMode:2,
		cssClass:"login_panel",
		elements:[{
		  	eName:"div",
		  	cssClass:"login_top"
		},{
			eName:'div',
			cssClass:'login_body',
			elements:formUI
		}]
	});
	var formObj = mainBody.findJq("formUI");
	myform = formObj.findUI();
	divMsg = formObj.findJq("msg");
	userBox = formObj.findJq("userName");
	pwdBox = formObj.findJq("password");
	var userText = userBox.textbox("textbox");
	var pwdText = pwdBox.textbox("textbox");
	//cookie记录帐号
	var loginName = $.cookie("loginName");
	if(loginName) {
		userBox.textbox('setValue',loginName);
		pwdBox.textbox('textbox').focus();
	}
	//按键回车事件
	userText.keydown(function(e){
		var key = e.keyCode;//兼容firefox
		 if(key == 13 && userBox.textbox('isValid'))
			 pwdText.focus();
		return true;
	});
	//按键回车事件
	pwdText.keydown(function(e){
		var key = e.keyCode;//兼容firefox
		 if(key == 13 && pwdBox.textbox('isValid')){
			$(this).blur();
			myform.submit();
		 }
		return true;
	});
	
});
