package com.garen.subsidy;

import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.garen.common.BaseAction;
import com.garen.common.JsonPage;
import com.garen.sys.dao.ICommonDao;
import com.garen.sys.web.SysAction;

@Controller  
@RequestMapping("/subsidy")  
public class ExcelQueryAction extends BaseAction{
	
protected static Log log = LogFactory.getLog(SysAction.class);   
	
	@Autowired
	private ICommonDao commonDao;
	
	/**
	 * 导入状态查询
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("/excelStateQuery")
	public ModelAndView queryExcelState(JsonPage jp) {
		Map<String,Object> paramMap = createMap()
				.build();
		jp = commonDao.remoteCall(jp,"finweb/sub/impQuery/qryState.do",paramMap);
		List<Map<String,Object>> mapList = (List<Map<String,Object>>)jp.getRows();
		for (Map<String, Object> map : mapList) {
			String stateCode_str = ((Integer)map.get("stateCode")).toString();
			map.put("stateCode_str", stateCode_str);
		}
		return Json(jp);
	}
	
	/**
	 * 筛选查询
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("/excelQuery")
	public ModelAndView queryExcel(JsonPage jp,String sub_month_begin,String sub_month_end,
			String gly_no,String batch_no,String stateCode,String fuzzy,String pageNum,
			String pageSize) {
		Map<String,Object> paramMap = createMap()
				.put("sub_month_begin", sub_month_begin)
				.put("sub_month_end", sub_month_end)
				.put("gly_no", gly_no)
				.put("batch_no", batch_no)
				.put("stateCode", stateCode)
				.put("fuzzy", fuzzy)
				.put("page_no", pageNum)
				.put("page_size", pageSize)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/sub/impQuery/filterQry.do",paramMap);
		//formatDateMapList((List<Map<String,Object>>)jp.getRows(),"sub_month");
		formatTimeMapList((List<Map<String,Object>>)jp.getRows(),"sj");
		
		return Json(jp);
	}
	
	/**
	 * 查批次号
	 */
	@RequestMapping("/excelQueryBatch")
	public ModelAndView excelQueryBatch(JsonPage jp,String sub_month_begin,
			String sub_month_end,String gly_no) {
		Map<String,Object> paramMap = createMap()
				.put("sub_month_begin", sub_month_begin)
				.put("sub_month_end", sub_month_end)
				.put("gly_no", gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/sub/impQuery/qryBatch.do",paramMap);
		return Json(jp);
	}
	
}



