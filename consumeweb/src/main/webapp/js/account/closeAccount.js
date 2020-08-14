//销户
garen_define("js/account/closeAccount",function (jqObj,loadParams) {
	
	//webService
	var base = garen_require("js/base/ws_public");
	
	var checkCoreIp = base.checkCoreIp;//核心业务IP授权验证
	
	var depQuery = base.depQuery;//部门查询
	
	var ideQuery = base.ideQuery;//身份查询
	
	var userImport = "account/closeAccount/userImport.do";//列表导入
	
	var query = "account/closeAccount/query.do";//筛选查询
	
	var allReadCard = base.allReadCard;//读卡
	
	var allReadIdCard = base.allReadIdCard;//读身份证
	
	var jmjlink = garen_require("js/lib/jmjlink");//卡控件
	
	var scmurl = garen_require("js/lib/scmurl");//url地址
	
	var account_rows = "";
	
	var rD = "";//读卡时把id和卡号等存下来，操作时对比id，成功则提交卡号等
	
	var importFlag = 0;//列表导入标志
	
	//工具栏
	var toolBar = [null, {
		eName:"div",
		height : 10,
		cssStyle : 'background:#ffffff;'
	},{
		eName : 'div',
		//cssClass : 'closeAccount_line',
		elements : {
			eName:"formUI",
			id:"importForm",
			url:userImport,
			method:"post",//上传表单时，必须设置此值
			alertFlag:true,
			progressBar:"保存中...",
			enctype:"multipart/form-data",//上传附件时，必须设置此值
			onSave:function(retJson){
				if(retJson.result){
					//dataTable.datagrid("clearChecked");
//					rData = retJson.data;
//					var data = {};
//					data['id'] = 0;
//					data['rows'] = retJson.data.slice(0,30);
					importFlag = 1;
					dataTable.datagrid("loadDataEx",retJson.data);
					//empListPage();
				}else{
					if(retJson.data.length>0){
						var myWin = $.createWin({
							title:"系统提示信息",
							width:580,
							height:550,
							queryParams:{
								params:retJson.info,
								params2:retJson.data
							},
							url:"js/account/openAccount_importWin.js"
						});
						//$.alert(retJson.info+"<br/>"+$.toJSON(retJson.data));
					}else{
						$.alert(retJson.info);
					}
				}
			},
			elements:{
				eName : 'div',
				cssClass : 'closeAccount_toolBar_second',
				elements : {
					eName : 'div',
					elements : [{
						eName : 'filebox',
						buttonText:'选择文件',
						width : 320,
						height : 31,
						uId:"tm1",
						id : "forFile",
						name:'userFile'
					},
//					{
//						eName:"label",
//						uId:"tm1",
//						'for':'upFile',
//						cssClass:'l-btn',
//						text:"浏览"
//					},{
//						eName:'input',
//						name:'userFile',
//						id:'upFile',
//						type:'file',
//						cssClass:"closeAccount_file_input",//在IE8下dispaly:none;会导致label不好用。
//						onChange:function(){
////							forFile.textbox("setValue",$(this).val());
////							forFile.textbox("setText",$(this).val());
//							var path = $(this).val();
//							var result = path.match(/\\([^\\]+)$/i);
//							if(result){
//								path = result[1];
//							}
//							forFile.textbox("setValue",path);
//							forFile.textbox("setText",path);
//						}
//					},{
//						eName : 'textbox',
//						id : "forFile",
//						editable:false,
//						name : '',
//						width : 350,
//						height : 25,		
//						value:''//默认值
//					},
					{
						eName : 'linkbutton',
						uId:"tm2",
						width:65,
						height:31,
						text:"导入",
						onClick : function(){
							var fileExtension = forFile.textbox("getValue").split('.').pop().toLowerCase();
							if(forFile.textbox("getValue")=="" || fileExtension != "xls" && fileExtension != "xlsx"){
								$.alert("请选择正确文件！");
							}else{
								importForm.submit();
							}
						}
					},{
						eName : 'linkbutton',
						uId:"tm1",
						width:65,
						height:31,
						text:"下载模版",
						onClick : function(){
							window.location.href="import_mould/closeAccountMould.xls";
						}
					}]
				}
			}
		}
	}, {
		eName : 'div',
		cssClass : 'closeAccount_toolBar_third',
		elements : [{
			eName : 'div',
			cssClass:"first_div",
			elements : {
				eName:"formUI",
				id:'searchForm',
				elements:[{
					eName : 'div',
					elements : [{
						eName : 'span',
						elements : '学/工号&ensp;',
						cssClass:"first_div_span"
						},{
							eName : 'textbox',
							name : 'user_no',
							width : 150,
							height : 25,
							value:'',//默认值
							validType:"number"
						},{
							eName : 'span',
							elements : '部&emsp;门',
							cssClass:"first_div_span"
						},{
							eName : 'combotree',
							name:"dep_serial",
							id : 'depTree',
							multiple:true,
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
						text : '身份类型',
						cssClass:"first_div_span"
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
						eName : 'span',
						elements : '有效期',
						cssClass:"first_div_span"
					},{
						eName : 'textbox',
						name : 'year',
						prompt:'年',	
						width : 60,
						height : 25,		
						value:''//默认值
					},{
						eName : 'span',
						text:'-'
					},{
						eName : 'textbox',
						name : 'month',
						prompt:'月',	
						width : 40,
						height : 25,		
						value:''//默认值
					},{
						eName : 'span',
						text:'-'
					},{
						eName : 'textbox',
						name : 'day',
						prompt:'日',	
						width : 40,
						height : 25,		
						value:''//默认值
					}]
				}]
			}
		},{
			eName : 'div',
			elements : [{
				eName : 'linkbutton',
				uId:"tm1",
				width:65,
				height:65,
				text:"查询",
				onClick : function(){
					//dataTable.datagrid("clearChecked");
					//dataTable.datagrid("loadEx",{url:query});
					searchWin(0);
				}
			},{
				eName : 'linkbutton',
				uId:"tm1",
				width:65,
				height:65,
				text:"读卡",
				onClick : readCard
			}
			/*,{
				eName : 'linkbutton',
				uId:"tm1",
				//disabled:true,
				width:65,
				height:65,
				text:"读身份证",
				onClick : readIdCard
			}*/
			]
		},{
			eName:"div",
			cssClass:"third_div",
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
      	[ {
       		field : 'c',
       		title : 'c',
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
       		width : 80
       	}, {
       		field : 'dep_name',
       		title : '部门',
       		align : "center",
       		width : 100
       	}, {
       		field : 'user_duty',
       		title : '身份类型',
       		align : "center",
       		width : 160
       	}, {
       		field : 'user_id',
       		title : '身份证号',
       		align : "center",
       		width : 160
       	}, {
       		field : 'account_end_date_str',
       		title : '有效期',
       		align : "center",
       		width : 160
       	}, {
       		field : 'cash_amt_str',
       		title : '现金余额',
       		align : "center",
       		width : 130
       	}, {
       		field : 'meal_sub_sum_str',
       		title : '补贴余额',
       		align : "center",
       		width : 160
       	}, {
       		field : 'deposit_amt_str',
       		title : '押金余额',
       		align : "center",
       		width : 160
       	}, {
       		field : 'account_state_mc',
       		title : '状态',
       		align : "center",
       		width : 80
       	}
//       	, {
//       		field : 'result',
//       		title : '操作结果',
//       		align : "center",
//       		width : 80
//       	}
       	] ];
	
	var centerUI = {
		eName : 'datagrid',
		idField:'account_id',
		id:"dataTable",
		//url : query,
		queryForm:"searchForm",
		toolbarEx : toolBar,// 查询条件工具栏
		columns : columns,
		pagination: true,
		clientPager:true,
		autoload : false,
		singleSelect:false,
		checkOnSelect:true,
		selectOnCheck:true,
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
				user_no.textbox("clear");
				depTree.combotree("clear");
				ideList.combogrid("clear");
				year.textbox("clear");
				month.textbox("clear");
				day.textbox("clear");
				data_count.html(dataTable.datagrid("getCheckedEx").length);
			}else{
				$.alert(retJson.info);
			}
		}
	};
	
	var southUI = {
		eName : 'div',
		cssClass: 'closeAccount_south_div',
		elements : [{
			eName : 'linkbutton',
			uId:"tm1",
			text : "<span style='font-size:20px;'>销户</span>",
			id : "xiaohu",
			cssClass : 'closeAccount_linkbuttonxh',
			width : 220,
			height : 60,
			onClick:closeAccount
		}]
	}

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
	var user_no = jqObj.findJq("user_no");
	var xiaohu = jqObj.findJq("xiaohu");
	var importForm = jqObj.findJqUI("importForm");
	var forFile = jqObj.findJq("forFile");
	var depTree = jqObj.findJq("depTree");
	var ideList = jqObj.findJq("ideList");
	//var fuzzy = jqObj.findJq("fuzzy");
	var data_count = jqObj.findJq("data_count");
	var year = jqObj.findJq("year");
	var month = jqObj.findJq("month");
	var day = jqObj.findJq("day");
	
	//销户
	function closeAccount(){
		var params = {};
		var ids = [];
		var rows = dataTable.datagrid("getCheckedEx");
		if(rows.length<1){
			$.alert("至少选择一条记录！");
		}else{
			$.confirm('是否要对已选的人员进行销户？',function(c){
        		if(c){
        			var myWin = $.createWin({
						title:"操作提示",
						width:600,
						height:400,
						queryParams:{
							params:rows,
							rData:rD,
							callback:refresh
						},
						url:"js/account/closeAccount_closeWin.js"
					});
        		}
        	});
//			$.each(rows,function(i, row){
//				ids.push(row.account_id);
//			});
//			account_rows = rows;
//			params['account_id_str'] = ids.join();
//			var myWin = $.createWin({
//				title:"销户",
//				width:290,
//				height:220,
//				queryParams:{
//					params:params,
//					rData:rD,
//					callback:refresh
//				},
//				url:"js/account/closeAccount_delWin.js"
//			});
		}
	}
	
	loadTree();//加载选择部门树
	loadIdeList();//加载身份列表
	
//	document.onkeydown=function(event){
//		var e = event || window.event || arguments.callee.caller.arguments[0];
//		if(e && e.keyCode==13){ // enter 键
//			dataTable.datagrid("clearChecked");
//			dataTable.datagrid("load");
//	    }
//	};
	
	//销户列表本地分页
//	function empListPage(){
//		var pager = dataTable.datagrid("getPager"); 
//	    pager.pagination({ 
//	    	total:rData.length,
//	    	//showPageList:false,
//	    	//beforePageText:'',//页数文本框前显示的汉字 
//	        //afterPageText:'', 
//	       // displayMsg:'', 
//	        onSelectPage:function (pageNo, pageSize) { 
//	        	var start = (pageNo - 1) * pageSize; 
//	        	var end = start + pageSize; 
//	        	var data = {};
//	        	//data['id'] = 0;
//	        	//data['rows'] = rData.slice(start, end)
//	        	//dataTable.datagrid("loadData", data); 
//	        	//加载数据
//	        	addList.datagrid("loadDataEx", {id:0,rows:data.slice(start, end),
//	        		total:data.length,pageNumber:pageNo}); 
//	        } 
//	    }); 
//	}
	
	//键盘回车事件
	user_no.textbox("textbox").keydown(function(e){
		var key = e.keyCode;//兼容firefox
		if(key == 13){
			//dataTable.datagrid("clearChecked");
			searchWin(0);
			//dataTable.datagrid("loadEx",{url:query});
		}
	});
	year.textbox("textbox").keydown(function(e){
		var key = e.keyCode;//兼容firefox
		if(key == 13){
			//dataTable.datagrid("clearChecked");
			searchWin(0);
			//dataTable.datagrid("loadEx",{url:query});
		}
	});
	month.textbox("textbox").keydown(function(e){
		var key = e.keyCode;//兼容firefox
		if(key == 13){
			//dataTable.datagrid("clearChecked");
			searchWin(0);
			//dataTable.datagrid("loadEx",{url:query});
		}
	});
	day.textbox("textbox").keydown(function(e){
		var key = e.keyCode;//兼容firefox
		if(key == 13){
			//dataTable.datagrid("clearChecked");
			searchWin(0);
			//dataTable.datagrid("loadEx",{url:query});
		}
	});
//	fuzzy.textbox("textbox").keydown(function(e){
//		var key = e.keyCode;//兼容firefox
//		if(key == 13){
//			dataTable.datagrid("clearChecked");
//			dataTable.datagrid("load");
//		}
//	});
	
	loadInit();
	
	function loadInit(){
		$.postEx(checkCoreIp,{'op_name':'销户'},function(retJson){
			if(retJson.result){
				
			}else{
				$.alert(retJson.info,function(){
					//window.parent.location.reload();
					window.top.location.href=scmurl;
				});
			}
		});
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
			//$.print(retJson);
			if(retJson.result && retJson.data){
				var ideGrid = ideList.combogrid("grid");
				ideGrid.datagrid("loadDataEx",retJson.data);
			}
		});
	}
	
	function refresh(){
		if(importFlag){//导入的数据要清空
			importFlag = 0;
			dataTable.datagrid("loadDataEx",{id:0,total:0,rows:[]});
		}else{
			dataTable.datagrid("reloadEx");
		}
	}
	
//	function refresh(account_id,succ_id){
//		if(account_id){//失败
//			//$.print(account_rows);
//			$.each(account_rows,function(i, row){
//				//$.print(row.account_id);
//				var index = dataTable.datagrid("getRowIndex",row);
//				var param = {};
//				if(row.account_id == account_id){
//					param['result'] = "失败";
//					dataTable.datagrid("updateRow",{
//						index:index,
//						row:param
//					});
//				}
//			});
//			var ids = [];
//			var si = succ_id.substring(0,succ_id.length-1);
//			ids = si.split(",");
//			//$.print(ids);
//			$.each(account_rows,function(i, row){
//				var index = dataTable.datagrid("getRowIndex",row);
//				var param = {};
//				$.each(ids,function(i, id){
//					if(row.account_id == id){
//						param['result'] = "成功";
//						dataTable.datagrid("updateRow",{
//							index:index,
//							row:param
//						});
//					}
//				});
//				
//			});
//		}else{//成功
//			$.each(account_rows,function(i, row){
//				var index = dataTable.datagrid("getRowIndex",row);
//				var param = {};
//				param['account_state_mc'] = "已销户";
//				param['result'] = "成功";
//				dataTable.datagrid("updateRow",{
//					index:index,
//					row:param
//				});
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
			//depTree.combotree("setValue",retJson.data[0].dep_serial);
			//ideList.combo("setValue",retJson.data[0].ident_id);
			depTree.combotree("clear");
			ideList.combogrid("clear");
			
			user_no.textbox("setText","");
			var param = {};
			param['account_id'] = retJson.data[0].account_id;
			rD = param;
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
			rD = "";
		}
		dataTable.datagrid("loadEx",{url:query,'cx_type':cx_type});
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
//							//user_lname.textbox("setValue",retJson.data[0].user_lname);
//							//user_id.textbox("setValue",retJson.data[0].user_id);
//							ideList.combobox("setValue",retJson.data[0].ident_id);
//							param['account_id'] = retJson.data[0].account_id;
//							rD = param;
//							successBeep();
//							//dataTable.datagrid("clearChecked");
//							dataTable.datagrid("loadEx",{url:query});
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
	year.next().children().eq(0).attr("maxlength",4);
	month.next().children().eq(0).attr("maxlength",2);
	day.next().children().eq(0).attr("maxlength",2);
	//fuzzy.next().children().eq(0).attr("maxlength",10);
	
	//扩展验证
	$.extend($.fn.validatebox.defaults.rules, {    
		 number: {// 半角字符验证
             validator: function (value) {
                 //return /^[+]?[1-9]+\d*$/i.test(value);

                 return /^([+]?[A-Za-z0-9_-])+\d*$/i.test(value);
             },
             message: '只能输入数字、字母、下划线、短横线'
         }
	});  
});
	