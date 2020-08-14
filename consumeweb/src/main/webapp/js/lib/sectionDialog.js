//段落设计器
garen_define("js/lib/sectionDialog",function (loadParams) {
	/*var doc = {
		eName : "table",
		colSize : 2,
		id : "header",
		elements : [{
				title : '日期',
				valign : 5,
				halign : 0,
				font : "font10",
				border : false,
				bkColor : 'd9d9d9'
			}, {
				title : '单位(元)\t',
				valign : 5,
				halign : 2,
				font : "font10",
				border : false,
				bkColor : 'd9d9d9'
			}
		]
	}*/
	var fonts=loadParams.fonts;
	fonts = transform(fonts);
	var elemdata= null;
	function transform(obj){
	    var arr = [];
	    for(var item in obj){
	        arr.push(obj[item]);
	    }
	    return arr;
	}
	var toolBar = [{//datagrid工具栏
		   eName:'linkbutton',
		   text:'新增',
		   plain:true,
		   iconCls:'icon-add',
		   onClick:function(){
				mygrid.datagrid('appendRow',{						
					title: '',
					valign:'',
					halign:'',
					font:'',
					border:'',
					bkColor:'',
					flag:true
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
		              		field : 'title',
		              		title : '标题',
		              		align : "center",
		              		width : 70
		              	},{
		              		field : 'valigns',
		              		title : '垂直居中',
		              		align : "center",
		              		width : 70
		              	},{
		              		field : 'haligns',
		              		title : '水平居中',
		              		align : "center",
		              		width : 70
		              	},{
		              		field : 'fonts',
		              		title : '字体',
		              		align : "center",
		              		width : 70
		              	},{
		              		field : 'borders',
		              		title : '边框',
		              		align : "center",
		              		width : 70
		              	},{
		              		field : 'bkColor',
		              		title : '背景颜色',
		              		align : "center",
		              		width : 70
		              	}]
		               ]
	var centerUI = {/////datagrid定义
			eName : 'datagrid',
			idField : 'title',
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
   				rows:6,
   				cols:2,
   				cssStyle: "margin-top:28px;",
   				trHeight:[30],
   				tdWidth:[50,-1],
   				extBtns:[null],
   				elements:[
   	   				     ['标题',{eName:'textbox',name:'title',width:txtWidth,required:true}],
   	   				     ['垂直居中',{eName:'combobox',name:'valign',width:txtWidth,required:true,
   	   				    	 data:[{
		   	 					value:"1",
		   	 					text:"居上",
		   	 					selected:true
			   	 				},{
			   	 					value:"2",
			   	 					text:"居中"
			   	 				},{
			   	 					value:"3",
			   	 					text:"居下"
			   	 				}]
   	   				     }],
   	   				     ['水平居中',{eName:'combobox',name:'halign',width:txtWidth,required:true,
   	   				    	 data:[{
 		   	 					value:"1",
 		   	 					text:"居左",
 		   	 					selected:true
 			   	 				},{
 			   	 					value:"2",
 			   	 					text:"居中"
 			   	 				},{
 			   	 					value:"3",
 			   	 					text:"居右"
 			   	 				}]   	   				    	 
   	   				     }],
   	   				     ['字体',{eName:"combobox",name:'font',id:"boldBox",width:220,
		   	 				data:fonts
   	 			         }],
   	 			         ['边框',{eName:'combobox',name:'border',width:txtWidth,
   	 			        	 data:[{
		   	 					value:"1",
		   	 					text:"是",
		   	 					selected:true
			   	 				},{
			   	 					value:"2",
			   	 					text:"否"
			   	 				}]
   	 			         }],
   	   				     ['背景颜色',{eName:'textbox',name:'bkColor',width:txtWidth}],
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
				        		if(valadName(p.title)){
									mygrid.datagrid('updateRow',{index:mygrid.datagrid('getRowIndex',mygrid.datagrid('getSelected')),row:{
										title: p.title,
										valign: p.valign,
										valigns: valigntext(p.valign),
										halign: p.halign,
										haligns: haligntext(p.halign),
										font: p.font,
										fonts: p.font==1?'是':'否',
										border: p.border,
										borders: p.border==1?'是':'否',
										bkColor:p.bkColor,
										flag:false
					        		}});
									$.alert("保存成功");
								}else{
									$.alert("标题不能重复,请重新输入!");
									return;
								}			        		
			        		}else{
			        		$.alert("输入不能为空,请重新输入!");
			        		}
			        	}
			        }]
			   }]);					
         };
    function valigntext(valign){
    	var vtext=null;
    	if(valign==1){
    		vtext="居上";
    	}else if(valign==2){
    		vtext="居中";
    	}else{
    		vtext="居下";
    	}
    	return vtext;
    } 
    function haligntext(halign){
    	var htext=null;
    	if(halign==1){
    		htext="居左";
    	}else if(halign==2){
    		htext="居中";
    	}else{
    		htext="居右";
    	}
    	return htext;
    } 
    function valadName(ptitle){
    	var arr=mygrid.datagrid('getRows');
    	var curindex=mygrid.datagrid('getRowIndex',mygrid.datagrid('getSelected'));
    	var vresult=true;
    	var xhtitle=null;
    	$.each(arr,function(i,e){
    		var rowIndex = mygrid.datagrid('getRowIndex', this)
    		 if(rowIndex == curindex && this.flag==false && xhtitle!=ptitle ){
            	vresult=true;
    		}else if(e.title == ptitle && rowIndex != curindex){
    			xhtitle=e.title;
    			vresult=false;
    			
            }		        		   
 	   });
    	return vresult;
    }
	var mywin = $.createWin({
		title:"新建字体",
		width:710,
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
			        		//if(loadParams.onSave) loadParams.onSave(doc);
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
