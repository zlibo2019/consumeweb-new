
//自定义组件
(function($){
	var uitls = garen_require("utils");
	var easyUI =  garen_require("garen_easyui");
	var objWidth = "";//组件宽度 20170807 editby twl
	
	/*
	 * combogrid组件默认值
	 */
	$.extend($.fn.combogrid.defaults, {
		editable:false,
		multiple:true,
		singleSelect: false,
		selectOnCheck:true,
		checkOnSelect:true,
		panelHeight:'auto',
		panelMaxHeight:200,
		allFlag:false,
		onChange:function(n,o){
			var boxObj = $(this);
			var opts = boxObj.combogrid('options');
			if(opts.allFlag){
				var text = $(this).textbox("getText");
				$.print('combogrid onChange' + text);
				if("全部"==text) return;
				var mygrid = $(this).combogrid('grid');
				var rows = mygrid.datagrid("getRows");
				if(n.length == rows.length){
					setTimeout(function(){
						boxObj.combo("setText","全部");
					}, 0);
				}
			}
			if(opts.onChangeEx)
				opts.onChangeEx.call(this,n,o);
		},
		onLoadSuccess:function(data){
			if(objWidth==""){
				objWidth = $(this).datagrid("options").width;
			}
			//出现滚动条且列宽>组件宽度-滚动条宽度，则重新定义列宽，避免文字末尾被滚动条覆盖
			if(data.rows.length>6 && $(this).datagrid("options").columns[0][1].width+$(this).datagrid("options").rownumberWidth>objWidth-$(this).datagrid("options").scrollbarSize){
				$(this).datagrid("options").columns[0][1].width = '100%';
				$(this).datagrid("resize");
				$.print($(this).datagrid("options"));
			}else{
				$.print($(this).datagrid("options"));
				$.print($(this).datagrid("options").columns[0][1].width+$(this).datagrid("options").rownumberWidth);
				$.print($(this).datagrid("options").width);
			}
		},
	});
})(jQuery);