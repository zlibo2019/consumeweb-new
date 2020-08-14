package com.garen.synthesizeSet;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

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
@RequestMapping("/synthesizeSet")  
public class OperateCostAction extends BaseAction{
	
protected static Log log = LogFactory.getLog(SysAction.class);   
	
	@Autowired
	private ICommonDao commonDao;
	
	/**
	 * 操作费用设置列表查询
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("operateCost/query")
	public ModelAndView query(JsonPage jp,String pageNum,String pageSize) {
		Map<String,Object> paramMap = createMap()
				.put("page_no", pageNum)
				.put("page_size", pageSize)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/togeth/feesit/filterQry.do",paramMap);
		formatTimeMapList((List<Map<String,Object>>)jp.getRows(),"sj");
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"deposit_amt");
		List<Map<String,Object>> mapList = (List<Map<String,Object>>)jp.getRows();
		if(mapList!=null){
			for(Map<String,Object> map : mapList){
				if(map.get("fee_rate")!=null){
					String fee_rate_str = ((BigDecimal)map.get("fee_rate")).toString()+"%";
					map.put("fee_rate_str", fee_rate_str);
				}
			}
		}
		return Json(jp);
	}
	
	/**
	 * 操作费用设置费用类型查询
	 */
	@RequestMapping("operateCost/eventQuery")
	public ModelAndView eventQuery(JsonPage jp) {
		Map<String,Object> paramMap = createMap()
				.build();
		jp = commonDao.remoteCall(jp,"finweb/togeth/feesit/type.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 操作费用设置新增
	 */
	@RequestMapping("operateCost/add")
	public ModelAndView addOperateCost(JsonPage jp,String identity_id,
			String event_id,String deposit_amt,String fee_rate,
			HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("identity_id", identity_id)
				.put("event_id", event_id)
				.put("deposit_amt", formatMoney2FEN(deposit_amt))
				.put("fee_rate", fee_rate)
				.put("gly_no", gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/togeth/feesit/save.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 操作费用设置修改
	 */
	@RequestMapping("operateCost/update")
	public ModelAndView updateOperateCost(JsonPage jp,String identity_id,
			String event_id,String deposit_amt,String fee_rate,
			HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("identity_id", identity_id)
				.put("event_id", event_id)
				.put("deposit_amt", formatMoney2FEN(deposit_amt))
				.put("fee_rate", fee_rate)
				.put("gly_no", gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/togeth/feesit/update.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 操作费用设置删除
	 */
	@RequestMapping("operateCost/delete")
	public ModelAndView deleteOperateCost(JsonPage jp,String id,
			String event_id,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("id", id)
				.put("event_id", event_id)
				.put("gly_no", gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/togeth/feesit/del.do",paramMap);
		return Json(jp);
	}
}



