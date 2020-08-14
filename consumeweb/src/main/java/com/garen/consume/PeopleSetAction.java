package com.garen.consume;

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
@RequestMapping("/consume")  
public class PeopleSetAction extends BaseAction{
	
protected static Log log = LogFactory.getLog(SysAction.class);   
	
	@Autowired
	private ICommonDao commonDao;
	
	/**
	 * 人群设置查询
	 */
	@RequestMapping("/crowdQuery")
	public ModelAndView queryCrowd(JsonPage jp,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("gly_no",gly_no)
				.build();
		//jp = commonDao.remoteCall(jp,"finweb/rule/crowd/qryCrowd.do",paramMap);
		
		jp = commonDao.remoteCall(jp,"/finweb/rule/finRule/qryCrowd.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 人群设置新增
	 */
	@RequestMapping("/crowdAdd")
	public ModelAndView addCrowd(JsonPage jp,String crowd_name,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("crowd_name", crowd_name)
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/rule/crowd/addCrowd.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 人群设置修改
	 */
	@RequestMapping("/crowdUpdate")
	public ModelAndView updateCrowd(JsonPage jp,String crowd_id,
			String crowd_name,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("crowd_id", crowd_id)
				.put("crowd_name", crowd_name)
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/rule/crowd/editCrowd.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 人群设置删除
	 */
	@RequestMapping("/crowdDelete")
	public ModelAndView deleteCrowd(JsonPage jp,String crowd_id,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("crowd_id", crowd_id)
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/rule/crowd/delCrowd.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 人群设置根据部门查询身份列表
	 */
	@RequestMapping("/ideQueryByDep")
	public ModelAndView queryIdeByDep(JsonPage jp,String dep_serial) {
		Map<String,Object> paramMap = createMap()
				.put("dep_serial", dep_serial)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/rule/crowd/depFilterIden.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 按部门身份点击确定
	 */
	@RequestMapping("/depIdeSet")
	public ModelAndView setDepIde(JsonPage jp,String crowd_id,String dep_serial,
			String tt_order) {
		Map<String,Object> paramMap = createMap()
				.put("crowd_id", crowd_id)
				.put("dep_serial", dep_serial)
				.put("tt_order", tt_order)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/rule/crowd/setByDep.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 按部门身份查询
	 */
	@RequestMapping("/depIdeQuery")
	public ModelAndView queryDepIde(JsonPage jp,String crowd_id,String pageNum,String pageSize) {//添加分页字段 add by LYh 2017-5-23
		Map<String,Object> paramMap = createMap()
				.put("crowd_id", crowd_id)
				.put("page_no",pageNum)
				.put("page_size",pageSize)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/rule/crowd/qryByDep.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 根据查询条件查询人员列表
	 */
	@RequestMapping("/userQueryBySearch")
	public ModelAndView queryUserBySearch(JsonPage jp,String user_no,String user_lname,
			String dep_serial,String tt_order,String fuzzy,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("user_no", user_no)
				.put("user_lname", user_lname)
				.put("dep_serial", dep_serial)
				.put("tt_order", tt_order)
				.put("fuzzy", fuzzy)
                .put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/rule/crowd/filterQry.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 根据人群查询人员table
	 */
	@RequestMapping("/userQueryByCrowd")
	public ModelAndView queryUserByCrowd(JsonPage jp,String crowd_id,String pageNum,String pageSize) {//添加分页字段 add by LYh 2017-5-23
		Map<String,Object> paramMap = createMap()
				.put("crowd_id", crowd_id)
				.put("page_no",pageNum)
				.put("page_size",pageSize)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/rule/crowd/qryByUser.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 按人员确定
	 */
	@RequestMapping("/userSet")
	public ModelAndView setUser(JsonPage jp,String crowd_id,String user_serial) {
		Map<String,Object> paramMap = createMap()
				.put("crowd_id", crowd_id)
				.put("user_serial", user_serial)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/rule/crowd/setByUser.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 下方规则列表删除
	 */
	@RequestMapping("/depIdeDelete")
	public ModelAndView deleteDepIde(JsonPage jp,String rule_id) {
		Map<String,Object> paramMap = createMap()
				.put("rule_id", rule_id)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/rule/crowd/delRuleRelated.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 下方人员列表删除
	 */
	@RequestMapping("/userDelete")
	public ModelAndView deleteUser(JsonPage jp,String user_serial) {
		Map<String,Object> paramMap = createMap()
				.put("user_serial", user_serial)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/rule/crowd/delUserRelated.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 规则关系批量变更（删除后新增）
	 */
	@RequestMapping("/changeRuleRelated")
	public ModelAndView changeRuleRelated(JsonPage jp,String crowd_id,String dep_serial,
			String identity_id) {
		Map<String,Object> paramMap = createMap()
				.put("crowd_id", crowd_id)
				.put("dep_serial", dep_serial)
				.put("identity_id", identity_id)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/rule/crowd/chgRuleRelated.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 人员关系批量变更（删除后新增）
	 */
	@RequestMapping("/changeUserRelated")
	public ModelAndView changeUserRelated(JsonPage jp,String crowd_id,String user_serial) {
		Map<String,Object> paramMap = createMap()
				.put("crowd_id", crowd_id)
				.put("user_serial", user_serial)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/rule/crowd/chgUserRelated.do",paramMap);
		return Json(jp);
	}
	
}



