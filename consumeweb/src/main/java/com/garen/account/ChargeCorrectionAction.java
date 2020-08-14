package com.garen.account;

import java.util.ArrayList;
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
public class ChargeCorrectionAction extends BaseAction{
	
protected static Log log = LogFactory.getLog(SysAction.class);   
	
	@Autowired
	private ICommonDao commonDao;
	
	
	/**
	 * 充值纠错筛选查询
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("/chargeCorrectionQuery")
	public ModelAndView queryChargeCorrection(JsonPage jp,String user_no,String dep_serial,
			String user_lname,String user_id,String cx_type,HttpSession session) {
		
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("user_no",user_no)
				.put("dep_serial",dep_serial)
				.put("user_lname",user_lname)
				.put("user_id",user_id)
				.put("cx_type",cx_type)
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/recharge/filterQry.do",paramMap);
		formatDateMapList((List<Map<String,Object>>)jp.getRows(),"account_end_date");
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"cash_amt");
		return Json(jp);
	}
	
	/**
	 * 充值纠错明细查询
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("/chargeCorrectionDetailQuery")
	public ModelAndView queryChargeCorrectionDetail(JsonPage jp,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/recharge/qryRecharge.do",paramMap);
		formatTimeMapList((List<Map<String,Object>>)jp.getRows(),"sj");
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"income");
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"pay");
		//合计
		Map<String,Object> map = (Map<String,Object>)jp.getRetData();
		if(!map.isEmpty()){
			String ic = (String)map.get("incomes");
			String pay = (String)map.get("pays");
			if(ic!=null && pay!=null){
				//页脚
				List<Map<String,Object>> footerList = new ArrayList<>();
				footerList.add(createMap()
						.put("index", "合计")
						.put("income", ic)
						.put("pay",pay)
						.put("footerFlag", true)
						.build());
				
				footerList.add(createMap()
						.put("index", "应交款金额")
						.put("footerFlag", true)
						.put("income", (Long.parseLong(ic)-Long.parseLong(pay))+"")
						.build());
				jp.setFooter(footerList);
			}
			formatMoney2YUAN2((List<Map<String,Object>>)jp.getFooter(),"income");
			formatMoney2YUAN2((List<Map<String,Object>>)jp.getFooter(),"pay");
		}
		return Json(jp);
	}
	
	/**
	 * 充值纠错操作
	 */
	@RequestMapping("/chargeCorrectionOperation")
	public ModelAndView operateChargeCorrection(JsonPage jp,String account_id,
			String rchCorrect_amt,String cash_amt_before,String read_card_number,
			String read_media_id,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("account_id",account_id)
				.put("rchCorrect_amt",formatMoney2FEN(rchCorrect_amt))
				.put("cash_amt_before",formatMoney2FEN(cash_amt_before))
				.put("read_card_number",read_card_number)
				.put("read_media_id",read_media_id)
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/rchCorrect/correct.do",paramMap);
		return Json(jp);
	}
}



