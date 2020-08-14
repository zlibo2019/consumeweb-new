package com.garen.base;

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
@RequestMapping("/wsBase")  
public class WsPublicAction extends BaseAction{
	
protected static Log log = LogFactory.getLog(SysAction.class);   
	
	@Autowired
	private ICommonDao commonDao;
	
	/**
	 *部门查询
	 */
	@RequestMapping("/depQuery")
	public ModelAndView queryDep(JsonPage jp) {
		Map<String,Object> paramMap = createMap()
				.put("unit_id", "")
				.build();
		jp = commonDao.remoteCall(jp,"finweb/base/qryDep.do",paramMap);
		return Json(jp);
	}


	/**
	 *部门查询按权限
	 */
	@RequestMapping("/qryDepByAccess")
	public ModelAndView queryDepByAccess(JsonPage jp,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("unit_id", "")
				.put("gly_no", gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/base/qryDepByAccess.do",paramMap);
		return Json(jp);
	}

	/**
	 *场所查询按权限
	 */
	@RequestMapping("/qryAcDepByAccess")
	public ModelAndView queryAcDepByAccess(JsonPage jp,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("unit_id", "")
				.put("gly_no", gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/base/qryAcDepByAccess.do",paramMap);
		return Json(jp);
	}

	/**
	 *设备查询按权限
	 */
	@RequestMapping("/qryDevByAccess")
	public ModelAndView queryDevByAccess(JsonPage jp,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("unit_id", "")
				.put("gly_no", gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/base/qryDevByAccess.do",paramMap);
		return Json(jp);
	}

//	/**
//	 *商户查询按权限
//	 */
//	@RequestMapping("/qryMerchantByAccess")
//	public ModelAndView qryMerchantByAccess(JsonPage jp,HttpSession session) {
//		String gly_no = (String) session.getAttribute(USER_NAME);
//		Map<String,Object> paramMap = createMap()
//				.put("unit_id", "")
//				.put("gly_no", gly_no)
//				.build();
//		jp = commonDao.remoteCall(jp,"finweb/base/qryMerchantByAccess.do",paramMap);
//		return Json(jp);
//	}

	/**
	 *身份查询
	 */
	@RequestMapping("/ideQuery")
	public ModelAndView queryIdentity(JsonPage jp) {
		Map<String,Object> paramMap = createMap()
				.build();
		jp = commonDao.remoteCall(jp,"finweb/base/qryIdentity.do",paramMap);
		return Json(jp);
	}
	
	/**
	 *密码规则查询 
	 */
	@RequestMapping("/pswRuleQuery")
	public ModelAndView queryPswRule(JsonPage jp) {
		Map<String,Object> paramMap = createMap()
				.build();
		jp = commonDao.remoteCall(jp,"finweb/base/qryPswRule.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 管理员查询
	 */
	@RequestMapping("/glyQuery")
	public ModelAndView queryGly(JsonPage jp,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("gly_no", gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/base/qryGly.do",paramMap);
		return Json(jp);
	}
	
	/**
	 *  商户查询
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("/merchantQuery")
	public ModelAndView queryMerchant(JsonPage jp,String pageSize,
			String pageNum) {
		Map<String,Object> paramMap = createMap()
				.put("page_size",pageSize)
				.put("page_no",pageNum)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/base/qryMerch.do",paramMap);
		List<Map<String,Object>> mapList = (List<Map<String,Object>>)jp.getRows();
		if(mapList!=null){
			for(Map<String,Object> map : mapList){
				String fee_rate_str = ((BigDecimal)map.get("fee_rate")).toString()+"%";
				map.put("fee_rate_str", fee_rate_str);
			}
		}
		return Json(jp);
	}	
	
	/**
	 * 场所查询
	 */
	@RequestMapping("/placeQuery")
	public ModelAndView queryPlace(JsonPage jp,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("unit_id", "")
				.put("gly_no", gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/base/qryAcDepByAccess.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 读卡
	 */
	@RequestMapping("/allReadCard")
	public ModelAndView allReadCard(JsonPage jp,String card_number,
			String media_id,String account_condition) {
		Map<String,Object> paramMap = createMap()
				.put("card_number", card_number)
				.put("media_id", media_id)
				.put("account_condition", account_condition)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/base/readCardInfo.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 读身份证
	 */
	@RequestMapping("/allReadIdCard")
	public ModelAndView allReadIdCard(JsonPage jp,String user_id) {
		Map<String,Object> paramMap = createMap()
				.put("user_id", user_id)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/base/qryUserID.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 查询主附卡
	 */
	@RequestMapping("/queryIsMainCard")
	public ModelAndView queryIsMainCard(JsonPage jp,String account_id,
			String card_number,String media_id) {
		Map<String,Object> paramMap = createMap()
				.put("account_id", account_id)
				.put("card_number", card_number)
				.put("media_id", media_id)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/base/qryIsMainCard.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 打印凭条（充值、取款、充值纠错）返回值
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("/tradPrint")
	public ModelAndView tradPrint(JsonPage jp,String account_id,
			String trad_amt,String trad_before_amt,
			String event_lx,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("account_id", account_id)
				.put("trad_amt", formatMoney2FEN(trad_amt))
				.put("trad_before_amt", formatMoney2FEN(trad_before_amt))
				.put("event_lx", event_lx)
				.put("gly_no", gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/base/tradPrint.do",paramMap);
		formatTimeMapList((List<Map<String,Object>>)jp.getRows(),"trad_sj");
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"trad_before_amt");
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"trad_amt");
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"trad_after_amt");
		return Json(jp);
	}
	
	/**
	 * 查询时间偏移量
	 */
	@RequestMapping("/queryTimeOffset")
	public ModelAndView queryTimeOffset(JsonPage jp) {
		Map<String,Object> paramMap = createMap()
				.build();
		jp = commonDao.remoteCall(jp,"finweb/base/qrySysOffset.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 查询科目树
	 */
	@RequestMapping("/querySubject")
	public ModelAndView querySubject(JsonPage jp) {
		Map<String,Object> paramMap = createMap()
				.build();
		jp = commonDao.remoteCall(jp,"finweb/base/qrySubject.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 查询银行
	 */
	@RequestMapping("qryBank")
	public ModelAndView bankqryBank(JsonPage jp) {
		Map<String,Object> paramMap = createMap()
				.build();
		jp = commonDao.remoteCall(jp,"finweb/base/qryBank.do",paramMap);
		return Json(jp);
	}	
	
	/**
	 * 核心业务IP授权验证 check
	 */
	@RequestMapping("checkCoreIp")
	public ModelAndView checkCoreIp(JsonPage jp,HttpSession session,String op_name) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		String ip = getClientIp();
		Map<String,Object> paramMap = createMap()
				.put("gly_no", gly_no)
				.put("ip", ip)
				.put("op_name", op_name)
				.build();
		if(ip.equals("0:0:0:0:0:0:0:1") || ip.equals("127.0.0.1")){//服务器本机用localhost或127.0.0.1访问时不验证
			jp.setId(0);
			jp.setInfo("服务器本机localhost或127.0.0.1访问时不验证ip");
		}else{
			jp = commonDao.remoteCall(jp,"finweb/manage/check/ipGly.do",paramMap);
		}
		
		return Json(jp);
	}	
}

