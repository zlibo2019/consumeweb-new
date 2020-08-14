package com.garen.sys.web;


import java.io.File;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
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
import com.garen.common.MsgBean;
import com.garen.common.doc.ExportBean;
import com.garen.common.doc.IExportBean;
import com.garen.sys.biz.ISysBiz;
import com.garen.sys.dao.ICommonDao;
import com.garen.utils.DateUtils;
import com.garen.utils.FileUtils;
import com.garen.utils.LangUtils;
import com.garen.utils.ReadResource;

@Controller  
@RequestMapping("/")  
public final class SysAction extends BaseAction {

	protected static Log log = LogFactory.getLog(SysAction.class);   
	
	@Autowired
	private ICommonDao commonDao;
	
	@Autowired
	private ISysBiz iSysBiz;
	@Autowired
	private IReportBiz reportBiz;
	/*
	 *普通查询
	 */
	@RequestMapping("/dep/postJson")
	public ModelAndView postJson(JsonPage jp) {
		JSONArray jarr = parseJsonArray();
		log.debug(jarr);
		return Json(jp);
	}
	
	//导出xls Or pdf 文档
	@RequestMapping("/exportDocFile") 
	public ModelAndView exportDocFile(ModelAndView mav,String fileName,
			String fileKey,String docType,String browseType) throws UnsupportedEncodingException{
		HttpSession session = SysFilter.getSession();
		if(StringUtils.isEmpty(fileKey)) return null;
		if(StringUtils.isEmpty(docType)) docType = "pdf";
		if(StringUtils.isEmpty(fileName)) fileName = "export";
		if(fileName.endsWith("." + docType) == false){//加入扩展名
			fileName += "." + docType;
		}
		File docFile = (File) session.getAttribute(fileKey);
		if(docFile == null) return null;
		if("firefox".equals(browseType)){
			fileName = java.net.URLDecoder.decode(fileName, "utf-8");
			fileName = new String(fileName.getBytes("UTF-8"),"iso-8859-1"); 
		}
		if("pdf".equals(docType)) return downPdfFile(docFile,fileName);
		else  return downXlsFile(docFile,fileName);
	}
		
	List<Map<String,Object>> testData(ExportBean eb){
		List<Map<String,Object>> mapList = new ArrayList<>();
		Integer pageSize = eb.getPageSize();
		//int offset = eb.getOffset();
		for(int i = 0;i < pageSize;i++){
			mapList.add(createMap()
					.put("a1", 2999999L)
					.put("a2", "b" + i)
					.put("a3", "名称"+i)
					.put("c1", "123")
					.put("c2", new Date())
					.put("c3", "b" + i)
					.put("c7", "名称"+i)
					.build());
		}
		//eb.setRows(mapList);
		eb.setTotal(3 * pageSize);
		//页脚
		List<Map<String,Object>> footerList = new ArrayList<>();
		
		footerList.add(createMap()
				.put("a1_str", "合计")
				.put("c4", "123.56")
				.put("footerFlag", true)
				.build());
		
		eb.setFooter(footerList);
		formatDateMapList(mapList,"a1,b3");
		formatTimeMapList(mapList,"b3,c2");
		return mapList;
	}
	
	/*
	 * 注销登录
	 * */
	@RequestMapping("/logout")
	public ModelAndView logout() {
		MsgBean mbean = SysFilter.getMsgBean(0,"注销成功");
        SysFilter.getSession().invalidate();
        return Json(mbean);
	}
	
	
	/*
	 * 批量加载css文件
	 * */
	@RequestMapping("css/loadCSS")
	public ModelAndView loadCSS() {
		String path = getRealPath("css");
		log.debug(path);
        String [] paths = new String[]{path};
        String exFile = "login.js,test.js,report.js";
        byte [] b = new ReadResource(paths,exFile, ".css", false, false).load();
        log.debug(b.length);
        return downCss(b);
	}
	
	/*
	 * 批量加载javascript文件
	 * */
	@RequestMapping("/loadJs")
	public ModelAndView loadJs() {
		String path1 = getRealPath("libjs/easyui");
		String path2 = getRealPath("libjs/userdefined");
		String path3 = getRealPath("libjs/plugins");
		String path4 = getRealPath("js");
        String [] paths = new String[]{path1,path2,path3,path4};
        String exFile = "login.js,test.js,report.js,index.js,designReport.js,login2.js,printdoc.js";
        byte [] b = new ReadResource(paths,exFile, ".js", true, false).load();
        log.debug(b.length);
        return downJs(b);
	}
	/*
	 * 加载报表模版
	 * */
	@RequestMapping("/loadDocJs")
	public ModelAndView loadDocJs(String path) {
		MsgBean mbean = SysFilter.getMsgBean(0,"ok");
		//String path1 = getRealPath("themes");
		String path2 = getRealPath(path);
		String jsonStr = FileUtils.readDataStr(path2, null);
		if(StringUtils.isNotEmpty(jsonStr))
			mbean.setObj(JSON.parse(jsonStr));
        return Json(mbean);
	}
	
