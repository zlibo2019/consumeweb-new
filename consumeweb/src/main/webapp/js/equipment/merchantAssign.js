//设备商户指定
garen_define("js/equipment/merchantAssign",function (jqObj,loadParams) {
	
	var base = garen_require("js/base/ws_public");
	
	var checkCoreIp = base.checkCoreIp;//核心业务IP授权验证
	
	var scmurl = garen_require("js/lib/scmurl");//url地址
	
	var placeQuery = base.placeQuery;//场所查询
	
//	var merchantQuery = base.merchantQuery;//商户查询
	var merchantQuery = "merchant/manage/normalMerchantQuery.do" //商户查询
	
	var qryDevList = "equipment/merchant/qryDevList.do";//已关联列表
	
	var assignListQuery = "equipment/merchant/assignListQuery.do";//指定列表查询
	
	
	var commercial_columns = [//列字段定义
	   [{
       		field : 'merchant_name',
       		title : '商户',
       		align : "center",
       		width : 300,
       	}]];
	
	var northUI = {
			
	}
	
	var westUI = {
		eName : 'div',
		cssClass:"merchantAssign_west_div",
		height:"100%",
		elements : [{
			eName:"div",
			cssClass:"first_div",
			elements:[{
				eName:"img",
				src:"image/icon01.gif"
			},{
				eName:"span",
				text:"商户"
			}]
		},{
			eName:"div",
			id:"datagrid_div",
			//height:'96.5%',
			elements:{
				eName :'datagrid',
				id:"dataTable",
				url:merchantQuery,
				idField : 'dep_serial',
				columns : commercial_columns,
				clientPager:false,
				pagination: false,
				alertFlag : false,// 是否弹出默认对话框
				autoload : true,
				singleSelect:true,
				checkOnSelect:false,
				selectOnCheck:false,
				showHeader:false,
				border:false,
				//clientPager:true,
				//fitColumns:true,
				onLoadSuccessEx:function(retJson){
					if(retJson.id=="0"){
						
					}else{
						$.alert(retJson.info);
					}
				},
				onSelect:function(){
					loadAssignList();
				},
//				onClickEx : loadAssignList,
			}
		}]
	};
	
	var toolBar = [null,{
		eName : 'div',
		height:50,
		cssClass:"merchantAssign_toolBar",
		//height : 60,
		elements : {
			eName:"div",
			cssClass:"first_div",
			elements:[{
				eName:'linkbutton',
				uId:"tm1",
				text:'关联设备',
				width:65,
				height:31,
				onClick : relevanceDevice
			},{
				eName:'linkbutton',
				uId:"tm1",
				text:'修改',
				height:31,
				onClick : changeMode
			},{
				eName:'linkbutton',
				uId:"tm1",
				text:'解除设备关联',
				height:31,
				onClick : delDevRel
			}]
			/*elements:[{
				eName:'linkbutton',
				uId:"tm1",
				text:'分配商户',
				plain:true,
				iconCls:'icon-add',
				onClick : addAssign
			},{
				eName:"searchbox",
				name:"search_txt",
				width:250,
				height:30,
				prompt:"请输入设备名称或IP地址模糊查询",
				searcher:loadAssignList
			}]*/
		}
	}];
	
	var columns = [//列字段定义
     	[ {
      		field : 'id',
      		title : '..',
      		align : "center",
      		width : 50,
      		checkbox:true
      	},{
       		field : 'index',
       		title : '..',
       		align : "center",    
       		width : 50
       	}, {
      		field : 'bh',
      		title : '设备编号',
      		align : "center",
      		width : 140
      	}, {
      		field : 'mc',
      		title : '设备名称',
      		align : "center",
      		width : 140
      	}, {
      		field : 'ip',
      		title : '设备IP',
      		align : "center",
      		width : 140
      	}, {
      		field : 'dep_name',
      		title : '设备场所',
      		align : "center",
      		width : 180
      	}, {
      		field : 'charge_mode',
      		title : '扣款模式',
      		align : "center",
      		width : 140
      	}, {
      		field : 'tallyEn_mc',
      		title : '允许记账消费',
      		align : "center",
      		width : 100
      	}
    ] ];
	
	var centerUI = {
		eName : 'datagrid',
		id:"assignTable",
		idField : 'bh',
		url:qryDevList,//已关联列表
		toolbarEx : toolBar,// 查询条件工具栏
		columns : columns,
		singleSelect:false,
		alertFlag : false,// 是否弹出默认对话框
		autoload : false,
		pagination: true,
		clientPager:true,
		fitColumns:false,
		onLoadSuccessEx:function(retJson){
			if(retJson.id=="0"){
				
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
			region : 'north',
			height : 10,
			elements : northUI
		},{
			region : 'west',
			width : 300,
			elements : westUI
		},{
			region : 'center',
			elements : centerUI
		}]
	}
	
	jqObj.loadUI(mainUI);
	
	var assignTable = jqObj.findJq("assignTable");
	var dataTable = jqObj.findJq("dataTable");
	var crowdTable = jqObj.findJq("crowdTable");
	var datagrid_div = jqObj.findJq("datagrid_div");
	
	
	loadInit();
	
	function loadInit(){
		
		$.postEx(checkCoreIp,{'op_name':'商户设备绑定'},function(retJson){
			if(retJson.result){
				
			}else{
				$.alert(retJson.info,function(){
					//window.parent.location.reload();
					window.top.location.href=scmurl;
				});
			}
		});
		
		datagrid_div.css("height",datagrid_div.parent().height()-datagrid_div.prev().height());
		dataTable.datagrid("resize");
	}
	
	function loadAssignList(){//加载已关联设备列表
		var params = {};
		var row = dataTable.datagrid("getSelected");
		if(row!=null){
			params['merchant_account_id'] = row.merchant_account_id;
			assignTable.datagrid("loadEx",params);
		}
		else{
			$.alert("请先选择一条记录！");
		}
	}
	
	/*关联设备*/
	function relevanceDevice(){
		//选择商户列表
		var rows = dataTable.datagrid("getSelectionsEx");
		if(rows.length<1){
			$.alert("请选择商户！");
		}else{
			var params = [];
			$.each(rows,function(i, row){
				params.push(row.merchant_account_id);
			});
			var myWin = $.createWin({
				title:"关联设备",
				width:400,
				height:540,
				queryParams:{
					params:params,
					callback:loadAssignList
				},
				url:"js/equipment/merchantAssign_relevanceDevice.js"
			});
		}
	}

	/*修改扣款模式*/
	function changeMode(){
		//选择已关联设备列表
		var rows = assignTable.datagrid("getSelectionsEx");
		if(rows.length<1){
			$.alert("至少选择一条记录！");
		}else{
			var params = [];
			var bhs = [];
			$.each(rows,function(i, row){
				bhs.push(row.bh);
				params.push(row.type);
			});
			var myWin = $.createWin({
				title:"修改",
				width:220,
				height:240,
				queryParams:{
					params:params,
					bhs:bhs,
					callback:loadAssignList
				},
				url:"js/equipment/merchantAssign_changeDetainMoneyMode.js"
			});
		}
	}
	
	/*解除设备关联*/
	function delDevRel(){
		var rows = assignTable.datagrid("getSelectionsEx");
		if(rows.length<1){
			$.alert("至少选择一条记录！");
		}else{
			var params = [];
			$.each(rows,function(i, row){
				params.push(row);
			});
			$.confirm('确定要对选定的设备解除关联吗？',function(c){
				if(c){
					var myWin = $.createWin({
						title:"操作提示",
						width:420,
						height:400,
						queryParams:{
							params:params,
							callback:loadAssignList
						},
						url:"js/equipment/merchantAssign_relieveDeviceRelevance.js"
					});
				}
			});
		}
	}
	
	/*分配商户*/
	/* function addAssign(){
		var rows = assignTable.datagrid("getSelectionsEx");
		if(rows.length<1){
			$.alert("至少选择一条记录！");
		}else{
			var params = [];
			$.each(rows,function(i, row){
				params.push(row);
			});
			var myWin = $.createWin({
				title:"分配商户",
				width:400,
				height:250,
				queryParams:{
					params:params,
					callback:loadAssignList
				},
				url:"js/equipment/merchantAssign_addAssign.js"
			});
		}
	}*/
	
	
});