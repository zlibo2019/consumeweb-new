//补贴录入
garen_define("js/subsidy/provide_addSubsidy",function (jqObj,loadParams) {
	
	var base = garen_require("js/base/ws_public");
	
	var depQuery = base.depQuery;//部门查询
	
	var ideQuery = base.ideQuery;//身份查询
	
	var provideEmpQuery = "subsidy/provideEmpQuery.do";//根据身份和部门查询员工
	
	var subsidyAdd = "subsidy/subsidyAdd.do";//根据身份和部门查询员工
	
	var readSubsidyXml = "subsidy/readSubsidyXml.do";//读取录入负补贴按钮开关（显示/隐藏）文件
	
	var left_rows = "";//左侧添加到右侧人数
	
	var rData = "";//页面保存员工列表数据
	
	var addEmpData = "";//添加到右侧列表的数据
	
	var addFlag = "";//添加员工标志
	
	var columns = [//列字段定义
     	[ {
     		field : 'xh',
    		title : '..',
    		align : "center",
    		width : 30,
    		checkbox:true
     	},{
      		field : 'index',
      		title : '..',
      		align : "center",
      		width : 33
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
      	}] ];
	
	var empColumns = [
	[ {
		field : 'xh',
		title : '..',
		align : "center",
		width : 30,
		checkbox:true
	},{
		field : 'index',
		title : '..',
		align : "center",
		width : 35
	},  {
		field : 'user_no',
		title : '学/工号',
		align : "center",
		width : 90
	}, {
		field : 'user_lname',
		title : '姓名',
		align : "center",
		width : 90
	}] ];
	
	var toolBar = [null,{
		eName : 'div',
		//cssStyle:"text-align:center;",
		//cssClass : "notice_toolBar_west",
		elements : {
			eName : 'searchbox',
			name:'searchParam',
			prompt : '请输入关键字...',
			height : 30,
			width : 256,
			searcher:loadEmpList
		}
	}];
	
	var northUI = {
		eName:"div",
		height:40,
		elements:[{
			eName:"div",
			select:1,
			cssClass:"dep_list",
			elements:{
				eName:"span",
				text:"部门列表"
			},
			onClick:select
		},{
			eName:"div",
			select:0,
			cssClass:"emp_list",
			elements:{
				eName:"span",
				text:"员工列表"
			},
			onClick:select
		}]
	};
	
	var centerUI = [{
			eName:"div",
			height:285,
			width:265,
			id:"depTreeDiv",
			elements:{
				 eName:"treeEx",
				 //id:"provideDepTree",
				//checkbox:true,
				 id:"dep_serial",
				 pid:"dep_parent",
				 nodeText:"dep_name",
				 url:depQuery,
				 onClickEx:function(params){
					// $.print(params);
					 loadEmpList(searchParam.textbox("getValue"));
				 }
//					,
//				 toolbar:[{
//					 eName:"searchbox",
//					 prompt:"请输入关键字...",
//					 searcher:search
//				 }]
			}
		},{
			eName:"div",
			height:285,
			width:265,
			cssStyle:"display:none;",
			id:"empListDiv",
			elements:{
				eName:"datagrid",
				id:"provideEmpList",
				//height:285,
				//width:240,
				columns:empColumns,
				toolbarEx:toolBar,
				idField:"account_id",
				pagination:true,
				clientPager:true,
				fit:true,
				alertFlag : false,// 是否弹出默认对话框
				autoload : false,
				singleSelect:false,
				checkOnSelect:true,
				selectOnCheck:true
			}
		}];
	
	var addSubsidyUI = {
		eName:"div",
		cssClass:"provide_addSubsidy",
		elements:[{
			eName:"fieldset",
			width:670,
			height:100,
			elements:[{
				eName:'legend',
				text:'补贴金额'
			},{
				eName:"div",
				cssClass:"provide_addSubsidy1",
				elements:[{
					eName:"div",
					cssClass:'provide_addSubsidy_dfloat',
					elements:[{
						eName:'div',
						elements:[{
							eName:"span",
							elements:"输入补贴金额"
						},{
							eName : 'textbox',
							id:"moneyBox",
							validType:['money','moneyMax'],
							name : '',
							width : 100,
							height : 25,		
							value:'',//默认值
							onChange:moneyInput
						}]
					},{
						eName:'div',
						id:"minus_div",
						cssClass:"provide_addSubsidy_fu",
						elements:[{
							eName : 'input',
							id:"if_fu",
							name : '',
							cssClass:"provide_addSubsidy_checkbox",
							type : 'checkbox',
							onClick:clickFu
						},{
							eName:"span",
							elements:"录入负补贴"
						}]
					}]
					
				},{
					eName:"div",
					cssClass:'provide_addSubsidy_dfloat',
					elements:[{
						eName:'div',
						elements:[{
							eName:"linkbutton",
							uId:"tm1",
							cssClass:'provide_addSubsidy_moneybut',
							width:50,
							height:25,
							text : '50',
							onClick : function(){
								if(isNaN(moneyBox.textbox("getValue"))){
									moneyBox.textbox("textbox").focus();
								}else if(moneyBox.textbox("getValue")>21474836.47){
									moneyBox.textbox("textbox").focus();
								}
								else{
									var cbm = Math.round(Number(50)*100); 
									var money = cbm/100 + "";
									moneyBox.textbox("setValue",money);
								}
							}
						},{
							eName:"linkbutton",
							uId:"tm1",
							cssClass:'provide_addSubsidy_moneybut',
							width:50,
							height:25,
							text : '100',
							onClick : function(){
								if(isNaN(moneyBox.textbox("getValue"))){
									moneyBox.textbox("textbox").focus();
								}else if(moneyBox.textbox("getValue")>21474836.47){
									moneyBox.textbox("textbox").focus();
								}
								else{
									var cbm = Math.round(Number(100)*100); 
									var money = cbm/100 + "";
									moneyBox.textbox("setValue",money);
								}
							}
						}]
					},{
						eName:'div',
						cssStyle:"margin-top:5px;",
						elements:[{
							eName:"linkbutton",
							uId:"tm1",
							cssClass:'provide_addSubsidy_moneybut',
							width:50,
							height:25,
							text : '200',
							onClick : function(){
								if(isNaN(moneyBox.textbox("getValue"))){
									moneyBox.textbox("textbox").focus();
								}else if(moneyBox.textbox("getValue")>21474836.47){
									moneyBox.textbox("textbox").focus();
								}
								else{
									var cbm = Math.round(Number(200)*100); 
									var money = cbm/100 + "";
									moneyBox.textbox("setValue",money);
								}
							}
						},{
							eName:"linkbutton",
							uId:"tm1",
							cssClass:'provide_addSubsidy_moneybut',
							width:50,
							height:25,
							text : '500',
							onClick : function(){
								if(isNaN(moneyBox.textbox("getValue"))){
									moneyBox.textbox("textbox").focus();
								}else if(moneyBox.textbox("getValue")>21474836.47){
									moneyBox.textbox("textbox").focus();
								}
								else{
									var cbm = Math.round(Number(500)*100); 
									var money = cbm/100 + "";
									moneyBox.textbox("setValue",money);
								}
							}
						}]
					}]
					/*elements:[{
						eName:'div',
						elements:[{
							eName:"linkbutton",
							uId:"tm1",
							cssClass:'provide_addSubsidy_moneybut',
							width:50,
							height:25,
							text : '+50',
							onClick : function(){
								if(isNaN(moneyBox.textbox("getValue"))){
									moneyBox.textbox("textbox").focus();
								}else if(moneyBox.textbox("getValue")>21474836.47){
									moneyBox.textbox("textbox").focus();
								}
								else{
									var cbm = Math.round(Number(moneyBox.textbox("getValue"))*100); 
									var nv = Math.round(Number(50)*100); 
									var v = cbm + nv;
									var money = v/100 + "";
									moneyBox.textbox("setValue",money);
								}
							}
						},{
							eName:"linkbutton",
							uId:"tm1",
							cssClass:'provide_addSubsidy_moneybut',
							width:50,
							height:25,
							text : '-50',
							onClick : function(){
								if(isNaN(moneyBox.textbox("getValue"))){
									moneyBox.textbox("textbox").focus();
								}else if(moneyBox.textbox("getValue")>21474836.47){
									moneyBox.textbox("textbox").focus();
								}
								else{
									var cbm = Math.round(Number(moneyBox.textbox("getValue"))*100); 
									var nv = Math.round(Number(50)*100); 
									var v = cbm - nv;
									var money = v/100 + "";
									moneyBox.textbox("setValue",money);
								}
							}
						}]
					},{
						eName:'div',
						cssStyle:"margin-top:5px;",
						elements:[{
							eName:"linkbutton",
							uId:"tm1",
							cssClass:'provide_addSubsidy_moneybut',
							width:50,
							height:25,
							text : '+100',
							onClick : function(){
								if(isNaN(moneyBox.textbox("getValue"))){
									moneyBox.textbox("textbox").focus();
								}else if(moneyBox.textbox("getValue")>21474836.47){
									moneyBox.textbox("textbox").focus();
								}
								else{
									var cbm = Math.round(Number(moneyBox.textbox("getValue"))*100); 
									var nv = Math.round(Number(100)*100); 
									var v = cbm + nv;
									var money = v/100 + "";
									moneyBox.textbox("setValue",money);
								}
							}
						},{
							eName:"linkbutton",
							uId:"tm1",
							cssClass:'provide_addSubsidy_moneybut',
							width:50,
							height:25,
							text : '-100',
							onClick : function(){
								if(isNaN(moneyBox.textbox("getValue"))){
									moneyBox.textbox("textbox").focus();
								}else if(moneyBox.textbox("getValue")>21474836.47){
									moneyBox.textbox("textbox").focus();
								}
								else{
									var cbm = Math.round(Number(moneyBox.textbox("getValue"))*100); 
									var nv = Math.round(Number(100)*100); 
									var v = cbm - nv;
									var money = v/100 + "";
									moneyBox.textbox("setValue",money);
								}
							}
						}]
					}]*/
				},{
					eName:"div",
					cssClass:'provide_addSubsidy_moneytext',
					elements:[{
						eName:"span",
						id:"provide_aftermoney",
						elements:"0.00"
					},{
						eName:"span",
						elements:"元/人"
					}]
					
				}]
			}]
		},{
			eName:"fieldset",
			width:670,
			height:400,
			elements:[{
				eName:'legend',
				text:'指定名单'
			},{
				eName:"div",
				elements:[{
					eName:"div",
					elements:[{
						eName:'div',
						cssClass:'provide_addSubsidy_dfloat',
						elements:[{
			        	  eName:'span',
			        	  text : '身份类型',
			        	  cssStyle:"margin-right:5px;font-size:14px;"
			          },{
			        	  eName : 'combogrid',
			        	  id:"ideList",
			        	  idField:"ident_id",
			        	  valueField: 'ident_id',    
					      textField: 'ident_name',
			        	  panelHeight:$.browser.msie9?200:'auto',
			        	  panelMaxHeight:200,
						  width : 160,
						  height : 25,
			        	  editable:false,
			        	  multiple:true,
			        	  singleSelect: false,
			        	  selectOnCheck:true,
			        	  allFlag:true,
						  columns:[[
							{field:'ident_id',checkbox:true},
							{field:'ident_name',title:'全部'}
						  ]],
						  onChange:ideChange
			        	  
			          }]
				},{
					eName:'div',
					cssClass:'provide_addSubsidy_dfloat',
					elements:[{
				        	  eName:'span',
				        	  cssClass:'provide_addSubsidy_result_text',
				        	  cssStyle:"margin-left:120px;",
				        	  text : '成功添加'
				          },{
				        	  eName:'span',
				        	  id:"people_count1",
				        	  cssClass:'provide_addSubsidy_result',
				        	  text : '0'
				          },{
				        	  eName:'span',
				        	  cssClass:'provide_addSubsidy_result_text',
				        	  text : '人，失败'
				          },{
				        	  eName:'span',
				        	  id:"people_count2",
				        	  cssClass:'provide_addSubsidy_result',
				        	  text : '0' //458BCD
				          },{
				        	  eName:'span',
				        	  cssClass:'provide_addSubsidy_result_text',
				        	  text : '人'
				          }]
					}]
						
				},{
					eName:"div",
					cssStyle:"margin-top:10px;",
					elements:[{
						eName:"layoutEx",
						cssClass:'provide_addSubsidy_dfloat dep_tree',
						cssStyle:"height:325px;width:265px;",
						fit : true,
						elements : [{
							region : 'north',
							height:40,
							elements : northUI
						},
						{
							region : 'center',
							elements : centerUI
						}]
					},
					{
						eName:'div', //中间按钮
						cssClass:'provide_addSubsidy_dfloat provide_addSubsidy_userselbutd',
						elements:[{
							eName:'div',
							elements:[{
								eName:"linkbutton",
								uId:"tm1",
								cssClass:'provide_addSubsidy_userselbut',
								width:65,
								height:30,
								text : '添加',
								onClick : addEmp
							}]
						},{eName:'div',
							elements:[{
								eName:"linkbutton",
								uId:"tm1",
								cssClass:'provide_addSubsidy_userselbut',
								width:65,
								height:30,
								text : '删除',
								onClick : deleteEmp
							}]
						},{eName:'div',
								elements:[{
									eName:"linkbutton",
									uId:"tm1",
									cssClass:'provide_addSubsidy_userselbut',
									width:65,
									height:30,
									text : '清空',
									onClick : removeAllEmp
								}
						]}]
					},{
						eName : 'div',
						height:300,
						width:320,
						cssClass:'provide_addSubsidy_dfloat',
						cssStyle:"margin-bottom:28px;",
						elements : {
							eName : 'datagrid',
							id:"addList",
							idField : 'account_id',
							columns : columns,
							pagination: true,
							clientPager:true,
							alertFlag : false,// 是否弹出默认对话框
							fit:true,
							autoload : false,
							singleSelect: false,
							checkOnSelect:true,
							selectOnCheck:true,
							onLoadSuccessEx:function(){
								if(addEmpData.length>0){
									people_count1.html(addEmpData.length);
									if(addFlag == 1){
										people_count2.html(left_rows-addEmpData.length);
										addFlag = 0;
									}
									
									footer_count.html(addEmpData.length);
									var am = Math.round(Number(provide_aftermoney.html())*100); 
									var v = am * addEmpData.length;
									var val = v/100 + "";
									if(val.indexOf(".") == -1){//输入时不含小数点（0.00==0）
										footer_money.html(val+".00");
									}
									else if(val.length - val.indexOf(".") - 1 == 1){//小数点后面有一位数（0.10==0.1）
										footer_money.html(val+"0");
									}
									else{//小数点后面有两位数
										footer_money.html(val);
									}
								}
								else if(addEmpData.length==0){
									people_count1.html(addEmpData.length);
									people_count2.html(addEmpData.length);
									footer_count.html(addEmpData.length);
									footer_money.html("0.00");
								}
							}
						}
						
					},{
						eName:"div",
						cssClass:"provide_datagrid_footer",
						width:320,
						elements:[{
							eName:"span",
							text:"合计：共"
						},{
							eName:"span",
							cssClass:"footer_span font",
							id:"footer_count",
							text:"0"
						},{
							eName:"span",
							cssClass:"footer_span",
							text:"人"
						},{
							eName:"span",
							cssStyle:"margin-left:10px",
							text:"总金额"
						},{
							eName:"span",
							id:"footer_money",
							cssClass:"footer_span font",
							text:"0.00"
						},{
							eName:"span",
							cssClass:"footer_span",
							text:"元"
						}]
					}]
				}]
		}]
	},{
		eName:"div",
		cssClass:'provide_addSubsidy_button',
		elements:[{
			eName:"linkbutton",
			uId:"tm2",
			text : '确定',
			cssClass : 'provide_linkbutton',
			width : 80,
			height : 35,
			onClick:confirm
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
	}]};
	jqObj.loadUI(addSubsidyUI);
	
	var ideList = jqObj.findJq("ideList");
	var dep_list = jqObj.findJq("dep_list");
	var emp_list = jqObj.findJq("emp_list");
	var provideDepTree = jqObj.findJq("provideDepTree");
	var dep_serial = jqObj.findJq("dep_serial");
	var provideEmpList = jqObj.findJq("provideEmpList");
	var moneyBox = jqObj.findJq("moneyBox");
	var provide_aftermoney = jqObj.findJq("provide_aftermoney");
	var depTreeDiv = jqObj.findJq("depTreeDiv");
	var empListDiv = jqObj.findJq("empListDiv");
	var addList = jqObj.findJq("addList");
	var footer_count = jqObj.findJq("footer_count");
	var footer_money = jqObj.findJq("footer_money");
	var if_fu = jqObj.findJq("if_fu");
	var people_count1 = jqObj.findJq("people_count1");
	var people_count2 = jqObj.findJq("people_count2");
	var searchParam = jqObj.findJq("searchParam");
	var minus_div = jqObj.findJq("minus_div");
	
	loadInit();
	
	function loadInit(){
		$.postEx(readSubsidyXml,function(minus){
			if(minus==1){
				minus_div.show();
			}else if(minus==2){
				minus_div.hide();
			}
		});
	}
	
	//分页提示信息修改
	var pager = provideEmpList.datagrid("getPager"); 
    pager.pagination({ 
    	showPageList:false,
    	//beforePageText:'',//页数文本框前显示的汉字 
        //afterPageText:'', 
        displayMsg:''
    });
    //dataTableWest.datagrid("resize");
    
  //分页提示信息修改
	var pager = addList.datagrid("getPager"); 
    pager.pagination({ 
    	showPageList:false,
    	//beforePageText:'',//页数文本框前显示的汉字 
        //afterPageText:'', 
        displayMsg:''
    });
    addList.datagrid("resize");
	
	//加载身份列表
	loadIdeList();
	//员工列表本地分页,样式格式化
	//empListPage();
	//右侧列表本地分页,样式格式化
	//addEmpPage([]);
	
	function loadIdeList(){
		$.postEx(ideQuery,function(retJson){
			if(retJson.result && retJson.data){
				var ideGrid = ideList.combogrid("grid");
				ideGrid.datagrid("loadDataEx",retJson.data);
			}
		});
	}
	
	//加载部门树
//	loadDepTree();
//	function loadDepTree(){
//		$.postEx(depQuery,function(retJson){
//			if(retJson.result && retJson.data){
//				provideDepTree.tree('loadData',
//						$.list2Tree(retJson.data,"dep_serial","dep_parent","dep_name"));
//			}
//		});
//	}
	
	//加载员工列表
	//loadEmpList();
	function loadEmpList(param){
		$.progress('正在加载员工列表...');
		var params = {};
		var par = [];
		var treeList = dep_serial.tree("getChecked");
		//$.print(treeList);
		$.each(treeList,function(i, tree){
			//$.print(tree.dep_serial);
			par.push(tree.dep_serial);
		});
		//if(par.join()!="" && ideList.combo("getValues").join()!=""){
		params['dep_serial'] = par.join();
		params['user_duty'] = ideList.combo("getValues").join();
		//}
		
		$.postEx(provideEmpQuery,params,function(retJson){
			if(retJson.result && retJson.data){
				if(param){
					var data = [];
					$.each(retJson.data,function(i, row){
						if(row.user_no == param){
							data.push(row);
						}
						else if(row.user_lname.indexOf(param)!=-1){
							data.push(row);
						}
					});
					rData = data;
					provideEmpList.datagrid("loadDataEx",data);
				}else{
					rData = retJson.data;
					provideEmpList.datagrid("loadDataEx",retJson.data);
				}
				//员工列表本地分页
				//empListPage();
			}else{
				provideEmpList.datagrid("loadDataEx",{id:0,total:0,rows:[]});
			}
			$.progress("close");
		});
	}
	
	//员工列表本地分页
//	function empListPage(){
//		var pager = provideEmpList.datagrid("getPager"); 
//	    pager.pagination({ 
//	    	total:rData.length,
//	    	showPageList:false,
//	    	beforePageText:'',//页数文本框前显示的汉字 
//	        //afterPageText:'', 
//	        displayMsg:'', 
//	        onSelectPage:function (pageNo, pageSize) { 
//	        	var start = (pageNo - 1) * pageSize; 
//	        	var end = start + pageSize; 
//	        	//provideEmpList.datagrid("loadData", rData.slice(start, end)); 
//	        	//加载数据
//	        	provideEmpList.datagrid("loadDataEx", {id:0,rows:rData.slice(start, end),
//	        		total:rData.length,pageNumber:pageNo}); 
//	        } 
//	    }); 
//	    provideEmpList.datagrid("resize");
//	}
	
	function clickFu(){
		var money=/^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
		if(moneyBox.textbox("getValue")!="" && money.test(moneyBox.textbox("getValue"))){
			if(if_fu.prop("checked")){
				if(moneyBox.textbox("getValue") == "0.00"){
					provide_aftermoney.html(moneyBox.textbox("getValue"));
				}else{
					provide_aftermoney.html("-"+moneyBox.textbox("getValue"));
				}
			}else{
				provide_aftermoney.html(moneyBox.textbox("getValue"));
			}
			var am = Math.round(Number(provide_aftermoney.html())*100); 
			var v = am * Number(footer_count.html());
			var val = v/100 + "";
			if(val.indexOf(".") == -1){//输入时不含小数点（0.00==0）
				footer_money.html(val+".00");
			}
			else if(val.length - val.indexOf(".") - 1 == 1){//小数点后面有一位数（0.10==0.1）
				footer_money.html(val+"0");
			}
			else{//小数点后面有两位数
				footer_money.html(val);
			}
		}
	}
	
	//输入金额
	function moneyInput(newValue, oldValue){
		var money=/^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
		if(money.test(newValue)){//金额验证
			//负补贴
			if(if_fu.prop("checked")){
				if(newValue>21474836.47){
					provide_aftermoney.html("");//清空充值后余额
				}else{
					//金额输入框
					if(newValue.indexOf(".")==-1){
						moneyBox.textbox("setValue",newValue+".00");
						if(moneyBox.textbox("getValue") == "0.00"){
							provide_aftermoney.html(moneyBox.textbox("getValue"));
						}else{
							provide_aftermoney.html("-"+moneyBox.textbox("getValue"));
						}
						var am = Math.round(Number(provide_aftermoney.html())*100); 
						var v = am * Number(footer_count.html());
						var val = v/100 + "";
						if(val.indexOf(".") == -1){//输入时不含小数点（0.00==0）
							footer_money.html(val+".00");
						}
						else if(val.length - val.indexOf(".") - 1 == 1){//小数点后面有一位数（0.10==0.1）
							footer_money.html(val+"0");
						}
						else{//小数点后面有两位数
							footer_money.html(val);
						}
					}
					else if(newValue.length - newValue.indexOf(".") - 1 == 1){
						moneyBox.textbox("setValue",newValue+"0");
						if(moneyBox.textbox("getValue") == "0.00"){
							provide_aftermoney.html(moneyBox.textbox("getValue"));
						}else{
							provide_aftermoney.html("-"+moneyBox.textbox("getValue"));
						}
						var am = Math.round(Number(provide_aftermoney.html())*100); 
						var v = am * Number(footer_count.html());
						var val = v/100 + "";
						if(val.indexOf(".") == -1){//输入时不含小数点（0.00==0）
							footer_money.html(val+".00");
						}
						else if(val.length - val.indexOf(".") - 1 == 1){//小数点后面有一位数（0.10==0.1）
							footer_money.html(val+"0");
						}
						else{//小数点后面有两位数
							footer_money.html(val);
						}
					}
					else{
						moneyBox.textbox("setValue",newValue);
						if(moneyBox.textbox("getValue") == "0.00"){
							provide_aftermoney.html(moneyBox.textbox("getValue"));
						}else{
							provide_aftermoney.html("-"+moneyBox.textbox("getValue"));
						}
						var am = Math.round(Number(provide_aftermoney.html())*100); 
						var v = am * Number(footer_count.html());
						var val = v/100 + "";
						if(val.indexOf(".") == -1){//输入时不含小数点（0.00==0）
							footer_money.html(val+".00");
						}
						else if(val.length - val.indexOf(".") - 1 == 1){//小数点后面有一位数（0.10==0.1）
							footer_money.html(val+"0");
						}
						else{//小数点后面有两位数
							footer_money.html(val);
						}
					}
				}
			}else{
				if(newValue>21474836.47){
					provide_aftermoney.html("");//清空充值后余额
				}else{
					//金额输入框
					if(newValue.indexOf(".")==-1){
						moneyBox.textbox("setValue",newValue+".00");
						provide_aftermoney.html(moneyBox.textbox("getValue"));
						var am = Math.round(Number(provide_aftermoney.html())*100); 
						var v = am * Number(footer_count.html());
						var val = v/100 + "";
						if(val.indexOf(".") == -1){//输入时不含小数点（0.00==0）
							footer_money.html(val+".00");
						}
						else if(val.length - val.indexOf(".") - 1 == 1){//小数点后面有一位数（0.10==0.1）
							footer_money.html(val+"0");
						}
						else{//小数点后面有两位数
							footer_money.html(val);
						}
					}
					else if(newValue.length - newValue.indexOf(".") - 1 == 1){
						moneyBox.textbox("setValue",newValue+"0");
						provide_aftermoney.html(moneyBox.textbox("getValue"));
						var am = Math.round(Number(provide_aftermoney.html())*100); 
						var v = am * Number(footer_count.html());
						var val = v/100 + "";
						if(val.indexOf(".") == -1){//输入时不含小数点（0.00==0）
							footer_money.html(val+".00");
						}
						else if(val.length - val.indexOf(".") - 1 == 1){//小数点后面有一位数（0.10==0.1）
							footer_money.html(val+"0");
						}
						else{//小数点后面有两位数
							footer_money.html(val);
						}
					}
					else{
						moneyBox.textbox("setValue",newValue);
						provide_aftermoney.html(moneyBox.textbox("getValue"));
						var am = Math.round(Number(provide_aftermoney.html())*100); 
						var v = am * Number(footer_count.html());
						var val = v/100 + "";
						if(val.indexOf(".") == -1){//输入时不含小数点（0.00==0）
							footer_money.html(val+".00");
						}
						else if(val.length - val.indexOf(".") - 1 == 1){//小数点后面有一位数（0.10==0.1）
							footer_money.html(val+"0");
						}
						else{//小数点后面有两位数
							footer_money.html(val);
						}
					}
				}
			}
			
		}
		else{
			if(moneyBox.textbox("getValue")==""){
				provide_aftermoney.html("0.00");
			}else{
				provide_aftermoney.html("");
			}
		}
	}
	
	//切换部门列表和人员列表
	function select(){
		if($(this).attr("class")=="dep_list" && $(this).findUI().select==0){
			//标识
			$(this).findUI().select=1;//已选中
			emp_list.findUI().select=0;//未选中
			//样式
			$(this).css({"background":"#2274B9","color":"#ffffff"});
			emp_list.css({"background":"#ffffff","color":"#000000"});
			depTreeDiv.css("display","");
			empListDiv.css("display","none");
			//数据
			//loadDepTree();
		}
		if($(this).attr("class")=="emp_list" && $(this).findUI().select==0){
			//标识
			$(this).findUI().select=1;
			dep_list.findUI().select=0;
			//样式
			$(this).css({"background":"#2274B9","color":"#ffffff"});
			dep_list.css({"background":"#ffffff","color":"#000000"});
			empListDiv.css("display","");
			depTreeDiv.css("display","none");
			//数据
			provideEmpList.datagrid("resize");
			//loadEmpList();
		}
	}
	
	
//	//搜索模糊查询
//	function search(value,name){
//		var nodes = dep_serial.tree("getChildren");
//		$.each(nodes,function(i, node){
//			if(node.dep_name.indexOf(value)!=-1){
//				//var check = provideDepTree.tree("getChecked");
//				//provideDepTree.tree("uncheck",check.target);
//				dep_serial.tree("check",node.target);
//			}
//		});
//		//provideDepTree.tree("doFilter",value);
//	}
	
	//身份选择时改变员工列表
	function ideChange(newValue,oldValue){
		//if(emp_list.findUI().select==1){
		loadEmpList(searchParam.textbox("getValue"));
		//}
	}
	
	//添加到右侧datagrid
	function addEmp(){
		addFlag = 1;
		if(emp_list.findUI().select==1){//员工列表展开
			var data = provideEmpList.datagrid("getCheckedEx");
			if(data.length<1){
				$.alert("请先选择一条记录！");
			}else{
				left_rows = data.length;
				addEmpData = data;
				addList.datagrid("loadDataEx",data);
				//addEmpPage(data);
			}
		}
		if(dep_list.findUI().select==1){//部门列表展开
			//loadEmpList();//异步加载数据，所以第一次没有返回值，需要修改
//			var data = provideEmpList.datagrid("getRows");
//			var data = rData;
//			if(data.length<1){
//				$.alert("请先选择一条记录！");
//			}else{
//				left_rows = data.length;
//				addList.datagrid("loadData",data);
//			}
			if(rData.length<1){
				$.alert("员工列表为空！");
			}else{
				left_rows = rData.length;
				//addEmpData = rData.concat();
				addEmpData = rData.slice(0);//复制数组
				//addEmpData = rData;
				addList.datagrid("loadDataEx",addEmpData);
				//addEmpPage(rData);
			}
		}
	}
	
	//右侧列表本地分页
//	function addEmpPage(data){
//		var pager = addList.datagrid("getPager"); 
//	    pager.pagination({ 
//	    	total:data.length,
//	    	showPageList:false,
//	    	beforePageText:'',//页数文本框前显示的汉字 
//	        //afterPageText:'', 
//	        displayMsg:'', 
//	        onSelectPage:function (pageNo, pageSize) { 
//	        	var start = (pageNo - 1) * pageSize; 
//	        	var end = start + pageSize; 
//	        	var pagerOpts = pager.pagination('options');
//	        	//加载数据
//	        	addList.datagrid("loadDataEx", {id:0,rows:data.slice(start, end),
//	        		total:data.length,pageNumber:pageNo}); 
//	        } 
//	    }); 
//	    addList.datagrid("resize");
//	}
	
	//删除员工
	function deleteEmp(){
		
		var rows = addList.datagrid("getCheckedEx");
		if(rows.length<1){
			$.alert("请选择人员！");
		}
		else{
//			for(var i=rows.length-1; i>=0; i--){
//				var index = addList.datagrid("getRowIndex",rows[i]);
//				//dataTable.datagrid('uncheckRow',index);
//				addList.datagrid("deleteRow",index);
//				addList.datagrid('updateOrderNum',index);//更新序号
//			}
//			addList.datagrid('clearChecked');
			addList.datagrid("deleteRowEx",rows);
			addList.datagrid("reload");
			
//			for(var i=rows.length-1; i>=0; i--){
//				var index = addList.datagrid("getRowIndex",rows[i]);
//				//addList.datagrid("deleteRow",index);
//				addEmpData.splice(index,1);
//			}
//			delFlag = 1;
//			addList.datagrid("loadDataEx",addEmpData.slice(0,30));
			//addEmpPage(addEmpData);
			var state = $.data(addList[0], 'datagrid');
			var localdata = state.localdata || {};
			addEmpData = localdata.rows || [];
			//addEmpData = addList.datagrid("getRows");
			//addList.datagrid("loadDataEx",addEmpData);
			var count = addEmpData.length;
			var money = provide_aftermoney.html();
			people_count1.html(count);
			footer_count.html(count);
			
			var am = Math.round(Number(money)*100); 
			var v = am * Number(count);
			var val = v/100 + "";
			if(val.indexOf(".") == -1){//输入时不含小数点（0.00==0）
				footer_money.html(val+".00");
			}
			else if(val.length - val.indexOf(".") - 1 == 1){//小数点后面有一位数（0.10==0.1）
				footer_money.html(val+"0");
			}
			else{//小数点后面有两位数
				footer_money.html(val);
			}
		}
	}
	
	//清空员工
	function removeAllEmp(){
//		addList.datagrid("selectAll");
//		var rows = addList.datagrid("getSelections");
//		for(var i=rows.length-1; i>=0; i--){
//			var index = addList.datagrid("getRowIndex",rows[i]);
//			addList.datagrid("deleteRow",index);
//		}
		addList.datagrid("loadDataEx",{id:0,total:0,rows:[]});
		addEmpData = [];
		people_count1.html("0");
		people_count2.html("0");
		footer_count.html("0");
		footer_money.html("0.00");
	}
	
	//确定按钮
	function confirm(){
		var money=/^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
//		if(moneyBox.textbox("getValue")<0 && !if_fu.prop("checked")){
//			$.alert("若要录入负补贴，请勾选‘录入负补贴’选项！");
//		}
//		else if(moneyBox.textbox("getValue")>0 && if_fu.prop("checked")){
//			$.alert("若要录入正补贴，请取消勾选‘录入负补贴’选项！");
//		}
		if(moneyBox.textbox("getValue")==""){
			$.alert("请输入补贴金额！");
		}
		else if(moneyBox.textbox("getValue")=="0.00"){
			$.alert("补贴金额不能为0！");
		}
		else if(!money.test(moneyBox.textbox("getValue")) || moneyBox.textbox("getValue")>21474836.47){
			moneyBox.textbox("textbox").focus();
		}
		else if(addList.datagrid("getRows").length==0){
			$.alert("请添加人员！");
		}
		else{
			$.progress('正在录入...');
			var ids = [];
			var params = {};
//			var rows = addList.datagrid("getRows");
//			$.each(rows,function(i, row){
//				ids.push(row.account_id);
//			});
			
			$.each(addEmpData,function(i, row){
				ids.push(row.account_id);
			});
			
			
			if(ids.length>300){
				batch(1,ids);//分批
			}else{
				params['account_id'] = ids.join();
				if(if_fu.prop("checked")){
					params['sub_amt'] = "-" + moneyBox.textbox("getValue");
				}else{
					params['sub_amt'] = moneyBox.textbox("getValue");
				}
				
				$.postEx(subsidyAdd,params,function(retJson){
					if(retJson.result && retJson.data){
						//provideEmpList.datagrid("loadData",retJson.data);
						loadParams.callback();
						$.progress("close");
						jqObj.window("close");
					}else{
						$.progress("close");
						$.alert(retJson.info);
					}
				});
			}
			
//			params['account_id'] = ids.join();
//			params['sub_amt'] = moneyBox.textbox("getValue");
//			$.postEx(subsidyAdd,params,function(retJson){
//				if(retJson.result && retJson.data){
//					//provideEmpList.datagrid("loadData",retJson.data);
//					loadParams.callback();
//					$.progress("close");
//					jqObj.window("close");
//				}else{
//					$.alert(retJson.info);
//				}
//			});
		}
	}
	
	function batch(pageNum,ids){
		var pageSize = 300;
		var offset = (pageNum-1)*pageSize;//偏移量
		if(offset+pageSize>ids.length){
			offset = ids.length-pageSize;
		}
		var params = {};
		params['account_id'] = 
			ids.slice((pageNum-1)*pageSize,offset+pageSize).join();
		if(if_fu.prop("checked")){
			params['sub_amt'] = "-" + moneyBox.textbox("getValue");
		}else{
			params['sub_amt'] = moneyBox.textbox("getValue");
		}
		
		$.postEx(subsidyAdd,params,function(retJson){
			if(retJson.result && retJson.data){
				if(offset == ids.length-pageSize){
					$.progress("close");
					loadParams.callback();
					jqObj.window("close");
				}else{
					batch(++pageNum,ids);
				}
			}else{
				$.progress("close");
				$.alert(retJson.info);
			}
		});
	}
	
	//文本长度限制
	moneyBox.next().children().eq(0).attr("maxlength",8);
	
	//扩展验证
	$.extend($.fn.validatebox.defaults.rules, {
		money: {// 金额验证
            validator: function (value) {
                //return /^[+]?[1-9]+\d*$/i.test(value);
                return /^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/i.test(value);
            },
            message: '请输入正确金额'
        },
        moneyMax :{// 最大值验证
       	 validator: function (value) {
                return (value<=21474836.47);
            },
            message: '请输入正确金额'
        },
        number: {// 半角字符验证
            validator: function (value) {
                return /^([+]?[A-Za-z0-9_-])+\d*$/i.test(value);
            },
            message: '只能输入数字、字母、下划线、短横线'
        },
        unnormal: {// 验证是否包含空格和非法字符
            validator: function (value) {
                return !/[ '"@#\$%\^&\*！!<>\\\/]+/i.test(value);
            },
            message: '输入值不能为空和包含其他非法字符'
        },
        idCard:{//身份证号验证
        	validator: function(value){
        		//return /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/i.test(value);
        		return /(\d|X|x)$/i.test(value);
        	},
        	message: '请输入正确的身份证号'
        }
	});  
	
});