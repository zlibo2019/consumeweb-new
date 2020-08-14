package com.garen.base.biz;

import com.alibaba.fastjson.JSONObject;
import com.garen.common.JsonPage;

//报表相关模块
public interface IReportBiz {

	JSONObject getReport(JsonPage jp,String reportName);
	
	JSONObject getReport(JsonPage jp,String reportName,String gly);
	
}
