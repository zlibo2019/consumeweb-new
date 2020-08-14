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

import com.alibaba.fastjson.JSONArray;
import com.garen.common.BaseAction;
import com.garen.common.JsonPage;
import com.garen.common.doc.ExcelHelper;
import com.garen.sys.dao.ICommonDao;
import com.garen.sys.web.SysAction;

@Controller  
@RequestMapping("/account")  
public class BatchChargeAction extends BaseAction{
	
protected static Log log = LogFactory.getLog(SysAction.class);   
	
	@Autowired
	private ICommonDao commonDao;
	
	/**
	 * 批量充值筛选查询
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("/batchChargeQuery")
	public ModelAndView queryBatchCharge(JsonPage jp,String user_no,
			String dep_serial,String user_lname,String user_id,
			String pageSize,String pageNum,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("user_no",user_no)
				.put("dep_serial",dep_serial)
				.put("user_lname",user_lname)
				.put("user_id",user_id)
				.put("page_size",pageSize)
				.put("page_no",pageNum)
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/bRecharge/filterQry.do",paramMap);
		formatDateMapList((List<Map<String,Object>>)jp.getRows(),"account_end_date");
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"cash_amt");
		return Json(jp);
	}
	
	/**
	 * 批量充值导入
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("/batchChargeImport")
	public ModelAndView importBatchCharge(JsonPage jp,
			@RequestParam MultipartFile userFile,HttpSession session) {
		//解析file...start
		String gly_no = (String) session.getAttribute(USER_NAME);
		try {
			List<Map<String,Object>> mapList = ExcelHelper.readExcelWithId(jp,userFile.getInputStream(), 
				0,3,3,3);//0：第一个工作簿，3：从第四列开始，3：共3列，3：从第四行开始
			//log.debug(mapList);
			if(mapList.size()==0){
				jp.setId(-1);
				jp.setRetDatas(new Object[]{});
				jp.setInfo("excel数据不合法！");
			}else{
				Map<String,Object> paramMap = createMap()
						.put("data",formatMoney2Excel(mapList,"recharge_amt"))
						.put("gly_no",gly_no)
						.build();
				jp = commonDao.remoteCall(jp,"finweb/acc/bRecharge/impUser.do",paramMap);
				formatDateMapList((List<Map<String,Object>>)jp.getRows(),"account_end_date");
				formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"cash_amt");
				formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"cash_after_money");
			}
		} catch (IOException e) {
			e.printStackTrace();
			return null;
		}
		return Html(toJSON(jp));
		//解析file...end
	}
	
	/**
	 * 批量充值操作
	 */
	@RequestMapping("/batchChargeOperation")
	public ModelAndView operateBatchCharge(JsonPage jp,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		JSONArray jarr =  parseJsonArray();
		Map<String,Object> paramMap = createMap()
				.put("data",jarr)
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/bRecharge/recharge.do",paramMap);
		return Json(jp);
	}
}



