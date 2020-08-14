//持卡人账户查询
garen_define("js/functionQuery/cardholderAccountQuery", function(jqObj, loadParams) {
	
	var utils = garen_require("utils");
	
	var base = garen_require("js/base/ws_public");
	
	var depQuery = base.depQuery;//部门查询
	
	var ideQuery = base.ideQuery;//身份查询
	
	var query = "functionQuery/cardholderAccount/query.do";//筛选查询
	
	var allReadCard = base.allReadCard;//读卡
	
	var allReadIdCard = base.allReadIdCard;//读身份证
	
	var jmjlink = garen_require("js/lib/jmjlink");//卡控件
	
	var rData = "";
	
	var columns = [//列字段定义
 	[ {
   		field : 'id',
   		title : 'ID',
   		align : "center",
   		rowspan:2,
   		checkbox : true,
   		width : 50
   	}, {
  		field : 'index',
  		title : '..',
  		align : "center",
  		rowspan:2,
  		width : 50
  	}, {
  		field : 'account_id',
  		title : '账户ID',
  		align : "center",
  		rowspan:2,
  		width : 90
  	}, {
  		field : 'user_no',
  		title : '学/工号',
  		align : "center",
  		rowspan:2,
  		width : 90
  	}, {
  		field : 'user_lname',
  		title : '姓名',
  		align : "center",
  		rowspan:2,
  		width : 90
  	}, {
  		field : 'dep_name',
  		title : '部门',
  		align : "center",
  		rowspan:2,
  		width : 90
  	}, {
  		field : 'user_duty',
  		title : '身份类型',
  		align : "center",
  		rowspan:2,
  		width : 80
  	}, {
  		field : 'finger',
  		title : '指纹消费',
  		align : "center",
  		rowspan:2,
  		width : 80
  	}, {
  		field : 'account_state',
  		title : '账户状态',
  		align : "center",
  		rowspan:2,
  		width : 80
  	}, {
  		field : 'account_end_date_str',
  		title : '账户有效期',
  		align : "center",
  		rowspan:2,
  		width : 90
  	}, {
  		field : 'acc_amt',
  		title : '账户余额',
  		align : "center",
  		colspan:3,
  		width : 90
  	}, {
  		field : 'deposit_amt_str',
  		title : '押金余额',
  		align : "center",
  		rowspan:2,
  		width : 90
  	}, 
//  	{
//  		field : 'sj_str',
//  		title : '时间',
//  		align : "center",
//  		width : 140
//  	},
  	{
   		field : 'crowd_name',
   		title : '人群',
   		align : "center",
   		rowspan:2,
   		width : 100
   	}, {
   		field : 'open_account_date_str',
   		title : '开户日期',
   		align : "center",
   		rowspan:2,
   		width : 100
   	}, {
   		field : 'user_type_mc',
   		title : '在职状态',
   		align : "center",
   		rowspan:2,
   		width : 100
   	}],[{
  		field : 'cash_amt_str',
  		title : '现金余额',
  		align : "center",
  		width : 90
  		
  	}, {
  		field : 'sub_amt_str',
  		title : '补贴余额',
  		align : "center",
  		width : 90
  	}, {
  		field : 'sum_amt_str',
  		title : '小计',
  		align : "center",
  		width : 90
  	}] ];
	var toolBar = [null,{
		eName : 'div',
		height : 10,
		cssStyle : 'background:#ffffff;'
	}, {
		eName : 'div',
		cssClass : 'cardholderDetailQuery_north_second',
		elements : [{
			eName : 'div',
			cssClass:"div_first",
			elements:[{
				eName:"div",
				elements:[{
					eName:"span",
					text: "学/工号"
				},{
					eName:"textbox",
					name : 'user_no',
					width : 100,
					height : 25,
					value:'',//默认值
					validType:["number","length[0,18]"]
				},{
					eName:"span",
					text: "部门"
				},{
					eName:"combotree",
					name:"dep_serial",
					panelHeight:$.browser.msie9?200:'auto',
					panelMaxHeight:200,
					id : 'depTree',
					multiple:true,
					width : 150,
					height : 25,
					value:'',//默认值
					onSelect:function(node){//选择相同则清空文本内容
						if(depTree.combo("getText")==node.text){
							depTree.combotree("clear");
						}
					}
				},{
					eName:"span",
					text: "在职状态"
				},{
					eName:"combogrid",
					id:"userTypeList",
					name:"usertype_state",
					idField:"usertype_id",
					valueField: 'usertype_id',    
			        textField: 'usertype_name',
			        panelHeight:$.browser.msie9?200:'auto',
					panelMaxHeight:200,
					width : 90,
					height : 25,
					editable:false,
					multiple:true,
					singleSelect: false,
					selectOnCheck:true,
					allFlag:true,
					columns:[[
						{field:'usertype_id',checkbox:true},
						{field:'usertype_name',title:'全部'}
					]],
					data: [{
						usertype_id: '1',
						usertype_name: '在职'
					},{
						usertype_id: '2',
						usertype_name: '离职'
					}]
				},{
					eName:"span",
					text: "押金状态"
				},{
					eName:"combogrid",
					id:"depositList",
					name:"deposit_state",
					idField:"deposit_id",
					valueField: 'deposit_id',    
			        textField: 'deposit_name',
			        panelHeight:$.browser.msie9?200:'auto',
					panelMaxHeight:200,
					width : 90,
					height : 25,
					editable:false,
					multiple:true,
					singleSelect: false,
					selectOnCheck:true,
					allFlag:true,
					columns:[[
						{field:'deposit_id',checkbox:true},
						{field:'deposit_name',title:'全部'}
					]],
					data: [{
						deposit_id: '1',
						deposit_name: '有押金'
					},{
						deposit_id: '2',
						deposit_name: '无押金'
					}]
				}]
			},{
				eName:"div",
				elements:[{
					eName:"span",
					elements: "姓&nbsp;&emsp;名"
				},{
					eName:"textbox",
					name:"user_lname",
					width : 100,
					height : 25,
					validType:"unnormal"
				},{
					eName:"span",
					text: "身份"
				},{
					eName:"combogrid",
					id:"ideList",
					name:"identity_id",
					idField:"ident_id",
					valueField: 'ident_id',    
			        textField: 'ident_name',
			        panelHeight:$.browser.msie9?200:'auto',
					panelMaxHeight:200,
					width : 150,
					height : 25,
					editable:false,
					multiple:true,
					singleSelect: false,
					selectOnCheck:true,
					allFlag:true,
					columns:[[
						{field:'ident_id',checkbox:true},
						{field:'ident_name',title:'全部'}
					]]
				},{
					eName:"span",
					text: "账户状态"
				},{
					eName:"combogrid",
					id:"accountList",
					name:"account_state",
					idField:"state_id",
					valueField: 'state_id',    
			        textField: 'state_name',
			        panelHeight:$.browser.msie9?200:'auto',
					panelMaxHeight:200,
					width : 90,
					height : 25,
					editable:false,
					multiple:true,
					singleSelect: false,
					selectOnCheck:true,
					allFlag:true,
					columns:[[
						{field:'state_id',checkbox:true},
						{field:'state_name',title:'全部'}
					]],
					data: [{
						state_id: '0',
						state_name: '正常'
					},{
						state_id: '1',
						state_name: '冻结'
					},{
						state_id: '2',
						state_name: '销户'
					}]
				},{
					eName:"span",
					text: "账户余额"
				},{
					eName:"combogrid",
					id:"accountAmtList",
					name:"acc_amt_state",
					idField:"acc_state_id",
					valueField: 'acc_state_id',    
			        textField: 'acc_state_name',
			        panelHeight:$.browser.msie9?200:'auto',
					panelMaxHeight:200,
					width : 90,
					height : 25,
					editable:false,
					multiple:true,
					singleSelect: false,
					selectOnCheck:true,
					allFlag:true,
					columns:[[
						{field:'acc_state_id',checkbox:true},
						{field:'acc_state_name',title:'全部'}
					]],
					data: [{
						acc_state_id: '1',
						acc_state_name: '有余额'
					},{
						acc_state_id: '2',
						acc_state_name: '无余额'
					}]
				}]
			}]
		},{
			eName : 'div',
			cssClass : 'cardholderDetailQuery_div',
			elements : [{
				eName : 'div',
				cssStyle:"margin-bottom: 6px;",
				elements : [{
					eName : 'linkbutton',
					uId:"tm1",
					width:60,
					height:30,
					cssClass:'cardholderAccountQuery_chaxun',
					text:"查询",
					onClick : function(){
						searchWin(0);
					}
				},{
					eName : 'linkbutton',
					uId:"tm1",
					width:60,
					height:30,
					cssClass:'cardholderAccountQuery_chaxun',
					text:"读卡",
					onClick : readCard
				},{
					eName:"linkbutton",
					cssClass:'cardholderAccountQuery_chaxun',
					uId:"tm2",
					width:60,
					height:30,
					text:"打印",
					onClick:function(){
						//判断
						if(dataTable.datagrid('getRows').length==0){
							$.alert("数据为空！");
						}else{
							utils.printGrid("持卡人账户查询",dataTable);
						}
					}
				}]
			},{
				eName : 'div',
				elements : [{
					eName : 'linkbutton',
					uId:"tm1",
					width:60,
					height:30,
					cssClass:'cardholderAccountQuery_chaxun',
					text:"清空",
					onClick : function(){
						user_no.textbox("clear");
						depTree.combotree("clear");
						ideList.combogrid("clear");
						user_lname.textbox("clear");
						accountList.combogrid("clear");
						userTypeList.combogrid("clear");
						depositList.combogrid("clear");
						acc_amt_state.combogrid("clear");
					}
				},{
					eName : 'linkbutton',
					uId:"tm1",
					width:60,
					height:30,
					cssClass:'cardholderAccountQuery_chaxun',
					text:"读身份证",
					onClick : readIdCard
				},{
					eName : 'linkbutton',
					cssClass:'cardholderAccountQuery_chaxun',
					uId:"tm4",
					width:60,
					height:30,
					text:"导出",
					onClick : function(){
						if(dataTable.datagrid('getRows').length==0){
							$.alert("数据为空！");
						}else{
							var myWin = $.createWin({
								title:"操作提示",
								width:250,
								height:240,
								queryParams:{
									callback:function(i){
										if(i){
											utils.exportExcel("xls","持卡人账户查询",dataTable);
										}else{
											utils.exportExcel("xlsx","持卡人账户查询",dataTable);
										}
									}
								},
								url:"js/functionQuery/cardholderAccountQuery_export.js"
							});
						}
					}
				}]
			}]
		}]
	}];
	var centerUI = {
			eName : 'datagrid',
			idField : 'account_id',
			id:"dataTable",
			docType:'xls',
			//url : query,
			//queryForm:"searchForm",
			toolbarEx : toolBar,// 查询条件工具栏
			columns : columns,
			pagination: true,//分页
			clientPager:true,
			autoload : false,
			singleSelect:true,
			checkOnSelect:true,
			selectOnCheck:true,
			onLoadSuccessEx:function(retJson){
				//$.print(retJson);
				if(retJson.id=="0"){
					/*user_no.textbox("clear");
					depTree.combotree("clear");
					ideList.combogrid("clear");
					user_lname.textbox("clear");
					accountList.combogrid("clear");*/
					if(retJson.data.length>0){
						var rows = dataTable.datagrid("getRows");//当前页所有行
						$.each(rows,function(i,row){//遍历当前页所有数据
							if(row == retJson.data[retJson.data.length-1]){//当前页的数据是最后一行
								dataTable.datagrid('appendRow',{
									index: '合计',
									cash_amt_str: (retJson.retData.cash_total/100).toFixed(2),
									sub_amt_str:(retJson.retData.sub_total/100).toFixed(2),
									sum_amt_str:(retJson.retData.small_total/100).toFixed(2),
									deposit_amt_str:(retJson.retData.deposit_total/100).toFixed(2)
								});
								dataTable.datagrid("mergeCells",{
									index: i+1,
									field: 'index',
									colspan: 9
								});
							}
						});
					}
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
	var depTree = jqObj.findJq("depTree");
	var ideList = jqObj.findJq("ideList");
	var user_no = jqObj.findJq("user_no");
	var user_lname = jqObj.findJq("user_lname");
	var accountList = jqObj.findJq("accountList");
	var userTypeList = jqObj.findJq("userTypeList");
	var depositList = jqObj.findJq("depositList");
	var acc_amt_state = jqObj.findJq("acc_amt_state");
	
	loadTree();//加载选择部门树
	loadIdeList();//加载身份列表
	
//	document.onkeydown=function(event){
//		var e = event || window.event || arguments.callee.caller.arguments[0];
//		if(e && e.keyCode==13){ // enter 键
//			dataTable.datagrid("load");
//	    }
//	};
	
	//键盘回车事件
	user_no.textbox("textbox").keydown(function(e){
		var key = e.keyCode;//兼容firefox
		if(key == 13){
			//dataTable.datagrid("loadEx",{url:query});
			searchWin(0);
		}
	});
	
	user_lname.textbox("textbox").keydown(function(e){
		var key = e.keyCode;//兼容firefox
		if(key == 13){
			//dataTable.datagrid("loadEx",{url:query});
			searchWin(0);
		}
	});
	
	function loadTree(){
		$.postEx(depQuery,function(retJson){
			if(retJson.result && retJson.data){
				depTree.combotree('loadData',
						$.list2Tree(retJson.data,"dep_serial","dep_parent","dep_name"));
			}
		});
	}
	
	function loadIdeList(){
		$.postEx(ideQuery,function(retJson){
			if(retJson.result && retJson.data){
				var ideGrid = ideList.combogrid("grid");
				ideGrid.datagrid("loadDataEx",retJson.data);
				//ideList.combobox("loadDataEx",retJson.data);
			}
		});
	}

	//读卡
	function readCard(){
		var myWin = $.createWin({
			title:"操作提示",
			width:300,
			height:150,
			queryParams:{
				callback:function(retJson,i){
					readCardBack(retJson,i);
				}
			},
			url:"js/account/readCardWin.js"
		});
	}
	function readCardBack(retJson,i){
		if(i){
			user_no.textbox("setValue",retJson.data[0].user_no);
			//depTree.combotree("setValue",retJson.data[0].user_dep);
			//user_lname.textbox("setValue",retJson.data[0].user_lname);
			//ideList.combo("setValue",retJson.data[0].ident_id);
			depTree.combotree("clear");
			ideList.combogrid("clear");
			user_lname.textbox("clear");
			accountList.combogrid("clear");
			userTypeList.combogrid("clear");
			depositList.combogrid("clear");
			acc_amt_state.combogrid("clear");
			user_no.textbox("setText","");
			
			var param = {};
			param['account_id'] = retJson.data[0].account_id;
			rData = param;
			successBeep();
			searchWin(1);
			user_no.textbox("setValue","");
		}else{
			$.alert(retJson.info);
			errorBeep();
		}
	}
	
	function readIdCard(){
		var myWin = $.createWin({
			title:"操作提示",
			width:300,
			height:150,
			queryParams:{
				callback:readIdCardBack
			},
			url:"js/account/readIdCardWin.js"
		});
	}
	
	function readIdCardBack(jt){
		var param = {};
		param['user_id'] = jt.retData.IdenNo;
		$.postEx(allReadIdCard,param,function(retJson){
			if(retJson.result && retJson.data){
				user_no.textbox("setValue",retJson.data[0].user_no);
				depTree.combotree("clear");
				ideList.combogrid("clear");
				user_lname.textbox("clear");
				accountList.combogrid("clear");
				userTypeList.combogrid("clear");
				depositList.combogrid("clear");
				acc_amt_state.combogrid("clear");
				
				user_no.textbox("setText","");
				searchWin(1);
				successBeep();
				user_no.textbox("setValue","");
			}else{
				errorBeep();
				$.alert(retJson.info);
			}
		});
	}
	
	//成功提示音
	function successBeep(){
		var params = {
			"commandSet":[{
				"funName":"Beep",
				"param": {
					"IntervalMode":"No",
					"Ms":"100"
				 }
			}]
		}
		jmjlink.send(function(jtype,jtext,jpre_str){
			
		},'成功提示音',$.toJSON(params));
	}
	
	//错误提示音
	function errorBeep(){
		var params = {
			"commandSet":[{
				"funName":"Beep",
				"param": {
					"IntervalMode":"Short",
					"Ms":"600"
				 }
			}]
		}
		jmjlink.send(function(jtype,jtext,jpre_str){

		},'错误提示音',$.toJSON(params));
	}
	function searchWin(cx_type){
		if(cx_type == 0){
			rData = "";
		}
		dataTable.datagrid("loadEx",{url:query,'cx_type':cx_type});
	}
	//文本长度验证
	user_no.next().children().eq(0).attr("maxlength",18);
	user_lname.next().children().eq(0).attr("maxlength",10);
	
	//扩展验证
	$.extend($.fn.validatebox.defaults.rules, {    
		 number: {// 半角字符验证
             validator: function (value) {
                 return /^([+]?[A-Za-z0-9_-])+\d*$/i.test(value);
             },
             message: '只能输入数字、字母、下划线、短横线'
         },
         unnormal: {// 验证是否包含空格和非法字符
             validator: function (value) {
                 return !/[ '"@#\$%\^&\*！!<>\\\/]+/i.test(value);
             },
             message: '输入值不能为空和包含其他非法字符'
         }
	});  
});
