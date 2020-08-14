//发卡
garen_define("js/account/cardManage_charge",function (jqObj,loadParams) {
	
	var accountUI = [{
		eName:"div",
		elements:{
			eName:"fieldset",
			cssStyle:"margin: 10px 0 0 16px;",
			width:330,
			height:95,
			elements:[{
				eName:'legend',
				text:'基本信息',
				cssStyle:"font-weight: bold;font-size: 15px;"
			},{
				eName:"div",
				cssStyle:"margin-left:10px;",
				elements:[{
					eName:"div",
					cssStyle:"margin-top:10px;",
					elements:[{
						eName:"span",
						elements:"姓名",
						cssStyle:"margin-right:5px;"
					},{
						eName:"textbox",
						width:100,
						readonly:true,
						name:"user_lname"
					},{
						eName:"span",
						elements:"学/工号",
						cssStyle:"margin-right:5px;margin-left:15px;"
					},{
						eName:"textbox",
						width:120,
						readonly:true,
						name:"user_no"
					}]
				},{
					eName:"div",
					cssStyle:"margin-top:10px;",
					elements:[{
						eName:"span",
						elements:"部门",
						cssStyle:"margin-right:5px;"
					},{
						eName:"textbox",
						width:283,
						readonly:true,
						name:"user_depname"
					}]
				}]
			}]
		}
	},{
		eName:"formUI",
		id:"saveForm",
		method:"post",
		alertFlag:false,
		//progressBar:"保存中...",
		//url:modeListAdd,
		onBeforeSave:function(params){
			
		},
		/*onSave:function(retJson){
			if(retJson.result){
				loadParams.callback();
				jqObj.window("close");
			}else{
				$.alert(retJson.info);
			}
			
		},*/
		elements:{
			eName:"div",
			elements:[{
				eName:"div",
				elements:{
					eName:"fieldset",
					cssStyle:"margin: 10px 0 0 16px;",
					width:330,
					height:220,
					elements:[{
						eName:'legend',
						text:'现金账户信息',
						cssStyle:"font-weight: bold;font-size: 15px;"
					},{
						eName:"div",
						elements:[{
							eName : 'div',
							cssStyle:"margin-top:20px;",
							elements : [{
								eName : 'span',
								cssClass : 'charge_beforetext',
								text : '充值前余额:',
								cssStyle : ''
							},{
								eName : 'span',
								id:"charge_beforemoeny",
								cssStyle:"margin-right: 5px;color: gray;font-size:16px;font-weight:bold;",
								text: ''
							},{
								eName : 'span',
								text: '元'
							}]
						},{
							eName : 'div',
							cssStyle:"margin-top:25px;",
							elements : [{
								eName : 'span',
								text : '充值后余额:',
								cssClass : 'charge_aftertext'
							},{
								eName : 'span',
								id:"charge_aftermoney",
								cssStyle:"margin-right: 5px;color: red;font-size:16px;font-weight:bold;",
								text: ''
							},{
								eName : 'span',
								text: '元'
							}]
						
						},{
							eName : 'div',
							cssStyle:"margin-top:35px;",
							elements : [{
								eName : 'span',
								text : '输入充值金额',
								cssStyle:"margin-left: 20px;margin-right: 5px;"
							},{
								eName : 'textbox',
								validType:['money','moneyMax'],
								id:"moneyBox",
								name : '',
								width : 137,
								height : 25,		
								value:'',//默认值
								onChange:moneyInput
							}]
						},{
							eName : 'div',
							cssStyle:"margin-top:10px;margin-left: 15px;",
							elements : {
								eName : 'div',
								elements : [{
									eName : 'linkbutton',
									uId:"tm1",
									width:50,
									height:28,
									cssClass:'charge_chaxun',
									text:"50",
									onClick : function(){
										if(isNaN(moneyBox.textbox("getValue"))){
											moneyBox.textbox("textbox").focus();
										}else if(moneyBox.textbox("getValue")>21474836.47){
											moneyBox.textbox("textbox").focus();
										}
										else{
											/*var cbm = Math.round(Number(moneyBox.textbox("getValue"))*100); 
											var nv = Math.round(Number(50)*100); 
											var v = cbm + nv;
											var money = v/100 + "";*/
											var money = 50 + "";
											moneyBox.textbox("setValue",money);
										}
									}
								},{
									eName : 'linkbutton',
									uId:"tm1",
									width:50,
									height:28,
									cssClass:'charge_chaxun',
									text:"100",
									onClick : function(){
										if(isNaN(moneyBox.textbox("getValue"))){
											moneyBox.textbox("textbox").focus();
										}
										else if(moneyBox.textbox("getValue")>21474836.47){
											moneyBox.textbox("textbox").focus();
										}
										else{
											/*var cbm = Math.round(Number(moneyBox.textbox("getValue"))*100); 
											var nv = Math.round(Number(100)*100); 
											var v = cbm + nv;
											var money = v/100 + "";*/
											var money = 100 + "";
											moneyBox.textbox("setValue",money);
										}
									}
								},{
									eName : 'linkbutton',
									uId:"tm1",
									width:50,
									height:28,
									cssClass:'charge_chaxun',
									text:"200",
									onClick : function(){
										if(isNaN(moneyBox.textbox("getValue"))){
											moneyBox.textbox("textbox").focus();
										}
										else if(moneyBox.textbox("getValue")>21474836.47){
											moneyBox.textbox("textbox").focus();
										}
										else{
											/*var cbm = Math.round(Number(moneyBox.textbox("getValue"))*100); 
											var nv = Math.round(Number(200)*100); 
											var v = cbm + nv;
											var money = v/100 + "";*/
											var money = 200 + "";
											moneyBox.textbox("setValue",money);
										}
									}
								},{
									eName : 'linkbutton',
									uId:"tm1",
									width:50,
									height:28,
									cssClass:'charge_chaxun',
									text:"500",
									onClick : function(){
										if(isNaN(moneyBox.textbox("getValue"))){
											moneyBox.textbox("textbox").focus();
										}
										else if(moneyBox.textbox("getValue")>21474836.47){
											moneyBox.textbox("textbox").focus();
										}
										else{
											/*var cbm = Math.round(Number(moneyBox.textbox("getValue"))*100); 
											var nv = Math.round(Number(500)*100); 
											var v = cbm + nv;
											var money = v/100 + "";*/
											var money = 500 + "";
											moneyBox.textbox("setValue",money);
										}
									}
								}]
							}
						}]
					}]
				}
			}]
		}
	},{
		eName:"div",
		cssClass:'autoModeDefine_addMode_button_div',
		elements:[{
			eName:"linkbutton",
			uId:"tm2",
			text : '确定',
			cssClass : 'autoModeDefine_addMode_linkbutton',
			cssStyle:"margin-right:15px;",
			id:"charge_button",
			width : 80,
			height : 35,
			onClick:charge
		},{
			eName:"linkbutton",
			uId:"tm1",
			text : '取消',
			cssClass : '',
			width : 80,
			height : 35,
			onClick:function(){
				jqObj.window("close");
			}
		}]
	}];
	
	jqObj.loadUI(accountUI);
	
	var charge_beforemoeny = jqObj.findJq("charge_beforemoeny");
	var charge_aftermoney = jqObj.findJq("charge_aftermoney");
	var moneyBox = jqObj.findJq("moneyBox");
	var user_lname = jqObj.findJq("user_lname");
	var user_no = jqObj.findJq("user_no");
	var user_depname = jqObj.findJq("user_depname");
	var charge_button = jqObj.findJq("charge_button");
	
	loadInit();
	function loadInit(){
		user_lname.textbox("setValue",loadParams.params.user_lname);
		user_no.textbox("setValue",loadParams.params.user_no);
		user_depname.textbox("setValue",loadParams.params.user_depname);
		charge_beforemoeny.html(loadParams.money);
	}
	
	//输入金额
	function moneyInput(newValue, oldValue){
		var money=/^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
		if(money.test(newValue)){//金额验证
			if(newValue>21474836.47){
				//$.alert("单次充值金额不能超过21474836.47元");
				charge_aftermoney.html("");//清空充值后余额
			}else{
				//金额输入框
				if(newValue.indexOf(".")==-1){
					moneyBox.textbox("setValue",newValue+".00");
				}
				else if(newValue.length - newValue.indexOf(".") - 1 == 1){
					moneyBox.textbox("setValue",newValue+"0");
				}
				else{
					moneyBox.textbox("setValue",newValue);
				}
				
				//充值后余额
				if(charge_beforemoeny.html()!=""){
					
					var cbm = Math.round(Number(charge_beforemoeny.html())*100); 
					var nv = Math.round(Number(newValue)*100); 
					var v = cbm + nv;
					var val = v/100 + "";
					
					if(val.indexOf(".") == -1){//输入时不含小数点（0.00==0）
						charge_aftermoney.html(val+".00");
					}
					else if(val.length - val.indexOf(".") - 1 == 1){//小数点后面有一位数（0.10==0.1）
						charge_aftermoney.html(val+"0");
					}
					else{//小数点后面有两位数
						charge_aftermoney.html(val);
					}
				}
			}
		}
		else{
			charge_aftermoney.html("");
			//$.alert("请输入正确的金额");
		}
	}
	// add by LYh
	function charge(){
		var row = loadParams.params;
		
		var money=/^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
//		if(user_no.textbox("getValue")==""){
//			$.alert("请指定持卡人账户！");
//		}
		if(row==null){
			$.alert("请指定持卡人账户！");
		}
		else if(moneyBox.textbox("getValue")==""){
			$.alert("请输入充值金额！");
		}
		else if(moneyBox.textbox("getValue")=="0.00"){
			$.alert("充值金额不能为0！");
		}
		else if(moneyBox.textbox("getValue")>21474836.47 || moneyBox.textbox("getValue")<0 || !money.test(moneyBox.textbox("getValue"))){
			moneyBox.textbox("textbox").focus();
		}
		else{
			charge_button.linkbutton("disable");
			var params = {};
			params['account_id'] = row.account_id;
			params['recharge_amt'] = moneyBox.textbox("getValue");
			params['cash_amt'] = loadParams.money;
			
			var myWin = $.createWin({
				title:"系统提示信息",
				width:300,
				height:150,
				queryParams:{
					params:params,
					callback:chargeSuccess
				},
				url:"js/account/charge_syncWin.js"
			});
		}
	}
	// add by LYh
	function chargeSuccess(param,i){
		charge_button.linkbutton("enable");
		loadParams.callback();
		jqObj.window("close");
	}
	
	moneyBox.next().children().eq(0).attr("maxlength",8);
	
	//扩展验证
	$.extend($.fn.validatebox.defaults.rules, {    
		money: {// 金额验证
            validator: function (value) {
                //return /^[+]?[1-9]+\d*$/i.test(value);
                return /^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/i.test(value);
            },
            message: '请输入正确金额'
        },
        moneyMax :{// 最大值验证
          	validator: function (value) {
                return (value<=21474836.47);
            },
            message: '请输入正确金额'
        },
	});  
});