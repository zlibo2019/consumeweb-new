package com.garen.functionQuery;

import java.util.List;
import java.util.Map;

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
@RequestMapping("/functionQuery")  
public class ConsumeCorrectionDetailQueryAction extends BaseAction{
	
protected static Log log = LogFactory.getLog(SysAction.class);   
	
	@Autowired
	private ICommonDao commonDao;
	
	
	/**
	 * 消费纠错明细列表查询
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("ccdq/detailQuery")
	public ModelAndView queryDetail(JsonPage jp,String merchant_account,String device_bh,
			String start_date,String end_date,String pageNum,String pageSize) {
		
		Map<String,Object> paramMap = createMap()
				.put("merchant_account",merchant_account)
				.put("device_bh",device_bh)
				.put("start_date",start_date)
				.put("end_date",end_date)
				.put("page_no",pageNum)
				.put("page_size",pageSize)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/func/finCorrect/qry.do",paramMap);
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"trad_amt");
		formatTimeMapList((List<Map<String,Object>>)jp.getRows(),"trad_sj");
		formatDateMapList((List<Map<String,Object>>)jp.getRows(),"bill_date");
		return Json(jp);
	}
}



