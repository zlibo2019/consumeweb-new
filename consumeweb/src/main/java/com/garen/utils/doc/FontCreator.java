package com.garen.utils.doc;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.garen.utils.FileUtils;
import com.garen.utils.LangUtils;
import com.itextpdf.text.BaseColor;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Font;
import com.itextpdf.text.pdf.BaseFont;

//字体创建
public class FontCreator {
	protected static Log log = LogFactory.getLog(FontCreator.class);
	private BaseFont baseFont;
	private Map<String,Font> mapFonts = new HashMap<>();
	
	public FontCreator(JSONObject jfont) throws DocumentException, IOException{
		createFonts(jfont);
		getSysFonts();
	}
	//获取系统字体
	private void getSysFonts(){
		try{
			//获取系统默认字体
			byte[] b = FileUtils.readbodydata(
					getClass().getResourceAsStream("/com/garen/config/report.txt"), 0);
			JSONObject jfont = JSON.parseObject(new String(b,"utf-8"));
			createFonts(jfont.getJSONObject("fonts"));
		}catch(Exception e){
			log.debug(e.getMessage());
		}
	}
	//解析颜色
	private int parseColor(Object obj){
		if(obj == null) return 0xff000000;
		int val = 0;
		if(obj instanceof String ){
			val = Integer.parseInt(obj.toString(),16);
		}
		return val | 0xff000000;
	}
	/*
	 * 创建字体
	 * 无定义返回默认字体
	 * */
	public Map<String,Font> createFonts(JSONObject jfont) 
			throws DocumentException, IOException{
		baseFont = BaseFont.createFont("STSong-Light", //默认字体
				"UniGB-UCS2-H", BaseFont.EMBEDDED);
		mapFonts.put("font", new Font(baseFont, 12, Font.NORMAL));//默认字体
		if(jfont == null) return mapFonts;
		for(String key : jfont.keySet()){
			JSONObject fontObj = LangUtils.getJSONObject(jfont, key);
			if(fontObj == null) continue;
			Font font  = new Font(baseFont, 
				fontObj.getFloatValue("size"), 
				fontObj.getIntValue("bold"));
			//获取字体颜色
			font.setColor(new BaseColor(parseColor(fontObj.get("color"))));
			mapFonts.put(key, font);
		} 
		return mapFonts;
	}
	//获取字体
	public Font getFont(String key){
		Font font  = mapFonts.get(key);
		return (font == null)?mapFonts.get("font"):font;
	}
}
