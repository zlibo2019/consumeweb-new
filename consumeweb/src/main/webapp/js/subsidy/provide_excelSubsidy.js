//补贴导入
garen_define("js/subsidy/provide_excelSubsidy",function (jqObj,loadParams) {
	
	var userImportCheck = "subsidy/userImportCheck.do";//列表导入检测
	
	var addRuleUI = {
		eName:"div",
		elements:{
			eName:"formUI",
			id:"importForm",
			url:userImportCheck,
			method:"post",//上传表单时，必须设置此值
			alertFlag:true,
			progressBar:"保存中...",
			enctype:"multipart/form-data",//上传附件时，必须设置此值
			onSave:function(retJson){
				if(retJson.result){
					jqObj.window("close");
					var myWin = $.createWin({
						title:"人员预览",
						width:580,
						height:550,
						queryParams:{
							params:retJson.data,
							retData:retJson.retData,
							callback:loadParams.callback
						},
						url:"js/subsidy/provide_excelSubsidy_resultWin.js"
					});
				}else{
					$.alert(retJson.info);
				}
			},
			elements:{
				eName : 'div',
				cssClass:"provide_excelSubsidy",
				elements:[{
					eName:"fieldset",
					width:420,
					elements:[{
						eName:'legend',
						text:'文件选择'
					},{
						eName:"div",
						cssClass:"provide_excelSubsidy_choose_file",
						elements:[{
							eName:"div",
							elements : [{
								eName : 'filebox',
								buttonText:'选择文件',
								accept:'application/vnd.ms-excel',
								width : 250,
								height : 31,
								uId:"tm1",
								id : "forFile",
								name:'userFile'
							},
//							{			
//								eName:"label",
//								uId:"tm1",
//								'for':'upFile',
//								cssClass:'l-btn',
//								text:"浏览"
//							},{
//								eName:'input',
//								name:'userFile',
//								id:'upFile',
//								type:'file',
//								cssClass:"provide_excelSubsidy_file_input",//在IE8下dispaly:none;会导致label不好用。
//								onChange:function(){
////									forFile.textbox("setValue",$(this).val());
////									forFile.textbox("setText",$(this).val());
//									var path = $(this).val();
//									var result = path.match(/\\([^\\]+)$/i);
//									if(result){
//										path = result[1];
//									}
//									forFile.textbox("setValue",path);
//									forFile.textbox("setText",path);
//								}
//							},{
//								eName : 'textbox',
//								id : "forFile",
//								editable:false,
//								name : '',
//								width : 230,
//								height : 25,		
//								value:''//默认值
//							},
							{
								eName : 'linkbutton',
								uId:"tm2",
								width:65,
								height:30,
								text:"导入",
								onClick : function(){
									var fileExtension = forFile.textbox("getValue").split('.').pop().toLowerCase();
									if(forFile.textbox("getValue")=="" || fileExtension != "xls" && fileExtension != "xlsx"){
										$.alert("请选择正确文件！");
									}else{
										importForm.submit();
									}
								}
							},{
								eName : 'linkbutton',
								uId:"tm1",
								width:65,
								height:30,
								text:"下载模版",
								onClick : function(){
									window.location.href="import_mould/subsidyMould.xls";
								}
							}]
							
						},{
							eName:"div",
							cssStyle:"margin-top:30px;margin-bottom:25px;",
							elements:{
								eName:"img",
								src:"image/subsidyM.gif"
							}
						}]
					}]
				}]
			}
		}
	};
	jqObj.loadUI(addRuleUI);
	
	var importForm = jqObj.findJqUI("importForm");
	var forFile = jqObj.findJq("forFile");
});