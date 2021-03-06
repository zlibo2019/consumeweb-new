
//调试用函数
function debug(){
	return 13 + 14;
}
//获取浏览器类型及版本
(function(){
	$.browser = {msie:false,msie7:false,msie8:false,msie9:false,
			msie10:false,msie11:false,chrome:false,firefox:false}
	var ver = null,u = window.navigator.userAgent.toLocaleLowerCase();
	if(/(msie) ([\d.]+)/.test(u)) {
		ver = parseInt(/(msie) ([\d.]+)/.exec(u)[2]);
		$.browser.msie = true;
		if(ver < 8) $.browser.msie7 = true;
		else if(ver == 8) $.browser.msie8 = true;
		else if(ver == 9) $.browser.msie9 = true;
		else if(ver == 10) $.browser.msie10 = true;
	}else if(/(chrome)\/([\d.]+)/.test(u)) $.browser.chrome = true;
	else if(/(trident)\/([\d.]+)/.test(u)) {
		$.browser.msie11 = true;
		$.browser.msie = true;
	}else if(/(firefox)\/([\d.]+)/) $.browser.firefox = true;
	else if(/(safari)\/([\d.]+)/.test(u)) $.browser.safari = true;
	else if(/(opera)\/([\d.]+)/) $.browser.opera = true;
})();
//扩展全局变量
$.extend({
	garenModules:{'###':{}},
	global:{}
});
/*
 * 模块生命周期
 * 1 加载
 * 2 初始化
 * 3 获取
 * */
//模块定义函数
function garen_define(name,fn){
	if(typeof name != 'string' || $.isFunction(fn) == false) return;
	var modules = $.garenModules;
	var module = modules[name];
	if(!module) {
		module = {mname:name};
		modules[name] = module;
	}
	module.fn = fn;
}
 
//模块加载函数
function garen_use(murl,mname){
	if(!murl) return null;
	mname = mname || murl;
	if(typeof murl != "string" || typeof mname != "string")
		return null;
	if(murl.match(/\.js$/)){
		mname = mname.replace(/\.js$/,'');
	}else{
		murl += ".js";
	}
	var modules = $.garenModules;
	if(!modules[mname]){//未加载
		$.ajax({
			url:murl,
			async:false,
			dataType:"script"
		});
	}
	return modules[mname];
}

/*
 * 获取模块的函数
 * murl 模块的地址 
 * mname 模块名称，可空
 * */
function garen_require(murl,mname){
	var module = garen_use(murl,mname);
	if(!module) return null;
	var mCount = $.garenModules['###'];
	if(!module.obj){//初始化模块
		var m = {exports:{}};
		mname = module.mname;
		if(mCount[mname]) return null;
		else mCount[mname] = true;
		//$.print("准备初始化" + mname);
		var obj = module.fn(garen_require,m.exports,m);
		//$.print("初始化完毕" + mname);
		delete mCount[mname];
		module.obj = obj?obj:m.exports;
	}
	return module.obj;
}

/*
 * 获取模块的函数,每次调用初始化一次模块
 * murl 模块的地址 
 * mname 模块名称，可空
 * */
function garen_require_fn(murl,params){
	var module = garen_use(murl,murl);
	return module?module.fn:null;
}

/*
 * 获取模块的函数,每次调用初始化一次模块
 * murl 模块的地址 
 * mname 模块名称，可空
 * */
function garen_require_inst(murl,params){
	var module = garen_use(murl,murl);
	if(!module) return null;
	var mCount = $.garenModules['###'];
	var m = {exports:{}};
	mname = module.mname;
	if(mCount[mname]) return null;
	else mCount[mname] = true;
	//$.print("准备初始化" + mname);
	var obj = module.fn(params || {});
	//$.print("初始化完毕" + mname);
	delete mCount[mname];
	module.obj = obj?obj:m.exports;
	return module.obj;
}

/*
 * jquery全局方法扩展
 * */
