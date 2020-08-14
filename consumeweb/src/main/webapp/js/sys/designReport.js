
//加载初始化
$(function(){
	var mainBody = $("body");
	var mygrid = null;
	//报表解析器
	var reportObj = garen_require_inst('js/lib/parseReport');
	var docDialog = garen_require_fn('js/lib/docDialog');
	var tableDialog = garen_require_fn('js/lib/tableDialog');
	var reportUtils = garen_require('report_utils');
	var viewBody = null;//预览容器
	main();//入口函数
	//默认值
	var fonts = {
		font8 : {
			size : 8,
			bold : 0
		},
		font10 : {
			bold : 0,
			size : 10,
		},
		font12 : {
			size : 12,
			bold : 0,
		},
		font22 : {
			size : 22,
			bold : 1,
			color:'0000ff'
		}
	}
	var header = {
		valign : 5,
		halign : 0,
		font : "font10",
		border : false,
		bkColor : 'd9d9d9'
	}
	var footer = {
		valign : 5,
		halign : 0,
		font : "font10",
		border : false,
	}
	
	//初始化界面
	function main(){
		var mainUI = {
			eName:"layoutEx",
			fit:true,
			elements:[{//布局左侧
				region:"west",
				width:280,
				elements:{
					eName:"datagrid",
					url:"wsBase/report/json.do",
					idFeild:'id',
					clientPager:false,
					pagination:false,
					toolbarEx:getToolbar(),
					columns:[[{
						field : 'report_name',
			      		title : '报表模板名称',
			      		align : "center",
			      		width : 240,
			      		editor:'textbox'
					}]]
				}
			},{
				region:"center",
				cssClass:"doc_preview",
				cssStyle:"border:1px solid #aaa",
			}]	
		}
		mainBody.loadUI(mainUI);
		mygrid = mainBody.findJq("datagrid");
		mygrid.datagrid("loadEx");
		viewBody = mainBody.findJq("doc_preview");
	}
	//创建表格列集合
	function createColumns(data){
		if(data.table == undefined){
			data.table = {
				eName:"table",
				id:"datagrid"
			}
		}
		if(reportUtils.checkTable(data)) return;//已经定义过
		if(!data.wsUrl || !data.queryParams) return;
		var rows = $.loadEx("loadWSData.do",{wsUrl:data.wsUrl,params:data.queryParams});
		var columns = rows[0];
		if(columns == undefined) return;
		var column = $.map(columns,function(col,key){
			return {
				field:key,
				title:key,
				text:key,
				width:100
			}
		});
		data.table.columns = [column];
	}
	//保存文档
	function onSaveDoc(isnew,row){
		var data = row.docJson;
		data.fonts = data.fonts || fonts;
		data.header = data.header || header;
		data.footer = data.footer || footer;
		createColumns(data);//初始化表格
		$.postJson('wsBase/report/save.do',row,function(retJson){
			if(retJson.id == 0){
				if(isnew) mygrid.datagrid('load');
			}else $.alert(retJson.info);
		});
	}
	//报表模板grid工具栏
	function getToolbar(){
		return [{
			eName:"linkbutton",
			text:"新建",
			plain:true,
			iconCls:'icon-add',
			onClick:function(){
				docDialog({
					onSave:function(data){
						onSaveDoc(true,{
							report_name:data.report_name,
							docJson:data
						});
					}
				});
			}
		},{
			eName:"linkbutton",
			text:"编辑",
			plain:true,
			iconCls:'icon-edit',
			onClick:function(){
				var row = mygrid.datagrid("getSelected");
				if(row == null){
					$.alert("请选择要编辑的记录 !");
					return;
				}
				docDialog({
					data:row.docJson,
					onSave:function(data){
						$.extend(row.docJson,data);
						row.report_name = data.report_name;
						onSaveDoc(false,row);
					}
				});
			}
		},{
			eName:"linkbutton",
			text:"表格",
			plain:true,
			iconCls:'icon-edit',
			onClick:function(){
				var row = mygrid.datagrid("getSelected");
				if(row == null){
					$.alert("请选择要编辑的记录 !");
					return;
				}
				tableDialog({
					data:row.docJson,
					fonts:fonts,
					onSave:function(tableJson){
						$.print(tableJson);
						row.docJson.table = tableJson;
						onSaveDoc(false,row);
					}
				});
			}
		},{
			eName:"linkbutton",
			text:"删除",
			plain:true,
			iconCls:'icon-remove',
			onClick:function(){
				var row = mygrid.datagrid("getSelected");
				if(row == null){
					$.alert("请选择要删除的记录 !");
					return;
				}
				$.confirm("确认要删除此记录吗?",function(r){
					if(r == false) return ;
					$.postEx('wsBase/report/del.do',{id:row.id},function(retJson){
						if(retJson.id == 0){
							var rowIndex = mygrid.datagrid("getRowIndex",row);
							mygrid.datagrid("deleteRow",rowIndex);
						}else $.alert(retJson.info);
					});
				});
			}
		},{
			eName:"linkbutton",
			text:"预览",
			plain:true,
			iconCls:'icon-tip',
			onClick:function(){
				var row = mygrid.datagrid("getSelected");
				if(row == null){
					$.alert("请选择要预览的报表 !");
					return;
				}
				previewReport(row.docJson);
			}
		}];
	}
	//预览报表
	function previewReport(docJson){
		$.print(docJson);
		viewBody.empty();
		var exOpts = {
			onBeforeLoad:function(params){
				var jsonstr = docJson.queryParams;
				if(jsonstr.indexOf('"start_date"') == -1)
					jsonstr = jsonstr.replace('start_date','"start_date"');
				if(jsonstr.indexOf('"end_date"') == -1)
					jsonstr = jsonstr.replace('end_date','"end_date"');
				$.extend(params,$.parseJSON(jsonstr));
			},
			onBeforeExport:function(params){
				params.header = ["abc","123","900"];
				params.footer = ["abc1","a123",'8888'];
			}
		}
		reportObj.parse(viewBody,docJson.report_name,exOpts);
	}
	//预览报表
	function previewReport1(docJson){
		viewBody.empty();
		if(reportUtils.checkTable(docJson) == false) return;
		var rows = $.loadEx("loadWSData.do",{wsUrl:docJson.wsUrl,params:docJson.queryParams});
		var ui = {
			eName:"datagrid",
			pagination:false,
			columns:docJson.table.columns,
			data:rows
		}
		$.print(docJson.table);
		viewBody.loadUI(ui);
	}
});

//报表工具箱
garen_define("report_utils",function () {
	return {
		checkTable:function(docJson){
			return docJson && docJson.table && docJson.table.columns?true:false;
		}
	}
});
