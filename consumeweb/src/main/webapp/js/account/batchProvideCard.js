/*批量发卡batchProvideCard.js*/

garen_define("js/account/batchProvideCard",function (jqObj,loadParams) {
	var utils = garen_require("utils");
	//webService
	var base = garen_require("js/base/ws_public");
	
	var jmjlink = garen_require("js/lib/jmjlink");//卡控件
	
	var scmurl = garen_require("js/lib/scmurl");//url地址
	
	var checkCoreIp = base.checkCoreIp;//核心业务IP授权验证
	
	var allReadIdCard = base.allReadIdCard;//读身份证
	
	var depQuery = base.depQuery;//部门查询
	
	var ideQuery = base.ideQuery;//身份查询
	
	var accountCardBatchQry = "account/accountCardBatchQry2.do";//查询
	
//	var openAccount = "account/accountOpen.do";//开户
	
	var color_id = "";//发卡account_id
	
	var color_i = "";//发卡颜色0绿（正在发卡），1红（发卡失败）
	
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
	},{
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
					cssStyle:'margin-top:13px;',
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
						},{
							eName:"span",
							cssStyle:"margin-left:15px;",
							elements:[{
								eName : 'input',
								cssClass:"manage_checkbox",
								id:"cardType0",
								name:"card_state",
								type : 'radio',
								value:0
							},{
								eName : 'span',
								cssStyle:"margin-right: 10px;",
								text : '全部'
							},{
								eName : 'input',
								cssClass:"manage_checkbox",
								id:"cardType1",
								name:"card_state",
								type : 'radio',
								value:1
							},{
								eName : 'span',
								cssStyle:"margin-right: 10px;",
								text : '未发卡'
							},{
								eName : 'input',
								cssClass:"manage_checkbox",
								id:"cardType2",
								name:"card_state",
								type : 'radio',
								value:2
							},{
								eName : 'span',
								text : '已发卡'
							}]
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
			cssClass:"first_div",
			elements : [{
				eName : 'linkbutton',
				cssStyle:'margin-top:10px;',
				uId:"tm1",
				width:58,
				height:31,
				text:"查询",
				onClick : function(){
					color_id = '';
					color_i = '';
					searchWin(0);
				}
			},{
				eName : 'linkbutton',
				cssStyle:'margin-top:10px;float:right;',
				uId:"tm1",
				//disabled:true,
				width:70,
				height:70,
				text:"读身份证",
				onClick : readIdCard
			},{
				eName : 'linkbutton',
				cssStyle:'margin-top:8px;display:block;',
				uId:"tm1",
				width:58,
				height:31,
				text:"清空",
				onClick : function(){
					user_no.textbox("clear");
					depTree.combotree("clear");
					ideList.combogrid("clear");
					user_id.textbox("clear");
				}
			}]
		},{
			eName:"div",
			cssClass:"third_div",
			cssStyle:'margin-top:30px;',
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
       		width : 80
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
       	}, {
       		field : 'account_end_date_str',
       		title : '账户有效期',
       		align : "center",
       		width : 100
       	}, 
//       	{
//       		field : 'account_init_amt_str',
//       		title : '预存金额',
//       		align : "center",
//       		width : 130
//       	}, 
       	{
       		field : 'finger_enable',
       		title : '指纹消费',
       		align : "center",
       		width : 80
       	}, {
       		field : 'open_account_date',
       		title : '开户日期',
       		align : "center",
       		width : 100
       	}, {
       		field : 'account_state_name',
       		title : '状态',
       		align : "center",
       		width : 80
       	}
       	] ];
	
	var centerUI = {
		eName : 'datagrid',
		idField : 'account_id',
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
		},
		onCheckAllEx:function(rows){
			data_count.html(dataTable.datagrid("getCheckedEx").length);
			//$.print("onCheckAllEx");
		},
		onUncheckEx:function(index,row){
			//$.print("onUncheckEx");
			data_count.html(dataTable.datagrid("getCheckedEx").length);
		},
		onUncheckAllEx:function(rows){
			data_count.html(dataTable.datagrid("getCheckedEx").length);
			//$.print('onUncheckAllEx');
		},
		rowStyler:function(index,row){
			if(row.account_id==color_id){
				if(color_i == "1"){
					return 'background-color:green;';
				}
				else if(color_i == "0"){
					return 'background-color:red;';
				}
			}
		},
		onLoadSuccessEx:function(retJson){
			if(retJson.id==0){
				/*user_no.textbox("clear");
				depTree.combotree("clear");
				ideList.combogrid("clear");
				user_id.textbox("clear");*/
				//lx.combobox("clear");
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
		elements : [{//发主卡按钮
			eName : 'linkbutton',
			uId:"tm2",
			text : "<span style='font-size:20px;'>发主卡</span>",
			id : "provideCard1",
			cssClass : 'openAccount_linkbutton',
			width : 220,
			height : 60,
			onClick:provideMainCard
/*			onClick:function(){
				var rows = dataTable.datagrid("getCheckedEx");
				if(rows.length < 1){
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
//		            	if(row.account_state_code==0){//未开户
//		            		flag = -1;//标识改为-1
//		            		$.alert("存在未开户的人员！");
//		            		return false;//实现break功能
//		            	}
//		            	if(row.account_state_code==2){//已发卡
//		            		flag = -1;
//		            		$.alert("请去卡片管理页面发卡！");
//		            		return false;
//		            	}
//	            		//将对象放到数组中
	            		ids.push(row.account_id);
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
								callback:changeState,
								callColor:changeColor
							},
							url:"js/account/batchProvideCardWin.js"
						});
		            }
				}
			}*/
		},{//发附卡按钮
			eName : 'linkbutton',
			uId:"tm2",
			text : "<span style='font-size:20px;'>发附卡</span>",
			id : "provideCard2",
			cssClass : 'openAccount_linkbutton',
//			cssStyle : 'display:none;',
			width : 220,
			height : 60,
			onClick:provideSupplementaryCard
			/*onClick:function(){
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
//		            	if(row.account_state_code==0){//未开户
//		            		flag = -1;//标识改为-1
//		            		$.alert("存在未开户的人员！");
//		            		return false;//实现break功能
//		            	}
//		            	if(row.account_state_code==2){//已发卡
//		            		flag = -1;
//		            		$.alert("请去卡片管理页面发卡！");
//		            		return false;
//		            	}
//	            		//将对象放到数组中
	            		ids.push(row.account_id);
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
								callback:changeState,
								callColor:changeColor
							},
							url:"js/account/batchProvideCardWin.js"
						});
		            }
				}
			}*/
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
	var lx = jqObj.findJq("lx");
	
	var cardType0 = jqObj.findJq("cardType0");
	var cardType1 = jqObj.findJq("cardType1");
	var cardType2 = jqObj.findJq("cardType2");
	
	//config.linkbutton("disable");
	
	//文本框长度限制
	user_no.next().children().eq(0).attr("maxlength",18);
	user_id.next().children().eq(0).attr("maxlength",18);
	account_init_amt.next().children().eq(0).attr("maxlength",8);
	
	//键盘回车事件
	user_no.textbox("textbox").keydown(function(e){
		var key = e.keyCode;//兼容firefox
		if(key == 13){
			color_id = '';
			color_i = '';
			searchWin(0);
		}
	});
	user_id.textbox("textbox").keydown(function(e){
		var key = e.keyCode;//兼容firefox
		if(key == 13){
			color_id = '';
			color_i = '';
			searchWin(0);
		}
	});
	
	
	//loadLastData();//加载页面上一次数据
	
	loadInit();
	
	loadTree();//加载选择部门树
	
	loadIdeList();//加载身份列表
	
	function loadInit(){
		$.postEx(checkCoreIp,{'op_name':'批量发卡'},function(retJson){
			if(retJson.result){
				
			}else{
				$.alert(retJson.info,function(){
					//window.parent.location.reload();
					window.top.location.href=scmurl;
				});
			}
		});
		cardType0.attr("checked","checked");
	}
	
	function searchWin(cx_type){
		dataTable.datagrid("loadEx",{url:accountCardBatchQry,'cx_type':cx_type});
	}
	
	//如果通过开户进来则加载数据
//	loadDataByOpen();
//	
//	function loadDataByOpen(){
//		if(loadParams.length>0){
//			color_id = '';
//			color_i = '';
//			dataTable.datagrid("loadDataEx",loadParams);
//		}
//	}
	
//	function loadLastData(){
//		dataTable.datagrid("loadEx",{url:refresh});
//	}
	
//	function fresh(){
//		$.postEx(refresh,function(retJson){
//			if(retJson.result && retJson.data){
//				dataTable.datagrid("loadData",retJson);
//			}else{
//				$.alert(retJson.info);
//			}
//		});
//	}
	
	//发主卡
	function provideMainCard(){
		var rows = dataTable.datagrid("getCheckedEx");
		if(rows.length < 1){
			$.alert("至少选择一条记录！");
		}
		else{
			var ids = [];
			var card_flag = 1;
            $.each(rows, function (i, row) {
            	if(row.account_state_name == "已发卡"){
            		card_flag = 0;
            		return false;
            	}
        		ids.push(row.account_id);
            });
            if(card_flag == 1){
            	var param = {};
    			param['ids'] = ids;
    			param['is_main_card'] = "1";
    			var myWin = $.createWin({
    				title:"发主卡",
    				width:300,
    				height:200,
    				queryParams:{
    					params:param,
    					callback:changeState,
    					callColor:changeColor
    				},
    				url:"js/account/batchProvideCardWin.js"
    			});
            }else{
            	$.alert("存在已发卡的人员，请重新选择！");
            }
           
        	
		}
	}
	
	//发附卡
	function provideSupplementaryCard(){
		var rows = dataTable.datagrid("getCheckedEx");
		if(rows.length < 1){
			$.alert("至少选择一条记录！");
		}
		else{
			var ids = [];
			var card_flag = 1;
            $.each(rows, function (i, row) {
            	if(row.account_state_name == "已发卡"){
            		card_flag = 0;
            		return false;
            	}
        		ids.push(row.account_id);
            });
            if(card_flag == 1){
            	var param = {};
    			param['ids'] = ids;
    			param['is_main_card'] = "0";
    			var myWin = $.createWin({
    				title:"发附卡",
    				width:300,
    				height:200,
    				queryParams:{
    					params:param,
    					callback:changeState,
    					callColor:changeColor
    				},
    				url:"js/account/batchProvideCardWin.js"
    			});
            }else{
            	$.alert("存在已发卡的人员，请重新选择！");
            }
        	
		}
	}
	
	//改变正在发卡记录颜色
	function changeColor(account_id,i){
		color_id = account_id;
		color_i = i;
		var rows = dataTable.datagrid("getCheckedEx");
		$.each(rows,function(x,row){
//			var index = dataTable.datagrid("getRowIndex",row);
//			dataTable.datagrid("updateRowEx",{
//				index:index,
//				row:{}
//			});
			if(row.account_id==account_id){
				var num = dataTable.datagrid('getRowPageNum',row);
				dataTable.datagrid('gotoPage',num);
				var index = dataTable.datagrid("getRowIndex",row);
				dataTable.datagrid('scrollTo',index);
				return false;
			}
		});
		//dataTable.datagrid("reloadExt");
	}
	
	function changeState(account_id){
		var rows = dataTable.datagrid("getCheckedEx");
		$.each(rows,function(i,row){
			if(row.account_id==account_id){
//				var index = dataTable.datagrid("getRowIndex",row);
//				dataTable.datagrid("updateRowEx",{
//					index:index,
//					row:{account_state_name:"已发卡"}
//				});
				row.account_state_name = "已发卡";
				var num = dataTable.datagrid('getRowPageNum',row);
				dataTable.datagrid('gotoPage',num);
				var index = dataTable.datagrid("getRowIndex",row);
				dataTable.datagrid('scrollTo',index);
				return false;
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
			if(retJson.result && retJson.data){
				var ideGrid = ideList.combogrid("grid");
				ideGrid.datagrid("loadDataEx",retJson.data);
				//ideList.combobox("loadDataEx",retJson.data);
			}
		});
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
				
				ideList.combogrid("clear");
				depTree.combotree("clear");
				user_id.textbox("clear");
				
				user_no.textbox("setText","");
				cardType0.prop("checked",true);
				color_id = '';
				color_i = '';
				searchWin(1);
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
	