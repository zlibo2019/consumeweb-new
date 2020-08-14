//新增人群
garen_define("js/consume/peopleSet_addCrowd",function (jqObj,loadParams) {
	
	var crowdAdd = "consume/crowdAdd.do";//人群新增
	
	var addCrowdUI = {
		eName:"div",
		cssClass:"peopleSet_addCrowd_div",
		elements:[{
			eName:"div",
			elements:[{
				eName:"span",
				cssClass:"peopleSet_addCrowd_span",
				text:"人群名称"
			},{
				eName:"textbox",
				id:"crowd_name",
				width:180
			}]
		},{
			eName:"div",
			elements:[{
				eName:"linkbutton",
				uId:"tm2",
				text : '确定',
				cssClass : 'peopleSet_addCrowd_linkbutton',
				width : 80,
				height : 40,
				onClick:saveCrowd
			},{
				eName:"linkbutton",
				uId:"tm1",
				text : '取消',
				width : 80,
				height : 40,
				onClick:function(){
					jqObj.window("close");
				}
			}]
		}]
	}
	jqObj.loadUI(addCrowdUI);
	
	var crowd_name = jqObj.findJq("crowd_name");
	
	//新增部门
	function saveCrowd(){
		var params = {};
		params['crowd_name'] = crowd_name.textbox("getValue");
		$.postEx(crowdAdd,params,function(retJson){
			if(retJson.result){
				loadParams.callback();
				jqObj.window("close");
			}else{
				$.alert(retJson.info);
			}
		});
	}
});