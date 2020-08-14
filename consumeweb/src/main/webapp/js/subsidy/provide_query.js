//补贴发放查询
garen_define("js/subsidy/provide_query", function(jqObj, loadParams) {
	
	var base = garen_require("js/base/ws_public");
	
	var depQuery = base.depQuery;//部门查询
	
	var glyQuery = base.glyQuery;//管理员查询
	
	var correctionQueryBatch = "subsidy/correctionQueryBatch.do";
	
	var provideStateQuery = "subsidy/provideStateQuery.do";//补贴发放记录类型查询
	
	var provideQueryByBatch = "subsidy/provideQueryByBatch.do";//补贴发放按批次查询
	
	var provideQueryByUser = "subsidy/provideQueryByUser.do";//补贴发放按人员查询
	
	var allReadCard = base.allReadCard;//读卡
	
	var jmjlink = garen_require("js/lib/jmjlink");//卡控件
	
	var columns = [//列字段定义
	             	[ {
	            		field : 'ch',
	            		title : 'ch',
	            		align : "center",  
	            		checkbox:true,
	            		width : 50
	            	}, {
	              		field : 'index',
	              		title : '..',
	              		align : "center",
	              		width : 50
	              	},  {
	              		field : 'sub_month',
	              		title : '补贴月份',
	              		align : "center",
	              		width : 100
	              	}, {
	              		field : 'batch_no',
	              		title : '批次',
	              		align : "center",
	              		width : 80
	              	}, {
	              		field : 'user_no',
	              		title : '学/工号',
	              		align : "center",
	              		width : 80
	              	}, {
	              		field : 'user_lname',
	              		title : '姓名',
	              		align : "center",
	              		width : 80
	              	}, {
	              		field : 'dep_name',
	              		title : '部门',
	              		align : "center",
	              		width : 100
	              	}, {
	              		field : 'sub_amt_str',
	              		title : '补贴金额',
	              		align : "center",
	              		width : 100
	              	}, {
	              		field : 'begin_date_str',
	              		title : '启用日期',
	              		align : "center",
	              		width : 100
	              	}, {
	              		field : 'end_date_str',
	              		title : '有效日期',
	              		align : "center",
	              		width : 100
	              	}
//	              	, {
//	              		field : 'bill_state',
//	              		title : '生效状态',
//	              		align : "center",
//	              		width : 100
//	              	}
	              	, {
	              		field : 'undo_state',
	              		title : '记录类型',
	              		align : "center",
	              		width : 100
	              	}, {
	              		field : 'sj_str',
	              		title : '操作时间',
	              		align : "center",
	              		width : 140
	              	}, {
	              		field : 'operator',
	              		title : '操作员',
	              		align : "center",
	              		width : 100
	              	}] ];
	var toolBar = [null,{
		eName : 'div',
		height : 10,
		cssStyle : 'background:#ffffff;'
	}, {
			eName : 'div',
			cssClass:"query_toolBar_second",
			elements : [{
				eName : 'div',
				elements:[{
					eName : 'input',
					id:"batch",
					type : 'radio',
					onClick:tabRadio
				},{
					eName : 'span',
					text : '按批次'
				}]
			},{
				eName : 'div',
				elements:[{
					eName : 'input',
					id:"user",
					type : 'radio',
					onClick:tabRadio
				},{
					eName : 'span',
					text : '按人员'
				}]
			}]
		},{
			eName : 'div',
			cssClass : 'query_toolBar_third',
			elements : [{
				eName : 'div',
				cssClass:"div_first",
				elements:[{
					eName:"span",
					text:"补贴月份"
				}, {
					eName:"datespinnerEx",
					name:"begin_month",
					dateType:['Y','M'],
					width:60,
					onChange:loadBatchNo
				}, 
				{
					eName:"span",
					elements:"&nbsp;—&nbsp;"
				},
				{
					eName:"datespinnerEx",
					name:"end_month",
					dateType:['Y','M'],
					width:60,
					onChange:loadBatchNo
				}]
			},{
				eName : 'div',
				cssClass:"div_second",
				elements:[{
					eName : 'span',
					text: "管理员"
					
				}, {
					eName:"combogrid",
					name:"gly_no",
					idField: 'gly_no',
					valueField: 'gly_no',    
			        textField: 'gly_no',
			        panelHeight:$.browser.msie9?200:'auto',
					panelMaxHeight:200,
					width:80,
					editable:false,
					multiple:true,
					allFlag:true,
					singleSelect: false,
					selectOnCheck:true,
					columns:[[
						{field:'gly_no1',checkbox:true},
						{field:'gly_no',title:'全部'}
					]],
					onChangeEx:loadBatchNo
				}]
			},{
				eName : 'div',
				elements:[{
					eName : 'span',
					text: "批次号"
				}, {
					eName:"combogrid",
					name:"batch_no",
					idField: 'batch_no',
			        textField: 'batch_no',
			        allFlag:true,
					columns:[[
						{field:'a',checkbox:true},
						{field:'batch_no',title:'全部'}
					]],
					width:80
				}]
			},{
				eName : 'div',
				elements:[{
					eName : 'span',
					text: "记录类型"
					
				}, {
					eName:"combogrid",
					name:"record_type",
					idField:"undo_state",
					valueField: 'undo_state',    
			        textField: 'undo_name',
			        panelHeight:$.browser.msie9?200:'auto',
					panelMaxHeight:200,
					width : 80,
					height : 25,
					editable:false,
					multiple:true,
					singleSelect: false,
					selectOnCheck:true,
					allFlag:true,
					columns:[[
						{field:'undo_state',checkbox:true},
						{field:'undo_name',title:'全部'}
					]]
				}]
			},{
				eName : 'div',
				elements:[{
					eName : 'textbox',
					name : 'fuzzy',
					prompt:'请输入姓名模糊查询',	
					width : 150,
					height : 22,		
					value:''//默认值
				}]
			},{
				eName : 'div',
				cssClass : 'query_div',
				elements : {
					eName : 'div',
					elements : [{
						eName : 'linkbutton',
						uId:"tm1",
						width:60,
						height:30,
						cssClass:'query_chaxun',
						text:"查询",
						onClick : queryByBatch
					}]
				}
			}]
		},{
			eName : 'div',
			cssClass : 'query_toolBar_fourth',
			cssStyle:"display:none;",
			elements:[{
				eName : 'div',
				cssClass:"div_first",
				elements:[{
					eName:"span",
					text:"补贴发放时间"
				}, {
					eName:"datespinnerEx",
					name:"begin_month2",
					dateType:['Y','M'],
					width:60,
					editable:false,
					onChange:loadBatchNo
				}, 
				{
					eName:"span",
					elements:"&nbsp;—&nbsp;"
				},
				{
					eName:"datespinnerEx",
					name:"end_month2",
					dateType:['Y','M'],
					width:60,
					editable:false,
					onChange:loadBatchNo
				}]
			},{
				eName : 'div',
				cssClass:"div_second",
				elements:[{
					eName : 'span',
					text: "姓名"
					
				}, {
					eName:"textbox",
					name:"user_lname",
					validType:"unnormal",
					width:100,
					value:''//默认值
				}]
			},{
				eName : 'div',
				elements:[{
					eName : 'span',
					text: "学/工号"
					
				}, {
					eName:"textbox",
					name:"user_no",
					validType:'number',
					width:100,
					value:''//默认值
				}]
			},{
				eName : 'div',
				elements:[{
					eName : 'span',
					text: "部门"
				}, {
					eName:"combotree",
					name:"dep_serial",
					editable:false,
					multiple:true,
					panelHeight:$.browser.msie9?200:'auto',
					panelMaxHeight:200,
					height : 25,
					width:130,
					onSelect:function(node){//选择相同则清空文本内容
						if(dep_serial.combo("getText")==node.text){
							dep_serial.combotree("clear");
						}
					}
				}]
			},{
				eName : 'div',
				elements:[{
					eName : 'span',
					text: "记录类型"
					
				}, {
					eName:"combogrid",
					name:"record_type2",
					idField:"undo_state",
					valueField: 'undo_state',    
			        textField: 'undo_name',
			        panelHeight:$.browser.msie9?200:'auto',
					panelMaxHeight:200,
					width : 80,
					height : 25,
					editable:false,
					multiple:true,
					singleSelect: false,
					selectOnCheck:true,
					allFlag:true,
					columns:[[
						{field:'undo_state',checkbox:true},
						{field:'undo_name',title:'全部'}
					]]
				}]
			},{
				eName : 'div',
				cssClass : 'query_div',
				elements : {
					eName : 'div',
					elements : [{
						eName : 'linkbutton',
						uId:"tm1",
						width:60,
						height:30,
						cssClass:'query_chaxun',
						text:"查询",
						onClick : function(){
							queryByUser(0);
						}
					}]
				}
			},{
				eName : 'div',
				cssClass : 'query_div',
				elements : {
					eName : 'div',
					elements : [{
						eName : 'linkbutton',
						uId:"tm1",
						width:60,
						height:30,
						cssClass:'query_chaxun',
						text:"读卡",
						onClick : readCard 
					}]
				}
			}]
		}];
	var centerUI = {
		eName : 'datagrid',
		idField : 'id',
		id:"dataTable",
		//queryForm:"searchForm",
		toolbarEx : toolBar,// 查询条件工具栏
		columns : columns,
		pagination: true,//分页
		alertFlag : false,// 是否弹出默认对话框
		autoload : false,
		singleSelect:true,
		checkOnSelect:true,
		selectOnCheck:true,
		onBeforeLoadEx:function(params){
			if(batch.attr("checked")=="checked"){
				if(params.begin_month>params.end_month){
					$.alert("开始月份不能大于结束月份");
					money_span.html("0.00");
					return false;
				}
				delete params.begin_month2;
				delete params.end_month2;
				delete params.user_lname;
				delete params.user_no;
				delete params.dep_serial;
				delete params.record_type2;
			}
			else if(user.attr("checked")=="checked"){
				if(params.begin_month2>params.end_month2){
					$.alert("开始时间不能大于结束时间");
					money_span.html("0.00");
					return false;
				}
				params.begin_month = params.begin_month2;
				delete params.begin_month2;
				params.end_month = params.end_month2;
				delete params.end_month2;
				delete params.gly_no;
				delete params.batch_no;
				params.record_type = params.record_type2;
				delete params.record_type2;
				delete params.fuzzy;
			}
		},
		onLoadSuccessEx:function(retJson){
			gly_no.combogrid("clear");
			batch_no.combogrid("clear");
			record_type.combogrid("clear");
			fuzzy.textbox("clear");
			user_no.textbox("clear");
			dep_serial.combotree("clear");
			user_lname.textbox("clear");
			record_type2.combogrid("clear");
			if(retJson.id == undefined) return;
			if(retJson.id=="0"){
				money_span.html(retJson.retData[0].subamts_str);
			}else{
				$.alert(retJson.info);
			}
		}
	};
	var southUI = {
		eName : 'div',
		cssStyle:"margin-left:50px;position:relative;margin-top:30px;",
		elements : [{
			eName:'span',
			cssStyle:'font-size:28px;',
			text:'总计：'
		},{
			eName:'span',
			id:"money_span",
			cssStyle:"color:red;font-size:28px;",
			text:'0.00'
		},{
			eName:'span',
			cssStyle:'font-size:28px;',
			text:'元'
		}]
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
	var query_toolBar_third = jqObj.findJq("query_toolBar_third");
	var query_toolBar_fourth = jqObj.findJq("query_toolBar_fourth");
	var batch = jqObj.findJq("batch");
	var user = jqObj.findJq("user")
	var dep_serial = jqObj.findJq("dep_serial");
	var user_no = jqObj.findJq("user_no");
	var user_lname = jqObj.findJq("user_lname");
	var gly_no = jqObj.findJq("gly_no");
	var record_type = jqObj.findJq("record_type");
	var begin_month = jqObj.findJq("begin_month");
	var end_month = jqObj.findJq("end_month");
	var money_span = jqObj.findJq("money_span");
	var batch_no = jqObj.findJq("batch_no");
	var fuzzy = jqObj.findJq("fuzzy");
	var begin_month2 = jqObj.findJq("begin_month2");
	var end_month2 = jqObj.findJq("end_month2");
	var record_type2 = jqObj.findJq("record_type2");
	var date = new Date();
	
	loadInit();//初始化
	loadBatchNo();
	//loadUndoState();
	
	loadDepTree();//加载部门树
	
	loadGlyList();//加载管理员列表
	
	loadStateList();//加载记录类型列表
	
//	document.onkeydown=function(event){
//		var e = event || window.event || arguments.callee.caller.arguments[0];
//		if(e && e.keyCode==13){ // enter 键
//			if(batch.prop("checked")){
//				queryByBatch();
//			}
//			else if(user.prop("checked")){
//				queryByUser();
//			}
//			
//	    }
//	};
	
	function loadBatchNo(newValue,oldValue){
		var params = {};
		var beginui = jqObj.findJqUI("begin_month");
		var endui = jqObj.findJqUI("end_month");
		//$.print(beginui,endui,gly_no);
		if(beginui == undefined || endui == undefined 
				|| gly_no == undefined)
			return;
		//$.print(gly_no.combo("getValues").join());
		params['sub_month_begin'] = beginui.getDate();
		params['sub_month_end'] = endui.getDate();
		params['gly_no'] = gly_no.combo("getValues").join();
		$.postEx(correctionQueryBatch,params,function(retJson){
			if(retJson.result && retJson.data){
				var batchGrid = batch_no.combogrid("grid");
				batchGrid.datagrid("loadDataEx",retJson.data);
			}
		});
	}
	
	//键盘回车事件
//	batch_no.textbox("textbox").keydown(function(e){
//		var key = e.keyCode;//兼容firefox
//		if(key == 13){
//			queryByBatch();
//		}
//	});
	
	fuzzy.textbox("textbox").keydown(function(e){
		var key = e.keyCode;//兼容firefox
		if(key == 13){
			queryByBatch();
		}
	});
	
	user_no.textbox("textbox").keydown(function(e){
		var key = e.keyCode;//兼容firefox
		if(key == 13){
			//不清楚原因，这里的textbox不失去焦点就没value，只有text
			user_no.textbox("setValue",user_no.textbox("getText"));
			queryByUser(0);
		}
	});
	
	user_lname.textbox("textbox").keydown(function(e){
		var key = e.keyCode;//兼容firefox
		if(key == 13){
			user_lname.textbox("setValue",user_lname.textbox("getText"));
			queryByUser(0);
		}
	});
	
	function loadInit(){
		//query_toolBar_third.css("display","");
		//query_toolBar_fourth.css("display","none");
		batch.attr("checked","checked");
		var y = date.getFullYear();
		var m = date.getMonth()+1;
		if(m==12){
			end_month.findJqUI().setDate(y+1+"-"+'01');
			end_month2.findJqUI().setDate(y+1+"-"+'01');
		}else{
			//begin_month.findJqUI().setDate(y+"-"+(m<10?"0"+m:m));
			end_month.findJqUI().setDate(y+"-"+((m+1)<10?"0"+(m+1):(m+1)));
			//begin_month2.findJqUI().setDate(y+"-"+(m<10?"0"+m:m));
			end_month2.findJqUI().setDate(y+"-"+((m+1)<10?"0"+(m+1):(m+1)));
		}
	}
	
	//切换标签
	function tabRadio(){
		var ui = $(this).findUI();
		if(ui.id=="batch"){
			if(batch.attr("checked")!="checked"){
				batch.attr("checked","checked");
				user.attr("checked",false);
				query_toolBar_third.css("display","");
				query_toolBar_fourth.css("display","none");
				//禁用带有验证的textbox来取消验证
				user_no.textbox("disable");
				user_lname.textbox("disable");
				//batch_no.textbox("enable");
				
			}
		}
		if(ui.id=="user"){
			if(user.attr("checked")!="checked"){
				batch.attr("checked",false);
				user.attr("checked","checked");
				query_toolBar_third.css("display","none");
				query_toolBar_fourth.css("display","");
				//禁用带有验证的textbox来取消验证
				user_no.textbox("enable");
				user_lname.textbox("enable");
				//batch_no.textbox("disable");
			}
		}
	}
	
	function loadDepTree(){
		$.postEx(depQuery,function(retJson){
			if(retJson.result && retJson.data){
				dep_serial.combotree('loadData',
						$.list2Tree(retJson.data,"dep_serial","dep_parent","dep_name"));
			}
		});
	}
	
	function loadGlyList(){
		$.postEx(glyQuery,function(retJson){
			if(retJson.result && retJson.data){
				var glyGrid = gly_no.combogrid("grid");
				glyGrid.datagrid("loadDataEx",retJson.data);
			}
		});
	}
	
//	function loadUndoState(){
//		$.postEx(correctionQueryState,function(retJson){
//			if(retJson.result && retJson.data){
//				var usGrid = undo_state.combogrid("grid");
//				usGrid.datagrid("loadDataEx",retJson.data);
//				var usGrid2 = undo_state2.combogrid("grid");
//				usGrid2.datagrid("loadDataEx",retJson.data);
//			}
//		});
//	}
	
	function loadStateList(){
		$.postEx(provideStateQuery,function(retJson){
			if(retJson.result && retJson.data){
				var usGrid = record_type.combogrid("grid");
				usGrid.datagrid("loadDataEx",retJson.data);
				var usGrid2 = record_type2.combogrid("grid");
				usGrid2.datagrid("loadDataEx",retJson.data);
			}
		});
	}

	function queryByBatch(){
		dataTable.datagrid("loadEx",{url:provideQueryByBatch});
	}
	
	function queryByUser(cx_type){
		dataTable.datagrid("loadEx",{url:provideQueryByUser,'cx_type':cx_type});
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
	
	function readCardBack(retJson,i){
		if(i){
			user_no.textbox("setValue",retJson.data[0].user_no);
			dep_serial.combotree("setValue",retJson.data[0].dep_serial);
			user_lname.textbox("setValue",retJson.data[0].user_lname);
			user_no.textbox("setText","");
			dep_serial.combotree("setText","");
			user_lname.textbox("setText","");
			successBeep();
			queryByUser(1);
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
//							dep_serial.combotree("setValue",retJson.data[0].dep_serial);
//							user_lname.textbox("setValue",retJson.data[0].user_lname);
//							//user_id.textbox("setValue",retJson.data[0].user_id);
//							//ideList.combobox("setValue",retJson.data[0].ident_id);
//							successBeep();
//							queryByUser();
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
