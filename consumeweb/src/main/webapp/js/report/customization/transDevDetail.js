//设备圈存明细
garen_define("js/report/customization/transDevDetail",function (jqObj,loadParams) {
	
	var placeQuery = "report/sys/placeQuery.do";//场所查询
	
	var bhQuery = "report/sys/bhQuery.do";//设备查询
	
	var start_date = null;
	var end_date = null;
	var placeList = null;
	var bhList = null;
	
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
			text:"场所",
			cssStyle:"margin-right:8px;"
		},{
			eName:"combogrid",
			id:"placeList",
			name:"acdep_serial",
			idField: 'dep_serial',
			textField: 'dep_name',
			width:150,
			editable:false,
			multiple:true,
			singleSelect: false,
			selectOnCheck:true,
			columns:[[
				{field:'dep_serial',checkbox:true},
				{field:'dep_name',title:'全部'}
			]],
			onChange:function(newValue, oldValue){
				if(newValue.length>0){
					bhList.combo("clear");
					var param = {};
					param['dep_serial'] = newValue.join();
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
			width:120,
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
			start_date = jqObj.findJq("start_date");
			end_date = jqObj.findJq("end_date");
			placeList = jqObj.findJq("placeList");
			bhList = jqObj.findJq("bhList");
			loadPlaceList();
			loadInit();
		}
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
	
	function loadPlaceList(){
		$.postEx(placeQuery,{},function(retJson){
			if(retJson.result && retJson.data){
				var placeGrid = placeList.combogrid("grid");
				placeGrid.datagrid("loadData",retJson.data);
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
	
	//获取本月天数
	function getMonthDays(year,month){
		var date1 = new Date(year,month,1);
		var date2 = new Date(date1.getTime() - 24 * 60 * 60 * 1000);
		return date2.getDate();
	}
	
	reportObj.parse(jqObj,'设备圈存明细',exOpts);
	
}); 