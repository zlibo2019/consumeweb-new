//取款
garen_define("js/account/drawCash",function (jqObj,loadParams) {
	
	//webService
	var base = garen_require("js/base/ws_public");
	
	var checkCoreIp = base.checkCoreIp;//核心业务IP授权验证
	
	var depQuery = base.depQuery;//部门查询
	
	var tradPrint = base.tradPrint;//打印凭条信息
	
	var drawCashDetailQuery = "account/drawCashDetailQuery.do";//取款明细查询
	
	var drawCashQuery = "account/drawCashQuery.do";//取款筛选查询
	
	var allReadCard = base.allReadCard;//读卡
	
	var allReadIdCard = base.allReadIdCard;//读身份证
	
	var jmjlink = garen_require("js/lib/jmjlink");//卡控件
	
	var scmurl = garen_require("js/lib/scmurl");//url地址
	
	var record_row = "";
	
	var rData = "";//读卡时把id和卡号等存下来，操作时对比id，成功则提交卡号等
	
	
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
					text : '身份证号',
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
  	  		width : 95
  	  	}, {
  	  		field : 'dep_name',
  	  		title : '部门',
  	  		align : "center",
  	  		width : 118
  	  	}, {
  	  		field : 'user_lname',
  	  		title : '姓名',
  	  		align : "center",
  	  		width : 95
  	  	}, {
  	  		field : 'user_type_mc',
  	  		title : '在职状态',
  	  		align : "center",
  	  		width : 95
  	  	}] 
  	];
	
	var westUI=[{
		eName : 'div',
		cssClass : 'drawCash_line',
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
				drawCash_beforemoeny.html("");
				drawCash_aftermoney.html("");
				moneyBox.textbox("setValue","");
				if(retJson.id == undefined) return;
				if(retJson.id=="0"){
					if(retJson.rows.length==1){
						dataTableWest.datagrid("checkRow",0);
					}
				}else{
					$.alert(retJson.info);
				}
			},
			onCheckEx:function(index,row){
				if(cashOut.prop("checked")){
					drawCash_beforemoeny.html(row.cash_amt_str);
				}
				else if(subOut.prop("checked")){
					drawCash_beforemoeny.html(row.sub_amt_str);
				}
				//drawCash_beforemoeny.html(row.cash_amt_str);
				if(drawCash_beforemoeny.html()!="" && moneyBox.textbox("getValue")!=""){
					var bem = Math.round(Number(drawCash_beforemoeny.html())*100); 
					var nv = Math.round(Number(moneyBox.textbox("getValue"))*100); 
					var v = bem - nv;
					var val = v/100 + "";
					
					if(val.indexOf(".") == -1){//输入时不含小数点（0.00==0）
						drawCash_aftermoney.html(val+".00");
					}
					else if(val.length - val.indexOf(".") - 1 == 1){//小数点后面有一位数（0.10==0.1）
						drawCash_aftermoney.html(val+"0");
					}
					else{//小数点后面有两位数
						drawCash_aftermoney.html(val);
					}
				}
			}
		}
	}];
	
	var centerUI = [{ //中上部分
			eName : 'div',
			cssClass : 'drawCash_line',
			elements : {
				eName : 'span',
				id:"account_info",
				text : '现金账户信息'
			}
		},{ eName : 'div',
			cssClass:"drawCash_center_bottom_all",
			elements : [{
	            	//中下部分
		             eName : 'div',
		             cssClass : 'drawCash_center_bottom',
		             elements : [{
			                      eName : 'div',
			                      cssClass : 'drawCash_cashlx',
			                      elements : [{
				                               eName : 'div',
				                               elements:[{
					                           eName : 'input',
					                           name : 'outType',
					                           cssClass:"drawCash_checkbox",
					                           id:"cashOut",
					                           type : 'radio',
					                           value:'0',
					                           onClick:cashOutFn
				                             },{
					                           eName : 'span',
					                           text : '取现金'
				                             }]
			                      },{
				                  eName : 'div',
				                  elements:[{
					              eName : 'input',
					              name : 'outType',
					              cssClass:"drawCash_checkbox",
					              id:"subOut",
				                  type : 'radio',
					              value:'1',
					              onClick:subOutFn
				                  },{
					              eName : 'span',
					              text : '取补贴'
				                  }]
			       }]
		           },
		           {//中下左
			          eName : 'div',
			          cssStyle:"width:340px;margin:0 auto;height:85%;",
			          elements:[{
				      eName : 'div',
				      cssClass : 'drawCash_center_bottom_left_div1',
				      elements : [{
					  eName : 'span',
					  cssClass : 'drawCash_beforetext',
					  text : '取款前余额:',
					  cssStyle : ''
					  },{
					  eName : 'span',
					  cssClass : 'drawCash_beforemoeny',
					  cssStyle : '',
					  text: ''
					  },
					  {
					   eName : 'span',
					   text: '元'
					  }]
			         },{
				     eName : 'div',
				     cssClass : 'drawCash_after',
				     elements : [{
					              eName : 'span',
					              text : '取款后余额:',
					              cssClass : 'drawCash_aftertext'
					              },{
						          eName : 'span',
						          cssClass : 'drawCash_aftermoney',
						          text: ''
					              },
					              {
						          eName : 'span',
						          text: '元'
					              }]
			        },{
				    eName : 'div',
				    cssClass : 'drawCash_inputmoney',
				    elements : [{
					             eName : 'span',
					             text : '输入取款金额',
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
			      },
			      {
				  eName : 'div',
				  cssClass : 'drawCash_other',
				  elements : {
					    eName : 'div',
					    elements : [{
						eName:'div',
						elements:[
							{
							    eName : 'input',
								name : 'drawCash_print',
								cssClass:"drawCash_checkbox",
								type : 'checkbox',
								onClick:setCookie
							},{
								eName : 'span',
								text : '取款后打印'
							}
						]
					}
					]}
			}
			]
		}]
       
	
	},{
		eName : 'div',
		cssClass : 'drawCash_bottom',
		elements : [{
		    eName : 'div',
		    cssClass : 'drawCash_bottom_div',
			elements:[{
				 eName : 'div',
				 elements:[{
					 eName : 'span',
					 cssClass : 'drawCash_bottom_span',
					 text : '最近取款结果',
					 cssStyle : ''}]
			},{
				eName : 'div',
				 elements:[{
						eName : 'span',
						elements : '&emsp;&emsp;&emsp;学 / 工号:',
						cssClass : 'drawCash_bottom_aftertext'
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
						cssClass : 'drawCash_bottom_aftertext'
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
						cssClass : 'drawCash_bottom_aftertext'
						},{
							eName : 'span',
							id:'bottom_dep_name',
							text: ''
						}]
			},{
				eName : 'div',
				 elements:[{
						eName : 'span',
						text : '本次取现金金额:',
						id:'this_amount',
						cssClass : 'drawCash_bottom_aftertext'
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
						cssClass : 'drawCash_bottom_aftertext'
						},{
							eName : 'span',
							id:'bottom_state',
							text: ''
						}]
			},{
				eName : 'div',
				 elements:[{
						eName : 'span',
						text : '取款前现金余额:',
						id:'befWithdraw_amount',
						cssClass : 'drawCash_bottom_aftertext'
						},{
							eName : 'span',
							id:'bottom_before_amount',
							text: ''
						}]
			},{
				eName : 'div',
				 elements:[{
						eName : 'span',
						text : '取款后现金余额:',
						id:'aftWithdraw_amount',
						cssClass : 'drawCash_bottom_aftertext'
						},{
							eName : 'span',
							id:'bottom_after_amount',
							text: ''
						}]
			}]
			
		}]
	}]
}];
	
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
   			//url : drawCashDetailQuery,
   			//toolbarEx : toolBar,// 查询条件工具栏
   			columns : columnsEast,
   			pagination: true,
   			clientPager:true,
   			alertFlag : false,// 是否弹出默认对话框
   			//autoload : true,
   			singleSelect:true,
   			checkOnSelect:false,
   			selectOnCheck:false,
   			showFooter: true,
   			onLoadSuccessEx:function(retJson){
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
		cssClass:"drawCash_south",
		elements : [{
			eName : 'linkbutton',
			uId:"tm1",
			text : "<span style='font-size:20px;'>读卡</span>",
			cssClass : 'drawCash_linkbutton',
			width : 220,
			height : 60,
			onClick : readCard
		},{
			eName : 'linkbutton',
			uId:"tm2",
			id:"drawCash_button",
			text : "<span style='font-size:20px;'>取款</span>",
			cssClass : 'drawCash_linkbutton',
			width : 220,
			height : 60,
			onClick:draw
		}]
	}];
	
	var mainUI = {
		eName : 'layoutExt',// 容器布局类，jeasyui组件
		cssStyle:'font-family: 微软雅黑, Arial;',
		fit : true,
		elements : [{
			region : 'west',
			width:0.35,
			cssStyle:"min-width:390px;",
			elements : westUI,
		},{
			region : 'center',
			cssStyle:"max-width:27%;",
			elements : centerUI
		},{
			region : 'east',
			width:0.38,
			elements : eastUI,
		},{
			region : 'south',
			height : 100,
			elements : southUI
		}]
	};
	
	
	jqObj.loadUI(mainUI);
	var dataTable = jqObj.findJq("datagrid");
	var depTree = jqObj.findJq("depTree");
	var drawCash_form = jqObj.findJqUI("drawCash_form");
	var drawCash_beforemoeny = jqObj.findJq("drawCash_beforemoeny");
	var drawCash_aftermoney = jqObj.findJq("drawCash_aftermoney");
	var moneyBox = jqObj.findJq("moneyBox");
	var user_no = jqObj.findJq("user_no");
	var user_lname = jqObj.findJq("user_lname");
	var user_id = jqObj.findJq("user_id");
	var drawCash_button = jqObj.findJq("drawCash_button");
	var account_id = jqObj.findJq("account_id");
	var cashOut = jqObj.findJq("cashOut");
	var subOut = jqObj.findJq("subOut");
	var account_info = jqObj.findJq("account_info");
	
	var this_amount = jqObj.findJq("this_amount");
	var befWithdraw_amount = jqObj.findJq("befWithdraw_amount");
	var aftWithdraw_amount = jqObj.findJq("aftWithdraw_amount");
	
	var searchBtn = jqObj.findJq("searchBtn");
	var drawCash_print = jqObj.findJq("drawCash_print");
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
//			searchWin(0);
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
	
	//加载选择部门树
	loadTree();
	loadInit();
	
	function loadInit(){
		
		$.postEx(checkCoreIp,{'op_name':'取款'},function(retJson){
			if(retJson.result){
				
			}else{
				$.alert(retJson.info,function(){
					//window.parent.location.reload();
					window.top.location.href=scmurl;
				});
			}
		});
		
		dataTableEast.datagrid("loadEx",{url:drawCashDetailQuery});
		
		cashOut.prop("checked","checked");
		
		var drawCash_print_check = $.cookie("drawCash_print_check");
		if(drawCash_print_check == 1){
			drawCash_print.prop("checked",true);
			$.cookie('drawCash_print_check', drawCash_print_check, { expires: 7 });
			printItem(0);//检测是否安装控件
		}
		else if(drawCash_print_check == 2){
			drawCash_print.prop("checked",false);
			$.cookie('drawCash_print_check', drawCash_print_check, { expires: 7 });
		}
	}
	
	function cashOutFn(){
		account_info.html("现金账户信息");
		
		if(dataTableWest.datagrid("getSelected")){
			drawCash_beforemoeny.html(dataTableWest.datagrid("getSelected").cash_amt_str);
		}
		if(drawCash_beforemoeny.html()!="" && moneyBox.textbox("getValue")!=""){
			var bem = Math.round(Number(drawCash_beforemoeny.html())*100); 
			var nv = Math.round(Number(moneyBox.textbox("getValue"))*100); 
			var v = bem - nv;
			var val = v/100 + "";
			
			if(val.indexOf(".") == -1){//输入时不含小数点（0.00==0）
				drawCash_aftermoney.html(val+".00");
			}
			else if(val.length - val.indexOf(".") - 1 == 1){//小数点后面有一位数（0.10==0.1）
				drawCash_aftermoney.html(val+"0");
			}
			else{//小数点后面有两位数
				drawCash_aftermoney.html(val);
			}
		}
		
//		drawCash_aftermoney.html("");
//		moneyBox.textbox("setValue","");
	}
	
	function subOutFn(){
		account_info.html("补贴账户信息");
		
		if(dataTableWest.datagrid("getSelected")){
			drawCash_beforemoeny.html(dataTableWest.datagrid("getSelected").sub_amt_str);
		}
//		drawCash_aftermoney.html("");
//		moneyBox.textbox("setValue","");
		if(drawCash_beforemoeny.html()!="" && moneyBox.textbox("getValue")!=""){
			var bem = Math.round(Number(drawCash_beforemoeny.html())*100); 
			var nv = Math.round(Number(moneyBox.textbox("getValue"))*100); 
			var v = bem - nv;
			var val = v/100 + "";
			
			if(val.indexOf(".") == -1){//输入时不含小数点（0.00==0）
				drawCash_aftermoney.html(val+".00");
			}
			else if(val.length - val.indexOf(".") - 1 == 1){//小数点后面有一位数（0.10==0.1）
				drawCash_aftermoney.html(val+"0");
			}
			else{//小数点后面有两位数
				drawCash_aftermoney.html(val);
			}
		}
	}
	
	function loadTree(){
		$.postEx(depQuery,function(retJson){
			if(retJson.result && retJson.data){
				depTree.combotree('loadData',
						$.list2Tree(retJson.data,"dep_serial","dep_parent","dep_name"));
			}
		});
	}
	
	function searchWin(cx_type){
		dataTableWest.datagrid("loadEx",{url:drawCashQuery,'cx_type':cx_type});
	}
	
//	//搜索窗口
//	function searchWin(){
//		
//		var params = drawCash_form.form2Json();
//		//$.print(params);
//		if(params.dep_serial=="" && params.user_id=="" 
//			&& params.user_lname=="" && params.user_no==""){
//			$.alert("请输入一个查询条件！");
//		}else{
//			var p = {};
//			var myform = jqObj.findJq("drawCash_form");
//			if(myform.form('form2Json',p)){//true则表单验证通过
//				searchBtn.linkbutton("disable");
//				$.postEx(drawCashQuery,params,function(retJson){
//					if(retJson.result){
//						if(retJson.data.length==0){
//							$.alert("没有找到此人员！");
//							searchBtn.linkbutton("enable");
//						}
//						else if(retJson.data.length==1 && retJson.data[0].account_state_code==0){
//							user_no.textbox("setValue",retJson.data[0].user_no);
//							depTree.combotree("setValue",retJson.data[0].user_dep);
//							user_lname.textbox("setValue",retJson.data[0].user_lname);
//							user_id.textbox("setValue",retJson.data[0].user_id);
//							if(cashOut.prop("checked")){
//								drawCash_beforemoeny.html(retJson.data[0].cash_amt_str);
//							}
//							else if(subOut.prop("checked")){
//								drawCash_beforemoeny.html(retJson.data[0].sub_amt_str);
//							}
//							var row = {};
//							row['cash_amt_str'] = retJson.data[0].cash_amt_str;
//							row['sub_amt_str'] = retJson.data[0].sub_amt_str;
//							record_row = row;
//							//drawCash_beforemoeny.html(retJson.data[0].cash_amt_str);
//							drawCash_aftermoney.html("");//若先输入金额则需要清空
//							moneyBox.textbox("setValue","");//若先输入金额则需要清空
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
//								url:"js/account/drawCash_searchWin.js"
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
	
//	function success(row){
//		record_row = row;
//		user_no.textbox("setValue",row.user_no);
//		depTree.combotree("setValue",row.user_dep);
//		user_lname.textbox("setValue",row.user_lname);
//		user_id.textbox("setValue",row.user_id);
//		if(cashOut.prop("checked")){
//			drawCash_beforemoeny.html(row.cash_amt_str);
//		}
//		else if(subOut.prop("checked")){
//			drawCash_beforemoeny.html(row.sub_amt_str);
//		}
//		
//		drawCash_aftermoney.html("");//若先输入金额则需要清空
//		moneyBox.textbox("setValue","");//若先输入金额则需要清空
//		account_id.val(row.account_id);
//	}
	
	//输入金额
	function moneyInput(newValue, oldValue){
		var money=/^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
		if(money.test(newValue)){//金额验证
			if(newValue>21474836.47){
				//$.alert("单次充值金额不能超过21474836.47元");
				drawCash_aftermoney.html("");//清空充值后余额
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
				
				
				//取款后余额
				if(drawCash_beforemoeny.html()!=""){
					var bem = Math.round(Number(drawCash_beforemoeny.html())*100); 
					var nv = Math.round(Number(newValue)*100); 
					var v = bem - nv;
					var val = v/100 + "";
					if(val.indexOf(".") == -1){//输入时不含小数点（0.00==0）
						drawCash_aftermoney.html(val+".00");
					}
					else if(val.length - val.indexOf(".") - 1 == 1){//小数点后面有一位数（0.10==0.1）
						drawCash_aftermoney.html(val+"0");
					}
					else{//小数点后面有两位数
						drawCash_aftermoney.html(val);
					}
				}
			}
		}
		else{
			drawCash_aftermoney.html("");
			//$.alert("请输入正确的金额");
		}
	}
	// add by LYh
	//取款
	function draw(){
		var row = dataTableWest.datagrid("getSelected");
		
		var money=/^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
//		if(user_no.textbox("getValue")==""){
//			$.alert("请指定持卡人账户！");
//		}
		if(row==null){
			$.alert("请指定持卡人账户！");
		}
		else if(!cashOut.prop("checked") && !subOut.prop("checked")){
			$.alert("请选择取现金或取补贴！");
		}
		else if(moneyBox.textbox("getValue")==""){
			$.alert("请输入取款金额！");
		}
		else if(moneyBox.textbox("getValue")>21474836.47 || moneyBox.textbox("getValue")<0 || !money.test(moneyBox.textbox("getValue"))){
			moneyBox.textbox("textbox").focus();
		}
		else if(Number(drawCash_aftermoney.html())<0){
			$.alert("取款金额不能超过余额！");
		}
		else if(moneyBox.textbox("getValue")=="0.00"){
			$.alert("取款金额不能为0！");
		}
		else{
			
			bottom_user_no.html(row.user_no);
			bottom_user_lname.html(row.user_lname);
			bottom_dep_name.html(row.dep_name);
			// 本次充值金额
			bottom_charge_amount.html(moneyBox.textbox("getValue"));
			// 充值前现金余额
			bottom_before_amount.html(drawCash_beforemoeny.html());
			// 充值后现金余额
			bottom_after_amount.html(drawCash_aftermoney.html());
			
			drawCash_button.linkbutton("disable");
			var params = {};
			params['account_id'] = row.account_id;
			params['withdraw_amt'] = moneyBox.textbox("getValue");
			if(cashOut.prop("checked")){
				params['cash_amt_before'] = row.cash_amt_str;
				params['withdraw_lx'] = 0;
				this_amount.html("本次取现金金额");
				befWithdraw_amount.html("取款前现金余额");
				aftWithdraw_amount.html("取款后现金余额");
			}
			else if(subOut.prop("checked")){
				params['cash_amt_before'] = row.sub_amt_str;
				params['withdraw_lx'] = 1;
				this_amount.html("本次取补贴金额");
				befWithdraw_amount.html("取款前补贴余额");
				aftWithdraw_amount.html("取款后补贴余额");
			}
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
					callback:drawCashSuccess
				},
				url:"js/account/drawCash_syncWin.js"
			});
		}
	}
	
	function drawCashSuccess(param,i){
		if(i){
			if(drawCash_print.prop("checked")){
				var params = {};
				params['account_id'] = param.account_id;
				params['trad_amt'] = param.withdraw_amt;
				params['trad_before_amt'] = param.cash_amt_before;
				if(cashOut.prop("checked")){
					params['event_lx'] = "24";//取现金
				}else if(subOut.prop("checked")){
					params['event_lx'] = "25";//取补贴
				}
				$.postEx(tradPrint,params,function(retJson){
					if(retJson.result){
						retJson.data[0]['event_lx'] = params.event_lx;
						$.print(retJson.data[0]);
						printItem(retJson.data[0]);
					}else{
						$.alert(retJson.info);
					}
				});
			}
			dataTableEast.datagrid("loadEx",{url:drawCashDetailQuery});
			bottom_state.html("取款成功");
			//dataTable.datagrid("reload");
			record_row = "";
			moneyBox.textbox("setValue","");
			drawCash_beforemoeny.html("");
			drawCash_aftermoney.html("");
			//account_id.val("");
			//dataTableWest.datagrid('clearChecked');
			dataTableWest.datagrid("loadDataEx",{id:0,total:0,rows:[]});
		}
		drawCash_button.linkbutton("enable");
	}
	
	function printItem(data){
		if(data == 0){
			print_item_div.loadUI({
				eName:"object",
				id:"jatoolsPrinter",
				classid:"CLSID:B43D3361-D075-4BE2-87FE-057188254255",
				codebase:"jatoolsPrinter.cab#version=5,7,0,0"
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
				text:'取款凭条'
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
						elements:data.event_lx=="24"?'原账户现金余额：':'原账户补贴余额：'
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
						text:'取款金额：'
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
						elements:data.event_lx=="24"?'现账户现金余额：':'现账户补贴余额：'
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
	
	function setCookie(){
		if(drawCash_print.prop("checked")){//选中
			printItem(0);//检测是否安装控件
			$.cookie('drawCash_print_check', 1, { expires: 7 }); 
		}else{//未选中
			$.cookie('drawCash_print_check', 2, { expires: 7 }); 
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
	
	function readCard(){
		var myWin = $.createWin({
			title:"操作提示",
			width:300,
			height:150,
			queryParams:{
				callback:readCardBack
			},
			url:"js/account/readCardWin.js"
		});
	}
	
	function readCardBack(retJson,i,p){
		if(i){
			user_no.textbox("setValue",retJson.data[0].user_no);
			/*depTree.combotree("setValue",retJson.data[0].dep_serial);
			user_lname.textbox("setValue",retJson.data[0].user_lname);
			user_id.textbox("setValue",retJson.data[0].user_id);*/
			user_lname.textbox("clear");
			depTree.combotree("clear");
			user_id.textbox("clear");
			
			user_no.textbox("setText","");
			//ideList.combobox("setValue",retJson.data[0].ident_id);
			var param = {};
			param['account_id'] = retJson.data[0].account_id;
			// add by LYh 20170612
			param['read_card_number'] = p.card_number;
			param['read_media_id'] = p.media_id;
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
//							user_id.textbox("setValue",retJson.data[0].user_id);
//							//ideList.combobox("setValue",retJson.data[0].ident_id);
//							param['account_id'] = retJson.data[0].account_id;
//							rData = param;
//							successBeep();
//							searchWin(1);
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
	
	// 文本内容清空
	function conditionClear() {
		user_no.textbox("clear");
		depTree.combotree("clear");
		user_lname.textbox("clear");
		user_id.textbox("clear");
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
	