$.extend({
    print : function(){//日志控制台输出,可多个参数
        if(window.console){
        	$.each(arguments,function(i,v){
    			console.log(v);
    		})
        }
    },
    printLog : function(){//日志控制台输出,可多个参数
        if(window.console){
        	$.each(arguments,function(i,v){
    			console.log(v);
    		})
        }
    },
    list2Tree : function (nodes,id,pid,text){
		var rootNodes = [];
		function findNode(node){
			$.each(nodes,function(j,node2){
				if(node2 == node) return;
				if(node2[id] == node[pid]){
					if(!node2.children)
						node2.children = [];
					node2.children.push(node);
					node.noRoot = true;
				}
			});
		}
		$.each(nodes,function(i,node){
			node.id = node[id];
			node.text = node[text];
			node.checked = false;
			findNode(node);
		});
		$.each(nodes,function(i,node){
			if(!node.noRoot)
				rootNodes.push(node);
		});
		return rootNodes;
	},
	progress:function(txt){
		if('close' == txt) $.messager.progress("close");
		else $.messager.progress({text:txt});
	},
	/*
	 * 弹出确认窗口
	 * */
    confirm:function(msg,backFun){//弹出信息
    	$.messager.confirm("系统提示信息",msg,backFun);
    },
    /*
     * 弹出提示对话框
     */
    alert:function(msg,fn,width){//弹出信息
    	$.messager.alert({
    		title:"系统提示信息",
    		width:width || 380,
    		msg:msg,
    		icon:"warning",
    		fn:fn
    	});
    },
    /*
     * 提示信息弹窗显示
     * **/
    show:function(msg,fn,width){
    	$.messager.alert({title:"系统提示信息",width:width || 380,msg:msg,icon:"info",fn:fn});
    },
    /*
     * 提示信息弹窗显示
     * **/
    error:function(msg,fn,width){
    	$.messager.alert({title:"系统提示信息",width:width || 380,msg:msg,icon:"error",fn:fn});
    },
	 //判断请求地址是否为js
    isJsUrl : function (url){
		if(typeof(url) != 'string') return false;
		else if(url.match(/\.js$/g) == null) return false;
		return true;
	},
	/*
	 * 创建easyui弹出窗口
	 * 判断地址js,还是action
	 * 窗口关闭，默认销毁
	 */
    createWin : function(param,bodyUI){//创建弹出窗口
    	bodyUI = bodyUI || param.bodyUI;
        var jqBody = $("<div class='dialog_panelbody'></div>");
        //判断地址
    	if($.isJsUrl(param.url) == false) param['href'] = param.url;
    	if(param.border == undefined) param.border = true;
        param = $.extend({
	        collapsible:false,minimizable:false,resizable:false,
	        maximizable:false,doSize:false,modal:true,
	        onClose: function () {//关闭销毁窗口
	        	$.print("sdeee");
	            $(this).window('destroy');
	        }
		},param);
        if(!param.border){//无边框
        	param.title = '';
        	param.cls = 'garenui_window';
        	param.headerCls = 'notice_header';
        	param.bodyCls='garenwin_body';
        	param.shadow = false;
        }
        jqBody.window(param);
        var jqWin = jqBody.parent();
        //设置自定义样式
        if(param.cls) jqWin.addClass(param.cls);
        //设置头样式
        if(param.headerCls) jqWin.find("div.panel-header").addClass(param.headerCls);
        if(param.bodyCls) jqBody.addClass(param.bodyCls);
        jqBody.window("hcenter");//重新居中
        if($.isJsUrl(param.url)){
        	jqBody.loadJs(param.url,null,param.queryParams);
        }else if(bodyUI){
        	jqBody.loadUI(bodyUI);
        }
        if(param.closeIcon){
        	jqWin.find("div.panel-header").find("a").attr("class",param.closeIcon);
        }
        if(param.onLoad){
        	param.onLoad.call(jqBody);
        }
        return jqBody;
    },
  //验证结果，true不显示对话框
	checkret:function(retjson,isNotPop,fn){
		var ret = false;
		if($.isFunction(isNotPop)){
			fn = flag;
			isNotPop = false;
		}
		try{
			if(retjson['id'] == 0) {
				ret = true;
				if(isNotPop){
					if(fn) fn(true);
				}else{
					$.show(retjson['info'],function(){
						if(fn) fn(true);
					});
				}
			}else
				if(isNotPop){
					if(fn) fn(true);
				}else{
					$.alert(retjson['info'],function(){
						if(fn) fn(false);
					});
				}
		}catch(err){}
		return ret;
	},
	/*
	 * 创建Tab Yuanwen 2014-09-30 10:00 
	 * id, subtitle, url, flag,onLoad,onClose，grid
	 */
	createTab:function(tabObj,params){
		var url = params.url;
		if(url == false) return;
		if($.isJsUrl(url) == false){//
			params.href = url;
		}
		params = $.extend({
	   	    closable:true,
	   	    bodyCls:'dialog_panelbody',
	   	    method:"post",
	   	    //onOpen:function(){},
	   	    onLoadError:function(){
	   	    	$.alert('404 !');
	   	    },tools:[{
	   	    	iconCls:'icon-mini-refresh',
	   	        handler:function(){
	   	        	var myTabs = tabObj;
	   	        	var pp = myTabs.tabs('getSelected');
	   	        	var ppopt = pp.panel('options');
	   	        	var litab = $(this).parent().parent();
	   	        	var title = litab.find('.tabs-title').text();
	   	        	//切换tab时，点击了刷新按钮，则不刷新tab
	   	        	if(title != ppopt.title) return;
	   	        	if($.isJsUrl(url)){
	   	        		pp.empty();
	   	        		pp.loadJs(url,null,params.queryParams);
		   			}else  pp.panel('refresh',ppopt.href);
	   	        }
	   	    }]
	   	},params);
		if (tabObj.tabs('exists', params.title)) {//存在选择
			tabObj.tabs('select', params.title);
		}else{//添加
			tabObj.tabs('add', params);
			if($.isJsUrl(url)){//加载js
				var pp = tabObj.tabs("getTab",params.title);
				pp.empty();
	        	pp.loadJs(url,null,params.queryParams);
   			}
		}
	},
	/*
	 * 同步加载数据
	 * 成功返回数据
	 * 错误返回null
	 */
	loadEx:function(url,params){
		var data = $.postEx(url,params,null,false);
		return data.result?data.data:null;
	},
	postJson:function (url,params,fn){
		params = params || {};
		if(typeof params != "string")
			 params = $.toJSON(params);
		$.postEx({
			url:url,
			contentType:"application/json",
			params:params,
			onLoad:fn
		});
	},
	/*
	 * 多个参数:
	 * 参数:
	 * url请求地址,
	 * params 提交数据,
	 * onLoad 返回结果,函数
	 * 一个对象参数:
	 * {
	 *   url:请求地址,
	 *   params :提交数据,
	 *   onLoad :返回结果,函数
	 *   dataType:'json',文档类型,默认json
	 *   progressBar:'保存中...' //进度条显示的文本
	 *   async true 异步 false 同步
	 * }
	 */
	 postEx:function(url,params,result,async,timeout){
		var isJson = true;//是否返回结果为json
		var postParams = null;
		var dataResult = {};//最终返回结果
		timeout = timeout || 30 * 1000;//默认30秒
		async = async == undefined?true:async;//默认值为true
		//参数初始化
		if(typeof url == "string") {
			//params为函数,不是对象,则实为result
			if($.isFunction(params)){
				result = params;
				params = null;
			}
			//参数初始化
			postParams = {
				url:url,
				data:params
			};
		}else{
			postParams = url;
			postParams.data = postParams.params;
			result = postParams.onLoad;
		}
		
		//判断地址是否正确
		if(typeof postParams.url != "string") {
			$.alert("地址错误");
			return;
		}
		//$.print(postParams);
		//默认值
		postParams = $.extend({
			dataType:"json",
			async:async,//默认异步
			method:'post',
			timeout:timeout,//默认请求时间
			success:function(data, textStatus){
				if(isJson){//若为json,加入验证结果
					if($.isArray(data)){//若为数组
						data = {id:0,obj:data,result:true}
					}else if($.checkret(data,true)){
						data.result = true;
					}else
						data.result = false;
				}else{
					var retData = data;
					data = {id:0,obj:retData,result:true}
				}
				//统一数据
				data.data = data.data || data.obj || data.rows || data.record;
				onLoad(data);
			},
			error:function(response, textStatus){//
				//$.print(response,textStatus);
				var statusText = response.statusText;
				var status = response.status;
				if(statusText == "timeout") status = 454;
				onLoad({
					id:status,//404,403,500
					info:statusText,
					result:false,
					obj:response.responseText
				});
			},
			beforeSend:function(){
				if(postParams.progressBar){
					$.messager.progress({text:postParams.progressBar});
				}
			}
		},postParams);
		if(postParams.dataType.toLowerCase() != "json") isJson =false;
		//回复结果
		function onLoad(retJson){
			if(postParams.progressBar){//关闭进度条
				$.messager.progress('close');
			}
			if(result){//回调函数
				retJson.obj = retJson.obj || retJson.rows;
				result(retJson);
			}
			if(postParams.async == false){//同步直接返回结果
				dataResult = retJson;
			}
		}
		$.ajax(postParams);//提交请求
		return dataResult;
	},
	timer:{},
	timeStart:function(key){
		$.timer[key] =  new Date().getTime();
	},
	time:function(key,pre){
		var start = $.timer[key];
		if(start){
			if(pre == undefined) pre = "";
			else pre += ' : ';
			var end = new Date().getTime();
			$.print(pre + (end - start) + "ms");
		}
	},
	timeEnd:function(key,pre){
		var end = new Date().getTime();
		var start = $.timer[key];
		if(start == undefined) return;
		if(pre == undefined) pre = "";
		else pre += ' : ';
		$.print(pre + (end - start) + "ms");
		delete $.timer[key];
	}
});
/*
 * 公共方法
 * */
