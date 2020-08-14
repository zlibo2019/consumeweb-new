package com.garen.utils.doc.filter.impl;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.garen.utils.LangUtils;
import com.garen.utils.doc.filter.IDataFilter;

//全部合计
public class TotalFilterImpl implements IDataFilter {

	protected static Log log = LogFactory.getLog(TotalFilterImpl.class);
	
	
	//过滤记录
	boolean filterRow(JSONObject jobj,JSONObject row){
		boolean ret = true;
		String wsUrl = jobj.getString("wsUrl");
		if("/finweb/report/subject/dailyCount.do".equals(wsUrl)
				|| "/finweb/report/subject/daily.do".equals(wsUrl)){
			String subjectNo = row.getString("subject_no");
			if(subjectNo.length() > 4) ret = false;
		}
		return ret;
	}
	@Override
	public JSONArray filter(JSONObject jobj, JSONArray datalist,int flag) {
		JSONObject jtable = jobj.getJSONObject("table");
		JSONObject jtotal = jtable.getJSONObject("total");
		if(null == jtotal) return datalist;
		String totalName = jtotal.getString("name");
		if(StringUtils.isEmpty(totalName)) return datalist;
		List<String> fieldlist = LangUtils.str2StrList(jtotal.getString("fields"));
		if(LangUtils.listIsNull(fieldlist)) return datalist;
		JSONObject sumobj = new JSONObject();
		sumobj.put(totalName, "合计");
		sumobj.put(TOTAL_FLAG, true);//合计标志
		sumobj.put(TOTAL_COUNT_FLAG, jtotal.get("colspan"));
		for(Object obj : datalist){
			JSONObject row = (JSONObject)obj;
			if(false == filterRow(jobj,row)) continue;
			for(String key : row.keySet()){//要统计的字段
				if(totalName.equals(key)) continue;
				if(fieldlist.contains(key) == false) continue;
				long sum = LangUtils.getLongValue(sumobj,key);
				sum +=  LangUtils.getLongValue(row,key);
				sumobj.put(key, sum);
			}
		}
		datalist.add(sumobj);
		return datalist;
	}

}
