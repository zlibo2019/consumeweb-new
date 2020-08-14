//开户设置提示窗
garen_define("js/account/openAccount_configWin",function (jqObj,loadParams) {
	
	var base = garen_require("js/base/ws_public");
	
	var pswRuleQuery = base.pswRuleQuery;//密码规则查询
	
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
	  		width : 95
	  	}] 
	];
	
	var westUI = {
		eName:"datagrid",
		id:"dataTable",
		idField : 'id',
		columns : columns,
		showFooter:false,
		alertFlag : false,// 是否弹出默认对话框
		autoload : false,
		singleSelect:true,
		pagination: true,
		clientPager:true
	};
		
	var eastUI = {
		eName:"div",
		height:315,
		cssStyle:"background:#f4f4f4;",
		elements:{
			eName:"formUI",
			id:"configForm",
			method:"post",//上传表单时，必须设置此值
			alertFlag:false,
			onBeforeSave:function(params){
	            var ids = [];//主键数组
	            $.each(loadParams.param, function (i, row) {
	                ids.push(row.id);
	            });
  				params['ids'] = ids.join(',');//主键参数
				
			},
			onSave:function(retJson){
				if(retJson.result){
					
				}else{
					$.alert(retJson.info);
				}
			},
			elements:[{
				eName : 'div',
				cssClass:"openAccount_configWin_eastdiv_1",
				elements : [{
					eName : 'span',
					text : '初始密码规则',
					cssClass:"east_div_span"
				},{
					eName : 'combobox',
					name : "scheme_id",
					id : 'pswRuleList',
					panelHeight:$.browser.msie9?200:'auto',
					panelMaxHeight:200,
					valueField: 'scheme_id',
			        textField: 'scheme_name',
					width : 150,
					height : 25,
					editable:false,
					onChange:function(newValue,oldValue){
						if(newValue==1 || newValue==2){
							pwdDiv.html("注：后6位存在非数字或不足6位时，初始密码为6个0");
						}else{
							pwdDiv.html("");
						}
					}
					//value:'2'//默认值
				}]
			},{
				eName : 'div',
				id:"pwdDiv",
				cssClass:"openAccount_configWin_eastdiv_1_2",
				elements:""
			},{
				eName : 'div',
				cssClass:"openAccount_configWin_eastdiv_2",
				elements : [{
					eName : 'span',
					elements : '预存金额&emsp;&emsp;',
					cssClass:"east_div_span"
				},{
					eName : 'textbox',
					name:"account_init_amt",
					id : 'account_init_amt',
					width : 150,
					height : 25,
					prompt:'0',
					value:'',//默认值
					validType:["money","moneyMax"],
					onChange : function(newValue, oldValue){
						//var val = $(this).textbox("getValue")+".00";
						//$.print(val);
						//$(this).textbox("setValue",val);
						//$(this).textbox("setText",val);
						var money=/^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
						if(money.test(newValue) && newValue<=21474836.47){//金额验证
							if(newValue.indexOf(".")==-1 && newValue.length>0){
								$(this).textbox("setValue",newValue+".00");
								//charge_aftermoney.html(newValue+".00");
							}else if(newValue.length-newValue.indexOf(".")-1==1){
								$(this).textbox("setValue",newValue+"0");
								//charge_aftermoney.html(newValue+"0");
							}else{
								$(this).textbox("setValue",newValue);
								//charge_aftermoney.html(newValue);
							}
						}
					}
				}]
			},{
				eName:"div",
				cssClass:"openAccount_configWin_eastdiv_2",
				elements:[{
					eName : 'span',
					elements : '有效日期&emsp;&emsp;',
					cssClass:"east_div_span"
				},{
					eName : 'datebox',
					editable:false,
					name : 'account_end_date',
					width : 150,
					height : 25	
					//formatter:validDateFormatter,
					//parser:validDateParser
					//value:'',//默认值
				}]
			},{
				eName:"div",
				cssClass:"openAccount_configWin_eastdiv_2",
				elements:[{
					eName : 'input',
					cssClass:"openAccount_checkbox",
					name : "finger_enable",
					id:"fingerBox",
					type : 'checkbox',
				},{
					eName : 'span',
					cssClass:"east_div_span",
					text : '启用指纹消费'
				}]
			}]
		}
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
				var p = {};
				var myform = jqObj.findJq("configForm");
				var arr = validDate.datebox("getValue").split("-");
				var starttime = new Date(arr[0], arr[1]-1, arr[2], '23', '59', '59');
				var starttimes = starttime.getTime();
				if(starttimes < new Date().getTime()){
					$.alert("有效日期不能小于当前日期！");
				}
				else if(myform.form('form2Json',p)){
					if(fingerBox[0].checked){
						fingerBox[0].value = 1;
					}
//					configForm.submit();
					var myWin = $.createWin({
						title:"操作提示",
						width:600,
						height:100,
						queryParams:{
							params:loadParams.params,
							configs:configForm.form2Json(),
//							callback:function(){
//								loadParams.callback();
//								jqObj.window("close");
//							},
//							provideC:function(ids){
//								loadParams.provideC(ids);
//								jqObj.window("close");
//							}
							loadP:loadParams,
						},
						url:"js/account/openAccount_progressBarWin.js"
					});
					jqObj.window("close");
				}
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
		},{
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
	var pswRuleList = jqObj.findJq("pswRuleList");
	var configForm = jqObj.findJqUI("configForm");
	var fingerBox = jqObj.findJq("fingerBox");
	var pwdDiv = jqObj.findJq("pwdDiv");
	
	//分页提示信息修改
	var pager = dataTable.datagrid("getPager"); 
    pager.pagination({ 
    	showPageList:false,
    	//beforePageText:'',//页数文本框前显示的汉字 
        //afterPageText:'', 
        displayMsg:''
    });
	
	//关闭
	jqObj.updateOpt("panel",{
		onBeforeClose:function(){
			//loadParams.callback();
			return true;//true 关闭 false不关闭
		}
	});
	
	//日期框默认20年以后
	var validDate = jqObj.findJq("datebox");
	var date = new Date();
	var y = date.getFullYear()+20;
	var m = date.getMonth() + 1;
	var d = date.getDate();
	validDate.datebox("setValue",y + '-' + (m<10?('0'+m):m) + '-' + (d<10?('0'+d):d));
	
	loadInit();
	loadPswRuleList();	//加载初始密码规则列表
	
	function loadInit(){
		dataTable.datagrid("loadDataEx",loadParams.params);
	}
	
	
	function loadPswRuleList(){
		$.postEx(pswRuleQuery,function(retJson){
			//$.print(retJson);
			if(retJson.result && retJson.data){
				pswRuleList.combobox("loadDataEx",retJson.data);
				pswRuleList.combobox("setValue","2");
			}
		});
	}
	

});