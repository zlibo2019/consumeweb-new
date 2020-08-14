package com.garen.sys.aop;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSON;
import com.garen.common.GridBean;
import com.garen.common.doc.ExportBean;
import com.garen.common.doc.ExportUtils;
import com.garen.common.doc.IExportBean;
import com.garen.sys.web.SysFilter;

/*
 * 实现打印导出AOP拦截器
 */
@Component
@Aspect
public class ExportInterceptor {

	private static Log log = LogFactory.getLog(ExportInterceptor.class);   
	
	@Pointcut("execution(* com.garen.*.biz.impl..*(..))")  
    private void anyMethod(){}//定义一个切入点  
	
	//判断是否打印导出功能
	private ExportBean isExport(Object [] args){
		if(args.length == 0) return null;
		//参数类型不对
		if((args[0] instanceof ExportBean) == false) return null;
		ExportBean pb = (ExportBean)args[0];
		//没有设置导出打印标志
		if(pb.isExport() == false)  return null;
		return pb;
	}
	
	@SuppressWarnings("unchecked")
	@Around("anyMethod()")  
    public Object doBasicProfiling(final ProceedingJoinPoint pjp) throws Throwable{  
		Object [] args = pjp.getArgs();
		final Object[] retObjs = new Object[1];
		ExportBean pb = isExport(args);
		//正常业务，直接返回
		if(pb == null) return  pjp.proceed();
		log.debug("导出打印功能,需要拦截");
		List<GridBean> exportList = JSON.parseArray(pb.getExportStr(), GridBean.class);
		IExportBean exportBean = new IExportBean() {
			@Override
            public List<Map<String,Object>> queryRow(ExportBean pb) {
            	 try {
            		final Map<String,Object> params = new HashMap<String,Object>();
            		params.put("page_size",pb.getPageSize());//更新页数
     				params.put("page_no",pb.getPageNum());
            		retObjs[0] = pjp.proceed();
				} catch (Throwable e) {
					e.printStackTrace();
				}//执行该方法  
                return (List<Map<String,Object>>)pb.getRows();
            }
        };
        File xlsFile = null;
        if("pdf".equals(pb.getExportType()))
        	xlsFile = ExportUtils.exportPdf(exportList, pb, 
        			exportBean, pb.getExportTitle());
        else
        	xlsFile = null;
        if (xlsFile == null) {
            pb.setRetInfo(-2,"导出错误 !");
        } else {
            String fileKey = xlsFile.getName();
            log.debug(xlsFile.getName());
            pb.setInfo(fileKey);
            HttpSession session = SysFilter.getSession();
            //缓存session中
            session.setAttribute(fileKey, xlsFile);
        }
        return retObjs[0];  
    }  
}
