package com.garen.utils.xls;

import java.io.File;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.util.CellRangeAddress;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.garen.utils.LangUtils;
import com.garen.utils.doc.entity.Column;
import com.garen.utils.doc.filter.IDataFilter;
/*
 * 根据模板生成xls表格
 * */
public class ExcelCreator {

	private Sheet sheet;
	private CellStyle[] styles = null;
	protected static Log log = LogFactory.getLog(ExcelCreator.class);
	//表格列集合--内容
	private List<Column> colBodyList = new ArrayList<>();
	private CellStyle createStyle(HSSFWorkbook wb,boolean bold,int fontSize,
			short align,boolean border){
		CellStyle style = null;
		Font font = null;
		font = wb.createFont();
		font.setBold(bold);
		font.setFontHeightInPoints((short)fontSize);
		style = wb.createCellStyle();  
		style.setAlignment(align); // 创建一个居中格式  
		style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
		style.setFont(font);
		if(border){
			style.setBorderTop(HSSFCellStyle.BORDER_THIN);
			style.setBorderRight(HSSFCellStyle.BORDER_THIN);
			style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
			style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
		}
		return style;
	}
	public void initStyle(HSSFWorkbook wb){
		styles = new CellStyle[8];
		//设置标题样式
		styles[0] = createStyle(wb,true,14,HSSFCellStyle.ALIGN_CENTER,false);
		//设置表格header
		styles[1] = createStyle(wb,true,11,HSSFCellStyle.ALIGN_CENTER,true);
		//设置正文
		styles[2] = createStyle(wb,false,10,HSSFCellStyle.ALIGN_CENTER,true);
		//设置页眉页脚左侧
		styles[3] = createStyle(wb,true,11,HSSFCellStyle.ALIGN_LEFT,false);
		//设置页眉页脚右侧
		styles[4] = createStyle(wb,true,11,HSSFCellStyle.ALIGN_RIGHT,false);
		//表格居左
		styles[5] = createStyle(wb,false,10,HSSFCellStyle.ALIGN_LEFT,true);
		//表格居左
		styles[6] = createStyle(wb,false,10,HSSFCellStyle.ALIGN_RIGHT,true);
		//页眉页脚居中
		styles[7] = createStyle(wb,true,11,HSSFCellStyle.ALIGN_CENTER,false);
	}
	//保存表格
	private File saveXls(HSSFWorkbook wb){
	   File tempFile = null;
       try  
       {  
       	String fileName = "export";
       	tempFile = File.createTempFile (fileName,".xlsx");
           FileOutputStream fout =  new FileOutputStream(tempFile) ;  
           //ByteArrayOutputStream bout = new ByteArrayOutputStream();
           wb.write(fout);  
           //System.out.print(bout.toByteArray().length);
           fout.close();  
           wb.close();
       }catch (Exception e){  
           e.printStackTrace();  
           log.error("导出文档异常!");//
       }  
       return tempFile;
	}
	/*
	 * 参数:
	 *  jobj模板对象
	 *  records 数据列表
	 *  headers 页眉
	 *  footers 页脚
	 *  headerExs 页眉扩展
	 * */
	public File createXls(JSONObject jobj,JSONArray records,
			JSONArray headers,JSONArray footers,JSONArray headerExs){
		HSSFWorkbook wb = new HSSFWorkbook();  
		sheet = wb.createSheet();  
		initStyle(wb);//初始化表格样式
		String title = getStr(jobj,"title","pdf报表");
		Cell cell = null;
		Row row = sheet.createRow(0);  //创建第0行
		cell = row.createCell(0);
		cell.setCellStyle(styles[0]);
		int rowNum = createTable(jobj.getJSONObject("table"),records);
		int filedSize = colBodyList.size();
		//合并标题单元格
		mergeCell(0, 0, 0, filedSize - 1,false);
		cell.setCellValue(title);//表头
		createSection(headers,1,filedSize);
		createSection(footers,rowNum,filedSize);
		return saveXls(wb);
	}
	//计算cell的样式
	private CellStyle calcCellStyle(int m,int size){
		CellStyle style = null;
		if(size == 0) style = styles[3];
		else if(size == 2){
			style = (m == 0)?styles[3]:styles[4];
		}else{
			if(m == 0) style = styles[3];
			else if(m == size - 1) style = styles[4];
			else style = styles[7];
		}
		return style;
	}
	//创建片段
	private void createSection(JSONArray jarrs,int rowIndex,int colSize){
		int size = jarrs.size();
		int i = colSize / size,j = colSize % size;
		int a = size / 2,m = 0,index = 0;
		Row row = sheet.createRow(rowIndex);
		while(m < colSize){
			Cell cell = row.createCell(m);
			cell.setCellStyle(calcCellStyle(index,size));
			if(index == a) {
				mergeCell(rowIndex,0,m,i + j - 1,false);
				m += j;
			}else mergeCell(rowIndex,0,m,i - 1,false);
			cell.setCellValue(jarrs.getString(index));
			m += i;
			index++;
		}
	}
	//创建表格
	private int createTable(JSONObject jtable,JSONArray records){
		//生成表头
		JSONArray columns = jtable.getJSONArray("columns");
		createHeader(columns,0,0,0);
		//生成数据
		return createBody(records,columns.size() + 2);
	}
	//创建表格正文
	private int createBody(JSONArray datalist,int rowNum){
		Cell cell = null;
		//debug = true;
		boolean sumflag = false;
		int rowOffset = rowNum;
		for(Object obj: datalist){
			JSONObject map = (JSONObject)obj;
			Row row = sheet.createRow(rowOffset);
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
				cell = row.createCell(0);
				mergeCell(rowOffset++, 0, 0, 7,true);
				cell.setCellStyle(styles[4]);
				cell.setCellValue(text);
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
				//html空格转换
				val = val.replaceAll("&nbsp;", "  ");
				CellStyle style = null;//flag == 0?styles[2]:styles[1];
				if(flag == 0){
					byte halign = col.getHalign();
					//log.debug("halign = " + halign);
					if(halign == 0) style = styles[5];
					else if(2 == halign) style = styles[6];
					else if(1 == halign) style = styles[2];
				}else style = styles[1];
				cell = row.createCell(col.getCellIndex());
				cell.setCellStyle(style);
				if(total > 1 && flag == 1){
					mergeCell(rowOffset, 0, col.getCellIndex(), total - 1,true);
					flag = 2;
				} 
				cell.setCellValue(val);
				if(sumflag){//小计合计强制居中
					sumflag = false;
				}
				total-- ;
			}
			//debug = false;
			rowOffset++;
		}
		return rowOffset;
	}
	//合并单元格
	private void mergeCell(int r1,int rSize,int c1,int cSize,boolean border){
		if(rSize > 0 || cSize > 0){
			CellRangeAddress cra=new CellRangeAddress(r1,r1 + rSize,c1,c1 + cSize); 
	        sheet.addMergedRegion(cra);
	        if(border == false) return;
	        //设置合并的单元格样式
	        for(int i = 0;i <= rSize;i++){
	        	for(int j = 0;j <= cSize;j++){
	        		Row row = sheet.getRow(r1 + i);
	        		if(row == null) row = sheet.createRow(r1 + i);
	        		Cell cell = row.createCell(c1 + j);
    				cell.setCellStyle(styles[1]);
		        }
	        }
		}
	}
	/*创建内容表格列集合
	 * 深度递归
	 * 遍历过的设置标志位it_flag
	 * 参数:
	 *  columns 遍历的列组
	 *  rowIndex 行
	 *  cellIndex 列
	 *  colspan 合并数目
	 * */
	private void createHeader(JSONArray columns,int rowIndex,int cellIndex,int colspan){
		if(rowIndex >= columns.size()) return;
		JSONArray column = (JSONArray)columns.get(rowIndex);
		Row row = sheet.getRow(rowIndex + 2);
		if(row == null) row = sheet.createRow(rowIndex + 2);
		for(Object obj : column){
			JSONObject colObj = (JSONObject)obj;
			Column col = new Column(colObj);
			if(col.isHidden()) continue;
			boolean flag = colObj.getBooleanValue("it_flag");//遍历标志
			if(flag) continue;
			colObj.put("it_flag", true);
			//log.debug(rowIndex +","+ cellIndex + "," + " " +  colObj.getString("title"));
			col.setRowIndex(rowIndex);
			col.setCellIndex(cellIndex);
			Cell cell = row.createCell(cellIndex);
			cell.setCellStyle(styles[1]);
			byte cspan = col.getColspan();
			byte rspan = col.getRowspan();
			mergeCell(rowIndex + 2,rspan - 1,cellIndex,cspan - 1,true);
			cell.setCellValue(colObj.getString("title"));
			short num = 1;
			if(cspan > 1) {//遍历下一行
				createHeader(columns,rowIndex+1,cellIndex,cspan);
				cellIndex += cspan - 1;
				num = cspan;
			}else colBodyList.add(col);
			if(colspan > 0){//上层为合并列
				colspan -= num;
				if(colspan == 0) break;//终止继续遍历
			}
			cellIndex++;
		}
	}
	//获取
	static String getStr(JSONObject jobj,String key,String val){
		String title = jobj.getString(key);
		return StringUtils.isEmpty(title)?val:title;
	}
		
}
