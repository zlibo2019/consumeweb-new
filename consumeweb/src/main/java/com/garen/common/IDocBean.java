package com.garen.common;

import java.util.List;
import java.util.Map;

import com.garen.common.doc.ExportBean;

//导出文档实现接口
public interface IDocBean {

	List<Map<String,Object>> queryRow(ExportBean eb);
	
}
