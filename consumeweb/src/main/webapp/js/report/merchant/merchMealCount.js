//商户餐次汇总报表
garen_define("js/report/merchant/merchMealCount",function (jqObj,loadParams) {
	
	var base = garen_require("js/base/ws_public");
	//var bhQuery = "report/merchant/merchQuery.do";//商户查询 (废弃)
	var mealQuery = "report/merchant/mealQuery.do";
	//var placeQuery = "merchant/departmentQuery.do";//商户部门查询
	//var merchQuery = "report/merchant/merchQueryAll.do" //商户查询
	var merchQuery = "report/merchant/query.do";  //商户查询
	var depTree = null;
	
	var bhList = null;
	
	var mealList = null;
	var start_date = null;
	var end_date = null;
	//报表解析器
	var reportObj = garen_require_inst('js/lib/parseReport');
	var exOpts = {
		toolbar:[{
			eName:"span",
			text:"开始日期",
			cssStyle:"margin-right:1px;"
		},{
			eName:"datebox",
			name:"start_date",
			width:100,
			margin:6
			//value:'2016-07-01'
		},{
			eName:"span",
			text:"结束日期",
			cssStyle:"margin-right:1px;"
		},{
			eName:"datebox",
			name:"end_date",
			width:100,
			margin:6
			//value:'2016-08-31'
		}/*,{
			eName:"span",
			text:"商户部门",
			cssStyle:"margin-right:1px;"
		},{
			eName:"combotree",
			name:"dep_serial",
			editable:false,
			multiple:true,
			id:"depTree",
			width:140,
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
		}*/,{
			eName:"span",
			text:"商户",
			cssStyle:"margin-right:1px;"
		},{
			eName:"combogrid",
			id:"bhList",
			url:merchQuery,
			name:"merchant_account_id",
			idField: 'merchant_account_id',
			textField: 'merchant_name',
			width:130,
			editable:false,
			multiple:true,
			singleSelect: false,
			selectOnCheck:true,
			columns:[[
				{field:'merchant_account_id',checkbox:true},
				{field:'merchant_name',title:'全部'}
			]]
		},{
			eName:"span",
			text:"餐别",
			cssStyle:"margin-right:1px;"
		},{
			eName:"combogrid",
			id:"mealList",
			url:mealQuery,
			name:"meal",
			idField: 'meal_id',
			textField: 'meal_name',
			width:130,
			editable:false,
			multiple:true,
			singleSelect: false,
			selectOnCheck:true,
			columns:[[
				{field:'meal_id',checkbox:true},
				{field:'meal_name',title:'全部'}
			]]
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
			bhList = jqObj.findJq("bhList");
			mealList = jqObj.findJq("mealList");
//			loadBhList();
//			loadMealList();
			depTree = jqObj.findJq("depTree");
			start_date = jqObj.findJq("start_date");
			end_date = jqObj.findJq("end_date");	
			//loadTree();
			//loadInit();
		}
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
//	function loadMealList(param){
//		$.postEx(mealQuery,param,function(retJson){
//			if(retJson.result && retJson.data){
//				mealList.combobox("loadDataEx",retJson.data);
//			}
//		});
//	}
	
	reportObj.parse(jqObj,'商户餐别汇总报表',exOpts);
	
});