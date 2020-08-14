/**
 * 
 */

$(function(){
	var utils = garen_require("utils");
	var mainBody = $("body");
	
	test1();
	
	//测试html元素批量生成
	function test1(){
		var ui = {
			eName:"layoutExt",
			fit:false,
			cssStyle:"border:1px solid red;padding:0px;",
			outerWidth:0.3,
			outerHeight:0.2,
			debug:true,
			elements:[{
				region:"center",
				elements:{
					eName:"progressBar",
					height:50,
					text:'冻结进度'
				}
			},{
				region:"south",
				height:30,
				elements:[{
					eName:"linkbutton",
					cssStyle:"margin:auto 3px auto 3px;",
					text:"开始",
					onClick:function(){
						bar.progressBar('start');
						utils.showMask(true);
						window.setTimeout(function(){
							bar.progressBar('stop',{
								eName:"div",
								height:'100%',
								cssStyle:"color:red;font-size:22px;",
								text:"操作完毕"
							});
						},3000);
					}
				},{
					eName:"linkbutton",
					cssStyle:"margin:auto 6px auto 6px;",
					text:"结束",
					onClick:function(){
						bar.progressBar('stop');
					}
				}]
			}]
		}
		mainBody.createUI(ui);
		var bar = mainBody.findJq('progressBar');
	}

});

