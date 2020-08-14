package com.garen.highConsume;

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
@RequestMapping("/highConsume")  
public class MealSetAction extends BaseAction{
	
protected static Log log = LogFactory.getLog(SysAction.class);   
	
	@Autowired
	private ICommonDao commonDao;
	
	/**
	 * 餐别设置查询
	 */
	@RequestMapping("/mealSetQuery")
	public ModelAndView queryMealSet(JsonPage jp) {
		Map<String,Object> paramMap = createMap()
				.build();
		jp = commonDao.remoteCall(jp,"finweb/rule/meal/qryMeal.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 餐别设置新增
	 */
	@RequestMapping("/mealSetAdd")
	public ModelAndView addMealSet(JsonPage jp,String meal_name,
			String begin_time,String end_time,String overlap_chk,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("meal_name", meal_name)
				.put("begin_time", begin_time)
				.put("end_time", end_time)
				.put("overlap_chk", overlap_chk)
				.put("gly_no", gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/rule/meal/addMeal.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 餐别设置修改
	 */
	@RequestMapping("/mealSetUpdate")
	public ModelAndView updateMealSet(JsonPage jp,String meal_id,String meal_name,
			String begin_time,String end_time,String overlap_chk,HttpSession session) {
		String gly_no = (String) session.getAttribute(USER_NAME);
		Map<String,Object> paramMap = createMap()
				.put("meal_id", meal_id)
				.put("meal_name", meal_name)
				.put("begin_time", begin_time)
				.put("end_time", end_time)
				.put("overlap_chk", overlap_chk)
				.put("gly_no", gly_no)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/rule/meal/editMeal.do",paramMap);
		return Json(jp);
	}
	
	/**
	 * 餐别设置删除
	 */
	@RequestMapping("/mealSetDelete")
	public ModelAndView deleteMealSet(JsonPage jp,String meal_id) {
		Map<String,Object> paramMap = createMap()
				.put("meal_id", meal_id)
				.build();
		jp = commonDao.remoteCall(jp,"finweb/rule/meal/delMeal.do",paramMap);
		return Json(jp);
	}
}



