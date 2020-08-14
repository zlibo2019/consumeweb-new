
/*
 * 自定义组件layoutExt
 * */
(function($){
	var utils = garen_require("utils");
	var easyUI =  garen_require("garen_easyui");
	easyUI.regFn({//注册组件
	   name:"layoutExt",//组件名称
	   tag:'div'//html组件
	});
	//清除面板大小
	function clearPanelSize(panel){
		var region = panel.region;
		if(region == 'south' || region == "north") delete panel.width;
		else if(region == 'west' || region == "east") delete panel.height;
		else {
			delete panel.width;
			delete panel.height;
		}
	}
	//计算大小
	function calcSize(num,size){
		if(typeof num == 'string' && num.indexOf('%') != -1){
			num = parseInt((parseInt(num,10) * size) / 100);
		}else{
			num = parseInt(num,10);
			if(isNaN(num)) num = 0;
		}
		return num;
	}
	//计算面板大小总和
	function calcPanelSizeSum(panels,size,key,key1){
		var x = 0;
		$.each(panels,function(i,panel){
			var y = panel[key1] || panel[key];
			y = calcSize(y,size);
			x += y;
		});
		return x;
	}
	//获取面板定义
	function getPanelUI(regions){
		var regionUIs = {north:[],south:[],center:[],west:[],east:[]};
		$.each(regions,function(i,panel){
			if(panel == undefined) return;
			var cls = panel.cssClass || "";
			var regions = regionUIs[panel.region];
			if(regions == undefined) return;
			clearPanelSize(panel);
			panel.eName = "div";
			panel.cssClass = "panel_region layout_" + panel.region + " " +cls; 
			regions.push(panel);
		});
		regionUIs.center.splice(1);//center面板只能有一个
		return regionUIs;
	}
	//计算center组件宽度
	function calcCenterSize(target,uis){
		var myobj = $(target);
		var opts = $.data(target, "layoutExt").options;
		var width = myobj.width();
		var height = myobj.height();
		var panelWidth = 0;
		var panelHeight = 0;
		panelHeight += calcPanelSizeSum(uis.north,height,"height","outerHeight");
		panelHeight += calcPanelSizeSum(uis.south,height,"height","outerHeight");
		panelWidth += calcPanelSizeSum(uis.west,width,"width","outerWidth");
		panelWidth += calcPanelSizeSum(uis.east,width,"width","outerWidth");
		var w1 = width - panelWidth;
		var h1 = height - panelHeight;
		return {
			width:w1 > 0?w1:0,
			height:h1 > 0?h1:0
		}
	}
	//重新设置面板大小
	function resetPanelSize(target){
		var myobj = $(target);
		var opts = $.data(target, "layoutExt").options;
		var width = myobj.width();
		var height = myobj.height();
		var regionUIs = [];
		myobj.find('.panel_region').each(function(){
			regionUIs.push($(this).findOpts());
		});
		var regionUIs = getPanelUI(regionUIs);
		var centerSize = calcCenterSize(target,regionUIs);
		if('h' == opts.type){
			myobj.find(".layout_west,.layout_east").outerHeight(centerSize.height);
			myobj.find(".layout_north,.layout_south").outerWidth(width);
		}else if('v' == opts.type){
			myobj.find(".layout_north,.layout_south").outerWidth(centerSize.width);
			myobj.find(".layout_west,.layout_east").outerHeight(height);
		}
		myobj.find(".layout_center").outerHeight(centerSize.height);
		myobj.find(".layout_center").outerWidth(centerSize.width);
		if(opts.onresize) opts.onresize.call(target,width,height);//触发事件
	}
	//生成组件
	function init(target){
		var myobj = $(target);
		var opts = $.data(target, "layoutExt").options;
		myobj.addClass("layoutExt");
		var regionUIs = getPanelUI(opts.elements);
		var uis = [];
		if('h' == opts.type){
			uis = uis.concat(regionUIs.north);
			uis = uis.concat(regionUIs.west);
			uis = uis.concat(regionUIs.center);
			uis = uis.concat(regionUIs.east);
			uis = uis.concat(regionUIs.south);
		}else if('v' == opts.type){
			uis = uis.concat(regionUIs.west);
			uis = uis.concat(regionUIs.east);
			uis = uis.concat(regionUIs.north);
			uis = uis.concat(regionUIs.center);
			uis = uis.concat(regionUIs.south);
		}
		$.each(uis,function(i,ui){
			ui.noChild = true;//不渲染子页面
		});
		myobj.createUI(uis);
		reSize(target,opts);
		myobj.find(".panel_region").each(function(){
			var thisobj = $(this);
			var thisOpts = $(this).findOpts();
			thisobj.createUI(thisOpts.elements 
					|| thisOpts.text);
		});
	}
	//设置指定面板大小
	function setPanelSize(target,params){
		var myobj = $(target);
		var width = myobj.width();
		var height = myobj.height();
		var panelObj = myobj.find('.layout_' 
				+ params.region + ":eq(" + params.index + ")");
		var panelUI =  panelObj.findOpts();
		if(panelUI){
			if(params.width) {
				panelUI.outerWidth = params.width;
				delete panelUI.width;
				panelObj.outerWidth(calcSize(params.width,width));
			}
			if(params.height) {
				panelUI.outerHeight = params.height;
				delete panelUI.height;
				panelObj.outerHeight(calcSize(params.height,height));
			}
			resetPanelSize(target);
		}
		//$.print(panelUI);
	}
	//设置组件大小
	function reSize(target,params){
		var myobj = $(target);
		var pobj = $(target).parent();
		var width = params.width || 500,height = params.height || 300;
		if(params.fit) {//父容器的大小
			width = pobj.width();
			height = pobj.height();
			$(target).outerWidth(width);
			$(target).outerHeight(height);
		}
		resetPanelSize(target);
	}
	//构造函数
	$.fn.layoutExt = function(options, param){
		if (typeof options == 'string'){//调用方法
			var method = $.fn.layoutExt.methods[options];
			if (method){
				return method(this, param);
			}else return;
		}
		options = options || {};
		return this.each(function(){
			var state = $.data(this, "layoutExt");
			if (state){
				$.extend(state.options, options);
				$(this).empty();//清空
			} else {
				state = $.data(this, "layoutExt", {
					options: $.extend({}, $.fn.layoutExt.defaults, 
							$.fn.layoutExt.parseOptions(this), options)
				});
			}
			//绘制子元素
			init(this);
		});
	};
	//方法区域
	$.fn.layoutExt.methods = {
		options: function(jq){
			return $.data(jq[0], "layoutExt").options;
		},
		resize:function(jq,params){
			return jq.each(function(){
				params = params || {};
				var fit = (params.width && params.height) ?false:true;//无参数时，为fit
				reSize(this,$.extend({fit:fit},params));
			});
		},
		getPanel:function(jq,params){
			if(!params) return;
			var myobj = jq;
			var region = params.region;
			//参数验证
			if(typeof region != 'string' 
				|| params.index == undefined ) return;
			var panelObj = myobj.find('.layout_' 
					+ params.region + ":eq(" + params.index + ")");
			return panelObj.length > 0?panelObj:null;
		},
		setPanelSize:function(jq,params){//参数:{region:'south',index:1,width:100,height:200}
			return jq.each(function(){
				params = params || {};
				var region = params.region;
				//参数验证
				if(region == undefined || params.index == undefined 
						|| 'center' == region) return;
				if(region == 'south' || region == "north") {
					delete params.width;
					if(params.height == undefined) return;
				}
				else if(region == 'west' || region == "east") {
					delete params.height;
					if(params.width == undefined) return;
				}
				setPanelSize(this,params);
			});
		}
	};
	$.fn.layoutExt.parseOptions = function(target){
		return $.extend({}, $.parser.parseOptions(target, []));
	};
	$.fn.layoutExt.defaults = {
		fit:true,
		type:'h',//h or v  h横线铺满,v纵向铺满
		onResize:function(){}//大小变化时触发
	};
})(jQuery);

