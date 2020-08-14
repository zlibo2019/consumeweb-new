//科目余额表
garen_define("js/report/finance/daily",function (jqObj,loadParams) {
	var start_date = null;
	//报表解析器
	var reportObj = garen_require_inst('js/lib/parseReport');
	var exOpts = {
		toolbar:[{
			eName:"span",
			text:"查询日期",
			cssStyle:"margin-right:8px;"
		},{
			eName:"datebox",
			name:"end_date",
			width:100,
			margin:8
			//value:'2016-07-01'
		}],
		onBeforeLoad:function(params){
			
		},
		onBeforeExport:function(params){
			params.header = ["日期范围："+params["start_date"]+" 到  "+params["start_date"],"(单位:元)"];
			params.footer = ["出纳:","会计:",
			                 '负责人:'];
		},
		onLoad:function(){
			start_date = jqObj.findJq("start_date");
			//loadInit();
		}
	}
	function loadInit(){
		var date = new Date();
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		var d = date.getDate();
		if(Number(d)-1==0){
			m = m-1;
			if(Number(m)-1==0){
				y = y-1;
			}
			d = getMonthDays(y,m);
		}else{
			d = d-1;
		}
			
		start_date.datebox("setValue",y + '-' + (m<10?('0'+m):m) + '-' + d);
	}
	
	//获取本月天数
	function getMonthDays(year,month){
		var date1 = new Date(year,month,1);
		var date2 = new Date(date1.getTime() - 24 * 60 * 60 * 1000);
		return date2.getDate();
	}
	reportObj.parse(jqObj,'科目余额表',exOpts);
	
});