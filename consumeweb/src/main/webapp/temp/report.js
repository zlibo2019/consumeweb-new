
//加载初始化
$(function(){
	var mainBody = $("body");
	
	var toolbar = [{
		eName : 'linkbutton',
		width:65,
		height:30,
		text:"导出",
		plain:true,
		iconCls:'icon-undo',
		onClick : function(){
			$.print("导出pdf");
			$.emportDoc(mygrid,"报表测试","pdf");
		}
	},{
		eName : 'linkbutton',
		width:65,
		height:30,
		text:"打印",
		plain:true,
		iconCls:'icon-print',
		onClick : function(){
			$.print("导出");
			$.emportDoc(mygrid,"报表测试","pdf");
		}
	}];
	
	var columns = [[{
   		title : '日期',
   		field : 'a1_str',
   		align : "center",
   		rowspan:3,
   		width : 80,
   		styler:function(value,row,index){
   			$.print(row);
   			if(row.footerFlag)
   				return {style:'color:red'}
   		}
   	},{
   		title : '科目代码',
   		field : 'a2',
   		align : "center",
   		rowspan:3,
   		width : 60
   	},{
   		title : '科目名称',
   		field : 'a3',
   		align : "center",
   		rowspan:3,
   		width : 120
   	},{
   		title : '期初',
   		align : "center",
   		colspan:3
   	},{
   		title : '本期发生',
   		align : "center",
   		colspan:6,
   		width : 100
   	},{
   		title : '期末',
   		align : "center",
   		colspan:3,
   		width : 100
   	}],
   	/*******第二行******/
   	[{
   		field : 'b1',
   		title : '户数',
   		align : "center",
   		rowspan:2,
   		width : 60
   	},{
   		title : '金额',
   		align : "center",
   		colspan:2,
   	},{
   		field : 'b2',
   		title : '开户',
   		align : "center",
   		rowspan:2,
   		width : 80
   	},{
   		field : 'b3',
   		title : '销户',
   		align : "center",
   		rowspan:2,
   		width : 80
   	},{
   		title : '借方',
   		align : "center",
   		colspan:2,
   	},{
   		title : '贷方',
   		align : "center",
   		colspan:2,
   	},{
   		field : 'b4',
   		title : '户数',
   		align : "center",
   		rowspan:2,
   		width : 100
   	},{
   		title : '金额',
   		align : "center",
   		colspan:2,
   		width : 100
   	}],
	/*******第三行******/
   	[{
   		field : 'c1',
   		title : '借方',
   		align : "center",
   		width : 80
   	},{
   		field : 'c2_str',
   		title : '贷方',
   		align : "center",
   		width : 80
   	},{
   		field : 'c3',
   		title : '笔数',
   		align : "center",
   		width : 80
   	},{
   		field : 'c4',
   		title : '金额',
   		align : "center",
   		width : 80
   	},{
   		field : 'c5',
   		title : '笔数',
   		align : "center",
   		width : 80
   	},{
   		field : 'c6',
   		title : '金额',
   		align : "center",
   		width : 80
   	},{
   		field : 'c7',
   		title : '借方',
   		align : "center",
   		width : 80
   	},{
   		field : 'c8',
   		title : '贷方',
   		align : "center",
   		width : 80
   	}]];
	mainBody.loadUI({
		eName:"datagrid",
		title:"报表导出测试",
		columns:columns,
		toolbarEx:toolbar,
		url:"reporttest.do",
		showFooter: true,
		onLoadSuccess:function(){
			$(this).datagrid('mergeCells', {
				index: 0,
				field: 'a1_str',
				colspan: 9,
				type: 'footer'
			});
		}
	});
	var mygrid = mainBody.findJq("datagrid");
});
