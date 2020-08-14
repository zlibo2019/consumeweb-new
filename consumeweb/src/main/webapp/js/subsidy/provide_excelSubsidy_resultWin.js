garen_define("js/subsidy/provide_excelSubsidy_resultWin",function (jqObj,loadParams) {

	var userImport = "subsidy/userImport.do";//补贴导入
	
	var columns = [//列字段定义
     	[ {
      		field : 'index',
      		title : '..',
      		align : "center",
      		width : 45
      	}, {
      		field : 'user_no',
      		title : '学/工号',
      		align : "center",
      		width : 80
      	}, {
      		field : 'user_lname',
      		title : '姓名',
      		align : "center",
      		width : 80
      	}, {
      		field : 'sub_amt_str',
      		title : '补贴金额',
      		align : "center",
      		width : 80
      	}, {
      		field : 'result',
      		title : '操作结果',
      		align : "center",
      		width : 80
      	}, {
      		field : 'result_content',
      		title : '结果说明',
      		align : "center",
      		width : 120
      	}, {
      		field : 'xh',
      		title : '导入行',
      		align : "center",
      		width : 60
      	}] ];
	
	
	var searchWinUI = {
		eName:"div",
		height:460,
		width:566,
		elements:{
			eName:'datagrid',
			id:"dataTable",
			//url:chargeQuery,
			columns : columns,
			pagination: true,//分页这里需要去掉然后改成金额统计
			clientPager:true,
			showFooter:true,
			autoload : false,
			singleSelect:true
		}
	}
	
	var southUI = {
		eName:"div",
		cssClass:"provide_excelSubsidy_resultWin_btn_div",
		elements:[{
			eName:"linkbutton",
			uId:"tm2",
			cssClass:"provide_excelSubsidy_resultWin_linkbutton",
			text : '确定',
			width : 80,
			height : 35,
			onClick:save
		},{
			eName:"linkbutton",
			uId:"tm1",
			cssClass:"provide_excelSubsidy_resultWin_linkbutton",
			text : '取消',
			width : 80,
			height : 35,
			onClick:function(){
				loadParams.callback();
				jqObj.window("close");
			}
		}]
	}
	
	var mainUI = {
		eName : 'layoutExt',// 容器布局类，jeasyui组件
		cssStyle:'font-family: 微软雅黑, Arial;',
		fit : true,
		elements : [{
			region : 'center',
			elements : searchWinUI
		},{
			region : 'south',
			height:50,
			elements : southUI
		}]
	}
	
	jqObj.loadUI(mainUI);
	var dataTable = jqObj.findJq("dataTable");
	dataTable.datagrid("loadDataEx",loadParams.params);
	//empListPage();
	//结果列表本地分页
//	function empListPage(){
//		var pager = dataTable.datagrid("getPager"); 
//	    pager.pagination({ 
//	    	total:rData.length,
//	    	//showPageList:false,
//	    	//beforePageText:'',//页数文本框前显示的汉字 
//	        //afterPageText:'', 
//	       // displayMsg:'', 
//	        onSelectPage:function (pageNo, pageSize) { 
//	        	var start = (pageNo - 1) * pageSize; 
//	        	var end = start + pageSize; 
//	        	var data = {};
//	        	//data['id'] = 0;
//	        	//data['rows'] = rData.slice(start, end)
//	        	//dataTable.datagrid("loadData", data); 
//	        	//加载数据
//	        	dataTable.datagrid("loadDataEx", {id:0,rows:data.slice(start, end),
//	        		total:data.length,pageNumber:pageNo}); 
//	        } 
//	    }); 
//	}
	
	function save(){
		var param = {};
		param['operate_code'] = loadParams.retData.operate_code;
		$.postEx(userImport,param,function(retJson){
			if(retJson.result){
				loadParams.callback();
				jqObj.window("close");
			}else{
				$.alert(retJson.info);
			}
		});
	}
	
});