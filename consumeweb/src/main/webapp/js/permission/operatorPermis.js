//操作员授权
garen_define("js/permission/operatorPermis",function (jqObj,loadParams) {
	
	var base = garen_require("js/base/ws_public");
	
	var checkCoreIp = base.checkCoreIp;//核心业务IP授权验证
	
	var scmurl = garen_require("js/lib/scmurl");//url地址
	
	//webService
	var opPermisQry = "permission/permissions/opPermisQuery.do";// 操作员授权查询
	
	var north_columns = [//列字段定义
      	[ {
       		field : 'index',
       		title : '..',
       		hidden:true,
       		align : "center",
       		hidden:true,
       		width : 50
       	}, {
       		field : 'gly_no',
       		title : '管理员',
       		align : "center",
       		width : 150
       	},{ 
       		field : 'group_lname',
       		title : '角色',
       		align : "center",
       		width : 150
       	}, {
       		field : 'operator_pms',
       		title : '操作员报表查询授权',
       		align : "center",
       		width : 150
       	}, {
       		field : 'merchant_pms',
       		title : '商户报表查询授权',
       		align : "center",
       		width : 150
       	}, {
       		field : 'ip_pms',
       		title : '核心业务IP地址授权',
       		align : "center",
       		width : 150
       	}, {
       		field : 'operator_flag',
       		title : '操作员授权标志',
       		hidden:true,
       		align : "center",
       		width : 150
       	}, {
       		field : 'merchant_flag',
       		title : '商户授权标志',
       		hidden:true,
       		align : "center",
       		width : 150
       	},{
       		field : 'operation',
       		title : '操作',
       		align : "center",
       		width : 150,
       		formatter:function(value,row,index){  
		        var btn = "<span class='column_setting_btn' uId='save' rowindex='"+index+"'>设置</span>"
		        return btn;
		    }  
       	}]
      ];
	
	var southUI = {
		eName : 'datagrid',
		id:"northTable",
		idField : '',
		//url : '',
		columns : north_columns,
		pagination: true,//分页这里需要去掉然后改成金额统计
		clientPager:false,
		showFooter:true,
		alertFlag : false,// 是否弹出默认对话框
		autoload : false,
		singleSelect:true,
		checkOnSelect:false,
		selectOnCheck:false,
		onLoadSuccessEx:function(data){
			var mygrid = $(this);
			var mypanel = $(this).datagrid('getPanel');
			mypanel.find(".column_setting_btn").click(function(){
				var mytr = $(this).parents('tr.datagrid-row');
				mygrid.datagrid("selectRow",mytr.prop('rowIndex'));
				var row = mygrid.datagrid("getSelected");
				var params = {};
				params['gly_no'] = row.gly_no;
				var myWin = $.createWin({
					title:"设置",
					width:500,
					height:400,
					queryParams:{
						params:params,
						callback:loadInit
					},
					url:"js/permission/opPermis_setWin.js"
				});
				/*$.postEx(ruleListDelete,params,function(retJson){
					if(retJson.result){
						loadRuleList();
						loadTime();
					}else{
						$.alert(retJson.info);
					}
				});*/		
			});
		}
	};
	
	var mainUI = {
			eName : 'div',// 容器布局类，jeasyui组件
			cssStyle:'font-family: 微软雅黑, Arial;overflow:auto;height:100%;',
			fit : true,
			elements : [
			{
				eName : 'div',
				cssStyle:"min-height:300px;height:100%;",
				border : false,
				noheader : true,
				elements : southUI
			}]
	};
	
	//创建dom
	jqObj.loadUI(mainUI);
	var northTable = jqObj.findJq("northTable");
	loadInit();
	// 页面初始化加载操作员授权数据
	function loadInit(){
		
		$.postEx(checkCoreIp,{'op_name':'操作员授权'},function(retJson){
			if(retJson.result){
				
			}else{
				$.alert(retJson.info,function(){
					//window.parent.location.reload();
					window.top.location.href=scmurl;
				});
			}
		});
		
		$.postEx(opPermisQry,function(retJson){
			if(retJson.result && retJson.data){
				northTable.datagrid("loadDataEx",retJson.data);
			}
		});
	}
	});
	