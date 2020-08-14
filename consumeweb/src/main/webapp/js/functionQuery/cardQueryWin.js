//读卡提示窗
garen_define("js/functionQuery/cardQueryWin",function (jqObj,loadParams) {

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
		jmjlink.readCard(function(jt){
			if(jt){
				loadParams.callback(jt,1);
				if(exit == 1){
					jqObj.window("close");
				}
			}else{
				loadParams.callback(jt,0);
				jqObj.window("close");
			}
			
		});
	}
});