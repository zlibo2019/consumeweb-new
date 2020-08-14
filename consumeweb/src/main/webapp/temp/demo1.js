
$(function(){
	var mainBody = $("body");
	
	////combogrid////
	mainBody.loadUI([{
		eName:'combogrid',
		width:200,id:'lxlxlx',
		url:"wsBase/depQuery.do",
		idField:'dep_serial',
		textField:'dep_name',
		allFlag:true,
		columns:[[{
			field:'dep_serial',checkbox:true,
		},{
			field:'dep_name',title:'全部'
		}]],
		onChangeEx:function(){
			
		},
		onClickIcon:function(a,n){
			$.print(lxlx.combogrid("grid").datagrid('getData'))
		}
	}]);
	var lxlx = mainBody.findJq("lxlxlx");
	function changeText(){
		var seL = combogrid.combogrid("getValues").length;
		/* 下拉框所有选项 */
		var dataL = combogrid.combogrid("grid").datagrid('getData').rows.length;
//		$.print(seL); 
		$.print(dataL); 
		if(seL == dataL){
			$.print(combogrid.combogrid("getText"));
			inp.val('全部');
			$.print(combogrid.combogrid("getText"));
		}
	}
	var combogrid = mainBody.findJq('combogrid');
	var inp = mainBody.findJq('validatebox-text');
	
	
	
	////datespinnerEx////
	mainBody.loadUI([{
		eName:'datespinnerEx',width:100,
		dateType:['H','m','S'],
		onChange:function(n){
			$.print("n:"+n)
		}
	},{
		eName:'linkbutton',text:'设置对象最大最小值',width:140,
		onClick:function(){
//			d.getHourCount(jqHour,1,4);
//			dateType[0];numberspinner
//			$.print(h.numberspinner('getValue'));
			h.value='44';
			$.print(h);
		},
		
	}])
	var d = mainBody.findJqUI("datespinnerEx");
	var h = d.elements[1];
	$.print(h);
	
	var buttonUI = [{
		eName:'linkbutton',width:80,height:35,
		iconCls:'icon-add',text:'按钮1',
		cssStyle:'margin-top:20px;margin-left:20px;'
	},{
		eName:'linkbutton',width:80,height:30,
		iconCls:'icon-search',text:'按钮2',
		cssStyle:'border:0;border-radius:0;margin-top:20px;margin-left:20px;background:orange;color:white;'
	},{
		eName:'linkbutton',width:80,height:30,
		iconCls:'icon-help',text:'按钮3',plain:true,
		cssStyle:'margin-top:20px;'
	},{
		eName:'linkbutton',width:48,height:48,
		cssStyle:'border:0;margin-top:20px;margin-left:20px;background:url(temp/demo1_pic1.png) no-repeat;'
	},{
		eName:'switchbutton',
		cssStyle:'border:0;margin-top:20px;display:block;'
	},{
		eName:'div',
		cssStyle:'margin-top:20px;padding-left:20px;',
		elements:[{
			eName:'datebox',
		}]
	},{
		eName:'combobox',
		width:200,
		multiple:true,
//		url:"wsBase/depQuery.do",
		valueField:'label',
		textField:'value',
		data: [{
			label: 'java',
			value: 'Java'
		},{
			label: 'perl',
			value: 'Perl'
		},{
			label: 'ruby',
			value: 'Ruby'
		}]
	},{
		eName:'combogrid',
		url:"wsBase/depQuery.do",
		idField:'dep_serial',
		textField:'dep_name',
		allFlag:true,	
		columns:[[{
			field:'dep_serial',checkbox:true,
		},{
			field:'dep_name',title:'全部'
		}]]
	},{
		eName:"span",
		text:"开始时间"
	}, {
		eName:"datetimebox",
		name:"startTime",
		editable:false,
		name:'st',
		value:'2016-',
		width : 150,
		height : 25
	},{
		eName:'div',width:200,height:100,
		cssStyle:'border:2px dashed red',
	}]
	var tabUI = [{
		eName:'tabs',width:200,height:130,
		cssStyle:'margin-top:20px;border-color:red;',
		elements:[{
			eName:'panel',title:'面板1',
			cssStyle:'border:1px solid orange;',
			elements:[{
				eName:'textbox',
				cssStyle:'border-color:red;'
			}]
		},{
			eName:'panel',title:'面板2',
			cssStyle:'background-color:red;',
			elements:[{
				eName:'combobox',width:100
			}]
		}]
	},{
		eName:'progressbar',
		width:200,height:50
	},{
		eName:'div',
		width:200,height:200,
		cssStyle:'background:lightgray',
		elements:{
			eName:'p',text:'12345',id:'spanPmd'
		}
	}]
	
	zmd();
	function zmd(){
//		for(var i=0; i<20; i++){
//			
//		}
		var pmdT = mainBody.findJq('p');
		var offset = $('p').offsetTop;
		$.print('offset')
//		$.print(offset.left)
		$.print(offset)
	}
	
	mainBody.loadUI([{
		eName:'layoutEx',width:400,height:500,
		fit:true,
		elements:[{
			region:'north',height:250,title:'按钮',
			border:true,split:true,collapsible:true,
			cssStyle:'border:1px solid green;',
			elements:buttonUI,
		},{
			region:'south',height:100,split:true,
			cssStyle:'border:1px solid lightgray;'
		},{
			region:'east',width:200,split:true,
			cssStyle:'border:1px solid pink;'
		},{
			region:'west',width:200,split:true,
			cssStyle:'border:1px solid yellow;'
		},{
			region:'center',title:'标签',
			elements:tabUI
		}]
	}])
});