//字体设计器
garen_define("js/lib/fontDialog",function (loadParams) {
	//var fonts = {
	//	    font12:{
	//		size:12
	//  	}
	//}
	var elemdata= null;
	var toolBar = [{//datagrid工具栏
		   eName:'linkbutton',
		   text:'新增',
		   plain:true,
		   iconCls:'icon-add',
		   onClick:function(){
				mygrid.datagrid('appendRow',{						
					name: '',
					size:'',
					bold:'',
					color:'',
					falg:true
				});
		   }
		},{//datagrid工具栏
		   eName:'linkbutton',
		   text:'删除',
		   plain:true,
		   iconCls:'icon-remove',
		   onClick:function(){
    			var rowIndex = mygrid.datagrid('getRowIndex', mygrid.datagrid('getSelected')); 
    		    	mygrid.datagrid('deleteRow', rowIndex);
    		    	formcontent.empty();
    		    	
		   }
		}];
	var columns = [//datagrid列字段定义
		              [{
		              		field : 'name',
		              		title : '名称',
		              		align : "center",
		              		width : 90
		              	},{
		              		field : 'size',
		              		title : '字体大小',
		              		align : "center",
		              		width : 90
		              	},{
		              		field : 'bolds',
		              		title : '字体粗体',
		              		align : "center",
		              		width : 90
		              	},{
		              		field : 'color',
		              		title : '字体颜色',
		              		align : "center",
		              		width : 90
		              	}]
		               ]
	var centerUI = {/////datagrid定义
			eName : 'datagrid',
			idField : 'name',
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
   			formcontent.loadUI([{
   				eName:"formtable",
   				formUI:{//表单属性
   					uId:"form1",
                    formData:row.data
   				},
   				rows:4,
   				cols:2,
   				cssStyle: "margin-top:28px;",
   				trHeight:[30],
   				tdWidth:[50,-1],
   				extBtns:[null],
   				elements:[
   	   				     ['名称',{eName:'textbox',name:'name',width:txtWidth,required:true}],
   	   				     ['大小',{eName:'numberbox',name:'size',width:txtWidth,required:true}],
   	   				     ['粗体',{eName:"combobox",name:'bold',id:"boldBox",width:220,
		   	 				data:[{
		   	 					value:"1",
		   	 					text:"是",
		   	 					selected:true
			   	 				},{
			   	 					value:"2",
			   	 					text:"否"
			   	 				}]
   	 			         }],
   	   				     ['颜色',{eName:'textbox',name:'color',width:txtWidth}],
   	   				]	
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
			        		if(result){
				        		row.data=p;	
				        		if(valadName(p.name)){
									mygrid.datagrid('updateRow',{index:mygrid.datagrid('getRowIndex',mygrid.datagrid('getSelected')),row:{
										name: p.name,
										size: p.size,
										bold: p.bold,
										bolds: p.bold==1?'是':'否',
										color: p.color,
										flag:false
					        		}});
									$.alert("保存成功");
								}else{
									$.alert("名称不能重复,请重新输入!");
									return;
								}			        		
			        		}else{
			        		$.alert("输入不能为空,请重新输入!");
			        		}
			        	}
			        }]
			   }]);					
         };
    function valadName(pname){
    	var arr=mygrid.datagrid('getRows');
    	var curindex=mygrid.datagrid('getRowIndex',mygrid.datagrid('getSelected'));
    	var vresult=true;
    	var xhname=null;
    	$.each(arr,function(i,e){
    		var rowIndex = mygrid.datagrid('getRowIndex', this)
    		if(rowIndex == curindex && this.flag==false && xhname!=pname){
    			vresult=true;
    		}else if(e.name == pname && rowIndex != curindex){
    			 xhname=e.name;
            	 vresult=false;
            }			        		   
 	   });
    	return vresult;
    }
	var mywin = $.createWin({
		title:"新建字体",
		width:650,
		height:400,
		bodyUI:[{
			eName:"layoutEx",
			fit:true,
			elements:[{
				region:"center",
				eName:"div",			
				elements : centerUI
			},{
				region:"east",
				eName:"div",	
				width:270,
				cssStyle:"border:1px solid #95B8E7;"
			},{
				region:"south",
				eName:"div",
				height:60,
				cssClass:"dialog_button_layout",
				elements:[{
						eName:'linkbutton',
						text:'保存',
			        	onClick:function(){
			        		//if(loadParams.onSave) loadParams.onSave(fonts);
			        		//mywin.window("close");
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
			        		mywin.window("close");
			        	}
			    }]
			}]
	    }]
    });
    mygrid = mywin.find('#dataTable');
	formcontent = mywin.find('#layoutEx_east');
});
