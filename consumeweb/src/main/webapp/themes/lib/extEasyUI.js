/**
 * EasyUI组件二次封装
 */
(function ($) {
	var garenUI =  garen_require("garen_ui");
	var easyUI =  garen_require("garen_easyui");
	//支持的easyui的组件
	var EasyUINames = [
	   {
		   name:'layout',//组件名称
		   tag:'div',//html组件
		   onCreate:function(jqObj,uiOpts){//回调函数
			   var layOut = jqObj;
			   var node = null;
				//子元素
				var childNode = uiOpts.elements;
				if($.isArray(childNode) == false) return null;
				uiOpts.elements = [];
				$.each(childNode,function(i,param){
					if(param.region == undefined) return true;//继续
					if(param.region == 'west'){
						node = $.extend({width: 180, title: '布局西', split: true},param);
					}else if(param.region == 'center'){
						flag = true;
						node = $.extend({ title: '布局中'},param);
					}else{
						node = $.extend({},param);
					}
					//删除子元素
					delete node.elements;
					layOut.layout('add',node);
					//获取生成的组件
					node.jqObj = layOut.layout('panel',param.region);
					node.jqObj.loadUI(param.elements);
				});
		   }
	   },{
		   name:'tabs',//组件名称
		   tag:'div',//html组件
		   onCreate:function(jqObj,uiOpts){//回调函数
			   var mytabs = jqObj;
			   var node = null;
				//子元素
				var childNode = uiOpts.elements;
				if($.isArray(childNode) == false) return null;
				uiOpts.elements = [];
				$.each(childNode,function(i,param){
					var node = $.extend({bodyCls:'dialog_panelbody'},param);
					delete node.elements;
					if(i == 0) node['selected'] = true;
					else node['selected'] = false;
					mytabs.tabs('add',node);
					//获取生成的组件
					node.jqObj = mytabs.tabs('getTab',i);
					node.jqObj.loadUI(param.elements);
				});
		   }
	   },
	   {
		   name:'datagrid',//组件名称
		   tag:'table',//html组件
		   onCreate:function(jqObj,uiOpts){//回调函数
			   var mygrid = jqObj;
			   //如果开启自动编辑功能
			   if(uiOpts.formDialog) garen_require("datagrid-autoedit")(jqObj,uiOpts);
			   if($.isArray(uiOpts.toolbarEx)){
				   var toolbar = {
				    	eName:'toolbar',
				    	addMode:1,
				    	elements:uiOpts.toolbarEx
				   };
				   var panel = mygrid.datagrid("getPanel");
				   panel.find('div.datagrid-toolbar').remove();//删除旧的工具栏
				   panel.loadUI(toolbar);
				   mygrid.datagrid('resize');//重绘datagrid 
			   }
			   return;//退出
		   }
	   },{
		   name:'combobox',tag:'input',
		   onCreate:function(jqObj,uiOpts){
			   var jqOpts = uiOpts.jqOpts;
			   uiOpts.val = function(){//获取当前值
					return jqObj.combobox("getValue");
				};
				uiOpts.text = function(){//获取当前值
					return jqObj.combobox("getText");
				};
				uiOpts.getData = function(){//获取当前值
					return jqObj.combobox("getData");
				}
		   }
	   },{//l11
		   name:'linkbutton',
		   tag:'a',
		   onCreate:function(jqObj,uiOpts){
			   var menuSet = 254;
			   var uId = uiOpts.uId || "edit";
			   var menuStatus = false;
			   try{
				   menuSet = $.global.menu.menu_set;
			   }catch(e){}
			   if(getMenuSet(menuSet,uId) == false)
				   jqObj.linkbutton('disable');
		   }
	   },
	   {name:'textbox',tag:'input'},{name:'datebox',tag:'input'},{name:'datetimebox',tag:'input'},{name:'filebox',tag:'input'},
	   {name:'tree',tag:'ul'},
	   {name:'numberbox',tag:'input'},{name:'combo',tag:'input'},{name:'combobox',tag:'input'},{name:'switchbutton',tag:'input'},
	   {name:'combotree',tag:'input'},{name:'combogrid',tag:'select'},
	   {name:'datetimespinner',tag:'input'},{name:'numberspinner',tag:'input'},{name:'searchbox',tag:'input'}
	];
	
	/*
	 * 创建EasyUI
	 * UIData:组件定义数据
	 * jqObj UI组件容器
	 * 步骤：
	 * 1查询定义语法，null 退出
	 * 2 创建html元素
	 * 3 创建easyui 组件
	 * 4 调用回调函数
	 * 5 完毕
	 * 返回值:
	 * 	null 创建失败
	 *  obj 返回定义options
	 */
	easyUI.regFn(function(jqObj,UIData){
		//查找UI定义
		var uiObj = findEasyUI(EasyUINames,UIData.eName);
		if(uiObj == null) return 0;//未找到
		var eName = UIData.eName;
		UIData.uname= eName;//复制ename
		UIData.nname = UIData.name;//复制name
		UIData.eName = uiObj.tag;
		var childNodes = UIData.elements;
		UIData.elements = null;//不包含子子节点
		var myobj = garenUI.createUI(jqObj,UIData);
		if(myobj <= 0) return -1;//创建错误
		var htmlUI = myobj.findUI();
		htmlUI.elements = childNodes;
		htmlUI.eName = eName;
		myobj.unbind();//取消所有事件绑定
		myobj[htmlUI.eName](htmlUI);//创建组件
		htmlUI = myobj[htmlUI.eName]("options");//更新配置信息
		if(uiObj.onCreate){//创建时回调函数
			uiObj.onCreate(myobj,htmlUI);
		}
		return myobj;
	});
	
	//查询EasyUI组件定义
	function findEasyUI(EasyUINames,name){
		var obj = null;
		$.each(EasyUINames,function(i,ui){
			if(name == ui.name){
				obj = ui;
				return false;
			}
		});
		return obj;
	}
	function Intel_popedom(b1){
		var b0 = [4,2,8,0,0,1,4,1,1,1,64];
		var b2 = 0,ut;
		for(ut = 0;ut < b0.length;ut++){
			if(b1 & b0[ut]){
				b2 += Math.pow(2,ut);
			}else{
				if(b0[ut]==1){
					b2 += Math.pow(2,ut);
				}
			}
		}
		return b2;	
	}
	//获取菜单权限:menuset菜单权限,btnset按钮权限
	function getMenuSet(menunum,btnset){
		var menuset = Intel_popedom(menunum);
		var p = 0,ret = false;
		var Item_num=[1,2,4,8,16,32,64,128,256,512,1024,1,2,4,8,16,32,64,128,256,512,1024];
		var Item_id=["add","edit","delete","save","cancel","print",
				"import","export","search","exit","expand","tm1","tm2","tm2","tm2","tm2","tm2","tm2","tm2","tm2","tm2","tm2"];
		for (;p < Item_num.length;p++){
			//if(btnset == Item_id[p]){
				ret = (parseInt(menuset,10) & parseInt(Item_num[p],10))?true:false;
				if(ret)break;
				//break;
			//}
		}
		//$.print(btnset +","+ menunum +","+ menuset +","+ ret);
		return ret;
	}
})(jQuery);

