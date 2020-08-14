package com.garen.equipment;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.fastjson.JSONArray;
import com.garen.common.BaseAction;
import com.garen.common.JsonPage;
import com.garen.sys.dao.ICommonDao;
import com.garen.sys.web.SysAction;

@Controller  
@RequestMapping("/equipment")  
public class MerchantAssignAction extends BaseAction{
	
protected static Log log = LogFactory.getLog(SysAction.class);   
	
	@Autowired
	private ICommonDao commonDao;
	
	/**
	 * 商户设备指定列表查询
	 */
	@RequestMapping("merchant/assignListQuery")
	public ModelAndView queryAssignList(JsonPage jp,String dep_serial,
			String search_txt,String pageNum,String pageSize) {
		Map<String,Object> paramMap = createMap()
				.put("dep_serial",dep_serial)
				.put("search_txt",search_txt)
				.put("page_no",pageNum)
				.put("page_size",pageSize)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/dev/mode/qryDevList.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 商户设备指定商户
	 */
	@RequestMapping("merchant/assignSave")
	public ModelAndView saveAssign(JsonPage jp,HttpSession session) {
		JSONArray jarr =  parseJsonArray();
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("data",jarr)
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/dev/mode/devSet.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 扣款模式
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("merchant/chargeTypeQuery")
	public ModelAndView queryChargeType(JsonPage jp) {
		Map<String,Object> paramMap = createMap()
				.build();
		jp = commonDao.remoteCall(jp,"finweb/dev/mode/chargeType.do",paramMap);
		List<Map<String,Object>> mapList = (List<Map<String,Object>>)jp.getRows();
		if(mapList!=null){
			for (Map<String, Object> map : mapList) {
				String type_str = ((Integer)map.get("type")).toString();
				map.put("type_str", type_str);
			}
		}
		return Json(mapList);
	}
	
	/**
	 * 商户设备指定商户-关联设备
	 */
	@RequestMapping("merchant/devSet")
	public ModelAndView saveAssign(JsonPage jp,String bh,String merchant_account_id,
			String type,HttpSession session,String ifc) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("bh",bh)
				.put("merchant_account_id",merchant_account_id)
				.put("type",type)
				.put("gly_no",gly_no)
				.put("tallyEn", ifc)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/dev/merchant/devSet.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 商户设备指定商户-未关联的设备列表
	 */
	@RequestMapping("merchant/undev")
	public ModelAndView saveAssign(JsonPage jp,String search_txt,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("search_txt",search_txt)
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/dev/merchant/undev.do",paramMap);
		return Json(jp);
	}
	/**
	 * 商户设备指定商户-修改扣款模式
	 */
	@RequestMapping("merchant/mode")
	public ModelAndView saveAssign(JsonPage jp,String bh,String type,
			HttpSession session,String ifc) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("bh",bh)
				.put("type",type)
				.put("gly_no",gly_no)
				.put("tallyEn", ifc)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/dev/merchant/mode.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 商户设备指定商户-已关联的设备列表
	 */
	@RequestMapping("merchant/qryDevList")
	public ModelAndView qryDevList(JsonPage jp,String merchant_account_id,
			HttpSession session) {
		Map<String,Object> paramMap = createMap()
				.put("merchant_account_id",merchant_account_id)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/dev/merchant/qryDevList.do",paramMap);
		return Json(jp);
	}
	/**
	 * 商户设备指定商户-解除设备关联
	 */
	@RequestMapping("merchant/devdel")
	public ModelAndView devdel(JsonPage jp,String bh,
			HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("bh",bh)
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/dev/merchant/devdel.do",paramMap);
		return Json(jp);
	}
}



