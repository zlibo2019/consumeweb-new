/*解除设备关联进度条*/

garen_define("js/equipment/merchantAssign_progressBarWin",function (jqObj,loadParams) {
	
	var utils = garen_require("utils");
	
	var devdel = "equipment/merchant/devdel.do";//解除设备关联
	
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
			text:'操作进度'
		}
	};
	
	var mainUI = {
		eName:"layoutExt",
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
		var bhs = [];
		var params = {};
        $.each(loadParams.params, function (i, row) {
    		//将对象放到数组中
    		bhs.push(row.bh);
        });
        if(bhs.length>300){
			batch(1,bhs);//分批
		}else{
			params['bh'] = bhs.join(',');//主键参数
	        bar.progressBar('start');
	        $.postEx(devdel,params,function(retJson){
	        	//$.print("retjson")
	        	//$.print(retJson)
	        	//$.print(loadParams)
				if(retJson.result){
					//$.alert("成功");
					//rData = retJson.data;
					//dataTable.datagrid("loadDataEx",retJson.data);
					bar.progressBar('stop');
					if(retJson.data.length<1){//没有失败数据
						var myWin = $.createWin({
							title:"操作提示",
							width:600,
							height:180,
							queryParams:{
								bhs:bhs.join(','),
								params:retJson,
//								callback:function(){
//									loadParams.callback();
//									jqObj.window("close");
//								}
								loadP:loadParams.loadP
							},
							url:"js/equipment/merchantAssign_resultWin_1.js"
						});
						jqObj.window("close");
					}else{
						var myWin = $.createWin({
							title:"操作提示",
							width:600,
							height:450,
							queryParams:{
								bhs:bhs.join(','),
								params:retJson,
//								callback:function(){
//									loadParams.callback();
//									jqObj.window("close");
//								}
								loadP:loadParams.loadP
							},
							url:"js/equipment/merchantAssign_resultWin_2.js"
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
	
	
	function batch(pageNum,bhs){
		var pageSize = 300;
		var offset = (pageNum-1)*pageSize;//偏移量
		if(offset+pageSize>bhs.length){
			offset = bhs.length-pageSize;
		}
		var params = {};
		params['bh'] = 
			bhs.slice((pageNum-1)*pageSize,offset+pageSize).join();
		
		bar.progressBar('start');
		$.postEx(devdel,params,function(retJson){
			if(retJson.result){
				if(offset == bhs.length-pageSize){
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
								params:ret,
//								callback:function(){
//									loadParams.callback();
//									jqObj.window("close");
//								}
								loadP:loadParams.loadP
							},
							url:"js/equipment/merchantAssign_resultWin_1.js"
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
							url:"js/equipment/merchantAssign_resultWin_2.js"
						});
						jqObj.window("close");
					}
				}else{
					$.each(retJson.data,function(i, row){
						rData.push(row);
					});
					suc_count += Number(retJson.retData.suc_count);
					err_count += Number(retJson.retData.err_count);
					batch(++pageNum,bhs);
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