//扩展组件方法,即JQuery EasyUI组件对象都可以调用
$.fn.extend({
	updateOpt : function(uifun,newOpt){
	    try{
	    	if(this.length <= 0) return;
	        $.extend(this[uifun].call(this,'options'),newOpt);
	    }catch(err){
	        $.printLog(err);
	    }
	}
});
/*
 * date组件扩展
 */
$.extend($.fn.datebox.defaults, {
	closeText:'',//去掉日期面板文本按钮
	currentText:''
});

/*
 * combotree组件扩展
 */
$.extend($.fn.textbox.defaults, {
	//tipPosition:'top'
});

/*
 * combotree组件扩展
 */
$.extend($.fn.numberbox.defaults, {
	//tipPosition:'top'
});
/*
 * combo组件方法扩展
 */
$.extend($.fn.combo.methods,{
	loadDataEx:function(jqCombo,data){//选择当前项，则清空combo值
		jqCombo.combobox('loadData',data);
		var panel = jqCombo.combo('panel');
		panel.find('.combobox-item').click(function(){
			var v1 = jqCombo.combo('getValue');
			window.setTimeout(function(){
				var v2 = jqCombo.combo('getValue');
				if(v1 == v2) jqCombo.combo('clear');
			}, 100);
		});
	}
});
/*
 * form表单扩展,flag 0 前缀无效 1 添加  2 去除
 */
