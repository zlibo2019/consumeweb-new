package com.garen.common;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.annotation.JSONField;

public class JsonPage extends MsgBean {

	//页数
	private Integer pageNum;
	//行数
	private Integer pageSize = 20;
		
	private Integer total;
	
	private Object retDatas;
	
	private Object record;
	
	private List<Map<String,Object>> footer;
	//分页统计信息：金额，记录数
	private  Object retData;//Map<String,Object> 

	private int flag;
	
	public int getFlag() {
		return flag;
	}

	public void setFlag(int flag) {
		this.flag = flag;
	}

	public Object getRows() {
		return (null == record)?new ArrayList<Map<String,Object>>():record;
	}
	
	@JSONField(serialize = false)
	public Object getRecord() {
		return record;
	}

	public void setRecord(Object record) {
		this.record = record;
	}

	public Integer getTotal() {
		return total;
	}

	//获取总页数
	public Integer getTotalPage() {
		if(total == null || pageSize == null) return null;
		int num = total / pageSize;
		return total % pageSize == 0?num:num+1;
	}
	
	public void setTotal(Integer total) {
		this.total = total;
	}

	public List<Map<String, Object>> getFooter() {
		return footer;
	}

	public void setFooter(List<Map<String, Object>> footer) {
		this.footer = footer;
	}

	public Object getRetData() {
		return retData == null?new HashMap<String,Object>():retData;
	}

	public void setRetData(Object retData) {
		this.retData = retData;
	}

	//获取偏移量
    public Integer getOffset() {
    	if(pageNum == null || pageSize == null)
    		return 0;
		if(pageNum < 1) pageNum = 1;
		return (pageNum - 1)* pageSize;
	}
    
	public Object getRetDatas() {
		return retDatas;
	}

	public void setRetDatas(Object retDatas) {
		this.retDatas = retDatas;
	}

	public Integer getPageNum() {
		return pageNum;
	}

	public void setPageNum(Integer pageNum) {
		this.pageNum = pageNum;
	}

	public Integer getPageSize() {
		return pageSize;
	}

	public void setPageSize(Integer pageSize) {
		this.pageSize = pageSize;
	}
	
}
