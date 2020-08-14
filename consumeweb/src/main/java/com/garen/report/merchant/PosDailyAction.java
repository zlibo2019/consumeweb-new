package com.garen.report.merchant;

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
@RequestMapping("/report")  
public class PosDailyAction extends BaseAction{
	
protected static Log log = LogFactory.getLog(SysAction.class);   
	
	@Autowired
	private ICommonDao commonDao;
	
	/**
	 * 设备查询
	 */
	@RequestMapping("merchant/bhQuery")
	public ModelAndView bhQuery(JsonPage jp,String dep_serial) {
		Map<String,Object> paramMap = createMap()
				.put("dep_serial", dep_serial)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/dev/dev/devlist.do",paramMap);
		return Json(jp);
	}
	/**
	 * 商户查询
	 */
	@RequestMapping("merchant/merchQuery")
	public ModelAndView merchQuery(JsonPage jp,String dep_serial) {
		Map<String,Object> paramMap = createMap()
				.put("dep_serial", dep_serial)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/merch/account/merchList.do",paramMap);
		return Json(jp);
	}
	/**
	 * 所有商户查询
	 */
	@RequestMapping("merchant/merchQueryAll")
	public ModelAndView merchQueryAll(JsonPage jp) {
		Map<String,Object> paramMap = createMap().build();
		jp = commonDao.remoteCall(jp,"finweb/merch/account/merchListAll.do",paramMap);
		return Json(jp);
	}
	/**
	 * 所有商户查询(单选)
	 */
	@RequestMapping("merchant/merchQueryAll2")
	public ModelAndView merchQueryAll2(JsonPage jp) {
		Map<String,Object> paramMap = createMap().build();
		jp = commonDao.remoteCall(jp,"finweb/merch/account/merchListAll.do",paramMap);
		return Json(jp.getRows());
	}
	
	/**
	 * 所有商户查询新
	 */
	@RequestMapping("merchant/qryAll")
	public ModelAndView qryAll(JsonPage jp,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("gly_no", gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/merch/account/qryAll.do",paramMap);
		return Json(jp);
	}


	/**
	 * 餐次查询
	 */
	@RequestMapping("merchant/mealQuery")
	public ModelAndView mealQuery(JsonPage jp,String dep_serial) {
		Map<String,Object> paramMap = createMap().build();
		jp = commonDao.remoteCall(jp,"finweb/rule/meal/qryMeal.do",paramMap);
		return Json(jp);
	}
	/**
	 * 场所查询（报表专用，显示视图里的）
	 */
	@RequestMapping("sys/placeQuery")
	public ModelAndView placeQueryAll(JsonPage jp,String dep_serial,HttpSession session) {
//		Map<String,Object> paramMap = createMap().build();

		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("unit_id", "")
				.put("gly_no", gly_no)
				.build();

		jp = commonDao.remoteCall(jp,"finweb/base/qryAcDepByAccess.do",paramMap);
		return Json(jp);
	}

	/**
	 * 设备查询（报表专用，显示视图里的，以场所作为关联条件）
	 */
	@RequestMapping("sys/bhQuery")
	public ModelAndView bhQueryAll(JsonPage jp,String dep_serial) {
		Map<String,Object> paramMap = createMap()
				.put("dep_serial", dep_serial)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/report/sys/devlist.do",paramMap);
		return Json(jp);
	}

	/**
	 * 设备查询（报表专用，以商户作为关联条件）
	 */
	@RequestMapping("sys/bhQueryByMerchant")
	public ModelAndView bhQueryAllByMerchant(JsonPage jp,String merchant_account_id) {
		Map<String,Object> paramMap = createMap()
				.put("merchant_account_id", merchant_account_id)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/dev/dev/devListByMerchant.do",paramMap);
		return Json(jp);
	}
	///////////增加商户部门权限 和 商户权限 之后，从后台获取商户部门列表和商户列表的接口需要做相应的更换////////////
	///////////以下全部为增加权限之后的新接口///////////////////////
	/**
	 * 2017-05-05整改 增加报表权限-查授权商户
	 */	
	@RequestMapping("/authority/qryMerch")
	public ModelAndView authorityqryMerch(JsonPage jp,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/manage/authority/qryMerch.do",paramMap);
		return Json(jp);
	}
	/**
	 * 2017-05-05整改 增加报表权限-查授权管理员
	 */	
	@RequestMapping("/authority/qryGly")
	public ModelAndView authorityqryGly(JsonPage jp,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/manage/authority/qryGly.do",paramMap);
		return Json(jp);
	}	
	
	/**
	 * 商户部门查询(单独的部门查询)
	 */
	@RequestMapping("/merchantDep/query1")
	public ModelAndView queryDepartment(JsonPage jp,String unit_id,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("unit_id",unit_id)
				.put("gly_no",gly_no)
				.put("lx",0)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/report/merchantDep/list.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 商户部门查询(与商户关联的部门查询)
	 */
	@RequestMapping("/merchantDep/query2")
	public ModelAndView queryDepartment2(JsonPage jp,String unit_id,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("unit_id",unit_id)
				.put("gly_no",gly_no)
				.put("lx",1)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/report/merchantDep/list.do",paramMap);
		return Json(jp);
	}
	/**
	 * 与商户部门关联的商户查询
	 */
	@RequestMapping("merchant/queryByDep")
	public ModelAndView merchQueryByDep(JsonPage jp,String dep_serial,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("dep_serial",dep_serial)
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/report/merchant/listbyDep.do",paramMap);
		return Json(jp.getRows());
	}
	/**
	 * 单独的商户查询
	 */
	@RequestMapping("merchant/query")
	public ModelAndView merchQuery(JsonPage jp,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/report/merchant/list.do",paramMap);
		return Json(jp.getRows());
	}	
}



