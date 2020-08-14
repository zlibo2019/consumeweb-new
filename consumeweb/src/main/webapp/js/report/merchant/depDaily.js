//商户营业日报
garen_define("js/report/merchant/depDaily",function (jqObj,loadParams) {
	
	var base = garen_require("js/base/ws_public");
	
	//var placeQuery = "report/merchantDep/query2.do";//商户部门查询
	//var bhQuery = "report/merchant/queryByDep.do";//商户查询
	//var bhQuery = "report/merchant/merchQueryAll.do";//商户查询
	var bhQuery = "report/authority/qryMerch.do" //商户查询
	
	//var depTree = null;
	
	var bhList = null;
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
		},
		/*{
			eName:"span",
			text:"商户部门",
			cssStyle:"margin-right:8px;"
		},{
			eName:"combotree",
			name:"dep_serial",
			editable:false,
			multiple:false,
			id:"depTree",
			width:150,
			onCheck:function(node,checked){//加载设备
				var data = depTree.combotree("tree").tree("getChecked");
				if(data.length>0){
					var params = [];
					var param = {};
					$.each(data,function(i, d){
						params.push(d.dep_serial);
					});
					param['dep_serial'] = params.join();
					loadBhList(param);
				}else{
					var bhGrid = bhList.combogrid("grid");
					bhGrid.datagrid("loadData",[]);
					bhList.combogrid("setValue","");
				}
			}
			onClick:function(node){//加载设备
				var data = depTree.combotree("tree").tree("getChecked");
				if(data.length>0){
					var params = [];
					var param = {};
					$.each(data,function(i, d){
						params.push(d.dep_serial);
					});
					param['dep_serial'] = params.join();
					loadBhList(param);
				}
				//$.print(node);
				if(node!=null){
					bhList.combo("clear");
					var param = {};
					param['dep_serial'] = node.dep_serial;
					loadBhList(param);
				}
				else{
					var bhGrid = bhList.combogrid("grid");
					bhGrid.datagrid("loadData",[]);
					bhList.combogrid("setValue","");
				}
			}
		},*/
		{
			eName:"span",
			text:"商户",
			cssStyle:"margin-right:8px;"
		},{
			eName:"combogrid",
			id:"bhList",
			name:"merchant_account_id",
			idField: 'merchant_account_id',
			textField: 'merchant_name',
			width:150,
			editable:false,
			multiple:true,
			singleSelect: false,
			selectOnCheck:true,
			columns:[[
				{field:'merchant_account_id',checkbox:true},
				{field:'merchant_name',title:'全部'}
			]]
		}],
		onBeforeLoad:function(params){
			if(params.start_date>params.end_date){
				$.alert("开始日期不能大于结束日期！");
				return false;
			}
			/*if(!params.dep_serial){
				$.alert("请选择一个商户部门！");
				return false;
			}*/
		},
		onBeforeExport:function(params){
			params.headerEx = ["商户部门:\t" + "默认商户部门"];
			//params.headerEx = ["商户部门:\t" + depTree.combotree('getText')];
			//params.footer = ["出纳:","会计:",'负责人:'];
		},
		onLoad:function(){
			//depTree = jqObj.findJq("depTree");
			bhList = jqObj.findJq("bhList");
			start_date = jqObj.findJq("start_date");
			end_date = jqObj.findJq("end_date");
			//loadTree();
			//loadInit();
			loadBhList();
		}
	}
	/*function loadTree(){
		$.postEx(placeQuery,function(retJson){
			if(retJson.result && retJson.data){
				depTree.combotree('loadData',
					$.list2Tree(retJson.data,"dep_serial","dep_parent","dep_name"));
			}
		});
	}*/
	function loadBhList(){
		$.postEx(bhQuery,{},function(retJson){
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
	reportObj.parse(jqObj,'商户营业日报',exOpts);
});