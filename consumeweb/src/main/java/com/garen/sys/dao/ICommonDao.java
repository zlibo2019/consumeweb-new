package com.garen.sys.dao;

import java.util.Map;

import com.garen.common.JsonPage;

public interface ICommonDao {

	//远程调用
	JsonPage remoteCall(JsonPage jp,String method,Map<String,Object> paramMap);

	//远程调用
	JsonPage remoteCall(JsonPage jp,String method,String params);
		
	//设置cookie
	void setCookie(String obj);
	
}
