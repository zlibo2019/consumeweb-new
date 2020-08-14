/*解除设备关联失败提示窗*/

garen_define("js/equipment/merchantAssign_resultWin_2",function (jqObj,loadParams) {
	
	var utils = garen_require("utils");
	
	var proColumns = [//列字段定义
   	 	[{
          	field : 'index',
          	title : '',
          	align : "center",    
          	width : 50
       }, {
   	  		field : 'id',
   	  		title : '设备编号',
   	  		align : "center",
   	  		width : 90
   	  }, {
   	  		field : 'mc',
   	  		title : '设备名称',
   	  		align : "center",
   	  		width : 90
   	  }, {
   	  		field : 'ip',
   	  		title : '设备IP',
   	  		align : "center",
   	  		width : 90
   	  }, {
   	  		field : 'dep_name',
   	  		title : '设备场所',
   	  		align : "center",
   	  		width : 90
   	  }, {
   	  		field : 'error_msg',
   	  		title : '失败原因',
   	  		align : "center",
   	  		width : 120
   	  }] 
   	];

	var proTool = [null,{
		eName:"div",
		cssStyle:"font-size:14px;font-weight:bold;",
		elements:"解除设备关联失败结果表"
	}]
	
	var northUI = {
		eName:"div",
		height:80,
		cssStyle:"background:#f4f4f4;",
		elements:{
			eName:"div",
			height:'100%',
			cssStyle:"font-size:23px;line-height:80px;text-align:center;",
			elements:[{
				eName:"span",
				cssStyle:"color:#c9c9c9;",
				elements:"解除成功"
			},{
				eName:"span",
				cssStyle:"margin: 0 5px 0 5px;color:#FBBC6C;",
				elements:loadParams.params.retData.suc_count + ""
			},{
				eName:"span",
				cssStyle:"color:#c9c9c9;",
				elements:"台，解除失败"
			},{
				eName:"span",
				cssStyle:"margin: 0 5px 0 5px;color:#FBBC6C;",
				elements:loadParams.params.retData.err_count + ""
			},{
				eName:"span",
				cssStyle:"color:#c9c9c9;",
				elements:"台。"
			}]
		}
	};
	
	var centerUI = {
		eName:"div",
		cssStyle:"margin-left:18px;",
		width:550,
		height:250,
		elements:{
			eName:"datagrid",
			id:"dataTable",
			idField : 'bh',
			columns : proColumns,
			toolbarEx:proTool,
			showFooter:false,
			alertFlag : false,// 是否弹出默认对话框
			autoload : false,
			singleSelect:true,
			pagination: true,
			clientPager:true,
			fitColumns:true,
		}
	};

	var southUI = {
		eName:"div",
		cssClass:"merchantAssign_relieveDeviceRelevance_operaProg_btn_div",
		elements:[{
			eName:"linkbutton",
			uId:"tm1",
			text : '打印',
			width : 80,
			height : 35,
			onClick:function(){
				if(loadParams.params.data.length==0){
					$.alert("数据为空");
				}else{
					utils.printGrid("解除设备关联失败结果表",dataTable,loadParams.params.data);
				}
			}
		},{
			eName:"linkbutton",
			uId:"tm1",
			text : '导出',
			width : 80,
			height : 35,
			onClick:function(){
				//导出文档
				if(loadParams.params.data.length==0){
					$.alert("数据为空");
				}else{
					utils.exportDocByData2("解除设备关联失败结果表",dataTable,loadParams.params.data);
				}
				
			}
		}]
	};
	
	var mainUI = {
		eName:"layoutExt",
		fit : true,
		elements : [{
			region:'north',
			height:100,
			elements:northUI
		},{
			region : 'center',
			elements : centerUI
		},{
			region : 'south',
			height:50,
			cssClass:'merchantAssign_relieveDeviceRelevance_button_div',
			elements : southUI
		}]
	}

	
	jqObj.loadUI(mainUI);

	var dataTable = jqObj.findJq("dataTable");
	
	loadInit();//解除
	
	function loadInit(){
		dataTable.datagrid("loadDataEx",loadParams.params.data);
	}
	
	//关闭
	jqObj.updateOpt("panel",{
		onBeforeClose:function(){
			loadParams.loadP.callback();//刷新列表
			return true;//true 关闭 false不关闭
		}
	});

});	
