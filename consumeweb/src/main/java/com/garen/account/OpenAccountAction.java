package com.garen.account;

import java.io.IOException;
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

@Controller  
@RequestMapping("/account")  
public class OpenAccountAction extends BaseAction{
	
protected static Log log = LogFactory.getLog(SysAction.class);   
	
	@Autowired
	private ICommonDao commonDao;
	
	/**
	 * 开户筛选查询
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("/query")
	public ModelAndView query(JsonPage jp,String user_no,String dep_serial,
			String identity_id,String user_id,String pageNum,String pageSize,
			HttpSession session) {
		if(identity_id==""){
			identity_id="0";
		}
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("user_no",user_no)
				.put("dep_serial",dep_serial)
				.put("identity_id",identity_id)
				.put("user_id",user_id)
				.put("page_no",pageNum)
				.put("page_size",pageSize)
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/openAcc/filterQry.do",paramMap);
		formatDateMapList((List<Map<String,Object>>)jp.getRows(),"account_end_date");
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"account_init_amt");
		return Json(jp);
	}
	
	/**
	 * 开户添加设置
	 */
	/*@RequestMapping("/configAdd")
	public ModelAndView addConfig(JsonPage jp,String ids,String scheme_id,
			String finger_enable,String account_init_amt,String account_end_date) {
		if(finger_enable == "" || finger_enable == null){
			finger_enable = "0";
		}
		Map<String,Object> paramMap = createMap()
				.put("id",ids)
				.put("scheme_id",scheme_id)
				.put("finger_enable",finger_enable)
				.put("account_init_amt",formatMoney2FEN(account_init_amt))
				.put("account_end_date",account_end_date)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/openAcc/setCfg.do",paramMap);
		return Json(jp);
	}*/
	
	/**
	 * 设置后刷新页面
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("/accountRefresh")
	public ModelAndView refreshAccount(JsonPage jp,String pageNum,
			String pageSize,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("page_no",pageNum)
				.put("page_size",pageSize)
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/openAcc/refresh.do",paramMap);
		formatDateMapList((List<Map<String,Object>>)jp.getRows(),"account_end_date");
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"account_init_amt");
		return Json(jp);
	}
	
	/**
	 * 开户列表导入
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("/userImport")
	public ModelAndView importUser(JsonPage jp,
			@RequestParam MultipartFile userFile,HttpSession session) {
		//解析file...start
		String gly_no = (String) session.getAttribute(USER_NAME);
		try {
			List<Map<String,Object>> mapList = ExcelHelper.readExcelWithId(jp,userFile.getInputStream(), 
				0,3,2,3);//0：第一个工作簿，3：从第四列开始，2：共两列，3：从第四行开始
			//log.debug(mapList);
			if(mapList.size()==0){
				jp.setId(-1);
				jp.setInfo("excel数据不合法! ");
			}else{
				Map<String,Object> paramMap = createMap()
						.put("data",mapList)
						.put("gly_no",gly_no)
						.build();
				jp = commonDao.remoteCall(jp,"finweb/acc/openAcc/impUser.do",paramMap);
				formatDateMapList((List<Map<String,Object>>)jp.getRows(),"account_end_date");
				formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"account_init_amt");
			}
		} catch (IOException e) {
			e.printStackTrace();
			return null;
		} 
		return Html(toJSON(jp));
		//解析file...end
	}
	
	/**
	 * 开户
	 */
	@RequestMapping("/accountOpen")
	public ModelAndView openAccount(JsonPage jp,String ids,
			HttpSession session,String scheme_id,String finger_enable,
			String account_init_amt,String account_end_date) {
//		JSONArray jarr = parseJsonArray();
//		for (Object obj : jarr) {
//			JSONObject jobj = (JSONObject)obj;
//		}
		
		if(finger_enable == "" || finger_enable == null){
			finger_enable = "0";
		}
		
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("id",ids)
				.put("gly_no",gly_no)
				.put("scheme_id",scheme_id)
				.put("finger_enable",finger_enable)
				.put("account_init_amt",formatMoney2FEN(account_init_amt))
				.put("account_end_date",account_end_date)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/openAcc/open.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 发卡
	 */
	@RequestMapping("/accountCardProvide")
	public ModelAndView accountCardProvide(JsonPage jp,String id,
			String card_number,String media_id,String is_main_card,
			String old_card_serial,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("id",id)
				.put("card_number",card_number)
				.put("media_id",media_id)
				.put("is_main_card",is_main_card)
				.put("old_card_serial",old_card_serial)
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/openAcc/addCard.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 发卡（读写卡）后续
	 */
	@RequestMapping("/accountCardProvideAfter")
	public ModelAndView accountCardProvideAfter(JsonPage jp,String id,
			String card_serial,String old_card_serial,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("id",id)
				.put("card_serial",card_serial)
				.put("old_card_serial",old_card_serial)
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/openAcc/writeAfter.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 发卡查询
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("/accountCardBatchQry")
	public ModelAndView accountCardBatchQry(JsonPage jp,String user_no,String dep_serial,
			String identity_id,String user_id,String pageNum,String pageSize,
			String lx,HttpSession session) {
		if(identity_id==""){
			identity_id="0";
		}
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("user_no",user_no)
				.put("dep_serial",dep_serial)
				.put("identity_id",identity_id)
				.put("user_id",user_id)
				.put("lx",lx)
				.put("page_no",pageNum)
				.put("page_size",pageSize)
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/card/cardBatchQry.do",paramMap);
		formatDateMapList((List<Map<String,Object>>)jp.getRows(),"account_end_date");
		return Json(jp);
	}
	
	/**
	 * 发卡查询2
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("/accountCardBatchQry2")
	public ModelAndView accountCardBatchQry2(JsonPage jp,String user_no,String dep_serial,
			String identity_id,String user_id,String pageNum,String pageSize,
			String card_state,String user_lname,String account_condition,
			String cx_type,String account_id,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("user_no",user_no)
				.put("dep_serial",dep_serial)
				.put("identity_id",identity_id)
				.put("user_lname",user_lname)
				.put("user_id",user_id)
				.put("card_state",card_state)
				.put("account_condition",account_condition)
				.put("cx_type",cx_type)
				.put("account_id",account_id)
				.put("page_no",pageNum)
				.put("page_size",pageSize)
				.put("gly_no", gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/card/filterQry3.do",paramMap);
		formatDateMapList((List<Map<String,Object>>)jp.getRows(),"account_end_date");
		return Json(jp);
	}
	
	/**
	 * 开户直接跳转发卡数据查询
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("/openAccToProCard")
	public ModelAndView openAccToProCard(JsonPage jp,String openacc_id,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("openacc_id",openacc_id)
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/card/cardBatchQryOpenacc.do",paramMap);
		formatDateMapList((List<Map<String,Object>>)jp.getRows(),"account_end_date");
		return Json(jp);
	}
}



