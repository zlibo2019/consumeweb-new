package com.garen.common.doc;

import java.util.List;
import java.util.Map;

//导出文档实现接口
public interface IExportBean {

	List<Map<String,Object>> queryRow(ExportBean pb);
	
}
