
//个性化定制
garen_define("js/report/customization/report",function (jqObj,loadParams) {
	var scmurl = garen_require("js/lib/scmurl");//url地址
	var reports = [];
	$.postEx("customization/powerQuery.do",{},function(retJson){
		if(retJson.result){
			$.each(retJson.data,function(i,row){
				/*var report = {
					eName:"linkbutton",
					height:32,
					uId:row.id,
					text:row.name,
					onClick:function(){
						if($(this).hasClass("a_click")){
						}else{
							t_report_div.find("a").removeClass("a_click");
							$(this).addClass("a_click");
							centerObj.empty();
							centerObj.loadJs(row.url);
						}
					}	
				};*/
				var report = {};
				if(i==0){
					report = {
						eName:"div",
						cssClass:"account_header account_header_focus",
						width:20*row.name.length,
						uId:row.id,
						text:row.name,
						url:row.url,
						onClick:menuClick
					};
				}else{
					report = {
						eName:"div",
						cssClass:"account_header",
						width:20*row.name.length,
						uId:row.id,
						text:row.name,
						url:row.url,
						onClick:menuClick
					};
				}
				
				reports.push(report);
			});
		}else{
			window.top.location.href=scmurl;
		}
		var mainUI = {
			eName : 'layoutExt',// 容器布局类，jeasyui组件
			cssStyle:'font-family: 微软雅黑, Arial;',
			fit : true,
			elements : [{
				region : 'north',
				cssStyle:"overflow:auto",
				height:62,
				elements : [{
					eName:"div",
					cssClass:"layout_account",
					elements:reports
				}]
			},{
				region : 'center',
				id:"layout_center"
			}]
		};

		jqObj.loadUI(mainUI);
		var centerObj = jqObj.findJq('layout_center');
		var layoutObj = jqObj.findJq('layout_account');
		if(layoutObj.findUI('.account_header_focus')){
			centerObj.loadJs(layoutObj.findUI('.account_header_focus').url);
		}
		
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
			centerObj.empty();
			centerObj.loadJs(thisUI.url,params);
			//layoutBody.loadJs(thisUI.url,params);//
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
	
	
});