$.extend($.fn.form.methods,{
	form2Json : function(sform,formjson,prefix,flag){//form表单，解析为form对象
		if(!$(sform).form('validate')) return false;
		formjson = formjson || {};
		var opt = $(sform).form('options');
		prefix = opt.prefix || '';
		flag = opt.flag || 0;
		var forms = $(sform).serializeArray();
		var newforms = {};
		$.each(forms,function(i,item){
			var key = item['name'];
			var val = $.trim(item['value']);
			if(flag == 1) key = prefix + '.' +  key;
			else if(flag == 2) 
				key = key.replace(prefix + ".","");
			if(newforms[key])  newforms[key] += ',' + val;
			else newforms[key] = val;
		});
		$.extend(formjson,newforms);
		return true;
	}
});

(function(){
	/*
	 * Tree组件方法扩展
	 */
	$.extend($.fn.tree.methods,{
		//设置节点checkbox状态，但不触发事件.参数：{'node':node,'status':'check'}
		setNodeCheck:function(jq,params){
			return jq.each(function () {
				var node = params.node;
				var status = params.status;
				var nodebox = $('#' + node.domId,this).find('.tree-checkbox');
				if(status == 'check'){
					node.checked = true;
					node.checkState = "checked";
		            nodebox.addClass('tree-checkbox1');
		            nodebox.removeClass('tree-checkbox2');
		            nodebox.removeClass('tree-checkbox0');
				}else if(status =='uncheck'){
					node.checked = false;	
		          	node.checkState = "unchecked";
					nodebox.addClass('tree-checkbox0');
		          	nodebox.removeClass('tree-checkbox1');
		          	nodebox.removeClass('tree-checkbox2');
				}else if(status =='indeterminate'){
					node.checked = false;
					node.checkState = "indeterminate";
		            nodebox.addClass('tree-checkbox2');
		            nodebox.removeClass('tree-checkbox1');
		            nodebox.removeClass('tree-checkbox0');
				}
			});
		},
		//设置指定节点的父节点状态，如果为空，则设置为中间状态
		setParentCheck:function(jq,node){
			return jq.each(function () {
				var jqTree = $(this);
				// 遍历父节点
				var pnode = node;
				do {
					var pnode = jqTree.tree('getParent', pnode.target);
					if (pnode == null) break;
					///if (pnode.checked) continue;
					var status = getChildrenStatus(jqTree,pnode);
					jqTree.tree("setNodeCheck",{node:pnode,status:status});
				} while (true);
			});
		},
		/* 设置节点select状态，
		 * 但不触发事件.
		 * 参数：{'node':node,'select':true or false}*/
		setNodeSelect:function(jq,params){
			return jq.each(function () {
				var node = params.node;
				var select = params.select;
				var nodebox = $('#' + node.domId,this);
				if(select){//选中
					//node.checked = true;
		            nodebox.addClass('tree-node-selected');
				}else{//未选中
		          	nodebox.removeClass('tree-node-selected');
		          	//node.checked = false;	
				}
			});
		},
		doFilter1:function(jq,q){
			return jq.each(function () {
				var mytree = $(this);
				//调用原生过滤函数
				$(this).tree('doFilter',q);
				var treeData = $.data(this, "tree");
				var opts = treeData.options;
				//$.printLog(treeData.data);
				if(q == ''){
					searchTree1(treeData.data);
					if(treeData.data.length > 0){
						$.each(treeData.data[0].children,function(i,node){
							mytree.tree('collapse',node.target);
						});
					}
				}else{
					searchTree(treeData.data);
				}
				function searchTree(nodes){
	        		$.each(nodes,function(i,node){
	        			if(node.hidden) {//取消选中状态setNodeStatus
	        				//unCheckNode(node,mytree);
	        				mytree.tree('setNodeCheck',{'node':node,'status':'uncheck'})
	        			}else{
	        				//$.printLog(node);
	            			//mytree.tree('select',node.target)
	            			if(opts.filter.call(mytree.get(0),q,node)){
	            				//设置选中状态
	                			//checkNode(node,mytree);
	            				mytree.tree('setNodeCheck',{'node':node,'status':'check'})
	            			}else{
	            				//checkNodeIndeterminate(node,mytree);
	            				mytree.tree('setNodeCheck',{'node':node,'status':'indeterminate'})
	            			}
	        			}
	        			if(node.children && node.children.length > 0){
	        				if(node['state'] == 'closed')
	        					mytree.tree('expand',node.target);
	        					//node['state'] = 'open';
	        				searchTree(node.children);
	        			}
	        			return true;
	        		})
	        	}
				
				function searchTree1(nodes){
	        		$.each(nodes,function(i,node){
	        			mytree.tree('setNodeCheck',
	        					{'node':node,'status':'uncheck'});
	        			if(node.children)
	        				searchTree1(node.children);
	        			return true;
	        		})
	        	}
				
				
			});
		},
		doFilter2:function(jq,q){
			return jq.each(function () {
				var mytree = $(this);
				//调用原生过滤函数
				$(this).tree('doFilter',q);
				var treeData = $.data(this, "tree");
				var opts = treeData.options;
				var flag = true;
				var lastNode = null;
				//$.printLog(treeData.data);
				if(q == ''){
					searchTree1(treeData.data);
					if(treeData.data.length > 0){//折叠第一个节点
						$.each(treeData.data[0].children,function(i,node){
							mytree.tree('collapse',node.target);
						});
					}
				}else{
					searchTree(treeData.data);
					if(flag && lastNode != null)//选择第一个 树节点
						mytree.tree('setNodeSelect',{'node':lastNode,'select':true});
				}
				
				function searchTree(nodes){
	        		$.each(nodes,function(i,node){
	        			var ret = flag;
	        			if(node.hidden) {//取消选中状态
	        				//unCheckNode(node,mytree);
	        				mytree.tree('setNodeSelect',{'node':node,'select':false})
	        			}else{
	        				if(node.children && node.children.length > 0){
	        					if(node['state'] == 'closed')//展开
	            					mytree.tree('expand',node.target);
	        					//取消选中
	        					mytree.tree('setNodeSelect',{'node':node,'select':false});
	        					ret = searchTree(node.children);
	        					if(ret){//没有选中的节点
	        						if(lastNode == null)
	        							lastNode = node;
	        						//flag = false;
	                				//mytree.tree('setNodeSelect',{'node':node,'select':true});
	        					}
	        				}else{//叶子节点
	            				$.printLog(node);
	                			//mytree.tree('select',node.target)
	                			if(flag && opts.filter.call(mytree.get(0),q,node)){
	                				//设置选中状态
	                    			//checkNode(node,mytree);
	                				flag = false;
	                				mytree.tree('setNodeSelect',{'node':node,'select':true});
	                			}else{
	                				//checkNodeIndeterminate(node,mytree);
	                				mytree.tree('setNodeSelect',{'node':node,'select':false});
	                			}
	            			}
	        			}
	        			return true;
	        		});
	        		return flag;
	        	}
				
				function searchTree1(nodes){
	        		$.each(nodes,function(i,node){
	        			mytree.tree('setNodeSelect',
	        					{'node':node,'select':false});
	        			if(node.children)
	        				searchTree1(node.children);
	        			return true;
	        		})
	        	}
			});
		},
		getPrevNode:function(jq,target){//获取上一个兄弟节点，空返回Null
			var nodes = null;
			var node = jq.tree('getParent',target);
			//没有父节点
			if(node == null){
				 nodes = jq.tree('getRoots');
			}else{
				nodes = jq.tree('getChildren',node.target);
			}
			node = null;
			$.each(nodes,function(i,n){
				if(n.target == target){
					return false;
				}
				node = n;
			});
			return node;
		},
		getNextNode:function(jq,target){//获取下一个兄弟节点，空返回Null
			var nodes = null;
			var node = jq.tree('getParent',target);
			//没有父节点
			if(node == null){
				 nodes = jq.tree('getRoots');
			}else{
				nodes = jq.tree('getChildren',node.target);
			}
			node = null;
			//$.printLog(nodes);
			var flag = false;
			$.each(nodes,function(i,n){
				if(n.target == target){
					flag = true;//设置标志，获取下一个节点
				}else if(flag){
					node = n;
					return false;
				}
			});
			return node;
		}
	});

	//获取子节点状态
	function getChildrenStatus(jqTree,pnode){
		var a = 0,b = 0,c = 0;
		//遍历子节点
		$.each(jqTree.tree('getChildren',pnode.target),function(i,n){
    	  n.checked?b++:c++;
    	  a++;
		});
		return a==b?"check":(a==c?"uncheck":"indeterminate");
	}
	/*
	 * Tree组件扩展
	 */
	$.extend($.fn.tree.defaults, {
	  cascadeCheck:false,
	  checkbox:true,
	  onBeforeCheck:function(node, checked){
		  if(node.mflag == undefined) return true;
		  if(node.mflag == 1) return true;
		  return false;
	  },
	  onBeforeSelect:function(node){
		  if(node.mflag == undefined) return true;
		  if(node.mflag == 1) return true;
		  return false;
	  },
	  onBeforeLoad:function(params){
		  var mytree = $(this);
		  var opts = mytree.tree('options');
		  if(!opts.url) return false;
		  $.postEx(opts.url,params,function(retJson){
			  if(retJson.result){
				 var nodes = $.list2Tree(retJson.data,opts.id,
						 opts.pid,opts.text || opts.nodeText);
				 mytree.tree("loadData",nodes);
			  }
		  });
		  return false;
	  },
	  onLoadSuccess:function(data,node){
		  var myTree = $(this);
		  var nodes = myTree.tree('getChecked');
		  $.each(nodes,function(i,n){
			  myTree.tree('setParentCheck',n);
		  });
		  var opts = myTree.tree('options');
		  //获取未选择节点
		  var exNodes = myTree.tree('getChecked', 'unchecked');
		  $.each(exNodes,function(i,exNode){
			  if(exNode.mflag == 0){
				  //$.printLog(exNode);
				  var pcheckbox = $(exNode.target).find('.tree-checkbox');
				  pcheckbox.addClass('icon_tree_disabled');
			  }
		  });
		  if(opts.onLoadSuccessEx)
	    	  opts.onLoadSuccessEx.call(myTree.get(0),data,node);
	  },
	  onCheck:function(node){
	      var jqTree = $(this);
	      var opts = jqTree.tree('options');
	      if(opts.cascadeCheck) return;//级联不做处理
	      var status = node.checked?"check":"uncheck";
	      //遍历子节点
	      $.each(jqTree.tree('getChildren',node.target),function(i,dom){
	    	  jqTree.tree('setNodeCheck',{node:dom,status:status});
	    	  return;
	      });
	      jqTree.tree('setParentCheck',node);//设置父节点状态
	      if(opts.onClickEx)
	    	  opts.onClickEx.call(jqTree.get(0),node);
	  },
	  onSelect:function(node){
		  var jqTree = $(this);
	      var status = node.checked == false?"check":"uncheck";
	      jqTree.tree('setNodeCheck',{node:node,status:status});
	      var opt = jqTree.tree('options');
	      if(opt.onClickEx)
	          opt.onClickEx.call($(this).get(0),node);
	  }
	});
}());


