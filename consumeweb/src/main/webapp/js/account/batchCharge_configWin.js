//批量充值设置提示窗
garen_define("js/account/batchCharge_configWin",function (jqObj,loadParams) {
	
	var columns = [//列字段定义
	 	[ {
	  		field : 'user_no',
	  		title : '学/工号',
	  		align : "center",
	  		width : 90
	  	}, {
	  		field : 'user_lname',
	  		title : '姓名',
	  		align : "center",
	  		width : 91
	  	}, {
	  		field : 'dep_name',
	  		title : '部门',
	  		align : "center",
	  		width : 91
	  	}, {
	  		field : 'cash_money',
	  		title : '充值金额',
	  		align : "center",
	  		width : 91
	  	}] 
	];
	
	var centerUI = {
		eName:"datagrid",
		id:"dataTable",
		idField : 'account_id',
		columns : columns,
		showFooter:false,
		alertFlag : false,// 是否弹出默认对话框
		autoload : false,
		singleSelect:true,
		pagination: true,
		clientPager:true
	};
	
	var southUI = {
		eName:"div",
		cssClass:"openAccount_configWin_southdiv",
		elements:[{
			eName:"linkbutton",
			uId:"tm1",
			cssClass:"cardManage_searchWin_linkbutton",
			text : '确定',
			width : 80,
			height : 35,
			onClick:function(){
				var myWin = $.createWin({
					title:"操作提示",
					width:600,
					height:100,
					queryParams:{
						params:loadParams.params,
//						callback:function(){
//							loadParams.callback();
//							jqObj.window("close");
//						}
						loadP:loadParams
					},
					url:"js/account/batchCharge_progressBarWin.js"
				});
				jqObj.window("close");
			}
		},{
			eName:"linkbutton",
			uId:"tm1",
			cssClass:"cardManage_searchWin_linkbutton",
			text : '取消',
			width : 80,
			height : 35,
			onClick:function(){
				jqObj.window("close");
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
	
	//关闭
	jqObj.updateOpt("panel",{
		onBeforeClose:function(){
			//loadParams.callback();
			return true;//true 关闭 false不关闭
		}
	});
	
	//分页提示信息修改
	var pager = dataTable.datagrid("getPager"); 
    pager.pagination({ 
    	//showPageList:false,
    	//beforePageText:'',//页数文本框前显示的汉字 
        //afterPageText:'', 
        displayMsg:''
    });
	
	loadInit();
	
	function loadInit(){
		dataTable.datagrid("loadDataEx",loadParams.params);
	}
	
});