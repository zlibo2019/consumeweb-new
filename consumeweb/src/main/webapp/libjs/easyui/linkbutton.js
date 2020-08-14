
//自定义组件
(function($){
	var uitls = garen_require("utils");
	var easyUI =  garen_require("garen_easyui");
	
	easyUI.regFn({//注册组件
		name:'linkbutton',
	    tag:'a',
	    onCreate:function(jqObj,uiOpts){
		   var menuSet = 254;
		   var uId = uiOpts.uId || "edit";
		   var menuStatus = false;
		   try{
			   menuSet = $.global.menu.menu_set;
		   }catch(e){}
		   if(getMenuSet(menuSet,uId) == false)
			   jqObj.linkbutton('disable');
	    }
	});
	
	
	function Intel_popedom(b1){
		var b0 = [4,2,8,0,0,1,4,1,1,1,64];
		var b2 = 0,ut;
		for(ut = 0;ut < b0.length;ut++){
			if(b1 & b0[ut]){
				b2 += Math.pow(2,ut);
			}else{
				if(b0[ut]==1){
					b2 += Math.pow(2,ut);
				}
			}
		}
		return b2;	
	}
	//获取菜单权限:menuset菜单权限,btnset按钮权限
	function getMenuSet(menunum,btnset){
		var menuset = Intel_popedom(menunum);
		var p = 0,ret = false;
		var Item_num=[1,2,4,8,16,32,64,128,256,512,1024,1,2,4,8,16,32,64,128,256,512,1024];
		var Item_id=["add","edit","delete","save","cancel","print",
				"import","export","search","exit","expand","tm1","tm2","tm2","tm2","tm2","tm2","tm2","tm2","tm2","tm2","tm2"];
		for (;p < Item_num.length;p++){
			//if(btnset == Item_id[p]){
				ret = (parseInt(menuset,10) & parseInt(Item_num[p],10))?true:false;
				if(ret)break;
				//break;
			//}
		}
		//$.print(btnset +","+ menunum +","+ menuset +","+ ret);
		return ret;
	}
	
})(jQuery);

