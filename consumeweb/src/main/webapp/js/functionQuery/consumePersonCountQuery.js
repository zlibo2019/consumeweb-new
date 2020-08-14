//消费个人汇总查询

garen_define("js/functionQuery/consumePersonCountQuery", function(jqObj, loadParams) {
	
	var utils = garen_require("utils");
	
	var base = garen_require("js/base/ws_public");
	
	var depQuery = base.depQuery;//部门查询
	
	var detailQuery = "functionQuery/consumePersonCount/detailQuery.do";//查询
	
	// 工具栏
	var toolBar = [ null, {
		eName : 'div',
		cssClass:'systemOperationLog_topDiv',
		elements : [{
			eName : 'div',cssClass:'div_first',
			elements : [ {
				eName:"span",
				text:"开始时间"
			}, {
				eName:"datebox",
				name:"start_date",
				editable:false,
				width : 150,
				height : 25
			}, {
				eName:"span",
				text:"结束时间"
			}, {
				eName:"datebox",
				name:"end_date",
				editable:false,
				width : 150,
				height : 25
			}, {
				eName:"span",
				text:"部门",
			}, {
				eName:"combotree",
				name:"dep_serial",
				panelHeight:$.browser.msie9?200:'auto',
				panelMaxHeight:200,
				width : 150,
				height : 25,
				multiple:true,
				value:'',//默认值
				onSelect:function(node){//选择相同则清空文本内容
					if(dep_serial.combo("getText")==node.text){
						dep_serial.combotree("clear");
					}
				}
			}]
		},{
			eName:'div',cssClass:'div_second',
			elements:[{
				eName:'linkbutton',
				uId:"tm1",
				text:'查询',
				plain:true,
				iconCls:'icon-search',
				onClick : function(){
					dataTable.datagrid('loadEx',{url:detailQuery});
				}
			},{
				eName:'linkbutton',
				uId:"tm4",
				text:'导出',
				plain:true,
				iconCls:'icon-import',
				onClick : function(){
					if(dataTable.datagrid('getRows').length==0){
						$.alert("数据为空");
					}else{
						var myWin = $.createWin({
							title:"操作提示",
							width:250,
							height:240,
							queryParams:{
								callback:function(i){
									if(i){
										utils.exportExcel("xls","消费个人汇总查询",dataTable);
									}else{
										utils.exportExcel("xlsx","消费个人汇总查询",dataTable);
									}
								}
							},
							url:"js/functionQuery/consumePersonCountQuery_export.js"
						});
					}
				}
			},{
				eName:'linkbutton',
				uId:"tm2",
				text:'打印',
				plain:true,
				iconCls:'icon-print',
				onClick : function(){
					if(dataTable.datagrid('getRows').length==0){
						$.alert("数据为空");
					}else{
						utils.printGrid("消费个人汇总查询",dataTable);
					}
				}
			}]
		}]
	} ];

	var columns = [//列字段定义
    [  {
   		field : 'ch',
   		title : 'ch',
   		align : "center",  
   		checkbox:true,
   		rowspan:2,
   		width : 50
   	}, {
 		field : 'index',
 		title : '..',
 		align : "center",
 		rowspan:2,
 		width : 50
 	}, {
 		field : 'user_depname',
 		title : '部门',
 		align : "center",
 		rowspan:2,
 		width : 100
 	}, {
 		field : 'user_no',
 		title : '学/工号',
 		align : "center",
 		rowspan:2,
 		width : 100
 	}, {
 		field : 'user_lname',
 		title : '姓名',
 		align : "center",
 		rowspan:2,
 		width : 80
 	}, {
 		field : 'meal1',
 		title : '早餐',
 		align : "center",
 		colspan:3,
 		width : 240
 	}, {
 		field : 'meal2',
 		title : '午餐',
 		align : "center",
 		colspan:3,
 		width : 240
 	}, {
 		field : 'meal3',
 		title : '晚餐',
 		align : "center",
 		colspan:3,
 		width : 240
 	}, {
 		field : 'meal4',
 		title : '夜宵',
 		align : "center",
 		colspan:3,
 		width : 240
 	}, {
 		field : 'meal5',
 		title : '其他',
 		align : "center",
 		colspan:3,
 		width : 240
 	}, {
 		field : 'sum_meal',
 		title : '合计',
 		align : "center",
 		colspan:3,
 		width : 240
 	}
 	
 	],[{
 		field : 'meal1_count',
 		title : '计次次数',
 		align : "center",
 		width : 80
 	}, {
 		field : 'meal1_cash_count',
 		title : '金额次数',
 		align : "center",
 		width : 80
 	}, {
 		field : 'meal1_cash_amt_str',
 		title : '消费金额',
 		align : "center",
 		width : 80
 	}, {
 		field : 'meal2_count',
 		title : '计次次数',
 		align : "center",
 		width : 80
 	}, {
 		field : 'meal2_cash_count',
 		title : '金额次数',
 		align : "center",
 		width : 80
 	}, {
 		field : 'meal2_cash_amt_str',
 		title : '消费金额',
 		align : "center",
 		width : 80
 	}, {
 		field : 'meal3_count',
 		title : '计次次数',
 		align : "center",
 		width : 80
 	}, {
 		field : 'meal3_cash_count',
 		title : '金额次数',
 		align : "center",
 		width : 80
 	}, {
 		field : 'meal3_cash_amt_str',
 		title : '消费金额',
 		align : "center",
 		width : 80
 	}, {
 		field : 'meal4_count',
 		title : '计次次数',
 		align : "center",
 		width : 80
 	}, {
 		field : 'meal4_cash_count',
 		title : '金额次数',
 		align : "center",
 		width : 80
 	}, {
 		field : 'meal4_cash_amt_str',
 		title : '消费金额',
 		align : "center",
 		width : 80
 	}, {
 		field : 'meal5_count',
 		title : '计次次数',
 		align : "center",
 		width : 80
 	}, {
 		field : 'meal5_cash_count',
 		title : '金额次数',
 		align : "center",
 		width : 80
 	}, {
 		field : 'meal5_cash_amt_str',
 		title : '消费金额',
 		align : "center",
 		width : 80
 	}, {
 		field : 'sum_meal_count',
 		title : '计次次数',
 		align : "center",
 		width : 80
 	}, {
 		field : 'sum_cash_count',
 		title : '金额次数',
 		align : "center",
 		width : 80
 	}, {
 		field : 'sum_cash_amt_str',
 		title : '消费金额',
 		align : "center",
 		width : 80
 	}] ];
	
	
	var centerUI = {
		eName : 'datagrid',
//		url:logQuery,
		id:"dataTable",
		idField : 'user_no',
		toolbarEx : toolBar,// 查询条件工具栏
		columns : columns,
		docType:'xls',
		diret:2,
		pagination : true,
		clientPager:true,
		alertFlag : false,// 是否弹出默认对话框
		showFooter: true,
		autoload : false,
		singleSelect : true,
		checkOnSelect:true,
		selectOnCheck:true,
		onLoadSuccessEx:function(retJson){
			if(retJson.id=="0"){
				dep_serial.combotree("clear");
			}else{
				$.alert(retJson.info);
			}
		}

	};
	
	
	var mainUI = {
		eName : 'layoutExt',// 容器布局类，jeasyui组件
		cssStyle:'font-family: 微软雅黑, Arial;',
		fit : true,
		elements : [{
			region : 'center',
			elements : centerUI
		}]
	};

	jqObj.loadUI(mainUI);
	var dataTable = jqObj.findJq("dataTable");
	var dep_serial = jqObj.findJq("dep_serial");
	var st = jqObj.findJq("start_date");
	var et = jqObj.findJq("end_date");
	
	loadDate();//初始化
	loadTree();
	
	
//	function loadTable(){
//		dataTable.datagrid('loadEx',{url:logQuery});
//	}
	
	function loadTree(){
		$.postEx(depQuery,function(retJson){
			if(retJson.result && retJson.data){
				dep_serial.combotree('loadData',
						$.list2Tree(retJson.data,"dep_serial","dep_parent","dep_name"));
			}
		});
	}
	
	function loadDate(){
		var date = new Date();
		date.setDate(date.getDate()-1);
		
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		var d = date.getDate();
		
		st.datebox("setValue",y + '-' + m + '-' + "1");
		et.datebox("setValue",y + '-' + m + '-' + d);
	}
});

