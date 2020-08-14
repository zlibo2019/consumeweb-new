package com.garen.subsidy;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import com.garen.common.BaseAction;
import com.garen.common.JsonPage;
import com.garen.common.doc.ExcelHelper;
import com.garen.sys.dao.ICommonDao;
import com.garen.sys.web.SysAction;
import com.garen.utils.CommonUtils;

@Controller  
@RequestMapping("/subsidy")  
public class ProvideAction extends BaseAction{
	
protected static Log log = LogFactory.getLog(SysAction.class);   
	
	@Autowired
	private ICommonDao commonDao;
	
	/**
	 * 补贴发放规则查询
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("/provideRuleQuery")
	public ModelAndView queryProvideRule(JsonPage jp,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/sub/pay/qryRule.do",paramMap);
		formatDateMapList((List<Map<String,Object>>)jp.getRows(),"begin_date");
		formatDateMapList((List<Map<String,Object>>)jp.getRows(),"end_date");
		return Json(jp);
	}
	
	
	/**
	 * 补贴发放规则创建
	 */
	
	@RequestMapping("/provideRuleAdd")
	public ModelAndView addProvideRule(JsonPage jp,String sub_month,
			String begin_date,String end_date,String batch_no,String enable_enddate,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("gly_no",gly_no)
				.put("sub_month",sub_month)
				.put("begin_date",begin_date)
				.put("end_date",end_date)
				.put("batch_no",batch_no)
				.put("enable_enddate",enable_enddate)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/sub/pay/addRule.do",paramMap);
		return Json(jp);
	}	
	
	/**
	 * 补贴发放修改规则
	 */
	@RequestMapping("/provideRuleEdit")
	public ModelAndView editProvideRule(JsonPage jp,String sub_month,
			String begin_date,String end_date,String batch_no,String enable_enddate,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("gly_no",gly_no)
				.put("sub_month",sub_month)
				.put("begin_date",begin_date)
				.put("end_date",end_date)
				.put("batch_no",batch_no)
				.put("enable_enddate",enable_enddate)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/sub/pay/editRule.do",paramMap);
		return Json(jp);
	}	
	
	/**
	 * 创建规则时查询批次号
	 */
	@RequestMapping("/provideBatchQuery")
	public ModelAndView queryProvideBatch(JsonPage jp,String sub_month,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("gly_no",gly_no)
				.put("sub_month",sub_month)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/sub/pay/qryBatch.do",paramMap);
		return Json(jp);
	}	
	
	/**
	 * 补贴录入根据身份和部门查询员工列表
	 */
	@RequestMapping("/provideEmpQuery")
	public ModelAndView queryProvideEmp(JsonPage jp,String dep_serial,
			String user_duty,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("gly_no",gly_no)
				.put("dep_serial",dep_serial)
				.put("user_duty",user_duty)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/sub/pay/entryUserQry.do",paramMap);
		return Json(jp);
	}	
	
	/**
	 * 补贴录入
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("/subsidyAdd")
	public ModelAndView addSubsidy(JsonPage jp,String account_id,
			String sub_amt,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("gly_no",gly_no)
				.put("account_id",account_id)
				.put("sub_amt",formatMoney2FEN(sub_amt))
				.build();
		jp = commonDao.remoteCall(jp,"finweb/sub/pay/entrySub.do",paramMap);
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"sub_amt");
		return Json(jp);
	}	
	
	/**
	 * 补贴导入检测
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("/userImportCheck")
	public ModelAndView userImportCheck(JsonPage jp,
			@RequestParam MultipartFile userFile,HttpSession session) {
		//解析file...start
		String gly_no = (String) session.getAttribute(USER_NAME);
		try {
			List<Map<String,Object>> mapList = ExcelHelper.readExcelWithId(jp,userFile.getInputStream(), 
				0,3,3,3);//0：第一个工作簿，3：从第四列开始，3：共3列，3：从第四行开始
			//log.debug(mapList);
			if(mapList.size()==0){
				jp.setId(-1);
				jp.setInfo("excel数据不合法！");
			}else{
				Map<String,Object> paramMap = createMap()
						.put("data",formatMoney2Excel(mapList,"sub_amt"))
						.put("gly_no",gly_no)
						.build();
				jp = commonDao.remoteCall(jp,"finweb/sub/pay/impSubCheck.do",paramMap);
				formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"sub_amt");
			}
			
		} catch (IOException e) {
			e.printStackTrace();
			return null;
		}
		return Html(toJSON(jp));
		//解析file...end
	}
	
	/**
	 * 补贴导入
	 */
	@RequestMapping("/userImport")
	public ModelAndView userImport(JsonPage jp,String operate_code,
			HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("operate_code",operate_code)
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/sub/pay/impSub.do",paramMap);
		
		return Json(jp);
	}	

