var rpts =[
	{
		title: "Bảng giá bán",
		id: "banggiaban",
		condition:{
			tu_ngay:new Date(),
			den_ngay:new Date()
		}
	},
	{
		title: "Báo cáo bán hàng theo số lượng, doanh số và lợi nhuận",
		id: "rbcbhtheodoanhso",
		condition:{
			top:10,
			bctheo:'ma_kh',
			tu_ngay:new Date(),
			den_ngay:new Date()
		}
	}
	,
	{
		title: "Cân đối phát sinh theo khách hàng",
		id: "rbacdpscnkh",
		condition:{
			tu_ngay:new Date(),
			den_ngay:new Date()
		}
	}
	,
	{
		title: "Cân đối phát sinh tài khoản",
		id: "rcandoipstk_200",
		condition:{
			dFrom:new Date(),
			dTo:new Date(),
			nMax:999, 
			bu_tru:0,
			chi_xem_tk_ct:0,
			nGlAcct:0
		}
	}
	,
	{
		title: "Tổng hợp nhập xuất tồn",
		id: "rstocksummary",
		condition:{
			tu_ngay:new Date(),
			den_ngay:new Date(),
			inctdc:'1',
			cOrder:'ma_vt'
		}
	}
	,
	{
		title: "Báo cáo tổng hợp chi phí",
		id: "rbcthcp",
		condition:{
			tu_ngay:new Date(),
			den_ngay:new Date(),
			tk:'6',
			bctheo:'ma_phi',
			nhomtheo:'ma_bp'
		}
	}
	,
	
	{
		title: "Báo cáo chi tiết chi phí",
		id: "rbcctcp",
		condition:{
			tu_ngay:new Date(),
			den_ngay:new Date(),
			tk:'6',
			nhomtheo:'ma_phi'
			
		}
	}
	,
	{
		title: "Hóa đơn bán hàng theo hạn thanh toán",
		id: "rbchdbhthtt",
		condition:{
			ngay_tt:new Date(),
			den_ngay:new Date(),
			khoang_tg:30,
			tk:'131'
		}
	}
	,
	{
		title: "Hóa đơn mua hàng theo hạn thanh toán",
		id: "rbchdmhthtt",
		condition:{
			ngay_tt:new Date(),
			den_ngay:new Date(),
			khoang_tg:30,
			tk:'331'
		}
	}
	
	,
	{
		title: "Sổ chi tiết tài khoản",
		id: "rsochitiet",
		condition:{
			dFrom:new Date(),
			dTo:new Date(),
			cLan:'Vi'
		}
	}
	,
	{
		title: "Sổ chi tiết vật tư",
		id: "sochitietvattu",
		condition:{
			dFrom:new Date(),
			dTo:new Date(),
			cOrder:'Ngay_ct,nxt'
		}
	},
	{
		title: "Chi tiết công nợ của một khách hàng",
		id: "rSoCtCnKh",
		condition:{
			tu_ngay:new Date(),
			den_ngay:new Date(),
			ngon_ngu:'Vi'
		}
	}
	
]