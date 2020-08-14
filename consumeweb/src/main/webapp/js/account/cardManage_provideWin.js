//发卡提示窗
garen_define("js/account/cardManage_provideWin",function (jqObj,loadParams) {

	var cardProvide = "account/cardProvide.do";//发卡
	
	var cardProvideAfter = "account/cardProvideAfter.do";//发卡后续部分
	
	var jmjlink = garen_require("js/lib/jmjlink");//卡控件
	
	var cardDeposit = "account/cardDeposit.do";//卡片押金验证
	
	var cardState = "account/cardState.do";//卡片状态验证
	
	var accountValid = "account/accountValid.do";//账户验证（发补卡验证）
	
	var prCardValid = "account/prCardValid.do";//发补卡验证
	
	var clearState = "account/clearState.do";//清除卡片中间状态
	
	var isMainCardTest = "account/isMainCardTest.do";//主卡作为附卡发放验证
	
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
					//loadParams.callback();
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
			},
			{
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
			loadParams.callback();
			//jqObj.window("close");
			return true;//true 关闭 false不关闭
		}
	});
	
	deposit();
	//卡片押金验证
	function deposit(){
		info_div.html("正在验证中...");
		var param = {};
		param['account_id'] = loadParams.params.account_id;
		param['old_card_serial'] = "0";
		$.postEx(cardDeposit,param,function(retJson){
			if(retJson.result){
				searchCard();
			}else{
				info_div.html(retJson.info);
				errorBeep();
			}
		});
	}
	
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
//						if(is_main_card=="1"){//主卡
//							validCard(jt);
//						}else{//附卡
//							provide(jt);
//						}
						validCard(jt);
					}else if(jt.ErrCode=="-102"){
						info_div.html("请将卡放到读卡器上！");
						searchCard();
					}else{
						info_div.html("寻卡错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
						errorBeep();
					}
				}
			},'寻卡',$.toJSON(params));
		}else{
			return false;
		}
	}
	
	//发补卡验证（是否发补新卡，旧的卡会被清除中间状态）
	function validCard(jt){
		var param = {};
		param['account_id'] = loadParams.params.account_id;
		param['card_number'] = jt.retData.CardNo;
		param['media_id'] = jt.retData.CardType;
		$.postEx(prCardValid,param,function(retJson){
			if(retJson.result){
				//validAccount(jt);
				testIsMainCard(jt);
			}else{
				$.confirm(retJson.info,function(r){
					if(r){
						//清除发补卡中间状态
						clearCardState(jt,retJson.retData.card_serial);
					}else{
						//loadParams.callback();
						if(exit == 1){
							jqObj.window("close");
						}
					}
				});
			}
		});
	}
	
	//清除发补卡中间状态
	function clearCardState(jt,card_serial){
		var param = {};
		param['account_id'] = loadParams.params.account_id;
		param['card_serial'] = card_serial;
		$.postEx(clearState,param,function(retJson){
			if(retJson.result){
				//validAccount(jt,is_main_card);
				testIsMainCard(jt);
			}else{
				info_div.html(retJson.info);
				errorBeep();
			}
		});
	}
	
	//主卡作为附卡发放验证
	function testIsMainCard(jt){
		var param = {};
		param['card_number'] = jt.retData.CardNo;
		param['media_id'] = jt.retData.CardType;
		param['is_main_card'] = loadParams.params.is_main_card;
		$.postEx(isMainCardTest,param,function(retJson){
			if(retJson.result){
				if(loadParams.params.is_main_card=="1"){//主卡
					validAccount(jt);
				}else{//附卡
					validAccount2(jt);
				}
			}else{//主卡作为附卡
				$.confirm(retJson.info,function(r){
					if(r){
						validAccount2(jt);
					}else{
						//loadParams.callback();
						if(exit == 1){
							jqObj.window("close");
						}
					}
				});
			}
		});
	}
	
	//账户验证（发补卡验证）
	function validAccount(jt){
		var param = {};
		param['account_id'] = loadParams.params.account_id;
		param['id'] = "-1";
		param['card_number'] = jt.retData.CardNo;
		param['media_id'] = jt.retData.CardType;
		param['is_main_card'] = loadParams.params.is_main_card;
		param['old_card_serial'] = "0";
		$.postEx(accountValid,param,function(retJson){
			if(retJson.result){
				validCardState(jt);
			}else{
				info_div.html(retJson.info);
				errorBeep();
			}
		});
	}
	
	//卡片状态验证
	function validCardState(jt){
		var param = {};
		param['card_number'] = jt.retData.CardNo;
		param['media_id'] = jt.retData.CardType;
		$.postEx(cardState,param,function(retJson){
			if(retJson.result){
				checkCardDealerKey(jt);
			}else{
				provide(jt);
			}
		});
	}
	
	/**
	 * 附卡，验证押金且不验证密钥
	 */
	//账户验证（发补卡验证）
	function validAccount2(jt){
		var param = {};
		param['account_id'] = loadParams.params.account_id;
		param['id'] = "-1";
		param['card_number'] = jt.retData.CardNo;
		param['media_id'] = jt.retData.CardType;
		param['is_main_card'] = loadParams.params.is_main_card;
		param['old_card_serial'] = "0";
		$.postEx(accountValid,param,function(retJson){
			if(retJson.result){
				provide(jt);
			}else{
				info_div.html(retJson.info);
				errorBeep();
			}
		});
	}
	
	//卡片验证指令
	function checkCardDealerKey(jt2){
		var params = {
			"commandSet":[{
				"funName":"IcheckCardDealerKey", 
				"param":""
			}]	
		};
		jmjlink.send(function(jtype,jtext,jpre_str){
			if(jtype==2){
				info_div.html(jpre_str);
			}else{
				var jt = $.parseJSON(jtext);
				if(jt.ErrCode=="0"){
					provide(jt2);
				}else{
					info_div.html("密钥验证错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
					errorBeep();
				}
			}
		},'密钥验证',$.toJSON(params));
	}

	
	//发卡
	function provide(jt){
		info_div.html("正在发卡...");
		var param = {};
		param['account_id'] = loadParams.params.account_id;
		param['card_number'] = jt.retData.CardNo;
		param['media_id'] = jt.retData.CardType;
		param['is_main_card'] = loadParams.params.is_main_card;
		param['old_card_serial'] = "0";
		$.postEx(cardProvide,param,function(retJson){
			if(loadParams.params.is_main_card=="1"){//主卡
				if(retJson.result && retJson.data.length>0){
					provideCard(retJson.data[0]);
				}else{
					info_div.html(retJson.info);
					errorBeep();
				}
			}else{//附卡
				if(retJson.result){
					info_div.html("发卡成功！");
					successBeep();
					//loadParams.callback();
					exitWin();
				}else{
					info_div.html(retJson.info);
					errorBeep();
				}
			}
//			if(retJson.result && retJson.data.length>0){
//				if(is_main_card=="1"){//主卡
//					provideCard(retJson.data[0]);
//				}else{//附卡
//					info_div.html("发卡成功！");
//					successBeep();
//					loadParams.callback();
//					if(exit == 1){
//						jqObj.window("close");
//					}
//				}
//				
//			}else{
//				info_div.html(retJson.info);
//				errorBeep();
//			}
		});
	}
	
	//发卡指令
	function provideCard(data){
		
		var params = {
			"commandSet":[{
				"funName":data.funName, 
				"param": {
					"Name" : data.Name,
					"Pwd" : data.Pwd,
					"PwdValid" : data.PwdValid,
					"LogicCardNo" : data.LogicCardNo,
					"IssuDate" : data.IssuDate,
					"BeginDate" : data.BeginDate,
					"EndDate" : data.EndDate
				}
			}]	
		};
		jmjlink.send(function(jtype,jtext,jpre_str){
			if(jtype==2){
				info_div.html(jpre_str);
			}else{
				var jt = $.parseJSON(jtext);
				if(jt.ErrCode=="0"){
					var param = {};
					param['account_id'] = loadParams.params.account_id;
					param['card_serial'] = data.LogicCardNo;
					param['old_card_serial'] = "0";
					$.postEx(cardProvideAfter,param,function(retJson){
						if(retJson.result){
							info_div.html("发卡成功！");
							successBeep();
							//loadParams.callback();
							exitWin();
						}else{
							info_div.html(retJson.info);
							errorBeep();
						}
					});
				}else{
					info_div.html("发卡错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
					errorBeep();
				}
			}
		},'发卡',$.toJSON(params),"5000");
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