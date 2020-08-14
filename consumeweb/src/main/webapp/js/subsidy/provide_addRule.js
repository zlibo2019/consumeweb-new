//新增补贴规则
garen_define("js/subsidy/provide_addRule",function (jqObj,loadParams) {
	
	var provideRuleAdd = "subsidy/provideRuleAdd.do";//规则新增
	
	var provideBatchQuery = "subsidy/provideBatchQuery.do";//新增规则时查询批次号
	
	var addRuleUI = {
		eName:"div",
		cssClass:"provide_addRule",
		elements:[{
			eName:"fieldset",
			width:330,
			height:170,
			elements:[{
				eName:'legend',
				text:'规则信息'
			},{
				eName:"div",
				elements:[{
					eName:"div",
					elements:[{
						eName:"span",
						elements:"补贴月份"
					},{
						eName:"datespinnerEx",
						name:"subsidyDate",
						width:60,
						dateType:['Y','M'],
						onChange:function(newValue){
							var params = {};
							//var sub_month = subsidyDate.findJqUI().getDate();
							params['sub_month'] = newValue;
							$.postEx(provideBatchQuery,params,function(retJson){
								if(retJson.result && retJson.data){
									batch_no.textbox("setValue",retJson.data[0].batch_no);
								}
							});
						}
					}]
				},{
					eName:"div",
					elements:[{
						eName:"span",
						elements:"启用日期"
					},{
						eName:"datespinnerEx",
						width:60,
						dateType:['Y','M','D'],
						//editable:false,
						name:"startDate"
					}]
					
				},{
					eName:"div",
					elements:[{
						eName:"span",
						elements:"有效日期"
					},{
						eName:"datespinnerEx",
						width:60,
						dateType:['Y','M','D'],
						//editable:false,
						name:"validDate"
					}]
				},{
					eName:"div",
					elements:[{
						eName : 'span',
						elements: "批次号&emsp;",
					}, {
						eName:"textbox",
						id:"batch_no",
						validType:"number",
						width:40
					}, {
						eName : 'input',
						name:"enable_enddate",
						cssStyle:"vertical-align:middle; margin-top:-2px; margin-left:20px;",
						type:"checkbox",
						onClick:function(){
							if(enable_enddate.prop("checked")){
								validDate.findJqUI().numberDisable(false);//启用
								var year = startDate.findJqUI().getDate().substring(0,4);
								var month = startDate.findJqUI().getDate().substring(5,7);
								var temp = new Date(year,month,0); 
								var day = temp.getDate(); 
								validDate.findJqUI().setDate(year+"-"+month+"-"+day);
							}else{
								validDate.findJqUI().numberDisable(true);//禁用
								validDate.findJqUI().setDate("2040-12-31");
							}
						}
						
					}, {
						eName:"span",
						elements:"启用有效日期",
						width:40
					}]
				}]
			}]
		},{
			eName:"div",
			cssClass:'provide_addRule_button',
			elements:[{
				eName:"linkbutton",
				uId:"tm2",
				text : '保存',
				cssClass : 'provide_linkbutton',
				width : 80,
				height : 35,
				onClick:save
			},{
				eName:"linkbutton",
				uId:"tm1",
				text : '取消',
				cssClass : '',
				width : 80,
				height : 35,
				onClick:function(){
					jqObj.window("close");
				}
			}]
		}]
	}
	
	jqObj.loadUI(addRuleUI);
	
	var subsidyDate = jqObj.findJq("subsidyDate");
	var startDate = jqObj.findJq("startDate");
	var validDate = jqObj.findJq("validDate");
	var batch_no = jqObj.findJq("batch_no");
	var enable_enddate = jqObj.findJq("enable_enddate");
	var date = new Date();
	//初始化微调值
	loadSpinner();
	function loadSpinner(){
		var y = date.getFullYear();
		var m = date.getMonth()+1;
		var d = date.getDate();
		var maxD = getDaysInMonth(y,m);
		subsidyDate.findJqUI().setDate(y+"-"+(m<10?"0"+m:m));
		startDate.findJqUI().setDate(y+"-"+(m<10?"0"+m:m)+"-"+"01");
		validDate.findJqUI().numberDisable(true);//禁用
		validDate.findJqUI().setDate("2040-12-31");
		//validDate.findJqUI().setDate(y+"-"+(m<10?"0"+m:m)+"-"+maxD);
		
		//批次号
		var params = {};
		var sub_month = subsidyDate.findJqUI().getDate();
		params['sub_month'] = sub_month;
		$.postEx(provideBatchQuery,params,function(retJson){
			if(retJson.result && retJson.data){
				batch_no.textbox("setValue",retJson.data[0].batch_no);
			}
		});
	}
	
	//根据年月得到总天数
	function getDaysInMonth(year,month){ 
		month = parseInt(month,10); //parseInt(number,type)这个函数后面如果不跟第2个参数来表示进制的话，默认是10进制。 
		var temp = new Date(year,month,0); 
		return temp.getDate(); 
	}
	
	//保存
	function save(){
		if(startDate.findJqUI().getDate()>validDate.findJqUI().getDate()){
			$.alert("启用日期不能大于有效日期！");
		}else{
			var params = {};
			var sub_month = subsidyDate.findJqUI().getDate();
			var begin_date = startDate.findJqUI().getDate();
			var end_date = validDate.findJqUI().getDate();
			params['sub_month'] = sub_month;
			params['begin_date'] = begin_date;
			params['end_date'] = end_date;
			if(enable_enddate.prop("checked")){
				params['enable_enddate'] = "1";
			}else{
				params['enable_enddate'] = "0";
			}
			var num = /^[1-9]\d*$/;
			if(num.test(batch_no.textbox("getValue"))){
				params['batch_no'] = batch_no.textbox("getValue");
				$.postEx(provideRuleAdd,params,function(retJson){
					if(retJson.result){
						loadParams.callback();
						jqObj.window("close");
					}else{
						$.alert(retJson.info);
					}
				});
			}else{
				batch_no.textbox("textbox").focus();
			}
		}
	}
	//扩展验证
	$.extend($.fn.validatebox.defaults.rules, {    
        number: {// 半角字符验证
            validator: function (value) {
                return /^[1-9]\d*$/i.test(value);
            },
            message: '请输入正确数字'
        }
	});  
});