//餐别设置
garen_define("js/highConsume/mealSet", function(jqObj, loadParams) {
	
	//webservice
	var mealSetQuery = "highConsume/mealSetQuery.do";//查询餐别
	
	var mealSetDelete = "highConsume/mealSetDelete.do";//删除餐别
	
	var base = garen_require("js/base/ws_public");
	
	var scmurl = garen_require("js/lib/scmurl");//url地址
	
	var checkCoreIp = base.checkCoreIp;//核心业务IP授权验证
	
	var queryTimeOffset = base.queryTimeOffset;//查询时间偏移量
	
	var offsetData = $.loadEx(queryTimeOffset);
	
	// 工具栏
	var toolBar = [ null, {
		eName : 'div',
		height : 10,
		cssStyle : 'background:#ffffff;'
	}, {
		eName : 'div',
		cssClass : 'mealSet_toolBar_second',
		elements : {
			eName : 'div',
			elements : [{
				eName : 'linkbutton',
				uId:"tm1",
				cssClass : 'mealSet_linkbutton',
				width : 65,
				height : 30,
				text : "新增",
				onClick : addMeal
			},{
				eName : 'linkbutton',
				uId:"tm1",
				cssClass : 'mealSet_linkbutton',
				width : 65,
				height : 30,
				text : "修改",
				onClick : modifyMeal
			},{
				eName : 'linkbutton',
				uId:"tm2",
				cssClass : 'mealSet_linkbutton',
				width : 65,
				height : 30,
				text : "删除",
				onClick : deleteMeal
			}]
		}
	} ];

	var columns = [// 列字段定义
	[ {
   		field : 'meal_name',
   		title : '餐别',
   		align : "center",
   		width : 150
   	}, {
   		field : 'begin_time',
   		title : '开始时间',
   		align : "center",
   		width : 300
   	}, {
   		field : 'end_time',
   		title : '结束时间',
   		align : "center",
   		width : 300
   	}] ];
	
	
	var centerUI = {
		eName : 'datagrid',
		idField : 'meal_id',
		url:mealSetQuery,
		id : 'dataTable',
		toolbarEx : toolBar,// 查询条件工具栏
		columns : columns,
		pagination : false,
		clientPager:false,
		alertFlag : false,// 是否弹出默认对话框
		autoload : true,
		singleSelect : true,
		checkOnSelect : true,
		selectOnCheck : true,
		onLoadSuccessEx:function(retJson){
			if(retJson.id==0){
				
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
	
	loadInit();
	
	function loadInit(){
		$.postEx(checkCoreIp,{'op_name':'餐别设置'},function(retJson){
			if(retJson.result){
				
			}else{
				$.alert(retJson.info,function(){
					//window.parent.location.reload();
					window.top.location.href=scmurl;
				});
			}
		});
	}
	
	function addMeal(){
		var params = {};
		params['offsetData'] = offsetData;
		var myWin = $.createWin({
			title:"新增餐别",
			width:380,
			height:300,
			queryParams:{
				params:params,
				callback:loadMealSet
			},
			url:"js/highConsume/mealSet_addMeal.js"
		});
	}
	
	function modifyMeal(){
		var row = dataTable.datagrid("getSelected");
		if(row!=null){
			var params = {};
			params['meal_id'] = row.meal_id;
			params['meal_name'] = row.meal_name;
			params['begin_time'] = row.begin_time;
			params['end_time'] = row.end_time;
			params['offsetData'] = offsetData;
			var myWin = $.createWin({
				title:"修改餐别",
				width:380,
				height:300,
				queryParams:{
					params:params,
					callback:loadMealSet
				},
				url:"js/highConsume/mealSet_modifyMeal.js"
			});
		}else{
			$.alert("请先选择一条记录！");
		}
		
	}
	
	function deleteMeal(){
		var row = dataTable.datagrid("getSelected");
		if(row!=null){
			$.confirm("确定要删除这个餐别吗？",function(c){
				if(c){
					var params = {};
					params['meal_id'] = row.meal_id;
					$.postEx(mealSetDelete,params,function(retJson){
						if(retJson.result){
							loadMealSet();
						}else{
							$.alert(retJson.info);
						}
					});
				}
			});
		}else{
			$.alert("请先选择一条记录！");
		}
	}
	
	function loadMealSet(){
		dataTable.datagrid("loadEx");
	}
	
});
