//操作费用设置
garen_define("js/synthesizeSet/operateCost",function (jqObj,loadParams) {
	
	var base = garen_require("js/base/ws_public");
	
	var checkCoreIp = base.checkCoreIp;//核心业务IP授权验证
	
	var query = "synthesizeSet/operateCost/query.do";//列表查询
	
	var del = "synthesizeSet/operateCost/delete.do";//删除
	
	var scmurl = garen_require("js/lib/scmurl");//url地址
	
	//工具栏
	var toolBar = [null,{
		eName : 'div',
		height:10,
		cssStyle : 'background:#ffffff;'
	}, {
		eName : 'div',
		cssClass:"operateCost_toolBar",
		elements : {
			eName:"div",
			cssClass:"first_div",
			elements:[{
				eName:'linkbutton',
				uId:"tm1",
				text:'新增',
				plain:true,
				iconCls:'icon-add',
				onClick : addCost
			},{
				eName:'linkbutton',
				uId:"tm1",
				text:'修改',
				plain:true,
				iconCls:'icon-edit',
				onClick : modifyCost
			},{
				eName:'linkbutton',
				uId:"tm2",
				text:'删除',
				plain:true,
				iconCls:'icon-cancel',
				onClick : delCost
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
       		field : 'identity_name',
       		title : '身份类型',
       		align : "center",
       		width : 110
       	}, {
       		field : 'event_name',
       		title : '操作类型',
       		align : "center",
       		width : 110
       	}, {
       		field : 'deposit_amt_str',
       		title : '押金',
       		align : "center",
       		width : 100
       	}, {
       		field : 'fee_rate_str',
       		title : '费率',
       		align : "center",
       		width : 100
       	}, {
       		field : 'operator',
       		title : '操作员',
       		align : "center",
       		width : 120
       	}, {
       		field : 'client',
       		title : '客户端ID',
       		align : "center",
       		width : 160
       	}, {
       		field : 'sj_str',
       		title : '操作时间',
       		align : "center",
       		width : 130
       	}] ];
	
	var centerUI = {
		eName : 'datagrid',
		idField : 'id',
		id : 'dataTable',
		//url:query,
		toolbarEx : toolBar,// 查询条件工具栏
		columns : columns,
		pagination: true,
		clientPager:true,//本地分页
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
	};
	
	var mainUI = {
		eName : 'layoutExt',// 容器布局类，jeasyui组件
		cssStyle:'font-family: 微软雅黑, Arial;',
		fit : true,
		elements : [{
			region : 'center',
			elements : centerUI
		}]
	}

	jqObj.loadUI(mainUI);
	
	loadInit();
	
	function loadInit(){
		$.postEx(checkCoreIp,{'op_name':'押金及手续费'},function(retJson){
			if(retJson.result){
				
			}else{
				$.alert(retJson.info,function(){
					//window.parent.location.reload();
					window.top.location.href=scmurl;
				});
			}
		});
	}
	
	
	function addCost(){
		var myWin = $.createWin({
			title:"新增",
			width:250,
			height:260,
			queryParams:{
				//params:params,
				callback:loadCostList
			},
			url:"js/synthesizeSet/opearteCost_addCost.js"
		});
	}
	
	function modifyCost(){
		var params = {};
		var row = dataTable.datagrid("getSelected");
		if(row==null){
			$.alert("请先选择一条记录！");
		}else{
			var myWin = $.createWin({
				title:"修改",
				width:250,
				height:260,
				queryParams:{
					params:row,
					callback:loadCostList
				},
				url:"js/synthesizeSet/opearteCost_modifyCost.js"
			});
		}
	}
	
	function delCost(){
		var params = {};
		var row = dataTable.datagrid("getSelected");
		if(row==null){
			$.alert("请先选择一条记录！");
		}else{
			$.confirm("确定要删除这条记录吗？",function(c){
				if(c){
					params['id'] = row.id;
					params['event_id'] = row.event_id;
					$.postEx(del,params,function(retJson){
						if(retJson.result){
							loadCostList();
						}else{
							$.alert(retJson.info);
						}
					});
				}
			});
		}
	}
	
	var dataTable = jqObj.findJq("dataTable");
	
	loadCostList();
	function loadCostList(){
		dataTable.datagrid("loadEx",{url:query});
	}
});
	