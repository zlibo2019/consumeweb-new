//餐别设置修改
garen_define("js/highConsume/mealSet_modifyMeal",function (jqObj,loadParams) {
	
	var mealSetUpdate = "highConsume/mealSetUpdate.do";//修改
	
	var offsetData = loadParams.params.offsetData;
	
	var addRuleUI = {
		eName:"div",
		cssClass:"mealSet_addMeal",
		elements:[{
			eName:"fieldset",
			width:330,
			height:160,
			elements:[{
				eName:'legend',
				text:'餐别信息'
			},{
				eName:"div",
				elements:[{
					eName:"div",
					elements:[{
						eName : 'span',
						elements: "餐别&emsp;&emsp;",
					}, {
						eName:"textbox",
						id:"meal_name",
						width:160
					}]
				},{
					eName:"div",
					elements:[{
						eName:"span",
						elements:"开始时间"
					},{
						eName:"datespinnerEx",
						width:60,
						dateType:['H','m'],
						editable:false,
						name:"begin_time",
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
						name:"end_time",
						offset:offsetData?offsetData[0].offset:''
					}]
				}]
			}]
		},{
			eName:"div",
			cssClass:'mealSet_addMeal_button',
			elements:[{
				eName:"linkbutton",
				uId:"tm2",
				text : '保存',
				cssClass : 'mealSet_linkbutton',
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
	var meal_name = jqObj.findJq("meal_name");
	var begin_time = jqObj.findJq("begin_time");
	var end_time = jqObj.findJq("end_time");
	
	loadInit();
	function loadInit(){
		if(loadParams.params.meal_id==1 
				|| loadParams.params.meal_id==2 
				|| loadParams.params.meal_id==3 
				|| loadParams.params.meal_id==4){
			meal_name.textbox("disable");
		}else{
			meal_name.textbox("enable");
		}
		meal_name.textbox("setValue",loadParams.params.meal_name);
		begin_time.findJqUI().setDate(loadParams.params.begin_time);
		end_time.findJqUI().setDate(loadParams.params.end_time);
	}
	
	function save(){
		if(meal_name.textbox("getValue")==""){
			$.alert("请输入餐别名称！");
		}else if(begin_time.findJqUI().getDate()>=end_time.findJqUI().getDate()){
			$.alert("存在"+(offsetData[0].offset)+"分钟的偏移量，请重新设置！");
		}else{
			var params = {};
			params['meal_id'] = loadParams.params.meal_id;
			params['meal_name'] = meal_name.textbox("getValue");
			params['begin_time'] = begin_time.findJqUI().getDate();
			params['end_time'] = end_time.findJqUI().getDate();
			params['overlap_chk'] = "1";//默认验证时段交叉，不允许重叠
			$.postEx(mealSetUpdate,params,function(retJson){
				if(retJson.result){
					loadParams.callback();
					jqObj.window("close");
				}else if(retJson.id=="-2"){
					$.confirm(retJson.info+"<br/>是否允许交叉？",function(c){
						if(c){
							save2();
						}
					});
				}else{
					$.alert(retJson.info);
				}
			});
		}
	}
	
	//保存失败后若继续保存则取消验证
	function save2(){
		var params = {};
		params['meal_id'] = loadParams.params.meal_id;
		params['meal_name'] = meal_name.textbox("getValue");
		params['begin_time'] = begin_time.findJqUI().getDate();
		params['end_time'] = end_time.findJqUI().getDate();
		params['overlap_chk'] = "0";//取消验证时段交叉，允许重叠
		$.postEx(mealSetUpdate,params,function(retJson){
			if(retJson.result){
				loadParams.callback();
				jqObj.window("close");
			}else{
				$.alert(retJson.info);
			}
		});
	}
});