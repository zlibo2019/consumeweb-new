//开户
garen_define("js/account/openAccount",function (jqObj,loadParams) {
	var utils = garen_require("utils");
	//webService
	var base = garen_require("js/base/ws_public");
	
	var scmurl = garen_require("js/lib/scmurl");//url地址
	
	var checkCoreIp = base.checkCoreIp;//核心业务IP授权验证
	
	var depQuery = base.depQuery;//部门查询
	
	var jmjlink = garen_require("js/lib/jmjlink");//卡控件
	
	var ideQuery = base.ideQuery;//身份查询
	
	var query = "account/query.do";//根据条件查询
	
	var userImport = "account/userImport.do";//列表导入
	
	var refresh = "account/accountRefresh.do";//设置后刷新列表
	
	var allReadIdCard = base.allReadIdCard;//读身份证
	
//	var openAccount = "account/accountOpen.do";//开户
	
	var color_id = "";//发卡id
	
	var color_i = "";//发卡颜色0绿（正在发卡），1红（发卡失败）
	
	var rData = "";//列表导入数据
	
	function _2e(_2f) {
		var _30 = [];
		var _31 = $.data(_2f, "combo").combo;
		_31.find(".textbox-value").each(function () {
			_30.push($(this).val());
		});
		return _30;
	};
	
	//工具栏
	var toolBar = [null,{
		eName:"div",
		height : 10,
		cssStyle : 'background:#ffffff;'
	},
//	{
//		eName : 'div',
//		cssClass:"openAccount_toolBar_first",
//		elements : [{
//			eName : 'div',
//			cssClass:"div1",
//			elements : {
//				eName:"img",
//				src:"image/1.gif"
//			}
//		},{
//			eName : 'div',
//			cssClass:"div2",
//			elements : "开户"
//		},{
//			eName : 'div',
//			cssClass:"div3",
//			elements : {
//				eName:"img",
//				src:"image/arrow.gif"
//			}
//		},{
//			eName : 'div',
//			cssClass:"div4",
//			elements : {
//				eName:"img",
//				id:"img_faka",
//				src:"image/2-1.gif"
//			}
//		},{
//			eName : 'div',
//			cssClass:"div2",
//			//id:"text_faka",
//			elements : "发卡"
//		}]
//	}, 
	{
		eName:"formUI",
		id:"importForm",
		url:userImport,
		method:"post",//上传表单时，必须设置此值
		alertFlag:true,
		progressBar:"保存中...",
		enctype:"multipart/form-data",//上传附件时，必须设置此值
		onSave:function(retJson){
			if(retJson.result){
				//$.print(retJson);
				//dataTable.datagrid("reload");
//				rData = retJson.data;
//				var data = {};
//				data['id'] = 0;
//				data['rows'] = retJson.data.slice(0,30);
//				dataTable.datagrid("loadData",data);
//				empListPage();
				dataTable.datagrid("loadDataEx",retJson.data);
			}else{
//				var datas = [];
//				$.each(retJson.data,function(i, data){
//					
//				});
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
			cssClass : 'openAccount_toolBar_second',
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
				            
//				{
//					eName : 'textbox',
//					id : "forFile",
//					editable:false,
//					name : '',
//					width : 350,
//					height : 29,		
//					value:''//默认值
//				},{
//					eName:'input',
//					name:'userFile',
//					id:'upFile',
//					type:'file',
//					cssClass:"openAccount_file_input",//在IE8下dispaly:none;会导致label不好用。
//					onChange:function(){
//						var path = $(this).val();
//						var result = path.match(/\\([^\\]+)$/i);
//						if(result){
//							path = result[1];
//						}
//						forFile.textbox("setValue",path);
//						forFile.textbox("setText",path);
//					}
//				},{
//					eName:"label",
//					uId:"tm1",
//					'for':'upFile',
//					cssClass:'l-btn',
//					text:"浏览"
//				},
				{
					eName : 'linkbutton',
					uId:"tm2",
					width:65,
					height:31,
					text:"导入",
					onClick : function(){
						/*var boxgrid = jqObj.find('#ideList');
						var txtbox = boxgrid.combo('textbox');
						//var txtObj = txtbox.textbox('textbox');
						var v = boxgrid.combo("getValues");*/
						
						//$.print(txtbox.textbox('textbox'));
						//var box = dataTable.datagrid('getPanel').find('div.datagrid-header-check input[type=checkbox]');
						//$.print(box);
						//box.prop('checked',false);
						//dataTable.datagrid('clearChecked');
						//var rows = dataTable.datagrid('getCheckedEx');
						//$.print(rows);
						//dataTable.datagrid('loadDataEx',{total:5,rows:rows.slice(22,27),id:0});
						//dataTable.datagrid('clearChecked');
						//dataTable.datagrid('updateOrderNum',3);
//						$.print(dataTable.datagrid('reloadEx'));
//						return;
//						dataTable.datagrid('updateRowEx',{
//							index:3,
//							row:{
//									dep_name:"hello"
//								}
//							});
						//$.print(rows);
						//return;
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
						window.location.href="import_mould/openAccountMould.xls";
					}
				}]
			}
		}
	}, {
		eName : 'div',
		cssClass:"openAccount_toolBar_third",
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
							elements : '部&emsp;&emsp;门',
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
						text : '身份证号',
						cssClass:"first_div_span"
					},{
						eName : 'textbox',
						name : 'user_id',
						//validType:"idCard",
						width : 150,
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
					dataTable.datagrid("loadEx",{url:query});
				}
			},{
				eName : 'linkbutton',
				uId:"tm1",
				//disabled:true,
				width:65,
				height:65,
				text:"读身份证",
				onClick : readIdCard
			}]
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
		}
