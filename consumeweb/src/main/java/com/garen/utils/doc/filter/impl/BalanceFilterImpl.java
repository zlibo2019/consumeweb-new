package com.garen.utils.doc.filter.impl;

import java.util.Map;
import java.util.TreeMap;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.garen.utils.LangUtils;
import com.garen.utils.doc.filter.IDataFilter;

//
public class BalanceFilterImpl implements IDataFilter {

	protected static Log log = LogFactory.getLog(BalanceFilterImpl.class);
	
	private static String SUM_FLAG = "#sum#";
	private static String[] subjectTypeNames = new String[]{"一、资产类|【资产合计】",
			"二、负债类|【负债合计】","三、权益类|【权益合计】"};
	
	//销户处理
	private JSONArray destroy(JSONObject jobj, JSONArray datalist){
		JSONObject jrow = new JSONObject();
		long sum1 = 0,sum2 = 0;
		for(Object obj : datalist){
			jobj = (JSONObject)obj;
			sum1 += LangUtils.getLongValue(jobj, "total_amt");
			sum2 += LangUtils.getLongValue(jobj, "total_deposit_amt");
		}
		jrow.put(FILTER_destroy_FLAG, true);//合计标志
		jrow.put("count", datalist.size());
		jrow.put("sum1", String.format("%.2f", sum1 / 100.0));
		jrow.put("sum2", String.format("%.2f", sum2 / 100.0));
		datalist.add(jrow);
		return datalist;
	}
	
	//资产负债表数据转换
	private JSONArray balance(JSONObject jobj, JSONArray datalist){
		log.debug(datalist);
		Map<String,JSONArray> map =  list2map(datalist);
		log.debug(map);
		datalist.clear();//清空
		JSONArray jarr1 = new JSONArray(),jarr2 = new JSONArray();
		String key = null;
		//资产类
		key  = subjectTypeNames[0];
		int a = map2List(key,jarr1,map.get(key),1);
		//负债类
		key  = subjectTypeNames[1];
		a = map2List(key,jarr2,map.get(key),a);
		//权益类
		key  = subjectTypeNames[2];
		map2List(key,jarr2,map.get(key),a);
		//总合计
		datalist.addAll(mergeList(jarr1,jarr2));
		for(Object obj : datalist){
			JSONObject data = (JSONObject)obj;
			//formatData(data,"");
			//formatData(data,"1");
		}
		return datalist;
	}
		
	@Override
	public JSONArray filter(JSONObject jobj, JSONArray datalist,int flag) {
		String wsUrl = jobj.getString("wsUrl");
		if("finweb/report/finance/balance.do".equals(wsUrl))
			return balance(jobj,datalist);
		//取消销户处理，改为报表工具的合计
		/*else if("/finweb/report/operator/destroy.do".equals(wsUrl))
			return destroy(jobj,datalist);*/
		else if("/finweb/report/subject/dailyCount.do".equals(wsUrl) ||
				"/finweb/report/subject/daily.do".equals(wsUrl)){
			dailyFilter(datalist);
		}
		return datalist;
	}
	
	//合并list
	private JSONArray mergeList(JSONArray jarr1,JSONArray jarr2){
		int size = 0,size1 = jarr1.size(),size2 = jarr2.size();
		size = size1 > size2?size1:size2;
		JSONArray jarr = new JSONArray();
		JSONObject jobj = null;
		long sum1 = 0,sum2 = 0,sum3 = 0,sum4 = 0;
		for(int i = 0;i < size;i++){
			jobj = (i < size1)?jarr1.getJSONObject(i):new JSONObject();
			if(jobj.containsKey(SUM_FLAG)){
				sum1 += LangUtils.getLongValue(jobj, "begin_amt");
				sum2 += LangUtils.getLongValue(jobj, "end_amt");
			}
			if(i < size2){
				JSONObject obj = jarr2.getJSONObject(i);
				for(String key : obj.keySet()){
					jobj.put(key+"1", obj.get(key));
				}
				if(obj.containsKey(SUM_FLAG)){
					sum3 += LangUtils.getLongValue(obj, "begin_amt");
					sum4 += LangUtils.getLongValue(obj, "end_amt");
				}
			}
			jarr.add(jobj);
		}
		jarr.add(new JSONObject());//空行
		jobj = new JSONObject();
		jobj.put("subject_name", "资产部类总计");
		jobj.put("begin_amt", sum1);
		jobj.put("end_amt", sum2);
		
		jobj.put("subject_name1", "负债部类总计");
		jobj.put("begin_amt1", sum3);
		jobj.put("end_amt1", sum4);
		jobj.put(TOTAL_FLAG, true);
		jarr.add(jobj);
		return jarr;
	}
	
	private int map2List(String keyName,JSONArray datalist,
			JSONArray destlist,int index){
		log.debug(destlist);
		String[] strs = keyName.split("\\|");
		String key1 = strs[0];
		String key2 = strs[1];
		JSONObject jobj = new JSONObject();
		jobj.put("subject_name", key1);
		datalist.add(jobj);
		long sum1 = 0,sum2 = 0;
		for(Object obj : destlist){
			jobj = (JSONObject)obj;
			String subjectNo = jobj.getString("subject_no");
			if(StringUtils.isEmpty(subjectNo)) continue;
			if(subjectNo.length() == 4){
				sum1 += LangUtils.getLongValue(jobj, "begin_amt");
				sum2 += LangUtils.getLongValue(jobj, "end_amt");
			}
			jobj.put("number", index++);
			datalist.add(jobj);
		}
		jobj = new JSONObject();
		jobj.put(SUM_FLAG, key2);//总计标记
		jobj.put("subject_name", key2);
		jobj.put("begin_amt", sum1);
		jobj.put("end_amt", sum2);
		jobj.put("number", index++);
		datalist.add(jobj);
		datalist.add(new JSONObject());//空行
		return index;
	}
	
	//格式化数据
	private void formatData(JSONObject jobj,String flag){
		//if(jobj instanceof JSONObject) return;
		String subjectNo = jobj.getString("subject_no" + flag);
		String subjectName = jobj.getString("subject_name" + flag);
		String space = "",space1 = "";
		if(StringUtils.isEmpty(subjectNo)) return;
		
		if(subjectNo.length() == 4){
			space = "&nbsp;";
		}else if(subjectNo.length() > 4){
			space = "&nbsp;&nbsp;";
			space1 = "&nbsp;&nbsp;";
		}
		if(subjectName != null)
			jobj.put("subject_name" + flag,space + subjectName);
		jobj.put("subject_no" + flag,space1 + subjectNo);
	}
	
	//按照subject_type值分组成map
	private Map<String,JSONArray> list2map(JSONArray datalist){
		Map<String,JSONArray> map = new TreeMap<>();
		for(Object obj : datalist){
			JSONObject jobj = (JSONObject)obj;
			int subjectType = jobj.getIntValue("subject_type");
			if(subjectType > subjectTypeNames.length) subjectType = 1;
			String key = subjectTypeNames[subjectType - 1];
			JSONArray jarr = map.get(key);
			if(jarr == null){
				jarr = new JSONArray();
				map.put(key, jarr);
			}
			jarr.add(jobj);
		}
		//map.put(subjectTypeNames[2], new JSONArray());
		return map;
	}
	
	private void dailyFilter(JSONArray datalist){
		for(Object obj : datalist){
			JSONObject data = (JSONObject)obj;
			formatData(data,"");
			formatData(data,"1");
		}
	}
}
