//自动消费模式
garen_define("js/equipment/autoModeDefine",function (jqObj,loadParams) {
	var utils = garen_require("utils");
	var base = garen_require("js/base/ws_public");
	
	var scmurl = garen_require("js/lib/scmurl");//url地址
	
	var checkCoreIp = base.checkCoreIp;//核心业务IP授权验证
	
	var placeQuery = base.placeQuery;//场所查询
	
	var modeListQuery = "equipment/autoMode/modeListQuery.do";//自动模式列表查询
	
	var modeListDelete = "equipment/autoMode/modeListDelete.do";//自动模式列表删除
	
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
				text:"场所"
			}]
		},{
			eName:"div",
			id:"tree_height",
			//height:"100%",
			elements:{
				eName : 'treeEx',
				id:"dep_serial",
				pid:"dep_parent",
				nodeText:"dep_name",
				url:placeQuery,
				fit : 'true',
				multiple:true,
				onClickEx : loadModeList
			}
		}]
	};
	
	var toolBar = [null,{
		eName : 'div',
		cssClass:"autoModeDefine_toolBar",
		//height : 60,
		elements : {
			eName:"div",
			cssClass:"first_div",
			elements:[{
				eName:'linkbutton',
				uId:"tm1",
				text:'新增',
				plain:true,
				iconCls:'icon-add',
				onClick : addMode
			},{
				eName:'linkbutton',
				uId:"tm1",
				text:'修改',
				plain:true,
				iconCls:'icon-edit',
				onClick : modifyMode
			},{
				eName:'linkbutton',
				uId:"tm2",
				text:'删除',
				plain:true,
				iconCls:'icon-cancel',
				onClick : deleteMode
			},{
				eName:'linkbutton',
				uId:"tm1",
				text:'打印',
				plain:true,
				iconCls:'icon-print',
				onClick : function(){
					if(modeTable.datagrid('getRows').length==0){
						$.alert("数据为空");
					}else{
						utils.printGrid("自动模式定义",modeTable);
					}
				}
			},{
				eName:'linkbutton',
				uId:"tm1",
				text:'导出',
				plain:true,
				iconCls:'icon-import',
				onClick : function(){
					//导出文档
					if(modeTable.datagrid('getRows').length==0){
						$.alert("数据为空");
					}else{
						utils.exportDocByData("自动模式定义",modeTable);
					}
					
				}
			}]
		}
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
      		field : 'dep_name',
      		title : '场所',
      		align : "center",
      		width : 80
      	}, {
      		field : 'dep_parent',
      		title : '所属场所',
      		align : "center",
      		width : 80
      	}, {
      		field : 'begin_date',
      		title : '开始时间',
      		align : "center",
      		width : 80
      	}, {
      		field : 'end_date',
      		title : '结束时间',
      		align : "center",
      		width : 80
      	}, {
      		field : 'xf_model_id',
      		title : '消费模式',
      		align : "center",
      		width : 100
      	}, {
      		field : 'fixed_amt_str',
      		title : '定额金额',
      		align : "center",
      		width : 80
      	}
    ] ];
	
	var centerUI = {
		eName : 'datagrid',
		id:"modeTable",
		idField : 'id',
		//url : modeListQuery,
		toolbarEx : toolBar,// 查询条件工具栏
		columns : columns,
		pagination: true,
		clientPager:true,
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
			height : 10,
			elements : northUI
		},{
			region : 'west',
			height : 100,
			width : 300,
			elements : westUI
		},{
			region : 'center',
			elements : centerUI
		}]
	}
	
	jqObj.loadUI(mainUI);
	
	var modeTable = jqObj.findJq("modeTable");
	var depTree = jqObj.findJq("dep_serial");
	var tree_height = jqObj.findJq("tree_height");
	
	
	loadInit();
	
	function loadInit(){
		
		$.postEx(checkCoreIp,{'op_name':'设备自动消费模式'},function(retJson){
			if(retJson.result){
				
			}else{
				$.alert(retJson.info,function(){
					//window.parent.location.reload();
					window.top.location.href=scmurl;
				});
			}
		});
		
		tree_height.css("height",tree_height.parent().height()-tree_height.prev().height());
		tree_height.children().eq(0).css("height",tree_height.parent().height()-tree_height.prev().height());
	}
	
	function loadModeList(){
		modeTable.datagrid("loadEx",{url:modeListQuery,dep_serial:getDepTreeChecked()});
	}
	
	function getDepTreeChecked(){
		var row = depTree.tree("getChecked");
		var params = [];
		$.each(row,function(i, d){
			params.push(d.dep_serial);
		});
		return params.join();
	}
	
	function addMode(){
		var params={};
		var paramt = getDepTreeChecked();
		//var row = depTree.tree("getChecked");
		if(paramt.length==0){
			$.alert("请先选择一个场所！");
		}else{
			params['dep_serial'] = paramt;
			var myWin = $.createWin({
				title:"新增",
				width:380,
				height:300,
				queryParams:{
					params:params,
					callback:loadModeList
				},
				url:"js/equipment/autoModeDefine_addMode.js"
			});
		}
	}
	
	function modifyMode(){
		var params = {};
		var row = modeTable.datagrid("getSelected");
		if(row==null){
			$.alert("请先选择一条记录！");
		}else{
			params['id'] = row.id;
			params['begin_date'] = row.begin_date;
			params['end_date'] = row.end_date;
			params['type'] = row.type;
			params['fixed_amt_str'] = row.fixed_amt_str;
			var myWin = $.createWin({
				title:"修改",
				width:380,
				height:300,
				queryParams:{
					params:params,
					callback:loadModeList
				},
				url:"js/equipment/autoModeDefine_modifyMode.js"
			});
		}
	}
	
	function deleteMode(){
		var params = {};
		var row = modeTable.datagrid("getSelected");
		if(row==null){
			$.alert("请先选择一条记录！");
		}else{
			params['id'] = row.id;
			$.confirm("确定要删除这条记录吗？",function(c){
				if(c){
					$.postEx(modeListDelete,params,function(retJson){
						if(retJson.result){
							loadModeList();
						}else{
							$.alert(retJson.info);
						}
					});
				}
			});
		}
	}
	
});