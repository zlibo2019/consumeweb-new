/*开户发卡openAccount_ProvideCard.js*/

garen_define("js/account/openAccount_provideCard",function (jqObj,loadParams) {
	
	var openAccToProCard = "account/openAccToProCard.do";//开户发卡查询

	var color_id = "";//发卡id
	
	var color_i = "";//发卡颜色0绿（正在发卡），1红（发卡失败）
	
	var firstLoad = 0;//第一次加载datagrid要全选
	
	var rData = [];//需要发卡的人员数据
	
	function _2e(_2f) {
		var _30 = [];
		var _31 = $.data(_2f, "combo").combo;
		_31.find(".textbox-value").each(function () {
			_30.push($(this).val());
		});
		return _30;
	};
	
	var columns = [//列字段定义
      	[ {
       		field : 'id',
       		title : 'ID',
       		align : "center",
       		checkbox : true,
       		width : 100
       	}, {
       		field : 'index',
       		title : '..',
       		align : "center",    
       		width : 50
       	}, {
       		field : 'user_no',
       		title : '学/工号',
       		align : "center",
       		width : 80
       	}, {
       		field : 'user_lname',
       		title : '姓名',
       		align : "center",
       		width : 80
       	}, {
       		field : 'user_sex',
       		title : '性别',
       		align : "center",
       		width : 60
       	}, {
       		field : 'dep_name',
       		title : '部门',
       		align : "center",
       		width : 90
       	}, 	{
       		field : 'user_id',
       		title : '身份证号',
       		align : "center",
       		width : 145
       	}, {
       		field : 'account_end_date_str',
       		title : '账户有效期',
       		align : "center",
       		width : 90
       	}, 	{
       		field : 'finger_enable',
       		title : '指纹消费',
       		align : "center",
       		width : 65
       	}, {
       		field : 'open_account_date',
       		title : '开户日期',
       		align : "center",
       		width : 100
       	}, {
       		field : 'account_state_name',
       		title : '状态',
       		align : "center",
       		width : 80
       	}] ];
	
	var centerUI = {
		eName : 'datagrid',
		idField : 'account_id',
		columns : columns,
		showFooter:false,
		alertFlag : false,// 是否弹出默认对话框
		autoload : false,
		singleSelect:false,
		checkOnSelect:true,
		selectOnCheck:true,
		pagination: true,
		clientPager:true,
		rowStyler:function(index,row){
			if(row.account_id==color_id){
				if(color_i == "1"){
					return 'background-color:green;';
				}
				else if(color_i == "0"){
					return 'background-color:red;';
				}
			}
		},
		onLoadSuccessEx:function(retJson){
			if(retJson.id==0){
				if(firstLoad){
					dataTable.datagrid("checkAll");
					firstLoad = 0;
				}
			}else{
				$.alert(retJson.info);
			}
		}
	};
	
	var southUI = {
		eName : 'div',
		cssClass:"openAccount_south_div",
		elements : [{//发主卡按钮
			eName : 'linkbutton',
			uId:"tm2",
			text : "<span style='font-size:20px;'>发主卡</span>",
			cssClass : 'openAccount_linkbutton',
			width : 220,
			height : 60,
			onClick:function(){
				var rows = dataTable.datagrid("getCheckedEx");
				if(rows.length < 1){
					$.alert("至少选择一条记录！");
				}
				else{
					var card_flag = 1;
					var ids = [];
		            $.each(rows, function (i, row) {
		            	if(row.account_state_name == "已发卡"){
		            		card_flag = 0;
		            		return false;
		            	}
	            		ids.push(row.account_id);
		            });
		            if(card_flag == 1){
		            	var param = {};
						param['ids'] = ids;
						param['is_main_card'] = "1";
						var myWin = $.createWin({
							title:"发主卡",
							width:300,
							height:200,
							queryParams:{
								params:param,
								callback:changeState,
								callColor:changeColor
							},
							url:"js/account/openAccount_provideCardWin.js"
						});
		            }else{
		            	$.alert("存在已发卡的人员，请重新选择！");
		            }
				}
			}
		},{//发附卡按钮
			eName : 'linkbutton',
			cssStyle:"margin-left:80px;",
			uId:"tm2",
			text : "<span style='font-size:20px;'>发附卡</span>",
			cssClass : 'openAccount_linkbutton',
			width : 220,
			height : 60,
			onClick:function(){
				var rows = dataTable.datagrid("getCheckedEx");
				if(rows.length == 0){
					$.alert("至少选择一条记录！");
				}
				else{
					var card_flag = 1;
					var ids = [];
		            $.each(rows, function (i, row) {
		            	if(row.account_state_name == "已发卡"){
		            		card_flag = 0;
		            		return false;
		            	}
	            		ids.push(row.account_id);
		            });
		            if(card_flag == 1){
		            	var param = {};
						param['ids'] = ids;
						param['is_main_card'] = "0";
						var myWin = $.createWin({
							title:"发附卡",
							width:300,
							height:200,
							queryParams:{
								params:param,
								callback:changeState,
								callColor:changeColor
							},
							url:"js/account/openAccount_provideCardWin.js"
						});
		            }else{
		            	$.alert("存在已发卡的人员，请重新选择！");
		            }
				}
			}
		}]
	};
	
	var mainUI = {
		eName : 'layoutExt',// 容器布局类，jeasyui组件
		cssStyle:'font-family: 微软雅黑, Arial;',
		fit : true,
		elements : [{
			region : 'center',
			elements : centerUI
		},{
			region : 'south',
			height : 100,
			elements : southUI
		}]
	};
	//debug();
	
	//创建dom
	jqObj.loadUI(mainUI);
	
	//通过findJq模糊查找，找到dom节点
	var dataTable = jqObj.findJq("datagrid");
	
	loadInit();
	
	function loadInit(){
		
		var ids = loadParams.params.split(",");
		
		if(ids.length>300){
			$.progress('正在加载...');
			batch(1,ids);//分批
		}else{
			firstLoad = 1;
			dataTable.datagrid("loadEx",{url:openAccToProCard,openacc_id:loadParams.params});
		}
	}
	
	function batch(pageNum,ids){
		var pageSize = 300;
		var offset = (pageNum-1)*pageSize;//偏移量
		if(offset+pageSize>ids.length){
			offset = ids.length-pageSize;
		}
		
		$.postEx(openAccToProCard,{openacc_id:ids.slice((pageNum-1)*pageSize,offset+pageSize).join()},function(retJson){
			if(retJson.result && retJson.data){
				if(offset == ids.length-pageSize){
					rData = rData.concat(retJson.data);
					firstLoad = 1;
					dataTable.datagrid("loadDataEx",rData);
					$.progress("close");
				}else{
					$.each(retJson.data,function(i, row){
						rData.push(row);
					});
					batch(++pageNum,ids);
				}
			}else{
				$.progress("close");
				$.alert(retJson.info);
			}
		});
	}
	
	//关闭
	jqObj.updateOpt("panel",{
		onBeforeClose:function(){
			loadParams.callback();
			return true;//true 关闭 false不关闭
		}
	});
	
	//改变正在发卡记录颜色
	function changeColor(account_id,i){
		color_id = account_id;
		color_i = i;
//		var rows = dataTable.datagrid("getCheckedEx");
//		$.each(rows,function(x,row){
//			var index = dataTable.datagrid("getRowIndex",row);
//			dataTable.datagrid("updateRowEx",{
//				index:index,
//				row:{}
//			});
//		});
//		dataTable.datagrid("reloadExt");
		var rows = dataTable.datagrid("getCheckedEx");
		$.each(rows,function(x,row){
			if(row.account_id==account_id){
				var num = dataTable.datagrid('getRowPageNum',row);
				dataTable.datagrid('gotoPage',num);
				var index = dataTable.datagrid("getRowIndex",row);
				dataTable.datagrid('scrollTo',index);
				return false;
			}
		});
	}
	
	function changeState(account_id){
		var rows = dataTable.datagrid("getCheckedEx");
		$.each(rows,function(i,row){
			if(row.account_id==account_id){
//				var index = dataTable.datagrid("getRowIndex",row);
//				dataTable.datagrid("updateRowEx",{
//					index:index,
//					row:{account_state_name:"已发卡"}
//				});
				row.account_state_name = "已发卡";
				var num = dataTable.datagrid('getRowPageNum',row);
				dataTable.datagrid('gotoPage',num);
				var index = dataTable.datagrid("getRowIndex",row);
				dataTable.datagrid('scrollTo',index);
				return false;
			}
		});
	}
});
	