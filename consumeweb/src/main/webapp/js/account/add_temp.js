garen_define("js/account/add_temp",function (jqObj,loadParams) {
	var jmjlink = garen_require("js/lib/jmjlink");
	jqObj.loadUI({
		eName:"div",
		width:350,
		height:350,
		cssStyle:"border:1px solid red;",
		elements:[{
			eName:"linkbutton",
			text:"加载数据",
			onClick:function(){
				$.print("abcd");
				//functionQuery/tradingWaterQuery/tradWaterQuery.do
				var params = {
					cx_type:0,
					start_date:2016-10-01,
					end_date:2016-10-31,
					trad_type:3,
					pageNum:1,
					pageSize:30,
					
				}
			}
		},{
			eName:"linkbutton",
			text:"数据排序",
			onClick:function(){
				$.print("1234");
			}
		}]
	});
	
});

