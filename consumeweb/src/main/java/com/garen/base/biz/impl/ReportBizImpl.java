package com.garen.base.biz.impl;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.garen.base.biz.IReportBiz;
import com.garen.common.BaseAction;
import com.garen.common.JsonPage;
import com.garen.sys.dao.ICommonDao;

@Service
public class ReportBizImpl implements IReportBiz {
	
	@Autowired
	private ICommonDao commonDao;
	
	@Override
	public JSONObject getReport(JsonPage jp,String reportName) {
		
		Map<String,Object> paramMap = BaseAction.createMap()
		   .put("report_name", reportName)
		   .build();
		JsonPage jp1 = commonDao.remoteCall(jp,"finweb/report/templet/get.do",paramMap);
		JSONObject jobj = null;
		for(Object obj : (JSONArray)jp1.getRows()){
			jobj = (JSONObject)obj;
			Object content = jobj.remove("report_content");
			if(content == null) continue;
			jobj.put("docJson", JSON.parse(content.toString()));
		}
		if(jobj != null){
			jp.setObj(jobj);
			jp.setRecord(null);
		}
		jp.setRetInfo(jp1.getId(), jp1.getInfo());
		return jobj;
	}
	
	@Override
	public JSONObject getReport(JsonPage jp,String reportName,String gly) {
		
		Map<String,Object> paramMap = BaseAction.createMap()
		   .put("report_name", reportName)
		   .put("gly_login", gly)
		   .build();
		JsonPage jp1 = commonDao.remoteCall(jp,"finweb/report/templet/get.do",paramMap);
		JSONObject jobj = null;
		for(Object obj : (JSONArray)jp1.getRows()){
			jobj = (JSONObject)obj;
			Object content = jobj.remove("report_content");
			if(content == null) continue;
			jobj.put("docJson", JSON.parse(content.toString()));
		}
		if(jobj != null){
			jp.setObj(jobj);
			jp.setRecord(null);
		}
		jp.setRetInfo(jp1.getId(), jp1.getInfo());
		return jobj;
	}

}
