//商户交易明细
garen_define("js/functionQuery/merchantDetailQuery", function(jqObj, loadParams) {
	
	var departmentQuery = "functionQuery/merchantDetail/departmentQuery.do";//商户部门查询
	
	var query = "functionQuery/merchantDetail/query.do";//筛选查询
	
	var detailQuery = "functionQuery/merchantDetail/detailQuery.do";//明细列表查询
	
	var columns = [//列字段定义
	             	[ {
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
	              	},  {
	              		field : 'device_id',
	              		title : 'POS名称',
	              		align : "center",
	              		width : 100
	              	}, {
	              		field : 'meal_id',
	              		title : '餐别名称',
	              		align : "center",
	              		width : 80
	              	}, {
	              		field : 'pos_flow',
	              		title : '设备流水号',
	              		align : "center",
	              		width : 80
	              	}, {
	              		field : 'trad_type_id',
	              		title : '交易类型',
	              		align : "center",
	              		width : 80
	              	}, {
	              		field : 'event_name',
	              		title : '事件类型',
	              		align : "center",
	              		width : 100
	              	}, {
	              		field : 'trad_amt_str',
	              		title : '交易金额',
	              		align : "center",
	              		width : 100
	              	}, {
	              		field : 'trad_sj_str',
	              		title : '交易时间',
	              		align : "center",
	              		width : 150
	              	}, {
	              		field : 'sj_str',
	              		title : '入账时间',
	              		align : "center",
	              		width : 150
	              	}, {
	              		field : 'bill_date_str',
	              		title : '账务日期',
	              		align : "center",
	              		width : 100
	              	}] ];
	
	var northUI = [{
		eName : 'div',
		height : 10,
		cssStyle : 'background:#ffffff;'
	},{
		eName:"formUI",
		method:"post",
		id:"search_form",
		elements:{
			eName : 'div',
			cssClass : 'merchantDetailQuery_north_second',
			elements : [{
				eName : 'div',
				cssClass:"div_first",
				elements:[{
					eName:"span",
					text: "商户账号"
				},{
					eName:"textbox",
					name : 'merchant_account_id',
					width : 130,
					height : 25,
					value:'',//默认值
					validType:["mNumber","length[0,18]"]
				},{
					eName:"span",
					text: "商户名称"
				},{
					eName:"textbox",
					name:"merchant_name",
					validType:"unnormal",
					width : 130,
					height : 25
				},{
					eName:"span",
					text: "商户部门"
				},{
					eName:"combotree",
					name:"dep_serial",
					panelHeight:$.browser.msie9?200:'auto',
					panelMaxHeight:200,
					width : 150,
					height : 25,
					multiple:true,
					value:'',//默认值
					onSelect:function(node){//选择相同则清空文本内容
						if(dep_serial.combo("getText")==node.text){
							dep_serial.combotree("clear");
						}
					}
				},{
					eName:"span",
					text: "开始账务日期"
				},{
					eName:"datebox",
					editable:false,
					width : 130,
					height : 25,
					name:"start_date"
				},{
					eName:"span",
					text: "结束账务日期"
				},{
					eName:"datebox",
					editable:false,
					width : 130,
					height : 25,
					name:"end_date"
				},]
			},{
				eName : 'div',
				cssClass : 'merchantDetailQuery_div',
				elements : {
					eName : 'div',
					elements : [{
						eName : 'linkbutton',
						id:"searchBtn",
						uId:"tm1",
						width:60,
						height:30,
						cssClass:'merchantDetailQuery_chaxun',
						text:"查询",
						onClick : searchWin
					}]
				}
			}]
		}
	}];
	
	var centerUI = {
			eName : 'datagrid',
			idField : 'id',
			id:"dataTable",
			//url : detailQuery,
			//queryForm:"searchForm",
			//toolbarEx : toolBar,// 查询条件工具栏
			columns : columns,
			pagination: true,//分页
			clientPager:true,
			showFooter:true,
			alertFlag : false,// 是否弹出默认对话框
			autoload : false,
			singleSelect:true,
			checkOnSelect:true,
			selectOnCheck:true,
			onLoadSuccessEx:function(retJson){
				if(retJson.id=="0"){
					
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
				region : 'north',
				height:60,
				elements : northUI
			},{
				region : 'center',
				elements : centerUI
			}]
	};

	jqObj.loadUI(mainUI);
	var dataTable = jqObj.findJq("dataTable");
	var search_form = jqObj.findJq("search_form");
	var merchant_account_id = jqObj.findJq("merchant_account_id");
	var merchant_name = jqObj.findJq("merchant_name");
	var dep_serial = jqObj.findJq("dep_serial");
	var start_date = jqObj.findJq("start_date");
	var end_date = jqObj.findJq("end_date");
	var searchBtn = jqObj.findJq("searchBtn");
	
	loadTree();//加载选择部门树
	loadInit();//加载初始化
	
//	document.onkeydown=function(event){
//		var e = event || window.event || arguments.callee.caller.arguments[0];
//		if(e && e.keyCode==13){ // enter 键
//			searchWin();
//	    }
//	};
	
	//键盘回车事件
	merchant_account_id.textbox("textbox").keydown(function(e){
		var key = e.keyCode;//兼容firefox
		if(key == 13){
			searchWin();
		}
	});
	
	merchant_name.textbox("textbox").keydown(function(e){
		var key = e.keyCode;//兼容firefox
		if(key == 13){
			searchWin();
		}
	});
	
	function loadInit(){
		var date = new Date();
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		var start_d = "01";
		var end_d = getMonthDays(y,m);
		start_date.datebox("setValue",y + '-' + (m<10?('0'+m):m) + '-' + start_d);
		end_date.datebox("setValue",y + '-' + (m<10?('0'+m):m) + '-' + end_d);
	}
	
	//获取本月天数
	function getMonthDays(year,month){
		var date1 = new Date(year,month,1);
		var date2 = new Date(date1.getTime() - 24 * 60 * 60 * 1000);
		return date2.getDate();
	}
	
	function loadTree(){
		$.postEx(departmentQuery,function(retJson){
			if(retJson.result && retJson.data){
				dep_serial.combotree('loadData',
						$.list2Tree(retJson.data,"dep_serial","dep_parent","dep_name"));
			}
		});
	}
	
	function searchWin(){
//		var num = /^([+]?[A-Za-z0-9_-])+\d*$/;
//		var un = /[@#\$%\^&\*！!<>\\\/]+/;
//		if(merchant_account_id.textbox("getValue")!="" && !num.test(merchant_account_id.textbox("getValue"))){
//			merchant_account_id.textbox("textbox").focus();
//		}
//		else if(merchant_name.textbox("getValue")!="" && un.test(merchant_name.textbox("getValue"))){
//			merchant_name.textbox("textbox").focus();
//		}else{
		var params = search_form.findJqUI().form2Json();
		//params['dep_serial'] = dep_serial.combotree('getValue');
//		if(params.merchant_account_id=="" && params.merchant_name=="" 
//			&& params.dep_serial==""){
//			$.alert("请输入一个查询条件！");
//		}else{
		if(params.start_date>params.end_date){
			$.alert("开始账务日期不能大于结束账务日期！");
			return false;
		}
		var p = {};
		var myform = jqObj.findJq("search_form");
		if(myform.form('form2Json',p)){//true则表单验证通过
			searchBtn.linkbutton("disable");
			$.postEx(query,params,function(retJson){
				if(retJson.result){
					if(retJson.data.length==0){
						$.alert("没有找到此商户记录！");
						searchBtn.linkbutton("enable");
					}
					else if(retJson.data.length==1){
						merchant_account_id.textbox("setValue",retJson.data[0].merchant_account_id);
						merchant_name.textbox("setValue",retJson.data[0].merchant_name);
						dep_serial.combotree("setValue",retJson.data[0].dep_serial);
						var param = {};
						param['merchant_account_id'] = retJson.data[0].merchant_account_id;
						param['start_date'] = start_date.datebox("getValue");
						param['end_date'] = end_date.datebox("getValue");
						param['url'] = detailQuery;
						//dataTable.datagrid("load",param);
						dataTable.datagrid("loadEx",param);
						searchBtn.linkbutton("enable");
					}
					else{
						var myWin = $.createWin({
							title:"确认信息",
							width:535,
							height:320,
							queryParams:{
								params:retJson.data,
								callback:success
							},
							url:"js/functionQuery/merchantDetailQuery_searchWin.js"
						});
						searchBtn.linkbutton("enable");
					}
				}else{
					$.alert(retJson.info);
					searchBtn.linkbutton("enable");
				}
			});
		}
//		}
//		}
	}
	
	function success(row){
		merchant_account_id.textbox("setValue",row.merchant_account_id);
		merchant_name.textbox("setValue",row.merchant_name);
		dep_serial.combotree("setValue",row.dep_serial);
		var param = {};
		param['merchant_account_id'] = row.merchant_account_id;
		param['start_date'] = start_date.datebox("getValue");
		param['end_date'] = end_date.datebox("getValue");
		param['url'] = detailQuery;
		//dataTable.datagrid("load",param);
		dataTable.datagrid("loadEx",param);
	}
	
	//文本长度验证
	merchant_account_id.next().children().eq(0).attr("maxlength",18);
	merchant_name.next().children().eq(0).attr("maxlength",10);
	
	//扩展验证
	$.extend($.fn.validatebox.defaults.rules, {    
		 mNumber: {// 半角字符验证
             validator: function (value) {
                 return /^([0-9])+\d*$/i.test(value);
             },
             message: '只能输入数字'
         },
         unnormal: {// 验证是否包含空格和非法字符
             validator: function (value) {
                 return !/[ '"@#\$%\^&\*！!<>\\\/]+/i.test(value);
             },
             message: '输入值不能为空和包含其他非法字符'
         }
	});  
});
