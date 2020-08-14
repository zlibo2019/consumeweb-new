//交易流水查询
garen_define("js/functionQuery/tradingWaterQuery",function (jqObj,loadParams) {

	var utils = garen_require("utils");
	//webService
	var base = garen_require("js/base/ws_public");
	
	var allReadIdCard = base.allReadIdCard;//读身份证
	
	var selDepQuery = "functionQuery/tradingWaterQuery/selDepQuery.do";//部门查询
	
	//var selCommercialDepQuery = "functionQuery/tradingWaterQuery/selCommercialDepQuery.do";//商户部门
	
	//var selCommercialQuery = "functionQuery/tradingWaterQuery/selCommercialQuery.do";/*商户*/
	
	var selCommercialQuery = "merchant/manage/normalMerchantQuery.do";/*商户*/
	
	var selPlaceQuery = "functionQuery/tradingWaterQuery/selPlaceQuery.do";//场所
	
	var selDevQuery = "functionQuery/tradingWaterQuery/selDevQuery.do";//设备
	
	var tradTypeQuery = "functionQuery/tradingWaterQuery/tradTypeQuery.do";//交易类型
	
	var tradWaterQuery = "functionQuery/tradingWaterQuery/tradWaterQuery.do";//交易流水列表
	
	var ideQuery = base.ideQuery;//身份查询
	
	var allReadCard = base.allReadCard;//读卡
	
	var jmjlink = garen_require("js/lib/jmjlink");//卡控件
	
	var cardFilterQuery = "account/cardFilterQuery.do";//筛选查询

	var rData = "";//读卡时把id和卡号等存下来，操作时对比id，成功则提交卡号等
	
	
	//工具栏
	var toolBar = [null,/*{
		eName : 'div',
		height:10,
		cssStyle : 'background:#ffffff;'
	},*/{
		eName : 'div',
		cssClass:"tradingWaterQuery_toolBarDiv",
		elements : [{
			eName : 'div',
			/*elements:{
				eName:"formUI",
				id:"queryForm",
				//url:cardFilterQuery,
				alertFlag:false,
				//progressBar:"查询中...",
				onSave:function(retJson){
					//account_condition.val("");
					if(retJson.result){
						dataTable.datagrid("loadDataEx",retJson);
					}else{
						$.alert(retJson.info);
					}
				},*/
			elements : [{
				eName : 'div',
				cssClass:"tradingWaterQuery_toolBar_firstDiv",
				elements : [{
					eName : 'span',
					cssClass:"tradingWaterQuery_div_span",
					text : '开始日期'
				},{
					eName : 'datebox',
					name:"start_date",
					editable:false,
					width : 95,
					height : 25
				},{
					eName : 'span',
					cssClass:"tradingWaterQuery_div_span",
					elements : '学/工号',
				},{
					eName : 'textbox',
					name : 'user_no',
					validType:"number",
					width : 100,
					height : 25,		
					value:''//默认值
				},{
					eName : 'input',
					type:"hidden",
					id : 'account_id',
					width : 100,
					height : 25,		
					value:''//默认值
				},{
					eName : 'span',
					cssClass:"tradingWaterQuery_div_span",
					elements : '部&emsp;&emsp;门',
				},{
					eName : 'combotree',
					multiple:true,
					name:"dep_serial",
					id : 'depTree',
					panelHeight:$.browser.msie9?200:'auto',
					panelMaxHeight:200,
					width : 120,
					height : 25,		
					value:'',//默认值
					onSelect:function(node){//选择相同则清空文本内容
						if(depTree.combo("getText")==node.text){
							depTree.combotree("clear");
						}
					}
				},
				/*{
					eName : 'span',
					cssClass:"tradingWaterQuery_div_span",
					text : '商户部门',
				},{
					eName:"combotree",
					name:"merchant_dep",
					multiple:true,
					id:"commercialTree",
					width:120,
					onChange:function(node,checked){//加载设备
						var data = commercialTree.combotree("tree").tree("getChecked");
						if(data.length>0){
							var params = [];
							var param = {};
							$.each(data,function(i, d){
								params.push(d.dep_serial);
							});
							param['dep_serial'] = params.join();
							loadBhList(param);
						}else{
							var bhGrid = bhList.combogrid("grid");
							var opts = bhList.combogrid("options");
							if(bhGrid.datagrid("loadData",[])){
								opts.allFlag = false;
								bhList.combogrid("clear");
							}
							opts.allFlag = true;
						}
					}
				},*/
				{
					eName : 'span',
					cssClass:"tradingWaterQuery_div_span",
					text : '场所',
				},{
					eName:"combotree",
					name:"acdep_serial",
					editable:false,
					multiple:true,
					id:"selPlaceTree",
					width:120,
					onChange:function(node,checked){//加载设备
						//$.print(selPlaceTree.combotree("tree").tree("getChecked"));
						var data = selPlaceTree.combotree("tree").tree("getChecked");
						if(data.length>0){
							var params = [];
							var param = {};
							$.each(data,function(i, d){
								params.push(d.dep_serial);
							});
							param['dep_serial'] = params.join();
							loadDevList(param);
						}else{
							var bhGrid = selDevList.combogrid("grid");
							var opts = selDevList.combogrid("options");
							if(bhGrid.datagrid("loadData",[])){
								opts.allFlag = false;
								selDevList.combogrid("clear");
							}
							opts.allFlag = true;
						}
					}
				},{
					eName : 'span',
					cssClass:"tradingWaterQuery_div_span",
					elements : '设&emsp;&emsp;备',
				},{
					eName:"combogrid",
					id:"selDevList",
					name:"bh",
					idField: 'bh',
					textField: 'mc',
					width:120,
					editable:false,
					multiple:true,
					singleSelect: false,
					selectOnCheck:true,
					allFlag:true,
					columns:[[
						{field:'bh',checkbox:true},
						{field:'mc',title:'全部'}
					]]
				}]
			},{
				eName : 'div',
				cssClass:"tradingWaterQuery_toolBar_secondDiv",
				elements : [{
					eName : 'span',
					cssClass:"tradingWaterQuery_div_span",
					text : '结束日期'
				},{
					eName : 'datebox',
					name:"end_date",
					editable:false,
					width : 95,
					height : 25
				},{
					eName : 'span',
					cssClass:"tradingWaterQuery_div_span",
					elements : '姓&ensp;&ensp;&ensp;名',
				},{
					eName : 'textbox',
					name : 'user_lname',
					validType:"unnormal",
					width : 100,
					height : 25,		
					value:''//默认值
				},{
					eName : 'span',
					cssClass:"tradingWaterQuery_div_span",
					text : '身份证号',
				},{
					eName : 'textbox',
					name : 'user_id',
					//validType:"idCard",
					width : 120,
					height : 25,		
					value:''//默认值
				},{
					eName : 'span',
					cssClass:"tradingWaterQuery_div_span",
					elements : '商户',
				},{
					eName:"combogrid",
					id:"bhList",
					name:"merchant_account",
					idField: 'merchant_account_id',
					textField: 'merchant_name',
					width:120,
					multiple:true,
					allFlag:true,
					columns:[[
						{field:'merchant_account_id',checkbox:true},
						{field:'merchant_name',title:'全部'}
					]]
				},{
					eName : 'span',
					cssClass:"tradingWaterQuery_div_span",
					text : '交易类型',
				},{
					eName : 'combogrid',
//						url:tradTypeQuery,
					name:"trad_type",
					id : 'tradType',
					idField: 'trad_type',    
			        textField: 'trad_type_name',
					width : 120,
					height : 25,		
					value:'',//默认值
					editable:false,
					allFlag:true,
					columns:[[
						{field:'trad_type',checkbox:true},
						{field:'trad_type_name',title:'全部'}
					]]
				}]
			}]
		},{
			eName : 'div',
			cssClass:"tradingWaterQuery_toolBar_thirdDiv",
			elements : [{
				eName:"div",
				elements:[{
					eName :"linkbutton",
					cssClass:"searchBtn",
					uId:"tm1",
					width:58,
					height:28,
					text:"查询",
					onClick : function(){
						searchWin(0);
//						dataTable.datagrid("loadEx",{url:tradWaterQuery,'cx_type':0});
					}
				},{
					eName : 'linkbutton',
					cssClass:"searchBtn",
					uId:"tm3",
					width:58,
					height:28,
					text:"读卡",
					onClick : readCard
				},{
					eName:"linkbutton",
					cssClass:"searchBtn",
					uId:"tm2",
					id:"proCard",
					width:58,
					height:28,
					text:"打印",
					onClick:function(){
						//判断
						if(dataTable.datagrid('getRows').length==0){
							$.alert("数据为空");
						}else{
							utils.printGrid("交易流水查询",dataTable);
						}
					}
				}]
			},{
				eName:"div",
				elements:[{
					eName :"linkbutton",
					cssClass:"searchBtn",
					uId:"tm1",
					width:58,
					height:28,
					text:"清空",
					onClick : function(){
						user_no.textbox("clear");
						user_lname.textbox("clear");;
						user_id.textbox("clear");
						depTree.combotree("clear");
						bhList.combogrid("clear");
						selPlaceTree.combotree("clear");//选择场所
						selDevList.combogrid("clear");
						tradType.combogrid("clear");
					}
				},{
					eName : 'linkbutton',
					cssClass:"searchBtn",
					uId:"tm3",
					width:58,
					height:28,
					text:"读身份证",
					onClick : readIdCard
				},{
					eName : 'linkbutton',
					cssClass:"searchBtn",
					uId:"tm4",
					//cssClass:"tradingWaterQuery_btn",
					width:58,
					height:28,
					text:"导出",
					onClick : function(){
						//导出文档
						/*if(dataTable.datagrid('getRows').length==0){
							$.alert("数据为空");
						}else{
							utils.exportExcel("xls","交易流水查询",dataTable);
						}*/
						if(dataTable.datagrid('getRows').length==0){
							$.alert("数据为空");
						}else{
							var myWin = $.createWin({
								title:"操作提示",
								width:250,
								height:240,
								queryParams:{
									callback:function(i){
										if(i){
											utils.exportExcel("xls","交易流水查询",dataTable);
										}else{
											utils.exportExcel("xlsx","交易流水查询",dataTable);
										}
									}
								},
								url:"js/functionQuery/tradingWaterQuery_export.js"
							});
						}
					}
				}]
			}]
		}]
	}];
	
	var columns = [//列字段定义
      	[{
       		field : 'id',
       		title : 'ID',
       		align : "center",
       		checkbox : true,
       		width : 50
       	}, {
      		field : 'index',
      		title : '..',
      		align : "center",
      		width : 50
      	}, {
       		field : 'account_id',
       		title : '账务id',
       		align : "center",
       		hidden:true,
       		width : 100
       	},{
       		field : 'user_no',
       		title : '学/工号',
       		align : "center",
       		width : 130
       	},{
       		field : 'user_lname',
       		title : '姓名',
       		align : "center",
       		width : 100
       	},{
       		field : 'user_depname',
       		title : '部门',
       		align : "center",
       		width : 100
       	},{
       		field : 'bill_date_str',
       		title : '账务日期',
       		align : "center",
       		width : 130
       	}, {
       		field : 'trad_type_name',
       		title : '交易类型',
       		align : "center",
       		width : 100
       	}, {
       		field : 'event_name',
       		title : '事件类型',
       		align : "center",
       		width : 100
       	}, {
       		field : 'meal_id',
       		title : '餐次',
       		align : "center",
       		width : 100
       	}, {
       		field : 'trad_amt_str',
       		title : '交易金额',
       		align : "center",
       		width : 80
       	}, {
       		field : 'total_cash_amt_str',
       		title : '现金账户余额',
       		align : "center",
       		width : 80
       	}, {
       		field : 'total_sub_amt_str',
       		title : '补贴账户余额',
       		align : "center",
       		width : 80
       	}, {
       		field : 'trad_sj_str',
       		title : '交易日期时间',
       		align : "center",
       		width : 130
       	}, {
       		field : 'media_name',
       		title : '介质类型',
       		align : "center",
       		width : 80
       	},{
       		field : 'card_serial',
       		title : '逻辑卡号',
       		align : "center",
       		width : 100
       	}, {
       		field : 'device_id',
       		title : 'POS号',
       		align : "center",
       		width : 100
       	}, {
       		field : 'pos_flow',
       		title : '发端流水号',
       		align : "center",
       		width : 100
       	}, {
       		field : 'undo_amt_str',
       		title : '已纠错金额',
       		align : "center",
       		width : 80
       	}, {
       		field : 'sub_type_id',
       		title : '补贴类型',
       		align : "center",
       		width : 80
       	}, {
       		field : 'deposit_amt_str',
       		title : '押金余额',
       		align : "center",
       		width : 80
       	}, {
       		field : 'operator',
       		title : '操作员ID',
       		align : "center",
       		width : 80
       	}, {
       		field : 'client',
       		title : '客户端标识',
       		align : "center",
       		width : 80
       	}, {
       		field : 'sj_str',
       		title : '记账日期时间',
       		align : "center",
       		width : 130
       	}, {
       		field : 'merchant_name',
       		title : '商户名称',
       		align : "center",
       		width : 80
       	}, {
       		field : 'acdep_name',
       		title : '场所名称',
       		align : "center",
       		width : 80
       	}, {
       		field : 'bz',
       		title : '摘要',
       		align : "center",
       		width : 310
       	}] ];
	
	var centerUI = {
		eName : 'datagrid',cssClass:'tradingWaterQuery_datagrid',
		id:'dataTable',
		idField : 'id',
		//queryForm:"queryForm",
		docType:'xls',
		toolbarEx : toolBar,// 查询条件工具栏
		columns : columns,
		pagination: true,
		diret:2,
		clientPager:false,
		alertFlag : false,// 是否弹出默认对话框
		autoload : false,
		singleSelect:true,
		checkOnSelect:true,
		selectOnCheck:true,
		onBeforeLoadEx:function(params){
			if(params.acdep_serial){
				var a = params.acdep_serial;
				var b = selPlaceTree.combotree("tree").tree("getRoot").dep_serial+"";
				if(a.indexOf(b)!=-1){
					params.acdep_serial = "all";
				}
			}
		},
		onLoadSuccessEx:function(retJson){
			//$.print(retJson);
			if(retJson.id==0){
				/*user_no.textbox("clear");
				user_lname.textbox("clear");;
				user_id.textbox("clear");
				depTree.combotree("clear");
				commercialTree.combotree("clear");//商户部门
				bhList.combogrid("clear");
				selPlaceTree.combotree("clear");//选择场所
				selDevList.combogrid("clear");
				tradType.combogrid("clear");*/
			}else{
				$.alert(retJson.info);
			}
		}
	};
	
	var mainUI = {
		eName : 'layoutExt',// 容器布局类，jeasyui组件
		//cssClass:'tradingWaterQuery_layout',
		cssStyle:'font-family: 微软雅黑, Arial;',
		fit : true,
		elements : [{
			region : 'center',
			elements : centerUI
		}]
	};
	
	jqObj.loadUI(mainUI);
	var dataTable = jqObj.findJq("dataTable");
	//var queryForm = jqObj.findJq("queryForm");
	var depTree = jqObj.findJq("depTree");//选择部门
	var commercialTree = jqObj.findJq("commercialTree");//商户部门
	var bhList = jqObj.findJq("bhList");//选择商户
	var selPlaceTree = jqObj.findJq("selPlaceTree");//选择场所
	var selDevList = jqObj.findJq("selDevList");//选择设备
	var tradType = jqObj.findJq("tradType");//交易类型
	var user_no = jqObj.findJq("user_no");//学号
	var user_lname = jqObj.findJq("user_lname");//姓名
	var user_id = jqObj.findJq("user_id");//身份证号
	var account_id = jqObj.findJq("account_id");
	var start_date = jqObj.findJq("start_date");//开始时间
	var end_date = jqObj.findJq("end_date");//结束时间
	
	loadTree();//选择部门
	//loadcommercialTree();//加载商户部门
	loadPlaceTree();//加载场所
	tradTypeList();//加载交易类型
	loadTime();//加载日期
	loadBhList();//加载商户
    
	
	/*var pager = dataTable.datagrid('getPager');// get the pager of datagrid
    var pagination_info = pager.findJq("pagination-info");
    pagination_info.createUI({
    	addMode:'before',
    	eName:'linkbutton',
    	uId:"tm1",
    	cssClass:'tradingWaterQuery_pageBtn',
    	text:'表格设置',
    	onClick:function(){
    		
    	}
    });*/
    
    function loadTime(){//加载日期
		var date = new Date();
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		var d = date.getDate();
		var day = new Date(y,m,0);  
		//start_date.datebox("setValue",y + '-' + m + '-' + '1');
		//end_date.datebox("setValue",y + '-' + m + '-' + day.getDate() + " 23:59:59");
		start_date.datebox("setValue",y + '-' + m + '-' + d);
		end_date.datebox("setValue",y + '-' + m + '-' + d);
    }
    
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
	
    /*加载部门树*/
    function loadTree(){
		$.postEx(selDepQuery,function(retJson){
			if(retJson.result && retJson.data){
				depTree.combotree('loadData',
						$.list2Tree(retJson.data,"dep_serial","dep_parent","dep_name"));
			}
		});
	}
    
    /*加载商户部门*/
    /*function loadcommercialTree(){
		$.postEx(selCommercialDepQuery,function(retJson){
			if(retJson.result && retJson.data){
				commercialTree.combotree('loadData',
					$.list2Tree(retJson.data,"dep_serial","dep_parent","dep_name"));
			}
		});
	}*/
    
    function loadBhList(){ /*加载商户*/
		$.postEx(selCommercialQuery,{},function(retJson){
			if(retJson.result && retJson.data){
				var bhGrid = bhList.combogrid("grid");
				bhGrid.datagrid("loadData",retJson.data);
			}
		});
	}
    
    /*加载场所*/
    function loadPlaceTree(){
		$.postEx(selPlaceQuery,function(retJson){
			if(retJson.result && retJson.data){
				selPlaceTree.combotree('loadData',
					$.list2Tree(retJson.data,"dep_serial","dep_parent","dep_name"));
			}
		});
	}
	function loadDevList(param){ /*加载设备*/
		$.postEx(selDevQuery,param,function(retJson){
			if(retJson.result && retJson.data){
				var bhGrid = selDevList.combogrid("grid");
				bhGrid.datagrid("loadData",retJson.data);
			}
		});
	}
    
	//加载交易类型
	function tradTypeList(){
		$.postEx(tradTypeQuery,function(retJson){
			if(retJson.result && retJson.data){
				var tradTypeGrid = tradType.combogrid("grid");
				tradTypeGrid.datagrid("loadData",retJson.data);
			}
		});
	}
	

	function readCard(){//读卡
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
			//depTree.combotree("setValue",retJson.data[0].dep_serial);
			//user_lname.textbox("setValue",retJson.data[0].user_lname);
			//user_id.textbox("setValue",retJson.data[0].user_id);
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
	
	function searchWin(cx_type){
		if(cx_type == 0){
			rData = "";
		}
		//$.print(cx_type);
		dataTable.datagrid("loadEx",{url:tradWaterQuery,'cx_type':cx_type});
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
        },
        idCard:{//身份证号验证
        	validator: function(value){
        		return /(\d|X|x)$/i.test(value);
        	},
        	message: '请输入正确的身份证号'
        }
	});  
});
	