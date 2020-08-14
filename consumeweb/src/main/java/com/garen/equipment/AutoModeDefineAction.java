package com.garen.equipment;

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
import com.garen.common.JsonPage;
import com.garen.common.doc.ExportBean;
import com.garen.common.doc.IExportBean;
import com.garen.sys.dao.ICommonDao;
import com.garen.sys.web.SysAction;

@Controller  
@RequestMapping("/equipment")  
public class AutoModeDefineAction extends BaseAction{
	
protected static Log log = LogFactory.getLog(SysAction.class);   
	
	@Autowired
	private ICommonDao commonDao;
	
	/**
	 * 自动模式列表查询
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("autoMode/modeListQuery")
	public ModelAndView queryModeList(ExportBean eb,String dep_serial,
			String pageNum,String pageSize) {
		final Map<String,Object> paramMap = createMap()
				.put("dep_serial",dep_serial)
				.put("page_no",pageNum)
				.put("page_size",pageSize)
				.build();
		final JsonPage jp = (JsonPage)eb;
		IExportBean exportBean = new IExportBean() {
			@Override
            public List<Map<String, Object>> queryRow(ExportBean pb) {
				paramMap.put("page_size",pb.getPageSize());//更新页数
				paramMap.put("page_no",pb.getPageNum());
				commonDao.remoteCall((JsonPage)jp,"finweb/dev/mode/qryModeList.do",paramMap);
				formatDateMapList((List<Map<String,Object>>)jp.getRows(),"rule_enable_date");
				formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"fixed_amt");
                return (List<Map<String,Object>>)pb.getRows();
            }
        };
		return JsonEx(eb,exportBean);
	}
	
	/**
	 * 自动模式新增
	 */
	@RequestMapping("autoMode/modeListAdd")
	public ModelAndView addModeList(JsonPage jp,String dep_serial,
			String begin_date,String end_date,String xf_model_id,
			String fixed_amt,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("dep_serial",dep_serial)
				.put("begin_date",begin_date)
				.put("end_date",end_date)
				.put("xf_model_id",xf_model_id)
				.put("fixed_amt",formatMoney2FEN(fixed_amt))
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/dev/mode/save.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 自动模式修改
	 */
	@RequestMapping("autoMode/modeListUpdate")
	public ModelAndView updateModeList(JsonPage jp,String id,
			String begin_date,String end_date,String xf_model_id,
			String fixed_amt,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("id",id)
				.put("begin_date",begin_date)
				.put("end_date",end_date)
				.put("xf_model_id",xf_model_id)
				.put("fixed_amt",formatMoney2FEN(fixed_amt))
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/dev/mode/saveupd.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 自动模式删除
	 */
	@RequestMapping("autoMode/modeListDelete")
	public ModelAndView deleteModeList(JsonPage jp,String id,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("id",id)
				.put("gly_no",gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/dev/mode/del.do",paramMap);
		return Json(jp);
	}
}



