package com.garen.synthesizeSet;

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
@RequestMapping("/synthesizeSet")  
public class PasswordRuleAction extends BaseAction{
	
protected static Log log = LogFactory.getLog(SysAction.class);   
	
	@Autowired
	private ICommonDao commonDao;
	
	/**
	 * 密码规则设置列表查询
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("passwordRule/query")
	public ModelAndView query(JsonPage jp,String pageNum,String pageSize) {
		Map<String,Object> paramMap = createMap()
				.put("page_no", pageNum)
				.put("page_size", pageSize)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/togeth/pwdrules/filterQry.do",paramMap);
		formatTimeMapList((List<Map<String,Object>>)jp.getRows(),"sj");
		return Json(jp);
	}
	

	
	/**
	 * 密码规则设置新增
	 */
	@RequestMapping("passwordRule/add")
	public ModelAndView addPasswordRule(JsonPage jp,String scheme_name,
			String pwd_personal,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("scheme_name", scheme_name)
				.put("pwd_personal", pwd_personal)
				.put("gly_no", gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/togeth/pwdrules/save.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 密码规则设置修改
	 */
	@RequestMapping("passwordRule/update")
	public ModelAndView updatePasswordRule(JsonPage jp,String scheme_id,
			String scheme_name,String pwd_personal,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("scheme_id", scheme_id)
				.put("scheme_name", scheme_name)
				.put("pwd_personal", pwd_personal)
				.put("gly_no", gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/togeth/pwdrules/update.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 密码规则设置删除
	 */
	@RequestMapping("passwordRule/delete")
	public ModelAndView deletePasswordRule(JsonPage jp,String scheme_id,
			HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("scheme_id", scheme_id)
				.put("gly_no", gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/togeth/pwdrules/del.do",paramMap);
		return Json(jp);
	}
}



