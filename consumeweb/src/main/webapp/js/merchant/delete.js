//商户销户
garen_define("js/merchant/delete", function(jqObj, loadParams) {
	
	var deleteQuery = "merchant/deleteQuery.do";//销户查询
	
	var merchantDelete = "merchant/merchantDelete.do";//销户

	// 工具栏
	var toolBar = [ null, {
		eName : 'div',
		height : 10,
		cssStyle : 'background:#ffffff;'
	}, {
		eName : 'div',
		cssClass : 'delete_toolBar_second',
		elements : {
			eName : 'div',
			elements : [ {
				eName : 'textbox',
				prompt : "请输入商户名称、联系人模糊查询",
				name : 'search_txt',
				width : 350,
				height : 25,
				value : ''// 默认值
				
			}, {
				eName : 'linkbutton',
				uId:"tm1",
				cssClass : 'delete_linkbutton',
				width : 65,
				height : 30,
				text : "查询",
				onClick : search
			} ]
		}
	} ];

	var columns = [// 列字段定义
	[ {
   		field : 'xh',
   		title : '序号',
   		align : "center",
   		checkbox : true,
   		width : 100
   	}, {
   		field : 'index',
   		title : '..',
   		align : "center",    
   		width : 50
   	}, {
   		field : 'merchant_account_id',
   		title : '账号',
   		align : "center",
   		width : 110
   	}, {
   		field : 'merchant_name',
   		title : '名称',
   		align : "center",
   		width : 110
   	}, {
   		field : 'link_man',
   		title : '联系人',
   		align : "center",
   		width : 100
   	}, {
   		field : 'merchant_dep',
   		title : '商户部门',
   		align : "center",
   		width : 100
   	}, {
   		field : 'merchant_account_type',
   		title : '商户类型',
   		align : "center",
   		width : 120
   	}, {
   		field : 'fee_rate_str',
   		title : '管理费率',
   		align : "center",
   		width : 100
   	}, {
   		field : 'merchant_addr',
   		title : '地址',
   		align : "center",
   		width : 130
   	}, {
   		field : 'merchant_bank_account',
   		title : '银行账户',
   		align : "center",
   		width : 130
   	}, {
   		field : 'merchant_bank',
   		title : '开户银行',
   		align : "center",
   		width : 160
   	}, {
   		field : 'merchant_telephone',
   		title : '联系电话',
   		align : "center",
   		width : 80
   	} ] ];
	
	
	var centerUI = {
		eName : 'datagrid',
		idField : 'merchant_account_id',
		//url:deleteQuery,
		id : 'dataTable',
		toolbarEx : toolBar,// 查询条件工具栏
		columns : columns,
		pagination : true,
		clientPager:true,
		alertFlag : false,// 是否弹出默认对话框
		autoload : false,
		singleSelect : false,
		checkOnSelect : true,
		selectOnCheck : true,
		onLoadSuccessEx:function(retJson){
			if(retJson.id=="0"){
				
			}else{
				$.alert(retJson.info);
			}
		}
	};
	
	var southUI = {
		eName : 'div',
		cssStyle:"text-align:center;",
		elements : {
			eName : 'linkbutton',
			uId:"tm2",
			text : "<span style='font-size:20px;'>销户</span>",
			cssClass : 'delete_linkbutton',
			cssStyle:"margin-top:20px;",
			width : 220,
			height : 60,
			onClick:deleteAcc
		}
	};
	
	var mainUI = {
		eName : 'layoutExt',// 容器布局类，jeasyui组件
		cssStyle:'font-family: 微软雅黑, Arial;',
		fit : true,
		elements : [{
			region : 'center',
			elements : centerUI
		},
		{
			region : 'south',
			height : 100,
			elements : southUI
		}]
	};

	jqObj.loadUI(mainUI);
	var dataTable = jqObj.findJq("dataTable");
	var merchant_name = jqObj.findJq("merchant_name");
	var merchant_addr = jqObj.findJq("merchant_addr");
	var merchant_telephone = jqObj.findJq("merchant_telephone");
	var link_man = jqObj.findJq("link_man");
	var merchant_bank_account = jqObj.findJq("merchant_bank_account");
	var merchant_bank = jqObj.findJq("merchant_bank");
	var fee_rate = jqObj.findJq("fee_rate");
	var merchant_account_type = jqObj.findJq("merchant_account_type");
	var merchant_dep = jqObj.findJq("merchant_dep");
	var account_no = jqObj.findJq("account_no");
	var search_txt = jqObj.findJq("search_txt");
	
//	document.onkeydown=function(event){
//		var e = event || window.event || arguments.callee.caller.arguments[0];
//		if(e && e.keyCode==13){ // enter 键
//			search();
//	    }
//	};
	
	//键盘回车事件
	search_txt.textbox("textbox").keydown(function(e){
		var key = e.keyCode;//兼容firefox
		if(key == 13){
			search();
		}
	});
	
	loadInit();
	function loadInit(){
		dataTable.datagrid("loadEx",{url:deleteQuery});
	}

	function search(){
		var params = {};
		params['search_txt'] = search_txt.textbox("getValue");
		//dataTable.datagrid("load",params);
		dataTable.datagrid("loadEx",{url:deleteQuery,params:params});
	}
	function refresh(){
		dataTable.datagrid("reloadEx");
	}
	function deleteAcc(){
		var rows = dataTable.datagrid("getSelectionsEx");
		if(rows.length == 0){
    		$.alert("请选择一条记录！");
		}
		else{
			$.confirm("是否确定销户？",function(c){
				if(c){
        			var myWin = $.createWin({
						title:"操作提示",
						width:400,
						height:400,
						queryParams:{
							params:rows,
							callback:refresh
						},
						url:"js/merchant/delete_configWin.js"
					});
        		}
			});
		}
	}
});
