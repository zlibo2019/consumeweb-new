//重置账户密码
garen_define("js/account/accountManage_resetPwd",function (jqObj,loadParams) {
	
	//var reset = "account/resetPwd.do";//重置
	
	var addDepUI = {
		eName:"div",
		cssClass:"accountManage_resetPwd_div",
		elements:[{
			eName:"div",
			elements:{
				eName:"formUI",
				id:"addForm",
				elements:[{
					eName:"div",
					cssClass:"accountManage_resetPwd_nameDiv",
					elements:[{
						eName:"span",
						cssClass:"accountManage_resetPwd_span",
						elements:"新密码&emsp;&emsp;"
					},{
						eName:"textbox",
						name:"account_pwd",
						type:"password",
						width:180,
						validType:'numberPwd'
					}]
				},{
					eName:"div",
					elements:[{
						eName:"span",
						cssClass:"accountManage_resetPwd_span",
						text:"确认新密码"
					},{
						eName:"textbox",
						name:"account_pwd2",
						type:"password",
						width:180,
						validType:'numberPwd'
					}]
				}]
			}
		},{
			eName:"div",
			elements:[{
				eName:"linkbutton",
				uId:"tm2",
				text : '保存',
				cssClass : 'accountManage_resetPwd_linkbutton',
				width : 65,
				height : 31,
				onClick:savePwd
			},{
				eName:"linkbutton",
				uId:"tm1",
				text : '取消',
				width : 65,
				height : 31,
				onClick:function(){
					jqObj.window("close");
				}
			}]
		}]
	}
	jqObj.loadUI(addDepUI);
	
	var account_pwd = jqObj.findJq("account_pwd");
	
	var addForm = jqObj.findJq("addForm");
	
	var account_pwd2 = jqObj.findJq("account_pwd2");
	
	//文本框长度限制
	account_pwd.next().children().eq(0).attr("maxlength",6);
	account_pwd2.next().children().eq(0).attr("maxlength",6);
	
	
	//保存密码
	function savePwd(){
		var p = {};
		if(addForm.form('form2Json',p)){//true则表单验证通过
			var params = {};
			if(account_pwd.textbox("getValue") == account_pwd2.textbox("getValue")){
				if(loadParams.params[0].account_id == loadParams.rData.account_id){
					params['read_card_number'] = loadParams.rData.card_number;
					params['read_media_id'] = loadParams.rData.media_id;
				}
				params['account_pwd'] = account_pwd.textbox("getValue");
				params['event_id'] = "10";
				var myWin = $.createWin({
					title:"操作提示",
					width:600,
					height:100,
					queryParams:{
						params:loadParams.params,
						configs:params,
//						callback:function(){
//							loadParams.callback();
//							jqObj.window("close");
//						}
						loadP:loadParams
					},
					url:"js/account/accountManage_progressBarWin.js"
				});
				jqObj.window("close");
			}else{
				$.alert("两次密码不一致！");
			}
		}
	}
	
	//扩展验证
	$.extend($.fn.validatebox.defaults.rules, {    
		numberPwd: {// 数字验证
            validator: function (value) {
                return /^\d{6}$/i.test(value);
            },
            message: '请输入正确密码（6位数字）'
        }
	});  
		
});