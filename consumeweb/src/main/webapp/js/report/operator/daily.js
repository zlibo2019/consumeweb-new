//操作员操作日报表
garen_define("js/report/operator/daily",function (jqObj,loadParams) {
	
//	var base = garen_require("js/base/ws_public");
//	
//	var operatorQuery = base.glyQuery;//操作员查询
	var operatorQuery = "report/authority/qryGly.do" //操作员查询
	
	var operatorList = null;
	var utils = garen_require("utils");
	var sysdata = utils.sysdata;
	var start_date = null;
	var end_date = null;
	//报表解析器
	var reportObj = garen_require_inst('js/lib/parseReport');
	var exOpts = {
		toolbar:[{
			eName:"span",
			text:"开始日期",
			cssStyle:"margin-right:8px;"
		},{
			eName:"datebox",
			name:"start_date",
			width:100,
			margin:8
			//value:'2016-07-01'
		},{
			eName:"span",
			text:"结束日期",
			cssStyle:"margin-right:8px;"
		},{
			eName:"datebox",
			name:"end_date",
			width:100,
			margin:8
			//value:'2016-08-31'
		},{
			eName:"span",
			text:"操作员",
			cssStyle:"margin-right:8px;"
		},{
			/*eName:"combobox",
			id:"operatorList",
			name:"operator",
			valueField: 'gly_no',
			textField: 'gly_no',
			width:100,
			editable:false,
			multiple:true*/
			eName:"combogrid",
			id:"operatorList",
			url:operatorQuery,
			name:"operator",
			idField: 'gly_no',
			textField: 'gly_no',
			width:150,
			editable:false,
			multiple:true,
			singleSelect: false,
			selectOnCheck:true,
			columns:[[
				{field:'gly_lname',checkbox:true},
				{field:'gly_no',title:'全部'}
			]]
		}],
		onBeforeLoad:function(params){
			if(params.start_date>params.end_date){
				$.alert("开始日期不能大于结束日期！");
				return false;
			}
//			if(!params.operator){
//				$.alert("请选择一个操作员！");
//				return false;
//			}
		},
		onBeforeExport:function(params){//"操作员："+sysdata.gly,
			params.header = [null,"日期范围："+params["start_date"]+" 到  "+params["end_date"],"(单位:元)"];
			//params.footer = ["出纳:","会计:",'负责人:'];
		},
		onLoad:function(){
			operatorList = jqObj.findJq("operatorList");
			start_date = jqObj.findJq("start_date");
			end_date = jqObj.findJq("end_date");
			//loadOperatorList();	
			//loadInit();
		}
	}
	
	/*function loadOperatorList(param){
		$.postEx(operatorQuery,param,function(retJson){
			if(retJson.result && retJson.data){
				operatorList.combobox("loadDataEx",retJson.data);
			}
		});
	}*/
	function loadInit(){
		var date = new Date();
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		var start_d = "01";
		var end_d = getMonthDays(y,m);
		start_date.datebox("setValue",y + '-' + (m<10?('0'+m):m) + '-' + start_d);
		end_date.datebox("setValue",y + '-' + (m<10?('0'+m):m) + '-' + end_d);
	}
	
	//获取本月天数
	function getMonthDays(year,month){
		var date1 = new Date(year,month,1);
		var date2 = new Date(date1.getTime() - 24 * 60 * 60 * 1000);
		return date2.getDate();
	}
	
	reportObj.parse(jqObj,'操作员操作日报表',exOpts);
	
});