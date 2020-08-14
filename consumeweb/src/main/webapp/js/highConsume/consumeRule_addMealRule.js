//创建餐别规则
garen_define("js/highConsume/consumeRule_addMealRule",function (jqObj,loadParams) {
	
	var ruleAdd = "highConsume/consumeRule/ruleAdd.do";//新增规则
	
	var addMealRuleUI = {
		eName:"formUI",
		method:"post",
		url:ruleAdd,
		id:"addMealRuleForm",
		elements:{
			eName:"div",
			cssClass:"consumeRule_addMealRule",
			elements:[{
				eName:"div",
				cssClass:"addMealRule_underLine_div",
				elements:{
					eName:"div",
					cssClass:"first_div",
					elements:[{
						eName:"span",
						text:"请输入规则名称"
					},{
						eName:"textbox",
						name:"rule_name",
						validType:"unnormal"
						//width:100
					}]
				}
			},{
				eName:"div",
				cssClass:"addMealRule_underLine_div",
				elements:[{
					eName:"div",
					cssClass:"second_div",
					elements:[{
						eName:"span",
						text:"限额限次类别："
					},{
						eName:"input",
						cssClass:"div_radio1",
						id:"rule_type1",
						type:"radio",
						name:"rule_type",
						value:0
					},{
						eName:"span",
						text:"餐限额限次"
					},{
						eName:"input",
						cssClass:"div_radio2",
						type:"radio",
						name:"rule_type",
						value:1
					},{
						eName:"span",
						text:"月限额限次"
					}]
				},{
					eName:"div",
					cssClass:"second_div",
					elements:[{
						eName:"span",
						text:"消费限额限次："
					},{
						eName:"span",
						cssClass:"div_radio1",
						text:"消费限额："
					},{
						eName:"textbox",
						name:"limit_amt",
						validType:['money','moneyMax'],
						width:100,
						value:"0.00",
						onChange:moneyInput1
					}]
				},{
					eName:"div",
					cssClass:"second_div",
					elements:[{
						eName:"span",
						cssClass:"div_radio3",
						text:"消费限次："
					},{
						eName:"textbox",
						name:"limit_numb",
						value:0,
						validType:'number',
						width:100
					}]
				},{
					eName:"div",
					cssClass:"second_div",
					cssStyle:"color:grey;margin-left:104px;",
					elements:"（不启用限制时对应项目填0）"
				}]
			},{
				eName:"div",
				cssClass:"addMealRule_underLine_div",
				elements:[{
					eName:"div",
					cssClass:"third_div",
					elements:[{
						eName:"div",
						cssClass:"third_div",
						elements:[{
							eName:"input",
							cssClass:"addMealRule_checkbox",
							type:"checkbox",
							name:"sub_enable",
							value:1,
							onClick:sub_able
						},{
							eName:"span",
							text:"启用餐补贴"
						}]
					},{
						eName:"span",
						text:"补贴方式："
					},{
						eName:"input",
						cssClass:"div_radio1",
						type:"radio",
						name:"sub_type",
						value:0,
						onClick:change1
					},{
						eName:"span",
						text:"固定补贴"
					},{
						eName:"input",
						cssClass:"div_radio2",
						type:"radio",
						name:"sub_type",
						id:"sub_type2",
						value:1,
						onClick:change2
					},{
						eName:"span",
						text:"免费餐"
					},{
						eName:"input",
						cssClass:"div_radio2",
						type:"radio",
						name:"sub_type",
						value:1,
						onClick:change3
					},{
						eName:"span",
						text:"比率餐补"
					}]
				},{
					eName:"div",
					id:"tips1",
					cssStyle:"display:none;color:grey;text-align:center;",
					elements:"（固定餐补：每餐首次消费领用，不撤销）"
				},{
					eName:"div",
					id:"tips2",
					cssStyle:"display:none;color:grey;text-align:center;",
					elements:"（免费餐：未超限时按消费金额领用，可撤销）"
				},{
					eName:"div",
					id:"tips3",
					cssStyle:"display:none;color:grey;text-align:center;",
					elements:"（比率餐补：未超限时按消费金额比率领用，可撤销）"
				},{
					eName:"div",
					cssClass:"third_div",
					elements:[{
						eName:"span",
						text:"补贴金额："
					},{
						eName:"textbox",
						name:"sub_amt",
						validType:['money','moneyMax'],
						width:80,
						onChange:moneyInput2
					},{
						eName:"span",
						cssStyle:"margin-left:10px;",
						text:"补贴比率："
					},{
						eName:"textbox",
						name:"sub_rate",
						validType:['percent','percentMax'],
						width:80,
						onChange:percent
					}]
				}]
			},{
				eName:"div",
				elements:[{
					eName:"div",
					cssClass:"fourth_div",
					elements:[{
						eName:"span",
						text:"餐补有效期："
					},{
						eName:"input",
						cssClass:"div_radio1",
						id:"sub_valid_days1",
						type:"radio",
						name:"sub_valid_days",
						value:1
					},{
						eName:"span",
						text:"当日有效"
					},{
						eName:"input",
						cssClass:"div_radio1",
						type:"radio",
						name:"sub_valid_days",
						value:0
					},{
						eName:"span",
						text:"永久有效"
					}]
				},{
					eName:"div",
					cssClass:"fifth_div",
					elements:[{
						eName:"linkbutton",
						uId:"tm2",
						width:70,
						height:31,
						cssClass:"consumeRule_addMealRule_linkbutton",
						text:"确定",
						onClick:addMealRule
					},{
						eName:"linkbutton",
						uId:"tm1",
						width:70,
						height:31,
						text:"取消",
						onClick:function(){
							jqObj.window("close");
						}
					}]
				}]
			}]
		},
		alertFlag:false,
		//progressBar:"保存中...",
		onBeforeSave:function(params){
			if(params.rule_name==""){
				$.alert("请输入规则名称！");
				return false;
			}
			if(!params.rule_type){
				$.alert("请选择限额限次类别！");
				return false;
			}
			if(params.limit_amt==""){
				$.alert("请输入消费限额！");
				return false;
			}
			if(params.limit_numb==""){
				$.alert("请输入消费限次！");
				return false;
			}
			if(params.sub_enable && !params.sub_type){
				$.alert("请选择补贴方式！");
				return false;
			}
			if(params.sub_type=="0" && params.sub_amt==""){
				$.alert("请输入补贴金额！");
				return false;
			}
			if(params.sub_type=="1" && params.sub_rate==""){
				$.alert("请输入补贴比率！");
				return false;
			}
			if(params.sub_enable && !params.sub_valid_days){
				$.alert("请选择餐补有效期！");
				return false;
			}
			if(!params.sub_enable){
				params['sub_enable'] = "0";
				params['sub_type'] = "1";
				params['sub_amt'] = "0";
				params['sub_rate'] = "100";
				params['sub_valid_days'] = "1";
			}
			if(params.sub_enable){
				if(!params.sub_rate){
					params['sub_rate'] = "";
				}
				if(!params.sub_amt){
					params['sub_amt'] = "";
					var sr = sub_rate.textbox("getValue");
					var sub = sr.substring(0,sr.length-1);
					params['sub_rate'] = sub;
				}
			}
			params['crowd_id'] = loadParams.params.crowd_id;
			params['meal_id'] = loadParams.params.meal_id;
		},
		onSave:function(retJson){
			if(retJson.result){
				loadParams.callback();
				jqObj.window("close");
			}else{
				$.alert(retJson.info);
			}
		}
		
	};
	jqObj.loadUI(addMealRuleUI);
	var sub_enable = jqObj.findJq("sub_enable");
	var sub_type = jqObj.findJq("sub_type");
	var sub_valid_days = jqObj.findJq("sub_valid_days");
	var sub_amt = jqObj.findJq("sub_amt");
	var sub_rate = jqObj.findJq("sub_rate");
	var limit_amt = jqObj.findJq("limit_amt");
	var limit_numb = jqObj.findJq("limit_numb");
	var addMealRuleForm = jqObj.findJqUI("addMealRuleForm");
	var rule_type1 = jqObj.findJq("rule_type1");
	var sub_type2 = jqObj.findJq("sub_type2");
	var sub_valid_days1 = jqObj.findJq("sub_valid_days1");
	var rule_name = jqObj.findJq("rule_name");
	var tips1 = jqObj.findJq("tips1");
	var tips2 = jqObj.findJq("tips2");
	var tips3 = jqObj.findJq("tips3");
	
	loadInit();
	function loadInit(){
		sub_amt.textbox("disable");
		sub_rate.textbox("disable");
		sub_type.attr("disabled",true);
		sub_valid_days.attr("disabled",true);
		rule_type1.prop("checked",true);
		sub_type2.prop("checked",true);
		sub_rate.textbox("setValue","100");
		sub_rate.textbox("setText","100%");
		sub_valid_days1.prop("checked",true);
		tips1.hide();
		tips2.show();
		tips3.hide();
	}
	
	function sub_able(){
		if(sub_enable.prop("checked")){
			sub_type.attr("disabled",false);
			sub_valid_days.attr("disabled",false);
			sub_type2.prop("checked",true);
			change2();
			tips1.hide();
			tips2.show();
			tips3.hide();
		}else{
			sub_type.attr("disabled",true);
			sub_valid_days.attr("disabled",true);
			sub_type2.prop("checked",true);
			change2();
			tips1.hide();
			tips2.show();
			tips3.hide();
		}
	}
	
	function change1(){
		sub_amt.textbox("enable");
		sub_rate.textbox("disable");
		sub_amt.textbox("setValue","");
		sub_rate.textbox("setValue","");
		tips1.show();
		tips2.hide();
		tips3.hide();
	}
	
	function change2(){
		sub_amt.textbox("disable");
		sub_rate.textbox("disable");
		sub_amt.textbox("setValue","");
		sub_rate.textbox("setValue","100");
		sub_rate.textbox("setText","100%");
		tips1.hide();
		tips2.show();
		tips3.hide();
	}
	
	function change3(){
		sub_amt.textbox("disable");
		sub_rate.textbox("enable");
		sub_amt.textbox("setValue","");
		sub_rate.textbox("setValue","");
		tips1.hide();
		tips2.hide();
		tips3.show();
	}
	
	function addMealRule(){
		addMealRuleForm.submit();
	}
	
	//消费限额
	function moneyInput1(newValue, oldValue){
		var money=/^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
		if(money.test(newValue)){//金额验证
			//金额输入框
			if(newValue.indexOf(".")==-1){
				limit_amt.textbox("setValue",newValue+".00");
			}
			else if(newValue.length - newValue.indexOf(".") - 1 == 1){
				limit_amt.textbox("setValue",newValue+"0");
			}
			else{
				limit_amt.textbox("setValue",newValue);
			}
		}
	}
	
	//补贴金额
	function moneyInput2(newValue, oldValue){
		var money=/^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
		if(money.test(newValue)){//金额验证
			//金额输入框
			if(newValue.indexOf(".")==-1){
				sub_amt.textbox("setValue",newValue+".00");
			}
			else if(newValue.length - newValue.indexOf(".") - 1 == 1){
				sub_amt.textbox("setValue",newValue+"0");
			}
			else{
				sub_amt.textbox("setValue",newValue);
			}
		}
	}
	
	//补贴比率
	function percent(newValue, oldValue){
		var per = /^(([1-9]\d{0,2})|0)?%$/;
		var per1 = /^(([1-9]\d{0,2})|0)$/;
		if(newValue.indexOf("%")==-1){
			if(per1.test(newValue)){
				sub_rate.textbox("setValue",newValue+"%");
			}
		}else{
			if(per.test(newValue)){
				var v = newValue.substring(0,newValue.length-1);
				sub_rate.textbox("setValue",v+"%");
			}
		}
	}
	
	//文本长度验证
	limit_amt.next().children().eq(0).attr("maxlength",8);
	sub_amt.next().children().eq(0).attr("maxlength",8);
	limit_numb.next().children().eq(0).attr("maxlength",8);
	rule_name.next().children().eq(0).attr("maxlength",18);
	
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
        percent: {// 百分数验证
            validator: function (value) {
            	return /^(([1-9]\d{0,2})|0)?%$/i.test(value);
            },
            message: '请输入正确补贴比率'
        },
        percentMax: {// 最大值验证
            validator: function (value) {
            	$.print("asd");
            	if(value.indexOf("%")==-1){
            		return (Number(value)<100);
            	}else{
            		return (Number(value.substring(0,value.length-1))<100);
            	}
            },
            message: '请输入正确补贴比率'
        },
        unnormal: {// 验证是否包含空格和非法字符
            validator: function (value) {
                return !/[ '"@#\$%\^&\*！!<>\\\/]+/i.test(value);
            },
            message: '输入值不能为空和包含其他非法字符'
        },
        number: {// 正整数验证
            validator: function (value) {
                return /^[0-9]\d*$/i.test(value);
            },
            message: '请输入正确数字'
        }
	});  
	
});