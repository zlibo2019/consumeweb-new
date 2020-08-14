//账户管理进度条提示窗
garen_define("js/account/accountManage_progressBarWin",function (jqObj,loadParams) {
	
	var manageSave = "account/manageSave.do";//保存
	var utils = garen_require("utils");
	
	var rData = [];//失败数据
	
	var suc_count = 0;//成功人数
	
	var err_count = 0;//失败人数
	
	var centerUI = {
		eName:"div",
		height:'100%',
		cssStyle:"background:#f4f4f4;",
		elements:{
			eName:"progressBar",
			height:60,
			cssStyle:"margin-left:60px;line-height:60px;",
			elements:''
		}
	};
	
	var mainUI = {
		eName : 'layoutExt',// 容器布局类，jeasyui组件
		cssStyle:'font-family: 微软雅黑, Arial;',
		fit : true,
		elements : [{
			region : 'center',
			elements : centerUI
		}]
	}
	
	jqObj.loadUI(mainUI);
	
	var bar = jqObj.findJq('progressBar');
	
	loadInit();
	
	function loadInit(){
		if(loadParams.configs.event_id == "9"){
			bar.progressBar("setTitle","冻结进度");
		}else if(loadParams.configs.event_id == "8"){
			bar.progressBar("setTitle","解冻进度");
		}else if(loadParams.configs.event_id == "10"){
			bar.progressBar("setTitle","重置密码进度");
			bar.progressBar("setTitleWidth","80");
		}else if(loadParams.configs.event_id == "12"){
			bar.progressBar("setTitle","修改有效期进度");
			bar.progressBar("setTitleWidth","90");
		}else if(loadParams.configs.event_id == "101"){
			bar.progressBar("setTitle","启用指纹消费进度");
			bar.progressBar("setTitleWidth","100");
		}else if(loadParams.configs.event_id == "102"){
			bar.progressBar("setTitle","禁用指纹消费进度");
			bar.progressBar("setTitleWidth","100");
		}
		
		var ids = [];
		var params = {};
        $.each(loadParams.params, function (i, row) {
    		//将对象放到数组中
    		ids.push(row.account_id);
        });
        if(ids.length>300){
			batch(1,ids);//分批
		}else{
			params['account_id'] = ids.join(',');//主键参数
	        params['event_id'] = loadParams.configs.event_id;
	        params['account_end_date'] = loadParams.configs.account_end_date;
	        params['account_pwd'] = loadParams.configs.account_pwd;
	        params['read_card_number'] = loadParams.configs.read_card_number;
			params['read_media_id'] = loadParams.configs.read_media_id;
	        
	        bar.progressBar('start');
	        $.postEx(manageSave,params,function(retJson){
				if(retJson.result){
					//rData = retJson.data;
					//dataTable.datagrid("loadDataEx",retJson.data);
					bar.progressBar('stop');
					if(retJson.data.length<1){//没有失败数据
						var myWin = $.createWin({
							title:"操作提示",
							width:600,
							height:180,
							queryParams:{
								ids:ids.join(','),
								configs:loadParams.configs,
								params:retJson,
//								callback:function(){
//									loadParams.callback();
//									jqObj.window("close");
//								}
								loadP:loadParams.loadP
							},
							url:"js/account/accountManage_resultWin_1.js"
						});
						jqObj.window("close");
					}else{
						var myWin = $.createWin({
							title:"操作提示",
							width:600,
							height:450,
							queryParams:{
								ids:ids.join(','),
								configs:loadParams.configs,
								params:retJson,
//								callback:function(){
//									loadParams.callback();
//									jqObj.window("close");
//								}
								loadP:loadParams.loadP
							},
							url:"js/account/accountManage_resultWin_2.js"
						});
						jqObj.window("close");
					}
				}else{
					$.alert(retJson.info);
					bar.progressBar('stop');
					jqObj.window("close");
					//dataTable.datagrid("loadDataEx",retJson.data);
				}
			});
		}
	}
	
	function batch(pageNum,ids){
		var pageSize = 300;
		var offset = (pageNum-1)*pageSize;//偏移量
		if(offset+pageSize>ids.length){
			offset = ids.length-pageSize;
		}
		var params = {};
		params['account_id'] = 
			ids.slice((pageNum-1)*pageSize,offset+pageSize).join();
        params['event_id'] = loadParams.configs.event_id;
        params['account_end_date'] = loadParams.configs.account_end_date;
        params['account_pwd'] = loadParams.configs.account_pwd;
        params['read_card_number'] = loadParams.configs.read_card_number;
		params['read_media_id'] = loadParams.configs.read_media_id;
		
		bar.progressBar('start');
		$.postEx(manageSave,params,function(retJson){
			if(retJson.result){
				if(offset == ids.length-pageSize){
					rData = rData.concat(retJson.data);
					//rData.push(retJson.data[0]);
					suc_count += Number(retJson.retData.suc_count);
					err_count += Number(retJson.retData.err_count);
					var ret = {};
					var retData = {};
					retData['suc_count'] = suc_count;
					retData['err_count'] = err_count;
					ret['retData'] = retData;
					ret['data'] = rData;
					//dataTable.datagrid("loadDataEx",rData);
					bar.progressBar('stop');
					if(retJson.data.length<1){//没有失败数据
						var myWin = $.createWin({
							title:"操作提示",
							width:600,
							height:180,
							queryParams:{
								ids:ids.join(','),
								configs:loadParams.configs,
								params:ret,
//								callback:function(){
//									loadParams.callback();
//									jqObj.window("close");
//								}
								loadP:loadParams.loadP
							},
							url:"js/account/accountManage_resultWin_1.js"
						});
						jqObj.window("close");
					}else{
						var myWin = $.createWin({
							title:"操作提示",
							width:600,
							height:450,
							queryParams:{
								ids:ids.join(','),
								configs:loadParams.configs,
								params:ret,
//								callback:function(){
//									loadParams.callback();
//									jqObj.window("close");
//								}
								loadP:loadParams.loadP
							},
							url:"js/account/accountManage_resultWin_2.js"
						});
						jqObj.window("close");
					}
				}else{
					$.each(retJson.data,function(i, row){
						rData.push(row);
					});
					suc_count += Number(retJson.retData.suc_count);
					err_count += Number(retJson.retData.err_count);
					batch(++pageNum,ids);
				}
			}else{
				bar.progressBar('stop');
				jqObj.window("close");
				$.alert(retJson.info);
			}
		});
	}
	
	//关闭
	jqObj.updateOpt("panel",{
		onBeforeClose:function(){
			return true;//true 关闭 false不关闭
		}
	});
	
});