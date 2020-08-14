
//自定义组件
(function($){
	var uitls = garen_require("utils");
	var easyUI =  garen_require("garen_easyui");
	easyUI.regFn({//注册组件
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
					node.jqObj.createUI(param.elements);
				});
		   }
	});
})(jQuery);

