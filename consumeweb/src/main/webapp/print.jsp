<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<!DOCTYPE html>
<html>
<head>
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=EDGE;IE=10;IE=9;IE=8">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
</head>  
<body onload="abcd();">
我的打印测试111<input type="button" value="aaa"/>
<script type="text/javascript">
window.parent.aa.focus();
function abcd(){
	
	window.print();
	/* window.setTimeout(function(){
		window.aa();
		
	},3000); */
}

</script>
</body>
</html>
