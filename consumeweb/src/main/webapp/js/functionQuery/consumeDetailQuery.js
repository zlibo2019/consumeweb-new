//消费明细查询
garen_define("js/functionQuery/consumeDetailQuery",function (jqObj,loadParams) {
	var utils = garen_require("utils");
	var base = garen_require("js/base/ws_public");
	
	var depQuery = base.depQuery;//部门查询
	
	//var merchQuery = "report/merchant/merchQueryAll2.do" //商户查询
	var merchQuery = "report/authority/qryMerch.do"; //商户查询
		
	var bhQuery = "report/sys/bhQueryByMerchant.do";//设备查询
	
	var detailQuery = "functionQuery/consume/detailQuery.do";//明细查询
		
	var dateObj = $.loadEx("getSysDate.do");//报表有效日期
	
	var northUI = {
			
	}
	
	var westUI = {
		eName : 'div',
		cssClass:"autoModeDefine_west_div",
		height:'100%',
		elements : [{
			eName:"div",
			cssClass:"first_div",
			elements:[{
				eName:"img",
				src:"image/icon01.gif"
			},{
				eName:"span",
				text:"部门"
			}]
		},{
			eName:"div",
			//height:788,
			cssStyle:'overflow:auto',
			id:"tree_height",
			elements:{
				eName : 'tree',
				id:"dep_serial",
				pid:"dep_parent",
				nodeText:"dep_name",
				url:depQuery,
				fit : 'true',
				autoload:false,
				multiple:true
//				onLoadEx1:function(){
//					$.print("aaac");
//					var jqTree = $(this);
//					var h = jqTree.height();
//					window.setTimeout(function(){
//						jqTree.height(h + 1);
//					},0);
//				}
			}
		}]
	};
	
	var toolBar = [null,{
		eName:"div",
		cssClass:"systemOperationLog_topDiv",
		elements : [{
			eName : 'div',
			cssClass:"div_first",
			elements:[{
				eName:"span",
				text:"商户"
			},{
				eName:"combogrid",
				id:"merchList",
				url:merchQuery,
				name:"merchant_account_id",
				idField: 'merchant_account_id',
				textField: 'merchant_name',
				width:120,
		        panelHeight:$.browser.msie9?200:'auto',
				panelMaxHeight:200,
				editable:false,
				multiple:true,
				singleSelect: false,
				selectOnCheck:true,
				allFlag:true,
				columns:[[
					{field:'merchant_account_id',checkbox:true},
					{field:'merchant_name',title:'全部'}
				]],
				onChangeEx:function(newValue, oldValue){
					bhList.combo("clear");
					if(newValue.length>0){
						var param = {};
						param['merchant_account_id'] = newValue.join();
						loadBhList(param);
					}
					else{
						var bhGrid = bhList.combogrid("grid");
						bhGrid.datagrid("loadData",[]);
					}
				}
				
			},{
				eName:"span",
				text:"设备"
			},{
				eName:"combogrid",
				id:"bhList",
				name:"bh",
				idField: 'bh',
				textField: 'mc',
				panelHeight:$.browser.msie9?200:'auto',
				panelMaxHeight:200,
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
			},{
				eName:"span",
				text: "开始日期"
			},{
				eName:"datebox",
				editable:false,
				width : 120,
				height : 25,
				name:"start_date"
			},{
				eName:"span",
				text: "结束日期"
			},{
				eName:"datebox",
				editable:false,
				width : 120,
				height : 25,
				name:"end_date"
			}]
		},{
			eName:'div',
			cssClass:'div_second',
			elements:[{
				eName:'linkbutton',
				uId:"tm1",
				text:'查询',
				plain:true,
				iconCls:'icon-search',
				onClick : search
			},{
				eName:'linkbutton',
				uId:"tm4",
				text:'导出',
				plain:true,
				iconCls:'icon-import',
				onClick : function(){
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
										utils.exportExcel("xls","消费明细查询",dataTable);
									}else{
										utils.exportExcel("xlsx","消费明细查询",dataTable);
									}
								}
							},
							url:"js/functionQuery/consumeDetailQuery_export.js"
						});
					}
				}
			}]
		}]
	}];
	
	var columns = [//列字段定义
     	[ {
    		field : 'ch',
    		title : 'ch',
    		align : "center",  
    		checkbox:true,
    		width : 50
    	}, {
      		field : 'index',
      		title : '..',
      		align : "center",
      		width : 50
      	},  {
      		field : 'user_no',
      		title : '学/工号',
      		align : "center",
      		width : 80
      	}, {
      		field : 'user_lname',
      		title : '姓名',
      		align : "center",
      		width : 80
      	}, {
      		field : 'user_depname',
      		title : '部门',
      		align : "center",
      		width : 80
      	}, {
      		field : 'user_identity',
      		title : '身份',
      		align : "center",
      		width : 80
      	}, {
      		field : 'trad_sj_str',
      		title : '交易时间',
      		align : "center",
      		width : 140
      	}, {
      		field : 'trad_type_name',
      		title : '交易类型',
      		align : "center",
      		width : 80
      	}, {
      		field : 'trad_amt_str',
      		title : '交易金额',
      		align : "center",
      		width : 80
      	}, {
      		field : 'meal_id',
      		title : '餐别',
      		align : "center",
      		width : 80
      	}, {
      		field : 'merchant_name',
      		title : '商户',
      		align : "center",
      		width : 80
      	}, {
      		field : 'mc',
      		title : '设备',
      		align : "center",
      		width : 80
      	}, {
      		field : 'bill_date_str',
      		title : '账务日期',
      		align : "center",
      		width : 100
      	}, {
      		field : 'bz',
      		title : '备注',
      		align : "center",
      		width : 140
      	}
    ] ];
	
	var centerUI = {
		eName : 'datagrid',
		id:"dataTable",
		idField : 'id',
		//url : modeListQuery,
		toolbarEx : toolBar,// 查询条件工具栏
		columns : columns,
		docType:'xls',
		diret:2,
		pagination: true,
		clientPager:true,
		alertFlag : false,// 是否弹出默认对话框
		autoload : false,
		singleSelect:true,
		checkOnSelect:true,
		selectOnCheck:true,
		onBeforeLoadEx:function(params){
			if(params.start_date>params.end_date){
				$.alert("开始日期不能大于结束日期！");
				return false;
			}
			var rows = depTree.tree("getChecked");
			var p = [];
			$.each(rows,function(i){
				var param = rows[i].dep_serial;
				p.push(param);
			});
			params['dep_serial'] = p.join();
		},
		onLoadSuccessEx:function(retJson){
			if(retJson.id=="0"){
				/*merchList.combogrid("clear");
				bhList.combogrid("clear");*/
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
			height : 10,
			elements : northUI
		},{
			region : 'west',
			width : 250,
			elements : westUI
		},{
			region : 'center',
			elements : centerUI
		}]
	}
	
	jqObj.loadUI(mainUI);
	
	var dataTable = jqObj.findJq("dataTable");
	var depTree = jqObj.findJq("dep_serial");
	var bhList = jqObj.findJq("bhList");
	var merchList = jqObj.findJq("merchList");
	var start_date = jqObj.findJq("start_date");
	var end_date = jqObj.findJq("end_date");
	var tree_height = jqObj.findJq("tree_height");
	
	//tree_height.children().eq(0).children().eq(0).css("overflow","scroll");
	tree_height.css("height",tree_height.parent().height()-tree_height.prev().height());
	tree_height.children().eq(0).css("height",tree_height.parent().height()-tree_height.prev().height());
	
	//depTree.tree("reload");
	loadTime();
	
	function search(){
		dataTable.datagrid("loadEx",{url:detailQuery});
	}
	
	function loadTime(){//加载日期
		/*var date = new Date();
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		var d = date.getDate();
		var day = new Date(y,m,0);  
		//start_date.datebox("setValue",y + '-' + m + '-' + '1');
		//end_date.datebox("setValue",y + '-' + m + '-' + day.getDate() + " 23:59:59");
		start_date.datebox("setValue",y + '-' + m + '-' + d);
		end_date.datebox("setValue",y + '-' + m + '-' + d);*/
		start_date.datebox("setValue",dateObj[0].end_date);
		end_date.datebox("setValue",dateObj[0].end_date);
	}
	
	function loadBhList(param){
		$.postEx(bhQuery,param,function(retJson){
			if(retJson.result && retJson.data){
				var bhGrid = bhList.combogrid("grid");
				bhGrid.datagrid("loadData",retJson.data);
			}
		});
	}
});