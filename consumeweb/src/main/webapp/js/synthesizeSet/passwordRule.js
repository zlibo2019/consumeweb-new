//密码规则设置
garen_define("js/synthesizeSet/passwordRule",function (jqObj,loadParams) {
	
	var base = garen_require("js/base/ws_public");
	
	var checkCoreIp = base.checkCoreIp;//核心业务IP授权验证
	
	var query = "synthesizeSet/passwordRule/query.do";//查询
	
	var del = "synthesizeSet/passwordRule/delete.do";//删除
	
	var scmurl = garen_require("js/lib/scmurl");//url地址
	
	var toolBar = [null,{
		eName : 'div',
		height:10,
		cssStyle : 'background:#ffffff;'
	},{
		eName : 'div',
		cssClass:"passwordRule_toolBar",
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
				onClick : addPwd
			},{
				eName:'linkbutton',
				uId:"tm1",
				text:'修改',
				plain:true,
				iconCls:'icon-edit',
				onClick : modifyPwd
			},{
				eName:'linkbutton',
				uId:"tm2",
				text:'删除',
				plain:true,
				iconCls:'icon-cancel',
				onClick : delPwd
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
      		field : 'scheme_name',
      		title : '名称',
      		align : "center",
      		width : 140
      	}, {
      		field : 'pwd_personal',
      		title : '初始密码',
      		align : "center",
      		width : 100
      	}, {
      		field : 'operator',
      		title : '操作员',
      		align : "center",
      		width : 100
      	}, {
      		field : 'client',
      		title : '客户端ID',
      		align : "center",
      		width : 120
      	}, {
      		field : 'sj_str',
      		title : '操作时间',
      		align : "center",
      		width : 140
      	}] ];
	
	var centerUI = {
		eName : 'datagrid',
		id:"dataTable",
		idField : 'scheme_id',
		//url : query,
		toolbarEx : toolBar,// 查询条件工具栏
		columns : columns,
		pagination: true,
		clientPager:true,//本地分页
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
	}
	
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
	
	loadInit();
	
	function loadInit(){
		$.postEx(checkCoreIp,{'op_name':'初始密码规则'},function(retJson){
			if(retJson.result){
				
			}else{
				$.alert(retJson.info,function(){
					//window.parent.location.reload();
					window.top.location.href=scmurl;
				});
			}
		});
	}
	
	loadPwdList();
	function loadPwdList(){
		dataTable.datagrid("loadEx",{url:query});
	}
	
	function addPwd(){
		var myWin = $.createWin({
			title:"新增",
			width:300,
			height:200,
			queryParams:{
				//params:params,
				callback:loadPwdList
			},
			url:"js/synthesizeSet/passwordRule_addPwd.js"
		});
	}
	
	function modifyPwd(){
		var params = {};
		var row = dataTable.datagrid("getSelected");
		if(row==null){
			$.alert("请先选择一条记录！");
		}else{
			if(row.default_scheme==0){
				$.alert("系统初始数据，不允许修改！");
			}else{
				params['scheme_id'] = row.scheme_id;
				params['scheme_name'] = row.scheme_name;
				params['pwd_personal'] = row.pwd_personal;
				var myWin = $.createWin({
					title:"修改",
					width:300,
					height:200,
					queryParams:{
						params:params,
						callback:loadPwdList
					},
					url:"js/synthesizeSet/passwordRule_modifyPwd.js"
				});
			}
		}
	}
	
	function delPwd(){
		var params = {};
		var row = dataTable.datagrid("getSelected");
		if(row==null){
			$.alert("请先选择一条记录！");
		}else{
			if(row.default_scheme==0){
				$.alert("系统初始数据，不允许删除！");
			}else{
				$.confirm("确定要删除这条记录吗？",function(c){
					if(c){
						params['scheme_id'] = row.scheme_id;
						$.postEx(del,params,function(retJson){
							if(retJson.result){
								loadPwdList();
							}else{
								$.alert(retJson.info);
							}
						});
					}
				});
			}
		}
	}
});