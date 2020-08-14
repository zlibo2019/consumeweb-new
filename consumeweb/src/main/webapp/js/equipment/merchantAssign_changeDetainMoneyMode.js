/*修改扣款模式*/
garen_define("js/equipment/merchantAssign_changeDetainMoneyMode",function (jqObj,loadParams) {

	var chargeTypeQuery = "equipment/merchant/chargeTypeQuery.do";//扣款模式
	
	var chanMode = "equipment/merchant/mode.do";//修改扣款模式
	
	var centerUI = {
		eName:"div",
		cssClass:"merchantAssign_changeDetainMoneyMode",
		elements:[{
			eName:'fieldset',
			height:90,
			width:"90%",
			elements:[{
				eName:'legend',
				id:'legendTable',
				text:'修改'
			}]
		}]
	};
	
	var southUI = {
		eName:"div",
		cssClass:'merchantAssign_relevanceDevice_button_div',
		elements:[{
			eName:"linkbutton",
			uId:"tm2",
			text : '确定',
			width : 60,
			height : 30,
			onClick:save
		},{
			eName:"linkbutton",
			uId:"tm1",
			text : '取消',
			cssClass : '',
			width : 60,
			height : 30,
			onClick:function(){
				jqObj.window("close");
			}	
		}]
	};
	
	var mainUI = {
		eName:"layoutExt",
		fit : true,
		elements : [{
			region : 'center',
			cssStyle:"overflow:auto;",
			elements : centerUI
		},{
			region : 'south',
			height : 45,
			elements : southUI
		}]
	}
	
	jqObj.loadUI(mainUI);
	var legendTable = jqObj.findJq("legendTable");
	var merchantAssign_changeDetainMoneyMode = jqObj.findJq("merchantAssign_changeDetainMoneyMode");

	chargeType();//扣款模式
	
	function chargeType(){
		merchantAssign_changeDetainMoneyMode.createUI({
			addMode:'after',
			eName:'div',
			cssStyle:'margin-left: 5%; width: 90%; margin-top: 10px;',
			elements:[{
				eName:'input',
				cssStyle:"margin-left: 16px;vertical-align: middle;margin-top: -2px;margin-right: 5px;",
				type:'checkbox',
				checked:true,
				name:'ifc'
			},{
				eName:'span',
				text:"允许记账消费"
			}]
		});
		$.loadEx(chargeTypeQuery,function(retJson){
			for(var i=retJson.data.length-1;i>=0;i--){
				legendTable.createUI({
					addMode:'after',
					eName:'div',
					cssStyle:'display:inline-block',
					elements:[{
						eName:'input',
						type:'radio',
						name:'ra',
						value:retJson.data[i].type,
					},{
						eName:'span',
						text:retJson.data[i].name
					}]
				})
			}
			var put = jqObj.find('input[name=ra]')[0];
			put.checked = 'checked';
		});
	}
	
	
	function save(){//修改扣款模式
		var val = jqObj.find('input[name=ra]:checked').val();
		var params = {};
        params['bh'] = loadParams.bhs.join(',');//主键参数
        params['type'] = val;
        var ifc = jqObj.findJq("ifc");//允许记账消费
        if(ifc.prop("checked")){
        	params['ifc'] = "1";
        }else{
        	params['ifc'] = '0';
        }
		$.postEx(chanMode,params,function(retJson){//修改扣款模式
			if(retJson.result){
				loadParams.callback();//刷新表格
				jqObj.window("close");
			}else{
				$.alert(retJson.info);
			}
		});
	}
});	
