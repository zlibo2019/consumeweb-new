garen_define("js/functionQuery/merchantDetailQuery_searchWin",function (jqObj,loadParams) {

	var columns = [//列字段定义
     	[ {
      		field : 'c',
      		title : 'c',
      		align : "center",
      		checkbox:true,
      		width : 50
      	}, {
      		field : 'index',
      		title : '..',
      		align : "center",
      		width : 50
      	}, {
      		field : 'merchant_account_id',
      		title : '商户账号',
      		align : "center",
      		width : 80
      	}, {
      		field : 'merchant_name',
      		title : '商户名称',
      		align : "center",
      		width : 93
      	}, {
      		field : 'merchant_dep',
      		title : '商户部门',
      		align : "center",
      		width : 140
      	}, {
      		field : 'merchant_state',
      		title : '商户状态',
      		align : "center",
      		width : 80
      	}] ];
	
	
	var searchWinUI = {
		eName:"div",
		cssClass:"merchantDetailQuery_searchWin",
		elements:[{
			eName:"fieldset",
			width:500,
			height:210,
			elements:[{
				eName:'legend',
				text:'选择商户'
			},{
				eName:"div",
				height:180,
				width:490,
				cssStyle:"margin:5px;",
				elements:{
					eName : 'datagrid',
					id:"dataTable",
					idField : 'merchant_account_id',
					columns : columns,
					pagination: true,
					clientPager:true,
					showFooter:true,
					alertFlag : false,// 是否弹出默认对话框
					autoload : false,
					singleSelect:true,
					checkOnSelect:true,
					selectOnCheck:true
				}
			}]
		},{
			eName:"div",
			elements:[{
				eName:"linkbutton",
				uId:"tm1",
				cssClass:"merchantDetailQuery_searchWin_linkbutton",
				text : '确定',
				width : 80,
				height : 35,
				onClick:function(){
					var row = dataTable.datagrid("getSelected");
					if(row == null){
						jqObj.window("close");
					}else{
						loadParams.callback(row);
						jqObj.window("close");
						
					}
				}
			},{
				eName:"linkbutton",
				uId:"tm1",
				text : '取消',
				width : 80,
				height : 35,
				onClick:function(){
					jqObj.window("close");
				}
			}]
		}]
	}
	
	jqObj.loadUI(searchWinUI);
	var dataTable = jqObj.findJq("dataTable");
	
	//分页提示信息修改
	var pager = dataTable.datagrid("getPager"); 
    pager.pagination({ 
    	//showPageList:false,
    	//beforePageText:'',//页数文本框前显示的汉字 
        //afterPageText:'', 
        displayMsg:''
    });
    
    dataTable.datagrid("resize");
    
	dataTable.datagrid("loadDataEx",loadParams.params);
});