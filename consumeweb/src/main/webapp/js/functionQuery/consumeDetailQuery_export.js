//消费明细导出excel
garen_define("js/functionQuery/consumeDetailQuery_export",function (jqObj,loadParams) {
	
	var centerUI = {
		eName:"div",
		cssStyle:"margin-top: 20px;height:100%;",
		elements:{
			eName:"fieldset",
			cssStyle:"margin-left:7px;",
			width:220,
			height:100,
			elements:[{
				eName:'legend',
				cssStyle:"font-size:15px;font-weight:bold;",
				text:'导出类型'
			},{
				eName:"div",
				cssStyle:"margin-top:15px;",
				elements:[{
					eName : 'span',
					cssStyle:"margin-left:5px;",
					elements : 'Microsoft Excel 97-2003(.xls)'
				},{
					eName : 'input',
					name:"excelradio",
					id:"excel03",
					cssStyle:"vertical-align:middle; margin-top:-2px;margin-left:30px;",
					type:"radio"
				}]
			},{
				eName:"div",
				cssStyle:"margin-top:15px;",
				elements:[{
					eName : 'span',
					cssStyle:"margin-left:5px;",
					elements : 'Microsoft Excel 2007及以上(.xlsx)'
				},{
					eName : 'input',
					name:"excelradio",
					id:"excel07",
					cssStyle:"vertical-align:middle; margin-top:-2px;margin-left:7px;",
					type:"radio"
				}]
			}]
		}
	}
	
	var southUI = {
		eName:"div",
		cssStyle:"text-align:center;",
		elements:[{
			eName:"linkbutton",
			uId:"tm2",
			text : '确定',
			cssClass : 'operateCost_addCost_linkbutton',
			width : 60,
			height : 30,
			onClick:function(){
				if(excel03.prop("checked")){
					loadParams.callback(1);
					jqObj.window("close");
				}else if(excel07.prop("checked")){
					loadParams.callback(0);
					jqObj.window("close");
				}
			}
		},{
			eName:"linkbutton",
			uId:"tm1",
			text : '取消',
			cssClass : '',
			width : 60,
			height : 30,
			onClick:function(){
				jqObj.window("close");
			}
		}]
	}
	
	var mainUI = {
		eName : 'layoutExt',// 容器布局类，jeasyui组件
		cssStyle:'font-family: 微软雅黑, Arial;',
		fit : true,
		elements : [{
			region : 'center',
			elements : centerUI
		},{
			region : 'south',
			height:50,
			elements : southUI
		}]
	};

	jqObj.loadUI(mainUI);
	
	var excel03 = jqObj.findJq("excel03");
	var excel07 = jqObj.findJq("excel07");
	excel03.prop("checked",true);
});
