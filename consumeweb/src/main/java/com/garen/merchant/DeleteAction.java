package com.garen.merchant;

import java.math.BigDecimal;
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
import com.garen.utils.MapBuilder;

@Controller  
@RequestMapping("/merchant")  
public class DeleteAction extends BaseAction{
	
protected static Log log = LogFactory.getLog(SysAction.class);   
	
	@Autowired
	private ICommonDao commonDao;
	
	/**
	 * 商户销户查询
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("/deleteQuery")
	public ModelAndView queryDelete(JsonPage jp,String search_txt,String pageSize,
			String pageNum) {
		Map<String,Object> paramMap = createMap()
				.put("search_txt", search_txt)
				.put("page_size",pageSize)
				.put("page_no",pageNum)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/merch/account/qryMerchList.do",paramMap);
		List<Map<String,Object>> mapList = (List<Map<String,Object>>)jp.getRows();
		if(mapList!=null){
			for(Map<String,Object> map : mapList){
				String fee_rate_str = ((BigDecimal)map.get("fee_rate")).toString()+"%";
				map.put("fee_rate_str", fee_rate_str);
			}
		}
		return Json(jp);
	}	
	
	/**
	 * 商户销户
	 */
	@RequestMapping("/merchantDelete")
	public ModelAndView deleteMerchant(JsonPage jp,String ids,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("gly_no", gly_no)
				.put("id", ids)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/merch/account/del.do",paramMap);
	
		return Json(jp);
	}	
}



