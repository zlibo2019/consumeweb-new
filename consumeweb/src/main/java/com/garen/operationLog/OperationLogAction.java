package com.garen.operationLog;

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
import com.garen.common.doc.ExportBean;
import com.garen.common.doc.IExportBean;
import com.garen.sys.dao.ICommonDao;
import com.garen.sys.web.SysAction;

@Controller  
@RequestMapping("/operationLog")  
public class OperationLogAction extends BaseAction{
	
protected static Log log = LogFactory.getLog(SysAction.class);   
	
	@Autowired
	private ICommonDao commonDao;
	
	/**
	 * 查询
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("/logQuery")
	public ModelAndView logQry(final ExportBean jp,String sdate,
			String edate,String gly_no) {
		//String gly_no = (String) session.getAttribute(USER_NAME);
		final Map<String,Object> paramMap = createMap()
				.put("sdate",sdate)
				.put("edate",edate)
				.put("gly_no",gly_no)
				.put("page_size",jp.getPageSize())
				.put("page_no",jp.getPageNum())
				.build();
		
		IExportBean exportBean = new IExportBean() {
			@Override
            public List<Map<String, Object>> queryRow(ExportBean pb) {
				paramMap.put("page_size",pb.getPageSize());//更新页数
				paramMap.put("page_no",pb.getPageNum());
				commonDao.remoteCall(jp,"finweb/acc/log/logQry.do",paramMap);
				formatTimeMapList((List<Map<String,Object>>)jp.getRows(),"log_sj");
                return (List<Map<String,Object>>)pb.getRows();
            }
        };
		return JsonEx(jp,exportBean);
	}
	
}



