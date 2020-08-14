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

import javax.servlet.http.HttpSession;

@Controller  
@RequestMapping("/functionQuery")  
public class CardQueryAction extends BaseAction{
	
protected static Log log = LogFactory.getLog(SysAction.class);   
	
	@Autowired
	private ICommonDao commonDao;
	
	/**
	 * 卡状态查询
	 */
	@RequestMapping("card/cardStateQuery")
	public ModelAndView cardStateQuery(JsonPage jp) {
		
		Map<String,Object> paramMap = createMap()
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/card/cardStateQry.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 卡片明细列表查询
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("card/detailQuery")
	public ModelAndView detailQuery(JsonPage jp, String dep_serial,
									String identity_id, String card_lx, String card_no,
									String card_state, String is_main_card,
									String card_number, String media_id, HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("dep_serial",dep_serial)
				.put("identity_id",identity_id)
				.put("card_lx",card_lx)
				.put("card_state",card_state)
				.put("is_main_card",is_main_card)
				.put("card_number",card_number)
				.put("card_no",card_no)
				.put("media_id",media_id)
				.put("gly_no", gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/acc/card/cardDetailQry.do",paramMap);
		formatTimeMapList((List<Map<String,Object>>)jp.getRows(),"sj");
		formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(), "card_charge");
		return Json(jp);
	}
}



