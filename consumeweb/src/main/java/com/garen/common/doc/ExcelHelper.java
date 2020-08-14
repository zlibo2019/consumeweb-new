package com.garen.common.doc;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.poi.EncryptedDocumentException;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;

import com.garen.common.JsonPage;
public class ExcelHelper {

	protected static Log logger = LogFactory.getLog(ExcelHelper.class);

	/*
	 * 参数：
	 * JosnPage 错误信息
	 * inputStream 文档流
	 * sheetIndex 工作表的索引值(从0检索 )
	 * colStart 数据开始的列从0开始
	 * colSize 数据列大小
	 * titleIndex 标题列
	 * 注：
	 *    标题列前有行一行数据，设置字段名称
	 * **/
    public static List<Map<String,Object>> readExcelWithId(JsonPage jp,InputStream inputStream, 
    			int sheetIndex,int colStart,int colSize, int titleIndex) {
    	List<Map<String,Object>> mapList = readExcel(jp,inputStream,sheetIndex,colStart,colSize,titleIndex);
    	int i = titleIndex + 2;
    	for(Map<String,Object> map : mapList){
    		map.put("xh", "" + i++);
    	}
    	return mapList;
    }
    
	/*
	 * 参数：
	 * JosnPage 错误信息
	 * inputStream 文档流
	 * sheetIndex 工作表的索引值(从0检索 )
	 * colStart 数据开始的列从0开始
	 * colSize 数据列大小
	 * titleIndex 标题列
	 * 注：
	 *    标题列前有行一行数据，设置字段名称
	 * **/
    public static List<Map<String,Object>> readExcel(JsonPage jp,InputStream inputStream, 
    			int sheetIndex,int colStart,int colSize, int titleIndex) {
    	List<Map<String,Object>> resultList = new ArrayList<>();
    	if (colStart < 0 || colSize < 1) return resultList;
        //设置 工作表 索引默认值 0
        if (sheetIndex < 0) sheetIndex = 0;
        if (titleIndex < 0) titleIndex = 0;
        int  dataRoleIndex = titleIndex + 1;
        try {
            Workbook wb = WorkbookFactory.create(inputStream);
            Sheet sheet = wb.getSheetAt(sheetIndex);
            int rowNum = sheet.getLastRowNum(); //1.获取总行数
            if(rowNum <= 0) return resultList;
            int cellNum = colStart + colSize;
            String []colsName = new String[colSize];
            Row row = sheet.getRow(titleIndex - 1);
            if (row == null) {
            	jp.setRetInfo(-100, "文档格式不正确");
            	return resultList;
            }
            if(row.getLastCellNum() > cellNum) {
    			jp.setRetInfo(-100, "文档格式不正确");
             	return resultList;
    		}
            //遍历表头
            for (int j = colStart; j < cellNum; j++) {
                Cell cell = row.getCell(j);
                if (cell == null) {
                	jp.setRetInfo(-100, "文档格式不正确");
                	return resultList;
                }
                colsName[j - colStart] = cell.getStringCellValue();
            }
            for (int i = dataRoleIndex; i <= rowNum; i++) {
            	Map<String,Object> rowMap = new HashMap<>();
                row = sheet.getRow(i);
                if(row == null) continue;
                if(row.getLastCellNum() > cellNum) {
        			jp.setRetInfo(-100, "文档格式不正确");
                 	return resultList;
        		}
            	for (int j = colStart; j < cellNum; j++){
                    Cell cell = row.getCell(j);
                    rowMap.put(colsName[j-colStart], getCellValue(cell));
                }
                resultList.add(rowMap);
            }
        } catch (IOException | EncryptedDocumentException | InvalidFormatException e) {
            e.printStackTrace();
        } finally {
            if (inputStream != null) {
                try {
                    inputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            } else {
                logger.info("没有数据流");
            }
        }
        return resultList;
    }

    private static Object getCellValue(Cell cell) {
    	if(cell == null) return null;
        int cellType = cell.getCellType();
        switch (cellType) {
            case Cell.CELL_TYPE_NUMERIC://数字
                if (DateUtil.isCellDateFormatted(cell)) {
                    return  cell.getDateCellValue();
                } else {
                    return cell.getNumericCellValue();
                }
            case Cell.CELL_TYPE_BOOLEAN://布尔类型
                return cell.getBooleanCellValue();
            case Cell.CELL_TYPE_STRING://字符类型
                return cell.getStringCellValue().trim();
            default:
                return null;
        }
    }
    
}
