garen_define("js/account/drawCash_correction_searchWin",function (jqObj,loadParams) {

	var columns = [//列字段定义
     	[ {
      		field : 'user_no',
      		title : '学/工号',
      		align : "center",
      		width : 70
      	}, {
      		field : 'dep_name',
      		title : '部门',
      		align : "center",
      		width : 120
      	}, {
      		field : 'user_lname',
      		title : '姓名',
      		align : "center",
      		width : 80
      	}, {
      		field : 'account_end_date_str',
      		title : '账户有效期',
      		align : "center",
      		width : 120
      	}, {
      		field : 'account_state_name',
      		title : '账户状态',
      		align : "center",
      		width : 80
      	}] ];
	
	
	var searchWinUI = {
		eName:"div",
		cssClass:"drawCash_correction_searchWin",
		elements:[{
			eName:"fieldset",
			width:500,
			height:210,
			elements:[{
				eName:'legend',
				text:'选择人员'
			},{
				eName:"div",
				height:180,
				width:490,
				cssStyle:"margin:5px;",
				elements:{
					eName : 'datagrid',
					id:"dataTable",
					idField : 'account_id',
					//url:chargeQuery,
					columns : columns,
					pagination: false,
					clientPager:false,
					showFooter:true,
					alertFlag : false,// 是否弹出默认对话框
					autoload : false,
					singleSelect:true,
					checkOnSelect:true,
					selectOnCheck:true
				}
			}]
		},{
			eName:"div",
			elements:{
				eName:"linkbutton",
				uId:"tm1",
				cssClass:"drawCash_correction_searchWin_linkbutton",
				text : '确认',
				width : 80,
				height : 35,
				onClick:function(){
					var row = dataTable.datagrid("getSelected");
					if(row == null){
						jqObj.window("close");
					}else{
						var arr = row.account_end_date_str.split("-");
						var starttime = new Date(arr[0], arr[1]-1, arr[2], '23', '59', '59');
						var starttimes = starttime.getTime();
						if(row.account_state_code==0 && starttimes >= new Date().getTime()){
							loadParams.callback(row);
							jqObj.window("close");
						}else{
							$.alert("请选择在有效期内并且正常的账户！");
						}
					}
				}
			}
		}]
	}
	
	jqObj.loadUI(searchWinUI);
	var dataTable = jqObj.findJq("dataTable");
	
	dataTable.datagrid("loadDataEx",loadParams.params);
});