garen_define("utils",function(require, exports, module){
	var obj = {
		parseNum:function (num){
			num = parseInt(num,10);
			return num < 10?"0"+num:num;
		},
		date2Str:function(dateNum){//毫秒数解析日期
			var date = new Date(dateNum);//日期
			if(isNaN(date)) return dateNum;//解析失败返回原值
			return date.getFullYear() +'-'+ obj.parseNum(date.getMonth() + 1) + '-'+ obj.parseNum(date.getDate());
		},
		time2Str:function (dateNum){//解析时间
			var date = new Date(dateNum);//时间
			if(isNaN(date)) return dateNum;
			return date.getFullYear() +'-'+ obj.parseNum(date.getMonth() + 1) + 
				'-'+ obj.parseNum(date.getDate()) +" " 
				+ obj.parseNum(date.getHours()) + 
				":" + obj.parseNum(date.getMinutes());
		},
		/*
		 * 元素扩展
		 * UIs为原数组
		 * exUIs 要扩展的
		 */
		extUIs:function (UIs,extUIs){
			//扩展为undefined或uis不为数组,则使用默认
			if($.isArray(UIs) == false || extUIs == undefined)
				return UIs;
			if($.isArray(extUIs) == false){//若不为数组
				UIs.push(extUIs);
				return UIs;
			}
			if(extUIs.length == 0)
				return UIs;
			//若扩展第一个元素为Null,则返回扩展uis,替换原uis
			if(extUIs[0] == null){
				return extUIs.slice(1);
			}
			//追加
			return UIs.concat(extUIs);
		},
		getSysData:function(){//获取系统消息
			if(obj.sysdata) return obj.sysdata;
			else{
				$.postEx("glyUnitAction.do",function(retJson){
					$.print(retJson);
					obj.sysdata = retJson.data;
				});
			}
		},
		printGrid:function(title,mygrid,rows){
			var gridOpt = mygrid.datagrid("options");
			var params = gridOpt.queryParamsEx;
			if(rows == undefined && params == undefined) return;
			window.printObj = {
				title:title,
				params:params,
				gridOpt:gridOpt,
				rowdatas:rows
			}
			window.open("printgrid.jsp");
	   },
	   exportDocByData:function(fileName,expgrid){
		   obj.exportDoc(fileName,expgrid,"exportPdf.do",expgrid.datagrid("getRows"));
	   },
		exportDoc : function (fileName,expgrid,url,rows){
			var gridOpts = expgrid.datagrid('options');
			var params = gridOpts.queryParamsEx;
			if(rows == undefined && params == undefined) return;
			params = $.extend({},params);//复制参数
			var gridCols = [];
			$.print(expgrid.datagrid('getColumnFields'),gridOpts.columns);
			//组织表头参数
			var fields = expgrid.datagrid('getColumnFields', true).concat(
					expgrid.datagrid('getColumnFields'));
			$.each(fields,function(i,field){
				var col = expgrid.datagrid('getColumnOption', field);
				if(col.hidden) return true;
				if(col.checkbox) return true;
				var obj = {'title':$.trim(col.title),'field':col.field,
						'width':col.width,
						'fieldType':col.type};
				gridCols.push(obj);
			});
			url = url || gridOpts.url;
			var docType = "pdf";
			params['exportStr'] = $.toJSON(gridCols);
			params['exportTitle'] = fileName;
			params['export'] = true;
			params['pageSize'] = 30000;
			params['pageNum'] = 1;
			params['exportType'] = docType;
			if(rows) params['rowdatas'] = $.toJSON(rows);
			$.messager.progress({text:'文档导出中...'});
			$.postEx(url,params,function(retData){
				$.messager.progress('close');
				if(retData.result){
					var fileParam = {
						'fileKey':encodeURI(retData.info),
						'fileName':encodeURI(fileName),
						'browseType':$.browser.firefox ?"firefox":'',
						'docType':docType
					};
					window.open("exportDocFile.do?" + $.param(fileParam));
				}else{
					$.alert(retData.info);
				}
			});
		}
	}
	obj.getSysData();//初始化
	return obj;
});
/*
 * html元素实现工厂
 * */
