//读卡提示窗
garen_define("js/account/accountManage_readCardWin",function (jqObj,loadParams) {

	
	var base = garen_require("js/base/ws_public");
	var allReadCard = base.allReadCard;//读卡
	
	var jmjlink = garen_require("js/lib/jmjlink");//卡控件
	
	var exit = 1;//退出Win标志
	
	var mainUI = {
		eName:"div",
		cssClass:"cardManage_provideWin",
		elements:{
			eName:"div",
			cssClass:"cardManage_provideWin_div",
			elements:[{
				eName:"img",
				cssClass:"readCardWin_img",
				src:"themes/default/images/loading.gif"
			},{
				eName:"span",
				cssClass:"readCardWin_span",
				elements:"正在读卡，请勿移开卡片！"
			}]
		}
	}
	
	jqObj.loadUI(mainUI);
	
	//关闭
	jqObj.updateOpt("panel",{
		onBeforeClose:function(){
			exit = 0;
			return true;//true 关闭 false不关闭
		}
	});
	
	//searchCard();
	readCard();
	
	function readCard(){
		jmjlink.accountManageReadCard(function(jt){
			if(jt){
				var param = {};
				param['card_number'] = jt.retData.CardNo;
				param['media_id'] = jt.retData.CardType;
				$.postEx(allReadCard,param,function(retJson){
					if(retJson.result && retJson.data.length>0){
						if(exit == 1){
							loadParams.callback(retJson,1,jt);
							jqObj.window("close");
						}
						
					}else{
						if(exit == 1){
							loadParams.callback(retJson,0,jt);
							jqObj.window("close");
						}
					}
				});
			}else{
				jqObj.window("close");
			}
			
		});
	}
});