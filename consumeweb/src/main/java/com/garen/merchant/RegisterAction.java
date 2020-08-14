package com.garen.merchant;

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
import com.garen.utils.MapBuilder;

@Controller  
@RequestMapping("/merchant")  
public class RegisterAction extends BaseAction{
	
protected static Log log = LogFactory.getLog(SysAction.class);   
	
	@Autowired
	private ICommonDao commonDao;
	
	/**
	 * 商户类型查询
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("/registerTypeQuery")
	public ModelAndView queryRegisterType(JsonPage jp) {
		Map<String,Object> paramMap = createMap()
				.build();
		jp = commonDao.remoteCall(jp,"finweb/merch/account/type.do",paramMap);
		List<Map<String,Object>> mapList = (List<Map<String,Object>>)jp.getRows();
		if(mapList!=null){
			for (Map<String, Object> map : mapList) {
				String type_str = ((Integer)map.get("type")).toString();
				map.put("type_str", type_str);
			}
		}
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
		jp = commonDao.remoteCall(jp,"finweb/merch/register/qryMerchList.do",paramMap);
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
	 * 商户保存
	 */
	@RequestMapping("/registerSave")
	public ModelAndView saveRegister(JsonPage jp,String merchant_name,String merchant_addr,
			String merchant_telephone,String link_man,String merchant_bank_account,
			String merchant_bank,String fee_rate,String merchant_account_type,
			String merchant_dep,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("merchant_name", merchant_name)
				.put("merchant_addr", merchant_addr)
				.put("merchant_telephone", merchant_telephone)
				.put("link_man", link_man)
				.put("merchant_bank_account", merchant_bank_account)
				.put("merchant_bank", merchant_bank)
				.put("fee_rate", fee_rate)
				.put("merchant_account_type", merchant_account_type)
				.put("merchant_dep", merchant_dep)
				.put("gly_no", gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/merch/register/save.do",paramMap);
	
		return Json(jp);
	}	
	
}



