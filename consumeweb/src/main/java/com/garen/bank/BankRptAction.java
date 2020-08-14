package com.garen.bank;

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
@RequestMapping("/bank") 
public class BankRptAction extends BaseAction {

protected static Log log = LogFactory.getLog(SysAction.class);   
	
	@Autowired
	private ICommonDao commonDao;
	
	/**
	 * 查询银行
	 */
//	@RequestMapping("qryBank")
//	public ModelAndView merchQuery(JsonPage jp,HttpSession session) {
//		String gly_no = (String) session.getAttribute(USER_NAME);
//		Map<String,Object> paramMap = createMap()
//				.put("gly_no",gly_no)
//				.build();
//		jp = commonDao.remoteCall(jp,"finweb/base/qryBank.do",paramMap);
//		return Json(jp.getRows());
//	}	
	
	/**
	 * 查询银行
	 */
//	@RequestMapping("qryBank")
//	public ModelAndView placeQueryAll(JsonPage jp,String dep_serial) {
//		Map<String,Object> paramMap = createMap().build();
//		jp = commonDao.remoteCall(jp,"finweb/base/qryBank.do",paramMap);
//		return Json(jp);
//	}	
}
