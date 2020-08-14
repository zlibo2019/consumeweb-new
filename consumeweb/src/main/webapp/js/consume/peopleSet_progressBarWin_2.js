//按人员更换人群进度条提示窗
garen_define("js/consume/peopleSet_progressBarWin_2",function (jqObj,loadParams) {
	
	var changeUserRelated = "consume/changeUserRelated.do";//批量充值
	var utils = garen_require("utils");
	
	var centerUI = {
		eName:"div",
		height:'100%',
		cssStyle:"background:#f4f4f4;",
		elements:{
			eName:"progressBar",
			height:60,
			cssStyle:"margin-left:60px;line-height:60px;",
			elements:''
		}
	};
		
	var mainUI = {
		eName : 'layoutExt',// 容器布局类，jeasyui组件
		cssStyle:'font-family: 微软雅黑, Arial;',
		fit : true,
		elements : [{
			region : 'center',
			elements : centerUI
		}]
	}
	
	jqObj.loadUI(mainUI);
	
	var bar = jqObj.findJq('progressBar');
	
	loadInit();
	
	function loadInit(){
		var p = loadParams.params.params2;
		bar.progressBar("setTitle","更换人群进度");
		bar.progressBar("setTitleWidth","80");
		bar.progressBar('start');
		var params = {};
		params['crowd_id'] = p.crowd_id;
		params['user_serial'] = p.user_serial;
        $.postEx(changeUserRelated,params,function(retJson){
			if(retJson.result){
				bar.progressBar('stop');
				if(retJson.data.length<1){//没有失败数据
					var myWin = $.createWin({
						title:"操作提示",
						width:600,
						height:180,
						queryParams:{
							params:retJson,
							loadP:loadParams.params
						},
						url:"js/consume/peopleSet_resultWin.js"
					});
					jqObj.window("close");
				}else{
					var myWin = $.createWin({
						title:"操作提示",
						width:600,
						height:450,
						queryParams:{
							params:retJson,
							loadP:loadParams.params
						},
						url:"js/consume/peopleSet_resultWin_2.js"
					});
					jqObj.window("close");
				}
			}else{
				bar.progressBar('stop');
				jqObj.window("close");
				$.alert(retJson.info);
			}
		});
	}
	
	//关闭
	jqObj.updateOpt("panel",{
		onBeforeClose:function(){
			return true;//true 关闭 false不关闭
		}
	});
	
});