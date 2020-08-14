
/*
 * 自定义组件progressBar
 * 实现进度条效果
 * */
(function($){
	var utils = garen_require("utils");
	var easyUI =  garen_require("garen_easyui");
	easyUI.regFn({//注册组件
	   name:"progressBar",//组件名称
	   tag:'div'//html组件
	});
	//生成组件
	function init(target){
		var myobj = $(target);
		var opts = $.data(target, "progressBar").options;
		myobj.outerHeight(opts.height).addClass('progress_bar');
		myobj.empty();
	}
	//开始
	function start(target){
		var myobj = $(target);
		var state = $.data(target, "progressBar");
		var opts = state.options;
		if(state.timer) return;
		myobj.createUI({
			eName:"table",
			cssStyle:"table",
			elements:{
				eName:"tr",
				elements:[{
					eName:"td",
					id:'title',
					width:opts.titleWidth || 50,
					cssStyle:"text-align:center",
					text:opts.text
				},{
					eName:"td",
					elements:{
						eName:"div",
						cssClass:"bar_text",
						height:20,
						elements:[{
							eName:"div",
							cssClass:"bar"
						}]
						
					}
				}]
			}
		});
		var barobj = myobj.find('div.bar');
		var w1 = barobj.parent().width();
		$.print(barobj.width() +','+ w1);
		var step = parseInt(w1 * 0.03,10);
		state.timer = setInterval(function(){
			var w = barobj.width();
			if(w > w1) w = 0;
			else w += step;
			barobj.width(w);
		}, 100);
		utils.showMask(true);
	}
	//结束
	function stop(target,ui){
		var myobj = $(target);
		var state = $.data(target, "progressBar");
		var opts = state.options;
		window.clearInterval(state.timer);
		state.timer = null;
		utils.showMask(false);
		myobj.empty();//清空
		myobj.createUI(ui);
	}
	//设置进度条标题
	function setTitle(target,params){
		var myobj = $(target);
		var state = $.data(target, "progressBar");
		var opts = state.options;
		window.clearInterval(state.timer);
		opts.text = params;
		//myobj.find('#title').html(params);
	}
	//设置进度条标题宽度
	function setTitleWidth(target,params){
		var myobj = $(target);
		var state = $.data(target, "progressBar");
		var opts = state.options;
		window.clearInterval(state.timer);
		opts.titleWidth = params;
		//myobj.find('#title').html(params);
	}
	
	//构造函数
	$.fn.progressBar = function(options, param){
		if (typeof options == 'string'){//调用方法
			var method = $.fn.progressBar.methods[options];
			if (method){
				return method(this, param);
			}else{
				return this.form(options, param);
			}
		}
		options = options || {};
		return this.each(function(){
			var state = $.data(this, "progressBar");
			if (state){
				$.extend(state.options, options);
				$(this).empty();//清空
			} else {
				state = $.data(this, "progressBar", {
					options: $.extend({}, $.fn.progressBar.defaults, 
							$.fn.progressBar.parseOptions(this), options)
				});
			}
			//绘制子元素
			init(this);
		});
	};
	//方法区域
	$.fn.progressBar.methods = {
		options: function(jq){
			return $.data(jq[0], "progressBar").options;
		},
		start:function(jq,params){
			return jq.each(function(){
				start(this,params);
			});
		},
		stop:function(jq,params){
			return jq.each(function(){
				stop(this,params);
			});
		},
		setTitle:function(jq,params){
			return jq.each(function(){
				setTitle(this,params);
			});
		},
		setTitleWidth:function(jq,params){
			return jq.each(function(){
				setTitleWidth(this,params);
			});
		}
	};
	$.fn.progressBar.parseOptions = function(target){
		return $.extend({}, $.parser.parseOptions(target, []));
	};
	$.fn.progressBar.defaults = {
		mask:true,
		height:30,
		text:"进度条",
		loadmsg:"数据加载中..."
	};
})(jQuery);

