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
public class CloseAccountAction extends BaseAction{
	
protected static Log log = LogFactory.getLog(SysAction.class);   
	
	@Autowired
	private ICommonDao commonDao;
	
	/**
	 * 销户筛选查询
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("/closeAccount/query")
	public ModelAndView query(JsonPage jp,String user_no,String dep_serial,
			String identity_id,String year,String month,String day,String cx_type,String pageSize,String pageNum,
			HttpSession session) {
		
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("user_no",user_no)
				.put("dep_serial",dep_serial)
				.put("identity_id",identity_id)
				.put("year",year)
				.put("month",month)
				.put("day",day)
				.put("cx_type",cx_type)
				.put("page_size",pageSize)
				.put("page_no",pageNum)
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/closeAcc/filterQry.do",paramMap);
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"cash_amt");
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"meal_sub_sum");
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"deposit_amt");
		formatDateMapList((List<Map<String,Object>>)jp.getRows(), "account_end_date");
		return Json(jp);
	}
	
	
	/**
	 * 销户列表导入
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("/closeAccount/userImport")
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
				jp.setInfo("excel数据不合法！");
			}else{
				Map<String,Object> paramMap = createMap()
						.put("data",mapList)
						.put("gly_no",gly_no)
						.build();
				jp = commonDao.remoteCall(jp,"finweb/acc/closeAcc/impUser.do",paramMap);
				formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"cash_amt");
				formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"meal_sub_sum");
				formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"deposit_amt");
				
			}
			
		} catch (IOException e) {
			e.printStackTrace();
			return null;
		}
		return Html(toJSON(jp));
		//解析file...end
	}
	
	/**
	 * 销户
	 */
	@RequestMapping("/closeAccount/accountClose")
	public ModelAndView closeAccount(JsonPage jp,String account_id_str,
			String if_deposit,String if_sub,String destroy_type,
			String auto_backcard,String read_card_number,
			String read_media_id,HttpSession session) {

		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("account_id_str",account_id_str)
				.put("if_deposit",if_deposit)
				.put("if_sub",if_sub)
				.put("destroy_type",destroy_type)
				.put("auto_backcard",auto_backcard)
				.put("read_card_number",read_card_number)
				.put("read_media_id",read_media_id)
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/closeAcc/close.do",paramMap);
		return Json(jp);
	}
}



