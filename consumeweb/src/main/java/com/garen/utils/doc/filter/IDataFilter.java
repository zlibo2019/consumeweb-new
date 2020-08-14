package com.garen.utils.doc.filter;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

//报表数据过滤器
public interface IDataFilter {

	public static String TOTAL_FLAG = "##total##";
	public static String TOTAL_COUNT_FLAG = "##total_count##";
	public static String GROUPTOTAL_FLAG = "##grouptotal##";
	public static String GROUPTOTAL_COUNT_FLAG = "##group_count_total##";
	public static String GROUPTOTALOFFSET_FLAG = "##grouptotal_offset##";//合计偏移量
	public static String FILTER_destroy_FLAG = "##destroy_flag##";
	
	//Yaunwen控制标记 1 不统计小计
	JSONArray filter(JSONObject jobj,JSONArray datalist,int flag);
	
}
