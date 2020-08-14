
//报表导出解析器模块
garen_define("js/lib/parseReport",function (require, exports, module) {
	var utils = garen_require("utils");
	var mygrid = null;
	var reportName = null;
	var searchFlag = false;
	var totalkey = '##total##',groupkey = '##grouptotal##';
	var FILTER_destroy_FLAG = "##destroy_flag##";
	var dateObj = $.loadEx("getSysDate.do");//报表有效日期
	var dateStr = {},dateFlag = null;
	var titleMsg = null;
	var glyId = dateObj[1];
	//整合页眉页脚
	function getHeadFooter(params){
		var dataObj = $.loadEx("getSysData.do");//获取服务器时间
		var header = [];
		var footer = [];
		if(params['end_date'] && params['start_date']){
			header.push("时间范围：" + params['start_date'] + " 到 " + params['end_date']);
		}else{
			titleMsg = "查询日期";
			header.push("日期：\t" + params['end_date']);
		}
		header.push("(单位:元)");
		footer.push("打印时间：" + dataObj.printTime);
		footer.push("核算单位：" + dataObj.regUnit);
		footer.push("操作员：" + dataObj.gly);
		params.header = header;
		params.footer = footer;
	}
	//整合页眉页脚
	function getHeadFooter1(params){
		var header = params.header;
		var footer = params.footer;
		var sysdata = utils.getSysData();
		if(header){
			if(header[0] != null){
				header.unshift("核算单位 : " + sysdata.unit_name);
			}else header.shift();
		}
		if(footer){
			if(footer[0] != null){
				footer.unshift("操作员 : " + sysdata.gly);
			}else footer.shift();
			//打印时间
			var obj = footer.pop();
			if(obj != null){
				footer.push(obj);
				footer.push("打印时间 : " + dateObj.date_str);
			}
		}
	}
	//设置标题属性
	function setupTitleAlign(mygrid,cols){
		var gridPanel = mygrid.datagrid('getPanel');
		$.each(cols,function(i,col){
			var divObj = gridPanel.find('td[field='+col.field+'] > div');
			divObj.css('text-align','center');
		});
	}
	//初始化日期控件
	function initDateBox(toolbar,opts){
		if("/finweb/report/operator/destroy.do" == opts.wsUrl 
				|| "/finweb/report/operator/destroyCount.do" == opts.wsUrl){
			dateStr.start_date = dateObj[0].start_date2;
			dateStr.end_date = dateObj[0].end_date2;
			dateFlag = 1;
		}else{
			dateStr.start_date = dateObj[0].start_date;
			dateStr.end_date = dateObj[0].end_date;
			dateFlag = 2;
		}
		$.each(toolbar,function(i,e){
			if(e.name == 'start_date') e.value = dateStr['start_date'];
			if(e.name == 'end_date') e.value = dateStr['end_date'];
		});
	}
	//报表datagrid解析器,exOpts扩展解析器
	function parseReport(jqObj,retportJson,exOpts){
		var columns = retportJson.table.columns;
		var toolbar = exOpts.toolbar || [];
		initDateBox(toolbar,retportJson);
		var titleColumns = getTitleColumns(columns);
		var exportBtn = [{
			eName:'linkbutton',
			text:'查询',
			plain:true,
			iconCls:'icon-search',
			onClick:function(){
				mygrid.datagrid("loadEx");
		    }
		},{
			eName:"input",
			cssStyle:"vertical-align:middle;margin-top:-2px;margin-left:15px; ",
			type:"checkbox",
			name:"t_xj",
			checked:"checked"
		},{
			eName:"span",
			cssStyle:"margin-left:5px;",
			elements:"小计"
		},{
			eName:'linkbutton',
			text:'导出PDF',
			plain:true,
			iconCls:'icon-redo',
			onClick:function(){
				if(t_xj.prop("checked")){
					exportDoc(1);//1有小计,2没小计
				}else{
					exportDoc(2);//1有小计,2没小计
				}
			}
		},{
			eName:'linkbutton',
			text:'导出XLS',
			plain:true,
			iconCls:'icon-redo',
			onClick:function(){
				if(t_xj.prop("checked")){
					exportXlsDoc(1);//1有小计,2没小计
				}else{
					exportXlsDoc(2);//1有小计,2没小计
				}
			}
		},{
			eName:'linkbutton',
			text:'打印',
			uId:'add',
			plain:true,
			iconCls:'icon-print',
			onClick:function(){
				if(t_xj.prop("checked")){
					printDoc(1);//1有小计,2没小计
				}else{
					printDoc(2);//1有小计,2没小计
				}
			}
		}]
		exportBtn = toolbar.concat(exportBtn);//扩展查询条件
		exportBtn = [{
			eName:"div",
			cssClass:'datagrid-toolbar-div',
			elements:exportBtn
		}]
		var girdUI = {
			eName:"datagrid",
			columns:columns,
			fit:true,
			toolbarEx:exportBtn,
			url:"loadDocData.do",
			autoload:false,
			pagination:true,
			clientPager:false,
			queryParams:{reportName:reportName},
			onBeforeLoadEx:function(params){//查询条件验证
				if(exOpts.onBeforeLoad){
					if(false == exOpts.onBeforeLoad.call(mygrid,params))
						return false;
				}
				params.reportName = reportName;
				params.glyId = glyId;
				params.params = $.toJSON(params);
				searchFlag = true;
				var titleMsg = (params.start_date && params.end_date)?"结束日期":"查询日期";
				var mydate = params.end_date || params.start_date;
				if(mydate){
					if(mydate > dateStr.end_date && reportName!="操作员收支明细表" && reportName!="操作员操作明细表" && reportName!="押金流水查询" && reportName!="午餐首次刷卡明细" && reportName!="个人圈存明细" && reportName!="个人圈存汇总" && reportName!="设备圈存明细" && reportName!="部门圈存汇总"){
						$.alert(titleMsg + (dateFlag == 2?'不能大于上次日结时间':'不能大于系统当前日期'));
						return false;
					}
				}
				
			},
			rowStyler:function(index,row){//行样式验证
				if(row[totalkey] || row[groupkey]){
					return "font-weight:700;";
				}else if(row[FILTER_destroy_FLAG]){
					return "text-align:right;font-weight:700;";
				}
			},
			onLoadSuccess:function(data){//数据加载完毕
				var rows = data.rows;
				var tableJson = retportJson.table || {};
				var totalJson = tableJson.total || {};
				var groupJson = tableJson.grouptotal || {};
				var colspan1 = totalJson.colspan || 1;
				var colspan2 = groupJson.colspan || 1;
				setupCellStyler(totalJson.name);
				$.each(rows,function(i,row){//遍历所有数据
					var totalJson = tableJson.total || {};
					if(totalJson && row[totalkey]){
						mygrid.datagrid('mergeCells',{//总计
		                    index: i,
		                    field: totalJson.name,
		                    colspan:row['##total_count##'] || colspan1
		                });
					}else if(groupJson && row[groupkey]){//小计
						mygrid.datagrid('mergeCells',{
		                    index: i,
		                    field: groupJson.name,
		                    colspan:colspan2
		                });
					}else if(row[FILTER_destroy_FLAG]){//页眉
						mygrid.datagrid('updateRow',{
		                    index: i,
		                    row:{
		                    	operator:getFootInfo(row)
		                    }
						});
						mygrid.datagrid('mergeCells',{
		                    index: i,
		                    field: 'operator',
		                    colspan:8
		                });
					}
				});
				function getFootInfo(row){
					var str = '<span style="padding-right:10px;">销户人数：' 
						+ row.count + '人；</span>';
					str += '<span style="padding-right:10px;">销户总额：' 
						+ row.sum1 + '元；</span>';
					str += '<span style="padding-right:10px;">押金总额：' 
						+ row.sum2 + '元</span>';
					return '<div style="text-align:right;">' + str + '</div>';
				}
			}
		}
		jqObj.loadUI(girdUI);
		mygrid = jqObj.findJq("datagrid");
		t_xj = jqObj.findJq("t_xj");
		//设置标题自定义属性
		setupTitleAlign(mygrid,titleColumns);
		if(exOpts.onLoad) {
			exOpts.onLoad();
		}
		//动态设置cell样式---小计合计默认居中
		function setupCellStyler(field){
			var gridPanel = mygrid.datagrid('getPanel');
			var cellDiv = gridPanel.find('.datagrid-body td[field='
					+ field + '] > div');
			cellDiv.each(function(){
				var txt = $(this).text();
				if(txt.indexOf('小计') != -1 || 
						txt.indexOf('合计') != -1 ){
					$(this).css('text-align','center');
				}
			});
		}
		//导出pdf文档
		function exportDoc(flag){
			var gridOpts = mygrid.datagrid("options");
			var params = gridOpts.queryParamsEx;
			if(searchFlag == false) return;
			if(exOpts.onBeforeExport){
				exOpts.onBeforeExport.call(mygrid,params);
				getHeadFooter(params);
			}
			$.postEx("exportPdfDoc.do",{reportName:reportName,flag:flag || 0,
				params:params.params,headerstr:$.toJSON(params.header),
				headerExstr:$.toJSON(params.headerEx),
					footerstr:$.toJSON(params.footer)},function(retData){
						if(retData.result){
							var fileParam = {
								'fileKey':encodeURI(retData.info),
								'fileName':encodeURI(retportJson.title),
								'browseType':$.browser.firefox ?"firefox":'',
								'docType':"pdf"
							};
							window.open("exportDocFile.do?" + $.param(fileParam));
						}else{
							$.alert(retData.info);
						}
					}
			);
		}
		//导出excel文档
		function exportXlsDoc(flag){
			var gridOpts = mygrid.datagrid("options");
			var params = gridOpts.queryParamsEx;
			if(searchFlag == false) return;
			if(exOpts.onBeforeExport){
				exOpts.onBeforeExport.call(mygrid,params);
				getHeadFooter(params);
			}
			$.postEx("exportXlsDoc.do",{reportName:reportName,flag:flag,
				params:params.params,headerstr:$.toJSON(params.header),
				headerExstr:$.toJSON(params.headerEx),
					footerstr:$.toJSON(params.footer)},function(retData){
						if(retData.result){
							var fileParam = {
								'fileKey':encodeURI(retData.info),
								'fileName':encodeURI(retportJson.title),
								'browseType':$.browser.firefox ?"firefox":'',
								'docType':"xls"
							};
							window.open("exportDocFile.do?" + $.param(fileParam));
						}else{
							$.alert(retData.info);
						}
					}
			);
		}
		//打印文档
		function printDoc(flag){
			var gridOpts = mygrid.datagrid("options");
			var params = gridOpts.queryParamsEx;
			if(searchFlag == false) return;
			if(exOpts.onBeforeExport){
				exOpts.onBeforeExport.call(mygrid,params);
				getHeadFooter(params);
			}
			window.printObj = {
				reportName:reportName,
				params:params,
				flag:flag,
				retportJson:retportJson
			}
			window.open("printdoc.jsp");
		}
	}
	//列定义绑定样式事件
	function bindCellStyle(columns,field,fn){
		$.each(columns,function(i,column){
			$.each(column,function(j,col){
				if(col.field == field){
					col.styler = fn;
				}
			});
		});
	}
	//需要单独出来左右对齐属性的列
	function getTitleColumns(columns){
		var titleColumns = [];
		$.each(columns,function(i,cols){
			$.each(cols,function(j,col){
				if(col.titleAlign) titleColumns.push(col);
			});
		});
		return titleColumns;
	}
	return {//公共函数
		parse:function(jqObj,name,exOpts){
			reportName = name;
			$.postEx("wsBase/report/get.do",{name:name},function(retJson){
				if(retJson.result){
					var retData = retJson.data;
					if(retData && retData.docJson)
						parseReport(jqObj,retData.docJson,exOpts);
				}
			});
		},
		getgrid:function(){
			return mygrid;
		}
	}
	
});
