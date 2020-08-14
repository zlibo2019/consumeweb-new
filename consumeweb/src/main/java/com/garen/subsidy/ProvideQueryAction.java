package com.garen.subsidy;

import java.util.ArrayList;
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
public class ProvideQueryAction extends BaseAction{
	
protected static Log log = LogFactory.getLog(SysAction.class);   
	
	@Autowired
	private ICommonDao commonDao;
	
	/**
	 * 补贴发放记录类型查询
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("/provideStateQuery")
	public ModelAndView queryProvideState(JsonPage jp) {
		Map<String,Object> paramMap = createMap()
				.build();
		jp = commonDao.remoteCall(jp,"finweb/sub/query/qryState.do",paramMap);
		List<Map<String,Object>> mapList = (List<Map<String,Object>>)jp.getRows();
		for (Map<String, Object> map : mapList) {
			String undo_state_str = ((Integer)map.get("undo_state")).toString();
			map.put("undo_state_str", undo_state_str);
		}
		
		return Json(jp);
	}
	
	/**
	 * 按批次查询
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("/provideQueryByBatch")
	public ModelAndView queryProvideByBatch(JsonPage jp,String begin_month,String end_month,
			String gly_no,String batch_no,String record_type,String fuzzy,String pageNum,
			String pageSize) {
		if(record_type == ""){
			record_type = "-1";
		}
		Map<String,Object> paramMap = createMap()
				.put("begin_month", begin_month)
				.put("end_month", end_month)
				.put("gly_no", gly_no)
				.put("batch_no", batch_no)
				.put("record_type", record_type)
				.put("fuzzy", fuzzy)
				.put("page_no", pageNum)
				.put("page_size", pageSize)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/sub/query/batchQry.do",paramMap);
		formatDateMapList((List<Map<String,Object>>)jp.getRows(),"begin_date");
		formatDateMapList((List<Map<String,Object>>)jp.getRows(),"end_date");
		formatTimeMapList((List<Map<String,Object>>)jp.getRows(),"sj");
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"sub_amt");
		Map<String,Object> map = (Map<String,Object>)jp.getRetData();
		List<Map<String,Object>> mapList = new ArrayList<>();
		mapList.add(map);
		jp.setRetData(mapList);
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRetData(),"subamts");
		return Json(jp);
	}
	
	/**
	 * 按人员查询
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("/provideQueryByUser")
	public ModelAndView queryProvideByUser(JsonPage jp,String begin_month,String end_month,
			String user_lname,String user_no,String dep_serial,String record_type,String pageNum,
			String pageSize,String cx_type) {
		if(record_type == ""){
			record_type = "-1";
		}
		Map<String,Object> paramMap = createMap()
				.put("begin_month", begin_month)
				.put("end_month", end_month)
				.put("user_lname", user_lname)
				.put("user_no", user_no)
				.put("dep_serial", dep_serial)
				.put("record_type", record_type)
				.put("cx_type", cx_type)
				.put("page_no", pageNum)
				.put("page_size", pageSize)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/sub/query/userQry.do",paramMap);
		formatDateMapList((List<Map<String,Object>>)jp.getRows(),"begin_date");
		formatDateMapList((List<Map<String,Object>>)jp.getRows(),"end_date");
		formatTimeMapList((List<Map<String,Object>>)jp.getRows(),"sj");
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"sub_amt");
		Map<String,Object> map = (Map<String,Object>)jp.getRetData();
		List<Map<String,Object>> mapList = new ArrayList<>();
		mapList.add(map);
		jp.setRetData(mapList);
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRetData(),"subamts");
		return Json(jp);
	}
}



