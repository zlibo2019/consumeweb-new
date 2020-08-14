
//加载初始化
$(function(){
	var jmjlink = garen_require("js/lib/jmjlink");
	//webService
	var query = "account/cardReader/query.do";
	
	var sysKeySet = "account/cardReader/sysKeySet.do";
	var utils = garen_require("utils");
	var cardTypeSet = "account/cardReader/cardTypeSet.do";
	var mainBody = $("body");
	var gly = null;
	var bh = null;
	$.timeStart("发卡");
	//$.timeEnd("发卡");
	loadweb();
	$.global.wtopUrl =  $('#login_wtop').val();//返回地址
	window.gotoHome = function(){
		window.location = "http://" + $.global.wtopUrl + "/r_home.asp";
	}
	function loadweb(){
		var param = {};
		if(gly == null) gly = $("#login_gly").val();
		if(bh == null) bh = $("#login_bh").val();
		param['gly'] = gly;
		//if(bh == null)
		$.postEx('account/login2.do',param,function(retJson){
			param['menu_bh'] = bh;
			utils.getSysData();//初始化系统参数
			$.postEx('account/getMenu.do',param,function(retJson){
				$.time("发卡","登录完毕");
				if(retJson.result){
					try{
						$.global.menu = retJson.data[0];
						mainBody.loadJs(retJson.data[0].menu_path,{'login_wtop':$("#login_wtop").val()});
					}catch(e){
						window.gotoHome();
					}
				}else{
					$.alert(retJson.info);
				}
			}); 
		});
	}
	//window.loadweb = loadweb;
	//加载发卡控件
	jmjlink.load('jmjcard','160629001',function(jtype,jtext,jpre_str){
		//$.print("-----------",jtype,jtext,jpre_str,"-----------");
		$.time("发卡","卡加载完成");
		service1();
		//initCard();
	});
	
	function service1(){
		$.postEx(sysKeySet,function(retJson){
			if(retJson.result){
				service2(retJson.data[0]);
			}else{
				$.alert(retJson.info);
			}
		});
	}
	
	function service2(data){
		var param = {};
		param['is_write'] = "1";
		$.postEx(cardTypeSet,param,function(retJson){
			if(retJson.result){
				readCookie(data,retJson.data);
			}else{
				$.alert(retJson.info);
			}
		});
	}

	function readCookie(data1,data2){
		var id = $.cookie('id');
		var ComNo = $.cookie('ComNo');
		//$.print(id);
		/*if(id && ComNo){
			var param = {};
			param['id'] = id;
			$.postEx(query,param,function(retJson){
				if(retJson.result){
					if(retJson.data.length>0){
						initCard(data1,data2,retJson.data[0],ComNo);
					}else{
						var cookie = {
							"Purpose" : "USER", 
							"ReaderType" : "241", 
							"HostInterface" : "USB", 
							"ComNo" : "9", 
							"BandRate" : "5", 
							"SlotNo": "0", 
							"IsContact": "1"
						};
						initCard(data1,data2,cookie,ComNo);
					}
				}else{
					$.alert(retJson.info);
				}
			});
		}else{
			var cookie = {
				"Purpose" : "USER", 
				"ReaderType" : "241", 
				"HostInterface" : "USB", 
				"ComNo" : "9", 
				"BandRate" : "5", 
				"SlotNo": "0", 
				"IsContact": "1"
			};
			initCard(data1,data2,cookie,"9");
		}*/
		var param = {};
		param['id'] = id;
		$.postEx(query,param,function(retJson){
			if(retJson.result){
				if(retJson.data.length>0){
					if(id && ComNo){
						initCard(data1,data2,retJson.data[0],ComNo);
					}else if(id && retJson.data[0].HostInterface=="USB"){
						initCard(data1,data2,retJson.data[0],"9");
					}else{
						var cookie = {
							"Purpose" : "USER", 
							"ReaderType" : "241", 
							"HostInterface" : "USB", 
							"ComNo" : "9", 
							"BandRate" : "5", 
							"SlotNo": "0", 
							"IsContact": "1"
						};
						initCard(data1,data2,cookie,"9");
					}
					
				}else{
					var cookie = {
						"Purpose" : "USER", 
						"ReaderType" : "241", 
						"HostInterface" : "USB", 
						"ComNo" : "9", 
						"BandRate" : "5", 
						"SlotNo": "0", 
						"IsContact": "1"
					};
					if(id && ComNo){
						initCard(data1,data2,cookie,ComNo);
					}else{
						initCard(data1,data2,cookie,"9");
					}
				}
			}else{
				$.alert(retJson.info);
			}
		});
	}
	
	//卡控件初始化
	function initCard(data1,data2,cookie,ComNo){
		//$.print(data1,data2,cookie);
		//return;
		var params = {
			"commandSet" : [{
				"funName" : "IsetSysParam",
				"param" : data1
			},{
				"funName":"IsetCardParam", 
				"param": {
					"CardInfo" : data2
				}
			},{
				"funName":"IsetReaderParam", 
				"param":{
					"Purpose" : "USER", 
					"ReaderType" : cookie.ReaderType, 
					"HostInterface" : cookie.HostInterface, 
					"ComNo" : ComNo, 
					"BandRate" : cookie.BandRate, 
					"SlotNo": cookie.SlotNo, 
					"IsContact": cookie.IsContact
				}
			}]
		}
		jmjlink.send(function(jtype,jtext,jpre_str){
			//$.print("++++++++++++++",jtype,jtext,jpre_str,"+++++++++++++++");
			//loadweb();
		},'initReturn',$.toJSON(params));
	}
});
