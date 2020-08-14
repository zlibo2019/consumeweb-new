
//自定义组件
(function($){
	var uitls = garen_require("utils");
	var easyUI =  garen_require("garen_easyui");
	var keyFlag = "$num_key#";//记录序号标志
	easyUI.regFn({
	   name:'datagrid',
	   tag:'table',
	   onCreate:function(jqObj,uiOpts){
		   var mygrid = jqObj;
		   var panel = mygrid.datagrid("getPanel");
		   if(uiOpts.singleSelect){
			   panel.find('.datagrid-header-check > input').hide();
		   }
		   if($.isArray(uiOpts.toolbarEx)){
			   var toolbar = {
			    	eName:'toolbar',
			    	addMode:"prepend",
			    	elements:uiOpts.toolbarEx
			   };
			   //删除旧的工具栏
			   panel.find('div.datagrid-toolbar').remove();
			   panel.createUI(toolbar);
			   //重绘datagrid 
			   mygrid.datagrid('resize');
		   }
		   return;
	   }
	});
	/*
	 * datagrid组件默认值
	 */
	$.extend($.fn.datagrid.defaults, {
		fit:true,
		pagination:true,
		singleSelect:true,
		pageList:[30,60],
		pageNumber:0,
		pageSize:30,
		clientPager:true,
		onBeforeLoad:function(params){
			var mygrid = $(this);
			var state = $.data(this, 'datagrid');
			var opts = state.options;
			opts.queryParamsEx =  opts.queryParamsEx ||{};
			//首次加载页面，是否查询数据
			if(opts.autoload == false) {
				opts.autoload = true;
				clearClientPageFlag(mygrid);//清除本地分页标志
				return false;
			}
			//分页参数重命名
			if(params['rows']){
				params['pageSize'] = params['rows'];
				delete params['rows'];
			}
			if(params['page']){
				params['pageNum'] = params['page'];
				delete params['page'];
			}
			/*
			 * 查询条件:
			 * loadEx方法设置clientPageFlag = true
			 * 1 客户端分页
			 * 		第一次查询，取form表单条件（clientPageFlag = true）
			 * 		下一页等情况时，取缓存数据 （clientPageFlag = false）
			 * 2 服务端分页
			 * 		第一次查询，取form表单条件
			 * 		下一页等情况,取缓存的查询条件
			 * */
			if(state.clientPageFlag){//准备条件
				var myform = null;
				var jqgridBody = mygrid.parents(".datagrid-wrap");
				if(opts.queryForm){
					myform = jqgridBody.findJq(opts.queryForm);
				}else{
					myform = jqgridBody.find("form");
				}
				if(myform.length > 0){
					if(myform.form('form2Json',params) == false){
						clearClientPageFlag(mygrid);//清除本地分页标志
						return false;
					}
				}
				if(opts.onBeforeLoadEx){
					if(false == opts.onBeforeLoadEx.call(this,params)){
						$(this).datagrid('loadData',[]);//清空数据
						opts.queryParamsEx = null;//清空条件
						clearClientPageFlag(mygrid);//清除本地分页标志
						return false;
					}
				}
				//缓存查询条件
		        opts.queryParamsEx = params;
			}
			if(opts.clientPager){// && opts.pagination 无分页也取缓存数据
				clientPaging(mygrid,params);
				return false;
			}else{
				if(params != opts.queryParamsEx){
					delete opts.queryParamsEx.pageNum;
					delete opts.queryParamsEx.pageSize;
					$.extend(params,opts.queryParamsEx);//使用的缓存条件
				}
			}
			//清空选中情况
	        //var data = $.data($(this).get(0),'datagrid');
	        //data.selectedRows = [];
	        //data.checkedRows = [];
			return true;
		},
		onLoadSuccess:function(data){
			var mygrid = $(this);
			var state = $.data(this, 'datagrid');
			var opts = state.options;
			state.clientPageFlag = false;//情况loadex查询标志
			updateAllCheckBox(mygrid);
			if(opts.clientPager == false){
				var rows = data;
				var offset = 0;
				if($.isArray(rows) == false) {
					var pageNum = data.pageNum;
					var pageSize = data.pageSize;
					offset = (pageNum - 1) * pageSize;
					rows = data.rows;
				}
				setupOrder(rows,offset);//顺序号
			}
			mygrid.datagrid("updateOrderNum",0);
			if(opts.onLoadSuccessEx){
				opts.onLoadSuccessEx.call(this,data);
			}
		},
		onSelect:function(index,row){
			$.print("onSelect");
		},
		onCheck:function(index,row){
			$.print('onCheck');
			var mygrid = $(this);
			var opts = mygrid.datagrid('options');
			updateAllCheckBox(mygrid);
			if(opts.onCheckEx) 
				opts.onCheckEx.call(this,index,row);
		},
		onUncheck:function(index,row){
			$.print('onUncheck');
			var mygrid = $(this);
			var opts = mygrid.datagrid('options');
			//updateAllCheckBox(mygrid);
			if(opts.onUncheckEx) 
				opts.onUncheckEx.call(this,index,row);
		},
		onCheckAll:function(rows){//选中所有的
			$.print('onCheckAll');
			var mygrid = $(this);
			var state = $.data(this, 'datagrid');
			var opts = state.options;
			var checkedRows = state.checkedRows;
			var selectedRows = state.selectedRows;
			var rowAll = getClientData(mygrid);
			if(opts.clientPager && opts.pagination){
				if(opts.idField){
					for (var i = 0; i < rowAll.length; i++) {
						$.easyui.addArrayItem(checkedRows, opts.idField, rowAll[i]);
						if(opts.selectOnCheck){
							$.easyui.addArrayItem(selectedRows, opts.idField, rowAll[i]);
						}
					}
				}
			}
			if(opts.onCheckAllEx) 
				opts.onCheckAllEx.call(this,checkedRows);
		},
		onUncheckAll:function(rows){
			$.print('onUncheckAll');
			var mygrid = $(this);
			var opts = mygrid.datagrid('options');
			var _1ed = $.data(this, "datagrid");
			var _1ee = _1ed.selectedRows;
			var _1ef = _1ed.checkedRows;
			_1ef.splice(0, _1ef.length);
			if (_1ed.options.selectOnCheck) {
				_1ee.splice(0, _1ee.length);
			}
			if(opts.onUncheckAllEx) 
				opts.onUncheckAllEx.call(this,rows);
		}
	});

	$.extend($.fn.datagrid.methods,{
		loadEx:function(jq,params){
			var state = jq.data('datagrid');
			var opts = state.options;
			params = params ||{};
			if(params.url){
				jq.datagrid('options').url = params.url;
			}
			state.clientPageFlag = true;
			jq.datagrid('clearChecked');//清空选中状态
			jq.datagrid('load',params);
		},
		loadDataEx:function(mygrid,params){
			if($.isArray(params)) params = {rows:params,total:params.length}
			params = $.extend({pageSize:30,pageNum:1},params);
			var rows = params.rows;
			if(false == $.isArray(rows)) return;
			mygrid.datagrid('clearChecked');
			var state = $.data(mygrid[0], 'datagrid');
			setupOrder(rows);//顺序号
			state.localdata = params;//缓存数据
			getPageData(mygrid,params,params.pageNum,params.pageSize);
		},
		reloadEx:function(mygrid,params){//重新请求数据
			var opts = mygrid.datagrid('options');
			if(opts.queryParamsEx == undefined) return;
			params = opts.queryParamsEx || params;
			if(params.url){
				opts.url = params.url;
			}
			mygrid.data('datagrid').clientPageFlag = true;
			mygrid.datagrid('clearChecked');//清空选中状态
			params.pageNum = 1;
			clientPaging(mygrid,params);
		},
		getRowPageNum:function(grid,row){//获取记录在第几页
			if(row == undefined) return 0;
			var pager = grid.datagrid("getPager");
			if(1 != pager.length) return 1;
			var pagerOpts = pager.pagination('options');
			var pageSize = pagerOpts.pageSize;
			var rowNum = row[keyFlag] + 1;
			var num = parseInt(rowNum / pageSize);
			return rowNum % pageSize == 0?num:num + 1;
		},
		reloadExt:function(mygrid,params){//重新回到第一页，不清除选中状态
			var opts = mygrid.datagrid('options');
			if(opts.queryParamsEx == undefined) return;
			params = opts.queryParamsEx || params;
			if(params.url){
				opts.url = params.url;
			}
			params.pageNum = 1;
			clientPaging(mygrid,params);
		},
		getCheckedEx:function(jq){//选择记录排序
			var rows = jq.datagrid('getChecked');
			rows.sort(function(a,b){
				return a[keyFlag] - b[keyFlag];
			});
			return rows;
		},
		getSelectionsEx:function(jq){//选择记录排序
			var rows = jq.datagrid('getSelections');
			rows.sort(function(a,b){
				return a[keyFlag] - b[keyFlag];
			});
			return rows;
		},
		updateOrderNum:function(jq,index){
			index = index || 0;
			var mygrid = jq;
			var panel = mygrid.datagrid("getPanel");
			var offset = getPageOffset(mygrid,index);
			var td = index<1?'td[field=index]':'td[field=index]:gt('+(index-1)+')'
			var tds = panel.find('table[class=datagrid-btable]').find(td).children('div');
			tds.each(function(i,node){
				$(this).html(offset + i);
			});
		},
		/*
		 * 扩展功能
		 * 1 序号重新计算
		 * 2 行数据同步到localdata
		 * */
		updateRowEx:function(mygrid,params){
			var state = mygrid.data('datagrid');
			var opts = state.options;
			var rows = mygrid.datagrid("getRows");//获取本页数据
			if(params.index >= rows.length) return;
			var offset = getPageOffset(mygrid,params.index);
			params.row.index = offset;//更新序号
			mygrid.datagrid('updateRow',params);
			mygrid.datagrid('selectRow',params.index);
		},
		deleteRowEx:function(mygrid,rows){
			var len = rows.length,//纪录数
				index = -1,//行索引
				row = null,//当前行
				rowNUm = -1,//顺序号
				opts = mygrid.data('datagrid').options,
				allRows = getClientData(mygrid),//获取所有数据
				i = len - 1;
			for(;i >= 0;i--){
				row = rows[i];
				//rowNum = row[keyFlag];
				index = mygrid.datagrid('getRowIndex',row);
				if(index != -1){
					mygrid.datagrid('deleteRow',index);
				}
				if(opts.clientPager && opts.pagination){
					$.each(allRows,function(j,r){
						if(row == r){
							rowNum = j;
							return false;
						}
					});
					allRows.splice(rowNum,1);
				}
			}
			mygrid.datagrid('updateOrderNum',0);
			mygrid.datagrid('clearChecked');//清空选中状态
			return;
		}
	});
	//本地获取分页信息
	function getPageData(mygrid,localData,pageNum,pageSize){
		var datas = $.extend({rows:[],id:0,total:0},localData);
		var offset = (pageNum - 1) * pageSize;
		datas.total = datas.rows.length;
		var rows = datas.rows.slice(offset,offset + pageSize);
		datas.rows = rows;
		mygrid.datagrid('loadData',datas);//{total:localData.length,rows:rows,id:0}
	}
	//清除标志
	function clearClientPageFlag(mygrid){
		var state = mygrid.data('datagrid');
		state.clientPageFlag=false;
	}
	//客户端分页函数,参数:datagrid对象,表单参数
	function clientPaging(mygrid,params){
		var state = mygrid.data('datagrid');
		var opts = state.options;
		var pageNum = params.pageNum;
		var pageSize = opts.pageSize;
		if(pageNum == 1 && state.clientPageFlag){
			$.print("重新开始请求");
			//清空选择数据
			var selectedRows = state.selectedRows;
			var checkedRows = state.checkedRows;
			checkedRows.splice(0, checkedRows.length);
			if (state.options.selectOnCheck) {
				selectedRows.splice(0, selectedRows.length);
			}
			clearClientPageFlag(mygrid);//清除本地分页标志
			params.pageNum = 0;
			mygrid.datagrid('loading');
			$.postEx(opts.url,params,function(retJson){
				mygrid.datagrid('loaded');
				if(retJson.result) {
					retJson.rows = retJson.rows || [];//默认空数组
					setupOrder(retJson.rows);//顺序号
					state.localdata = retJson;//缓存数据
					getPageData(mygrid,state.localdata,pageNum,pageSize);
				}else
					$.alert(retJson.info);
			});
		}else {
			getPageData(mygrid,state.localdata,pageNum,pageSize);
		}
	}
	/*更新全选checkbox状态，但不触发相关事件**/
	function updateAllCheckBox(mygrid){
		var state = $.data(mygrid[0], 'datagrid');
		var opts = state.options;
		var status = false;
		var len = getClientData(mygrid).length;
		if(len > 0 && state.checkedRows.length == len)
			status = true;
		var box = mygrid.datagrid('getPanel')
			.find('div.datagrid-header-check input[type=checkbox]');
		box.prop('checked',status);
	}
	//获取行分页偏移量
	function getPageOffset(mygrid,index){
		var pager = mygrid.datagrid("getPager");
		if(1 == pager.length){
			var pagerOpts = pager.pagination('options');
			index  += (pagerOpts.pageNumber - 1) * pagerOpts.pageSize;
		}
		return index  + 1;//偏移量从0开始
	}
	//设置记录序号标志
	function setupOrder(rows,offset){
		offset = offset || 0;
		$.each(rows,function(i,row){
			if(undefined == row) return;
			row[keyFlag] = offset + i;
		});
	}
	//获取缓存的数据
	function getClientData(mygrid){
		var state = $.data(mygrid[0], 'datagrid');
		var localdata = state.localdata || {};
		return localdata.rows || [];
	}
})(jQuery);

