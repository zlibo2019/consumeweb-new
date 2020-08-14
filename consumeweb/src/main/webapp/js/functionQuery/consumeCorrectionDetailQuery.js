//消费纠错明细
garen_define("js/functionQuery/consumeCorrectionDetailQuery", function(jqObj, loadParams) {
	
	//var merchQuery = "report/merchant/merchQueryAll2.do" //商户查询
	var merchQuery = "report/authority/qryMerch.do" //商户查询
	
	var bhQuery = "report/sys/bhQueryByMerchant.do";//设备查询
	
	var detailQuery = "functionQuery/ccdq/detailQuery.do";//纠错明细列表查询
	
	var columns = [//列字段定义
	             	[ {
	               		field : 'id',
	               		title : 'ID',
	               		align : "center",
	               		checkbox : true,
	               		width : 50
	               	}, {
	              		field : 'index',
	              		title : '..',
	              		align : "center",
	              		width : 50
	              	}, {
	              		field : 'bill_date_str',
	              		title : '账务日期',
	              		align : "center",
	              		width : 100
	              	}, {
	              		field : 'user_depname',
	              		title : '部门',
	              		align : "center",
	              		width : 100
	              	}, {
	              		field : 'user_no',
	              		title : '学/工号',
	              		align : "center",
	              		width : 100
	              	}, {
	              		field : 'user_lname',
	              		title : '姓名',
	              		align : "center",
	              		width : 100
	              	}, {
	              		field : 'event_name',
	              		title : '事件类型',
	              		align : "center",
	              		width : 100
	              	}, {
	              		field : 'trad_amt_str',
	              		title : '交易金额',
	              		align : "center",
	              		width : 100
	              	}, {
	              		field : 'meal_name',
	              		title : '餐次',
	              		align : "center",
	              		width : 120
	              	}, {
	              		field : 'pos_name',
	              		title : 'POS名称',
	              		align : "center",
	              		width : 100
	              	}, {
	              		field : 'merchant_name',
	              		title : '商户',
	              		align : "center",
	              		width : 80
	              	}, {
	              		field : 'trad_sj_str',
	              		title : '交易时间',
	              		align : "center",
	              		width : 140
	              	}, {
	              		field : 'operator',
	              		title : '操作员',
	              		align : "center",
	              		width : 80
	              	}, {
	              		field : 'client',
	              		title : '客户端标识',
	              		align : "center",
	              		width : 100
	              	}, {
	              		field : 'acdep_name',
	              		title : '场所',
	              		align : "center",
	              		width : 150
	              	}, {
	              		field : 'bz',
	              		title : '摘要',
	              		align : "center"
	              		//width : 150//自适应
	              	}] ];
	
	var toolBar = [null, {
		eName : 'div',
		height : 10,
		cssStyle : 'background:#ffffff;'
	},{
		eName:"formUI",
		method:"post",
		id:"search_form",
		elements:{
			eName : 'div',
			cssClass : 'merchantDetailQuery_north_second',
			elements : [{
				eName : 'div',
				cssClass:"div_first",
				elements:[{
					eName:"span",
					text:"商户"
				},{
					eName:"combogrid",
					id:"merchList",
					url:merchQuery,
					name:"merchant_account",
					idField: 'merchant_account_id',
					textField: 'merchant_name',
					width:120,
					height:25,
			        panelHeight:$.browser.msie9?200:'auto',
					panelMaxHeight:200,
					editable:false,
					multiple:true,
					singleSelect: false,
					selectOnCheck:true,
					allFlag:true,
					columns:[[
						{field:'merchant_account_id',checkbox:true},
						{field:'merchant_name',title:'全部'}
					]],
					onChangeEx:function(newValue, oldValue){
						bhList.combo("clear");
						if(newValue.length>0){
							var param = {};
							param['merchant_account_id'] = newValue.join();
							loadBhList(param);
						}
						else{
							var bhGrid = bhList.combogrid("grid");
							bhGrid.datagrid("loadData",[]);
						}
					}
					
				},{
					eName:"span",
					text:"设备"
				},{
					eName:"combogrid",
					id:"bhList",
					name:"device_bh",
					idField: 'bh',
					textField: 'mc',
					panelHeight:$.browser.msie9?200:'auto',
					panelMaxHeight:200,
					width:120,
					height:25,
					editable:false,
					multiple:true,
					singleSelect: false,
					selectOnCheck:true,
					allFlag:true,
					columns:[[
						{field:'bh',checkbox:true},
						{field:'mc',title:'全部'}
					]]
				},{
					eName:"span",
					text: "开始日期"
				},{
					eName:"datebox",
					editable:false,
					width : 120,
					height : 25,
					name:"start_date"
				},{
					eName:"span",
					text: "结束日期"
				},{
					eName:"datebox",
					editable:false,
					width : 120,
					height : 25,
					name:"end_date"
				}]
			},{
				eName : 'div',
				cssClass : 'merchantDetailQuery_div',
				elements : {
					eName : 'div',
					elements : [{
						eName : 'linkbutton',
						id:"searchBtn",
						uId:"tm1",
						width:60,
						height:30,
						cssClass:'merchantDetailQuery_chaxun',
						text:"查询",
						onClick : search
					}]
				}
			}]
		}
	}];
	
	var centerUI = {
			eName : 'datagrid',
			idField : 'id',
			id:"dataTable",
			toolbarEx:toolBar,
			columns : columns,
			pagination: true,//分页
			clientPager:true,
			showFooter:true,
			alertFlag : false,// 是否弹出默认对话框
			autoload : false,
			singleSelect:true,
			checkOnSelect:true,
			selectOnCheck:true,
			onBeforeLoadEx:function(params){
				if(params.start_date>params.end_date){
					$.alert("开始日期不能大于结束日期！");
					return false;
				}
			},
			onLoadSuccessEx:function(retJson){
				if(retJson.id=="0"){
					if(retJson.data.length>0){
						var rows = dataTable.datagrid("getRows");//当前页所有行
						$.each(rows,function(i,row){//遍历当前页所有数据
							if(row == retJson.data[retJson.data.length-1]){//当前页的数据是最后一行
								dataTable.datagrid('appendRow',{
									index: '合计',
									trad_amt_str: (retJson.retData.correct_total/100).toFixed(2)
								});
								dataTable.datagrid("mergeCells",{
									index: i+1,
									field: 'index',
									colspan: 6
								});
							}
						});
					}
				}else{
					$.alert(retJson.info);
				}
			}
		};
	var mainUI = {
			eName : 'layoutExt',// 容器布局类，jeasyui组件
			cssStyle:'font-family: 微软雅黑, Arial;',
			fit : true,
			elements : [{
				region : 'center',
				elements : centerUI
			}]
	};

	jqObj.loadUI(mainUI);
	var dataTable = jqObj.findJq("dataTable");
	
	var bhList = jqObj.findJq("bhList");
	var merchList = jqObj.findJq("merchList");
	var start_date = jqObj.findJq("start_date");
	var end_date = jqObj.findJq("end_date");
	
	loadInit();//加载初始化
	
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
	
	function search(){
		// aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
		dataTable.datagrid("loadEx",{url:detailQuery});
	}
	
	function loadBhList(param){
		$.postEx(bhQuery,param,function(retJson){
			if(retJson.result && retJson.data){
				var bhGrid = bhList.combogrid("grid");
				bhGrid.datagrid("loadData",retJson.data);
			}
		});
	}
	
});
