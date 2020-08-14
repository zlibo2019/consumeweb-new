//pos营业汇总
garen_define("js/report/merchant/posCount",function (jqObj,loadParams) {
	
	var base = garen_require("js/base/ws_public");
	
	//var placeQuery = base.placeQuery;//场所查询
	//var merchQuery = "report/merchant/query.do";  //商户查询
	var merchQuery = "report/authority/qryMerch.do" //商户查询
	
	var bhQuery = "report/sys/bhQueryByMerchant.do";//设备查询
	
	var depTree = null;
	
	var bhList = null;
	var start_date = null;
	var end_date = null;
	var all_dep_serial = "";
	var merchList = null;
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
			text:"商户",
			cssStyle:"margin-right:8px;"
		},{
			eName:"combogrid",
			id:"merchList",
			//url:merchQuery,
			name:"merchant_account_id",
			idField: 'merchant_account_id',
			textField: 'merchant_name',
			width:100,
			editable:false,
			multiple:true,
			singleSelect: false,
			selectOnCheck:true,
			columns:[[
				{field:'merchant_account_id',checkbox:true},
				{field:'merchant_name',title:'全部'}
			]],
			onChange:function(newValue, oldValue){
				if(newValue.length>0){
					bhList.combo("clear");
					var param = {};
					param['merchant_account_id'] = newValue.join();
					loadBhList(param);
				}else{
					var bhGrid = bhList.combogrid("grid");
					bhGrid.datagrid("loadData",[]);
					bhList.combogrid("setValue","");
				}
			}
			
		},{
			eName:"span",
			text:"设备",
			cssStyle:"margin-right:8px;"
		},{
			eName:"combogrid",
			id:"bhList",
			name:"bh",
			idField: 'bh',
			textField: 'mc',
			width:100,
			editable:false,
			multiple:true,
			singleSelect: false,
			selectOnCheck:true,
			columns:[[
				{field:'bh',checkbox:true},
				{field:'mc',title:'全部'}
			]]
		}],
		onBeforeLoad:function(params){
			/*if(!params.merchant_account_id){
				$.alert("请选择一个商户 ！");
				return false;
			}*/
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
			depTree = jqObj.findJq("depTree");
			bhList = jqObj.findJq("bhList");
			start_date = jqObj.findJq("start_date");
			end_date = jqObj.findJq("end_date");
			merchList = jqObj.findJq("merchList");
			//loadTree();	
			//loadInit();
			loadMerchList();
		}
	}
	
	function loadMerchList(){
		$.postEx(merchQuery,{},function(retJson){
			if(retJson.result && retJson.data){
				var merchGrid = merchList.combogrid("grid");
				merchGrid.datagrid("loadData",retJson.data);
			}
		});
	}
	
	function loadBhList(param){
		$.postEx(bhQuery,param,function(retJson){
			if(retJson.result && retJson.data){
				var bhGrid = bhList.combogrid("grid");
				bhGrid.datagrid("loadData",retJson.data);
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
	
	reportObj.parse(jqObj,'pos营业汇总',exOpts);
	
});