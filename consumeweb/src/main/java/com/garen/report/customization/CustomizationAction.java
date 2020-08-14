package com.garen.report.customization;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.garen.common.BaseAction;
import com.garen.common.JsonPage;
import com.garen.sys.web.SysAction;
import com.garen.utils.CommonUtils;

@Controller  
@RequestMapping("/customization")  
public class CustomizationAction extends BaseAction{
	
protected static Log log = LogFactory.getLog(SysAction.class);   
	
	/**
	 * 查询权限
	 */
	@RequestMapping("powerQuery")
	public ModelAndView powerQuery(JsonPage jp) {
		String id = CommonUtils.readXMLValue("/conf/customization.xml", "customization.id");
		String name = CommonUtils.readXMLValue("/conf/customization.xml", "customization.name");
		String url = CommonUtils.readXMLValue("/conf/customization.xml", "customization.url");
		if(id!=null && name!=null && url!=null){
			String[] ids = id.replaceAll("\\s*", "").split(",");
			String[] names = name.replaceAll("\\s*", "").split(",");
			String[] urls = url.replaceAll("\\s*", "").split(",");
			List<Map<String,Object>> list = new ArrayList<Map<String,Object>>();
			for(int i=0;i<ids.length;i++){
				Map<String,Object> paramMap = BaseAction.createMap()
				.put("id", ids[i])
				.put("name", names[i])
				.put("url", urls[i])
				.build();
				list.add(paramMap);
			}
			jp.setId(0);
			jp.setObj(list);
		}else{
			jp.setId(-1);
			jp.setInfo("无个性化功能！");
		}
		return Json(jp);
	}
	
}



