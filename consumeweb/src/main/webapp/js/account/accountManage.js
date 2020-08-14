//账户管理
garen_define("js/account/accountManage",function (jqObj,loadParams) {
	var utils = garen_require("utils");
	//webService
	var base = garen_require("js/base/ws_public");

	var checkCoreIp = base.checkCoreIp;//核心业务IP授权验证

	var depQuery = base.depQuery;//部门查询

	var ideQuery = base.ideQuery;//身份查询

	var manageQuery = "account/manageQuery.do";//筛选查询

	//var manageSave = "account/manageSave.do";//保存

	var allReadCard = base.allReadCard;//读卡

	var allReadIdCard = base.allReadIdCard;//读身份证

	var jmjlink = garen_require("js/lib/jmjlink");//卡控件

	var scmurl = garen_require("js/lib/scmurl");//url地址

	var flag = 0;//datagrid列表样式，0：无，1：红或绿

	var rData = "";//读卡时把id和卡号等存下来，操作时对比id，成功则提交卡号等

	var save = 0;//数据是否保存
	var page = 0;//是否是确定后执行

	//工具栏
	var toolBar = [null,{
		eName : 'div',
		height:10,
		cssStyle : 'background:#ffffff;'
	},{
		eName : 'div',
		cssClass:"accountManage_toolBar_second",
		elements : [{
			eName : 'div',
			elements:{
				eName:"formUI",
				id:"queryForm",
				//url:manageQuery,
				method:"post",
				alertFlag:false,
				progressBar:"查询中...",
				onSave:function(retJson){
					if(retJson.result){
						account_id.val(retJson.data[0].account_id);
						dataTable.datagrid("loadDataEx",retJson);
					}else{
						$.alert(retJson.info);
					}
				},
				elements : [{
					eName : 'div',
					cssClass:"toolBar_div_first",
					elements : [{
						eName : 'span',
						elements : '姓&emsp;&emsp;名',
					},{
						eName : 'textbox',
						name : 'user_lname',
						validType:"unnormal",
						width : 150,
						height : 25,
						value:''//默认值
					},{
						eName : 'span',
						elements : '学/工号&ensp;',
					},{
						eName : 'textbox',
						name : 'user_no',
						validType:"numberUserNo",
						width : 150,
						height : 25,
						value:''//默认值
					}]
				},{
					eName : 'div',
					cssClass:"toolBar_div_second",
					elements : [{
						eName : 'span',
						elements : '部&emsp;&emsp;门',
					},{
						eName : 'combotree',
						name:"dep_serial",
						panelHeight:$.browser.msie9?200:'auto',
						panelMaxHeight:200,
						multiple:true,
						id : 'depTree',
						width : 150,
						height : 25,
						value:'',//默认值
						onSelect:function(node){//选择相同则清空文本内容
							if(depTree.combo("getText")==node.text){
								depTree.combotree("clear");
							}
						}
					},{
						eName : 'span',
						elements : '身份类型',
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
					}]
				}]
			}
		},{
			eName : 'div',
			cssStyle:"margin-right:15px;",
			elements : [{
				eName : 'div',
				cssStyle:"margin-bottom:4px;",
				elements : {
					eName : 'linkbutton',
					uId:"tm1",
					width:70,
					height:33,
					text:"查询",
					onClick : function(){
						searchWin(0);
					}
				}
			},{
				eName : 'div',
				elements : {
					eName : 'linkbutton',
					uId:"tm1",
					width:70,
					height:33,
					text:"清空",
					onClick : function(){
						user_lname.textbox("clear");
						user_no.textbox("clear");
						depTree.combotree("clear");
						ideList.combogrid("clear");
					}
				}
			}]
		},{
			eName : 'div',
			cssStyle:"margin-right:15px;",
			elements : [{
				eName : 'div',
				cssStyle:"margin-bottom:4px;",
				elements : {
					eName : 'linkbutton',
					uId:"tm1",
					width:70,
					height:33,
					text:"读卡",
					onClick : readCard
				}
			},{
				eName : 'div',
				elements : {
					eName : 'linkbutton',
					uId:"tm1",
					width:70,
					height:33,
					text:"读身份证",
					onClick : readIdCard
				}
			}]
		},{
			eName:"div",
			cssStyle:"margin-right:15px;",
			elements:[{
				eName : 'div',
				cssStyle:"margin-bottom:4px;",
				elements : {
					eName : 'linkbutton',
					uId:"tm1",
					width:70,
					height:33,
					text:"冻结",
					onClick : freeze
				}
			},{
				eName : 'div',
				elements : {
					eName : 'linkbutton',
					uId:"tm1",
					width:70,
					height:33,
					text:"解冻",
					onClick : unfreeze
				}
			}]
		},{
			eName : 'div',
			cssStyle:"margin-right:15px;",
			elements : [{
				eName : 'div',
				cssStyle:"margin-bottom:4px;",
				elements : {
					eName : 'linkbutton',
					uId:"tm1",
					width:70,
					height:33,
					text:"重置密码",
					onClick : resetPwd
				}
			},{
				eName : 'div',
				elements:{
					eName : 'linkbutton',
					uId:"tm1",
					width:70,
					height:33,
					text:"修改有效期",
					onClick : updateDate
				}
			}]
		},{
			eName:"div",
			elements:[{
				eName : 'div',
				cssStyle:"margin-bottom:4px;",
				elements : {
					eName : 'linkbutton',
					uId:"tm1",
					width:85,
					height:33,
					text:"启用指纹消费",
					onClick : fingerEnable
				}
			},{
				eName : 'div',
				elements:{
					eName : 'linkbutton',
					uId:"tm1",
					width:85,
					height:33,
					text:"禁用指纹消费",
					onClick : fingerDisable
				}
			}]
		},{
			eName:"div",
			cssStyle:"margin-left:15px;line-height: 120px;font-size:16px;font-family: 微软雅黑, Arial;",
			elements:[{
				eName:"span",
				text:"当前选中人数（"
			},{
				eName:"span",
				id:"data_count",
				cssStyle:"margin:0 10px 0 10px;",
				text:"0"

			},{
				eName:"span",
				text:"）人"
			}]
		}]
	}];

	var columns = [//列字段定义
		[{
			field : 'id',
			title : 'ID',
			align : "center",
			checkbox : true,
			rowspan:2,
			width : 100
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
			field : 'user_depname',
			title : '部门',
			align : "center",
			rowspan:2,
			width : 100
		}, {
			field : 'user_duty',
			title : '身份类型',
			align : "center",
			rowspan:2,
			width : 90
		}, {
			field : 'finger_enable',
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
			width : 100
		}, {
			field : 'account_amt_s',
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
		}, {
			field : 'crowd_name',
			title : '人群',
			align : "center",
			rowspan:2,
			width : 100
		}, {
			field : 'open_account_date',
			title : '开户日期',
			align : "center",
			rowspan:2,
			width : 100
		}
//       	, {
//       		field : 'state_info',
//       		title : '状态信息',
//       		align : "center",
//       		width : 80
//       	}
		],[{
			field : 'cash_amt_str',
			title : '现金余额',
			align : "center",
			width : 90
		}, {
			field : 'sub_amt_str',
			title : '补贴余额',
			align : "center",
			width : 90
		} , {
			field : 'sum_amt_str',
			title : '小计',
			align : "center",
			width : 90
		}
		] ];

	var centerUI = {
		eName : 'datagrid',
		id:'dataTable',
		queryForm:"queryForm",
		//url:manageQuery,
		idField : 'account_id',
		toolbarEx : toolBar,// 查询条件工具栏
		columns : columns,
		pagination: true,
		clientPager:true,
		alertFlag : false,// 是否弹出默认对话框
		autoload : false,
		singleSelect:false,
		checkOnSelect:true,
		selectOnCheck:true,
//		onSelect:setInfo,
//		rowStyler:function(index,row){
//			if(flag==1){
//				if(row.state_info=="未生效"){
//					return 'color:red;';
//				}
//				if(row.state_info=="已生效"){
//					return 'color:#00e500;';
//				}
//			}
//		},
//		onBeforeLoadEx:function(params){
//			var rows = dataTable.datagrid("getRows");
//			if(page == 0){//确认前执行
//				$.each(rows,function(i,row){
//					if(row.state_info=="未生效"){
//						save = 1;
//						return false;
//					}
//				});
//			}else{
//				page = 0;
//			}
//			if(save == 1){//存在未保存的数据
//				if(params.pageNum==1){
//					$.confirm("本页有未保存的数据，是否确定刷新页面？",function(c){
//						if(c){
//							save = 0;//重置
//							page = 1;//确认后
//							dataTable.datagrid("reload");
//						}else{
//
//						}
//					});
//				}else{
//					$.confirm("本页有未保存的数据，是否确定跳转到其他页面？",function(c){
//						if(c){
//							save = 0;//重置
//							page = 1;//确认后
//							dataTable.datagrid("reload");
//						}else{
//							save = 0;//重置
//							page = 0;//取消后
//							var pager = dataTable.datagrid("getPager");
//							//页码显示
//							pager.find('input.pagination-num').val(params.pageNum-1);
//							//分页页码
//							var op = pager.pagination("options");
//							op.pageNumber = params.pageNum-1;
////							pager.pagination({
////								onSelectPage:function(pageNo, pageSize){
////
////								}
////							});
//						}
//					});
//				}
//
//				if(page==0){
//					return false;
//				}
//			}
//		},
		onCheckEx:function(index,row){
			data_count.html(dataTable.datagrid("getCheckedEx").length);
		},
		onCheckAllEx:function(rows){
			data_count.html(dataTable.datagrid("getCheckedEx").length);
		},
		onUncheckEx:function(index,row){
			data_count.html(dataTable.datagrid("getCheckedEx").length);
		},
		onUncheckAllEx:function(rows){
			data_count.html(dataTable.datagrid("getCheckedEx").length);
		},
		onLoadSuccessEx:function(retJson){
			if(retJson.id==0){
				//if(retJson.rows.length>0){
				//$(this).datagrid("selectRow","0");
				//}
//				user_lname.textbox("clear");
//				user_no.textbox("clear");
//				depTree.combotree("clear");
//				ideList.combogrid("clear");
				data_count.html(dataTable.datagrid("getCheckedEx").length);
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

//	var southUI = {
//			eName : 'div',
//			cssClass:"accountManage_south_div",
//			elements : [{
//				eName : 'linkbutton',
//				uId:"tm2",
//				text : "<span style='font-size:20px;'>保存</span>",
//				cssClass : 'accountManage_linkbutton',
//				width : 220,
//				height : 60,
//				onClick:saveManage
//			},{
//				eName : 'linkbutton',
//				uId:"tm1",
//				text : '打印',
//				cssClass:"accountManage_linkbutton1",
//				width : 70,
//				height : 38,
//				onClick:function(){
//					if(dataTable.datagrid('getRows').length==0){
//						$.alert("数据为空");
//					}else{
//						utils.printGrid("账户管理",dataTable);
//					}
//				}
//			},{
//				eName : 'linkbutton',
//				uId:"tm1",
////				text : '取消',
//				text:'返回主界面',
//				cssClass:"accountManage_linkbutton2",
//				width : 70,
//				height : 38,
//				onClick:function(){
//					try{
////						window.top.main_iframe.ChangUrl("M000",0,"");
//						window.location = "http://" + loadParams.login_wtop + "/r_home.asp";
//					}
//					catch(e){
//
//					}
//				}
//			}]
//		};

//	var mainUI = {
//			eName : 'layoutEx',// 容器布局类，jeasyui组件
//			cssStyle:'font-family: 微软雅黑, Arial;',
//			fit : true,
//			elements : [{
//				region : 'center',
//				border : false,
//				collapsible:false,
//				noheader : true,
//				elements : centerUI
//			},
//			{
//				region : 'south',
//				height : 100,
//				border : false,
//				collapsible:false,
//				noheader : true,
//				elements : southUI
//			}]
//	};
	jqObj.loadUI(mainUI);

	var dataTable = jqObj.findJq("dataTable");

	var queryForm = jqObj.findJq("queryForm");

	var depTree = jqObj.findJq("depTree");
	var ideList = jqObj.findJq("ideList");
	var user_lname = jqObj.findJq("user_lname");
	var user_no = jqObj.findJq("user_no");


	var account_end_date = jqObj.findJq("account_end_date");
	var account_state = jqObj.findJq("account_state");
	//var finger_enable = jqObj.findJq("finger_enable");
	var account_id = jqObj.findJq("account_id");
	var data_count = jqObj.findJq("data_count");


	//匿名函数,绑定分页事件
//	(function(){
//		var pager = dataTable.datagrid('getPager');
//		pager.updateOpt("pagination",{
//			onBeforeSelect:function(pageNumber){
//				var rows = dataTable.datagrid("getRows");
//				if(page == 0){//确认前执行
//					$.each(rows,function(i,row){
//						if(row.state_info=="未生效"){
//							save = 1;
//							return false;
//						}
//					});
//				}else{
//					page = 0;
//				}
//				if(save == 1){//存在未保存的数据
//					$.confirm("本页有未保存的数据，是否确定跳转到其他页面？",function(c){
//						if(c){
//							save = 0;//重置
//							page = 1;//确认后
//							//dataTable.datagrid("reload");
//							//return true;
//							pager.pagination('select',pageNumber);
//						}else{
//							save = 0;//重置
//							page = 0;//取消后
//						}
//					});
//					if(page==0){
//						return false;
//					}
//				}
//			}
//		});
//	}());


	loadTree();//加载选择部门树

	loadIdeList();//加载身份列表

	loadInit();

	function loadInit(){
		$.postEx(checkCoreIp,{'op_name':'账户管理'},function(retJson){
			if(retJson.result){

			}else{
				$.alert(retJson.info,function(){
					//window.parent.location.reload();
					window.top.location.href=scmurl;
				});
			}
		});
	}

//	document.onkeydown=function(event){
//		var e = event || window.event || arguments.callee.caller.arguments[0];
//		if(e && e.keyCode==13){ // enter 键
//			queryManage();
//	    }
//	};

	//键盘回车事件
	user_no.textbox("textbox").keydown(function(e){
		var key = e.keyCode;//兼容firefox
		if(key == 13){
			searchWin(0);
		}
	});

	user_lname.textbox("textbox").keydown(function(e){
		var key = e.keyCode;//兼容firefox
		if(key == 13){
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
			}
		});
	}

	function searchWin(cx_type){
		//flag = 0;//点击查询datagrid样式恢复
		//queryForm.findJqUI().submit();
		if(cx_type == 0){
			rData = "";
		}
		dataTable.datagrid("loadEx",{url:manageQuery,'cx_type':cx_type});
	}

//	function setInfo(index,row){
//		account_end_date.datebox("setValue",row.account_end_date_str);
//		account_state.combobox("setValue",row.account_state);
//		if(row.finger_enable=="禁用"){
//			finger_enable.prop("checked","");
//		}
//		else if(row.finger_enable=="启用"){
//			finger_enable.prop("checked","checked");
//		}
//	}

//	function setManage(){
//		flag = 1;//设置后datagrid样式改变
//		var row = dataTable.datagrid("getSelected");
//		if(row==null){
//			$.alert("请先选择一条记录！");
//		}else{
//			var index = dataTable.datagrid("getRowIndex",row);
//			var param = {};
//			//param['user_no'] = row.user_no;
//			//param['user_lname'] = row.user_lname;
//			//param['dep_name'] = row.dep_name;
//			//param['user_duty'] = row.user_duty;
//			param['account_end_date_str'] = account_end_date.datebox("getValue");
//			param['account_state'] = account_state.combobox("getText");
//			if(finger_enable.prop("checked")){
//				param['finger_enable'] = "启用";
//			}else{
//				param['finger_enable'] = "禁用";
//			}
//			param['state_info'] = "未生效";
//			dataTable.datagrid("updateRow",{
//				index:index,
//				row:param
//			});
//		}
//	}

//	function resetPwd(){
//		var row = dataTable.datagrid("getSelected");
//		if(row==null){
//			$.alert("请先选择一条记录！");
//		}else{
//			var myWin = $.createWin({
//				title:"重置账户密码",
//				width:300,
//				height:200,
//				queryParams:{
//					params:row.account_id,
//					//callback:loadPwdList
//				},
//				url:"js/account/accountManage_resetPwd.js"
//			});
//		}
//	}

	function freeze(){
		var rows = dataTable.datagrid("getCheckedEx");
		if(rows.length == 0){
			$.alert("至少选择一条记录！");
		}else{
			$.confirm('是否要对已选的人员账户进行冻结？',function(c){
				if(c){
					var myWin = $.createWin({
						title:"操作提示",
						width:305,
						height:400,
						queryParams:{
							params:rows,
							event_id:"9",
							rData:rData,
							callback:refresh
						},
						url:"js/account/accountManage_configWin.js"
					});
				}
			});
		}
	}

	function unfreeze(){
		var rows = dataTable.datagrid("getCheckedEx");
		if(rows.length == 0){
			$.alert("至少选择一条记录！");
		}else{
			$.confirm('是否要对已选的人员账户进行解冻？',function(c){
				if(c){
					var myWin = $.createWin({
						title:"操作提示",
						width:305,
						height:400,
						queryParams:{
							params:rows,
							event_id:"8",
							rData:rData,
							callback:refresh
						},
						url:"js/account/accountManage_configWin.js"
					});
				}
			});
		}
	}

	function resetPwd(){
		var rows = dataTable.datagrid("getCheckedEx");
		if(rows.length == 0){
			$.alert("至少选择一条记录！");
		}else{
			$.confirm('是否要对已选的人员账户重置密码？',function(c){
				if(c){
					var myWin = $.createWin({
						title:"操作提示",
						width:300,
						height:200,
						queryParams:{
							params:rows,
							rData:rData,
							callback:refresh
						},
						url:"js/account/accountManage_resetPwd.js"
					});
				}
			});
		}
	}

	function updateDate(){
		var rows = dataTable.datagrid("getCheckedEx");
		if(rows.length == 0){
			$.alert("至少选择一条记录！");
		}else{
			$.confirm('是否要对已选的人员账户修改有效期？',function(c){
				if(c){
					var myWin = $.createWin({
						title:"操作提示",
						width:300,
						height:150,
						queryParams:{
							params:rows,
							rData:rData,
							callback:refresh
						},
						url:"js/account/accountManage_updateDate.js"
					});
				}
			});
		}
	}

	function fingerEnable(){
		var rows = dataTable.datagrid("getCheckedEx");
		if(rows.length == 0){
			$.alert("至少选择一条记录！");
		}else{
			$.confirm('是否要对已选的人员账户启用指纹消费？',function(c){
				if(c){
					var myWin = $.createWin({
						title:"操作提示",
						width:305,
						height:400,
						queryParams:{
							params:rows,
							event_id:"101",
							rData:rData,
							callback:refresh
						},
						url:"js/account/accountManage_configWin.js"
					});
				}
			});
		}
	}

	function fingerDisable(){
		var rows = dataTable.datagrid("getCheckedEx");
		if(rows.length == 0){
			$.alert("至少选择一条记录！");
		}else{
			$.confirm('是否要对已选的人员账户禁用指纹消费？',function(c){
				if(c){
					var myWin = $.createWin({
						title:"操作提示",
						width:305,
						height:400,
						queryParams:{
							params:rows,
							event_id:"102",
							rData:rData,
							callback:refresh
						},
						url:"js/account/accountManage_configWin.js"
					});
				}
			});
		}
	}

	function refresh(){
		dataTable.datagrid("reloadEx");
	}

//	function saveManage(){
//		flag = 1;
//		var rows = dataTable.datagrid("getRows");
//		var params = [];
//		$.each(rows,function(i, row){
//			var param = {};
//			if(row.state_info=="未生效"){
//				param['account_id'] = row.account_id;
//				param['account_end_date'] = row.account_end_date_str;
//				if(row.finger_enable=="启用"){
//					param['finger_enable'] = "1";
//				}
//				else if(row.finger_enable=="禁用"){
//					param['finger_enable'] = "0";
//				}
//				if(row.account_state=="正常"){
//					param['account_state'] = "0";
//				}
//				else if(row.account_state=="冻结"){
//					param['account_state'] = "1";
//				}
//				if(account_id.val() == rData.account_id){
//					param['read_card_number'] = rData.card_number;
//					param['read_media_id'] = rData.media_id;
//				}
//				params.push(param);
//			}
//		});
//		//$.print(params);
//		if(params.length<1){
//			$.alert("不存在未生效的数据！");
//		}else{
//			$.postJson(manageSave,params,function(retJson){
//				if(retJson.result){
//					$.each(rows,function(i, row){
//						if(row.state_info == "未生效"){
//							dataTable.datagrid("updateRow",{
//								index:i,
//								row:{
//									state_info:"已生效"
//								}
//							});
//						}
//					});
//				}else{
//					//数组去掉'，'之后换行提示
//					$.alert(retJson.obj.join().replace(new RegExp(/,/g),''));
//				}
//			});
//		}
//	}

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
				user_lname.textbox("clear");
				depTree.combotree("clear");
				ideList.combogrid("clear");
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



	function readCard(){
		var myWin = $.createWin({
			title:"操作提示",
			width:300,
			height:150,
			queryParams:{
				callback:readCardBack
			},
			url:"js/account/accountManage_readCardWin.js"
		});
	}

	function readCardBack(retJson,i){
		if(i){
			user_no.textbox("setValue",retJson.data[0].user_no);

			user_lname.textbox("clear");
			depTree.combotree("clear");
			ideList.combogrid("clear");

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

	//读卡
//	function readCard(){
//		var params = {
//			"commandSet":[{
//				"funName":"ReqCard",
//				"param":""
//			}]
//		};
//
//		jmjlink.send(function(jtype,jtext,jpre_str){
//			if(jtype==2){
//				$.alert(jpre_str);
//			}else{
//				var jt = $.parseJSON(jtext);
//				if(jt.ErrCode=="0"){
//					var param = {};
//					param['card_number'] = jt.retData.CardNo;
//					param['media_id'] = jt.retData.CardType;
//					$.postEx(allReadCard,param,function(retJson){
//						if(retJson.result && retJson.data.length>0){
//							//$.print(retJson);
//							user_no.textbox("setValue",retJson.data[0].user_no);
//							depTree.combotree("setValue",retJson.data[0].dep_serial);
//							user_lname.textbox("setValue",retJson.data[0].user_lname);
//							//user_id.textbox("setValue",retJson.data[0].user_id);
//							ideList.combobox("setValue",retJson.data[0].ident_id);
//							param['account_id'] = retJson.data[0].account_id;
//							rData = param;
//							successBeep();
//							queryManage();
//						}else{
//							$.alert(retJson.info);
//							errorBeep();
//						}
//					});
//				}else if(jt.ErrCode=="-102"){
//					$.alert("未寻到卡，请将卡放到读卡器后再次读卡！");
//					errorBeep();
//				}else{
//					$.alert("寻卡错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
//					errorBeep();
//				}
//			}
//		},'寻卡',$.toJSON(params));
//	}

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

	//文本长度验证
	user_no.next().children().eq(0).attr("maxlength",18);
	user_lname.next().children().eq(0).attr("maxlength",10);

	//扩展验证
	$.extend($.fn.validatebox.defaults.rules, {
		numberUserNo: {// 半角字符验证
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
