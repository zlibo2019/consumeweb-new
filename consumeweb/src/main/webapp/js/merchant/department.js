//商户部门
garen_define("js/merchant/department",function (jqObj,loadParams) {
	
	var departmentQuery = "merchant/departmentQuery.do";//部门查询
	
	var departmentAdd = "merchant/departmentAdd.do";//新增
	
	var departmentUpdate = "merchant/departmentUpdate.do";//修改
	
	var departmentDelete = "merchant/departmentDelete.do";//部门删除
	
	var tagBtn = 0;//区分 新增、修改、删除 按钮
	
	var tNode = "";

	var p = {};
	
	var selectid = null;
	
	var addid = null;
	
	var northUI = {
			
	}
	
	var centerUI = [{
		eName : 'div',
		cssClass:"department_north_div",
		height : 70,
		elements : [{
			eName : 'linkbutton',
			id:"addForm",
			uId:"tm1",
			width:65,
			height:31,
			text:"新增",
			onClick : function(){
				tagBtn = 1;
				enableEname();//启用组件
				clearEname();//清空
				myformOpt.url = departmentAdd;//新增url
				depName.textbox('textbox').focus();
			}
		},{
			eName : 'linkbutton',
			id:"updateForm",
			uId:"tm1",
			width:65,
			height:31,
			text:"修改",
			onClick : function(){
				tagBtn = 2;
				modifyDep();
				myformOpt.url = departmentUpdate;//修改url
			}
		},{
			eName : 'linkbutton',
			uId:"tm2",
			id:"del_btn",
			width:65,
			height:31,
			text:"删除",
			onClick : function(){
				tagBtn = 3;
				deleteDep();
				selectid = null;
			}
		}]
	},{
		eName:'div',cssClass:'department_north_DownDiv',
		elements:{
			eName:'formEx',
			id:"formui",
			method:"post",
			alertFlag:false,
			onBeforeSave:function(params){
				if(tagBtn==2){
				selectid = params.dep_serial;
				}
			},
			onSave:function(retJson){
				addid = retJson.retData.dep_serial;
				
				if(retJson.result){
					var myWin = $.createWin({
						title:"系统提示信息",
						width:300,
						height:150
					},myWinUI);
					window.setTimeout(function(){
						myWin.window("close");
					},1500);
					reloadTree();//刷新树列
					disableEname();//禁用控件
					tagBtn = 0;
				}else{
					$.alert(retJson.info);
				}
			},
			elements:[{
				eName:'div',
				elements:[{
					eName:'span',text:'部门名称'
				},{
					eName:'textbox',
					name:'dep_name',
					disabled:true,
					validType:'length[1,18]',
					invalidMessage:'部门名称长度不正确 '
				},{
					eName:'textbox',
					name:'dep_serial',
					type:"hidden"
				}]
			},{
				eName:'div',cssClass:'department_north_DownDiv_secondDiv',
				elements:[{
					eName:'span',text:'上级部门'
				},{
					eName:'textbox',
					name:'dep_parent',
					width:110,
					editable:false,
					disabled:true
				},{
					eName:'linkbutton',
					name:'selParDep',
					width:65,
					height:31,
					text:'选择',
					disabled:true,
					onClick:function(){
						selDep();//选择上级部门弹窗
					}
				}]
			},{
				eName:'div',cssClass:'department_north_DownDiv_thirdDiv',
				elements:[{
					eName:'linkbutton',
					name:'btn',
					disabled:true,
					width:65,
					height:31,
					text:'确定',
					onClick:function(){
						saveDep();//提交表单
					}
				},{
					eName:'linkbutton',
					name:'btn',
					disabled:true,
					width:65,
					height:31,
					text:'取消',
					onClick:function(){
						disableEname();//禁用组件
						if(tagBtn==1){
							clearEname();//清空控件
							treeSele();//文本框显示选中的信息
							parentNode();
						}
						if(tagBtn==2){
							treeSele();//文本框显示选中的信息
							parentNode();
						}
						tagBtn = 0;
					}
				}]
			}]
		}
	}];
	
	var myWinUI = {
		eName:"div",
		cssStyle:"text-align:center;",
		elements:{
			eName:"span",
			cssStyle:"line-height:100px;font-size:16px;font-family: 微软雅黑, Arial;",
			elements:"保存成功！"
		}
		
	}
	
	function selDep(){//选择上级部门弹窗
		var selDep = $.createWin({
			title:'选择上级部门',
			width:400,height:500,
			bodyUI:{
				eName:'layoutExt',
				fit:true,
				elements:[{
				region:'center',
				cssStyle:"overflow:auto;",
				elements:{
					eName:'tree',
					id:"seFirTree",
					nodeId:"dep_serial",//nodeId
					nodePid:"dep_parent",//nodePid
					nodeText:"dep_name",//nodeText
					url:departmentQuery,
					checkbox:false
				}
			},{
				region:'south',cssClass:'department_selDep_BtnDiv',
				height:70,
				elements:[{
					eName:'linkbutton',
					text:'确定',
					width:65,
					height:31,
					onClick:function(){
						var node = seFirTree.tree('getSelected');
						var flag = 1;
						if(node == null){
							$.alert('请选择上级部门！');
							return false;
						}
						$.each(tNode,function(i, row){
							if(node.dep_serial == row.dep_serial && tagBtn==2){
								$.alert('不能选择自己或者子部门作为其上级部门！');
								flag = 0;
								return false;
							}
						});
						if(flag){
							parentDepName.textbox("setValue",node.dep_serial);
							parentDepName.textbox("setText",node.dep_name);
							selDep.window("close");
						}
					}
				},{
					eName:'linkbutton',
					text:'取消',
					width:65,
					height:31,
					onClick:function(){
						selDep.window("close");
					}
				}]
			}]
			}
		})
		var seFirTree = selDep.findJq("seFirTree");
	}
	
	var westUI = {
		eName : 'div',
		cssClass:"department_west_div",
		height:'100%',
		elements : {
			eName : 'treeEx',
			id:"dep_serial",
			pid:"dep_parent",
			nodeText:"dep_name",
			url:departmentQuery,
			fit : 'true',
			checkbox:false,
			lines:true,
			onLoadSuccess:function(){
				if( selectid){
					var node = dep_serialObj.tree('find',selectid);
					if(node == null)return;
					dep_serialObj.tree('select',node.target);
				}
				if( addid){
					var node = dep_serialObj.tree('find',addid);
					if(node == null)return;
					dep_serialObj.tree('select',node.target);
					
				}
			},
			onSelect : function(params) {
				if(dep_serialObj.tree("getRoot").dep_serial == dep_serialObj.tree("getSelected").dep_serial){
					//禁用删除按钮
					del_btn.linkbutton("disable");
				}else{
					del_btn.linkbutton("enable");
				}
				tNode = dep_serialObj.tree('getChildren',params.target);//将选择的所有子节点保存下来
				tNode.push(params);//自己也不可以作为自己的父节点
				myform.formEx('load',params);
//				return;
				if(tagBtn==0 || tagBtn==2 || tagBtn==3){
					treeSele();//文本框显示选中的信息
					parentNode();
				}
				if(tagBtn==1){
					clearEname();				
				}
			}
		}
	};
	
	var mainUI = {
		eName : 'layoutExt',// 容器布局类，jeasyui组件
		cssStyle:'font-family: 微软雅黑, Arial;',
		fit : true,
		elements : [{
			region : 'north',
			height : 10,
			elements : northUI
		},{
			region : 'west',
			width : 300,
			elements : westUI
		},{
			region : 'center',
			elements : centerUI
		}]
	}
	
	jqObj.loadUI(mainUI);
	
	var dep_serialObj = jqObj.findJq("dep_serial");
	var deph_DownDiv = jqObj.findJq("department_north_DownDiv");
	var depName = jqObj.findJq("dep_name");//部门名称
	var parentDepName = jqObj.findJq("dep_parent");//上级部门
	var selParDep = jqObj.findJq("selParDep");//选择上级部门
	var tm = jqObj.findJq("btn");
	var addForm = jqObj.findJq("addForm");//新增btn
	var updateForm =jqObj.findJq("updateForm");//修改btn
	var myform = jqObj.findJq("formui");
	var myformOpt = myform.formEx("options");
	var del_btn = jqObj.findJq("del_btn");
	
	
	//文本长度验证
	depName.next().children().eq(0).attr("maxlength",18);
	
	
	function parentNode(){
		if(dep_serialObj.tree('getRoot')){
			var node = dep_serialObj.tree('getSelected');
			if(node == null)return;
			depName.textbox('setValue',node.dep_name);
			if(node.dep_parent == '0'){
				parentDepName.textbox("setValue",'');
			}
		}
	}
	
	//tree点击选择内容
	function treeSele(){
		var node = dep_serialObj.tree('getSelected');
		if(node == null)return;
		var a = dep_serialObj.tree("getParent",node.target);
		if(a == null)return;
		
		parentDepName.textbox("setValue",node.dep_parent);
		parentDepName.textbox("setText",a.dep_name);
		depName.textbox("setValue",node.dep_name);
	}
	
	function saveDep(){//保存新增部门
		if(depName.textbox("getText")==""){
			$.alert("请输入部门名称！");
		}else{
			myform.formEx("submit");
		}
	}
	
	function modifyDep(){//修改
		var row = dep_serialObj.tree("getSelected");
		if(row==null){
			$.alert("请先选择一条记录！");
		}else{
			enableEname();//启用组件
			treeSele();//文本框显示选中的信息
			parentNode();
			//解决禁用的textbox，启用后的点击bug，该bug导致text值覆盖value值
			parentDepName.textbox("textbox").on("click",function(){
				var a = parentDepName.textbox("getValue");
				var b = parentDepName.textbox("getText");
				parentDepName.textbox('disable');
				parentDepName.textbox("setValue",a)
				parentDepName.textbox("setText",b)
				parentDepName.textbox('enable');
				
			});
		}
	}
	
	function deleteDep(){//删除
		disableEname();
		treeSele();
		var row = dep_serialObj.tree("getSelected");
		if(row==null){
			$.alert("请先选择一条记录！");
		}else{
			$.confirm("确定删除这个商户部门吗？",function(c){
				if(c){
					var params = {};
					params['dep_serial'] = dep_serialObj.tree("getSelected").dep_serial;
					$.postEx(departmentDelete,params,function(retJson){
						if(retJson.result){
							reloadTree();
							clearEname();
							tagBtn = 0;
						}else{
							$.alert(retJson.info);
							tagBtn = 0;
						}
					});
				}else{
					return;
				}
			});
		}
	}

	function enableEname(){//启用组件
		depName.textbox('enable');
		parentDepName.textbox('enable');
		selParDep.linkbutton("enable");
		tm.linkbutton("enable");
	}
	function disableEname(){//禁用组件
		depName.textbox('disable');
		parentDepName.textbox('disable');
		selParDep.linkbutton("disable");
		tm.linkbutton("disable");
	}
	function clearEname(){//清空组件
		depName.textbox('clear');
		parentDepName.textbox('clear');
	}
	
	function reloadTree(){//刷新树列
		dep_serialObj.tree("reload");
	}
	
	/*
	function addDep2(){
		var row = dep_serialObj.tree("getSelected");
		if(row==null){
			$.alert("请先选择一个部门！");
		}else{
			var dep_parent = row.dep_serial;
			$.print(dep_parent);
			var myWin = $.createWin({
				title:"新增部门",
				width:300,
				height:180,
				queryParams:{
					dep_parent:dep_parent,
					callback:reloadTree
				},
				url:"js/merchant/department_addDep.js"
			});
		}
	}
	
	function modifyDep2(){
		var row = dep_serialObj.tree("getSelected");
		if(row==null){
			$.alert("请先选择一条记录！");
		}else{
			var dep_name = dep_serialObj.tree("getSelected").dep_name;
			var dep_serial = dep_serialObj.tree("getSelected").dep_serial;
			var myWin = $.createWin({
				title:"修改部门",
				width:300,
				height:180,
				queryParams:{
					dep_name:dep_name,
					dep_serial:dep_serial,
					callback:reloadTree
				},
				url:"js/merchant/department_modifyDep.js"
			});
		}
	}
	
	function deleteDep2(){
		var row = dep_serialObj.tree("getSelected");
		if(row==null){
			$.alert("请先选择一条记录！");
		}else{
			$.confirm("确定删除这个商户部门吗？",function(c){
				if(c){
					//var dep_serial = dep_serial.tree("getSelected").dep_serial;
					//$.print(dep_serialObj)
					var params = {};
					params['dep_serial'] = dep_serialObj.tree("getSelected").dep_serial;
					$.postEx(departmentDelete,params,function(retJson){
						if(retJson.result){
							reloadTree();
						}else{
							$.alert(retJson.info);
						}
					});
				}else{
					return;
				}
			});
		}
	}
	*/
	
});