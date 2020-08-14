package com.garen.sys.biz;

import java.io.File;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.garen.common.JsonPage;

public interface ISysBiz {

	//用户登录
	//JsonPage login(JsonPage jp);

	//void setCookie(String cookie);
	//pdf解析器
	File parsePdf(JsonPage jp,JSONObject jobj,String params,
			JSONArray headers,JSONArray footers,JSONArray headerExs);
	//xls解析器
	File parseXls(JsonPage jp,JSONObject jobj,String params,
				JSONArray headers,JSONArray footers,JSONArray headerExs);
	//获取报表数据
	JsonPage getReportData(JsonPage jp, JSONObject jobj, String params);

	//只获取数据
	JsonPage getReportData(JsonPage jp, String wsUrl, String params);
}
