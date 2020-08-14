//报表打印工具库
garen_define("js/lib/printUtils",function(jqobj,gridOpt) {
	
	//$.print(123,gridOpt);
	var dateObj = $.loadEx("getDate.do");//获取服务器时间
	
	//生成表格列集合
	function createColumns(){
		var columns = gridOpt.columns;
		var trs = $.map(columns,function(column,i){
			var tds = $.map(column,function(col,j){
				if(col == undefined || col.hidden || col.checkbox) return;
				return {
					eName:"th",
					text:col.title,
					colSpan:col.colspan,
					rowSpan:col.rowspan,
					width:col.width || 100,
					data:col
				}
			});
			return {
				eName:"tr",
				elements:tds
			}
		});
		return trs;
	}
	
	//创建正文
	function createTBody(datalist){
		var columns = gridOpt.columns;
		var trs = [],cols = [];
		//获取列集合
		$.each(columns,function(i,column){
			$.each(column,function(j,col){
				if(col == undefined || col.hidden 
						|| col.colspan > 1 || col.checkbox) return;
				cols.push(col)
			});
		});
		//遍历数据
		$.each(datalist,function(i,row){
			var total = 0,flag = 0;//0初始值 1 有合并列 2 合并标志，即跳过
			var tr = {eName:"tr",height:20},tds = [];
			$.each(cols,function(j,col){
				var val = row[col.field];
				if(val == 0) val = "0";
				var td = {
					eName:"td",
					cssStyle:"text-align:" + col.align,
					cssClass:col.font || '',
					text:(val  || ' ') + ''
				}
				if('index' == col.field){
					td.text = (i + 1) + "";
				}
				tds.push(td);
			});
			tr.elements = tds;
			trs.push(tr);
		});
		return trs;
	}
	
	//打印datagrid表格
	function parseGrid(title,mygrid){
		
	}
	//根据grid生成表格
	function createTableByGrid(){
		
	}
	var uiobj = {
		createColumns:createColumns,
		createTBody:createTBody,
		sysDate:dateObj
	}
	
	return uiobj;
});
