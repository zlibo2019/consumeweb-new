
//调试用函数
function debug(){
	return 13 + 14;
}
//扩展全局变量
$.extend({
	garenModules:{'###':{}},
	global:{},
	print : function(){//日志控制台输出,可多个参数
        if(window.console){
        	$.each(arguments,function(i,v){
    			console.log(v);
    		});
        }
    },
    printLog:function(){
    	if(window.console){
        	$.each(arguments,function(i,v){
    			console.log(v);
    		});
        }
    },
    createWin:function(param,bodyUI){
    	var easyUI =  garen_require("garen_easyui");
    	param.bodyUI = param.bodyUI || bodyUI;
    	param.eName = "window";
    	return easyUI.createUI($('body'),param);
    },
    progress:function(txt){
		if('close' == txt) $.messager.progress("close");
		else $.messager.progress({text:txt});
	},
    /*
	 * 弹出确认窗口
	 * */
//    confirm:function(msg,backFun){//弹出信息
//    	$.messager.confirm("系统提示信息",msg,backFun);
//    },
	confirm:function(msg,fn,width){//弹出信息
    	if(msg.indexOf("请先登录系统 !") != -1 || msg.indexOf("服务器异常") != -1 ){
    		if(window.gotoHome) { 
    			window.gotoHome();
    			return;
    		}
    	}
    	var win = $.messager.confirm({
    		title:"系统提示信息",
    		width:width || 380,
    		msg:msg,
    		icon:"question",
    		fn:fn
    	});
    	//return;
    	win.createUI({
    		eName:"table",
    		addMode:"html",
    		elements:{
    			eName:"tr",
    			elements:[{
    				eName:"td",
    				width:40,
    				elements:{
    					eName:"div",
    					width:32,
    					height:32,
        				cssClass:"messager-question"
    				}
    			},{
    				eName:"td",
    				elements:msg
    			}]
    		}
    	});
    },
    /*
     * 弹出提示对话框
     */
    alert:function(msg,fn,width){//弹出信息
    	if(msg.indexOf("请先登录系统 !") != -1 || msg.indexOf("服务器异常") != -1 ){
    		if(window.gotoHome) { 
    			window.gotoHome();
    			return;
    		}
    	}
    	var win = $.messager.alert({
    		title:"系统提示信息",
    		width:width || 380,
    		msg:msg,
    		icon:"warning",
    		fn:fn
    	});
    	//return;
    	win.createUI({
    		eName:"table",
    		addMode:"html",
    		elements:{
    			eName:"tr",
    			elements:[{
    				eName:"td",
    				width:40,
    				elements:{
    					eName:"div",
    					width:32,
    					height:32,
        				cssClass:"messager-warning"
    				}
    			},{
    				eName:"td",
    				elements:msg
    			}]
    		}
    	});
    	/**
    	 * @author twl
    	 * @date 2017-06-21
    	 * @msg 更新alert关闭事件,使其点击x按钮时也触发回调函数
    	 */
    	win.updateOpt("panel",{
    		onBeforeClose:function(){
    			if (fn) {
    				fn();
		        }
    			return true;//true 关闭 false不关闭
    		}
    	});
    },
    /*
     * 提示信息弹窗显示
     * **/
    show:function(msg,fn,width){
    	var win = $.messager.alert({title:"系统提示信息",
    		width:width || 380,
    		msg:msg,icon:"info",fn:fn});
    	win.createUI({
    		eName:"table",
    		addMode:"html",
    		elements:{
    			eName:"tr",
    			elements:[{
    				eName:"td",
    				width:40,
    				elements:{
    					eName:"div",
    					width:32,
    					height:32,
        				cssClass:"messager-info"
    				}
    			},{
    				eName:"td",
    				text:msg
    			}]
    		}
    	});
    },
    /*
     * 提示信息弹窗显示
     * **/
    error:function(msg,fn,width){
    	$.messager.alert({title:"系统提示信息",width:width || 380,msg:msg,icon:"error",fn:fn});
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
	 postEx:function(url,params,result,async){
		if(url == undefined) return;
		var isJson = true;//是否返回结果为json
		var postParams = null;
		var dataResult = {};//最终返回结果
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
			timeout:2 * 60 * 000,//默认请求时间
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
				if(statusText == "error") statusText = "错误";
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
	},//判断请求地址是否为js
    isJsUrl : function (url){
		if(typeof(url) != 'string') return false;
		else if(url.match(/\.js$/g) == null) return false;
		return true;
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
	},
	list2Tree : function (nodes,id,pid,text){
		var rootNodes = [];
		function findNode(node){//查找子节点
			$.each(nodes,function(j,node2){
				if(node2 == node) return;
				if(node2[id] == node[pid]){
					if(!node2.children) node2.children = [];
					node2.children.push(node);
					node.noRoot = true;
				}
			});
		}
		$.each(nodes,function(i,node){
			node.id = node[id];//id不时key，其值为key
			node.text = node[text];
			//node.checked = false;
			findNode(node);
		});
		$.each(nodes,function(i,node){
			if(!node.noRoot) {
				node.checked = false;
				rootNodes.push(node);
			}
		});
		var maxDepth = 1;
		//深度遍历
		function iterator(nodes,depth){
			$.each(nodes,function(i,n){
				//$.printLog("深度:" + depth + ",名称:" + n.text);
				var flag = n.children && n.children.length > 0;
				if(maxDepth == depth && flag){
					n.state = 'closed';
				}else{
					if(flag) iterator(n.children,depth + 1);
				}
			});
		}
		iterator(rootNodes,0);
		return rootNodes;
	}
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
	var obj = module.fn(this,params || {});
	//$.print("初始化完毕" + mname);
	delete mCount[mname];
	module.obj = obj?obj:m.exports;
	return module.obj;
}
/*
 * 公共方法
 * */
garen_define("utils",function(){
	var obj = {
		showMask:function(flag){
			var mask = null;
			var docobj = $(document);
			if(flag){
				mask = $('<div class="window-mask window-mask-garen"></div>');
				$('body').append(mask);
				mask.width(docobj.width());
				mask.height(docobj.height());
			}else{
				$('.window-mask-garen').remove();
			}
			return mask;
		},
		parseSize:function(parentSize,size){
			if(false == $.isNumeric(parentSize) ||
				size == undefined) return null;
			var num = null;
			if($.isNumeric(size)){
				num = parseFloat(size);
				if(num > 0 && num < 1)
					num = parseInt(num * parentSize,10);
			}else if(typeof size == 'string' && size.indexOf('%') != -1){
				num = parseInt((parseInt(size,10) * parentSize) / 100,10);
			}
			return num;
		},
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
		},list2Tree : function (nodes,id,pid,text){
			var rootNodes = [];
			function findNode(node){//查找子节点
				$.each(nodes,function(j,node2){
					if(node2 == node) return;
					if(node2[id] == node[pid]){
						if(!node2.children) node2.children = [];
						node2.children.push(node);
						node.noRoot = true;
					}
				});
			}
			$.each(nodes,function(i,node){
				node.id = node[id];
				node.text = node[text];
				//node.checked = false;
				findNode(node);
			});
			$.each(nodes,function(i,node){
				if(!node.noRoot) {
					node.checked = false;
					rootNodes.push(node);
				}
			});
			var maxDepth = 1;
			//深度遍历
			function iterator(nodes,depth){
				$.each(nodes,function(i,n){
					//$.printLog("深度:" + depth + ",名称:" + n.text);
					var flag = n.children && n.children.length > 0;
					if(maxDepth == depth && flag){
						n.state = 'closed';
					}else{
						if(flag) iterator(n.children,depth + 1);
					}
				});
			}
			iterator(rootNodes,0);
			return rootNodes;
		},
		isJsUrl : function (url){
			if(typeof(url) != 'string') return false;
			else if(url.match(/\.js$/g) == null) return false;
			return true;
		},
		getSysData:function(){//获取系统消息
			if(!obj.sysdata){
				obj.sysdata = $.loadEx("glyUnitAction.do") || {};
				/*$.postEx("glyUnitAction.do",function(retJson){
					//$.print(retJson);
					obj.sysdata = retJson.data;
				});*/
			}
			return obj.sysdata;
		},//打印
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
	   exportDocByData2:function(fileName,expgrid,rows){
		   obj.exportDoc(fileName,expgrid,"exportPdf.do",rows);
	   },
	   exportExcel:function(docType,fileName,expGrid){
		   var gridOpts = expGrid.datagrid('options');
		   gridOpts.docType = docType || "xls";
		   this.exportDoc(fileName,expGrid);
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
			var docType = gridOpts.docType || "pdf";//默认导出pdf
			params['exportStr'] = $.toJSON(gridCols);
			params['exportTitle'] = fileName;
			params['export'] = true;
			params['diret'] = gridOpts.diret || 1;
			//params['pageSize'] = 18;
			//params['pageNum'] = 1;
			params['exportType'] = docType;
			if(rows) params['rowdatas'] = $.toJSON(rows);
			$.progress('文档导出中...');
			$.postEx(url,params,function(retData){
				$.progress('close');
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
	///obj.getSysData();//初始化
	return obj;
});
/*
 * html元素实现工厂
 * */
garen_define("garen_ui",function(){
	//支持的html元素名称
	var htmlNames = ['div','a','span','form','img','p','fieldset', 'legend',
	              'label','select','option','textarea','optgroup','button',
	              'map','area','table','thead','tbody','th','tr','object',
	             {name:'input',closeFlag:true},
	             {name:'td',check:function(tdData){return tdData.status;}},'tfoot',
	             'ul','ol','li','dl','dt','dd','caption'
	];
	//属性集合,check回调转换值
	var htmlAttrs = ['name','src','href','type','tabindex','dir','alt','uId','onselectstart',//禁止选中文本IE8-IE9
	        'value',"method","enctype",'for','codebase','classid','uname','nname','checked',
	        'disabled','id',
        {name:'class',alias:'cssClass'},
        {name:'colspan',alias:'colSpan',check:function(v){return v > 1;}},
        {name:'rowspan',alias:'rowSpan',check:function(v){return v > 1;}}
	];
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
	var utils = garen_require("utils");
	var uiObj = {
		createUI:createUI,
		createHtmls:createHtmls
	}
	return uiObj;
	/*
	 * 创建html元素
	 * UIData:组件定义数据
	 * 元素添加DOM的方式:
	 * 	prepend顶部插入,append尾部添加,html覆盖,
	 *  before同级前面,after同级后面
	 * 返回值：正常object组件对象
	 * 0元素未定义 -1 创建失败 
	 */
	function createUI(jqObj,UIData){
		var tagName = UIData.eName;
		var tagObj = checkHtmlTag(tagName);
		if(tagObj == null) return 0;
		else if(tagObj.check) {//验证定义是否合法
			if(tagObj.check(UIData) == false) return -2;
		}
		if(UIData.onCreate) UIData.onCreate.call(UIData);//创建前调用
		var html = null;
		if(tagObj.closeFlag) html = "<" + tagName + parseAtrr(UIData) + "/>";
		else html = "<" + tagName + parseAtrr(UIData) + "></"+tagName+">";
		if(UIData.debug) $.print(html);
		var myobj =  $(html);//创建Dom对象
		var addMode = UIData.addMode || 'append';//默认追加
		switch(addMode){
		case 'prepend'://前置
			jqObj.prepend(myobj); 
			break;
		case 'append'://追加
			jqObj.append(myobj);
			break;
		case 'html'://覆盖
			jqObj.html(myobj);
			break;
		case 'before'://同级前面
			jqObj.before(myobj);
			break;
		case 'after'://同级后面
			jqObj.after(myobj);
			break;
		default://追加
			jqObj.append(myobj);
			break;
		}
		var jqOpts = $.extend(true,{},UIData);//复制组件定义
		myobj.data(tagName + "_ui",jqOpts);//dom 封装UI对象
		bindEvent(jqOpts,myobj);//绑定事件
		initSize(jqObj,myobj,jqOpts);
		if(!jqOpts.noChild && (jqOpts.elements || jqOpts.text)){
			if("string" == typeof jqOpts.elements || "number" == typeof jqOpts.elements){
				myobj.html(jqOpts.elements);
			}else if("string" == typeof jqOpts.text || "number" == typeof jqOpts.text){
				myobj.text(jqOpts.text);
			}else myobj.createUI(jqOpts.elements);//创建子元素
		}
		return myobj;//返回组件
	}
	//创建元素,仅生成网页，不绑定事件
	function createHtml(UIData){
		var tagName = UIData.eName;
		var tagObj = checkHtmlTag(tagName);
		if(tagObj == null) return "";
		else if(tagObj.check) {//验证定义是否合法
			if(tagObj.check(UIData) == false) return "";
		}
		var html = null;
		if(tagObj.closeFlag) html = "<" + tagName + parseAtrr(UIData) + "/>";
		else html = "<" + tagName + parseAtrr(UIData) + ">";
		if(UIData.elements || UIData.text){
			if("string" == typeof UIData.elements || "number" == typeof UIData.elements){
				html += UIData.elements;
			}else if("string" == typeof UIData.text || "number" == typeof UIData.text){
				html += UIData.text;
			}else html += createHtmls(UIData.elements);//创建子元素
		}
		html += "</"+tagName+">";
		return html;//返回组件
	}
	
	function createHtmls(uiOpts){
		var html = "";
		if($.isArray(uiOpts) == false) uiOpts = [uiOpts];//默认为数组
		$.each(uiOpts,function(i,e){//遍历所有组件，自动匹配组件构造器
			if(e == undefined) return;
			if("string" == typeof e) jqObj.html(e);//文本直接添加
			else{//组件定义
				var eName = e['eName'];
				if(typeof eName != "string") return true;
				html += createHtml(e);
			}
		});
		return html;
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
	//初始化元素大小
	function initSize(jqObj,myobj,opts){
		var width = jqObj.width();
		var height = jqObj.height();
		autoSet('outerWidth',width);
		autoSet('outerHeight',height);
		//计算大小
		function autoSet(key,size){
			try{
				var num = utils.parseSize(size,opts[key]);
				if(num) myobj[key](num);
			}catch(e){$.print(e)}
		}
	}
	//绑定元素事件
	function bindEvent(jqOpts,jqObj){
		if(!jqObj) return;
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
	/*解析大小
	 * 参数:size 可能取值:
	 * '18%'  => width:18%
	 * 25     => width:25px;
	 * 26.3   => width:26px;
	 * 0.123  => width:12.3%
	 * */
	function parseStyle(UIData){
		function styleAttr(name){//解析样式中属性
			var str = "",num = null;
			var value = UIData[name];
			if(value == undefined) return str;
			if(typeof value == 'string' && value.indexOf('%') != -1){//百分比
				str += name + ":"+value+";";
			}else if($.isNumeric(value)){
				num = parseFloat(value);
				if(num == 0 || num >= 1) str = name + ":" + value+"px;";
				else str = name + ":" +(num * 100) + '%;';
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
garen_define("garen_easyui",function(){
	var utils = garen_require("utils");
	var garenUI = garen_require("garen_ui");
	var EasyUINames = [{name:'textbox',tag:'input'},{name:'datebox',tag:'input'},{name:'datetimebox',tag:'input'},
	       {name:'filebox',tag:'input'},{name:'tree',tag:'ul'},
	       {name:'numberbox',tag:'input'},{name:'combo',tag:'input'},{name:'combobox',tag:'input'},
	       {name:'switchbutton',tag:'input'},{name:'combogrid',tag:'input'},
	       {name:'linkbutton',tag:'a'},{name:'datetimespinner',tag:'input'},{name:'numberspinner',tag:'input'},
	      {name:'searchbox',tag:'input'}];
	return {
		createUI:createUI,
		regFn:function(fn){
			if(fn) EasyUINames.push(fn);
		}
	};
	/*
	 * 创建EasyUI
	 * UIData:组件定义数据
	 * jqObj UI组件容器
	 * 步骤：
	 * 1查询定义语法，null 退出
	 * 2 创建html元素
	 * 3 创建easyui 组件
	 * 4 调用回调函数
	 * 5 完毕
	 * 返回值:
	 * 	null 创建失败
	 *  obj 返回定义options
	 */
	function createUI(jqObj,UIData){
		//查找UI定义
		var uiObj = findEasyUI(EasyUINames,UIData.eName);
		if(uiObj == null) return 0;//未找到
		var eName = UIData.eName;
		UIData.uname= eName;//复制ename
		UIData.nname = UIData.name;//复制name
		UIData.eName = uiObj.tag;
		var childNodes = UIData.elements;
		UIData.elements = null;//不包含子子节点
		var myobj = garenUI.createUI(jqObj,UIData);
		if(myobj <= 0) return -1;//创建错误
		var htmlUI = myobj.findOpts();
		htmlUI.elements = childNodes;
		htmlUI.eName = eName;
		myobj.unbind();//取消所有事件绑定
		myobj[htmlUI.eName](htmlUI);//创建组件
		htmlUI = myobj[htmlUI.eName]("options");//更新配置信息
		if(uiObj.onCreate){//创建时回调函数
			uiObj.onCreate(myobj,htmlUI);
		}
		return myobj;
	}
	//查询EasyUI组件定义
	function findEasyUI(EasyUINames,name){
		var obj = null;
		$.each(EasyUINames,function(i,ui){
			if(name == ui.name){
				obj = ui;
				return false;
			}
		});
		return obj;
	}
});

//组件工厂,即生成组件
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
		findOpts:function(name){
			var obj = name?this.find(name):this;
			var tagName = obj.prop('nodeName') || '';
			tagName = tagName.toLowerCase();
			return obj.data(tagName + "_ui");
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
			return jq.length == 0?null:jq;
		},
		findJqOpts:function(name){//多个集合只获取第一个
			var obj = this.findJq(name);
			var tagName = obj.prop('nodeName') || '';
			tagName = tagName.toLowerCase();
			return obj.data(tagName + "_ui");
		},
		findJqUI:function(name){
			return this.findJqOpts(name);
		},
		createUI:function(uiOpts){//渲染界面
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
		findUI:function(name){
			return this.findOpts(name);
		},
		findJqUI:function(name){
			return this.findJqOpts(name);
		},
		loadUI:function(uiOpts){
			return this.createUI(uiOpts);
		},
		loadJs:function(url,mname,params){//远程加载
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
			$.print(url);
			return module.fn(this,params);
		},
		createHtml:function(uiOpts){
			this.each(function(){
				var jqObj = $(this);
				jqObj.append(garenUI.createHtmls(uiOpts));
			});
		},
		//扩展组件方法,即JQuery EasyUI组件对象都可以调用
		updateOpt : function(uifun,newOpt){
		    try{
		    	if(this.length <= 0) return;
		        $.extend(this[uifun].call(this,'options'),newOpt);
		    }catch(err){
		        $.printLog(err);
		    }
		}
	});
}());

//获取浏览器类型及版本
(function(){
	$.browser = {msie:false,msie7:false,msie8:false,msie9:false,
			msie10:false,msie11:false,chrome:false,firefox:false}
	var ver = null,u = window.navigator.userAgent.toLocaleLowerCase();
	if(/(msie) ([\d.]+)/.test(u)) {
		ver = parseInt(/(msie) ([\d.]+)/.exec(u)[2],10);
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
