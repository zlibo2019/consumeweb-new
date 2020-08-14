//消费纠错
garen_define("js/account/drawCash_correction",function (jqObj,loadParams) {
	
	//webService
	var base = garen_require("js/base/ws_public");
	
	var checkCoreIp = base.checkCoreIp;//核心业务IP授权验证
	
	var depQuery = base.depQuery;//部门查询
	
	//var merchantQuery = base.merchantQuery;//商户查询
	var merchantQuery = "report/merchant/qryAll.do";//商户查询
	
	var placeQuery = base.placeQuery;//场所查询
	
	//var drawCashCorrectionUserQuery = "account/drawCashCorrectionUserQuery.do";//人员查询
	
	//var drawCashCorrectionQuery = "account/drawCashCorrectionQuery.do";//消费纠错查询
	
	var drawCashCorrectionQuery = "account/drawCashCorrectionQuery.do";//消费纠错查询
	
	var drawCashCorrect = "account/drawCashCorrect.do";//消费纠错
	
	var allReadCard = base.allReadCard;//读卡
	
	var allReadIdCard = base.allReadIdCard;//读身份证
	
	var jmjlink = garen_require("js/lib/jmjlink");//卡控件
	
	var scmurl = garen_require("js/lib/scmurl");//url地址
	
	var rData = "";//读卡时把id和卡号等存下来，操作时对比id，成功则提交卡号等
	
	var columns = [//列字段定义
     	[{
       		field : 'c',
       		title : 'c',
       		align : "center",
       		checkbox : true,
       		width : 100
      	},{
       		field : 'index',
       		title : '..',
       		align : "center",    
       		width : 50
       	},{
      		field : 'user_no',
      		title : '学/工号',
      		align : "center",
      		width : 100
      	},{
      		field : 'dep_name',
      		title : '部门',
      		align : "center",
      		width : 100
      	},{
      		field : 'user_lname',
      		title : '姓名',
      		align : "center",
      		width : 100
      	},{
      		field : 'user_id',
      		title : '身份证号',
      		align : "center",
      		width : 140
      	},{
      		field : 'acdep_name',
      		title : '场所',
      		align : "center",
      		width : 100
      	},{
      		field : 'merchant_name',
      		title : '商户',
      		align : "center",
      		width : 80
      	},{
      		field : 'trad_sj_str',
      		title : '交易时间',
      		align : "center",
      		width : 140
      	}, {
      		field : 'device_name',
      		title : '设备名称',
      		align : "center",
      		width : 100
      	}, {
      		field : 'trad_amt_str',
      		title : '交易金额',
      		align : "center",
      		width : 80
      	}, {
      		field : 'this_undo_money',
      		title : '本次退还金额',
      		align : "center",
      		width : 80
      	}, {
      		field : 'undo_amt_str',
      		title : '已退还金额',
      		align : "center",
      		width : 80
      	}, {
      		field : 'undo_amt_account',
      		title : '扣款账户',
      		align : "center",
      		width : 80
      	}] ];
/*	var northUI=[{
		eName:"div",
		height : 10,
		cssStyle : 'background:#ffffff;'
	},{
		eName : 'div',
		cssClass : 'drawCash_correction_line',
		elements : {
			eName : 'span',
			text : '人员信息'
		}
	},{
		eName:"formUI",
		method:"post",
		id:"charge_form",
		elements:{
			eName : 'div',
			cssClass : 'drawCash_correction_userinfo',
			elements : [{
				eName : 'div',
				cssClass : 'drawCash_correction_div',
				elements : [{
					eName : 'div',
					elements : [{
						eName : 'span',
						cssClass:"drawCash_correction_div_span",
						text : '开始日期'
					},{
						eName : 'datebox',
						name:"bill_begin",
						editable:false,
						width : 150,
						height : 25
					}]
				},{
					eName : 'div',
					elements : [{
						eName : 'span',
						cssClass:"drawCash_correction_div_span",
						text : '学/工号',
						},{
							eName : 'textbox',
							name : 'user_no',
							validType:'number',
							width : 150,
							height : 25,		
							value:''//默认值
						},{
							eName:"input",
							type:"hidden",
							value:"",
							id:"account_id"
						}]
				},{
					eName : 'div',
					elements : [{
						eName : 'span',
						cssClass:"drawCash_correction_div_span",
						text : '选择部门',
					},{
						eName : 'combotree',
						editable:false,
						multiple:true,
						name:"dep_serial",
						id : 'depTree',
						panelHeight:$.browser.msie9?200:'auto',
						panelMaxHeight:200,
						width : 150,
						height : 25,		
						value:'',//默认值
						onSelect:function(node){//选择相同则清空文本内容
							if(depTree.combo("getText")==node.text){
								depTree.combotree("clear");
							}
						}
					}]
				},{
					eName : 'div',
					elements : [{
						eName : 'span',
						cssClass:"drawCash_correction_div_span",
						text : '选择场所',
					},{
						eName : 'combotree',
						editable:false,
						multiple:true,
						name:"dep_serial",
						id : 'placeTree',
						panelHeight:$.browser.msie9?200:'auto',
						panelMaxHeight:200,
						width : 150,
						height : 25,		
						value:'',//默认值
						onSelect:function(node){//选择相同则清空文本内容
							if(placeTree.combo("getText")==node.text){
								placeTree.combotree("clear");
							}
						}
					}]
				}]
			},{
				eName : 'div',
				cssClass : 'drawCash_correction_userinfo',
				elements : [{
					eName : 'div',
					cssClass : 'drawCash_correction_div',
					elements : [{
						eName : 'div',
						elements : [{
							eName : 'span',
							cssClass:"drawCash_correction_div_span",
							text : '结束日期'
						},{
							eName : 'datebox',
							name:"bill_end",
							editable:false,
							width : 150,
							height : 25
						}]
					},{
						eName : 'div',
						elements : [{
							eName : 'span',
							cssClass:"drawCash_correction_div_span",
							elements : '姓&ensp;&ensp;&ensp;名',
						},{
							eName : 'textbox',
							name : 'user_lname',
							validType:"unnormal",
							width : 150,
							height : 25,		
							value:''//默认值
						}]
					},{
						eName : 'div',
						elements : [{
							eName : 'span',
							cssClass:"drawCash_correction_div_span",
							text : '身份证号',
						},{
							eName : 'textbox',
							name : 'user_id',
							validType:"idCard",
							width : 150,
							height : 25,		
							value:''//默认值
						}]
					},{
						eName : 'div',
						elements : [{
							eName : 'span',
							cssClass:"drawCash_correction_div_span",
							text : '选择商户',
							},{
								eName : 'combogrid',
								editable:false,
								name:"acdep_serial",
								id : 'merchantCombo',
								idField: 'merchant_account_id',    
						        textField: 'merchant_name',
								width : 150,
								height : 25,
								allFlag:true,
								value:'',//默认值
								columns:[[
								   {field:'merchant_account_id',checkbox:true},  
								   {field:'merchant_name',title:'全选',width:120}, 
								]]
							}]
					}]
				},{
					eName : 'div',
					cssClass : 'drawCash_correction_div',
					elements : {
						eName : 'div',
						elements : {
							eName : 'linkbutton',
							uId:"tm1",
							width:60,
							height:30,
							cssClass:'drawCash_correction_chaxun',
							text:"确认",
							onClick : function(){
								if(account_id.val()==""){
									$.alert("请选择人员信息！");
								}
								else if(rq.datebox("getValue")==""){
									$.alert("请选择交易日期！");
								}
								else{
									dataTable.datagrid("reload");
								}
							}
						}
					}
				}
//				,{
//					eName:"div",
//					cssClass : 'drawCash_correction_div',
//					elements:{
//						eName:"div",
//						cssClass:"dateRight",
//						elements:[{
//							eName:"input",
//							id:"bill_date_check",
//							type:"checkbox",
//							onClick:changeBillDate
//						},{
//							eName:"span",
//							cssClass:"drawCash_correction_div_span",
//							text : '账务日期'
//						},{
//							eName:"datebox",
//							name:"bill_date",
//							disabled:true,
//							editable:false,
//							width : 150,
//							height : 25
//						}]
//					}
//				}
				]
			},{
				eName : 'div',
				cssClass : 'drawCash_correction_buttonDiv',
				elements : {
					eName : 'div',
					elements : [{
						eName : 'linkbutton',
						id:"searchBtn",
						uId:"tm1",
						width:65,
						height:65,
						cssClass:'drawCash_correction_chaxun',
						text:"查询",
						onClick : function(){
							searchWin(0);
						}
					},{
						eName : 'linkbutton',
						uId:"tm1",
						width:65,
						height:65,
						cssClass:'drawCash_correction_chaxun',
						text:"读卡",
						onClick : readCard
					},{
						eName : 'linkbutton',
						uId:"tm1",
						disabled:true,
						width:60,
						height:30,
						cssClass:'drawCash_correction_chaxun',
						text:"读身份证",
						onClick : function(){
							alert(1);
						}
					}]
				}
			}]
		}
	},{ //中上部分
		eName : 'div',
		cssClass : 'drawCash_correction_line',
		elements : {
			eName : 'span',
			text : '消费流水'
		}
	},];*/
	
	var toolBar = [null, {
		eName:"div",
		height : 10,
		cssStyle : 'background:#ffffff;'
	},{
		eName:"formUI",
		method:"post",
		id:"queryForm",
		elements:{
			eName : 'div',
			cssClass : 'drawCash_correction_userinfo',
			elements : [{
				eName : 'div',
				cssClass : 'drawCash_correction_div',
				elements : [{
					eName : 'div',
					elements : [{
						eName : 'span',
						cssClass:"drawCash_correction_div_span",
						text : '开始日期'
					},{
						eName : 'datebox',
						name:"bill_begin",
						editable:false,
						width : 150,
						height : 25
					}]
				},{
					eName : 'div',
					elements : [{
						eName : 'span',
						cssClass:"drawCash_correction_div_span",
						text : '学/工号',
						},{
							eName : 'textbox',
							name : 'user_no',
							validType:'number',
							width : 150,
							height : 25,		
							value:''//默认值
						}]
				},{
					eName : 'div',
					elements : [{
						eName : 'span',
						cssClass:"drawCash_correction_div_span",
						elements : '部&emsp;&emsp;门',
					},{
						eName : 'combotree',
						editable:false,
						multiple:true,
						name:"dep_serial",
						id : 'depTree',
						panelHeight:$.browser.msie9?200:'auto',
						panelMaxHeight:200,
						width : 150,
						height : 25,		
						value:'',//默认值
						onSelect:function(node){//选择相同则清空文本内容
							if(depTree.combo("getText")==node.text){
								depTree.combotree("clear");
							}
						}
					}]
				},{
					eName : 'div',
					elements : [{
						eName : 'span',
						cssClass:"drawCash_correction_div_span",
						text : '选择场所',
					},{
						eName : 'combotree',
						editable:false,
						multiple:true,
						name:"acdep_serial",
						id : 'placeTree',
						panelHeight:$.browser.msie9?200:'auto',
						panelMaxHeight:200,
						width : 150,
						height : 25,		
						value:'',//默认值
						onSelect:function(node){//选择相同则清空文本内容
							if(placeTree.combo("getText")==node.text){
								placeTree.combotree("clear");
							}
						}
					}]
				}]
			},{
				eName : 'div',
				cssClass : 'drawCash_correction_div',
				elements : [{
					eName : 'div',
					elements : [{
						eName : 'span',
						cssClass:"drawCash_correction_div_span",
						text : '结束日期'
					},{
						eName : 'datebox',
						name:"bill_end",
						editable:false,
						width : 150,
						height : 25
					}]
				},{
					eName : 'div',
					elements : [{
						eName : 'span',
						cssClass:"drawCash_correction_div_span",
						elements : '姓&ensp;&ensp;&ensp;名',
					},{
						eName : 'textbox',
						name : 'user_lname',
						validType:"unnormal",
						width : 150,
						height : 25,		
						value:''//默认值
					}]
				},{
					eName : 'div',
					elements : [{
						eName : 'span',
						cssClass:"drawCash_correction_div_span",
						text : '身份证号',
					},{
						eName : 'textbox',
						name : 'user_id',
						//validType:"idCard",
						width : 150,
						height : 25,		
						value:''//默认值
					}]
				},{
					eName : 'div',
					elements : [{
						eName : 'span',
						cssClass:"drawCash_correction_div_span",
						text : '选择商户',
						},{
							eName : 'combogrid',
							editable:false,
							name:"merchant_account_id",
							id : 'merchantCombo',
							idField: 'merchant_account_id',    
					        textField: 'merchant_name',
							width : 150,
							height : 25,
							allFlag:true,
							value:'',//默认值
							columns:[[
							   {field:'merchant_account_id',checkbox:true},  
							   {field:'merchant_name',title:'全选'}, 
							]]
						}]
				}]
			},{
				eName : 'div',
				cssClass : 'drawCash_correction_buttonDiv',
				elements : [{
					eName : 'div',
					elements : [{
						eName : 'linkbutton',
						id:"searchBtn",
						uId:"tm1",
						width:65,
						height:30,
						cssClass:'drawCash_correction_chaxun',
						text:"查询",
						onClick : function(){
							searchWin(0);
						}
					},{
						eName : 'linkbutton',
						uId:"tm1",
						width:65,
						height:30,
						cssClass:'drawCash_correction_chaxun',
						text:"读卡",
						onClick : readCard
					}]
				},{
					eName : 'div',
					elements : [{
						eName : 'linkbutton',
						id:"searchBtn",
						uId:"tm1",
						width:65,
						height:30,
						cssClass:'drawCash_correction_chaxun',
						text:"清空",
						onClick : conditionClear
					},{
						eName : 'linkbutton',
						uId:"tm1",
						width:65,
						height:30,
						cssClass:'drawCash_correction_chaxun',
						text:"读身份证",
						onClick : readIdCard
					}]
				}]
			}]
		}
	}];
	
	
	var centerUI = {
		eName : 'datagrid',
		id:'dataTable',
		idField:"account_id",
		queryForm:"queryForm",
		//url : drawCashCorrectionQuery,
		toolbarEx:toolBar,
		columns : columns,		
		pagination: true,
		clientPager:false,
		//rownumbers:true,
		alertFlag : false,// 是否弹出默认对话框
		autoload : false,
		singleSelect:true,
		checkOnSelect:true,
		selectOnCheck:true,
		onLoadSuccessEx:function(retJson){
			if(retJson.id=="0"){
				// 改为手动清空文本框
				/*user_no.textbox("clear");
				depTree.combotree("clear");
				user_lname.textbox("clear");
				user_id.textbox("clear");
				placeTree.combotree("clear");
				merchantCombo.combogrid("clear");*/
				
			}else{
				$.alert(retJson.info);
			}
		},
		onCheckEx:function(index,row){
			// add by LYh 点击复选框时清空文本框内容
			payable_money.textbox("setValue","");
			moneyBox.textbox("setValue","");
		}
	};
	
	var southUI = {
			eName : 'div',
			cssClass:"drawCash_correction_south",
			elements : [{
				eName:"div",
				cssClass:'drawCash_payable_moneyInput',
				elements:[{
					eName:"span",
					cssClass:"drawCash_payable_span",
					text:"应扣款金额"
				},{
					eName:"textbox",
					height:25,
					width:100,
					id:"payable_money",
					validType:["money","moneyMax"],
					onChange:moneyInput1
				},{
					eName:"span",
					cssClass:"drawCash_payable_money",
					text:"元"
				}]
			},{
				eName:"div",
				cssClass:'drawCash_correction_moneyInput',
				elements:[{
					eName:"span",
					text:"本次退还金额"
				},{
					eName:"textbox",
					disabled:true,
					height:25,
					width:100,
					id:"moneyBox",
					validType:["money","moneyMax"]
					//onChange:moneyInput
				},{
					eName:"span",
					text:"元"
				}]
			},{
				eName : 'linkbutton',
				uId:"tm2",
				id:"drawCash_correction_button",
				text : "<span style='font-size:20px;'>消费纠错</span>",
				cssClass : 'drawCash_correction_linkbutton',
				width : 220,
				height : 60,
				onClick:correction
			},/*{
				eName : 'linkbutton',
				uId:"tm1",
				text : '打印',
				cssClass : 'drawCash_correction_button_print',
				width : 70,
				height : 38,
				onClick:function(){
					alert(1);
				}
			},{
				eName : 'linkbutton',
				uId:"tm1",
//				text : '取消',
				text:'返回主界面',
				cssClass : 'drawCash_correction_button_cancel',
				width : 70,
				height : 38,
				onClick:function(){
					try{
//						window.top.main_iframe.ChangUrl("M000",0,"");
						window.location = "http://" + loadParams.login_wtop + "/r_home.asp";
					}
					catch(e){
						
					}
				}
			}*/]
	};
	var mainUI = {
			eName : 'layoutExt',// 容器布局类，jeasyui组件
			cssStyle:'font-family: 微软雅黑, Arial;',
			fit : true,
			elements : [
			      /*      {
				region : 'north',
				height:100,
				border : false,
				collapsible:false,
				noheader : true,
				elements : northUI,
			},*/
			{
				region : 'center',
				elements : centerUI
			},{
				region : 'south',
				height : 100,
				elements : southUI
			}]
	};
	
	
	jqObj.loadUI(mainUI);
	var dataTable = jqObj.findJq("datagrid");
	var depTree = jqObj.findJq("depTree");
	var placeTree = jqObj.findJq("placeTree");
	var merchantCombo = jqObj.findJq("merchantCombo");
	var queryForm = jqObj.findJq("queryForm");
	var user_no = jqObj.findJq("user_no");
	var user_lname = jqObj.findJq("user_lname");
	var user_id = jqObj.findJq("user_id");
	//var bill_date = jqObj.findJq("bill_date");
	//var bill_date_check = jqObj.findJq("bill_date_check");
	//var rq = jqObj.findJq("rq");
	var bill_begin = jqObj.findJq("bill_begin");
	var bill_end = jqObj.findJq("bill_end");
	var moneyBox = jqObj.findJq("moneyBox");
	var payable_money = jqObj.findJq("payable_money");
	var drawCash_correction_button = jqObj.findJq("drawCash_correction_button");
	var searchBtn = jqObj.findJq("searchBtn");
	
	loadTree();//加载选择部门树
	loadPlace();//加载场所
	loadMerchant();//加载商户
	loadInit();//初始化
	
//	document.onkeydown=function(event){
//		var e = event || window.event || arguments.callee.caller.arguments[0];
//		if(e && e.keyCode==13){ // enter 键
//			searchWin();
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
	user_id.textbox("textbox").keydown(function(e){
		var key = e.keyCode;//兼容firefox
		if(key == 13){
			searchWin(0);
		}
	});
	
	function loadInit(){
//		var date = new Date();
//		var y = date.getFullYear();
//		var m = date.getMonth() + 1;
//		var d = date.getDate();
//		var day = new Date(y,m,0);
//		bill_begin.datebox("setValue",y + '-' + (m<10?('0'+m):m) + '-' + '01');
//		bill_end.datebox("setValue",y + '-' + (m<10?('0'+m):m) + '-' + day.getDate());
		
		$.postEx(checkCoreIp,{'op_name':'消费纠错'},function(retJson){
			if(retJson.result){
				
			}else{
				$.alert(retJson.info,function(){
					//window.parent.location.reload();
					window.top.location.href=scmurl;
				});
			}
		});
		
		var date = new Date();
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		var end_d = getMonthDays(y,m);
		bill_begin.datebox("setValue",y + '-' + (m<10?('0'+m):m) + '-' + '01');
		bill_end.datebox("setValue",y + '-' + (m<10?('0'+m):m) + '-' + end_d);
	}
	
	//获取本月天数
	function getMonthDays(year,month){
		var date1 = new Date(year,month,1);
		var date2 = new Date(date1.getTime() - 24 * 60 * 60 * 1000);
		return date2.getDate();
	}
	
	function loadTree(){
		$.postEx(depQuery,function(retJson){
			if(retJson.result && retJson.data){
				depTree.combotree('loadData',
						$.list2Tree(retJson.data,"dep_serial","dep_parent","dep_name"));
			}
		});
	}
	
	function loadPlace(){
		$.postEx(placeQuery,function(retJson){
			if(retJson.result && retJson.data){
				placeTree.combotree('loadData',
						$.list2Tree(retJson.data,"dep_serial","dep_parent","dep_name"));
			}
		});
	}
	
	function loadMerchant(){
		$.postEx(merchantQuery,function(retJson){
			if(retJson.result && retJson.data){
				var retData = [];
				$.each(retJson.data,function(i, data){
					var param = {};
					param['merchant_account_id'] = data.merchant_account_id;
					param['merchant_name'] = data.merchant_name;
					retData.push(param);
				});
				var merchantGrid = merchantCombo.combogrid("grid");
				merchantGrid.datagrid('loadDataEx',retData);
			}
		});
	}
	
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
//			depTree.combotree("setValue",retJson.data[0].user_dep);
//			user_id.textbox("setValue",retJson.data[0].user_id);
//			user_lname.textbox("setValue",retJson.data[0].user_lname);
			user_lname.textbox("clear");
			depTree.combotree("clear");
			user_id.textbox("clear");
			
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
	
	function searchWin(cx_type){
		if(cx_type == 0){
			rData = "";
		}
		dataTable.datagrid("loadEx",{url:drawCashCorrectionQuery,'cx_type':cx_type});
	}
	// 清空
	function conditionClear() {
		
        user_no.textbox("clear");
		depTree.combotree("clear");
		user_lname.textbox("clear");
		user_id.textbox("clear");
		placeTree.combotree("clear");
		merchantCombo.combogrid("clear");
	}
	//读身份证
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
				user_id.textbox("clear");
				
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
	//点击复选框事件
//	function changeBillDate(){
//		if(bill_date_check.prop("checked")){
//			bill_date.datebox("enable");
//		}else{
//			bill_date.datebox("disable");
//		}
//	}
	
	//搜索窗口
//	function searchWin(){
//		var params = charge_form.findJqUI().form2Json();
//		if(params.dep_serial=="" && params.user_id=="" 
//			&& params.user_lname=="" && params.user_no==""){
//			$.alert("请输入一个查询条件！");
//		}else{
//			var p = {};
//			var myform = jqObj.findJq("charge_form");
//			if(myform.form('form2Json',p)){//true则表单验证通过
//				searchBtn.linkbutton("disable");
//				$.postEx(drawCashCorrectionUserQuery,params,function(retJson){
//					if(retJson.result){
//						if(retJson.data.length==0){
//							$.alert("没有找到此人员！");
//							searchBtn.linkbutton("enable");
//						}
//						else if(retJson.data.length==1 && retJson.data[0].account_state_code==0){
//							user_no.textbox("setValue",retJson.data[0].user_no);
//							depTree.combotree("setValue",retJson.data[0].dep_serial);
//							user_lname.textbox("setValue",retJson.data[0].user_lname);
//							user_id.textbox("setValue",retJson.data[0].user_id);
//							account_id.val(retJson.data[0].account_id);
//							searchBtn.linkbutton("enable");
//						}
//						else{
//							var myWin = $.createWin({
//								title:"确认信息",
//								width:535,
//								height:320,
//								queryParams:{
//									params:retJson.data,
//									callback:success
//								},
//								url:"js/account/drawCash_correction_searchWin.js"
//							});
//							searchBtn.linkbutton("enable");
//						}
//					}else{
//						$.alert(retJson.info);
//						searchBtn.linkbutton("enable");
//					}
//				});
//			}
//		}
//	}
	
	//窗口关闭后回调函数
//	function success(row){
//		user_no.textbox("setValue",row.user_no);
//		depTree.combotree("setValue",row.dep_serial);
//		user_lname.textbox("setValue",row.user_lname);
//		user_id.textbox("setValue",row.user_id);
//		account_id.val(row.account_id);
//	}
	
	//输入金额
	function moneyInput1(newValue, oldValue){

		var money=/^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
		var row = dataTable.datagrid("getSelected");
		if(row == null && money.test(newValue) ){
			$.alert("请先选择一条记录！");
			payable_money.textbox("setValue","");
		} else if(money.test(newValue)){//金额验证
			if(newValue>21474836.47){
				
			}else{
				//交易金额    trad_amt_str
				var trad_amt_str = row.trad_amt_str;
				//已退还金额  undo_amt_str
				var undo_amt_str = row.undo_amt_str;
				
				var sub = accSub(trad_amt_str,newValue);
				var tempmoneyBox =  accSub(sub,undo_amt_str);
				moneyBox.textbox("setValue",tempmoneyBox);
				
				var secondChange = setTextValue(newValue);
				if(secondChange){
					return;
				}
		    	if(sub < 0) {
					$.alert("应扣款金额不能大于交易金额,请检查!",function(){
						payable_money.textbox("clear");
						return;
					});
				} else if(tempmoneyBox<=0) {
					$.alert('退还金额不能小于等于零,请检查!',function(){
		        		payable_money.textbox("clear");
						moneyBox.textbox("clear");
						return;
		        	});
					
				}
			}
		} else if (!money.test(newValue)) {
			moneyBox.textbox("setValue","");
			payable_money.textbox("setValue","");
		}
	}
	
	function setTextValue(newValue) {
		if(newValue.indexOf(".")==-1){
			//金额输入框
			payable_money.textbox("setValue",newValue+".00");
			return true;
		}
		else if(newValue.length - newValue.indexOf(".") - 1 == 1){
			payable_money.textbox("setValue",newValue+"0");
			return true;
		}
		else{
			payable_money.textbox("setValue",newValue);
			return false;
		}
	}
	//纠错
	function correction(){
		var money=/^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
		var row = dataTable.datagrid("getSelected");
		if(row == null){
			$.alert("请先选择一条记录！");
		}
		/*else if(moneyBox.textbox("getValue")==""){
			$.alert("请输入退还金额！");
		}*/
		else if(payable_money.textbox("getValue")==""){
			$.alert("请输入应扣款金额！");
		}
		else if(moneyBox.textbox("getValue")=="0.00"){
			$.alert("退还金额不能为0！");
		} else if (payable_money.textbox("getValue")>21474836.47 || payable_money.textbox("getValue")<0 || !money.test(payable_money.textbox("getValue"))){
			payable_money.textbox("textbox").focus();
		}
		else if(moneyBox.textbox("getValue")>21474836.47 || moneyBox.textbox("getValue")<0 || !money.test(moneyBox.textbox("getValue"))){
			moneyBox.textbox("textbox").focus();
		}
		else{
			drawCash_correction_button.linkbutton("disable");
			var params = {};
			params['id'] = row.id;
			params['account_id'] = row.account_id;
			params['trad_amt'] = moneyBox.textbox("getValue");
			params['bill_date'] = row.bill_date_str || "";
			params['undo_amt_before'] = row.undo_amt_str;
			if(row.account_id == rData.account_id){
				params['read_card_number'] = rData.card_number;
				params['read_media_id'] = rData.media_id;
			}
			$.postEx(drawCashCorrect,params,function(retJson){
				if(retJson.result){
					var myWin = $.createWin({
						title:"系统提示信息",
						width:300,
						height:200,
						queryParams:{
							params:row.account_id,
							callback:function(){
								drawCashCorrectionSuccess(row,retJson);
							}
						},
						url:"js/account/drawCash_correction_syncWin.js"
					});
					
				}else{
					drawCash_correction_button.linkbutton("enable");
					$.alert(retJson.info);
				}
			});
		}
	}
	
	function drawCashCorrectionSuccess(row,retJson){
		var index = dataTable.datagrid("getRowIndex",row);
		var param = {};
		param['this_undo_money'] = moneyBox.textbox("getValue");
		param['undo_amt_str'] = retJson.data[0].undo_amt_str;
		dataTable.datagrid("updateRowEx",{
			index:index,
			row:param
		});
		moneyBox.textbox("setValue","");
		// 应扣款金额清空 add by LYh
		payable_money.textbox("setValue","");
		
		drawCash_correction_button.linkbutton("enable");
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
//							user_id.textbox("setValue",retJson.data[0].user_id);
//							//ideList.combobox("setValue",retJson.data[0].ident_id);
//							param['account_id'] = retJson.data[0].account_id;
//							rData = param;
//							successBeep();
//							searchWin();
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
	// 浮点数求和
	function accAdd(num1,num2) {
	    var r1,r2,m;  
	    try{
	        r1 = num1.toString().split('.')[1].length;  
	    }catch(e){
	        r1 = 0;  
	    }  
	    try{
	        r2=num2.toString().split(".")[1].length;  
	    }catch(e){
	        r2=0;  
	    }  
	    m=Math.pow(10,Math.max(r1,r2));  
	     
	    return Math.round(num1*m+num2*m)/m;  
	}
	// 两个浮点数相减
	function accSub(num1,num2) {
	    var r1,r2,m;  
	    try{
	    	r1 = num1.toString().split('.')[1].length;  
	    }catch(e){
	    	r1 = 0;  
	    }  
	    try{
	    	r2=num2.toString().split(".")[1].length;  
	    }catch(e){
	    	r2=0;  
	       
	    }  
	    m=Math.pow(10,Math.max(r1,r2));  
	    n=(r1>=r2)?r1:r2;  
	    return (Math.round(num1*m-num2*m)/m).toFixed(n);  
	}
	
	
	//文本长度验证
	user_no.next().children().eq(0).attr("maxlength",18);
	user_lname.next().children().eq(0).attr("maxlength",10);
	user_id.next().children().eq(0).attr("maxlength",18);
	moneyBox.next().children().eq(0).attr("maxlength",8);
	payable_money.next().children().eq(0).attr("maxlength",8);
	
	//扩展验证
	$.extend($.fn.validatebox.defaults.rules, {    
		money: {// 金额验证
            validator: function (value) {
                //return /^[+]?[1-9]+\d*$/i.test(value);
                return /^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/i.test(value);
            },
            message: '请输入正确金额'
        },
        moneyMax :{// 最大值验证
       	 validator: function (value) {
                return (value<=21474836.47);
            },
            message: '请输入正确金额'
        },
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
        },
        idCard:{//身份证号验证
        	validator: function(value){
        		return /(\d|X|x)$/i.test(value);
        	},
        	message: '请输入正确的身份证号'
        }
	});  
});
	