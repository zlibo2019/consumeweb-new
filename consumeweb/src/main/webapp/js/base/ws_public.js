garen_define("js/base/ws_public",function(require, exports, module){
	
	return  {
				depQuery:"wsBase/qryDepByAccess.do",//部门查询
				ideQuery:"wsBase/ideQuery.do",//身份查询
				pswRuleQuery:"wsBase/pswRuleQuery.do",//密码规则查询
				glyQuery:"wsBase/glyQuery.do",//管理员查询
				merchantQuery:"wsBase/merchantQuery.do",//商户查询
				// placeQuery:"wsBase/placeQuery.do",//场所查询
				placeQuery:"wsBase/qryAcDepByAccess.do",//场所查询
				devQuery:"wsBase/qryDevByAccess.do",//设备查询
				allReadCard:"wsBase/allReadCard.do",//读卡
				allReadIdCard:"wsBase/allReadIdCard.do",//读身份证
				queryIsMainCard:"wsBase/queryIsMainCard.do",//查询主附卡
				tradPrint:"wsBase/tradPrint.do",//打印凭条信息
				queryTimeOffset:"wsBase/queryTimeOffset.do",//查询时间偏移量
				querySubject:"wsBase/querySubject.do",//查询科目树（报表）
				qryBank:"wsBase/qryBank.do",//查询银行（报表）	
				checkCoreIp:"wsBase/checkCoreIp.do"//核心业务IP授权验证 check
			};
});