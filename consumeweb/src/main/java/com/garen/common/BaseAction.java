package com.garen.common;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang3.StringUtils;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.garen.common.doc.ExportBean;
import com.garen.common.doc.ExportUtils;
import com.garen.common.doc.IExportBean;
import com.garen.sys.entity.DtUser;
import com.garen.sys.web.SysFilter;
import com.garen.utils.DateUtils;
import com.garen.utils.FileUtils;
import com.garen.utils.LangUtils;
import com.garen.utils.MapBuilder;

/*
 * 加入关于用户登录的信息
 * */
public class BaseAction extends AbstractAction {

	protected final  static String  QUERY_MAC = "query_mac";
	
	protected final static String  USER_NAME = "user_name";
	
	//创建map对象
	public static MapBuilder createMap(){
		MapBuilder mapbuild = new  MapBuilder();
		HttpServletRequest request = AbstractFilter.getRequest();
		if(request != null)
			mapbuild.put("ip", AbstractFilter.getRequest().getRemoteAddr());
		else 
			mapbuild.put("ip", "127.0.0.2");
		return mapbuild;
	}
	
    @SuppressWarnings("unchecked")
	public static void  exportDoc(ExportBean eb,IExportBean exportBean){ 
		List<GridBean> exportList = JSON.parseArray(eb.getExportStr(), GridBean.class);
		int index = 1;
		//加入索引
		for(Map<String,Object> map : (List<Map<String,Object>>)eb.getRows()){
			map.put("index", index++);
		}
        File xlsFile = null;
        String docType = eb.getExportType();
        if("pdf".equals(docType))
        	xlsFile = ExportUtils.exportPdf(exportList, eb, 
        			exportBean, eb.getExportTitle());
        else if("xls".equals(docType))
        	xlsFile = ExportUtils.exportXls(exportList, eb, 
        			exportBean, eb.getExportTitle());
        else if("xlsx".equals(docType))
        	xlsFile = ExportUtils.exportXlsx(exportList, eb, 
        			exportBean, eb.getExportTitle());
        if (xlsFile == null) {
        	eb.setRetInfo(-2,"导出错误 !"); 
        } else {
            String fileKey = xlsFile.getName();
            log.debug(xlsFile.getName());
            eb.setInfo(fileKey);
            HttpSession session = SysFilter.getSession();
            //缓存session中
            session.setAttribute(fileKey, xlsFile);
        } 
    }  
	//返回json格式
	public static ModelAndView JsonEx(ExportBean jp,IExportBean exportBean){
		try {
			if(jp.isExport()) exportDoc(jp,exportBean);
			else exportBean.queryRow(jp);
			String json_str = toJSON(jp);
			responseStream(AbstractFilter.getResponse(),
					json_str.getBytes("utf-8"),HTTP_MIME_TYPE_JSON);
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		return null;
	}
		
	/*//获取登录用户帐号*/
	protected String getLoginName() {
		DtUser user = getSessionUser();
		return user.getUserLname();
	}
	//获取登录帐号
	protected DtUser getSessionUser() {
		return (DtUser)SysFilter.getSession().getAttribute(SysFilter.USER);
	}
	//解析json
	protected JSONObject parseJson() {
		InputStream in;
		try {
			in = SysFilter.getRequest().getInputStream();
			String jsonStr = new String(FileUtils.readbodydata(in, 0),"utf-8");
			return JSON.parseObject(jsonStr);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}
	//解析json数据
	protected JSONArray parseJsonArray() {
		InputStream in;
		try {
			in = SysFilter.getRequest().getInputStream();
			String jsonStr = new String(FileUtils.readbodydata(in, 0),"utf-8");
			return JSON.parseArray(jsonStr);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}
		
	//解析json
	protected Map<String,Object> parseJsonMap(JsonPage jp) {
		JSONObject json = parseJson();
		if(json != null) {
			return (Map<String,Object>)json;
		}
		return new HashMap<>();
	}

	//格式化金额  元转分
	protected static String formatMoney2FEN(String money){
		if(StringUtils.isEmpty(money)) return "";
		if("0.00".equals(money)){
			money = "0";
		}else{
			if(money.indexOf(".")!=-1){
				money = money.replace(".","");
			}
		}
		return money;
	}
	
	//格式化金额  分转元
	public static Map<String,Object> formatMoney2YUAN(Map<String,Object> map, String money){
		if(StringUtils.isEmpty(money) || map == null) return map;
		Object obj = map.get(money);
		if(obj instanceof Integer){
			int o = (Integer)obj;
			int a = o/100;
			int b = Math.abs(o%100);
			if(b==0){
				map.put(money+"_str", a+".00");
			}
			else{
				if((b+"").length()>1){
					//负数的绝对值小于100后除100等于0，负号会丢失
					if(o<0 && Math.abs(o)<100){
						map.put(money+"_str", "-"+a+"."+b);
					}else{
						map.put(money+"_str", a+"."+b);
					}
				}else{
					if(o<0 && Math.abs(o)<100){
						map.put(money+"_str", "-"+a+".0"+b);
					}else{
						map.put(money+"_str", a+".0"+b);
					}
				}
			}
		}else if(obj instanceof String){
			int o = LangUtils.s2int(obj.toString());// Integer.parseInt((String)obj);
			int a = o/100;
			int b =  Math.abs(o%100);
			if(StringUtils.isEmpty(obj.toString())){
				map.put(money+"_str", "");
			}
			else if(b==0){
				map.put(money+"_str", a+".00");
			}
			else{
				if((b+"").length()>1){
					//负数的绝对值小于100后除100等于0，负号会丢失
					if(o<0 && Math.abs(o)<100){
						map.put(money+"_str", "-"+a+"."+b);
					}else{
						map.put(money+"_str", a+"."+b);
					}
				}else{
					if(o<0 && Math.abs(o)<100){
						map.put(money+"_str", "-"+a+".0"+b);
					}else{
						map.put(money+"_str", a+".0"+b);
					}
				}
			}
		}else if(obj instanceof Double){
			
		}
		return map;
	}
	
	//格式化金额  分转元
	public static Map<String,Object> formatMoney2Excel(Map<String,Object> map, String money){
		if(StringUtils.isEmpty(money) || map == null) return map;
		Object obj = map.get(money);
		if(obj instanceof Double){
			map.put(money, String.format("%.2f", obj));
		}
		return map;
	}
		
	public static List<Map<String,Object>> formatMoney2Excel(List<Map<String,Object>> mapList,
			String moneys){
		if(StringUtils.isEmpty(moneys) || mapList == null) return mapList;
		String [] moneya = moneys.split(",");
		for(Map<String,Object> map : mapList){
			for(String money : moneya){
				formatMoney2Excel(map,money);
			}
		}
		return mapList;
	}
	
		
	public static List<Map<String,Object>> formatMoney2YUAN2(List<Map<String,Object>> mapList,
			String moneys){
		if(StringUtils.isEmpty(moneys) || mapList == null) return mapList;
		String [] moneya = moneys.split(",");
		for(Map<String,Object> map : mapList){
			for(String money : moneya){
				formatMoney2YUAN(map,money);
			}
		}
		return mapList;
	}
	
	//格式化日期
	public static List<Map<String,Object>> formatDateMapList(List<Map<String,Object>> mapList,String dates){
		if(StringUtils.isEmpty(dates) || mapList == null) return mapList;
		String [] datea = dates.split(",");
		for(Map<String,Object> map : mapList){
			for(String date : datea){
				Object obj = map.get(date);
				if(obj instanceof Long) obj = new Date((Long)obj);
				if(obj instanceof Date){
					map.put(date + "_str", 
							DateUtils.date2str((Date)obj, "yyyy-MM-dd"));
				}
			}
		}
		return mapList;
	}
	
	//格式化时间
	public static List<Map<String,Object>> formatTimeMapList(List<Map<String,Object>> mapList,String dates){
		if(StringUtils.isEmpty(dates) || mapList == null) return mapList;
		String [] datea = dates.split(",");
		for(Map<String,Object> map : mapList){
			for(String date : datea){
				Object obj = map.get(date);
				if(obj instanceof Long) obj = new Date((Long)obj);
				if(obj instanceof Date){
					map.put(date + "_str", 
							DateUtils.date2str((Date)obj, "yyyy-MM-dd HH:mm:ss"));
				}
			}
		}
		return mapList;
	}
			
}
