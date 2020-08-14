package com.garen.functionQuery;

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
import com.garen.utils.MapBuilder;

@Controller  
@RequestMapping("/functionQuery")  
public class MerchantDetailAction extends BaseAction{
	
protected static Log log = LogFactory.getLog(SysAction.class);   
	
	@Autowired
	private ICommonDao commonDao;
	
	/**
	 * 商户部门查询
	 */
	@RequestMapping("merchantDetail/departmentQuery")
	public ModelAndView queryDepartment(JsonPage jp,String unit_id) {
		Map<String,Object> paramMap = createMap()
				.put("unit_id",unit_id)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/merch/dep/qryMerchDep.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 商户明细筛选查询
	 */
	@RequestMapping("merchantDetail/query")
	public ModelAndView query(JsonPage jp,String merchant_account_id,
			String merchant_name,String dep_serial) {
		Map<String,Object> paramMap = createMap()
				.put("merchant_account_id",merchant_account_id)
				.put("merchant_name",merchant_name)
				.put("dep_serial",dep_serial)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/func/merch/merchQry.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 商户明细列表查询
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("merchantDetail/detailQuery")
	public ModelAndView queryDetail(JsonPage jp,String merchant_account_id,
			String start_date,String end_date,String pageNum,String pageSize) {
		
		Map<String,Object> paramMap = createMap()
				.put("merchant_account_id",merchant_account_id)
				.put("start_date",start_date)
				.put("end_date",end_date)
				.put("page_no",pageNum)
				.put("page_size",pageSize)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/func/merch/tradQry.do",paramMap);
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"trad_amt");
		formatTimeMapList((List<Map<String,Object>>)jp.getRows(),"trad_sj");
		formatTimeMapList((List<Map<String,Object>>)jp.getRows(),"sj");
		formatDateMapList((List<Map<String,Object>>)jp.getRows(),"bill_date");
		return Json(jp);
	}
}



