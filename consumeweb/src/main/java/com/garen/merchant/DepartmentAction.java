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
public class DepartmentAction extends BaseAction{
	
protected static Log log = LogFactory.getLog(SysAction.class);   
	
	@Autowired
	private ICommonDao commonDao;
	
	/**
	 * 商户部门查询
	 */
	@RequestMapping("/departmentQuery")
	public ModelAndView queryDepartment(JsonPage jp,String unit_id) {
		Map<String,Object> paramMap = createMap()
				.put("unit_id",unit_id)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/merch/dep/qryMerchDep.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 商户部门新增
	 */
	@RequestMapping("/departmentAdd")
	public ModelAndView addDepartment(JsonPage jp,String dep_name,
			String dep_parent,HttpSession session){
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("dep_name",dep_name)
				.put("dep_parent",dep_parent)
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/merch/dep/save.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 商户部门修改
	 */
	@RequestMapping("/departmentUpdate")
	public ModelAndView updateDepartment(JsonPage jp,String dep_name,
			String dep_serial,String dep_parent,HttpSession session){
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("dep_name",dep_name)
				.put("dep_serial",dep_serial)
				.put("dep_parent",dep_parent)
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/merch/dep/saveupd.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 商户部门删除
	 */
	@RequestMapping("/departmentDelete")
	public ModelAndView deleteDepartment(JsonPage jp,String dep_serial,HttpSession session){
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("dep_serial",dep_serial)
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/merch/dep/del.do",paramMap);
		return Json(jp);
	}
}



