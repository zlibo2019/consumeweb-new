package com.garen.permission;

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
import com.garen.common.doc.ExportBean;
import com.garen.common.doc.IExportBean;
import com.garen.sys.dao.ICommonDao;
import com.garen.sys.web.SysAction;

@Controller  
@RequestMapping("/permission")  
public class PermissionAction extends BaseAction{
	
protected static Log log = LogFactory.getLog(SysAction.class);   
	
	@Autowired
	private ICommonDao commonDao;
	
	/**
	 * 查询
	 */
	@RequestMapping("/glyToMerchant/permissionQuery")
	public ModelAndView logQry(final ExportBean jp,String gly_no,
			String merchant_lx) {
		final Map<String,Object> paramMap = createMap()
				.put("gly_no",gly_no)
				.put("merchant_lx",merchant_lx)
				.build();
		
		IExportBean exportBean = new IExportBean() {
			@SuppressWarnings("unchecked")
			@Override
            public List<Map<String, Object>> queryRow(ExportBean pb) {
				paramMap.put("page_size",pb.getPageSize());//更新页数
				paramMap.put("page_no",pb.getPageNum());
				commonDao.remoteCall(jp,"finweb/merch/permissions/qryBusiness.do",paramMap);
                return (List<Map<String,Object>>)pb.getRows();
            }
        };
		return JsonEx(jp,exportBean);
	}
	
	/**
	 * 新增
	 */
	@RequestMapping("/glyToMerchant/permissionAdd")
	public ModelAndView permissionAdd(JsonPage jp,String merchant_dep_serial,
			String merchant_lx,String is_include_son,String lx,String gly_no,HttpSession session) {
		String operator = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("merchant_dep_serial",merchant_dep_serial)
				.put("merchant_lx",merchant_lx)
				.put("is_include_son","1")//默认包含
				.put("lx",lx)
				.put("gly_no",gly_no)
				.put("operator",operator)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/merch/permissions/add.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 删除
	 */
	@RequestMapping("/glyToMerchant/permissionDel")
	public ModelAndView permissionDel(JsonPage jp,String merchant_dep_serial,
			String merchant_lx,String is_include_son,String lx,String gly_no,HttpSession session) {
		String operator = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("merchant_dep_serial",merchant_dep_serial)
				.put("merchant_lx",merchant_lx)
				.put("is_include_son","1")//默认包含
				.put("lx",lx)
				.put("gly_no",gly_no)
				.put("operator",operator)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/merch/permissions/add.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 操作员授权查询显示
	 * add by LYh 2017-5-25
	 */
	@RequestMapping("/permissions/opPermisQuery")
	public ModelAndView opPermisQry(JsonPage jp,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/manage/permissions/filterQry.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 设置查询-操作员
	 * @author twl
	 * @date 2017-06-12
	 */
	@RequestMapping("/permissions/opSetQuery")
	public ModelAndView opSetQuery(JsonPage jp,HttpSession session,String glyId) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("glyId",gly_no)
				.put("gly_no", glyId)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/manage/permissions/qrySetGly.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 设置查询-商户
	 * @author twl
	 * @date 2017-06-12
	 */
	@RequestMapping("/permissions/merchantSetQuery")
	public ModelAndView merchantSetQuery(JsonPage jp,HttpSession session,String glyId) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("glyId",gly_no)
				.put("gly_no", glyId)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/manage/permissions/qrySetMerch.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 设置查询-IP
	 * @author twl
	 * @date 2017-06-12
	 */
	@RequestMapping("/permissions/ipSetQuery")
	public ModelAndView ipSetQuery(JsonPage jp,HttpSession session,String glyId) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("glyId",gly_no)
				.put("gly_no", glyId)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/manage/permissions/qrySetIP.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 设置保存-操作员
	 * @author twl
	 * @date 2017-06-12
	 */
	@RequestMapping("/permissions/opSetSave")
	public ModelAndView opSetSave(JsonPage jp,HttpSession session,String glyId,String isall) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("glyId",gly_no)
				.put("gly_no", glyId)
				.put("isall",isall)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/manage/permissions/saveSetGly.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 设置保存-商户
	 * @author twl
	 * @date 2017-06-12
	 */
	@RequestMapping("/permissions/merchantSetSave")
	public ModelAndView merchantSetSave(JsonPage jp,HttpSession session,String glyId,String isall,String detail) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("glyId",gly_no)
				.put("gly_no", glyId)
				.put("isall",isall)
				.put("detail",detail)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/manage/permissions/saveSetMerch.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 设置保存-IP
	 * @author twl
	 * @date 2017-06-12
	 */
	@RequestMapping("/permissions/ipSetSave")
	public ModelAndView ipSetSave(JsonPage jp,HttpSession session,String glyId,String isall,String detail) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("glyId",gly_no)
				.put("gly_no", glyId)
				.put("isall",isall)
				.put("detail",detail)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/manage/permissions/saveSetIP.do",paramMap);
		return Json(jp);
	}
	
}



