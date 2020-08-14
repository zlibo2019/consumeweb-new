//部门商业日报
garen_define("js/report/merchant/reportTest",function (jqObj,loadParams) {
	//报表解析器
	var reportObj = garen_require_inst('js/lib/parseReport');
	var exOpts = {
		toolbar:[{
			eName:"span",
			text:"开始时间",
			cssStyle:"margin-right:8px;"
		},{
			eName:"datebox",
			name:"start_date",
			width:100,
			margin:8,
			value:'2016-07-01'
		},{
			eName:"span",
			text:"结束时间",
			cssStyle:"margin-right:8px;"
		},{
			eName:"datebox",
			name:"end_date",
			width:100,
			margin:8,
			value:'2016-08-31'
		}],
		onBeforeLoad:function(params){
			$.print(params); 
		},
		onBeforeExport:function(params){
			params.header = ["abc","123","900"];
			params.footer = ["abc1","a123","90z0",'8888'];
		}
	}
	reportObj.parse(jqObj,'qqq',exOpts);
});