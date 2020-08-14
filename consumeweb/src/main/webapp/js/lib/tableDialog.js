
//表格设计器
garen_define("js/lib/tableDialog",function (loadParams) {
	var reportUtils = garen_require('report_utils');
	var selectTd = null;//选择的单元格
	var coltable = null,fieldForm = null;
	var txtWidth = 150;//字段表单宽度
	var jqTotalForm = null;//表单合计表单
	var jqGroupTotalForm = null;//表单合计表单
	var mywin = null;
	
	main(loadParams.data);//入口函数
	
	//字段表单表格
	function getColumnFormtable(){
		return {
			eName:"formtable",
			trHeight:[30],//定义行高
			tdWidth:[50,100,50,100],//定义列宽
			rows:5,
			cols:4,
			formUI:{
				id:"fieldForm"
			},
			extBtns:[null,{eName:"linkbutton",text:"设置",
	     	   onClick:function(){
	     		   if(selectTd == null) return;
	     		   var tdJson = selectTd.findUI().data;
	     		   delete tdJson.subtotal;
	     		   delete tdJson.titleAlign;//删除标题属性
	     		   fieldForm.form('form2Json',tdJson);
	     		   tdJson.titleAlign = tdJson.titleAlign?true:false;
	     		   $.print(tdJson);
	     		   //解析属性
	     		   selectTd.text(tdJson.title);
	     		   selectTd.width(tdJson.width || 100);
	     		   selectTd.prop('colSpan',tdJson.colspan || 1);
	     		   selectTd.prop('rowSpan',tdJson.rowspan || 1);
			   }
			}],
			elements:[
			   ["字段",{eName:"textbox",name:'field',width:txtWidth},
			    	"标题",[{eName:"textbox",name:'title',width:txtWidth - 30},
			     {eName:"input",type:'checkbox',name:'titleAlign',value:true}]],
			   ["水平",{eName:'combobox',name:'halign',multiple:false,
				   data:[{value:"0",text:"居左"},
				         {value:"1",text:"居中"},{value:"2",text:"居右"}]
			   },
				 "字体",{eName:'combobox',name:'font',
					   data:getFontBox()
				  	}
			   ],
			   ["列合并",{eName:"textbox",name:'colspan',width:txtWidth},
					    "行合并",{eName:"textbox",name:'rowspan',width:txtWidth}],
			   ["宽度",{eName:"numberbox",name:'width',width:txtWidth},
						"类型",{eName:'combobox',name:'filedType',width:80,
							   data:[{value:"",text:"默认",selected:true},
							         {value:"date",text:"日期"},
							         {value:"time",text:"时间"},
							         {value:"datetime",text:"日期时间"},
							  {value:"money",text:"货币"}]
						   }],
			   ["隐藏域",[{
				   eName:"input",
				   name:'hidden',
				   type:"radio",
				   value:true
				  },{
					   eName:"span",
					   text:"是"
				  },{
					   eName:"input",
					   name:'hidden',
					   type:"radio",
					   value:'',
					   checked:true
				  },{
					   eName:"span",
					   text:"否"
				  }],[{
				   eName:"span",
				   text:"列小计"
			   },{
				   eName:"input",
				   type:"checkbox",
				   id:'subtotal_box',
				   onClick:function(){
					   var subtotal =  fieldForm.findJq('subtotal');
					   if($(this).prop('checked')){
						   subtotal.combobox('enable');
					   }else
						   subtotal.combobox('disable');
				   }
			  }],{
				   eName:"combobox",
				   width:80,
				   name:"subtotal",
				   multiple:true,
				   disabled:true
			   }
			   ]
			]
		}
	}
	//功能按钮
	function getToolbars(){
		return {
			eName:"div",
			cssClass:"table_edit_btns",
			elements:[{
				eName:"linkbutton",
				cssSytle:"marign-right:10px;",
				text:"向左",
				onClick:function(){
					if(selectTd == null) return;
					selectTd.prev('td').before(selectTd);
				}
			},{
				eName:"linkbutton",
				text:"向右",
				cssSytle:"marign-left:10px;",
				onClick:function(){
					if(selectTd == null) return;
					var nextTd = selectTd.next('td');
					if(nextTd.hasClass('icon-add')
							|| nextTd.hasClass('icon-remove')) return;
					nextTd.after(selectTd);
				}
			},{
				eName:"linkbutton",
				text:"添加格",
				cssSytle:"marign-left:10px;",
				onClick:function(){
					if(selectTd == null) return;
					selectTd.loadUI({
						eName:"td",
						addMode:"after",//同级后面
						text:"new",
						onClick:tdClick,
						width:100,
						data:{
							field:'new'
						}
					});
				}
			},{
				eName:"linkbutton",
				text:"删除格",
				cssSytle:"marign-left:10px;",
				onClick:function(){
					if(selectTd) {
						selectTd.remove();
						selectTd = null;
					}
				}
			},{
				eName:"linkbutton",
				text:"添加行",
				cssSytle:"marign-left:10px;",
				onClick:function(){
					selectTd = null;
					var newTr = coltable.findUI().oldUI;
					coltable.loadUI(newTr);
				}
			},{
				eName:"linkbutton",
				text:"删除行",
				cssSytle:"marign-left:10px;",
				onClick:function(){
					if(selectTd == null) return;
					selectTd.parent().remove();
				}
			}]
		};
	}
	//初始化合计小计表单数据
	function initTotalData(tableJson){
		var checkbox = null;
		var totalJson = tableJson.total;
		var groupJson = tableJson.grouptotal;
		var labelBox = null,fieldBox = null,sumfieldBox = null;
		if(totalJson){//合计
			jqTotalForm.find('.totalinput').textbox('enable');
			labelBox = jqTotalForm.findJq("name");
			fieldBox = jqTotalForm.findJq("fields");
			checkbox = mywin.find(".table_edit_fieldset #total_checkbox");
			checkbox.prop('checked',true);
			labelBox.combobox('loadData',getComboData());
			fieldBox.combobox('loadData',getComboData(totalJson.name));
			jqTotalForm.form('load',totalJson);
		}else 
			jqTotalForm.find('.totalinput').textbox('disable');
		if(groupJson){//小计
			jqGroupTotalForm.find('.totalinput').textbox('enable');
			checkbox = mywin.find(".table_edit_fieldset #grouptotal_checkbox");
			labelBox = jqGroupTotalForm.findJq("name");
			fieldBox = jqGroupTotalForm.findJq("fields");
			sumfieldBox = jqGroupTotalForm.findJq("sumfields");
			checkbox.prop('checked',true);
			jqGroupTotalForm.find('.totalinputBox')
				.combobox('loadData',getComboData());
			jqGroupTotalForm.form('load',groupJson);
		}else
			jqGroupTotalForm.find('.totalinput').textbox('disable');
	}
	//遍历表格列生成 列集合
	function getColumnJson(){
		var columns = [];
		var trs = coltable.find('tr');
		$.each(trs,function(i,tr){
			var column = [];
			var tds = $(tr).find('td');
			$.each(tds,function(j,td){
				var data = $(td).findUI().data;
				if(data.colspan > 1) delete data.width;
				//转为int
				if(data.colspan) data.colspan = parseInt(data.colspan);
				if(data.rowspan) data.rowspan = parseInt(data.rowspan);
				var halign = data.halign || 1;
				if(halign == 0) data.align = "left";
				else if(halign == 2) data.align = "right";
				else data.align = "center";
				column.push(data);
			});
			columns.push(column);
		});
		return columns;
	}
	//综合表格数据
	function onSaveTabeJson(tableJson){
		var json = null,ret = null,checkbox = null;
		//获取列集合
		tableJson.columns = getColumnJson();
		checkbox = mywin.find(".table_edit_fieldset #total_checkbox");
		if(checkbox.prop('checked')){
			json = {};
			ret = jqTotalForm.form('form2Json',json);
			if(ret){
				tableJson.total = json;//合计
			}else{
				$.alert("合计数据不完整 !");
				return;
			}
		}else delete tableJson.total
		checkbox = mywin.find(".table_edit_fieldset #grouptotal_checkbox");
		if(checkbox.prop('checked')){
			json = {};
			ret = jqGroupTotalForm.form('form2Json',json);
			if(ret){
				tableJson.grouptotal = json;//合计
			}else{
				$.alert("小计数据不完整 !");
				return;
			}
		}else delete tableJson.grouptotal
		if(loadParams.onSave)  loadParams.onSave(tableJson);
		$.alert("保存成功");
	}
	
	//获取合计数据
	function getTotalJson(){
		var checkbox = mywin.find(".table_edit_fieldset #total_checkbox");
		if(false == checkbox.prop('checked')) return null;
		var json = {};
		var ret = jqTotalForm.form('form2Json',json);
		return ret?json:null;
	}
	//获取分组小计数据
	function getGroupTotalJson(){
		var checkbox = mywin.find(".table_edit_fieldset #grouptotal_checkbox");
		if(false == checkbox.prop('checked')) return null;
		var json = {};
		var ret = jqGroupTotalForm.form('form2Json',json);
		return ret?json:null;
	}
	//单元格点击事件
	function tdClick(){
		fieldForm.findJq('combobox').combobox('clear');
		fieldForm.form('clear');
		var jqTd = $(this);
		if(selectTd){
			selectTd.toggleClass('selected');
			if(selectTd[0] == this) {
				selectTd = null;
				return;
			}
		}
		jqTd.toggleClass('selected');
		selectTd = jqTd;
		var subtotal =  fieldForm.findJq('subtotal');
		subtotal.combobox('loadData',getComboData());
		var data = jqTd.findUI().data;
		if(data.subtotal){
			fieldForm.findJq('subtotal_box').prop('checked',true);
			subtotal.combobox('enable');
		}
		$.print(data);
		fieldForm.form('load',data);
	}
	//创建表格
	function createColumns(docJson){
		if(reportUtils.checkTable(docJson) == false) return;
		var columns = docJson.table.columns;
		var trs = $.map(columns,function(column,i){
			var tds = $.map(column,function(col,j){
				if(col == undefined) return;
				return {
					eName:"td",
					text:col.title,
					onClick:tdClick,
					colSpan:col.colspan,
					rowSpan:col.rowspan,
					width:100,
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
	//获取列字段box集合
	function getComboData(strs){
		strs = ',' + (strs || '') + ',';
		var columns = getColumnJson();
		var boxes = [];
		$.each(columns,function(i,column){
			$.each(column,function(j,col){
				if(col.colspan && col.colspan > 1) return;
				if(strs.indexOf(col.field) != -1) return;//过滤掉
				boxes.push({
					value:col.field,
					text:col.title
				});
			});
		});
		return boxes;
	}
	/*获取报表合计
	 * 功能描述：
	 *  1 动态计算字段集合
	 *  2 表单数据初始化
	 ***/
	function getTotalForm(){
		var form = {
			eName:"form",
			cssClass:"table_total_form",
			id:"totalform",
			elements:[{
				eName:"div",
				elements:[{
					eName:"span",
					cssClass:"label",
					text:"标签"
				},{
					eName:"combobox",
					name:"name",
					cssClass:"totalinput",
					disabled:true,
					required:true,
					width:100,
					onSelect:function(){
						var val = $(this).combobox('getValue');
						var fieldBox = jqTotalForm.findJq("fields");
						var boxData = getComboData(val);
						fieldBox.combobox('enable')
							.combobox('loadData',boxData)
							.combobox('clear');
					}
				},{
					eName:"span",
					cssClass:"label",
					text:"合并数"
				},{
					eName:"numberbox",
					name:"colspan",
					disabled:true,
					required:true,
					cssClass:"totalinput",
					value:1,
					width:60
				}]
			},{ 
				eName:"div",
				elements:[{
					eName:"span",
					cssClass:"label",
					text:"合计字段"
				},{
					eName:"combobox",
					cssClass:"totalinput",
					name:"fields",
					disabled:true,
					multiple:true,
					required:true,
					width:260
				}]
			}]
		}
		var ui = {
			eName:"fieldset",
			cssClass:"table_edit_fieldset",
			width:'96%',
			elements:[{
				eName:"legend",
				elements:[{
					eName:"span",
					text:"合计"
				},{
					eName:"input",
					type:"checkbox",
					id:"total_checkbox",
					onClick:function(){
						var labelBox = jqTotalForm.findJq("name");
						var fieldBox = jqTotalForm.findJq("fields");
						if($(this).prop('checked')){
							jqTotalForm.find('.totalinput').textbox('enable');
							labelBox.combobox('loadData',getComboData());
						}else{
							jqTotalForm.find('.totalinput').textbox('disable');
						}
					}
				}]
			},form]
		}
		return ui;
	}
	//获取报表小计
	function getGroupTotalForm(){
		var form = {
			eName:"form",
			cssClass:"table_total_form",
			id:"grouptotalform",
			elements:[{
				eName:"div",
				elements:[{
					eName:"span",
					cssClass:"label",
					text:"标签"
				},{
					eName:"combobox",
					name:"name",
					cssClass:"totalinput totalinputBox",
					disabled:true,
					required:true,
					width:160,
					onSelect:function(){
						
					}
				},{
					eName:"span",
					cssClass:"label",
					text:"合并数"
				},{
					eName:"numberbox",
					name:"colspan",
					disabled:true,
					required:true,
					cssClass:"totalinput",
					value:1,
					width:60
				}]
			},{ 
				eName:"div",
				elements:[{
					eName:"span",
					cssClass:"label",
					text:"分组字段"
				},{
					eName:"combobox", 
					name:"groupfields",
					cssClass:"totalinput totalinputBox",
					disabled:true,
					multiple:true,
					required:true,
					width:260,
					onChange:function(){
						
					}
				}]
			},{ 
				eName:"div",
				elements:[{
					eName:"span",
					cssClass:"label",
					text:"小计字段"
				},{
					eName:"combobox", 
					name:"sumfields",
					cssClass:"totalinput totalinputBox",
					disabled:true,
					multiple:true,
					required:true,
					width:260,
					onChange:function(){
						
					}
				}]
			},{ 
				eName:"div",
				elements:[{
					eName:"span",
					cssClass:"label",
					text:"清空字段"
				},{
					eName:"combobox",
					name:"fields",
					cssClass:"totalinput totalinputBox",
					disabled:true,
					multiple:true,
					width:260
				}]
			}]
		}
		var ui = {
			eName:"fieldset",
			cssClass:"table_edit_fieldset",
			width:'96%',
			//height:80,
			elements:[{
				eName:"legend",
				elements:[{
					eName:"span",
					text:"行小计"
				},{
					eName:"input",
					type:"checkbox",
					id:"grouptotal_checkbox",
					onClick:function(){
						var labelBox = jqGroupTotalForm.findJq("name");
						var fieldBox = jqGroupTotalForm.findJq("fields");
						var sumfieldBox = jqGroupTotalForm.findJq("sumfields");
						if($(this).prop('checked')){
							jqGroupTotalForm.find('.totalinput').textbox('enable');
							jqGroupTotalForm.find('.totalinputBox')
								.combobox('loadData',getComboData());
						}else{
							jqGroupTotalForm.find('.totalinput').textbox('disable');
						}
					}
				}]
			},form]
		}
		return ui;
	}
	//获取字体列表
	function getFontBox(){
		return $.map(loadParams.fonts,function(e,i){
			return {value:i,text:i}
		});
	}
	//创建窗口
	function main(docJson){
		var columns = createColumns(docJson);
		var tableui = {
			eName:"table",
			cssClass:"ui_table report_table",
			oldUI:columns[0],
			elements:columns
		}
		$.createWin({
			title:"新建表格",
			width:850,
			height:430,
			maximizable:true,
			onLoad:function(){
				mywin = $(this);
				coltable = mywin.find('table.report_table');
				fieldForm = mywin.find('form#fieldForm');
				jqTotalForm = mywin.find('form#totalform');
				jqGroupTotalForm = mywin.find('form#grouptotalform');
				initTotalData(docJson.table);
			},
			bodyUI:[{
				eName:"layoutEx",
				fit:true,
				elements:[{
					region:"center",
					elements:{
						eName:"layoutEx",
						fit:true,
						elements:[{
							region:"north",
							height:70,
							cssStyle:"overflow:auto",
							elements:tableui
						},{
							region:"center",
							elements:getToolbars()//功能按钮区域
						},{//表单集合
							region:"south",
							height:230,
							elements:{
								eName:"layoutEx",
								fit:true,
								elements:[{
									region:"west",
									width:350,
									cssSytle:"border:1px solid #aaa;",
									elements:[{
										eName:"div",
										cssStyle:"text-align:center",
										elements:[getTotalForm(),getGroupTotalForm()]
									}]
								},{
									region:"center",
									elements:getColumnFormtable()
								}]
							}
						}]
					}
				},{//窗口保存取消按钮
					region:"south",
					eName:"div",
					height:60,
					cssClass:"dialog_button_layout",
					elements:[{
							eName:'linkbutton',
							text:'保存',
				        	onClick:function(){
				        		onSaveTabeJson(docJson.table);
				        	}
				        },{
				        	eName:'linkbutton',
							text:'取消',
				        	onClick:function(){
				        		mywin.window("close");
				        	}
				    }]
				}]
		    }]
	    });
	}
	
});

