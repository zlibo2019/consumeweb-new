//商户注册
garen_define("js/merchant/register",function (jqObj,loadParams) {
	
	var departmentQuery = "merchant/departmentQuery.do";//部门查询
	
	var registerTypeQuery = "merchant/registerTypeQuery.do";//类型查询
	
	var registerSave = "merchant/registerSave.do";//保存
	
	var merchantQuery = "merchant/merchantQuery.do"//商户查询
	
	//工具栏
	var toolBar = [null,{
		eName : 'div',
		height:10,
		cssStyle : 'background:#ffffff;'
	}, {
		eName : 'div',
		cssClass:"register_toolBar_third",
		elements : [{
			eName : 'div',
			elements:{
				eName:"formUI",
				id:"saveForm",
				method:"post",//上传表单时，必须设置此值
				url:registerSave,
				alertFlag:false,
				//progressBar:"保存中...",
				onBeforeSave:function(params){
					if(!params.merchant_name){
						$.alert("请输入名称！");
						return false;
					}
					else if(!params.fee_rate){
						$.alert("请输入管理费率！");
						return false;
					}
					else if(!params.merchant_dep){
						$.alert("请选择商户部门！");
						return false;
					}
					else if(!params.merchant_account_type){
						$.alert("请选择商户类型！");
						return false;
					}
					else if(params.fee_rate){
						var f = fee_rate.textbox("getValue");
						var fee = f.substring(0,f.length-1);
						params['fee_rate'] = fee;
					}
					
				},
				onSave:function(retJson){
					if(retJson.result){
						back2Init();
						dataTable.datagrid("loadEx",{url:merchantQuery});
					}else{
						$.alert(retJson.info);
					}
				},
				elements : [{
					eName : 'div',
					cssClass:"register_toolBar_third_div",
					elements : [{
						eName : 'span',
						elements : '名&emsp;&emsp;称',
						cssClass:"register_span",
						cssStyle : 'margin-left:15px;'
						},{
							eName : 'textbox',
							name : 'merchant_name',
							//required:true,
							width : 120,
							height : 25,		
							value:''//默认值
						},{
							eName : 'span',
							elements : '地&emsp;&emsp;址',
							cssClass:"register_span",
						},{
							eName : 'textbox',
							name : 'merchant_addr',
							width : 120,
							height : 25,		
							value:''//默认值
						},{
							eName : 'span',
							elements : '账&emsp;&emsp;号',
							cssClass:"register_span",
						},{
							eName : 'textbox',
							name : 'account_no',
							width : 120,
							height : 25,		
							value:''//默认值
						},{
							eName : 'span',
							text : '联系电话',
							cssClass:"register_span",
						},{
							eName : 'textbox',
							name : 'merchant_telephone',
							width : 120,
							height : 25,		
							value:''//默认值
						},{
							eName : 'span',
							elements : '联&ensp;系&ensp;人',
							cssClass:"register_span",
						},{
							eName : 'textbox',
							name : 'link_man',
							width : 120,
							height : 25,		
							value:''//默认值
						}]
				}
			,{
				eName : 'div',
				cssClass:"register_toolBar_third_div",
				elements : [{
					eName : 'span',
					text : '银行账户',
					cssClass:"register_span",
					cssStyle : 'margin-left:15px;'
				},{
					eName : 'textbox',
					name : 'merchant_bank_account',
					validType:'number',
					width : 120,
					height : 25,		
					value:''//默认值
				},{
					eName : 'span',
					text : '开户银行',
					cssClass:"register_span",
				},{
					eName : 'textbox',
					name : 'merchant_bank',
					width : 120,
					height : 25,
					value:''//默认值
				},{
					eName : 'span',
					text : '管理费率',
					cssClass:"register_span",
				},{
					eName : 'textbox',
					name : 'fee_rate',
					//required:true,
					validType:['percent','percentMax'],
					width : 120,
					height : 25,		
					onChange:percent
				},{
					eName : 'span',
					text : '商户类型',
					cssClass:"register_span",
				},{
					eName : 'combobox',
					name : 'merchant_account_type',
					panelHeight:$.browser.msie9?200:'auto',
					panelMaxHeight:200,
					width : 120,
					height : 25,
					editable:false,
					valueField: 'type_str',
					textField: 'name',
					value:'',//默认值
				},{
					eName : 'span',
					text : '商户部门',
					cssClass:"register_span",
				},{
					eName : 'combotree',
					name : 'merchant_dep',
					panelHeight:$.browser.msie9?200:'auto',
					panelMaxHeight:200,
					//required:true,
					width : 120,
					height : 25,
					editable:false,
					value:'',//默认值
					onSelect:function(node){//选择相同则清空文本内容
						if(merchant_dep.combo("getText")==node.text){
							merchant_dep.combotree("clear");
						}
					}
				}]
			}]
		}},{
			eName : 'div',
			elements : {
				eName : 'div',
				elements : [{
					eName : 'linkbutton',
					uId:"tm1",
					width:70,
					height:70,
					id:"edit_btn",
					cssClass:'register_linkbutton',
					cssStyle:"margin-left:10px;",
					text:"添加",
					onClick : edit
				},{
					eName : 'linkbutton',
					uId:"tm1",
					width:70,
					height:70,
					id:"cancle_btn",
					cssClass:'register_linkbutton',
					cssStyle:"margin-left:10px;display:none;",
					text:"取消",
					onClick : cancle
				},{
					eName : 'linkbutton',
					uId:"tm2",
					width:70,
					height:70,
					id:"save_btn",
					cssClass:'register_linkbutton',
					text:"保存",
					onClick : function(){
						saveForm.submit();
					}
				}]
			}
		}]
	}];
	
	var columns = [//列字段定义
      	[ {
       		field : 'xh',
       		title : '序号',
       		align : "center",
       		checkbox : true,
       		width : 100
       	}, {
       		field : 'index',
       		title : '..',
       		align : "center",    
       		width : 50
       	}, {
       		field : 'merchant_account_id',
       		title : '账号',
       		align : "center",
       		width : 80
       	}, {
       		field : 'merchant_name',
       		title : '名称',
       		align : "center",
       		width : 100
       	}, {
       		field : 'merchant_state',
       		title : '商户状态',
       		align : "center",
       		width : 100
       	}, {
       		field : 'link_man',
       		title : '联系人',
       		align : "center",
       		width : 100
       	}, {
       		field : 'merchant_dep',
       		title : '商户部门',
       		align : "center",
       		width : 100
       	}, {
       		field : 'merchant_account_type',
       		title : '商户类型',
       		align : "center",
       		width : 100
       	}, {
       		field : 'fee_rate_str',
       		title : '管理费率',
       		align : "center",
       		width : 100
       	}, {
       		field : 'merchant_addr',
       		title : '地址',
       		align : "center",
       		width : 130
       	}, {
       		field : 'merchant_bank_account',
       		title : '银行账户',
       		align : "center",
       		width : 130
       	}, {
       		field : 'merchant_bank',
       		title : '开户银行',
       		align : "center",
       		width : 130
       	}, {
       		field : 'merchant_telephone',
       		title : '联系电话',
       		align : "center",
       		width : 80
       	}] ];
	
	var centerUI = {
		eName : 'datagrid',
		idField : 'merchant_account_id',
		id : 'dataTable',
		toolbarEx : toolBar,// 查询条件工具栏
		columns : columns,
		pagination: true,
		clientPager:true,
		alertFlag : false,// 是否弹出默认对话框
		autoload : false,
		singleSelect:true,
		checkOnSelect:true,
		selectOnCheck:true,
		onLoadSuccessEx:function(retJson){
			if(retJson.id=="0"){
				
			}else{
				$.alert(retJson.info);
			}
		}
	};
	
	var mainUI = {
		eName : 'layoutExt',// 容器布局类，jeasyui组件
		cssStyle:'font-family: 微软雅黑, Arial;',
		fit : true,
		elements : [{
			region : 'center',
			elements : centerUI
		}]
	}
	

	jqObj.loadUI(mainUI);
	var dataTable = jqObj.findJq("dataTable");
	
	var merchant_name = jqObj.findJq("merchant_name");
	var merchant_addr = jqObj.findJq("merchant_addr");
	var merchant_telephone = jqObj.findJq("merchant_telephone");
	var link_man = jqObj.findJq("link_man");
	var merchant_bank_account = jqObj.findJq("merchant_bank_account");
	var merchant_bank = jqObj.findJq("merchant_bank");
	var fee_rate = jqObj.findJq("fee_rate");
	var merchant_account_type = jqObj.findJq("merchant_account_type");
	var merchant_dep = jqObj.findJq("merchant_dep");
	var account_no = jqObj.findJq("account_no");
	var cancle_btn = jqObj.findJq("cancle_btn");
	var edit_btn = jqObj.findJq("edit_btn");
	var save_btn = jqObj.findJq("save_btn");
	var saveForm = jqObj.findJqUI("saveForm");
	
	loadInit();
	loadTree();
	loadType();
	
	function loadInit(){
		merchant_name.textbox("disable");
		merchant_addr.textbox("disable");
		merchant_telephone.textbox("disable");
		link_man.textbox("disable");
		merchant_bank_account.textbox("disable");
		merchant_bank.textbox("disable");
		fee_rate.textbox("disable");
		merchant_account_type.textbox("disable");
		merchant_dep.textbox("disable");
		account_no.textbox("disable");
		save_btn.linkbutton("disable");
		dataTable.datagrid("loadEx",{url:merchantQuery});
	}
	
	function edit(){
		merchant_name.textbox("enable");
		merchant_addr.textbox("enable");
		merchant_telephone.textbox("enable");
		link_man.textbox("enable");
		merchant_bank_account.textbox("enable");
		merchant_bank.textbox("enable");
		fee_rate.textbox("enable");
		fee_rate.textbox("setValue","0.00%");
		merchant_account_type.textbox("enable");
		merchant_dep.textbox("enable");
		account_no.textbox("setValue","自动获取");
		save_btn.linkbutton("enable");
		cancle_btn.css("display","");
		edit_btn.css("display","none");
	}
	
	function cancle(){
		back2Init();
	}
	
	function back2Init(){
		merchant_name.textbox("disable");
		merchant_name.textbox("setValue","");
		
		merchant_addr.textbox("disable");
		merchant_addr.textbox("setValue","");
		
		merchant_telephone.textbox("disable");
		merchant_telephone.textbox("setValue","");
		
		link_man.textbox("disable");
		link_man.textbox("setValue","");
		
		merchant_bank_account.textbox("disable");
		merchant_bank_account.textbox("setValue","");
		
		merchant_bank.textbox("disable");
		merchant_bank.textbox("setValue","");
		
		fee_rate.textbox("disable");
		fee_rate.textbox("setValue","");
		
		merchant_account_type.textbox("disable");
		merchant_account_type.textbox("setValue","");
		
		merchant_dep.textbox("disable");
		merchant_dep.textbox("setValue","");
		
		account_no.textbox("disable");
		account_no.textbox("setValue","");
		
		save_btn.linkbutton("disable");
		cancle_btn.css("display","none");
		edit_btn.css("display","");
	}
	
	function loadTree(){
		$.postEx(departmentQuery,function(retJson){
			if(retJson.result && retJson.data){
				merchant_dep.combotree('loadData',
						$.list2Tree(retJson.data,"dep_serial","dep_parent","dep_name"));
			}
		});
	}
	
	function loadType(){
		$.postEx(registerTypeQuery,function(retJson){
			if(retJson.result && retJson.data){
				merchant_account_type.combobox('loadDataEx',retJson.data);
			}
		});
	}
	
	function percent(newValue, oldValue){
		//var num = /^[0-9]\d*$/;
		var num = /^(([0-9]\d{0,2})|0)(\.\d{1,2})?$/;
		if(num.test(newValue) && newValue<=100){
			if(newValue.indexOf(".")==-1){
				if(newValue.indexOf("%")==-1){
					fee_rate.textbox("setValue",newValue+".00%");
				}else{
					var v = newValue.substring(0,newValue.length-1);
					fee_rate.textbox("setValue",v+".00%");
				}
			}
			else if(newValue.length - newValue.indexOf(".") - 1 == 1){
				if(newValue.indexOf("%")==-1){
					fee_rate.textbox("setValue",newValue+"0%");
				}else{
					var v = newValue.substring(0,newValue.length-1);
					fee_rate.textbox("setValue",v+"0%");
				}
			}
			else{
				if(newValue.indexOf("%")==-1){
					fee_rate.textbox("setValue",newValue+"%");
				}else{
					var v = newValue.substring(0,newValue.length-1);
					fee_rate.textbox("setValue",v+"%");
				}
			}
		}
	}
	
	//扩展验证
	$.extend($.fn.validatebox.defaults.rules, {    
        percent: {// 百分数验证
            validator: function (value) {
            	return /^(([0-9]\d{0,2})|0)(\.\d{1,2})?%$/i.test(value);
            },
            message: '请输入正确管理费率'
        },
        percentMax: {// 最大值验证
            validator: function (value) {
            	if(value.indexOf("%")==-1){
            		return (Number(value)<=100);
            	}else{
            		return (Number(value.substring(0,value.length-1))<=100);
            	}
            },
            message: '请输入正确管理费率'
        },
        number: {// 正整数验证
            validator: function (value) {
                return /^[0-9]\d*$/i.test(value);
            },
            message: '请输入正确银行账户'
        }
	});  
});
	