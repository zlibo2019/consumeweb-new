//开户失败结果提示窗
garen_define("js/account/openAccount_resultWin_2",function (jqObj,loadParams) {
	
	var utils = garen_require("utils");
	
	var card_exit = 0;//是否是发卡退出
	
	var columns = [//列字段定义
	 	[{
       		field : 'index',
       		title : '',
       		align : "center",    
       		width : 50
       	}, {
	  		field : 'user_no',
	  		title : '学/工号',
	  		align : "center",
	  		width : 90
	  	}, {
	  		field : 'user_lname',
	  		title : '姓名',
	  		align : "center",
	  		width : 90
	  	}, {
	  		field : 'dep_name',
	  		title : '部门',
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
		elements:"开户失败结果表"
	}]
	
	var centerUI = {
		eName:"div",
		cssStyle:"margin-left:18px;",
		width:550,
		height:250,
		elements:{
			eName:"datagrid",
			id:"dataTable",
			idField : 'account_id',
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
				elements:"开户成功"
			},{
				eName:"span",
				cssStyle:"margin: 0 5px 0 5px;color:#FBBC6C;",
				elements:loadParams.params.retData.suc_count + ""
			},{
				eName:"span",
				cssStyle:"color:#c9c9c9;",
				elements:"人，开户失败"
			},{
				eName:"span",
				cssStyle:"margin: 0 5px 0 5px;color:#FBBC6C;",
				elements:loadParams.params.retData.err_count + ""
			},{
				eName:"span",
				cssStyle:"color:#c9c9c9;",
				elements:"人。"
			}]
		}
	};
	
	var southUI = {
		eName:"div",
		cssClass:"openAccount_resultWin_southdiv",
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
					utils.printGrid("开户失败结果表",dataTable,loadParams.params.data);
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
					utils.exportDocByData2("开户失败结果表",dataTable,loadParams.params.data);
				}
				
			}
		},{
			eName:"linkbutton",
			uId:"tm1",
			cssClass:"cardManage_searchWin_linkbutton",
			cssStyle:"margin-left:250px;",
			id:"begin_pc",
			text : '开始发卡',
			width : 80,
			height : 35,
			onClick:function(){
				card_exit = 1;
				jqObj.window("close");
			}
		}]
	};
		
	var mainUI = {
		eName : 'layoutExt',// 容器布局类，jeasyui组件
		cssStyle:'font-family: 微软雅黑, Arial;',
		fit : true,
		elements : [{
			region : 'north',
			height:100,
			elements : northUI
		},
		{
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
	var begin_pc = jqObj.findJq("begin_pc");
	
	loadInit();
	
	function loadInit(){
		if(loadParams.params.retData.suc_count == 0){
			begin_pc.linkbutton("disable");
		}
		dataTable.datagrid("loadDataEx",loadParams.params.data);
	}
	
	//关闭
	jqObj.updateOpt("panel",{
		onBeforeClose:function(){
			if(!card_exit){//不是发卡退出则回调刷新页面
				loadParams.loadP.callback();
			}else{
				//筛选出成功开户的id
				var ids = loadParams.ids.split(',');//所有开户id
		        var rows = dataTable.datagrid("getRows");
		        $.each(rows,function(i,row){//循环失败的id
		        	//var n = ids.indexOf(row.id);
		        	//$.print(row.id);row.id是数组，不是字符串。
		        	var n = $.inArray(row.id+"", ids);
		        	if(n!=-1){//删除失败的id
		        		ids.splice(n,1);//改变ids数组，为所有开户成功id
		        	}
		        });
				loadParams.loadP.provideC(ids.join());
			}
			return true;//true 关闭 false不关闭
		}
	});
	
});