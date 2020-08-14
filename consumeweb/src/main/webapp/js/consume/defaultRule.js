//默认规则
garen_define("js/consume/defaultRule",function (jqObj,loadParams) {
	
	//webService
	
	var ruleListQuery = "consume/defaultRule/ruleListQuery.do";//规则查询
	
	var ruleListDelete = "consume/defaultRule/ruleListDelete.do";//删除规则
	
	var limitQuery = "consume/defaultRule/limitQuery.do";//限制查询
	
	var limitUpdate = "consume/defaultRule/limitUpdate.do";//限制修改
	
	var toolBar = [null,{
		eName:"div",
		height : 10,
		cssStyle : 'background:#ffffff;'
	},{
		eName:"div",
		cssStyle:"margin-left:20px;",
		elements:[{
			eName:"linkbutton",
			uId:"tm1",
			cssClass:"defaultRule_linkbutton",
			width:70,
			height:31,
			text:"新增",
			onClick:addRuleList
		},{
			eName:"linkbutton",
			uId:"tm1",
			cssClass:"defaultRule_linkbutton",
			width:70,
			height:31,
			text:"修改",
			onClick:modifyRuleList
		},{
			eName:"linkbutton",
			uId:"tm2",
			cssClass:"defaultRule_linkbutton",
			width:70,
			height:31,
			text:"删除",
			onClick:deleteRuleList
		}]
	}];
	
	var columns = [//列字段定义
	[ {
		field : 'ch',
		title : 'ch',
		rowspan:2,
		align : "center",  
		checkbox:true,
		width : 50
	}, {
		field : 'index',
		title : '..',
		rowspan:2,
		align : "center",    
		width : 50
	}, {
		field : 'meal_name',
		title : '餐别',
		rowspan:2,
		align : "center",
		width : 80
	}, {
		field : 'timeSlot',
		title : '时段',
		rowspan:2,
		align : "center",
		width : 80
	}, {
		title : '餐别规则',
		colspan:9,
		align : "center",
		width : 80
	}],
	[{
		field : 'rule_name',
		title : '餐别规则名称',
		align : "center",
		width : 80
	}, {
		field : 'rule_type_str',
		title : '规则类别',
		align : "center",
		width : 80
	}, {
		field : 'limit_amt_str',
		title : '消费限额',
		align : "center",
		width : 80
	}, {
		field : 'limit_numb',
		title : '消费限次',
		align : "center",
		width : 80
	}, {
		field : 'sub_enable_str',
		title : '餐补贴启用',
		align : "center",
		width : 80
	},{
		field : 'sub_type_str',
		title : '餐补方式',
		align : "center",
		width : 100
	}, {
		field : 'sub_amt_str',
		title : '补贴金额',
		align : "center",
		width : 80
	}, {
		field : 'sub_rate_str',
		title : '补贴比率',
		align : "center",
		width : 80
	}, {
		field : 'sub_valid_days_str',
		title : '餐补贴有效期',
		align : "center",
		width : 100
	}] ];
   	
   	var centerUI = {
		eName : 'datagrid',
		id:"dataTable",
		fit:true,
		idField : 'rule_id',
		//url : ruleListQuery,
		toolbarEx : toolBar,// 查询条件工具栏
		columns : columns,
		pagination: true,
		clientPager:true,
		alertFlag : false,// 是否弹出默认对话框
		autoload : false,
		singleSelect:true,
		checkOnSelect:true,
		selectOnCheck:true,
		onLoadSuccessEx:function(retJson){
			if(retJson.id==0){
				
			}else{
				$.alert(retJson.info);
			}
		}
	};
	
	var southUI = {
		eName : 'div',
		cssClass:"defaultRule_toolBar_div",
		elements:[{
			eName:"div",
			elements:{
				eName:"formUI",
				id:"ruleLimitForm",
				method:"post",
				url:limitUpdate,
				alertFlag:false,
				//progressBar:"保存中...",
				onBeforeSave:function(params){
					//$.print(params);
					params['crowd_id'] = "1";
					if(!params.limit_pwd_enable){
						params['limit_pwd_enable'] = "0";
					}
					if(!params.sub_valid_days){
						params['sub_valid_days'] = "0";
					}
					if(!params.limit_enable){
						params['limit_enable'] = "0";
						params['limit_amt'] = "";
					}
				},
				onSave:function(retJson){
					if(retJson.result){
						day_sub_amt.textbox("disable");
						day_limit_amt.textbox("disable");
						day_limit_numb.textbox("disable");
						single_limit.textbox("disable");
						limit_pwd_enable.attr("disabled",true);
						sub_valid_days.attr("disabled",true);
						limit_enable.attr("disabled",true);
						limit_amt.textbox("disable");
						modifyLimitBtn.css("display","inline-block");
						saveLimitBtn.css("display","none");
						loadLimit();
					}else{
						$.alert(retJson.info);
					}
				},
				elements:[{
					eName:"div",
					cssClass:"first_div",
					elements:[{
						eName:"span",
						cssClass:"first_div_span",
						text:"日补贴"
					},{
						eName:"textbox",
						name:'day_sub_amt',
						validType:['money','moneyMax'],
						width:65,
						value:'',
						onChange:moneyInput1
					},{
						eName:"span",
						cssClass:"first_div_span",
						text:"日限额"
					},{
						eName:"textbox",
						name:"day_limit_amt",
						validType:['money','moneyMax'],
						width:65,
						value:'',
						onChange:moneyInput2
					},{
						eName:"span",
						cssClass:"first_div_span",
						text:"日限次"
					},{
						eName:"textbox",
						name:"day_limit_numb",
						validType:'number',
						width:65,
						value:''
					},{
						eName:"span",
						cssClass:"first_div_span",
						text:"单次限额"
					},{
						eName:"textbox",
						name:"single_limit",
						validType:['money','moneyMax'],
						width:90,
						value:'',
						onChange:moneyInput3
					}]
				},{
					eName:"div",
					cssClass:"second_div",
					elements:[{
						eName:"input",
						name:"limit_pwd_enable",
						cssClass:"second_div_input",
						type:"checkbox",
						value:1
						
					},{
						eName:"span",
						cssClass:"second_div_span",
						text:"超限密码消费",
					},{
						eName:"input",
						name:"sub_valid_days",
						cssClass:"second_div_input",
						cssStyle:"margin-left:36px;",
						type:"checkbox",
						value:1
					},{
						eName:"span",
						cssClass:"second_div_span",
						text:"日补当天有效",
					},{
						eName:"input",
						name:"limit_enable",
						cssClass:"second_div_input",
						cssStyle:"margin-left:36px;",
						type:"checkbox",
						value:1,
						onClick:limitEnable
					},{
						eName:"span",
						cssClass:"second_div_span",
						text:"允许离线消费",
					},{
						eName:"span",
						cssClass:"first_div_span",
						cssStyle:"margin-left:36px;",
						text:"离线消费限额",
					},{
						eName:"textbox",
						name:"limit_amt",
						validType:['money','moneyMax'],
						width:65,
						value:'',
						onChange:moneyInput4
					},]
				}]
			}
		},{
			eName:"div",
			elements:[{
				eName:"span",
				cssStyle:"color:grey;display:block;margin-left:15px;line-height: 45px;",
				elements:"不启用限制时对应项目填0"
			},{
				eName:"span",
				cssStyle:"color:grey;display:block;margin-left:15px;line-height: 45px;",
				elements:"每日首次刷卡领用日补贴，不撤销"
			}]
		},{
			eName:"div",
			id:"modifyLimitBtn",
			elements:{
				eName:"linkbutton",
				uId:"tm1",
				cssClass:"consumeRule_confirm_btn",
				cssStyle:"margin:3px 0 0 30px;",
				text:"<span style='font-size:13px;line-height:50px;'>修改</span>",
				onClick:modifyLimit
			}
		},{
			eName:"div",
			id:"saveLimitBtn",
			elements:{
				eName:"linkbutton",
				uId:"tm2",
				cssClass:"consumeRule_confirm_btn",
				cssStyle:"margin:3px 0 0 30px;",
				text:"<span style='font-size:13px;line-height:50px;'>保存</span>",
				onClick:saveLimit
			}
		}]
	};
	
	var mainUI = {
		eName : 'layoutExt',// 容器布局类，jeasyui组件
		cssStyle:'font-family: 微软雅黑, Arial;',
		fit : true,
		elements : [{
			region : 'center',
			elements : centerUI
		},
		{
			region : 'south',
			height : 100,
			elements : southUI
		}]
	};
	
	
	//创建dom
	jqObj.loadUI(mainUI);
	
	var ruleLimitForm = jqObj.findJqUI("ruleLimitForm");
	var dataTable = jqObj.findJq("dataTable");
	var dep_serial = jqObj.findJq("dep_serial");
	
	var day_sub_amt = jqObj.findJq("day_sub_amt");
	var day_limit_amt = jqObj.findJq("day_limit_amt");
	var day_limit_numb = jqObj.findJq("day_limit_numb");
	var single_limit = jqObj.findJq("single_limit");
	var limit_pwd_enable = jqObj.findJq("limit_pwd_enable");
	var sub_valid_days = jqObj.findJq("sub_valid_days");
	var limit_enable = jqObj.findJq("limit_enable");
	var limit_amt = jqObj.findJq("limit_amt");
	
	var modifyLimitBtn = jqObj.findJq("modifyLimitBtn");
	var saveLimitBtn = jqObj.findJq("saveLimitBtn");
	
	loadInit();
	loadRuleList();
	loadLimit();
	function loadInit(){
		saveLimitBtn.css("display","none");
		day_sub_amt.textbox("disable");
		day_limit_amt.textbox("disable");
		day_limit_numb.textbox("disable");
		single_limit.textbox("disable");
		limit_pwd_enable.attr("disabled",true);
		sub_valid_days.attr("disabled",true);
		limit_enable.attr("disabled",true);
		limit_amt.textbox("disable");
	}
	
	function loadRuleList(){
		dataTable.datagrid("loadEx",{url:ruleListQuery,'crowd_id':'1'});
	}
	
	function addRuleList(){
		var params = {};
		params['crowd_id'] = "1";
		var myWin = $.createWin({
			title:"新增规则",
			width:400,
			height:510,
			queryParams:{
				params:params,
				callback:loadRuleList
			},
			url:"js/consume/defaultRule_addRuleList.js"
		});
	}
	
	function modifyRuleList(){
		var row = dataTable.datagrid("getSelected");
		if(row==null){
			$.alert("请选择一个规则！");
		}else{
			var params = {};
			params['crowd_id'] = "1";
			params['rule_id'] = row.rule_id;
			var myWin = $.createWin({
				title:"修改规则",
				width:400,
				height:510,
				queryParams:{
					params:params,
					callback:loadRuleList
				},
				url:"js/consume/defaultRule_modifyRuleList.js"
			});
		}
	}
	
	function deleteRuleList(){
		var row = dataTable.datagrid("getSelected");
		if(row==null){
			$.alert("请选择一个规则！");
		}else{
			$.confirm("确认删除这个规则吗？",function(c){
				if(c){
					var params = {};
					params['rule_id'] = row.rule_id;
					params['crowd_id'] = '1';
					$.postEx(ruleListDelete,params,function(retJson){
						if(retJson.result){
							loadRuleList();
						}else{
							$.alert(retJson.info);
						}
					});
				}
			});
		}
	}
	
	function loadLimit(){
		var params = {};
		params['crowd_id'] = "1";
		$.postEx(limitQuery,params,function(retJson){
			if(retJson.result && retJson.data.length>0){
				day_sub_amt.textbox("setValue",retJson.data[0].day_sub_amt_str+"");
				day_limit_amt.textbox("setValue",retJson.data[0].day_limit_amt_str+"");
				day_limit_numb.textbox("setValue",retJson.data[0].day_limit_numb+"");
				single_limit.textbox("setValue",retJson.data[0].single_limit_str+"");
				if(retJson.data[0].limit_pwd_enable=="1"){
					limit_pwd_enable.prop("checked",true);
				}
				else{
					limit_pwd_enable.prop("checked",false);
				}
				if(retJson.data[0].sub_valid_days=="1"){
					sub_valid_days.prop("checked",true);
				}
				else{
					sub_valid_days.prop("checked",false);
				}
				if(retJson.data[0].limit_enable=="1"){
					limit_enable.prop("checked",true);
				}
				else{
					limit_enable.prop("checked",false);
				}
				limit_amt.textbox("setValue",retJson.data[0].limit_amt_str+"");
			}
		});
	}
	
	function modifyLimit(){
		modifyLimitBtn.css("display","none");
		saveLimitBtn.css("display","inline-block");
		
		day_sub_amt.textbox("enable");
		day_limit_amt.textbox("enable");
		day_limit_numb.textbox("enable");
		single_limit.textbox("enable");
		limit_pwd_enable.attr("disabled",false);
		sub_valid_days.attr("disabled",false);
		limit_enable.attr("disabled",false);
		if(limit_enable.prop("checked")){
			limit_amt.textbox("enable");
		}
	}
	
	function saveLimit(){
		ruleLimitForm.submit();
	}
	
	function limitEnable(){
		if(limit_enable.prop("checked")){
			limit_amt.textbox("enable");
		}else{
			limit_amt.textbox("disable");
			//limit_amt.textbox("setValue","");
		}
	}
	
	//日补贴输入金额
	function moneyInput1(newValue, oldValue){
		var money=/^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
		if(money.test(newValue)){//金额验证
			//金额输入框
			if(newValue.indexOf(".")==-1){
				day_sub_amt.textbox("setValue",newValue+".00");
			}
			else if(newValue.length - newValue.indexOf(".") - 1 == 1){
				day_sub_amt.textbox("setValue",newValue+"0");
			}
			else{
				day_sub_amt.textbox("setValue",newValue);
			}
		}
	}
	
	//日限额输入金额
	function moneyInput2(newValue, oldValue){
		var money=/^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
		if(money.test(newValue)){//金额验证
			//金额输入框
			if(newValue.indexOf(".")==-1){
				day_limit_amt.textbox("setValue",newValue+".00");
			}
			else if(newValue.length - newValue.indexOf(".") - 1 == 1){
				day_limit_amt.textbox("setValue",newValue+"0");
			}
			else{
				day_limit_amt.textbox("setValue",newValue);
			}
		}
	}
	
	//单次限额输入金额
	function moneyInput3(newValue, oldValue){
		$.print(newValue);
		var money=/^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
		if(money.test(newValue)){//金额验证
			//金额输入框
			if(newValue.indexOf(".")==-1){
				single_limit.textbox("setValue",newValue+".00");
			}
			else if(newValue.length - newValue.indexOf(".") - 1 == 1){
				single_limit.textbox("setValue",newValue+"0");
			}
			else{
				single_limit.textbox("setValue",newValue);
			}
		}
	}
	
	//离线消费限额输入金额
	function moneyInput4(newValue, oldValue){
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
	
	//文本长度验证
	day_sub_amt.next().children().eq(0).attr("maxlength",8);
	day_limit_amt.next().children().eq(0).attr("maxlength",8);
	single_limit.next().children().eq(0).attr("maxlength",8);
	limit_amt.next().children().eq(0).attr("maxlength",8);
	day_limit_numb.next().children().eq(0).attr("maxlength",8);
	
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
        number: {// 半角字符验证
            validator: function (value) {
                return /^[0-9]\d*$/i.test(value);
            },
            message: '请输入正确数字'
        }
	});  
	
});
	