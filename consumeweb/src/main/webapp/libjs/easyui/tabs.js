
//自定义组件
(function($){
	var uitls = garen_require("utils");
	var easyUI =  garen_require("garen_easyui");
	
	easyUI.regFn({//注册组件
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
				node.jqObj.createUI(param.elements);
			});
	   }
	});
})(jQuery);

