//补贴批次账户查询
garen_define("js/functionQuery/subsidyAccountQuery", function(jqObj, loadParams) {
	
	var base = garen_require("js/base/ws_public");
	
	var depQuery = base.depQuery;//部门查询
	
	var ideQuery = base.ideQuery;//身份查询
	
	var allReadIdCard = base.allReadIdCard;//读身份证
	
	var query = "functionQuery/subsidyAccount/query.do";//筛选查询
	
	//var detailQuery = "functionQuery/subsidyAccount/detailQuery.do";//明细列表查询
	
	var allReadCard = base.allReadCard;//读卡
	
	var jmjlink = garen_require("js/lib/jmjlink");//卡控件
	
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
	              		width : 100
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
	              		field : 'dep_name',
	              		title : '部门',
	              		align : "center",
	              		width : 100
	              	}, {
	              		field : 'account_state',
	              		title : '账户状态',
	              		align : "center",
	              		width : 100
	              	}, {
	              		field : 'sub_type',
	              		title : '补贴类型',
	              		align : "center",
	              		width : 80
	              	}, {
	              		field : 'sub_begin_date_str',
	              		title : '启用日期',
	              		align : "center",
	              		width : 80
	              	}, {
	              		field : 'sub_end_date_str',
	              		title : '有效日期',
	              		align : "center",
	              		width : 80
	              	}, {
	              		field : 'sub_amt_str',
	              		title : '余额',
	              		align : "center",
	              		width : 100
	              	}, {
	              		field : 'sub_zero_amt_str',
	              		title : '清零余额',
	              		align : "center",
	              		width : 100
	              	}, {
	              		field : 'bill',
	              		title : '记账状态',
	              		align : "center",
	              		width : 100
	              	}] ];
	
	var toolBar = [null,{
		eName : 'div',
		height : 10,
		cssStyle : 'background:#ffffff;'
	},{
		eName : 'div',
		cssClass : 'subsidyAccountQuery_north_second',
		elements : [{
			eName : 'div',
			cssClass:"div_first",
			elements:[{
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
				text: "部门"
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
				text: "姓名"
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
		},{
			eName : 'div',
			cssClass : 'subsidyAccountQuery_div',
			elements : {
				eName : 'div',
				elements : [{
					eName : 'linkbutton',
					id:"searchBtn",
					uId:"tm1",
					width:60,
					height:30,
					cssClass:'subsidyAccountQuery_chaxun',
					text:"查询",
					onClick : searchWin
				},{
					eName : 'linkbutton',
					id:"searchBtn",
					uId:"tm1",
					width:60,
					height:30,
					cssClass:'subsidyAccountQuery_chaxun',
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
					width:60,
					height:30,
					cssClass:'subsidyAccountQuery_chaxun',
					text:"读卡",
					onClick : readCard
				},{
					eName : 'linkbutton',
					uId:"tm1",
					width:60,
					height:30,
					cssClass:'subsidyAccountQuery_chaxun',
					text:"读身份证",
					onClick : readIdCard
				}]
			}
		}]
	}];
	
	var centerUI = {
			eName : 'datagrid',
			idField : 'id',
			id:"dataTable",
			//url : detailQuery,
			//queryForm:"searchForm",
			toolbarEx : toolBar,// 查询条件工具栏
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
					if(retJson.data.length>0){
						var rows = dataTable.datagrid("getRows");//当前页所有行
						$.each(rows,function(i,row){//遍历当前页所有数据
							if(row == retJson.data[retJson.data.length-1]){//当前页的数据是最后一行
								dataTable.datagrid('appendRow',{
									index: '合计',
									sub_amt_str:(retJson.retData.sub_total/100).toFixed(2),
									sub_zero_amt_str:(retJson.retData.sub_zero_total/100).toFixed(2)
								});
								dataTable.datagrid("mergeCells",{
									index: i+1,
									field: 'index',
									colspan: 9
								});
							}
						});
					}
				}else{
					$.alert(retJson.info);
				}
			}
		};
	var mainUI = {
			eName : 'layoutExt',// 容器布局类，jeasyui组件
			cssStyle:'font-family: 微软雅黑, Arial;',
			fit : true,
			elements : [
			            /*{
				region : 'north',
				height:60,
				elements : northUI
			},*/
			{
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
	var searchBtn = jqObj.findJq("searchBtn");
	
	loadTree();//加载选择部门树
	
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
	
	function loadTree(){
		$.postEx(depQuery,function(retJson){
			if(retJson.result && retJson.data){
				dep_serial.combotree('loadData',
						$.list2Tree(retJson.data,"dep_serial","dep_parent","dep_name"));
			}
		});
	}
	
	function searchWin(){
		dataTable.datagrid("loadEx",{url:query});
//		var num = /^([+]?[A-Za-z0-9_-])+\d*$/;
//		var un = /[@#\$%\^&\*！!<>\\\/]+/;
//		var ic = /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/;
//		if(user_no.textbox("getValue")!="" && !num.test(user_no.textbox("getValue"))){
//			user_no.textbox("textbox").focus();
//		}
//		else if(user_lname.textbox("getValue")!="" && un.test(user_lname.textbox("getValue"))){
//			user_lname.textbox("textbox").focus();
//		}
//		else if(user_id.textbox("getValue")!="" && !ic.test(user_id.textbox("getValue"))){
//			user_id.textbox("textbox").focus();
//		}
//		else{
		//var params = search_form.findJqUI().form2Json();
//		if(params.dep_serial=="" && params.user_id=="" 
//			&& params.user_lname=="" && params.user_no==""){
//			$.alert("请输入一个查询条件！");
//		}else{
		/*var p = {};
		var myform = jqObj.findJq("search_form");
		if(myform.form('form2Json',p)){//true则表单验证通过
			searchBtn.linkbutton("disable");
			$.postEx(query,params,function(retJson){
				if(retJson.result){
					
					if(retJson.data.length==0){
						$.alert("没有找到此账户记录！");
						searchBtn.linkbutton("enable");
					}
					else{
						searchBtn.linkbutton("enable");
					}
					else if(retJson.data.length==1){
						user_no.textbox("setValue",retJson.data[0].user_no);
						dep_serial.combotree("setValue",retJson.data[0].dep_serial);
						user_lname.textbox("setValue",retJson.data[0].user_lname);
						user_id.textbox("setValue",retJson.data[0].user_id);
						var param = {};
						param['user_serial'] = retJson.data[0].user_serial;
						param['url'] = detailQuery;
						dataTable.datagrid("loadEx",param);
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
							url:"js/functionQuery/subsidyAccountQuery_searchWin.js"
						});
						searchBtn.linkbutton("enable");
					}
					
				}else{
					$.alert(retJson.info);
					searchBtn.linkbutton("enable");
				}
			});*/
//		}
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
		param['url'] = detailQuery;
		dataTable.datagrid("loadEx",param);
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
			
			var param = {};
			param['account_id'] = retJson.data[0].account_id;
			rData = param;
			successBeep();
			searchWin();
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
