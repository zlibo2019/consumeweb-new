package com.garen.utils.doc.filter.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.garen.utils.LangUtils;
import com.garen.utils.doc.filter.IDataFilter;

public class SubTotalFilterImpl implements IDataFilter {

	protected static Log log = LogFactory.getLog(SubTotalFilterImpl.class);
	
	//获取单元格小计列
	private Map<String,List<String>> getSubTotalDefine(JSONObject jobj){
		Map<String,List<String>> map = new HashMap<>();
		JSONArray columns = jobj.getJSONArray("columns");
		for(Object obj1 : columns){
			JSONArray column = (JSONArray)obj1;
			for(Object obj2 : column){
				JSONObject jmap = (JSONObject)obj2;
				String key = jmap.getString("subtotal");
				if(StringUtils.isEmpty(key)) continue;
				String field = jmap.getString("field");
				map.put(field, LangUtils.str2StrList(key));
			}
		}
		return map;
	}
	
	@Override
	public JSONArray filter(JSONObject jobj, JSONArray datalist,int flag) {
		Map<String,List<String>>  map = getSubTotalDefine(jobj);
		for(Object obj : datalist){
			JSONObject jdata = (JSONObject)obj;
			for(String key : map.keySet()){
				long sum = 0;
				for(String field : map.get(key)){
					sum += LangUtils.getLongValue(jdata,field);
				}
				jdata.put(key, sum);
			}
		}
		return datalist;
	}

}
