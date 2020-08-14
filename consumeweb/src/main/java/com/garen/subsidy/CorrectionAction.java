package com.garen.subsidy;

import java.util.ArrayList;
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
import com.garen.sys.dao.ICommonDao;
import com.garen.sys.web.SysAction;

@Controller  
@RequestMapping("/subsidy")  
public class CorrectionAction extends BaseAction{
	
protected static Log log = LogFactory.getLog(SysAction.class);   
	
	@Autowired
	private ICommonDao commonDao;
	
	/**
	 * 补贴发放纠错查询
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("/correctionQuery")
	public ModelAndView queryCorrection(JsonPage jp,String sub_month_begin,
			String sub_month_end,String batch_no,String gly_no,
			String fuzzy,String undo_state) {
		Map<String,Object> paramMap = createMap()
				.put("sub_month_begin", sub_month_begin)
				.put("sub_month_end", sub_month_end)
				.put("batch_no", batch_no)
				.put("gly_no", gly_no)
				.put("fuzzy", fuzzy)
				.put("undo_state", undo_state)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/sub/correct/filterQry.do",paramMap);
		formatDateMapList((List<Map<String,Object>>)jp.getRows(),"begin_date");
		formatDateMapList((List<Map<String,Object>>)jp.getRows(),"end_date");
		formatTimeMapList((List<Map<String,Object>>)jp.getRows(),"sj");
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"sub_amt");
		Map<String,Object> map = (Map<String,Object>)jp.getRetData();
		List<Map<String,Object>> mapList = new ArrayList<>();
		mapList.add(map);
		jp.setRetData(mapList);
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRetData(),"subamts");
		return Json(jp);
	}
	
	/**
	 * 补贴纠错
	 */
	@RequestMapping("/correctionCorrect")
	public ModelAndView correctionCorrect(JsonPage jp,String slave_ids,String begin_date,
			String end_date,String sub_amt,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("slave_ids", slave_ids)
				.put("begin_date", begin_date)
				.put("gly_no", gly_no)
				.put("end_date", end_date)
				.put("sub_amt", formatMoney2FEN(sub_amt)==""?null:formatMoney2FEN(sub_amt))
				.build();
		jp = commonDao.remoteCall(jp,"finweb/sub/correct/correct.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 查批次号
	 */
	@RequestMapping("/correctionQueryBatch")
	public ModelAndView correctionQueryBatch(JsonPage jp,String sub_month_begin,
			String sub_month_end,String gly_no) {
		Map<String,Object> paramMap = createMap()
				.put("sub_month_begin", sub_month_begin)
				.put("sub_month_end", sub_month_end)
				.put("gly_no", gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/sub/correct/qryBatch.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 查记录类型
	 */
	@RequestMapping("/correctionQueryState")
	public ModelAndView correctionQueryState(JsonPage jp) {
		Map<String,Object> paramMap = createMap()
				.build();
		jp = commonDao.remoteCall(jp,"finweb/sub/correct/qryState.do",paramMap);
		return Json(jp);
	}
}



