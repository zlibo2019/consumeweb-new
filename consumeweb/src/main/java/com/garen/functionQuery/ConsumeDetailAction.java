package com.garen.functionQuery;

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
import com.garen.common.doc.ExportBean;
import com.garen.common.doc.IExportBean;
import com.garen.sys.dao.ICommonDao;
import com.garen.sys.web.SysAction;

@Controller  
@RequestMapping("/functionQuery")  
public class ConsumeDetailAction extends BaseAction{
	
protected static Log log = LogFactory.getLog(SysAction.class);   
	
	@Autowired
	private ICommonDao commonDao;
	
	/**
	 * 消费明细列表查询
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("consume/detailQuery")
	public ModelAndView detailQuery(final ExportBean jp,String start_date,
			String end_date,String dep_serial,HttpSession session,
			String merchant_account_id,String bh) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		final Map<String,Object> paramMap = createMap()
				.put("start_date",start_date)
				.put("end_date",end_date)
				.put("dep_serial",dep_serial)
				.put("merchant_account_id",merchant_account_id)
				.put("bh",bh)
				.put("glyId",gly_no)
				.build();
		
		IExportBean exportBean = new IExportBean() {
			@Override
            public List<Map<String, Object>> queryRow(ExportBean pb) {
				paramMap.put("page_size",pb.getPageSize());//更新页数
				paramMap.put("page_no",pb.getPageNum());
				commonDao.remoteCall(jp,"finweb/func/trad/consume.do",paramMap);
				formatTimeMapList((List<Map<String,Object>>)jp.getRows(),"trad_sj");
				formatDateMapList((List<Map<String,Object>>)jp.getRows(),"bill_date");
				formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"trad_amt");
                return (List<Map<String,Object>>)pb.getRows();
            }
        };
		return JsonEx(jp,exportBean);
	}
}



