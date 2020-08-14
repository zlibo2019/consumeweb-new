//导入结果查询
garen_define("js/subsidy/excel_query", function(jqObj, loadParams) {
	
	var base = garen_require("js/base/ws_public");
	
	var glyQuery = base.glyQuery;//管理员查询
	
	var excelQueryBatch = "subsidy/excelQueryBatch.do";
	
	var excelStateQuery = "subsidy/excelStateQuery.do";//导入状态查询
	
	var excelQuery = "subsidy/excelQuery.do";//筛选查询
	
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
	              		title : '批次号',
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
	              		field : 'op_result',
	              		title : '导入状态',
	              		align : "center",
	              		width : 100
	              	}, {
	              		field : 'excel_rowno',
	              		title : '导入行',
	              		align : "center",
	              		width : 100
	              	}, {
	              		field : 'result_content',
	              		title : '结果说明',
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
			cssClass : 'excel_query_toolBar_second',
			elements : [{
				eName : 'div',
				cssClass:"div_first",
				elements:[{
					eName:"span",
					text:"补贴月份"
				}, {
					eName:"datespinnerEx",
					name:"sub_month_begin",
					dateType:['Y','M'],
					width:60,
					onChange:loadBatchNo
				}, {
					eName:"span",
					elements:"&nbsp;—&nbsp;"
				}, {
					eName:"datespinnerEx",
					name:"sub_month_end",
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
			        panelHeight:$.browser.msie9?200:'auto',
					panelMaxHeight:200,
					width:80,
					multiple:true,
			        allFlag:true,
					columns:[[
						{field:'a',checkbox:true},
						{field:'batch_no',title:'全部'}
					]]
				}]
			},{
				eName : 'div',
				elements:[{
					eName : 'span',
					text: "导入状态"
					
				}, {
					eName:"combogrid",
					name:"stateCode",
					idField: 'stateCode',
			        textField: 'stateName',
			        panelHeight:$.browser.msie9?200:'auto',
					panelMaxHeight:200,
					width:80,
					multiple:true,
			        allFlag:true,
					columns:[[
						{field:'stateCode',checkbox:true},
						{field:'stateName',title:'全部'}
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
				cssClass : 'excel_query_div',
				elements : {
					eName : 'div',
					elements : [{
						eName : 'linkbutton',
						uId:"tm1",
						width:60,
						height:30,
						cssClass:'excel_query_chaxun',
						text:"查询",
						onClick : function(){
							dataTable.datagrid("loadEx",{url:excelQuery});
						}
					}]
			}}
			]
		}];
	var centerUI = {
			eName : 'datagrid',
			id:"dataTable",
			//url : excelQuery,
			//queryForm:"searchForm",
			idField : 'id',
			toolbarEx : toolBar,// 查询条件工具栏
			columns : columns,
			pagination: true,//分页
			clientPager:true,
			showFooter:false,
			autoload : false,
			singleSelect:true,
			checkOnSelect:true,
			selectOnCheck:true,
			onBeforeLoadEx:function(params){
				if(params.sub_month_begin>params.sub_month_end){
					$.alert("开始月份不能大于结束月份！");
					return false;
				}
			},
			onLoadSuccessEx:function(retJson){
				gly_no.combogrid("clear");
				batch_no.combogrid("clear");
				stateCode.combogrid("clear");
				fuzzy.textbox("clear");
				if(retJson.id==0){
					
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
	var gly_no = jqObj.findJq("gly_no");
	var stateCode = jqObj.findJq("stateCode");
	var dataTable = jqObj.findJq("dataTable");
	var sub_month_begin = jqObj.findJq("sub_month_begin");
	var sub_month_end = jqObj.findJq("sub_month_end");
	var batch_no = jqObj.findJq("batch_no");
	var fuzzy = jqObj.findJq("fuzzy");
	var date = new Date();
	
//	document.onkeydown=function(event){
//		var e = event || window.event || arguments.callee.caller.arguments[0];
//		if(e && e.keyCode==13){ // enter 键
//			dataTable.datagrid("load");
//	    }
//	};
	
	//键盘回车事件
	batch_no.textbox("textbox").keydown(function(e){
		var key = e.keyCode;//兼容firefox
		if(key == 13){
			dataTable.datagrid("loadEx",{url:excelQuery});
		}
	});
	fuzzy.textbox("textbox").keydown(function(e){
		var key = e.keyCode;//兼容firefox
		if(key == 13){
			dataTable.datagrid("loadEx",{url:excelQuery});
		}
	});
	
	loadInit();
	
	loadGlyList();//加载管理员列表
	
	loadExcelState();//加载导入状态
	
	loadBatchNo();
	
	function loadInit(){
		var y = date.getFullYear();
		var m = date.getMonth()+1;
		//sub_month_begin.findJqUI().setDate(y+"-"+(m<10?"0"+m:m));
		if(m==12){
			sub_month_end.findJqUI().setDate(y+1+"-"+'01');
		}else{
			sub_month_end.findJqUI().setDate(y+"-"+((m+1)<10?"0"+(m+1):(m+1)));
		}
	}
	
	function loadGlyList(){
		$.postEx(glyQuery,function(retJson){
			if(retJson.result && retJson.data){
				var glyGrid = gly_no.combogrid("grid");
				glyGrid.datagrid("loadDataEx",retJson.data);
			}
		});
	}
	
	function loadBatchNo(newValue,oldValue){
		var params = {};
		var beginui = jqObj.findJqUI("sub_month_begin");
		var endui = jqObj.findJqUI("sub_month_end");
		//$.print(beginui,endui,gly_no);
		if(beginui == undefined || endui == undefined 
				|| gly_no == undefined)
			return;
		//$.print(gly_no.combo("getValues").join());
		params['sub_month_begin'] = beginui.getDate();
		params['sub_month_end'] = endui.getDate();
		params['gly_no'] = gly_no.combo("getValues").join();
		$.postEx(excelQueryBatch,params,function(retJson){
			if(retJson.result && retJson.data){
				var batchGrid = batch_no.combogrid("grid");
				batchGrid.datagrid("loadDataEx",retJson.data);
			}
		});
	}
	
	function loadExcelState(){
		$.postEx(excelStateQuery,function(retJson){
			if(retJson.result && retJson.data){
				var stateGrid = stateCode.combogrid("grid");
				stateGrid.datagrid("loadDataEx",retJson.data);
			}
		});
	}
	
	//扩展验证
	$.extend($.fn.validatebox.defaults.rules, {    
        number: {// 正整数验证
            validator: function (value) {
                return /^[1-9]\d*$/i.test(value);
            },
            message: '请输入正确数字'
        }
	});  

});
