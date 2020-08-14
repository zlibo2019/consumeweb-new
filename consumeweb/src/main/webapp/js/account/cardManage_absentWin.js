//退卡提示窗
garen_define("js/account/cardManage_absentWin",function (jqObj,loadParams) {

	var saveCardAuthCode = "account/saveCardAuthCode.do"//保存卡片认证码
		
	var absentCard = "account/absentCard.do";//卡片退卡
	
	var absentCardAfter = "account/absentCardAfter.do";//卡片退卡后续
	
	var jmjlink = garen_require("js/lib/jmjlink");//卡控件
	
	var base = garen_require("js/base/ws_public");
	
	var queryIsMainCard = base.queryIsMainCard;//查询主附卡
	
	var upLoadCard = "account/upLoadCard.do";//上传卡片离线记录
	
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
						info_div.html("正在退卡...");
						validCard(jt);
					}else if(jt.ErrCode=="-102"){
						info_div.html("请将卡放到读卡器上！");
						//无卡退卡
						$.confirm("未读到卡片，是否无卡退卡？",function(c){
							if(c){
								var param = {};
								param['card_serial'] = loadParams.params.row.card_serial;
								param['account_id'] = loadParams.params.account_id;
								$.postEx(absentCard,param,function(retJson){
									if(retJson.result){
										info_div.html("退卡成功！");
										successBeep();
										//loadParams.callback();
										exitWin();
									}else{
										info_div.html(retJson.info);
										errorBeep();
									}
								});
							}else{
								info_div.html("退卡失败！");
								errorBeep();
							}
						});
						
						
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
	
	//验证卡片一致性
	function validCard(jt){
		var row = loadParams.params.row;
		if(jt.retData.CardNo!=row.card_number || jt.retData.CardType!=row.media_id){
			info_div.html("卡片不一致，请换正确卡片！");
			errorBeep();
		}else{
			var param = {};
			param['account_id'] = loadParams.params.account_id;
			param['card_number'] = row.card_number;
			param['media_id'] = row.media_id;
			$.postEx(queryIsMainCard,param,function(retJson){
				if(retJson.result){
					if(retJson.data[0].is_main_card==1){//主卡
						checkCardDealerKey(jt);
					}
					else if(retJson.data[0].is_main_card==0){//附卡
						var param = {};
						param['card_serial'] = row.card_serial;
						param['account_id'] = loadParams.params.account_id;
						$.postEx(absentCard,param,function(retJson){
							if(retJson.result){
								info_div.html("退卡成功！");
								successBeep();
								//loadParams.callback();
								exitWin();
							}else{
								info_div.html(retJson.info);
								errorBeep();
							}
						});
					}
				}else{
					info_div.html(retJson.info);
				}
			});
		}
	}
	
	//验证卡片代理商密钥
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
					var row = loadParams.params.row;
					var param = {};
					param['card_serial'] = row.card_serial;
					param['account_id'] = loadParams.params.account_id;
					$.postEx(absentCard,param,function(retJson){
						if(retJson.result){
							$.postEx(absentCardAfter,param,function(retJson){
								if(retJson.result){
									info_div.html("退卡成功！");
									successBeep();
									//loadParams.callback();
									exitWin();
								}else{
									info_div.html(retJson.info);
									errorBeep();
								}
							});
						}else{
							info_div.html(retJson.info);
							errorBeep();
						}
					});
//					var param = {};
//					param['card_serial'] = row.card_serial;
//					param['account_id'] = loadParams.params.account_id;
//					$.postEx(absentCardAfter,param,function(retJson){
//						if(retJson.result){
//							info_div.html("退卡成功！");
//							successBeep();
//							loadParams.callback();
//							if(exit == 1){
//								jqObj.window("close");
//							}
//						}else{
//							info_div.html(retJson.info);
//							errorBeep();
//						}
//					});
				}else{
					readIssu(jt2);
				}
			}
		},'密钥验证',$.toJSON(params));
	}
	
