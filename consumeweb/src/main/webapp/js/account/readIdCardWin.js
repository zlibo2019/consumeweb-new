//读身份证提示窗
garen_define("js/account/readIdCardWin",function (jqObj,loadParams) {

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
				elements:"正在读身份证，请勿移开！"
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
	readIdCard();
	
	function readIdCard(){
		jmjlink.readIdCard(function(jt){
			if(jt){
				loadParams.callback(jt);
				if(exit == 1){
					jqObj.window("close");
				}
			}else{
				jqObj.window("close");
			}
			
		});
	}
});