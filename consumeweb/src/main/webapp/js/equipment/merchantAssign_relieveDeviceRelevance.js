/*解除设备关联*/
garen_define("js/equipment/merchantAssign_relieveDeviceRelevance",function (jqObj,loadParams) {
	
	var utils = garen_require("utils");
	
	var devdel = "equipment/merchant/devdel.do";//解除设备关联
	

	var columns = [//列字段定义
    	[ {
     		field : 'bh',
     		title : '设备编号',
     		align : "center",
     		width : 180
     	}, {
     		field : 'mc',
     		title : '设备名称',
     		align : "center",
     		width : 180
     	}, {
     		field : 'ip',
     		title : '设备IP',
     		align : "center",
     		width : 180
     	}, {
     		field : 'dep_name',
     		title : '设备场所',
     		align : "center",
     		width : 180
     	}
   ] ];
	
	var centerUI = {
			eName:'datagrid',
			id:"detailTable",
			idField : 'bh',
			columns : columns,
			alertFlag : false,// 是否弹出默认对话框
//			autoload : false,
			fitColumns:true,
			pagination: true,
			clientPager:true,
			singleSelect:true,
			border:false,
			onLoadSuccessEx:function(retJson){
				if(retJson.id=="0"){
					
				}else{
					$.alert(retJson.info);
				}
			}
		};
	
	var southUI = {
		eName:"div",
		cssClass:'merchantAssign_relieveDeviceRelevance_button_div',
		elements:[{
			eName:"linkbutton",
			uId:"tm2",
			text : '确定',
			width : 60,
			height : 30,
			onClick:function(){
				var message2 = $.createWin({
					title:"操作提示",
					width:600,
					height:100,
					queryParams:{
						params:loadParams.params,
//						callback:function(){
//							loadParams.callback();
//							jqObj.window("close");
//						}
						loadP:loadParams
					},
					url:"js/equipment/merchantAssign_progressBarWin.js"
				});
				jqObj.window("close");
			}
		},{
			eName:"linkbutton",
			uId:"tm1",
			text : '取消',
			cssClass : '',
			width : 60,
			height : 30,
			onClick:function(){
				jqObj.window("close");
			}	
		}]
	};
	
	var mainUI = {
		eName:"layoutExt",
		fit : true,
		elements : [{
			region : 'center',
			cssStyle:"overflow:auto;",
			elements : centerUI
		},
		{
			region : 'south',
			height : 50,
			elements : southUI
		}]
	}
	
	jqObj.loadUI(mainUI);

	var detailTable = jqObj.findJq("detailTable");
	var dataTable = jqObj.findJq("dataTable");
	var bar = jqObj.findJq('progressBar');
	
	//分页提示信息修改
	var pager = detailTable.datagrid("getPager"); 
    pager.pagination({ 
    	//showPageList:false,
    	//beforePageText:'',//页数文本框前显示的汉字 
        //afterPageText:'', 
        displayMsg:''
    });
	
	loadInit();//加载选中的已关联列表
	
	function loadInit(){
		detailTable.datagrid("loadDataEx",loadParams.params);
	}
	
});	


