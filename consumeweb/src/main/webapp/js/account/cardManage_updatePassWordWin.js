//重置卡片密码提示窗
garen_define("js/account/cardManage_updatePassWordWin",function (jqObj,loadParams) {

	var jmjlink = garen_require("js/lib/jmjlink");//卡控件
	
	var updateCardPassWord = "account/updateCardPassWord.do";//修复卡片密码
	
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
	
	//卡片验证
	function cardValid(jt){
		var param = {};
		param['account_id'] = loadParams.params;
		//param['card_serial'] = jt.retData.LogicCardNo;
		param['card_number'] = jt.retData.CardNo;
		param['media_id'] = jt.retData.CardType;
		$.postEx(validCard,param,function(retJson){
			if(retJson.result){
				if(retJson.data[0].is_main_card==1){//主卡
					readIssu(retJson.data[0].card_serial);
				}else if(retJson.data[0].is_main_card==0){//附卡
					info_div.html("附卡不能修复密码！");
					errorBeep();
				}
			}else{
				info_div.html(retJson.info);
				errorBeep();
			}
		});
	}
	
	//重置卡片密码
	function updatePassWord(jt){
		var param = {};
		param['account_id'] = loadParams.params;
		param['card_serial'] = jt.retData.LogicCardNo;
		$.postEx(updateCardPassWord,param,function(retJson){
			if(retJson.result && retJson.data.length>0){
				updateCmd(retJson.data[0].new_pass);
			}else{
				info_div.html(retJson.info);
				errorBeep();
			}
		});
	}
	
	//重置指令
	function updateCmd(password){
		var params = {
				"commandSet":[{
					"funName":"IonResetPwd", 
					"param": password
				}]	
			};
			jmjlink.send(function(jtype,jtext,jpre_str){
				if(jtype==2){
					info_div.html(jpre_str);
				}else{
					var jt = $.parseJSON(jtext);
					if(jt.ErrCode=="0"){
						info_div.html("修复密码成功！");
						successBeep();
						//loadParams.callback();
						exitWin();
					}else{
						info_div.html("修复密码错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
						errorBeep();
					}
				}
			},'修复卡片密码',$.toJSON(params));
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
					//updatePassWord(jt.retData.LogicCardNo);
					//cardValid(jt,jt2);
					if(jt.retData.LogicCardNo==card_serial && jt.retData.LogicCardNo==loadParams.eastrow.card_serial){
						info_div.html("正在修复卡片密码...");
						updatePassWord(jt);
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