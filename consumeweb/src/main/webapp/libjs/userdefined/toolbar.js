
//自定义组件
(function($){
	var uitls = garen_require("utils");
	var easyUI =  garen_require("garen_easyui");
	var uname = "toolbar";
	easyUI.regFn({//注册组件
	   name:uname,//组件名称
	   tag:'div'//html组件
	});
	//生成组件
	function init(target){
		var opts = $.data(target, uname).options;
		$(target).addClass('datagrid-toolbar');
		$(target).wrap('<form></form>');
		$(target).createUI(opts.elements);
	}
	
	//构造函数
	$.fn[uname] = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn[uname].methods[options];
			if (method){
				return method(this, param);
			}
		}
		options = options || {};
		return this.each(function(){
			var state = $.data(this, uname);
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, uname, {
					options: $.extend({}, $.fn[uname].defaults, $.fn[uname].parseOptions(this), options)
				});
			}
			init(this);
		});
	};
	
	$.fn[uname].methods = {
		options: function(jq){
			return $.data(jq[0], uname).options;
		},
		test:function(jq,a,b){
			$.print('abcd',a,b);
			return "eee";
		}
	};
		
	$.fn[uname].parseOptions = function(target){
		return $.extend({}, $.parser.parseOptions(target, []));
	};
	
	$.fn[uname].defaults = {
		
	};
		
})(jQuery);

