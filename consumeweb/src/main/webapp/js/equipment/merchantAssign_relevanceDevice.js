//关联设备
garen_define("js/equipment/merchantAssign_relevanceDevice",function (jqObj,loadParams) {
	
	var chargeTypeQuery = "equipment/merchant/chargeTypeQuery.do";//扣款模式
	
	var assignSave = "equipment/merchant/assignSave.do";//商户指定
	var assignListQuery = "equipment/merchant/assignListQuery.do";//指定列表查询
	
	var devSet = "equipment/merchant/devSet.do";//关联设备
	var undev = "equipment/merchant/undev.do";//未关联列表
	
	var relDev_columns = [//列字段定义
	  	[ {
	   		field : 'id',
	   		title : '..',
	   		align : "center",
	   		width : 50,
	   		checkbox:true
	   	}/*,{
	    		field : 'index',
	    		title : '..',
	    		align : "center",    
	    		width : 50
	    	}*/, {
	   		field : 'dev_logic_bh',
	   		title : '设备ID',
	   		align : "center",
	   		width : 100,
	   		hidden:true
	   	},{
	   		field : 'bh',
	   		title : '设备编号',
	   		align : "center",
	   		width : 90
	   	}, {
	   		field : 'mc',
	   		title : '设备名称',
	   		align : "center",
	   		width : 120
	   	}, {
	   		field : 'ip',
	   		title : '设备IP',
	   		align : "center",
	   		width : 90
	   	}, {
	   		field : 'dep_name',
	   		title : '设备场所',
	   		align : "center",
	   		width : 100
	   	}/*, {
	   		field : 'charge_mode',
	   		title : '扣款模式',
	   		align : "center",
	   		width : 180
	   	}*/
	 ] ];
	
	var centerUI = {
		eName:"div",
		cssClass:"merchantAssign_relevanceDevice",
		elements:{
			eName:"formEx",
//			url:devSet,
			onBeforeSave:function(params){
				//$.print("onBeforeSave:")
				//$.print(params)
			},
			onSave:function(retJson){
				if(retJson.result){
					
				}else{
					$.alert(retJson.info);
				}
			},
			elements:[{
				eName:'div',
				cssClass:'merchantAssign_relDev_firstDiv',
				elements:[{
					eName:'textbox',
					name:'search_txt',
					prompt:'请输入设备名称、设备IP等模糊查询',
					width:220
				},{
					eName:'linkbutton',
					text:'查询',
					width:50,
					height:25,
					onClick:function(){
						loadDevList(search_txt.textbox("getValue"));
					}
				}]
			},{
				eName:'div',
				cssClass:'merchantAssign_relDev_secondDiv',
				width:"96%",
				height:300,
				elements:[{
					eName:'datagrid',
					id:"undevice",
					idField : 'bh',
//					url:undev,//未关联列表
					columns:relDev_columns,
					alertFlag : false,// 是否弹出默认对话框
					autoload : false,
					pagination: true,
					clientPager:true,
					fitColumns:true,
					singleSelect:false,
					multiple:true,
					onLoadSuccessEx:function(retJson){
						if(retJson.id=="0"){
							
						}else{
							$.alert(retJson.info);
						}
					}
				}]
		},{
			eName:'div',
			cssClass:'merchantAssign_relDev_thirdDiv',
			elements:[{
				eName:'fieldset',
				id:'fieldTable',
				height:50,
				width:"96%",
				elements:[{
					eName:'legend',
					id:'legendTable',
					text:'扣款模式'
				}]
			}]
		}]
		}
	};
	
	var southUI = {
		eName:"div",
		cssClass:'merchantAssign_relevanceDevice_button_div',
		elements:[{
			eName:"linkbutton",
			uId:"tm2",
			text : '确定',
			width : 60,
			height : 30,
			onClick:save
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
	};
	
	var mainUI = {
		eName:"layoutExt",
		fit : true,
		elements : [{
			region : 'center',
			cssStyle:"overflow:auto;",
			elements : centerUI
		},{
			region : 'south',
			height : 50,
			elements : southUI
		}]
	}

	
	jqObj.loadUI(mainUI);

	var dataTable = jqObj.findJq("undevice");//未关联datagrid
	var myfieldset = jqObj.findJq("fieldTable");//扣款模式
	var myform = jqObj.findJq("formEx");
	var legendTable = jqObj.findJq("legendTable");//扣款模式lengend
	var search_txt = jqObj.findJq('search_txt');//搜索查询
	var merchantAssign_relDev_thirdDiv = jqObj.findJq("merchantAssign_relDev_thirdDiv");//
	
	loadTable();//加载未关联设备
	chargeType();//加载扣款模式
	
	
	function loadTable(){//加载未关联设备
		dataTable.datagrid("loadEx",{url:undev});
	}
	
	function chargeType(){
		merchantAssign_relDev_thirdDiv.createUI({
			addMode:'after',
			eName:'div',
			cssStyle:'margin-left: 2%; width: 96%; margin-top: 10px;',
			elements:[{
				eName:'input',
				cssStyle:"margin-left: 16px;vertical-align: middle;margin-top: -2px;margin-right: 5px;",
				type:'checkbox',
				checked:true,
				name:'ifc'
			},{
				eName:'span',
				text:"允许记账消费"
			}]
		});
		$.loadEx(chargeTypeQuery,function(retJson){//同步
			for(var i=retJson.data.length-1;i>=0;i--){
				legendTable.createUI({
					addMode:'after',
					eName:'div',
					cssStyle:'display:inline-block',
					elements:[{
						eName:'input',
						type:'radio',
						name:'ra',
						value:retJson.data[i].type,
					},{
						eName:'span',
						text:retJson.data[i].name
					}]
				})
			}
			var put = jqObj.find('input[name=ra]')[0];
			put.checked = 'checked';
		});
	}

	function save(){//设置关联
		var rows = dataTable.datagrid("getCheckedEx");
		var val = jqObj.find('input[name=ra]:checked').val();
		var bhs = [];
		var params = {};
		
		$.each(rows, function (i, row) {
    		//将对象放到数组中
    		bhs.push(row.bh);
        });
		
    	if(rows == ''){
    		$.alert('请选择设备!');
    	}else{
            params['bh'] = bhs.join(',');//主键参数
            params['type'] = val;
            params['merchant_account_id'] = loadParams.params.join(',');
            var ifc = jqObj.findJq('ifc');//允许记账消费
            if(ifc.prop("checked")){
    			params['ifc'] = "1";
    		}else{
    			params['ifc'] = "0";
    		}
            $.postEx(devSet,params,function(retJson){//关联设备
    			if(retJson.result){
    				loadParams.callback();//刷新表格
    				$.alert("设备在线生效，请检查设备待机界面商户提示！");
    				jqObj.window("close");
    			}else{
    				$.alert(retJson.info);
    			}
    		});
    	}
	}
	
	function loadDevList(param){
		$.progress('正在加载设备列表...');
		var params = {};
		var mc = [];
		var dev_ip = [];
		var d = dataTable.datagrid('getData');
		$.each(d.rows,function(i, da){
			mc.push(da.mc);
			dev_ip.push(da.ip);
		});
		params['mc'] = mc.join();
		params['dev_logic_bh'] = dev_ip.join();
		$.postEx(undev,params,function(retJson){
			if(retJson.result && retJson.data){
				if(param){
					var data = [];
					$.each(retJson.data,function(i, row){
						if(row.mc.indexOf(param)!=-1){
							data.push(row);
						}
						else if(row.ip.indexOf(param)!=-1){
							data.push(row);
						}
					});
					dataTable.datagrid("loadDataEx",data);
				}else{
					dataTable.datagrid("loadDataEx",retJson.data);
				}
				$.progress("close");
			}
		});
	}
	
	
//	var addAssignUI = {
//		eName:"div",
//		cssClass:"merchantAssign_addAssign",
//		elements:[{
//			eName:"div",
//			elements:loadInit()
//		},{
//			eName:"div",
//			cssClass:'merchantAssign_addAssign_button_div',
//			elements:[{
//				eName:"linkbutton",
//				text : '保存',
//				cssClass : 'merchantAssign_addAssign_linkbutton',
//				width : 80,
//				height : 35,
//				onClick:save
//			},{
//				eName:"linkbutton",
//				text : '取消',
//				cssClass : '',
//				width : 80,
//				height : 35,
//				onClick:function(){
//					jqObj.window("close");
//				}
//			}]
//		}]
//	}
	
	/*function loadInit(){
//		$.loadEx(chargeTypeQuery,function(retJson){//同步
//			if(retJson.result && retJson.data){
//				chargeList.combobox("loadDataEx",retJson.data);//这里要修改
//			}
//		});
		
		var loadParam = loadParams.params;
		
		var fieldsets = [];
		$.each(loadParams.params,function(i, row){
			$.print(row)
			var fieldsetUI = {
				eName:"fieldset",
				width:"91%",
				height:120,
				elements:[{
					eName:'legend',
					text:'设备编号：'+row.bh
				},{
					eName:"div",
//					cssClass:"merchantAssign_addAssign_first",
					elements:[{
						eName:"div",
						elements:[{
							eName:"span",
							text:"设备名称"
						},{
							eName:"textbox",
							value:row.mc,
							disabled:true,
							width:100
						},{
							eName:"input",
							type:"hidden",
							value:row.bh,
							name:"bh"
						},{
							eName:"span",
							text:"扣款模式"
						},{
							eName:"combobox",
							name:"type",
							panelHeight:$.browser.msie9?200:'auto',
							panelMaxHeight:200,
							editable:false,
						//	id:'chargeList',
							valueField:"type_str",
					        textField:"name",
					        value:row.type,
							width:100,
							url:chargeTypeQuery
						}]
					},{
						eName:"div",
						elements:[{
							eName:"span",
							elements:"商户&emsp;&emsp;"
						},{
							eName:"input",
							type:"hidden",
							name:"merchant_account_id",
							value:row.merchant_account_id
						},{
							eName:"textbox",
							name:"merchant_name",
							value:row.merchant_name,
							disabled:true,
							width:100
						},{
							eName:"linkbutton",
							uId:"tm1",
//							cssClass:"merchantAssign_addAssign_linkbutton",
							text:"指定商户",
							onClick:assignMerchant
						}]
					},{
						eName:"div",
						elements:[{
							eName:"span",
							elements:"设备IP&emsp;"
						},{
							eName:"textbox",
							value:row.ip,
							disabled:true,
							width:100
						},{
							eName:"span",
							text:"设备类型"
						},{
							eName:"textbox",
							value:"消费机",
							disabled:true,
							width:100
						}]
					}]
				}]
			}
		
			fieldsets.push(fieldsetUI);
		});
		return fieldsets;
	}*/
	/*
	function assignMerchant(){
		//var $this = $(this);
		var myfieldset = $(this).parents("fieldset");
		//$.print(myfieldset);
		var myWin = $.createWin({
			title:"确认信息",
			width:430,
			height:300,
			queryParams:{
				callback:function(row){
					var merchant_name = myfieldset.findJq("merchant_name");
					var merchant_account_id = myfieldset.findJq("merchant_account_id");
					merchant_name.textbox("setValue",row.merchant_name);
					merchant_account_id.val(row.merchant_account_id);
				}
			},
			url:"js/equipment/merchantList.js"
		});
	}
	*/
	
	/*
	function save(){
		var params = [];
		$.each(myfieldset,function(i, fieldset){
			$.print($(fieldset).findJq("merchant_account_id").val());
			var param = {};
			param['bh'] = $(fieldset).findJq("bh").val();
			param['merchant_account_id'] = $(fieldset).findJq("merchant_account_id").val();
			param['type'] = $(fieldset).findJq("type").combobox("getValue");
			params.push(param);
		});
		
		$.postJson(assignSave,params,function(retJson){
			if(retJson.result){
				loadParams.callback();
				jqObj.window("close");
			}else{
				$.alert(retJson.info);
			}
		});
//		$.postEx(assignSave,data,function(retJson){
//			if(retJson.result){
//				loadParams.callback();
//				jqObj.window("close");
//			}else{
//				$.alert(retJson.info);
//			}
//		});
	}*/
});	