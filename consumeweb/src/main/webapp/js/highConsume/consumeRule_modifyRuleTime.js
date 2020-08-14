//修改时段
garen_define("js/highConsume/consumeRule_modifyRuleTime",function (jqObj,loadParams) {
	
	var offsetData = loadParams.offsetData;
	
	var addRuleUI = {
		eName:"div",
		cssClass:"consumeRule_addRuleTime",
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
						offset:offsetData?offsetData[0].offset:''
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
						offset:offsetData?offsetData[0].offset:''
					}]
				}]
			}]
		},{
			eName:"div",
			cssClass:'consumeRule_addRuleTime_button',
			elements:[{
				eName:"linkbutton",
				uId:"tm1",
				text : '保存',
				cssClass : 'consumeRule_linkbutton',
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
		//$.print(mealTime);
		if(end<=begin){
			//$.alert("结束时间不能小于开始时间！");
			$.alert("存在"+(offsetData[0].offset)+"分钟的偏移量，请重新设置！");
		}
		else if(begin<mealTime.begin_time_db){
			$.alert("开始时间不能小于餐别开始时间！");
		}
		else if(end>mealTime.end_time_db){
			$.alert("结束时间不能大于餐别结束时间！");
		}else{
			//var params = [];
			var param = {};
			
			var begin_hour = begin_date.findJqEx("spin_hour").val()*1;
			var begin_min = begin_date.findJqEx("spin_min").val()*1;
			if(begin_hour>24){
				begin_hour-=24;
			}
			if(begin_hour<10){
				begin_hour = "0"+begin_hour;
			}
			if(begin_min<10){
				begin_min = "0"+begin_min;
			}
			
			var end_hour = end_date.findJqEx("spin_hour").val()*1;
			var end_min = end_date.findJqEx("spin_min").val()*1;
			if(end_hour>24){
				end_hour-=24;
			}
			if(end_hour<10){
				end_hour = "0"+end_hour;
			}
			if(end_min<10){
				end_min = "0"+end_min;
			}
			
			param['begin_date'] = begin_hour+":"+begin_min;
			param['end_date'] = end_hour+":"+end_min;
			param['begin_date_db'] = begin;
			param['end_date_db'] = end;
			//params.push(param);
			loadParams.callback(param);
			jqObj.window("close");
		}
		
	}
});