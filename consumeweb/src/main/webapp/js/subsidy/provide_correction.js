//补贴纠错
garen_define("js/subsidy/provide_correction", function(jqObj, loadParams) {
	var utils = garen_require("utils");
	var correctionQuery = "subsidy/correctionQuery.do";
	var correctionQueryBatch = "subsidy/correctionQueryBatch.do";
	var correctionQueryState = "subsidy/correctionQueryState.do";
	var scmurl = garen_require("js/lib/scmurl");//url地址
	var correction_rows = "";
	
	var base = garen_require("js/base/ws_public");
	
	var checkCoreIp = base.checkCoreIp;//核心业务IP授权验证
	
	var glyQuery = base.glyQuery;//管理员查询
	
	// 工具栏
	var toolBar = [ null, {
		eName : 'div',
		height : 10,
		cssStyle : 'background:#ffffff;'
	}, {
		eName : 'div',
		cssClass : 'correction_toolBar_second',
		elements : {
			eName : 'div',
			cssClass:"div_first",
			elements : [ {
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
			}, {
				eName:"span",
				text:"管理员"
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
			}, {
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
			}, {
				eName : 'span',
				text: "记录类型"
			}, {
//				eName:"combobox",
//				name:"undo_state",
//				panelHeight:$.browser.msie9?200:'auto',
//				panelMaxHeight:200,
//				valueField: 'label',    
//		        textField: 'value',
//				editable:false,
////				value:'补贴',//默认值
//				width:80,
//				data:[
//					{label:'subsidy',value:'补贴',width:60,selected:true,},
//					{label:'error_correct',value:'纠错',width:100},
//					{label:'end_correct',value:'已纠错',width:100},
//				]
				eName:"combogrid",
				name:"undo_state",
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
			}, {
				eName:"textbox",
				name:"fuzzy",
				prompt:'请输入工号、姓名模糊查询',
//				validType:"number",
				width:155
			}, {
				eName : 'linkbutton',
				uId:"tm1",
				cssClass : 'correction_linkbutton',
				width : 65,
				height : 30,
				text : "查询",
				onClick : function() {
					//dataTable.datagrid("clearChecked");
					dataTable.datagrid("loadEx",{url:correctionQuery});
				}
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
		width : 145
	}, {
		field : 'sub_month',
		title : '补贴月份',
		align : "center",
		width : 80
	}, {
		field : 'batch_no',
		title : '批次',
		align : "center",
		width : 60
	}, {
		field : 'sub_amt_str',
		title : '补贴金额',
		align : "center",
		width : 80
	}, {
		field : 'op_result',
		title : '记录类型',
		align : "center",
		width : 80
	}, {
		field : 'begin_date_str',
		title : '启用日期',
		align : "center",
		width : 80
	}, {
		field : 'end_date_str',
		title : '有效日期',
		align : "center",
		width : 80
	}, {
		field : 'operator',
		title : '操作员',
		align : "center",
		width : 80
	}, {
		field : 'sj_str',
		title : '操作时间',
		align : "center",
		width : 140
	}
	/*, {
		field : 'op_result2',
		title : '操作结果',
		align : "center",
		width : 200
	}*/
	] ];
	
	
	var centerUI = {
		eName : 'datagrid',
		idField : 'sub_slave_id',
		id:"dataTable",
		toolbarEx : toolBar,// 查询条件工具栏
		columns : columns,
		pagination : true,
		clientPager:true,
		alertFlag : false,// 是否弹出默认对话框
		showFooter: true,
		autoload : false,
		singleSelect : false,
		checkOnSelect : true,
		selectOnCheck : true,
		onBeforeLoadEx:function(params){
		},
		onLoadSuccessEx:function(retJson){
			if(retJson.id==0){
				money_span.html(retJson.retData[0].subamts_str);
			}else{
				$.alert(retJson.info);
			}
		}

	};
	
	var southUI = [{
		eName:'div',
		cssStyle:"height:100%;",
		elements:[{
			eName : 'div',
			cssStyle:"position:absolute;width:40%;margin:30px 0 10px 40px;display:inline-block;",
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
			
		},{
			eName : 'div',
			cssStyle:"position:absolute;margin-left:20%;width:60%;text-align:center;display:inline-block;",
			height:95,
			elements : [{
				eName : 'linkbutton',
				uId:"tm2",
				text : "<span style='font-size:20px;'>补贴发放纠错</span>",
				id : "kaihu",
				cssClass : 'correction_linkbutton',
				cssStyle : 'margin-top:20px;',
				width : 220,
				height : 60,
				onClick:subCorrect
			},]
		}
//		,{
//			eName:'div',
//			cssStyle:"width:20%;text-align:center;display:inline-block;",
//			elements:[{
//				eName : 'linkbutton',
//				uId:"tm1",
//				text : '打印',
//				cssStyle : 'position:absolute;right:130px;top:30px;',
//				width : 70,
//				height : 38,
//				onClick:function(){
//					if(dataTable.datagrid('getRows').length==0){
//						$.alert("数据为空");
//					}else{
//						utils.printGrid("补贴发放纠错账户",dataTable);
//					}
//				}
//			},{
//				eName : 'linkbutton',
//				uId:"tm1",
//	//			text : '取消',
//				text:'返回主界面',
//				cssStyle : 'position:absolute;right:40px;top:30px;',
//				width : 70,
//				height : 38,
//				onClick:function(){
//					try{
//	//					window.top.main_iframe.ChangUrl("M000",0,"");
//						window.location = "http://" + loadParams.login_wtop + "/r_home.asp";
//					}
//					catch(e){
//						
//					}
//				}
//			}]
//		}
	]
	}];
	
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
	var money_span = jqObj.findJq("money_span");
	var batch_no = jqObj.findJq("batch_no");
	var undo_state = jqObj.findJq("undo_state");
	var gly_no = jqObj.findJq("gly_no");
	var sub_month_begin = jqObj.findJq("sub_month_begin");
	var sub_month_end = jqObj.findJq("sub_month_end");
	
//	document.onkeydown=function(event){
//		var e = event || window.event || arguments.callee.caller.arguments[0];
//		if(e && e.keyCode==13){ // enter 键
//			dataTable.datagrid("clearChecked");
//			dataTable.datagrid("reload");
//	    }
//	};
	
	loadInit();
	loadGlyList();//加载管理员列表
	loadBatchNo();
	loadUndoState();
	
	function loadInit(){
		
		$.postEx(checkCoreIp,{'op_name':'补贴发放纠错'},function(retJson){
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
		var m = date.getMonth()+1;
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
	
	function loadUndoState(){
		$.postEx(correctionQueryState,function(retJson){
			if(retJson.result && retJson.data){
				var usGrid = undo_state.combogrid("grid");
				usGrid.datagrid("loadDataEx",retJson.data);
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
		$.postEx(correctionQueryBatch,params,function(retJson){
			if(retJson.result && retJson.data){
				var batchGrid = batch_no.combogrid("grid");
				batchGrid.datagrid("loadDataEx",retJson.data);
			}
		});
	}
	
	//键盘回车事件
	batch_no.textbox("textbox").keydown(function(e){
		var key = e.keyCode;//兼容firefox
		if(key == 13){
			//dataTable.datagrid("clearChecked");
			dataTable.datagrid("loadEx",{url:correctionQuery});
		}
	});
	
	function subCorrect(){
		var rows = dataTable.datagrid("getCheckedEx");
		//$.print(rows);
		if(rows.length<1){
			$.alert("至少选择一条记录！");
		}else{
			$.confirm('是否要对已选的人员进行补贴纠错？',function(c){
        		if(c){
        			correction_rows = rows;
        			var myWin = $.createWin({
        				title:"补贴纠错",
        				width:600,
        				height:400,
        				queryParams:{
        					params:rows,
        					callback:refresh
        				},
        				url:"js/subsidy/correction_configWin.js"
        				//url:"js/subsidy/correction_addCorr.js"
        			});
        		}
			});
		}
	}
	
	function refresh(){
		dataTable.datagrid("reloadEx");
	}
	
//	function loadInit(){
//		dataTable.datagrid("reload");
//	}
	
	/*function refresh(params,datas){
		//$.print(params,datas);
		if(datas){//失败
			//$.print(datas,correction_rows);
			$.each(datas,function(i, data){
				$.each(correction_rows,function(c, row){
					//var index = dataTable.datagrid("getRowIndex",row);
					//$.print(row.sub_slave_id,data.slave_id);
					if(row.sub_slave_id == data.slave_id){
//						var param = {};
//						param['op_result2'] = "失败，"+data.error_msg;
//						dataTable.datagrid("updateRowEx",{
//							index:index,
//							row:param
//						});
						row.op_result2 = "失败，"+data.error_msg;
						var num = dataTable.datagrid('getRowPageNum',row);
						dataTable.datagrid('gotoPage',num);
					}else if(i==datas.length-1 && row.op_result2==""){
						//$.print(row.sub_slave_id);
						//var param = {};
						if(params.begin_date){
							//param['begin_date_str'] = params.begin_date;
							row.begin_date_str = params.begin_date;
						}
						if(params.end_date){
							//param['end_date_str'] = params.end_date;
							row.end_date_str = params.end_date;
						}
						if(params.sub_amt){
							//param['sub_amt_str'] = params.sub_amt;
							row.sub_amt_str = params.sub_amt;
						}
//						param['op_result2'] = "成功";
//						dataTable.datagrid("updateRowEx",{
//							index:index,
//							row:param
//						});
						row.op_result2 = "成功";
						var num = dataTable.datagrid('getRowPageNum',row);
						dataTable.datagrid('gotoPage',num);
					}
				});
			});
			//更新金额统计
			var rows = dataTable.datagrid("getRows");
			var count = 0;
			$.each(rows,function(i, row){
				var cbm = Math.round(Number(count)*100); 
				var nv = Math.round(row.sub_amt_str*100); 
				var v = cbm + nv;
				count = v/100 + "";
			});
			if(count.indexOf(".")==-1){
				money_span.html(count+".00");
			}
			else if(count.length - count.indexOf(".") - 1 == 1){
				money_span.html(count+"0");
			}
			else{
				money_span.html(count);
			}
		}else{//成功
			$.each(correction_rows,function(i, row){
//				var index = dataTable.datagrid("getRowIndex",row);
//				var param = {};
//				//$.print(params.begin_date,params.sub_amt);
//				if(params.begin_date){
//					param['begin_date_str'] = params.begin_date;
//				}
//				if(params.end_date){
//					param['end_date_str'] = params.end_date;
//				}
//				if(params.sub_amt){
//					param['sub_amt_str'] = params.sub_amt;
//				}
//				param['op_result2'] = "成功";
//				dataTable.datagrid("updateRowEx",{
//					index:index,
//					row:param
//				});
				if(params.begin_date){
					row.begin_date_str = params.begin_date;
				}
				if(params.end_date){
					row.end_date_str = params.end_date;
				}
				if(params.sub_amt){
					row.sub_amt_str = params.sub_amt;
				}
				row.op_result2 = "成功";
				var num = dataTable.datagrid('getRowPageNum',row);
				dataTable.datagrid('gotoPage',num);
			});
			//更新金额统计
			var rows = dataTable.datagrid("getRows");
			var count = 0;
			$.each(rows,function(i, row){
				var cbm = Math.round(Number(count)*100); 
				var nv = Math.round(row.sub_amt_str*100); 
				var v = cbm + nv;
				count = v/100 + "";
			});
			if(count.indexOf(".")==-1){
				money_span.html(count+".00");
			}
			else if(count.length - count.indexOf(".") - 1 == 1){
				money_span.html(count+"0");
			}
			else{
				money_span.html(count);
			}
		}
	}*/
	
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
