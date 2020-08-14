// 获取卡类型选择窗口
garen_define("js/account/impCard_cardTypeWin",function (jqObj,loadParams) {
	
	var cardTypeQuery = "account/cardTypeQuery.do"//全部卡号类型查询
	
	var addModeUI = {
		eName:"div",
		height : 100,
		cssClass:"cardNumImp_addCost",
		elements:[{
			eName:"div",
			cssClass:"cardNumImp_addCost_div",
			elements:[{
				eName : 'span',
				text : '卡类型',
				cssClass:"operateCost_span",
			},{
				eName : 'combobox',
				name:"event_id",
				panelHeight:$.browser.msie9?100:'auto',
				panelMaxHeight:100,
				id:"cardTypeList",
				width : 140,
				height : 25,
				valueField: 'card_media_type',    
		        textField: 'card_type_name',
				editable:false
			}]
		},{
			eName:"div",
			cssClass:'cardNumImp_addCost_button_div',
			elements:[{
				eName:"linkbutton",
				uId:"tm2",
				text : '确定',
				cssClass : 'cardNumImp_addCost_linkbutton',
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
		}]
	}
	
	jqObj.loadUI(addModeUI);
	// 卡类型查询
	var cardTypeList = jqObj.findJq("cardTypeList");
	loadCardTypeList();//加载卡类型
	
	// 加载卡类型查询
	function loadCardTypeList(){
		$.postEx(cardTypeQuery,function(retJson){
			if(retJson.result && retJson.data){
				cardTypeList.combobox("loadDataEx",retJson.data);
			}
		});
	}
	
	function save(){
		// 卡类型是否选择校验
		var e = cardTypeList.combobox("getValue");
		if(e==""){
			$.alert("请选择卡类型！");
		} else {
			loadParams.callback(e);
			jqObj.window("close");
		}
	}

});