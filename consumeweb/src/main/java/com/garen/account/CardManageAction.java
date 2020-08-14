package com.garen.account;

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
@RequestMapping("/account")  
public class CardManageAction extends BaseAction{
	
protected static Log log = LogFactory.getLog(SysAction.class);   
	
	@Autowired
	private ICommonDao commonDao;
	
	/**
	 * 筛选查询
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("/cardFilterQuery")
	public ModelAndView queryCardFilter(JsonPage jp,String user_no,
			String dep_serial,String identity_id,String user_lname,
			String account_condition,String cx_type,String card_state,
			String account_id,String pageNum,String pageSize,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("user_no",user_no)
				.put("dep_serial",dep_serial)
				.put("identity_id",identity_id)
				.put("user_lname",user_lname)
				.put("card_state",card_state)
				.put("account_condition",account_condition)
				.put("cx_type",cx_type)
				.put("account_id",account_id)
				.put("page_no",pageNum)
				.put("page_size",pageSize)
				.put("gly_no", gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/card/filterQry2.do",paramMap);
		formatDateMapList((List<Map<String,Object>>)jp.getRows(),"account_end_date");
		return Json(jp);
	}
	
	/**
	 * 持卡记录查询
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("/cardListQuery")
	public ModelAndView queryCardList(JsonPage jp,String account_id) {
		Map<String,Object> paramMap = createMap()
				.put("account_id",account_id)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/card/cardListQry.do",paramMap);
		formatDateMapList((List<Map<String,Object>>)jp.getRows(),"sj");
		return Json(jp);
	}
	
	/**
	 * 发卡
	 */
	@RequestMapping("/cardProvide")
	public ModelAndView provideCard(JsonPage jp,String account_id,String card_number,
			String media_id,String is_main_card,String old_card_serial,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("account_id",account_id)
				.put("card_number",card_number)
				.put("media_id",media_id)
				.put("is_main_card",is_main_card)
				.put("old_card_serial",old_card_serial)
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/card/addCard.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 发卡（读写卡）后续
	 */
	@RequestMapping("/cardProvideAfter")
	public ModelAndView provideCardAfter(JsonPage jp,String account_id,
			String card_serial,String old_card_serial,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("account_id",account_id)
				.put("card_serial",card_serial)
				.put("old_card_serial",old_card_serial)
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/card/writeAfter.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 卡片押金验证
	 */
	@RequestMapping("/cardDeposit")
	public ModelAndView cardDeposit(JsonPage jp,String account_id,String old_card_serial) {
		Map<String,Object> paramMap = createMap()
				.put("account_id",account_id)
				.put("old_card_serial",old_card_serial)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/card/cardDeposit.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 卡片状态验证
	 */
	@RequestMapping("/cardState")
	public ModelAndView cardState(JsonPage jp,String card_number,
			String media_id) {
		Map<String,Object> paramMap = createMap()
				.put("card_number",card_number)
				.put("media_id",media_id)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/card/cardState.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 卡片挂失
	 */
	@RequestMapping("/cardLoss")
	public ModelAndView lossCard(JsonPage jp,String card_serial,
			String account_id,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("card_serial",card_serial)
				.put("account_id",account_id)
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/card/lossCard.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 卡片解挂
	 */
	@RequestMapping("/unLossCard")
	public ModelAndView unLossCard(JsonPage jp,String card_serial,
			String account_id,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("card_serial",card_serial)
				.put("account_id",account_id)
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/card/unlossCard.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 卡片退卡
	 */
	@RequestMapping("/absentCard")
	public ModelAndView absentCard(JsonPage jp,String card_serial,
			String account_id,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("card_serial",card_serial)
				.put("account_id",account_id)
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/card/backCard.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 卡片退卡后续
	 */
	@RequestMapping("/absentCardAfter")
	public ModelAndView absentCardAfter(JsonPage jp,String card_serial,
			String account_id) {
		Map<String,Object> paramMap = createMap()
				.put("card_serial",card_serial)
				.put("account_id",account_id)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/card/backCardAfter.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 保存卡片认证码
	 */
	@RequestMapping("/saveCardAuthCode")
	public ModelAndView saveCardAuthCode(JsonPage jp,String card_serial,
			String card_number,String media_id,String card_authcode,String sector_list) {
		Map<String,Object> paramMap = createMap()
				.put("card_serial",card_serial)
				.put("card_number",card_number)
				.put("media_id",media_id)
				.put("card_authcode",card_authcode)
				.put("sector_list",sector_list)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/card/saveAuthcode.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 更新卡片有效期
	 */
	@RequestMapping("/updateCardEndDate")
	public ModelAndView updateCardEndDate(JsonPage jp,String account_id,
			String card_serial,String end_date,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("account_id",account_id)
				.put("card_serial",card_serial)
				.put("end_date",end_date)
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/card/setValidityCard.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 重置卡片密码
	 */
	@RequestMapping("/updateCardPassWord")
	public ModelAndView updateCardPassWord(JsonPage jp,String account_id,
			String card_serial,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("account_id",account_id)
				.put("card_serial",card_serial)
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/card/setPswCard.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 上传卡片离线记录
	 */
	@RequestMapping("/upLoadCard")
	public ModelAndView upLoadCard(JsonPage jp,String jdevid,
			String jdev_bh,String jcmdline) {
		Map<String,Object> paramMap = createMap()
				.put("jdevid",jdevid)
				.put("jdev_bh",jdev_bh)
				.put("jcmdline",jcmdline)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/card/readOffline.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 同步卡片信息
	 */
	@RequestMapping("/syncCard")
	public ModelAndView syncCard(JsonPage jp,String card_number,String media_id,
			String card_serial,String card_trad_serial,String device_id) {
		Map<String,Object> paramMap = createMap()
				.put("card_number",card_number)
				.put("media_id",media_id)
				.put("card_serial",card_serial)
				.put("card_trad_serial",card_trad_serial)
				.put("device_id",device_id)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/card/onlineQueryInfo.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 卡片有效性验证
	 */
	@RequestMapping("/validCard")
	public ModelAndView validCard(JsonPage jp,String account_id,
			String card_number,String media_id) {
		Map<String,Object> paramMap = createMap()
				.put("account_id",account_id)
				.put("card_number",card_number)
				.put("media_id",media_id)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/card/cardValid.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 清除发补卡中间状态
	 */
	@RequestMapping("/clearState")
	public ModelAndView clearState(JsonPage jp,String account_id,
			String card_serial,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("account_id",account_id)
				.put("card_serial",card_serial)
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/card/clearcardzt.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 发补卡验证（是否发补新卡，旧的卡会清除中间状态）
	 */
	@RequestMapping("/prCardValid")
	public ModelAndView prCardValid(JsonPage jp,String account_id,String card_number,
			String media_id) {
		Map<String,Object> paramMap = createMap()
				.put("account_id",account_id)
				.put("card_number",card_number)
				.put("media_id",media_id)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/card/cardVerificationts.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 账户验证（发补卡验证）
	 */
	@RequestMapping("/accountValid")
	public ModelAndView accountValid(JsonPage jp,String account_id,String id,String card_number,
			String media_id,String is_main_card,String old_card_serial,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("account_id",account_id)
				.put("id",id)
				.put("card_number",card_number)
				.put("media_id",media_id)
				.put("is_main_card",is_main_card)
				.put("old_card_serial",old_card_serial)
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/card/cardVerification.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 账户信息查询
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("/accountInfo")
	public ModelAndView accountInfo(JsonPage jp,String account_id) {
		Map<String,Object> paramMap = createMap()
				.put("account_id",account_id)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/card/accountQryInfo.do",paramMap);
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"cash_amt");
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"sub_amt");
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"deposit_amt");
		return Json(jp);
	}
	
	/**
	 * 主卡作为附卡发放验证
	 */
	@RequestMapping("/isMainCardTest")
	public ModelAndView isMainCardTest(JsonPage jp,String card_number,String media_id,String is_main_card) {
		Map<String,Object> paramMap = createMap()
				.put("card_number",card_number)
				.put("media_id",media_id)
				.put("is_main_card",is_main_card)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/card/isMainCardTest.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 卡片升级验证
	 */
	@RequestMapping("/ifCardUpdate")
	public ModelAndView ifCardUpdate(JsonPage jp,String card_number,String media_id) {
		Map<String,Object> paramMap = createMap()
				.put("card_number",card_number)
				.put("media_id",media_id)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/card/ifCardUpdate.do",paramMap);
		return Json(jp);
	}
}



