;(function(){
	// 定义全局变量
	var switch_radio,//busi_cd
		baseUrl = contextPath,//当前路径
		data_type = $('#t_menu .t_m_act').attr('data-type'), //表格tab 的data_type 值 
		selected = [], // 业务类型 二级 select 多选
		selected_txt = [],
		pdc_type_chk = [],//生产方式
		pdc_type_chk_txt = [],//生产方式text
		brand_country_chk = [], //品牌国别
		brand_country_chk_txt = [],//品牌国别 text
		car_type_chk = [], //车辆类型
		car_type_chk_txt = [],//车辆类型 text
		order_source_chk = [],//订单来源
		order_source_chk_nm =[], // 订单来源nm
		busiBlong_chk_nm = [], //二期迭代新增 ---业务归属name
		busiTypedetail = [],//业务类型 select checked
		busiBlong = [], // 二期迭代新增 ---业务归属
		productType = [], //生产方式
		brandCountry = [],//品牌国别
		carType = [],//车辆类型
		orderSource = [], //订单来源
		clueSrc = [], // 二期迭代新增 - 线索来源	
		car_brand = [],//主品牌
	    car_make = [],//子品牌
	    car_models = [],//车系
		car_style = [],
		car_type_parameter = [],
		thData = [],
		tableData = [],
		tableParm = [],
		maxMindates = {},
		citys = {},
		carTypes = {},
		dateData = {},
		resultData = ['','','','','','','','','','',''],
		sel_Con = [],
		sel_Con_str,
		all_page,
		now_page = 20,
		prodSel, // 二期迭代新增 -- 产品选择
		clue_src // 线索来源
	//定义方法	
	var unique1,
		initMethod, //元素触发事件及调用方法
		tabSpanClick,//点击表格tab切换
		initPage,//初始化页面
		show_more,//显示更多
		radio_tab,
		clickproSel, // 二期迭代  -- 产品选择
		getCitys,
		getinitData,//初始化按条件查询
		loadDate,
		loadCity,
		loadCarType,
		getMaxMinDate,//获取最大，最小时间
		getCarTypeBrand,//获取主品牌，子品牌，车系，车型
		clickToScreen,
		screenCarType,
		initColumns,
		initTableData,
		InitTable;
		//加载表格 参数获取
	initMethod = function(){
		getinitData();
		$(document).delegate("#t_menu span","click", tabSpanClick)
				   .delegate("#show_more_btn","click", show_more)
				   .delegate("#switch_radio .radio-inline","click", radio_tab)
				   .delegate("#count","click", getTable_Data)
				   .delegate(".carType_select","change", clickToScreen)
				   .delegate("#busi_type","change", changeOpt)
				   .delegate("#export_table","click",exportModal)
				   .delegate("#min_year,#max_year","change",change_month)
				   //.delegate(".price_val input","keyup",input_check)
				   .delegate("#newcar_price_start,#newcar_price_end","blur",endInput_check)
				   .delegate("#reset","click",change_reset)
				   .delegate("#export_quxiao","click",export_quxiao)
				   .delegate("#export_save","click",export_table)
				   .delegate("#theaderCon .checkbox-inline","change",clickInp)
				   .delegate("#productSel .radio-inline","click", clickproSel)
				   $('#productSel input[type=radio]:eq(0)').prop('checked', true); //产品选择 默认不限
	};
	endInput_check = function(){
		if(parseFloat($('#newcar_price_start').val().trim()) || parseFloat($('#newcar_price_end').val().trim())){
			if(parseFloat($('#newcar_price_start').val().trim()) > parseFloat($('#newcar_price_end').val().trim())){
				$("#newcar_price_start").css("border-color","#e9474d");
				$("#newcar_price_end").css("border-color","#e9474d");
				$("#prompt_msg").fadeIn(1000).text("后面的数字必须大于等于前面的数字");
				//$("#prompt_msg").fadeOut(2000);
		         //$.showMsgbox(false, "后面的数字必须大于等于前面的数字");
		         return false;
	        }else{
	        	$("#newcar_price_start").css("border-color","#ccc");
	    		$("#newcar_price_end").css("border-color","#ccc");
	    		$("#prompt_msg").hide();
	        }
		}
	};
	change_reset = function(){ //重置
		$('#indexForm input[type=text]').val('');
		$('#min_year').next().find('ul.dropdown-menu li:eq(0) a').click();
		$('#max_year').next().find('ul.dropdown-menu li:eq(0) a').click();
		//$('.n3-checkbox-checked input').click();
		/*点击重置 后 仍默认选中checkbox*/
		var all_checkbox = $('.n3-checkbox-label span'),
		i = 0,
		all_checkbox_len = all_checkbox.length;
		for(; i<all_checkbox_len; i++){
			if(!$(all_checkbox[i]).hasClass("glyphicon-checked")){
				$(all_checkbox[i]).parent().find("input").click();
			}
		};
		$('#master_brand option:eq(0)').prop('selected', true);
		$('#master_brand option:eq(0)').change();
		$('#busi_type option:eq(0)').prop('selected', true);
		$('#busi_type option:eq(0)').change();
		//新车指导价 取消报错
		$("#newcar_price_start").css("border-color","#ccc");
		$("#newcar_price_end").css("border-color","#ccc");
		$("#prompt_msg").text('');
		var Busi_type_cd = $('#busi_type option:selected').val();
		initCity('.area-duoxuan', citys['city' + switch_radio + Busi_type_cd]);
		$("#prompt_errormsg").text('');
		$("#clueSource").find(".btn-group .dropdown-menu").find(".bs-actionsbox").find(".bs-deselect-all").click();
		$('#clue_source').parent().find(".filter-option").text("");
		$("#productSel input[type=radio]:eq(0)").click();
		initRadio_new('.pageType input[type=radio]');// 单选	
		
	};
	exportModal = function(){
		export_quxiao();//重置内容
		$("#export_modal").modal('show'); // 显示导出下载弹层
	};
	export_quxiao = function(){
		var qx = $("input[name=qx]");
		qx.prop('checked', false);
		qx.parent('.checkbox-inline').removeClass('n3-checkbox-checked');
		qx.siblings('.n3-checkbox-inner').removeClass('glyphicon glyphicon-checked');
		qx.parent(".checkbox-inline").removeClass('glyphicon-checked-fontColor');
		qx.parent(".checkbox-inline").removeClass('glyphicon-checked-fontColor');
		var firstLab = $("#theaderCon .checkbox-inline:eq(0)").find("input");
		firstLab.prop('checked', true);
		firstLab.parent('.checkbox-inline').addClass('n3-checkbox-checked');
		firstLab.siblings('.n3-checkbox-inner').addClass('glyphicon glyphicon-checked');
		firstLab.parent(".checkbox-inline").addClass('glyphicon-checked-fontColor');
		firstLab.parent(".checkbox-inline").addClass('glyphicon-checked-fontColor');
		firstLab.prop('disabled',false);
		firstLab.css("cursor","pointer!important");
		$("#theaderCon .checkbox-inline:eq(0)").change();
		
		$("#qx_msg").hide();
	};
	clickInp = function(){
		var seledInp = $("#theaderCon .checkbox-inline").find("input[name='qx']:checked");
		var seledNo = $("input[name='qx']:checkbox").not("input:checked");
		if(seledInp.length>=6){
			seledNo.prop('disabled', true);
			seledNo.css({
				"cursor":"not-allowed"
			})
		}else{
			seledNo.prop('disabled', false);
			seledNo.css({
				"cursor":"pointer"
			})
		}
	};
	export_table = function(){
		//-------------  导出表格  -------------------
		var sel_Val = $("#theaderCon .checkbox-inline").find("input[name='qx']:checked");
		if(sel_Val.length>0){
		$.createLoading(); // loading
		var excel_obj = {};
		$.each(tableParm,function(key,value){
			excel_obj[key] = value;
		});
		sel_Con = [];
		$.each(sel_Val,function(i,item){
			sel_Con.push($(this).val());
		});
		sel_Con_str = sel_Con.join(",");
		excel_obj['searchType'] = sel_Con_str;
		$.ajax({
			type:'POST',
			url:'/pm/carCount/storeExcel.koala',
			dataType:'json',
			data:excel_obj,
			success:function(excelData){
				var storeNum = excelData.data;
				$.closeLoading(); // 关掉loading
				if(storeNum){
    		    	$.createExport({
    					action : '/pm/carCount/exportExcel',
    					childInput : [{
    						name : 'uuid',
    						value : storeNum
    					},{
    						name : 'busi_cd',
    						value : switch_radio
    					}]
    				});
    		    	$("#export_modal").modal('hide'); // 隐藏导出下载弹层
    		    	setTimeout(function(){
    		    		$("#downloadSuccess").removeClass("hide");
    		    	},1000);
    		    	setTimeout(function(){
    		    		$("#downloadSuccess").addClass("hide");
    		    	},3000);
    		    	
				}else{
    		    	$("#downloadFail").removeClass("hide");
    		    	setTimeout(function(){
    		    		$("#downloadSuccess").addClass("hide");
    		    	},1000);
    		    }
				
				
			}
		});
		}else{
			$("#qx_msg").fadeIn("fast").text("请选择表头");
			setTimeout(function(){
	    		$("#qx_msg").fadeOut("fast");
	    	},1000);
			return false;
		}
		
	};
	clickToScreen = function(){
		$this = $(this);
		var id = $this.attr('id'),
			index = $this.val(),
			dataId = '';
		/*当选择不限时，框里显示提示文字，分别为主品牌、子品牌等*/
		var $this_text = $this.next().find("button").attr("title");
		if($this_text +'' === '不限'){
			$this.next().find("button").find(".filter-option").text($this.attr('title'))
		}
		switch (id) {
		case 'master_brand':
			pIndex = 1;
			if(index+'' !== ''){
				dataId = car_brand[index][0];
			}	
			$('#car_style').prop('disabled', true);
			$('#car_style').selectpicker();
			$('#car_style').empty().append('<option value="" class="opt_color">车款</option>');
			$('#car_style').selectpicker('render');
			$('#car_style').selectpicker('refresh');
			$('#car_series').prop('disabled', true);
			$('#car_series').selectpicker();
			$('#car_series').empty().append('<option value="" class="opt_color">车系</option>');
			$('#car_series').selectpicker('render');
			$('#car_series').selectpicker('refresh');
			screenCarType(dataId, 0, car_make, 2, '#sub_brand');
			break;
		case 'sub_brand':
			pIndex = 0;			
			if(index+'' !== ''){
				$('#car_series').prop('disabled', false);
				dataId = car_make[index][1];
				brandNm = car_make[index][3];
				screenCarType(dataId, pIndex, car_models, 2, '#car_series');
				$('#master_brand option[value_text="' + brandNm + '"]').prop("selected",true);
				$("#master_brand").selectpicker('refresh');
				$('#car_style').prop('disabled', true);
				$('#car_style').selectpicker();
				$('#car_style').empty().append('<option value="">车款</option>');
				$('#car_style').selectpicker('render');
				$('#car_style').selectpicker('refresh');
			}else{
				$('#car_series').prop('disabled', true);
				$('#car_series').selectpicker();
				$('#car_series').empty().append('<option value="" class="opt_color">车系</option>');
				$('#car_series').selectpicker('render');
				$('#car_series').selectpicker('refresh');
				$('#car_style').prop('disabled', true);
				$('#car_style').selectpicker();
				$('#car_style').empty().append('<option value="">车款</option>');
				$('#car_style').selectpicker('render');
				$('#car_style').selectpicker('refresh');
			}			
			break;
		case 'car_series':
			pIndex = 0;
			if(index+'' !== ''){
				$('#car_style').prop('disabled', false);
				dataId = car_models[index][1];
				screenCarType(dataId, pIndex, car_style, 2, '#car_style');		
			}else{
				$('#car_style').prop('disabled', true);
				$('#car_style').selectpicker();
				$('#car_style').empty().append('<option value="" class="opt_color">车款</option>');
				$('#car_style').selectpicker('render');
				$('#car_style').selectpicker('refresh');
			}			
			
			break;
		}		
	};
	screenCarType = function(pId, pIndex, datas, dataIndex, elem){
		/*var title = ['', '', '子品牌', '车系', '车款'],*/
		var i = 0,
			size = datas.length,
			data = null,
			//html = '<option value="" class="opt_color">' + title[dataIndex] + '</option>',
			html = '<option value="" class="opt_color">不限</option>',
			ele = $(elem);
		for (i; i < size; i++) {
			data = datas[i];
			var datads = data[pIndex].split(','),
				pIds = pId.split(',');
			if(pIds.length > 1 || datads.length > 1){
				if(pId+'' !== ''){
					if($.inArray(pIds[0], datads) > -1 || $.inArray(pIds[1], datads) > -1){
						html += '<option value="' + i + '">'+ data[dataIndex] +'</option>';
					}
				}else{
					html += '<option value="' + i + '">'+ data[dataIndex] +'</option>';
				}
			}else{
				if(data[pIndex]+'' === pId+'' || pId+'' === ''){
					html += '<option value="' + i + '">'+ data[dataIndex] +'</option>';
				}	
			}
		}
		ele.selectpicker();
		ele.empty().append(html);
		ele.selectpicker('render');
		ele.selectpicker('refresh');  
	};
	changeOpt = function(){
		var $this = $(this);
		var opt = $this.val();
		var tjzb = $('#switch_radio input[name="ifBorrower"]:checked').val();
		getCitys();
		$("#busi_type_mult").empty();
		//平台不显示业务归属
		if(tjzb+'' === '2' || tjzb+'' === '4'){
			if(opt+'' === '2'){
				$("#busiBlong_hidden").hide(); //业务归属
				delete tableParm.dept_nm;
			}else{
				$("#busiBlong_hidden").show(); //业务归属
				tableParm.dept_nm = busiBlong_chk_nm;
			}
		}

		var h = 0,
			busiTypedetail_len = busiTypedetail.length,				
			busi_type_mult = '';	
	// ------------------ 业务类型 ------------------------
		var qt_name_id = [];
		for(; h < busiTypedetail_len; h++){
			var data = busiTypedetail[h];
			var secondText = busiTypedetail[h][1];
			qt_name_id.push(secondText+","+ busiTypedetail[h][0]+","+busiTypedetail[h][2]+","+busiTypedetail[h][3]+","+busiTypedetail[h][4]);
			var secondID = busiTypedetail[h][0];
			if(secondText !== '其他'){
				if((opt+'' === data[3]+'' || opt+'' === '') && tjzb+'' === data[4]+''){
					busi_type_mult += '<option value ="'+ data[0] +'">'+ data[1] +'</option>';				//二级 select							
				}
			}
		}
		/*'其他'放在最后*/
		for(var f = 0;f<qt_name_id.length;f++){
			var qt_arr = qt_name_id[f].split(",");
			if((opt+'' === qt_arr[3]+'' || opt+'' === '') && tjzb+'' === qt_arr[4]+''){
				if(qt_arr[0]+'' === '其他'){
					busi_type_mult += '<option value ="'+ qt_arr[1] +'">'+ qt_arr[0] +'</option>';				//二级 select		
				}
			}
		}
		$("#busi_type_mult").append(busi_type_mult);
		
		// 业务类型二级select 多选

	 	$('#busi_type_mult').multiselect("destroy").multiselect({
	 		  includeSelectAllOption: true,
	 		  allSelectedText: '全部',
	 		  selectAllText: '全部',
	 		 nonSelectedText:'请选择'
	    });
		$('#busi_type_mult').multiselect('selectAll', false);
		$('#busi_type_mult').multiselect('updateButtonText');
	 	if(!opt){
			//select 多选禁止点击
			//$(".change_time").css("background-color","#D6D7D6");
			$("#busi_type_mult").multiselect('disable');
			$("#busi_type_mult").parent().find(".multiselect").css("background-color","#F0F0F0");
			$("#busi_type_mult").parent().find(".multiselect").css("cursor","not-allowed");
			}	
	};
	loadDate = function(data){
		var minTime = data.minTime,
			maxTime = data.maxTime;
		var min_sp = minTime.split("-"),
			max_sp = maxTime.split("-");
		dateData = {
			min_year : min_sp[0],//2014
			min_mon : min_sp[1],//12
			max_year : max_sp[0],//2017
			max_mon : max_sp[1]//1	
		};
		var i = Number(dateData.max_year),
				year_opt = '';
		for(; i >= dateData.min_year; i--){
				year_opt += '<option value="' + i + '">'+ (i + '年') +'</option>';
		};
		
		//起始年份
		$("#min_year").empty().append(year_opt);
		$('#min_year').selectpicker();
		$('#min_year').selectpicker('render');
		$('#min_year').selectpicker('refresh');  
		//结束年份
		$("#max_year").empty().append(year_opt);
		$('#max_year').selectpicker();
		$('#max_year').selectpicker('render');
		$('#max_year').selectpicker('refresh');  
		var forStart = 1,
			forSize = Number(dateData.max_mon),
			mon_opt = '';
		for(; forStart < forSize ; forStart++){
			mon_opt += '<option value="'+ (forStart < 10 ? '0' + forStart : forStart) +'">'+ forStart + '月' +'</option>';
		}
		mon_opt += '<option selected="selected" value="'+ (forSize < 10 ? '0' + forSize : forSize) +'">'+ forSize + '月' +'</option>';
		//起始年份
		$("#min_mon").empty().append(mon_opt);
		$('#min_mon').selectpicker();
		$('#min_mon').selectpicker('render');
		$('#min_mon').selectpicker('refresh');  
		//结束年份
		$("#max_mon").empty().append(mon_opt);
		$('#max_mon').selectpicker();
		$('#max_mon').selectpicker('render');
		$('#max_mon').selectpicker('refresh');  
		if($('#carType_table').html() === ''){
			$('#count').click();
		}	
	};
	change_month = function(){
		var $this = $(this);
		var changeYear_opt = $this.val();
		var monthDom = $this.next().next();
		var forStart = 1,
			forSize = 12,
			max_mon_opt = '';
		if(changeYear_opt === dateData.min_year) {
			forStart = Number(dateData.min_mon);
		}else if(changeYear_opt === dateData.max_year){
			forSize = Number(dateData.max_mon);
		}
		for(; forStart <= forSize ; forStart++){
			max_mon_opt += '<option value="'+ (forStart < 10 ? '0' + forStart : forStart) +'">'+ forStart + '月' +'</option>';
		}
		monthDom.empty().append(max_mon_opt);
		monthDom.find('option:last').prop('selected', true);
		monthDom.selectpicker();
		monthDom.selectpicker('render');
		monthDom.selectpicker('refresh');  
	};
	getMaxMinDate = function(){
		if(maxMindates['date' + switch_radio]){
			loadDate(maxMindates['date' + switch_radio]);
			return false;
		}
		$.ajax({
			type:'POST',
			url:'/pm/carCount/getMaxMinDate.koala',
			global:false,
			dataType:'json',
			data: {
				busi_cd : switch_radio
			},
			success:function(data){
				maxMindates['date' + switch_radio] = data.data; 
				loadDate(maxMindates['date' + switch_radio]);
			}
		});
	};
	radio_tab = function(){	
		switch_radio = $('#switch_radio input[name="ifBorrower"]:checked').val();
		 //var remove_dom = $("#all_opt");
		var html = '';
		switch_radio === "2" ? $('#warn_img').show() : $('#warn_img').hide();
		if(switch_radio === "1"){ //用户量  不显示订单来源	
			html = '<option value="">不限</option>';
				$("#order_source").empty();
				$("#busi_Blong").empty();
				$("#order_source_hidden").hide(); //订单来源
				$("#busiBlong_hidden").hide(); //业务归属
				$("#clueSource").show();//显示线索来源
				clueSrc_len = clueSrc.length; //二期迭代新增 - 线索来源
				/* ------------------ 二期迭代新增 - 线索来源  ------------------------*/
				var q = 0,
					clueSrc_str = "";
				for(; q<clueSrc_len; q++){
					clueSrc_str += '<option value="' + q + '" value_text="' + clueSrc[q] + '">'+ clueSrc[q] +'</option>';
				}
				$('#clue_source').selectpicker();
				$('#clue_source').empty().append(clueSrc_str);
				$('#clue_source').selectpicker('render');
				$('#clue_source').selectpicker('refresh');
				$('#clue_source').change();
				$("#clue_source").next().find(".bs-searchbox").find(".form-control").attr("placeholder","请输入线索来源");
		}else{
			// ------------------ 订单来源 ------------------------
			orderSource_len = orderSource.length; // 订单来源
			var p = 0,
				orderSource_str = "";
			for(; p<orderSource_len; p++){
					orderSource_str += '<label class="checkbox-inline n3-checkbox-label"><input type="checkbox" name="orderSource_nm" class="n3-checkbox-input" value="'+ orderSource[p][1] +'" checked="checked"><span class="n3-checkbox-inner"></span>'+ orderSource[p][0] +'</label>';				
			}
			$("#order_source_hidden").show();
			$('#clue_source').parent().find(".filter-option").text("");
			$("#clueSource").hide();//隐藏线索来源
			$("#order_source").empty().append(orderSource_str);	
			
			// ------------------二期迭代新增 （业务归属） ------------------------
			busiBlong_len = busiBlong.length; // 订单来源
			var s = 0,
				busiBlong_str = "";
			for(; s<busiBlong_len; s++){
				busiBlong_str += '<label class="checkbox-inline n3-checkbox-label"><input type="checkbox" name="busiBlong_nm" class="n3-checkbox-input" value="'+ busiBlong[s] +'" checked="checked"><span class="n3-checkbox-inner"></span>'+ busiBlong[s] +'</label>';				
			}
			$("#busiBlong_hidden").show();
			$("#busi_Blong").empty().append(busiBlong_str);	
			initCheck();
		}
		
	/*	if(switch_radio === "2"){
			alert("成交量1")
			$this = $(this);
			$this.after('<img id="warn_img" class="warn_icon" data-trigger="hover" data-toggle="popover" data-placement="top" data-content="成交量=统计期间生效合同量 - 统计期间取消合同量" src="pages/carCustomerPortrait/img/warn_icon.png" alt="">');
			$("[data-toggle='popover']").popover();
		}*/
		//  ---- 业务类型  ----
		var i = 0,
			size = busiTypedetail.length,
			ywlx_one = [];
		for (; i < size; i++) {
			var data = busiTypedetail[i];
			if($.inArray(data[3], ywlx_one) < 0){
				ywlx_one.push(data[3]);
				html += '<option value="' + data[3] + '">' + data[2] + '</option>';		
			}		
		}
		$('#busi_type').empty().append(html);
		if(switch_radio !== '1'){
			$('#busi_type option[value=1]').prop('selected', true);
		}
		$('#busi_type').selectpicker();
		$('#busi_type').selectpicker('render');
		$('#busi_type').selectpicker('refresh');  
		$('#busi_type').change();
		//getinitData();//初始化页面  渲染复选框
		getMaxMinDate();//获取系统时间差值
		
		// ------------------ 车辆类型  ------------------------
		carType_len = carType.length; // 车辆类型
		var o = 0,
		carType_str = '';//车龄类型;
		for(; o<carType_len; o++){
			var switch_radio_i = carType[o][2];
			if(switch_radio + '' === switch_radio_i +''){
				carType_str += '<label class="checkbox-inline n3-checkbox-label"><input type="checkbox" name="car_type_nm" class="n3-checkbox-input" value="'+ carType[o][1] +'" checked="checked"><span class="n3-checkbox-inner"></span>'+ carType[o][0] +'</label>';
			}	
		}
		$("#car_type_inp").empty().append(carType_str);	
		initCheck();
	};
	// 数组去重
	unique1 = function(arr){
		 var tmpArr = [];
		 for(var i=0; i<arr.length; i++){
		  // 如果当前数组的第i已经保存进了临时数组，那么跳过，
		  // 否则把当前项push到临时数组里面
		  if(tmpArr.indexOf(arr[i]) === -1){
		   tmpArr.push(arr[i]);
		  }
		 }
		 return tmpArr;
	};
	getCitys = function(){ //获取省市
		var Busi_type_cd = $('#busi_type option:selected').val();
		if(citys['city' + switch_radio + Busi_type_cd]){
			getCarTypeBrand();
			initCity('.area-duoxuan', citys['city' + switch_radio + Busi_type_cd]);			
			return false;
		}
		$.ajax({
			type : "POST",
			url : '/pm/carCount/getProvinceInfo.koala',
			global : false,
			dataType : 'json',
			data : {
				busi_cd : switch_radio,
				busi_type_cd : Busi_type_cd
			},
			success : function(data){
				citys['city' + switch_radio + Busi_type_cd] = data.data;
				getCarTypeBrand();
				initCity('.area-duoxuan', citys['city' + switch_radio + Busi_type_cd]);				
			}
		});
		
	};  
	getinitData = function(type_val){
		/*switch_radio = $('#switch_radio input[name="ifBorrower"]:checked').val();*/
		$.ajax({
			type:'POST',
			url:'/pm/carCount/getInitData.koala',
			dataType:'json',
			global:false,
/*			data:{
				busi_cd : switch_radio
			},*/
			contentType: 'application/json',
			success:function(data_init){
				var data = data_init.data;
				carType = data.carType;//车辆类型
				orderSource = data.orderSource; // 订单来源
				clueSrc = data.clueSrc; // 二期迭代新增   -- 线索来源
				var busi_str = "",//业务类型一级
					busiBlong_str = "", // 二期迭代新增 -- 业务归属
					productType_str = "", //生产方式
					brandCountry_str = "", //品牌国别
					//clueSrc_str = "", // 二期迭代新增 - 线索来源
					/*carType_str = "", //车龄类型
*/					orderSource_str = ""; // 订单来源
				busiTypedetail = data.busiTypedetail,//业务类型 select checked
				busiBlong = data.dept, // 二期迭代新增 -- 业务归属
				productType = data.productType, //生产方式
				brandCountry = data.brandCountry;//品牌国别
				/*carType = data.carType,//车辆类型
*/				 //订单来源
				var g = 0,//业务类型 一级下拉
					h = 0,//业务类型
					m = 0, //生产方式
					n = 0, // 品牌国别
					o = 0, // 车辆类型
					p = 0, //订单类型
					q = 0, // 二期迭代新增 - 线索来源
					s = 0, // 二期迭代新增 -业务归属
					busi_len = busiTypedetail.length, // 业务类型一级下拉 
					busiBlong_len = busiBlong.length, // 二期迭代新增 -业务归属
					productType_len = productType.length, //生产方式
					brandCountry_len = brandCountry.length // 品牌国别
					/*carType_len = carType.length, // 车辆类型
*/					//orderSource_len = orderSource.length, // 订单来源 
					
				// ------------------ 业务类型  ------------------------
				var tjzb = [];
				for(; g<busi_len; g++){
					var data_busiTypedetail = busiTypedetail[g];
					var radioText = data_busiTypedetail[5],
						warm_imgHtml;
					if($.inArray(data_busiTypedetail[4], tjzb) < 0){
						tjzb.push(data_busiTypedetail[4]);	
						if(radioText === '成交量'){
							warm_imgHtml = '<img id="warn_img" class="warn_icon" data-trigger="hover" data-toggle="popover" data-placement="top" data-content="成交量 = 统计期间生效合同量  - 统计期间取消合同量" src="pages/carCustomerPortrait/img/warn_icon.png" alt="">';
						}else{
							warm_imgHtml = '';
						}
						$('#switch_radio').append('<label class="radio-inline n3-radio-con"><span class="n3-radio-inner glyphicon radio-checked"></span> <input class="n3-radio-input" name="ifBorrower" type="radio" value="' + data_busiTypedetail[4] + '"/>' + radioText + '</label>' + warm_imgHtml);	
					}
					$("[data-toggle='popover']").popover();
				}
				$('#switch_radio input[type=radio]:eq(0)').prop('checked', true);
				// ------------------ 生产方式  ------------------------
				for(; m<productType_len; m++){
						productType_str += '<label class="checkbox-inline n3-checkbox-label"><input type="checkbox" name="pdc_type_nm" class="n3-checkbox-input" value="'+productType[m][1] +'" checked = "checked"><span class="n3-checkbox-inner"></span>'+ productType[m][0] +'</label>';
						$("#pdc_type").empty().append(productType_str);				
				}
				// ------------------ 品牌国别  ------------------------
				for(; n<brandCountry_len; n++){
						brandCountry_str += '<label class="checkbox-inline n3-checkbox-label"><input type="checkbox" name="brand_country_nm" class="n3-checkbox-input" value="'+ brandCountry[n][1] +'" checked="checked"><span class="n3-checkbox-inner"></span>'+ brandCountry[n][0] +'</label>';
						$("#brand_country").empty().append(brandCountry_str);				
				};
				// ------------------ 车辆类型  ------------------------
/*				for(; o<carType_len; o++){
					var switch_radio_i = carType[o][2];
					if(switch_radio + '' === switch_radio_i +''){
						carType_str += '<label class="checkbox-inline n3-checkbox-label"><input type="checkbox" name="car_type_nm" class="n3-checkbox-input" value="'+ carType[o][1] +'" checked="checked"><span class="n3-checkbox-inner"></span>'+ carType[o][0] +'</label>';
					}	
						$("#car_type_inp").empty().append(carType_str);				
				}*/
				// ------------------ 订单来源 ------------------------
/*				for(; p<orderSource_len; p++){
						orderSource_str += '<label class="checkbox-inline n3-checkbox-label"><input type="checkbox" name="orderSource_nm" class="n3-checkbox-input" value="'+ orderSource[p][1] +'" checked="checked"><span class="n3-checkbox-inner"></span>'+ orderSource[p][0] +'</label>';
						$("#order_source").empty().append(orderSource_str);				
				}*/
				initCheck();
				radio_tab();					
				$('#car_series').selectpicker();
				$('#car_series').selectpicker('render');
				$('#car_series').selectpicker('refresh');
				$('#car_style').selectpicker();
				$('#car_style').selectpicker('render');
				$('#car_style').selectpicker('refresh');
			}
		});
	};
	/*二期迭代新增 - 产品选择*/
	clickproSel = function(){
		var $this_val_radio = $(this).find(".n3-radio-input").val();
		if($this_val_radio+'' === ''){
			$("#user_def").attr("disabled",true);
			$("#productSel").find("#user_def").val("");
		}else if($this_val_radio+'' === 'driven_away'){ // 开走吧
			$("#user_def").attr("disabled",true);
			$("#productSel").find("#user_def").val("");
		}else{ // 自定义
			$("#user_def").attr("disabled",false);
		}
	};
	loadcarType = function(data){
		//获取接口数据car_brand、car_make、car_models、car_style
		car_brand = data.car_brand,//主品牌
	    car_make = data.car_make,//子品牌
	    car_models = data.car_models,//车系
		car_style = data.car_style;//车款
		//分别遍历 主品牌  数组
		var i = 0,
		car_brand_len = car_brand.length,
		car_brand_str = '<option value="" class="opt_color">不限</option>';
		for(; i<car_brand_len; i++){
			car_brand_str += '<option value="' + i + '" value_text="' + car_brand[i][1] + '">'+ car_brand[i][1] +'</option>';			
		}
		$('#master_brand').selectpicker();
		$('#master_brand').empty().append(car_brand_str);
		$('#master_brand').selectpicker('render');
		$('#master_brand').selectpicker('refresh');
		$('#master_brand').change();			
	};
	getCarTypeBrand = function(){
		var Busi_type_cd = $('#busi_type option:selected').val();
		if(carTypes['carType' + switch_radio + Busi_type_cd]){
			loadcarType(carTypes['carType' + switch_radio + Busi_type_cd]);		
			return false;
		}
		$.ajax({
			type:'POST',
			url:'/pm/carCount/getCarTypeBrand.koala',
			global:false,
			dataType:'json',
			data: {
				busi_cd : switch_radio,
				busi_type_cd : Busi_type_cd
			},
			success:function(data){
				carTypes['carType' + switch_radio + Busi_type_cd] = data.data;
				loadcarType(carTypes['carType' + switch_radio + Busi_type_cd]);
			}
		});
	};
	getTable_Data = function(){
		var proS = $('#productSel input[name="proSel"]:checked').val();
		if($(this).attr('id') + '' === 'count'){
			if(proS === 'custom'){ // 自定义
				if($("#productSel").find("#user_def").val()+'' === ''){
					$("#custom_msg").fadeIn("fast").text("请输入自定义产品");
					setTimeout(function(){
			    		$("#custom_msg").fadeOut("fast");
			    	},2000);
					return;
				}else{
					var custom_txt = $("#productSel").find("#user_def").val();
					prodSel = custom_txt;
				}
			}else if(proS+'' === 'driven_away'){ //开走吧
				prodSel = $('#productSel input[name="proSel"]:checked').val(); // 所选产品的 val 
			}else{
				prodSel = '';
			}
			resultData = ['','','','','','','','','','','']
			//获取时间 并拼接成为符合 要求 的格式
			var st_y = $('#min_year option:selected').val(),
				st_m = $('#min_mon option:selected').val(),
				st_ym = st_y + '-' + st_m,
				end_y = $('#max_year option:selected').val(),
				end_m = $('#max_mon option:selected').val(),
				end_ym = end_y + '-' + end_m,
				switch_radio_txt = $("input[name='ifBorrower']:checked")[0].nextSibling.nodeValue,
				busi_type_cd = $('#busi_type option:selected').val(),
				busi_type_cd_txt = $('#busi_type option:selected').text(),
				startTime = (st_ym + '') === ' - '?"":st_ym, //开始时间
				endTime = (end_ym + '') === ' - '?"":end_ym, //结束时间
				car_brand_cd = $('#master_brand option:selected').val() ? car_brand[$('#master_brand option:selected').val()][0] : '',
				car_brand_nm = $('#master_brand option:selected').text(),// 所选主品牌 
				car_make_cd = $('#sub_brand option:selected').val() ?  car_make[$('#sub_brand option:selected').val()][1] : '',
				car_make_nm = $('#sub_brand option:selected').text(),// 所选子品牌 
				car_models_cd = $('#car_series option:selected').val() ? car_models[$('#car_series option:selected').val()][1] : '',
				car_models_nm = $('#car_series option:selected').text(),//所选车系
				car_style_cd = $('#car_style option:selected').val() ? car_style[$('#car_style option:selected').val()][1] : '',
				car_style_nm = $('#car_style option:selected').text(),// 所选车型
				newcar_price_start = $('#newcar_price_start').val(),
				newcar_price_end = $('#newcar_price_end').val(),
				area = getArea_data(),
				prov = getProv_data(),
				city = getCity_data(),
				area_text = getArea_text(),
				prov_text = getProv_text(),
				city_text = getCity_text(),
				clue_src = $('#clue_source').parent().find(".filter-option").text().trim() + '';
				if(st_y > end_y){
					//$.showMsgbox(false, "起始年份不得大于结束年份，请重新选择！");
					$("#change_time_inp .btn-group>.btn").css("border-color","#e9474d");
					//$("#newcar_price_end").css("border-color","#e9474d");
					$("#prompt_errormsg").fadeIn(1000).text("起始年份不得大于结束年份，请重新选择！");
					//$("#prompt_errormsg").fadeOut(2000);
					return false;
				}else if(Number(st_y) === Number(end_y) && Number(st_m) > Number(end_m)){
					//$.showMsgbox(false, "起始月份不得大于结束月份，请重新选择！");
					$("#change_time_inp .btn-group>.btn").css("border-color","#e9474d");
					$("#prompt_errormsg").fadeIn(1000).text("起始月份不得大于结束月份，请重新选择！");
					//$("#prompt_errormsg").fadeOut(2000);
					return false;
				}
				$("#change_time_inp .btn-group>.btn").css("border-color","#ccc");
				$("#prompt_errormsg").hide();
				$('#newcar_price_start').change();
				$('#newcar_price_end').change();
			if(parseFloat(newcar_price_start) > parseFloat(newcar_price_end)){
					/*$("#newcar_price_start").css("border-color","#e9474d");
					$("#newcar_price_end").css("border-color","#e9474d");
					$("#prompt_msg").fadeIn(1000).text("后面的数字必须大于等于前面的数字");*/
					//$("#prompt_msg").fadeOut(2000);
			         //$.showMsgbox(false, "后面的数字必须大于等于前面的数字");
			         return false;
		        }
				/*$("#newcar_price_start").css("border-color","#ccc");
				$("#newcar_price_end").css("border-color","#ccc");
				$("#prompt_msg").hide();*/
				//业务类型 多选 id
				selected = [];
				selected_txt = [];
				$('#busi_type_mult option:selected').each(function () {
					selected.push($(this).val());
					selected_txt.push($(this).text());
				});
				selected = selected.join(",");
				selected_txt = selected_txt.join(",");
				//生产方式   checkbox id 以  ，分隔
				pdc_type_chk = [];
				pdc_type_chk_txt = [];
				if($('input[name="pdc_type_nm"]:checked').length === $('input[name="pdc_type_nm"]').length){
					pdc_type_chk_txt = [];
				}else{
				$('input[name="pdc_type_nm"]:checked').each(function(){
					pdc_type_chk.push($(this).val()); 
					pdc_type_chk_txt.push($(this).parent().text());
					});
				pdc_type_chk = pdc_type_chk.join(",");
				pdc_type_chk_txt = pdc_type_chk_txt.join(",");
				}
				//品牌国别  checkbox id 以  ，分隔
				brand_country_chk = [];
				brand_country_chk_txt = [];
				if($('input[name="brand_country_nm"]:checked').length === $('input[name="brand_country_nm"]').length){
					brand_country_chk_txt = [];
				}else{
				$('input[name="brand_country_nm"]:checked').each(function(){ 
					brand_country_chk.push($(this).val()); 
					brand_country_chk_txt.push($(this).parent().text());
					});
				brand_country_chk = brand_country_chk.join(",");
				brand_country_chk_txt = brand_country_chk_txt.join(",");
				}
				//车辆类型 checkbox id 以  ，分隔
				car_type_chk = [];
				car_type_chk_txt = [];
				if($('input[name="car_type_nm"]:checked').length === $('input[name="car_type_nm"]').length){
					car_type_chk_txt = [];
				}else{
				$('input[name="car_type_nm"]:checked').each(function(){ 
					car_type_chk.push($(this).val()); 
					car_type_chk_txt.push($(this).parent().text());
					});
				car_type_chk = car_type_chk.join(",");
				car_type_chk_txt = car_type_chk_txt.join(",");
				}
				//订单来源 checkbox id 以  ，分隔
				order_source_chk = [];
				order_source_chk_nm = [];
				if($('input[name="orderSource_nm"]:checked').length === $('input[name="orderSource_nm"]').length){
					order_source_chk_nm = [];
				}else{
				$('input[name="orderSource_nm"]:checked').each(function(){ 
					order_source_chk.push($(this).val());
					order_source_chk_nm.push($(this).parent().text()); 
				});
				order_source_chk = order_source_chk.join(",");
				order_source_chk_nm = order_source_chk_nm.join(",");
				}
				//二期新增（业务归属）checkbox name
				busiBlong_chk_nm = [];
				if($('input[name="busiBlong_nm"]:checked').length === $('input[name="busiBlong_nm"]').length){
					busiBlong_chk_nm = [];
				}else{
				$('input[name="busiBlong_nm"]:checked').each(function(){ 
					busiBlong_chk_nm.push($(this).parent().text()); 
				});
				busiBlong_chk_nm = busiBlong_chk_nm.join(",");
				}
			    tableParm = {
						busi_cd : switch_radio,//1:用户量  , 2:成交量  , 4:进件量						
						busi_type_cd : busi_type_cd, //1:自营 2：平台   null :不限
						busi_taxonm_cd : selected,			  
						startTime : startTime, //开始时间
						endTime : endTime, //结束时间
						car_brand_cd : car_brand_cd, //主品牌id
						car_make_cd : car_make_cd,//子品牌id
						car_models_cd : car_models_cd,//车系id
						car_style_cd : car_style_cd, //车型id
						car_mfr_cd : pdc_type_chk,//生产方式
						car_make_cycd : brand_country_chk, //品牌国别
						car_type : car_type_chk, //车辆类型
						startPrice : newcar_price_start,//新车指导价
						endPrice : newcar_price_end,//新车指导价
						/*car_amt : newcar_price, */
						order_src : order_source_chk, // 订单来源
						order_src_nm : order_source_chk_nm,
						busi_nm : $.trim(switch_radio_txt),
						busi_type_nm : busi_type_cd_txt,
						busi_taxonm_nm : selected_txt,
						car_brand_nm : (car_brand_nm + '') === "主品牌"||(car_brand_nm + '') === "不限"?"":car_brand_nm,
						car_make_nm : (car_make_nm + '') === "子品牌"||(car_brand_nm + '') === "不限"?"":car_make_nm,
						car_style_nm : (car_style_nm + '') === "车款"||(car_brand_nm + '') === "不限"?"":car_style_nm,
						car_models_nm : (car_models_nm + '') === "车系"||(car_brand_nm + '') === "不限"?"":car_models_nm,
						car_mfr_nm : pdc_type_chk_txt,
						car_make_cy : brand_country_chk_txt,
						car_type_nm : car_type_chk_txt,
						large_area_cd : area,
						prov_cd : prov,
						city_cd : city,
						large_area_nm : area_text,
						prov_nm : prov_text,
						city_nm : city_text,
						prodSelect : prodSel, // 产品选择
						clue_src : clue_src,  // 线索来源
						dept_nm : busiBlong_chk_nm // 二期迭代新增业务类型（业务归属）
				};	   
		}	
		//统计结果 多维度
		tableParm['searchType'] = data_type, //1:查询总计, 2:按性别分组, 3:年龄, 4:收入, 5:学历, 6:职位, 7 :地域
	    $.createLoading();
		 if(data_type === '10'){ //点击车系
			 if(!tableParm.car_brand_cd && !tableParm.car_make_cd && !tableParm.car_models_cd) {
				 $.closeLoading();
				  $(".bootstrap-table").hide();
				  $("#carseriesInfo").show();
				 return; 
			 }
		 }
		 $("#carseriesInfo").hide();
		 if(resultData[Number(data_type)] !== ''){
			 $.closeLoading();
			 var table_data = JSON.parse(JSON.stringify(resultData[Number(data_type)]));
			 thData = table_data[0];
			 table_data.shift();
			 tableData = table_data;
			 initTable();
			 return false;
		 }
		$.ajax({
			type:'POST',
			url:'/pm/carCount/getCarTypeUseCondation.koala',
			dataType:'json',
			data: tableParm,
			success:function(data){
				$.closeLoading();
				var table_data = data.data;
				resultData[Number(data_type)] = JSON.parse(JSON.stringify(table_data));
				thData = table_data[0]; // 表头数据
				table_data.shift();
				tableData = table_data;
				initTable();
			}
		});
	};
	initColumns = function(){
		var columns = [];
		var i = 0,
			size = thData.length,
			data;
		for (; i < size; i++) {
			columns.push({
				title: thData[i],
                field: 'data' + i,
              	align: 'center',
                valign: 'middle',
                formatter : function(value, row, index){
    				if(!value){
    					value = '-';
    				}
    				/*else{
    					(this.title + '') === '成交融资额' ? value = (value / 10000).toFixed(2) : value;
    				}*/
    				return value;
    			}
			});
		}
		return columns;
	};
	initTableData = function(){
		var data = [],
			i = 0,
			size = tableData.length,
			i_data = [],
			j,
			j_szie,
			j_data = '';
		for (; i < size; i++) {
			j_data = {};
			i_data = tableData[i];
			j = 0;
			j_size = i_data.length;  
			for (; j < j_size; j++) {	
				j_data['data' + j] = i_data[j];
			}
			data.push(j_data);
		}
		return  data;		
	};
	initTable = function(){
		$("#carType_table").bootstrapTable('destroy');
		$('#carType_table').bootstrapTable({
		    data: initTableData(), 
            striped: true,                      //是否显示行间隔色
            pagination: true,                   //是否显示分页（*）
            pageNumber:1,                       //初始化加载第一页，默认第一页
            pageSize: now_page,                       //每页的记录行数（*）
            pageList: [20, 50, 100, 200, 300],  //可供选择的每页的行数（*）
		    columns: initColumns(),
		    onResetView: function(data){
		    	if($('.no-records-found').length > 0){
		    		$('.fixed-table-body').scrollLeft(($('.fixed-table-body').width() / 2) - 30);
		    	}
		    }
        });
		/*如果页码小于20就不可选*/
		all_page = $(".fixed-table-pagination").find(".pull-left").find(".pagination-info").text().replace(/\s/g,'');
		getStrAfter(all_page,"共");
		all_page = all_page.replace("条","");
		if(all_page < "20"){
			$(".page-list").find(".btn-group").addClass("disabledSP");
		}else{
			$(".page-list").find(".btn-group").removeClass("disabledSP");
		}
	};
	getStr = function(string,str){
		  var str_before = string.split(str)[0];
		  now_page = str_before;
		};
	getStrAfter = function(string,str){
		 var str_after = string.split(str)[1];
		 all_page = str_after;
	 	};
	tabSpanClick = function(){ //切换Tab
		 data_type = $(this).attr("data-type");
		 now_page = $(".page-list").find(".btn-group").find("button").find("span").text();
		 getStr(now_page,'条');
		 getTable_Data();
		if($(this).hasClass('t_m_act')){// 如果次tab已被点击,再次点击无效直接退出
			return false;
		}else{
			if($(this).attr('url_b')){// 判断是可以去查询数据的tab页
				//sortIg = true;
				$('#t_menu span').removeClass('t_m_act');// 把所有的tab菜单的点击效果取消
				$(this).addClass('t_m_act'); // 此次被点击的tab菜单增加点击效果
			}else{
				return false;
			}
		}
		 
	};
	show_more = function(){
		var con=Number($(this).attr('data-rel'));
		if(con === 1){
			$("#hidden_div").show();
			$("#show_more_btn").attr('data-rel',2);
			$("#show_more_btn").text("收起");
			$("#show_more_img").attr("src","pages/carCustomerPortrait/img/up.png");		
			}else{
			$("#hidden_div").hide();
			$("#show_more_btn").attr('data-rel',1);
			$("#show_more_btn").text("更多");
			$("#show_more_img").attr("src","pages/carCustomerPortrait/img/down.png");
			}
	};
	$(function(){
		$.createLoading();
		//初始化加载方法
		initMethod(); // 初始化 调用方法	
		$('#clue_source').selectpicker({
    		actionsBox:true,
    		deselectAllText:"取消",
    		selectAllText:"全选"
    	});
	});							
})();
