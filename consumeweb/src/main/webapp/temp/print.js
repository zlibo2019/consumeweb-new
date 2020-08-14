/**
 * 
 */

$(function(){
	var mainBody = $("body");
	$.print("abcd");
	mainBody.loadUI({
		eName:'linkbutton',
		text:'测试6',
		cssStyle:'margin:10px',
		width:110,
		onClick:function(){
			window.aa = $("iframe")[0];
			var win = $("iframe")[0].contentWindow;//.print();
			
			$("iframe").attr("src","print.jsp?_" + new Date().getTime());
		}
	});
});

