package com.garen.utils.doc.filter.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.garen.utils.DateUtils;
import com.garen.utils.LangUtils;
import com.garen.utils.doc.filter.IDataFilter;

public class DateTimeFilterImpl implements IDataFilter {
	protected static Log log = LogFactory.getLog(DateTimeFilterImpl.class);
	private List<JSONObject> getDateColumns(JSONObject jobj){
		//需要格式化日期的字段
		List<JSONObject> colList = new ArrayList<JSONObject>();
		JSONArray columns = jobj.getJSONArray("columns");
		for(Object obj1 : columns){
			JSONArray column = (JSONArray)obj1;
			for(Object obj2 : column){
				JSONObject col = (JSONObject)obj2;
				String fieldType = col.getString("filedType");
				if(StringUtils.isNotEmpty(fieldType)) {
					colList.add(col);
				}
			}
		}
		return colList;
	}
	//格式化时间
	@Override
	public JSONArray filter(JSONObject jobj, JSONArray datalist,int flag) {

		List<JSONObject> colList = getDateColumns(jobj);

		for(Object obj : datalist){
			JSONObject row = (JSONObject)obj;
			for(JSONObject colJson : colList){
				String field = colJson.getString("field");
				Long ldata = LangUtils.getLong(row,field);
				if(ldata == null) continue;
				String fieldType = colJson.getString("filedType");
				String pattern = null;
				if("datetime".equals(fieldType))
					pattern = "yyyy-MM-dd HH:mm:ss";
				else if("time".equals(fieldType))
					pattern = "HH:mm:ss";
				else if("date".equals(fieldType))
					pattern = "yyyy-MM-dd";
				else if("money".equals(fieldType)){
					row.put(field, String.format("%.2f", ldata / 100.0));
				}
				if(pattern != null){
					String sdate = DateUtils.date2str(new Date(ldata), pattern);
					if(StringUtils.isNotEmpty(sdate))
						row.put(field, sdate);
				}
			}
		}
		//datalist.add(sumobj);
		return datalist;
	}

}
