/*解除设备关联成功提示窗*/

garen_define("js/equipment/merchantAssign_resultWin_1",function (jqObj,loadParams) {
	
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
				elements:"解除成功"
			},{
				eName:"span",
				cssStyle:"margin: 0 5px 0 5px;color:#FBBC6C;",
				elements:loadParams.params.retData.suc_count + ""
			},{
				eName:"span",
				cssStyle:"color:#c9c9c9;",
				elements:"台，解除失败"
			},{
				eName:"span",
				cssStyle:"margin: 0 5px 0 5px;color:#FBBC6C;",
				elements:loadParams.params.retData.err_count + ""
			},{
				eName:"span",
				cssStyle:"color:#c9c9c9;",
				elements:"台。"
			}]
		}
	};
	
	var southUI = {
		eName:"div",
		cssClass:"closeAccount_resultWin_southdiv",
		elements:{
			eName:"linkbutton",
			uId:"tm1",
			cssClass:"cardManage_searchWin_linkbutton",
			text : '确定',
			width : 80,
			height : 35,
			onClick:function(){
				$.alert("设备在线生效，请检查设备待机界面商户提示！");
				jqObj.window("close");
			}
		}
	};
	
	var mainUI = {
		eName:"layoutExt",
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
			loadParams.loadP.callback();//刷新列表
			return true;//true 关闭 false不关闭
		}
	});

});	
