//新增商户or商户部门
garen_define("js/permission/glyToMerchant_addPermission",function (jqObj,loadParams) {
	
	var permissionAdd = "permission/glyToMerchant/permissionAdd.do";//新增
	
	var departmentQuery = "merchant/departmentQuery.do";//商户部门查询
	
	var base = garen_require("js/base/ws_public");
	
	var merchantQuery = base.merchantQuery;//商户查询
	
	var columns = [//列字段定义
	    [{
	     	field : 'merchant_name',
	     	title : '商户名称',
	     	align : "center",
	     	width : 299
	    }
	] ];
	
	var addPermissionUI = {
		eName:"div",
		height:300,
		cssClass:"",
		elements:[{
			eName:"div",
			id:"merchantTree",
			cssStyle:"display:none;",
			height:300,
			width:285,
			elements:{
				eName : 'treeEx',
				id:"dep_serial",
				pid:"dep_parent",
				nodeText:"dep_name",
				url:departmentQuery,
				fit : 'true',
				checkbox:false,
				//onClickEx : 
			}
		},{
			eName:"div",
			id:"merchantList",
			cssStyle:"display:none;",
			height:300,
			elements:{
				eName:"datagrid",
				id:"merchantTable",
				idField : 'merchant_id',
				url : merchantQuery,
				columns : columns,
				pagination: false,
				clientPager:false,
				alertFlag : false,// 是否弹出默认对话框
				autoload : true,
				singleSelect:true,
				checkOnSelect:false,
				selectOnCheck:false,
				showHeader:false,
				border:false,
				onClickRow:function(){
					
				}
			}
		},{
			eName:"div",
			cssStyle:'text-align:center;margin-top:10px;',
			elements:[{
				eName:"linkbutton",
				uId:"tm2",
				text : '保存',
				cssClass : 'autoModeDefine_addMode_linkbutton',
				width : 80,
				height : 35,
				onClick:function(){
					var params = {};
					if(loadParams.params.lx==1){//商户
						params['merchant_lx'] = "2";
						var row = merchantTable.datagrid("getSelected");
						if(row!=null){
							params['merchant_dep_serial'] = row.merchant_account_id;
						}else{
							$.alert("请选择一个商户！");
							return false;
						}
					}else if(loadParams.params.lx==2){//商户部门
						params['merchant_lx'] = "1";
						var node = depTree.tree("getSelected");
						if(node!=null){
							params['merchant_dep_serial'] = node.dep_serial;
						}else{
							$.alert("请选择一个商户部门！");
							return false;
						}
					}
					params['lx'] = "0";//新增
					params['gly_no'] = loadParams.params.gly_no;
					$.postEx(permissionAdd,params,function(retJson){
						if(retJson.result){
							loadParams.callback(params);
							jqObj.window("close");
						}else{
							$.alert(retJson.info);
						}
					});
				}
			},{
				eName:"linkbutton",
				uId:"tm1",
				text : '取消',
				cssStyle : 'margin-left:10px;',
				width : 80,
				height : 35,
				onClick:function(){
					jqObj.window("close");
				}
			}]
		}]
	}
	
	jqObj.loadUI(addPermissionUI);
	
	var merchantTree = jqObj.findJq("merchantTree");
	var merchantList = jqObj.findJq("merchantList");
	var merchantTable = jqObj.findJq("merchantTable");
	var depTree = jqObj.findJq("dep_serial");
	
	
	loadInit();
	
	function loadInit(){
		if(loadParams.params.lx==1){
			merchantList.show();
			merchantTable.datagrid("resize");
			merchantTree.hide();
		}else if(loadParams.params.lx==2){
			merchantList.hide();
			merchantTree.show();
		}
	}
});