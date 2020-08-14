package com.garen.functionQuery;

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
@RequestMapping("/functionQuery")  
public class SubsidyAccountAction extends BaseAction{
	
protected static Log log = LogFactory.getLog(SysAction.class);   
	
	@Autowired
	private ICommonDao commonDao;
	
	/**
	 * 补贴账户筛选查询
	 */
	/*@SuppressWarnings("unchecked")
	@RequestMapping("subsidyAccount/query")
	public ModelAndView query(JsonPage jp,String user_no,String dep_serial,
			String user_lname,String user_id,HttpSession session) {
		
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("user_no",user_no)
				.put("dep_serial",dep_serial)
				.put("user_lname",user_lname)
				.put("user_id",user_id)
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/func/trad/userfilterQry.do",paramMap);
		formatDateMapList((List<Map<String,Object>>)jp.getRows(),"account_end_date");
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"cash_amt");
		return Json(jp);
	}*/
	
	/**
	 * 补贴账户列表查询
	 */
	/*@SuppressWarnings("unchecked")
	@RequestMapping("subsidyAccount/detailQuery")
	public ModelAndView queryDetail(JsonPage jp,String user_serial,
			String pageNum,String pageSize) {
		
		Map<String,Object> paramMap = createMap()
				.put("user_serial",user_serial)
				.put("page_no",pageNum)
				.put("page_size",pageSize)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/func/sub/filterQry.do",paramMap);
		formatDateMapList((List<Map<String,Object>>)jp.getRows(),"sub_begin_date");
		formatDateMapList((List<Map<String,Object>>)jp.getRows(),"sub_end_date");
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"sub_amt");
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"sub_zero_amt");
		return Json(jp);
	}*/
	
	/**
	 * 20170510补贴账户列表查询/finweb/func/sub/userfilterQry.do
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("subsidyAccount/query")
	public ModelAndView query(JsonPage jp,String user_no,
			String dep_serial,String user_lname,String user_id,
			String pageNum,String pageSize,HttpSession session) {
		
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("user_no",user_no)
				.put("dep_serial",dep_serial)
				.put("user_lname",user_lname)
				.put("user_id",user_id)
				.put("gly_no",gly_no)
				.put("page_no",pageNum)
				.put("page_size",pageSize)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/func/sub/userfilterQry.do",paramMap);
		formatDateMapList((List<Map<String,Object>>)jp.getRows(),"sub_begin_date");
		formatDateMapList((List<Map<String,Object>>)jp.getRows(),"sub_end_date");
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"sub_amt");
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"sub_zero_amt");
		return Json(jp);
	}
}



