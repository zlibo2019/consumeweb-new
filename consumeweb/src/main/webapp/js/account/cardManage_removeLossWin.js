//解挂提示窗
garen_define("js/account/cardManage_removeLossWin",function (jqObj,loadParams) {

	var unLossCard = "account/unLossCard.do";//卡片解挂
	
	var base = garen_require("js/base/ws_public");
	var allReadCard = base.allReadCard;//读卡
	
	var queryIsMainCard = base.queryIsMainCard;//查询主附卡
	
	var jmjlink = garen_require("js/lib/jmjlink");//卡控件
	
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
			loadParams.callback();
			//jqObj.window("close");
			return true;//true 关闭 false不关闭
		}
	});
	
	//searchCard();
	
	//寻卡指令
	/*function searchCard(){
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
						info_div.html("正在解挂...");
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
	}*/
	
	//验证卡片一致性
	/*function validCard(jt){
		var row = loadParams.row;
		if(jt.retData.CardNo!=row.card_number 
				|| jt.retData.CardType!=row.media_id){
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
						removeLoss(1);
					}
					else if(retJson.data[0].is_main_card==0){//附卡
						removeLoss(0);
					}
				}else{
					info_div.html(retJson.info);
				}
			});
		}
	}*/
	
	/*loadInit();
	
	function loadInit(){
		info_div.html("正在解挂...");
		var param = {};
		var row = loadParams.row;
		param['account_id'] = loadParams.params.account_id;
		param['card_number'] = row.card_number;
		param['media_id'] = row.media_id;
		$.postEx(queryIsMainCard,param,function(retJson){
			if(retJson.result){
				if(retJson.data[0].is_main_card==1){//主卡
					removeLoss(1);
				}
				else if(retJson.data[0].is_main_card==0){//附卡
					removeLoss(0);
				}
			}else{
				info_div.html(retJson.info);
			}
		});
	}*/
	
	removeLoss();
	
	function removeLoss(){
		$.postEx(unLossCard,loadParams.params,function(retJson){
			if(retJson.result){
				/*if(is_main_card==1){//主卡
					clear();
				}else{//附卡
					info_div.html("解挂成功！");
					successBeep();
					if(exit == 1){
						window.setTimeout(function(){
							jqObj.window("close");
						},1000);
					}
				}*/
				info_div.html("解挂成功！");
				successBeep();
				exitWin();
			}else{
				info_div.html(retJson.info);
				errorBeep();
			}
		});
	}
	
	/*function clear(){
		var params = {
			"commandSet":[{
				"funName":"IonSetCardStat", 
				"param": "0"
			}]	
		};
		jmjlink.send(function(jtype,jtext,jpre_str){
			var jt = $.parseJSON(jtext);
			if(jt.ErrCode=="0"){
				info_div.html("解挂成功！");
				successBeep();
				if(exit == 1){
					window.setTimeout(function(){
						jqObj.window("close");
					},1000);
				}
			}else{
				info_div.html("解挂成功，清除卡片黑名单标志失败！");
			}
		},'清除卡片黑名单',$.toJSON(params));
	}*/
	
	
	
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