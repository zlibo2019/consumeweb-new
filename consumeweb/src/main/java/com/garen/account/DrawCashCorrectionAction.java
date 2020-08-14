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
public class DrawCashCorrectionAction extends BaseAction{
	
protected static Log log = LogFactory.getLog(SysAction.class);   
	
	@Autowired
	private ICommonDao commonDao;
	
	
	/**
	 * 消费纠错人员筛选查询
	 */
	/*@SuppressWarnings("unchecked")
	@RequestMapping("/drawCashCorrectionUserQuery")
	public ModelAndView queryDrawCashCorrectionUser(JsonPage jp,String user_no,String dep_serial,
			String user_lname,String user_id,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("user_no",user_no)
				.put("dep_serial",dep_serial)
				.put("user_lname",user_lname)
				.put("user_id",user_id)
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/recharge/filterQry.do",paramMap);
		formatDateMapList((List<Map<String,Object>>)jp.getRows(),"account_end_date");
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"cash_amt");
		return Json(jp);
	}*/
	
	/**
	 * 消费纠错查询
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("/drawCashCorrectionQuery")
	public ModelAndView queryDrawCashCorrection(JsonPage jp,
			String cx_type,	String bill_begin,String bill_end,
			String user_no,String user_lname,String user_id,
			String merchant_account_id,String acdep_serial,
			String dep_serial,String pageSize,String pageNum) {
		Map<String,Object> paramMap = createMap()
				.put("cx_type",cx_type)
				.put("bill_begin",bill_begin)
				.put("bill_end",bill_end)
				.put("user_no",user_no)
				.put("user_lname",user_lname)
				.put("user_id",user_id)
				.put("merchant_account_id",merchant_account_id)
				.put("acdep_serial",acdep_serial)
				.put("dep_serial",dep_serial)
				.put("page_size",pageSize)
				.put("page_no",pageNum)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/finCorrect/finfilterQry.do",paramMap);
		formatTimeMapList((List<Map<String,Object>>)jp.getRows(),"trad_sj");
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"trad_amt");
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"undo_amt");
		formatDateMapList((List<Map<String,Object>>)jp.getRows(),"bill_date");
		return Json(jp);
	}
	
	/**
	 * 消费纠错
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("/drawCashCorrect")
	public ModelAndView drawCashCorrect(JsonPage jp,String id,
			String account_id,String trad_amt,String undo_amt_before,
			String read_card_number,String read_media_id,String bill_date,
			HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("id",id)
				.put("account_id",account_id)
				.put("trad_amt",formatMoney2FEN(trad_amt))
				.put("undo_amt_before",formatMoney2FEN(undo_amt_before))
				.put("read_card_number",read_card_number)
				.put("read_media_id",read_media_id)
				.put("bill_date",bill_date)
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/finCorrect/correct.do",paramMap);
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"undo_amt");
		return Json(jp);
	}
	
}



