
/*
 * 自定义组件layoutTable
 * 具有布局功能的
 * */
(function($){
	var uitls = garen_require("utils");
	var garenUI =  garen_require("garen_ui");
	var easyUI =  garen_require("garen_easyui");
	easyUI.regFn({//注册组件
	   name:"layoutTable",//组件名称
	   tag:'table'//html组件
	});
	//生成组件
	function init(target){
		var myobj = $(target);
		var opts = $.data(target, "layoutTable").options;
		if(opts.cssClass == undefined) myobj.addClass('ui_table');
		//创建表格行列
		var tbody = createTrtd(opts);
		//创建单元格合并
		createTdSpan(opts);
		//创建表头
		var comlumns = opts.columns;
		var theadHeight = opts.theadHeight;
		var thead = null;
		if($.isArray(comlumns)){//遍历
			$.each(columns,function(i,column){
				column.eName = 'th';
			});
			thead = {
			  eName:'tr',
			  height:theadHeight,
			  elements:comlumns
			};
		}
		var elements = opts.cells || [];
		//绘制内容,遍历元素
		$.each(elements,function(i,dataTr){
			var row = tbody[i];
			if(row == undefined) return false;
			//每次从0开始
			var x = 0;
			$.each(dataTr,function(j,dataTd){
				var td = null;
				do{
					td = row.elements[x++];
					//未定义则终止
					if(td == undefined) return false;
					//正常状态，退出
					if(td.status) break;//
				}while(true);
				td.elements = dataTd;
			});
		});
		var ui = [{eName:'thead',elements:thead},{eName:'tbody',elements:tbody}];
		myobj.createUI(ui);
	}
	//合并单元信息
	function createTdSpan(UIData){
		var colSize = 0,rowSize = 0;
		var i = 0,j = 0;
		var tbody = UIData.tbody;
		$.each(tbody,function(r,tr){
			var tds = tr.elements;
			$.each(tds,function(c,td){
				//合并过退出
				if(td.status == false) return true;
				colSize = getColSpan(UIData,r,c);
				rowSize = getRowSpan(UIData,r,c);
				if(colSize > 1) td.colSpan  = colSize;
				if(rowSize > 1) td.rowSpan = rowSize;
				for(i = 0;i<rowSize;i++){
					var tds_tmp = tbody[r + i].elements;
					for(j = 0;j < colSize;j++){
						if(i == 0 && j == 0) continue;
						tds_tmp[c+j].status = false;
					}
				}
			});
		});
		return tbody;
	}
	/*
	 * 创建表格
	 * UIData.trHeight [] 表格行高
	 * UIData.tdWidth [] 表格行宽
	 * 若当前表格宽或高，值无效，则继承前一个表格的宽或高，依次递归
	 * 	[20,,,30,,] 第1个 高度或宽度为20px,第2,3值无效,则继承20. 第4,5则为30
	 *  若值为0 ,宽度可以隐藏该列，高度则为auto
	 *  若为-1，高度或宽度皆不设置此属性
	 */
	function createTrtd(UIData){
		//创建表头
		var columns = UIData.columns;
		var trs = [];//tr数组
		var w1 = null,w2 = null,ww1 = null,ww2 = null;
		var cols = UIData.cols,rows = UIData.rows;
		var tdStyle = "",trStyle = "";
		var trHeight = UIData.trHeight || 25;
		var trWidth = UIData.tdWidth || [];
		var debug = UIData.debug;
		//td点击事件
		function onCreateTd(){
			if(UIData.onCreateTd){//绑定Td创建事件
				UIData.onCreateTd.call(this,this.r,this.c);
			}
		}
		for(var rowNum = 0;rowNum<rows;rowNum++){
			//确定类名
			var clsName = rowNum%2==0?'dt_even':'dt_odd';
			var tr = {eName:'tr',elements:[],height:w1,cssClass:clsName};
			//计算行高
			ww1 = trHeight[rowNum];
			if($.isNumeric(ww1)){
				w1 = ww1;//记住值
			}
			if(w1 != null && w1 != -1)	tr.height = w1;
			for(var colNum = 0;colNum<cols;colNum++){
				var tds = tr.elements;
				var td = {
						eName:'td',
						r:rowNum,c:colNum,
						status:true,
						colSpan:0,rowSpan:0
				};
				if(columns){
					var col = columns[colNum];
					if(col){
						td['field'] = col.field;
						td['rownumber'] = col.rownumber;
					}
				}
				//第一行确定宽度
				if(rowNum == 0){
					ww2 = trWidth[colNum];
					if($.isNumeric(ww2)){
						w2 = ww2;
					}
					if(w2 != null && w2 != -1)
						td.width = w2;
				}
				//调试模式显示坐标
				if(debug) td.text = "(" + rowNum+","+colNum+")";
				td.onCreate = onCreateTd;
				tds.push(td);
			}
			trs.push(tr);
		}
		UIData.tbody = trs;
		return trs;
	}
	/*
	 * 行列式(row,col,3)
	 * 组织单元格代码
	 * 返回跳过数目
	 * [2,'colspan="3"']
	 */
	function getColSpan(UIData,rowNum,colNum){
		var size = 1;
		var colSpans = UIData.colSpans;
		var cols = UIData.cols;
		if($.isArray(colSpans) == false) return 1;
		$.each(colSpans,function(i,span){
			//数据不合法
			if($.isArray(span) == false ||
					span.length != 3) return true;
			//匹配合格
			if(span[0] == rowNum && span[1] == colNum){
				size = span[2];
				if($.isNumeric(size)){
					//小于2，合并没有意思
					if(size < 2) return true;
					//最大合并单元格
					if(colNum + size > cols) size = cols - colNum;
					return false;//终止循环
				}else{
					size = 1;
					return true;//终止循环
				}
			}
		});
		return size;
	}
	
	/*
	 * 行列式(row,col,3)
	 * 组织单元格代码
	 * 返回跳过数目 
	 */
	function getRowSpan(UIData,rowNum,colNum){
		var size = 1;
		var rowSpans = UIData.rowSpans;
		var rows = UIData.rows;
		if($.isArray(rowSpans) == false) return 1;
		$.each(rowSpans,function(i,span){
			//数据不合法
			if($.isArray(span) == false ||
					span.length != 3) return true;
			//匹配合格
			if(span[0] == rowNum && span[1] == colNum){
				size = span[2];
				if($.isNumeric(size)){
					//小于2，合并没有意思
					if(size < 2) return true;
					//最大合并单元格
					if(rowNum + size > rows) size = rows - rowNum;
					return false;
				}else{
					size = 1;
					return true;
				}
			}
		});
		return size;
	}
	//构造函数
	$.fn.layoutTable = function(options, param){
		if (typeof options == 'string'){//调用方法
			var method = $.fn.layoutTable.methods[options];
			if (method){
				return method(this, param);
			}else{
				return this.form(options, param);
			}
		}
		options = options || {};
		return this.each(function(){
			var state = $.data(this, "layoutTable");
			if (state){
				$.extend(state.options, options);
				$(this).empty();//清空
			} else {
				state = $.data(this, "layoutTable", {
					options: $.extend({}, $.fn.layoutTable.defaults, 
							$.fn.layoutTable.parseOptions(this), options)
				});
			}
			//绘制子元素
			init(this);
		});
	};
	//方法区域
	$.fn.layoutTable.methods = {
		options: function(jq){
			return $.data(jq[0], "layoutTable").options;
		}
	};
	
	$.fn.layoutTable.parseOptions = function(target){
		return $.extend({}, $.parser.parseOptions(target, []));
	};
	
	$.fn.layoutTable.defaults = {
		cols:1,
		rows:1,
		theadHeight:28
	};
})(jQuery);

