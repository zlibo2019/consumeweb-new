package com.garen.utils.doc;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.garen.utils.LangUtils;
import com.garen.utils.doc.entity.Column;
import com.garen.utils.doc.filter.IDataFilter;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;

//创建pdf表格
public class TableCreator {
	protected static Log log = LogFactory.getLog(TableCreator.class);
	//字体构造器
	private FontCreator fontCreator;
	//pdf表格
	private PdfPTable pdfTable;
	//表格列集合--表头
	private List<Column> columnList = new ArrayList<>();
	//表格列集合--内容
	private List<Column> colBodyList = new ArrayList<>();
	/*
	 * 计算表格宽度及列数目,表格头部
	 * */
	private List<PdfPCell> createCells() throws DocumentException{
		List<PdfPCell> headCells = new ArrayList<>();
		List<Integer> colWidthList = new ArrayList<>();//表格列宽度集合
		for(Column col : columnList){
			if(col.isHidden()) continue;//跳过隐藏域
			headCells.add(col.createCell(fontCreator, null,"font14"));
			if(col.getColspan() <= 1){
				colWidthList.add(new Integer(col.getWidth()));
			}
		}
		int colCount = colWidthList.size();
		pdfTable = new PdfPTable(colCount);
		int[]ww=new int[colCount];
		int i = 0;
		for(int w : colWidthList){
			ww[i++] = w;
		}
		pdfTable.setWidths(ww);
		pdfTable.setWidthPercentage(100);
		return headCells;
	}
	/*创建内容表格列集合
	 * 深度递归
	 * 遍历过的设置标志位it_flag
	 * */
	private void createColBodyList(JSONArray columns,int index,short colspan){
		int size = columns.size();
		if(index >= size) return;
		JSONArray column = (JSONArray)columns.get(index);
		int cellIndex = 0;
		for(Object obj : column){
			cellIndex++;
			JSONObject colObj = (JSONObject)obj;
			boolean flag = colObj.getBooleanValue("it_flag");//遍历标志
			if(flag) continue;
			colObj.put("it_flag", true);
			Column col = new Column(colObj);
			log.debug(index +","+ cellIndex + "," + colspan + " " +  colObj.getString("title"));
			colBodyList.add(col);
			byte cspan = col.getColspan();
			short num = 1;
			if(cspan > 1) {//遍历下一行
				createColBodyList(columns,index+1,cspan);
				num = cspan;
			}
			if(colspan > 0){//上层为合并列
				colspan -= num;
				if(colspan == 0) break;//终止继续遍历
			}
		}
	}
	
	//创建表格表头
	private void createHeader(JSONArray columns) throws DocumentException{
		for(Object obj1 : columns){
			JSONArray column = (JSONArray)obj1;
			for(Object obj2 : column){
				JSONObject colObj = (JSONObject)obj2;
				columnList.add(new Column(colObj));
			}
		}
		createColBodyList(columns,0,(short)0);
		List<PdfPCell> headCells = createCells();
		for(PdfPCell hcell : headCells){
			pdfTable.addCell(hcell);
		}
	}
	//创建布局表格
	private void createLayouTable(int colSize,JSONArray elements){
		if(colSize == 0) colSize = 1;
		pdfTable = new PdfPTable(colSize);
		pdfTable.setWidthPercentage(100);
		for(Object obj : elements){
			JSONObject colObj = (JSONObject)obj;
			Column col = new Column(colObj);
			pdfTable.addCell(col.createCell(fontCreator, null,null));
		}
	}
	//创建表格
	protected PdfPTable createTable(JSONObject jobj,JSONArray datalist)
			throws DocumentException{
		JSONArray columns = jobj.getJSONArray("columns");
		JSONArray elements = jobj.getJSONArray("elements");
		if(elements != null){
			createLayouTable(jobj.getIntValue("colSize"),elements);
		}else if(columns != null){
			createHeader(columns);
			createBody(datalist);
		}
		return pdfTable;
	}
	//private boolean debug ;
	//创建表格正文
	private void createBody(JSONArray datalist){
		PdfPCell cell = null;
		//debug = true;
		boolean sumflag = false;
		for(Object obj: datalist){
			JSONObject map = (JSONObject)obj;
			int total = 0,flag = 0;//0初始值 1 有合并列 2 合并标志，即跳过
			if(map.containsKey(IDataFilter.TOTAL_FLAG)){//合计
				total = map.getIntValue(IDataFilter.TOTAL_COUNT_FLAG);
				flag = 1;
				sumflag = true;
			}else if(map.containsKey(IDataFilter.GROUPTOTAL_FLAG)){//小计
				total = map.getIntValue(IDataFilter.GROUPTOTAL_COUNT_FLAG);
				flag = 1;
				sumflag = true;
			}else if(map.containsKey(IDataFilter.FILTER_destroy_FLAG)){
				String text = "销户人数："+ LangUtils.getLong(map, "count") 
					+ "人；销户总额：" + map.getString("sum1") 
					+ "元；押金总额：" + map.getString("sum2") + "元";
				cell = new PdfPCell(new Paragraph(text,fontCreator.getFont("font10Bold")));
				cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
				cell.setColspan(8);
				pdfTable.addCell(cell);
				continue;
			}
			for(Column col : colBodyList){
				String field = col.getField();
				//if(debug) log.debug(field +""+ col.getTitle());
				if(col.isSpanCol()) continue;//标题合并列没有对应数据
				if(col.isHidden()) continue;//隐藏域
				//最后一个跳转
				if(total > 0 && flag == 2) {
					total--;
					continue;//total--必须放前面
				}
				//数据单元格合并的问题
				Object fieldobj = map.get(field);
				String val = fieldobj == null?"":fieldobj.toString();
				String font = flag == 0?null:"font10Bold";
				cell = col.createCell(fontCreator, val,font);
				if(total > 1 && flag == 1){
					cell.setColspan(total);
					flag = 2;
				} 
				if(sumflag){//小计合计强制居中
					sumflag = false;
					cell.setHorizontalAlignment(Element.ALIGN_CENTER);
				}
				pdfTable.addCell(cell);
				total-- ;
			}
			//debug = false;
		}
	}
	
	public TableCreator(FontCreator fontCreator){
		this.fontCreator = fontCreator;
	}
	
}
