//系统日结日志查询

garen_define("js/functionQuery/systemRjLogQuery", function(jqObj, loadParams) {
	
	var utils = garen_require("utils");
	
	var detailQuery = "functionQuery/sysRjLog/detailQuery.do";//查询
	
	//工具栏
	var toolBar = [null,{
		eName : 'div',
		height:60,
		cssClass:"systemOperationLog_topDiv",
		elements : [{
			eName:"div",
			cssClass:'div_first',
			cssStyle:"display:block;margin-top:10px;",
			elements:[{
				eName:"span",
				elements:"当前工作日:"
			},{
				eName:"span",
				cssStyle:"font-weight:bold;",
				name:"today",
				elements:""
			},{
				eName:"span",
				cssStyle:"margin-left:20px;",
				elements:"下一工作日:"
			},{
				eName:"span",
				cssStyle:"font-weight:bold;",
				name:"nextday",
				elements:""
			},{
				eName:"span",
				cssStyle:"margin-left:20px;",
				elements:"自动日结:"
			},{
				eName:"span",
				cssStyle:"font-weight:bold;",
				name:"auto",
				elements:""
			},{
				eName:"span",
				cssStyle:"margin-left:20px;",
				elements:"自动日结时间:"
			},{
				eName:"span",
				cssStyle:"font-weight:bold;",
				name:"auto_time",
				elements:""
			}]
		},{
			eName:'div',
			//cssClass:'div_second',
			cssStyle:"margin-top:10px;",
			elements:[{
				eName:"span",
				cssStyle:"margin-left:5px;margin-right:5px;",
				elements:"指定时间段"
			},{
				eName:"combobox",
				name:"record_cnt",
				value:'1',
				textField: 'label',
				valueField: 'value',
				panelHeight:$.browser.msie9?200:'auto',
				panelMaxHeight:200,
				width : 150,
				height : 25,
				editable:false,
				data: [{
					label: '最近一个月',
					value: '1'
				},{
					label: '最近两个月',
					value: '2'
				},{
					label: '最近三个月',
					value: '3'
				},{
					label: '全部',
					value: '0'
				}]
			},{
				eName:'linkbutton',
				cssStyle:"margin-left:20px;",
				uId:"tm1",
				text:'查询',
				plain:true,
				iconCls:'icon-search',
				onClick : search
			},{
				eName:'linkbutton',
				cssStyle:"margin-left:10px;",
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
										utils.exportExcel("xls","系统日结日志查询",dataTable);
									}else{
										utils.exportExcel("xlsx","系统日结日志查询",dataTable);
									}
								}
							},
							url:"js/functionQuery/systemRjLogQuery_export.js"
						});
					}
				}
			},{
				eName:'linkbutton',
				cssStyle:"margin-left:10px;",
				uId:"tm2",
				text:'打印',
				plain:true,
				iconCls:'icon-print',
				onClick : function(){
					if(dataTable.datagrid('getRows').length==0){
						$.alert("数据为空");
					}else{
						utils.printGrid("系统日结日志查询",dataTable);
					}
				}
			}]
		}]
	}];

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
 		field : 'week_day',
 		title : '星期',
 		align : "center",
 		rowspan:2,
 		width : 80
 	}, {
 		field : 'exec_state',
 		title : '状态（结果）',
 		align : "center",
 		rowspan:2,
 		width : 80
 	}, {
 		field : 'if_auto',
 		title : '自动/手动',
 		align : "center",
 		rowspan:2,
 		width : 80
 	}, {
 		field : 'bill_date',
 		title : '账务日期',
 		align : "center",
 		rowspan:2,
 		width : 100
 	}, {
 		field : 'exec_date',
 		title : '日结日期',
 		align : "center",
 		rowspan:2,
 		width : 100
 	}, {
 		field : 'exec_time',
 		title : '日结时间',
 		align : "center",
 		rowspan:2,
 		width : 80
 	}, {
 		field : 'pos_count',
 		title : 'POS数量',
 		align : "center",
 		rowspan:2,
 		width : 80
 	}, {
 		field : '',
 		title : '消费人次',
 		align : "center",
 		colspan:2,
 		width : 80
 	}, {
 		field : 'trad_amt_str',
 		title : '消费金额',
 		align : "center",
 		rowspan:2,
 		width : 100
 	}, {
 		field : 'bz',
 		title : '备注',
 		align : "center",
 		rowspan:2
 		//width : 160//自适应，以最大宽度为主
 	}
 	],[{
   		field : 'count_numb',
   		title : '计次人次',
   		align : "center",
   		width : 80
   	}, {
   		field : 'count_numb_cash',
   		title : '金额人次',
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
		rowStyler:function(index,row){
			if(row.colour_state==0){
				return 'background-color:#A9E1F9;';
			}else if(row.colour_state==1){
				return 'background-color:#D1D1D1;';
			}else if(row.colour_state==2){
				return 'background-color:#F7D4B3;';
			}else if(row.colour_state==3){
				return 'background-color:#74BEFE;';
			}
		},
		onLoadSuccessEx:function(retJson){
			if(retJson.id=="0"){
				today.html(retJson.retData.current_day);
				nextday.html(retJson.retData.next_day);
				if(retJson.retData.is_auto_bill==1){
					auto.html("启用");
				}else if(retJson.retData.is_auto_bill==0){
					auto.html("停用");
				}else{
					auto.html("未知");
				}
				
				auto_time.html(retJson.retData.auto_bill_time);
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
	var record_cnt = jqObj.findJq("record_cnt");
	var today = jqObj.findJq("today");
	var nextday = jqObj.findJq("nextday");
	var auto = jqObj.findJq("auto");
	var auto_time = jqObj.findJq("auto_time");
	
	search();
	
	function search(){
		dataTable.datagrid("loadEx",{url:detailQuery});
	}
	
});