	/**
	 * 查询人员名单
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("/provideUserQuery")
	public ModelAndView queryProvideUser(JsonPage jp,String pageSize,
			String pageNum,String filter, HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
		       .put("page_size",pageSize)
		       .put("page_no",pageNum)
		       .put("gly_no",gly_no).build();
		       if (filter!=null && !"".equals(filter)) {
			       paramMap.put("filter",filter);
		       }
		/*Map<String,Object> paramMap = createMap()
				.put("page_size",pageSize)
				.put("page_no",pageNum)
				.put("gly_no",gly_no)
				.build();*/
		jp = commonDao.remoteCall(jp,"finweb/sub/pay/qryUserList.do",paramMap);
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"sub_amt");
		Map<String,Object> map = (Map<String,Object>)jp.getRetData();
		List<Map<String,Object>> mapList = new ArrayList<>();
		mapList.add(map);
		jp.setRetData(mapList);
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRetData(),"subamts");
		return Json(jp);
	}	
	
	/**
	 * 查询人员名单--模糊查询
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("/provideSearchUserQuery")
	public ModelAndView queryProvideSearchUser(JsonPage jp,String pageSize,
			String pageNum,String filter, HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
		       .put("page_size",pageSize)
		       .put("page_no",pageNum)
		       .put("filter",filter)
		       .put("gly_no",gly_no).build();

		jp = commonDao.remoteCall(jp,"finweb/sub/pay/userListFilter.do",paramMap);
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"sub_amt");
		Map<String,Object> map = (Map<String,Object>)jp.getRetData();
		List<Map<String,Object>> mapList = new ArrayList<>();
		mapList.add(map);
		jp.setRetData(mapList);
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRetData(),"subamts");
		return Json(jp);
	}	

	/**
	 * 删除人员名单
	 */
	@RequestMapping("/provideUserDelete")
	public ModelAndView deleteProvideUser(JsonPage jp,String user_serial,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("gly_no",gly_no)
				.put("user_serial", user_serial)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/sub/pay/delUserList.do",paramMap);
		return Json(jp);
	}	
	
	/**
	 * 删除人员名单
	 */
	@RequestMapping("/provideUserClear")
	public ModelAndView clearProvideUser(JsonPage jp,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/sub/pay/clearUserList.do",paramMap);
		return Json(jp);
	}	
	
	/**
	 * 补贴发放
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("/subsidyProvide")
	public ModelAndView provideSubsidy(JsonPage jp,String sub_month,
			String batch_no,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
//		List<Map<String,Object>> mapList = new ArrayList<>();
//		String[] account = account_id.split(",");
//		String[] amt = sub_amt.split(",");
//		for(int i=0; i<account_id.split(",").length; i++){
//			mapList.add(createMap()
//					.put("account_id", account[i])
//					.put("sub_amt", amt[i])
//					.build());
//		}
		
		Map<String,Object> paramMap = createMap()
				.put("sub_month",sub_month)
				.put("batch_no",batch_no)
				.put("gly_no",gly_no)
				//.put("data", mapList)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/sub/pay/paySub.do",paramMap);
		Map<String,Object> map = (Map<String,Object>)jp.getRetData();
		List<Map<String,Object>> ml = new ArrayList<>();
		ml.add(map);
		jp.setRetData(ml);
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRetData(),"subamts");
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"sub_amt");
		return Json(jp);
	}	
	
	/**
	 * 读取ws.xml文件获取补贴录入时负补贴按钮显示或隐藏
	 */
	@RequestMapping("/readSubsidyXml")
	public ModelAndView readSubsidyXml(JsonPage jp) {
		String minus = CommonUtils.readXMLValue("/conf/ws.xml", "ws.subsidy");
		if(!"1".equals(minus)) {
			minus = "2";//1：显示，2：隐藏，默认为隐藏
		}
		return Json(minus);
	}
}



