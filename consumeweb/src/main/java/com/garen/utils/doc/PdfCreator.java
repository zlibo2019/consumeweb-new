package com.garen.utils.doc;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.garen.common.JsonPage;
import com.garen.utils.doc.filter.FilterFactory;
import com.garen.utils.doc.filter.IDataFilter;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;


/*
 * pdf文档解析器
 * */
public class PdfCreator {

	protected static Log log = LogFactory.getLog(PdfCreator.class);
	private Document doc;
	private TableCreator tableCreator;
	private FontCreator fontCreator;
	private JSONArray datalist;
	private IDataFilter subTotalFilter ;
	private IDataFilter totalFilter ;
	private IDataFilter groupTotalFilter ;
	private IDataFilter datetimeFilter ;
	private IDataFilter balanceFilter ;
	
	public PdfCreator(){
		subTotalFilter = FilterFactory.createDataFilter(FilterFactory.SUBTOTAL_FILTER);
		totalFilter = FilterFactory.createDataFilter(FilterFactory.TOTAL_FILTER);
		groupTotalFilter = FilterFactory.createDataFilter(FilterFactory.GROUPTOTAL_FILTER);
		datetimeFilter = FilterFactory.createDataFilter(FilterFactory.DATETIME_FILTER);
		balanceFilter = FilterFactory.createDataFilter(FilterFactory.Balance_FILTER);
	}
	//获取数据
	public JsonPage getReportData(JsonPage jp,JSONObject jobj, 
			JSONArray datalist){
		JSONObject jtable = jobj.getJSONObject("table");
		if(datalist == null) datalist = new JSONArray();//空数据
		int flag = jp.getFlag();
		subTotalFilter.filter(jtable, datalist,flag);
		totalFilter.filter(jobj, datalist,flag);
		groupTotalFilter.filter(jtable, datalist,flag);
		balanceFilter.filter(jobj, datalist,flag);//资产负债表定制，传入报表对象
		datetimeFilter.filter(jtable, datalist,flag);
		return jp;
	}
	//创建标题
	private void createTitle(JSONObject jobj) throws DocumentException{
		String title = getStr(jobj,"title","pdf报表");
		String titleFont = getStr(jobj,"titleFont","font22");
		if(StringUtils.isEmpty(title)) title = "pdf报表";
		Paragraph p = new Paragraph(title,fontCreator.getFont(titleFont));
		p.setAlignment(Element.ALIGN_CENTER);
		p.setSpacingAfter(10);
		doc.add(p);
	}
	/*
	 * 创建元素
	 * */
	private Object createElement(Object obj) throws DocumentException{
		if(obj == null) return null;
		if((obj instanceof JSONObject) == false) return null;
		JSONObject jobj = (JSONObject)obj;
		String eName = jobj.getString("eName");
		if(StringUtils.isEmpty(eName)) return null;
		Element retObj = null;
		switch(eName){
		case "paragraph":
			retObj =  createParagraph(jobj);
			break;
		case "table":
			retObj =  tableCreator.createTable(jobj,datalist);
			break;
		}
		if(retObj != null) doc.add(retObj);
		return retObj;
	}
	//创建页眉或页脚
	private void  createSection(JSONObject jobj,JSONArray jarrs) throws DocumentException{
		if(jobj == null || jarrs == null) return;
		int size = jarrs.size();
		if(size < 1) return;
		PdfPTable t = new PdfPTable(size);
		t.setWidthPercentage(100);
		t.setSpacingAfter(5);
		Font font = fontCreator.getFont("font10Bold");//jobj.getString("font")
		int i = 0;
		for(Object obj : jarrs){
			if(obj == null) continue;
			Paragraph p = new Paragraph(obj.toString(),font);
			PdfPCell cell = new PdfPCell(p);
			cell.setBorder(0);
			if(i == 0) cell.setHorizontalAlignment(Element.ALIGN_LEFT);
			else if(i == size - 1) cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
			else cell.setHorizontalAlignment(Element.ALIGN_CENTER);
			t.addCell(cell);
			i++;
		}
		doc.add(t);
	}
	//创建段落
	private Paragraph createParagraph(JSONObject jobj){
		Paragraph p = new Paragraph();
		Font font  = fontCreator.getFont(jobj.getString("font"));
		float f;
		p.setFont(font);
		p.setAlignment(jobj.getIntValue("align"));
		f = jobj.getFloatValue("spacingBefore");
		p.setSpacingBefore(f);
		f = jobj.getFloatValue("spacingAfter");
		p.setSpacingAfter(f);
		p.add(jobj.getString("text"));
		return p;
	}
	/*
	 * pdf解析器
	 * */
	public File createPdf(JSONObject jobj,JSONArray records,
			JSONArray headers,JSONArray footers,JSONArray headerExs){
		PdfWriter writer = null; 
		File pdfFile = null;
		this.datalist = records;
		try{
			int diret = jobj.getIntValue("docDirect");
			if(1 == diret)//横版h
				doc = new Document(PageSize.A4.rotate());
			else//竖版v
				doc = new Document(PageSize.A4);
			float margin = 16f;
			doc.setMargins(margin, margin, margin, margin);
			fontCreator = new FontCreator(jobj.getJSONObject("fonts"));
			tableCreator = new TableCreator(fontCreator);
			pdfFile = File.createTempFile("report", ".pdf");
			writer = PdfWriter.getInstance(doc, 
						new FileOutputStream(pdfFile));//PdfWriter writer = 
			//初始化总页数回调函数
	        PdfPageEventHelper pdfPageEventHelper = new  PdfPageEventHelper(){
			    public void onEndPage (PdfWriter writer, Document document) {
			        float width = document.getPageSize().getWidth();
			        ColumnText.showTextAligned(writer.getDirectContent(),//
			                Element.ALIGN_RIGHT, 
			                new Phrase(String.format("第 %d 页", writer.getPageNumber()),
			                				fontCreator.getFont("font10")),
			                width / 2,6, 0);
			    }
			};
            writer.setPageEvent(pdfPageEventHelper);
			doc.open();  
			createTitle(jobj);//创建标题
			createSection(jobj.getJSONObject("header"), headers);//创建表格头部
			createSection(jobj.getJSONObject("header"), headerExs);//创建表格头部
			createElement(jobj.getJSONObject("table"));//创建表格
			createSection(jobj.getJSONObject("footer"), footers);//创建表格尾部
		}catch (IOException | DocumentException e) {
			e.printStackTrace();
		}finally {
			doc.close();
		}
		return pdfFile;
	}
	
	//获取
	static String getStr(JSONObject jobj,String key,String val){
		String title = jobj.getString(key);
		return StringUtils.isEmpty(title)?val:title;
	}
	
}

