//更新卡片有效期提示窗
garen_define("js/account/cardManage_updateEndDateWin",function (jqObj,loadParams) {

	var jmjlink = garen_require("js/lib/jmjlink");//卡控件
	
	var updateCardEndDate = "account/updateCardEndDate.do";//更新卡片有效期
	
	var validCard = "account/validCard.do";//卡片验证
	
	var flag = 1;//寻卡标志
	
	var exit = 1;//退出Win标志
	
	var northUI = {
			eName:"div",
			cssClass:"cardManage_provideWin",
			elements:{
				eName:"div",
				cssClass:"cardManage_provideWin_div",
				id:"info_div"
			}
		}
		
		var centerUI = {
			eName:"div",
			cssClass:"cardManage_provideWin",
			elements:{
				eName:"linkbutton",
				uId:"tm1",
				cssClass:"cardManage_searchWin_linkbutton",
				text : '确定',
				width : 80,
				height : 35,
				onClick:function(){
					//flag = 0;
					//exit = 0;
					jqObj.window("close");
				}
			}
		}
		
		var mainUI = {
			eName : 'layoutExt',// 容器布局类，jeasyui组件
			cssStyle:'font-family: 微软雅黑, Arial;',
			fit : true,
			elements : [{
				region : 'north',
				cssStyle:"overflow:auto;",
				height : 100,
				elements : northUI
			},{
				region : 'center',
				elements : centerUI
			}]
		}
	
	jqObj.loadUI(mainUI);
	
	var info_div = jqObj.findJq("info_div");
	
	//关闭
	jqObj.updateOpt("panel",{
		onBeforeClose:function(){
			flag = 0;
			exit = 0;
			//jqObj.window("close");
			return true;//true 关闭 false不关闭
		}
	});
	
	searchCard();
	
	//寻卡指令
	function searchCard(){
		if(flag){
			var params = {
				"commandSet":[{
					"funName":"ReqCard", 
					"param":""
				}]
			};
			jmjlink.send(function(jtype,jtext,jpre_str){
				if(jtype==2){
					info_div.html(jpre_str);
				}else{
					var jt = $.parseJSON(jtext);
					if(jt.ErrCode=="0"){
						info_div.html("正在验证...");
						cardValid(jt);
					}
					else if(jt.ErrCode=="-102"){
						info_div.html("请将卡放到读卡器上！");
						searchCard();
					}
					else{
						info_div.html("寻卡错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
						errorBeep();
					}
				}
			},'寻卡',$.toJSON(params));
		}else{
			return false;
		}
	}
	
//	//卡片一致性验证
//	function isSameCard(){
//		if(loadParams.card_serial == jt.retData.CardNo 
//				&& loadParams.row.media_id == jt.retData.CardType){
//			$.postEx(unLossCard,loadParams.params,function(retJson){
//				if(retJson.result){
//					clear();
//				}else{
//					info_div.html(retJson.info);
//					errorBeep();
//				}
//			});
//		}else{
//			info_div.html("卡片不一致，请确认卡片是否正确！");
//			errorBeep();
//		}
//	}
	
	//主附卡验证
	function cardValid(jt){
		var param = {};
		param['account_id'] = loadParams.params;
		param['card_number'] = jt.retData.CardNo;
		param['media_id'] = jt.retData.CardType;
		$.postEx(validCard,param,function(retJson){
			if(retJson.result){
				if(retJson.data[0].is_main_card==1){//主卡
					readIssu(retJson.data[0].card_serial);
				}else if(retJson.data[0].is_main_card==0){//附卡
					info_div.html("附卡不能更新有效期！");
					errorBeep();
				}
			}else{
				info_div.html(retJson.info);
				errorBeep();
			}
		});
	}
	
	//更新卡片有效期
	function updateEndDate(jt){
		var param = {};
		var begin_date = jt.retData.BeginDate;
		var end_date = jt.retData.EndDate;
		param['account_id'] = loadParams.params;
		param['card_serial'] = jt.retData.LogicCardNo;
		param['end_date'] = end_date;
		$.postEx(updateCardEndDate,param,function(retJson){
			if(retJson.result && retJson.data.length>0){
//				if(end_date==retJson.data[0].end_date){
//					info_div.html("有效期是最新的，不需要更新！");
//				}else{
				updateCmd(begin_date, retJson.data[0].end_date);
//				}
			}else{
				info_div.html(retJson.info);
				errorBeep();
			}
		});
	}
	
	//更新指令
	function updateCmd(begin_date, end_date){
		var params = {
				"commandSet":[{
					"funName":"IonUpdateValidDate", 
					"param": {
						"BeginDate":begin_date,
						"EndDate":end_date
					}
				}]	
			};
			jmjlink.send(function(jtype,jtext,jpre_str){
				if(jtype==2){
					info_div.html(jpre_str);
				}else{
					var jt = $.parseJSON(jtext);
					if(jt.ErrCode=="0"){
						info_div.html("更新成功！");
						successBeep();
						//loadParams.callback();
						exitWin();
					}else{
						info_div.html("更新有效期错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
						errorBeep();
					}
				}
			},'更新卡片有效期',$.toJSON(params));
	}
	
	//读卡发行信息
	function readIssu(card_serial){
		var params = {
			"commandSet":[{
				"funName":"IonReadIssuInfo", 
				"param":""
			}]
		};
		jmjlink.send(function(jtype,jtext,jpre_str){
			if(jtype==2){
				info_div.html(jpre_str);
			}else{
				var jt = $.parseJSON(jtext);
				if(jt.ErrCode=="0"){
					//updateEndDate(jt);
					//cardValid(jt,jt2);
					if(jt.retData.LogicCardNo==card_serial && jt.retData.LogicCardNo==loadParams.eastrow.card_serial){
						info_div.html("正在更新卡片有效期...");
						updateEndDate(jt);
					}else{
						info_div.html("卡片不一致，请确认卡片是否正确！");
						errorBeep();
					}
				}else{
					info_div.html("读发行信息错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
					errorBeep();
				}
			}
		},'读发行信息',$.toJSON(params));
	}
	
	//成功提示音
	function successBeep(){
		var params = {
			"commandSet":[{
				"funName":"Beep",
				"param": {
					"IntervalMode":"No",
					"Ms":"100"
				 }
			}]
		}
		jmjlink.send(function(jtype,jtext,jpre_str){
			
		},'成功提示音',$.toJSON(params));
	}
	
	//错误提示音
	function errorBeep(){
		var params = {
			"commandSet":[{
				"funName":"Beep",
				"param": {
					"IntervalMode":"Short",
					"Ms":"600"
				 }
			}]
		}
		jmjlink.send(function(jtype,jtext,jpre_str){

		},'错误提示音',$.toJSON(params));
	}
	
	function exitWin(){
		window.setTimeout(function(){
			if(exit == 1){
				jqObj.window("close");
			}
		},1000);
	}
});