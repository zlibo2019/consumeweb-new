/**
 * 
 */
$(function(){
	//var jmjlink = garen_require("js/lib/jmjlink");
	var jmjlink = garen_require("js/lib/jmjlink");
	
	//webService
	var query = "account/cardReader/query.do";
	
	var sysKeySet = "account/cardReader/sysKeySet.do";
	
	var cardTypeSet = "account/cardReader/cardTypeSet.do";
	
	//加载发卡控件
	jmjlink.load('jmjcard','160629001',function(jtype,jtext,jpre_str){
		//$.print("-----------",jtype,jtext,jpre_str,"-----------");
		service1();
		//initCard();
	});
	
	function service1(){
		$.postEx(sysKeySet,function(retJson){
			if(retJson.result){
				service2(retJson.data[0]);
			}else{
				$.alert(retJson.info);
			}
		});
	}
	
	function service2(data){
		var param = {};
		param['is_write'] = "1";
		$.postEx(cardTypeSet,param,function(retJson){
			if(retJson.result){
				readCookie(data,retJson.data);
			}else{
				$.alert(retJson.info);
			}
		});
	}
	
	function readCookie(data1,data2){
		var id = $.cookie('id');
		var ComNo = $.cookie('ComNo');
		//$.print(id);
		/*if(id && ComNo){
			var param = {};
			param['id'] = id;
			$.postEx(query,param,function(retJson){
				if(retJson.result){
					if(retJson.data.length>0){
						initCard(data1,data2,retJson.data[0],ComNo);
					}else{
						var cookie = {
							"Purpose" : "USER", 
							"ReaderType" : "241", 
							"HostInterface" : "USB", 
							"ComNo" : "9", 
							"BandRate" : "5", 
							"SlotNo": "0", 
							"IsContact": "1"
						};
						initCard(data1,data2,cookie,ComNo);
					}
				}else{
					$.alert(retJson.info);
				}
			});
		}else{
			var cookie = {
				"Purpose" : "USER", 
				"ReaderType" : "241", 
				"HostInterface" : "USB", 
				"ComNo" : "9", 
				"BandRate" : "5", 
				"SlotNo": "0", 
				"IsContact": "1"
			};
			initCard(data1,data2,cookie,"9");
		}*/
		var param = {};
		param['id'] = id;
		$.postEx(query,param,function(retJson){
			if(retJson.result){
				if(retJson.data.length>0){
					if(id && ComNo){
						initCard(data1,data2,retJson.data[0],ComNo);
					}else if(id && retJson.data[0].HostInterface=="USB"){
						initCard(data1,data2,retJson.data[0],"9");
					}else{
						var cookie = {
							"Purpose" : "USER", 
							"ReaderType" : "241", 
							"HostInterface" : "USB", 
							"ComNo" : "9", 
							"BandRate" : "5", 
							"SlotNo": "0", 
							"IsContact": "1"
						};
						initCard(data1,data2,cookie,"9");
					}
					
				}else{
					var cookie = {
						"Purpose" : "USER", 
						"ReaderType" : "241", 
						"HostInterface" : "USB", 
						"ComNo" : "9", 
						"BandRate" : "5", 
						"SlotNo": "0", 
						"IsContact": "1"
					};
					if(id && ComNo){
						initCard(data1,data2,cookie,ComNo);
					}else{
						initCard(data1,data2,cookie,"9");
					}
				}
			}else{
				$.alert(retJson.info);
			}
		});
	}
	
	//卡控件初始化
	function initCard(data1,data2,cookie,ComNo){
		//$.print(data1,data2,cookie);
		//return;
		var params = {
			"commandSet" : [{
				"funName" : "IsetSysParam",
				"param" : data1
			},{
				"funName":"IsetCardParam", 
				"param": {
					"CardInfo" : data2
				}
			},{
				"funName":"IsetReaderParam", 
				"param":{
					"Purpose" : "USER", 
					"ReaderType" : cookie.ReaderType, 
					"HostInterface" : cookie.HostInterface, 
					"ComNo" : ComNo, 
					"BandRate" : cookie.BandRate, 
					"SlotNo": cookie.SlotNo, 
					"IsContact": cookie.IsContact
				}
			}]
		}
		jmjlink.send(function(jtype,jtext,jpre_str){
			$.print("++++++++++++++",jtype,jtext,jpre_str,"+++++++++++++++");
		},'initReturn',$.toJSON(params));
	}
	
	var mainBody = $('body');
	var menus = [{//菜单集合
		eName:"div",
		cssClass:"account_header",
		text:"临时开户",
		url:'js/account/add_temp',
		onClick:menuClick
	},{
		eName:"div",
		cssClass:"account_header account_header_focus",
		text:"登录",
		url:'js/account/login_temp.js',
		onClick:menuClick
	},{
		eName:"div",
		cssClass:"account_header",
		text:"开户",
		url:'js/account/openAccount.js',
		onClick:menuClick
	},{
		eName:"div",
		cssClass:"account_header",
		text:"充值",
		url:'js/account/charge.js',
		onClick:menuClick
	},
	{
		eName:"div",
		cssClass:"account_header",
		text:"批量充值",
		url:'js/account/batchCharge.js',
		onClick:menuClick
	},
	{// add by LYh 卡号导入菜单添加 2017-5-23 begin
		eName:"div",
		cssClass:"account_header",
		text:"卡号导入",
		url:'js/account/impCard.js',
		onClick:menuClick
	},{// add by LYh 卡号导入菜单添加 2017-5-23 end
		eName:"div",
		cssClass:"account_header",
		text:"取款",
		url:'js/account/drawCash.js',
		onClick:menuClick
	},
	{
		eName:"div",
		cssClass:"account_header",
		text:"充值纠错",
		url:'js/account/charge_correction.js',
		onClick:menuClick
	},
	{
		eName:"div",
		cssClass:"account_header",
		text:"消费纠错",
		url:'js/account/drawCash_correction.js',
		onClick:menuClick
	},
	{
		eName:"div",
		cssClass:"account_header",
		text:"读卡器管理",
		url:'js/account/cardReader.js',
		onClick:menuClick
	},{
		eName:"div",
		cssClass:"account_header",
		text:"销户",
		url:'js/account/closeAccount.js',
		onClick:menuClick
	},{
		eName:"div",
		cssClass:"account_header",
		text:"商户管理",
		url:'js/merchant/manage.js',
		onClick:menuClick
	},
//	{
//		eName:"div",
//		cssClass:"account_header",
//		text:"商户部门",
//		url:'js/merchant/department.js',
//		onClick:menuClick
//	},{
//		eName:"div",
//		cssClass:"account_header",
//		text:"商户注册",
//		url:'js/merchant/register.js',
//		onClick:menuClick
//	},{
//		eName:"div",
//		cssClass:"account_header",
//		text:"商户修改",
//		url:'js/merchant/modify.js',
//		onClick:menuClick
//	},{
//		eName:"div",
//		cssClass:"account_header",
//		text:"商户销户",
//		url:'js/merchant/delete.js',
//		onClick:menuClick
//	},
	{
		eName:"div",
		cssClass:"account_header",
		text:"补贴发放",
		url:'js/subsidy/provide.js',
		onClick:menuClick
	},{
		eName:"div",
		width:100,
		cssClass:"account_header",
		text:"补贴发放纠错",
		url:'js/subsidy/provide_correction.js',
		onClick:menuClick
	},{
		eName:"div",
		width:100,
		cssClass:"account_header",
		text:"补贴发放查询",
		url:'js/subsidy/provide_query.js',
		onClick:menuClick
	},{
		eName:"div",
		width:100,
		cssClass:"account_header",
		text:"导入结果查询",
		url:'js/subsidy/excel_query.js',
		onClick:menuClick
	},
//	{
//		eName:"div",
//		width:100,
//		cssClass:"account_header",
//		text:"餐别设置",
//		url:'js/consume/mealSet.js',
//		onClick:menuClick
//	},
	{
		eName:"div",
		width:100,
		cssClass:"account_header",
		text:"人群设置",
		url:'js/consume/peopleSet.js',
		onClick:menuClick
	},
	{
		eName:"div",
		width:100,
		cssClass:"account_header",
		text:"餐别设置",
		url:'js/highConsume/mealSet.js',
		onClick:menuClick
	},{
		eName:"div",
		width:100,
		cssClass:"account_header",
		text:"消费规则",
		url:'js/highConsume/consumeRule.js',
		onClick:menuClick
	},
//	{
//		eName:"div",
//		width:100,
//		cssClass:"account_header",
//		text:"默认规则",
//		url:'js/consume/defaultRule.js',
//		onClick:menuClick
//	},{
//		eName:"div",
//		width:100,
//		cssClass:"account_header",
//		text:"消费规则",
//		url:'js/consume/consumeRule.js',
//		onClick:menuClick
//	},
	{
		eName:"div",
		width:100,
		cssClass:"account_header",
		text:"自动消费模式",
		url:'js/equipment/autoModeDefine.js',
		onClick:menuClick
	},{
		eName:"div",
		width:120,
		cssClass:"account_header",
		text:"商户及扣款模式",
		url:'js/equipment/merchantAssign.js',
		onClick:menuClick
	},{
		eName:"div",
		width:100,
		cssClass:"account_header",
		text:"账户管理",
		url:'js/account/accountManage.js',
		onClick:menuClick
	},{
		eName:"div",
		width:100,
		cssClass:"account_header",
		text:"卡片管理",
		url:'js/account/cardManage.js',
		onClick:menuClick
	},{
		eName:"div",
		width:150,
		cssClass:"account_header",
		text:"持卡人账户查询",
		url:'js/functionQuery/cardholderAccountQuery.js',
		onClick:menuClick
	},{
		eName:"div",
		width:100,
		cssClass:"account_header",
		text:"持卡人明细账",
		url:'js/functionQuery/cardholderDetailQuery.js',
		onClick:menuClick
	},
//	{
//		eName:"div",
//		width:100,
//		cssClass:"account_header",
//		text:"商户交易明细",
//		url:'js/functionQuery/merchantDetailQuery.js',
//		onClick:menuClick
//	},
	{
		eName:"div",
		width:150,
		cssClass:"account_header",
		text:"补贴批次账户查询",
		url:'js/functionQuery/subsidyAccountQuery.js',
		onClick:menuClick
	},{
		eName:"div",
		width:150,
		cssClass:"account_header",
		text:"操作费用设置",
		url:'js/synthesizeSet/operateCost.js',
		onClick:menuClick
	},{
		eName:"div",
		width:150,
		cssClass:"account_header",
		text:"密码规则设置",
		url:'js/synthesizeSet/passwordRule.js',
		onClick:menuClick
	},{
		eName:"div",
		width:100,
		cssClass:"account_header",
		text:"系统操作日志",
		url:'js/operationLog/systemOperationLog.js',
		onClick:menuClick
	},{
		eName:"div",
		width:100,
		cssClass:"account_header",
		text:"交易流水查询",
		url:'js/functionQuery/tradingWaterQuery.js',
		onClick:menuClick
	},{
		eName:"div",
		width:100,
		cssClass:"account_header",
		text:"批量发卡",
		url:'js/account/batchProvideCard.js',
		onClick:menuClick
	},
//	{
//		eName:"div",
//		width:100,
//		cssClass:"account_header",
//		text:"权限设置",
//		url:'js/permission/glyToMerchant.js',
//		onClick:menuClick
//	},
	{
		eName:"div",
		width:130,
		cssClass:"account_header",
		text:"卡片信息查询",
		url:'js/functionQuery/cardQuery.js',
		onClick:menuClick
	},{
		eName:"div",
		width:130,
		cssClass:"account_header",
		text:"消费明细查询",
		url:'js/functionQuery/consumeDetailQuery.js',
		onClick:menuClick
	},{
		eName:"div",
		width:100,
		cssClass:"account_header",
		text:"上班人员查询",
		url:'js/functionQuery/workUserQuery.js',
		onClick:menuClick
	},{
		eName:"div",
		width:140,
		cssClass:"account_header",
		text:"消费个人汇总查询",
		url:'js/functionQuery/consumePersonCountQuery.js',
		onClick:menuClick
	},{
		eName:"div",
		width:140,
		cssClass:"account_header",
		text:"系统日结日志查询",
		url:'js/functionQuery/systemRjLogQuery.js',
		onClick:menuClick
	},{
		eName:"div",
		width:140,
		cssClass:"account_header",
		text:"消费纠错明细查询",
		url:'js/functionQuery/consumeCorrectionDetailQuery.js',
		onClick:menuClick
	},{
		eName:"div",
		width:140,
		cssClass:"account_header",
		text:"操作员授权",
		url:'js/permission/operatorPermis.js',
		onClick:menuClick
	},{
		eName:"div",
		width:140,
		cssClass:"account_header",
		text:"个性化定制",
		url:'js/report/customization/report.js',
		onClick:menuClick
	}];
	
	var menusEx = $.map(menus,function(menu,i){
		return {
			value:menu.url,
			selected:i==0?true:false,
			text:menu.text
		}
	});
	mainBody.loadUI({
		eName:"layoutEx",
		fit:true,
		elements:[{
			region:"north",
			height:65,
			cssClass:"layout_account",
			elements:menus,
			cssStyle:"overflow:auto"
		},{
			region:"center",
			cssClass:"layout_body"
		}]
	});
	var layoutObj = mainBody.findJq('layout_account');
	var layoutBody = mainBody.findJq('layout_body');
	layoutBody.loadJs(layoutObj.findUI('.account_header_focus').url);
	//菜单单击事件
	function menuClick(e,params){
		params = params || {};
		params = $.extend(params || {},{openMenu:openMenu})
		menuFocus = layoutObj.find('.account_header_focus');
		if(this == menuFocus[0]) return;
		var thisUI = $(this).findUI();
		if(!thisUI.url) {
			$.alert("开发进行中...");
			return;
		}
		$(this).addClass('account_header_focus');
		menuFocus.removeClass('account_header_focus');
		layoutBody.loadJs(thisUI.url,params);//
	}
	//更加菜单名称加载模块
	function openMenu(menuName,params){
		layoutObj.find("div.account_header").each(function(i,menu){
			if($.trim($(menu).text()) == menuName){
				menuClick.call(menu,null,params);
				return false;
			}
		});
	}
});
