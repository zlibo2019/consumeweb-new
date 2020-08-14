
//自定义组件
(function($){
	var uitls = garen_require("utils");
	var easyUI =  garen_require("garen_easyui");
	
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
					if(v1 == v2){
						jqCombo.combobox('unselect',v2);
						jqCombo.combo('clear');
					}
				}, 100);
			});
		}
	});
	
})(jQuery);

