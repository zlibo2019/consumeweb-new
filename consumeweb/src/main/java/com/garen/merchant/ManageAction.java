package com.garen.merchant;

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
@RequestMapping("/merchant")  
public class ManageAction extends BaseAction{
	
protected static Log log = LogFactory.getLog(SysAction.class);   
	
	@Autowired
	private ICommonDao commonDao;
	
	
	/**
	 *  全部商户查询
	 */
	@RequestMapping("manage/allMerchantQuery")
	public ModelAndView allMerchantQuery(JsonPage jp,String pageSize,
			String pageNum,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("gly_no",gly_no)
				.put("page_size",pageSize)
				.put("page_no",pageNum)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/merch/account/qryAll.do",paramMap);

		return Json(jp);
	}


	/**
	 *  正常商户查询
	 */
	@RequestMapping("manage/normalMerchantQuery")
	public ModelAndView normalMerchanQuery(JsonPage jp,String pageSize,
			String pageNum,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("gly_no",gly_no)
				.put("page_size",pageSize)
				.put("page_no",pageNum)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/merch/account/qryNormal.do",paramMap);
		
		return Json(jp);
	}	
	
	/**
	 *  销户商户查询
	 */
	@RequestMapping("manage/deleteMerchantQuery")
	public ModelAndView deleteMerchantQuery(JsonPage jp,String pageSize,
			String pageNum,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("gly_no",gly_no)
				.put("page_size",pageSize)
				.put("page_no",pageNum)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/merch/account/qryDel.do",paramMap);
		
		return Json(jp);
	}	
	
	/**
	 *  新增商户
	 */
	@RequestMapping("manage/addMerchant")
	public ModelAndView addMerchant(JsonPage jp,String merchant_name,String merchant_addr,
			String merchant_telephone,String link_man,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("merchant_name", merchant_name)
				.put("merchant_addr", merchant_addr)
				.put("merchant_telephone", merchant_telephone)
				.put("link_man", link_man)
				.put("gly_no", gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/merch/account/add.do",paramMap);
	
		return Json(jp);
	}	
	
	/**
	 * 修改商户
	 */
	@RequestMapping("manage/modifyMerchant")
	public ModelAndView modifyMerchant(JsonPage jp,String merchant_name,
			String merchant_account_id,String merchant_addr,
			String merchant_telephone,String link_man,
			HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("merchant_name", merchant_name)
				.put("merchant_account_id", merchant_account_id)
				.put("merchant_addr", merchant_addr)
				.put("merchant_telephone", merchant_telephone)
				.put("link_man", link_man)
				.put("gly_no", gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/merch/account/saveupd.do",paramMap);
	
		return Json(jp);
	}	
	
	/**
	 * 商户销户
	 */
	@RequestMapping("manage/deleteMerchant")
	public ModelAndView deleteMerchant(JsonPage jp,String ids,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("gly_no", gly_no)
				.put("id", ids)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/merch/account/del.do",paramMap);
	
		return Json(jp);
	}	
}



