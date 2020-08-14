//新增模式
garen_define("js/equipment/autoModeDefine_addMode",function (jqObj,loadParams) {
	
	var modeListAdd = "equipment/autoMode/modeListAdd.do";//新增
	
	var addModeUI = {
		eName:"formUI",
		id:"saveForm",
		method:"post",
		alertFlag:false,
		//progressBar:"保存中...",
		//url:modeListAdd,
		onBeforeSave:function(params){
			
		},
		/*onSave:function(retJson){
			if(retJson.result){
				loadParams.callback();
				jqObj.window("close");
			}else{
				$.alert(retJson.info);
			}
			
		},*/
		elements:{
			eName:"div",
			cssClass:"autoModeDefine_addMode",
			elements:[{
				eName:"div",
				elements:{
					eName:"fieldset",
					width:330,
					height:80,
					elements:[{
						eName:'legend',
						text:'模式选择'
					},{
						eName:"div",
						cssClass:"autoModeDefine_addMode_first",
						elements:[{
							eName:"div",
							elements:[{
								eName:"input",
								type:"radio",
								id:"xf_model1",
								name:"xf_model_id",
								value:"2",
								checked:"true",
								onClick:changeModel
							},{
								eName:"span",
								text:"计次模式"
							}]
						},{
							eName:"div",
							elements:[{
								eName:"input",
								type:"radio",
								id:"xf_model2",
								name:"xf_model_id",
								value:"1",
								onClick:changeModel
							},{
								eName:"span",
								text:"定额模式"
							},{
								eName:"span",
								text:"定额金额"
							},{
								eName:"textbox",
								width:100,
								name:"fixed_amt",
								validType:['money','moneyMax'],
								onChange:moneyInput
							},{
								eName:"span",
								text:"元"
							}]
						}]
					}]
				}
			},{
				eName:"div",
				elements:{
					eName:"fieldset",
					width:330,
					height:80,
					elements:[{
						eName:'legend',
						text:'时间范围'
					},{
						eName:"div",
						cssClass:"autoModeDefine_addMode_second",
						elements:[{
							eName:"div",
							elements:[{
								eName:"span",
								elements:"开始时间"
							},{
								eName:"datespinnerEx",
								width:60,
								dateType:['H','m'],
								editable:false,
								name:"begin_date",
							}]
							
						},{
							eName:"div",
							elements:[{
								eName:"span",
								elements:"结束时间"
							},{
								eName:"datespinnerEx",
								width:60,
								dateType:['H','m'],
								editable:false,
								name:"end_date",
							}]
						}]
					}]
				}
			},{
				eName:"div",
				cssClass:'autoModeDefine_addMode_button_div',
				elements:[{
					eName:"linkbutton",
					uId:"tm2",
					text : '保存',
					cssClass : 'autoModeDefine_addMode_linkbutton',
					width : 80,
					height : 35,
					onClick:function(){
						var p = {};
						if(saveForm.form('form2Json',p)){//true则表单验证通过
							if(!xf_model1.prop("checked") && !xf_model2.prop("checked")){
								$.alert("请先选择模式！");
								return false;
							}
							else if(xf_model2.prop("checked") && fixed_amt.textbox("getValue")==""){
								$.alert("请输入金额！");
								return false;
							}
							else if(fixed_amt.textbox("getValue")=="0.00"){
								$.alert("定额金额不能为0！");
								return false;
							}
							else if(end_date.findJqUI().getDate()<=begin_date.findJqUI().getDate()){
								$.alert("结束时间不能小于开始时间！");
								return false;
							}
							
							var myWin = $.createWin({
								title:"操作提示",
								width:600,
								height:100,
								queryParams:{
									params:loadParams.params,
									configs:saveForm.findJqUI().form2Json(),
//									callback:function(){
//										loadParams.callback();
//										jqObj.window("close");
//									}
									loadP:loadParams
								},
								url:"js/equipment/autoModeDefineAddMode_progressBarWin.js"
							});
							jqObj.window("close");
							//params['dep_serial'] = loadParams.params.dep_serial;
						}
						
					}
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
	}
	
	jqObj.loadUI(addModeUI);
	var saveForm = jqObj.findJq("saveForm");
	var xf_model1 = jqObj.findJq("xf_model1");
	var xf_model2 = jqObj.findJq("xf_model2");
	var fixed_amt = jqObj.findJq("fixed_amt");
	var begin_date = jqObj.findJq("begin_date");
	var end_date = jqObj.findJq("end_date");
	//var dep_serial = loadParams.params.dep_serial;
	
	loadInit();
	function loadInit(){
		fixed_amt.textbox("disable");
	}
	
	function changeModel(){
		if(xf_model1.prop("checked")){
			fixed_amt.textbox("disable");
			fixed_amt.textbox("setValue","");
		}
		else if(xf_model2.prop("checked")){
			fixed_amt.textbox("enable");
		}
	}
	
	function moneyInput(newValue, oldValue){
		var money=/^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
		if(money.test(newValue)){//金额验证
			//金额输入框
			if(newValue.indexOf(".")==-1){
				fixed_amt.textbox("setValue",newValue+".00");
			}
			else if(newValue.length - newValue.indexOf(".") - 1 == 1){
				fixed_amt.textbox("setValue",newValue+"0");
			}
			else{
				fixed_amt.textbox("setValue",newValue);
			}
		}
	}
	
	//function save(){
		//saveForm.findJqUI().submit();
	//}
	
	//文本长度验证
	fixed_amt.next().children().eq(0).attr("maxlength",8);
	
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
	});  
	
//	function save(){
//		var begin = begin_date.findJqUI().getDate();
//		var end = end_date.findJqUI().getDate();
//		var dep_serial = loadParams.params.dep_serial;
//		
//		if(!xf_model1.prop("checked") && !xf_model2.prop("checked")){
//			$.alert("请先选择模式！");
//		}
//		else if(xf_model2.prop("checked") && fixed_amt.textbox("getValue")==""){
//			$.alert("请输入金额！");
//		}
//		else if(end<=begin){
//			$.alert("结束时间不能小于开始时间！");
//		}
//		else{
//			var params= {};
//			params['begin_date'] = begin;
//			params['end_date'] = end;
//			params['dep_serial'] = dep_serial;
//			if(xf_model1.prop("checked")){
//				params['xf_model_id'] = 2;
//				params['fixed_amt'] = "";
//			}
//			else if(xf_model2.prop("checked")){
//				params['xf_model_id'] = 1;
//				params['fixed_amt'] = fixed_amt.textbox("getValue");
//			}
//			$.postEx(modeListAdd,params,function(retJson){
//				if(retJson.result){
//					loadParams.callback();
//					jqObj.window("close");
//				}else{
//					$.alert(retJson.info);
//				}
//			});
//		}
//	}
});