//卡片管理
garen_define("js/account/cardManage",function (jqObj,loadParams) {

	var utils = garen_require("utils");
	//webService
	var base = garen_require("js/base/ws_public");
	
	var scmurl = garen_require("js/lib/scmurl");//url地址
	
	var checkCoreIp = base.checkCoreIp;//核心业务IP授权验证
	
	var depQuery = base.depQuery;//部门查询
	
	var ideQuery = base.ideQuery;//身份查询
	
	var allReadCard = base.allReadCard;//读卡
	
	var allReadIdCard = base.allReadIdCard;//读身份证
	
	var jmjlink = garen_require("js/lib/jmjlink");//卡控件
	
	var cardFilterQuery = "account/cardFilterQuery.do";//筛选查询
	
	var cardListQuery = "account/cardListQuery.do";//持卡列表
	
	var accountInfo = "account/accountInfo.do";//账户信息查询
	
	var cardLoss = "account/cardLoss.do";//挂失
	
	var unLossCard = "account/unLossCard.do";//卡片解挂
	
	var jt = "";//读卡后卡信息
	
//	//工具栏
//	var toolBar = [null,{
//		eName : 'div',
//		height:10,
//		cssStyle : 'background:#ffffff;'
//	},{
//		eName : 'div',
//		cssClass:"cardManage_toolBar_second",
//		elements : [{
//			eName : 'div',
//			elements:{
//				eName:"formUI",
//				id:"queryForm",
//				//url:cardFilterQuery,
//				alertFlag:false,
//				//progressBar:"查询中...",
//				onSave:function(retJson){
//					account_condition.val("");
//					if(retJson.result){
//						dataTable.datagrid("loadDataEx",retJson);
//					}else{
//						$.alert(retJson.info);
//					}
//				},
//				elements : [{
//					eName : 'div',
//					cssClass:"toolBar_div_first",
//					elements : [{
//						eName : 'span',
//						elements : '姓&emsp;&emsp;名',
//						},{
//							eName : 'textbox',
//							name : 'user_lname',
//							validType:"unnormal",
//							width : 150,
//							height : 25,		
//							value:''//默认值
//						},{
//							eName : 'span',
//							elements : '学/工号&ensp;',
//						},{
//							eName : 'textbox',
//							name : 'user_no',
//							validType:"number",
//							width : 150,
//							height : 25,		
//							value:''//默认值
//						},{
//							eName : 'input',
//							type:"hidden",
//							name : 'account_condition',
//							width : 150,
//							height : 25,		
//							value:''//默认值
//						}]
//				},{
//					eName : 'div',
//					cssClass:"toolBar_div_second",
//					elements : [{
//						eName : 'span',
//						text : '选择部门',
//					},{
//						eName : 'combotree',
//						name:"dep_serial",
//						panelHeight:$.browser.msie9?200:'auto',
//						panelMaxHeight:200,
//						id : 'depTree',
//						width : 150,
//						height : 25,
//						value:'',//默认值
//						onSelect:function(node){//选择相同则清空文本内容
//							if(depTree.combo("getText")==node.text){
//								depTree.combotree("clear");
//							}
//						}
//					},{
//						eName : 'span',
//						elements : '身份类型',
//					},{
//						eName : 'combobox',
//						name:"identity_id",
//						panelHeight:$.browser.msie9?200:'auto',
//						panelMaxHeight:200,
//						id : 'ideList',
//						width : 150,
//						height : 25,
//						valueField: 'ident_id',    
//				        textField: 'ident_name',
//						editable:false
//					}]
//				}]
//			}
//		},{
//			eName : 'div',
//			cssClass:"toolBar_div_third",
//			elements : [{
//				eName:"div",
//				elements:[{
//					eName :"linkbutton",
//					uId:"tm1",
//					cssClass:"cardManage_linkbutton3",
//					width:70,
//					height:33,
//					text:"查询",
//					onClick : function(){
//						searchWin(0);
//					}
//				},{
//					eName:"linkbutton",
//					uId:"tm1",
//					cssClass:"cardManage_linkbutton3",
//					id:"proCard",
//					width:70,
//					height:33,
//					text:"发卡",
//					onClick:provideCard
//				},{
//					eName:"linkbutton",
//					uId:"tm1",
//					cssClass:"cardManage_linkbutton3",
//					id:"losCard",
//					width:70,
//					height:33,
//					text:"挂失",
//					onClick:lossCard
//				},{
//					eName:"linkbutton",
//					uId:"tm2",
//					cssClass:"cardManage_linkbutton3",
//					id:"upEnCard",
//					width:100,
//					height:33,
//					text:"更新有效期",
//					onClick:updateEndDate
//				}]
//			},{
//				eName:"div",
//				elements:[{
//					eName : 'linkbutton',
//					uId:"tm1",
//					cssClass:"cardManage_linkbutton3",
//					width:70,
//					height:33,
//					text:"读卡",
//					onClick : readCard
//				},{
//					eName:"linkbutton",
//					uId:"tm1",
//					cssClass:"cardManage_linkbutton3",
//					id:"reisCard",
//					width:70,
//					height:33,
//					text:"补卡",
//					onClick:reissueCard
//				},{
//					eName:"linkbutton",
//					uId:"tm1",
//					cssClass:"cardManage_linkbutton3",
//					id:"reLosCard",
//					width:70,
//					height:33,
//					text:"解挂",
//					onClick:removeLoss
//				},{
//					eName:"linkbutton",
//					uId:"tm2",
//					cssClass:"cardManage_linkbutton3",
//					id:"upPwdCard",
//					width:100,
//					height:33,
//					text:"修复密码",
//					onClick:updatePassWord
//				}]
//			}]
//		},
////		{
////			eName:"div",
////			cssClass:"toolBar_div_query",
////			elements : {
////				eName : "linkbutton",
////				uId:"tm2",
////				cssClass:"cardManage_linkbutton3",
////				id:"clearbCard",
////				width:70,
////				height:70,
////				text:"清除卡片黑名单标志",
////				onClick:clearBlack
////			}
////		},{
////			eName:"div",
////			cssClass:"toolBar_div_query",
////			elements : {
////				eName:"linkbutton",
////				uId:"tm1",
////				cssClass:"cardManage_linkbutton3",
////				id:"clearsCard",
////				width:70,
////				height:70,
////				text:"清除发补卡中间状态",
////				onClick:clearState
////			}
////		},{
////			eName:"div",
////			cssClass:"toolBar_div_query",
////			elements : {
////				eName:"linkbutton",
////				uId:"tm2",
////				cssClass:"cardManage_linkbutton3",
////				id:"syCard",
////				width:70,
////				height:70,
////				text:"卡片同步",
////				onClick:syncCard
////			}
////		},
//		{
//			eName:"div",
//			elements : {
//				eName:"linkbutton",
//				uId:"tm1",
//				cssClass:"cardManage_linkbutton3",
//				width:70,
//				height:70,
//				text:"卡片删除",
//				onClick:absentCard
//			}
//		}]
//	}];
	
	//工具栏
	var northUI = {
		eName : 'div',
		cssClass:"cardManage_toolBar_second",
		elements : [{
			eName : 'div',
			elements:{
				eName:"formUI",
				id:"queryForm",
				//url:cardFilterQuery,
				alertFlag:false,
				//progressBar:"查询中...",
				onSave:function(retJson){
//					account_condition.val("");
//					if(retJson.result){
//						dataTable.datagrid("loadDataEx",retJson);
//					}else{
//						$.alert(retJson.info);
//					}
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
							validType:"number",
							width : 150,
							height : 25,		
							value:''//默认值
						},{
							eName : 'input',
							type:"hidden",
							name : 'account_condition',
							width : 150,
							height : 25,		
							value:''//默认值
						},{
							eName : 'input',
							type:"hidden",
							name : 'account_id',
							width : 150,
							height : 25,		
							value:''//默认值
						}
						]
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
			eName:"div",
			cssStyle:"margin-right: 10px;",
			elements:[{
				eName:"div",
				cssStyle:"height:33%;",
				elements:[{
					eName:"input",
					cssStyle:"vertical-align: middle;margin-top: -2px;",
					type:"radio",
					name:"card_state",
					id:"card_state1",
					value:0
				},{
					eName:"span",
					elements:"全部"
				}]
			},{
				eName:"div",
				cssStyle:"height:33%;",
				elements:[{
					eName:"input",
					cssStyle:"vertical-align: middle;margin-top: -2px;",
					type:"radio",
					name:"card_state",
					id:"card_state2",
					value:2
				},{
					eName:"span",
					elements:"已发卡"
				}]
			},{
				eName:"div",
				cssStyle:"height:33%;",
				elements:[{
					eName:"input",
					cssStyle:"vertical-align: middle;margin-top: -2px;",
					type:"radio",
					name:"card_state",
					id:"card_state3",
					value:1
				},{
					eName:"span",
					elements:"未发卡"
				}]
			}]
		},{
			eName : 'div',
			cssClass:"toolBar_div_third",
			elements : [{
				eName:"div",
				elements:[{
					eName :"linkbutton",
					uId:"tm1",
					cssClass:"cardManage_linkbutton3",
					width:70,
					height:33,
					text:"查询",
					onClick : function(){
						searchWin(0);
					}
				},{
					eName : 'linkbutton',
					uId:"tm1",
					cssClass:"cardManage_linkbutton3",
					width:70,
					height:33,
					text:"读卡",
					onClick : readCard
				},{
					eName:"linkbutton",
					uId:"tm1",
					cssClass:"cardManage_linkbutton3",
					id:"proCard",
					width:70,
					height:33,
					text:"发卡",
					onClick:provideCard
				},{
					eName:"linkbutton",
					uId:"tm1",
					cssClass:"cardManage_linkbutton3",
					id:"losCard",
					width:70,
					height:33,
					text:"挂失",
					onClick:lossCard
				},{
					eName:"linkbutton",
					uId:"tm2",
					cssClass:"cardManage_linkbutton3",
					id:"upEnCard",
					width:100,
					height:33,
					text:"更新有效期",
					onClick:updateEndDate
				},{
					eName:"linkbutton",
					uId:"tm1",
					cssClass:"cardManage_linkbutton3",
					width:70,
					height:33,
					text:"退卡",
					onClick:absentCard
				}]
			},{
				eName:"div",
				elements:[{
					eName : 'linkbutton',
					uId:"tm1",
					cssClass:"cardManage_linkbutton3",
					width:70,
					height:33,
					text:"清空",
					onClick : function(){
						user_lname.textbox("clear");
						user_no.textbox("clear");
						depTree.combotree("clear");
						ideList.combogrid("clear");
					}
				},{
					eName : 'linkbutton',
					uId:"tm1",
					cssClass:"cardManage_linkbutton3",
					width:70,
					height:33,
					text:"读身份证",
					onClick : readIdCard
				},{
					eName:"linkbutton",
					uId:"tm1",
					cssClass:"cardManage_linkbutton3",
					id:"reisCard",
					width:70,
					height:33,
					text:"补卡",
					onClick:reissueCard
				},{
					eName:"linkbutton",
					uId:"tm1",
					cssClass:"cardManage_linkbutton3",
					id:"reLosCard",
					width:70,
					height:33,
					text:"解挂",
					onClick:removeLoss
				},{
					eName:"linkbutton",
					uId:"tm2",
					cssClass:"cardManage_linkbutton3",
					id:"upPwdCard",
					width:100,
					height:33,
					text:"修复密码",
					onClick:updatePassWord
				},{
					eName:"linkbutton",
					uId:"tm1",
					cssClass:"cardManage_linkbutton3",
					width:70,
					height:33,
					text:"充值",
					onClick:charge
				}]
			}]
		},
//		{
//			eName:"div",
//			cssClass:"toolBar_div_query",
//			elements : {
//				eName : "linkbutton",
//				uId:"tm2",
//				cssClass:"cardManage_linkbutton3",
//				id:"clearbCard",
//				width:70,
//				height:70,
//				text:"清除卡片黑名单标志",
//				onClick:clearBlack
//			}
//		},{
//			eName:"div",
//			cssClass:"toolBar_div_query",
//			elements : {
//				eName:"linkbutton",
//				uId:"tm1",
//				cssClass:"cardManage_linkbutton3",
//				id:"clearsCard",
//				width:70,
//				height:70,
//				text:"清除发补卡中间状态",
//				onClick:clearState
//			}
//		},{
//			eName:"div",
//			cssClass:"toolBar_div_query",
//			elements : {
//				eName:"linkbutton",
//				uId:"tm2",
//				cssClass:"cardManage_linkbutton3",
//				id:"syCard",
//				width:70,
//				height:70,
//				text:"卡片同步",
//				onClick:syncCard
//			}
//		},
		/*{
			eName:"div",
			elements : {
				eName:"linkbutton",
				uId:"tm1",
				cssClass:"cardManage_linkbutton3",
				width:70,
				height:70,
				text:"卡片删除",
				onClick:absentCard
			}
		}*/
		]
	}
	
	var columns = [//列字段定义
      	[{
       		field : 'id',
       		title : 'ID',
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
       		width : 110
       	}, {
       		field : 'user_lname',
       		title : '姓名',
       		align : "center",
       		width : 110
       	}, {
       		field : 'user_depname',
       		title : '部门',
       		align : "center",
       		width : 100
       	}, {
       		field : 'user_duty',
       		title : '身份类型',
       		align : "center",
       		width : 100
       	}
       	/*, {
       		field : 'account_state_name',
       		title : '账户状态',
       		align : "center",
       		width : 160
       	}, {
       		field : 'account_end_date_str',
       		title : '有效期',
       		align : "center",
       		width : 120
       	}, {
       		field : 'finger_enable',
       		title : '指纹消费',
       		align : "center",
       		width : 120
       	}, {
       		field : 'cash_amt_str',
       		title : '现金余额',
       		align : "center",
       		width : 120
       	}, {
       		field : 'deposit_amt_str',
       		title : '押金余额',
       		align : "center",
       		width : 120
       	}*/
       	] ];
	
	var centerUI = {
		eName : 'datagrid',
		id:'dataTable',
		idField : 'account_id',
		//queryForm:"queryForm",
		//toolbarEx : toolBar,// 查询条件工具栏
		columns : columns,
		pagination: true,
		clientPager:true,
		alertFlag : false,// 是否弹出默认对话框
		autoload : false,
		singleSelect:true,
		checkOnSelect:true,
		selectOnCheck:true,
		onLoadSuccessEx:function(retJson){
			/*user_lname.textbox("clear");
			user_no.textbox("clear");
			depTree.combotree("clear");
			ideList.combogrid("clear");*/
			
			proCard.linkbutton("enable");
			losCard.linkbutton("enable");
			upEnCard.linkbutton("enable");
			reisCard.linkbutton("enable");
			reLosCard.linkbutton("enable");
			upPwdCard.linkbutton("enable");
//			clearbCard.linkbutton("enable");
//			clearsCard.linkbutton("enable");
//			syCard.linkbutton("enable");
			if(retJson.id== 0){
				if(retJson.rows.length>0){
					$(this).datagrid("selectRow","0");
				}
			}else{
				$.alert(retJson.info);
			}
		},
		onSelect:function(index,row){
			//显示账户信息
			eastNorthTable.datagrid("loadEx",{url:accountInfo,account_id:row.account_id});
			//显示持卡列表
			eastCenterTable.datagrid("loadEx",{url:cardListQuery,account_id:row.account_id});
			//根据是否在有效期判断各种功能是否可用
			var date = new Date();
			var arr = row.account_end_date_str.split("-");
			var starttime = new Date(arr[0], arr[1]-1, arr[2], '23', '59', '59');
			var starttimes = starttime.getTime();
			//$.print(row.account_end_date-date.getTime());
			if(row.account_state_code==0 && starttimes>=date.getTime()){//正常且在有效期
				proCard.linkbutton("enable");
				losCard.linkbutton("enable");
				upEnCard.linkbutton("enable");
				reisCard.linkbutton("enable");
				reLosCard.linkbutton("enable");
				upPwdCard.linkbutton("enable");
				//clearbCard.linkbutton("enable");
				//clearsCard.linkbutton("enable");
				//syCard.linkbutton("enable");
			}else{
				proCard.linkbutton("disable");
				losCard.linkbutton("disable");
				upEnCard.linkbutton("disable");
				reisCard.linkbutton("disable");
				reLosCard.linkbutton("disable");
				upPwdCard.linkbutton("disable");
				//clearbCard.linkbutton("disable");
				//clearsCard.linkbutton("disable");
				//syCard.linkbutton("disable");
			}
		}
	};
	
	var east_center_columns = [//列字段定义
	[ {
 		field : 'id',
 		title : 'id',
 		align : "center",
 		checkbox:true,
 		width : 80
 	}, {
 		field : 'index',
 		title : '..',
 		align : "center",
 		width : 50
 	}, {
 		field : 'cardhold_serial',
 		title : '卡序号',
 		align : "center",
 		width : 80
 	}, {
 		field : 'card_serial',
 		title : '逻辑卡号',
 		align : "center",
 		width : 80
 	}, {
 		field : 'card_number',
 		title : '卡号',
 		align : "center",
 		width : 80
 	}, {
 		field : 'media_id_name',
 		title : '卡片类型',
 		align : "center",
 		width : 80
 	}, {
 		field : 'sj_str',
 		title : '发卡日期',
 		align : "center",
 		width : 90
 	}, {
 		field : 'card_state_name',
 		title : '卡状态',
 		align : "center",
 		width : 80
 	}, {
 		field : 'is_main_card',
 		title : '主/附卡',
 		align : "center",
 		width : 80
 	}, {
 		field : 'Is_card_replace_name',
 		title : '备注',
 		align : "center",
 		width : 92
 	}
 	] ];
	
	var east_centerUI = {
		eName:"div",
		height:'100%',
		elements:[{
			eName:"div",
			height:'100%',
			elements:{
				eName : 'datagrid',
				id:"eastCenterTable",
				idField : 'account_id',
				//url:cardListQuery,
				columns : east_center_columns,
				fit:true,
				clientPager:true,
				pagination: true,
				showFooter:false,
				alertFlag : false,// 是否弹出默认对话框
				autoload : false,
				singleSelect:true,
				checkOnSelect:true,
				selectOnCheck:true,
				onLoadSuccessEx:function(retJson){
					if(retJson.id=="0"){
						if(jt){
							var index = 0;
							$.each(retJson.data,function(i, row){
								if(jt.retData.CardNo == row.card_number && jt.retData.CardType == row.media_id){
									index = eastCenterTable.datagrid('getRowIndex',row);
									//return false;
								}
							});
							eastCenterTable.datagrid("selectRow",index);
							jt = "";
						}
					}else{
						$.alert(retJson.info);
					}
				}
			}
		}]
	}
	
	var east_north_columns = [//列字段定义
	[ {
   		field : 'account_state',
   		title : '账户状态',
   		align : "center",
   		width : 160
   	}, {
   		field : 'finger_state',
   		title : '指纹消费',
   		align : "center",
   		width : 120
   	}, {
   		field : 'cash_amt_str',
   		title : '现金余额',
   		align : "center",
   		width : 120
   	}, {
   		field : 'sub_amt_str',
   		title : '补贴余额',
   		align : "center",
   		width : 120
   	}, {
   		field : 'deposit_amt_str',
   		title : '押金余额',
   		align : "center",
   		width : 120
   	}] ];
	
	var east_northUI = {
		eName:"div",
		height:'100%',
		elements:[{
			eName : 'div',
			cssClass : 'cardManage_line',
			elements : {
				eName : 'span',
				text : '账户信息'
			}
		},{
			eName:"div",
			height:113,
			elements:{
				eName : 'datagrid',
				id:"eastNorthTable",
				idField : 'account_id',
				//url:cardListQuery,
				columns : east_north_columns,
				clientPager:false,
				pagination: false,
				showFooter:false,
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
			}
		},{
			eName : 'div',
			cssClass : 'cardManage_line',
			elements : {
				eName : 'span',
				text : '卡片详细信息'
			}
		}]	
	}
	
//	var southUI = {
//			eName : 'div',
//			cssClass:"cardManage_south_div",
//			elements : [{
//				eName : 'linkbutton',
//				uId:"tm1",
//				cssClass : 'batchCharge_linkbutton',
//				text : '打印',
//				cssClass:"cardManage_linkbutton1",
//				width : 70,
//				height : 38,
//				onClick:function(){
//					if(dataTable.datagrid('getRows').length==0){
//						$.alert("数据为空");
//					}else{
//						utils.printGrid("卡片管理",dataTable);
//					}
//				}
//			},{
//				eName : 'linkbutton',
//				uId:"tm1",
////				text : '取消',
//				text:'返回主界面',
//				cssClass:"cardManage_linkbutton2",
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
	
	var eastUI = {
			eName : 'layoutExt',// 容器布局类，jeasyui组件
			cssStyle:'font-family: 微软雅黑, Arial;',
			fit : true,
			elements : [{
				region : 'center',
				elements : east_centerUI
			},{
				region : 'north',
				height : 185,
				elements : east_northUI
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
				region : 'north',
				height : 100,
				elements : northUI
			},{
				region : 'east',
				width:760,
				elements : eastUI
			}]
	};
	
	jqObj.loadUI(mainUI);
	
	var dataTable = jqObj.findJq("dataTable");
	var eastNorthTable = jqObj.findJq("eastNorthTable");
	var eastCenterTable = jqObj.findJq("eastCenterTable");
	var queryForm = jqObj.findJq("queryForm");
	var depTree = jqObj.findJq("depTree");
	var ideList = jqObj.findJq("ideList");
	var user_lname = jqObj.findJq("user_lname");
	var user_no = jqObj.findJq("user_no");
	var account_condition = jqObj.findJq("account_condition");
	var account_id = jqObj.findJq("account_id");
	
	var proCard = jqObj.findJq("proCard");
	var losCard = jqObj.findJq("losCard");
	var upEnCard = jqObj.findJq("upEnCard");
	var reisCard = jqObj.findJq("reisCard");
	var reLosCard = jqObj.findJq("reLosCard");
	var upPwdCard = jqObj.findJq("upPwdCard");
//	var clearbCard = jqObj.findJq("clearbCard");
//	var clearsCard = jqObj.findJq("clearsCard");
//	var syCard = jqObj.findJq("syCard");
	var card_state1 = jqObj.findJq("card_state1");
	var card_state2 = jqObj.findJq("card_state2");
	var card_state3 = jqObj.findJq("card_state3");
	
	
	loadTree();//加载选择部门树
	
	loadIdeList();//加载身份列表
	
	loadInit();
	
	function loadInit(){
		$.postEx(checkCoreIp,{'op_name':'卡片/充值管理'},function(retJson){
			if(retJson.result){
				
			}else{
				$.alert(retJson.info,function(){
					//window.parent.location.reload();
					window.top.location.href=scmurl;
				});
			}
		});
		
		card_state1.prop("checked",true);
	}
	
//	document.onkeydown=function(event){
//		var e = event || window.event || arguments.callee.caller.arguments[0];
//		if(e && e.keyCode==13){ // enter 键
//			searchWin();
//	    }
//	};
	
	//分页提示信息修改
	var pager = dataTable.datagrid("getPager"); 
    pager.pagination({ 
    	//showPageList:false,
    	//beforePageText:'',//页数文本框前显示的汉字 
        //afterPageText:'', 
        displayMsg:''
    });
	
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
			
				card_state1.prop("checked",true);
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
			url:"js/account/cardManage_readCardWin.js"
		});
	}
	
	function readCardBack(retJson,i,jt2){
		if(i){
			jt = jt2;
			//user_lname.textbox("setValue",retJson.data[0].user_lname);
			user_no.textbox("setValue",retJson.data[0].user_no);
			//depTree.combotree("setValue",retJson.data[0].dep_serial);
			//ideList.combogrid("setValue",retJson.data[0].ident_id);
			user_lname.textbox("clear");
			depTree.combotree("clear");
			ideList.combogrid("clear");
			
			user_no.textbox("setText","");
			card_state1.prop("checked",true);
			account_condition.val("55");//读卡时查询所有卡类型
			account_id.val(retJson.data[0].account_id);//读卡时设置account_id精确查询
//			param['account_id'] = retJson.data[0].account_id;
//			rData = param;
			successBeep();
			searchWin(1);
			user_no.textbox("setValue","");
		}else{
			$.alert(retJson.info);
			errorBeep();
		}
	}
	
	//读卡
	/*function readCard(){
		var params = {
			"commandSet":[{
				"funName":"ReqCard",
				"param":""
			}]
		};

		jmjlink.send(function(jtype,jtext,jpre_str){
			if(jtype==2){
				$.alert(jpre_str);
			}else{
				var jt = $.parseJSON(jtext);
				if(jt.ErrCode=="0"){
					var param = {};
					param['card_number'] = jt.retData.CardNo;
					param['media_id'] = jt.retData.CardType;
					param['account_condition'] = "1227831";
					$.postEx(allReadCard,param,function(retJson){
						if(retJson.result && retJson.data.length>0){
							//$.print(retJson);
							user_lname.textbox("setValue",retJson.data[0].user_lname);
							user_no.textbox("setValue",retJson.data[0].user_no);
							depTree.combotree("setValue",retJson.data[0].dep_serial);
							ideList.combobox("setValue",retJson.data[0].ident_id);
							successBeep();
							account_condition.val("55");
							searchWin(1);
						}else{
							$.alert(retJson.info);
							errorBeep();
						}
					});
				}else if(jt.ErrCode=="-102"){
					$.alert("未寻到卡，请将卡放到读卡器后再次读卡！");
					errorBeep();
				}else{
					$.alert("寻卡错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
					errorBeep();
				}
			}
		},'寻卡',$.toJSON(params));
	}*/
	
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
		//queryForm.findJqUI().submit();
		var p = {};
		if(queryForm.form('form2Json',p)){//true则表单验证通过
			var params = queryForm.findJqUI().form2Json();
			params['cx_type'] = cx_type;
			params['url'] = cardFilterQuery;
			if(card_state1.prop("checked")){
				params['card_state'] = 0;
			}else if(card_state2.prop("checked")){
				params['card_state'] = 2;
			}else if(card_state3.prop("checked")){
				params['card_state'] = 1;
			}
			
			dataTable.datagrid("loadEx",params);
			account_condition.val("");//查询完成后清空，只查询正常账户
		}
	}
	
	//发卡
	function provideCard(){
		var row = dataTable.datagrid("getSelected");
		if(row==null){
			$.alert("请选择一名人员！");
		}else{
			var myWin = $.createWin({
				title:"持卡记录",
				width:747,
				height:320,
				queryParams:{
					params:row.account_id,
					callback:function(){
						eastNorthTable.datagrid("loadEx",{url:accountInfo,account_id:row.account_id});
						eastCenterTable.datagrid("loadEx",{url:cardListQuery,account_id:row.account_id});
					}
				},
				url:"js/account/cardManage_provideCard.js"
			});
		}
	}
	
	//挂失
	function lossCard(){
		var row = eastCenterTable.datagrid("getSelected");
		if(row==null){
			$.alert("请选择一张卡片！");
		}
//		else if(row.card_state!=0){
//			$.alert("非正常卡不能挂失！");
//		}
		else{
			param = {};
			param['card_serial'] = row.card_serial;
			param['account_id'] = row.account_id;
			$.postEx(cardLoss,param,function(retJson){
				if(retJson.result){
					eastNorthTable.datagrid("loadEx",{url:accountInfo,account_id:row.account_id});
					eastCenterTable.datagrid("loadEx",{url:cardListQuery,account_id:row.account_id});
				}else{
					$.alert(retJson.info);
				}
			});
		}
	}
	
	//补卡
	function reissueCard(){
//		var row = dataTable.datagrid("getSelected");
//		if(row==null){
//			$.alert("请选择一张卡片！");
//		}else{
//			var myWin = $.createWin({
//				title:"持卡记录",
//				width:747,
//				height:320,
//				queryParams:{
//					params:row.account_id,
//					//callback:''
//				},
//				url:"js/account/cardManage_reissueCard.js"
//			});
//		}
		var row = eastCenterTable.datagrid("getSelected");
		if(row==null){
			$.alert("请选择一张卡片！");
		}
//		else if(row.card_state!=1){
//			$.alert("非挂失卡不能补卡！");
//		}
		else{
			var params = {};
			params['account_id'] = row.account_id;
			params['row'] = row;
			var myWin = $.createWin({
				title:"补卡",
				width:300,
				height:200,
				queryParams:{
					params:params,
					callback:function(){
						eastNorthTable.datagrid("loadEx",{url:accountInfo,account_id:row.account_id});
						eastCenterTable.datagrid("loadEx",{url:cardListQuery,account_id:row.account_id});
					}
				},
				url:"js/account/cardManage_reissueWin.js"
			});
		}
	}
	
	//解挂
	function removeLoss(){
		var row = eastCenterTable.datagrid("getSelected");
		if(row==null){
			$.alert("请选择一张卡片！");
		}
//		else if(row.card_state!=1){
//			$.alert("非挂失卡不能解挂！");
//		}
		else{
			var params = {};
			params['card_serial'] = row.card_serial;
			params['account_id'] = row.account_id;
			var myWin = $.createWin({
				title:"解挂",
				width:300,
				height:200,
				queryParams:{
					params:params,
					row:row,
					callback:function(){
						eastNorthTable.datagrid("loadEx",{url:accountInfo,account_id:row.account_id});
						eastCenterTable.datagrid("loadEx",{url:cardListQuery,account_id:row.account_id});
					}
				},
				url:"js/account/cardManage_removeLossWin.js"
			});
//			param = {};
//			param['card_serial'] = row.card_serial;
//			param['account_id'] = row.account_id;
//			$.postEx(unLossCard,param,function(retJson){
//				if(retJson.result){
//					//读卡以便解挂后直接清除黑名单
//					var params = {
//						"commandSet":[{
//							"funName":"ReqCard", 
//							"param":""
//						}]
//					};
//					jmjlink.send(function(jtype,jtext,jpre_str){
//						var jt = $.parseJSON(jtext);
//						if(jt.ErrCode=="0"){
//							if(row.card_number == jt.retData.CardNo && row.media_id == jt.retData.CardType){
//								clear();//清除黑名单标志
//							}
//						}
//					},'寻卡',$.toJSON(params));
//					
//					eastNorthTable.datagrid("loadEx",{url:accountInfo,account_id:row.account_id});
//					eastCenterTable.datagrid("loadEx",{url:cardListQuery,account_id:row.account_id});
//				}else{
//					$.alert(retJson.info);
//				}
//			});
		}
	}
	
	//更新有效期
	function updateEndDate(){
		var row = dataTable.datagrid("getSelected");
		var row2 = eastCenterTable.datagrid("getSelected");
		if(row==null){
			$.alert("请选择一名人员！");
		}else if(row2 == null){
			$.alert("请选择一张卡片！");
		}
		else if(row2.card_state==2){
			$.alert("只有正常主卡可以更新有效期！");
		}else{
			var myWin = $.createWin({
				title:"更新有效期",
				width:300,
				height:200,
				queryParams:{
					params:row.account_id,
					eastrow:row2
					//callback:''
				},
				url:"js/account/cardManage_updateEndDateWin.js"
			});
		}
	}
	
	//重置密码
	function updatePassWord(){
		var row = dataTable.datagrid("getSelected");
		var row2 = eastCenterTable.datagrid("getSelected");
		if(row==null){
			$.alert("请选择一名人员！");
		}else if(row2 == null){
			$.alert("请选择一张卡片！");
		}else if(row2.card_state==2){
			$.alert("只有正常主卡可以修复密码！");
		}else{
			var myWin = $.createWin({
				title:"修复密码",
				width:300,
				height:200,
				queryParams:{
					params:row.account_id,
					eastrow:row2
					//callback:''
				},
				url:"js/account/cardManage_updatePassWordWin.js"
			});
		}
	}
	
