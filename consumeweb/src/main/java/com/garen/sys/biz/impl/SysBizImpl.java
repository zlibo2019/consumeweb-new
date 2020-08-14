package com.garen.sys.biz.impl;

import java.io.File;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.garen.common.JsonPage;
import com.garen.sys.biz.ISysBiz;
import com.garen.sys.dao.ICommonDao;
import com.garen.utils.doc.PdfCreator;
import com.garen.utils.xls.ExcelCreator;

@Service
public class SysBizImpl implements ISysBiz {
	private static Log log = LogFactory.getLog(SysBizImpl.class);   
	@Autowired
	private ICommonDao commonDao;

	//pdf解析器,返回pdf文档,或者错误信息，封装在jp中
	@Override
	public File parsePdf(JsonPage jp,JSONObject jobj,String params,
			JSONArray headers,JSONArray footers,JSONArray headerExs){
		jp = getReportData(jp,jobj,params);
		JSONObject jdoc = jobj.getJSONObject("docJson");
		PdfCreator pdfCreator = new PdfCreator();
		return pdfCreator.createPdf(jdoc, (JSONArray)jp.getRecord(),
				headers,footers,headerExs);
	}
	
	//xls解析器
	public File parseXls(JsonPage jp,JSONObject jobj,String params,
					JSONArray headers,JSONArray footers,JSONArray headerExs){
		jp = getReportData(jp,jobj,params);
		JSONObject jdoc = jobj.getJSONObject("docJson");
		ExcelCreator creator = new ExcelCreator();
		return creator.createXls(jdoc, (JSONArray)jp.getRecord(),
				headers,footers,headerExs);
	}
		
	@Override	
	public JsonPage getReportData(JsonPage jp,JSONObject jobj,String params){
		JSONObject jdoc = jobj.getJSONObject("docJson");
		//获取web services地址
		String wsUrl = jdoc.getString("wsUrl");
		if(StringUtils.isEmpty(wsUrl)){
			log.debug("模版地址不正常");
			return (JsonPage)jp.setRetInfo(-2, "模版地址不正常");
		}
		jp = getReportData(jp, wsUrl, params);
		JSONArray datalist = (JSONArray)jp.getRecord();
		PdfCreator pdfCreator = new PdfCreator();
		pdfCreator.getReportData(jp, jdoc, datalist);
		return jp;
	} 
	
	@Override	
	public JsonPage getReportData(JsonPage jp,String wsUrl,String params){
		JsonPage jp1 = commonDao.remoteCall(jp, wsUrl, params);
		jp1.setPageNum(jp.getPageNum());
		jp1.setPageSize(jp.getPageSize());
		//JSONArray datalist = (JSONArray)jp1.getRecord();
		///log.debug(jp1.getTotal() + "获取数据" + datalist.size());
		return jp1;
	}
	
}
