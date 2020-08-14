//自动消费模式失败提示窗
garen_define("js/equipment/autoModeDefineAddMode_resultWin_2",function (jqObj,loadParams) {
	
	var utils = garen_require("utils");
	
	var columns = [//列字段定义
	 	[{
       		field : 'index',
       		title : '',
       		align : "center",    
       		width : 50
       	}, {
	  		field : 'dep_name',
	  		title : '场所',
	  		align : "center",
	  		width : 90
	  	}, {
	  		field : 'begin_date',
	  		title : '开始时间',
	  		align : "center",
	  		width : 90
	  	}, {
	  		field : 'end_date',
	  		title : '结束时间',
	  		align : "center",
	  		width : 100
	  	}, {
	  		field : 'error_msg',
	  		title : '失败原因',
	  		align : "center",
	  		width : 200
	  	}] 
	];
	
	var toolbar = [null,{
		eName:"div",
		cssStyle:"font-size:14px;font-weight:bold;",
		elements:"自动模式定义失败结果表"
	}]
	
	
	var centerUI = {
		eName:"div",
		cssStyle:"margin-left:18px;",
		width:550,
		height:350,
		elements:{
			eName:"datagrid",
			id:"dataTable",
			idField : 'id',
			columns : columns,
			toolbarEx:toolbar,
			pagination: true,
			clientPager:true,
			showFooter:false,
			alertFlag : false,// 是否弹出默认对话框
			autoload : false,
			singleSelect:true
		}
	};
	
	var southUI = {
		eName:"div",
		cssClass:"closeAccount_resultWin_southdiv",
		elements:[{
			eName:"linkbutton",
			uId:"tm1",
			cssClass:"cardManage_searchWin_linkbutton",
			text : '打印',
			width : 80,
			height : 35,
			onClick:function(){
				if(loadParams.params.data.length==0){
					$.alert("数据为空");
				}else{
					utils.printGrid("自动模式定义失败结果表",dataTable,loadParams.params.data);
					//utils.printGrid("商户销户失败结果表",dataTable);
				}
			}
		},{
			eName:"linkbutton",
			uId:"tm1",
			cssClass:"cardManage_searchWin_linkbutton",
			text : '导出',
			width : 80,
			height : 35,
			onClick:function(){
				//导出文档
				if(loadParams.params.data.length==0){
					$.alert("数据为空");
				}else{
					utils.exportDocByData2("自动模式定义失败结果表",dataTable,loadParams.params.data);
				}
				
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
		},{
			region : 'south',
			height:50,
			elements : southUI
		}]
	}
	
	jqObj.loadUI(mainUI);
	
	var dataTable = jqObj.findJq("dataTable");
	
	loadInit();
	
	function loadInit(){
		dataTable.datagrid("loadDataEx",loadParams.params.data);
	}
	
	//关闭
	jqObj.updateOpt("panel",{
		onBeforeClose:function(){
			loadParams.loadP.callback();
			return true;//true 关闭 false不关闭
		}
	});
	
});