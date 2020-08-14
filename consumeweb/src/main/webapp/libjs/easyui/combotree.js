
//自定义组件
(function($){
	var uitls = garen_require("utils");
	var easyUI =  garen_require("garen_easyui");
	easyUI.regFn({//注册组件
	   name:'combotree',//组件名称
	   tag:'input',//html组件
	   onCreate:function(jqObj,uiOpts){//回调函数
		   var treeObj = jqObj.combotree('tree');
		   //$.print(uiOpts);
		   if(uiOpts.multiple == false) return;
		   treeObj.updateOpt('tree',{
			   onClick:function(){//覆盖combotree原生的
				   
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
			      var nodes = jqTree.tree('getChecked');
			      jqObj.combotree('setValues',nodes);
			      if(uiOpts.onCheckEx) uiOpts.onCheckEx.call(this,node);
			  },
			  onSelect:function(node){
				  var jqTree = $(this);
			      var status = node.checked?"uncheck":"check";//取反
			      jqTree.tree('setNodeCheck',{node:node,status:status});
			      var nodes = jqTree.tree('getChecked');
			      jqObj.combotree('setValues',nodes);
			      if(uiOpts.onSelectEx) uiOpts.onSelectEx.call(this,node);
			  }
		   });
	   }
	});
	
	$.extend($.fn.combotree.defaults, {
		cascadeCheck:false,
	    checkbox:true
	});
	
})(jQuery);