
//定义扩展组件
(function(){
	var garenUI =  garen_require("garen_ui");
	var extUI =  garen_require("garen_extui");
	var utils = garen_require("utils");
	//创建工具栏form
	extUI.regFn("formUI", function(jqObj,UIData){
		UIData.eName = "form";
		var myobj = garenUI.createUI(jqObj,UIData);
		var jqOpts = myobj.findUI();
		jqOpts.form2Json = function(params){//获取参数方法
			var myform = myobj;
			var formUI = this;
			params = params || {};
			if(myform.form("form2Json",params) == false) return false;
			if(formUI.onBeforeSave){
				if(false == formUI.onBeforeSave(params)) return false;
			}
			return params;
		}
		jqOpts.reset = function(){//重置
			var formUI = this;
			var myform = myobj;
			if(formUI.formData) 
				myform.form("load",formUI.formData);
			else
				myform.form("reset");
		}
		//创建方法
		jqOpts.submit = function(params){//获取表格数据
			params = params || {};
			var formUI = this;
			var myform = myobj;
			var progressBar = formUI.progressBar;
			var alertFlag = formUI.alertFlag;
			if(alertFlag == undefined) alertFlag = true;//默认值
			if(formUI.url == undefined) {
				$.print("地址为空");
				return false;
			}
			if(myform.form("form2Json",params) == false) return false;
			var enctype  = formUI.enctype ;
			if(enctype == "multipart/form-data"){//上传附件
				if(progressBar) $.messager.progress({text:progressBar});
				myform.form('submit',{
	    			url:formUI.url,
	    			success: function(data){
	    				if(progressBar) $.messager.progress('close');//关闭进度条
	    				var retJson = null;
	    				try{
	    					retJson = $.parseJSON(data);
	    				}catch(e){
	    					retJson = {id:-1,info:"发生异常",result:false};
	    				}
	    				retJson.result = $.checkret(retJson,alertFlag);
	    				retJson.data = retJson.rows || [];
	    				if(formUI.onSave) formUI.onSave(retJson);
	    			}
				});
			}else{
				if(formUI.onBeforeSave){
					if(false == formUI.onBeforeSave(params)) return false;
				}
				if(progressBar) $.messager.progress({text:progressBar});
				$.postEx(formUI.url,params,function(retJson){
					if(progressBar) $.messager.progress('close');//关闭进度条
					if(formUI.onSave) formUI.onSave(retJson);
					if(alertFlag){
						if(retJson.result) $.show(retJson.info);
						else $.alert(retJson.info);
					}
				});
			}
			return true;
		}
		var formUI = jqOpts;
		var myform = myobj;
		setTimeout(function(){//异步执行
			/*
			 * 加载表单数据
			 * 表单数据来源
			 * formData
			 * formUrl 数据查询地址
			 * formParams 数据查询参数
			 */
			if(formUI.formData){
				myform.form('load',formUI.formData);
				if(formUI.onLoad){
					formUI.onLoad.call(myform);
				}
			}else{
				if(formUI.formUrl){
					$.postEx(formUI.formUrl,formUI.formParams,function(retJson){
						if(retJson.result){
							formUI.formData = retJson.obj;
							myform.form('load',retJson.obj);
						}else{
							$.print('查询数据错误:',retJson);
						}
						if(formUI.onLoad){
							formUI.onLoad.call(myform);
						}
					});
				}else{
					if(formUI.onLoad){
						formUI.onLoad.call(myform);
					}
				}
			}
	    }, 0);
		return myobj;
	});
	//创建工具栏toolbar
	extUI.regFn("toolbar", function(jqObj,UIData){
		var jqOpts = null;
		var mainUI = {
			eName:'formUI',
			alertFlag:false,
			addMode:UIData.addMode,
			elements:{
				eName:'div',
				cssClass:'datagrid-toolbar ' + (UIData.cssClass || ''),
				elements:UIData.elements
			}
		};
		return extUI.createUI(jqObj,mainUI);
	});
	
	function addClass(uiData,clsName){
		if(uiData.cssClass)
			uiData.cssClass += " " + clsName;
		else 
			uiData.cssClass = clsName;
	}
	
	//创建工具栏layoutEx
	extUI.regFn("layoutEx", function(jqObj,UIData){
		var jqOpts = null;
		var mainUI = UIData;
		mainUI.eName = "div";
		mainUI.addMode = 3;
		addClass(mainUI,"layoutEx");
		if(mainUI.fit){
			mainUI.width = jqObj.width();
			mainUI.height = jqObj.height();
		}else{
			mainUI.width = mainUI.width || 300;
			mainUI.height = mainUI.height || 200;
		}
		var children = mainUI.elements;
		var w1 = 0,w2 = 0,h1 = 0,h2 = 0;
		var west = null,east = null,center = null;
		$.each(children,function(i,node){
			var region = node.region;
			if(!region) return;
			node.eName = "div";
			addClass(node,"panel_region");
			switch(region){
			case "north":
				node.id = "layoutEx_north";
				node.top = 0;
				node.left = 0;
				node.right = 0;
				node.height = node.height || 50;
				if(!h1) h1 = node.height;
				delete node.width;
				break;
			case "south":
				node.id = "layoutEx_south";
				node.bottom = 0;
				node.left = 0;
				node.right = 0;
				node.height = node.height || 50;
				if(!h2) h2 = node.height;
				delete node.width;
				break;
			case "west":
				node.id = "layoutEx_west";
				node.left = 0;
				node.width = node.width || 50;
				if(!west) west = node;
				if(!w1) w1 = node.width;
				delete node.height;
				break;
			case "east":
				node.id = "layoutEx_east";
				node.right = 0;
				node.width = node.width || 50;
				if(!w2) w2 = node.width;
				if(!east) east = node;
				delete node.height;
				break;
			case "center":
				node.id = "layoutEx_center";
				center = node;
				delete node.height;
				delete node.width;
				break;
			}
		});
		if(center){
			center.left = w1;
			center.right = w2;
			center.top = h1;
			center.bottom = h2;
		}
		if(west){
			west.left = 0;
			west.top = h1;
			west.bottom = h2;
		}
		if(east){
			east.top = h1;
			east.bottom = h2;
			east.right = 0;
		}
		var myobj = garenUI.createUI(jqObj,mainUI);
		var uiOpts = myobj.findUI();
		//设置高度
		uiOpts.resetSize = function(region,size){
			if(!region || !size) return;
			switch(region){
			case "west":
				myobj.find("#layoutEx_west").width(size);
				myobj.find("#layoutEx_center").css("left",size + "px");
				break;
			}
		}
		return myobj;
	});
	
	//创建工具栏layoutEx
	extUI.regFn("panelEx", function(jqObj,UIData){
		var jqOpts = null;
		var mainUI = UIData;
		mainUI.eName = "div";
		if(mainUI.fit){
			mainUI.width = jqObj.width();
			mainUI.height = jqObj.height();
		}else{
			mainUI.width = mainUI.width || 300;
			mainUI.height = mainUI.height || 200;
		}
		var myobj = garenUI.createUI(jqObj,mainUI);
		if($.isJsUrl(UIData.url)){
			myobj.loadJs(UIData.url,null,UIData.params);
		}
	});
	//创建工具栏layoutEx
	extUI.regFn("datespinnerEx", function(jqObj,UIData){
		var formatter = utils.parseNum;
		var type = {'Y':{
			uId:"spin_year",
			min:2005,
			max:2100,
			width:60,
			eName:"numberspinner",
			separator:"",
			onChange:onChange
		},'M':{
			min:1,
			max:12,
			uId:"spin_month",
			width:45,
			eName:"numberspinner",
			formatter:formatter,
			separator:"-",
			onChange:onChange
		},'D':{
			uId:"spin_day",
			min:1,
			max:31,
			width:45,
			eName:"numberspinner",
			separator:"-",
			formatter:formatter,
			onChange:onChange
		},'H':{
			uId:"spin_hour",
			min:0,
//			max:23,
			value:'00',
			width:45,
			eName:"numberspinner",
			formatter:formatter,
			separator:" ",
			onChange:onChange
		},'m':{
			uId:"spin_min",
			min:0,
//			max:59,
			value:'00',
			width:45,
			eName:"numberspinner",
			formatter:formatter,
			separator:":",
			onChange:onChange
		},'S':{
			uId:"spin_second",
			min:0,
			max:59,
			value:'00',
			width:45,
			eName:"numberspinner",
			formatter:formatter,
			separator:":",
			onChange:onChange
		}};
		//日期解析器
		var parser = $.fn.datebox.defaults.parser;
		var dateType = UIData.dateType || ['Y','M','D'];
		var offset = parseInt(UIData.offset,10);
		if(isNaN(offset) || (offset < 0 || offset >= 24 * 60))
			offset = 0;
		var ui = {
			eName:"div",
			uname:UIData.eName,
			nname:UIData.name,
			cssStyle:"display:inline-block",
			elements:[{
				eName:"input",
				uId:"spin_hidden",
				type:"hidden",
				name:UIData.name
			}]
		}
		$.each(dateType,function(i,e){
			ui.elements.push(type[e]);
		});
		var myobj = garenUI.createUI(jqObj,ui);
		var jqYear = myobj.findJqEx("spin_year");
		var jqMonth = myobj.findJqEx("spin_month");
		var jqDay = myobj.findJqEx("spin_day");
		var jqHour = myobj.findJqEx("spin_hour");
		var jqMin = myobj.findJqEx("spin_min");
		var jqSecond = myobj.findJqEx("spin_second");
		var jqInput = myobj.findJqEx("spin_hidden");
		var opts = myobj.findUI();
		
		opts.setDate = setDate;//日期赋值
		opts.getDate = function(){
			return jqInput.val();
		}
		setMinValue();//初始化最小值
		setDate(UIData.value);
		
		function getOffset(){
			var offset = parseInt(UIData.offset,10);
			if(isNaN(offset) || (offset < 0 || offset >= 24 * 60))
				offset = 0;
			$.print(offset);
			return offset;
		}
		//disable开关事件
		opts.numberDisable = function(value){
			var number =  myobj.findJq("numberspinner");
			number.numberspinner({'disabled':value});
			opts.setDate();
		};
		//设置小时的最小最大值
		opts.getHourCount = function(obj,setMinHours,setMaxHours){
			obj.numberspinner({'min':setMinHours,'max':setMaxHours});
		};
		
		//设置年月日
		function setYMD(datestrs){
			if(false == $.isArray(datestrs)) return;
			if(jqYear && datestrs[0] != undefined)
				jqYear.textbox("setValue",datestrs[0]);
			if(jqMonth && datestrs[1] != undefined){
				jqMonth.textbox("setValue",datestrs[1]);
			}
			if(jqDay && datestrs[2] != undefined)
				jqDay.textbox("setValue",datestrs[2]);
		}
		
		//设置时分秒
		function setHmS(timeStrs){
			if(false == $.isArray(timeStrs)) return;
			if(jqHour && timeStrs[0] != undefined){
				var num = parseInt(timeStrs[0],10);
				jqHour.textbox("setValue",formatter(num % 24));
			}
			if(jqMin && timeStrs[1] != undefined)
				jqMin.textbox("setValue",timeStrs[1]);
			if(jqSecond && timeStrs[2] != undefined)
				jqSecond.textbox("setValue",timeStrs[2]);
		}
		//设置时间
		function setDate(v){
			opts.changeFlag = true;
			var datestr = $.trim(v || utils.date2Str(new Date()));
			var datestrs = null,
				timeStrs = null,
				a = null,
				len  = datestr.length;
			switch(len){
			case 7:
			case 10:
				datestrs = datestr.split("-");
				break;
			case 5:
			case 8:
				timeStrs = datestr.split(":");
				break;
			case 19:
				a = datestr.split(" ");
				datestrs = a[0].split("-");
				timeStrs = a[1].split(':');
				break;
			}
			setYMD(datestrs);//设置年月日
			setHmS(timeStrs);//设置时分秒
			onSpinEx();
			opts.changeFlag = false;
		}
		//获取本月天数
		function getMonthDays(year,month){
			var date1 = new Date(year,month,1);
			var date2 = new Date(date1.getTime() - 24 * 60 * 60 * 1000);
			return date2.getDate();
		}
		//获取box的值
		function getBoxVal(jqtxt){
			if(jqtxt == null || jqtxt.length ==0) return null;
			return jqtxt.textbox("getValue");
		}
		//计算表单值
		function onSpinEx(){
			var values = '';
			if(myobj == undefined) return;
			var offset = getOffset();
			if(jqHour != null){
				var hourNum = parseInt(jqHour.textbox("getValue"),10);
				var minNum = 0;
				if(jqMin != null)
					minNum = parseInt(jqMin.textbox("getValue"),10);
				if(hourNum * 60 + minNum < offset)
					hourNum += 24;
				jqHour.findUI().val = hourNum;
			}
			myobj.find(".numberspinner-f").each(function(i,e){
				var thisUI = $(this).findUI();
				var val = parseInt($(this).textbox("getValue"),10);
				if(thisUI.uId == 'spin_hour'){
					val = thisUI.val;
				}
				if('' != values) values += (thisUI.separator || ' ');
				values += formatter(val);
			});
			jqInput.val(values);
			if(opts.changeFlag == false && UIData.onChange)
				UIData.onChange.call(myobj,values,values);
			else setDateMax();
		}
		//设置最小值
		function setMinValue(){
			myobj.find(".numberspinner-f").each(function(i,e){
				var thisUI = $(this).findUI();
				var val = parseInt($(this).textbox("getValue"),10);
				if(isNaN(val)) {
					var v = $(this).numberspinner("options").min;
					$(this).textbox("setValue", formatter(v));
				}
			});
		}
		//设置日期本月最大值
		function setDateMax(){
			if(jqYear == null 
					|| jqMonth == null
					|| jqDay == null) return;
			var year = jqYear.textbox("getValue");
			var month = jqMonth.textbox("getValue");
			var day = jqDay.textbox("getValue");
			var max = getMonthDays(year,month);
			jqDay.numberspinner({value:day,max:max});
		}
		//textbox值变化事件
		function onChange(n,o){
			$.print('onChange in');
			if(opts == undefined || opts.changeFlag) return;
			if(!n){//如果值为空,设置为最小值
				var thisObj = $(this);
				var v = thisObj.numberspinner("options").min;
				thisObj.textbox("setValue", formatter(v));
			}
			//如果更新年或月，则更新日最大值
			var uId = $(this).findUI().uId;
			try{
				if((jqYear != null && jqDay != null) 
						&& (uId == "spin_year" || uId == 'spin_month')) {
					var year = jqYear.textbox("getValue");
					var month = jqMonth.textbox("getValue");
					var day = jqDay.textbox("getValue");
					var max = getMonthDays(year,month);
					jqDay.numberspinner({value:day,max:max});
				}
				///如果时超过23，分和秒自动设为59
				///如果分超过59，秒自动设为59
				if(jqHour.textbox("getValue")>23){
					jqHour.textbox("setValue",'23');
					jqMin.textbox("setValue",'59');
					jqSecond.textbox("setValue",'59');
				}
				if(jqMin.textbox("getValue")>59){
					jqMin.textbox("setValue",'59');
					jqSecond.textbox("setValue",'59');
				}
			}catch(e){}
			onSpinEx();//表单值更新
			$.print('onChange out');
		}
	});
	
	//创建工具栏layoutEx
	extUI.regFn("treeEx", function(jqObj,UIData){
		var toolbar = UIData.toolbar;
		delete UIData.toolbar;
		var treeUI = $.extend(UIData,{
			eName:"tree",
			fit:true
		});
		var ui = {
			eName:"layoutEx",
			fit:true,
			elements:[{
				region:"center",
				cssStyle:"overflow:auto",
				elements:treeUI
			}]
		}
		if($.isArray(toolbar)){
			var searcher = null;
			$.each(toolbar,function(i,e){
				if(e == undefined) return;
				if(e.eName == "searchbox"){
					var searchFn = e.searcher;
					e.searcher = function(v){
						mytree.tree('doFilter1',v);
			        	if(searchFn)
			        		searchFn.call(this,v);
					}
					searcher = e;
				}
			});
			ui.elements.unshift({
				region:"north",
				height:30,
				cssStyle:"text-align:center;padding:5px;",
				elements:toolbar
			});
		}
		jqObj.loadUI(ui);
		var mytree = jqObj.findJq("tree");
		/*$.postEx(UIData.url,{},function(retJson){
			var nodes = $.list2Tree(retJson.data,UIData.id,
					UIData.pid,UIData.text);
			mytree.tree("loadData",nodes);
		});
		*/
	});
})();
/*
---------------定义扩展组件****************
*/

