package com.garen.consume;

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

@Controller  
@RequestMapping("/consume")  
public class ConsumeRuleAction extends BaseAction{
	
protected static Log log = LogFactory.getLog(SysAction.class);   
	
	@Autowired
	private ICommonDao commonDao;
	
	/**
	 * 消费规则人群查询
	 */
	@RequestMapping("/consumeRule/crowdQuery")
	public ModelAndView queryCrowd(JsonPage jp,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/rule/finRuleSite/qryCrowd.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 规则查询
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("/consumeRule/ruleListQuery")
	public ModelAndView queryRuleList(JsonPage jp,String crowd_id,String rule_id) {
		Map<String,Object> paramMap = createMap()
				.put("crowd_id", crowd_id)
				.put("rule_id", rule_id)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/rule/finRuleSite/qryRule.do",paramMap);
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"limit_amt");
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"sub_amt");
		List<Map<String,Object>> mapList = (List<Map<String,Object>>)jp.getRows();
		if(mapList!=null){
			for(Map<String,Object> map : mapList){
				String sub_rate_str = (map.get("sub_rate")).toString().length()>0?map.get("sub_rate").toString()+"%":"";
				map.put("sub_rate_str", sub_rate_str);
			}
		}
		return Json(jp);
	}
	
	/**
	 * 新增规则
	 */
	@RequestMapping("/consumeRule/ruleListAdd")
	public ModelAndView addRuleList(JsonPage jp,String crowd_id,String meal_id,
			String meal_name,String begin_time,String end_time,
			String rule_name,String rule_type,String limit_amt,
			String limit_numb,String sub_enable,String sub_type,
			String sub_amt,String sub_rate,String sub_valid_days,
			HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("crowd_id", crowd_id)
				.put("meal_id", meal_id)
				.put("meal_name", meal_name)
				.put("begin_time", begin_time)
				.put("end_time", end_time)
				.put("rule_name", rule_name)
				.put("rule_type", rule_type)
				.put("limit_amt", formatMoney2FEN(limit_amt))
				.put("limit_numb", limit_numb)
				.put("sub_enable", sub_enable)
				.put("sub_type", sub_type)
				.put("sub_amt", formatMoney2FEN(sub_amt))
				.put("sub_rate", sub_rate)
				.put("sub_valid_days", sub_valid_days)
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/rule/finRuleSite/addRule.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 修改规则
	 */
	@RequestMapping("/consumeRule/ruleListUpdate")
	public ModelAndView updateRuleList(JsonPage jp,String crowd_id,String rule_id,String meal_id,
			String rule_name,String begin_time,String end_time,String rule_type,String limit_amt,
			String limit_numb,String sub_enable,String sub_type,String sub_amt,String meal_name,
			String sub_rate,String sub_valid_days,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("crowd_id", crowd_id)
				.put("meal_id", meal_id)
				.put("meal_name", meal_name)
				.put("rule_id", rule_id)
				.put("rule_name", rule_name)
				.put("begin_time", begin_time)
				.put("end_time", end_time)
				.put("rule_type", rule_type)
				.put("limit_amt", formatMoney2FEN(limit_amt))
				.put("limit_numb", limit_numb)
				.put("sub_enable", sub_enable)
				.put("sub_type", sub_type)
				.put("sub_amt", formatMoney2FEN(sub_amt))
				.put("sub_rate", sub_rate)
				.put("sub_valid_days", sub_valid_days)
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/rule/finRuleSite/editRule.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 删除规则
	 */
	@RequestMapping("/consumeRule/ruleListDelete")
	public ModelAndView deleteRuleList(JsonPage jp,String crowd_id,String rule_id,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("crowd_id", crowd_id)
				.put("rule_id", rule_id)
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/rule/finRuleSite/delRule.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 消费规则场所查询
	 */
	@RequestMapping("/consumeRule/siteQuery")
	public ModelAndView querySite(JsonPage jp,HttpSession session) {
//		Map<String,Object> paramMap = createMap()
//				.build();
//		jp = commonDao.remoteCall(jp,"finweb/rule/finRule/qrySite.do",paramMap);
//		return Json(jp);

		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("unit_id", "")
				.put("gly_no", gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/base/qryAcDepByAccess.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 规则限制查询
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("/consumeRule/limitQuery")
	public ModelAndView queryLimit(JsonPage jp,String crowd_id) {
		Map<String,Object> paramMap = createMap()
				.put("crowd_id", crowd_id)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/rule/finRuleSite/limitQry.do",paramMap);
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"day_sub_amt");
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"day_limit_amt");
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"single_limit");
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"limit_amt");
		return Json(jp);
	}
	
	/**
	 * 规则限制修改
	 */
	@RequestMapping("/consumeRule/limitUpdate")
	public ModelAndView updateLimit(JsonPage jp,String crowd_id,String single_limit,
			String limit_pwd_enable,String day_limit_amt,String day_limit_numb,
			String day_sub_amt,String sub_valid_days,String limit_enable,
			String limit_amt) {
		Map<String,Object> paramMap = createMap()
				.put("crowd_id", crowd_id)
				.put("single_limit", formatMoney2FEN(single_limit))
				.put("limit_pwd_enable", limit_pwd_enable)
				.put("day_limit_amt", formatMoney2FEN(day_limit_amt))
				.put("day_limit_numb", day_limit_numb)
				.put("day_sub_amt", formatMoney2FEN(day_sub_amt))
				.put("sub_valid_days", sub_valid_days)
				.put("limit_enable", limit_enable)
				.put("limit_amt", formatMoney2FEN(limit_amt))
				.build();
		jp = commonDao.remoteCall(jp,"finweb/rule/finRuleSite/limitSave.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 消费规则餐别查询
	 */
	@RequestMapping("/consumeRule/mealQuery")
	public ModelAndView queryMeal(JsonPage jp,String crowd_id) {
		Map<String,Object> paramMap = createMap()
				.put("crowd_id", crowd_id)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/rule/finRuleSite/qryMeal.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 消费规则时段查询
	 */
	@RequestMapping("/consumeRule/timeQuery")
	public ModelAndView queryTime(JsonPage jp,String crowd_id,String meal_id) {
		Map<String,Object> paramMap = createMap()
				.put("crowd_id", crowd_id)
				.put("meal_id", meal_id)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/rule/finRuleSite/qryTimeSlot.do",paramMap);
		return Json(jp);
	}
}
