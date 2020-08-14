//发卡
garen_define("js/account/cardManage_provideCard",function (jqObj,loadParams) {

	var cardListQuery = "account/" +
		"cardListQuery.do";//持卡列表
	
	var columns = [//列字段定义
     	[ {
      		field : 'user_lname',
      		title : '人员',
      		align : "center",
      		width : 80
      	}, {
      		field : 'user_no',
      		title : '学/工号',
      		align : "center",
      		width : 80
      	}, {
      		field : 'cardhold_serial',
      		title : '卡序号',
      		align : "center",
      		width : 55
      	}, {
     		field : 'card_serial',
     		title : '逻辑卡号',
     		align : "center",
     		width : 60
     	}, {
      		field : 'card_number',
      		title : '卡号',
      		align : "center",
      		width : 70
      	}, {
      		field : 'media_id_name',
      		title : '卡类型',
      		align : "center",
      		width : 70
      	}, {
      		field : 'sj_str',
      		title : '发卡日期',
      		align : "center",
      		width : 80
      	}, {
      		field : 'is_main_card',
      		title : '主/附卡',
      		align : "center",
      		width : 60
      	}, {
      		field : 'card_state_name',
      		title : '卡状态',
      		align : "center",
      		width : 60
      	}, {
      		field : 'Is_card_replace_name',
      		title : '备注',
      		align : "center",
      		width : 88
      	}] ];
	
	
	var cardManageWinUI = {
		eName:"div",
		cssClass:"cardManage_searchWin",
		elements:[{
			eName:"div",
			height:210,
			width:722,
			elements:{
				eName : 'datagrid',
				id:"dataTable",
				idField : 'account_id',
				url:cardListQuery,
				columns : columns,
				pagination: false,
				clientPager:false,
				showFooter:false,
				alertFlag : false,// 是否弹出默认对话框
				autoload : false,
				singleSelect:true,
				checkOnSelect:false,
				selectOnCheck:false,
				onLoadSuccessEx:function(retJson){
					if(retJson.id=="0"){
						
					}else{
						$.alert(retJson.info);
					}
				}
				
			}
		},{
			eName:"div",
			cssClass:"cardManage_btn_div",
			elements:[{
				eName:"linkbutton",
				uId:"tm2",
				cssClass:"cardManage_searchWin_linkbutton",
				text : '发主卡',
				width : 80,
				height : 35,
				onClick:provideCard1
			},{
				eName:"linkbutton",
				uId:"tm2",
				cssClass:"cardManage_searchWin_linkbutton",
				text : '发附卡',
				width : 80,
				height : 35,
				onClick:provideCard2
			},{
				eName:"linkbutton",
				uId:"tm1",
				text : '取消',
				width : 80,
				height : 35,
				onClick:function(){
					jqObj.window("close");
				}
			}]
		}]
	}
	
	jqObj.loadUI(cardManageWinUI);
	var dataTable = jqObj.findJq("dataTable");
	
	//关闭
	jqObj.updateOpt("panel",{
		onBeforeClose:function(){
			loadParams.callback();
			return true;//true 关闭 false不关闭
		}
	});
	
	loadInit();
	function loadInit(){
		var param = {};
		param['account_id'] = loadParams.params;
		dataTable.datagrid("load",param);
	}
	
	//发主卡
	function provideCard1(){
		var params = {};
		params['account_id'] = loadParams.params;
		params['is_main_card'] = "1";
		var myWin = $.createWin({
			title:"发主卡",
			width:300,
			height:200,
			queryParams:{
				params:params,
				callback:loadInit
			},
			url:"js/account/cardManage_provideWin.js"
		});
	}
	
	//发附卡
	function provideCard2(){
		var params = {};
		params['account_id'] = loadParams.params;
		params['is_main_card'] = "0";
		var myWin = $.createWin({
			title:"发附卡",
			width:300,
			height:200,
			queryParams:{
				params:params,
				callback:loadInit
			},
			url:"js/account/cardManage_provideWin.js"
		});
	}
});