//管理员商户权限
garen_define("js/permission/glyToMerchant",function (jqObj,loadParams) {
	var utils = garen_require("utils");
	var base = garen_require("js/base/ws_public");
	
	var glyQuery = base.glyQuery;//管理员查询
	
	var permissionQuery = "permission/glyToMerchant/permissionQuery.do";//查询
	
	var permissionDel = "permission/glyToMerchant/permissionDel.do";//删除
	
	var northUI = {
			
	}
	
	var columns3 = [//列字段定义
	[{
     	field : 'gly_no',
     	title : 'gly编号',
     	align : "center",
     	width : 299
     }
//	, {
// 		field : 'gly_lname',
// 		title : '商户名称',
// 		align : "center",
// 		width : 149
//     }
     ] ];
	
	var westUI = {
		eName : 'div',
		cssClass:"autoModeDefine_west_div",
		height:'100%',
		elements : [{
			eName:"div",
			cssClass:"first_div",
			elements:[{
				eName:"img",
				src:"image/icon01.gif"
			},{
				eName:"span",
				text:"管理员"
			}]
		},{
			eName:"div",
			id:"datagrid_div",
			//height:"96%",
			elements:{
				eName:"datagrid",
				id:"glyTable",
				idField : 'gly_no',
				url : glyQuery,
				columns : columns3,
				pagination: false,
				clientPager:false,
				alertFlag : false,// 是否弹出默认对话框
				autoload : true,
				singleSelect:true,
				checkOnSelect:false,
				selectOnCheck:false,
				showHeader:false,
				border:false,
				onClickRow:function(index,row){
					var params = {};
					if(merchant_list.findUI().select==1){
						params['merchant_lx'] = "2";
					}else{
						params['merchant_lx'] = "1";
					}
					params['gly_no'] = row.gly_no;
					loadCenterTableList(params);
				}
			}
		}]
	};
	
	var toolBar = [null,{
		eName : 'div',
		cssClass:"autoModeDefine_toolBar",
		//height : 60,
		elements : {
			eName:"div",
			cssClass:"first_div",
			elements:[{
				eName:'linkbutton',
				uId:"tm1",
				text:'新增',
				plain:true,
				iconCls:'icon-add',
				onClick : addPermission
			},{
				eName:'linkbutton',
				uId:"tm2",
				text:'删除',
				plain:true,
				iconCls:'icon-cancel',
				onClick : deletePermission
			},{
				eName:'linkbutton',
				uId:"tm1",
				text:'打印',
				plain:true,
				iconCls:'icon-print',
				onClick : function(){
					if(merchant_list.findUI().select==1){
						if(centerTable.datagrid('getRows').length==0){
							$.alert("数据为空");
						}else{
							utils.printGrid("权限设置",centerTable);
						}
					}else{
						if(centerTable2.datagrid('getRows').length==0){
							$.alert("数据为空");
						}else{
							utils.printGrid("权限设置",centerTable2);
						}
					}
				}
			},{
				eName:'linkbutton',
				uId:"tm1",
				text:'导出',
				plain:true,
				iconCls:'icon-import',
				onClick : function(){
					if(merchant_list.findUI().select==1){
						//导出文档
						if(centerTable.datagrid('getRows').length==0){
							$.alert("数据为空");
						}else{
							utils.exportDocByData("权限设置",centerTable);
						}
					}else{
						//导出文档
						if(centerTable2.datagrid('getRows').length==0){
							$.alert("数据为空");
						}else{
							utils.exportDocByData("权限设置",centerTable2);
						}
					}
				}
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
      	},  {
      		field : 'merchant_dep_serial',
      		title : '商户编号',
      		align : "center",
      		width : 100
      	}, {
      		field : 'merchant_name',
      		title : '商户名称',
      		align : "center",
      		width : 100
      	}, {
      		field : 'dep_name',
      		title : '所属商户部门',
      		align : "center",
      		width : 100
      	}
    ] ];
	
	var columns2 = [//列字段定义
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
 	},  {
 		field : 'merchant_dep_serial',
 		title : '商户部门编号',
 		align : "center",
 		width : 150
 	}, {
 		field : 'dep_name',
 		title : '商户部门名称',
 		align : "center",
 		width : 150
 	}
 	] ];
	
	var centerCenterUI = [{
		eName:"div",
		height:"100%",
		id:"centerTableDiv",
		elements:{
			eName : 'datagrid',
			id:"centerTable",
			idField : 'merchant_dep_serial',
			//url : modeListQuery,
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
				if(retJson.id=="0"){
					
				}else{
					$.alert(retJson.info);
				}
			}
		}
	},{
		eName:"div",
   		height:"100%",
   		id:"centerTableDiv2",
   		elements:{
   	   		eName : 'datagrid',
   	   		id:"centerTable2",
   	   		idField : 'merchant_dep_serial',
   	   		//url : modeListQuery,
   	   		toolbarEx : toolBar,// 查询条件工具栏
   	   		columns : columns2,
   	   		pagination: true,
   	   		clientPager:true,
   	   		alertFlag : false,// 是否弹出默认对话框
   	   		autoload : false,
   	   		singleSelect:true,
   	   		checkOnSelect:true,
   	   		selectOnCheck:true,
   	   		onLoadSuccessEx:function(retJson){
   	   			if(retJson.id=="0"){
   	   				
   	   			}else{
   	   				$.alert(retJson.info);
   	   			}
   	   		}
   		}
   	}];
	
	
	var centerNorthUI = {
		eName:"div",
		cssClass:"glyToMechant",
		elements:[{
			eName:"div",
			cssClass:"merchant_list",
			select:1,
			elements:"商户",
			onClick:select
			
		},{
			eName:"div",
			cssClass:"dep_list",
			select:0,
			elements:"商户部门",
			onClick:select
		}]
	}
	
	var centerUI = {
		eName : 'layoutExt',// 容器布局类，jeasyui组件
		cssStyle:'font-family: 微软雅黑, Arial;',
		fit : true,	
		elements : [{
			region : 'north',
			height : 30,
			elements : centerNorthUI
		},{
			region : 'center',
			elements : centerCenterUI
		}]
	}
		
	var mainUI = {
		eName : 'layoutExt',// 容器布局类，jeasyui组件
		cssStyle:'font-family: 微软雅黑, Arial;',
		fit : true,
		elements : [{
			region : 'north',
			height : 10,
			elements : northUI
		},{
			region : 'west',
			height : 100,
			width : 300,
			elements : westUI
		},{
			region : 'center',
			elements : centerUI
		}]
	}
	
	jqObj.loadUI(mainUI);
	
	var centerTable = jqObj.findJq("centerTable");
	var centerTable2 = jqObj.findJq("centerTable2");
	var glyTable = jqObj.findJq("glyTable");
	var centerTableDiv = jqObj.findJq("centerTableDiv");
	var centerTableDiv2 = jqObj.findJq("centerTableDiv2");
	var merchant_list = jqObj.findJq("merchant_list");
	var dep_list = jqObj.findJq("dep_list");
	var datagrid_div = jqObj.findJq("datagrid_div");
	datagrid_div.css("height",datagrid_div.parent().height()-datagrid_div.prev().height());
	glyTable.datagrid("resize");
	
	//切换商户列表和商户部门列表
	function select(){
		if($(this).attr("class")=="merchant_list" && $(this).findUI().select==0){
			//标识
			$(this).findUI().select=1;
			dep_list.findUI().select=0;
			//样式
			$(this).css({"background":"#2274B9","color":"#ffffff"});
			dep_list.css({"background":"#ffffff","color":"#000000"});
			centerTableDiv.show();
			centerTableDiv2.hide();
			centerTable.datagrid("resize");
			//数据
			var params = {};
			var glyRow = glyTable.datagrid("getSelected");
			if(glyRow==null){
				$.alert("请先选择一个管理员！");
			}else{
				params['gly_no'] = glyRow.gly_no;
				params['merchant_lx'] = "2";
				loadCenterTableList(params);
			}
			
		}
		if($(this).attr("class")=="dep_list" && $(this).findUI().select==0){
			//标识
			$(this).findUI().select=1;//已选中
			merchant_list.findUI().select=0;//未选中
			//样式
			$(this).css({"background":"#2274B9","color":"#ffffff"});
			merchant_list.css({"background":"#ffffff","color":"#000000"});
			centerTableDiv2.show();
			centerTableDiv.hide();
			centerTable2.datagrid("resize");
			//数据
			var params = {};
			var glyRow = glyTable.datagrid("getSelected");
			if(glyRow==null){
				$.alert("请先选择一个管理员！");
			}else{
				params['gly_no'] = glyRow.gly_no;
				params['merchant_lx'] = "1";
				loadCenterTableList(params);
			}
		}
	}
	
	function loadCenterTableList(params){
		if(params.merchant_lx=="2"){
			centerTable.datagrid("loadEx",{url:permissionQuery,gly_no:params.gly_no,merchant_lx:params.merchant_lx});
		}
		else if(params.merchant_lx=="1"){
			centerTable2.datagrid("loadEx",{url:permissionQuery,gly_no:params.gly_no,merchant_lx:params.merchant_lx});
		}
	}
	
	function addPermission(){
		var glyRow = glyTable.datagrid("getSelected");
		if(glyRow==null){
			$.alert("请先选择一个管理员！");
		}else{
			var params = {};
			if(merchant_list.findUI().select==1){
				params['gly_no'] = glyRow.gly_no;
				params['lx'] = 1;
				var myWin = $.createWin({
					title:"新增商户",
					width:300,
					height:400,
					queryParams:{
						params:params,
						callback:loadCenterTableList
					},
					url:"js/permission/glyToMerchant_addPermission.js"
				});
			}else{
				params['gly_no'] = glyRow.gly_no;
				params['lx'] = 2;
				var myWin = $.createWin({
					title:"新增商户部门",
					width:300,
					height:400,
					queryParams:{
						params:params,
						callback:loadCenterTableList
					},
					url:"js/permission/glyToMerchant_addPermission.js"
				});
			}
		}
	}
	
	function deletePermission(){
		var params = {};
		var glyRow = glyTable.datagrid("getSelected");
		if(merchant_list.findUI().select==1){
			var row = centerTable.datagrid("getSelected");
			params['merchant_lx'] = "2";
		}else{
			var row = centerTable2.datagrid("getSelected");
			params['merchant_lx'] = "1";
		}
		if(row==null){
			$.alert("请先选择一条记录！");
		}else{
			params['merchant_dep_serial'] = row.merchant_dep_serial;
			params['lx'] = "1";//删除
			params['gly_no'] = glyRow.gly_no;
			$.confirm("确定要删除这条记录吗？",function(c){
				if(c){
					$.postEx(permissionDel,params,function(retJson){
						if(retJson.result){
							loadCenterTableList(params);
						}else{
							$.alert(retJson.info);
						}
					});
				}
			});
		}
	}
	
});