//批量充值
garen_define("js/account/batchCharge",function (jqObj,loadParams) {
	var utils = garen_require("utils");
	//webService
	var base = garen_require("js/base/ws_public");
	
	var scmurl = garen_require("js/lib/scmurl");//url地址
	var checkCoreIp = base.checkCoreIp;//核心业务IP授权验证
	
	var depQuery = base.depQuery;//部门查询
	
	var batchChargeImport = "account/batchChargeImport.do";//列表导入
	
	var batchChargeQuery = "account/batchChargeQuery.do";//根据条件查询
	
	var save = 0;//数据是否保存
	var page = 0;//是否是确定后执行
	
	var importFlag = "";//列表导入标志
	
	//工具栏
	var toolBar = [null,{
		eName : 'div',
		height:10,
		cssStyle : 'background:#ffffff;'
	},{
		eName:"formUI",
		id:"importForm",
		url:batchChargeImport,
		method:"post",//上传表单时，必须设置此值
		alertFlag:true,
		progressBar:"上传中...",
		enctype:"multipart/form-data",//上传附件时，必须设置此值
		onSave:function(retJson){
			if(retJson.result){
//				dataTable.datagrid("clearChecked");
//				rData = retJson.data;
//				var data = {};
//				data['id'] = 0;
//				data['rows'] = retJson.data.slice(0,30);
//				dataTable.datagrid("loadDataEx",data);
//				empListPage();
				importFlag = 1;
				dataTable.datagrid("loadDataEx",retJson.data);
			}else{
				if(retJson.retDatas && retJson.retDatas.length>0){
					//$.alert($.toJSON(retJson.retDatas));
					var myWin = $.createWin({
						title:"系统提示信息",
						width:580,
						height:550,
						queryParams:{
							params:retJson.info,
							params2:retJson.retDatas
						},
						url:"js/account/batchCharge_importWin.js"
					});
				}else{
					$.alert(retJson.info);
				}
			}
		},
		elements:{
			eName : 'div',
			cssClass : 'batchCharge_toolBar_second',
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
				},
//				{
//					eName:"label",
//					uId:"tm1",
//					'for':'upFile',
//					cssClass:'l-btn l-btn-small',
//					text:"浏览"
//				},{
//					eName:'input',
//					name:'userFile',
//					id:'upFile',
//					type:'file',
//					cssStyle:'position: absolute;top: -999px;left: -999px;',//在IE8下dispaly:none;会导致label不好用。
//					onChange:function(){
////						forFile.textbox("setValue",$(this).val());
////						forFile.textbox("setText",$(this).val());
//						var path = $(this).val();
//						var result = path.match(/\\([^\\]+)$/i);
//						if(result){
//							path = result[1];
//						}
//						forFile.textbox("setValue",path);
//						forFile.textbox("setText",path);
//					}
//				},{
//					eName : 'textbox',
//					id : "forFile",
//					editable:false,
//					name : '',
//					width : 350,
//					height : 25,		
//					value:''//默认值
//				},
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
						window.location.href="import_mould/batchChargeMould.xls";
					}
				}]
			}
		}
	}, {
		eName : 'div',
		cssClass:"batchCharge_toolBar_third",
		elements : [{
			eName : 'div',
			cssClass:"first_div",
			elements:{
				eName:"formUI",
				id:'searchForm',
				elements : [{
					eName : 'div',
					elements : [{
						eName : 'span',
						elements : '学/工号',
						cssClass:"first_div_span"
						},{
							eName : 'textbox',
							name : 'user_no',
							validType:'number',
							width : 150,
							height : 25,		
							value:''//默认值
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
						elements : '姓&emsp;&ensp;名',
						cssClass:"first_div_span"
					},{
						eName : 'textbox',
						name : 'user_lname',
						validType:"unnormal",
						width : 150,
						height : 25,		
						value:''//默认值
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
			cssStyle:"margin-right:20px;",
			elements : {
				eName : 'linkbutton',
				uId:"tm1",
				width:65,
				height:65,
				text:"查询",
				onClick : function(){
					searchWin();
				}
			}
		},{
			eName : 'div',
			width:70,
			elements : [{
				eName : 'linkbutton',
				uId:"tm1",
				width:65,
				height:33,
				text:"删除人员",
				onClick : deleteUser
			},{
				eName : 'linkbutton',
				uId:"tm1",
				width:65,
				height:33,
				text:"清空人员",
				onClick : clearUser
			}]
		},{
			eName : 'div',
			cssStyle : 'margin-left:150px;height:72px;',
			elements:[{
				eName:"div",
				elements:[{
					eName : 'span',
					elements : '充值金额',
					cssStyle : 'margin-right:5px;'
				},{
					eName : 'textbox',
					validType:['money','moneyMax'],
					id:"moneyBox",
					width : 150,
					height : 25,		
					value:'',//默认值
					onChange:moneyInput
				}]
			},{
				eName:"div",
				//cssClass:"third_div",
				cssStyle:"font-size:16px;margin-top: 20px;",
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
		},{
			eName:"div",
			elements:{
				eName : 'linkbutton',
				uId:"tm1",
				width:65,
				height:33,
				cssStyle:'margin-left:20px;',
				text:"设置",
				onClick : setMoney
			}
		}]
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
       		field : 'dep_name',
       		title : '部门',
       		align : "center",
       		width : 120
       	}, {
       		field : 'user_lname',
       		title : '姓名',
       		align : "center",
       		width : 100
       	}, {
       		field : 'user_duty',
       		title : '身份类型',
       		align : "center",
       		width : 100
       	}, {
       		field : 'user_id',
       		title : '身份证号',
       		align : "center",
       		width : 160
       	}, {
       		field : 'cash_amt_str',
       		title : '现金余额',
       		align : "center",
       		width : 120
       	}, {
       		field : 'cash_money',
       		title : '充值金额',
       		align : "center",
       		width : 120
       	}, {
       		field : 'cash_after_money_str',
       		title : '充值后现金余额',
       		align : "center",
       		width : 120
       	}, {
       		field : 'account_state_name',
       		title : '账户状态',
       		align : "center",
       		width : 100
       	}
//       	, {
//       		field : 'recharge_state',
//       		title : '结果状态',
//       		align : "center",
//       		width : 100
//       	}
       	] ];
	
	var centerUI = {
		eName : 'datagrid',
		idField : 'account_id',
		id:'dataTable',
		//url : batchChargeQuery,
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
				user_lname.textbox("clear");
				user_id.textbox("clear");
				data_count.html(dataTable.datagrid("getCheckedEx").length);
			}else{
				$.alert(retJson.info);
			}
		}
	};
	
	var southUI = {
			eName : 'div',
			cssClass:"batchCharge_south_div",
			elements : [{
				eName : 'linkbutton',
				uId:"tm2",
				text : "<span style='font-size:20px;'>充值</span>",
				cssClass : 'batchCharge_linkbutton',
				width : 220,
				height : 60,
				onClick:batchCharge
			}
//			,{
//				eName : 'linkbutton',
//				uId:"tm1",
//				text : '打印',
//				cssClass : 'batchCharge_linkbutton1',
//				width : 70,
//				height : 38,
//				onClick:function(){
//					if(dataTable.datagrid('getRows').length==0){
//						$.alert("数据为空");
//					}else{
//						utils.printGrid("批量充值账户",dataTable);
//					}
//				}
//			},{
//				eName : 'linkbutton',
//				uId:"tm1",
////				text : '取消',
//				text:'返回主界面',
//				cssClass : 'batchCharge_linkbutton2',
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
//			}
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
	var depTree = jqObj.findJq("depTree");
	var importForm = jqObj.findJqUI("importForm");
	var moneyBox = jqObj.findJq("moneyBox");
	var user_no = jqObj.findJq("user_no");
	var user_lname = jqObj.findJq("user_lname");
	var user_id = jqObj.findJq("user_id");
	var data_count = jqObj.findJq("data_count");
	
//	document.onkeydown=function(event){
//		var e = event || window.event || arguments.callee.caller.arguments[0];
//		if(e && e.keyCode==13){ // enter 键
//			dataTable.datagrid("clearChecked");
//			dataTable.datagrid("load");
//	    }
//	};
	
	//匿名函数,绑定分页事件
//	(function(){
//		var pager = dataTable.datagrid('getPager');
//		pager.updateOpt("pagination",{
//			onBeforeSelect:function(pageNumber){
//				var rows = dataTable.datagrid("getRows");
//				if(page == 0){//确认前执行
//					$.each(rows,function(i,row){
//						$.print(row.recharge_state,row.cash_money);
//						if(!row.recharge_state && row.cash_money){
//							save = 1;
//							return false;
//						}
//					});
//				}else{
//					page = 0;
//				}
//				if(save == 1){//存在未保存的数据
//					$.confirm("本页有未保存的数据，是否确定跳转到其他页面？",function(c){
//						if(c){
//							save = 0;//重置
//							page = 1;//确认后
//							//dataTable.datagrid("reload");
//							//return true;
//							//$.print(pagerOpts.pageNumber)
//							pager.pagination('select',pageNumber);
//						}else{
//							save = 0;//重置
//							page = 0;//取消后
//						}
//					});
//					if(page==0){
//						return false;
//					}
//				}
//			}
//		});
//	}());
	
	//批量充值列表本地分页
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
//	        	//dataTable.datagrid("loadDataEx", data); 
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
			searchWin();
		}
	});
	user_lname.textbox("textbox").keydown(function(e){
		var key = e.keyCode;//兼容firefox
		if(key == 13){
			searchWin();
		}
	});
	user_id.textbox("textbox").keydown(function(e){
		var key = e.keyCode;//兼容firefox
		if(key == 13){
			searchWin();
		}
	});
	
	loadInit();
	
	function loadInit(){
		$.postEx(checkCoreIp,{'op_name':'批量充值'},function(retJson){
			if(retJson.result){
				
			}else{
				$.alert(retJson.info,function(){
					//window.parent.location.reload();
					window.top.location.href=scmurl;
				});
			}
		});
	}
	
	//加载选择部门树
	loadTree();
	function loadTree(){
		$.postEx(depQuery,function(retJson){
			if(retJson.result && retJson.data){
				depTree.combotree('loadData',
						$.list2Tree(retJson.data,"dep_serial","dep_parent","dep_name"));
			}
		});
	}
	
	//充值金额
	function moneyInput(newValue, oldValue){
		var money=/^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
		if(money.test(newValue) && newValue<=21474836.47){//金额验证
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
		}
	}
	
	function searchWin(){
		dataTable.datagrid("loadEx",{url:batchChargeQuery});
	}
	
	//设置金额
	function setMoney(){
		var money=/^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
		var rows = dataTable.datagrid("getCheckedEx");
		if(rows.length<1){
			$.alert("至少选择一条记录！");
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
//			var flag = 1;
//			$.each(rows,function(i, row){
//				if(row.recharge_state=="成功"){
//					flag = 0;
//					$.alert("存在充值成功的人员，若想对其再次设置金额，请刷新页面！");
//					return false;
//				}
//			});
//			if(flag == 1){
			$.each(rows,function(i, row){
//				var index = dataTable.datagrid("getRowIndex",row);
//				var param = {};
//				param['cash_money'] = moneyBox.textbox("getValue");
//				var cm = Math.round(Number(moneyBox.textbox("getValue"))*100); 
//				var nv = Math.round(Number(row.cash_amt_str)*100); 
//				var v = cm + nv;
//				var val = v/100 + "";
//				if(val.indexOf(".") == -1){//输入时不含小数点（0.00==0）
//					param['cash_after_money_str'] = val+".00";
//				}
//				else if(val.length - val.indexOf(".") - 1 == 1){//小数点后面有一位数（0.10==0.1）
//					param['cash_after_money_str'] = val+"0";
//				}
//				else{//小数点后面有两位数
//					param['cash_after_money_str'] = val;
//				}
//				
//				dataTable.datagrid("updateRowEx",{
//					index:index,
//					row:param
//				});
				row.cash_money = moneyBox.textbox("getValue");
				var cm = Math.round(Number(moneyBox.textbox("getValue"))*100); 
				var nv = Math.round(Number(row.cash_amt_str)*100); 
				var v = cm + nv;
				var val = v/100 + "";
				if(val.indexOf(".") == -1){//输入时不含小数点（0.00==0）
					row.cash_after_money_str = val+".00";
				}
				else if(val.length - val.indexOf(".") - 1 == 1){//小数点后面有一位数（0.10==0.1）
					row.cash_after_money_str = val+"0";
				}
				else{//小数点后面有两位数
					row.cash_after_money_str = val;
				}
			});
			dataTable.datagrid("reload");
//			}
		}
	}
	
	//删除人员
	function deleteUser(){
		var rows = dataTable.datagrid("getCheckedEx");
		if(rows.length<1){
			$.alert("至少选择一条记录！");
		}else{
			dataTable.datagrid("deleteRowEx",rows);
			dataTable.datagrid("reload");
		}
	}
	
	//清空人员
	function clearUser(){
		dataTable.datagrid("loadDataEx",{id:0,total:0,rows:[]});
	}
	
	//批量充值
	function batchCharge(){
		var rows = dataTable.datagrid("getCheckedEx");
		if(rows.length == 0){//如果没选择记录，直接跳到发卡页面
			$.alert("至少选择一条记录！");
		}else{
			var flag = 1;
			$.each(rows,function(i, row){
				if(!row.cash_money){
					flag = 0;
					$.alert("存在未设置金额的人员！");
					return false;
				}
			});
			if(flag == 1){
				$.confirm('是否要对已选的人员进行充值？',function(c){
	        		if(c){
	        			var myWin = $.createWin({
							title:"操作提示",
							width:395,
							height:400,
							queryParams:{
								params:rows,
								callback:refresh
							},
							url:"js/account/batchCharge_configWin.js"
						});
	        		}
	        	});
			}
		}
		
		function refresh(){
			if(importFlag){
				importFlag = 0;
				dataTable.datagrid("loadDataEx",{id:0,total:0,rows:[]});
			}else{
				dataTable.datagrid("reloadEx");
			}
		}
//		var flag = 1;
//		$.each(rows,function(i, row){
//			if(row.recharge_state=="成功"){
//				flag = 0;
//				$.alert("存在充值成功的人员，若想对其再次充值，请刷新页面！");
//				return false;
//			}
//		});
//		if(flag == 1){
//			var params = [];
//			$.each(rows,function(i, row){
//				var param = {};
//				param['account_id'] = row.account_id;
//				param['recharge_amt'] = Math.round(Number(row.cash_money)*100); 
//				param['cash_amt'] = row.cash_amt;
//				params.push(param);
//			});
//			$.postJson(batchChargeOperation,params,function(retJson){
//				if(retJson.result){
//					$.each(rows,function(i, row){
//						$.each(retJson.data,function(i, data){
//							if(row.account_id==data.account_id){
//								var param = {};
//								if(data.recharge_state=="0"){
//									param['recharge_state'] = '成功';
//								}
//								else if(data.recharge_state=="1"){
//									param['recharge_state'] = '失败';
//								}
//								var index = dataTable.datagrid("getRowIndex",row);
//								dataTable.datagrid("updateRow",{
//									index:index,
//									row:param
//								});
//							}
//						});
//						
//					});
//				}else{
//					$.alert(retJson.info);
//				}
//			});
//		}
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
	