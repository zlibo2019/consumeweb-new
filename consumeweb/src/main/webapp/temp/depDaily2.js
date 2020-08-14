//部门商业日报
garen_define("js/merchant/depDaily2",function (jqObj,loadParams) {
	//报表解析器
	var reportObj = garen_require_inst('js/lib/parseReport');
	var exOpts = {
		toolbar:[{
			eName:"span",
			text:"开始时间1",
			cssStyle:"margin-right:8px;"
		},{
			eName:"datebox",
			name:"start_date",
			width:100,
			margin:8,
			value:'2016-07-01'
		},{
			eName:"span",
			text:"结束时间2",
			cssStyle:"margin-right:8px;"
		},{
			eName:"datebox",
			name:"end_date",
			width:100,
			margin:8,
			value:'2016-08-31'
		}],
		onBeforeLoad:function(params){
			params.aa = 1234;
			$.print(params);
		}
	}
	var mainUI = {
		eName:"layoutEx",
		fit:true,
		elements:[{
			region:"west",
			width:200,
			elements:{
				eName:"div",
				text:"abdddd"
			}
		},{
			region:"center",
			uId:"layout_center"
		}]
	}
	jqObj.loadUI(mainUI);
	reportObj.parse(jqObj.findJq('layout_center'),'js/report/merchant/daily.json',exOpts);
});