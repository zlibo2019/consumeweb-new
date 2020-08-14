package com.garen.utils.doc.filter.impl;

import java.util.ArrayList;
import java.util.List;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.garen.utils.LangUtils;
import com.garen.utils.doc.filter.IDataFilter;

//分组小计
public class GroupTotalFilterImpl implements IDataFilter {

	protected static Log log = LogFactory.getLog(GroupTotalFilterImpl.class);
	
	@Override
	public JSONArray filter(JSONObject jobj, JSONArray datalist,int flag) {
		if(flag == 2) return datalist;//不作统计
		TreeIterator treeIterator = new TreeIterator();
		//初始化字段参数
		if(treeIterator.init(jobj, datalist) == false) return datalist;
		List<GroupField> gfList = treeIterator.filter();
		for(GroupField gf : gfList){//遍历加入队列
			datalist.add(gf.getIndex(),gf.getJobj());
		}
		return datalist;
	}

	public  TreeNode searchNode(List<TreeNode> nodeList,
			String nodeName,String groupName,int colSpan){
		if(nodeName == null) nodeName = "";
		for(TreeNode node: nodeList){
			if(nodeName.equals(node.getName()))
				return node;
		}
		//未找到新建节点
		TreeNode node = new TreeNode(nodeName,groupName,colSpan);
		nodeList.add(node);
		return node;
	}
	
	//树遍历迭代器
	class TreeIterator{
		private String groupName;
		private List<String> fieldlist;
		private List<String> sumfieldlist;
		private List<String> groupfieldlist;
		private JSONArray datalist;
		private List<GroupField> gflist ;
		private int offset;
		private int colSpan;
		public List<GroupField> filter(){
			//初始化
			gflist = new ArrayList<GroupTotalFilterImpl.GroupField>();
			List<TreeNode> nodeList = list2Tree();
			offset = 0;
			iteratorTree(nodeList,new JSONObject());
			return gflist;
		}
		//迭代树,计算小计，偏移量及清空字段
		private JSONObject iteratorTree(List<TreeNode> nodeList,JSONObject sumobj1){
			for(TreeNode node : nodeList){
				JSONObject sumobj2 = node.sumobj;
				List<JSONObject> leafList = node.leafList;
				if(leafList == null) {//分支节点
					iteratorTree(node.children,sumobj2);
					if(node.children.size() > 1)
						gflist.add(0,new GroupField(offset,sumobj2));//头部插入
				}else{//叶子节点
					offset += leafList.size();//偏移量计数
					boolean flag = false;
					for(JSONObject row : leafList){//统计合计
						for(String sumfield : sumfieldlist){
							long sum = LangUtils.getLongValue(sumobj2,sumfield);
							sum += LangUtils.getLongValue(row,sumfield);
							sumobj2.put(sumfield, sum);
						}
						if(flag){//遍历清空字段,第一行不清空
							row.put(groupName, null);//清空
							for(String fieldkey : fieldlist){
								row.put(fieldkey, null);//清空
							}
						}else flag = true;
					}
					gflist.add(0,new GroupField(offset,sumobj2));//头部插入
				}
				
				
				for(String sumfield : sumfieldlist){
					long sum1 = LangUtils.getLongValue(sumobj1,sumfield);
					long sum2 = LangUtils.getLongValue(sumobj2,sumfield);
					sumobj1.put(sumfield, sum1 + sum2);
				}
			}
			return sumobj1;
		}
		//列表生成树
		private List<TreeNode> list2Tree(){
			List<TreeNode> nodeList = new ArrayList<>();
			TreeNode node = null;
			for(Object obj : datalist){
				List<TreeNode> tList = nodeList;
				JSONObject row = (JSONObject)obj;//当前列
				if(row.getBooleanValue(TOTAL_FLAG)) continue;//若为合计列
				for(String field : groupfieldlist){
					String key = row.getString(field);
					node = searchNode(tList,key,groupName,colSpan);
					if(node == null) continue;
					tList = node.children;
				}
				if(node == null) continue;
				//添加叶子
				List<JSONObject> leafList = node.leafList;
				if(leafList == null){
					leafList = new ArrayList<>();
					node.leafList = leafList;
				}
				leafList.add(row);
			}
			return nodeList;
		}
		
		//初始化变量
		public boolean init(JSONObject jobj, JSONArray datalist){
			if(LangUtils.listIsNull(datalist)) return false;
			this.datalist = datalist;
			JSONObject jtotal = jobj.getJSONObject("grouptotal");
			if(null == jtotal) return false;
			groupName = jtotal.getString("name");
			if(StringUtils.isEmpty(groupName)) return false;
			colSpan = LangUtils.getIntValue(jtotal,"colspan");
			//清空字段
			fieldlist = LangUtils.str2StrList(jtotal.getString("fields"));
			if(LangUtils.listIsNull(fieldlist)) {
				fieldlist = new ArrayList<>();
			};
			sumfieldlist = LangUtils.str2StrList(jtotal.getString("sumfields"));
			if(LangUtils.listIsNull(sumfieldlist)) return false;
			groupfieldlist = LangUtils.str2StrList(jtotal.getString("groupfields"));
			if(LangUtils.listIsNull(groupfieldlist)) return false;
			return true;
		}
		
	}
	class TreeNode{
		private String name;//节点名称
		private JSONObject sumobj;//合计节点
		private List<TreeNode> children;//子节点
		private List<JSONObject> leafList;//叶子
		public  TreeNode(String name,String groupName,int colSpan){
			this.name = name;
			this.children = new ArrayList<>();
			this.sumobj = new JSONObject();
			this.sumobj.put(groupName, "小计");
			this.sumobj.put(GROUPTOTAL_FLAG,true);
			this.sumobj.put(GROUPTOTAL_COUNT_FLAG,colSpan);
		}

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}


		@Override
		public String toString() {
			return "TreeNode [name=" + name
						 + ", leafList=" + leafList + "]";
		}
	}
	
	class GroupField{
		public GroupField(int index,JSONObject jobj){
			this.index = index;
			this.jobj = jobj;
		}
		private int index;
		private JSONObject jobj;
		
		public int getIndex() {
			return index;
		}
		public void setIndex(int index) {
			this.index = index;
		}
		public JSONObject getJobj() {
			return jobj;
		}
		public void setJobj(JSONObject jobj) {
			this.jobj = jobj;
		}
	}
}
