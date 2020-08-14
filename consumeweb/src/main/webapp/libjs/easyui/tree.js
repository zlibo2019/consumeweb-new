
//自定义组件
(function($){
	var utils = garen_require("utils");
	var easyUI =  garen_require("garen_easyui");
	
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
		  var id = opts.nodeId ||  opts.id ||  'id';
		  var pid = opts.nodePid ||  opts.pid  || 'pid';
		  var text = opts.nodeText || 'text';
		  if('list' == opts.dataType){
			  $.postEx(opts.url,params,function(retJson){
				  if(retJson.result){
					 var nodes = utils.list2Tree(retJson.data,id,
							 pid,text);
					 mytree.tree("loadData",nodes);
					var h = mytree.height();
					window.setTimeout(function(){
						mytree.height(h + 1);
					},0);
					 //opts.onLoadEx && opts.onLoadEx.call(mytree[0]);
				  }
			  });
			  return false;
		  }else 
			  return true;
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
	      var status = node.checked?"uncheck":"check";//取反
	      jqTree.tree('setNodeCheck',{node:node,status:status});
	      var opt = jqTree.tree('options');
	      if(opt.onClickEx)
	          opt.onClickEx.call($(this).get(0),node);
	  }
	});
	
	/*
	 * Tree组件方法扩展
	 */
	$.extend($.fn.tree.defaults,{
		dataType:'list'//1树形结构,2列表(需要前台转换)
	});
	
})(jQuery);

