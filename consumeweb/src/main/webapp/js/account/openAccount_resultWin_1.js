//开户成功结果提示窗
garen_define("js/account/openAccount_resultWin_1",function (jqObj,loadParams) {
	
	var card_exit = 0;//是否是发卡退出
	
	var centerUI = {
		eName:"div",
		height:80,
		cssStyle:"background:#f4f4f4;",
		elements:{
			eName:"div",
			height:'100%',
			cssStyle:"font-size:23px;line-height:80px;text-align:center;",
			elements:[{
				eName:"span",
				cssStyle:"color:#c9c9c9;",
				elements:"开户成功"
			},{
				eName:"span",
				cssStyle:"margin: 0 5px 0 5px;color:#FBBC6C;",
				elements:loadParams.params.retData.suc_count + ""
			},{
				eName:"span",
				cssStyle:"color:#c9c9c9;",
				elements:"人，开户失败"
			},{
				eName:"span",
				cssStyle:"margin: 0 5px 0 5px;color:#FBBC6C;",
				elements:loadParams.params.retData.err_count + ""
			},{
				eName:"span",
				cssStyle:"color:#c9c9c9;",
				elements:"人。"
			}]
		}
	};
	
	var southUI = {
		eName:"div",
		cssClass:"openAccount_resultWin_southdiv",
		elements:[{
			eName:"linkbutton",
			uId:"tm1",
			cssClass:"cardManage_searchWin_linkbutton",
			text : '确定',
			width : 80,
			height : 35,
			onClick:function(){
				jqObj.window("close");
			}
		},{
			eName:"linkbutton",
			uId:"tm1",
			cssClass:"cardManage_searchWin_linkbutton",
			text : '开始发卡',
			width : 80,
			height : 35,
			onClick:function(){
				card_exit = 1;
				jqObj.window("close");
			}
		}]
	};
		
	var mainUI = {
		eName : 'layoutExt',// 容器布局类，jeasyui组件
		cssStyle:'font-family: 微软雅黑, Arial;',
		fit : true,
		elements : [{
			region : 'center',
			elements : centerUI
		},{
			region : 'south',
			height:50,
			elements : southUI
		}]
	}
	
	jqObj.loadUI(mainUI);
	

	//关闭
	jqObj.updateOpt("panel",{
		onBeforeClose:function(){
			if(!card_exit){//不是发卡退出则回调刷新页面
				loadParams.loadP.callback();
			}else{
				loadParams.loadP.provideC(loadParams.ids);
			}
			return true;//true 关闭 false不关闭
		}
	});
	
});