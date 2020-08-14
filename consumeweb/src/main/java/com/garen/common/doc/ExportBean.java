package com.garen.common.doc;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.annotation.JSONField;
import com.garen.common.JsonPage;


/*
 * 前台后台分页参数类
 */
public final class ExportBean extends JsonPage {

	private List<Map<String,Object>> rows = new ArrayList<Map<String,Object>>();
	//是否为导出打印功能
	@JSONField(serialize=false)
	private boolean export;
	
	private Integer  diret;
	
	public Integer getDiret() {
		return diret;
	}

	public void setDiret(Integer diret) {
		this.diret = diret;
	}

	//导出打印参数定义，json格式
	@JSONField(serialize=false)
	private String exportStr;
	//导出打印标题
	@JSONField(serialize=false)
	private String exportTitle;
	//导出文档页脚信息
	@JSONField(serialize=false)
	private String footerTitle;
	//查询条件明细
	@JSONField(serialize=false)
	private String searchTitle;
	//文档类型 pdf or xls
	@JSONField(serialize=false)
	private String exportType;
	
	private List<Map<String,Object>> footer;
	

	public boolean isExport() {
		return export;
	}


	public void setExport(boolean export) {
		this.export = export;
	}


	public String getExportStr() {
		return exportStr;
	}


	public void setExportStr(String exportStr) {
		this.exportStr = exportStr;
	}


	public String getExportTitle() {
		return exportTitle;
	}


	public void setExportTitle(String exportTitle) {
		this.exportTitle = exportTitle;
	}


	public String getFooterTitle() {
		return footerTitle;
	}


	public void setFooterTitle(String footerTitle) {
		this.footerTitle = footerTitle;
	}


	public String getSearchTitle() {
		return searchTitle;
	}


	public void setSearchTitle(String searchTitle) {
		this.searchTitle = searchTitle;
	}


	public String getExportType() {
		return exportType;
	}


	public void setExportType(String exportType) {
		this.exportType = exportType;
	}


	public List<Map<String, Object>> getFooter() {
		return footer;
	}


	public void setFooter(List<Map<String, Object>> footer) {
		this.footer = footer;
	}

	
}
