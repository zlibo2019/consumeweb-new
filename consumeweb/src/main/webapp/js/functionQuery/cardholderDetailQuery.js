//持卡人明细账
garen_define("js/functionQuery/cardholderDetailQuery", function(jqObj, loadParams) {
	
	var base = garen_require("js/base/ws_public");
	
	var depQuery = base.depQuery;//部门查询
	
	var ideQuery = base.ideQuery;//身份查询
	
	var allReadIdCard = base.allReadIdCard;//读身份证
	
	var query = "functionQuery/cardholderDetail/query.do";//筛选查询
	
	var detailQuery = "functionQuery/cardholderDetail/detailQuery.do";//明细列表查询
	
	var allReadCard = base.allReadCard;//读卡
	
	var jmjlink = garen_require("js/lib/jmjlink");//卡控件
	
	var rData = "";
	
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
	              	}, {
	              		field : 'account_id',
	              		title : '账户ID',
	              		align : "center",
	              		width : 80
	              	}, {
	              		field : 'bill_date_str',
	              		title : '账务日期',
	              		align : "center",
	              		width : 80
	              	}, {
	              		field : 'trad_type_name',
	              		title : '交易类型',
	              		align : "center",
	              		width : 90
	              	}, {
	              		field : 'event_name',
	              		title : '事件类型',
	              		align : "center",
	              		width : 90
	              	}, {
	              		field : 'meal_id',
	              		title : '餐次',
	              		align : "center",
	              		width : 40
	              	}, {
	              		field : 'trad_amt_str',
	              		title : '交易金额',
	              		align : "center",
	              		width : 60
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
	              		width : 140
	              	}, {
	              		field : 'media_name',
	              		title : '介质类型',
	              		align : "center",
	              		width : 60
	              	}, {
	              		field : 'card_serial',
	              		title : '逻辑卡号',
	              		align : "center",
	              		width : 60
	              	}, {
	              		field : 'device_id',
	              		title : 'POS号',
	              		align : "center",
	              		width : 50
	              	}, {
	              		field : 'pos_flow',
	              		title : '发端流水号',
	              		align : "center",
	              		width : 80
	              	}, {
	              		field : 'undo_amt_str',
	              		title : '已纠错金额',
	              		align : "center",
	              		width : 80
	              	}, {
	              		field : 'sub_type_id',
	              		title : '补贴类型',
	              		align : "center",
	              		width : 60
	              	}, {
	              		field : 'deposit_amt_str',
	              		title : '押金余额',
	              		align : "center",
	              		width : 60
	              	}, {
	              		field : 'operator',
	              		title : '操作员ID',
	              		align : "center",
	              		width : 60
	              	}, {
	              		field : 'client',
	              		title : '客户端标识',
	              		align : "center",
	              		width : 80
	              	}, {
	              		field : 'sj_str',
	              		title : '记账日期时间',
	              		align : "center",
	              		width : 140
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
	              		align : "center"
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
			cssClass : 'cardholderDetailQuery_north_second',
			elements : [{
				eName : 'div',
				cssClass:"div_first",
				elements:[{
					eName:"div",
					elements:[{
						eName:"span",
						text: "开始账务日期"
					},{
						eName:"datebox",
						editable:false,
						width : 150,
						height : 25,
						name:"start_date"
					},{
						eName:"span",
						text: "学/工号"
					},{
						eName:"textbox",
						name : 'user_no',
						width : 150,
						height : 25,
						value:'',//默认值
						validType:["number","length[0,18]"]
					},{
						eName:"span",
						elements: "部&emsp;&emsp;门"
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
					}]
				},{
					eName:"div",
					elements:[{
						eName:"span",
						text: "结束账务日期"
					},{
						eName:"datebox",
						editable:false,
						width : 150,
						height : 25,
						name:"end_date"
					},{
						eName:"span",
						elements: "姓&emsp;&ensp;名"
					},{
						eName:"textbox",
						name:"user_lname",
						validType:"unnormal",
						width : 150,
						height : 25
					},{
						eName:"span",
						text: "身份证号"
					},{
						eName:"textbox",
						name : 'user_id',
						//validType:"idCard",
						width : 150,
						height : 25,
						value:''//默认值
					}]
				}]
			},{
				eName : 'div',
				cssClass : 'cardholderDetailQuery_div',
				elements : [{
					eName : 'div',
					cssStyle:"margin-bottom: 6px;",
					elements : [{
						eName : 'linkbutton',
						id:"searchBtn",
						uId:"tm1",
						width:68,
						height:31,
						cssClass:'cardholderDetailQuery_chaxun',
						text:"查询",
						onClick : function(){
							searchWin(0);
						}
					},{
						eName : 'linkbutton',
						uId:"tm1",
						width:68,
						height:31,
						cssClass:'cardholderDetailQuery_chaxun',
						text:"读卡",
						onClick : readCard
					}]
				},{
					eName : 'div',
					elements : [{
						eName : 'linkbutton',
						id:"searchBtn",
						uId:"tm1",
						width:68,
						height:31,
						cssClass:'cardholderDetailQuery_chaxun',
						text:"清空",
						onClick : function(){
							user_no.textbox("clear");
							dep_serial.combotree("clear");
							user_lname.textbox("clear");
							user_id.textbox("clear");
						}
					},{
						eName : 'linkbutton',
						uId:"tm1",
						width:68,
						height:31,
						cssClass:'cardholderDetailQuery_chaxun',
						text:"读身份证",
						onClick : readIdCard
					}]
				}]
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
				height:95,
				elements : northUI
			},{
				region : 'center',
				elements : centerUI
			}]
	};

	jqObj.loadUI(mainUI);
	var dataTable = jqObj.findJq("dataTable");
	var search_form = jqObj.findJq("search_form");
	var user_no = jqObj.findJq("user_no");
	var dep_serial = jqObj.findJq("dep_serial");
	var user_lname = jqObj.findJq("user_lname");
	var user_id = jqObj.findJq("user_id");
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
	
	function loadInit(){
//		var date = new Date();
//		var y = date.getFullYear();
//		var m = date.getMonth() + 1;
//		var start_d = "01";
//		//var end_d = getMonthDays(y,m);
//		start_date.datebox("setValue",y + '-' + (m<10?('0'+m):m) + '-' + start_d);
//		end_date.datebox("setValue",y+1 + '-' + (m<10?('0'+m):m) + '-' + start_d);
		
		var date = new Date();
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		var d = date.getDate();
		var day = new Date(y,m,0);  
		start_date.datebox("setValue",y + '-' + (m<10?('0'+m):m) + '-' + '01');
		end_date.datebox("setValue",y + '-' + (m<10?('0'+m):m) + '-' + day.getDate());
	}
	
	//获取本月天数
//	function getMonthDays(year,month){
//		var date1 = new Date(year,month,1);
//		var date2 = new Date(date1.getTime() - 24 * 60 * 60 * 1000);
//		return date2.getDate();
//	}
	
	function loadTree(){
		$.postEx(depQuery,function(retJson){
			if(retJson.result && retJson.data){
				dep_serial.combotree('loadData',
						$.list2Tree(retJson.data,"dep_serial","dep_parent","dep_name"));
			}
		});
	}
	
	function searchWin(cx_type){
//		var num = /^([+]?[A-Za-z0-9_-])+\d*$/;
//		var un = /[@#\$%\^&\*！!<>\\\/]+/;
//		if(user_no.textbox("getValue")!="" && !num.test(user_no.textbox("getValue"))){
//			user_no.textbox("textbox").focus();
//		}
//		else if(user_lname.textbox("getValue")!="" && un.test(user_lname.textbox("getValue"))){
//			user_lname.textbox("textbox").focus();
//		}else{
			
		var params = search_form.findJqUI().form2Json();
//		if(params.dep_serial=="" && params.user_id=="" 
//			&& params.user_lname=="" && params.user_no==""){
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
						$.alert("没有找到此持卡人记录！");
						searchBtn.linkbutton("enable");
					}
					else if(retJson.data.length==1){
						user_no.textbox("setValue",retJson.data[0].user_no);
						dep_serial.combotree("setValue",retJson.data[0].dep_serial);
						user_lname.textbox("setValue",retJson.data[0].user_lname);
						user_id.textbox("setValue",retJson.data[0].user_id);
						var param = {};
						param['user_serial'] = retJson.data[0].user_serial;
						param['start_date'] = start_date.datebox("getValue");
						param['end_date'] = end_date.datebox("getValue");
						param['url'] = detailQuery;
						param['cx_type'] = cx_type;
						//dataTable.datagrid("load",param);
						dataTable.datagrid("loadEx",param);
						//searchWin2(0);
						searchBtn.linkbutton("enable");
					}
					else{
						var myWin = $.createWin({
							title:"确认信息",
							width:480,
							height:320,
							queryParams:{
								params:retJson.data,
								callback:success
							},
							url:"js/functionQuery/cardholderDetailQuery_searchWin.js"
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
		user_no.textbox("setValue",row.user_no);
		dep_serial.combotree("setValue",row.dep_serial);
		user_lname.textbox("setValue",row.user_lname);
		user_id.textbox("setValue",row.user_id);
		var param = {};
		param['user_serial'] = row.user_serial;
		param['start_date'] = start_date.datebox("getValue");
		param['end_date'] = end_date.datebox("getValue");
		param['url'] = detailQuery;
		param['cx_type'] = 0;
		//dataTable.datagrid("load",param);
		dataTable.datagrid("loadEx",param);
		//searchWin2(0);
	}

	//读卡
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
			//dep_serial.combotree("setValue",retJson.data[0].user_dep);
			//user_lname.textbox("setValue",retJson.data[0].user_lname);
			//user_id.textbox("setValue",retJson.data[0].user_id);
			
			user_lname.textbox("clear");
			dep_serial.combotree("clear");
			user_id.textbox("clear");
			
			user_no.textbox("setText","");
			
			var param={};
			param['account_id'] = retJson.data[0].account_id;
			rData = param;
			successBeep();
			//searchWin2(1);
			
			//param['user_serial'] = retJson.data[0].user_serial;
			//param['start_date'] = start_date.datebox("getValue");
			//param['end_date'] = end_date.datebox("getValue");
			//param['url'] = detailQuery;
			//param['cx_type']=1
			//dataTable.datagrid("load",param);
			//dataTable.datagrid("loadEx",param);
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
				dep_serial.combotree("clear");
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
//	function searchWin2(cx_type){
//		if(cx_type == 0){
//			rD = "";
//		}
//		dataTable.datagrid("loadEx",{url:detailQuery,'cx_type':cx_type});
//	}
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
         idCard:{//身份证号验证
         	validator: function(value){
         		return /(\d|X|x)$/i.test(value);
         	},
         	message: '请输入正确的身份证号'
         },
         unnormal: {// 验证是否包含空格和非法字符
             validator: function (value) {
                 return !/[ '"@#\$%\^&\*！!<>\\\/]+/i.test(value);
             },
             message: '输入值不能为空和包含其他非法字符'
         }
	});  
});
