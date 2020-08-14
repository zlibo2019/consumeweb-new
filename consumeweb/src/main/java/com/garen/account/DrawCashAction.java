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
public class DrawCashAction extends BaseAction{
	
protected static Log log = LogFactory.getLog(SysAction.class);   
	
	@Autowired
	private ICommonDao commonDao;
	
	
	/**
	 * 取款筛选查询
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("/drawCashQuery")
	public ModelAndView queryDrawCash(JsonPage jp,String user_no,String dep_serial,
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
		jp = commonDao.remoteCall(jp,"finweb/acc/withdraw/filterQry.do",paramMap);
		formatDateMapList((List<Map<String,Object>>)jp.getRows(),"account_end_date");
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"cash_amt");
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"sub_amt");
		return Json(jp);
	}
	
	/**
	 * 取款明细查询
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("/drawCashDetailQuery")
	public ModelAndView queryDrawCashDetail(JsonPage jp,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/withdraw/qryWithdraw.do",paramMap);
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
	 * 取现金/补贴操作
	 */
	@RequestMapping("/drawCashOperation")
	public ModelAndView operateDrawCash(JsonPage jp,String account_id,
			String withdraw_amt,String cash_amt_before,String read_card_number,
			String read_media_id,String withdraw_lx,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("account_id",account_id)
				.put("withdraw_amt",formatMoney2FEN(withdraw_amt))
				.put("cash_amt_before",formatMoney2FEN(cash_amt_before))
				.put("gly_no",gly_no)
				.put("read_card_number",read_card_number)
				.put("read_media_id",read_media_id)
				.put("withdraw_lx",withdraw_lx)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/withdraw/cashOut.do",paramMap);
		return Json(jp);
	}
}



