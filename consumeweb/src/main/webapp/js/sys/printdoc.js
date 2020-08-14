
//加载初始化
$(function(){
	var mainBody = $("body");
	var printObj = window.opener.printObj;
	var colCount = 1;
	var TOTAL_FLAG = "##total##";
	var TOTAL_COUNT_FLAG = "##total_count##";
	var GROUPTOTAL_FLAG = "##grouptotal##";
	var GROUPTOTAL_COUNT_FLAG = "##group_count_total##";
	var GROUPTOTALOFFSET_FLAG = "##grouptotal_offset##";//合计偏移量
	var FILTER_destroy_FLAG = "##destroy_flag##";
	//加载数据
	loadData(printObj.reportName.printObj,printObj.params,printObj.flag);
	//解析报表
	function parseHtmlDoc(data,dataStr){
		var docJson = printObj.retportJson;
		var params = printObj.params;
		var columnsUI = createColumns(docJson);
		var footerUI = createFooter(params.footer) || {};
		var ui = [{
			eName:"div",
			cssClass:"report_print",
			elements:[{//报表标题
				eName:"div",
				cssClass:'title',
				text:docJson.title
			},{//报表表头
				eName:"table",
				cssClass:'header',
				elements:[createHeader(params.header),createHeader(params.headerEx)]
			},{
				eName:"table",
				cssClass:'content',
				elements:[{
					eName:"thead",
					elements:columnsUI
				},{
					eName:"tbody",
					id:"report_tbody"
				}]
			},{
				eName:"table",
				cssClass:'header',
				elements:footerUI
			}]
		}]
		mainBody.createHtml(ui);
		createTBody(docJson,data);//创建正文
		mainBody.createUI({
			eName:"div",
			cssClass:"report_no_print",
			addMode:"prepend",
			elements:{
				eName:"linkbutton",
				text:"打印",
				onClick:function(){
					window.print();
				}
			}
		});
	}
	//获取表头定义
	function createHeader(header){
		if(!header) return null;
		var tds = [];
		var len = header.length;
		$.each(header,function(i,e){
			var td = {
				eName:"td",
				cssClass:"font12",
				text:e
			}
			if(e.indexOf("打印时间") != -1){
				td.width = 220;
			}
			if(i == 0) td.cssStyle="text-align:left;";
			else if(i == len - 1) td.cssStyle="text-align:right;";
			tds.push(td);
		});
		return {
			eName:"tr",
			elements:tds
		}
	}
	//获取表头定义
	function createFooter(header){
		if(!header) return {flag:true};
		var flag = true;
		var tds = [];
		var len = header.length;
		$.each(header,function(i,e){
			var td = {
				eName:"td",
				cssClass:"font12",
				text:e
			}
			if(e.indexOf("打印时间") != -1){
				td.width = 320;
				flag = false;
			}
			if(i == 0) td.cssStyle="text-align:left;";
			else if(i == len - 1) td.cssStyle="text-align:right;";
			tds.push(td);
		});
		return {
			eName:"tr",
			elements:tds,
			flag:flag
		}
	}
	//生成表格列集合
	function createColumns(docJson){
		if(checkTable(docJson) == false) return;
		var columns = docJson.table.columns;
		var trs = $.map(columns,function(column,i){
			var tds = $.map(column,function(col,j){
				if(col == undefined || col.hidden) return;
				var width = col.width || 100;
				var tdui =  {
					eName:"th",
					text:col.title,
					colSpan:col.colspan,
					rowSpan:col.rowspan,
					data:col
				}
				if(col.colspan == '' || col.colspan == 1) tdui.width = width;
				return tdui;
			});
			return {
				eName:"tr",
				elements:tds
			}
		});
		return trs;
	}
	
	//创建正文
	function createTBody(docJson,datalist){
		var tbodyObj = mainBody.find('#report_tbody');
		if(checkTable(docJson) == false || datalist == null) return;
		var columns = docJson.table.columns;
		var cols = [];
		createColBodyList(columns,0,0);
		clearFlag(columns);
		colCount = cols.length;
		$.progress("文档生成中...");
		createPage(0);
		function createPage(num){
			var pageSize = 50;
			var offset  = num * pageSize;
			var rows = datalist.slice(offset,offset + pageSize);
			$.print('第' + num + '页,' + rows.length);
			tbodyObj.createHtml(create(rows));
			if(rows.length != pageSize) {
				$.progress("close");
				return;
			}
			setTimeout(function(){
				createPage(++num);//下一页
			}, 200);
		}
		
		function create(rows){
			var trs = [];
			//遍历数据
			$.each(rows,function(i,row){
				var total = 0,flag = 0;//0初始值 1 有合并列 2 合并标志，即跳过
				var tr = {eName:"tr",height:20},tds = [];
				var sumflag = false;
				if(row[TOTAL_FLAG]){
					total = row[TOTAL_COUNT_FLAG];
					flag = 1;
					tr.cssClass = "font12";
					sumflag = true;
				}else if(row[GROUPTOTAL_FLAG]){
					total = row[GROUPTOTAL_COUNT_FLAG];
					flag = 1;
					tr.cssClass = "font12";
					sumflag = true;
				}if(row[FILTER_destroy_FLAG]){
					trs.push({
						eName:"tr",
						elements:{
							eName:"td",
							colSpan:8,
							elements:{
								eName:"div",
								cssStyle:"text-align:right;font-weight:700;",
								elements:[{
									eName:"span",
									text:"销户人数：" + row.count + "人；"
								},{
									eName:"span",
									text:"销户总额：" + row.sum1 + "元；"
								},{
									eName:"span",
									text:"押金总额：" + row.sum2 + "元；"
								}]
							}
						}
					});
					return;
				}
				$.each(cols,function(j,col){
					//最后一个跳转
					if(total > 0 && flag == 2) {
						total--;
						return;//total--必须放前面
					}
					var val = row[col.field];
					//if(col.field == 'fee_rate') // || val == 0
						//$.print(col);
					var td = {
						eName:"td",
						cssStyle:"text-align:" + col.align,
						cssClass:col.font || '',
						id:col.field + ',' + col.title,
						elements:(val==undefined?' ':val) + ''
					}
					if(total > 1 && flag == 1){
						td.colSpan = total;
						flag = 2;
					} 
					if(sumflag && typeof val == 'string'
							&& (val.indexOf('小计') != -1 
									|| val.indexOf('合计') != -1)){
						td.cssStyle = "text-align:center;";
					}
					tds.push(td);
					total-- ;
				});
				tr.elements = tds;
				trs.push(tr);
			});
			return trs;
		}
		//清除标志
		function clearFlag(columns){
			$.each(columns,function(i,column){
				$.each(column,function(j,col){
					delete col.it_flag;
				});
			});
		}
		/*创建内容表格列集合
		 * 深度递归
		 * 遍历过的设置标志位it_flag
		 * */
		function createColBodyList(columns,index,colspan){
			var size = columns.length;
			if(index >= size) return;
			var column = columns[index];
			$.each(column,function(i,colObj){
				if(colObj["it_flag"]) return true;//继续
				colObj["it_flag"] = true;
				var cspan = colObj.colspan || 1;
				if(!(colObj.hidden || cspan > 1)) cols.push(colObj);
				var num = 1;
				if(cspan > 1) {//遍历下一行
					createColBodyList(columns,index+1,cspan);
					num = cspan;
				}
				if(colspan > 0){//上层为合并列
					colspan -= num;
					if(colspan == 0) 
						return false;//break终止继续遍历
				}
			});
		}
	}
	
	//创建正文
	function createTBody1(docJson,datalist){
		var tbodyObj = mainBody.find('#report_tbody');
		if(checkTable(docJson) == false) return;
		var columns = docJson.table.columns;
		var trs = [],cols = [];
		createColBodyList(columns,0,0);
		clearFlag(columns);
		colCount = cols.length;
		//遍历数据
		$.each(datalist,function(i,row){
			var total = 0,flag = 0;//0初始值 1 有合并列 2 合并标志，即跳过
			var tr = {eName:"tr",height:20},tds = [];
			var sumflag = false;
			if(row[TOTAL_FLAG]){
				total = row[TOTAL_COUNT_FLAG];
				flag = 1;
				tr.cssClass = "font12";
				sumflag = true;
			}else if(row[GROUPTOTAL_FLAG]){
				total = row[GROUPTOTAL_COUNT_FLAG];
				flag = 1;
				tr.cssClass = "font12";
				sumflag = true;
			}if(row[FILTER_destroy_FLAG]){
				trs.push({
					eName:"tr",
					elements:{
						eName:"td",
						colSpan:7,
						elements:{
							eName:"div",
							cssStyle:"text-align:right;font-weight:700;",
							elements:[{
								eName:"span",
								text:"销户人数：" + row.count + "人；"
							},{
								eName:"span",
								text:"销户总额：" + row.sum1 + "元；"
							},{
								eName:"span",
								text:"押金总额：" + row.sum2 + "元；"
							}]
						}
					}
				});
				return;
			}
			$.each(cols,function(j,col){
				//最后一个跳转
				if(total > 0 && flag == 2) {
					total--;
					return;//total--必须放前面
				}
				var val = row[col.field];
				//if(col.field == 'fee_rate') // || val == 0
					//$.print(col);
				var td = {
					eName:"td",
					cssStyle:"text-align:" + col.align,
					cssClass:col.font || '',
					id:col.field + ',' + col.title,
					elements:(val==undefined?' ':val) + ''
				}
				if(total > 1 && flag == 1){
					td.colSpan = total;
					flag = 2;
				} 
				if(sumflag && typeof val == 'string'
						&& (val.indexOf('小计') != -1 
								|| val.indexOf('合计') != -1)){
					td.cssStyle = "text-align:center;";
				}
				tds.push(td);
				total-- ;
			});
			tr.elements = tds;
			trs.push(tr);
		});
		//清除标志
		function clearFlag(columns){
			$.each(columns,function(i,column){
				$.each(column,function(j,col){
					delete col.it_flag;
				});
			});
		}
		/*创建内容表格列集合
		 * 深度递归
		 * 遍历过的设置标志位it_flag
		 * */
		function createColBodyList(columns,index,colspan){
			var size = columns.length;
			if(index >= size) return;
			var column = columns[index];
			$.each(column,function(i,colObj){
				if(colObj["it_flag"]) return true;//继续
				colObj["it_flag"] = true;
				var cspan = colObj.colspan || 1;
				if(!(colObj.hidden || cspan > 1)) cols.push(colObj);
				var num = 1;
				if(cspan > 1) {//遍历下一行
					createColBodyList(columns,index+1,cspan);
					num = cspan;
				}
				if(colspan > 0){//上层为合并列
					colspan -= num;
					if(colspan == 0) 
						return false;//break终止继续遍历
				}
			});
		}
		return trs;
	}
	
	//获取数据
	function loadData(wsUrl,params,flag){
		$.postEx("loadDocData.do",{params:params.params,reportName:params.reportName,flag:flag},
			function(retJson){
				parseHtmlDoc(retJson.rows,retJson.obj);
			}
		);
	}
	
	function checkTable(docJson){
		return docJson && docJson.table && docJson.table.columns?true:false;
	}
	
});
