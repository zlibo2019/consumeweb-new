
/**打印datagrid数据***/
$(function(){
	var mainBody = $("body"),
	printObj = window.opener.printObj,//打印参数
	rowdatas = printObj.rowdatas,//数据集合
    printUtils = garen_require_inst("js/lib/printUtils",
    			printObj.gridOpt);
	//创建要打印的文档
	function printDoc(tbodyObj,params,gridOpt){
		var totalPage = null;
		params.pageNum = 1;
		params.pageSize = 200;
		var url = gridOpt.url;
		loadData();
		//获取数据
		function loadData(){
			$.postEx(url,params,function(retJson){
				var rows = retJson.rows || [];
				totalPage = retJson.totalPage || 1;
				var rowsUI = printUtils.createTBody(rows);
				tbodyObj.createHtml(rowsUI);
				if(params.pageNum < totalPage){
					params.pageNum += 1;
					$.print("第" + params.pageNum + "页");
					window.setTimeout(loadData,100);//延迟防止假死
				}else $.progress("close");
			});
		}
	}
	//创建表格,返回tbody jquery对象
	function createDoc(title,rows){
		//初始化表格
		//var tableui = printUtils.parseGrid(printObj.title,printObj.gridOpts);
		var ui = [{
			eName:"div",
			cssClass:"report_no_print",
			elements:{
				eName:"input",
				type:"button",
				id:"print_btn",
				value:"打印"
			}
		},{
			eName:"div",
			cssClass:"report_print report_print_h",
			elements:[{
				eName:"div",
				cssClass:'title',
				text:title
			},{
				eName:"div",
				cssStyle:"text-align:right;padding-right:10px;font-size:14px;",
				text:"打印时间:" + printUtils.sysDate.date_s
			},{
				eName:"table",
				cssClass:'content',
				elements:[{
					eName:"thead",
					elements:printUtils.createColumns()
				},{
					eName:"tbody",
					id:"print_body"
					//elements:[]
				}]
			}]
		}]
		mainBody.createHtml(ui);
		mainBody.find('#print_btn').click(function(){//绑定打印事件
			window.print();
		});
		return mainBody.find('#print_body');
	}
	//入口函数
	function main(){
		$.progress("文档正在生成中...");
		var tbodyObj = createDoc(printObj.title);//tbody jquery 对象
		if(rowdatas){//传入离线数据
			tbodyObj.createHtml(printUtils.createTBody(rowdatas));
			$.progress("close");
		}else{
			printDoc(tbodyObj,printObj.params,printObj.gridOpt);
		}
	}
	main();
	
});

