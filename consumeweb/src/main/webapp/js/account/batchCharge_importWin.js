garen_define("js/account/batchCharge_importWin",function (jqObj,loadParams) {

	var columns = [//列字段定义
     	[ {
      		field : 'index',
      		title : '..',
      		align : "center",
      		width : 45
      	}, {
      		field : 'xh',
      		title : '导入行',
      		align : "center",
      		width : 60
      	}, {
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
      		field : 'message',
      		title : '结果说明',
      		align : "center",
      		width : 240
      	}] ];
	
	
	var searchWinUI = {
		eName:"div",
		cssStyle:"text-align:center;",
		elements:[{
			eName:"div",
			cssStyle:"margin:18px 0 19px 0;font-size:15px;color:red;",
			elements:loadParams.params
		},{
			eName:"div",
			height:460,
			width:566,
			elements:{
				eName:'datagrid',
				id:"dataTable",
				idField:"xh",
				columns : columns,
				pagination: true,
				clientPager:true,
				showFooter:true,
				singleSelect:true
			}
		}]
	}
	
	jqObj.loadUI(searchWinUI);
	var dataTable = jqObj.findJq("dataTable");
	dataTable.datagrid("loadDataEx",loadParams.params2);
	
});