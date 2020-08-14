//补贴发放
garen_define("js/subsidy/provide",function (jqObj,loadParams) {
	
	var base = garen_require("js/base/ws_public");
	
	var checkCoreIp = base.checkCoreIp;//核心业务IP授权验证
	
	var provideRuleQuery = "subsidy/provideRuleQuery.do";//规则查询
	
	var provideUserQuery = "subsidy/provideUserQuery.do";//发放人员名单查询
	
	var provideSearchUserQuery = "subsidy/provideSearchUserQuery.do";//发放人员名单查询--模糊查询
	
	var provideUserDelete = "subsidy/provideUserDelete.do";//删除人员
	
	var provideUserClear = "subsidy/provideUserClear.do";//清空人员
	
	var subsidyProvide = "subsidy/subsidyProvide.do";//补贴发放
	
	var scmurl = garen_require("js/lib/scmurl");//url地址
	
	//工具栏
	var toolBar = [null,/*{
		eName : 'div',
		height:10,
		cssStyle : 'background:#ffffff;'
	},*/ {
		eName : 'div',
		cssClass:"provide_toolBar_first",
		height:109,/*130*/
		elements:{
			eName:"div",
			elements:[{
				eName:"div",cssClass:'toolImage',cssStyle:'margin-left:18px;',
				elements:[{
					eName:"img",
					src:"image/step01.gif",
				},{
					eName:"div",
					elements:"第一步：补贴规则"
				}]
			},{
				eName:"div",
				width:90,
				elements:[{
					eName : 'linkbutton',cssClass:'linkBtn',
					uId:"tm1",
					width:85,
					height:31,
					text:"创建规则",
					id:"addRuleBtn",
					onClick : addRule
				},{
					eName : 'linkbutton',
					uId:"tm1",
					width:85,
					height:31,
					text:"修改规则",
					id:"updateRuleBtn",
					onClick : updateRule
				}]
			},{
				eName:"div",cssClass:'divThree',
				elements:{
					eName:"img",
					src:"image/arrow.gif",
				}
			},{
				eName:"div",cssClass:'toolImage',cssStyle:'margin-left:8px',
				elements:[{
					eName:"img",
					src:"image/step02.gif",
				},{
					eName:"div",
					elements:"第二步：补贴名单"
				}]
			},{
				eName:"div",
				width:90,
				elements:[{
					eName : 'linkbutton',cssClass:'linkBtn',
					uId:"tm1",
					width:85,
					height:31,
					text:"补贴录入",
					id:"addSubsidyBtn",
					onClick :addSubsidy
				},{
					eName : 'linkbutton',
					uId:"tm1",
					width:85,
					height:31,
					text:"补贴导入",
					id:"excelSubsidyBtn",
					onClick : excelSubsidy
				}]
			},{
				eName:"div",cssClass:'divThree',
				elements:{
					eName:"img",
					src:"image/arrow.gif",
				}
			},{
				eName:"div",cssClass:'toolImage',cssStyle:'margin-left:20px',
				elements:[{
					eName:"img",
					src:"image/step03.gif",
				},{
					eName:"div",
					elements:"第三步：发放"
				}]
			},{
				eName:"div",
				elements:{
					eName : 'linkbutton',cssClass:'divEight',
					uId:"tm2",
					width:85,
					height:75,
					text:"确认发放",
					id:"subsidyResultBtn",
					onClick : subsidyResult
				}
			}]
		}
		
	}, {
		eName : 'div',
		cssClass : 'provide_toolBar_second',
		elements : {
			eName : 'div',
			elements : [{
				eName : "span",
				elements:"当前规则信息"
			},{
				eName : "span",
				text:"补贴月份："
			},{
				eName : 'textbox',
				id:"sub_month",
				disabled:true,
				width : 100,
				height : 25
			},{
				eName : "span",
				text:"批次号："
			},{
				eName : 'textbox',
				id:"batch_no",
				disabled:true,
				width : 100,
				height : 25
			},{
				eName : "span",
				text:"操作员："
			},{
				eName : 'textbox',
				id:"gly_no",
				disabled:true,
				width : 100,
				height : 25
			},{
				eName : "span",
				text:"启用日期："
			},{
				eName : 'textbox',
				id:"begin_date",
				disabled:true,
				width : 100,
				height : 25
			},{
				eName : "span",
				text:"有效日期："
			},{
				eName : 'textbox',
				id:"end_date",
				disabled:true,
				width : 100,
				height : 25
			},{
				eName:"input",
				name:"enable_enddate",
				cssStyle:"display:none;"
			}]
		}
	}, {
		eName : 'div',
		cssClass : 'provide_toolBar_third',
		elements : {
			eName : 'div',
			elements : [{
				eName : 'div',
//				cssStyle:"display:inline-block;",
				elements : [{
					eName : 'linkbutton',
					uId:"tm2",
					width:100,
					height:35,
					id:"deleteUser",
					text:"删除人员",
					onClick : deleteUserList
				},{
					eName : 'linkbutton',
					uId:"tm2",
					width:100,
					height:35,
					id:"removeUser",
					text:"清空人员",
					onClick : clearUserList
				}]
			},{
				eName : 'div',
				cssStyle:"margin-left:100px;position:absolute;",
//				margin-top:30px;
				elements : [{
					eName:'span',
					cssStyle:'font-size:28px;',
					text:'总计：'
				},{
					eName:'span',
					id:"provide_count",
					cssStyle:'font-size:28px;color:red;margin-right:5px;',
					text:'0.00'
				},{
					eName:'span',
					cssStyle:'font-size:28px;',
					text:'元'
				}]
				
		},{
			eName : 'div',
			cssStyle:"margin-left:400px;position:absolute;",
			elements : [{
				eName:"searchbox",
				name:"search_txt",
				width:250,
				height:30,
				prompt:"请输入关键字...",
				searcher:userFilterSearch
			},{
				eName : 'linkbutton',
				uId:"tm2",
				width:100,
				height:35,
				id:"clearCondition",
				text:"清空条件",
				onClick : clearCondition
			}]
		}]
		}
	}];
	
	var columns = [//列字段定义
      	[ {
       		field : 'ch',
       		title : 'ch',
       		align : "center",  
       		checkbox:true,
       		width : 50
       	}, {
       		field : 'index',
       		title : '..',
       		align : "center",    
       		width : 50
       	}, {
       		field : 'user_no',
       		title : '学/工号',
       		align : "center",
       		width : 150
       	}, {
       		field : 'user_lname',
       		title : '姓名',
       		align : "center",
       		width : 120
       	}, {
       		field : 'user_depname',
       		title : '部门',
       		align : "center",
       		width : 300
       	}, {
       		field : 'user_duty',
       		title : '身份类型',
       		align : "center",
       		width : 150
       	}, {
       		field : 'sub_amt_str',
       		title : '补贴金额',
       		align : "center",
       		width : 120
       	}, {
       		field : 'send_state',
       		title : '发放状态',
       		align : "center",
       		width : 120
       	}] 
    ];
	
	var centerUI = {
		eName : 'datagrid',
		id:"dataTable",
		idField : 'account_id',
		toolbarEx : toolBar,// 查询条件工具栏
		columns : columns,
		pagination: true,
		clientPager:true,
		alertFlag : false,// 是否弹出默认对话框
		autoload : false,
		singleSelect: false,
		checkOnSelect:true,
		selectOnCheck:true,
		onLoadSuccessEx:function(retJson){
			if(retJson.id == undefined) return;
			if(retJson.id=="0"){
				provide_count.html(retJson.retData[0].subamts_str);
				if(retJson.rows.length>0){
					deleteUser.linkbutton("enable");
					removeUser.linkbutton("enable");
					subsidyResultBtn.linkbutton("enable");
				}else{
					deleteUser.linkbutton("disable");
					removeUser.linkbutton("disable");
					subsidyResultBtn.linkbutton("disable");
				}
			}
			else{
				$.alert(retJson.info);
			}
		}
	};
	
	var southUI = {eName : 'div',
			cssStyle:"margin-left:50px;position:relative;margin-top:30px;",
			elements : [{
				eName:'span',
				cssStyle:'font-size:28px;',
				text:'总计：'
			},{
				eName:'span',
				id:"provide_count",
				cssStyle:'font-size:28px;color:red;margin-right:5px;',
				text:'0.00'
			},{
				eName:'span',
				cssStyle:'font-size:28px;',
				text:'元'
			}]
			
	};
	
	var mainUI = {
		eName:"layoutExt",
		cssStyle:'font-family: 微软雅黑, Arial;',
		fit : true,
		elements : [{
			region : 'center',
			elements : centerUI
		},
		/*{
			region : 'south',
			height : 100,
			border : false,
			collapsible:false,
			noheader : true,
			elements : southUI
		}*/]
	}
	
	//新增规则
	function addRule(){
		var myWin = $.createWin({
			title:"新增规则",
			width:380,
			height:300,
			queryParams:{
				callback:loadRule
			},
			url:"js/subsidy/provide_addRule.js"
		});
	}
	//修改规则
	function updateRule(){
		var params = {};
		params['sub_month'] = sub_month.textbox("getValue");
		params['batch_no'] = batch_no.textbox("getValue");
		params['gly_no'] = gly_no.textbox("getValue");
		params['begin_date'] = begin_date.textbox("getValue");
		params['end_date'] = end_date.textbox("getValue");
		params['enable_enddate'] = enable_enddate.val();
		var myWin = $.createWin({
			title:"修改规则",
			width:380,
			height:300,
			queryParams:{
				params:params,
				callback:loadRule
			},
			url:"js/subsidy/provide_updateRule.js"
		});
	}
	//补贴录入
	function addSubsidy(){
		var myWin = $.createWin({
			title:"补贴录入",
			width:700,
			height:650,
			queryParams:{
				callback:loadSubsidyUser
			},
			url:"js/subsidy/provide_addSubsidy.js"
		});
	}
	//补贴导入
	function excelSubsidy(){
		var myWin = $.createWin({
			title:"补贴导入",
			width:467,
			height:450,
			queryParams:{
				callback:loadSubsidyUser
			},
			url:"js/subsidy/provide_excelSubsidy.js"
		});
	}
	
	//确认发放
	function subsidyResult(){
		
		var params = {};
//		var ids = [];
//		var amts = [];
//		var rows = dataTable.datagrid("getRows");
//		$.each(rows,function(i, row){
//			ids.push(row.account_id);
//			amts.push(row.sub_amt);
//		});
//		params['account_id'] = ids.join();
//		params['sub_amt'] = amts.join();
		params['sub_month'] = sub_month.textbox("getValue");
		params['batch_no'] = batch_no.textbox("getValue");
		// 重置搜索框内容 add by LYh
		search_txt.searchbox("reset");
		// 列表框中显示所有未发放的数据
		dataTable.datagrid("loadEx",{url:provideUserQuery});
		$.confirm("确定要对这些人员发放补贴吗？",function(c){
			if (c) {
				$.progress('正在发放补贴...');
				$.postEx(subsidyProvide,params,function(retJson){
					$.progress("close");
					if(retJson.result){
						if(retJson.data.length<1){//没有失败数据
							var myWin = $.createWin({
								title:"发放结果",
								width:650,
								height:180,
								queryParams:{
									callback:refresh,
									retData:retJson.retData
								},
								url:"js/subsidy/provide_subsidyResult_1.js"
							});
						}else{
							var myWin = $.createWin({
								title:"发放结果",
								width:650,
								height:450,
								queryParams:{
									callback:refresh,
									data:retJson.data,
									retData:retJson.retData
								},
								url:"js/subsidy/provide_subsidyResult_2.js"
							});
						}
					}else{
						$.alert(retJson.info,function(){
							refresh();
						});
						//refresh();
					}
				});
			}
		});
		
		
		
		
	}
	//工/学号 或者 姓名 模糊查询
  function userFilterSearch(){
		// 获取筛选框中的值
		var params = {};
		params['filter'] = search_txt.searchbox("getValue");
		$.postEx(provideSearchUserQuery,params,function(retJson){
			if(retJson.result && retJson.data){
				dataTable.datagrid("loadData",retJson.data);
			}else{
				$.alert(retJson.info,function(){
					refresh();
				});
			}
		});
		
	}
	
	
	
	
	
	jqObj.loadUI(mainUI);
	var dataTable = jqObj.findJq("datagrid");
	var sub_month = jqObj.findJq("sub_month");
	var batch_no = jqObj.findJq("batch_no");
	var gly_no = jqObj.findJq("gly_no");
	var begin_date = jqObj.findJq("begin_date");
	var end_date = jqObj.findJq("end_date");
	var addRuleBtn = jqObj.findJq("addRuleBtn");
	var updateRuleBtn = jqObj.findJq("updateRuleBtn");
	var addSubsidyBtn = jqObj.findJq("addSubsidyBtn");
	var excelSubsidyBtn = jqObj.findJq("excelSubsidyBtn");
	var subsidyResultBtn = jqObj.findJq("subsidyResultBtn");
	var deleteUser = jqObj.findJq("deleteUser");
	var removeUser = jqObj.findJq("removeUser");
	var provide_count = jqObj.findJq("provide_count");
	var enable_enddate = jqObj.findJq("enable_enddate");
	// 模糊查询条件框
	var search_txt = jqObj.findJq("search_txt");
	
	loadInit();
	
	function loadInit(){
		$.postEx(checkCoreIp,{'op_name':'补贴发放'},function(retJson){
			if(retJson.result){
				
			}else{
				$.alert(retJson.info,function(){
					//window.parent.location.reload();
					window.top.location.href=scmurl;
				});
			}
		});
	}
	
	//加载规则信息
	loadRule();
	function loadRule(){
		$.postEx(provideRuleQuery,function(retJson){
			if(retJson.result && retJson.data.length>0){
				sub_month.textbox("setValue",retJson.data[0].sub_month);
				batch_no.textbox("setValue",retJson.data[0].batch_no);
				gly_no.textbox("setValue",retJson.data[0].gly_no);
				begin_date.textbox("setValue",retJson.data[0].begin_date_str);
				end_date.textbox("setValue",retJson.data[0].end_date_str);
				enable_enddate.val(retJson.data[0].enable_enddate);
				addRuleBtn.linkbutton("disable");
				updateRuleBtn.linkbutton("enable");
				addSubsidyBtn.linkbutton("enable");
				excelSubsidyBtn.linkbutton("enable");
			}else{
				addRuleBtn.linkbutton("enable");
				updateRuleBtn.linkbutton("disable");
				addSubsidyBtn.linkbutton("disable");
				excelSubsidyBtn.linkbutton("disable");
				subsidyResultBtn.linkbutton("disable");
				deleteUser.linkbutton("disable");
				removeUser.linkbutton("disable");
				subsidyResultBtn.linkbutton("disable");
			}
		});
	}
	
	//加载人员列表
	loadSubsidyUser();
	function loadSubsidyUser(){
		dataTable.datagrid("loadEx",{url:provideUserQuery});
//		$.postEx(provideUserQuery,function(retJson){
//			if(retJson.result && retJson.data){
//				dataTable.datagrid("loadData",retJson.data);
//				provide_count.html(retJson.retData[0].subamts_str);
//				if(retJson.data.length>0){
//					deleteUser.linkbutton("enable");
//					removeUser.linkbutton("enable");
//					subsidyResultBtn.linkbutton("enable");
//				}else{
//					deleteUser.linkbutton("disable");
//					removeUser.linkbutton("disable");
//					subsidyResultBtn.linkbutton("disable");
//				}
//			}
//		});
	}
	//删除人员
	function deleteUserList(){
		var rows = dataTable.datagrid("getCheckedEx");
		if(rows.length<1){
			$.alert("请先选择人员！");
		}else{
			$.confirm("确定要删除这些人员吗？",function(c){
				if(c){
					var params = {};
					var ids = [];
					$.each(rows,function(i, row){
						ids.push(row.user_serial);
					});
					//params['user_serial'] = row.user_serial;
					params['user_serial'] = ids.join(",");
					$.postEx(provideUserDelete,params,function(retJson){
						if(retJson.result){
							loadSubsidyUser();
						}else{
							$.alert(retJson.info);
						}
					});
				}
			});
		}
	}
	
	//清空人员
	function clearUserList(){
		$.confirm("确定要清空人员吗？",function(c){
			if(c){
				$.postEx(provideUserClear,function(retJson){
					if(retJson.result){
						loadSubsidyUser();
					}else{
						$.alert(retJson.info);
					}
				});
			}
		});
	}
	//清空模糊查询条件框内容
	function clearCondition(){
		// 重置搜索框内容
		search_txt.searchbox("reset");
		dataTable.datagrid("loadEx",{url:provideUserQuery});
		
	}
	//刷新页面
	function refresh(){
		jqObj.loadJs("js/subsidy/provide.js");
	}
	
});
	