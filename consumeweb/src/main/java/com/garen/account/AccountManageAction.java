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
public class AccountManageAction extends BaseAction{
	
protected static Log log = LogFactory.getLog(SysAction.class);   
	
	@Autowired
	private ICommonDao commonDao;
	
	/**
	 * 账户管理筛选查询
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("/manageQuery")
	public ModelAndView queryManage(JsonPage jp,String user_no,String dep_serial,
			String user_lname,String identity_id,String cx_type,String pageNum,String pageSize,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("user_no",user_no)
				.put("dep_serial",dep_serial)
				.put("user_lname",user_lname)
				.put("identity_id",identity_id)
				.put("cx_type",cx_type)
				.put("page_no",pageNum)
				.put("page_size",pageSize)
				.put("gly_no", gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/account/filterQry.do",paramMap);
		formatDateMapList((List<Map<String,Object>>)jp.getRows(),"account_end_date");
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"cash_amt");
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"deposit_amt");
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"sub_amt");
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"sum_amt");
//		List<Map<String,Object>> mapList = (List<Map<String,Object>>)jp.getRows();
//		if(mapList!=null){
//			for(Map<String,Object> map : mapList){
//				map.put("state_info", "已生效");
//			}
//		}
		return Json(jp);
	}
	
	/**
	 * 账户管理保存
	 */
	@RequestMapping("/manageSave")
	public ModelAndView saveManage(JsonPage jp,String account_id,
			String event_id,String account_end_date,
			String account_pwd,String read_card_number,
			String read_media_id,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("account_id",account_id)
				.put("event_id",event_id)
				.put("account_end_date",account_end_date)
				.put("account_pwd",account_pwd)
				.put("read_card_number",read_card_number)
				.put("read_media_id",read_media_id)
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/account/save.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 重置账户密码
	 */
	@RequestMapping("/resetPwd")
	public ModelAndView resetPwd(JsonPage jp,String account_id,
			String account_pwd,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("account_id",account_id)
				.put("account_pwd",account_pwd)
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/account/setPswAccount.do",paramMap);
		return Json(jp);
	}
}



