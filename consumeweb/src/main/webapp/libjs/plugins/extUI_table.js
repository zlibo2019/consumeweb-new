
//定义扩展组件
(function(){
	var garenUI =  garen_require("garen_ui");
	var extUI =  garen_require("garen_extui");
	var uitls = garen_require("utils");
	//formtable,用于表单表格布局
	extUI.regFn("formtable", function(jqObj,UIData){
	    var tableUI = UIData;
	    var extBtns = tableUI.extBtns || [];
	    //列定义
		var cols = UIData.cols,rows = UIData.rows;
		if(cols == undefined ||
				rows == undefined){
			$.print('行或列不能为空 !');
			return -1;
		}
		var autoUpdate = UIData.autoUpdate || true;
		//确定类
		tableUI.cssClass = tableUI.cssClass || "ui_table";
		//创建表格行列
		var tbody = createTrtd(UIData);
		//创建单元格合并
		createTdSpan(UIData);
		//创建表头
		var comlumns = UIData.columns;
		var theadHeight = UIData.theadHeight;
		theadHeight = theadHeight || 28;
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
		var elements = UIData.elements || [];
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
		tableUI.elements = [{eName:'thead',elements:thead},{eName:'tbody',elements:tbody}];
		tableUI.eName = "table";
		var formUI = $.extend({
			eName:"formUI"
		},tableUI.formUI);
		//默认按钮 保存 取消
		var btnUI = {//
			eName:'div',
			cssClass:'dialog_button_layout',
			elements:[
	          {eName:'linkbutton',text:'保存',uId:'save',
	        	  onClick:function(){
	        		  myform.submit();//表单提交
	        	  }
	          }
			]
		};
		btnUI.elements = uitls.extUIs(btnUI.elements,extBtns);//扩展按钮
		tableUI.formUI = null;
		var forms = tableUI.hiddenInput || [];//隐藏域
		tableUI.hiddenInput = null;//清空
		forms.push(tableUI);//表单
		if(btnUI.elements.length > 0)//是否包含按钮
			forms.push(btnUI);//按钮
		formUI.elements = forms;
		var formObj =  extUI.createUI(jqObj,formUI);
		var myform = formObj.findUI();
	});
	
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

})();
/*
---------------定义扩展组件****************
*/

