//修改时段
garen_define("js/highConsume/defaultRule_modifyRuleTime",function (jqObj,loadParams) {
	
	var addRuleUI = {
		eName:"div",
		cssClass:"defaultRule_addRuleTime",
		elements:[{
			eName:"fieldset",
			width:250,
			height:110,
			elements:[{
				eName:'legend',
				text:'时段信息'
			},{
				eName:"div",
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
		},{
			eName:"div",
			cssClass:'defaultRule_addRuleTime_button',
			elements:[{
				eName:"linkbutton",
				uId:"tm1",
				text : '保存',
				cssClass : 'defaultRule_linkbutton',
				width : 80,
				height : 35,
				onClick:function(){
					save();
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
	
	jqObj.loadUI(addRuleUI);
	var begin_date = jqObj.findJq("begin_date");
	var end_date = jqObj.findJq("end_date");
	
	loadInit();
	function loadInit(){
		begin_date.findJqUI().setDate(loadParams.params.begin_date);
		end_date.findJqUI().setDate(loadParams.params.end_date);
	}
	
	function save(){
		var begin = begin_date.findJqUI().getDate();
		var end = end_date.findJqUI().getDate();
		var mealTime = loadParams.params2;
		if(end<=begin){
			$.alert("结束时间不能小于开始时间！");
		}
		else if(begin<mealTime.begin_time){
			$.alert("开始时间不能小于餐别开始时间！");
		}
		else if(end>mealTime.end_time){
			$.alert("结束时间不能大于餐别结束时间！");
		}else{
			//var params = [];
			var params = {};
			params['begin_date'] = begin;
			params['end_date'] = end;
			//params.push(param);
			loadParams.callback(params);
			jqObj.window("close");
		}
		
	}
});