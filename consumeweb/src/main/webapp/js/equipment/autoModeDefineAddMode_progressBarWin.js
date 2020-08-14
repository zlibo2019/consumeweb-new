//自动消费模式进度条提示窗
garen_define("js/equipment/autoModeDefineAddMode_progressBarWin",function (jqObj,loadParams) {
	
	var modeListAdd = "equipment/autoMode/modeListAdd.do";//新增
	var utils = garen_require("utils");
	
	var rData = [];//错误数据
	
	var centerUI = {
		eName:"div",
		height:'100%',
		cssStyle:"background:#f4f4f4;",
		elements:{
			eName:"progressBar",
			height:60,
			titleWidth:100,
			cssStyle:"margin-left:60px;line-height:60px;",
			text:'自动消费模式进度'
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
		var ids = [];
		var params = {};
//        $.each(loadParams.params, function (i, row) {
//    		//将对象放到数组中
//    		ids.push(row.id);
//        });
		ids = loadParams.params.dep_serial.split(',');
        if(ids.length>300){
			batch(1,ids);//分批
		}else{
			params['dep_serial'] = loadParams.params.dep_serial;
			//params['dep_serial'] = ids.join(',');//主键参数
	        params['begin_date'] = loadParams.configs.begin_date;
	        params['end_date'] = loadParams.configs.end_date;
	        params['xf_model_id'] = loadParams.configs.xf_model_id;
	        params['fixed_amt'] = loadParams.configs.fixed_amt;
	        bar.progressBar('start');
	        $.postEx(modeListAdd,params,function(retJson){
				if(retJson.result){
					//rData = retJson.data;
					//dataTable.datagrid("loadDataEx",retJson.data);
					bar.progressBar('stop');
					if(retJson.data.length<1){//没有失败数据
						$.alert("操作成功！");
						loadParams.loadP.callback();
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
							url:"js/equipment/autoModeDefineAddMode_resultWin_2.js"
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
		var params = {};
		params['dep_serial'] = 
			ids.slice((pageNum-1)*pageSize,offset+pageSize).join();
        params['begin_date'] = loadParams.configs.begin_date;
        params['end_date'] = loadParams.configs.end_date;
        params['xf_model_id'] = loadParams.configs.xf_model_id;
        params['fixed_amt'] = loadParams.configs.fixed_amt;
        bar.progressBar('start');
		$.postEx(modeListAdd,params,function(retJson){
			if(retJson.result){
				if(offset == ids.length-pageSize){
					rData = rData.concat(retJson.data);
					//rData.push(retJson.data[0]);
					//dataTable.datagrid("loadDataEx",rData);
					var ret = {};
					ret['data'] = rData;
					bar.progressBar('stop');
					if(retJson.data.length<1){//没有失败数据
						$.alert("操作成功！");
						loadParams.loadP.callback();
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
							url:"js/equipment/autoModeDefineAddMode_resultWin_2.js"
						});
						jqObj.window("close");
					}
				}else{
					$.each(retJson.data,function(i, row){
						rData.push(row);
					});
					batch(++pageNum,ids);
				}
			}else{
				bar.progressBar('stop');
				jqObj.window('close');
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