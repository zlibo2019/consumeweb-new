//电子转账银行日报表
garen_define("js/report/bank/bankDaily",function (jqObj,loadParams) {
	
	var base = garen_require("js/base/ws_public");
	
	var bankQuery = base.qryBank;//银行查询
	
	var bankList = null;		
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
			text:"银行",
			cssStyle:"margin-right:1px;"
		},{
			eName:"combobox",
			id:"bankList",
			//url:bankQuery,
			name:"bank_id",
			valueField: 'bank_id',
			textField: 'bank_name',
			width:150,
			editable:false,
			multiple:false,
			singleSelect: true
			//selectOnCheck:true			
		}],
		onBeforeLoad:function(params){
			if(params.start_date>params.end_date){
				$.alert("开始日期不能大于结束日期！");
				return false;
			}
		},
		onBeforeExport:function(params){
			params.header = [null,"日期范围："+params["start_date"]+" 到  "+params["end_date"],"(单位:元)"];
			//params.footer = ["出纳:","会计:",'负责人:'];
		},
		onLoad:function(){
			bankList = jqObj.findJq("bankList");
			start_date = jqObj.findJq("start_date");
			end_date = jqObj.findJq("end_date");
			loadBankList();	
			//loadInit();
		}
	}
	
	function loadBankList(param){
		$.postEx(bankQuery,param,function(retJson){
			if(retJson.result && retJson.data){
				bankList.combobox("loadDataEx",retJson.data);
			}
		});
	}
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
	
	reportObj.parse(jqObj,'电子转账银行日报表',exOpts);
	
}); 