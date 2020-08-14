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

import javax.servlet.http.HttpSession;

@Controller  
@RequestMapping("/functionQuery")  
public class CardholderAccountAction extends BaseAction{
	
protected static Log log = LogFactory.getLog(SysAction.class);   
	
	@Autowired
	private ICommonDao commonDao;
	
	/**
	 * 持卡人账户查询
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("cardholderAccount/query")
	public ModelAndView query(final ExportBean jp, String user_lname, String user_no,
							  String dep_serial, String identity_id,
							  String account_state, String usertype_state,
							  String deposit_state, String acc_amt_state,
							  String pageNum, String pageSize, String cx_type, HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		final Map<String,Object> paramMap = createMap()
				.put("cx_type", cx_type)
				.put("user_lname",user_lname)
				.put("user_no",user_no)
				.put("dep_serial",dep_serial)
				.put("identity_id",identity_id)
				.put("account_state",account_state)
				.put("usertype_state",usertype_state)
				.put("deposit_state",deposit_state)
				.put("acc_amt_state",acc_amt_state)
				.put("page_no",pageNum)
				.put("page_size",pageSize)
				.put("gly_no", gly_no)
				.build();
		IExportBean exportBean = new IExportBean(){
			@Override
            public List<Map<String, Object>> queryRow(ExportBean pb) {
				paramMap.put("page_size",pb.getPageSize());//更新页数
				paramMap.put("page_no",pb.getPageNum());
				commonDao.remoteCall((JsonPage)jp,"finweb/func/acc/filterQry.do",paramMap);
				formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"cash_amt");
				formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"sub_amt");
				formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"deposit_amt");
				formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"sum_amt");
				formatDateMapList((List<Map<String,Object>>)jp.getRows(),"account_end_date");
				formatTimeMapList((List<Map<String,Object>>)jp.getRows(),"sj");
				formatDateMapList((List<Map<String,Object>>)jp.getRows(),"open_account_date");
                return (List<Map<String,Object>>)pb.getRows();
            }
		};
		return JsonEx(jp,exportBean);
	}
}



