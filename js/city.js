var initCity,
	getArea_data,
	getProv_data,
	getCity_data,
	getArea_text,
	getProv_text,
	getCity_text;
var initCityFunc = function(){
var initFuncData,
	cityData,
	cityelem,
	area_data,
	prov_data,
	city_data,
	area_text,
	prov_text,
	city_text,
	check_elem = [],
	checked_elem = [],
	modalHtml,
	checkIClick,
	initCityModal,
	checkSpanClick,
	hideCitys,
	canHideCitys = false,
	citysMouseover,
	citysMouseout,
	modalBodyClick,
	clickToPrimaryCity,
	clickToCancel,
	clickToUnCheck,
	initMethod,
	inited = false;
	initFuncData = function(){
	cityData = [],
	cityelem = [],
	area_data = [],
	prov_data = [],
	city_data = [],
	area_text = [],
	prov_text = [],
	city_text = [],
	check_elem = [],
	checked_elem = [];
};
	modalHtml = '	<div class="modal-dialog" id="cityCheck_modal">'
		  	  + '  		<div class="modal-content">'
			  + '           <div class="modal-header">'
			  + '               <label class="font_size">已选城市:</label>'
			  + '           </div>'
			  + '           <div class="modal-body">'
			  + '           	<h5 class="font_size">全部城市:</h5>'
			  + '           	<ul id="areaUl">'
			  + '           	</ul>'
			  + '           	<ul id="provUl">'
			  + '           	</ul>'
			  + '           </div>'
			  + '           <div class="modal-footer">'
			  + '           	<button type="button" class="btn btn-primary save">提交更改</button>'
			  + '               <button type="button" class="btn btn-default cancel">关闭</button>	 '               
			  + '           </div>'
		      + ' 		</div>'
		   	  + '	 </div>';
	checkIClick = function(){
		var $this = $(this),
			i;
		var checkDataEle = $this.parent();
		var checkHtml = '<label class="checkData" areap provp data_index="位置"><span>文字</span><i>×</i></label>';
		if($this[0].tagName === 'I'){ 
			i = $this;
		}else{
			i = $this.prev();
		}		
		if(i.hasClass('check')){
			var data_index = '';
			i.attr('class','original');
			checkDataEle.find('>span').removeClass('checkText');
			//所选 省 所属的市 选中样式
			
			if(checkDataEle.hasClass('area')){
				data_index = 'area' + checkDataEle.attr('data_index');
			}else if(checkDataEle.hasClass('prov')){
				data_index = 'prov' + checkDataEle.attr('data_index');
			}else if(checkDataEle.hasClass('city')){
				var checkPrvo1 = checkDataEle.parent().parent();
				var checkPrvo_Span1 = checkPrvo1.find('>span');
				if(checkPrvo1.find('.citys i.check').length < 1){
					checkPrvo_Span1.removeClass('checkText');
					checkDataEle.find('>span').parent().parent().parent().find("i").removeClass('tint_check').attr('class','original');
				}
				data_index = 'city' + checkDataEle.attr('data_index');
			}
			$('#cityCheck_modal .modal-header .checkData[data_index="' + data_index + '"]').remove();
			check_elem.splice($.inArray(i, check_elem), 1);
		}else{
			if(checkDataEle.hasClass('area')){
				var checkLi1 = checkDataEle.parent();
				var checkLi_index1 = $.inArray(checkLi1[0], $('#areaUl li'));
				$('#provUl li:eq(' +  checkLi_index1+ ') .check').click();
				checkHtml = checkHtml.replace("文字", checkDataEle.prev().html().replace("：" ,'')).replace('位置', 'area' + checkDataEle.attr('data_index')).replace('areap', '').replace('provp', '');
			}else if(checkDataEle.hasClass('prov')){
				checkDataEle.find('.citys .check').click();
				hideCitys();
				var checkLi2 = checkDataEle.parent();
				var checkLi_index2 = $.inArray(checkLi2[0], $('#provUl li'));
				var checkArea2 = $('#areaUl li:eq(' + checkLi_index2 + ') label:eq(1)' );
				if(checkArea2.find(".check").length > 0){
					return false;
				}
				checkHtml = checkHtml.replace("文字", checkDataEle.find('span:eq(0)').html().replace("：" ,''))
				.replace('位置', 'prov' + checkDataEle.attr('data_index'))
				.replace('areap', 'area_index="' + checkArea2.attr('data_index') +'"')
				.replace('provp', '');
			}else if(checkDataEle.hasClass('city')){				
				var citysDiv = checkDataEle.parent(),
					checkPrvo3 = checkDataEle.parent().parent();
				if(citysDiv.find('i.check').length + 1 === citysDiv.find('i').length){
					checkPrvo3.find('i:eq(0)').click();
					return false;
				}
				var	checkPrvo3 = checkDataEle.parent().parent(),
					checkLi3 = checkDataEle.parent().parent().parent();
				var checkLi_index3 = $.inArray(checkLi3[0], $('#provUl li'));
				var checkArea3 = $('#areaUl li:eq(' + checkLi_index3 + ') label:eq(1)' );
				if(checkArea3.find(".check").length > 0){
					return false;
				}
				var checkPrvo_Span3 = checkPrvo3.find('>span');			
				if(!checkPrvo_Span3.hasClass('checkText')){
					checkPrvo_Span3.addClass('checkText');
					checkPrvo_Span3.prev(">i").attr('class','tint_check');
					//check_elem.push(i);
				}
				checkHtml = checkHtml.replace("文字", checkDataEle.find('span:eq(0)').html().replace("：" ,''))
				.replace('位置', 'city' + checkDataEle.attr('data_index'))
				.replace('areap', 'area_index="' + checkArea3.attr('data_index') +'"')
				.replace('provp', 'prov_index="' + checkPrvo3.attr('data_index') +'"');
			}
			$('#cityCheck_modal .modal-header').append(checkHtml);
			checkDataEle.find('>span').addClass('checkText');
			i.attr('class','check');
			check_elem.push(i);
		}	
	};	
	initCityModal = function(){ 
		var i = 0,
			size = citydata.length,
			hasArea = [],
			hasProv = [],
			provPosition = [],
			$provUl = $('#provUl'),
			$areaUl = $('#areaUl');
		for (i ; i < size ; i++) {
			var data = citydata[i];
			var hasAreaCount = $.inArray(data[0], hasArea);
			if(hasAreaCount < 0){
				hasArea.push(data[0]);
				var li = $('<li><label>' + data[1] + '：</label><label class="checkbox_original area" data_index = "' + i + '"><input type="checkbox"><i class="original"></i><span>全部</span></label></li>');
				li.data = [data[0], data[1]];
				$areaUl.append(li);
				$provUl.append('<li></li>');
			}
			hasAreaCount = $.inArray(data[0], hasArea);
			var areaLi = $provUl.find('li:eq(' + (hasAreaCount) + ')');
			var hasProvCount = $.inArray(data[2], hasProv);
			if(hasProvCount < 0){
				hasProv.push(data[2]);
				provPosition.push(hasAreaCount + '_' + areaLi.find('.prov').length);
				var proCheck = $('<label class="checkbox_original prov" data_index="' + i + '">'
			          + '<input type="checkbox">'
			          + '<i class="original"></i>'
			          + '<span>' + data[3] + '</span><division></division><div class="citys"></div></label>');
				areaLi.append(proCheck);		
			}		
			hasProvCount = $.inArray(data[2], hasProv);
			var cityCheck = $('<label class="checkbox_original city" data_index="' + i + '">'
		          + '<input type="checkbox">'
		          + '<i class="original"></i>'
		          + '<span>' + data[5] + '</span></label>');
			areaLi.find('.prov:eq(' + provPosition[hasProvCount].toString().split('_')[1] + ') .citys').append(cityCheck);				
		}
	};
	checkSpanClick = function(){
		var $this = $(this);
		var ul = $('#provUl'),
			li = $this.parent().parent(),
			checkbox_city = $this.parent();
		var checkLi_index = $.inArray(li[0], ul.find('li'));
		var checkArea = $('#areaUl li:eq(' + checkLi_index + ') label:eq(1)' );
		if(checkArea.find(".check").length > 0){
			return false;
		}
		if($this.prev().hasClass('check')){
			$this.prev().click();
		}
		var checkbox_citys = li.find('.prov');
		var cityDiv = $this.next();
			allWidth = 0;	
		var sorllLeft = ul.scrollLeft();
		var left = checkbox_citys[0].offsetLeft - checkbox_city[0].offsetLeft + ul.scrollLeft();
		if(left === 0){
			left = -1;
		}else{
			left= left - 1;
		}	
		if(left > 0){
			ul.scrollLeft(sorllLeft - left - 1);
			$this.click();
			return false;
		}
		var checkbox_city_width = Number(checkbox_city.css('width').replace('px', '')),
			ul_width = Number(ul.css('width').replace('px', ''));		
		if(checkbox_city_width > (left + ul_width + 1)){
			ul.scrollLeft(sorllLeft + checkbox_city_width - (left + ul_width) + 41);
			$this.click();
			return false;
		}		
		hideCitys();
		$this.parent().addClass('thisShowCity');
		$this.next();
		$this.next().show();
		$this.next().next().css('left', left);
		$this.next().next().addClass('showCitys');
		canHideCitys = false;
	};
	hideCitys = function(){
		$('.showCitys').removeClass('showCitys');
		$('#cityCheck_modal division').hide();
		$('#cityCheck_modal .prov').removeClass('thisShowCity');	
	};
	citysMouseover = function(){
		var $this = $(this);
		if($this.hasClass('prov') && !$this.hasClass('thisShowCity')){
			return false;
		}
		canHideCitys = false;
	};
	citysMouseout = function(){
		var $this = $(this);
		if($this.hasClass('prov') && !$this.hasClass('thisShowCity')){
			return false;
		}
		canHideCitys = true;
	};
	modalBodyClick = function(){
		if(canHideCitys){
			hideCitys();
		}
	};
	clickToPrimaryCity = function(){
		var city = $('#cityCheck_modal .modal-header .checkData');
		var i = 0,
			size = city.length,
			data_index,
			show_text = [];
			area_data = [];
			prov_data = [];
			city_data = [];
			area_text = [];
			prov_text = [];
			city_text = [];
		for (; i < size; i++) {
			data_index = $(city[i]).attr('data_index');
			if(data_index.indexOf('area') > -1){
				var data_no_area = Number(data_index.replace('area', ''));
				area_data.push(citydata[data_no_area][0]);
				show_text.push(citydata[data_no_area][1]);
				area_text.push(citydata[data_no_area][1]);
			}else if(data_index.indexOf('prov')> -1){
				var data_no_prov = Number(data_index.replace('prov', ''));
				prov_data.push(citydata[data_no_prov][2]);
				show_text.push(citydata[data_no_prov][3]);
				prov_text.push(citydata[data_no_prov][3]);
			}else if(data_index.indexOf('city')> -1){
				var data_no_city = Number(data_index.replace('city', ''));
				city_data.push(citydata[data_no_city][4]);
				show_text.push(citydata[data_no_city][5]);
				city_text.push(citydata[data_no_city][5]);
			}
		}
		i = 0,
		size = check_elem.length,
		checked_elem = [];
		for (; i < size ; i++) {
			checked_elem.push(check_elem[i]);
		}
		$(cityelem).val(show_text.join(','));
		$('#cityCheck_modal').hide();
	};
	clickToCancel = function(){
		var i = 0,
			size = checked_elem.length,
			elem;
		for (; i < size; i++) {
			elem = checked_elem[i];
			if(elem.hasClass('original')){
				elem.click();	
			}
		}
		$('#cityCheck_modal').hide();
	};
	clickToUnCheck = function(){
		$checkDataElm = $(this).parent();
		var data_index = $checkDataElm.attr('data_index');
		var data_index_num = data_index.replace('area', '').replace('prov', '').replace('city', '');
		if(data_index.indexOf('area') > -1){
			$('#areaUl .area[data_index="' + data_index_num + '"]>i').click();
		}else if(data_index.indexOf('prov') > -1){
			$('#provUl .prov[data_index="' + data_index_num + '"]>i').click();
		}else if(data_index.indexOf('city') > -1){
			var prov_index_num = $checkDataElm.attr('prov_index');
			$('#provUl .prov[data_index="' + prov_index_num + '"] .city[data_index="' + data_index_num + '"]>i').click();
		}
		$checkDataElm.remove();
	};
	clickToShowModal = function(){
		var $cityelem = $(cityelem);
		var left = $cityelem[0].offsetLeft,
			top = $cityelem.parent().parent()[0].offsetTop + Number($cityelem.css('height').replace('px', '')),
			modal = $('#cityCheck_modal');
		modal.css('left', left);
		modal.css('top', top);
		hideCitys();
   		$('#cityCheck_modal').show();
    };
	initMethod = function(){
		$(cityelem).val('');
		$('#cityCheck_modal').remove();
		$('body').append(modalHtml);
		initCityModal();
		if(inited){
			return false;
		}
		inited = true;
		$(document).delegate('.checkbox_original i,.area span,.city span','click', checkIClick)
				   .delegate('.prov>span','mouseover', checkSpanClick)
				   .delegate('.citys,.prov','mouseover', citysMouseover)
				   .delegate('.citys,.prov','mouseout', citysMouseout)
				   .delegate('#cityCheck_modal','click', modalBodyClick)
				   .delegate('#cityCheck_modal .save','click', clickToPrimaryCity)
				   .delegate('#cityCheck_modal .cancel','click', clickToCancel)
				   .delegate('#cityCheck_modal .modal-header .checkData i','click', clickToUnCheck)
				   .delegate(cityelem,'click', clickToShowModal);
		
	};
	initCity = function(elem, data){
		initFuncData();
		citydata = data;
		cityelem = elem;		
		initMethod();
	};
	getArea_data = function(){
		var data = '';
		if(area_data){
			data = area_data.join(',');
		}
		return data;
	};
	getProv_data = function(){
		var data = '';
		if(area_data){
			data = prov_data.join(',');
		}
		return data;
	};
	getCity_data = function(){
		var data = '';
		if(area_data){
			data = city_data.join(',');
		}
		return data;
	};
	getArea_text = function(){
		var text = '';
		if(area_text){
			text = area_text.join(',');
		}
		return text;
	};
	getProv_text = function(){
		var text = '';
		if(prov_text){
			text = prov_text.join(',');
		}
		return text;
	};
	getCity_text = function(){
		var text = '';
		if(area_text){
			text = city_text.join(',');
		}
		return text;
	};
}();