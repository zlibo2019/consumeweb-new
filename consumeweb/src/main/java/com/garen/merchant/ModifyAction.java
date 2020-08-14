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
import com.garen.utils.MapBuilder;

@Controller  
@RequestMapping("/merchant")  
public class ModifyAction extends BaseAction{
	
protected static Log log = LogFactory.getLog(SysAction.class);   
	
	@Autowired
	private ICommonDao commonDao;
	
	/**
	 * 商户修改保存
	 */
	@RequestMapping("/modifySave")
	public ModelAndView saveModify(JsonPage jp,String merchant_name,
			String merchant_account_id,String merchant_addr,
			String merchant_telephone,String link_man,
			String merchant_bank_account,String merchant_bank,String fee_rate,
			String merchant_account_type,String merchant_dep,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("merchant_name", merchant_name)
				.put("merchant_account_id", merchant_account_id)
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
		jp = commonDao.remoteCall(jp,"finweb/merch/account/saveupd.do",paramMap);
	
		return Json(jp);
	}	
}



