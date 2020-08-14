
//发卡控件交互封装,单例
garen_define("js/lib/jmjlink",function (require, exports, module) {
	var jlink_running=0; //启动标记
	var jlink_key=0; //密钥
	var jlink_port=0; //端口
	var jlink_timer=null; //定时器
	var jlink_callfun=null; //回调函数,(返回指令类型,返回字符串)类型:1=登陆成功,2=异常退出,3=数据异常,4=数据
	var jlink_cmd_id=0; //命令ID号
	var jlink_name=null; //连接名
	var jlink_login=0; //是否登录
	var jlink_tick_time=0; //时间基数
	var jlink_last_time=0; //最后登录时间
	var jlink_pre_str = ""; //预留数据
	var jlink_false_connect = "卡片服务连接失败，请刷新页面！<br/>若首次操作卡片，请下载卡片服务并安装<a href='jmjlink/JBrowser_card2017062401.rar'>点此下载</a>";//服务连接失败提示
	var jlink_error_version = "卡片控件版本不支持！<br/>请重新下载卡片服务并安装<a href='jmjlink/JBrowser_card2017062401.rar'>点此下载</a>";//卡控件版本不一致提示
	var jlink_ver_error = "卡片服务版本不支持！<br/>请重新下载卡片服务并安装<a href='jmjlink/JBrowser_card2017062401.rar'>点此下载</a>";//卡控件版本不一致提示
	var jlink_send_error = "卡片服务忙，请重试！";//20160905
	var jlink_init_wait = "初始化未完成，请稍后再试！";//20160907
	var jlink_init_fail = "初始化失败，请刷新页面！";//20170713
	var first_send = 1;//20160905
	var send_flag = 0;//20160905
	var time_out_flag = 0;//超时标志20160905
	var check_ver_flag = 0;    // 版本检查状态 0：未执行版本检查 1：已发送版本检查指令 2：通过版本检查  3：版本不支持  20160905
	var initOver = 0;//初始化完成20160907
	
	//gqhua 20160822
	var jlink_direct_counter = 5;
	var jlink_heart_counter = 20;
	var jlink_counter = jlink_heart_counter;  //计数次数初始值，运行中根据状态切换
	var jlink_false_num = 0;  //接收不到返回计数器 20160824

	var jlink_iframe = null; //浏览器启动iframe

	jlink_ret_id=0; //返回的命令ID
	jlink_ret_len=0; //返回的数据长度,-1=心跳,-2=登陆错误
	jlink_ret_data=""; //返回的数据内容

	//发送应用数据
	function jlink_close(){
		if(jlink_login==1){
			jlink_send_ex(3,"exit");
			jlink_running=0;
			jlink_login=0;
			if(jlink_timer != null){
				clearInterval(jlink_timer);
				jlink_timer=null;
			}
			if(time_out_flag==1){
				time_out_flag=0;
			}else{
				jlink_callfun(2,"linker close",jlink_false_connect);
			}
			
		}
	}
	
	//发送原始数据(类型,数据) 1=心跳,2=文本,3=退出
	function jlink_send_ex(jtype,jdata){
		var head = document.getElementsByTagName('head')[0]; 
		var jscript = document.createElement('script'); 
		jscript.type = 'text/javascript'; 
		
		if (jtype==1)
		{
			jlink_counter=jlink_heart_counter; //切换到心跳超时 gqhua 20160822
		}
		
		//载入成功时执行
		jscript.onload = jscript.onreadystatechange = function(){
			if((!this.readyState||this.readyState === "loaded"||this.readyState === "complete"))
			{
				var r11 = 'ret:id=' + jlink_ret_id + ',len=' + jlink_ret_len + ',data=' + decodeURIComponent(jlink_ret_data);
				$.time("发卡","接收结果" + r11);
				//防止重入
				jscript.onload = jscript.onreadystatechange = null;
				//最后心跳时间
				jlink_last_time=jlink_tick_time;
				
				//释放节点
				if(head && jscript.parentNode) 
				{ 
					head.removeChild(jscript); 
				}
				
				

				//指令ID判断
				if((jlink_ret_id > 0) && (jlink_ret_id != jlink_cmd_id))
				{
					//console.log('ret_err:id=' + jlink_ret_id + ',len=' + jlink_ret_len + ',data=' + jlink_ret_data);
					return; //过期的回复
				}
				jlink_cmd_id = jlink_cmd_id + 1;
				
				//成功标记
				if(jlink_ret_len == -1)
				{
					if(jlink_login==0)
					{
						//登陆回调
						//jlink_login=1;  //移到别处
						
						//删除iframe,防止重新载入
						if(jlink_iframe)
						{
							jlink_iframe.remove();
							jlink_iframe = null;
						}
						
						if(check_ver_flag<2)  //版本检查未完成
						{
							check_ver_flag = 1;
							//发送版本检查指令 ......
							var params = {
								"commandSet":[{
									"funName":"IgetAppVer", 
									"param":""
								}]
							};
							jlink_send_ex(2,$.toJSON(params));
//							uiObj.send(function(jtype,jtext,jpre_str){
//								$.print("-------",jtype,jtext,jpre_str,"-------");
//							},'版本验证',$.toJSON(params));
							
						}
						
						//回调成功
						//jlink_callfun(1,'login sucess',jlink_pre_str);   //移到别处
					}
					else
					{
						//心跳
						//console.log('jlink heart');
					}
				}
				else if(jlink_ret_len >= 0)
				{
					if(check_ver_flag == 1) 
					{
						var jt = $.parseJSON(decodeURIComponent(jlink_ret_data));
						if(jt.ErrCode=="0"){
							if(!jt.retData){
								//未通过检查
								check_ver_flag = 3;
								//$.alert(jlink_ver_error);
							}
							else if(jt.retData.AppVer>=2017062401){
								//通过检查
								check_ver_flag = 2;
								jlink_login=1;
								jlink_callfun(1,'login sucess',jlink_pre_str);
							}else{
								//未通过检查，卡片服务版本不支持
								check_ver_flag = 3;
								//$.alert(jlink_ver_error);
							}
						}else{
							//未通过检查，卡片控件版本不支持
							check_ver_flag = 4;
							//$.alert(jt.ErrMsg+"<br/>请重新下载卡片服务并安装<a href='jmjlink/JBrowser_card2017062401.rar'>点此下载</a>");
						}		
					}
					else
					{
						if(jlink_pre_str=="initReturn"){
							initOver=1;
						}
						//回调函数
						jlink_counter=jlink_heart_counter;//切换到心跳超时 gqhua 20160822
						//寻卡错误码若为**则版本不一致 twl 20160830
						try{
							var jt = $.parseJSON(decodeURIComponent(jlink_ret_data));
						}catch(e){
							jt = {}
						}
						//$.print(jt);
						send_flag = 0;//20160905
						if(jt.ErrCode=="-90001"){
							jlink_callfun(2,"error version",jlink_error_version);
						}else{
							jlink_callfun(4,decodeURIComponent(jlink_ret_data),jlink_pre_str);
						}	
					}
				}
				else
				{
					//数据异常
					//jlink_callfun(3,'data error',jlink_pre_str);
					//alert("数据异常");
					jlink_close();
				}
			} 
			
		};
		jscript.onerror = function(){
			if(time_out_flag == 0){
				time_out_flag = 1;
				jlink_callfun(2,"linker close","操作超时，请重试！");  //20160824
			}else{
				time_out_flag = 0;
			}
			
		}
		//递增命令ID
		if(jtype==2)jlink_cmd_id = jlink_cmd_id+1;
		//发送数据
		jscript.src = "http://127.0.0.1:" + jlink_port + "/j/" + Math.floor(Math.random()*999999999) + "/" + jlink_key + "/" + jtype + "/" + jlink_cmd_id + "/" + encodeURIComponent(jdata) + "/";
		$.time("发卡","发送指令" + decodeURIComponent(jscript.src));
		//插入元素,兼容IE6必须insertBefore
		head.insertBefore(jscript,head.firstChild);
		if (jtype==2)
		{
			jlink_counter=jlink_direct_counter; //切换到指令超时 gqhua 20160822
		}
	}
	var uiObj =  {
		load:function(jname,jver,jcallfun){//加载控件
			//防止反复加载
			if(jlink_running) return 0;
			jlink_running=1;
			var jret = 0;
			//IE浏览器检测是否安装
			if(navigator.userAgent.indexOf("MSIE") != -1){
				if(jlink_checkapp(jname)){
					jlink_tick_time = 11;//20160928执行版本验证
					return -1; //未安装,跳出
				}else{
					jret = 1; //已安装
				}
			}
			//生成端口和密钥
			//jlink_key=67890
			//jlink_port=12345
			var myDate = new Date();
			var js_rnd = myDate.getSeconds() + myDate.getMilliseconds();
			jlink_key=Math.floor(Math.random()*99999999 + js_rnd);
			jlink_port=Math.floor(10001 + Math.random()*(64000-10001) + js_rnd);
			//保存参数
			jlink_callfun=jcallfun;
			jlink_name=jname;
			
			//开启使用的iframe
			jlink_iframe = $("<iframe></iframe>");//document.createElement('iframe');
			jlink_iframe.hide();
			//jlink_iframe.src = "jmjlink://" + jname + "/" + jlink_port + "/" + jlink_key + "/" + jver + "/";
			//console.log("jlink start:"+jlink_iframe.src)
			jlink_iframe.attr("src","jmjlink://" + jname + "/" + jlink_port + "/" + jlink_key + "/" + jver + "/");
			//启动应用
			//document.body.appendChild(jlink_iframe);
			$("body").append(jlink_iframe);
			//开启定时器
			jlink_timer=setInterval(function(){
				$.time("发卡","定时器");
				//计数
				jlink_tick_time = jlink_tick_time + 1;
				if(jlink_login==1)
				{
					//已登录,检查是否断开
					if(jlink_tick_time-jlink_last_time > jlink_counter)
					{
						jlink_false_num++;
						send_flag = 0;//20160905
						if (jlink_false_num > 1)
						{
							//alert("无响应！");
							jlink_close();
						}
						else
						{
							jlink_last_time=jlink_tick_time;//20160903
							jlink_counter=jlink_heart_counter;//切换到心跳超时 20160905
							jlink_callfun(2,"linker close","操作超时，请重试！");  //20160824
							time_out_flag = 1;
						}
						return;
					}
					//定时心跳
					//if(jlink_tick_time-jlink_last_time > 10)
					if(jlink_heart_counter==jlink_counter && jlink_tick_time-jlink_last_time > 10)  //20160822 gqhua
					{
						jlink_send_ex(1,"heart");
						return;
					}
				}else{
					//联机心跳
					jlink_send_ex(1,"login");
				}
			},1000);
			
			return jret;
		},//发送应用数据
		send : function (jcallfun,jpre_str,jtext){
			if(initOver==0){
				if(check_ver_flag==3)  //版本不支持
				{
					//回调
					jcallfun(2,"ver error",jlink_ver_error);
					return -1;
				}
				if(check_ver_flag==4)  //版本不支持
				{
					//回调
					jcallfun(2,"error version",jlink_error_version);
					return -1;
				}
				if(jpre_str!="initReturn"){
					if(jlink_tick_time>10){
						if(check_ver_flag<2){
							jcallfun(2,"linker close",jlink_false_connect);
							return -1;
						}else{
							jcallfun(2,"linker close",jlink_init_fail);
							return -1;
						}
					}
					jcallfun(2,"init wait",jlink_init_wait);
					return -1;
				}
			}
			jlink_pre_str = jpre_str;
			jlink_callfun = jcallfun;
			
			//gqhua 20160822
			//$.print(arguments[3]);
			var Ms = arguments[3]?arguments[3]:2000; 
			if (Ms < 1000)
			{
				Ms = 2000;
			}
			jlink_direct_counter=Ms/1000;
			
			//alert(jtext);
			if(jlink_login==1){
				if(check_ver_flag==3)  //版本不支持
				{
					//回调
					jlink_callfun(2,"ver error",jlink_ver_error);
					return -1;
				}
				if(check_ver_flag==4)  //版本不支持
				{
					//回调
					jcallfun(2,"error version",jlink_error_version);
					return -1;
				}
				if(send_flag == 1){
					jlink_callfun(2,"linker send",jlink_send_error);  //20160822
					return -1;
				}
				send_flag = 1;
				//最后心跳时间
				jlink_last_time=jlink_tick_time;
				jlink_send_ex(2,jtext);
				return 0;
			}else{
				if(send_flag == 1){
					jlink_callfun(2,"linker send",jlink_send_error);  //20160822
					return -1;
				}
				if(first_send==1){
					send_flag = 1;
					first_send=0;
					window.setTimeout(function(){
						if(jlink_login==1){
							if(check_ver_flag==3)  //版本不支持
							{
								send_flag = 0;
								//回调
								jlink_callfun(2,"ver error",jlink_ver_error);
								return -1;
							}
							if(check_ver_flag==4)  //版本不支持
							{
								send_flag = 0;
								//回调
								jcallfun(2,"error version",jlink_error_version);
								return -1;
							}
							//最后心跳时间
							jlink_last_time=jlink_tick_time;
							jlink_send_ex(2,jtext);
							return 0;
						}else{
							send_flag = 0;
							if(check_ver_flag==3)  //版本不支持
							{
								//回调
								jlink_callfun(2,"ver error",jlink_ver_error);
								return -1;
							}
							else if(check_ver_flag==4){//版本不支持
								//回调
								jcallfun(2,"error version",jlink_error_version);
								return -1;
							}
							else{
								if(time_out_flag==1){
									time_out_flag=0;
								}else{
									jlink_callfun(2,"linker close",jlink_false_connect);
									return -1;
								}
							}
						}
					},1200);
				}else{
					if(time_out_flag==1){
						time_out_flag=0;
					}else{
						jlink_callfun(2,"linker close",jlink_false_connect);
						return -1;
					}
				}
			}
		},
		readCard:function(fn,param){//通用读卡
			var params = {
				"commandSet":[{
					"funName":"ReqCard", 
					"param":""
				}]
			};
			params = param || params;
			this.send(func,"寻卡",$.toJSON(params));
			
			function func(jtype,jtext,jpre_str){
				if(jtype==2){
					window.setTimeout(function(){//延迟优化显示效果
						$.alert(jpre_str);
						errorBeep();
						fn();
					},500);
				}else{
					var jt = $.parseJSON(jtext);
					if(jt.ErrCode=="0"){
						//cardValid(jt);
						ifUpdateCard(jt);
					}else{
						window.setTimeout(function(){//延迟优化显示效果
							$.alert("寻卡错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
							errorBeep();
							fn();
						},500);
					}
				}
				
				/**
				 * 卡片升级验证
				 */
				function ifUpdateCard(jt){
					//卡片升级验证
					var ifCardUpdate = "account/ifCardUpdate.do";
					var param = {};
					param['card_number'] = jt.retData.CardNo;
					param['media_id'] = jt.retData.CardType;
					$.postEx(ifCardUpdate,param,function(retJson){
						if(retJson.result){//卡片处于升级中
							provideCard(retJson.data[0],jt);
						}else{//后续流程
							cardValid(jt);
						}
					});
				}
				
				//升级指令
				function provideCard(data,jt2){
					var params = {
						"commandSet":[{
							//"funName":data.funName,
							"funName":"IonUpgradeUserCard",
							"param": {
								"Name" : data.Name,
								"Pwd" : data.Pwd,
								"PwdValid" : data.PwdValid
//								"LogicCardNo" : data.LogicCardNo,
//								"IssuDate" : data.IssuDate,
//								"BeginDate" : data.BeginDate,
//								"EndDate" : data.EndDate
							}
						}]	
					};
					uiObj.send(function(jtype,jtext,jpre_str){
						if(jtype==2){
							window.setTimeout(function(){//延迟优化显示效果
								$.alert(jpre_str);
								errorBeep();
								fn();
							},500);
						}else{
							var jt = $.parseJSON(jtext);
							if(jt.ErrCode=="0"){
								//发卡后续（包含升级过程）
								var param = {};
								var cardProvideAfter = "account/cardProvideAfter.do";//发卡后续部分
								param['account_id'] = data.account_id;
								param['card_serial'] = data.LogicCardNo;
								param['old_card_serial'] = "0";
								$.postEx(cardProvideAfter,param,function(retJson){
									if(retJson.result){//升级成功
										cardValid(jt2);
									}else{
										window.setTimeout(function(){//延迟优化显示效果
											$.alert(retJson.info);
											errorBeep();
											fn();
										},500);
									}
								});
							}else{
								window.setTimeout(function(){//延迟优化显示效果
									$.alert("升级卡片错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
									errorBeep();
									fn();
								},500);
								
							}
						}
					},'升级卡片',$.toJSON(params),"5000");
				}
				
				
				/**
				 * 清除卡片黑名单标志
				 */
				
				//卡片有效性验证
				function cardValid(jt){
					//$.print("卡验证");
					var validCard = "account/validCard.do";//卡片有效性验证
					var param = {};
					param['account_id'] = '';
					param['card_number'] = jt.retData.CardNo;
					param['media_id'] = jt.retData.CardType;
					$.postEx(validCard,param,function(retJson){
						if(retJson.result){
							if(retJson.data[0].is_main_card==1){//主卡
								readIssu(jt,retJson.data[0].card_serial);
							}else if(retJson.data[0].is_main_card==0){//附卡
								//info_div.html("附卡不能清除卡片黑名单标志！");
								fn(jt);
							}
						}else{
							window.setTimeout(function(){//延迟优化显示效果
								$.alert(retJson.info);
								errorBeep();
								fn();
							},500);
						}
					});
				}
				
				//读卡发行信息
				function readIssu(jt2,card_serial){
					//$.print("发行");
					var params = {
						"commandSet":[{
							"funName":"IonReadIssuInfo", 
							"param":""
						}]
					};
					uiObj.send(function(jtype,jtext,jpre_str){
						if(jtype==2){
							window.setTimeout(function(){//延迟优化显示效果
								$.alert(jpre_str);
								errorBeep();
								fn();
							},500);
						}else{
							var jt = $.parseJSON(jtext);
							if(jt.ErrCode=="0"){
								if(jt.retData.LogicCardNo==card_serial){//逻辑卡号验证
									if(jt.retData.CardStat=="0"){
										/**
										 * 卡片同步
										 */
										//读卡公共信息
										readPub(jt2,card_serial);
									}else{//有黑名单标志
										clear(jt2,card_serial);
									}
								}else{
									window.setTimeout(function(){//延迟优化显示效果
										$.alert("卡片不一致，请确认卡片是否正确");
										//$.alert("逻辑卡号不一致！");
										errorBeep();
										fn();
									},500);
								}
							}else{
								window.setTimeout(function(){//延迟优化显示效果
									$.alert("读发行信息错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
									errorBeep();
									fn();
								},500);
							}
						}
					},'读发行信息',$.toJSON(params));
				}
				
				//清除卡片黑名单指令
				function clear(jt2,card_serial){
					var params = {
						"commandSet":[{
							"funName":"IonSetCardStat", 
							"param": "0"
						}]	
					};
					uiObj.send(function(jtype,jtext,jpre_str){
						if(jtype==2){
							window.setTimeout(function(){//延迟优化显示效果
								$.alert(jpre_str);
								errorBeep();
								fn();
							},500);
						}else{
							var jt = $.parseJSON(jtext);
							if(jt.ErrCode=="0"){
								/**
								 * 卡片同步
								 */
								//读卡公共信息
								readPub(jt2,card_serial);
							}else{
								window.setTimeout(function(){//延迟优化显示效果
									$.alert("清除卡片黑名单错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
									errorBeep();
									fn();
								},500);
							}
						}
					},'清除卡片黑名单',$.toJSON(params));
				}
				
				//读卡公共信息
				function readPub(jt2,card_serial){
					//$.print("公共");
					var params = {
						"commandSet":[{
							"funName":"IonReadPubInfo", 
							"param":""
						}]
					};
					uiObj.send(function(jtype,jtext,jpre_str){
						if(jtype==2){
							window.setTimeout(function(){//延迟优化显示效果
								$.alert(jpre_str);
								errorBeep();
								fn();
							},500);
						}else{
							var jt = $.parseJSON(jtext);
							if(jt.ErrCode=="0"){
								readRec(jt2,card_serial,jt);
							}else{
								window.setTimeout(function(){//延迟优化显示效果
									$.alert("读公共信息错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
									errorBeep();
									fn();
								},500);
							}
						}
					},'读公共信息',$.toJSON(params));
				}
				
				//读卡片离线记录
				function readRec(jt2,card_serial,jt3){
					//$.print("读离线");
					var params = {
						"commandSet":[{
							"funName":"IonReadRec", 
							"param":""
						}]
					};
					uiObj.send(function(jtype,jtext,jpre_str){
						if(jtype==2){
							window.setTimeout(function(){//延迟优化显示效果
								$.alert(jpre_str);
								errorBeep();
								fn();
							},500);
						}else{
							var jt = $.parseJSON(jtext);
							if(jt.ErrCode=="0"){
								if(jt.retData.RecInfo==""){//无离线记录
									//readPub(jt2,card_serial);//读公共信息
									//info_div.html("正在同步卡片信息...");
									sync(jt2,card_serial,jt3);//同步
								}else{
									if(jt3.retData.CardStat=="0"){//不是黑名单卡
										var upLoadCard = "account/upLoadCard.do";//上传卡片离线记录
										var param = {};
										param['jdevid'] = "0";
										param['jdev_bh'] = "0";
										param['jcmdline'] = jt.retData.RecInfo;
										$.postEx(upLoadCard,param,function(retJson){
											if(retJson.result){
												ClearRec(jt2,card_serial,jt3);//清除离线记录
											}else{
												window.setTimeout(function(){//延迟优化显示效果
													$.alert(retJson.info);
													errorBeep();
													fn();
												},500);
											}
										});
									}else{//黑名单卡不能清除离线记录
										window.setTimeout(function(){//延迟优化显示效果
											$.alert("黑名单卡不能清除离线记录！");
											errorBeep();
											fn();
										},500);
									}
								}
							}else{
								window.setTimeout(function(){//延迟优化显示效果
									$.alert("读卡片离线记录错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
									errorBeep();
									fn();
								},500);
							}
						}
					},'读卡片离线记录',$.toJSON(params),"5000");
				}
				
				//清除离线记录
				function ClearRec(jt2,card_serial,jt3){
					var params = {
						"commandSet":[{
							"funName":"IonClearRec", 
							"param":""
						}]
					};
					uiObj.send(function(jtype,jtext,jpre_str){
						if(jtype==2){
							window.setTimeout(function(){//延迟优化显示效果
								$.alert(jpre_str);
								errorBeep();
								fn();
							},500);
						}else{
							var jt = $.parseJSON(jtext);
							if(jt.ErrCode=="0"){
								//info_div.html("正在同步卡片信息...");
								sync(jt2,card_serial,jt3);//同步
							}else{
								window.setTimeout(function(){//延迟优化显示效果
									$.alert("清除卡片离线记录错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
									errorBeep();
									fn();
								},500);
							}
						}
					},'清除卡片离线记录',$.toJSON(params));
				}
				
				//同步
				function sync(jt2,card_serial,jt3){
					//$.print("同步");
					var syncCard = "account/syncCard.do";//卡片同步
					var param = {};
					param['card_number'] = jt2.retData.CardNo;
					param['media_id'] = jt2.retData.CardType;
					param['card_serial'] = card_serial;
					param['card_trad_serial'] = jt3.retData.CardTradSerial;
					param['device_id'] = "0";
					$.postEx(syncCard,param,function(retJson){
						if(retJson.result && retJson.data.length>0){
							//$.print(retJson);
							SyncFn(jt2,card_serial,jt3,retJson);
						}else{
							$.alert(retJson.info);
							errorBeep();
							fn();
						}
					});
				}
				
				function SyncFn(jt2,card_serial,jt3,retJson){
					var params = {
						"commandSet":[{
							"funName":"IonSyncWallet", 
							"param":{
								"LogicCardNo":card_serial,
								"CardTradSerial":jt3.retData.CardTradSerial,
								"OldBalance":"0",
								"NewBalance":retJson.data[0].cash_amt
							}
						},{
							"funName":"IonSyncSub",
							"param":retJson.data[0].sub_info
						},{
							"funName":"IonSyncSum",
							"param":retJson.data[0].sum_info
						}]
					};
					uiObj.send(function(jtype,jtext,jpre_str){
						if(jtype==2){
							$.alert(jpre_str);
							errorBeep();
							fn();
						}else{
							var jt = $.parseJSON(jtext);
							if(jt.ErrCode=="0"){
								fn(jt2);
							}else{
								$.alert("卡片同步错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
								errorBeep();
								fn();
							}
						}
					},'卡片同步',$.toJSON(params));
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
					uiObj.send(function(jtype,jtext,jpre_str){
						
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
					uiObj.send(function(jtype,jtext,jpre_str){

					},'错误提示音',$.toJSON(params));
				}
			}
		},
		rechargeCard:function(fn,param){//充值读卡
			var params = {
					"commandSet":[{
						"funName":"ReqCard", 
						"param":""
					}]
				};
				params = param || params;
				this.send(func,"寻卡",$.toJSON(params));
				
				function func(jtype,jtext,jpre_str){
					if(jtype==2){
						window.setTimeout(function(){//延迟优化显示效果
							$.alert(jpre_str);
							errorBeep();
							fn();
						},500);
					}else{
						var jt = $.parseJSON(jtext);
						if(jt.ErrCode=="0"){
							//cardValid(jt);
							ifUpdateCard(jt);
						}else{
							window.setTimeout(function(){//延迟优化显示效果
								$.alert("寻卡错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
								errorBeep();
								fn();
							},500);
						}
					}
					
					/**
					 * 卡片升级验证
					 */
					function ifUpdateCard(jt){
						//卡片升级验证
						var ifCardUpdate = "account/ifCardUpdate.do";
						var param = {};
						param['card_number'] = jt.retData.CardNo;
						param['media_id'] = jt.retData.CardType;
						$.postEx(ifCardUpdate,param,function(retJson){
							if(retJson.result){//卡片处于升级中
								provideCard(retJson.data[0],jt);
							}else{//后续流程
								cardValid(jt);
							}
						});
					}
					
					//升级指令
					function provideCard(data,jt2){
						var params = {
							"commandSet":[{
								//"funName":data.funName,
								"funName":"IonUpgradeUserCard",
								"param": {
									"Name" : data.Name,
									"Pwd" : data.Pwd,
									"PwdValid" : data.PwdValid
//									"LogicCardNo" : data.LogicCardNo,
//									"IssuDate" : data.IssuDate,
//									"BeginDate" : data.BeginDate,
//									"EndDate" : data.EndDate
								}
							}]	
						};
						uiObj.send(function(jtype,jtext,jpre_str){
							if(jtype==2){
								window.setTimeout(function(){//延迟优化显示效果
									$.alert(jpre_str);
									errorBeep();
									fn();
								},500);
							}else{
								var jt = $.parseJSON(jtext);
								if(jt.ErrCode=="0"){
									//发卡后续（包含升级过程）
									var param = {};
									var cardProvideAfter = "account/cardProvideAfter.do";//发卡后续部分
									param['account_id'] = data.account_id;
									param['card_serial'] = data.LogicCardNo;
									param['old_card_serial'] = "0";
									$.postEx(cardProvideAfter,param,function(retJson){
										if(retJson.result){//升级成功
											cardValid(jt2);
										}else{
											window.setTimeout(function(){//延迟优化显示效果
												$.alert(retJson.info);
												errorBeep();
												fn();
											},500);
										}
									});
								}else{
									window.setTimeout(function(){//延迟优化显示效果
										$.alert("升级卡片错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
										errorBeep();
										fn();
									},500);
									
								}
							}
						},'升级卡片',$.toJSON(params),"5000");
					}
					
					
					/**
					 * 清除卡片黑名单标志
					 */
					
					//卡片有效性验证
					function cardValid(jt){
						//$.print("卡验证");
						var validCard = "account/validCard.do";//卡片有效性验证
						var param = {};
						param['account_id'] = '';
						param['card_number'] = jt.retData.CardNo;
						param['media_id'] = jt.retData.CardType;
						$.postEx(validCard,param,function(retJson){
							if(retJson.result){
								if(retJson.data[0].is_main_card==1){//主卡
									readIssu(jt,retJson.data[0].card_serial);
								}else if(retJson.data[0].is_main_card==0){//附卡
									//info_div.html("附卡不能清除卡片黑名单标志！");
									fn(jt);
								}
							}else{
								window.setTimeout(function(){//延迟优化显示效果
									$.alert(retJson.info);
									errorBeep();
									fn();
								},500);
							}
						});
					}
					
					//读卡发行信息
					function readIssu(jt2,card_serial){
						//$.print("发行");
						var params = {
							"commandSet":[{
								"funName":"IonReadIssuInfo", 
								"param":""
							}]
						};
						uiObj.send(function(jtype,jtext,jpre_str){
							if(jtype==2){
								window.setTimeout(function(){//延迟优化显示效果
									$.alert(jpre_str);
									errorBeep();
									fn();
								},500);
							}else{
								var jt = $.parseJSON(jtext);
								if(jt.ErrCode=="0"){
									if(jt.retData.LogicCardNo==card_serial){//逻辑卡号验证
										if(jt.retData.CardStat=="0"){
											/**
											 * 卡片同步
											 */
											//读卡公共信息
											readPub(jt2,card_serial);
										}else{//有黑名单标志
											clear(jt2,card_serial);
										}
									}else{
										window.setTimeout(function(){//延迟优化显示效果
											$.alert("卡片不一致，请确认卡片是否正确");
											//$.alert("逻辑卡号不一致！");
											errorBeep();
											fn();
										},500);
									}
								}else{
									window.setTimeout(function(){//延迟优化显示效果
										$.alert("读发行信息错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
										errorBeep();
										fn();
									},500);
								}
							}
						},'读发行信息',$.toJSON(params));
					}
					
					//清除卡片黑名单指令
					function clear(jt2,card_serial){
						var params = {
							"commandSet":[{
								"funName":"IonSetCardStat", 
								"param": "0"
							}]	
						};
						uiObj.send(function(jtype,jtext,jpre_str){
							if(jtype==2){
								window.setTimeout(function(){//延迟优化显示效果
									$.alert(jpre_str);
									errorBeep();
									fn();
								},500);
							}else{
								var jt = $.parseJSON(jtext);
								if(jt.ErrCode=="0"){
									/**
									 * 卡片同步
									 */
									//读卡公共信息
									readPub(jt2,card_serial);
								}else{
									window.setTimeout(function(){//延迟优化显示效果
										$.alert("清除卡片黑名单错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
										errorBeep();
										fn();
									},500);
								}
							}
						},'清除卡片黑名单',$.toJSON(params));
					}
					
					//读卡公共信息
					function readPub(jt2,card_serial){
						//$.print("公共");
						var params = {
							"commandSet":[{
								"funName":"IonReadPubInfo", 
								"param":""
							}]
						};
						uiObj.send(function(jtype,jtext,jpre_str){
							if(jtype==2){
								window.setTimeout(function(){//延迟优化显示效果
									$.alert(jpre_str);
									errorBeep();
									fn();
								},500);
							}else{
								var jt = $.parseJSON(jtext);
								if(jt.ErrCode=="0"){
									readRec(jt2,card_serial,jt);
								}else{
									window.setTimeout(function(){//延迟优化显示效果
										$.alert("读公共信息错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
										errorBeep();
										fn();
									},500);
								}
							}
						},'读公共信息',$.toJSON(params));
					}
					
					//读卡片离线记录
					function readRec(jt2,card_serial,jt3){
						//$.print("读离线");
						var params = {
							"commandSet":[{
								"funName":"IonReadRec", 
								"param":""
							}]
						};
						uiObj.send(function(jtype,jtext,jpre_str){
							if(jtype==2){
								window.setTimeout(function(){//延迟优化显示效果
									$.alert(jpre_str);
									errorBeep();
									fn();
								},500);
							}else{
								var jt = $.parseJSON(jtext);
								if(jt.ErrCode=="0"){
									if(jt.retData.RecInfo==""){//无离线记录
										//readPub(jt2,card_serial);//读公共信息
										//info_div.html("正在同步卡片信息...");
										// add by LYh 20170608
										//sync(jt2,card_serial,jt3);//同步
										fn(jt2);
									}else{
										if(jt3.retData.CardStat=="0"){//不是黑名单卡
											var upLoadCard = "account/upLoadCard.do";//上传卡片离线记录
											var param = {};
											param['jdevid'] = "0";
											param['jdev_bh'] = "0";
											param['jcmdline'] = jt.retData.RecInfo;
											$.postEx(upLoadCard,param,function(retJson){
												if(retJson.result){
													ClearRec(jt2,card_serial,jt3);//清除离线记录
												}else{
													window.setTimeout(function(){//延迟优化显示效果
														$.alert(retJson.info);
														errorBeep();
														fn();
													},500);
												}
											});
										}else{//黑名单卡不能清除离线记录
											window.setTimeout(function(){//延迟优化显示效果
												$.alert("黑名单卡不能清除离线记录！");
												errorBeep();
												fn();
											},500);
										}
									}
								}else{
									window.setTimeout(function(){//延迟优化显示效果
										$.alert("读卡片离线记录错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
										errorBeep();
										fn();
									},500);
								}
							}
						},'读卡片离线记录',$.toJSON(params),"5000");
					}
					
					//清除离线记录
					function ClearRec(jt2,card_serial,jt3){
						var params = {
							"commandSet":[{
								"funName":"IonClearRec", 
								"param":""
							}]
						};
						uiObj.send(function(jtype,jtext,jpre_str){
							if(jtype==2){
								window.setTimeout(function(){//延迟优化显示效果
									$.alert(jpre_str);
									errorBeep();
									fn();
								},500);
							}else{
								var jt = $.parseJSON(jtext);
								if(jt.ErrCode=="0"){
									//info_div.html("正在同步卡片信息...");
									// add by LYh 20170608 清除离线记录时不同步
									//sync(jt2,card_serial,jt3);//同步
									fn(jt2);
								}else{
									window.setTimeout(function(){//延迟优化显示效果
										$.alert("清除卡片离线记录错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
										errorBeep();
										fn();
									},500);
								}
							}
						},'清除卡片离线记录',$.toJSON(params));
					}
					
					//同步
					function sync(jt2,card_serial,jt3){
						//$.print("同步");
						var syncCard = "account/syncCard.do";//卡片同步
						var param = {};
						param['card_number'] = jt2.retData.CardNo;
						param['media_id'] = jt2.retData.CardType;
						param['card_serial'] = card_serial;
						param['card_trad_serial'] = jt3.retData.CardTradSerial;
						param['device_id'] = "0";
						$.postEx(syncCard,param,function(retJson){
							if(retJson.result && retJson.data.length>0){
								//$.print(retJson);
								SyncFn(jt2,card_serial,jt3,retJson);
							}else{
								$.alert(retJson.info);
								errorBeep();
								fn();
							}
						});
					}
					
					function SyncFn(jt2,card_serial,jt3,retJson){
						var params = {
							"commandSet":[{
								"funName":"IonSyncWallet", 
								"param":{
									"LogicCardNo":card_serial,
									"CardTradSerial":jt3.retData.CardTradSerial,
									"OldBalance":"0",
									"NewBalance":retJson.data[0].cash_amt
								}
							},{
								"funName":"IonSyncSub",
								"param":retJson.data[0].sub_info
							},{
								"funName":"IonSyncSum",
								"param":retJson.data[0].sum_info
							}]
						};
						uiObj.send(function(jtype,jtext,jpre_str){
							if(jtype==2){
								$.alert(jpre_str);
								errorBeep();
								fn();
							}else{
								var jt = $.parseJSON(jtext);
								if(jt.ErrCode=="0"){
									fn(jt2);
								}else{
									$.alert("卡片同步错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
									errorBeep();
									fn();
								}
							}
						},'卡片同步',$.toJSON(params));
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
						uiObj.send(function(jtype,jtext,jpre_str){
							
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
						uiObj.send(function(jtype,jtext,jpre_str){

						},'错误提示音',$.toJSON(params));
					}
				}
			},
			cardManageReadCard:function(fn,param){
			var params = {
				"commandSet":[{
					"funName":"ReqCard", 
					"param":""
				}]
			};
			params = param || params;
			this.send(func,"寻卡",$.toJSON(params));
			
			function func(jtype,jtext,jpre_str){
				if(jtype==2){
					window.setTimeout(function(){//延迟优化显示效果
						$.alert(jpre_str);
						errorBeep();
						fn();
					},500);
				}else{
					var jt = $.parseJSON(jtext);
					if(jt.ErrCode=="0"){
						//cardValid(jt);
						ifUpdateCard(jt);
					}else{
						window.setTimeout(function(){//延迟优化显示效果
							$.alert("寻卡错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
							errorBeep();
							fn();
						},500);
					}
				}
				
				/**
				 * 卡片升级验证
				 */
				function ifUpdateCard(jt){
					//卡片升级验证
					var ifCardUpdate = "account/ifCardUpdate.do";
					var param = {};
					param['card_number'] = jt.retData.CardNo;
					param['media_id'] = jt.retData.CardType;
					$.postEx(ifCardUpdate,param,function(retJson){
						if(retJson.result){//卡片处于升级中
							provideCard(retJson.data[0],jt);
						}else{//后续流程
							cardValid(jt);
						}
					});
				}
				
				//发卡指令
				function provideCard(data,jt2){
					var params = {
						"commandSet":[{
							//"funName":data.funName, 
							"funName":"IonUpgradeUserCard",
							"param": {
								"Name" : data.Name,
								"Pwd" : data.Pwd,
								"PwdValid" : data.PwdValid
//								"LogicCardNo" : data.LogicCardNo,
//								"IssuDate" : data.IssuDate,
//								"BeginDate" : data.BeginDate,
//								"EndDate" : data.EndDate
							}
						}]	
					};
					uiObj.send(function(jtype,jtext,jpre_str){
						if(jtype==2){
							window.setTimeout(function(){//延迟优化显示效果
								$.alert(jpre_str);
								errorBeep();
								fn();
							},500);
						}else{
							var jt = $.parseJSON(jtext);
							if(jt.ErrCode=="0"){
								//发卡后续（包含升级过程）
								var param = {};
								var cardProvideAfter = "account/cardProvideAfter.do";//发卡后续部分
								param['account_id'] = data.account_id;
								param['card_serial'] = data.LogicCardNo;
								param['old_card_serial'] = "0";
								$.postEx(cardProvideAfter,param,function(retJson){
									if(retJson.result){//升级成功
										cardValid(jt2);
									}else{
										window.setTimeout(function(){//延迟优化显示效果
											$.alert(retJson.info);
											errorBeep();
											fn();
										},500);
									}
								});
							}else{
								window.setTimeout(function(){//延迟优化显示效果
									$.alert("升级卡片错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
									errorBeep();
									fn();
								},500);
							}
						}
					},'升级卡片',$.toJSON(params),"5000");
				}
				
				/**
				 * 清除卡片黑名单标志
				 */
				
				//卡片有效性验证
				function cardValid(jt){
					var validCard = "account/validCard.do";//卡片有效性验证
					var param = {};
					param['account_id'] = '';
					param['card_number'] = jt.retData.CardNo;
					param['media_id'] = jt.retData.CardType;
					$.postEx(validCard,param,function(retJson){
						if(retJson.result){
							if(retJson.data[0].is_main_card==1){//主卡
								readIssu(jt,retJson.data[0].card_serial);
							}else if(retJson.data[0].is_main_card==0){//附卡
								//info_div.html("附卡不能清除卡片黑名单标志！");
								fn(jt);
							}
						}else{
							//卡片管理页面验证出错后不进行处理，继续让用户读卡
							fn(jt);
						}
					});
				}
				
				//读卡发行信息
				function readIssu(jt2,card_serial){
					//$.print("发行");
					var params = {
						"commandSet":[{
							"funName":"IonReadIssuInfo", 
							"param":""
						}]
					};
					uiObj.send(function(jtype,jtext,jpre_str){
						if(jtype==2){
							window.setTimeout(function(){//延迟优化显示效果
								$.alert(jpre_str);
								//errorBeep();
								//fn();
								fn(jt2);//提示错误后直接读卡
							},500);
						}else{
							var jt = $.parseJSON(jtext);
							if(jt.ErrCode=="0"){
								if(jt.retData.LogicCardNo==card_serial){//逻辑卡号验证
									if(jt.retData.CardStat=="0"){
										/**
										 * 卡片同步
										 */
										//读卡公共信息
										readPub(jt2,card_serial);
									}else{//有黑名单标志
										clear(jt2,card_serial);
									}
								}else{
									window.setTimeout(function(){//延迟优化显示效果
										$.alert("卡片不一致，请确认卡片是否正确");
										//$.alert("逻辑卡号不一致！");
										errorBeep();
										fn();
									},500);
								}
							}else{
								window.setTimeout(function(){//延迟优化显示效果
									$.alert("读发行信息错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
									//errorBeep();
									//fn();
									fn(jt2);//提示错误后直接读卡
								},500);
							}
						}
					},'读发行信息',$.toJSON(params));
				}
				
				//清除卡片黑名单指令
				function clear(jt2,card_serial){
					var params = {
						"commandSet":[{
							"funName":"IonSetCardStat", 
							"param": "0"
						}]	
					};
					uiObj.send(function(jtype,jtext,jpre_str){
						if(jtype==2){
							window.setTimeout(function(){//延迟优化显示效果
								$.alert(jpre_str);
								//errorBeep();
								//fn();
								fn(jt2);//提示错误后直接读卡
							},500);
						}else{
							var jt = $.parseJSON(jtext);
							if(jt.ErrCode=="0"){
								/**
								 * 卡片同步
								 */
								//读卡公共信息
								readPub(jt2,card_serial);
							}else{
								window.setTimeout(function(){//延迟优化显示效果
									$.alert("清除卡片黑名单错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
									//errorBeep();
									//fn();
									fn(jt2);//提示错误后直接读卡
								},500);
							}
						}
					},'清除卡片黑名单',$.toJSON(params));
				}
				
				//读卡公共信息
				function readPub(jt2,card_serial){
					//$.print("公共");
					var params = {
						"commandSet":[{
							"funName":"IonReadPubInfo", 
							"param":""
						}]
					};
					uiObj.send(function(jtype,jtext,jpre_str){
						if(jtype==2){
							window.setTimeout(function(){//延迟优化显示效果
								$.alert(jpre_str);
								//errorBeep();
								//fn();
								fn(jt2);//提示错误后直接读卡
							},500);
						}else{
							var jt = $.parseJSON(jtext);
							if(jt.ErrCode=="0"){
								readRec(jt2,card_serial,jt);
							}else{
								window.setTimeout(function(){//延迟优化显示效果
									$.alert("读公共信息错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
									//errorBeep();
									//fn();
									fn(jt2);//提示错误后直接读卡
								},500);
							}
						}
					},'读公共信息',$.toJSON(params));
				}
				
				//读卡片离线记录
				function readRec(jt2,card_serial,jt3){
					//$.print("读离线");
					var params = {
						"commandSet":[{
							"funName":"IonReadRec", 
							"param":""
						}]
					};
					uiObj.send(function(jtype,jtext,jpre_str){
						if(jtype==2){
							window.setTimeout(function(){//延迟优化显示效果
								$.alert(jpre_str);
								//errorBeep();
								//fn();
								fn(jt2);//提示错误后直接读卡
							},500);
						}else{
							var jt = $.parseJSON(jtext);
							if(jt.ErrCode=="0"){
								if(jt.retData.RecInfo==""){//无离线记录
									//readPub(jt2,card_serial);//读公共信息
									//info_div.html("正在同步卡片信息...");
									sync(jt2,card_serial,jt3);//同步
								}else{
									if(jt3.retData.CardStat=="0"){//不是黑名单卡
										var upLoadCard = "account/upLoadCard.do";//上传卡片离线记录
										var param = {};
										param['jdevid'] = "0";
										param['jdev_bh'] = "0";
										param['jcmdline'] = jt.retData.RecInfo;
										$.postEx(upLoadCard,param,function(retJson){
											if(retJson.result){
												ClearRec(jt2,card_serial,jt3);//清除离线记录
											}else{
												window.setTimeout(function(){//延迟优化显示效果
													$.alert(retJson.info);
													//errorBeep();
													//fn();
													fn(jt2);//提示错误后直接读卡
												},500);
											}
										});
									}else{//黑名单卡不能清除离线记录
										window.setTimeout(function(){//延迟优化显示效果
											$.alert("黑名单卡不能清除离线记录！");
											//errorBeep();
											//fn();
											fn(jt2);//提示错误后直接读卡
										},500);
									}
								}
							}else{
								window.setTimeout(function(){//延迟优化显示效果
									$.alert("读卡片离线记录错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
									//errorBeep();
									//fn();
									fn(jt2);//提示错误后直接读卡
								},500);
							}
						}
					},'读卡片离线记录',$.toJSON(params),"5000");
				}
				
				//清除离线记录
				function ClearRec(jt2,card_serial,jt3){
					var params = {
						"commandSet":[{
							"funName":"IonClearRec", 
							"param":""
						}]
					};
					uiObj.send(function(jtype,jtext,jpre_str){
						if(jtype==2){
							window.setTimeout(function(){//延迟优化显示效果
								$.alert(jpre_str);
								//errorBeep();
								//fn();
								fn(jt2);//提示错误后直接读卡
							},500);
						}else{
							var jt = $.parseJSON(jtext);
							if(jt.ErrCode=="0"){
								//info_div.html("正在同步卡片信息...");
								sync(jt2,card_serial,jt3);//同步
							}else{
								window.setTimeout(function(){//延迟优化显示效果
									$.alert("清除卡片离线记录错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
									//errorBeep();
									//fn();
									fn(jt2);//提示错误后直接读卡
								},500);
							}
						}
					},'清除卡片离线记录',$.toJSON(params));
				}
				
				//同步
				function sync(jt2,card_serial,jt3){
					//$.print("同步");
					var syncCard = "account/syncCard.do";//卡片同步
					var param = {};
					param['card_number'] = jt2.retData.CardNo;
					param['media_id'] = jt2.retData.CardType;
					param['card_serial'] = card_serial;
					param['card_trad_serial'] = jt3.retData.CardTradSerial;
					param['device_id'] = "0";
					$.postEx(syncCard,param,function(retJson){
						if(retJson.result && retJson.data.length>0){
							//$.print(retJson);
							SyncFn(jt2,card_serial,jt3,retJson);
						}else{
							$.alert(retJson.info);
							//errorBeep();
							//fn();
							fn(jt2);//提示错误后直接读卡
						}
					});
				}
				
				function SyncFn(jt2,card_serial,jt3,retJson){
					var params = {
						"commandSet":[{
							"funName":"IonSyncWallet", 
							"param":{
								"LogicCardNo":card_serial,
								"CardTradSerial":jt3.retData.CardTradSerial,
								"OldBalance":"0",
								"NewBalance":retJson.data[0].cash_amt
							}
						},{
							"funName":"IonSyncSub",
							"param":retJson.data[0].sub_info
						},{
							"funName":"IonSyncSum",
							"param":retJson.data[0].sum_info
						}]
					};
					uiObj.send(function(jtype,jtext,jpre_str){
						if(jtype==2){
							$.alert(jpre_str);
							//errorBeep();
							//fn();
							fn(jt2);//提示错误后直接读卡
						}else{
							var jt = $.parseJSON(jtext);
							if(jt.ErrCode=="0"){
								fn(jt2);
							}else{
								$.alert("卡片同步错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
								//errorBeep();
								//fn();
								fn(jt2);//提示错误后直接读卡
							}
						}
					},'卡片同步',$.toJSON(params));
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
					uiObj.send(function(jtype,jtext,jpre_str){
						
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
					uiObj.send(function(jtype,jtext,jpre_str){

					},'错误提示音',$.toJSON(params));
				}
			}
		},
		accountManageReadCard:function(fn,param){//账户管理读卡
			var params = {
				"commandSet":[{
					"funName":"ReqCard", 
					"param":""
				}]
			};
			params = param || params;
			this.send(func,"寻卡",$.toJSON(params));
			
			function func(jtype,jtext,jpre_str){
				if(jtype==2){
					window.setTimeout(function(){//延迟优化显示效果
						$.alert(jpre_str);
						errorBeep();
						fn();
					},500);
				}else{
					var jt = $.parseJSON(jtext);
					if(jt.ErrCode=="0"){
						//cardValid(jt);
						ifUpdateCard(jt);
					}else{
						window.setTimeout(function(){//延迟优化显示效果
							$.alert("寻卡错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
							errorBeep();
							fn();
						},500);
					}
				}
				
				/**
				 * 卡片升级验证
				 */
				function ifUpdateCard(jt){
					//卡片升级验证
					var ifCardUpdate = "account/ifCardUpdate.do";
					var param = {};
					param['card_number'] = jt.retData.CardNo;
					param['media_id'] = jt.retData.CardType;
					$.postEx(ifCardUpdate,param,function(retJson){
						if(retJson.result){//卡片处于升级中
							provideCard(retJson.data[0],jt);
						}else{//后续流程
							cardValid(jt);
						}
					});
				}
				
				//发卡指令
				function provideCard(data,jt2){
					var params = {
						"commandSet":[{
							//"funName":data.funName,
							"funName":"IonUpgradeUserCard",
							"param": {
								"Name" : data.Name,
								"Pwd" : data.Pwd,
								"PwdValid" : data.PwdValid
//								"LogicCardNo" : data.LogicCardNo,
//								"IssuDate" : data.IssuDate,
//								"BeginDate" : data.BeginDate,
//								"EndDate" : data.EndDate
							}
						}]	
					};
					uiObj.send(function(jtype,jtext,jpre_str){
						if(jtype==2){
							window.setTimeout(function(){//延迟优化显示效果
								$.alert(jpre_str);
								errorBeep();
								fn();
							},500);
						}else{
							var jt = $.parseJSON(jtext);
							if(jt.ErrCode=="0"){
								//发卡后续（包含升级过程）
								var param = {};
								var cardProvideAfter = "account/cardProvideAfter.do";//发卡后续部分
								param['account_id'] = data.account_id;
								param['card_serial'] = data.LogicCardNo;
								param['old_card_serial'] = "0";
								$.postEx(cardProvideAfter,param,function(retJson){
									if(retJson.result){//升级成功
										cardValid(jt2);
									}else{
										window.setTimeout(function(){//延迟优化显示效果
											$.alert(retJson.info);
											errorBeep();
											fn();
										},500);
									}
								});
							}else{
								window.setTimeout(function(){//延迟优化显示效果
									$.alert("升级卡片错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
									errorBeep();
									fn();
								},500);
								
							}
						}
					},'升级卡片',$.toJSON(params),"5000");
				}
				
				
				/**
				 * 清除卡片黑名单标志
				 */
				
				//卡片有效性验证
				function cardValid(jt){
					//$.print("卡验证");
					var validCard = "account/validCard.do";//卡片有效性验证
					var param = {};
					param['account_id'] = '';
					param['card_number'] = jt.retData.CardNo;
					param['media_id'] = jt.retData.CardType;
					$.postEx(validCard,param,function(retJson){
						if(retJson.result){
							if(retJson.data[0].is_main_card==1){//主卡
								readIssu(jt,retJson.data[0].card_serial);
							}else if(retJson.data[0].is_main_card==0){//附卡
								//info_div.html("附卡不能清除卡片黑名单标志！");
								fn(jt);
							}
						}else{
							window.setTimeout(function(){//延迟优化显示效果
								$.alert(retJson.info);
								errorBeep();
								fn();
							},500);
						}
					});
				}
				
				//读卡发行信息
				function readIssu(jt2,card_serial){
					//$.print("发行");
					var params = {
						"commandSet":[{
							"funName":"IonReadIssuInfo", 
							"param":""
						}]
					};
					uiObj.send(function(jtype,jtext,jpre_str){
						if(jtype==2){
							window.setTimeout(function(){//延迟优化显示效果
								$.alert(jpre_str);
								errorBeep();
								fn();
							},500);
						}else{
							var jt = $.parseJSON(jtext);
							if(jt.ErrCode=="0"){
								if(jt.retData.LogicCardNo==card_serial){//逻辑卡号验证
									if(jt.retData.CardStat=="0"){
										/**
										 * 卡片同步
										 */
										//读卡公共信息
										readPub(jt2,card_serial);
									}else{//有黑名单标志
										clear(jt2,card_serial);
									}
								}else{
									window.setTimeout(function(){//延迟优化显示效果
										$.alert("卡片不一致，请确认卡片是否正确");
										//$.alert("逻辑卡号不一致！");
										errorBeep();
										fn();
									},500);
								}
							}else{
								window.setTimeout(function(){//延迟优化显示效果
									$.alert("读发行信息错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
									errorBeep();
									fn();
								},500);
							}
						}
					},'读发行信息',$.toJSON(params));
				}
				
				//清除卡片黑名单指令
				function clear(jt2,card_serial){
					var params = {
						"commandSet":[{
							"funName":"IonSetCardStat", 
							"param": "0"
						}]	
					};
					uiObj.send(function(jtype,jtext,jpre_str){
						if(jtype==2){
							window.setTimeout(function(){//延迟优化显示效果
								$.alert(jpre_str);
								errorBeep();
								fn();
							},500);
						}else{
							var jt = $.parseJSON(jtext);
							if(jt.ErrCode=="0"){
								/**
								 * 卡片同步
								 */
								//读卡公共信息
								readPub(jt2,card_serial);
							}else{
								window.setTimeout(function(){//延迟优化显示效果
									$.alert("清除卡片黑名单错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
									errorBeep();
									fn();
								},500);
							}
						}
					},'清除卡片黑名单',$.toJSON(params));
				}
				
				//读卡公共信息
				function readPub(jt2,card_serial){
					//$.print("公共");
					var params = {
						"commandSet":[{
							"funName":"IonReadPubInfo", 
							"param":""
						}]
					};
					uiObj.send(function(jtype,jtext,jpre_str){
						if(jtype==2){
							window.setTimeout(function(){//延迟优化显示效果
								$.alert(jpre_str);
								errorBeep();
								fn();
							},500);
						}else{
							var jt = $.parseJSON(jtext);
							if(jt.ErrCode=="0"){
								readRec(jt2,card_serial,jt);
							}else{
								window.setTimeout(function(){//延迟优化显示效果
									$.alert("读公共信息错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
									errorBeep();
									fn();
								},500);
							}
						}
					},'读公共信息',$.toJSON(params));
				}
				
				//读卡片离线记录
				function readRec(jt2,card_serial,jt3){
					//$.print("读离线");
					var params = {
						"commandSet":[{
							"funName":"IonReadRec", 
							"param":""
						}]
					};
					uiObj.send(function(jtype,jtext,jpre_str){
						if(jtype==2){
							window.setTimeout(function(){//延迟优化显示效果
								$.alert(jpre_str);
								errorBeep();
								fn();
							},500);
						}else{
							var jt = $.parseJSON(jtext);
							if(jt.ErrCode=="0"){
								if(jt.retData.RecInfo==""){//无离线记录
									//readPub(jt2,card_serial);//读公共信息
									//info_div.html("正在同步卡片信息...");
									sync(jt2,card_serial,jt3);//同步
								}else{
									if(jt3.retData.CardStat=="0"){//不是黑名单卡
										var upLoadCard = "account/upLoadCard.do";//上传卡片离线记录
										var param = {};
										param['jdevid'] = "0";
										param['jdev_bh'] = "0";
										param['jcmdline'] = jt.retData.RecInfo;
										$.postEx(upLoadCard,param,function(retJson){
											if(retJson.result){
												ClearRec(jt2,card_serial,jt3);//清除离线记录
											}else{
												window.setTimeout(function(){//延迟优化显示效果
													$.alert(retJson.info);
													errorBeep();
													fn();
												},500);
											}
										});
									}else{//黑名单卡不能清除离线记录
										window.setTimeout(function(){//延迟优化显示效果
											$.alert("黑名单卡不能清除离线记录！");
											errorBeep();
											fn();
										},500);
									}
								}
							}else{
								window.setTimeout(function(){//延迟优化显示效果
									$.alert("读卡片离线记录错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
									errorBeep();
									fn();
								},500);
							}
						}
					},'读卡片离线记录',$.toJSON(params),"5000");
				}
				
				//清除离线记录
				function ClearRec(jt2,card_serial,jt3){
					var params = {
						"commandSet":[{
							"funName":"IonClearRec", 
							"param":""
						}]
					};
					uiObj.send(function(jtype,jtext,jpre_str){
						if(jtype==2){
							window.setTimeout(function(){//延迟优化显示效果
								$.alert(jpre_str);
								errorBeep();
								fn();
							},500);
						}else{
							var jt = $.parseJSON(jtext);
							if(jt.ErrCode=="0"){
								//info_div.html("正在同步卡片信息...");
								sync(jt2,card_serial,jt3);//同步
							}else{
								window.setTimeout(function(){//延迟优化显示效果
									$.alert("清除卡片离线记录错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
									errorBeep();
									fn();
								},500);
							}
						}
					},'清除卡片离线记录',$.toJSON(params));
				}
				
				//同步
				function sync(jt2,card_serial,jt3){
					//$.print("同步");
					var syncCard = "account/syncCard.do";//卡片同步
					var param = {};
					param['card_number'] = jt2.retData.CardNo;
					param['media_id'] = jt2.retData.CardType;
					param['card_serial'] = card_serial;
					param['card_trad_serial'] = jt3.retData.CardTradSerial;
					param['device_id'] = "0";
					$.postEx(syncCard,param,function(retJson){
						if(retJson.result && retJson.data.length>0){
							//$.print(retJson);
							SyncFn(jt2,card_serial,jt3,retJson);
						}else{
							$.alert(retJson.info);
							//errorBeep();
							//fn();
							fn(jt2);
						}
					});
				}
				
				function SyncFn(jt2,card_serial,jt3,retJson){
					var params = {
						"commandSet":[{
							"funName":"IonSyncWallet", 
							"param":{
								"LogicCardNo":card_serial,
								"CardTradSerial":jt3.retData.CardTradSerial,
								"OldBalance":"0",
								"NewBalance":retJson.data[0].cash_amt
							}
						},{
							"funName":"IonSyncSub",
							"param":retJson.data[0].sub_info
						},{
							"funName":"IonSyncSum",
							"param":retJson.data[0].sum_info
						}]
					};
					uiObj.send(function(jtype,jtext,jpre_str){
						if(jtype==2){
							$.alert(jpre_str);
							errorBeep();
							fn();
						}else{
							var jt = $.parseJSON(jtext);
							if(jt.ErrCode=="0"){
								fn(jt2);
							}else{
								$.alert("卡片同步错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
								errorBeep();
								fn();
							}
						}
					},'卡片同步',$.toJSON(params));
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
					uiObj.send(function(jtype,jtext,jpre_str){
						
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
					uiObj.send(function(jtype,jtext,jpre_str){

					},'错误提示音',$.toJSON(params));
				}
			}
		},
		//读身份证  1基本信息，2只读照片，4只读指纹，8只读新地址，15全部
		readIdCard:function(fn,param){
			var params = {
				"commandSet":[{
					"funName":"IreadIdenCard", 
					"param":"1"
				}]
			};
			params = param || params;
			this.send(func,"读身份证",$.toJSON(params));
			
			function func(jtype,jtext,jpre_str){
				if(jtype==2){
					window.setTimeout(function(){//延迟优化显示效果
						$.alert(jpre_str);
						fn();
					},500);
				}else{
					var jt = $.parseJSON(jtext);
					if(jt.ErrCode=="0"){
						fn(jt);
					}else if(jt.ErrCode=="-102"){
						window.setTimeout(function(){//延迟优化显示效果
							$.alert("请将二代证放到读卡器上！");
							fn();
						},500);
					}else{
						window.setTimeout(function(){//延迟优化显示效果
							$.alert("读身份证错误码："+jt.ErrCode+"<br/>"+jt.ErrMsg);
							fn();
						},500);
					}
				}
			}
		}
	};
	return uiObj;
	//发送应用数据
	function jlink_checkapp(japp_name){
		var jret = -1;
		try
		{
		   var jchk_webapp = new ActiveXObject("jbrowser_appchk.japp_chk");
		   jret = jchk_webapp.jcheck_app(japp_name);
		}catch(e){
		   return (-1);
		}
		return jret;
	}

	
});
