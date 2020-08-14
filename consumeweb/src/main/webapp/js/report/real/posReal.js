//POS实时营业报表
garen_define("js/report/real/posReal",function (jqObj,loadParams) {
	
	var base = garen_require("js/base/ws_public");
	
	//var merchQuery = "report/merchant/merchQueryAll2.do" //商户查询
	var merchQuery = "report/merchant/query.do";  //商户查询
	var bhQuery = "report/sys/bhQueryByMerchant.do";//设备查询
	
	var depTree = null;
	
	var bhList = null;
	var start_date = null;
	var end_date = null;
	//报表解析器
	var reportObj = garen_require_inst('js/lib/parseReport');
	var exOpts = {
		toolbar:[{
			eName:"span",
			text:"商户",
			cssStyle:"margin-right:1px;"
		},{
			eName:"combobox",
			id:"merchList",
			url:merchQuery,
			name:"merchant_account_id",
			valueField: 'merchant_account_id',
			textField: 'merchant_name',
			width:140,
			editable:false,
			multiple:false,
			singleSelect: true,
			selectOnCheck:true,
			onSelect:function(record){
				if(record!=null){
					bhList.combo("clear");
					var param = {};
					param['merchant_account_id'] = record.merchant_account_id;
					loadBhList(param);
				}
				else{
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
			width:150,
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
			if(!params.merchant_account_id){
				$.alert("请选择一个商户 ！");
				return false;
			}
		},
		onBeforeExport:function(params){
			params.end_date=loadInit();
			//params.headerEx = ["商户部门:\t" + depTree.combotree('getText')];
			//params.footer = ["出纳:","会计:",'负责人:'];
		},
		onLoad:function(){
			depTree = jqObj.findJq("depTree");
			bhList = jqObj.findJq("bhList");
			//start_date = jqObj.findJq("start_date");
			//end_date = jqObj.findJq("end_date");
			//loadTree();
			//loadInit();
		}
	}
	function loadTree(){
		$.postEx(placeQuery,function(retJson){
			if(retJson.result && retJson.data){
				depTree.combotree('loadData',
					$.list2Tree(retJson.data,"dep_serial","dep_parent","dep_name"));
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
		var d = date.getDate();
		//start_date.datebox("setValue",y + '-' + (m<10?('0'+m):m) + '-' + start_d);
		//end_date.datebox("setValue",y + '-' + (m<10?('0'+m):m) + '-' + end_d);
		return y + '-' + (m<10?('0'+m):m) + '-' + (d<10?('0'+d):d);
	}
	
	//获取本月天数
	function getMonthDays(year,month){
		var date1 = new Date(year,month,1);
		var date2 = new Date(date1.getTime() - 24 * 60 * 60 * 1000);
		return date2.getDate();
	}
	reportObj.parse(jqObj,'POS实时营业报表',exOpts);
});