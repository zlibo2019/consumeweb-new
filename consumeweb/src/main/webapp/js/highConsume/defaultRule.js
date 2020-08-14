//默认规则
garen_define("js/highConsume/defaultRule",function (jqObj,loadParams) {
	
	//webService
	var mealQuery = "highConsume/defaultRule/mealQuery.do";//餐别查询
	
	var ruleQuery = "highConsume/defaultRule/ruleQuery.do";//规则查询
	
	var ruleDelete = "highConsume/defaultRule/ruleDelete.do";//删除餐别规则
	
	var siteQuery = "highConsume/defaultRule/siteQuery.do";//场所查询
	
	var limitQuery = "highConsume/defaultRule/limitQuery.do";//餐别限制查询
	
	var limitUpdate = "highConsume/defaultRule/limitUpdate.do";//餐别限制修改
	
	var ruleListQuery = "highConsume/defaultRule/ruleListQuery.do";//规则明细查询
	
	var ruleListDelete = "highConsume/defaultRule/ruleListDelete.do";//规则明细删除
	
	var ruleListAdd = "highConsume/defaultRule/ruleListAdd.do";//规则明细添加
	
	var timeQuery = "highConsume/defaultRule/timeQuery.do";//规则时段查询
	
	var meal_columns = [//列字段定义
    	 [{
	   		field : 'meal_name',
	   		title : 'meal',
	   		align : "center",
	   		width:221
         }]];
	
	var rule_columns = [//列字段定义
       	 [{
    		field : 'rule_name',
    		title : 'rule',
    		align : "center",
    		width:221
         }]];
   	
   	var time_columns =  [//列字段定义
       	 [{
     		field : 'begin_date',
     		title : '开始时间',
     		align : "center",
     		width:110
         },{
     		field : 'end_date',
     		title : '结束时间',
     		align : "center",
     		width:110
         }]];
	
	var northUI = {
		eName:"div",
		cssClass:"default_center_div",
		elements:[{
			eName:"div",
			cssClass:"odd_div",
			width:220,
			elements:[{
				eName:"div",
				cssClass:"div_head",
				elements:[{
					eName:"img",
					src:"image/icon01.gif"
				},{
					eName:"span",
					text:"餐别"
				}]
			},{
				eName:"div",
				height:295,
				elements:{
					eName:"datagrid",
					id:"mealTable",
					idField : '',
					url : mealQuery,
					columns : meal_columns,
					pagination: false,
					alertFlag : false,// 是否弹出默认对话框
					autoload : true,
					singleSelect:true,
					checkOnSelect:false,
					selectOnCheck:false,
					showHeader:false,
					border:false,
					onSelect:loadRule,
					onClickRow:loadTime,
					onLoadSuccessEx:function(retJson){
						if(retJson.id==0){
							
						}else{
							$.alert(retJson.info);
						}
					}
				}
			}]
		},{
			eName:"div",
			cssClass:"img_div",
			width:30,
			elements:[{
				eName:"span",
				cssClass:"img_span"
			},{
				eName:"img",
				src:"image/arrow1.gif"
			}]
		},{
			eName:"div",
			cssClass:"odd_div",
			width:220,
			elements:[{
				eName:"div",
				cssClass:"div_head",
				elements:[{
					eName:"img",
					src:"image/icon01.gif"
				},{
					eName:"span",
					text:"餐别规则"
				}]
			},{
				eName:"div",
				cssClass:"div_btn",
				elements:[{
					eName:"linkbutton",
					uId:"tm1",
					cssClass:"defaultRule_linkbutton",
					width:50,
					height:30,
					text:"新增",
					onClick:addMealRule
				},{
					eName:"linkbutton",
					uId:"tm1",
					cssClass:"defaultRule_linkbutton",
					width:50,
					height:30,
					text:"修改",
					onClick:modifyMealRule
				},{
					eName:"linkbutton",
					uId:"tm2",
					cssClass:"defaultRule_linkbutton",
					width:50,
					height:30,
					text:"删除",
					onClick:deleteMealRule
				}]
			},{
				eName:"div",
				height:251,
				elements:{
					eName:"datagrid",
					id:"ruleTable",
					idField : '',
					url : ruleQuery,
					columns : rule_columns,
					pagination: false,
					alertFlag : false,// 是否弹出默认对话框
					autoload : false,
					singleSelect:true,
					checkOnSelect:false,
					selectOnCheck:false,
					showHeader:false,
					border:false,
					onClickRow:loadTime
				}
			}]
		},{
			eName:"div",
			cssClass:"img_div",
			width:30,
			elements:[{
				eName:"span",
				cssClass:"img_span"
			},{
				eName:"img",
				src:"image/arrow1.gif"
			}]
		},{
			eName:"div",
			cssClass:"odd_div",
			id:"dep_panel",
			width:220,
			elements:[{
				eName:"div",
				cssClass:"div_head",
				elements:[{
					eName:"img",
					src:"image/icon01.gif"
				},{
					eName:"span",
					text:"场所"
				}]
			},{
				eName:"div",
				height:295,
				elements:{
					eName:"treeEx",
					id:"dep_serial",
					pid:"dep_parent",
					nodeText:"dep_name",
					url:siteQuery,
					fit : 'true',
					checkbox:false,
					onClickEx:loadTime
				}
			}]
		},{
			eName:"div",
			cssClass:"img_div",
			width:30,
			elements:[{
				eName:"span",
				cssClass:"img_span"
			},{
				eName:"img",
				src:"image/arrow1.gif"
			}]
		},{
			eName:"div",
			cssClass:"odd_div",
			width:220,
			elements:[{
				eName:"div",
				cssClass:"div_head",
				elements:[{
					eName:"img",
					src:"image/icon01.gif"
				},{
					eName:"span",
					text:"时段"
				}]
			},{
				eName:"div",
				cssClass:"div_btn",
				elements:[{
					eName:"linkbutton",
					uId:"tm1",
					cssClass:"defaultRule_linkbutton",
					width:50,
					height:30,
					text:"新增",
					onClick:addRuleTime
				},{
					eName:"linkbutton",
					uId:"tm1",
					cssClass:"defaultRule_linkbutton",
					width:50,
					height:30,
					text:"修改",
					onClick:modifyRuleTime
				},{
					eName:"linkbutton",
					uId:"tm1",
					cssClass:"defaultRule_linkbutton",
					width:50,
					height:30,
					text:"删除",
					onClick:deleteRuleTime
				}]
			},{
				eName:"div",
				height:251,
				elements:{
					eName:"datagrid",
					id:"timeTable",
					idField : '',
					columns : time_columns,
					pagination: false,
					alertFlag : false,// 是否弹出默认对话框
					autoload : false,
					singleSelect:true,
					checkOnSelect:false,
					selectOnCheck:false,
					showHeader:true,
					border:false
				}
			}]
		},{
			eName:"div",
			cssClass:"confirm_div",
			width:100,
			elements:[{
				eName:"span",
				cssClass:"img_span"
			},{
				eName:"linkbutton",
				uId:"tm2",
				cssClass:"defaultRule_confirm_btn",
				text:"<span style='font-size:13px;line-height:70px;'>确定</span>",
				onClick:addRuleList
			}]
		}]
	};
	
	var centerUI = {
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
							width:85,
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
							width:85,
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
							width:85,
							value:''
						},{
							eName:"span",
							cssClass:"first_div_span",
							text:"单次限额"
						},{
							eName:"textbox",
							name:"single_limit",
							validType:['money','moneyMax'],
							width:85,
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
							text:"离线消费限额",
						},{
							eName:"textbox",
							name:"limit_amt",
							validType:['money','moneyMax'],
							width:85,
							value:'',
							onChange:moneyInput4
						},]
					}]
				}
			},{
				eName:"div",
				id:"modifyLimitBtn",
				elements:{
					eName:"linkbutton",
					uId:"tm1",
					cssClass:"consumeRule_confirm_btn",
					cssStyle:"margin:0 0 0 200px;",
					text:"<span style='font-size:13px;line-height:70px;'>修改</span>",
					onClick:modifyLimit
				}
			},{
				eName:"div",
				id:"saveLimitBtn",
				elements:{
					eName:"linkbutton",
					uId:"tm2",
					cssClass:"consumeRule_confirm_btn",
					cssStyle:"margin:0 0 0 200px;",
					text:"<span style='font-size:13px;line-height:70px;'>保存</span>",
					onClick:saveLimit
				}
			}]
		};
	
	var north_columns = [//列字段定义
	    [ {
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
    	},{
    		title : '餐别规则',
    		colspan:9,
    		align : "center",
    		width : 80
    	}, {
    		field : 'dep_name',
    		title : '场所',
    		rowspan:2,
    		align : "center",
    		width : 80
    	}, {
    		field : 'interval',
    		title : '时段',
    		rowspan:2,
    		align : "center",
    		width : 80
    	}, {
    		field : 'operation',
    		title : '操作',
    		rowspan:2,
    		align : "center",
    		width : 80,
    		formatter:function(value,row,index){  
	        var btn = "<span class='column_delete_btn' uId='save' rowindex='"+index+"'>删除</span>"
	        return btn;  
	    }  
    	}],[{
       		field : 'rule_name',
       		title : '餐别规则名称',
       		align : "center",
       		width : 80
       	}, {
       		field : 'rule_type',
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
    		field : 'meal_sub_enable',
    		title : '餐补贴启用',
    		align : "center",
    		width : 80
    	},{
    		field : 'meal_sub_type',
    		title : '餐补方式',
    		align : "center",
    		width : 100
    	}, {
    		field : 'meal_sub_amt_str',
    		title : '补贴金额',
    		align : "center",
    		width : 80
    	}, {
    		field : 'meal_sub_rate',
    		title : '补贴比率',
    		align : "center",
    		width : 80
    	}, {
    		field : 'meal_sub_valid_days',
    		title : '餐补贴有效期',
    		align : "center",
    		width : 100
    	}] ];
	
	var southUI = {
		eName : 'datagrid',
		id:"northTable",
		idField : '',
		url : ruleListQuery,
		//toolbarEx : toolBar,// 查询条件工具栏
		columns : north_columns,
		pagination: false,//分页这里需要去掉然后改成金额统计
		showFooter:true,
		alertFlag : false,// 是否弹出默认对话框
		autoload : false,
		singleSelect:true,
		checkOnSelect:false,
		selectOnCheck:false,
		onLoadSuccessEx:function(data){
			var mygrid = $(this);
			var mypanel = $(this).datagrid('getPanel');
			mypanel.find(".column_delete_btn").click(function(){
				var mytr = $(this).parents('tr.datagrid-row');
				$.confirm("是否确定删除？",function(c){
					if(c){
						mygrid.datagrid("selectRow",mytr.prop('rowIndex'));
						var row = mygrid.datagrid("getSelected");
						var params = {};
						params['acdep_ruleid'] = row.acdep_ruleid;
						$.postEx(ruleListDelete,params,function(retJson){
							if(retJson.result){
								loadRuleList();
							}
						});
					}
				});
			});
		}
	};
	
	var mainUI = {
			eName : 'div',// 容器布局类，jeasyui组件
			cssStyle:'font-family: 微软雅黑, Arial;overflow:auto;height:100%;',
			fit : true,
			elements : [{
				eName : 'div',
				//height : 350,
				cssStyle:"min-height:350px;height:45%;min-width:1140px;",
				border : false,
				collapsible:false,
				noheader : true,
				elements : northUI
			},
			{
				eName : 'div',
				border : false,
				height:100,
				//cssStyle:"min-height:100px;",
				collapsible:false,
				noheader : true,
				elements : centerUI
			},
			{
				eName : 'div',
				//height : 300,
				cssStyle:"min-height:300px;height:40%;",
				border : false,
				collapsible:false,
				noheader : true,
				elements : southUI
			}]
	};
	
	//创建dom
	jqObj.loadUI(mainUI);
	
	var ruleTable = jqObj.findJq("ruleTable");
	var ruleLimitForm = jqObj.findJqUI("ruleLimitForm");
	var mealTable = jqObj.findJq("mealTable");
	var timeTable = jqObj.findJq("timeTable");
	var northTable = jqObj.findJq("northTable");
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
	
	function loadTime(){
		//var crowdRow = crowdTable.datagrid("getSelected");
		var mealRow = mealTable.datagrid("getSelected");
		var ruleRow = ruleTable.datagrid("getSelected");
		var placeRow = dep_serial.tree("getSelected");
		if(mealRow && ruleRow && placeRow){
			var param = {};
			param['crowd_id'] = "1";
			param['meal_id'] = mealRow.meal_id;
			param['rule_id'] = ruleRow.rule_id;
			param['acdep_serial'] = placeRow.dep_serial;
			$.postEx(timeQuery,param,function(retJson){
				if(retJson.result && retJson.data){
					timeTable.datagrid("loadDataEx",retJson);
				}else{
					$.alert(retJson.info);
				}
			});
		}
	}
	
	function addMealRule(){
		var mealRow = mealTable.datagrid("getSelected");
		if(mealRow==null){
			$.alert("请选择一个餐别！");
		}
		else{
			var params = {};
			params['crowd_id'] = "1";
			params['meal_id'] = mealRow.meal_id;
			var myWin = $.createWin({
				title:"新增规则",
				width:350,
				height:450,
				queryParams:{
					params:params,
					callback:loadRule
				},
				url:"js/highConsume/defaultRule_addMealRule.js"
			});
		}
	}
	
	function modifyMealRule(){
		var ruleRow = ruleTable.datagrid("getSelected");
		if(ruleRow==null){
			$.alert("请选择一个规则！");
		}else{
			var myWin = $.createWin({
				title:"修改规则",
				width:350,
				height:450,
				queryParams:{
					params:ruleRow,
					callback:loadRule,
					refresh:loadRuleList
				},
				url:"js/highConsume/defaultRule_modifyMealRule.js"
			});
		}
	}
	
	function deleteMealRule(){
		var ruleRow = ruleTable.datagrid("getSelected");
		if(ruleRow==null){
			$.alert("请选择一个规则！");
		}else{
			$.confirm("确认删除这个规则吗？",function(c){
				if(c){
					var params = {};
					params['rule_id'] = ruleRow.rule_id;
					$.postEx(ruleDelete,params,function(retJson){
						if(retJson.result){
							loadRule();
						}else{
							$.alert(retJson.info);
						}
					});
				}
			});
		}
	}
	
	function loadRule(){
		var mealRow = mealTable.datagrid("getSelected");
		if(mealRow!=null){
			var params = {};
			params['crowd_id'] = "1";
			params['meal_id'] = mealRow.meal_id;
			ruleTable.datagrid("load",params);
		}
	}
	
	//loadLimit();
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
	
	function loadRL(){
		loadRule();
		loadLimit();
		loadRuleList();
	}
	
	function limitEnable(){
		if(limit_enable.prop("checked")){
			limit_amt.textbox("enable");
		}else{
			limit_amt.textbox("disable");
			//limit_amt.textbox("setValue","");
		}
	}
	
	function addRuleTime(){
		var rows = timeTable.datagrid("getRows");
		var params = mealTable.datagrid("getSelected");
		if(params==null){
			$.alert("请先选择餐别！");
		}else{
			if(rows.length<5){
				var myWin = $.createWin({
					title:"新增时段",
					width:300,
					height:250,
					queryParams:{
						params:params,
						callback:loadRuleTime
					},
					url:"js/highConsume/defaultRule_addRuleTime.js"
				});
			}
			else{
				$.alert("最多添加5个时段！");
			}
		}
	}
	
	function modifyRuleTime(){
		var row = timeTable.datagrid("getSelected");
		var row2 = mealTable.datagrid("getSelected");
		if(row!=null){
			var params = {};
			params['begin_date'] = row.begin_date;
			params['end_date'] = row.end_date;
			var myWin = $.createWin({
				title:"修改时段",
				width:300,
				height:250,
				queryParams:{
					params:params,
					params2:row2,
					callback:updateRow
				},
				url:"js/highConsume/defaultRule_modifyRuleTime.js"
			});
		}else{
			$.alert("请选择一条记录！");
		}
	}
	
	function deleteRuleTime(){
		var row = timeTable.datagrid("getSelected");
		if(row!=null){
			$.confirm("确定要删除这个时段吗？",function(c){
				if(c){
					var index = timeTable.datagrid("getRowIndex",row);
					timeTable.datagrid("deleteRow",index);
				}
			});
		}else{
			$.alert("请选择一条记录！");
		}
	}
	
	function loadRuleTime(params){
		var oldParams = timeTable.datagrid("getRows");
		//非顺序插入
//		var flag = 1;
//		$.each(oldParams,function(i, oldParam){
//			if(oldParam.begin_date>params[0].end_date || oldParam.end_date<params[0].begin_date){
//				flag = 1;
//			}else{
//				flag = 0;
//				return false;
//			}
//		});
//		if(flag){
//			var newParams = oldParams.concat(params);
//			timeTable.datagrid("loadData",newParams);
//		}else{
//			$.alert("时间不能有交叉，请重新添加！");
//		}
		//顺序插入
		if(oldParams.length>0){
			if(oldParams[(oldParams.length-1)].end_date>params[0].begin_date){
				$.alert("时间不能有交叉，请重新添加！");
			}else{
				var newParams = oldParams.concat(params);
				timeTable.datagrid("loadDataEx",newParams);
			}
		}else{
			timeTable.datagrid("loadDataEx",params);
		}
	}
	
	function updateRow(params){
		var oldParams = timeTable.datagrid("getRows");
		var flag = 1;
		var row = timeTable.datagrid("getSelected");
		var index = timeTable.datagrid("getRowIndex",row);
		$.each(oldParams,function(i, oldParam){
			if(oldParam!=row){
				if(oldParam.begin_date>=params.end_date
						|| oldParam.end_date<=params.begin_date){
					flag = 1;
				}else{
					flag = 0;
					return false;
				}
			}
		});
		if(flag){
			timeTable.datagrid("updateRow",{
				index:index,
				row:params
			});
		}else{
			$.alert("时间不能有交叉，请重新添加！");
		}
	}
	
	function loadRuleList(){
		var params = {};
		params['crowd_id'] ="1";
		northTable.datagrid("load",params);
	}
	
	function addRuleList(){
		var ruleRow = ruleTable.datagrid("getSelected");
		var depRows = dep_serial.tree("getSelected");
		var timeRows = timeTable.datagrid("getRows");
		if(ruleRow==null){
			$.alert("请选择一个餐别规则！");
		}
		else if(depRows==null){
			$.alert("请选择一个场所！");
		}
		else if(timeRows.length<1){
			$.alert("请指定时段！");
		}else{
			var times = [];
			$.each(timeRows,function(i, timeRow){
				var time = timeRow.begin_date+"-"+timeRow.end_date;
				times.push(time);
			});
			var params = {};
			params['rule_id'] = ruleRow.rule_id;
			params['acdep_id'] = depRows.dep_serial;
			params['interval'] = times.join();
			$.postEx(ruleListAdd,params,function(retJson){
				if(retJson.result){
					loadRuleList();
				}else{
					$.alert(retJson.info);
				}
			});
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
	