//		{
//			eName:"div",
//			cssClass:"third_div",
//			elements:{
//				eName : 'linkbutton',
//				uId:"tm2",
//				id:"config",
//				width:85,
//				height:35,
//				text:"设置",
//				onClick : function(){
//					var rows = dataTable.datagrid("getCheckedEx");
//					var flag = 1;
//					$.each(rows, function (i, row) {
//		            	if(row.account_state_code==1){
//		            		$.alert("存在已开户的人员！");
//		            		flag = -1;
//		            		return false;
//		            	}
//		            	else if(row.account_state_code==2){
//		            		$.alert("存在已发卡的人员！");
//		            		flag = -1;
//		            		return false;
//		            	}
//		            	else if(row.account_state_code==3){
//		            		$.alert("存在重复操作的人员！");
//		            		flag = -1;
//		            		return false;
//		            	}
//		            	else if(row.account_state_code==4){
//		            		$.alert("存在重复发卡的人员！");
//		            		flag = -1;
//		            		return false;
//		            	}
//		            });
//					if(flag==1){
//						if(fingerBox[0].checked){
//							fingerBox[0].value = 1;
//						}
//						configForm.submit();
//					}
//				}
//			}
//		},{
//			eName : 'div',
//			cssClass:"fourth_div",
//			elements : {
//				eName:"formUI",
//				id:"configForm",
//				method:"post",//上传表单时，必须设置此值
//				url:configAdd,
//				alertFlag:false,
//				//progressBar:"保存中...",
//				onBeforeSave:function(params){
//					var rows = dataTable.datagrid("getCheckedEx");
//					if(rows.length == 0){
//						$.alert("请选择一条记录！");
//						return false;
//					}
//		            var ids = [];//主键数组
//		            $.each(rows, function (i, row) {
//		            	if(row.account_state_code==1){
//		            		return false;
//		            	}
//		                ids.push(row.id);
//		            });
//	  				params['ids'] = ids.join(',');//主键参数
//					
//				},
//				onSave:function(retJson){
//					if(retJson.result){
////						$.postEx(refresh,function(retJson){
////							if(retJson.result && retJson.data){
////								dataTable.datagrid("loadData",retJson);
////							}else{
////								$.alert(retJson.info);
////							}
////						});
//						//fresh();
//						loadLastData();
//						var rows = dataTable.datagrid("getCheckedEx");
//						if(rows.length == 0){
//							config.linkbutton("disable");
//						}
//					}else{
//						$.alert(retJson.info);
//					}
//				},
//				elements:[{
//					eName : 'div',
//					elements : [{
//						eName : 'span',
//						text : '初始密码规则',
//						cssClass:"fourth_div_span"
//					},{
//						eName : 'combobox',
//						name : "scheme_id",
//						id : 'pswRuleList',
//						panelHeight:$.browser.msie9?200:'auto',
//						panelMaxHeight:200,
//						valueField: 'scheme_id',
//				        textField: 'scheme_name',
//						width : 150,
//						height : 25,
//						editable:false,
//						value:'2'//默认值
//					},{
//						eName:"span",
//						elements:"&emsp;&emsp;&emsp;&emsp;",
//						cssClass:"fourth_div_span"
//					},{
//						eName : 'input',
//						cssClass:"openAccount_checkbox",
//						name : "finger_enable",
//						id:"fingerBox",
//						type : 'checkbox',
//					},{
//						eName : 'span',
//						cssClass:"fourth_div_span",
//						text : '启用指纹消费'
//					}]
//				},{
//					eName : 'div',
//					elements : [{
//						eName : 'span',
//						elements : '预存金额&emsp;&emsp;',
//						cssClass:"fourth_div_span"
//					},{
//						eName : 'textbox',
//						name:"account_init_amt",
//						id : 'account_init_amt',
//						width : 150,
//						height : 25,		
//						value:'',//默认值
//						validType:["money","moneyMax"],
//						onChange : function(newValue, oldValue){
//							//var val = $(this).textbox("getValue")+".00";
//							//$.print(val);
//							//$(this).textbox("setValue",val);
//							//$(this).textbox("setText",val);
//							if(newValue.indexOf(".")==-1 && newValue.length>0){
//								$(this).textbox("setValue",newValue+".00");
//								//charge_aftermoney.html(newValue+".00");
//							}else if(newValue.length-newValue.indexOf(".")-1==1){
//								$(this).textbox("setValue",newValue+"0");
//								//charge_aftermoney.html(newValue+"0");
//							}else{
//								$(this).textbox("setValue",newValue);
//								//charge_aftermoney.html(newValue);
//							}
//						}
//					},{
//						eName : 'span',
//						text : '有效日期',
//						cssClass:"fourth_div_span"
//					},{
//						eName : 'datebox',
//						editable:false,
//						name : 'account_end_date',
//						width : 150,
//						height : 25	
//						//formatter:validDateFormatter,
//						//parser:validDateParser
//						//value:'',//默认值
//					}]
//				}]
//			}
//		}
		]
	}];
	
	var columns = [//列字段定义
      	[ {
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
       		field : 'user_sex',
       		title : '性别',
       		align : "center",
       		width : 100
       	}, {
       		field : 'dep_name',
       		title : '部门',
       		align : "center",
       		width : 100
       	}, {
       		field : 'user_duty',
       		title : '身份类型',
       		align : "center",
       		width : 100
       	}, 
//       	{
//       		field : 'scheme_name',
//       		title : '初始密码规则',
//       		align : "center",
//       		width : 120
//       	}, 
       	{
       		field : 'user_id',
       		title : '身份证号',
       		align : "center",
       		width : 160
       	}, 
//       	{
//       		field : 'account_end_date_str',
//       		title : '有效日期',
//       		align : "center",
//       		width : 130
//       	}, {
//       		field : 'account_init_amt_str',
//       		title : '预存金额',
//       		align : "center",
//       		width : 130
//       	}, 
       	{
       		field : 'finger_enable',
       		title : '指纹消费',
       		align : "center",
       		width : 130
       	}, {
       		field : 'account_state_name',
       		title : '状态',
       		align : "center",
       		width : 80
       	}] ];
	
	var centerUI = {
		eName : 'datagrid',
		idField : 'id',
		//url : query,
		queryForm:"searchForm",
		toolbarEx : toolBar,// 查询条件工具栏
		columns : columns,
		//rownumbers:true,
		showFooter:false,
		alertFlag : false,// 是否弹出默认对话框
		autoload : false,
		singleSelect:false,
		checkOnSelect:true,
		selectOnCheck:true,
		pagination: true,
		clientPager:true,
		onCheckEx:function(index,row){
			//$.print("onCheckEx");
			data_count.html(dataTable.datagrid("getCheckedEx").length);
			//config.linkbutton("enable");
		},
		onCheckAllEx:function(rows){
			data_count.html(dataTable.datagrid("getCheckedEx").length);
			//$.print("onCheckAllEx");
			//config.linkbutton("enable");
		},
		onUncheckEx:function(index,row){
			//$.print("onUncheckEx");
			//$.print(dataTable.datagrid("getCheckedEx"));
			data_count.html(dataTable.datagrid("getCheckedEx").length);
//			if(dataTable.datagrid("getCheckedEx").length==0){
//				config.linkbutton("disable");
//			};
		},
		onUncheckAllEx:function(rows){
			data_count.html(dataTable.datagrid("getCheckedEx").length);
			//config.linkbutton("disable");
			//$.print('onUncheckAllEx');
		},
		rowStyler:function(index,row){
			if(row.id==color_id){
				//dataTable.datagrid("checkRow",index);
				if(color_i == "1"){
					return 'background-color:green;';
				}
				else if(color_i == "0"){
					return 'background-color:red;';
				}
			}
		},
		onLoadSuccessEx:function(retJson){
			//$.print(retJson);
			if(retJson.id==0){
				/*user_no.textbox("clear");
				depTree.combotree("clear");
				ideList.combogrid("clear");
				user_id.textbox("clear");*/
				data_count.html(dataTable.datagrid("getCheckedEx").length);
				//dataTable.datagrid("updateOrderNum",0);
			}else{
				$.alert(retJson.info);
			}
		}
	};
	
	var southUI = {
		eName : 'div',
		cssClass:"openAccount_south_div",
		elements : [{//开户按钮
			eName : 'linkbutton',
			uId:"tm2",
			text : "<span style='font-size:20px;'>开户</span>",
			id : "openAcc",
			cssClass : 'openAccount_linkbutton',
			width : 220,
			height : 60,
			onClick:function(){
				var rows = dataTable.datagrid("getCheckedEx");
				if(rows.length == 0){//如果没选择记录，直接跳到发卡页面
	        		//provideCard1.css("display",'');
	        		//provideCard2.css("display",'');
	        		//openAcc.css("display","none");
	        		//img_faka.attr("src","image/2-1.gif");
	        		//text_faka.css("color","#2274B9");
					$.alert("至少选择一条记录！");
				}else{//若选择记录，则遍历
//					var flag = 1;
//					var ids = [];
//					var params = {};
//		            $.each(rows, function (i, row) {
////		            	if(row.account_end_date==null){//存在未设置的记录
////		            		flag = -1;//标识改为-1
////		            		$.alert("存在未设置的人员！");
////		            		 return false;//实现break功能
////		            		//return ;//实现continue功能
////		            	}
//		            	if(row.account_state_code==1){
//		            		$.alert("存在已开户的人员！");
//		            		flag = -1;
//		            		return false;
//		            	}
//		            	else if(row.account_state_code==2){
//		            		$.alert("存在已发卡的人员！");
//		            		flag = -1;
//		            		return false;
//		            	}
//		            	else if(row.account_state_code==3){
//		            		$.alert("存在重复操作的人员！");
//		            		flag = -1;
//		            		return false;
//		            	}
//		            	else if(row.account_state_code==4){
//		            		$.alert("存在重复发卡的人员！");
//		            		flag = -1;
//		            		return false;
//		            	}
//	            		//将对象放到数组中
//	            		ids.push(row.id);
//		            });
//		            if(flag == 1){
		            	$.confirm('是否要对已选的人员进行开户？',function(c){
		            		if(c){
		            			var myWin = $.createWin({
									title:"操作提示",
									width:600,
									height:400,
									queryParams:{
										params:rows,
										callback:loadLastData,
										provideC:function(ids){
											//jqObj.loadJs("js/account/openAccount_provideCard.js",rows);
											
											//发卡提示窗
											var myWin = $.createWin({
												title:"操作提示",
												width:900,
												height:600,
												queryParams:{
													params:ids,
													callback:loadLastData,
												},
												url:"js/account/openAccount_provideCard.js"
											});
										}
									},
									url:"js/account/openAccount_configWin.js"
								});
		            			//提交后按钮禁用防止重复操作
				            	//openAcc.linkbutton('disable');
//				            	params['ids'] = ids.join(',');//主键参数
//				            	$.postEx(openAccount,params,function(retJson){
//									if(retJson.result && retJson.data){
//										loadLastData();
////										$.postEx(refresh,function(retJson){
////											if(retJson.result && retJson.data){
////												dataTable.datagrid("loadData",retJson);
////												//$.print(retJson.data)
////											}else{
////												$.alert(retJson.info);
////											}
////										});
//										//provideCard1.css("display",'');
//										//provideCard2.css("display",'');
//						        		//openAcc.css("display","none");
//						        		//img_faka.attr("src","image/2-1.gif");
//						        		//text_faka.css("color","#2274B9");
//									}else{
//										//openAcc.linkbutton('enable');
//										$.alert(retJson.info);
//									}
//								});
		            		}
		            	});
//		            }
		            
				}
			}
		}
		/*,{//发主卡按钮
			eName : 'linkbutton',
			uId:"tm2",
			text : "<span style='font-size:20px;'>发主卡</span>",
			id : "provideCard1",
			cssClass : 'openAccount_linkbutton',
			cssStyle : 'display:none;',
			width : 220,
			height : 60,
			onClick:function(){
				var rows = dataTable.datagrid("getCheckedEx");
				if(rows.length < 1){//这里是回到开户流程;
					//openAcc.linkbutton('enable');
					//openAcc.css("display",'');
					//provideCard1.css("display","none");
					//provideCard2.css("display","none");
					//img_faka.attr("src","image/2.gif");
	        		//text_faka.css("color","#999999");
					$.alert("至少选择一条记录！");
				}
				else{
					var flag = 1;
					var ids = [];
		            $.each(rows, function (i, row) {
		            	if(row.account_state_code==0){//未开户
		            		flag = -1;//标识改为-1
		            		$.alert("存在未开户的人员！");
		            		return false;//实现break功能
		            	}
		            	if(row.account_state_code==2){//已发卡
		            		flag = -1;
		            		$.alert("请去卡片管理页面发卡！");
		            		return false;
		            	}
//	            		//将对象放到数组中
	            		ids.push(row.id);
		            });
		            if(flag == 1){
		            	var param = {};
						param['ids'] = ids;
						param['is_main_card'] = "1";
						var myWin = $.createWin({
							title:"发主卡",
							width:300,
							height:200,
							queryParams:{
								params:param,
								callback:loadLastData,
								callColor:changeColor
							},
							url:"js/account/openAccount_provideCardkWin.js"
						});
		            }
				}
			}
		},{//发附卡按钮
			eName : 'linkbutton',
			uId:"tm2",
			text : "<span style='font-size:20px;'>发附卡</span>",
			id : "provideCard2",
			cssClass : 'openAccount_linkbutton',
			cssStyle : 'display:none;',
			width : 220,
			height : 60,
			onClick:function(){
				var rows = dataTable.datagrid("getCheckedEx");
				if(rows.length == 0){//这里是回到开户流程
					//openAcc.linkbutton('enable');
					//openAcc.css("display",'');
					//provideCard1.css("display","none");
					//provideCard2.css("display","none");
					//img_faka.attr("src","image/2.gif");
	        		//text_faka.css("color","#999999");
					$.alert("至少选择一条记录！");
				}
				else{
					var flag = 1;
					var ids = [];
		            $.each(rows, function (i, row) {
		            	if(row.account_state_code==0){//未开户
		            		flag = -1;//标识改为-1
		            		$.alert("存在未开户的人员！");
		            		return false;//实现break功能
		            	}
		            	if(row.account_state_code==2){//已发卡
		            		flag = -1;
		            		$.alert("请去卡片管理页面发卡！");
		            		return false;
		            	}
//	            		//将对象放到数组中
	            		ids.push(row.id);
		            });
		            if(flag == 1){
		            	var param = {};
						param['ids'] = ids;
						param['is_main_card'] = "0";
						var myWin = $.createWin({
							title:"发附卡",
							width:300,
							height:200,
							queryParams:{
								params:param,
								callback:loadLastData,
								callColor:changeColor
							},
							url:"js/account/openAccount_provideCardkWin.js"
						});
		            }
				}
			}
		}*/
//		,{
//			eName : 'linkbutton',
//			uId:"tm1",
//			text : '打印',
//			cssClass:"print_linkbutton",
//			width : 70,
//			height : 38,
//			onClick:function(){
//				if(dataTable.datagrid('getRows').length==0){
//					$.alert("数据为空");
//				}else{
//					utils.printGrid("开户账户",dataTable);
//				}
//			}
//		},{
//			eName : 'linkbutton',
//			uId:"tm1",
//			//text : '取消',
//			text:'返回主界面',
//			cssClass : 'cancel_linkbutton ',
//			width : 70,
//			height : 38,
//			onClick:function(){
//				try{
//					//window.top.main_iframe.ChangUrl("M000",0,"");
//					window.location = "http://" + loadParams.login_wtop + "/r_home.asp";
//				}
//				catch(e){
//					
//				}
//			}
//		}
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
	//debug();
	
	//创建dom
	jqObj.loadUI(mainUI);
	
	//通过findJq模糊查找，找到dom节点
	var dataTable = jqObj.findJq("datagrid");
	//var configForm = jqObj.findJqUI("configForm");
	var importForm = jqObj.findJqUI("importForm");
	var openAcc = jqObj.findJq("openAcc");
	var provideCard1 = jqObj.findJq("provideCard1");
	var provideCard2 = jqObj.findJq("provideCard2");
	var forFile = jqObj.findJq("forFile");
	var depTree = jqObj.findJq("depTree");
	var ideList = jqObj.findJq("ideList");
	//var fingerBox = jqObj.findJq("fingerBox");
	var img_faka = jqObj.findJq("img_faka");
	var text_faka = jqObj.findJq("text_faka");
	//var config = jqObj.findJq("config");
	var user_no = jqObj.findJq("user_no");
	var user_id = jqObj.findJq("user_id");
	//var fuzzy = jqObj.findJq("fuzzy");
	var account_init_amt = jqObj.findJq("account_init_amt");
	var data_count = jqObj.findJq("data_count");
	
	//config.linkbutton("disable");
	
	//文本框长度限制
	user_no.next().children().eq(0).attr("maxlength",18);
	user_id.next().children().eq(0).attr("maxlength",18);
	account_init_amt.next().children().eq(0).attr("maxlength",8);
	
//	document.onkeydown=function(event){
//		var e = event || window.event || arguments.callee.caller.arguments[0];
//		if(e && e.keyCode==13){ // enter 键
//			dataTable.datagrid("clearChecked");
//			dataTable.datagrid("load");
//	    }
//	};
	
	//开户列表本地分页
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
//	        	addList.datagrid("loadData", {id:0,rows:data.slice(start, end),
//	        		total:data.length,pageNumber:pageNo}); 
//	        } 
//	    }); 
//	}
	
	//回调到发卡页面
//	function provideCard(){
//		provideCard1.css("display",'');
//		provideCard2.css("display",'');
//		openAcc.css("display","none");
//	}
	
	//键盘回车事件
	user_no.textbox("textbox").keydown(function(e){
		var key = e.keyCode;//兼容firefox
		if(key == 13){
			dataTable.datagrid("loadEx",{url:query});
		}
	});
	user_id.textbox("textbox").keydown(function(e){
		var key = e.keyCode;//兼容firefox
		if(key == 13){
			dataTable.datagrid("loadEx",{url:query});
		}
	});
	
	loadInit();
	
	function loadInit(){
		$.postEx(checkCoreIp,{'op_name':'开户'},function(retJson){
			if(retJson.result){
				
			}else{
				$.alert(retJson.info,function(){
					//window.parent.location.reload();
					window.top.location.href=scmurl;
				});
			}
		});
	}
	
	//加载页面上一次数据
	loadLastData();
	function loadLastData(){
//		$.postEx(refresh,function(retJson){
//			if(retJson.result && retJson.data){
//				dataTable.datagrid("loadData",retJson.data);
//			}else{
//				$.alert(retJson.info);
//			}
//		});
		dataTable.datagrid("loadEx",{url:refresh});
	}
	
//	function fresh(){
//		$.postEx(refresh,function(retJson){
//			if(retJson.result && retJson.data){
//				dataTable.datagrid("loadData",retJson);
//			}else{
//				$.alert(retJson.info);
//			}
//		});
//	}
	
	//改变正在发卡记录颜色
	function changeColor(id,i){
		color_id = id;
		color_i = i;
	}

	//加载选择部门树
	loadTree();
	function loadTree(){
		$.postEx(qryDepByAccess,function(retJson){
			if(retJson.result && retJson.data){
				depTree.combotree('loadData',
						$.list2Tree(retJson.data,"dep_serial","dep_parent","dep_name"));
			}
		});
	}
	//加载身份列表
	loadIdeList();
	
	function loadIdeList(){
		$.postEx(ideQuery,function(retJson){
			if(retJson.result && retJson.data){
				var ideGrid = ideList.combogrid("grid");
				ideGrid.datagrid("loadDataEx",retJson.data);
				//ideList.combobox("loadDataEx",retJson.data);
			}
		});
	}
	
	//加载初始密码规则列表
//	loadPswRuleList();
//	function loadPswRuleList(){
//		$.postEx(pswRuleQuery,function(retJson){
//			//$.print(retJson);
//			if(retJson.result && retJson.data){
//				pswRuleList.combobox("loadDataEx",retJson.data);
//			}
//		});
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
				user_id.textbox("clear");
				
				user_no.textbox("setText","");
				
				dataTable.datagrid("loadEx",{url:query});
				successBeep();
				user_no.textbox("setValue","");
			}else{
				errorBeep();
				$.alert(retJson.info);
			}
		});
		
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
	
	//扩展验证
	$.extend($.fn.validatebox.defaults.rules, {    
		 number: {// 半角字符验证
             validator: function (value) {
                 //return /^[+]?[1-9]+\d*$/i.test(value);

                 return /^([+]?[A-Za-z0-9_-])+\d*$/i.test(value);
             },
             message: '只能输入数字、字母、下划线、短横线'
         },
         money : {// 金额验证
             validator: function (value) {
                 //return /^[+]?[1-9]+\d*$/i.test(value);
                 return /^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/i.test(value);
             },
             message: '请输入正确金额'
         },
         moneyMax :{// 金额验证
        	 validator: function (value) {
                 return (value<=21474836.47);
             },
             message: '请输入正确金额'
         },
         idCard:{//身份证号验证
         	validator: function(value){
         		return /(\d|X|x)$/i.test(value);
         	},
         	message: '请输入正确的身份证号'
         }
	});  
});
	