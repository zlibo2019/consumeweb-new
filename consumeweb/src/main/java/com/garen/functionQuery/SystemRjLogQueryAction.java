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

@Controller  
@RequestMapping("/functionQuery") 
public class SystemRjLogQueryAction extends BaseAction{
	
protected static Log log = LogFactory.getLog(SysAction.class);   
	
	@Autowired
	private ICommonDao commonDao;
	
	
	/**
	 * 系统日结日志查询
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("sysRjLog/detailQuery")
	public ModelAndView queryDetail(final ExportBean jp,
			String record_cnt,String pageNum,String pageSize) {
		
		final Map<String,Object> paramMap = createMap()
				.put("record_cnt",record_cnt)
				.put("page_no",pageNum)
				.put("page_size",pageSize)
				.build();
		
		
		IExportBean exportBean = new IExportBean() {
			@Override
            public List<Map<String, Object>> queryRow(ExportBean pb) {
				paramMap.put("page_size",pb.getPageSize());//更新页数
				paramMap.put("page_no",pb.getPageNum());
				commonDao.remoteCall(jp,"finweb/func/daily/qryLog.do",paramMap);
				formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"trad_amt");
                return (List<Map<String,Object>>)pb.getRows();
            }
        };
		return JsonEx(jp,exportBean);
	}
}
