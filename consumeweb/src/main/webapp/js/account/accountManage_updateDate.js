//更新有效期
garen_define("js/account/accountManage_updateDate",function (jqObj,loadParams) {
	
	var addDepUI = {
		eName:"div",
		cssClass:"accountManage_resetPwd_div",
		elements:[{
			eName:"div",
			elements:{
				eName:"div",
				cssClass:"accountManage_resetPwd_nameDiv",
				elements:[{
					eName:"span",
					cssClass:"accountManage_resetPwd_span",
					elements:"有效期"
				},{
					eName:"datebox",
					name:"account_end_date",
					editable:false,
					width:180
				}]
			}
		},{
			eName:"div",
			elements:[{
				eName:"linkbutton",
				uId:"tm2",
				text : '保存',
				cssClass : 'accountManage_resetPwd_linkbutton',
				width : 65,
				height : 31,
				onClick:saveDate
			},{
				eName:"linkbutton",
				uId:"tm1",
				text : '取消',
				width : 65,
				height : 31,
				onClick:function(){
					jqObj.window("close");
				}
			}]
		}]
	}
	jqObj.loadUI(addDepUI);
	
	var account_end_date = jqObj.findJq("account_end_date");
	
	loadInit();
	
	function loadInit(){
		var date = new Date();
		var y = date.getFullYear() + 20;
		var m = date.getMonth() + 1;
		var d = date.getDate();
		account_end_date.datebox("setValue",y + '-' + (m<10?('0'+m):m) + '-' + d);
	}
	
	//保存有效期
	function saveDate(){
		var params = {};
		if(loadParams.params[0].account_id == loadParams.rData.account_id){
			params['read_card_number'] = loadParams.rData.card_number;
			params['read_media_id'] = loadParams.rData.media_id;
		}
		params['account_end_date'] = account_end_date.datebox("getValue");
		params['event_id'] = "12";
		var myWin = $.createWin({
			title:"操作提示",
			width:600,
			height:100,
			queryParams:{
				params:loadParams.params,
				configs:params,
//				callback:function(){
//					loadParams.callback();
//					jqObj.window("close");
//				}
				loadP:loadParams
			},
			url:"js/account/accountManage_progressBarWin.js"
		});
		jqObj.window("close");
	}
});