//修改操作费用
garen_define("js/synthesizeSet/opearteCost_modifyCost",function (jqObj,loadParams) {
	
	var update = "synthesizeSet/operateCost/update.do";//修改
	
	var rData = "";
	
	var addModeUI = {
		eName:"formUI",
		id:"saveForm",
		method:"post",
		alertFlag:false,
		url:update,
		onBeforeSave:function(params){
			var f = fee_rate.textbox("getValue");
			var d = deposit_amt.textbox("getValue");
			var e = eventList.combobox("getValue");
			var i = ideList.combobox("getValue");
			params['identity_id'] = i;
			params['event_id'] = e;
			if(i == undefined || i==""){
				$.alert("请选择身份！");
				return false;
			}
			else if(e==""){
				$.alert("请选择操作类型！");
				return false;
			}
			else if(e==22 && f==""){
				$.alert("费率不能为空！");
				return false;
			}
			else if(e==22 && f!=""){
				var fee = f.substring(0,f.length-1);
				params['fee_rate'] = fee;
			}
			else if((e==3 || e==5 || e==107) && d==""){
				$.alert("押金不能为空！");
				return false;
			}
			else if((e==3 || e==5 || e==107) && d=="0.00"){
				$.alert("押金不能为0！");
				return false;
			}
			rData = params;
		},
		onSave:function(retJson){
			if(retJson.result){
				loadParams.callback();
				jqObj.window("close");
			}else{
				$.alert(retJson.info);
			}
		},
		elements:{
			eName:"div",
			cssClass:"operateCost_addCost",
			elements:[{
				eName:"div",
				cssClass:"operateCost_addCost_div",
				elements:[{
					eName : 'span',
					text : '身份选择',
					cssClass:"operateCost_span",
				},{
					eName : 'combobox',
					name:"identity_id",
					panelHeight:$.browser.msie9?200:'auto',
					panelMaxHeight:200,
					id : 'ideList',
					width : 140,
					height : 25,
					valueField: 'ident_id',    
			        textField: 'ident_name',
					editable:false,
					value:''//默认值
				}]
			},{
				eName:"div",
				cssClass:"operateCost_addCost_div",
				elements:[{
					eName : 'span',
					text : '操作类型',
					cssClass:"operateCost_span",
				},{
					eName : 'combobox',
					name:"event_id",
					panelHeight:$.browser.msie9?200:'auto',
					panelMaxHeight:200,
					id:"eventList",
					width : 140,
					height : 25,
					valueField: 'event_id',    
			        textField: 'event_name',
					editable:false,
					onChange:function(newValue,oldValue){
						if(newValue==3 || newValue==5 || newValue==107 ){
							deposit_amt.textbox("enable");
							fee_rate.textbox("disable");
						}else if(newValue==22){
							deposit_amt.textbox("disable");
							fee_rate.textbox("enable");
						}else{
							deposit_amt.textbox("disable");
							fee_rate.textbox("disable");
						}
					}
				}]
			},{
				eName:"div",
				cssStyle:"margin-top: 20px;",
				elements:{
					eName:"fieldset",
					width:200,
					height:60,
					elements:[{
						eName:'legend',
						text:'费用设置'
					},{
						eName:"div",
						elements:[{
							eName : 'span',
							elements : '押金&emsp;&emsp;',
							cssClass:"operateCost_span"
						},{
							eName : 'textbox',
							name : 'deposit_amt',
							validType:['money','moneyMax'],
							width : 120,
							height : 25,
							onChange:moneyInput
						},{
							eName : 'span',
							text : '元',
							cssClass:"operateCost_span"
						}]
					},{
						eName:"div",
						cssStyle:"display:none;",//本期没有费率，所以隐藏
						elements:[{
							eName : 'span',
							elements : '费率&emsp;&emsp;',
							cssClass:"operateCost_span",
						},{
							eName : 'textbox',
							name : 'fee_rate',
							validType:['percent','percentMax'],
							width : 120,
							height : 25,		
							onChange:percent
						}]
					}]
				}
			},{
				eName:"div",
				cssClass:'operateCost_addCost_button_div',
				elements:[{
					eName:"linkbutton",
					uId:"tm2",
					text : '确定',
					cssClass : 'operateCost_addCost_linkbutton',
					width : 60,
					height : 30,
					onClick:save
				},{
					eName:"linkbutton",
					uId:"tm1",
					text : '取消',
					cssClass : '',
					width : 60,
					height : 30,
					onClick:function(){
						jqObj.window("close");
					}
				}]
			}]
		}
	}
	
	jqObj.loadUI(addModeUI);
	
	var ideList = jqObj.findJq("ideList");
	
	var eventList = jqObj.findJq("eventList");
	var saveForm = jqObj.findJq("saveForm");
	
	var fee_rate  = jqObj.findJq("fee_rate");
	var deposit_amt = jqObj.findJq("deposit_amt");
	
	loadInit();
	
	function loadInit(){
		
		ideList.combobox("disable");
		eventList.combobox("disable");
		ideList.combobox("setValue",loadParams.params.identity_id);
		ideList.combobox("setText",loadParams.params.identity_name);
		eventList.combobox("setValue",loadParams.params.event_id);
		eventList.combobox("setText",loadParams.params.event_name);
		
		if(eventList.combobox("getValue")==22){
			deposit_amt.textbox("disable");
			fee_rate.textbox("setValue",loadParams.params.fee_rate_str);
		}
		else if(eventList.combobox("getValue")==3 ||eventList.combobox("getValue")==5 || eventList.combobox("getValue")==107){
			fee_rate.textbox("disable");
			deposit_amt.textbox("setValue",loadParams.params.deposit_amt_str);
		}else{
			deposit_amt.textbox("disable");
			fee_rate.textbox("disable");
		}
		
	}
	
	function save(){
		saveForm.findJqUI().submit();
	}
	
	//输入金额
	function moneyInput(newValue, oldValue){
		var money=/^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
		if(money.test(newValue) && newValue<=21474836.47){//金额验证
			//金额输入框
			if(newValue.indexOf(".")==-1){
				deposit_amt.textbox("setValue",newValue+".00");
			}
			else if(newValue.length - newValue.indexOf(".") - 1 == 1){
				deposit_amt.textbox("setValue",newValue+"0");
			}
			else{
				deposit_amt.textbox("setValue",newValue);
			}
		}
	}
	
	function percent(newValue, oldValue){
		var number = /^([1-9]\d?|100)$/;
		if(number.test(newValue)){
			if(newValue.indexOf(".")==-1){
				if(newValue.indexOf("%")==-1){
					fee_rate.textbox("setValue",newValue+".00%");
				}else{
					var v = newValue.substring(0,newValue.length-1);
					fee_rate.textbox("setValue",v+".00%");
				}
			}
			else if(newValue.length - newValue.indexOf(".") - 1 == 1){
				if(newValue.indexOf("%")==-1){
					fee_rate.textbox("setValue",newValue+"0%");
				}else{
					var v = newValue.substring(0,newValue.length-1);
					fee_rate.textbox("setValue",v+"0%");
				}
			}
			else{
				if(newValue.indexOf("%")==-1){
					fee_rate.textbox("setValue",newValue+"%");
				}else{
					var v = newValue.substring(0,newValue.length-1);
					fee_rate.textbox("setValue",v+"%");
				}
			}
		}
	}
	
	deposit_amt.next().children().eq(0).attr("maxlength",8);
	
	//扩展验证
	$.extend($.fn.validatebox.defaults.rules, {    
		money: {// 金额验证
            validator: function (value) {
                //return /^[+]?[1-9]+\d*$/i.test(value);
                return /^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/i.test(value);
            },
            message: '请输入正确押金'
        },
        moneyMax :{// 最大值验证
        	validator: function (value) {
        		return (value<=21474836.47);
        	},
        	message: '请输入正确金额'
        },
        percent: {// 百分数验证
            validator: function (value) {
            	return /^(([1-9]\d{0,2})|0)(\.\d{1,2})?%$/i.test(value);
            },
            message: '请输入正确费率'
        },
        percentMax: {// 最大值验证
            validator: function (value) {
            	if(value.indexOf("%")==-1){
            		return (Number(value)<=100);
            	}else{
            		return (Number(value.substring(0,value.length-1))<=100);
            	}
            },
            message: '请输入正确费率'
        }
	});  
});