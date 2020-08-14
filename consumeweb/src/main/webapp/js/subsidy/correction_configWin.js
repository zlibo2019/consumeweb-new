//补贴发放纠错
garen_define("js/subsidy/correction_configWin",function (jqObj,loadParams) {
	
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
		idField : 'sub_slave_id',
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
			elements:{
				eName:"div",
				elements:[{
					eName:"div",
					height:10
				},{
					eName:"div",
					cssClass:"correction_addCorr_firstDiv",
					elements:{
						eName:"span",
						elements:"<b style='font-size:13px;'>有效期纠错</b>"
					}
				},{
					eName:"div",
					cssClass:"correction_addCorr_secondDiv",
					elements:[{
						eName:"div",
						elements:[{
							eName:"input",
							cssClass:"correction_addCorr_checkbox",
							id:"begin_check",
							type:"checkbox",
							onClick:begin_able
						},{
							eName:"span",
							elements:"启用日期"
						},{
							eName:"datespinnerEx",
							width:60,
							dateType:['Y','M','D'],
							name:"begin_date"
						}]
						
					},{
						eName:"div",
						elements:[{
							eName:"input",
							cssClass:"correction_addCorr_checkbox",
							id:"end_check",
							type:"checkbox",
							onClick:end_able
						},{
							eName:"span",
							elements:"有效日期"
						},{
							eName:"datespinnerEx",
							width:60,
							dateType:['Y','M','D'],
							name:"end_date"
						}]
					}]
				},{
					eName:"div",
					cssClass:"correction_addCorr_firstDiv",
					elements:{
						eName:"span",
						elements:"<b style='font-size:13px;'>金额纠错</b>"
					}
				},{
					eName:"div",
					cssClass:"correction_addCorr_secondDiv",
					elements:{
						eName:"div",
						elements:[{
							eName:"input",
							cssClass:"correction_addCorr_checkbox",
							id:"money_check",
							type:"checkbox",
							onClick:money_able
						},{
							eName:"span",
							elements:"应发金额"
						},{
							eName:"textbox",
							name:"sub_amt",
							validType:['money','moneyMax'],
							width:100,
							onChange:moneyInput
						},{
							eName:"span",
							elements:"元"
						}]
					}
				}]
			}
		}
	}
	
	var southUI = {
		eName:"div",
		cssClass:"openAccount_configWin_southdiv",
		elements:[{
			eName:"linkbutton",
			uId:"tm2",
			cssClass : 'correction_linkbutton',
			text : '确定',
			width:80,
			height:35,
			onClick:correct
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
	var configForm = jqObj.findJqUI("configForm");
	var begin_date = jqObj.findJq("begin_date");
	var end_date = jqObj.findJq("end_date");
	var sub_amt = jqObj.findJq("sub_amt");
	var begin_check = jqObj.findJq("begin_check");
	var end_check = jqObj.findJq("end_check");
	var money_check = jqObj.findJq("money_check");
	
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
			return true;//true 关闭 false不关闭
		}
	});
		
	loadInit();
	function loadInit(){
		dataTable.datagrid("loadDataEx",loadParams.params);
		begin_date.findJqUI().numberDisable(true);//禁用
		end_date.findJqUI().numberDisable(true);//禁用
		sub_amt.textbox("disable");
		initDate(0);
	}
	
	//初始化日期
	function initDate(i){
		var date = new Date();
		var y = date.getFullYear();
		var sub_month = loadParams.params[0].sub_month;
		var m = sub_month.substring(sub_month.length-2,sub_month.length);
		var bd = "01";
		var ed = getMonthDays(y,m);
		if(i==0){
			begin_date.findJqUI().setDate(y+"-"+m+"-"+bd);
			end_date.findJqUI().setDate(y+"-"+m+"-"+ed);
		}
		else if(i==1){
			begin_date.findJqUI().setDate(y+"-"+m+"-"+bd);
		}
		else if(i==2){
			end_date.findJqUI().setDate(y+"-"+m+"-"+ed);
		}
	}
	
	//获取本月天数
	function getMonthDays(year,month){
		var date1 = new Date(year,month,1);
		var date2 = new Date(date1.getTime() - 24 * 60 * 60 * 1000);
		return date2.getDate();
	}
	
	function begin_able(){
		if(begin_check.prop("checked")){
			begin_date.findJqUI().numberDisable(false);//启用
		}else{
			begin_date.findJqUI().numberDisable(true);//禁用
		}
		initDate(1);
	}
	
	function end_able(){
		if(end_check.prop("checked")){
			end_date.findJqUI().numberDisable(false);//启用
		}else{
			end_date.findJqUI().numberDisable(true);//禁用
		}
		initDate(2);
	}
	
	function money_able(){
		if(money_check.prop("checked")){
			sub_amt.textbox("enable");
		}else{
			sub_amt.textbox("disable");
		}
	}
	
	function correct(){
		if(!begin_check.prop("checked")&&!end_check.prop("checked")&&!money_check.prop("checked")){
			$.alert("请选择一项进行纠错！");
		}else{
			var param = {};
			var money=/^[+]?(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
			if(begin_check.prop("checked")){
				param['begin_date'] = begin_date.findJqUI().getDate();
			}
			if(end_check.prop("checked")){
				param['end_date'] = end_date.findJqUI().getDate();
			}
			if(money_check.prop("checked")){
				if(sub_amt.textbox("getValue")==""){
					$.alert("请输入应发金额！");
					return false;
				}else if(!money.test(sub_amt.textbox("getValue"))){
					sub_amt.textbox("textbox").focus();
					return false;
				}else{
					param['sub_amt'] = sub_amt.textbox("getValue");
				}
			}
			
			var myWin = $.createWin({
				title:"操作提示",
				width:600,
				height:100,
				queryParams:{
					params:loadParams.params,
					configs:param,
//					callback:function(){
//						loadParams.callback();
//						jqObj.window("close");
//					}
					loadP:loadParams
				},
				url:"js/account/correction_progressBarWin.js"
			});
			jqObj.window("close");
		}
	}
	
	
	
	//输入金额
	function moneyInput(newValue, oldValue){
		var money=/^[+]?(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
		if(money.test(newValue) && newValue<=10000){//金额验证
			//金额输入框
			if(newValue.indexOf(".")==-1){
				sub_amt.textbox("setValue",newValue+".00");
			}
			else if(newValue.length - newValue.indexOf(".") - 1 == 1){
				sub_amt.textbox("setValue",newValue+"0");
			}
			else{
				sub_amt.textbox("setValue",newValue);
			}
		}
	}
	
	//扩展验证
	$.extend($.fn.validatebox.defaults.rules, {    
		money: {// 金额验证
            validator: function (value) {
                //return /^[+]?[1-9]+\d*$/i.test(value);
                return /^[+]?(([1-9]\d{0,9})|0)(\.\d{1,2})?$/i.test(value);
            },
            message: '请输入正确金额'
        },
        moneyMax :{// 最大值验证
        	validator: function (value) {
                return (value<=21474836.47);
       	    },
            message: '请输入正确金额'
        }
	});  
	
});