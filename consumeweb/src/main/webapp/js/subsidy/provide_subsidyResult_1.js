//发放成功结果
garen_define("js/subsidy/provide_subsidyResult_1",function (jqObj,loadParams) {
	
	var centerUI = {
		eName:"div",
		height:80,
		cssStyle:"background:#f4f4f4;",
		elements:{
			eName:"div",
			height:'100%',
			cssStyle:"margin-left:60px;line-height:80px;",
			elements:{
				eName:"div",
				cssClass:"provide_subsidyResultdiv",
				elements:[{
					eName:'span',
					cssClass:'provide_subsidyResult_text',
					text:'成功发放补助'
				},{
					eName:'span',
					cssClass:'provide_subsidyResult_number',
					elements:loadParams.retData[0].count
				},{
					eName:'span',
					cssClass:'provide_subsidyResult_text',
					text:'笔,发放总额'
				},{
					eName:'span',
					cssClass:'provide_subsidyResult_number',
					elements:loadParams.retData[0].subamts_str
				},{
					eName:'span',
					cssClass:'provide_subsidyResult_text',
					text:'元。'
				}]
			}
		}
	};
	
	var southUI = {
		eName:'div',
		cssClass:'closeAccount_resultWin_southdiv',
		elements:{
			eName : 'linkbutton',
			uId:"tm1",
			cssClass:"cardManage_searchWin_linkbutton",
			width:80,
			height:35,
			text:"确定",
			onClick : function(){
				jqObj.window("close");
			}
		}
	}
	
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
			loadParams.callback();
			return true;//true 关闭 false不关闭
		}
	});
	
	
});