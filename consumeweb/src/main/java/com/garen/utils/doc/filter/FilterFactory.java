package com.garen.utils.doc.filter;

import com.garen.utils.doc.filter.impl.*;

/*
 * 过滤器工厂方法
 * */
public class FilterFactory {

	private static IDataFilter subtotalFilter = new SubTotalFilterImpl();
	private static IDataFilter totalFilter = new TotalFilterImpl();
	private static IDataFilter groupTotalFilter = new GroupTotalFilterImpl();
	private static IDataFilter datetimeFilter = new DateTimeFilterImpl();
	private static IDataFilter balanceFilter = new BalanceFilterImpl();
	
	public static Integer SUBTOTAL_FILTER = 1;
	public static Integer TOTAL_FILTER = 2;
	public static Integer GROUPTOTAL_FILTER = 3;
	public static Integer DATETIME_FILTER = 4;
	public static Integer Balance_FILTER = 5;
	
	//获取数据过滤器
	public static IDataFilter createDataFilter(int type){
		IDataFilter filter = null;
		switch(type){
		case 1:
			filter = subtotalFilter;
			break;
		case 2:
			filter = totalFilter;
			break;
		case 3:
			filter = groupTotalFilter;
			break;
		case 4:
			filter = datetimeFilter;
			break;
		case 5:
			filter = balanceFilter;
			break;
		}
		return filter;
	}
	
}
