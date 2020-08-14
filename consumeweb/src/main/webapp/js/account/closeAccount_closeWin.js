//销户
garen_define("js/account/closeAccount_closeWin",function (jqObj,loadParams) {
	
	var columns = [//列字段定义
   	 	[ {
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
   	  		width : 90
   	  	}] 
   	];
	
	var westUI = {
		eName:"datagrid",
		id:"dataTable",
		idField : 'account_id',
		columns : columns,
		pagination: true,
		clientPager:true,
		showFooter:false,
		alertFlag : false,// 是否弹出默认对话框
		autoload : false,
		singleSelect:false
	};
	
	var eastUI = {
		eName:"div",
		cssClass:"closeAccount_delAccount",
		height:315,
		elements:[{
			eName:"fieldset",
			width:240,
			height:100,
			elements:[{
				eName:'legend',
				cssStyle:"font-weight:bold;font-size:15px;text-align:left;",
				text:'押金处理方式'
			},{
				eName:"div",
				elements:{
					eName:"div",
					cssClass:'div_first',
					elements:[{
						eName:"div",
						elements:[{
							eName : 'input',
							cssClass:"closeAccount_checkbox",
							name : 'if_deposit',
							id:"if_deposit1",
							type : 'radio',
							value:"1"
						},{
							eName : 'span',
							text : '取押金'
						}]
					},{
						eName:"div",
						elements:[{
							eName : 'input',
							cssClass:"closeAccount_checkbox",
							name : 'if_deposit',
							id:"if_deposit2",
							type : 'radio',
							value:"0"
						},{
							eName : 'span',
							text : '押金转收入'
						}]
					}]
				}
			}]
		},{
			eName:"fieldset",
			width:240,
			height:100,
			elements:[{
				eName:'legend',
				cssStyle:"font-weight:bold;font-size:15px;text-align:left;",
				text:'补贴处理方式'
			},{
				eName:"div",
				elements:{
					eName:"div",
					cssClass:'div_first',
					elements:[{
						eName:"div",
						elements:[{
							eName : 'input',
							cssClass:"closeAccount_checkbox",
							name : 'if_sub',
							id:"if_sub1",
							type : 'radio',
							value:"1"
						},{
							eName : 'span',
							text : '取补贴'
						}]
					},{
						eName:"div",
						elements:[{
							eName : 'input',
							cssClass:"closeAccount_checkbox",
							name : 'if_sub',
							id:"if_sub2",
							type : 'radio',
							value:"0"
						},{
							eName : 'span',
							text : '补贴清零'
						}]
					}]
				}
			}]
		}]
	};
	
	var southUI = {
		eName:"div",
		cssClass:"openAccount_configWin_southdiv",
		elements:[{
			eName:"linkbutton",
			uId:"tm1",
			cssClass:"cardManage_searchWin_linkbutton",
			text : '确定',
			width : 80,
			height : 35,
			onClick:function(){
				//jqObj.window("close");
				var params = {};
				if(if_deposit1.prop("checked")){
					params['if_deposit'] = if_deposit1.val();
				}
				else if(if_deposit2.prop("checked")){
					params['if_deposit'] = if_deposit2.val();
				}
				if(if_sub1.prop("checked")){
					params['if_sub'] = if_sub1.val();
				}
				else if(if_sub2.prop("checked")){
					params['if_sub'] = if_sub2.val();
				}
				params['destroy_type'] = 0;//正常
				params['auto_backcard'] = 1;//自动
				if(loadParams.params[0].account_id == loadParams.rData.account_id){
					params['read_card_number'] = loadParams.rData.card_number;
					params['read_media_id'] = loadParams.rData.media_id;
				}
				var myWin = $.createWin({
					title:"操作提示",
					width:600,
					height:100,
					queryParams:{
						params:loadParams.params,
						configs:params,
//						callback:function(){
//							loadParams.callback();
//							jqObj.window("close");
//						}
						loadP:loadParams
					},
					url:"js/account/closeAccount_progressBarWin.js"
				});
				jqObj.window("close");
			}
		},{
			eName:"linkbutton",
			uId:"tm1",
			cssClass:"cardManage_searchWin_linkbutton",
			text : '取消',
			width : 80,
			height : 35,
			onClick:function(){
				jqObj.window("close");
			}
		}]
	};
			
	var mainUI = {
		eName : 'layoutExt',// 容器布局类，jeasyui组件
		cssStyle:'font-family: 微软雅黑, Arial;',
		fit : true,
		elements : [{
			region : 'west',
			width:293,
			elements : westUI
		},
		{
			region : 'east',
			width:293,
			elements : eastUI
		},{
			region : 'south',
			height:50,
			elements : southUI
		}]
	}
	
	jqObj.loadUI(mainUI);
	
	var dataTable = jqObj.findJq("dataTable");
	var if_deposit = jqObj.findJq("if_deposit");
	var if_sub = jqObj.findJq("if_sub");
	
	var if_deposit1 = jqObj.findJq("if_deposit1");
	var if_sub1 = jqObj.findJq("if_sub1");
	var if_deposit2 = jqObj.findJq("if_deposit2");
	var if_sub2 = jqObj.findJq("if_sub2");
	
	//分页提示信息修改
	var pager = dataTable.datagrid("getPager"); 
    pager.pagination({ 
    	showPageList:false,
    	//beforePageText:'',//页数文本框前显示的汉字 
        //afterPageText:'', 
        displayMsg:''
    });
	
	loadInit();
	
	function loadInit(){
		if_deposit1.attr("checked","checked");
		if_sub1.attr("checked","checked");
		dataTable.datagrid("loadDataEx",loadParams.params);
		//dataListPage();
	}
	
//	function dataListPage(){
//		var pager = dataTable.datagrid("getPager"); 
//	    pager.pagination({ 
//	    	total:loadParams.params.length,
//	    	showPageList:false,
//	    	beforePageText:'',//页数文本框前显示的汉字 
//	        //afterPageText:'', 
//	        displayMsg:'', 
//	        onSelectPage:function (pageNo, pageSize) { 
//	        	var start = (pageNo - 1) * pageSize; 
//	        	var end = start + pageSize; 
//	        	//provideEmpList.datagrid("loadData", rData.slice(start, end)); 
//	        	//加载数据
//	        	dataTable.datagrid("loadDataEx", {id:0,rows:loadParams.params.slice(start, end),
//	        		total:loadParams.params.length,pageNumber:pageNo}); 
//	        } 
//	    }); 
//	    dataTable.datagrid("resize");
//	}
	
});