package com.garen.utils.doc.entity;

import java.util.List;

import com.alibaba.fastjson.annotation.JSONField;

public class Table {

	
	//表格列集合
	List<Column> columnList ;

	public List<Column> getColumnList() {
		return columnList;
	}

	public void setColumnList(List<Column> columnList) {
		this.columnList = columnList;
	}


}
