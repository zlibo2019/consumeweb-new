//系统操作日志

garen_define("js/operationLog/systemOperationLog", function(jqObj, loadParams) {
	
	var utils = garen_require("utils");
	
	var base = garen_require("js/base/ws_public");
	
	var operatorQuery = base.glyQuery;//操作员查询
	
	var logQuery = "operationLog/logQuery.do";//查询
	
	// 工具栏
	var toolBar = [ null, /*{
		eName : 'div',
		height : 5,
		cssStyle : 'background:#ffffff;'
	}, */{
		eName : 'div',
		cssClass:'systemOperationLog_topDiv',
		elements : [{
			eName : 'div',cssClass:'div_first',
			elements : [ {
				eName:"span",
				text:"开始时间"
			}, {
				eName:"datetimebox",
				name:"sdate",
				editable:false,
				width : 150,
				height : 25
			}, {
				eName:"span",
				text:"结束时间"
			}, {
				eName:"datetimebox",
				name:"edate",
				editable:false,
				width : 150,
				height : 25
			}, {
				eName:"span",
				text:"操作员",
			}, {
				eName:"combogrid",
				id:"operatorList",
				url:operatorQuery,
				name:"gly_no",
				idField: 'gly_no',
				textField: 'gly_no',
				width:150,
				value:'',
				allFlag:true,
				columns:[[
					{field:'gly_lname',checkbox:true},
					{field:'gly_no',title:'全部'}
				]]
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
					dataTable.datagrid('loadEx',{url:logQuery});
				}
			},{
				eName:'linkbutton',
				uId:"tm1",
				text:'导出',
				plain:true,
				iconCls:'icon-import',
				onClick : function(){
					//本地导出文档
					if(dataTable.datagrid('getRows').length==0){
						$.alert("数据为空");
					}else{
				         utils.exportDocByData("系统操作日志",dataTable);
					}
				}
			},{
				eName:'linkbutton',
				uId:"tm1",
				text:'打印',
				plain:true,
				iconCls:'icon-print',
				onClick : function(){
					if(dataTable.datagrid('getRows').length==0){
						$.alert("数据为空");
					}else{
						utils.printGrid("系统操作日志",dataTable);
					}
				}
			}]
		}]
	} ];

	var columns = [// 列字段定义
	[ {
   		field : 'id',
   		title : 'ID',
   		align : "center",
   		checkbox : true,
   		width : 50
   	}, {
  		field : 'index',
  		title : '..',
  		align : "center",
  		width : 50
  	}, {
		field : 'operator',
		title : '操作员',
		align : "center",
		width : 100
	}, {
		field : 'log_sj_str',
		title : '操作时间',
		align : "center",
		width : 140
	}, {
		field : 'client',
		title : '客户端ID',
		align : "center",
		width : 100
	},{
		field : 'log_bz',
		title : '操作内容',
		align : "center",
		width : 300
	}] ];
	
	
	var centerUI = {
		eName : 'datagrid',
//		url:logQuery,
		id:"dataTable",
		idField : 'id',
		toolbarEx : toolBar,// 查询条件工具栏
		columns : columns,
		pagination : true,
		clientPager:true,
		alertFlag : false,// 是否弹出默认对话框
		showFooter: true,
		autoload : false,
		singleSelect : true,
		checkOnSelect:true,
		selectOnCheck:true,
		onLoadSuccessEx:function(retJson){
			if(retJson.id==0){
				//operatorList.combogrid("clear");
//				money_span.html(retJson.retData[0].subamts_str);
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
	var operatorList = jqObj.findJq("operatorList");
	var st = jqObj.findJq("sdate");
	var et = jqObj.findJq("edate");
	
	loadTime();//初始化
	
	
	
//	function loadTable(){
//		dataTable.datagrid('loadEx',{url:logQuery});
//	}
	
	function loadTime(){
		var date = new Date();
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		var d = date.getDate();
		var day = new Date(y,m,0);  
//		st.datetimebox("setValue",y + '-' + (m<10?('0'+m):m) + '-' + (d<10?('0'+d):d));
		st.datetimebox("setValue",y + '-' + m + '-' + '1' /*+ " 00:00:00"*/);
		et.datetimebox("setValue",y + '-' + m + '-' + day.getDate() + " 23:59:59");
	}
});

