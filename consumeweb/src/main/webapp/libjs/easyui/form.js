
//自定义组件
(function($){
	var uitls = garen_require("utils");
	var easyUI =  garen_require("garen_easyui");
	
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
	
})(jQuery);

