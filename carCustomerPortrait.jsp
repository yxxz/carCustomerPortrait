<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
	String contextPath = request.getContextPath();
%>
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>车型统计</title>
	<link rel="stylesheet" type="text/css" href="<%=contextPath %>/lib/bootstrap/bootstrap-select.css">
	<link rel="stylesheet" type="text/css" href="<%=contextPath %>/lib/bootstrap/bootstrap-table.css">
	<link rel="stylesheet" type="text/css" href="<%=contextPath %>/css/radio-checkbx.css">
	<link rel="stylesheet" type="text/css" href="<%=contextPath %>/lib/bootstrap/bootstrap-multiselect.css">
	<link rel="stylesheet" type="text/css" href="<%=contextPath %>/pages/carCustomerPortrait/css/city.css">
	<link rel="stylesheet" type="text/css" href="<%=contextPath %>/pages/carCustomerPortrait/css/carCustomerPortrait.css">
</head>
<body>

<div id="carCustomerPortrait">
	<div class="simple-breadcrumb">
		        <span>决策分析系统</span> &gt;
		        <span>车型分析</span> &gt;
		        <span class="font-blue">车型统计</span>
	</div>
<!-- 	<div id="info"> -->
	 <form class="" id="indexForm">
		<div class="row">
		  <div class="" id="switch_radio">
		  	<label class="label_key lab_rad">统计指标  </label>		  			
		  </div>
		</div>
		<div class="row" id="busi_type_sel">
			<div class="">
				<label class="label_key">业务类型  </label>
				<select class="selectpicker" id="busi_type">
				</select>
				<span class="change_time">
					<select class="multiselect" multiple="multiple" id="busi_type_mult">
					</select>
				</span>		
			</div>
	</div>
	<div class="row" id="change_time_inp">
			<div class="">
					<label class="label_key">时间选择  </label>
					<select class="selectpicker" id="min_year">
					</select>
					<select class="selectpicker" id="min_mon">
					</select>
					<span class="line"></span>
					<select class="selectpicker" id="max_year">
					</select>
					<select class="selectpicker" id="max_mon">
					</select>
					<span id="prompt_errormsg" style="display:none;"></span>
			</div>
	</div>
		<div class="row">
			<div class="sel_city">
					<label class="label_key">城市选择  </label>
						<input type="text" class="area-duoxuan" id="get_city" placeholder="选择城市" readonly/>
			</div>
		</div>
		<div class="row" id="change_carType">
				<label class="label_key">车型选择  </label>
				<select data-live-search="true" title="主品牌" class="selectpicker carType_select" id="master_brand">
				</select>
				<select data-live-search="true" title="子品牌" class="selectpicker carType_select" id="sub_brand">
				</select>
				&nbsp;&nbsp;&nbsp;
				<select data-live-search="true" title="车系" class="selectpicker carType_select" id="car_series" disabled="disabled">
					<!-- <option value="">请选择</option>	 -->			
				</select>
				<select data-live-search="true" title="车款" class="selectpicker carType_select" id="car_style" disabled="disabled">
					<!-- <option value="">请选择</option> -->
				</select>
		</div>
	<div id="hidden_div" style="display:none">
	<!-- 二期迭代新增 start-->
		<div class="row">
		  <div class="" id="productSel">
		  	<label class="label_key modal_font_pos lab_rad" style="color:#666;">产品选择 </label>
	 		<label class="radio-inline n3-radio-con pageType"><span class="n3-radio-inner"></span> <input class="n3-radio-input" name="proSel" type="radio" value="">不限</label>
	 		<label class="radio-inline n3-radio-con pageType"><span class="n3-radio-inner"></span> <input class="n3-radio-input" name="proSel" type="radio" value="driven_away">开走吧</label>
	 		<label class="radio-inline n3-radio-con pageType"><span class="n3-radio-inner"></span> <input class="n3-radio-input" name="proSel" type="radio" value="custom">自定义</label>
	 		<input type="text" id="user_def" class="sel_length"placeholder="" disabled="disabled"/><span id="custom_msg" style="display:none;"></span>		  			
		  </div>
		</div>
		<div class="row" id="clueSource">
				<label class="label_key">线索来源  </label>
				<select data-live-search="true" data-actions-box="true" multiple title="" class="selectpicker" id="clue_source">
				</select>
		</div>
		<div class="row" id="busiBlong_hidden">
			<div id="busiBlong_strDiv">
				<label class="label_key">业务归属  </label>
				<label id="busi_Blong"></label>
			</div>
		</div>
		<!-- 二期迭代新增 end-->
		<div class="row">
			<div class="">
				<label class="label_key">生产方式  </label>
				<label id="pdc_type"></label>
			</div>
		</div>
		<div class="row">
			<div class="">
				<label class="label_key">品牌国别  </label>
				<label id="brand_country">
				</label>
			</div>
		</div>
		<div class="row" id="order_source_hidden">
			<div id="orderSource_strDiv">
				<label class="label_key">订单来源  </label>
				<label id="order_source"></label>
			</div>
		</div>
		<div class="row" id="car_type_hidden">
			<div class="">
				<label class="label_key">车辆类型  </label>
					<label id="car_type_inp">
					</label>
			</div>
		</div>
		<div class="row" id="new_car_price">
			<div class="">
				<label class="label_key">新车指导价（万元）  </label>
				<label><input name="xc" type="text" value="" id="newcar_price_start" class="newcar_price_inp w80 inputNumber" maxValue="9999" minValue="0" decimalLevel="2"/> (含) </label>
				<span class="line"></span>
				<label><input name="esc" type="text" value="" id="newcar_price_end" class="newcar_price_inp w80 inputNumber" maxValue="9999" minValue="0" decimalLevel="2"/> (含) </label>
			</div>
			<span id="prompt_msg" style="display:none;"></span>
		</div>
	</div>
	<div class="show_more">
		<span  id="show_more_btn" data-rel = "1">更多</span>
		<img id="show_more_img" src="pages/carCustomerPortrait/img/down.png"  alt="" />
	</div>
	<div class="row count_reset">
		<button type="button" id="count" class="btn btn-info btn_primary_solo" style="background:#1D86F4">统计</button>
        <button type="button" id="reset" class="btn btn-info-base btn-info-solo">重置</button>
	</div>
	</form>
