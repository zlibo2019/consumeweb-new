//修改商户
garen_define("js/merchant/manage_modifyMerchant",function (jqObj,loadParams) {
	
	var modifyMerchant = "merchant/manage/modifyMerchant.do";//新增
	
	var addDepUI = {
		eName:"div",
		cssClass:"passwordRule_addPwd_div",
		elements:[{
			eName:"div",
			elements:{
				eName:"formUI",
				id:"addForm",
				method:"post",
				alertFlag:false,
				url:modifyMerchant,
				onBeforeSave:function(params){
					if(params.merchant_name==""){
						$.alert("请输入商户名称！");
						return false;
					}
					params['merchant_account_id'] = merchant_account_id.textbox('getValue');
				},
				onSave:function(retJson){
					
					if(retJson.result){
						loadParams.callback();
						jqObj.window("close");
					}else{
						$.alert(retJson.info);
					}
				},
				elements:[{
					eName:"div",
					cssClass:"passwordRule_addPwd_nameDiv",
					elements:[{
						eName:"span",
						cssClass:"passwordRule_addPwd_span",
						elements:"商户帐号"
					},{
						eName:"textbox",
						disabled:true,
						name:"merchant_account_id",
						width:190,
						value:loadParams.params.merchant_account_id
					}]
				},{
					eName:"div",
					cssClass:"passwordRule_addPwd_nameDiv",
					elements:[{
						eName:"span",
						cssClass:"passwordRule_addPwd_span",
						elements:"商户名称"
					},{
						eName:"textbox",
						required:true,
						validType:"unnormal",
						name:"merchant_name",
						width:190,
						value:loadParams.params.merchant_name
					}]
				},{
					eName:"div",
					cssClass:"passwordRule_addPwd_nameDiv",
					elements:[{
						eName:"span",
						cssClass:"passwordRule_addPwd_span",
						elements:"商户地址"
					},{
						eName:"textbox",
						validType:"unnormal",
						name:"merchant_addr",
						width:190,
						value:loadParams.params.merchant_addr
					}]
				},{
					eName:"div",
					cssClass:"passwordRule_addPwd_nameDiv",
					elements:[{
						eName:"span",
						cssClass:"passwordRule_addPwd_span",
						elements:"联系人&nbsp;"
					},{
						eName:"textbox",
						name:"link_man",
						validType:"unnormal",
						width:190,
						value:loadParams.params.link_man
					}]
				},{
					eName:"div",
					elements:[{
						eName:"span",
						cssClass:"passwordRule_addPwd_span",
						elements:"联系电话"
					},{
						eName:"textbox",
						validType:"unnormal",
						name:"merchant_telephone",
						width:190,
						value:loadParams.params.merchant_telephone
					}]
				}]
			}
		},{
			eName:"div",
			cssStyle:"border-top:solid 2px #eee;height: 60px;line-height: 60px;",
			elements:[{
				eName:"linkbutton",
				uId:"tm2",
				text : '确定',
				cssClass : 'passwordRule_linkbutton',
				width : 70,
				height : 30,
				onClick:saveMerchant
			},{
				eName:"linkbutton",
				uId:"tm1",
				text : '取消',
				width : 70,
				height : 30,
				onClick:function(){
					jqObj.window("close");
				}
			}]
		}]
	}
	jqObj.loadUI(addDepUI);
	
	var addForm = jqObj.findJq("addForm");
	var merchant_account_id = jqObj.findJq("merchant_account_id");
	var merchant_name = jqObj.findJq("merchant_name");
	var merchant_addr = jqObj.findJq("merchant_addr");
	var link_man = jqObj.findJq("link_man");
	var merchant_telephone = jqObj.findJq("merchant_telephone");
	
	//新增部门
	function saveMerchant(){
		addForm.findJqUI().submit();
	}
	
	//文本框长度限制
	merchant_name.next().children().eq(0).attr("maxlength",40);
	merchant_addr.next().children().eq(0).attr("maxlength",40);
	link_man.next().children().eq(0).attr("maxlength",20);
	merchant_telephone.next().children().eq(0).attr("maxlength",40);
	
	//扩展验证
	$.extend($.fn.validatebox.defaults.rules, {    
        unnormal: {// 验证是否包含空格和非法字符
            validator: function (value) {
                return !/[ "'@#\$%\^&\*！!<>\\\/]+/i.test(value);
            },
            message: '输入值不能为空和包含其他非法字符'
        }
	});  
	
});