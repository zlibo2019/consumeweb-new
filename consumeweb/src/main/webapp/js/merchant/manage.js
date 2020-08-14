//商户管理
garen_define("js/merchant/manage",function (jqObj,loadParams) {
	
	var base = garen_require("js/base/ws_public");
	
	var checkCoreIp = base.checkCoreIp;//核心业务IP授权验证
	
	var registerSave = "merchant/registerSave.do";//保存
	
	var allMerchantQuery = "merchant/manage/allMerchantQuery.do"//全部商户查询
		
	var normalMerchantQuery = "merchant/manage/normalMerchantQuery.do"//正常商户查询
	
	var deleteMerchantQuery = "merchant/manage/deleteMerchantQuery.do"//销户商户查询
		
	var scmurl = garen_require("js/lib/scmurl");//url地址	
		
	//工具栏
	var toolBar = [null,{
		eName : 'div',
		height:10,
		cssStyle : 'background:#ffffff;'
	}, {
		eName : 'div',
		cssClass:"manage_toolBar_third",
		elements : [{
			eName : 'div',
			elements:[{
				eName:'linkbutton',
				uId:"tm1",
				text:'开户',
				plain:true,
				iconCls:'icon-add',
				onClick : addMerchant
			},{
				eName:'linkbutton',
				uId:"tm1",
				text:'修改',
				plain:true,
				iconCls:'icon-edit',
				onClick : modifyMerchant
			},{
				eName:'linkbutton',
				uId:"tm2",
				text:'销户',
				plain:true,
				iconCls:'icon-cancel',
				onClick : deleteMerchant
			}]
		},{
			eName:"div",
			cssClass:"manage_toolBar_second",
			elements:[{
				eName : 'div',
				elements:[{
					eName : 'input',
					cssClass:"manage_checkbox",
					id:"allMerchant",
					name:"merchantType",
					type : 'radio',
					onClick:qryAll
				},{
					eName : 'span',
					text : '全部'
				}]
			},{
				eName : 'div',
				elements:[{
					eName : 'input',
					cssClass:"manage_checkbox",
					id:"normalMerchant",
					name:"merchantType",
					type : 'radio',
					onClick:qryNormal
				},{
					eName : 'span',
					text : '正常'
				}]
			},{
				eName : 'div',
				elements:[{
					eName : 'input',
					cssClass:"manage_checkbox",
					id:"deleteMerchant",
					name:"merchantType",
					type : 'radio',
					onClick:qryDelete
				},{
					eName : 'span',
					text : '销户'
				}]
			}]
		}]
	
	}];
	
	var columns = [//列字段定义
      	[ {
       		field : 'xh',
       		title : '序号',
       		align : "center",
       		checkbox : true,
       		width : 100
       	}, {
       		field : 'index',
       		title : '..',
       		align : "center",    
       		width : 50
       	}, {
       		field : 'merchant_account_id',
       		title : '商户账号',
       		align : "center",
       		width : 80
       	}, {
       		field : 'merchant_name',
       		title : '商户名称',
       		align : "center",
       		width : 100
       	}, {
       		field : 'link_man',
       		title : '联系人',
       		align : "center",
       		width : 80
       	}, {
       		field : 'merchant_addr',
       		title : '地址',
       		align : "center",
       		width : 100
       	}, {
       		field : 'merchant_telephone',
       		title : '联系电话',
       		align : "center",
       		width : 90
       	}, {
       		field : 'gly_no',
       		title : '操作员',
       		align : "center",
       		width : 80
       	}, {
       		field : 'sj',
       		title : '日期时间',
       		align : "center",
       		width : 140
       	}, {
       		field : 'merchant_state_mc',
       		title : '状态',
       		align : "center",
       		width : 80
       	}, {
       		field : 'open_date',
       		title : '开户日期',
       		align : "center",
       		width : 140
       	}] ];
	
	var centerUI = {
		eName : 'datagrid',
		idField : 'merchant_account_id',
		id : 'dataTable',
		toolbarEx : toolBar,// 查询条件工具栏
		columns : columns,
		pagination: true,
		clientPager:true,
		alertFlag : false,// 是否弹出默认对话框
		autoload : false,
		singleSelect:false,
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
			region : 'center',
			elements : centerUI
		}]
	}
	

	jqObj.loadUI(mainUI);
	var dataTable = jqObj.findJq("dataTable");
	var allMerchant = jqObj.findJq("allMerchant");
	var normalMerchant = jqObj.findJq("normalMerchant");
	var deleteMerchant = jqObj.findJq("deleteMerchant");
	
	loadInit();
	
	function loadInit(){
		
		$.postEx(checkCoreIp,{'op_name':'商户管理'},function(retJson){
			if(retJson.result){
				
			}else{
				$.alert(retJson.info,function(){
					//window.parent.location.reload();
					window.top.location.href=scmurl;
				});
			}
		});
		
		qryNormal();
		normalMerchant.attr("checked","checked");
	}
	
	function qryAll(){
		dataTable.datagrid("loadEx",{url:allMerchantQuery});
	}
	
	function qryNormal(){
		dataTable.datagrid("loadEx",{url:normalMerchantQuery});
	}
	
	function qryDelete(){
		dataTable.datagrid("loadEx",{url:deleteMerchantQuery});
	}
	
	function refresh(){
		dataTable.datagrid("reloadEx");
	}
	
	function addMerchant(){
		var myWin = $.createWin({
			title:"商户开户",
			width:300,
			height:315,
			queryParams:{
				callback:refresh
			},
			url:"js/merchant/manage_addMerchant.js"
		});
	}
	
	function modifyMerchant(){
		var rows = dataTable.datagrid("getSelectionsEx");
		if(rows.length < 1){
			$.alert("请选择一条记录！");
		}else if(rows.length > 1){
			$.alert("修改时只能选择一条记录！");
		}else if(rows[0].merchant_state==1){
			$.alert("已销户商户不能修改！");
		}
		else{
			var myWin = $.createWin({
				title:"商户修改",
				width:300,
				height:350,
				queryParams:{
					params:rows[0],
					callback:refresh
				},
				url:"js/merchant/manage_modifyMerchant.js"
			});
		}
	}
	
	function deleteMerchant(){
		var rows = dataTable.datagrid("getSelectionsEx");
		if(rows.length == 0){
    		$.alert("请选择一条记录！");
		}
		else{
			$.confirm("是否确定销户？",function(c){
				if(c){
        			var myWin = $.createWin({
						title:"商户销户",
						width:400,
						height:400,
						queryParams:{
							params:rows,
							callback:refresh
						},
						url:"js/merchant/delete_configWin.js"
					});
        		}
			});
		}
	}
	
});
	