//	//退卡
//	function absent(jt,row){
//		if(row.Is_card_replace!=3){
//			var param = {};
//			param['card_serial'] = jt.retData.LogicCardNo;
//			param['account_id'] = loadParams.params.account_id;
//			$.postEx(absentCard,param,function(retJson){
//				if(retJson.result){
//					absentCmd(jt);
//				}else{
//					info_div.html(retJson.info);
//				}
//			});
//		}else{
//			absentCmd(jt);
//		}
//	}
//	
//	//退卡指令
//	function absentCmd(jt2){
//		var params = {
//				"commandSet":[{
//					"funName":"IonResetToCardDealerKey", 
//					"param":""
//				}]	
//			};
//			jmjlink.send(function(jtype,jtext,jpre_str){
//				var jt = $.parseJSON(jtext);
//				if(jt.ErrCode=="0"){
//					var param = {};
//					param['card_serial'] = jt2.retData.LogicCardNo;
//					param['account_id'] = loadParams.params.account_id;
//					$.postEx(absentCardAfter,param,function(retJson){
//						if(retJson.result){
//							info_div.html("退卡成功！");
//							loadParams.callback();
//							if(exit == 1){
//								jqObj.window("close");
//							}
//						}else{
//							info_div.html(retJson.info);
//						}
//					});
//				}else{
//					info_div.html(jt.ErrMsg);
//				}
//			},'退主卡1',$.toJSON(params));
//	}
	
	//退卡2
	function absent2(jt,row){
		if(row.Is_card_replace!=3){//非退卡后续
			var param = {};
			param['card_serial'] = jt.retData.LogicCardNo;
			param['account_id'] = loadParams.params.account_id;
			$.postEx(absentCard,param,function(retJson){
				if(retJson.result){
					absent2Cmd(jt);
				}else{
					info_div.html(retJson.info);
					errorBeep();
				}
			});
		}else{//写卡未完成
			absent2Cmd(jt);
		}
	}
	
	//退卡2指令
	function absent2Cmd(jt2){
		var params = {
				"commandSet":[{
					"funName":"IresetToCardDealerKey1", 
					"param": {
						"LogicCardNo":jt2.retData.LogicCardNo,
						"CardAuthCode":jt2.retData.CardAuthCode,
						"SectorList":jt2.retData.SectorList
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
						param['card_serial'] = jt2.retData.LogicCardNo;
						param['account_id'] = loadParams.params.account_id;
						$.postEx(absentCardAfter,param,function(retJson){
							if(retJson.result){
								info_div.html("退卡成功！");
								successBeep();
								//loadParams.callback();
								exitWin();
							}else{
								info_div.html(retJson.info);
								errorBeep();
							}
						});
					}else{
						info_div.html("退卡错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
						errorBeep();
					}
				}
			},'退主卡2',$.toJSON(params),"5000");
	}
	
	//退卡3指令
	function absent3Cmd(row){
		var params = {
				"commandSet":[{
					"funName":"IresetToCardDealerKey1", 
					"param": {
						"LogicCardNo":row.card_serial,
						"CardAuthCode":row.card_authcode,
						"SectorList":row.sector_list==undefined?"":row.sector_list
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
						param['card_serial'] = row.card_serial;
						param['account_id'] = loadParams.params.account_id;
						$.postEx(absentCardAfter,param,function(retJson){
							if(retJson.result){
								info_div.html("退卡成功！");
								successBeep();
								//loadParams.callback();
								exitWin();
							}else{
								info_div.html(retJson.info);
								errorBeep();
							}
						});
					}else{
						info_div.html("退卡后续错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
						errorBeep();
					}
				}
			},'退主卡3',$.toJSON(params),"5000");
	}
	
	//读卡发行信息
	function readIssu(jt2){
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
				var row = loadParams.params.row;
				if(jt.ErrCode=="0"){
					if(row.card_state!=1){//不是挂失卡
						readRec(jt,jt2,row);
					}else{//挂失卡不能读离线记录
						//absent2(jt,row);
						saveCardCode(jt,jt2,row);
					}
				}else{
					//读发行信息失败，且有认证码、写法未完成标志，执行发卡后续
					if(row.card_authcode && row.Is_card_replace==3){
						absent3Cmd(row);
					}else{
						info_div.html("读发行信息错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
						errorBeep();
					}
				}
			}
		},'读发行信息',$.toJSON(params));
	}
	
	function saveCardCode(jt1,jt2,row){
		if(row.card_authcode){
			absent2(jt1,row);
		}else{
			var params = {};
			params['card_serial'] = jt1.retData.LogicCardNo;
			params['card_number'] = jt2.retData.CardNo;
			params['media_id'] = jt2.retData.CardType;
			params['card_authcode'] = jt1.retData.CardAuthCode;
			params['sector_list'] = jt1.retData.SectorList;
			$.postEx(saveCardAuthCode,params,function(retJson){
				if(retJson.result){
					//row.card_authcode = jt.retData.CardAuthCode;
					absent2(jt1,row);
				}else{
					info_div.html(retJson.info);
					errorBeep();
				}
			});
		}
	}
	
	//读卡片离线记录
	function readRec(jt1,jt2,row){
		var params = {
			"commandSet":[{
				"funName":"IonReadRec", 
				"param":""
			}]
		};
		jmjlink.send(function(jtype,jtext,jpre_str){
			if(jtype==2){
				info_div.html(jpre_str);
			}else{
				var jt = $.parseJSON(jtext);
				if(jt.ErrCode=="0"){
					if(jt.retData.RecInfo==""){//无离线记录
						saveCardCode(jt1,jt2,row);
					}else{
						var param = {};
						param['jdevid'] = "0";
						param['jdev_bh'] = "0";
						param['jcmdline'] = jt.retData.RecInfo;
						$.postEx(upLoadCard,param,function(retJson){
							if(retJson.result){
								ClearRec(jt1,jt2,row);//清除离线记录
							}else{
								info_div.html(retJson.info);
								errorBeep();
							}
						});
					}
				}else{
					info_div.html("读离线记录错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
					errorBeep();
				}
			}
		},'读卡片离线记录',$.toJSON(params),"5000");
	}
	
	//清除离线记录
	function ClearRec(jt1,jt2,row){
		var params = {
			"commandSet":[{
				"funName":"IonClearRec", 
				"param":""
			}]
		};
		jmjlink.send(function(jtype,jtext,jpre_str){
			if(jtype==2){
				info_div.html(jpre_str);
			}else{
				var jt = $.parseJSON(jtext);
				if(jt.ErrCode=="0"){
					//absent2(jt1,row);
					saveCardCode(jt1,jt2,row);
				}else{
					info_div.html("清除离线记录错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
					errorBeep();
				}
			}
		},'清除卡片离线记录',$.toJSON(params));
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