//卡号导入
garen_define("js/account/impCard",function (jqObj,loadParams) {
	
	var utils = garen_require("utils");
	
	var base = garen_require("js/base/ws_public");
	var checkCoreIp = base.checkCoreIp;//核心业务IP授权验证
	
	var scmurl = garen_require("js/lib/scmurl");//url地址
	
	//webService
	var cardNumImport = "account/cardNumImport.do";//列表导入
	var cardTypeQuery = "account/cardTypeQuery.do"//全部卡号类型查询
	
	var batchChargeQuery = "account/batchChargeQuery.do";//根据条件查询
    var color_id = "";//发卡account_id
	var color_i = "";//发卡颜色0绿（正在发卡），1红（发卡失败）
	var color_index="";//变色行列表
	var save = 0;//数据是否保存
	var page = 0;//是否是确定后执行
	var importFlag = "";//列表导入标志
	var checkedTotalNum = 0;// 选中数据条目
	var failedValid = 0;// 未通过验证条目
	var sendedCard = 0;// 已发卡条目
	var sendFailedCard =0;// 发卡失败条目
	
	//工具栏
	var toolBar = [null,{
		eName : 'div',
		height:10,
		cssStyle : 'background:#ffffff;'
	},{
		eName:"formUI",
		id:"importForm",
		url:cardNumImport,
		method:"post",//上传表单时，必须设置此值
		alertFlag:true,
		progressBar:"上传中...",
		enctype:"multipart/form-data",//上传附件时，必须设置此值
		onSave:function(retJson){
			if(retJson.result){
				importFlag = 1;
				dataTable.datagrid("loadDataEx",retJson.data);
			}else{
				//retDatas
				if(retJson.data && retJson.data.length>0){
					var myWin = $.createWin({
						title:"系统提示信息",
						width:580,
						height:550,
						queryParams:{
							params:retJson.info,
							params2:retJson.data
						},
						url:"js/account/impCard_importWin.js"
					});
				}else{
					$.alert(retJson.info);
				}
			}
		},
		elements:{
			eName : 'div',
			cssClass : 'cardNumImp_toolBar_second',
			elements : {
				eName : 'div',
				elements : [{
					eName : 'filebox',
					buttonText:'选择文件',
					accept:'application/vnd.ms-excel',
					width : 320,
					height : 31,
					uId:"tm1",
					id : "forFile",
					name:'userFile'
				},{ 
					eName :'input',
					name:'card_lx',
					type:"hidden",
				    width : 150,
				    height : 25,
				    value:''//默认值
				},{
					eName : 'linkbutton',
					uId:"tm2",
					width:65,
					height:31,
					text:"导入",
					onClick :qryCardTypeAll
				},{
					eName : 'linkbutton',
					uId:"tm1",
					width:65,
					height:31,
					text:"下载模版",
					onClick : function(){
						window.location.href="import_mould/importCardMould.xls";
					}
				},{
					eName : 'linkbutton',
					cssStyle:"margin-left:40px;",
					uId:"tm1",
					width:65,
					height:31,
					text:"统计信息",
					onClick : function(){
						var rows = dataTable.datagrid("getCheckedEx");
						if(rows.length == 0){//如果没选择记录，弹出提示框
							$.alert("至少选择一条记录！");
						}else{
							checkedTotalNum = rows.length;
							// 置空计数记录
							failedValid = 0;
							sendedCard = 0;
							sendFailedCard = 0;
							// 是否存在发卡数据 1存在正常待发卡数据
				            $.each(rows, function (i, row) {
				            	// state： 判断用    0：通过 1：未通过2:已发卡
				            	if(row.state == "1"){// 未通过验证 
				            		failedValid = failedValid+1;
				            	} else if (row.state == "2") {// 已发卡
				            		sendedCard = sendedCard+1;
				            	} else if (row.state == "3") {// 发卡失败
				            		sendFailedCard = sendFailedCard+1;
				            	} else {//正常
				            	}
				            });
				            
				            var myWin = $.createWin({
								title:"统计信息",
								width:300,
								height:200
							},{
								eName:"div",
								elements:[{
									eName:"div",
									elements:[{
										eName:"div",
										cssClass:"cardManage_provideWin_div_imp",
									    cssStyle:"margin: 10px 0 0 40px;",
										elements:"选中数据条目共:"+checkedTotalNum+"条"
												
									},{
										eName:"div",
										cssStyle:"margin: 5px 0 0 40px;",
										cssClass:"cardManage_provideWin_div_imp",
										elements:"未通过验证:"+failedValid+"条"
									},{
										eName:"div",
										cssStyle:"margin: 5px 0 0 40px;",
										cssClass:"cardManage_provideWin_div_imp",
										elements:"已发卡:"+sendedCard+"条"
									},{
										eName:"div",
										cssStyle:"margin: 5px 0 0 40px;",
										cssClass:"cardManage_provideWin_div_imp",
										elements:"发卡失败:"+sendFailedCard+"条"
									}]
								},{
									eName:"div",
									cssStyle:"text-align:center;margin-top:30px;",
									elements:{
										eName:"linkbutton",
										uId:"tm1",
										name:"confirmBtn",
										cssClass:"cardManage_searchWin_linkbutton",
										text : '确定',
										width : 80,
										height : 35,
										onClick:function(){
											myWin.window("close");
										}
									}
								}]
							});
						}
					}
				}]
			}
		}
	}];
	
	var columns = [//列字段定义
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
       		field : 'user_sex',
       		title : '性别',
       		align : "center",
       		width : 50
       	}, {
       		field : 'dep_name',
       		title : '部门',
       		align : "center",
       		width : 100
       	}, {
       		field : 'user_identity',
       		title : '身份类型',
       		align : "center",
       		width : 100
       	}, {
       		field : 'card_no',
       		title : '导入卡号',
       		align : "center",
       		width : 140
       	}, {
       		field : 'card_lxmc',
       		title : '卡片类型',
       		align : "center",
       		width : 100
       	}, {
       		field : 'account_end_date',
       		title : '账号有效期',
       		align : "center",
       		width : 130
       	}, {
       		field : 'finger_enable',
       		title : '指纹消费',
       		align : "center",
       		width : 100
       	}, {
       		field : 'state_mc',
       		title : '状态',
       		align : "center",
       		width : 100
       	}, {
       		field : 'bz',
       		title : '备注',
       		align : "center"
       		//width : 170
       	}, {
       		field : 'account_id',
       		title : '账户',
       		hidden: true,
       		align : "center",
       		width : 100
       	}, {
       		field : 'account_state',
       		title : '账务状态',
       		hidden: true,
       		align : "center",
       		width : 100
       	}, {
       		field : 'user_serial',
       		title : '人员序号',
       		hidden: true,
       		align : "center",
       		width : 100
       	}, {
       		field : 'card_lx',
       		title : '卡类型',
       		hidden: true,
       		align : "center",
       		width : 100
       	}, {
       		field : 'state',
       		title : '状态',
       		hidden: true,
       		align : "center",
       		width : 100
       	}, {
       		field : 'index_idField',
       		title : '主键',
       		hidden: true,
       		align : "center",
       		width : 100
       	}] ];
	
	var centerUI = {
		eName : 'datagrid',
		idField : 'index_idField',
		id:'dataTable',
		queryForm:"searchForm",
		toolbarEx : toolBar,// 查询条件工具栏
		columns : columns,
		alertFlag : false,// 是否弹出默认对话框
		autoload : false,
		singleSelect:false,
		checkOnSelect:true,
		selectOnCheck:true,
		pagination: true,
		clientPager:true,
		rowStyler:function(index,row){
			if(row.state=="2"){
				return 'background-color:green;';
			}
			if(row.state=="3"){
				return 'background-color:red;';
			}
			/*if(row.index_idField==color_id){
				if(color_i == "1"){
					return 'background-color:green;';
				}
				else if(color_i == "0"){
					return 'background-color:red;';
				}
			}*/
		},
		onLoadSuccessEx:function(retJson){
			if(retJson.id==0){
				//data_count.html(dataTable.datagrid("getCheckedEx").length);
			}else{
				$.alert(retJson.info);
			}
		}
	};
	
	var southUI = {
			eName : 'div',
			cssClass:"cardNumImp_south_div",
			elements : [{
				eName : 'linkbutton',
				uId:"tm2",
				text : "<span style='font-size:20px;'>发附卡</span>",
				cssClass : 'cardNumImp_linkbutton',
				width : 220,
				height : 60,
				onClick:sendSupplementaryCard
			}
			]
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
	
	var forFile = jqObj.findJq("forFile");
	var dataTable = jqObj.findJq("dataTable");
	var importForm = jqObj.findJqUI("importForm");
	//var data_count = jqObj.findJq("data_count");
	// 卡类型
	var card_lx = jqObj.findJq("card_lx");
	
	loadInit();
	
	function loadInit(){
		$.postEx(checkCoreIp,{'op_name':'卡号导入'},function(retJson){
			if(retJson.result){
				
			}else{
				$.alert(retJson.info,function(){
					//window.parent.location.reload();
					window.top.location.href=scmurl;
				});
			}
		});
	}
	
	function qryCardTypeAll(){
		// 发卡颜色置空
	    color_id = "";
	    color_i = "";
	    color_index="";
	    // 校验是否选择需导入的文件
	    var fileExtension = forFile.textbox("getValue").split('.').pop().toLowerCase();
		if(forFile.textbox("getValue")=="" || fileExtension != "xls" && fileExtension != "xlsx"){
			$.alert("请选择正确文件！");
		}else{
			var myWin = $.createWin({
				title:"卡类型",
				width:250,
				height:150,
				queryParams:{
					callback:loadCardNumTypeList
				},
				url:"js/account/impCard_cardTypeWin.js"
			});
		}
	}
	// 回调函数提交表单数据
	function loadCardNumTypeList(e){
		card_lx.val(e);
		var fileExtension = forFile.textbox("getValue").split('.').pop().toLowerCase();
		if(forFile.textbox("getValue")=="" || fileExtension != "xls" && fileExtension != "xlsx"){
			$.alert("请选择正确文件！");
		}else{
			// 置空翻页数据调整页面至第一页
			dataTable.datagrid('gotoPage',1);
			importForm.submit();
			card_lx.val("");
		}
	}
	
	
	//发附卡sendSupplementaryCard
	function sendSupplementaryCard(){
		var rows = dataTable.datagrid("getCheckedEx");
		if(rows.length == 0){//如果没选择记录，弹出提示框
			$.alert("至少选择一条记录！");
		}else{
			var ids = [];
			checkedTotalNum = dataTable.datagrid("getCheckedEx").length;
			// 置空计数记录
			failedValid = 0;
			sendedCard = 0;
			sendFailedCard = 0;
			// 是否存在发卡数据 1存在正常待发卡数据
			var card_flag = 0;
            $.each(rows, function (i, row) {
            	// state： 判断用    0：通过 1：未通过2:已发卡
            	if(row.state == "1"){// 未通过验证 
            		failedValid = failedValid+1;
            	} else if (row.state == "2") {// 已发卡
            		sendedCard = sendedCard+1;
            	} else if (row.state == "3") {// 发卡失败
            		sendFailedCard = sendFailedCard+1;
            	} else {// 正常
            		var param = {};
                	param['account_id'] = row.account_id;
                	// 导入卡号
        			param['card_no'] = row.card_no; 
        			// 卡号类型
        			param['card_lx'] = row.card_lx;
        			// 获取主键index_idField
        			param['column_index'] = row.index_idField;
            		ids.push(param);
            		card_flag =1;
            	}
            	
            });
            if(card_flag == 1){// 存在符合发卡条件的数据
            	var param = {};
    			param['ids'] = ids;
    			// 卡片导入发附卡类型为:2
    			param['is_main_card'] = "2";
    			// 未通过验证 数
    			param['failedValid'] = failedValid;
    			// 已发卡数
    			param['sendedCard'] = sendedCard;
    			// 选中条目数
    			param['checkedTotalNum'] = checkedTotalNum;
    			// 发卡失败
    			param['sendFailedCard'] = sendFailedCard;
    			var myWin = $.createWin({
    				title:"发附卡",
    				width:300,
    				height:200,
    				queryParams:{
    					params:param,
    					callback:changeState,
    					callColor:changeColor
    				},
    				url:"js/account/impSendCardWin.js"
    			});
            }else if (card_flag == 0) {
            	$.alert("未找到符合发卡条件的数据,请重新选择！");
            }
		}
		
/*		function refresh(){
			if(importFlag){
				importFlag = 0;
				dataTable.datagrid("loadDataEx",{id:0,total:0,rows:[]});
			}else{
				dataTable.datagrid("reloadEx");
			}
		}*/
	}
	
	function changeState(account_id,column_index){
		var rows = dataTable.datagrid("getCheckedEx");
		$.each(rows,function(i,row){
			// 获取主键
			var keyIndex = row.index_idField;
			//row.account_id==account_id
			if(column_index ==keyIndex){
				row.state = "2";// state： 判断用    0：通过 1：未通过(改变状态发卡成功)2:已发卡3：发卡失败
				row.state_mc = "已发卡";
				//row.bz = "卡片已存在(工号:"+row.user_no+",姓名:"+row.user_lname+")";
				row.bz = "发卡成功！";
				var num = dataTable.datagrid('getRowPageNum',row);
				dataTable.datagrid('gotoPage',num);
				var index = dataTable.datagrid("getRowIndex",row);
				dataTable.datagrid('scrollTo',index);
				return false;
			}
		});
	}
	//改变正在发卡记录颜色
	function changeColor(account_id,i,column_index,returnMsg){
		color_id = column_index;
		color_i = i;
		color_index = column_index;
		var rows = dataTable.datagrid("getCheckedEx");
		$.each(rows,function(x,row){
			// row.account_id==account_id
			var keyIndex = row.index_idField;
			if(column_index == keyIndex){
				if (color_i == "0") {// 发卡失败 3
					row.state = "3";
					row.state_mc = "发卡失败";
					row.bz = returnMsg;
				}
				var num = dataTable.datagrid('getRowPageNum',row);
				dataTable.datagrid('gotoPage',num);
				var index = dataTable.datagrid("getRowIndex",row);
				dataTable.datagrid('scrollTo',index);
				return false;
			}
		});
	}
	
});
	