<!--   </div> -->

	<!-- 表格 -->
	<div id="carType_tab_div">
		<div class="carType_title">
			<div class="countResult_table_left col-md-6">
				<span class="title_icon"></span>
				<span class="title_font">统计结果</span>
			</div>
			<div class="countResult_table_right col-md-6">
				<button type="button" id="export_table" class="btn btn-info btn_primary_solo"><img class="export_icon" src="pages/carCustomerPortrait/img/export.png" alt="">导出表格</button>	
			</div>
		</div>
		<div class="t_menu_tab">
			<!-- 头部菜单 -->
			<div id="t_menu">
				<span url_b="Overview" data-type="1" class="t_m_act">总计</span>
				<span url_b="AccordingToClue" data-type="2">性别</span>
				<span url_b="AccordingToPro"data-type="3" >年龄</span> 
				<span url_b="Team" data-type="4">收入</span> 
				<span url_b="Province" data-type="5">学历</span>
				<span url_b="Province" data-type="6">职业</span>
				<span url_b="Province" data-type="7">省份</span>
				<span url_b="Province" data-type="8">城市</span>
				<span url_b="Province" data-type="9">品牌</span>
				<span url_b="Province" data-type="10">车系</span>
			</div>
		</div>
		<table id="carType_table"></table>
		<div id="carseriesInfo" style="display:none">提示：您需选中一个主品牌或子品牌，才可查看车系分析~ </div>
	</div>
	
			<!--导出成功-->
            <div class="download hide download-success" id="downloadSuccess">
             	<span class="right-cirle"><i></i></span><span>已成功下载至本地</span>
            </div>	
            <!-- 导出失败 -->
            <div class="download hide download-fail" id="downloadFail">
             	<span class="right-cirle">&times;</span><span>抱歉，下载请求失败，<br>请稍后再试~</span>
            </div> 	
            <!-- 导出失败(条件不全导致失败) -->
            <div class="download hide download-fail" id="Fail_IncompleteInfo">
             	<span class="right-cirle">&times;</span><span>提示：<br>您须选中一个主品牌或子品牌，才可导出表格数据~</span>
            </div> 	
   <!-- </div>	 -->
   <!-- 导出  弹出层 -->
	<div class="modal fade" id="export_modal" tabindex="-1" role="dialog" aria-labelledby="EditModalLabel" aria-hidden="true">
	   	<div class="modal-dialog">
	       <div class="modal-content">
	           <div class="modal-header">
	           		<button type="button" class="close" id="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
	               <h4 class="modal-title" id="EditModalLabel">导出下载</h4>
	           </div>
	           <div class="modal-body">
					<div class="table_header">
				 		<label class="modal_font_pos" style="color:#666;"><font style="color:red;margin-right:2px">*</font>请选择需导出的表格，最多可选择 6 项 : </label><span id="qx_msg" style="display:none;"></span>	
				 		<div class="tbheader" id="theaderCon">
					 		<label class="checkbox-inline n3-checkbox-label glyphicon-checked-fontColor">
					 			<input type="checkbox" name="qx" class="n3-checkbox-input" value="1">
					 			<span class="n3-checkbox-inner glyphicon"></span>总计	
					 		</label>
					 		<label class="checkbox-inline n3-checkbox-label glyphicon-checked-fontColor">
					 			<input type="checkbox" name="qx" class="n3-checkbox-input" value="2">
					 			<span class="n3-checkbox-inner glyphicon"></span>性别
					 		</label>
					 		<label class="checkbox-inline n3-checkbox-label glyphicon-checked-fontColor">
					 			<input type="checkbox" name="qx" class="n3-checkbox-input" value="3">
					 			<span class="n3-checkbox-inner glyphicon"></span>年龄
					 		</label>
					 		<label class="checkbox-inline n3-checkbox-label glyphicon-checked-fontColor">
					 			<input type="checkbox" name="qx" class="n3-checkbox-input" value="4">
					 			<span class="n3-checkbox-inner glyphicon"></span>收入
					 		</label>
					 		<label class="checkbox-inline n3-checkbox-label glyphicon-checked-fontColor">
					 			<input type="checkbox" name="qx" class="n3-checkbox-input" value="5">
					 			<span class="n3-checkbox-inner glyphicon"></span>学历
					 		</label>
					 		<label class="checkbox-inline n3-checkbox-label glyphicon-checked-fontColor">
					 			<input type="checkbox" name="qx" class="n3-checkbox-input" value="6">
					 			<span class="n3-checkbox-inner glyphicon"></span>职业
					 		</label>
					 		<label class="checkbox-inline n3-checkbox-label glyphicon-checked-fontColor">
					 			<input type="checkbox" name="qx" class="n3-checkbox-input" value="7">
					 			<span class="n3-checkbox-inner glyphicon"></span>省份
					 		</label>
					 		<label class="checkbox-inline n3-checkbox-label glyphicon-checked-fontColor">
					 			<input type="checkbox" name="qx" class="n3-checkbox-input" value="8">
					 			<span class="n3-checkbox-inner glyphicon"></span>城市
					 		</label>
					 		<label class="checkbox-inline n3-checkbox-label glyphicon-checked-fontColor">
					 			<input type="checkbox" name="qx" class="n3-checkbox-input" value="9">
					 			<span class="n3-checkbox-inner glyphicon"></span>品牌
					 		</label>
					 		<label class="checkbox-inline n3-checkbox-label glyphicon-checked-fontColor">
					 			<input type="checkbox" name="qx" class="n3-checkbox-input" value="10">
					 			<span class="n3-checkbox-inner glyphicon"></span>车系
					 		</label>
				 		</div>
				 	</div>
	            <div class="modal-footer">
	            	<button type="button" class="btn btn-primary save" id="export_save">导出</button>
	                <button type="button" class="btn btn-default" id="export_quxiao">重置</button>                
	            </div>
	        </div>
	   	</div>
</div>
</div>

</div>
    <script src="<%=contextPath %>/lib/bootstrap/bootstrap-select.js"></script>
    <script src="<%=contextPath %>/lib/bootstrap/bootstrap-table.js"></script>
   	<script src="<%=contextPath %>/js/common-m.js"></script>
	<script src="<%=contextPath %>/lib/bootstrap/bootstrap-multiselect.js"></script>
	<script src="<%=contextPath %>/pages/carCustomerPortrait/js/city.js"></script>
	<script src="<%=contextPath %>/pages/carCustomerPortrait/js/carCustomerPortrait.js"></script>
</body>
</html>