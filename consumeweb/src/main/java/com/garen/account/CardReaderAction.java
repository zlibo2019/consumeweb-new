package com.garen.account;

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
public class CardReaderAction extends BaseAction{
	
protected static Log log = LogFactory.getLog(SysAction.class);   
	
	@Autowired
	private ICommonDao commonDao;
	
	/**
	 * 读卡器类型查询
	 */
	@RequestMapping("/cardReader/query")
	public ModelAndView query(JsonPage jp,String id) {

		Map<String,Object> paramMap = createMap()
				.put("id",id)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/cardReader/qryCardReader.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 系统参数
	 */
	@RequestMapping("/cardReader/sysKeySet")
	public ModelAndView sysKeySet(JsonPage jp) {

		Map<String,Object> paramMap = createMap()
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/cardReader/sysKeySet.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 卡片参数
	 */
	@RequestMapping("/cardReader/cardTypeSet")
	public ModelAndView cardTypeSet(JsonPage jp,String is_write) {

		Map<String,Object> paramMap = createMap()
				.put("is_write",is_write)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/cardReader/cardTypeSet.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 记录日志
	 */
	@RequestMapping("/cardReader/setLog")
	public ModelAndView setLog(JsonPage jp,String lx,String log_name,
			String log_bz,String log_table,String log_key,String log_value,
			String log_content_old,String log_content_new,String log_state,HttpSession session) {

		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("lx",lx)
				.put("log_name",log_name)
				.put("log_bz",log_bz)
				.put("log_table",log_table)
				.put("log_key",log_key)
				.put("log_value",log_value)
				.put("log_content_old",log_content_old)
				.put("log_content_new",log_content_new)
				.put("log_state",log_state)
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/cardReader/cardreaderLog.do",paramMap);
		return Json(jp);
	}
	
}



