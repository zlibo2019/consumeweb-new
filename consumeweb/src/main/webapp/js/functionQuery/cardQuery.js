//卡片查询
garen_define("js/functionQuery/cardQuery", function(jqObj, loadParams) {
	
	var base = garen_require("js/base/ws_public");
	
	var depQuery = base.depQuery;//部门查询
	
	var ideQuery = base.ideQuery;//身份查询
	
	var cardStateQuery = "functionQuery/card/cardStateQuery.do";//卡状态查询
	
	var cardDetailQuery = "functionQuery/card/detailQuery.do";//卡明细查询
	
	var jmjlink = garen_require("js/lib/jmjlink");//卡控件
	
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
      		field : 'is_main_card',
      		title : '主卡/附卡',
      		align : "center",
      		width : 80
      	}, {
      		field : 'card_state',
      		title : '卡状态',
      		align : "center",
      		width : 80
      	}, {
      		field : 'card_type_name',
      		title : '介质类型',
      		align : "center",
      		width : 80
      	}, {
      		field : 'card_number',
      		title : '卡号',
      		align : "center",
      		width : 100
      	}, {
      		field : 'card_serial',
      		title : '逻辑卡号',
      		align : "center",
      		width : 80
      	}, {
      		field : 'card_add_date',
      		title : '发卡日期',
      		align : "center",
      		width : 100
      	}, {
      		field : 'card_charge_str',
      		title : '押金',
      		align : "center",
      		width : 80
      	}, {
      		field : 'user_no',
      		title : '学/工号',
      		align : "center",
      		width : 110
      	}, {
      		field : 'user_lname',
      		title : '姓名',
      		align : "center",
      		width : 100
      	}, {
      		field : 'user_depname',
      		title : '部门',
      		align : "center",
      		width : 130
      	}, {
      		field : 'identity_name',
      		title : '身份类型',
      		align : "center",
      		width : 80
      	}, {
      		field : 'sj_str',
      		title : '更新时间',
      		align : "center",
      		width : 140
      	}
      	] ];
	
	var toolBar = [{
		eName : 'div',
		height : 10,
		cssStyle : 'background:#ffffff;'
	},{
		eName:"formUI",
		method:"post",
		id:"search_form",
		elements:{
			eName : 'div',
			cssClass : 'subsidyAccountQuery_north_second',
			elements : [{
				eName : 'div',
				cssClass:"div_first",
				elements:[{
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
				},
				/*{
					eName : 'span',
					text : '身份类型',
					cssClass:"first_div_span"
				},{
					eName:"combogrid",
					id:"ideList",
					name:"identity_id",
					idField:"ident_id",
					//valueField: 'ident_id',    
			        textField: 'ident_name',
			        panelHeight:$.browser.msie9?200:'auto',
					panelMaxHeight:200,
					width : 130,
					height : 25,
					editable:false,
					multiple:true,
					singleSelect: false,
					selectOnCheck:true,
					allFlag:true,
					columns:[[
						{field:'ident_id',checkbox:true},
						{field:'ident_name',title:'全部',width:80}
					]]
				},*/
				{
					eName:"span",
					text : '卡号',
					//cssClass:"first_div_span"
					
				},{
					eName:"textbox",
					name:"card_no",
					width : 130,
					height : 25
				},{
					eName:"span",
					text: "主/附卡"
				},{
					eName:"combogrid",
					name:"is_main_card",
					idField:"is_main_card_id",
					//valueField: 'ident_id',    
			        textField: 'is_main_card_name',
			        panelHeight:$.browser.msie9?200:'auto',
					panelMaxHeight:200,
					width : 130,
					height : 25,
					editable:false,
					multiple:true,
					singleSelect: false,
					selectOnCheck:true,
					allFlag:true,
					columns:[[
						{field:'is_main_card_id',checkbox:true},
						{field:'is_main_card_name',title:'全部'}
					]],
					data:[
					    {is_main_card_id:1,is_main_card_name:"主卡"},
					    {is_main_card_id:0,is_main_card_name:"附卡"}
					]
				},{
					eName:"span",
					text: "介质类型"
				},{
					eName:"combogrid",
					name:"card_lx",
					idField:"card_lx_id",
					//valueField: 'ident_id',    
			        textField: 'card_lx_name',
			        panelHeight:$.browser.msie9?200:'auto',
					panelMaxHeight:200,
					width : 130,
					height : 25,
					editable:false,
					multiple:true,
					singleSelect: false,
					selectOnCheck:true,
					allFlag:true,
					columns:[[
						{field:'card_lx_id',checkbox:true},
						{field:'card_lx_name',title:'全部'}
					]],
					data:[
						{card_lx_id:148,card_lx_name:"IC-S50"},
						{card_lx_id:147,card_lx_name:"ID卡"},
						{card_lx_id:154,card_lx_name:"IC-S70"},
						{card_lx_id:149,card_lx_name:"CPU卡"}
					]
				},{
					eName:"span",
					text: "卡状态"
				},{
					eName:"combogrid",
					id:"cardState",
					name:"card_state",
					idField:"card_state",
			        textField: 'state_name',
			        panelHeight:$.browser.msie9?200:'auto',
					panelMaxHeight:200,
					width : 130,
					height : 25,
					editable:false,
					multiple:true,
					singleSelect: false,
					selectOnCheck:true,
					allFlag:true,
					columns:[[
						{field:'card_state',checkbox:true},
						{field:'state_name',title:'全部'}
					]]
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
						onClick : function(){
							dataTable.datagrid("loadEx",{url:cardDetailQuery});
						}
					},{
						eName : 'linkbutton',
						uId:"tm1",
						width:60,
						height:30,
						cssClass:'subsidyAccountQuery_chaxun',
						text:"读卡",
						onClick : readCard
					}]
				}
			}]
		}
	}];
	
	var centerUI = {
			eName : 'datagrid',
			idField : 'id',
			id:"dataTable",
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
									card_charge_str: (retJson.retData.sum_charge/100).toFixed(2)
								});
								dataTable.datagrid("mergeCells",{
									index: i+1,
									field: 'index',
									colspan: 7
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
			elements : [{
				region : 'center',
				elements : centerUI
			}]
	};

	jqObj.loadUI(mainUI);
	var dataTable = jqObj.findJq("dataTable");
	var search_form = jqObj.findJq("search_form");
	var dep_serial = jqObj.findJq("dep_serial");
	var searchBtn = jqObj.findJq("searchBtn");
	var ideList = jqObj.findJq("ideList");
	var cardState = jqObj.findJq("cardState");
	var is_main_card = jqObj.findJq("is_main_card");
	var card_lx = jqObj.findJq("card_lx");
	
	loadTree();//加载选择部门树
	loadIdeList();
	loadCardState();
	
	function loadTree(){
		$.postEx(depQuery,function(retJson){
			if(retJson.result && retJson.data){
				dep_serial.combotree('loadData',
						$.list2Tree(retJson.data,"dep_serial","dep_parent","dep_name"));
			}
		});
	}
	
	function loadIdeList(){
		$.postEx(ideQuery,function(retJson){
			if(retJson.result && retJson.data){
				var ideGrid = ideList.combogrid("grid");
				ideGrid.datagrid("loadDataEx",retJson.data);
			}
		});
	}
	
	function loadCardState(){
		$.postEx(cardStateQuery,function(retJson){
			if(retJson.result && retJson.data){
				var stateGrid = cardState.combogrid("grid");
				stateGrid.datagrid("loadDataEx",retJson.data);
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
			url:"js/functionQuery/cardQueryWin.js"
		});
	}
	
	function readCardBack(jt,i){
		if(i){
			successBeep();
			var param = {};
			param['url'] = cardDetailQuery;
			param['card_number'] = jt.retData.CardNo;
			param['media_id'] = jt.retData.CardType;
			dataTable.datagrid("loadEx",param);
		}else{
			errorBeep();
		}
		
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
	
	/*//读卡
	function readCard2(){
		var params = {
			"commandSet":[{
				"funName":"ReqCard", 
				"param":""
			}]
		};
		jmjlink.send(function(jtype,jtext,jpre_str){
			if(jtype==2){
				$.alert(jpre_str);
			}else{
				var jt = $.parseJSON(jtext);
				if(jt.ErrCode=="0"){
//					var param = {};
//					param['card_number'] = jt.retData.CardNo;
//					param['media_id'] = jt.retData.CardType;
					dataTable.datagrid("loadEx",{url:cardDetailQuery,card_number:jt.retData.CardNo,media_id:jt.retData.CardType});
					successBeep();
				}else if(jt.ErrCode=="-102"){
					$.alert("未寻到卡，请将卡放到读卡器后再次读卡！");
					errorBeep();
				}else{
					$.alert("寻卡错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
					errorBeep();
				}
			}
		},'寻卡',$.toJSON(params));
	}
	
	*/
	
});
