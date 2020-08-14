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
import com.garen.sys.web.SysFilter;

@Controller  
@RequestMapping("/account")  
public class LoginTempAction extends BaseAction{
	
protected static Log log = LogFactory.getLog(SysAction.class);   
	
@Autowired
private ICommonDao commonDao;

/**
 * 登录
 */
@RequestMapping("/login")  
public ModelAndView login(JsonPage jp,String user_name,HttpSession session) {
	session.setAttribute("user_name", user_name);
	session.setAttribute(SysFilter.USER, user_name);
	return Json(jp);
}

/**
 * 模拟登录
 */
@RequestMapping("/login2")  
public ModelAndView login2(JsonPage jp,String gly,HttpSession session) {
	session.setAttribute(USER_NAME, gly);
	session.setAttribute(SysFilter.USER, gly);
	return Json(jp);
}

/**
 * 获取菜单
 */
@RequestMapping("/getMenu")  
public ModelAndView getMenu(JsonPage jp,HttpSession session,String menu_bh) {
	String gly_no = (String)session.getAttribute(USER_NAME);
	Map<String,Object> paramMap = createMap()
			.put("gly_no",gly_no)
			.put("menu_bh",menu_bh)
			.build();
	jp = commonDao.remoteCall(jp,"sys/menu/get.do",paramMap);
	return Json(jp);
}

}