garen_define("garen_ui",function(require, exports, module){
	//支持的html元素名称
	var htmlNames = ['div','a','span','form','img','p','fieldset', 'legend',
	              'label','select','option','textarea','optgroup','button',
	              'map','area','table','thead','tbody','th','tr',"object",'caption',
	             {name:'input',closeFlag:true,check1:function(data){
	            	 	data.type = data.type || "text";//默认为text
	            	 	return true;
	            	 }
	             },
	             {name:'td',check:function(tdData){return tdData.status;}},'tfoot',
	             'ul','ol','li','dl','dt','dd'
	];
	//属性集合,check回调转换值
	var htmlAttrs = ['name','src','href','type','tabindex','dir','alt','uId',
	                 'onselectstart',//禁止选中文本IE8-IE9
	        'value',"method","enctype",'for','codebase','classid','uname','nname',
	        'checked','disabled',
        {name:'class',alias:'cssClass'},{name:'id',alias:'id'},
        {name:'colspan',alias:'colSpan',check:function(v){return v > 1;}},
        {name:'rowspan',alias:'rowSpan',check:function(v){return v > 1;}}
	];
	var utils = garen_require("utils");
	var uiObj = {
		createUI:createUI
	}
	return uiObj;
	/*
	 * 创建html元素
	 * UIData:组件定义数据
	 * 返回值：正常object组件对象
	 * 0元素未定义 -1 创建失败 
	 */
	function createUI(jqObj,UIData){
		var tagName = UIData.eName;
		var tagObj = checkHtmlTag(tagName);
		if(tagObj == null) return 0;
		else if(tagObj.check) {//验证定义是否合法
			if(tagObj.check(UIData) == false) {
				//$.print("被合并的表格" + tagName);
				return -2;
			}
		}
		if(UIData.onCreate) UIData.onCreate.call(UIData);//创建前调用
		var html = null;
		if(tagObj.closeFlag) html = "<" + tagName + parseAtrr(UIData) + "/>";
		else html = "<" + tagName + parseAtrr(UIData) + "></"+tagName+">";
		if(UIData.debug) $.print(html);
		var myobj =  $(html);//创建Dom对象
		UIData.addMode = UIData.addMode || 2;//默认追加
		switch(UIData.addMode){
		case 1://前置
			jqObj.prepend(myobj); 
			break;
		case 2://追加
			jqObj.append(myobj);
			break;
		case 3://覆盖
			jqObj.html(myobj);
			break;
		case 4://同级前面
			jqObj.before(myobj);
			break;
		case 5://同级后面
			jqObj.after(myobj);
			break;
		}
		var jqOpts = $.extend(true,{},UIData);//复制组件定义
		myobj.data("garen_opts",jqOpts);//dom 封装UI对象
		bindEvent(jqOpts,myobj);//绑定事件
		if(jqOpts.elements || jqOpts.text){
			if("string" == typeof jqOpts.elements){
				myobj.html(jqOpts.elements);
			}else if("string" == typeof jqOpts.text){
				myobj.text(jqOpts.text);
			}else myobj.loadUI(jqOpts.elements);//创建子元素
		}
		return myobj;//返回组件
	}
	//验证原生html元素
	function checkHtmlTag(tagName){
		var flag = false;
		var tagObj = null;
		$.each(htmlNames,function(i,obj){//查找定义
			var name = null;
			if(typeof obj =="string"){
				name = obj;
				if(name == tagName){
					flag = true;
					tagObj = {name:name};
					return false;
				}
			}else{
				name = obj.name;
				if(name == tagName){
					flag = true;
					tagObj=obj;
					return false;
				}
			}
		});
		return tagObj;
	}
	//绑定元素事件
	function bindEvent(jqOpts,jqObj){
		if(!jqObj) return;
		var eventObj = [
            /*****键盘事件****/
            {key:'onKeydown',val:'keydown'}, {key:'onKeyup',val:'keyup'},{key:'onKeypress',val:'keypress'},
            /*******焦点相关事件********/
            {key:'onFocus',val:'focus'},{key:'onBlur',val:'blur'},{key:'onChange',val:'change'},
            {key:'onFocusin',val:'focusin'},{key:'onFocusout',val:'focusout'},
            /*******鼠标相关事件********/
            {key:'onClick',val:'click'},{key:'onDblclick',val:'dblclick'},
            {key:'onMousedown',val:'mousedown'},{key:'onMouseup',val:'mouseup'},
            {key:'onMouseenter',val:'mouseenter'},{key:'onMouseleave',val:'mouseleave'},
            {key:'onMousemove',val:'mousemove'},{key:'onMouseout',val:'mouseout'},
            {key:'onMouseover',val:'mouseover'},{key:'onScroll',val:'scroll'},
            /*其他事件*/
            {key:'onSelect',val:'select'},{key:'onSubmit',val:'submit'},{key:'onUnload',val:'unload'}
		];
		$.each(eventObj,function(i,e){
			if(jqOpts[e.key]){
				jqObj[e.val](jqOpts[e.key]);
			}
		});
	}
	//解析元素属性
	function parseAtrr(UIData,cls){
		var result = " ";
		//遍历所有属性
		$.each(htmlAttrs,function(i,attr){
			var obj = attr;
			if(typeof attr == 'string'){
				obj = {
					name : attr,
					alias : attr
				}
			}
			//判断是否定义
			var val = UIData[obj.alias];
			if(val != undefined){
				if(obj.check){
					if(obj.check(val)){
						result += ' ' + obj.name + '="' + val + '" ';
					}
				}else
					result += ' ' + obj.name + '="' + val + '" ';
			}
		});
		result += parseStyle(UIData);
		return result;
	}
	//解析样式表定义
	function parseStyle(UIData){
		function styleAttr(name){//解析样式中属性
			var str = "";
			var value = UIData[name];
			///if(value == undefined || value == '') return str;
			if(typeof value == 'string' && value.indexOf('%') != -1){//百分比
				str += name + ":"+value+";";
			}else if($.isNumeric(value)){
				str += name + ":"+value+"px;";
			}
			return str;
		}
		var style = "";//解析样式
		var width = UIData.width,height = UIData.height;
		style += styleAttr("width");
		style += styleAttr("height");
		style += styleAttr("top");
		style += styleAttr("right");
		style += styleAttr("bottom");
		style += styleAttr("left");
		if(typeof UIData.cssStyle == 'string'){
			style += UIData.cssStyle;
		}
		return style==""?style:(' style="' + style + '" ');
	}
});
/*
 * 扩展组件工厂
 * */
