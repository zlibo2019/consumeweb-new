
//文档对话框
garen_define("js/lib/docDialog",function (loadParams) {

	var txtWidth = '96%';
	var doc = {
		eName : "document",
		title : "商户营业日报",//报表名称
		docSize : 1,//报表大小
		docDirect : 1,//方向:0纵向 1 横向
		titleFont : "font22",//字体
		wsUrl : "/finweb/report/merchant/daily.do"
	}
	//创建窗口
	var mywin = $.createWin({
		title:"新建报表模版",
		width:360,
		height:340,
		bodyUI:[{
			eName:"layoutEx",
			fit:true,
			elements:[{
				region:"center",
				elements:{
					eName:'formtable',
					width:'96%',
					rows:6,
					cols:2,
					trHeight:[25,,,,,80],
					tdWidth:[80,-1],
					extBtns:[null],
					formUI:{
						formData:loadParams.data
					},
					hiddenInput:[{eName:'input',name:'eName',type:'hidden',value:'document'}],
					elements:[
					    ["报表名称：",{eName:'textbox',name:'report_name',required:true}],
					    ["报表标题：",{eName:'textbox',name:'title'}],
						["报表方向：",{eName:'combobox',name:'docDirect',
							 data:[{
								value:"1",
								text:"横向",
								selected:true
							 },{
								value:"2",
								text:"纵向"
							 }]}],
						["页面大小：",{eName:'combobox',name:'docSize',data:[{value:"1",text:"A4",selected:true}]}],
						["ws地址：",{eName:'textbox',name:'wsUrl',width:txtWidth}],
						["模拟数据",{
							eName:"textbox",
							name:"queryParams",
							multiline:true,
							height:86,
							width:txtWidth
						}]
					]
				}
			},{
				region:"south",
				eName:"div",
				height:60,
				cssClass:"dialog_button_layout",
				elements:[{
					eName:'linkbutton',
					text:'保存',
		        	onClick:function(){
		        		var saveData={};
		        		if(false == myform.form('form2Json',saveData))
		        			return;
		        		if(loadParams.onSave) loadParams.onSave(saveData);
		        		mywin.window("close");
		        	}
		        },{
		        	eName:'linkbutton',
					text:'取消',
		        	onClick:function(){
		        		mywin.window("close");
		        	}
			    },{
		        	eName:'linkbutton',
					text:'重置表格',
		        	onClick:function(){
		        		loadParams.data.table = null;
		        	}
			    }]
			}]
	    }]
    })
    var myform = mywin.findJq("form");
});
