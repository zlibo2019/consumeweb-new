//上班人员查询

garen_define("js/functionQuery/workUserQuery", function(jqObj, loadParams) {
	
	var utils = garen_require("utils");
	
	//var crowdQuery = "consume/crowdQuery.do";//人群查询
	var crowdQuery = "highConsume/consumeRule/crowdQuery.do";//人群查询
	
	var detailQuery = "functionQuery/workUser/detailQuery.do";//查询
	
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
				eName:"datetimebox",
				name:"start_date",
				editable:false,
				width : 150,
				height : 25
			}, {
				eName:"span",
				text:"结束时间"
			}, {
				eName:"datetimebox",
				name:"end_date",
				editable:false,
				width : 150,
				height : 25
			}, {
				eName:"span",
				text:"人群",
			}, {
				eName:"combogrid",
				id:"crowdList",
				url:crowdQuery,
				name:"crowd_id",
				idField: 'crowd_id',
				textField: 'crowd_name',
				width:150,
				value:'',
				panelHeight:$.browser.msie9?200:'auto',
				panelMaxHeight:200,
				editable:false,
				multiple:true,
				singleSelect: false,
				selectOnCheck:true,
				allFlag:true,
				columns:[[
					{field:'crowd_id',checkbox:true},
					{field:'crowd_name',title:'全部'}
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
					var start_date = st.datetimebox("getValue");
					var end_date = et.datetimebox("getValue");
					if(start_date>end_date){
						$.alert("开始时间不能大于结束时间！");
					}else{
						dataTable.datagrid('loadEx',{url:detailQuery});
					}
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
				         utils.exportDocByData("上班人员查询",dataTable);
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
						utils.printGrid("上班人员查询",dataTable);
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
   		width : 50
   	}, {
 		field : 'index',
 		title : '..',
 		align : "center",
 		width : 50
 	},  {
 		field : 'user_no',
 		title : '学/工号',
 		align : "center",
 		width : 100
 	}, {
 		field : 'user_lname',
 		title : '姓名',
 		align : "center",
 		width : 100
 	}, {
 		field : 'user_depname',
 		title : '部门',
 		align : "center",
 		width : 100
 	}, {
 		field : 'tt_name',
 		title : '身份',
 		align : "center",
 		width : 100
 	}, {
 		field : 'crowd_name',
 		title : '人群',
 		align : "center",
 		width : 100
 	}, {
 		field : 'sj_str',
 		title : '签到时间',
 		align : "center",
 		width : 140
 	}
 	/*, {
 		field : 'mc',
 		title : '设备',
 		align : "center",
 		width : 100
 	} */ 
 	] ];
	
	
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
			if(retJson.id=="0"){
				//crowdList.combogrid("clear");
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
	var crowdList = jqObj.findJq("crowdList");
	var st = jqObj.findJq("start_date");
	var et = jqObj.findJq("end_date");
	
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
		st.datetimebox("setValue",y + '-' + m + '-' + d + " 06:00:00");
		et.datetimebox("setValue",y + '-' + m + '-' + d + " 08:00:00");
	}
});

