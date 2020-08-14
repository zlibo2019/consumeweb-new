package com.garen.sys.dao.impl;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Repository;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.garen.common.BaseAction;
import com.garen.common.JsonPage;
import com.garen.sys.dao.ICommonDao;
import com.garen.utils.CommonUtils;
import com.garen.utils.FileUtils;

/*通用语句*/
@Repository
public class CommonDaoImpl  implements ICommonDao {

	private static Log log = LogFactory.getLog(CommonDaoImpl.class);   
	private String serverUrl;
	private static final int HTTP_TIMEOUT = 1000 * 30;
	private String cookie;
	
	@PostConstruct
	private void init(){
		String url = CommonUtils.readXMLValue("/conf/ws.xml", "ws.url");
		if(url == null) {
			String port = CommonUtils.readXMLValue("/conf/server.xml", "Service.Connector(0)[@port]");
			if(port == null) port = "8081";  //正式环境
//			port = "8081";                 //测试环境
			url = "127.0.0.1:" + port;
		}
//		serverUrl = "http://" + url+ "/";       //测试环境
		serverUrl = "http://" + url + "/consumews/";     //正式环境
		log.debug("web services地址" + serverUrl);
	}
	
	public JsonPage autoLogin() {
		JsonPage jp = new JsonPage();
		if(cookie != null) return jp;
		Map<String,Object> paramMap = BaseAction.createMap()
				.put("account", "admin")
				.put("password", "123")
				.build();
		try {
			jp = httpCall(jp,serverUrl + "sys/login.do",
					JSON.toJSONString(paramMap).getBytes("utf-8"));
			if(-2 != jp.getId()){
				setCookie((String)jp.getObj());
				log.debug("登录成功");
			}else log.debug("登录失败");
		} catch (UnsupportedEncodingException e) {
			log.error("登录异常" + e.getMessage());
			jp.setRetInfo(-2,"服务器异常,请联系管理员 !");
		}
		return jp;
	}

	@Override
	public JsonPage remoteCall(JsonPage jp,String method, Map<String, Object> paramMap) {
		log.debug(paramMap);
		return remoteCall(jp,method,JSON.toJSONString(paramMap));
	}
	
	@Override
	public JsonPage remoteCall(JsonPage jp,String method, String params) {
		if(method.endsWith(".do") == false) method += ".do";
		try {
			autoLogin();//登录
			jp = httpCall(jp,serverUrl + method,params.getBytes("utf-8"));
			if(jp == null || -404 == jp.getId()){
				log.debug("重新登录");
				cookie = null;
				jp = autoLogin();
				if(0 == jp.getId())
					jp = httpCall(jp,serverUrl + method,params.getBytes("utf-8"));
				else {
//					jp.setRetInfo(-2, "重新登录失败");
				}
			}
		} catch (UnsupportedEncodingException e1) {
			log.error(e1.getMessage());
		}
		return jp;
	}
	
	private JsonPage httpCall(JsonPage jp,String httpUrl,byte[] bpost){
		log.debug(httpUrl);
		byte bb[] = null;
		HttpURLConnection urlconn = null;
		InputStream in = null;
		try {
			URL url = new URL(httpUrl);
			urlconn = (HttpURLConnection)url.openConnection();
			urlconn.setRequestMethod("POST");
			urlconn.setDoOutput(true);
			urlconn.setConnectTimeout(HTTP_TIMEOUT);
			urlconn.setReadTimeout(HTTP_TIMEOUT);
			urlconn.setRequestProperty("Content-Type", "application/json");
			if(cookie != null)
				urlconn.setRequestProperty("Cookie", cookie);
			urlconn.connect();
			OutputStream os = urlconn.getOutputStream();
			os.write(bpost);
			os.close();
			int code = urlconn.getResponseCode();
			if (code == 200) {
				in = urlconn.getInputStream();
			}else{
				in = urlconn.getErrorStream();
			}
			if(in == null) return null;
			bb = FileUtils.readbodydata(in, 0);
			String jsonstr = new String(bb,"utf-8");
			//log.debug(jsonstr);
			JsonPage jp1 = JSON.parseObject(jsonstr, JsonPage.class);
			//复制字段
			jp.setId(jp1.getId());
			jp.setInfo(jp1.getInfo());
			jp.setObj(jp1.getObj());
			
			jp.setTotal(jp1.getTotal());
			jp.setRecord(jp1.getRecord());
			jp.setRetData(jp1.getRetData());
			jp.setRetDatas(jp1.getRetDatas());
		}catch (Exception e) {
			log.error(e.getMessage());
			jp.setRecord(new JSONArray());//空数组
			jp.setRetInfo(-2, "服务器异常,请联系管理员 !");
		} finally{
			if(null != urlconn) urlconn.disconnect();
			if(null != null)
				try {
					in.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
		}
		return jp;
	}
	
	public String getCookie() {
		return cookie;
	}

	public void setCookie(String cookie) {
		this.cookie = cookie;
	}
	
	
}
