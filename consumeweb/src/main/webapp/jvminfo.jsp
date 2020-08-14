<?xml version="1.0" encoding="utf-8" ?>
<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<style type="text/css">
body{
font-size:14px;
}
</style>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<title>运行状态监控</title>
<%@page  import="java.lang.management.*" %>
<%@page  import="java.lang.management.*" %>
<%@page  import="java.util.*" %>
<%@page  import="org.apache.tomcat.dbcp.dbcp.BasicDataSource" %>
<%@page  import="javax.naming.*" %>
<%@ include file="/WEB-INF/taglib.jsp"%>
</head>
<body>
<%--jsp页面注释 --%>
<div>
当前并发数:${onLine.onLine},最大并发数:${onLine.maxonLine} <button type="button">清空数据</button>
<div style="height:200px;overflow:auto;width:600px;">
<table class="ui_table">
<c:forEach items="${onLine.sortAppRsList()}" var="appRs">
	<tr>
		<td>
			${appRs.count}
		</td>
		<td>
			${appRs.time}ms
		</td>
		<td>
			${appRs.uri}
		</td>
	</tr>
</c:forEach>
</table>
</div>
</div>
<%
	out.print(request + "<br/>");
	out.print("<div style='font-size:16px;font-weight:700;'>基本信息</div>");
	out.print(printBase(request));
	out.print("<div style='font-size:16px;font-weight:700;'>线程信息</div>");
	out.print(printThread("http-bio-8080-exec"));
	out.print("<div style='font-size:16px;font-weight:700;'>请求包</div>");
	out.print(printRequest(request));
	out.print("<div style='font-size:16px;font-weight:700;'>内存信息</div>");
	out.print(printMem());
	out.print(getDBCP("jdbc/garenweb"));
%>

<%!
	private static int aa = 0;

	String test(JspWriter out){
		return out + "hello world";
	}
	
	/*
	输出线程信息,过滤器
	*/
	private String printThread(String filter){
		Map<Thread, StackTraceElement[]> maps = Thread.getAllStackTraces(); 
		Iterator<Thread> it = maps.keySet().iterator();
		String ret = "";
		while(it.hasNext()){
			Thread thread = (Thread)it.next();
			String aa = thread.getName() + "==" + thread.getThreadGroup().getName() + " == " + thread.getState().name()+ "<br/>";
			if(filter == null || aa.indexOf(filter) != -1){
				ret += aa;
			}
		}
		return ret;
	}
	
	//获取连接池情况
	private String getDBCP(String jndi){
		Context initCtx;
		String ret = null;
		try {
			initCtx = new InitialContext();
			 BasicDataSource bds = (BasicDataSource)initCtx.lookup("java:comp/env/" + jndi);
			 initCtx.close();     
			 ret = "当前活动连接数=" + bds.getNumActive() + "空闲数" + bds.getNumIdle();
		} catch (NamingException e) {
			e.printStackTrace();
		}
	   return ret;
	}
	/*
	 输出基本信息
	*/
	private String printBase(HttpServletRequest request){
		RuntimeMXBean mxbean = ManagementFactory.getRuntimeMXBean();
		String ret = "<div id=\"abcd\">进程ID: " + mxbean.getName() + "  线程: "+ Thread.currentThread() + " </div>ClientIP=" +
				request.getRemoteAddr() + ":" +   request.getRemotePort() +  "  HostIP=" +
				request.getRemoteHost() +   "<br/> ServerIP=" +
				request.getLocalAddr() + ":" +   request.getLocalPort() + "=" + this + "<br/>";
		return ret;
	}
	
	/*
	输出request信息
	*/
	private String printRequest(HttpServletRequest request){
		Enumeration<String> e = request.getHeaderNames();
		String ret = "";
		while(e.hasMoreElements()){
			String key = (String)e.nextElement();
			ret += key  + "==" + request.getHeader(key) +  " <br/>";
		}
		return ret;
	} 
	
	/*
	 输出内存使用情况
	*/
	private String printMem(){
		List<MemoryPoolMXBean> mpools = ManagementFactory.getMemoryPoolMXBeans();
		Iterator<MemoryPoolMXBean> it = mpools.iterator();
		String ret = "";
		while(it.hasNext()){
			MemoryPoolMXBean mmx = (MemoryPoolMXBean)it.next();
			ret += mmx.getName() + "==" + getB2M(mmx.getUsage().getInit()) + "/" +  getB2M(mmx.getUsage().getUsed()) + "/"+ getB2M(mmx.getUsage().getMax()) +  "  ==" + mmx.getType() + "<br/>";
		}
		return ret;
	}
	
	/*
	整数转换 KB MB B字符格式
	*/
	private String getB2M(long num){
		if(num < 0)  return " " + num;
		long a = 1024;
		long b = a * a;
		String c = null;
		if(num > b)
			c =  num / b + " MB";
		else if(num > a)
			c = num / a + " KB";
		else 
			c = num  + " B";
		return c;
	}
%>
<script type="text/javascript" src="themes/jquery.js"></script>
<script type="text/javascript" src="themes/tools.js"></script>
<script type="text/javascript">
	$(function(){
		$('button').click(function(){
			$.postEx('clearData.do');
		});
	});
</script>
</body>


</html>