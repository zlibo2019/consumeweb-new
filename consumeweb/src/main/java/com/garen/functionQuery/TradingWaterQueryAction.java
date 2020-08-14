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
public class TradingWaterQueryAction extends BaseAction{
	
protected static Log log = LogFactory.getLog(SysAction.class);   
	
	@Autowired
	private ICommonDao commonDao;
	
	/**
	 * 交易类型
	 */
	@RequestMapping("tradingWaterQuery/tradTypeQuery")
	public ModelAndView tradTypeQuery(JsonPage jp) {
		Map<String,Object> paramMap = createMap()
				.build();
		jp = commonDao.remoteCall(jp,"finweb/func/trad/tradType.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 查找部门
	 */
	@RequestMapping("tradingWaterQuery/selDepQuery")
	public ModelAndView selDepQuery(JsonPage jp,String unit_id,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("unit_id", "")
				.put("gly_no", gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/base/qryDepByAccess.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 商户部门
	 */
	@RequestMapping("tradingWaterQuery/selCommercialDepQuery")
	public ModelAndView selCommercialQuery(JsonPage jp,String unit_id) {
		Map<String,Object> paramMap = createMap()
				.put("unit_id",unit_id)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/merch/dep/qryMerchDep.do",paramMap);
		return Json(jp);
	}
	/**
	 * 商户
	 */
//	@SuppressWarnings("unchecked")
	@RequestMapping("tradingWaterQuery/selCommercialQuery")
	public ModelAndView saveModify(JsonPage jp,String dep_serial) {
		Map<String,Object> paramMap = createMap()
				.put("dep_serial", dep_serial)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/merch/account/merchList.do",paramMap);
	
		return Json(jp);
	}
	
	/**
	 * 场所查询
	 */
	@RequestMapping("tradingWaterQuery/selPlaceQuery")
	public ModelAndView selPlaceQuery(JsonPage jp, String unit_id, HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("unit_id", "")
				.put("gly_no", gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/base/qryAcDepByAccess.do",paramMap);
		return Json(jp);
	}
	/**
	 * 设备查询
	 */
	@RequestMapping("tradingWaterQuery/selDevQuery")
	public ModelAndView selDevQuery(JsonPage jp,String dep_serial) {
		Map<String,Object> paramMap = createMap()
				.put("dep_serial", dep_serial)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/dev/dev/devlist.do",paramMap);
		return Json(jp);
	}
	/**
	 * 交易流水列表
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("tradingWaterQuery/tradWaterQuery")
	public ModelAndView queryDetail(final ExportBean jp,String cx_type,String start_date,String end_date,
			String user_no,String user_lname,String dep_serial,String user_id,String merchant_dep,
			String merchant_account,String acdep_serial,String bh,String trad_type,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		final Map<String,Object> paramMap = createMap()
				.put("cx_type",cx_type)//查询类型
				.put("start_date",start_date)
				.put("end_date",end_date)
				.put("user_no",user_no)
				.put("user_lname",user_lname)
				.put("dep_serial",dep_serial)
				.put("user_id",user_id)
				.put("merchant_dep",merchant_dep)
				.put("merchant_account",merchant_account)
				.put("acdep_serial",acdep_serial)
				.put("bh",bh)
				.put("page_size",jp.getPageSize())
				.put("page_no",jp.getPageNum())
				.put("trad_type",trad_type)
				.put("gly_no", gly_no)
				.build();
		IExportBean exportBean = new IExportBean() {
			@Override
            public List<Map<String, Object>> queryRow(ExportBean pb) {
				paramMap.put("page_size",pb.getPageSize());//更新页数
				paramMap.put("page_no",pb.getPageNum());
				commonDao.remoteCall((JsonPage)jp,"finweb/func/trad/flowQry.do",paramMap);
				formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"trad_amt");//交易金额
				formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"total_cash_amt");//现金账户余额
				formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"total_sub_amt");//补贴账户余额
				formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"undo_amt");//已纠错金额
				formatMoney2YUAN2((List<Map<String,Object>>)jp.getRows(),"deposit_amt");//押金余额
				formatDateMapList((List<Map<String,Object>>)jp.getRows(),"bill_date");//账务日期
				formatTimeMapList((List<Map<String,Object>>)jp.getRows(),"trad_sj");//交易日期时间
				formatTimeMapList((List<Map<String,Object>>)jp.getRows(),"sj");//记账日期时间
                return (List<Map<String,Object>>)pb.getRows();
            }
        };
		return JsonEx(jp,exportBean);
	}
}



