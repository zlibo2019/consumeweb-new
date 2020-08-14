//充值
garen_define("js/account/charge",function (jqObj,loadParams) {
	
	//webService
	var base = garen_require("js/base/ws_public");
	
	var checkCoreIp = base.checkCoreIp;//核心业务IP授权验证
	
	var jmjlink = garen_require("js/lib/jmjlink");//卡控件
	
	var scmurl = garen_require("js/lib/scmurl");//url地址
	
	var allReadIdCard = base.allReadIdCard;//读身份证
	
	var depQuery = base.depQuery;//部门查询
	
	var tradPrint = base.tradPrint;//打印凭条信息
	
	var chargeDetailQuery = "account/chargeDetailQuery.do";//充值明细查询
	
	var chargeQuery = "account/chargeQuery.do";//充值筛选查询
	
	var rData = "";//读卡时把id和卡号等存下来，操作时对比id，成功则提交卡号等
	
	var account_data = "";//查询的账户数据
	
	var user_no_data = "";//读卡和读身份证时保存下来，以便充值后用这个继续查询
	
	var charge_suc = 0;//0:未充值，查询一条数据时默认选中，1：充值完成，查询一条数据时默认不选中
	
	var toolbarWest = [null,{
		eName : 'div',
		cssClass : 'charge_userinfo',
		elements : [{
			eName : 'div',
			cssClass : 'charge_div',
			elements : [{
				eName : 'div',
				elements : [{
					eName : 'span',
					cssClass:"charge_div_span",
					text : '学/工号'
					},{
						eName : 'textbox',
						name : 'user_no',
						validType:'number',
						width : 80,
						height : 25,		
						value:''//默认值
					}]
			},{
				eName : 'div',
				elements : [{
					eName : 'span',
					cssClass:"charge_div_span",
					elements : '部&emsp;&emsp;门'
				},{
					eName : 'combotree',
					editable:false,
					multiple:true,
					name:"dep_serial",
					id : 'depTree',
					//tipPosition:'top',
					panelWidth:200,
					panelHeight:$.browser.msie9?200:'auto',
					panelMaxHeight:200,
					width : 100,
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
				elements : {
					eName : 'linkbutton',
					id:"searchBtn",
					uId:"tm1",
					width:47,
					height:30,
					cssClass:'charge_chaxun',
					text:"查询",
					onClick : function(){
						user_no_data = "";
						charge_suc = 0;
						searchWin(0);
						//dataTableWest.datagrid("loadEx",{url:chargeQuery,'cx_type':'0'});
					}
				}
			},{
				eName : 'div',
				elements : {
					eName : 'linkbutton',
					id:"clearBtn",
					uId:"tm1",
					width:47,
					height:30,
					cssClass:'charge_chaxun',
					text:"清空",
					onClick : conditionClear
				}
			},{
				eName : 'div',
				elements : [{
					eName : 'span',
					cssClass:"charge_div_span",
					elements : '姓&emsp;&ensp;名'
				},{
					eName : 'textbox',
					name : 'user_lname',
					validType:"unnormal",
					width : 80,
					height : 25,		
					value:''//默认值
				}]
			},{
				eName : 'div',
				elements : [{
					eName : 'span',
					cssClass:"charge_div_span",
					text : '身份证号'
				},{
					eName : 'textbox',
					name : 'user_id',
					//validType:"idCard",
					width : 100,
					height : 25,		
					value:''//默认值
				}]
			},{
				eName : 'div',
				elements : {
					eName : 'linkbutton',
					uId:"tm1",
					//disabled:true,
					width:98,
					height:30,
					cssClass:'charge_chaxun',
					text:"读身份证",
					onClick : readIdCard
						
						/*function(){
						var params = {
								"commandSet":[{
									"funName":"IreadIdenCard", 
									"param":"1"//1基本信息，2只读照片，4只读指纹，8只读新地址，15全部
								}]
							};
						jmjlink.send(function(jtype,jtext,jpre_str){
							if(jtype==2){
								$.alert(jpre_str);
							}else{
								var jt = $.parseJSON(jtext);
								if(jt.ErrCode=="0"){
									$.alert(jt.retData.Address);
								}else if(jt.ErrCode=="-102"){
									$.alert("请将卡放到读卡器上！");
								}else{
									$.alert("寻卡错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
								}
							}
						},'读身份证',$.toJSON(params));
						
					}*/
				}
			}]
		}]
	}];
	
	var columnsWest = [//列字段定义
   	 	[ {
   	  		field : 'id',
   	  		title : '..',
   	  		align : "center",
   	  		width : 50,
   	  		checkbox:true
   	  	}, {
   	  		field : 'user_no',
   	  		title : '学/工号',
   	  		align : "center",
   	  		width : 85
   	  	}, {
   	  		field : 'dep_name',
   	  		title : '部门',
   	  		align : "center",
   	  		width : 85
   	  	}, {
   	  		field : 'user_lname',
   	  		title : '姓名',
   	  		align : "center",
   	  		width : 85
   	  	}, {
   	  		field : 'user_id',
   	  		title : '身份证号',
   	  		align : "center",
   	  		width : 148
   	  	}] 
   	];
	
	var westUI = [{ //中上部分
		eName : 'div',
		cssClass : 'charge_line',
		elements : {
			eName : 'span',
			text : '人员信息'
		}
	},{
		eName:"div",
		height:'95%',
		width:'100%',
		elements:{
			eName : 'datagrid',
			id:"dataTableWest",
			//url:chargeQuery,
			idField : 'account_id',
			toolbarEx : toolbarWest,// 查询条件工具栏
			columns : columnsWest,
			alertFlag : false,// 是否弹出默认对话框
			autoload : false,
			singleSelect:true,
			checkOnSelect:true,
			selectOnCheck:true,
			pagination: true,
			clientPager:true,
			onBeforeLoadEx:function(params){
				//params['dep_serial'] = depTree.combotree("getValue")?depTree.combotree("getValue"):"";
//				if(!params.dep_serial && !params.user_id
//					&& !params.user_lname && !params.user_no){
//					$.alert("请输入一个查询条件！");
//					return false;
//				}
			},
			onLoadSuccessEx:function(retJson){
				/*user_no.textbox("clear");
				depTree.combotree("clear");
				user_lname.textbox("clear");
				user_id.textbox("clear");*/
				charge_beforemoeny.html("");
				charge_aftermoney.html("");
				// add by LYh
				//moneyBox.textbox("setValue","");
				if(retJson.id == undefined) return;
				if(retJson.id=="0"){
					if(retJson.rows.length==1 && charge_suc==0){
						dataTableWest.datagrid("checkRow",0);
					}
				}else{
					$.alert(retJson.info);
				}
			},
			onCheckEx:function(index,row){
				charge_beforemoeny.html(row.cash_amt_str);
				if(charge_beforemoeny.html()!="" && moneyBox.textbox("getValue")!=""){
					var cbm = Math.round(Number(charge_beforemoeny.html())*100); 
					var nv = Math.round(Number(moneyBox.textbox("getValue"))*100); 
					var v = cbm + nv;
					var val = v/100 + "";
					
					if(val.indexOf(".") == -1){//输入时不含小数点（0.00==0）
						charge_aftermoney.html(val+".00");
					}
					else if(val.length - val.indexOf(".") - 1 == 1){//小数点后面有一位数（0.10==0.1）
						charge_aftermoney.html(val+"0");
					}
					else{//小数点后面有两位数
						charge_aftermoney.html(val);
					}
				}
			}
		}
	}]
	
	var centerUI = [{ //中上部分
		eName : 'div',
		cssClass : 'charge_line',
		elements : {
			eName : 'span',
			text : '现金账户信息'
		}
	},{
		eName : 'div',
		cssClass:"charge_center_bottom_all",
		elements : [{
			//中下部分
			eName : 'div',
			cssClass : 'charge_center_bottom',
			elements : [{ //中下左
				eName : 'div',
				cssStyle:"width:340px;margin:0 auto;height:100%;",
				elements:[{
					eName : 'div',
					cssClass : 'charge_center_bottom_left_div1',
					elements : [{
						eName : 'span',
						cssClass : 'charge_beforetext',
						text : '充值前余额:',
						cssStyle : ''
						},{
							eName : 'span',
							cssClass : 'charge_beforemoeny',
							text: ''
						},
						{
							eName : 'span',
							text: '元'
						}
						]
				},{
					eName : 'div',
					cssClass : 'charge_after',
					elements : [{
						eName : 'span',
						text : '充值后余额:',
						cssClass : 'charge_aftertext'
						},{
							eName : 'span',
							cssClass : 'charge_aftermoney',
							text: ''
						},
						{
							eName : 'span',
							text: '元'
						}]
				
				},{
					eName : 'div',
					cssClass : 'charge_inputmoney',
					elements : [{
						eName : 'span',
						text : '输入充值金额'
					},{
						eName : 'textbox',
						validType:['money','moneyMax'],
						id:"moneyBox",
						name : '',
						width : 137,
						height : 25,		
						value:'',//默认值
						onChange:moneyInput
					}]
				},{
					eName : 'div',
					cssClass : 'charge_input_button',
					elements : {
						eName : 'div',
						elements : [{
							eName : 'linkbutton',
							uId:"tm1",
							width:50,
							height:28,
							cssClass:'charge_chaxun',
							text:"50",
							onClick : function(){
								if(isNaN(moneyBox.textbox("getValue"))){
									moneyBox.textbox("textbox").focus();
								}else if(moneyBox.textbox("getValue")>21474836.47){
									moneyBox.textbox("textbox").focus();
								}
								else{
									/*var cbm = Math.round(Number(moneyBox.textbox("getValue"))*100); 
									var nv = Math.round(Number(50)*100); 
									var v = cbm + nv;
									var money = v/100 + "";*/
									var money = 50 + "";
									moneyBox.textbox("setValue",money);
								}
							}
						},{
							eName : 'linkbutton',
							uId:"tm1",
							width:50,
							height:28,
							cssClass:'charge_chaxun',
							text:"100",
							onClick : function(){
								if(isNaN(moneyBox.textbox("getValue"))){
									moneyBox.textbox("textbox").focus();
								}
								else if(moneyBox.textbox("getValue")>21474836.47){
									moneyBox.textbox("textbox").focus();
								}
								else{
									/*var cbm = Math.round(Number(moneyBox.textbox("getValue"))*100); 
									var nv = Math.round(Number(100)*100); 
									var v = cbm + nv;
									var money = v/100 + "";*/
									var money = 100 + "";
									moneyBox.textbox("setValue",money);
								}
							}
						},{
							eName : 'linkbutton',
							uId:"tm1",
							width:50,
							height:28,
							cssClass:'charge_chaxun',
							text:"200",
							onClick : function(){
								if(isNaN(moneyBox.textbox("getValue"))){
									moneyBox.textbox("textbox").focus();
								}
								else if(moneyBox.textbox("getValue")>21474836.47){
									moneyBox.textbox("textbox").focus();
								}
								else{
									/*var cbm = Math.round(Number(moneyBox.textbox("getValue"))*100); 
									var nv = Math.round(Number(200)*100); 
									var v = cbm + nv;
									var money = v/100 + "";*/
									var money = 200 + "";
									moneyBox.textbox("setValue",money);
								}
							}
						},{
							eName : 'linkbutton',
							uId:"tm1",
							width:50,
							height:28,
							cssClass:'charge_chaxun',
							text:"500",
							onClick : function(){
								if(isNaN(moneyBox.textbox("getValue"))){
									moneyBox.textbox("textbox").focus();
								}
								else if(moneyBox.textbox("getValue")>21474836.47){
									moneyBox.textbox("textbox").focus();
								}
								else{
									/*var cbm = Math.round(Number(moneyBox.textbox("getValue"))*100); 
									var nv = Math.round(Number(500)*100); 
									var v = cbm + nv;
									var money = v/100 + "";*/
									var money = 500 + "";
									moneyBox.textbox("setValue",money);
								}
							}
						}]
					}
				},{
					eName : 'div',
					cssClass : 'charge_other',
					elements : {
						eName : 'div',
						elements : [
//							            {
//								eName:'div',
//								elements:[
//									{
//										eName : 'input',
//										name : '',
//										cssClass:"charge_checkbox",
//										type : 'checkbox',
//									},{
//										eName : 'span',
//										text : '自动读卡',
//									}
//								]
//							},
						{
							eName:'div',
							elements:[{
									eName : 'input',
									name : 'charge_print',
									cssClass:"charge_checkbox",
									type : 'checkbox',
									onClick:setCookie
								},{
									eName : 'span',
									text : '充值后打印'
								}]
						}]
					}
				}]
			}]
		},{
			eName : 'div',
			cssClass : 'charge_bottom',
			elements : [{
			    eName : 'div',
			    cssClass : 'charge_bottom_div',
				elements:[{
					 eName : 'div',
					 elements:[{
						 eName : 'span',
						 cssClass : 'charge_bottom_span',
						 text : '最近充值结果',
						 cssStyle : ''}]
				},{
					eName : 'div',
					 elements:[{
							eName : 'span',
							elements : '&emsp;&emsp;&emsp;学 / 工号:',
							cssClass : 'charge_bottom_aftertext'
							},{
								eName : 'span',
								id:'bottom_user_no',
								text: ''
							}]
				},{
					eName : 'div',
					 elements:[{
							eName : 'span',
							elements : '&emsp;&emsp;&emsp;姓&emsp;&emsp;名:',
							cssClass : 'charge_bottom_aftertext'
							},{
								eName : 'span',
								id:'bottom_user_lname',
								text: ''
							}]
				},{
					eName : 'div',
					 elements:[{
							eName : 'span',
							elements : '&emsp;&emsp;&emsp;部&emsp;&emsp;门:',
							cssClass : 'charge_bottom_aftertext'
							},{
								eName : 'span',
								id:'bottom_dep_name',
								text: ''
							}]
				},{
					eName : 'div',
					 elements:[{
							eName : 'span',
							elements : '&emsp;本次充值金额:',
							cssClass : 'charge_bottom_aftertext'
							},{
								eName : 'span',
								id:'bottom_charge_amount',
								text: ''
							}]
				},{
					eName : 'div',
					 elements:[{
							eName : 'span',
							elements : '&emsp;&emsp;&emsp;状&emsp;&emsp;态:',
							cssClass : 'charge_bottom_aftertext'
							},{
								eName : 'span',
								id:'bottom_state',
								text: ''
							}]
				},{
					eName : 'div',
					 elements:[{
							eName : 'span',
							elements : '充值前现金余额:',
							cssClass : 'charge_bottom_aftertext'
							},{
								eName : 'span',
								id:'bottom_before_amount',
								text: ''
							}]
				},{
					eName : 'div',
					 elements:[{
							eName : 'span',
							elements : '充值后现金余额:',
							cssClass : 'charge_bottom_aftertext'
							},{
								eName : 'span',
								id:'bottom_after_amount',
								text: ''
							}]
				}]
			}]
		}]
	}];
	// add by LYh
	var columnsEast = [//列字段定义
   	 	[ {
   	  		field : 'index',
   	  		title : '序号',
   	  		align : "center",
   	  		width : 50
   	  	}, {
   	  		field : 'user_lname',
   	  		title : '持卡人',
   	  		align : "center",
   	  		width : 80
   	  	}, {
   	  		field : 'event_name',
   	  		title : '操作',
   	  		align : "center",
   	  		width : 80
   	  	}, {
   	  		field : 'income_str',
   	  		title : '收入',
   	  		align : "center",
   	  		width : 80,
   	  		styler:function(value,row,index){
   	   			if(row.footerFlag)
   	   				return {style:'color:red'}
   	   		}
   	  	}, {
   	  		field : 'pay_str',
   	  		title : '支出',
   	  		align : "center",
   	  		width : 80,
   	  		styler:function(value,row,index){
   	   			if(row.footerFlag)
   	   				return {style:'color:red'}
   	   		}
   	  	}, {
   	  		field : 'sj_str',
   	  		title : '操作时间',
   	  		align : "center",
   	  		width : 140
   	  	}] 
   	];
	
	var eastUI = [{ //中上部分
		eName : 'div',
		cssClass : 'charge_line',
		elements : {
			eName : 'span',
			text : '操作员收支明细'
		}
	},{ 
		eName : 'div',
		//cssClass : 'charge_center_bottom_right',
		width:'100%',
		height:'95%',
		elements : {
			eName : 'datagrid',
			idField : 'id',
			id:"dataTableEast",
			//url : chargeDetailQuery,
			//toolbarEx : toolBar,// 查询条件工具栏
			columns : columnsEast,
			//autoload : true,
			pagination: true,
			clientPager:true,
			alertFlag : false,// 是否弹出默认对话框
			singleSelect:true,
			checkOnSelect:false,
			selectOnCheck:false,
			showFooter: true,
			onLoadSuccessEx:function(retJson){
				if(retJson.id == undefined) return;
				if(retJson.id==0){
					if(retJson.rows.length>0){
						$(this).datagrid("selectRow","0");
					}
					$(this).datagrid('mergeCells', {
						index: 0,
						field: 'index',
						colspan: 3,
						type: 'footer'
					});
					$(this).datagrid('mergeCells', {
						index: 1,
						field: 'index',
						colspan: 3,
						type: 'footer'
					});
					$(this).datagrid('mergeCells', {
						index: 1,
						field: 'income_str',
						colspan: 2,
						type: 'footer'
					});
				}else{
					$.alert(retJson.info);
				}
			}
		}
	}]
	
	var southUI = [{
		eName:"div",
		height:0,
		id:"print_item_div"
	},{
		eName : 'div',
		cssClass:"charge_south",
		elements : [{
			eName : 'linkbutton',
			uId:"tm1",
			text : "<span style='font-size:20px;'>读卡</span>",
			cssClass : 'charge_linkbutton',
			width : 220,
			height : 60,
			onClick : readCard
		},{
			eName : 'linkbutton',
			uId:"tm2",
			id:"charge_button",
			text : "<span style='font-size:20px;'>充值</span>",
			cssClass : 'charge_linkbutton',
			width : 220,
			height : 60,
			onClick:charge
		}]
	}];
	var mainUI = {
			eName : 'layoutExt',// 容器布局类，jeasyui组件
			cssStyle:'font-family: 微软雅黑, Arial;',
			fit : true,
			elements : [
			{
				region : 'west',
				width:0.35,
				cssStyle:"min-width:390px;",
				elements : westUI
			},{
				region : 'center',
				cssStyle:"max-width:27%;",
				elements : centerUI
			},{
				region : 'east',
				width:0.38,
				elements : eastUI
			},{
				region : 'south',
				height : 100,
				elements : southUI
			}]
	};
	
	
	jqObj.loadUI(mainUI);
	//var dataTable = jqObj.findJq("datagrid");
	var depTree = jqObj.findJq("depTree");
	var charge_form = jqObj.findJqUI("charge_form");
	var charge_beforemoeny = jqObj.findJq("charge_beforemoeny");
	var charge_aftermoney = jqObj.findJq("charge_aftermoney");
	var moneyBox = jqObj.findJq("moneyBox");
	var user_no = jqObj.findJq("user_no");
	var user_lname = jqObj.findJq("user_lname");
	var user_id = jqObj.findJq("user_id");
	var charge_button = jqObj.findJq("charge_button");
	var account_id = jqObj.findJq("account_id");
	var searchBtn = jqObj.findJq("searchBtn");
	var charge_print = jqObj.findJq("charge_print");
	var print_item_div = jqObj.findJq("print_item_div");
	var dataTableWest = jqObj.findJq("dataTableWest");
	var dataTableEast = jqObj.findJq("dataTableEast");
	
	var bottom_user_no = jqObj.findJq("bottom_user_no");
	var bottom_user_lname = jqObj.findJq("bottom_user_lname");
	var bottom_dep_name = jqObj.findJq("bottom_dep_name");
	var bottom_charge_amount = jqObj.findJq("bottom_charge_amount");
	var bottom_state = jqObj.findJq("bottom_state");
	var bottom_before_amount = jqObj.findJq("bottom_before_amount");
	var bottom_after_amount = jqObj.findJq("bottom_after_amount");
	
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
			//dataTableWest.datagrid("loadEx",{url:chargeQuery,'cx_type':'0'});
		}
	});
	user_lname.textbox("textbox").keydown(function(e){
		var key = e.keyCode;//兼容firefox
		if(key == 13){
			searchWin(0);
			//dataTableWest.datagrid("loadEx",{url:chargeQuery,'cx_type':'0'});
		}
	});
	user_id.textbox("textbox").keydown(function(e){
		var key = e.keyCode;//兼容firefox
		if(key == 13){
			searchWin(0);
			//dataTableWest.datagrid("loadEx",{url:chargeQuery,'cx_type':'0'});
		}
	});
	
	//分页提示信息修改
	var pager = dataTableWest.datagrid("getPager"); 
    pager.pagination({ 
    	//showPageList:false,
    	//beforePageText:'',//页数文本框前显示的汉字 
        //afterPageText:'', 
        displayMsg:''
    });
    dataTableWest.datagrid("resize");
    
    var pager2 = dataTableEast.datagrid("getPager"); 
    pager2.pagination({ 
    	//showPageList:false,
    	//beforePageText:'',//页数文本框前显示的汉字 
        //afterPageText:'', 
        displayMsg:''
    });
	
	loadInit();
	loadTree();//加载选择部门树
	function loadTree(){
		$.postEx(depQuery,function(retJson){
			if(retJson.result && retJson.data){
				depTree.combotree('loadData',
						$.list2Tree(retJson.data,"dep_serial","dep_parent","dep_name"));
			}
		});
	}
	
	function loadInit(){
		
		$.postEx(checkCoreIp,{'op_name':'充值'},function(retJson){
			if(retJson.result){
				
			}else{
				$.alert(retJson.info,function(){
					//window.parent.location.reload();
					window.top.location.href=scmurl;
				});
			}
		});
		
		dataTableEast.datagrid("loadEx",{url:chargeDetailQuery});
		
		var charge_print_check = $.cookie("charge_print_check");
		if(charge_print_check == 1){
			charge_print.prop("checked",true);
			$.cookie('charge_print_check', charge_print_check, { expires: 7 });
			printItem(0);//检测是否安装控件
		}
		else if(charge_print_check == 2){
			charge_print.prop("checked",false);
			$.cookie('charge_print_check', charge_print_check, { expires: 7 });
		}
	}
	
	function searchWin(cx_type){
		dataTableWest.datagrid("loadEx",{url:chargeQuery,'cx_type':cx_type});
	}
	
	//搜索窗口
//	function searchWin(cx_type){
//		var params = charge_form.form2Json();
//		params['cx_type'] = cx_type;
//		if(params.dep_serial=="" && params.user_id=="" 
//			&& params.user_lname=="" && params.user_no==""){
//			$.alert("请输入一个查询条件！");
//		}else{
			//searchBtn.linkbutton("disable");
		//dataTableWest.datagrid("loadEx",{url:chargeQuery,'cx_type':cx_type});
//			$.postEx(chargeQuery,params,function(retJson){
//				if(retJson.result){
//					if(retJson.data.length==0){
//						$.alert("没有找到此人员！");
//						searchBtn.linkbutton("enable");
//					}
//					else if(retJson.data.length==1 && retJson.data[0].account_state_code==0){
//						account_data = retJson.data[0];
//						user_no.textbox("setValue",retJson.data[0].user_no);
//						depTree.combotree("setValue",retJson.data[0].dep_serial);
//						user_lname.textbox("setValue",retJson.data[0].user_lname);
//						user_id.textbox("setValue",retJson.data[0].user_id);
//						charge_beforemoeny.html(retJson.data[0].cash_amt_str);
//						charge_aftermoney.html("");//若先输入金额则需要清空
//						moneyBox.textbox("setValue","");//若先输入金额则需要清空
//						account_id.val(retJson.data[0].account_id);
//						searchBtn.linkbutton("enable");
//					}
//					else{
//						var myWin = $.createWin({
//							title:"确认信息",
//							width:535,
//							height:320,
//							queryParams:{
//								params:retJson.data,
//								callback:success
//							},
//							url:"js/account/charge_searchWin.js"
//						});
//						searchBtn.linkbutton("enable");
//					}
//				}else{
//					//$.progress('close');
//					searchBtn.linkbutton("enable");
//					$.alert(retJson.info);
//				}
//			});
//		}
//	}
	
//	function success(row){
//		account_data = row;
//		user_no.textbox("setValue",row.user_no);
//		depTree.combotree("setValue",row.dep_serial);
//		user_lname.textbox("setValue",row.user_lname);
//		user_id.textbox("setValue",row.user_id);
//		charge_beforemoeny.html(row.cash_amt_str);
//		charge_aftermoney.html("");//若先输入金额则需要清空
//		moneyBox.textbox("setValue","");//若先输入金额则需要清空
//		account_id.val(row.account_id);
//	}
	
	//输入金额
	function moneyInput(newValue, oldValue){
		var money=/^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
		if(money.test(newValue)){//金额验证
			if(newValue>21474836.47){
				//$.alert("单次充值金额不能超过21474836.47元");
				charge_aftermoney.html("");//清空充值后余额
			}else{
				//金额输入框
				if(newValue.indexOf(".")==-1){
					moneyBox.textbox("setValue",newValue+".00");
				}
				else if(newValue.length - newValue.indexOf(".") - 1 == 1){
					moneyBox.textbox("setValue",newValue+"0");
				}
				else{
					moneyBox.textbox("setValue",newValue);
				}
				
				//充值后余额
				if(charge_beforemoeny.html()!=""){
					var cbm = Math.round(Number(charge_beforemoeny.html())*100); 
					var nv = Math.round(Number(newValue)*100); 
					var v = cbm + nv;
					var val = v/100 + "";
					
					if(val.indexOf(".") == -1){//输入时不含小数点（0.00==0）
						charge_aftermoney.html(val+".00");
					}
					else if(val.length - val.indexOf(".") - 1 == 1){//小数点后面有一位数（0.10==0.1）
						charge_aftermoney.html(val+"0");
					}
					else{//小数点后面有两位数
						charge_aftermoney.html(val);
					}
				}
			}
		}
		else{
			charge_aftermoney.html("");
			//$.alert("请输入正确的金额");
		}
	}
	// add by LYh
	function charge(){
		var row = dataTableWest.datagrid("getSelected");
		
		var money=/^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
//		if(user_no.textbox("getValue")==""){
//			$.alert("请指定持卡人账户！");
//		}
		if(row==null){
			$.alert("请指定持卡人账户！");
		}
		else if(moneyBox.textbox("getValue")==""){
			$.alert("请输入充值金额！");
		}
		else if(moneyBox.textbox("getValue")=="0.00"){
			$.alert("充值金额不能为0！");
		}
		else if(moneyBox.textbox("getValue")>21474836.47 || moneyBox.textbox("getValue")<0 || !money.test(moneyBox.textbox("getValue"))){
			moneyBox.textbox("textbox").focus();
		}
		else{
			
			bottom_user_no.html(row.user_no);
			bottom_user_lname.html(row.user_lname);
			bottom_dep_name.html(row.dep_name);
			// 本次充值金额
			bottom_charge_amount.html(moneyBox.textbox("getValue"));
			// 充值前现金余额
			bottom_before_amount.html(charge_beforemoeny.html());
			// 充值后现金余额
			bottom_after_amount.html(charge_aftermoney.html());
			
			charge_button.linkbutton("disable");
			var params = {};
			params['account_id'] = row.account_id;
			params['recharge_amt'] = moneyBox.textbox("getValue");
			params['cash_amt'] = row.cash_amt_str;
			if(row.account_id == rData.account_id){
				params['read_card_number'] = rData.read_card_number;
				params['read_media_id'] = rData.read_media_id;
			}
			var myWin = $.createWin({
				title:"系统提示信息",
				width:300,
				height:150,
				queryParams:{
					params:params,
					callback:chargeSuccess
				},
				url:"js/account/charge_syncWin.js"
			});
		}
	}
	// add by LYh
	function chargeSuccess(param,i){
		if(i){
			charge_suc = 1;
			if(charge_print.prop("checked")){
				var params = {};
				params['account_id'] = param.account_id;
				params['trad_amt'] = param.recharge_amt;
				params['trad_before_amt'] = param.cash_amt;
				params['event_lx'] = "22";//充值
				$.postEx(tradPrint,params,function(retJson){
					if(retJson.result){
						printItem(retJson.data[0]);
					}else{
						$.alert(retJson.info);
					}
				});
			}
			dataTableEast.datagrid("loadEx",{url:chargeDetailQuery});
			bottom_state.html("充值成功");
			charge_beforemoeny.html("");
			charge_aftermoney.html("");
			if(user_no_data!=""){
				user_no.textbox("setValue",user_no_data);
				depTree.combotree("setValue","");
				user_lname.textbox("setValue","");
				user_id.textbox("setValue","");
				
				user_no.textbox("setText","");
				depTree.combotree("setText","");
				user_lname.textbox("setText","");
				user_id.textbox("setText","");
				searchWin(1);
				user_no.textbox("setValue","");
			}else{
				searchWin(0);
			}
			
			//dataTableWest.datagrid("loadDataEx",{});
			//moneyBox.textbox("setValue","");
			// add by LYh 20170607 充值成功提示音
			//successBeep();
		}
		charge_button.linkbutton("enable");
		//account_id.val("");
	}
	
	function printItem(data){
		if(data == 0){
			print_item_div.loadUI({
				eName:"object",
				id:"jatoolsPrinter",
				classid:"CLSID:B43D3361-D075-4BE2-87FE-057188254255",
				codebase:"jatoolsPrinter.cab#version=5,7,0,0"
				//codebase:"temp/jatoolsPrinter.cab#version=8,6,0,0"
			});
			var jatoolsPrinter = document.getElementById("jatoolsPrinter");
			if(typeof jatoolsPrinter.printPreview == 'undefined'){
			    $.alert("请在IE浏览器下先按照浏览器提示下载安装控件，否则将无法打印凭条！");
			}
		}else{
			print_item_div.empty();
			print_item_div.loadUI(printItemUI(data));
			try{
				doPrint();
			}catch(e){
				
			}
		}
	}
	
	function printItemUI(data){
		var printUI = [{
			eName:'div',
			id:"page1",
			cssClass:'charge_item only_for_print',
			elements:[{
				eName:'div',
				cssClass:'charge_item_upDiv',
				text:'充值凭条'
			},{
				eName:'div',
				cssClass:'charge_item_downDiv',
				elements:[{
					eName:'div',
					elements:[{
						eName:'span',
						text:'学/工号：'
					},{
						eName:'span',
						elements:data.user_no
					}]
				},{
					eName:'div',
					elements:[{
						eName:'span',
						text:'姓名：'
					},{
						eName:'span',
						elements:data.user_lname
					}]
				},{
					eName:'div',
					elements:[{
						eName:'span',
						text:'部门：'
					},{
						eName:'span',
						elements:data.dep_name
					}]
				},{
					eName:'div',
					elements:[{
						eName:'span',
						text:'原账户余额：'
					},{
						eName:'span',
						elements:data.trad_before_amt_str
					},{
						eName:'span',
						text:'元'
					}]
				},{
					eName:'div',
					elements:[{
						eName:'span',
						text:'充值金额：'
					},{
						eName:'span',
						elements:data.trad_amt_str
					},{
						eName:'span',
						text:'元'
					}]
				},{
					eName:'div',
					elements:[{
						eName:'span',
						text:'现账户余额：'
					},{
						eName:'span',
						elements:data.trad_after_amt_str
					},{
						eName:'span',
						text:'元'
					}]
				},{
					eName:'div',
					elements:[{
						eName:'span',
						text:'时间：'
					},{
						eName:'span',
						elements:data.trad_sj_str
					}]
				},{
					eName:'div',
					elements:[{
						eName:'span',
						text:'操作员：'
					},{
						eName:'span',
						elements:data.gly_no
					}]
				}]
			}]
		},{
			eName:"object",
			id:"jatoolsPrinter",
			classid:"CLSID:B43D3361-D075-4BE2-87FE-057188254255",
			codebase:"jatoolsPrinter.cab#version=5,7,0,0"
			//codebase:"temp/jatoolsPrinter.cab#version=8,6,0,0"
		}]
		return printUI;
	}
	
	
	function doPrint() {
		var myDoc = {
			/*
                               要打印的div 对象在本文档中，控件将从本文档中的 id 为 'page1' 的div对象，
                               作为首页打印id 为'page2'的作为第二页打印            */
	        documents: document,
	        //打印时,only_for_print取值为显示 
	        classesReplacedWhenPrint: new Array('.only_for_print{display:block}'), 
	        copyrights: '杰创软件拥有版权  www.jatools.com' // 版权声明,必须   
	    };
		var jatoolsPrinter = document.getElementById("jatoolsPrinter");
			try{
				jatoolsPrinter.print(myDoc, true); // 打印前弹出打印设置对话框
				//jatoolsPrinter.printPreview(myDoc); // 打印预览
				//jatoolsPrinter.print(myDoc, false); // 不弹出对话框打印
			}catch(e){
				print_item_div.css('display','none');
			}
	}
	// 文本内容清空
	function conditionClear() {
		user_no.textbox("clear");
		depTree.combotree("clear");
		user_lname.textbox("clear");
		user_id.textbox("clear");
	}
	function setCookie(){
		if(charge_print.prop("checked")){//选中
			printItem(0);//检测是否安装控件
			$.cookie('charge_print_check', 1, { expires: 7 }); 
		}else{//未选中
			$.cookie('charge_print_check', 2, { expires: 7 }); 
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
				user_no_data = retJson.data[0].user_no;
				user_no.textbox("setValue",retJson.data[0].user_no);
				user_lname.textbox("clear");
				depTree.combotree("clear");
				user_id.textbox("clear");
				
				user_no.textbox("setText","");
				charge_suc = 0;
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
			url:"js/account/charge_readCardWin.js"
		});
	}
	
	function readCardBack(retJson,i,p){
		if(i){
			user_no_data = retJson.data[0].user_no;
			user_no.textbox("setValue",retJson.data[0].user_no);
			//depTree.combotree("setValue",retJson.data[0].dep_serial);
			//user_lname.textbox("setValue",retJson.data[0].user_lname);
			//user_id.textbox("setValue",retJson.data[0].user_id);
			user_lname.textbox("clear");
			depTree.combotree("clear");
			user_id.textbox("clear");
			
			user_no.textbox("setText","");
			//ideList.combobox("setValue",retJson.data[0].ident_id);
			var param = {};
			param['account_id'] = retJson.data[0].account_id;
			param['read_card_number'] = p.card_number;
			param['read_media_id'] = p.media_id;
			rData = param;
			successBeep();
			charge_suc = 0;
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
//							user_id.textbox("setValue",retJson.data[0].user_id);
//							//ideList.combobox("setValue",retJson.data[0].ident_id);
//							param['account_id'] = retJson.data[0].account_id;
//							rData = param;
//							successBeep();
//							searchWin(1);
//							//dataTableWest.datagrid("loadEx",{url:chargeQuery,'cx_type':'1'});
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
//	
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
	user_id.next().children().eq(0).attr("maxlength",18);
	moneyBox.next().children().eq(0).attr("maxlength",8);
	
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
	