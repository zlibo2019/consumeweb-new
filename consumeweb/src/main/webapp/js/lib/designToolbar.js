//工具栏设计器
//garen_define("js/lib/designToolbar",function (require, exports, module) {
garen_define("js/lib/designToolbar",function (loadParams) {
	var idxh=1;
	var mygrid = null;
	var formcontent = null;
	var elemdata= null;
	var columns = [//datagrid列字段定义
	              [{
	              		field : 'id',
	              		title : 'Id',
	              		align : "center",
	              		width : 60
	              	},{
	              		field : 'eName',
	              		title : '组件名称',
	              		align : "center",
	              		width : 200
	              	}]
	               ]
	var toolBar = [{//datagrid工具栏
	       		   eName:'linkbutton',
	       		   text:'删除',
	       		   plain:true,
	       		   iconCls:'icon-remove',
	       		   onClick:function(){
		       			var row = mygrid.datagrid('getRowIndex', mygrid.datagrid('getSelected')); 
		       		    if (row){ 
		       		    	mygrid.datagrid('deleteRow', row); 
		       		    } 
	       		   }
	       		}];
	var centerUI = {/////datagrid定义
			eName : 'datagrid',
			idField : 'id',
			id:"dataTable",
			toolbarEx : toolBar,// 查询条件工具栏
			columns : columns,
			data:elemdata,
			pagination: false,//分页
			autoload : false,
			singleSelect:true,
			checkOnSelect:false,
			selectOnCheck:false,
			onClickRow:function(){	
       			var row = mygrid.datagrid('getSelected');
       			if(row){createUI(row);}
			}
		};	
	function createUI(row){///右侧动态创建组件属性
			formcontent.empty();
			var txtWidth = "220px";
			var elemcol=null;
			if(row.eName=="combobox"){
				elemcol=[
	   				     ['名字',{eName:'textbox',name:'name',width:txtWidth,required:true}],
	   				     ['宽度',{eName:'numberbox',name:'width',width:txtWidth,required:true}],
	   				     ['样式',{eName:'textbox',name:'cssStyle',width:txtWidth}],
	   				     ['url',{eName:'textbox',name:'url',width:txtWidth}],
	   				     ['data',{eName:'textbox',name:'data',width:txtWidth}],
	   				]					
			}else if(row.eName=="span"){
				elemcol=[
   				     ['名字',{eName:'textbox',name:'name',width:txtWidth,required:true}],
   				     ['文本',{eName:'textbox',name:'text',width:txtWidth,required:true}],
   				     ['样式',{eName:'textbox',name:'cssStyle',width:txtWidth}],
   				]		
			}else {
				elemcol=[
	   				     ['名字',{eName:'textbox',name:'name',width:txtWidth,required:true}],
	   				     ['宽度',{eName:'numberbox',name:'width',width:txtWidth,required:true}],
	   				     ['样式',{eName:'textbox',name:'cssStyle',width:txtWidth}],
	   				     ['值',{eName:'textbox',name:'value',width:txtWidth}],
	   				]		
			}
	   			formcontent.loadUI([{
	   				eName:"formtable",
	   				formUI:{//表单属性
	   					uId:"form1",
	                    formData:row.data
	   				},
	   				rows:elemcol.length,
	   				cols:2,
	   				cssStyle: "margin-top:25px;",
	   				trHeight:[30],
	   				tdWidth:[50,-1],
	   				extBtns:[null],
	   				elements:elemcol
	   			},{
					eName:"div",
					height:60,
					cssClass:"dialog_button_layout",
					elements:[{
							eName:'linkbutton',
							text:'保存',
				        	onClick:function(){
				        		var myform=formcontent.findJq("form1");
				        		var p = {}
				        		var result=myform.form('form2Json',p);		
				        		row.data=p;		
				        		if(result){
				        			$.alert("保存成功");
				        		}else{
				        		$.alert("输入不能为空,请重新输入!");
				        		}
				        	}
				        }]
				}]);					
	};
	//function create(params){
		elemdata=loadParams.data;
		var win=$.createWin({
			title:"工具栏设计器",
			width:600,
			height:400,
			bodyUI:[{
				eName:"layoutEx",
				fit:true,
				elements:[{
					region:"north",
					eName:"div",
					height:50,
					elements:[{
						eName:"linkbutton",
						text:"combobox",
						cssStyle: "margin:12px 3px 3px 6px;width:70px;",
						onClick:function(){
							mygrid.datagrid('appendRow',{						
								eName: 'combobox',
								id:idxh++
							});
						}
					},{
						eName:"linkbutton",
						text:"span",
						cssStyle: "margin:12px 3px 3px 6px;width:70px;",
						onClick:function(){
							mygrid.datagrid('appendRow',{						
								eName: 'span',
								id:idxh++
							});
						}
					},{
						eName:"linkbutton",
						text:"textbox",
						cssStyle: "margin:12px 3px 3px 6px;width:70px;",
						onClick:function(){
							mygrid.datagrid('appendRow',{						
								eName: 'textbox',
								id:idxh++
							});
						}
					},{
						eName:"linkbutton",
						text:"datebox",
						cssStyle: "margin:12px 3px 3px 6px;width:70px;",
						onClick:function(){
							mygrid.datagrid('appendRow',{						
								eName: 'datebox',
								id:idxh++
							});
						}
					}]
			},{
				region:"center",
				eName:"div",			
				elements : centerUI
			},{
				region:"east",
				eName:"div",	
				width:300,
				cssStyle:"border-top:1px solid #95B8E7;border-bottom:1px solid #95B8E7;"
			},{
				region:"south",
				eName:"div",
				height:60,
				cssClass:"dialog_button_layout",
				elements:[{
						eName:'linkbutton',
						text:'保存',
			        	onClick:function(){
			        	   var arr=mygrid.datagrid('getRows');
			        	   var data = $.map(arr,function(e,i){
			        		   return e.data;			        		   
			        	   });
			        	   if(data){
			        		    $.alert("保存成功");
			        		    if(loadParams.onSave) loadParams.onSave(data);
			        		    $.print(data);
			        	   }      	  
			        	}
			        },{
			        	eName:'linkbutton',
						text:'取消',
			        	onClick:function(){
			        		win.window("close");
			        	}
			      }]
			}]
		}]
	})
	    mygrid = win.find('#dataTable');
		formcontent = win.find('#layoutEx_east');
	//}
	//return {
	//	create:create
	//}
});
