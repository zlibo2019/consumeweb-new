//操作员授权设置
garen_define("js/permission/opPermis_setWin",function (jqObj,loadParams) {

	var cardTypeQuery = "account/cardTypeQuery.do";//全部卡号类型查询
		
	var opSetQuery = "permission/permissions/opSetQuery.do";//操作员查询
	var merchantSetQuery = "permission/permissions/merchantSetQuery.do";//商户查询
	var ipSetQuery = "permission/permissions/ipSetQuery.do";//ip查询
	var opSetSave = "permission/permissions/opSetSave.do";//操作员保存
	var merchantSetSave = "permission/permissions/merchantSetSave.do";//商户保存
	var ipSetSave = "permission/permissions/ipSetSave.do";//ip保存
	var merchantData = "";
	
    var centerNorthUI = {
		eName:"div",
		cssClass:"opPermis",
		elements:[{
			eName:"div",
			cssClass:"oper_list",
			select:1,
			elements:"操作员报表授权",
			onClick:select
		},{
			eName:"div",
			cssClass:"commer_list",
			select:0,
			elements:"商户报表授权",
			onClick:select
		},{
			eName:"div",
			cssClass:"ip_list",
			select:0,
			elements:"IP地址授权",
			onClick:select
		}]
	}	
	//商户报表授权
	var columns = [//列字段定义
		[ {
		    field : 'ch',
		    title : 'ch',
		    align : "center",  
		    checkbox:true,
		    width : 50
       },{
	       field : 'index',
	       title : '..',
	       align : "center",
	       width : 50
       },{
	       field : 'merchant_account_id',
	       title : '商户id',
	       hidden: true,
	       align : "center",
	       width : 100
       },{
	       field : 'merchant_name',
	       title : '商户名称',
	       align : "center",
	       width : 140
       }
	] ];					
	//IP地址授权	
	var columns2 = [//列字段定义
	    [{
	      field : 'ip',
	      title : 'IP地址',
	      align : "center",  
	      width : 150,
	      editor:{type:"text"}
		},{
	       field : 'bz',
	       title : '备注',
	       align : "center",
	       width : 300,
	       editor:{type:"text"}
	    }
	   ] ];	
		
	var centerCenterUI = {
		eName:"div",
		elements:{
			eName:"formUI",
			id:"settingForm",
			method:"post",//上传表单时，必须设置此值
			//url:'',
			alertFlag:false,
			elements:[{
				eName:"div",
				height: 300,
				id:"opPermisDiv",
				display: "block",
				elements:[{
					eName : 'div',
					cssStyle:'margin-top:30px;',
					elements :[{
						eName : 'div',
						//cssStyle:'margin-top:30px;',
						elements : [{
							eName:"span",
							cssStyle:"margin-left:70px;",
							elements:[{
								eName : 'input',
								cssClass:"manage_checkbox",
								id:"op0",
								name:"isall",
								type : 'radio',
								value:1
							},{
								eName : 'span',
								cssStyle:"margin-right: 10px;",
								text : '允许查询所有操作员'
							}]
						}]
					},{
						eName : 'div',
						cssStyle:'margin-top:20px;',
						elements : [{
							eName:"span",
							cssStyle:"margin-left:70px;",
							elements:[{
								eName : 'input',
								cssClass:"manage_checkbox",
								id:"op1",
								name:"isall",
								type : 'radio',
								value:0
							},{
								eName : 'span',
								cssStyle:"margin-right: 10px;",
								text : '仅查询本操作员'
							}]
						}]
					}]
			    }]
			},{  
				eName : 'div',
				id  :"centerTableDiv",
				display: "none",
				height:300,
		        elements :[{
					eName:'div',
					cssStyle:'margin-top:15px;margin-left:30px;',
					elements:[{
						eName : 'input',
						name : 'merchant_check',
						cssClass:"charge_correction_checkbox",
						type : 'checkbox',
						onClick:function(){
							if($(this).prop("checked")){
								centerTable.datagrid("loadDataEx",[]);
							}else{
								centerTable.datagrid("loadDataEx",merchantData);
							}
						}
					},{
						eName : 'span',
						text : '允许查询所有商户'
					}]
				},{
				eName:"div",
				cssStyle:'margin-top:15px;',
				height:230,
				//id:"centerTableDiv",
				elements:{
					eName : 'datagrid',
					id:"centerTable",
					idField : 'merchant_account_id',
					columns : columns,
					pagination: false,
					clientPager:true,
					alertFlag : false,// 是否弹出默认对话框
					autoload : false,
					singleSelect:false,
					checkOnSelect:true,
					selectOnCheck:true,
					onLoadSuccessEx:function(retJson){
						if(retJson.id=="0"){
							$.each(retJson.rows,function(i,row){
								if(row.ischecked == 1){
									var index = centerTable.datagrid("getRowIndex",row);
									centerTable.datagrid("checkRow",index);
								}
							});
						}else{
							$.alert(retJson.info);
						}
					}
				}
			}]
		    },{
		      eName : 'div',
			  id : "centerTableDiv2",
			  display: "none",
			  height : 300,
			  elements :[{
		          eName:'div',
			      cssStyle:'margin-top:15px;margin-left:30px;',
				  elements:[
						{
							eName : 'input',
							name : 'ip_check',
							cssClass:"charge_correction_checkbox",
							type : 'checkbox',
							onClick:function(){
								if($(this).prop("checked")){
									centerTable2.datagrid("loadDataEx",[]);
								}else{
									centerTable2.datagrid("loadDataEx",[{'ip':'','bz':''},{'ip':'','bz':''},{'ip':'','bz':''},{'ip':'','bz':''},{'ip':'','bz':''},{'ip':'','bz':''},{'ip':'','bz':''},{'ip':'','bz':''}]);
								}
							}
						},{
							eName : 'span',
							text : '允许所有IP地址'
						}
					]
		    },{
		    	eName:"div",
		    	height:230,
		    	cssStyle:'margin-top:15px;',
		   		   //id:"centerTableDiv2",
		   		   elements:{
		   	   		   eName : 'datagrid',
		   	   		   id:"centerTable2",
		   	   		   idField : 'merchant_account_id',
		   	   		   columns : columns2,
		   	   		   pagination: false,
		   	   		   clientPager:true,
		   	   		   alertFlag : false,// 是否弹出默认对话框
		   	   	       autoload : false,
		   	   		   singleSelect:true,
		   	   		   checkOnSelect:true,
		   	   		   selectOnCheck:true,
		   	   		   onClickCell:onClickCell,
		   	   		   onLoadSuccessEx:function(retJson){
		   	   			   if(retJson.id=="0"){
		   	   				
		   	   			   }else{
		   	   				   $.alert(retJson.info);
		   	   			   }
		   	   		   }
		   		   }
			    }]
			}]
		}
	};
	
	var southUI ={
			eName:"div",
			height : 100,
			elements:[{
				eName:"div",
				cssClass:'cardNumImp_addCost_button_div',
				elements:[{
					eName:"linkbutton",
					uId:"tm2",
					text : '确定',
					cssClass : 'cardNumImp_addCost_linkbutton',
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
			}]
	}
	var mainUI = {
			eName : 'layoutExt',// 容器布局类，jeasyui组件
			cssStyle:'font-family: 微软雅黑, Arial;',
			fit : true,	
			elements : [{
				region : 'north',
				height : 30,
				elements : centerNorthUI
			},{
				region : 'center',
				elements : centerCenterUI
			},{
				region : 'south',
				height : 70,
				elements : southUI
			}]
		}	
		
		
	jqObj.loadUI(mainUI);
	// 卡类型查询

	var centerTable = jqObj.findJq("centerTable");
	var centerTable2 = jqObj.findJq("centerTable2");
	
	var opPermisDiv = jqObj.findJq("opPermisDiv");
	var centerTableDiv = jqObj.findJq("centerTableDiv");
	var centerTableDiv2 = jqObj.findJq("centerTableDiv2");
	var oper_list = jqObj.findJq("oper_list");
	var commer_list = jqObj.findJq("commer_list");
	var ip_list = jqObj.findJq("ip_list");
	var settingForm = jqObj.findJq("settingForm");
	var op0 = jqObj.findJq("op0");
	var op1 = jqObj.findJq("op1");
	var merchant_check = jqObj.findJq("merchant_check");
	var ip_check = jqObj.findJq("ip_check");
	
	
	loadInit();
	
	function loadInit(){
		var param = {};
		param['glyId'] = loadParams.params.gly_no;
		$.postEx(opSetQuery,param,function(retJson){
			if(retJson.result){
				if(retJson.retData.isall=="1"){
					op0.prop("checked",true);
				}else{
					op1.prop("checked",true);
				}
			}
		});
		$.postEx(merchantSetQuery,param,function(retJson){
			if(retJson.result){
				merchantData = retJson.data;
				if(retJson.retData.isall=="1"){
					merchant_check.prop("checked",true);
					centerTable.datagrid("loadDataEx",[]);
				}else{
					merchant_check.prop("checked",false);
					window.setTimeout(function(){//延迟优化显示，防止数据未加载完就resize
						centerTable.datagrid("loadDataEx",retJson.data);
					},300);
					
				}
				
			}
		});
		$.postEx(ipSetQuery,param,function(retJson){
			if(retJson.result){
				if(retJson.retData.isall=="1"){
					ip_check.prop("checked",true);
					centerTable.datagrid("loadDataEx",[]);
				}else{
					ip_check.prop("checked",false);
					if(retJson.data.length>0){
						centerTable2.datagrid("loadDataEx",retJson.data);
					}else{
						centerTable2.datagrid("loadDataEx",[{'ip':'','bz':''},{'ip':'','bz':''},{'ip':'','bz':''},{'ip':'','bz':''},{'ip':'','bz':''},{'ip':'','bz':''},{'ip':'','bz':''},{'ip':'','bz':''}]);
					}
					
				}
				
			}
		});
	}
	
	$.extend($.fn.datagrid.methods, {
		editCell: function(jq,param){
			return jq.each(function(){
				var opts = $(this).datagrid('options');
				var fields = $(this).datagrid('getColumnFields',true).concat($(this).datagrid('getColumnFields'));
				for(var i=0; i<fields.length; i++){
					var col = $(this).datagrid('getColumnOption', fields[i]);
					col.editor1 = col.editor;
					if (fields[i] != param.field){
						col.editor = null;
					}
				}
				$(this).datagrid('beginEdit', param.index);
				for(var i=0; i<fields.length; i++){
					var col = $(this).datagrid('getColumnOption', fields[i]);
					col.editor = col.editor1;
				}
			});
		}
	});
	var editIndex = undefined;
	function endEditing(){
		if (editIndex == undefined){return true}
		if (centerTable2.datagrid('validateRow', editIndex)){
			centerTable2.datagrid('endEdit', editIndex);
			editIndex = undefined;
			return true;
		} else {
			return false;
		}
	}
	function onClickCell(index, field){
		if (endEditing()){
			centerTable2.datagrid('selectRow', index)
					.datagrid('editCell', {index:index,field:field});
			editIndex = index;
		}
	}
	
	function save(){
		var param1 = {};
		param1['glyId'] = loadParams.params.gly_no;
		if(op0.prop("checked")){
			param1['isall'] = "1";
		}else{
			param1['isall'] = "0";
		}
		$.postEx(opSetSave,param1,function(retJson){
			if(retJson.result){
				save2();
			}else{
				$.alert(retJson.info);
			}
		});
	}
	
	function save2(){
		var param2 = {};
		param2['glyId'] = loadParams.params.gly_no;
		if(merchant_check.prop("checked")){
			param2['isall'] = "1";
		}else{
			param2['isall'] = "0";
			var rows = centerTable.datagrid("getCheckedEx");
			var details = [];
			$.each(rows,function(i,row){
				details.push(row.merchant_account_id);
			});
			param2['detail'] = details.join();
		}
		$.postEx(merchantSetSave,param2,function(retJson){
			if(retJson.result){
				save3();
			}else{
				$.alert(retJson.info);
			}
		});
	}
	
	function save3(){
		var param3 = {};
		param3['glyId'] = loadParams.params.gly_no;
		if(ip_check.prop("checked")){
			param3['isall'] = "1";
		}else{
			param3['isall'] = "0";
			var rows = centerTable2.datagrid("getRows");
			var details = [];
			$.each(rows,function(i,row){
				details.push(row.ip + "#" + row.bz);
			});
			param3['detail'] = details.join();
		}
		$.postEx(ipSetSave,param3,function(retJson){
			if(retJson.result){
				loadParams.callback();
				jqObj.window("close");
			}else{
				$.alert(retJson.info);
			}
		});
	}
	
	//切换商户列表和商户部门列表
	function select(){
		// 样式oper_lis为取消选中状态时
		if($(this).attr("class")=="oper_list" && $(this).findUI().select==0){
			
			//设置选中属性的值为选中
			$(this).findUI().select=1;
			//其它两个tab页为未选中
			commer_list.findUI().select=0;
			ip_list.findUI().select=0;
			//样式
			$(this).css({"background":"#2274B9","color":"#ffffff"});
			commer_list.css({"background":"#ffffff","color":"#000000"});
			ip_list.css({"background":"#ffffff","color":"#000000"});
			opPermisDiv.show();
			centerTableDiv.hide();
			centerTableDiv2.hide();
			//centerTable.datagrid("resize");
		}
		// 样式commer_list为取消选中状态时
		if($(this).attr("class")=="commer_list" && $(this).findUI().select==0){
			//设置选中属性的值为选中
			$(this).findUI().select=1;
			//其它两个tab页为未选中
			oper_list.findUI().select=0;
			ip_list.findUI().select=0;
			//样式
			$(this).css({"background":"#2274B9","color":"#ffffff"});
			oper_list.css({"background":"#ffffff","color":"#000000"});
			ip_list.css({"background":"#ffffff","color":"#000000"});
			
			centerTableDiv.show();
			opPermisDiv.hide();
			centerTableDiv2.hide();
			centerTable.datagrid("resize");
			
		}
		// 样式ip_list为取消选中状态时
		if($(this).attr("class")=="ip_list" && $(this).findUI().select==0){
			//标识
			$(this).findUI().select=1;//已选中
			//其它两个tab页为未选中
			oper_list.findUI().select=0;
			commer_list.findUI().select=0;
			
			//样式
			$(this).css({"background":"#2274B9","color":"#ffffff"});
			oper_list.css({"background":"#ffffff","color":"#000000"});
			commer_list.css({"background":"#ffffff","color":"#000000"});
			
			centerTableDiv2.show();
			opPermisDiv.hide();
			centerTableDiv.hide();
			centerTable2.datagrid("resize");
		}
	}

});
	