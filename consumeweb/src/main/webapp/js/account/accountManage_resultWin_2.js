//账户管理失败结果提示窗
garen_define("js/account/accountManage_resultWin_2",function (jqObj,loadParams) {
	
	var utils = garen_require("utils");
	
	var columns = [//列字段定义
	 	[{
       		field : 'index',
       		title : '',
       		align : "center",    
       		width : 50
       	}, {
	  		field : 'user_no',
	  		title : '学/工号',
	  		align : "center",
	  		width : 90
	  	}, {
	  		field : 'user_lname',
	  		title : '姓名',
	  		align : "center",
	  		width : 90
	  	}, {
	  		field : 'dep_name',
	  		title : '部门',
	  		align : "center",
	  		width : 100
	  	}, {
	  		field : 'error_msg',
	  		title : '失败原因',
	  		align : "center",
	  		width : 200
	  	}] 
	];
	
	var toolbar = [null,{
		eName:"div",
		id:"title_div",
		cssStyle:"font-size:14px;font-weight:bold;",
		elements:""
	}]
	
	
	var centerUI = {
		eName:"div",
		cssStyle:"margin-left:18px;",
		width:550,
		height:250,
		elements:{
			eName:"datagrid",
			id:"dataTable",
			idField : 'account_id',
			columns : columns,
			toolbarEx:toolbar,
			pagination: true,
			clientPager:true,
			showFooter:false,
			alertFlag : false,// 是否弹出默认对话框
			autoload : false,
			singleSelect:true
		}
	};
		
	var northUI = {
		eName:"div",
		height:80,
		cssStyle:"background:#f4f4f4;",
		elements:loadDiv()
	};
	
	var southUI = {
		eName:"div",
		cssClass:"closeAccount_resultWin_southdiv",
		elements:[{
			eName:"linkbutton",
			uId:"tm1",
			cssClass:"cardManage_searchWin_linkbutton",
			text : '打印',
			width : 80,
			height : 35,
			onClick:function(){
				//var rows = dataTable.datagrid('getRows');
				if(loadParams.params.data.length==0){
					$.alert("数据为空");
				}else{
					if(loadParams.configs.event_id == "9"){
						utils.printGrid("冻结失败结果表",dataTable,loadParams.params.data);
					}else if(loadParams.configs.event_id == "8"){
						utils.printGrid("解冻失败结果表",dataTable,loadParams.params.data);
					}else if(loadParams.configs.event_id == "10"){
						utils.printGrid("重置密码失败结果表",dataTable,loadParams.params.data);
					}else if(loadParams.configs.event_id == "12"){
						utils.printGrid("修改有效期失败结果表",dataTable,loadParams.params.data);
					}else if(loadParams.configs.event_id == "101"){
						utils.printGrid("启用指纹消费失败结果表",dataTable,loadParams.params.data);
					}else if(loadParams.configs.event_id == "102"){
						utils.printGrid("禁用指纹消费失败结果表",dataTable,loadParams.params.data);
					}
				}
			}
		},{
			eName:"linkbutton",
			uId:"tm1",
			cssClass:"cardManage_searchWin_linkbutton",
			text : '导出',
			width : 80,
			height : 35,
			onClick:function(){
				if(loadParams.params.data.length==0){
					$.alert("数据为空");
				}else{
					if(loadParams.configs.event_id == "9"){
						utils.exportDocByData2("冻结失败结果表",dataTable,loadParams.params.data);
					}else if(loadParams.configs.event_id == "8"){
						utils.exportDocByData2("解冻失败结果表",dataTable,loadParams.params.data);
					}else if(loadParams.configs.event_id == "10"){
						utils.exportDocByData2("重置密码失败结果表",dataTable,loadParams.params.data);
					}else if(loadParams.configs.event_id == "12"){
						utils.exportDocByData2("修改有效期失败结果表",dataTable,loadParams.params.data);
					}else if(loadParams.configs.event_id == "101"){
						utils.exportDocByData2("启用指纹消费失败结果表",dataTable,loadParams.params.data);
					}else if(loadParams.configs.event_id == "102"){
						utils.exportDocByData2("禁用指纹消费失败结果表",dataTable,loadParams.params.data);
					}
				}
			}
		}]
	};
		
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
	var title_div = jqObj.findJq('title_div');
	
	loadInit();
	
	function loadInit(){
		if(loadParams.configs.event_id == "9"){
			title_div.html("冻结失败结果表");
		}else if(loadParams.configs.event_id == "8"){
			title_div.html("解冻失败结果表");
		}else if(loadParams.configs.event_id == "10"){
			title_div.html("重置密码失败结果表");
		}else if(loadParams.configs.event_id == "12"){
			title_div.html("修改有效期失败结果表");
		}else if(loadParams.configs.event_id == "101"){
			title_div.html("启用指纹消费失败结果表");
		}else if(loadParams.configs.event_id == "102"){
			title_div.html("禁用指纹消费失败结果表");
		}
		dataTable.datagrid("loadDataEx",loadParams.params.data);
	}
	
	function loadDiv(){
		if(loadParams.configs.event_id == "9"){
			var divUI = {
				eName:"div",
				height:'100%',
				cssStyle:"font-size:23px;line-height:80px;text-align:center;",
				elements:[{
					eName:"span",
					cssStyle:"color:#c9c9c9;",
					elements:"冻结成功"
				},{
					eName:"span",
					cssStyle:"margin: 0 5px 0 5px;color:#FBBC6C;",
					elements:loadParams.params.retData.suc_count + ""
				},{
					eName:"span",
					cssStyle:"color:#c9c9c9;",
					elements:"人，冻结失败"
				},{
					eName:"span",
					cssStyle:"margin: 0 5px 0 5px;color:#FBBC6C;",
					elements:loadParams.params.retData.err_count + ""
				},{
					eName:"span",
					cssStyle:"color:#c9c9c9;",
					elements:"人。"
				}]
			}
		}else if(loadParams.configs.event_id == "8"){
			var divUI = {
				eName:"div",
				height:'100%',
				cssStyle:"font-size:23px;line-height:80px;text-align:center;",
				elements:[{
					eName:"span",
					cssStyle:"color:#c9c9c9;",
					elements:"解冻成功"
				},{
					eName:"span",
					cssStyle:"margin: 0 5px 0 5px;color:#FBBC6C;",
					elements:loadParams.params.retData.suc_count + ""
				},{
					eName:"span",
					cssStyle:"color:#c9c9c9;",
					elements:"人，解冻失败"
				},{
					eName:"span",
					cssStyle:"margin: 0 5px 0 5px;color:#FBBC6C;",
					elements:loadParams.params.retData.err_count + ""
				},{
					eName:"span",
					cssStyle:"color:#c9c9c9;",
					elements:"人。"
				}]
			}
		}else if(loadParams.configs.event_id == "10"){
			var divUI = {
				eName:"div",
				height:'100%',
				cssStyle:"font-size:23px;line-height:80px;text-align:center;",
				elements:[{
					eName:"span",
					cssStyle:"color:#c9c9c9;",
					elements:"重置密码成功"
				},{
					eName:"span",
					cssStyle:"margin: 0 5px 0 5px;color:#FBBC6C;",
					elements:loadParams.params.retData.suc_count + ""
				},{
					eName:"span",
					cssStyle:"color:#c9c9c9;",
					elements:"人，重置密码失败"
				},{
					eName:"span",
					cssStyle:"margin: 0 5px 0 5px;color:#FBBC6C;",
					elements:loadParams.params.retData.err_count + ""
				},{
					eName:"span",
					cssStyle:"color:#c9c9c9;",
					elements:"人。"
				}]	
			}
		}else if(loadParams.configs.event_id == "12"){
			var divUI = {
				eName:"div",
				height:'100%',
				cssStyle:"font-size:23px;line-height:80px;text-align:center;",
				elements:[{
					eName:"span",
					cssStyle:"color:#c9c9c9;",
					elements:"修改有效期成功"
				},{
					eName:"span",
					cssStyle:"margin: 0 5px 0 5px;color:#FBBC6C;",
					elements:loadParams.params.retData.suc_count + ""
				},{
					eName:"span",
					cssStyle:"color:#c9c9c9;",
					elements:"人，修改有效期失败"
				},{
					eName:"span",
					cssStyle:"margin: 0 5px 0 5px;color:#FBBC6C;",
					elements:loadParams.params.retData.err_count + ""
				},{
					eName:"span",
					cssStyle:"color:#c9c9c9;",
					elements:"人。"
				}]	
			}
		}else if(loadParams.configs.event_id == "101"){
			var divUI = {
				eName:"div",
				height:'100%',
				cssStyle:"font-size:23px;line-height:80px;text-align:center;",
				elements:[{
					eName:"span",
					cssStyle:"color:#c9c9c9;",
					elements:"启用指纹消费成功"
				},{
					eName:"span",
					cssStyle:"margin: 0 5px 0 5px;color:#FBBC6C;",
					elements:loadParams.params.retData.suc_count + ""
				},{
					eName:"span",
					cssStyle:"color:#c9c9c9;",
					elements:"人，启用指纹消费失败"
				},{
					eName:"span",
					cssStyle:"margin: 0 5px 0 5px;color:#FBBC6C;",
					elements:loadParams.params.retData.err_count + ""
				},{
					eName:"span",
					cssStyle:"color:#c9c9c9;",
					elements:"人。"
				}]	
			}
		}else if(loadParams.configs.event_id == "102"){
			var divUI = {
				eName:"div",
				height:'100%',
				cssStyle:"font-size:23px;line-height:80px;text-align:center;",
				elements:[{
					eName:"span",
					cssStyle:"color:#c9c9c9;",
					elements:"禁用指纹消费成功"
				},{
					eName:"span",
					cssStyle:"margin: 0 5px 0 5px;color:#FBBC6C;",
					elements:loadParams.params.retData.suc_count + ""
				},{
					eName:"span",
					cssStyle:"color:#c9c9c9;",
					elements:"人，禁用指纹消费失败"
				},{
					eName:"span",
					cssStyle:"margin: 0 5px 0 5px;color:#FBBC6C;",
					elements:loadParams.params.retData.err_count + ""
				},{
					eName:"span",
					cssStyle:"color:#c9c9c9;",
					elements:"人。"
				}]	
			}
		}
		return divUI;
	}
		
	
	//关闭
	jqObj.updateOpt("panel",{
		onBeforeClose:function(){
			loadParams.loadP.callback();
			return true;//true 关闭 false不关闭
		}
	});
	
});