//人群设置
garen_define("js/consume/peopleSet",function (jqObj,loadParams) {
	
	//webService
	var crowdQuery = "consume/crowdQuery.do";//人群设置查询
	
	var crowdUpdate = "consume/crowdUpdate.do";//人群设置修改
	
	var crowdDelete = "consume/crowdDelete.do";//人群设置删除
	
	var base = garen_require("js/base/ws_public");
	
	var scmurl = garen_require("js/lib/scmurl");//url地址
	
	var checkCoreIp = base.checkCoreIp;//核心业务IP授权验证
	
	var depQuery = base.depQuery;//部门查询
	
	var ideQuery = base.ideQuery;//身份查询
	
	var ideQueryByDep = "consume/ideQueryByDep.do";//根据部门查询身份列表
	
	var depIdeSet = "consume/depIdeSet.do";//按部门身份确定
		
	var depIdeQuery = "consume/depIdeQuery.do";//按部门身份查询
	
	var userQueryBySearch = "consume/userQueryBySearch.do";//根据查询条件查询人员
	
	var userQueryByCrowd = "consume/userQueryByCrowd.do";//根据人群查询人员
	
	var userSet = "consume/userSet.do";//按人员确定
	
	var depIdeDelete = "consume/depIdeDelete.do";//下方规则列表删除
		
	var userDelete = "consume/userDelete.do";//下方规则列表删除
	
	var crowd_columns = [//列字段定义
      	 [{
       		field : 'crowd_name',
       		title : '人群名称',
       		align : "center",
       		width:221
       	}]];
	
	var ide_columns = [//列字段定义
      	 [{
      		field : 'ident_id',
       		title : '..',
       		align : "center",
       		checkbox:true
      	 },{
       		field : 'ident_name',
       		title : '全部',
       		align : "center",
       		width:192
       	}]];
	
	var user_columns2 = [//列字段定义
     	 [{
       		field : 'user_serial',
        	title : '..',
        	align : "center",
        	checkbox:true
       	 },{
        	field : 'user_no',
        	title : '学/工号',
        	align : "center",
        	width:89
         },{
        	field : 'user_lname',
        	title : '姓名',
        	align : "center",
        	width:88
         }]];
  	
	
	var northUI = {
		eName:"div",
		cssClass:"people_center_div",
		elements:[{
			eName:"div",
			cssClass:"odd_div",
			width:220,
			elements:[{
				eName:"div",
				cssClass:"div_head",
				elements:[{
					eName:"img",
					src:"image/icon01.gif"
				},{
					eName:"span",
					text:"人群列表"
				}]
			},{
				eName:"div",
				cssClass:"div_btn",
				elements:[{
					eName:"linkbutton",
					uId:"tm1",
					cssClass:"peopleSet_linkbutton",
					width:50,
					height:30,
					text:"新增",
					onClick:addCrowd
				},{
					eName:"linkbutton",
					uId:"tm1",
					cssClass:"peopleSet_linkbutton",
					id:"t_crowd_modify",
					width:50,
					height:30,
					text:"修改",
					onClick:modifyCrowd
				},{
					eName:"linkbutton",
					uId:"tm2",
					cssClass:"peopleSet_linkbutton",
					id:"t_crowd_delete",
					width:50,
					height:30,
					text:"删除",
					onClick:deleteCrowd
				}]
			},{
				eName:"div",
				height:306,
				elements:{
					eName:"datagrid",
					id:"crowdTable",
					idField : 'crowd_id',
					url : crowdQuery,
					columns : crowd_columns,
					clientPager:false,
					pagination: false,
					alertFlag : false,// 是否弹出默认对话框
					autoload : true,
					singleSelect:true,
					checkOnSelect:false,
					selectOnCheck:false,
					showHeader:false,
					border:false,
					onClickRow:loadOne,
					onLoadSuccessEx:function(retJson){
						if(retJson.id==0){
							
						}else{
							$.alert(retJson.info);
						}
					}
				}
			}]
		},{
			eName:"div",
			cssClass:"img_div",
			width:30,
			elements:[{
				eName:"span",
				cssClass:"img_span"
			},{
				eName:"img",
				src:"image/arrow1.gif"
			}]
		},{
			eName:"div",
			cssClass:"odd_div",
			width:220,
			elements:[{
				eName:"div",
				cssClass:"div_head",
				elements:[{
					eName:"img",
					src:"image/icon01.gif"
				},{
					eName:"span",
					text:"选择方式"
				}]
			},{
				eName:"div",
				cssClass:"div_content",
				elements:[{
					eName:"div",
					elements:{
						eName:"linkbutton",
						uId:"tm1",
						id:"dep_button",
						cssClass:"peopleSet_long_btn",
						text:"<span style='font-size:13px;line-height:35px;'>按部门身份规则</span>",
						onClick:dep_change
					}
				},{
					eName:"div",
					elements:{
						eName:"linkbutton",
						uId:"tm1",
						id:"search_button",
						cssClass:"peopleSet_long_btn",
						text:"<span style='font-size:13px;line-height:35px;'>按人员</span>",
						onClick:search_change
					}
				}]
			}]
		},{
			eName:"div",
			cssClass:"img_div",
			width:30,
			elements:[{
				eName:"span",
				cssClass:"img_span"
			},{
				eName:"img",
				src:"image/arrow1.gif"
			}]
		},{
			eName:"div",
			cssClass:"odd_div",
			id:"dep_panel",
			width:220,
			elements:[{
				eName:"div",
				cssClass:"div_head",
				elements:[{
					eName:"img",
					src:"image/icon01.gif"
				},{
					eName:"span",
					text:"部门"
				}]
			},{
				eName:"div",
				height:350,
				elements:{
					eName:"treeEx",
					id:"dep_serial",
					pid:"dep_parent",
					nodeText:"dep_name",
					url:depQuery,
					fit : 'true',
					checkbox:true
//					onClickEx : function(params) {
//						loadDepIdeList();
//					}
				}
			}]
		},{
			eName:"div",
			cssClass:"odd_div",
			id:"search_panel",
			width:220,
			elements:[{
				eName:"div",
				cssClass:"div_head",
				elements:[{
					eName:"img",
					src:"image/icon01.gif"
				},{
					eName:"span",
					text:"查询条件"
				}]
			},{
				eName:"formUI",
				method:"post",
				id:"userSearchForm",
				elements:{
					eName:"div",
					cssClass:"div_third",
					elements:[{
						eName:"div",
						elements:[{
							eName:"span",
							elements:"学/工号&ensp;"
						},{
							eName:"textbox",
							name:"user_no",
							width:130
						}]
					},{
						eName:"div",
						elements:[{
							eName:"span",
							elements:"姓&emsp;&emsp;名"
						},{
							eName:"textbox",
							name:"user_lname",
							width:130
						}]
					},{
						eName:"div",
						elements:[{
							eName:"span",
							elements:"部&emsp;&emsp;门"
						},{
							eName:"combotree",
							name:"dep_serial",
							panelHeight:$.browser.msie9?200:'auto',
							panelMaxHeight:200,
							id:"depTree",
							editable:false,
							width:130,
							onSelect:function(node){//选择相同则清空文本内容
								if(depTree.combo("getText")==node.text){
									depTree.combotree("clear");
								}
							}
						}]
					},{
						eName:"div",
						elements:[{
							eName:"span",
							text:"身份类型"
						},{
							eName:"combobox",
							name:"tt_order",
							id:"ideList",
							panelHeight:$.browser.msie9?200:'auto',
							panelMaxHeight:200,
							valueField: 'ident_id',    
					        textField: 'ident_name',
							editable:false,
							width:130
						}]
					},{
						eName:"div",
						elements:[{
							eName:"span",
							text:"模糊条件"
						},{
							eName:"textbox",
							name:"fuzzy",
							width:130,
							prompt:'请输入姓名模糊查询',	
						}]
					},{
						eName:"div",
						elements:{
							eName:"linkbutton",
							uId:"tm1",
							cssClass:"peopleSet_long_btn",
							id:"t_user_search",
							text:"<span style='font-size:13px;line-height:35px;'>查询</span>",
							onClick:loadUserList
						}
					}]
				}
			}]
		},{
			eName:"div",
			cssClass:"img_div",
			width:30,
			elements:[{
				eName:"span",
				cssClass:"img_span"
			},{
				eName:"img",
				src:"image/arrow1.gif"
			}]
		},{
			eName:"div",
			id:"ide_panel",
			cssClass:"odd_div",
			width:220,
			elements:[{
				eName:"div",
				cssClass:"div_head",
				elements:[{
					eName:"img",
					src:"image/icon01.gif"
				},{
					eName:"span",
					text:"身份选择"
				}]
			},{
				eName:"div",
				height:350,
				elements:{
					eName:"datagrid",
					id:"ideTable",
					//url:ideQueryByDep,
					url:ideQuery,
					idField : 'ident_id',
					columns : ide_columns,
					clientPager:false,
					pagination: false,
					alertFlag : false,// 是否弹出默认对话框
					autoload : true,
					singleSelect:false,
					checkOnSelect:true,
					selectOnCheck:true,
					//showHeader:false,
					border:false
				}
			}]
		},{
			eName:"div",
			id:"user_panel",
			cssClass:"odd_div",
			width:220,
			elements:[{
				eName:"div",
				cssClass:"div_head",
				elements:[{
					eName:"img",
					src:"image/icon01.gif"
				},{
					eName:"span",
					text:"人员列表"
				}]
			},{
				eName:"div",
				height:350,
				elements:{
					eName:"datagrid",
					id:"userListTable",
					idField : 'user_serial',
					url : userQueryBySearch,
					columns : user_columns2,
					clientPager:true,
					pagination: true,
					alertFlag : false,// 是否弹出默认对话框
					autoload : false,
					singleSelect:false,
					checkOnSelect:true,
					selectOnCheck:true,
					//showHeader:false,
					border:false
				}
			}]
		},{
			eName:"div",
			cssClass:"confirm_div",
			width:100,
			elements:[{
				eName:"span",
				cssClass:"img_span"
			},{
				eName:"linkbutton",
				uId:"tm2",
				cssClass:"peopleSet_confirm_btn",
				id:"t_confirm_btn",
				text:"<span style='font-size:13px;line-height:80px;'>确定</span>",
				onClick:save
			}]
		}]
	};
	
	//工具栏
	var depIde_toolBar = [null,{
		eName : 'div',
		height:35,
		cssClass:"peopleSet_toolBar_div",
		elements:[{
			eName:"div",
			cssClass:"depIde_toolBar_div",
			elements:"部门身份规则",
		},{
			eName:"div",
			elements:"人员",
			onClick:search_tab_change
		}]
	}];
	
	var user_toolBar = [null,{
		eName : 'div',
		height:35,
		cssClass:"peopleSet_toolBar_div",
		elements:[{
			eName:"div",
			id:"t_dep_ide_rule",
			elements:"部门身份规则",
			onClick:dep_tab_change
		},{
			eName:"div",
			cssClass:"user_toolBar_div",
			elements:"人员"
		}]
	}];
	
	var depIde_columns = [//列字段定义
      	[ {
       		field : 'index',
       		title : '..',
       		align : "center",    
       		width : 50
       	}, {
       		field : 'crowd_name',
       		title : '人群名称',
       		align : "center",
       		width : 150
       	}, {
       		field : 'dep_name',
       		title : '部门',
       		align : "center",
       		width : 200
       	}, {
       		field : 'tt_name',
       		title : '身份类型',
       		align : "center",
       		width : 200
       	}, {
       		field : 'operation',
       		title : '操作',
       		align : "center",
       		width : 150,
		   	formatter:function(value,row,index){  
		        var btn = "<span class='column_delete_btn' rowindex='"+index+"'>删除</span>"
		        return btn;  
		    }  
       	}] ];
	
	var user_columns = [//列字段定义
        	[ {
         		field : 'index',
         		title : '..',
         		align : "center",    
         		width : 50
         	}, {
         		field : 'crowd_name',
         		title : '人群名称',
         		align : "center",
         		width : 150
         	}, {
         		field : 'user_lname',
         		title : '姓名',
         		align : "center",
         		width : 200
         	}, {
         		field : 'user_no',
         		title : '学/工号',
         		align : "center",
         		width : 200
         	}, {
         		field : 'operation',
         		title : '操作',
         		align : "center",
         		width : 150,
         		formatter:function(value,row,index){  
    		        var btn = "<span class='column_delete_btn' uId='save' rowindex='"+index+"'>删除</span>"
    		        return btn;  
    		    }  
         	}, {
         		field : 'operation2',
         		title : '操作',
         		align : "center",
         		width : 150
         	}] ];
	
	var centerUI = {
		eName:"div",
		height:"100%",
		elements:[{
			eName:"div",
			height:"100%",
			id:"depIdeTable_div",
			elements:{
				eName : 'datagrid',
				idField : 'rule_id',
				url:depIdeQuery,
				id:"depIdeTable",
				toolbarEx : depIde_toolBar,// 查询条件工具栏
				columns : depIde_columns,
				pagination: true,//是否分页由false改为true add by LYh 2017-5-23
				showFooter:true,//是否显示分页信息false改为true add by LYh 2017-5-23
				alertFlag : false,// 是否弹出默认对话框
				autoload : false,
				singleSelect:true,
				checkOnSelect:false,
				selectOnCheck:false,
				clientPager:false,//(是否客户端分页)
				onLoadSuccessEx:function(data){
					var mygrid = $(this);
					var mypanel = $(this).datagrid('getPanel');
					mypanel.find(".column_delete_btn").click(function(){
						var mytr = $(this).parents('tr.datagrid-row');
						//$.print(mytr.prop('rowIndex'));
						$.confirm("是否确定删除？",function(c){
							if(c){
								mygrid.datagrid("selectRow",mytr.prop('rowIndex'));
								var row = mygrid.datagrid("getSelected");
								//mygrid.datagrid('deleteRow',mytr.prop('rowIndex'));
								var params = {};
								params['rule_id'] = row.rule_id;
								$.postEx(depIdeDelete,params,function(retJson){
									if(retJson.result){
										loadDepIde();
									}else{
										$.alert(retJson.info);
									}
								});
							}
						});
						//mygrid.datagrid('deleteRow',mytr.prop('rowIndex'));
					});
					//$.print(mypanel);
				}
			}
		},{
			eName:"div",
			height:"100%",
			id:"userTable_div",
			elements:{
				eName : 'datagrid',
				idField : 'user_serial',
				url:userQueryByCrowd,
				id:"userTable",
				toolbarEx : user_toolBar,// 查询条件工具栏
				columns : user_columns,
				pagination: true,//是否分页由false改为true add by LYh 2017-5-23
				showFooter:true,//是否显示分页信息false改为true add by LYh 2017-5-23
				alertFlag : false,// 是否弹出默认对话框
				autoload : false,
				singleSelect:true,
				checkOnSelect:false,
				selectOnCheck:false,
				clientPager:false,//(是否客户端分页)
				onLoadSuccessEx:function(data){
					var crow = crowdTable.datagrid("getSelected");
					if(crow.crowd_id==1){
						userTable.datagrid("hideColumn","operation");
			    		userTable.datagrid("showColumn","operation2");
					}else{
						userTable.datagrid("hideColumn","operation2");
			    		userTable.datagrid("showColumn","operation");
					}
					var mygrid = $(this);
					var mypanel = $(this).datagrid('getPanel');
					mypanel.find(".column_delete_btn").click(function(){
						var mytr = $(this).parents('tr.datagrid-row');
						//$.print(mytr.prop('rowIndex'));
						$.confirm("是否确定删除？",function(c){
							if(c){
								mygrid.datagrid("selectRow",mytr.prop('rowIndex'));
								var row = mygrid.datagrid("getSelected");
								//mygrid.datagrid('deleteRow',mytr.prop('rowIndex'));
								var params = {};
								params['user_serial'] = row.user_serial;
								$.postEx(userDelete,params,function(retJson){
									if(retJson.result){
										loadUser();
									}else{
										$.alert(retJson.info);
									}
								});
							}
						});
						//mygrid.datagrid('deleteRow',mytr.prop('rowIndex'));
					});
					//$.print(mypanel);
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
				height : 400,
				elements : northUI
			},
			{
				region : 'center',
				elements : centerUI
			}]
	};
	
	//创建dom
	jqObj.loadUI(mainUI);
	var crowdTable = jqObj.findJq("crowdTable");
	var ideTable = jqObj.findJq("ideTable");
	var depIdeTable = jqObj.findJq("depIdeTable");
	var userListTable = jqObj.findJq("userListTable");
	var userTable = jqObj.findJq("userTable");
	var depTree = jqObj.findJq("depTree");
	var ideList = jqObj.findJq("ideList");
	var dep_serial = jqObj.findJq("dep_serial");
	var dep_panel = jqObj.findJq("dep_panel");
	var search_panel = jqObj.findJq("search_panel");
	var ide_panel = jqObj.findJq("ide_panel");
	var user_panel = jqObj.findJq("user_panel");
	var dep_button = jqObj.findJq("dep_button");
	var search_button = jqObj.findJq("search_button");
	var userSearchForm = jqObj.findJqUI("userSearchForm");
	var depIdeTable_div = jqObj.findJq("depIdeTable_div");
	var userTable_div = jqObj.findJq("userTable_div");
	var t_crowd_modify = jqObj.findJq("t_crowd_modify");
	var t_crowd_delete = jqObj.findJq("t_crowd_delete");
	var t_confirm_btn = jqObj.findJq("t_confirm_btn");
	var t_user_search = jqObj.findJq("t_user_search");
	var t_dep_ide_rule = jqObj.findJq("t_dep_ide_rule");
	var column_delete_btn = jqObj.findJq("column_delete_btn");

	//页面初始化
	loadInit();
	function loadInit(){
		
		$.postEx(checkCoreIp,{'op_name':'人群设置'},function(retJson){
			if(retJson.result){
				
			}else{
				$.alert(retJson.info,function(){
					//window.parent.location.reload();
					window.top.location.href=scmurl;
				});
			}
		});
		
		search_panel.css("display","none");
		user_panel.css("display","none");
		userTable_div.css("display","none");
	}
	
	//选择方式“安部门身份规则”
	function dep_change(){
		if(dep_panel.css("display")=="none"){
			dep_panel.css("display","");
			ide_panel.css("display","");
			search_panel.css("display","none");
			user_panel.css("display","none");
			userTable_div.css("display","none");
			depIdeTable_div.css("display","");
			dep_serial.tree("reload");
			//loadDepIdeList();
			//ideTable.datagrid("load",{dep_serial:""});
			loadDepIde();
		}
	}
	
	//选择方式“按人员”
	function search_change(){
		if(search_panel.css("display")=="none"){
			search_panel.css("display","");
			user_panel.css("display","");
			dep_panel.css("display","none");
			ide_panel.css("display","none");
			userTable_div.css("display","");
			depIdeTable_div.css("display","none");
			userListTable.datagrid("resize");
			loadUser();
		}
	}
	
	//下方“部门身份规则”按钮
	function dep_tab_change(){
		userTable_div.css("display","none");
		depIdeTable_div.css("display","");
		loadDepIde();
	}
	
	//下方“人员”按钮
	function search_tab_change(){
		userTable_div.css("display","");
		depIdeTable_div.css("display","none");
		loadUser();
	}
	
	//新增人群
	function addCrowd(){
		var myWin = $.createWin({
			title:"新增人群",
			width:300,
			height:180,
			queryParams:{
				callback:loadCrowd
			},
			url:"js/consume/peopleSet_addCrowd.js"
		});
	}
	
	//修改人群
	function modifyCrowd(){
		var row = crowdTable.datagrid("getSelected");
		if(row!=null){
			var params = {};
			params['crowd_id'] = row.crowd_id;
			params['crowd_name'] = row.crowd_name;
			var myWin = $.createWin({
				title:"修改人群",
				width:300,
				height:180,
				queryParams:{
					params:params,
					callback:loadCrowd
				},
				url:"js/consume/peopleSet_modifyCrowd.js"
			});
		}else{
			$.alert("请先选择一个人群！");
		}
	}

	//删除人群
	function deleteCrowd(){
		var row = crowdTable.datagrid("getSelected");
		if(row!=null){
			$.confirm("确定要删除这个人群吗？",function(c){
				if(c){
					var params = {};
					params['crowd_id'] = row.crowd_id;
					$.postEx(crowdDelete,params,function(retJson){
						if(retJson.result){
							loadCrowd();
						}else{
							$.alert(retJson.info);
						}
					});
				}
			});
		}else{
			$.alert("请先选择一个人群！");
		}
	}
	
	//加载人群列表
	function loadCrowd(){
		crowdTable.datagrid("reload");
	}
	
	//加载部门树
	loadTree();
	function loadTree(){
		$.postEx(depQuery,function(retJson){
			if(retJson.result && retJson.data){
				depTree.combotree('loadData',
						$.list2Tree(retJson.data,"dep_serial","dep_parent","dep_name"));
			}
		});
	}
	//按人员加载身份列表
	loadIdeList();
	function loadIdeList(){
		$.postEx(ideQuery,function(retJson){
			if(retJson.result && retJson.data){
				ideList.combobox("loadDataEx",retJson.data);
			}
		});
	}
	
	//根据部门加载身份列表
	//loadDepIdeList();
//	function loadDepIdeList(){
//		var params = {};
//		var ids = [];
//		var rows = dep_serial.tree("getChecked");
//		$.each(rows,function(i, row){
//			ids.push(row.dep_serial);
//		});
//		params['dep_serial'] = ids.join();
//		ideTable.datagrid("load",params);
//	}
	
	//确定按钮
	function save(){
		//按部门身份规则确定
		if(dep_panel.css("display")!="none"){
			var rows1 = crowdTable.datagrid("getSelected");
			var rows2 = dep_serial.tree("getChecked");
			var rows3 = ideTable.datagrid("getCheckedEx");
			
			if(rows1==null){
				$.alert("请选择一个人群！");
			}
			else if(rows2.length<1){
				$.alert("请选择部门场所！");
			}
			else if(rows3.length<1){
				$.alert("请选择身份！");
			}
			else{
				var params = {};
				var serials = [];
				var orders = [];
				$.each(rows2,function(i, row2){
					serials.push(row2.dep_serial);
				});
				$.each(rows3,function(i, row3){
					orders.push(row3.ident_id);
				});
				params['crowd_name'] = rows1.crowd_name;
				params['crowd_id'] = rows1.crowd_id;
				params['dep_serial'] = serials.join();
				params['tt_order'] = orders.join();
				$.postEx(depIdeSet,params,function(retJson){
					if(retJson.result){
						var myWin = $.createWin({
							title:"系统提示信息",
							width:300,
							height:150
						},myWinUI);
						window.setTimeout(function(){
							myWin.window("close");
						},1500);
						loadDepIde();
					}else if(retJson.id=="-2"){
						//$.print(retJson.data);
						//$.alert(retJson.info);
						var myWin = $.createWin({
							title:"操作提示",
							width:602,
							height:450,
							queryParams:{
								params:retJson,
								params2:params,
								callback:loadOne
							},
							url:"js/consume/peopleSet_configWin_1.js"
						});
					}else{
						$.alert(retJson.info);
					}
				});
			}
			
		}
		//按人员确定
		else if(search_panel.css("display")!="none"){
			var rows1 = crowdTable.datagrid("getSelected");
			var rows2 = userListTable.datagrid("getCheckedEx");
			
			if(rows1==null){
				$.alert("请选择一个人群！");
			}
			else if(rows2.length<1){
				$.alert("请选择人员！");
			}
			else{
				var params = {};
				var serials = [];
				$.each(rows2,function(i, row2){
					serials.push(row2.user_serial);
				});
				params['crowd_name'] = rows1.crowd_name;
				params['crowd_id'] = rows1.crowd_id;
				params['user_serial'] = serials.join();
				$.postEx(userSet,params,function(retJson){
					if(retJson.result){
						var myWin = $.createWin({
							title:"系统提示信息",
							width:300,
							height:150
						},myWinUI);
						window.setTimeout(function(){
							myWin.window("close");
						},1500);
						loadUser();
					}else if(retJson.id=="-2"){
						//$.alert(retJson.info);
						var myWin = $.createWin({
							title:"操作提示",
							width:602,
							height:450,
							queryParams:{
								params:retJson,
								params2:params,
								callback:loadOne
							},
							url:"js/consume/peopleSet_configWin_2.js"
						});
					}else{
						$.alert(retJson.info);
					}
				});
			}
		}
	}
	
	//按人群加载部门身份规则
	function loadDepIde(){
		var row = crowdTable.datagrid("getSelected");
		if(row!=null){
			var params = {};
			params['crowd_id'] = row.crowd_id;
			depIdeTable.datagrid("load",params);
		}
	}
	
	//按人群加载人员
	function loadUser(){
		var row = crowdTable.datagrid("getSelected");
		if(row!=null){
			var params = {};
			params['crowd_id'] = row.crowd_id;
			userTable.datagrid("load",params);
		}
	}
	
	
	//根据查询条件加载人员列表
	function loadUserList(){
		var params = userSearchForm.form2Json();
		if(params.dep_serial==""){
			delete params['dep_serial'];
		}
		if(params.tt_order==""){
			delete params['tt_order'];
		}
		userListTable.datagrid("loadEx",params);
	}
	
	//分页提示信息修改
	var pager = userListTable.datagrid("getPager"); 
    pager.pagination({ 
    	showPageList:false,
    	beforePageText:'',//页数文本框前显示的汉字 
        afterPageText:'', 
        displayMsg:''
    });
    
    var myWinUI = {
		eName:"div",
		cssStyle:"text-align:center;",
		elements:{
			eName:"span",
			cssStyle:"line-height:100px;font-size:16px;font-family: 微软雅黑, Arial;",
			elements:"保存成功！"
		}
    }
	
	//点击人群加载不同table
	function loadOne(){
    	var row = crowdTable.datagrid("getSelected");
    	
		if(row.crowd_id==1){
    		t_crowd_modify.linkbutton("disable");
    		t_crowd_delete.linkbutton("disable");
    		dep_button.linkbutton("disable");
    		//search_button.click();
			search_panel.css("display","");
			user_panel.css("display","");
			dep_panel.css("display","none");
			ide_panel.css("display","none");
			userTable_div.css("display","");
			depIdeTable_div.css("display","none");
			userListTable.datagrid("resize");
			//loadUser();
    		search_button.linkbutton("disable");
    		t_confirm_btn.linkbutton("disable");
    		t_user_search.linkbutton("disable");
    		t_dep_ide_rule.hide();
    		
    	}else{
    		t_crowd_modify.linkbutton("enable");
    		t_crowd_delete.linkbutton("enable");
    		dep_button.linkbutton("enable");
    		search_button.linkbutton("enable");
    		t_confirm_btn.linkbutton("enable");
    		t_user_search.linkbutton("enable");
    		t_dep_ide_rule.show();
    		
    	}
		
		if(depIdeTable_div.css("display")!="none"){
			loadDepIde();
		}
		else if(userTable_div.css("display")!="none"){
			loadUser();
		}
		
	}
});
	