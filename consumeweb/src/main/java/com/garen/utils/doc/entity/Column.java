package com.garen.utils.doc.entity;


import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.alibaba.fastjson.JSONObject;
import com.garen.utils.doc.FontCreator;
import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Element;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfPCell;

//表格里信息
public class Column {
	protected static Log log = LogFactory.getLog(Column.class);
	//标题
	private String title;
	//字段
	private String field;
	//宽度
	private short width;
	//表格
	private PdfPCell cell;
	//行合并
	private byte rowspan;
	//列合并
	private byte colspan;
	//垂直对齐
	private byte valign;
	//水平对齐
	private byte halign;
	private boolean hidden;
	private Boolean titleAlign;
	//字体
	private String font;
	private Boolean border;
	private int bkColor;
	private int rowIndex;
	private int cellIndex;
	public Column(){}
	//合并列
	public boolean isSpanCol(){
		return colspan > 1?true:false;
	}
	public Column(JSONObject colObj){
		create(colObj);
	}
	//解析颜色
	private int parseColor(Object obj){
		if(obj == null) return 0xffffffff;
		int val = 0;
		if(obj instanceof String ){
			val = Integer.parseInt(obj.toString(),16);
		}
		return val | 0xff000000;
	}
	
	public void create(JSONObject colObj){
		title = colObj.getString("title");
		field = colObj.getString("field");
		Byte b = colObj.getByte("colspan");
		colspan = b == null?1:b;
		b = colObj.getByte("rowspan");
		rowspan = b == null?1:b;
		Integer align = colObj.getInteger("halign");
		if(align == null) align = Element.ALIGN_CENTER;
		halign = align.byteValue();
		align = colObj.getInteger("valign");
		if(align == null) align = Element.ALIGN_MIDDLE;
		valign = align.byteValue();
		Short w = colObj.getShort("width");
		if(w == null) w = 50;
		width = w.shortValue();
		font = colObj.getString("font");
		border = colObj.getBoolean("border");
		if(border == null) border = true;
		//获取
		bkColor = parseColor(colObj.get("bkColor"));
		Boolean bl = colObj.getBoolean("hidden");
		hidden = bl == null?false:bl;
		titleAlign = colObj.getBoolean("titleAlign");
		if(titleAlign == null) titleAlign = false;
	}
	
	//创建pdf单元格,text为空表示为header
	public PdfPCell createCell(FontCreator fontCreator,String text,String font1){
		cell = new PdfPCell();
		boolean isHeader = true;
		String val = title;
		byte halign_tmp = halign;
		if(text != null){
			isHeader = false;
			val = text;
		}else{
			//标题定制为居中
			if(titleAlign) halign_tmp = Element.ALIGN_CENTER;
		}
		if(val == null) val = "";
		//html空格转换
		val = val.replaceAll("&nbsp;", "  ");
		if(font1 == null) font1 = font;
		Paragraph p = new Paragraph(val,fontCreator.getFont(font1));
		cell = new PdfPCell(p);
		if(isHeader){
			if(colspan > 1) cell.setColspan(colspan);
			if(rowspan > 1) cell.setRowspan(rowspan);
		}
		cell.setHorizontalAlignment(halign_tmp);
		cell.setVerticalAlignment(valign);
		if(border == false) cell.setBorder(0);
		cell.setBackgroundColor(new BaseColor(bkColor));
		return cell;
	}
	
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getField() {
		return field;
	}
	public void setField(String field) {
		this.field = field;
	}
	public short getWidth() {
		return width;
	}
	public void setWidth(short width) {
		this.width = width;
	}
	public PdfPCell getCell() {
		return cell;
	}
	public void setCell(PdfPCell cell) {
		this.cell = cell;
	}
	public byte getRowspan() {
		return rowspan;
	}
	public void setRowspan(byte rowspan) {
		this.rowspan = rowspan;
	}
	public byte getColspan() {
		return colspan;
	}
	public void setColspan(byte colspan) {
		this.colspan = colspan;
	}
	public byte getValign() {
		return valign;
	}
	public void setValign(byte valign) {
		this.valign = valign;
	}
	public byte getHalign() {
		return halign;
	}
	public void setHalign(byte halign) {
		this.halign = halign;
	}
	public boolean isHidden() {
		return hidden;
	}
	public void setHidden(boolean hidden) {
		this.hidden = hidden;
	}
	public int getRowIndex() {
		return rowIndex;
	}
	public void setRowIndex(int rowIndex) {
		this.rowIndex = rowIndex;
	}
	public int getCellIndex() {
		return cellIndex;
	}
	public void setCellIndex(int cellIndex) {
		this.cellIndex = cellIndex;
	}
	
}
