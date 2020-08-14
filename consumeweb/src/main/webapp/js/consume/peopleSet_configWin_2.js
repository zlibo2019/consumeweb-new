//按人员设置人群失败结果提示窗
garen_define("js/consume/peopleSet_configWin_2",function (jqObj,loadParams) {
	
	var utils = garen_require("utils");
	
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
	  		width : 160
	  	}, {
	  		field : 'user_lname',
	  		title : '姓名',
	  		align : "center",
	  		width : 160
	  	}, {
	  		field : 'crowd_name',
	  		title : '所属人群',
	  		align : "center",
	  		width : 160
	  	}] 
	];
	
	var centerUI = {
		eName:"div",
		cssStyle:"margin-left:18px;",
		width:552,
		height:250,
		elements:{
			eName:"datagrid",
			id:"dataTable",
			idField : 'user_serial',
			columns : columns,
			showFooter:false,
			alertFlag : false,// 是否弹出默认对话框
			autoload : false,
			singleSelect:true,
			pagination: true,
			clientPager:true
		}
	};
		
	var northUI = {
			eName:"div",
			height:80,
			cssStyle:"background:#f4f4f4;",
			elements:{
				eName:"div",
				cssStyle:"text-align:center;font-size:18px;color:#c9c9c9;line-height:80px;",
				elements:"人员已指定其它人群，是否更换到<span style='margin: 0 5px 0 5px;color:#FBBC6C;'>"+loadParams.params2.crowd_name+"</span>人群？"
			}
		};
	
	var southUI = {
		eName:"div",
		cssClass:"closeAccount_resultWin_southdiv",
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
						params:loadParams
					},
					url:"js/consume/peopleSet_progressBarWin_2.js"
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
			region : 'north',
			height:100,
			elements : northUI
		},{
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
	
});