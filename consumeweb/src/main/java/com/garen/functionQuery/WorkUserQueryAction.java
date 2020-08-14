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
import com.garen.common.doc.ExportBean;
import com.garen.common.doc.IExportBean;
import com.garen.sys.dao.ICommonDao;
import com.garen.sys.web.SysAction;

@Controller  
@RequestMapping("/functionQuery")  
public class WorkUserQueryAction extends BaseAction{
	
protected static Log log = LogFactory.getLog(SysAction.class);   
	
	@Autowired
	private ICommonDao commonDao;
	
	/**
	 * 工作人员列表查询
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("workUser/detailQuery")
	public ModelAndView detailQuery(final ExportBean jp,String start_date,
			String end_date,String crowd_id) {
		
		final Map<String,Object> paramMap = createMap()
				.put("start_date",start_date)
				.put("end_date",end_date)
				.put("crowd_id",crowd_id)
				.build();
		
		IExportBean exportBean = new IExportBean() {
			@Override
            public List<Map<String, Object>> queryRow(ExportBean pb) {
				paramMap.put("page_size",pb.getPageSize());//更新页数
				paramMap.put("page_no",pb.getPageNum());
				commonDao.remoteCall(jp,"finweb/func/user/workUser.do",paramMap);
				formatTimeMapList((List<Map<String,Object>>)jp.getRows(),"sj");
                return (List<Map<String,Object>>)pb.getRows();
            }
        };
		return JsonEx(jp,exportBean);
	}
}



