/**
 * 
 */

$(function(){
	var mainBody = $("body");
	
	function test1(){
		testObj.loadUI({
			eName:"treeEx",
			url:"sys/syscode/boxJson.do",
			id:"dep_serial",
			pid:"dep_parent",
			text:"dep_name",
			toolbar:[{
				eName:"searchbox",
				searcher:function(v){
					$.print(v);
				}
			}],
			onClickEx:function(){
				//$.print(this);
				$.alert(encodeURI("汉字") );
			}
		});
	}
	
	mainBody.loadUI([{
		eName:"div",
		height:100,
		elements:[{
			eName:"linkbutton",
			text:"treeEx测试1",
			cssStyle:"margin:10px;",
			onClick:function(){
				//test1();
				$.alert(encodeURI("abc传入参数非法") );
			}
		},{
			eName:"linkbutton",
			text:"treeEx测试2",
			cssStyle:"margin:10px;",
			onClick:function(){
				var treeObj = testObj.findJq("tree");
				$.print(treeObj.tree('getChecked',['checked','indeterminate1']));
				//treeObj.tree("reload");
			}
		}]
	},{
		eName:"div",
		cssStyle:"border:1px solid #aaa;overflow:auto;",
		elements:{
			eName:"div",
			id:"test_div",
			cssStyle:"border:1px solid red;",
			width:260,
			height:300
		}
	}]);
	
	var testObj = mainBody.findJq("test_div");
	
	mainBody.loadUI([{
		eName:'datespinnerEx',
		dateType:['Y','M','D','H','m','S']
		
	},{
		eName:'linkbutton',text:'禁用',width:50,
		onClick:function(){
			d.numberDisable(true);
		}
	},{
		eName:'linkbutton',text:'启用',width:50,
		onClick:function(){
			d.numberDisable(false);
		}
	},{
		eName:'linkbutton',text:'设置对象最大最小值',width:140,
		onClick:function(){
			d.getHourCount(jqHour,1,4);
			d.getHourCount(jqMin,2,5);
		}
	}])
	var d = mainBody.findJqUI("datespinnerEx");
	var jqYear = mainBody.findJq("spin_year");
	var jqMonth = mainBody.findJq("spin_month");
	var jqDay = mainBody.findJq("spin_day");
	var jqHour = mainBody.findJq("spin_hour");
	var jqMin = mainBody.findJq("spin_min");
	var jqSecond = mainBody.findJq("spin_second");
	var jqInput = mainBody.findJq("spin_hidden");
	
	var columns = [[
					{field:'dep_no',checkbox:true},
					{field:'dep_name',title:'全部',width:130},
	]];
	
	mainBody.loadUI([{
		addMode:3,
		eName:'formUI',
		cssStyle:'margin:10px',
		elements:{
			eName:'combogrid',
			multiple: true,
			width:300,
			//panelWidth:500,
			singleSelect: false,
			url:"wsBase/depQuery.do",
			columns:[[
				{field:'dep_serial',checkbox:true},
				{field:'dep_name',title:'全部',width:230}
			]],
			selectOnCheck:true,
            idField: 'dep_serial',
            textField: 'dep_name',
            onCheckAll:function(){
            	//$(this).combogrid('setText','全部');
            	$(this).combogrid('setValue','').combogrid("setText","全部");
            },
            onUnCheckAll:function(){
            	$(this).combogrid('clear');
            }
		}
	},{
		eName:'linkbutton',
		text:'测试1',cssStyle:'margin:10px',
		width:110,
		onClick:function(){
			//$.alert(combogrid.combogrid("getText") + "===" + 
					//combogrid.combogrid("getValues"));//获取cmbGrid的文体上显示值
			//var boxgrid = combogrid.combogrid("grid");
			//boxgrid.datagrid("loadData",[]);
			//$.print($.fn.combogrid.methods);
			combogrid.combogrid('setValue','').combogrid("setText","全部");
		}
	},{
		eName:'linkbutton',
		text:'测试2',cssStyle:'margin:10px',
		width:110,
		onClick:function(){
			$.alert(combogrid.combogrid("getText") + "===" + 
					combogrid.combogrid("getValues"));//获取cmbGrid的文体上显示值
			//var boxgrid = combogrid.combogrid("grid");
			//boxgrid.datagrid("loadData",[]);
			//$.print($.fn.combogrid.methods);
			//combogrid.combogrid("setText","全部").combogrid('setValue','');
		}
	}])
	var combogrid = mainBody.findJq("combogrid");
	var grid = combogrid.findJq("grid");
//	var r = combogrid.combogrid('getSelected');	

});

