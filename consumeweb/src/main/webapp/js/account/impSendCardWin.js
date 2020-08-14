//卡号导入提示窗
garen_define("js/account/impSendCardWin",function (jqObj,loadParams) {

	var jmjlink = garen_require("js/lib/jmjlink");//卡控件
	
	var cardProvide = "account/cardProvide.do";//发卡

	var flag = 1;//寻卡标志
	
	var exit = 1;//退出Win标志
	
	var success = 0 ;//完成标志
	
	var account_id = loadParams.params.ids;
	
	var i = 0;
	
	var length = loadParams.params.ids.length;
	
	var card_number = "";
	
	var media_id = "";
	var failedValid = loadParams.params.failedValid;
	var sendedCard = loadParams.params.sendedCard;
	var checkedTotalNum = loadParams.params.checkedTotalNum;
	var sendFailedCard = loadParams.params.sendFailedCard;
	var sendCardSucess =sendedCard; // 发卡成功计数
	var sendCardFaild =sendFailedCard;// 发卡失败计数
	
	var northUI = {
			eName:"div",
			cssClass:"cardManage_provideWin",
			elements:{
				eName:"div",
				cssClass:"cardManage_provideWin_div_imp",
				id:"info_div"
			}
		}
		
		var centerUI = {
			eName:"div",
			cssClass:"cardManage_provideWin",
			elements:{
				eName:"linkbutton",
				uId:"tm1",
				name:"confirmBtn",
				cssClass:"cardManage_searchWin_linkbutton",
				text : '确定',
				disabled:true,
				width : 80,
				height : 35,
				onClick:function(){
					flag = 0;
					exit = 0;
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
	var confirmBtn = jqObj.findJq("confirmBtn");
	searchCard();
	
	// 发卡
	function searchCard(){
		// 直接发附卡
		provide(account_id);
	}
	
	/**
	 * 发附卡
	 */
	function provide(account_id){

			card_number = account_id[i].card_no;
			media_id = account_id[i].card_lx;
			$("#info_div").attr("class","cardManage_provideWin_div_ip");
			info_div.html("正在发卡...");
			loadParams.callColor(account_id[i].account_id,"1",account_id[i].column_index);
			provideCard1(account_id);
	}
	
	//发卡 row account_id[i]
	function provideCard1(account_id){
		var param = {};
		param['account_id'] = account_id[i].account_id;
		// 导入卡号
		param['card_number'] = account_id[i].card_no;
		// 卡号类型
		param['media_id'] = account_id[i].card_lx;
		param['is_main_card'] = loadParams.params.is_main_card;
		param['old_card_serial'] = "0";
		$.postEx(cardProvide,param,function(retJson){
			
			if(retJson.result){
				// 卡片导入发附卡类型 2 添加  add by LYh 20170609
				if(loadParams.params.is_main_card=="2") {
					sendCardSucess = sendCardSucess+1;
					loadParams.callback(account_id[i].account_id,account_id[i].column_index);//回调改变字段
					if(i==length-1){
						//sendCardSucess = sendCardSucess+sendedCard;
						//附卡
						//info_div.html("发卡成功");
						
						flag = 0;
						exit = 0;
						$("#info_div").attr("class","cardManage_provideWin_div_imp");
						info_div.html("选中数据条目共:"+checkedTotalNum+"条<br/>" +
								"未通过验证:"+failedValid+"条<br/>" +
								"已发卡:"+sendCardSucess+"条<br/>" +
							    "发卡失败:"+sendCardFaild+"条");
						
						success = 1;
						confirmBtn.linkbutton("enable");
						/*window.setTimeout(function(){
							jqObj.window("close");
						},909000);*/
						
					} else if(i!=length-1){
						i++;
						/*window.setTimeout(function(){
							searchCard();
						},10);*/
						searchCard();
					}
				}
				
			}else{
				sendCardFaild = sendCardFaild+1;
				//info_div.html(retJson.info);
				loadParams.callColor(account_id[i].account_id,"0",account_id[i].column_index,retJson.info);
				if (retJson.info=="错误") {
					$.alert("您与服务器已断开连接,请检查！");
					flag = 0;
					exit = 0;
					success = 1;
					jqObj.window("close");
					return false;
				}
				if (i==length-1) {
					//sendCardFaild = sendCardFaild+sendFailedCard;
					flag = 0;
					exit = 0;
					$("#info_div").attr("class","cardManage_provideWin_div_imp");
					info_div.html("选中数据条目共:"+checkedTotalNum+"条<br/>" +
							"未通过验证:"+failedValid+"条<br/>" +
							"已发卡:"+sendCardSucess+"条<br/>" +
						    "发卡失败:"+sendCardFaild+"条");
					
					success = 1;
					confirmBtn.linkbutton("enable");
					/*window.setTimeout(function(){
						jqObj.window("close");
					},909000);*/
				} else if (i!=length-1) {
					i++;
					/*window.setTimeout(function(){
						searchCard();
					},10);*/
					searchCard();
				}
				
			}
		});
	}
	
	//关闭
	jqObj.updateOpt("panel",{
		onBeforeClose:function(){
			if(success == 1){
				return true;//true 关闭 false不关闭
			}else{
				return false;
			}
			
		}
	});
	
});