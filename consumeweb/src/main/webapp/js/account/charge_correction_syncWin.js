//充值纠错纠错同步提示窗
garen_define("js/account/charge_correction_syncWin",function (jqObj,loadParams) {

	var chargeCorrectionOperation = "account/chargeCorrectionOperation.do";//充值纠错操作
	
	var jmjlink = garen_require("js/lib/jmjlink");//卡控件
	
	var upLoadCard = "account/upLoadCard.do";//上传卡片离线记录
	
	var syncCard = "account/syncCard.do";//卡片同步
	
	var validCard = "account/validCard.do";//卡片验证
	
//	var flag = 1;//寻卡标志
	
	var exit = 1;//退出Win标志
	
	var if_success = "";//充值成功标志
	
	var if_complete = "";//充值完成标志
	
	var mainUI = {
		eName:"div",
		cssClass:"cardManage_provideWin",
		elements:{
			eName:"div",
			cssClass:"cardManage_provideWin_div",
			id:"info_div",
			elements:[{
				eName:"img",
				cssClass:"readCardWin_img",
				src:"themes/default/images/loading.gif"
			},{
				eName:"span",
				cssClass:"readCardWin_span",
				elements:"正在充值纠错，请稍候..."
			}]
		}
	}
	
	jqObj.loadUI(mainUI);
	
	var info_div = jqObj.findJq("info_div");

	//关闭
	jqObj.updateOpt("panel",{
		onBeforeClose:function(){
			if(if_complete){
				if(if_success){
					loadParams.callback(loadParams.params,1);
				}else{
					loadParams.callback(loadParams.params,0);
				}
				exit = 0;
				return true;//true 关闭 false不关闭
			}else{
				return false;//true 关闭 false不关闭
			}
		}
	});
	
	chargeCorrection();
	
	function chargeCorrection(){
		$.postEx(chargeCorrectionOperation,loadParams.params,function(retJson){
			if_complete = 1;
			if(retJson.result){
				if_success = 1;
				searchCard();
			}else{
				if_success = 0;
				info_div.html(retJson.info);
			}
		});
	}
	
	//寻卡指令
	function searchCard(){
		var params = {
			"commandSet":[{
				"funName":"ReqCard", 
				"param":""
			}]
		};
		jmjlink.send(function(jtype,jtext,jpre_str){
			if(jtype==2){
				info_div.html("充值纠错成功！");
				exitWin();
			}else{
				var jt = $.parseJSON(jtext);
				if(jt.ErrCode=="0"){
					cardValid(jt);
				}else{
					info_div.html("充值纠错成功！");
					exitWin();
				}
			}
		},'寻卡',$.toJSON(params));
	}
	
	//卡片验证
	function cardValid(jt){
		var param = {};
		param['account_id'] = loadParams.params.account_id;
		param['card_number'] = jt.retData.CardNo;
		param['media_id'] = jt.retData.CardType;
		$.postEx(validCard,param,function(retJson){
			if(retJson.result){
				if(retJson.data[0].is_main_card==1){//主卡
					readIssu(jt,retJson.data[0].card_serial);
				}else if(retJson.data[0].is_main_card==0){//附卡
					info_div.html("充值纠错成功！");
					exitWin();
				}
			}else{
				info_div.html("充值纠错成功！");
				exitWin();
			}
		});
	}
	
	//读卡片离线记录
	function readRec(jt2,card_serial,jt3){
		var params = {
			"commandSet":[{
				"funName":"IonReadRec", 
				"param":""
			}]
		};
		jmjlink.send(function(jtype,jtext,jpre_str){
			if(jtype==2){
				info_div.html("充值纠错成功！");
				exitWin();
			}else{
				var jt = $.parseJSON(jtext);
				if(jt.ErrCode=="0"){
					if(jt.retData.RecInfo==""){
						//readPub(jt2,card_serial);//读公共信息
						sync(jt2,card_serial,jt3);//同步
					}else{
						if(jt3.retData.CardStat=="0"){//不是黑名单卡
							var param = {};
							param['jdevid'] = "0";
							param['jdev_bh'] = "0";
							param['jcmdline'] = jt.retData.RecInfo;
							$.postEx(upLoadCard,param,function(retJson){
								if(retJson.result){
									ClearRec(jt2,card_serial,jt3);//清除离线记录
								}else{
									info_div.html("充值纠错成功！");
									exitWin();
								}
							});
						}else{//黑名单卡不能清除离线记录
							//readPub(jt2,card_serial);//读公共信息
							info_div.html("充值纠错成功！");
							exitWin();
						}
					}
				}else{
					info_div.html("充值纠错成功！");
					exitWin();
				}
			}
		},'读卡片离线记录',$.toJSON(params),"5000");
	}
	
	//清除离线记录
	function ClearRec(jt2,card_serial,jt3){
		var params = {
			"commandSet":[{
				"funName":"IonClearRec", 
				"param":""
			}]
		};
		jmjlink.send(function(jtype,jtext,jpre_str){
			if(jtype==2){
				info_div.html("充值纠错成功！");
				exitWin();
			}else{
				var jt = $.parseJSON(jtext);
				if(jt.ErrCode=="0"){
					//readPub(jt2,card_serial);//读公共信息
					sync(jt2,card_serial,jt3);//同步
				}else{
					info_div.html("充值纠错成功！");
					exitWin();
				}
			}
		},'清除卡片离线记录',$.toJSON(params));
	}
	
	//同步
	function sync(jt2,card_serial,jt3){
		var param = {};
		param['media_id'] = jt2.retData.CardType;
		param['card_serial'] = card_serial;
		param['card_trad_serial'] = jt3.retData.CardTradSerial;
		param['device_id'] = "0";
		param['card_number'] = jt2.retData.CardNo;
		$.postEx(syncCard,param,function(retJson){
			if(retJson.result && retJson.data.length>0){
				var params = {
					"commandSet":[{
						"funName":"IonSyncWallet", 
						"param":{
							"LogicCardNo":card_serial,
							"CardTradSerial":jt3.retData.CardTradSerial,
							"OldBalance":"0",
							"NewBalance":retJson.data[0].cash_amt
						}
					},{
						"funName":"IonSyncSub",
						"param":retJson.data[0].sub_info
					},{
						"funName":"IonSyncSum",
						"param":retJson.data[0].sum_info
					}]
				};
				jmjlink.send(function(jtype,jtext,jpre_str){
					if(jtype==2){
						info_div.html("充值纠错成功！");
						exitWin();
					}else{
						var jt = $.parseJSON(jtext);
						if(jt.ErrCode=="0"){
							info_div.html("充值纠错成功！");
							exitWin();
						}else{
							info_div.html("充值纠错成功！");
							exitWin();
						}
					}
				},'卡片同步',$.toJSON(params));
			}else{
				info_div.html("充值纠错成功！");
				exitWin();
			}
		});
	}
	
	//读卡发行信息
	function readIssu(jt2,card_serial){
		var params = {
			"commandSet":[{
				"funName":"IonReadIssuInfo", 
				"param":""
			}]
		};
		jmjlink.send(function(jtype,jtext,jpre_str){
			if(jtype==2){
				info_div.html("充值纠错成功！");
				exitWin();
			}else{
				var jt = $.parseJSON(jtext);
				if(jt.ErrCode=="0"){
					if(jt.retData.LogicCardNo==card_serial){
						//readRec(jt2,card_serial);
						readPub(jt2,card_serial);
					}else{
						info_div.html("充值纠错成功！");
						exitWin();
					}
				}else{
					info_div.html("充值纠错成功！");
					exitWin();
				}
			}
		},'读发行信息',$.toJSON(params));
	}
	
	//读卡公共信息
	function readPub(jt2,card_serial){
		var params = {
			"commandSet":[{
				"funName":"IonReadPubInfo", 
				"param":""
			}]
		};
		jmjlink.send(function(jtype,jtext,jpre_str){
			if(jtype==2){
				info_div.html("充值纠错成功！");
				exitWin();
			}else{
				var jt = $.parseJSON(jtext);
				if(jt.ErrCode=="0"){
					//sync(jt2,card_serial,jt);//同步
					readRec(jt2,card_serial,jt);
				}else{
					info_div.html("充值纠错成功！");
					exitWin();
				}
			}
		},'读公共信息',$.toJSON(params));
	}
	
	function exitWin(){
		window.setTimeout(function(){
			if(exit == 1){
				jqObj.window("close");
			}
		},1000);
	}
});