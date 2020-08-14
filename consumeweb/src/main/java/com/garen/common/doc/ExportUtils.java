package com.garen.common.doc;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;

import com.garen.common.GridBean;
import com.garen.utils.DateUtils;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.ColumnText;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfPageEventHelper;
import com.itextpdf.text.pdf.PdfWriter;

/*
 * 导出文档工具函数
 * */
public class ExportUtils {

	protected static Log log = LogFactory.getLog(ExportUtils.class);
	
	//导出2003格式
	public static <T> File exportXls(List<GridBean> exportList,ExportBean pb
			,IExportBean ebean,String fileTile){
		HSSFWorkbook wb = new HSSFWorkbook();  
		return exportExcel(wb,exportList,pb,ebean,fileTile);
	}
	//导出2007格式
	public static <T> File exportXlsx(List<GridBean> exportList,ExportBean pb
			,IExportBean ebean,String fileTile){
		SXSSFWorkbook wb = new SXSSFWorkbook(5000);  
		return exportExcel(wb,exportList,pb,ebean,fileTile);
	}
	
	/**
	 * 生成xlsx格式文件,office2007以上支持
	 * @param exportList 生成文件的表头信息
	 * @param pb 分页信息
	 * @param ebean 回调接口，用户获取数据.
	 * @param fileTile 文件标题
	 * @return
	 */
	@SuppressWarnings({ "unchecked" })
	public static <T> File exportExcel(Workbook wb,List<GridBean> exportList,ExportBean pb
			,IExportBean ebean,String fileTile){
		Integer PAGE_SIZE = 10000;
		//生成xls文件
		// 第一步，创建一个webbook，对应一个Excel文件  
		//SXSSFWorkbook wb = new SXSSFWorkbook(5000);  
        // 第二步，在webbook中添加一个sheet,对应Excel文件中的sheet  
		Sheet sheet = wb.createSheet();  
		
		/* 
         * 设定合并单元格区域范围 
         *  firstRow  0-based 
         *  lastRow   0-based 
         *  firstCol  0-based 
         *  lastCol   0-based 
         */  
        CellRangeAddress cra=new CellRangeAddress(0, 0, 0, exportList.size()-1);   
      //在sheet里增加合并单元格  
        sheet.addMergedRegion(cra);  
        
		Cell cell = null;
		Row row = sheet.createRow(0);  
		cell = row.createCell(0);
		cell.setCellValue(fileTile);//表头
		org.apache.poi.ss.usermodel.Font font = wb.createFont();
		font.setBold(true);
		font.setFontHeightInPoints((short)16);
		CellStyle style1 = wb.createCellStyle();  
		style1.setAlignment(HSSFCellStyle.ALIGN_CENTER); // 创建一个居中格式  
		style1.setFont(font);
		cell.setCellStyle(style1);
		
        // 第三步，在sheet中添加表头第0行,注意老版本poi对Excel的行数列数有限制short  
        row = sheet.createRow(1);  
        // 第四步，创建单元格，并设置值表头 设置表头居中  
        CellStyle style = wb.createCellStyle();  
        style.setAlignment(HSSFCellStyle.ALIGN_CENTER); // 创建一个居中格式  
        int i = 0;
        
        int totalPage = 0;
        //设置标题
        for(GridBean exportBean : exportList){
        	if("..".equals(exportBean.getTitle())) continue;
        	cell = row.createCell(i++);
        	cell.setCellValue(exportBean.getTitle());  
 	        cell.setCellStyle(style);  
        }
        //初始化
        pb.setPageSize(PAGE_SIZE);//每页记录数
        long start = System.currentTimeMillis(),end = 0;
        int pageNum = 1;
        int allRows = 2;
        //查询数据
        do{
			end = System.currentTimeMillis();
			log.debug("检索第" + pageNum + "页," + (end - start));
			pb.setPageNum(pageNum++);
			ebean.queryRow(pb);
			if(totalPage == 0){//获取总页数
				//totalPage = pb.getTotal() / PAGE_SIZE + 1;
				totalPage = (pb.getTotal()+PAGE_SIZE-1) / PAGE_SIZE; 
				if(pb.getTotal() > 100 * 10000){
					pb.setRetInfo(-2, "记录超过100万条，超出excel最大支持数 !");//
					return null;
				}
			}
			log.debug("检索完毕," + (System.currentTimeMillis() - end));
			for(Map<String, Object> real: (List<Map<String,Object>>)pb.getRows()){
				row = sheet.createRow(allRows++);  
	            int j = 0;
	            for(GridBean exportBean : exportList){
	            	if("..".equals(exportBean.getTitle())) continue;
		        	cell = row.createCell(j++);
		        	try {
						Object obj = PropertyUtils.getProperty(real, exportBean.getField());
						if(obj == null) obj = "";
						String v = obj.toString();
						if("time".equals(exportBean.getFieldType())){
							v = DateUtils.date2str((Date)obj,"yyyy-MM-dd HH:mm:ss");
						}
						cell.setCellValue(v);  
			 	        cell.setCellStyle(style);  
					} catch (IllegalAccessException | InvocationTargetException | NoSuchMethodException e) {
						//e.printStackTrace();
						log.debug("值获取错误" + e.getMessage());
					}
		        }
			}
			start = end; 
		}while(pageNum <= totalPage);
        File tempFile = null;
     // 第六步，将文件存到指定位置  
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
            pb.setRetInfo(-1,"导出文档异常!");//
        }  
		log.debug("检索记录结束");
		return tempFile;
	}
	
	/**
	 * 生成pdf格式文档
	 * @param exportList 生成文档的表头信息
	 * @param pb 分页信息
	 * @param ebean 回调接口，用户获取数据.
	 * @param fileTile 文档标题
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public static <T> File exportPdf(List<GridBean> exportList,ExportBean pb
			,IExportBean ebean,String title){
		Integer PAGE_SIZE = 5000;
		Document document = null;
		Integer diret = pb.getDiret();
		if(diret == null || diret == 1)
			document = new Document(PageSize.A4);
		else 
			document = new Document(PageSize.A4.rotate());
		String fileName = "export";
		File tempFile = null;
		try {
			// 支持中文
			BaseFont bfChinese = BaseFont.createFont("STSong-Light", "UniGB-UCS2-H", BaseFont.NOT_EMBEDDED);

			// 设置字体
			Font fontsize12 = new Font(bfChinese, 12, Font.BOLD);
						
			// 设置字体
			final Font fontsize10 = new Font(bfChinese, 10, Font.BOLD);
			// 设置字体
			final Font fontsize8 = new Font(bfChinese, 8, Font.NORMAL);
						
	        PdfPageEventHelper pdfPageEventHelper = new  PdfPageEventHelper(){
			    public void onEndPage (PdfWriter writer, Document document) {
			        com.itextpdf.text.Rectangle rect = writer.getBoxSize("pager");
			        ColumnText.showTextAligned(writer.getDirectContent(),//
			                Element.ALIGN_CENTER, new Phrase(String.format("第 %d 页", writer.getPageNumber()),fontsize8),
			                (rect.getLeft() + rect.getRight()) / 2, rect.getBottom()-28, 0);
			    }
			};
			
			tempFile = File.createTempFile(fileName, ".pdf");
			FileOutputStream fout = new FileOutputStream(tempFile);
			PdfWriter writer = PdfWriter.getInstance(document, fout);
			
			com.itextpdf.text.Rectangle rect = new com.itextpdf.text.Rectangle(36, 54, 559, 788);//document.getPageSize();
            writer.setBoxSize("pager", rect);

            writer.setPageEvent(pdfPageEventHelper);
            
			document.open();
			
			// 设置字体
			//Font fontsize4 = new Font(bfChinese, 4, Font.NORMAL);
						
			PdfPCell cell;

			int totalPage = 0;
			Paragraph pdfTitle = null;
			pdfTitle = new Paragraph(title+"", fontsize12);// 抬头  
			pdfTitle.setAlignment(Element.ALIGN_CENTER); // 居中设置  
			pdfTitle.setLeading(1f);//设置行间距//设置上面空白宽度  
	        document.add(pdfTitle);  
	        
	        //
	        pdfTitle = new Paragraph("打印时间:" + 
	        		DateUtils.date2str(new Date(), "yyyy-MM-dd"), fontsize8);// 抬头  
			pdfTitle.setAlignment(Element.ALIGN_RIGHT); // 居中设置  
			pdfTitle.setLeading(10f);//设置行间距//设置上面空白宽度  
	        document.add(pdfTitle); 
	        
	        pdfTitle = new Paragraph("   ", fontsize12);// 抬头  
			pdfTitle.setAlignment(Element.ALIGN_CENTER); // 居中设置  
			pdfTitle.setLeading(16f);//设置行间距//设置上面空白宽度  
	        document.add(pdfTitle); 
	        
			// 初始化
			pb.setPageSize(PAGE_SIZE);// 每页记录数
			long start = System.currentTimeMillis(), end = 0;
			int pageNum = 1;
			float []cellsWidth = null;
			do {
				PdfPTable table = new PdfPTable(exportList.size());// 表格列数
				table.setWidthPercentage(100);
				int i = 0;
				if(cellsWidth == null){
					cellsWidth = new float[exportList.size()];
					// 设置标题
					for (GridBean exportBean : exportList) {
						float f = exportBean.getWidth() ;
						cellsWidth[i++] = f;
						cell = new PdfPCell(new Phrase(exportBean.getTitle(), fontsize10));
						cell.setHorizontalAlignment(Element.ALIGN_CENTER);
						table.addCell(cell);
					}
				}
				table.setWidths(cellsWidth);
				end = System.currentTimeMillis();
				log.debug("检索第" + pageNum + "页," + (end - start));
				pb.setPageNum(pageNum++);
				ebean.queryRow(pb);
				if (totalPage == 0) {// 获取总页数
					totalPage = pb.getTotalPage();
				}
				log.debug("检索完毕," + (System.currentTimeMillis() - end));
				for (Map<String, Object> real : (List<Map<String,Object>>)pb.getRows()) {

					for (GridBean exportBean : exportList) {

						try {
							Object obj = PropertyUtils.getProperty(real, exportBean.getField());
							if (obj == null)
								obj = "";
							String v = obj.toString();
							if("time".equals(exportBean.getFieldType())){
								v = DateUtils.date2str((Date)obj,"yyyy-MM-dd HH:mm:ss");
							}
							cell = new PdfPCell(new Phrase(v, fontsize8));
							cell.setHorizontalAlignment(Element.ALIGN_CENTER);
							table.addCell(cell);
						} catch (IllegalAccessException | InvocationTargetException | NoSuchMethodException e) {
							log.debug("值获取错误" + e.getMessage());
						}
					}
				}
				document.add(table);
				start = end;
			} while (pageNum < totalPage);
			document.close();
		} catch (IOException | DocumentException e1) {
			e1.printStackTrace();
			pb.setRetInfo(-1,"写入pdf文档异常");//
		}
		log.debug("检索记录结束");
		return tempFile;
	}
}