	/*生成print html文档
	 * 参数:
	 * 1  报表模版名称
	 * 2  数据查询条件
	 * 返回值：
	 *    文档下载code
	 * */
	@RequestMapping("/exportPrintDoc") 
	public ModelAndView exportPrintDoc(ModelAndView mav,JsonPage jp,String reportName,String params,
			String headerstr,String footerstr){
		mav.setViewName("sys/print");
		mav.addObject("headerstr",headerstr);
		mav.addObject("footerstr",footerstr);
		mav.addObject("reportName",reportName);
		mav.addObject("params",params);
		return mav;
	}
	@RequestMapping("/exportPdf") 
	public ModelAndView exportPdf(ExportBean eb,String rowdatas){
		JSONArray jarr = JSON.parseArray(rowdatas);
		eb.setTotal(jarr.size());
		eb.setRecord(jarr);
		eb.setExport(true);
		IExportBean exportBean = new IExportBean() {
			@SuppressWarnings("unchecked")
			@Override
            public List<Map<String, Object>> queryRow(ExportBean pb) {
				return (List<Map<String, Object>>)pb.getRows();
			}
		};
		return JsonEx(eb,exportBean);
	}
			
	/*生成pdf文档
	 * 参数:
	 * 1  报表模版名称
	 * 2  数据查询条件
	 * 返回值：
	 *    文档下载code
	 * */
	@RequestMapping("/exportPdfDoc") 
	public ModelAndView exportPdfDoc(JsonPage jp,String reportName,String params,
			String headerstr,String footerstr,String headerExstr){
		JSONArray headers = null;
		JSONArray headerExs = null;
		JSONArray footers = null;
		JSONObject jobj = reportBiz.getReport(jp, reportName);
		if(jobj == null){
			jp.setRetInfo(-1,"模版" + reportName + "不存在");
		}else{
			if(StringUtils.isNotEmpty(headerstr))
				headers = JSON.parseArray(headerstr);
			if(StringUtils.isNotEmpty(footerstr))
				footers = JSON.parseArray(footerstr);
			if(StringUtils.isNotEmpty(headerExstr))
				headerExs = JSON.parseArray(headerExstr);
			File file = iSysBiz.parsePdf(jp,  jobj, params,
					headers,footers,headerExs);
			String fileKey = file.getName();
            jp.setInfo(fileKey);
            HttpSession session = SysFilter.getSession();
            //缓存session中
            session.setAttribute(fileKey, file);
		}
		return Json(jp);
	}
	
	/*生成excel文档
	 * 参数:
	 * 1  报表模版名称
	 * 2  数据查询条件
	 * 返回值：
	 *    文档下载code
	 * */
	@RequestMapping("/exportXlsDoc") 
	public ModelAndView exportXlsDoc(JsonPage jp,String reportName,String params,
			String headerstr,String footerstr,String headerExstr){
		JSONArray headers = null;
		JSONArray headerExs = null;
		JSONArray footers = null;
		//查询报表模板
		JSONObject jobj = reportBiz.getReport(jp, reportName);
		if(jobj == null){
			jp.setRetInfo(-1,"模版" + reportName + "不存在");
		}else{
			if(StringUtils.isNotEmpty(headerstr))
				headers = JSON.parseArray(headerstr);
			if(StringUtils.isNotEmpty(footerstr))
				footers = JSON.parseArray(footerstr);
			if(StringUtils.isNotEmpty(headerExstr))
				headerExs = JSON.parseArray(headerExstr);
			File file = iSysBiz.parseXls(jp,  jobj, params,
					headers,footers,headerExs);
			String fileKey = file.getName();
            jp.setInfo(fileKey);
            HttpSession session = SysFilter.getSession();
            //缓存session中
            session.setAttribute(fileKey, file);
		}
		return Json(jp);
	}
	/*
	 * 导出excel表格
	 * 参数:
	 *  reportName 报表名称
	 *  params datagrid field参数
	 *  headerstr 页眉
	 *  footerstr 页脚
	 * */
	@RequestMapping("/exportXls") 
	public ModelAndView exportXls(JsonPage jp,String reportName,String params,
			String headerstr,String footerstr,String headerExstr){
		return Json(jp);
	}
	/*
	 * 获取datagrid数据
	 * */
	@RequestMapping("/loadDocData") 
	public ModelAndView loadDocData(JsonPage jp,String reportName,String params,HttpSession session){
		String gly = (String)session.getAttribute(USER_NAME);
		JSONObject jobj = reportBiz.getReport(jp, reportName,gly);
		if(jobj == null){
			jp.setRetInfo(-1,"模版" + reportName + "不存在");
		}else{
			jp = iSysBiz.getReportData(jp, jobj, params);
			data2pager(jp);
		}
		jp.setObj(DateUtils.date2str(new Date(), "yyyy-MM-dd"));
		return Json(jp);
	}
	
