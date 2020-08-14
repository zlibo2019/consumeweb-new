/**
 * 
 */

$(function(){
	var mainBody = $("body");
	
	login();//模拟登录
	test2();
	//alert(document.compatMode);
	var txtObj = null;
	//测试js性能
	function testJS(){
		var data = null;
		var ui = {
			eName:"div",
			addMode:"html",
			width:300,
			height:300,
			elements:[{
				eName:"linkbutton",
				text:"alert测试",
				onClick:function(){
					//load();
					$.timeStart('aa');
					var str = ["aa"];
					for(var i  = 0;i < 1000000;i++){
						//txtObj = txtObj || $(this);
						if(null == txtObj) txtObj = $(this);
						//$(this).height();
						//str.push(i);
						//$(this);
					}
					//str.join('');
					$.timeEnd('aa');
				}
			},{
				eName:"linkbutton",
				text:"排序",
				onClick:function(){
					$.print("数据数量:" + data.length);
					$.timeStart("sort");
					data.sort();
					$.timeEnd("sort");
				}
			},{
				eName:"linkbutton",
				text:"遍历",
				onClick:function(){
					$.print("数据数量:" + data.length);
					$.print(data[0]);
					$.timeStart("sort");
					var a = 0;
					$.each(data,function(i,e){
						//if(e.device_id == 0) a++;
						a += parseInt(e.user_no);
					});
					$.print(a);
					$.timeEnd("sort");
				}
			},{
				eName:"linkbutton",
				text:"title居中",
				onClick:function(){
					$.createWin({
						title:"<div style='text-align:center;'>123</div>",
						width:300,
						height:300
					},{
						eName:"div",
						cssStyle:"color:red;",
						height:250,
						width:250
					});
				}
			}]
		};
		mainBody.createUI(ui);
		function load(){
			var url = 'functionQuery/tradingWaterQuery/tradWaterQuery.do';
			var params = {
				cx_type:0,
				start_date:2016-10-01,
				end_date:2016-10-31,
				trad_type:1,
				pageNum:0,
				pageSize:30
			}
			$.progress("加载中...");
			$.timeStart("js");
			$.postEx(url,params,function(retJson){
				$.timeEnd("js");
				$.progress("close");
				data = retJson.data;
			});
		}
	}

	function login(){
		$.postEx("account/login.do",{user_name:'admin'});
	}
	//测试combotree IE9大小异常情况
	function testIE9(){
		mainBody.createUI({
			eName:"combotree",
			valueField:"val",
			textField:"text",
			data:{
				
			}
		});
	}
	//测试datespinnerEx
	function test2(){
		var dt = [];
		dt.push('Y');
		dt.push('M');
		dt.push('D');
		//dt.push('H');
		//dt.push('m');
		//dt.push('S');
		var ui = [{
			eName:"datespinnerEx",
			value:'2016-02-06',
			//offset:'123',
			dateType:dt
		},{
			eName:"linkbutton",
			text:"测试1",
			onClick:function(){
				var obj = mainBody.findJqOpts("datespinnerEx");
				$.print(obj.numberDisable(true));
			}
		},{
			eName:"linkbutton",
			text:"测试2",
			onClick:function(){
				var obj = mainBody.findJqOpts("datespinnerEx");
				$.print(obj.numberDisable(false));
			}
		}]
		mainBody.createUI(ui);
	}
	
	//测试html元素批量生成
	function test1(){
		var ui = {
			eName:"div",
			cssStyle:"border:1px solid red;",
			width:300,
			height:0.265899,
			onClick:function(){
				var win = $.createWin({
					width:300,
					height:400,
					title:"hello world",
					bodyUI:{
						eName:"linkbutton",
						text:"测试",
						onClick:function(){
							win.window('close');
						}
					}
				});
				$.print(win);
			},
			elements:{
				eName:"div",
				elements:[{
					eName:"span1",
					text:"1233"
				},{
					eName:"input1",
					value:"134",
					width:30
				}]
			}
		}
		mainBody.createUI(ui);
	}
	
	return;
	
	var jlink_port = null;
	var jlink_heart_counter = 20;
	var jlink_counter = jlink_heart_counter;  //计数次数初始值，运行中根据状态切换
	var jlink_cmd_id=0; //命令ID号
	var ui = {
		eName:"linkbutton",
		text:"测试",
		onClick:function(){
			$.print("ok");
			load('jmjcard','160629001',null);
		}
	};
	mainBody.loadUI(ui);
	//跨域加载js
	function loadScript(jtype,jdata){
		var head = document.getElementsByTagName('head')[0]; 
		var jscript = document.createElement('script'); 
		jscript.type = 'text/javascript'; 
		if (jtype==1)
		{
			jlink_counter=jlink_heart_counter; //切换到心跳超时 gqhua 20160822
		}
		function loadResult(){
			$.print($(this));
		}
		//载入成功时执行
		jscript.onload = loadResult;
		jscript.onreadystatechange =loadResult;
		jscript.src = "http://127.0.0.1:" + jlink_port + "/j/" + Math.floor(Math.random()*999999999) 
			+ "/" + jlink_key + "/" + jtype + "/" + jlink_cmd_id + "/" + encodeURIComponent(jdata) + "/";
		console.log(jscript.src);
		//插入元素,兼容IE6必须insertBefore
		head.insertBefore(jscript,head.firstChild);
		
	}
	//加载控件
	function load(jname,jver,jcallfun){
		var jlink_iframe = $("<iframe></iframe>");//document.createElement('iframe');
		jlink_iframe.hide();
		var myDate = new Date();
		var js_rnd = myDate.getSeconds() + myDate.getMilliseconds();
		jlink_key=Math.floor(Math.random()*99999999 + js_rnd);
		jlink_port=Math.floor(10001 + Math.random()*(64000-10001) + js_rnd);
		jlink_iframe.attr("src","jmjlink://" + jname + "/" + jlink_port + "/" + jlink_key + "/" + jver + "/");
		mainBody.append(jlink_iframe);
		loadScript(1,"login");//登录
	}
});

