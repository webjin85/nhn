var variable = {
	ie8: navigator.appVersion.indexOf("MSIE 8") > 0
}

$(window).load(function() {
	//ie버전 체크해서 클래스 넘겨줌
	if(variable.ie8) {
		$('html').addClass('ie8');
		$('.flag').eq(0).append('<img src="images/usd.png" alt="" />');
		$('.flag').eq(1).append('<img src="images/krw.png" alt="" />');
	}
	
	//처음 페이지 들어왔을 때 계산할 국가를 미국으로 변경
	$('#ecg_ifmt option').eq(1).attr('selected', 'selectd');
});


/* 
 * 이벤트 그룹 
 */

// 환율 숫자 입력하는 key 이벤트
$('input').on('keydown keyup', function(e) {
	if(e.type === 'keydown') {
		if(digit_check(e) === false) {
			return false;
		}
	} else if(e.type == 'keyup') {
		digit_change(e);
	};
})

//환율 국가선택 이벤트
$('select').on('change', function(e) {
	select_country(e);
	
	var num = $('#num').val().uncomma()
	 $('#num2').val(exchange(num));
});


/* 
 * 프로토타입 그룹 
 */

//문자열 타입에서 콤마를 찍을 수 있도록 프로토타입에 추가
String.prototype.comma = function(){
    if(this == 0) return 0;
    
    var reg = /(^[+-]?\d+)(\d{3})/,
    	n = this;
    
    while (reg.test(n)) {
    	n = n.replace(reg, '$1' + ',' + '$2');
    }
    return n;
};

//문자열 타입에서 콤마를 지울 수 있도록 프로토타입에 추가
String.prototype.uncomma = function(){
    if(this == 0) return 0;
 
    var n = this.replace(/,/g,'');
    return n;
};


/* 
 * 함수 그룹 
 */

/*
 * 숫자입력 체크 함수
 * @param e : event값 받아옴
 * 숫자, back space, '.'가 아니면 false를 반환한다.
 */
function digit_check(e){
	//code : 키 코드값을 체크합니다.
	var code = e.which?e.which:event.keyCode;
	
	//숫자, back space, '.'가 아닌 다른 값이 오면 return false 합니다.
	 if(code < 8 || code > 8 && code < 48 || code > 57 && code < 190 || code > 190 ) {
	 	return false;
	 };
};

/*
 * 환율값에 콤마추가 및 숫자 정렬
 * @param e : event값 받아옴
 * 값을 재설정 하고 ','표기된 숫자갑을 반환한다.
 */
function digit_change(e) {
	/*
	 * target          : 현재 포커싱된 input id를 체크합니다.
	 * current_val     : 현재 들어가 있는 금액을 확인합니다. 
	 * current_length  : 현재 들어가 있는 금액의 length를 확인합니다.
	 * change_number   : 숫자앞에 0이 들어갈 경우 0을 뺀 값을 받습니다.
	 * uncomma         : 콤마를 제거합니다.
	 * comma           : 콤마를 추가합니다.
	 */
	
	var target = e.currentTarget.id,
		current_val = e.currentTarget.value,
		current_length = current_val.length,
		change_number = 0,
		uncomma = current_val.uncomma(),
		comma = String(uncomma).comma();
	
	if(current_length > 1) {
		/*
		 * input창 안에 값이 하나라도 있고,
		 * 0이 숫자 앞에 있을 경우 0을 삭제합니다. 예) 03
		 * 만약 0뒤에 '.'가 오는경우는 소수점으로 보고 0을 삭제하지 않습니다. 예) 0.3 
		 */
		if(Number(current_val[0]) === 0 && current_val[1] !== '.' ) {
		 	change_number = current_val.substr(1, current_length);
		 	comma = change_number;
		}
	} else if(current_length === 0) {
		//input창에 값이 하나도 없으면 0를 보여줍니다.
		e.currentTarget.value = 0;
	}
	
	$('#'+target).parents('.excr_box').siblings('.excr_box').find('input').val(exchange(uncomma));
	e.currentTarget.value = comma;
};

/*
 * 환율값을 한글로 단위표시
 * @param e : event값 받아옴
 * 국가별 단위를 한글로 반환한다. - 아직 작성 못 함.
 */
function unit(e) {
	var uncomma = current_val.uncomma(),
		comma = uncomma.comma();
};

/*
 * 환율 국가선택
 * @param e : event값 받아옴
 * 국가별 단위와 국기를 표기한다.
 */
function select_country(e) {
	/*
     * unit             : 국가 영문단위를 확인합니다.
     * rate             : 환율을 체크합니다.
     * target_id        : 셀렉트 ID를 체크합니다.
     * unit_eng         : .uni_eng 엘리먼트를 가져옴니다.
     * flag             : .flag 엘리먼트를 가져옴니다.
     * flag_class       : .flag 클래스를 확인합니다.
     * flag_class_unit  : .flag가 가지고 있는 국가 단위 클래스를 체크합니다. (flag_class_unit[1])
     * unit_eng_lower   : .flag에 클래스를 줄 수 있도록 국가 영문단위를 소문자로 변환합니다.
     */
	
    var unit = $('#'+e.currentTarget.id).find('option').eq(e.currentTarget.selectedIndex).attr('data-unit'),
    	rate = e.target.value,
    	target_id = e.target.id,
    	unit_eng = $('#'+target_id).siblings('.unit_eng'),
    	flag = $('#'+target_id).siblings('.flag'),
    	flag_class = flag.attr('class'),
    	flag_class_unit = flag_class.split(' '),
    	unit_eng_lower = unit.toLowerCase();
    
    unit_eng.html(unit);
    flag.removeClass(flag_class_unit[1]).addClass(unit_eng_lower);
    
    if(variable.ie8) {
    	$('#'+e.currentTarget.id).siblings('.flag').find('img').attr('src','images/'+unit_eng_lower+'.png');
    }
}

/*
 * 변환된 환율 표기
 * @param value : 변환할 금액을 받아온다
 * 변환할 환율 금액을 넣으면 해당 국가에 맞춰 변환되어 반환한다.
 */
function exchange(value) {
	var ifmt = $('#ecg_ifmt').find('option:selected').val(),
		ifmt2 = $('#ecg_ifmt2').find('option:selected').val(),
		unit = $('#ecg_ifmt2').find('option:selected').attr('data-unit'),
		number = value * Number(ifmt.uncomma()) / Number(ifmt2.uncomma()),
		fixed = number.toFixed(2);
	
	return fixed.comma();
};