/*
 * datagrid组件默认值
 */
$.extend($.fn.datagrid.defaults, {
	fit:true,
	pagination:true,
	singleSelect:true,
	pageList:[30,60],
	pageSize:30,
	onBeforeLoad:function(params){
		var mygrid = $(this);
		var opts = $(this).datagrid('options');
		//首次加载页面，是否查询数据
		if(opts.autoload == false) {
			opts.autoload = true;
			return false;
		}
		//分页参数重命名
		if(params['rows']){
			params['pageSize'] = params['rows'];
			delete params['rows']; 
		}
		if(params['page']){
			params['pageNum'] = params['page'];
			delete params['page'];
		}
		//$.printLog(mygrid);
		var myform = null;
		var jqgridBody = mygrid.parents(".datagrid-wrap");
		if(opts.queryForm){
			myform = jqgridBody.findJqUI(opts.queryForm);
		}else{
			myform = jqgridBody.findJqUI("form");
		}
		if(myform){
			if(myform.form2Json(params) == false)
           	 	return false;
		}
		if(opts.onBeforeLoadEx){
			if(false == opts.onBeforeLoadEx.call(this,params)){
				opts.queryParamsEx = null;//清空选中的记录
				return false;
			}
		}
		//清空选中情况
        //var data = $.data($(this).get(0),'datagrid');
        //data.selectedRows = [];
        //data.checkedRows = [];
        //缓存查询条件
        opts.queryParamsEx = params;
        
		return true;
	},
	onLoadSuccess:function(data){
		var mygrid = $(this);
		var opts = $(this).datagrid('options');
		mygrid.datagrid("updateOrderNum",0);
		if(opts.onLoadSuccessEx){
			opts.onLoadSuccessEx.call(this,data);
		}
	}
});

