package com.garen.account;

import java.io.IOException;
import java.util.Iterator;
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
import com.alibaba.fastjson.JSONObject;
import com.garen.common.BaseAction;
import com.garen.common.JsonPage;
import com.garen.common.doc.ExcelHelper;
import com.garen.sys.dao.ICommonDao;
import com.garen.sys.web.SysAction;

@Controller  
@RequestMapping("/account")  
public class ImpCardAction extends BaseAction{
	
protected static Log log = LogFactory.getLog(SysAction.class);   
	
	@Autowired
	private ICommonDao commonDao;
	
	/**
	 * 卡号导入
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("/cardNumImport")
	public ModelAndView importBatchCharge(JsonPage jp,
			@RequestParam MultipartFile userFile,String card_lx,HttpSession session) {
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
						.put("card_lx", card_lx)
						.put("gly_no",gly_no)
						.build();
				jp = commonDao.remoteCall(jp,"/finweb/acc/card/impCard.do",paramMap);
				formatDateMapList((List<Map<String,Object>>)jp.getRows(),"account_end_date");
				formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"cash_amt");
				formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"cash_after_money");
				// 对后台返回数据进行解析 add by LYh 20170612
				JSONArray rstokArry =(JSONArray) jp.getRecord();
				JSONArray resultArry = new JSONArray();
				Iterator<Object> it = rstokArry.iterator();
				int column =0;
				while (it.hasNext()) {
					JSONObject objt = (JSONObject) it.next();
					objt.put("index_idField", ++column);
					resultArry.add(objt);
				}
				jp.setRecord(resultArry);
			}
		} catch (IOException e) {
			e.printStackTrace();
			return null;
		}
		return Html(toJSON(jp));
		//解析file...end
	}

	/**
	 *  全部卡类型查询
	 */
	@RequestMapping("/cardTypeQuery")
	public ModelAndView allMerchantQuery(JsonPage jp,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/base/qryCardType.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 批量充值操作
	 */
	@RequestMapping("/sendCardNumOperation")
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



