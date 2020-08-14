//读卡器管理
garen_define("js/account/cardReader",function (jqObj,loadParams) {
	
	var query = "account/cardReader/query.do";
	
	var sysKeySet = "account/cardReader/sysKeySet.do";
	
	var cardTypeSet = "account/cardReader/cardTypeSet.do";
	
	var setLog = "account/cardReader/setLog.do";//记录日志
	
	//var jmjlink = garen_require("js/lib/jmjlink");//卡控件
	var jmjlink = garen_require("js/lib/jmjlink");//卡控件
	
	var rData = "";
	
	var flag = 1;
	
	var id = $.cookie("id");
	var ComNo = $.cookie("ComNo");
	var ComName = $.cookie("ComName");
	
	var mainUI = {
		eName:"div",
		height:"100%",
		elements:[{
			eName:"div",
			height:"45%",
			elements:[{
				eName:"div",
				cssClass:"cardReader_first_div",
				elements:{
					eName:"div",
					elements:{
						eName:"span",
						elements:"读卡器设置",
						onClick:function(){
							loadInit();
						}
					}
				}
			},{
				eName:"div",
				cssClass:"cardReader_second_div",
				elements:[{
					eName:"div",
					elements:[{
						eName:"span",
						elements:"用户卡读卡器"
					},{
						eName:"combobox",
						id:"cardReaderCombo",
						panelHeight:$.browser.msie9?200:'auto',
						panelMaxHeight:200,
						valueField:"id",
						textField:"ReaderName",
						editable:false,
						width:170,
						height:25,
						onChange:setInterValue
					}]
				},{
					eName:"div",
					elements:[{
						eName:"span",
						text:"主机接口类型"
					},{
						eName:"textbox",
						id:"interfaceText",
						editable:false,
						width:170,
						height:25
					}]
				},{
					eName:"div",
					elements:[{
						eName:"span",
						elements:"串口号&emsp;&emsp;&emsp;"
					},{
						eName:"combobox",
						id:"comCombo",
						panelHeight:$.browser.msie9?200:'auto',
						panelMaxHeight:200,
						valueField:"ComNo",
						textField:"ComName",
						editable:false,
						width:170,
						height:25,
						onShowPanel:loadCom
					}]
				},{
					eName:"div",
					cssStyle:"margin-top:50px;",
					elements:[{
						eName:"span",
						elements:"<a href='cardReaderDriver/cardReaderDriver.rar'>下载读卡器驱动</a>"
					},{
						eName:"span",
						cssStyle:"margin-left:50px;",
						//elements:"<a href='cardReaderHelper.html' target='_blank'>查看帮助</a>"
						elements:"<a href='cardReaderDriver/cardReaderHelper.rar'>下载帮助文档</a>"
					}]
				}]
			},{
				eName:"div",
				cssClass:"cardReader_fifth_div",
				height:155,
				elements:{
					eName:"linkbutton",
					uId:"tm2",
					cssClass:"cardReader_linkbutton",
					height:76,
					width:76,
					text:"保存",
					onClick:save
				}
			}]
		},{
			eName:"div",
			height:"40%",
			elements:[{
				eName:"div",
				cssClass:"cardReader_third_div",
				elements:{
					eName:"div",
					elements:{
						eName:"span",
						elements:"读卡器测试"
					}
				}
			},{
				eName:"div",
				cssClass:"cardReader_fourth_div",
				elements:[{
					eName:"div",
					elements:[{
						eName:"span",
						elements:"卡号&emsp;&emsp;&emsp;&emsp;"
					},{
						eName:"textbox",
						id:"card_no",
						editable:false,
						width:170,
						height:25
					}]
				},{
					eName:"div",
					elements:[{
						eName:"span",
						elements:"卡类型&emsp;&emsp;&emsp;"
					},{
						eName:"textbox",
						id:"card_type",
						editable:false,
						width:170,
						height:25
					}]
				}]
			},{
				eName:"div",
				cssClass:"cardReader_fifth_div",
				height:95,
				elements:{
					eName:"linkbutton",
					uId:"tm1",
					cssClass:"cardReader_linkbutton",
					height:76,
					width:76,
					text:"读卡",
					onClick:readCard
				}
			}]
		}]
	}
	
	jqObj.loadUI(mainUI);
	
	var cardReaderCombo = jqObj.findJq("cardReaderCombo");
	
	var interfaceText = jqObj.findJq("interfaceText");
	
	var comCombo = jqObj.findJq("comCombo");
	
	var card_no = jqObj.findJq("card_no");
	
	var card_type = jqObj.findJq("card_type");
	
	loadInit();
	
	function loadInit(){
		
		if(id && ComNo && ComName){
			$.cookie('id', id, { expires: 7 }); 
			$.cookie('ComNo', ComNo, { expires: 7 });
			$.cookie('ComName', ComName, { expires: 7 });
		}
		$.postEx(query,function(retJson){
			if(retJson.result && retJson.data){
				rData = retJson.data;
				var retData = [];
				comCombo.combobox('setValue',ComNo);
				comCombo.combobox('setText',ComName);
				$.each(retJson.data,function(i, data){
					var param = {};
					param['id'] = data.id;
					param['ReaderName'] = data.ReaderName;
					retData.push(param);
					//控件赋值
					if(id == data.id){
						cardReaderCombo.combobox('setValue',data.id);
					}
				});
				cardReaderCombo.combobox('loadDataEx',retData);
				//loadCom();
			}else{
				$.alert(retJson.info);
			}
		});
	}
	
	function loadCom(){
		var params = {
			"commandSet":[{
				"funName":"EnumCom", 
				"param":""
			}]
		};
		jmjlink.send(function(jtype,jtext,jpre_str){
			if(jtype==2){
				$.alert(jpre_str);
			}else{
				var jt = $.parseJSON(jtext);
				//$.print(jt);
				if(jt.ErrCode=="0"){
					comCombo.combobox('loadDataEx',jt.retData.ComInfoSet);
					var flag = 1;
					$.each(jt.retData.ComInfoSet,function(i, Com){
						if(Com.ComNo!=ComNo){
							flag = 0;
						}else{
							flag = 1;
							return false;
						}
					});
					if(flag == 0){
						comCombo.combobox('setValue','');
						comCombo.combobox('setText','');
					}
				}
				else{
					$.alert("枚举串口错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
				}
			}
		},'枚举串口',$.toJSON(params));
	}
	
	function setInterValue(){
		$.each(rData,function(i, data){
			if(cardReaderCombo.combobox("getValue")==""){
				interfaceText.textbox("setValue","");
			}
			else if(cardReaderCombo.combobox("getValue")==data.id){
				interfaceText.textbox("setValue",data.HostInterface);
			}
		});
	}
	
	function save(){
		$.postEx(setLog,{lx:'2',log_name:'读卡器管理',log_bz:'修改读卡器设置',log_state:'0'},function(){});
		
		if(cardReaderCombo.combobox("getValue")==""){
			$.alert("用户卡读卡器不能为空！");
		}
		else if(interfaceText.textbox("getValue")!="USB" && comCombo.combobox("getValue")==""){
			$.alert("串口号不能为空！");
		}
		else{
			service1();
		}
	}
	
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
		var id = cardReaderCombo.combobox("getValue");
		//$.print(id);
		var param = {};
		param['id'] = id;
		$.postEx(query,param,function(retJson){
			if(retJson.result){
				initCard(data1,data2,retJson.data[0]);
			}else{
				$.alert(retJson.info);
			}
		});
	}
	
	function initCard(data1,data2,cookie){
		var ComNo = comCombo.combobox("getValue") || "9";
		$.print(data1,data2,cookie,ComNo);
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
			if(jtype==2){
				$.alert(jpre_str);
			}else{
				var jt = $.parseJSON(jtext);
				//$.print("------",jtype,jtext,jpre_str,"------");
				if(jt.ErrCode=="0"){
					$.cookie('id', cardReaderCombo.combobox("getValue"), { expires: 7 }); 
					$.cookie('ComNo', comCombo.combobox("getValue"), { expires: 7 });
					$.cookie('ComName', comCombo.combobox("getText"), { expires: 7 });
					$.alert("保存成功！");
				}else{
					$.alert("初始化错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
				}
			}
		},'initReturn',$.toJSON(params));
	}
	
	//读卡
	function readCard(){
		var params = {
			"commandSet":[{
				"funName":"ReqCard", 
				"param":""
			}]
		};
		
		jmjlink.send(function(jtype,jtext,jpre_str){
			if(jtype==2){
				$.alert(jpre_str);
			}else{
				var jt = $.parseJSON(jtext);
				if(jt.ErrCode=="0"){
					card_no.textbox("setValue",jt.retData.CardNo);
					if("147" == jt.retData.CardType){
						card_type.textbox("setValue","ID卡");
					}else if("148" == jt.retData.CardType){
						card_type.textbox("setValue","IC-S50卡");
					}else if("149" == jt.retData.CardType){
						card_type.textbox("setValue","CPU卡");
					}else if("154" == jt.retData.CardType){
						card_type.textbox("setValue","IC-S70卡");
					}
					successBeep();
				}else if(jt.ErrCode=="-102"){
					$.alert("未寻到卡，请将卡放到读卡器后再次读卡！");
					errorBeep();
				}else{
					$.alert("寻卡错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
					errorBeep();
				}
			}
		},'寻卡',$.toJSON(params));
	}
	
	//成功提示音
	function successBeep(){
		var params = {
			"commandSet":[{
				"funName":"Beep",
				"param": {
					"IntervalMode":"No",
					"Ms":"100"
				 }
			}]
		}
		jmjlink.send(function(jtype,jtext,jpre_str){
			
		},'成功提示音',$.toJSON(params));
	}
	
	//错误提示音
	function errorBeep(){
		var params = {
			"commandSet":[{
				"funName":"Beep",
				"param": {
					"IntervalMode":"Short",
					"Ms":"600"
				 }
			}]
		}
		jmjlink.send(function(jtype,jtext,jpre_str){

		},'错误提示音',$.toJSON(params));
	}
	
	
	return {
		init :function(){
			$.print("init card over");
		}
	}
});