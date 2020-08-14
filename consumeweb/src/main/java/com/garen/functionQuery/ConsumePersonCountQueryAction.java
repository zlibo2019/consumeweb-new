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
import com.garen.common.doc.ExportBean;
import com.garen.common.doc.IExportBean;
import com.garen.sys.dao.ICommonDao;
import com.garen.sys.web.SysAction;

import javax.servlet.http.HttpSession;

@Controller  
@RequestMapping("/functionQuery")  
public class ConsumePersonCountQueryAction extends BaseAction{
	
protected static Log log = LogFactory.getLog(SysAction.class);   
	
	@Autowired
	private ICommonDao commonDao;
	
	/**
	 * 工作人员列表查询
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("consumePersonCount/detailQuery")
	public ModelAndView detailQuery(final ExportBean jp, String start_date,
									String end_date, String dep_serial, HttpSession session) {

		final String gly_no = (String) session.getAttribute(USER_NAME);
		final Map<String,Object> paramMap = createMap()
				.put("start_date",start_date)
				.put("end_date",end_date)
				.put("dep_serial",dep_serial)
				.build();

		IExportBean exportBean = new IExportBean() {
			@Override
            public List<Map<String, Object>> queryRow(ExportBean pb) {
				paramMap.put("page_size",pb.getPageSize());//更新页数
				paramMap.put("page_no",pb.getPageNum());
				paramMap.put("gly_no",gly_no);
				commonDao.remoteCall(jp,"finweb/report/personCount/mealCol.do",paramMap);
				formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"meal1_cash_amt");
				formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"meal2_cash_amt");
				formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"meal3_cash_amt");
				formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"meal4_cash_amt");
				formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"meal5_cash_amt");
				formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"sum_cash_amt");
				return (List<Map<String,Object>>)pb.getRows();
            }
        };
		return JsonEx(jp,exportBean);
	}
}



