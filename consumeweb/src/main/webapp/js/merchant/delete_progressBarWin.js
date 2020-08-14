//商户销户进度条提示窗
garen_define("js/merchant/delete_progressBarWin",function (jqObj,loadParams) {
	
	var delMerchantAccountOperation = "merchant/merchantDelete.do";//商户销户
	var utils = garen_require("utils");
	
	var rData = "";//失败数据
	
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
			text:'销户进度'
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
	
	//关闭
	jqObj.updateOpt("panel",{
		onBeforeClose:function(){
			return true;//true 关闭 false不关闭
		}
	});
	
	loadInit();
	
	function loadInit(){
		var ids = [];
		var params = {};
    	$.each(loadParams.params,function(i, row){
			ids.push(row.merchant_account_id);
		});
    	if(ids.length>300){
			batch(1,ids);//分批
		}else{
			params['ids'] = ids.join(',');
			bar.progressBar('start');
	        $.postEx(delMerchantAccountOperation,params,function(retJson){
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
								params:retJson,
//								callback:function(){
//									loadParams.callback();
//									jqObj.window("close");
//								}
								loadP:loadParams.loadP
							},
							url:"js/merchant/delete_resultWin_1.js"
						});
						jqObj.window("close");
					}else{
						var myWin = $.createWin({
							title:"操作提示",
							width:600,
							height:450,
							queryParams:{
								ids:ids.join(','),
								params:retJson,
//								callback:function(){
//									loadParams.callback();
//									jqObj.window("close");
//								}
								loadP:loadParams.loadP
							},
							url:"js/merchant/delete_resultWin_2.js"
						});
						jqObj.window("close");
					}
				}else{
					bar.progressBar('stop');
					jqObj.window('close');
					$.alert(retJson.info);
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
		params['ids'] = ids.slice((pageNum-1)*pageSize,offset+pageSize).join();
		
		bar.progressBar('start');
		$.postEx(delMerchantAccountOperation,params,function(retJson){
			if(retJson.result){
				if(offset == ids.length-pageSize){
					rData = rData.concat(retJson.data);
					//rData.push(retJson.data[0]);
					suc_count += Number(retJson.retData.suc_count);
					err_count += Number(retJson.retData.err_count);
					//dataTable.datagrid("loadDataEx",rData);
					var ret = {};
					var retData = {};
					retData['suc_count'] = suc_count;
					retData['err_count'] = err_count;
					ret['retData'] = retData;
					ret['data'] = rData;
					bar.progressBar('stop');
					if(retJson.data.length<1){//没有失败数据
						var myWin = $.createWin({
							title:"操作提示",
							width:600,
							height:180,
							queryParams:{
								ids:ids.join(','),
								params:ret,
//								callback:function(){
//									loadParams.callback();
//									jqObj.window("close");
//								}
								loadP:loadParams.loadP
							},
							url:"js/merchant/delete_resultWin_1.js"
						});
						jqObj.window("close");
					}else{
						var myWin = $.createWin({
							title:"操作提示",
							width:600,
							height:450,
							queryParams:{
								ids:ids.join(','),
								params:ret,
//								callback:function(){
//									loadParams.callback();
//									jqObj.window("close");
//								}
								loadP:loadParams.loadP
							},
							url:"js/merchant/delete_resultWin_2.js"
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
				jqObj.window('close');
				$.alert(retJson.info);
				//dataTable.datagrid("loadDataEx",retJson.data);
			}
		});
	}
});