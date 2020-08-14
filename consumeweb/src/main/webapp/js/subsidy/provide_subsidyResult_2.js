//发放失败结果
garen_define("js/subsidy/provide_subsidyResult_2",function (jqObj,loadParams) {
	
	var utils = garen_require("utils");
	
	var columns = [//列字段定义
 	[ {
  		field : 'index',
  		title : '..',
  		align : "center",    
  		width : 50
  	}, {
  		field : 'user_no',
  		title : '学/工号',
  		align : "center",
  		width : 80
  	}, {
  		field : 'dep_name',
  		title : '部门',
  		align : "center",
  		width : 100
  	}, {
  		field : 'user_lname',
  		title : '姓名',
  		align : "center",
  		width : 80
  	}, {
  		field : 'sub_amt_str',
  		title : '金额',
  		align : "center",
  		width : 80
  	}, {
  		field : 'error_msg',
  		title : '失败原因',
  		align : "center",
  		width : 195
  	}] ];
	
	var toolBar = [null,{
		eName:"div",
		id:"title_div",
		cssStyle:"font-size:14px;font-weight:bold;",
		elements:"补贴发放失败结果表"
	}]
	
	var centerUI = {
		eName:'div',
		cssStyle:"margin-left:18px;",
		width:600,
		height:250,
		elements:{
			eName : 'datagrid',
			id:"dataTable",
			idField : 'account_id',
			//url : '',
			toolbarEx : toolBar,// 查询条件工具栏
			columns : columns,
			pagination: true,
			clientPager:true,
			alertFlag : false,// 是否弹出默认对话框
			autoload : false,
			singleSelect:true,
			checkOnSelect:true,
			selectOnCheck:true
		}
	};
	
	var northUI = {
		eName:"div",
		height:80,
		cssStyle:"background:#f4f4f4;",
		elements:{
			eName:"div",
			height:80,
			cssStyle:"margin-left:60px;line-height:80px;",
			elements:{
				eName:"div",
				cssClass:"provide_subsidyResultdiv",
				elements:[{
					eName:'span',
					cssClass:'provide_subsidyResult_text',
					text:'成功发放补助'
				},{
					eName:'span',
					cssClass:'provide_subsidyResult_number',
					elements:loadParams.retData[0].count
				},{
					eName:'span',
					cssClass:'provide_subsidyResult_text',
					text:'笔,发放总额'
				},{
					eName:'span',
					cssClass:'provide_subsidyResult_number',
					elements:loadParams.retData[0].subamts_str
				},{
					eName:'span',
					cssClass:'provide_subsidyResult_text',
					text:'元。'
				}]
			}
		}
	};
	
	var southUI = {
		eName:'div',
		cssClass:'closeAccount_resultWin_southdiv',
		elements:[{
			eName : 'linkbutton',
			uId:"tm1",
			cssClass:"cardManage_searchWin_linkbutton",
			width:80,
			height:35,
			text:"打印",
			onClick : function(){
				if(loadParams.data.length==0){
					$.alert("数据为空");
				}else{
					utils.printGrid("补贴发放失败结果表",dataTable,loadParams.data);
				}
			}
		},{
			eName : 'linkbutton',
			uId:"tm1",
			cssClass:"cardManage_searchWin_linkbutton",
			width:80,
			height:35,
			text:"导出",
			onClick : function(){
				if(loadParams.data.length==0){
					$.alert("数据为空");
				}else{
					utils.exportDocByData2("补贴发放失败结果表",dataTable,loadParams.data);
				}
			}
		}]
	}
	
	var mainUI = {
		eName : 'layoutExt',// 容器布局类，jeasyui组件
		cssStyle:'font-family: 微软雅黑, Arial;',
		fit : true,
		elements : [{
			region : 'north',
			height:100,
			elements : northUI
		},
		{
			region : 'center',
			elements : centerUI
		},{
			region : 'south',
			height:50,
			elements : southUI
		}]
	}
	
	jqObj.loadUI(mainUI);
	var dataTable = jqObj.findJq("dataTable");
	
	loadInit();
	function loadInit(){
		dataTable.datagrid("loadDataEx",loadParams.data);
	}
	
	//关闭
	jqObj.updateOpt("panel",{
		onBeforeClose:function(){
			loadParams.callback();
			return true;//true 关闭 false不关闭
		}
	});
	
	
});