//	function clearBlack(){
//		var row = dataTable.datagrid("getSelected");
//		if(row==null){
//			$.alert("请选择一条记录！");
//		}else{
//			var myWin = $.createWin({
//				title:"清除卡片黑名单标志",
//				width:300,
//				height:200,
//				queryParams:{
//					params:row.account_id,
//					//callback:loadInit
//				},
//				url:"js/account/cardManage_blackWin.js"
//			});
//		}
//	}
//	
//	function clearState(){
//		var row = dataTable.datagrid("getSelected");
//		if(row==null){
//			$.alert("请选择一条记录！");
//		}else{
//			var myWin = $.createWin({
//				title:"持卡记录",
//				width:747,
//				height:320,
//				queryParams:{
//					params:row.account_id,
//					//callback:loadInit
//				},
//				url:"js/account/cardManage_stateCard.js"
//			});
//		}
//	}
//	
//	function syncCard(){
//		var row = dataTable.datagrid("getSelected");
//		if(row==null){
//			$.alert("请选择一条记录！");
//		}else{
//			var myWin = $.createWin({
//				title:"卡片同步",
//				width:300,
//				height:200,
//				queryParams:{
//					params:row.account_id,
//					//callback:loadInit
//				},
//				url:"js/account/cardManage_syncWin.js"
//			});
//		}
//	}
	
	//退卡
	function absentCard(){
		var row = eastCenterTable.datagrid("getSelected");
		if(row==null){
			$.alert("请选择一张卡片！");
		}
		else if(row.card_state==0 || row.Is_card_replace==3 || row.card_state==1 && row.Is_card_replace!=2){
				var params = {};
				params['account_id'] = row.account_id;
				params['row'] = row;
				var myWin = $.createWin({
					title:"退卡",
					width:300,
					height:200,
					queryParams:{
						params:params,
						callback:function(){
							eastNorthTable.datagrid("loadEx",{url:accountInfo,account_id:row.account_id});
							eastCenterTable.datagrid("loadEx",{url:cardListQuery,account_id:row.account_id});
						}
					},
					url:"js/account/cardManage_absentWin.js"
				});
		}
		else {
			$.alert("只有正常卡和非补卡中的挂失卡可以退卡！");
		}
	}
	
	//充值
	function charge(){
		var row = dataTable.datagrid("getSelected");
		var row2 = eastNorthTable.datagrid("getRows");
		if(row==null){
			$.alert("请选择一名人员！");
		}else{
			var myWin = $.createWin({
				title:"充值",
				width:380,
				height:470,
				queryParams:{
					params:row,
					money:row2[0].cash_amt_str,
					callback:function(){
						eastNorthTable.datagrid("loadEx",{url:accountInfo,account_id:row.account_id});
						eastCenterTable.datagrid("loadEx",{url:cardListQuery,account_id:row.account_id});
					}
				},
				url:"js/account/cardManage_charge.js"
			});
		}
	}
	
	function clear(){
		var params = {
			"commandSet":[{
				"funName":"IonSetCardStat", 
				"param": "0"
			}]	
		};
		jmjlink.send(function(jtype,jtext,jpre_str){
			
		},'清除卡片黑名单',$.toJSON(params));
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
	