	/*
	 * 获取web services数据
	 * */
	@RequestMapping("/loadWSData") 
	public ModelAndView loadWSData(JsonPage jp,String wsUrl,String params){
		if(StringUtils.isEmpty(wsUrl)){
			jp.setRetInfo(-2, "模版地址不正常");
		}else{
			jp = iSysBiz.getReportData(jp, wsUrl, params);
			data2pager(jp);
		}
		return Json(jp);
	}
	//数据分页
	@SuppressWarnings("unchecked")
	private JsonPage data2pager(JsonPage jp){
		List<Map<String,Object>> mapList = (List<Map<String,Object>>)jp.getRows();
		if(LangUtils.listIsNull(mapList) || jp.getPageNum() == null) return jp;
		int total = mapList.size();
		jp.setTotal(total);//更新记录总数，报表总计，小计增加记录数量
		int begin = jp.getOffset();
		int end = begin + jp.getPageSize();
		if(begin > end) begin = end;
		if(begin < 0) begin = 0;
		if(end > total) end = total;
		jp.setRecord(mapList.subList(begin, end));
		return jp;
	}
	
	/**
	 * 苑文要的action，返回gly和dateString
	 */
	@RequestMapping("/getDate") 
	public ModelAndView glyDateAction(JsonPage jp,HttpSession session){
		String gly = (String)session.getAttribute(USER_NAME);
		Date date = new Date();
		Map<String,Object> paramMap = createMap()
				.put("gly",gly)
				.put("date_str",DateUtils.date2str(date, "yyyy-MM-dd HH:mm:ss"))
				.put("date_s",DateUtils.date2str(date, "yyyy-MM-dd"))
				.put("date", date.getTime())
				.build();
		jp.setRecord(paramMap);
		jp.setId(0);
		return Json(jp);
	}
	
	private String getJPString(JsonPage jp,String key){
		Object record = jp.getRecord();
		JSONObject json = null;
		if(null == record) return null;
		else if(record instanceof JSONArray){
			JSONArray jarr = (JSONArray)record;
			json = jarr.getJSONObject(0);
		}else if(record instanceof JSONObject) json = (JSONObject)record;
		return json.getString(key);
	}
	/**
	 * 返回数据:
	 * 1 时间戳
	 * 2 核算单位
	 * 3 操作员
	 */
	@RequestMapping("/getSysData") 
	public ModelAndView getSysData(JsonPage jp,HttpSession session){
		String gly = (String)session.getAttribute(USER_NAME);
		Map<String, Object> paramMap = new HashMap<>();
		commonDao.remoteCall(jp,"/finweb/report/sys/getUnit.do",paramMap);
		String regUnit = getJPString(jp, "reg_unit");
		commonDao.remoteCall(jp,"/finweb/report/sys/printTime.do",paramMap);
		String printTime = getJPString(jp, "print_time");
		paramMap.put("operator", gly);
		commonDao.remoteCall(jp,"finweb/report/sys/operatorName",paramMap);
		String glyName = getJPString(jp, "gly_lname");
		Map<String,Object> resultMap = createMap()
				.put("gly",glyName)
				.put("glyId",gly)
				.put("regUnit",regUnit)
				.put("printTime",printTime)
				.build();
		jp.setRecord(resultMap);
		jp.setId(0);
		return Json(jp);
	}
	
	/**
	 * 返回数据:
	 * 1 报表有效日期
	 */
	@RequestMapping("/getSysDate") 
	public ModelAndView getSysDate(JsonPage jp,HttpSession session){
		String gly = (String)session.getAttribute(USER_NAME);
		Map<String, Object> paramMap = new HashMap<>();
		commonDao.remoteCall(jp,"/finweb/report/sys/billdate.do",paramMap);
		JSONArray jarry = (JSONArray)jp.getRows();
		jarry.add(gly);
		return Json(jp);
	}
	
	/**
	 * 苑文要的action，返回gly和unit_name
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("/glyUnitAction") 
	public ModelAndView glyUnitAction(JsonPage jp,HttpSession session){
		String gly = (String)session.getAttribute(USER_NAME);
		if(StringUtils.isEmpty(gly)) gly = "test";
		Map<String,Object> paramMap = createMap().build();
		jp = commonDao.remoteCall(jp,"finweb/base/qryUnit.do",paramMap);
		List<Map<String,Object>> mapList = (List<Map<String,Object>>)jp.getRows();
		Map<String,Object> paramMap2 = createMap()
				.put("gly", gly)
				.build();
		mapList.add(paramMap2);
		Map<String,Object> map = null;
		if(mapList.isEmpty() == false){
			map = mapList.get(0);
			map.put("gly", gly);
		}
		jp.setRecord(map);
		return Json(jp);
	}
}