garen_define("garen_extui",function(require, exports, module){
	var utils = garen_require("utils");
	var garenUI = garen_require("garen_ui");
	var extFns = [];
	var uiObj = {
		createUI:function(jqObj,UIData){
			var eName = UIData.eName;
			var fn = extFns[eName];
			return fn?fn(jqObj,UIData):0;
		},
		regFn:function(fnName,fn){//注册生成组件的工厂
			if($.isFunction(fn))
				extFns[fnName] = fn;
		}
	}
	return uiObj;
});
/*
 * easyUI组件工厂
 * */
garen_define("garen_easyui",function(require, exports, module){
	var utils = garen_require("utils");
	var garenUI = garen_require("garen_ui");
	var easyFn = function(){
		return 0;
	};
	return {
		createUI:function(jqObj,UIData){
			return easyFn(jqObj,UIData);
		},
		regFn:function(fn){
			if($.isFunction(fn))
				easyFn = fn;
		}
	};
});
//组件工厂
(function(){
	var utils = garen_require("utils");
	var garenUI =  garen_require("garen_ui");
	var extUI =  garen_require("garen_extui");
	var easyUI =  garen_require("garen_easyui");
	//验证jquery对象是否为空
	function checkJqObj(jqObj){
		if(jqObj && jqObj.length > 0) return true;
		return false;
	}
	$.fn.extend({/*扩展jquery dom操作库*/
		findUI:function(name){
			return name?this.find(name).data("garen_opts"):this.data("garen_opts");
		},
		findJq:function(name){
			var jq = this;
			if(name == undefined) return this;
			var rules = ['[uid="'+name+'"]',
			             '[uname="'+name+'"]',
			             '.' + name,
			             '#' + name,
			             '[nname="'+name+'"]',
			             '[name="'+name+'"]',
			             name];
			var jqObj = null;
			$.each(rules,function(i,rule){
				jqObj = jq.find(rule);
				if(checkJqObj(jqObj)) return false;
			});
			return jqObj;
		},
		findJqEx:function(name){
			var jq = this.findJq(name);
			return jq.len == 0?null:jq;
		},
		findJqUI:function(name){//多个集合只获取第一个
			return this.findJq(name).data("garen_opts");
		},
		loadUI:function(uiOpts){//渲染界面
			return this.each(function(){
				var jqObj = $(this);
				var newui = null;
				if($.isArray(uiOpts) == false) uiOpts = [uiOpts];//默认为数组
				$.each(uiOpts,function(i,e){//遍历所有组件，自动匹配组件构造器
					if(e == undefined) return;
					if("string" == typeof e) jqObj.html(e);//文本直接添加
					else{//组件定义
						var eName = e['eName'];
						if(typeof eName != "string") return true;
						newui = garenUI.createUI(jqObj,e);
						if(0 == newui){
							if(!e.uname) e.uname = e.eName;//复制ename
							newui = extUI.createUI(jqObj,e);
							if(0 == newui){
								if(!e.nname) e.nname = e.name;//复制name
								newui = easyUI.createUI(jqObj,e);
								if(!newui) $.print("组件不存在:" + eName);
							}
						}else if(-1 == newui) $.print("组件验证没通过:" + eName);
					}
				});
			});
		},
		loadJs:function(url,mname,params){
			$.print(url);
			switch(arguments.length){
			case 1:
			case 3:
				break;
			case 2:
				if(typeof mname != "string"){
					params = mname;
					mname = null;
				}
				break;
			default:
				return;
				break;
			}
			params = params || {};
			var module = garen_use(url,mname);
			if(!module) return null;
			this.empty();//清空
			return module.fn(this,params);
		},
		loadDoc:function(url){//报表datagrid解析器
			var reportObj = garen_require_inst('js/lib/parseReport');
			reportObj.parse(this,url);
		},
		updateOpt : function(uifun,newOpt){
	        try{
	            $.extend(this[uifun].call(this,'options'),newOpt);
	        }catch(err){
	            $.printLog(err);
	        }
	    }
	});
}());