$.extend($.fn.datagrid.methods,{
	getSelectionsEx:function(jq){//选择记录排序
		var allRows = jq.datagrid('getRows');
		var keyFlag = "$num_key#";
		$.each(allRows,function(i,row){
			row[keyFlag] = i;
		});
		var rows = jq.datagrid('getSelections');
		rows.sort(function(a,b){
			return a[keyFlag] > b[keyFlag];
		});
		return rows;
	},
	updateOrderNum:function(jq,index){
		index = index || 0;
		var mygrid = jq;
		var pager = mygrid.datagrid("getPager");
		var offset = index;
		if(1 == pager.length){
			var pagerOpts = pager.pagination('options');
			offset = (pagerOpts.pageNumber - 1) * pagerOpts.pageSize;
		}
		var rows = mygrid.datagrid("getRows");
		var len = rows.length;
		var i = index;
		while(i < len){
			mygrid.datagrid("updateRow",{
				index:i,
				row:{
					'index':offset + i +  1
				}
			});
			i++;
		}
	}
});
//datagrid自动编辑功能
garen_define("datagrid-autoedit",function(require, exports, module){
	var uitls = garen_require("utils");
	//datagrid扩展工具栏及默认方法
	function getToolbarUI(uiData){
		var mygrid = uiData.mygrid;
		var exToolBar = uiData.uiOpts.toolbarEx;
		//扩展工具栏
		var toolbarNode = [
		    {eName:'linkbutton',text:'新增',uId:'add',plain:true,iconCls:'icon-add'},
		    {eName:'linkbutton',text:'修改',uId:'modify',plain:true,iconCls:'icon-edit'},
		    {eName:'linkbutton',text:'删除',uId:'del',plain:true,iconCls:'icon-remove'}
	    ];
		toolbarNode = uitls.extUIs(toolbarNode,exToolBar);
		$.each(toolbarNode,function(i,node){//遍历工具栏中按钮，加入默认方法
			var row = null;
			if(!node) return;//空节点退出
			if(node.eName == 'linkbutton'){
				if(node.onClick == undefined)
					node.onClick = gettbclickfn(uiData,node.uId);
			}else if(node.eName == 'searchbox'){
				if(node.searcher == null){
					node.searcher = function(){
						mygrid.datagrid('load');
					}
				}
			}
		});
		uiData.uiOpts.toolbarEx = toolbarNode;
		return 	toolbarNode;
    }
    //工具栏默认事件
    function gettbclickfn(uiData,uId){
    	var mygrid = uiData.mygrid;
    	var uiOpts = uiData.uiOpts;
	    var toolbarCick = {
			add : function() {// 新增
				row = {};
				if (uiOpts.onBeforeAdd) {// 返回false，则终止继续
					if (false == uiOpts.onBeforeAdd.call(mygrid
							.get(0), row)) {
						return;
					}
				}
				edit(uiData,'新增', row);
			},
			modify : function() {// 修改
				row = mygrid.datagrid('getSelected');
				if (row == null) {
					$.alert('请选择一条要修改的记录 !');
					return;
				}
				if (uiOpts.onBeforeModify) {// 返回false，则终止继续
					if (false == uiOpts.onBeforeModify.call(mygrid
							.get(0), row)) {
						return;
					}
				}
				edit(uiData,'修改', row);
			},
			del : function() {// 默认删除方法
				row = mygrid.datagrid('getSelected');
				if (row == null) {
					$.alert('请选择一条要删除的记录 !');
					return;
				}
				if (uiOpts.onBeforeDel) {// 返回false，则终止继续
					if (false == uiOpts.onBeforeDel.call(mygrid
							.get(0), row))
						return;
				}
				deleteRow(uiData,row);
			}
	   };
   	   return toolbarCick[uId];
     }
    
	 function edit(uiData,title,row){//默认编辑表单
		var mygrid = uiData.mygrid;
		var uiOpts = uiData.uiOpts;
		var myWin = null;
		if(uiOpts.formDialog == undefined) return;
		var formDialog = $.extend(true,{},uiOpts.formDialog);
		var formtable = formDialog.formtable;
		if(formtable == undefined) return;
		if(formtable.formUI == undefined) return;
		//定义对话框默认大小
		formDialog = $.extend({width:300,height:240},formDialog);
		title = title || '';
		formDialog.title = title + (formDialog.title || "");
		formtable = $.extend(true,{//定义表单表格
			eName:'formtable',
			width:'96%',
	        cols:2,rows:7,
	        inputWidth:170,
	        tdWidth:[80,-1],
	        extBtns:[
    			 {eName:'linkbutton',text:'取消',
    	        	  onClick:function(){
    	        		  myWin.window("close");
    	        	  }
    			 } 
	        ]
		},formtable);
		//定义formUI
		formtable.formUI = $.extend(true,{formData:row},formtable.formUI);
		var onFormSave = formtable.formUI.onSave;//保存自定义的
		formtable.formUI.onSave = function(mbean){//自定义表单提交
			if(mbean.result){
    			myWin.window("close");
    			mygrid.datagrid("reload");
    		}
			if(onFormSave) onFormSave.call(this,mbean);
		}
		createForms(uiOpts.columns,formtable);//创建表单元素
		myWin = $.createWin(formDialog,formtable);//创建对话框
	 }
	 
	//默认删除记录方法
  	function deleteRow(uiData,row){
  		var mygrid = uiData.mygrid;
  		var gridOpts = uiData.uiOpts;;
		var rowKey = row[gridOpts.idField];
		if(undefined == rowKey){//判断是否新增行
			var index = mygrid.datagrid('getRowIndex',row);
			mygrid.datagrid('deleteRow',index);
			return;
		}
		if(undefined == gridOpts.delUrl) {
			$.printLog('delUrl is null');
			return;
		}
		$.confirm('删除后不能撤销,你确定要删除此记录吗 ?',
				function(r){
					if(r == false) return;//取消
			    	var idField = gridOpts.idField;//主键字段
	  				var params = {};
	  				params[idField] = rowKey;//主键参数
	  				$.postEx(gridOpts.delUrl,params,
	  					function(retJson){
							if($.checkret(retJson,true)){
								var index = mygrid.datagrid('getRowIndex',row);
								mygrid.datagrid('deleteRow',index);
							}else{
								$.alert(retJson.info);
							}
	  					}
	  			   );
				}
		);
  	}
	  	
	//生成表单元素
	function createForms(columns,formTable){
		//要编辑的元素
		var editFormUI = [];
		var hiddenForm = []; //隐藏表单
		var colSize = 0;
		//遍历所有字段
		$.each(columns,function(i,column){
			$.each(column,function(i,col){//遍历列
				if(col.hidden) {
					hiddenForm.push({
						eName:'input',
						type:"hidden",
						name:col.field
					});
				}else{
					var tr = [];
					if(col.editor == null)//跳出，null为不可编辑行
						return true;
					tr.push(col.title);
					tr.push($.extend({
						eName:'textbox',//默认编辑类型
						name:col.field
					},col.editor));
					editFormUI.push(tr);
					colSize++;
				}
  			});
		});
		//行数
		formTable.rows = colSize;
		formTable.elements = editFormUI;
		formTable.hiddenInput = hiddenForm;
		return formTable;
	}
	
	return function(mygrid,uiOpts){//工厂函数
		return getToolbarUI({mygrid:mygrid,uiOpts:uiOpts});
	}
	
});


