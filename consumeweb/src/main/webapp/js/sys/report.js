
//加载初始化
$(function(){
	
	login();//模拟登录
	
	var mainBody = $("body");
	var btnMargin = "margin:8px;";
	mainBody.loadUI({
		eName:"layoutEx",
		fit:true,
		elements:[{
			region:"north",
			height:200,
			//cssStyle:"padding-top:8px",
			elements:[{
				eName:"linkbutton",
				text:"报表测试",
				cssStyle:btnMargin,
				onClick:function(){
					centerObj.empty();
					centerObj.loadJs("js/report/merchant/reportTest");
				}
			},{
				eName:"linkbutton",
				text:"商户营业日报",
				cssStyle:btnMargin,
				onClick:function(){
					centerObj.empty();
					centerObj.loadJs("js/report/merchant/depDaily");
				}
			},{
				eName:"linkbutton",
				text:"pos营业日报",
				cssStyle:btnMargin,
				onClick:function(){
					centerObj.empty();
					centerObj.loadJs("js/report/merchant/posDaily");
				}
			},{
				eName:"linkbutton",
				text:"pos营业汇总",
				cssStyle:btnMargin,
				onClick:function(){
					centerObj.empty();
					centerObj.loadJs("js/report/merchant/posCount");
				}
			},{
				eName:"linkbutton",
				text:"商户营业汇总",
				cssStyle:btnMargin,
				onClick:function(){
					centerObj.empty();
					centerObj.loadJs("js/report/merchant/merchCount");
				}
			},
//			{
//				eName:"linkbutton",
//				text:"商户部门营业汇总",
//				cssStyle:btnMargin,
//				onClick:function(){
//					centerObj.empty();
//					centerObj.loadJs("js/report/merchant/merchDepCount");
//				}
//			},
			{
				eName:"linkbutton",
				text:"pos餐别汇总报表",
				cssStyle:btnMargin,
				onClick:function(){
					centerObj.empty();
					centerObj.loadJs("js/report/merchant/posMealCount");
				}
			},{
				eName:"linkbutton",
				text:"商户餐别汇总报表",
				cssStyle:btnMargin,
				onClick:function(){
					centerObj.empty();
					centerObj.loadJs("js/report/merchant/merchMealCount");
				}
			},
//			{
//				eName:"linkbutton",
//				text:"商户部门餐别汇总报表",
//				cssStyle:btnMargin,
//				onClick:function(){
//					centerObj.empty();
//					centerObj.loadJs("js/report/merchant/merchDepMealCount");
//				}
//			},
			{
				eName:"linkbutton",
				text:"操作员收支明细表",
				cssStyle:btnMargin,
				onClick:function(){
					centerObj.empty();
					centerObj.loadJs("js/report/operator/payment");
				}
			},{
				eName:"linkbutton",
				text:"操作员收支日报表",
				cssStyle:btnMargin,
				onClick:function(){
					centerObj.empty();
					centerObj.loadJs("js/report/operator/paymentDaily");
				}
			},{
				eName:"linkbutton",
				text:"操作员收支汇总表",
				cssStyle:btnMargin,
				onClick:function(){
					centerObj.empty();
					centerObj.loadJs("js/report/operator/paymentCount");
				}
			},{
				eName:"linkbutton",
				text:"操作员操作日报表",
				cssStyle:btnMargin,
				onClick:function(){
					centerObj.empty();
					centerObj.loadJs("js/report/operator/daily");
				}
			},{
				eName:"linkbutton",
				text:"操作员操作汇总表",
				cssStyle:btnMargin,
				onClick:function(){
					centerObj.empty();
					centerObj.loadJs("js/report/operator/count");
				}
			},{
				eName:"linkbutton",
				text:"操作员销户清单",
				cssStyle:btnMargin,
				onClick:function(){
					centerObj.empty();
					centerObj.loadJs("js/report/operator/destroy");
				}
			},
//			{
//				eName:"linkbutton",
//				text:"部门收支统计表",
//				cssStyle:btnMargin,
//				onClick:function(){
//					centerObj.empty();
//					centerObj.loadJs("js/report/finance/depPayment");
//				}
//			},{
//				eName:"linkbutton",
//				text:"核算单位收支统计表",
//				cssStyle:btnMargin,
//				onClick:function(){
//					centerObj.empty();
//					centerObj.loadJs("js/report/finance/unitPayment");
//				}
//			},
//			{
//				eName:"linkbutton",
//				text:"商户清算明细表",
//				cssStyle:btnMargin,
//				onClick:function(){
//					centerObj.empty();
//					centerObj.loadJs("js/report/merchant/clear");
//				}
//			},{
//				eName:"linkbutton",
//				text:"商户清算汇总表",
//				cssStyle:btnMargin,
//				onClick:function(){
//					centerObj.empty();
//					centerObj.loadJs("js/report/merchant/clearCount");
//				}
//			},
//			{
//				eName:"linkbutton",
//				text:"商户部门清算汇总表",
//				cssStyle:btnMargin,
//				onClick:function(){
//					centerObj.empty();
//					centerObj.loadJs("js/report/merchant/clearDepCount");
//				}
//			},
//			{
//				eName:"linkbutton",
//				text:"资产负债表",
//				cssStyle:btnMargin,
//				onClick:function(){
//					centerObj.empty();
//					centerObj.loadJs("js/report/finance/balance");
//				}
//			},{
//				eName:"linkbutton",
//				text:"科目余额表",
//				cssStyle:btnMargin,
//				onClick:function(){
//					centerObj.empty();
//					centerObj.loadJs("js/report/finance/daily");
//				}
//			},{
//				eName:"linkbutton",
//				text:"科目汇总表",
//				cssStyle:btnMargin,
//				onClick:function(){
//					centerObj.empty();
//					centerObj.loadJs("js/report/finance/dailyCount");
//				}
//			},
			{
				eName:"linkbutton",
				text:"操作员销户汇总表",
				cssStyle:btnMargin,
				onClick:function(){
					centerObj.empty();
					centerObj.loadJs("js/report/operator/destroyCount");
				}
			},{
				eName:"linkbutton",
				text:"操作员操作明细表",
				cssStyle:btnMargin,
				onClick:function(){
					centerObj.empty();
					centerObj.loadJs("js/report/operator/operateDetail");
				}
			},{
				eName:"linkbutton",
				text:"押金流水查询",
				cssStyle:btnMargin,
				onClick:function(){
					centerObj.empty();
					centerObj.loadJs("js/report/operator/depositQry");
				}
			},{
				eName:"linkbutton",
				text:"系统结存日报表",
				cssStyle:btnMargin,
				onClick:function(){
					centerObj.empty();
					centerObj.loadJs("js/report/finance/ledger");
				}
			},{
				
				eName:"linkbutton",
				text:"部门计次营业汇总报表",
				cssStyle:btnMargin,
				onClick:function(){
					centerObj.empty();
					centerObj.loadJs("js/report/real/depMerchantCount");
				}
			},{
				
				eName:"linkbutton",
				text:"POS实时营业报表",
				cssStyle:btnMargin,
				onClick:function(){
					centerObj.empty();
					centerObj.loadJs("js/report/real/posReal");
				}
			},{
				eName:"linkbutton",
				text:"商户实时营业报表",
				cssStyle:btnMargin,
				onClick:function(){
					centerObj.empty();
					centerObj.loadJs("js/report/real/merchantReal");
				}	
			},{
				
				eName:"linkbutton",
				text:"POS餐别实时营业报表",
				cssStyle:btnMargin,
				onClick:function(){
					centerObj.empty();
					centerObj.loadJs("js/report/real/posMealReal");
				}
			},{
				
				eName:"linkbutton",
				text:"商户餐别实时营业报表",
				cssStyle:btnMargin,
				onClick:function(){
					centerObj.empty();
					centerObj.loadJs("js/report/real/merchantMealReal");
				}
			},{
				
				eName:"linkbutton",
				text:"部门补贴收支汇总报表",
				cssStyle:btnMargin,
				onClick:function(){
					centerObj.empty();
					centerObj.loadJs("js/report/real/depPaymentCount");
				}
			},{
				
				eName:"linkbutton",
				text:"消费个人汇总统计报表",
				cssStyle:btnMargin,
				onClick:function(){
					centerObj.empty();
					centerObj.loadJs("js/report/finance/depPersonCount");
				}
			},{
				
				eName:"linkbutton",
				text:"消费个人汇总统计报表（横向）",
				cssStyle:btnMargin,
				onClick:function(){
					centerObj.empty();
					centerObj.loadJs("js/report/finance/depPersonCountRow");
				}
			},
//			{
//				eName:"linkbutton",
//				text:"科目记账明细表",
//				cssStyle:btnMargin,
//				onClick:function(){
//					centerObj.empty();
//					centerObj.loadJs("js/report/finance/kmjzDetail");
//				}
//			},
			{
				eName:"linkbutton",
				text:"电子转账设备日报表",
				cssStyle:btnMargin,
				onClick:function(){
					centerObj.empty();
					centerObj.loadJs("js/report/bank/devDaily");
				}
			},{
				eName:"linkbutton",
				text:"电子转账设备汇总表",
				cssStyle:btnMargin,
				onClick:function(){
					centerObj.empty();
					centerObj.loadJs("js/report/bank/devColunt");
				}
			},{
				eName:"linkbutton",
				text:"电子转账银行日报表",
				cssStyle:btnMargin,
				onClick:function(){
					centerObj.empty();
					centerObj.loadJs("js/report/bank/bankDaily");
				}
			},{
				eName:"linkbutton",
				text:"电子转账银行汇总表",
				cssStyle:btnMargin,
				onClick:function(){
					centerObj.empty();
					centerObj.loadJs("js/report/bank/bankCount");
				}
			},{
				eName:"linkbutton",
				text:"电子转账明细查询",
				cssStyle:btnMargin,
				onClick:function(){
					centerObj.empty();
					centerObj.loadJs("js/report/bank/bankDetail");
				}
			},{
				eName:"linkbutton",
				text:"系统收支日报表",
				cssStyle:btnMargin,
				onClick:function(){
					centerObj.empty();
					centerObj.loadJs("js/report/sysTotal/paymentdaily");
				}
			},{
				eName:"linkbutton",
				text:"系统收支汇总表",
				cssStyle:btnMargin,
				onClick:function(){
					centerObj.empty();
					centerObj.loadJs("js/report/sysTotal/paymentcount");
				}
			},{
				eName:"linkbutton",
				text:"系统操作日报表",
				cssStyle:btnMargin,
				onClick:function(){
					centerObj.empty();
					centerObj.loadJs("js/report/sysTotal/operatedaily");
				}
			},{
				eName:"linkbutton",
				text:"系统操作汇总表",
				cssStyle:btnMargin,
				onClick:function(){
					centerObj.empty();
					centerObj.loadJs("js/report/sysTotal/operatecount");
				}
			}]
		},{
			region:"center",
			id:"layout_center"
		}]
	});
	var centerObj = mainBody.find('#layoutEx_center');
	
	function login(){
		$.postEx("account/login.do",{user_name:'admin'});
	}
	
});
