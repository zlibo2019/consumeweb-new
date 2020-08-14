package com.garen.base;

import java.util.Map;

import javax.servlet.http.HttpSession;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.garen.base.biz.IReportBiz;
import com.garen.common.BaseAction;
import com.garen.common.JsonPage;
import com.garen.common.PageBean;
import com.garen.sys.dao.ICommonDao;
@Controller  
@RequestMapping("/wsBase")  
public class ReportAction extends BaseAction {

	@Autowired
	private ICommonDao commonDao;
	@Autowired
	private IReportBiz reportBiz;
	
	/**
	 *查询列表
	 */
	@RequestMapping("/report/json")
	public ModelAndView json(PageBean<Object> pb,JsonPage jp) {
		Map<String,Object> paramMap = createMap()
		   .put("page_no", pb.getPageNum())
		   .put("page_size", pb.getPageSize())
		   .build();
		jp = commonDao.remoteCall(jp,"finweb/report/templet/templetList.do",paramMap);
		for(Object obj : (JSONArray)jp.getRows()){
			JSONObject jobj = (JSONObject)obj;
			Object content = jobj.remove("report_content");
			if(content == null) continue;
			jobj.put("docJson", JSON.parse(content.toString()));
		}
		return Json(jp);
	}
	
	/**
	 *查询
	 */
	@RequestMapping("/report/get")
	public ModelAndView json(JsonPage jp,String name) {
		reportBiz.getReport(jp, name);
		return Json(jp);
	}
	
	/**
	 *保存参数为json
	 */
	@RequestMapping("/report/save")
	public ModelAndView save(HttpSession session,JsonPage jp) {
		Map<String,Object> paramMap = parseJsonMap(jp);
		String gly_no = (String) session.getAttribute(USER_NAME);
		if(StringUtils.isEmpty(gly_no)) gly_no = "admin";
		//数据预处理
		JSONObject jobj = (JSONObject)paramMap.remove("docJson");
		if(jobj != null)
			paramMap.put("report_content", jobj.toJSONString());
		paramMap.put("gly_no",gly_no);
		paramMap.put("ip", getClientIp());
		if(paramMap.containsKey("id"))
			jp = commonDao.remoteCall(jp,"finweb/report/templet/update.do",paramMap);
		else
			jp = commonDao.remoteCall(jp,"finweb/report/templet/save.do",paramMap);
		return Json(jp);
	}
	
	/**
	 *删除
	 */
	@RequestMapping("/report/del")
	public ModelAndView del(HttpSession session,JsonPage jp,Integer id) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		if(StringUtils.isEmpty(gly_no)) gly_no = "admin";
		Map<String,Object> paramMap = createMap()
		   .put("id", id)
		   .put("gly_no",gly_no)
		   .put("ip", getClientIp())
		   .build();
		jp = commonDao.remoteCall(jp,"finweb/report/templet/del.do",paramMap);
		return Json(jp);
	}
	
}
