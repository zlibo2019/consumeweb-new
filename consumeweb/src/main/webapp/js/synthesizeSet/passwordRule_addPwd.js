//新增密码规则
garen_define("js/synthesizeSet/passwordRule_addPwd",function (jqObj,loadParams) {
	
	var add = "synthesizeSet/passwordRule/add.do";//新增
	
	var addDepUI = {
		eName:"div",
		cssClass:"passwordRule_addPwd_div",
		elements:[{
			eName:"div",
			elements:{
				eName:"formUI",
				id:"addForm",
				method:"post",
				alertFlag:false,
				url:add,
				onBeforeSave:function(params){
					if(params.scheme_name==""){
						$.alert("请输入规则名称！");
						return false;
					}
				},
				onSave:function(retJson){
					if(retJson.result){
						loadParams.callback();
						jqObj.window("close");
					}else{
						$.alert(retJson.info);
					}
				},
				elements:[{
					eName:"div",
					cssClass:"passwordRule_addPwd_nameDiv",
					elements:[{
						eName:"span",
						cssClass:"passwordRule_addPwd_span",
						text:"名称"
					},{
						eName:"textbox",
						name:"scheme_name",
						width:180,
						validType:"length[1,18]",
						invalidMessage:'名称长度不正确 !'
					}]
				},{
					eName:"div",
					elements:[{
						eName:"span",
						cssClass:"passwordRule_addPwd_span",
						text:"密码"
					},{
						eName:"textbox",
						name:"pwd_personal",
						//type:"password",
						width:180,
						validType:'number'
					}]
				}]
			}
		},{
			eName:"div",
			elements:[{
				eName:"linkbutton",
				uId:"tm2",
				text : '确定',
				cssClass : 'passwordRule_linkbutton',
				width : 80,
				height : 40,
				onClick:savePwd
			},{
				eName:"linkbutton",
				uId:"tm1",
				text : '取消',
				width : 80,
				height : 40,
				onClick:function(){
					jqObj.window("close");
				}
			}]
		}]
	}
	jqObj.loadUI(addDepUI);
	
	var scheme_name = jqObj.findJq("scheme_name");
	
	var addForm = jqObj.findJq("addForm");
	
	var pwd_personal = jqObj.findJq("pwd_personal");
	
	//文本框长度限制
	pwd_personal.next().children().eq(0).attr("maxlength",6);
	scheme_name.next().children().eq(0).attr("maxlength",18);
	
	
	//新增部门
	function savePwd(){
		addForm.findJqUI().submit();
	}
	
	//扩展验证
	$.extend($.fn.validatebox.defaults.rules, {    
		number: {// 数字验证
            validator: function (value) {
                return /^\d{6}$/i.test(value);
            },
            message: '请输入6位数字密码'
        }
	});  
		
});