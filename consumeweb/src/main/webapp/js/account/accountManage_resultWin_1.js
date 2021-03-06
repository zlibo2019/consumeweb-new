//账户管理成功结果提示窗
garen_define("js/account/accountManage_resultWin_1",function (jqObj,loadParams) {
	
	var centerUI = {
		eName:"div",
		height:80,
		cssStyle:"background:#f4f4f4;",
		elements:loadDiv()
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
				jqObj.window("close");
			}
		}
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
	
	function loadDiv(){
		if(loadParams.configs.event_id == "9"){
			var divUI = {
				eName:"div",
				height:'100%',
				cssStyle:"font-size:23px;line-height:80px;text-align:center;",
				elements:[{
					eName:"span",
					cssStyle:"color:#c9c9c9;",
					elements:"冻结成功"
				},{
					eName:"span",
					cssStyle:"margin: 0 5px 0 5px;color:#FBBC6C;",
					elements:loadParams.params.retData.suc_count + ""
				},{
					eName:"span",
					cssStyle:"color:#c9c9c9;",
					elements:"人，冻结失败"
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
		}else if(loadParams.configs.event_id == "8"){
			var divUI = {
				eName:"div",
				height:'100%',
				cssStyle:"font-size:23px;line-height:80px;text-align:center;",
				elements:[{
					eName:"span",
					cssStyle:"color:#c9c9c9;",
					elements:"解冻成功"
				},{
					eName:"span",
					cssStyle:"margin: 0 5px 0 5px;color:#FBBC6C;",
					elements:loadParams.params.retData.suc_count + ""
				},{
					eName:"span",
					cssStyle:"color:#c9c9c9;",
					elements:"人，解冻失败"
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
		}else if(loadParams.configs.event_id == "10"){
			var divUI = {
				eName:"div",
				height:'100%',
				cssStyle:"font-size:23px;line-height:80px;text-align:center;",
				elements:[{
					eName:"span",
					cssStyle:"color:#c9c9c9;",
					elements:"重置密码成功"
				},{
					eName:"span",
					cssStyle:"margin: 0 5px 0 5px;color:#FBBC6C;",
					elements:loadParams.params.retData.suc_count + ""
				},{
					eName:"span",
					cssStyle:"color:#c9c9c9;",
					elements:"人，重置密码失败"
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
		}else if(loadParams.configs.event_id == "12"){
			var divUI = {
				eName:"div",
				height:'100%',
				cssStyle:"font-size:23px;line-height:80px;text-align:center;",
				elements:[{
					eName:"span",
					cssStyle:"color:#c9c9c9;",
					elements:"修改有效期成功"
				},{
					eName:"span",
					cssStyle:"margin: 0 5px 0 5px;color:#FBBC6C;",
					elements:loadParams.params.retData.suc_count + ""
				},{
					eName:"span",
					cssStyle:"color:#c9c9c9;",
					elements:"人，修改有效期失败"
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
		}else if(loadParams.configs.event_id == "101"){
			var divUI = {
				eName:"div",
				height:'100%',
				cssStyle:"font-size:23px;line-height:80px;text-align:center;",
				elements:[{
					eName:"span",
					cssStyle:"color:#c9c9c9;",
					elements:"启用指纹消费成功"
				},{
					eName:"span",
					cssStyle:"margin: 0 5px 0 5px;color:#FBBC6C;",
					elements:loadParams.params.retData.suc_count + ""
				},{
					eName:"span",
					cssStyle:"color:#c9c9c9;",
					elements:"人，启用指纹消费失败"
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
		}else if(loadParams.configs.event_id == "102"){
			var divUI = {
				eName:"div",
				height:'100%',
				cssStyle:"font-size:23px;line-height:80px;text-align:center;",
				elements:[{
					eName:"span",
					cssStyle:"color:#c9c9c9;",
					elements:"禁用指纹消费成功"
				},{
					eName:"span",
					cssStyle:"margin: 0 5px 0 5px;color:#FBBC6C;",
					elements:loadParams.params.retData.suc_count + ""
				},{
					eName:"span",
					cssStyle:"color:#c9c9c9;",
					elements:"人，禁用指纹消费失败"
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
		}
		return divUI;
	}
	
	//关闭
	jqObj.updateOpt("panel",{
		onBeforeClose:function(){
			loadParams.loadP.callback();
			return true;//true 关闭 false不关闭
		}
	});
	
});