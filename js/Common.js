//插入版本號
var nowVer = 'Ver.1.0.0.0';


// var API_TIMEOUT = 30000;
var API_TIMEOUT = 1000000;
// var API_TIMEOUT = 2000;
var TOAST_TIMER = 5000;//當API timeout，toast 要持續多久
var SWAL_TIMER = 5000;//當API 401，sweetalert 要持續多久

var time_line_refresh_need = 30;

document.addEventListener("DOMContentLoaded", function() { 
    var show_ver = nowVer.split('.');
    show_ver.pop();

	var span_box = document.createElement("SPAN");
	span_box.title =nowVer;
	span_box.innerHTML = show_ver.join('.');
	span_box.style.position ='fixed';
	span_box.style.zIndex ='99';
	span_box.style.right ='5px';
	span_box.style.bottom ='5px';
	span_box.style.fontSize  ='12px';
	span_box.style.color ='#000000';
	document.body.appendChild(span_box);
	// document.getElementById("app").appendChild(span_box);
});









// var login_page = 'login.html';
// var home_page = 'index.html';
// var getSearch = location.href.split("?");
// var current_page = getSearch[0].split('/').pop();

// if(window.sessionStorage.getItem('Session_acc_id') == null){
// 	window.sessionStorage.clear();
// 	window.localStorage.clear();

// 	if(login_page == current_page){

// 	}else{
// 		window.location.href = login_page;
// 	}
// }else{
// 	if(login_page == current_page){
// 		// window.location.href = home_page;
// 	}else{

// 	}

// }

function logout() {
	console.log("Let's logout.");
	window.sessionStorage.clear();
	window.localStorage.clear();
	window.location.href = login_page;
}

function validation_libray(check_ary, val) {

    var value = val;

    var reObj = {
        bStatus: true,
        msg: ""
    };
    for (var idx in check_ary) {
        
        var obj = check_ary[idx];
 

        var type = obj.type;//長度 英文 中文 數字 電話 手機 pattern  limit(數字大小)
        var condition = obj.condition;

        switch (type) {
            case "is_num":
                if (isNaN(value)) {
                    reObj.bStatus = false;
                    reObj.msg = value + "不是數字!";
                }
                break;
            case "date":
                var start_date = condition.start_date || "";
                var end_date = condition.end_date || "";
                if (start_date != "") {

                    if (moment(start_date).format("YYYY-MM-DD HH:mm") == "Invalid date") {
                        reObj.bStatus = false;
                        if (end_date != "") {
                            reObj.msg = "起始時間格式錯誤";
                        } else {
                            reObj.msg = "時間格式錯誤";
                        }

                    }

                }


                if (end_date != "" && reObj.bStatus) {
                    if (moment(end_date).format("YYYY-MM-DD HH:mm") == "Invalid date") {
                        reObj.bStatus = false;
                        reObj.msg = "結束時間格式錯誤";
                    }
                }


                if (start_date != "" && end_date != "" && reObj.bStatus) {

                    if (moment(end_date).format("YYYY-MM-DD HH:mm") < moment(start_date).format("YYYY-MM-DD HH:mm")) {
                        reObj.bStatus = false;
                        reObj.msg = "時間範圍不正確";
                    }
                }

                break;
            case "birthday":
                if (moment(value).format("YYYY-MM-DD") == "Invalid date") {
                    reObj.bStatus = false;
                    reObj.msg = "時間格式錯誤";
                } else if (moment(value).format("YYYY-MM-DD") > moment().format("YYYY-MM-DD")) {
                    reObj.bStatus = false;
                    reObj.msg = "無法選取未來時間";
                } 
                break;
            case "length"://長度
                var min = (condition.min == undefined) ? "noset" : condition.min;
                var max = (condition.max == undefined) ? "noset" : condition.max;
                if (value.length < min && min != "noset") {
                    if (min == 1) {
                        reObj.msg = "不得為空";
                    } else {
                        reObj.msg = "至少輸入 : " + min + "碼";
                    }
                    reObj.bStatus = false;
                } else if (value.length > max && max != "noset") {
                    reObj.msg = "最多輸入 : " + max + "碼";
                    reObj.bStatus = false;
                } 
                break;
            case "limit":
                var min = (condition.min == undefined) ? "noset" : parseInt(condition.min, 10);
                var max = (condition.max == undefined) ? "noset" : parseInt(condition.max, 10);
                // value = parseInt(value, 10);

                if (isNaN(value)) {
                    reObj.bStatus = false;
                    reObj.msg = "最小值為0 或 格式錯誤!";
                } else if (value < min) {
                    reObj.msg = "最小值為" + min;
                    reObj.bStatus = false;
                } else if (value > max) {
                    reObj.msg = "最大值為" + max;
                    reObj.bStatus = false;
                }
                break;
            case "date_max_min":
                var min = (condition.min == undefined) ? "1900-01-01" : condition.min;
                var max = (condition.max == undefined) ? "2999-12-31" : condition.max;

                if (value < min  ) {
                    reObj.msg = "最小值為" + min;
                    // reObj.msg = "時間範圍錯誤";
                    reObj.bStatus = false;
                }
                if (value > max) {
                    reObj.msg = "最大值為" + max;
                    // reObj.msg = "時間範圍錯誤";
                    reObj.bStatus = false;
                }
                break;
            case "no_chinese"://沒有中文
                if (value.match(/[\u4E00-\u9FFF\u3400-\u4DFF\uF900-\uFAFF]+/g)) {
                    reObj.bStatus = false;
                    reObj.msg = "內容含有中文";
                }
                break;
            case "only_eng_num"://只有英數
                if (value != "") {
                    only_eng_num = /^[a-zA-Z0-9_@.\-]*$/;
                    if (!(only_eng_num.test(value))) {
                        reObj.bStatus = false;
                        reObj.msg = "不能含有特殊符號或中文";
                    }

                }
                break;
            case "mobile":
                if (value != "") {
                    cn = /^1[3,4,5,7,8][0-9]-?\d{4}-?\d{4}$/;
                    tw = /^09\d{2}-?\d{6}$/;
                    jp = /^0[7,8,9]0-?\d{4}-?\d{4}$/;
                    us = /^(1\s?)?((\([0-9]{3}\))|[0-9]{3})[\s\-]?[\0-9]{3}[\s\-]?[0-9]{4}$/;
                    if (!(cn.test(value) || tw.test(value) || jp.test(value) || us.test(value))) {
                        reObj.bStatus = false;
                        reObj.msg = "手機格式錯誤";
                    }
                }

                break;
            case "phone":
                if (value != "") {
                    cn = /^0\d{1,3}-?\d{7,8}(#\d{2,4})?$/;
                    tw1 = /^(0\d{1,3}-?)?\d{6,8}(#\d{2,4}){0,1}$/;
                    tw2 = /^(\d{4}-?)?\d{4}(#\d{2,4}){0,1}$/;
                    jp = /^(?:\d{10}|\d{3}-\d{3}-\d{4}|\d{2}-\d{4}-\d{4}|\d{3}-\d{4}-\d{4})$/;
                    us = /^1-?\d{3}-?\d{7}$/;
                    if (!(cn.test(value) || tw1.test(value) || tw2.test(value) || jp.test(value) || us.test(value))) {
                        reObj.bStatus = false;
                        reObj.msg = "電話格式錯誤";
                    }
                }

                break;
            case "phone_mobile":
                cn_m = /^1[3,4,5,7,8][0-9]-?\d{4}-?\d{4}$/;
                tw_m = /^09\d{2}-?\d{6}$/;
                jp_m = /^0[7,8,9]0-?\d{4}-?\d{4}$/;
                us_m = /^(1\s?)?((\([0-9]{3}\))|[0-9]{3})[\s\-]?[\0-9]{3}[\s\-]?[0-9]{4}$/;

                cn = /^0\d{1,3}-?\d{7,8}(#\d{2,4})?$/;
                tw1 = /^(0\d{1,3}-?)?\d{6,8}(#\d{2,4}){0,1}$/;
                tw2 = /^(\d{4}-?)?\d{4}(#\d{2,4}){0,1}$/;
                jp = /^(?:\d{10}|\d{3}-\d{3}-\d{4}|\d{2}-\d{4}-\d{4}|\d{3}-\d{4}-\d{4})$/;
                us = /^1-?\d{3}-?\d{7}$/;
                if (value != "") {
                    if (!(cn.test(value) || tw1.test(value) || tw2.test(value) || jp.test(value) || us.test(value) || cn_m.test(value) || tw_m.test(value) || jp_m.test(value) || us_m.test(value))) {
                        reObj.bStatus = false;
                        reObj.msg = "電話格式錯誤";
                    }
                }
                break;
            case "email":
                if (value != "") {
                    var email = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i; // eslint-disable-line no-control-regex
                    if (!email.test(value)) {
                        reObj.bStatus = false;
                        reObj.msg = "電子信箱格式錯誤";
                    }
                }
                break;
            case "isTW_ID":
                var city = new Array(
                    1, 10, 19, 28, 37, 46, 55, 64, 39, 73, 82, 2, 11,
                    20, 48, 29, 38, 47, 56, 65, 74, 83, 21, 3, 12, 30
                )
                id = value.toUpperCase();
                // 使用「正規表達式」檢驗格式
                if (id.search(/^[A-Z](1|2)\d{8}$/i) == -1) {
                    reObj.bStatus = false;
                    reObj.msg = "身分證格式錯誤";
                } else {
                    //將字串分割為陣列(IE必需這麼做才不會出錯)
                    id = id.split('');
                    //計算總分
                    var total = city[id[0].charCodeAt(0) - 65];
                    for (var i = 1; i <= 8; i++) {
                        total += id[i] * (9 - i);
                    }
                    //補上檢查碼(最後一碼)
                    total += parseInt(id[9]);
                    //檢查比對碼(餘數應為0);

                    if (!((total % 10 == 0))) {
                        reObj.bStatus = false;
                        reObj.msg = "身分證格式錯誤";
                    }
                }
                break;
            case "decimal_point":
                //小數點判斷
                if (value != "") {
                    var str = "^\\d{1," + condition.int + "}(\\.[0-9]{1," + condition.point + "})?$";
                    var re = new RegExp(str);
                    if (!re.test(value)) {
                        reObj.bStatus = false;
                        reObj.msg = "格式錯誤";
                    }
                }
                break;
        }

    }


    return reObj;
}


function validation_state_change(ele, bStatus, msg) {
    if (!bStatus) {
        if (!ele.classList.contains("error_show")) {
            ele.classList.add("error_show");
            // ele.focus();
            ele.parentNode.classList.add("error_show");
        }
        if (!ele.parentNode.classList.contains("error_show")) {
            ele.parentNode.classList.add("error_show");
        }
        ele.parentNode.setAttribute("data-error", msg);
        // ele.parentNode.textContent = msg;
    } else {

        if (ele.classList.contains("error_show")) {
            ele.classList.remove("error_show");
        }
        if (ele.parentNode.classList.contains("error_show")) {
            ele.parentNode.classList.remove("error_show");
        }

    }



}




function bind_validation() {
    setTimeout(function () {
        var jag_validation = document.getElementsByClassName('jag_validation');
        for (var index = 0; index < jag_validation.length; index++) {
     
            var ele = jag_validation[index];
            ele.addEventListener('keyup', jag_change_input);
            ele.addEventListener('change', jag_change_input);
        }
    }, 500)
}
function check_emeny_jag(id_name) {
    var alert_str = "";
    if(id_name) {
        var is_varify_id = document.getElementById(id_name);
        var jag_validation = is_varify_id.getElementsByClassName('jag_validation');
    }else {
        var jag_validation = document.getElementsByClassName('jag_validation');
    }
    for (var index = 0; index < jag_validation.length; index++) {
        var ele = jag_validation[index];
        var validation_return = jag_change_input(ele);
        (!validation_return.bStatus) && (alert_str = "fail");
    }
    return alert_str;
}

function init_obj (){
	return {
		type: "",//
		condition: {},
	}
}
function jag_change_input(e) {

    // e.preventDefault();
    var ele = e.target || e;
    var check_obj = {
    }

    var check_ary =[];
    var validation = ele.getAttribute('jag-validation').split(" ");

    for (const idx in validation) {
        const element = validation[idx];

        var check_obj = init_obj();
        switch (element) {
            case "required":
                check_obj.type = "length";
                check_obj.condition = {
                    min: 1,
                };
                check_ary.push(check_obj);
                break;
            case "limit":
                check_obj.type = "limit";
                check_obj.condition = {
                    min: 0,
                    max: 999999
                };
                check_ary.push(check_obj);
                break;
            case "only_eng_num":
    
                check_obj.type = "only_eng_num";
                check_ary.push(check_obj);
    
                break;
    
            case "max_min":
                check_obj.type = "limit";
                check_obj.condition = {
                    min: ele.getAttribute('data-min'),
                    max: ele.getAttribute('data-max')
                };
                check_ary.push(check_obj);
    
                break;
            case "date_max_min":
                check_obj.type = "date_max_min";
                check_obj.condition = {
                    min: ele.getAttribute('data-min'),
                    max: ele.getAttribute('data-max')
                };
                check_ary.push(check_obj);
    
                break;
    
            case "decimal_point":
    
                check_obj.type = "decimal_point";
                check_obj.required = true;
                check_obj.condition = {
                    int: 5,
                    point: 1,
                };
                check_ary.push(check_obj);
    
                break;
        }

    }

    var validation_return = validation_libray(check_ary, ele.value);



    validation_state_change(ele, validation_return.bStatus, validation_return.msg);

    return validation_return;
}



const Toast = Swal.mixin({
    toast: true,
    position: 'center',
    icon: 'success',

    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    onOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})



// var call_api = {
//     send: function(obj) {
//         console.log(obj)
//         var api = obj.api;
//         var parameter = obj.parameter;
//         return  this.$http.post(API_URL + api,  {inputStr: JSON.stringify([parameter])},{
//             headers:{
//                 Authorization: 'auth',
//             }
//         }).then((response) => {
//             return new Promise(function(resolve, reject) {
//                 var res_data = response.data;
//                 resolve(res_data);
//             })
//             // console.log(response)
      
//         }).catch(function(error) {
//            return Promise.reject(error);
//       });
//     }
// }

function api_error(event){
    console.log(event);

	if(event.status == "401"){
		Swal.fire({
            icon: "error",
            title: event.statusText,
            text: "TOKEN Error " + event.status,
			// timer: 5000,
		})

		return
    }

	Swal.fire({
        icon: "error",
        title: "環境異常" + event.statusText,
        text: "異常代碼：" + event.status,

    })
    console.log(event.request.responseUR.split('/').pop());
}
function api_not_00(event){
    console.log(event.request.responseURL);
    console.log(event.data.Result);
    console.log(event.data.Message);
    if(event.data.Result=='31'){
        Swal.fire({
            icon: "error",
            title: event.data.Message,
            text: "錯誤代碼：" +event.data.Result ,
            
        })
        return false;
    }
	Swal.fire({
        icon: "error",
        title: "作業錯誤",
        text: "錯誤代碼：" +event.data.Result ,
        
    })
    
   
}





function scroll_to_end(element, to, duration) {
    element = document.getElementById(element);
    to = element.scrollHeight;
    var start = element.scrollTop,
        change = to - start,
        currentTime = 0,
        increment = 20;
        
    var animateScroll = function(){        
        currentTime += increment;
        var val = Math.easeInOutQuad(currentTime, start, change, duration);
        element.scrollTop = val;
        if(currentTime < duration) {
            setTimeout(animateScroll, increment);
        }
    };
    animateScroll();
}

Math.easeInOutQuad = function (t, b, c, d) {
  t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};






function in_hilight(text, filter){
    return text.split(filter).join("<span class='highlight'>" + filter +"</span>");

}


function check_modify_rule(array, item) {
    var return_txt = false;
    array.forEach(function (element) {
        if (element == item) {
            return_txt =  true;
        }
    })
    return return_txt;
}



function print(tableID){
    var value = document.getElementById(tableID).outerHTML;

    var printPage = window.open("", "Printing...", "");
    printPage.document.open();
    printPage.document.write("<HTML><head></head><BODY onload='window.print();window.close()'>");
    // printPage.document.write("<HTML><head></head><BODY onload='window.print();'>");
    // printPage.document.write('<link href="css/main.css" rel="stylesheet">');
    // printPage.document.write('<link href="css/habits.css" rel="stylesheet">');
    // printPage.document.write("<PRE>");
    printPage.document.write(value);
    // printPage.document.write("</PRE>");
    printPage.document.close("</BODY></HTML>");
}


function currentDateTime(){
    var today=new Date();
    var currentDateTime =
    
        today.getFullYear()+'-'+
        // (today.getMonth()+1)+''+
        ((today.getMonth()+1) <10 ?  ('0' + (today.getMonth()+1)) : (today.getMonth()+1))+'-'+
        // today.getDate()+''+
        (today.getDate() <10 ?  ('0' + today.getDate()) : today.getDate())+' '+
        // today.getHours()+':'+
        (today.getHours() <10 ?  ('0' + today.getHours()) : today.getHours())+':'+
        // today.getMinutes()+'';
        (today.getMinutes() <10 ?  ('0' + today.getMinutes()) : today.getMinutes())+':'+
        (today.getSeconds() <10 ?  ('0' + today.getSeconds()) : today.getSeconds())+'';

    return currentDateTime;
}

function export_excel(html , filename){
    var today=new Date();
    var currentDateTime =
    
        today.getFullYear()+''+
        // (today.getMonth()+1)+''+
        ((today.getMonth()+1) <10 ?  ('0' + (today.getMonth()+1)) : (today.getMonth()+1))+''+
        // today.getDate()+''+
        (today.getDate() <10 ?  ('0' + today.getDate()) : today.getDate())+''+
        // today.getHours()+':'+
        (today.getHours() <10 ?  ('0' + today.getHours()) : today.getHours())+''+
        // today.getMinutes()+'';
        (today.getMinutes() <10 ?  ('0' + today.getMinutes()) : today.getMinutes())+''+
        (today.getSeconds() <10 ?  ('0' + today.getSeconds()) : today.getSeconds())+'';
    filename += "_"+currentDateTime;

     

    // window.open('data:application/vnd.ms-excel,' + encodeURIComponent(html), "vsdv");

    // return false;


    var dataType = 'data:application/vnd.ms-excel';
    
    // var tableSelect = document.getElementById("main_table");
    // var tableHTML = html.replace(/ /g, '%20');



    var tableHTML = '<html ><head><meta http-equiv=Content-Type content="text/html; charset=utf-8">'+
    '<style type="text/css"> td.typ_txt{mso-number-format:"\@";} </style>'+
    '</head><body>';
    tableHTML += html;
    tableHTML += '</body></html>';
    // Specify file name
    filename = filename?filename+'.xls':'excel_data.xls';
    // Create download link element
   
    
    // document.body.appendChild(downloadLink);
    
    if(navigator.msSaveOrOpenBlob){
        var blob = new Blob(['\ufeff', tableHTML], {
            type: dataType
        });
        navigator.msSaveOrOpenBlob( blob, filename);
    }else{
        var downloadLink = document.createElement("a");
        downloadLink.href = dataType + ',' + encodeURIComponent(tableHTML);
        downloadLink.download = filename;
        //triggering the function
        downloadLink.click();
    }
}


function return_add_days(old_dat, days) {
    var dat = new Date(old_dat); // (1)
    dat.setDate(dat.getDate() + days);  // (2)


    var today_day = {
        'tdyy':  new Date(dat).getFullYear(),
        'tdmm': (new Date(dat).getMonth()+1),
        'tddd': new Date(dat).getDate(),
    };
    // 十位數加上0
    today_day.tdmm = today_day.tdmm < 10 ? ('0' + today_day.tdmm) : today_day.tdmm;
    today_day.tddd = today_day.tddd < 10 ? ('0' + today_day.tddd) : today_day.tddd;

    // return new Date(dat).getFullYear() + "-" + (new Date(dat).getMonth()+1) + "-" + new Date(dat).getDate();
     return today_day.tdyy + '-' + today_day.tdmm + '-' + today_day.tddd;

}

function return_add_worker_days(old_dat, days) {
    // var dat = new Date(old_dat); // (1)
    // switch (new Date(old_dat).getDay()) {
    //     case 0:
    //     days = 3;
    //         break;
    //     case 1:
    //     case 2:
    //     case 3:
    //     days = 2;
    //         break;
    //     case 4:
    //     case 5:
    //     case 6:
    //     days = 4;
    //         break;
    // }
    // dat.setDate(dat.getDate() + days);  // (2)


    // var today_day = {
    //     'tdyy':  new Date(dat).getFullYear(),
    //     'tdmm': (new Date(dat).getMonth()+1),
    //     'tddd': new Date(dat).getDate(),
    // };
    // // 十位數加上0
    // today_day.tdmm = today_day.tdmm < 10 ? ('0' + today_day.tdmm) : today_day.tdmm;
    // today_day.tddd = today_day.tddd < 10 ? ('0' + today_day.tddd) : today_day.tddd;

    
    // return today_day.tdyy + '-' + today_day.tdmm + '-' + today_day.tddd;

    // var worker_days_list = [1,2,3,4,5];
    // var add_worker_day =days;
    // var start_day = 0; // worker_days_list --index
    

    // switch (new Date(old_dat).getDay()) {
    //     case 0:
    //     add_worker_day += 1;
    //         break;
    //     case 6:
    //     add_worker_day += 2;
    //         break;
    // };

    // if(worker_days_list.indexOf(new Date(old_dat).getDay()) == -1){
    //     start_day = 0;
    // }else{
    //     start_day = worker_days_list.indexOf(new Date(old_dat).getDay()) ;
    // }
    // console.log(add_worker_day);

    // var loop_week_count = 0;
    // var add_day_count = 0;

    // loop_week_count = parseInt((start_day+add_worker_day) / worker_days_list.length);
    // // add_day_count = (start_day+add_worker_day) % worker_days_list.length;
   
    // var add_day_count = loop_week_count*2 + add_worker_day;
    // console.log(loop_week_count, add_day_count);



    // var dat = new Date(old_dat); // (1)
    // dat.setDate(dat.getDate() + add_day_count);  // (2)


    // var today_day = {
    //     'tdyy':  new Date(dat).getFullYear(),
    //     'tdmm': (new Date(dat).getMonth()+1),
    //     'tddd': new Date(dat).getDate(),
    // };
    // // 十位數加上0
    // today_day.tdmm = today_day.tdmm < 10 ? ('0' + today_day.tdmm) : today_day.tdmm;
    // today_day.tddd = today_day.tddd < 10 ? ('0' + today_day.tddd) : today_day.tddd;
    // // console.log(today_day.tdyy + '-' + today_day.tdmm + '-' + today_day.tddd);
    
    // return today_day.tdyy + '-' + today_day.tdmm + '-' + today_day.tddd;

    var worker_days_list = [1,2,3,4,5];
    var date =  old_dat;
    var days = days;

    while (!worker_days_list.includes(new Date(date).getDay())) { //如果今天不是工作日，就補一天
        date = return_add_days(date, 1);
    }
    
    while (days > 0) {
        // console.log(days); //增加幾天
        date = return_add_days(date, 1); //先把今天加一天
        if(worker_days_list.includes(new Date(date).getDay())){ //如果結果是工作，迴圈就少一次
            days -= 1;
        }
    }

    return date;
}




function now_date(){
	var today = new Date();
	var today_day = {
		'tdyy': today.getFullYear(),
		'tdmm': today.getMonth() + 1,
		'tddd': today.getDate(),
	};
	// 十位數加上0
	today_day.tdmm = today_day.tdmm < 10 ? ('0' + today_day.tdmm) : today_day.tdmm;
	today_day.tddd = today_day.tddd < 10 ? ('0' + today_day.tddd) : today_day.tddd;
	
	return today_day.tdyy + '-' + today_day.tdmm + '-' + today_day.tddd;
}
function now_time(){
	let today = new Date();
	let today_day = {
        'hh': today.getHours(),
        'mm': today.getMinutes(),
        'ss': today.getSeconds(),
	};
	// 十位數加上0
    today_day.hh = today_day.hh < 10 ? ('0' + today_day.hh) : today_day.hh;
    today_day.mm = today_day.mm < 10 ? ('0' + today_day.mm) : today_day.mm;
    today_day.ss = today_day.ss < 10 ? ('0' + today_day.ss) : today_day.ss;
	
	return today_day.hh + ":" + today_day.mm + ":" + today_day.ss;
}








//好多密碼
var Xsias = "krjlejglsd";
var Ysias = "8080808080808080";
var CryptoJS = CryptoJS || function (u, p) {
	var d = {}, l = d.lib = {}, s = function () { }, t = l.Base = { extend: function (a) { s.prototype = this; var c = new s; a && c.mixIn(a); c.hasOwnProperty("init") || (c.init = function () { c.$super.init.apply(this, arguments) }); c.init.prototype = c; c.$super = this; return c }, create: function () { var a = this.extend(); a.init.apply(a, arguments); return a }, init: function () { }, mixIn: function (a) { for (var c in a) a.hasOwnProperty(c) && (this[c] = a[c]); a.hasOwnProperty("toString") && (this.toString = a.toString) }, clone: function () { return this.init.prototype.extend(this) } },
		r = l.WordArray = t.extend({
			init: function (a, c) { a = this.words = a || []; this.sigBytes = c != p ? c : 4 * a.length }, toString: function (a) { return (a || v).stringify(this) }, concat: function (a) { var c = this.words, e = a.words, j = this.sigBytes; a = a.sigBytes; this.clamp(); if (j % 4) for (var k = 0; k < a; k++)c[j + k >>> 2] |= (e[k >>> 2] >>> 24 - 8 * (k % 4) & 255) << 24 - 8 * ((j + k) % 4); else if (65535 < e.length) for (k = 0; k < a; k += 4)c[j + k >>> 2] = e[k >>> 2]; else c.push.apply(c, e); this.sigBytes += a; return this }, clamp: function () {
				var a = this.words, c = this.sigBytes; a[c >>> 2] &= 4294967295 <<
					32 - 8 * (c % 4); a.length = u.ceil(c / 4)
			}, clone: function () { var a = t.clone.call(this); a.words = this.words.slice(0); return a }, random: function (a) { for (var c = [], e = 0; e < a; e += 4)c.push(4294967296 * u.random() | 0); return new r.init(c, a) }
		}), w = d.enc = {}, v = w.Hex = {
			stringify: function (a) { var c = a.words; a = a.sigBytes; for (var e = [], j = 0; j < a; j++) { var k = c[j >>> 2] >>> 24 - 8 * (j % 4) & 255; e.push((k >>> 4).toString(16)); e.push((k & 15).toString(16)) } return e.join("") }, parse: function (a) {
				for (var c = a.length, e = [], j = 0; j < c; j += 2)e[j >>> 3] |= parseInt(a.substr(j,
					2), 16) << 24 - 4 * (j % 8); return new r.init(e, c / 2)
			}
		}, b = w.Latin1 = { stringify: function (a) { var c = a.words; a = a.sigBytes; for (var e = [], j = 0; j < a; j++)e.push(String.fromCharCode(c[j >>> 2] >>> 24 - 8 * (j % 4) & 255)); return e.join("") }, parse: function (a) { for (var c = a.length, e = [], j = 0; j < c; j++)e[j >>> 2] |= (a.charCodeAt(j) & 255) << 24 - 8 * (j % 4); return new r.init(e, c) } }, x = w.Utf8 = { stringify: function (a) { try { return decodeURIComponent(escape(b.stringify(a))) } catch (c) { throw Error("Malformed UTF-8 data"); } }, parse: function (a) { return b.parse(unescape(encodeURIComponent(a))) } },
		q = l.BufferedBlockAlgorithm = t.extend({
			reset: function () { this._data = new r.init; this._nDataBytes = 0 }, _append: function (a) { "string" == typeof a && (a = x.parse(a)); this._data.concat(a); this._nDataBytes += a.sigBytes }, _process: function (a) { var c = this._data, e = c.words, j = c.sigBytes, k = this.blockSize, b = j / (4 * k), b = a ? u.ceil(b) : u.max((b | 0) - this._minBufferSize, 0); a = b * k; j = u.min(4 * a, j); if (a) { for (var q = 0; q < a; q += k)this._doProcessBlock(e, q); q = e.splice(0, a); c.sigBytes -= j } return new r.init(q, j) }, clone: function () {
				var a = t.clone.call(this);
				a._data = this._data.clone(); return a
			}, _minBufferSize: 0
		}); l.Hasher = q.extend({
			cfg: t.extend(), init: function (a) { this.cfg = this.cfg.extend(a); this.reset() }, reset: function () { q.reset.call(this); this._doReset() }, update: function (a) { this._append(a); this._process(); return this }, finalize: function (a) { a && this._append(a); return this._doFinalize() }, blockSize: 16, _createHelper: function (a) { return function (b, e) { return (new a.init(e)).finalize(b) } }, _createHmacHelper: function (a) {
				return function (b, e) {
					return (new n.HMAC.init(a,
						e)).finalize(b)
				}
			}
		}); var n = d.algo = {}; return d
}(Math);
(function () {
	var u = CryptoJS, p = u.lib.WordArray; u.enc.Base64 = {
		stringify: function (d) { var l = d.words, p = d.sigBytes, t = this._map; d.clamp(); d = []; for (var r = 0; r < p; r += 3)for (var w = (l[r >>> 2] >>> 24 - 8 * (r % 4) & 255) << 16 | (l[r + 1 >>> 2] >>> 24 - 8 * ((r + 1) % 4) & 255) << 8 | l[r + 2 >>> 2] >>> 24 - 8 * ((r + 2) % 4) & 255, v = 0; 4 > v && r + 0.75 * v < p; v++)d.push(t.charAt(w >>> 6 * (3 - v) & 63)); if (l = t.charAt(64)) for (; d.length % 4;)d.push(l); return d.join("") }, parse: function (d) {
			var l = d.length, s = this._map, t = s.charAt(64); t && (t = d.indexOf(t), -1 != t && (l = t)); for (var t = [], r = 0, w = 0; w <
				l; w++)if (w % 4) { var v = s.indexOf(d.charAt(w - 1)) << 2 * (w % 4), b = s.indexOf(d.charAt(w)) >>> 6 - 2 * (w % 4); t[r >>> 2] |= (v | b) << 24 - 8 * (r % 4); r++ } return p.create(t, r)
		}, _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
	}
})();
(function (u) {
	function p(b, n, a, c, e, j, k) { b = b + (n & a | ~n & c) + e + k; return (b << j | b >>> 32 - j) + n } function d(b, n, a, c, e, j, k) { b = b + (n & c | a & ~c) + e + k; return (b << j | b >>> 32 - j) + n } function l(b, n, a, c, e, j, k) { b = b + (n ^ a ^ c) + e + k; return (b << j | b >>> 32 - j) + n } function s(b, n, a, c, e, j, k) { b = b + (a ^ (n | ~c)) + e + k; return (b << j | b >>> 32 - j) + n } for (var t = CryptoJS, r = t.lib, w = r.WordArray, v = r.Hasher, r = t.algo, b = [], x = 0; 64 > x; x++)b[x] = 4294967296 * u.abs(u.sin(x + 1)) | 0; r = r.MD5 = v.extend({
		_doReset: function () { this._hash = new w.init([1732584193, 4023233417, 2562383102, 271733878]) },
		_doProcessBlock: function (q, n) {
			for (var a = 0; 16 > a; a++) { var c = n + a, e = q[c]; q[c] = (e << 8 | e >>> 24) & 16711935 | (e << 24 | e >>> 8) & 4278255360 } var a = this._hash.words, c = q[n + 0], e = q[n + 1], j = q[n + 2], k = q[n + 3], z = q[n + 4], r = q[n + 5], t = q[n + 6], w = q[n + 7], v = q[n + 8], A = q[n + 9], B = q[n + 10], C = q[n + 11], u = q[n + 12], D = q[n + 13], E = q[n + 14], x = q[n + 15], f = a[0], m = a[1], g = a[2], h = a[3], f = p(f, m, g, h, c, 7, b[0]), h = p(h, f, m, g, e, 12, b[1]), g = p(g, h, f, m, j, 17, b[2]), m = p(m, g, h, f, k, 22, b[3]), f = p(f, m, g, h, z, 7, b[4]), h = p(h, f, m, g, r, 12, b[5]), g = p(g, h, f, m, t, 17, b[6]), m = p(m, g, h, f, w, 22, b[7]),
				f = p(f, m, g, h, v, 7, b[8]), h = p(h, f, m, g, A, 12, b[9]), g = p(g, h, f, m, B, 17, b[10]), m = p(m, g, h, f, C, 22, b[11]), f = p(f, m, g, h, u, 7, b[12]), h = p(h, f, m, g, D, 12, b[13]), g = p(g, h, f, m, E, 17, b[14]), m = p(m, g, h, f, x, 22, b[15]), f = d(f, m, g, h, e, 5, b[16]), h = d(h, f, m, g, t, 9, b[17]), g = d(g, h, f, m, C, 14, b[18]), m = d(m, g, h, f, c, 20, b[19]), f = d(f, m, g, h, r, 5, b[20]), h = d(h, f, m, g, B, 9, b[21]), g = d(g, h, f, m, x, 14, b[22]), m = d(m, g, h, f, z, 20, b[23]), f = d(f, m, g, h, A, 5, b[24]), h = d(h, f, m, g, E, 9, b[25]), g = d(g, h, f, m, k, 14, b[26]), m = d(m, g, h, f, v, 20, b[27]), f = d(f, m, g, h, D, 5, b[28]), h = d(h, f,
					m, g, j, 9, b[29]), g = d(g, h, f, m, w, 14, b[30]), m = d(m, g, h, f, u, 20, b[31]), f = l(f, m, g, h, r, 4, b[32]), h = l(h, f, m, g, v, 11, b[33]), g = l(g, h, f, m, C, 16, b[34]), m = l(m, g, h, f, E, 23, b[35]), f = l(f, m, g, h, e, 4, b[36]), h = l(h, f, m, g, z, 11, b[37]), g = l(g, h, f, m, w, 16, b[38]), m = l(m, g, h, f, B, 23, b[39]), f = l(f, m, g, h, D, 4, b[40]), h = l(h, f, m, g, c, 11, b[41]), g = l(g, h, f, m, k, 16, b[42]), m = l(m, g, h, f, t, 23, b[43]), f = l(f, m, g, h, A, 4, b[44]), h = l(h, f, m, g, u, 11, b[45]), g = l(g, h, f, m, x, 16, b[46]), m = l(m, g, h, f, j, 23, b[47]), f = s(f, m, g, h, c, 6, b[48]), h = s(h, f, m, g, w, 10, b[49]), g = s(g, h, f, m,
						E, 15, b[50]), m = s(m, g, h, f, r, 21, b[51]), f = s(f, m, g, h, u, 6, b[52]), h = s(h, f, m, g, k, 10, b[53]), g = s(g, h, f, m, B, 15, b[54]), m = s(m, g, h, f, e, 21, b[55]), f = s(f, m, g, h, v, 6, b[56]), h = s(h, f, m, g, x, 10, b[57]), g = s(g, h, f, m, t, 15, b[58]), m = s(m, g, h, f, D, 21, b[59]), f = s(f, m, g, h, z, 6, b[60]), h = s(h, f, m, g, C, 10, b[61]), g = s(g, h, f, m, j, 15, b[62]), m = s(m, g, h, f, A, 21, b[63]); a[0] = a[0] + f | 0; a[1] = a[1] + m | 0; a[2] = a[2] + g | 0; a[3] = a[3] + h | 0
		}, _doFinalize: function () {
			var b = this._data, n = b.words, a = 8 * this._nDataBytes, c = 8 * b.sigBytes; n[c >>> 5] |= 128 << 24 - c % 32; var e = u.floor(a /
				4294967296); n[(c + 64 >>> 9 << 4) + 15] = (e << 8 | e >>> 24) & 16711935 | (e << 24 | e >>> 8) & 4278255360; n[(c + 64 >>> 9 << 4) + 14] = (a << 8 | a >>> 24) & 16711935 | (a << 24 | a >>> 8) & 4278255360; b.sigBytes = 4 * (n.length + 1); this._process(); b = this._hash; n = b.words; for (a = 0; 4 > a; a++)c = n[a], n[a] = (c << 8 | c >>> 24) & 16711935 | (c << 24 | c >>> 8) & 4278255360; return b
		}, clone: function () { var b = v.clone.call(this); b._hash = this._hash.clone(); return b }
	}); t.MD5 = v._createHelper(r); t.HmacMD5 = v._createHmacHelper(r)
})(Math);
(function () {
	var u = CryptoJS, p = u.lib, d = p.Base, l = p.WordArray, p = u.algo, s = p.EvpKDF = d.extend({ cfg: d.extend({ keySize: 4, hasher: p.MD5, iterations: 1 }), init: function (d) { this.cfg = this.cfg.extend(d) }, compute: function (d, r) { for (var p = this.cfg, s = p.hasher.create(), b = l.create(), u = b.words, q = p.keySize, p = p.iterations; u.length < q;) { n && s.update(n); var n = s.update(d).finalize(r); s.reset(); for (var a = 1; a < p; a++)n = s.finalize(n), s.reset(); b.concat(n) } b.sigBytes = 4 * q; return b } }); u.EvpKDF = function (d, l, p) {
		return s.create(p).compute(d,
			l)
	}
})();
CryptoJS.lib.Cipher || function (u) {
	var p = CryptoJS, d = p.lib, l = d.Base, s = d.WordArray, t = d.BufferedBlockAlgorithm, r = p.enc.Base64, w = p.algo.EvpKDF, v = d.Cipher = t.extend({
		cfg: l.extend(), createEncryptor: function (e, a) { return this.create(this._ENC_XFORM_MODE, e, a) }, createDecryptor: function (e, a) { return this.create(this._DEC_XFORM_MODE, e, a) }, init: function (e, a, b) { this.cfg = this.cfg.extend(b); this._xformMode = e; this._key = a; this.reset() }, reset: function () { t.reset.call(this); this._doReset() }, process: function (e) { this._append(e); return this._process() },
		finalize: function (e) { e && this._append(e); return this._doFinalize() }, keySize: 4, ivSize: 4, _ENC_XFORM_MODE: 1, _DEC_XFORM_MODE: 2, _createHelper: function (e) { return { encrypt: function (b, k, d) { return ("string" == typeof k ? c : a).encrypt(e, b, k, d) }, decrypt: function (b, k, d) { return ("string" == typeof k ? c : a).decrypt(e, b, k, d) } } }
	}); d.StreamCipher = v.extend({ _doFinalize: function () { return this._process(!0) }, blockSize: 1 }); var b = p.mode = {}, x = function (e, a, b) {
		var c = this._iv; c ? this._iv = u : c = this._prevBlock; for (var d = 0; d < b; d++)e[a + d] ^=
			c[d]
	}, q = (d.BlockCipherMode = l.extend({ createEncryptor: function (e, a) { return this.Encryptor.create(e, a) }, createDecryptor: function (e, a) { return this.Decryptor.create(e, a) }, init: function (e, a) { this._cipher = e; this._iv = a } })).extend(); q.Encryptor = q.extend({ processBlock: function (e, a) { var b = this._cipher, c = b.blockSize; x.call(this, e, a, c); b.encryptBlock(e, a); this._prevBlock = e.slice(a, a + c) } }); q.Decryptor = q.extend({
		processBlock: function (e, a) {
			var b = this._cipher, c = b.blockSize, d = e.slice(a, a + c); b.decryptBlock(e, a); x.call(this,
				e, a, c); this._prevBlock = d
		}
	}); b = b.CBC = q; q = (p.pad = {}).Pkcs7 = { pad: function (a, b) { for (var c = 4 * b, c = c - a.sigBytes % c, d = c << 24 | c << 16 | c << 8 | c, l = [], n = 0; n < c; n += 4)l.push(d); c = s.create(l, c); a.concat(c) }, unpad: function (a) { a.sigBytes -= a.words[a.sigBytes - 1 >>> 2] & 255 } }; d.BlockCipher = v.extend({
		cfg: v.cfg.extend({ mode: b, padding: q }), reset: function () {
			v.reset.call(this); var a = this.cfg, b = a.iv, a = a.mode; if (this._xformMode == this._ENC_XFORM_MODE) var c = a.createEncryptor; else c = a.createDecryptor, this._minBufferSize = 1; this._mode = c.call(a,
				this, b && b.words)
		}, _doProcessBlock: function (a, b) { this._mode.processBlock(a, b) }, _doFinalize: function () { var a = this.cfg.padding; if (this._xformMode == this._ENC_XFORM_MODE) { a.pad(this._data, this.blockSize); var b = this._process(!0) } else b = this._process(!0), a.unpad(b); return b }, blockSize: 4
	}); var n = d.CipherParams = l.extend({ init: function (a) { this.mixIn(a) }, toString: function (a) { return (a || this.formatter).stringify(this) } }), b = (p.format = {}).OpenSSL = {
		stringify: function (a) {
			var b = a.ciphertext; a = a.salt; return (a ? s.create([1398893684,
				1701076831]).concat(a).concat(b) : b).toString(r)
		}, parse: function (a) { a = r.parse(a); var b = a.words; if (1398893684 == b[0] && 1701076831 == b[1]) { var c = s.create(b.slice(2, 4)); b.splice(0, 4); a.sigBytes -= 16 } return n.create({ ciphertext: a, salt: c }) }
	}, a = d.SerializableCipher = l.extend({
		cfg: l.extend({ format: b }), encrypt: function (a, b, c, d) { d = this.cfg.extend(d); var l = a.createEncryptor(c, d); b = l.finalize(b); l = l.cfg; return n.create({ ciphertext: b, key: c, iv: l.iv, algorithm: a, mode: l.mode, padding: l.padding, blockSize: a.blockSize, formatter: d.format }) },
		decrypt: function (a, b, c, d) { d = this.cfg.extend(d); b = this._parse(b, d.format); return a.createDecryptor(c, d).finalize(b.ciphertext) }, _parse: function (a, b) { return "string" == typeof a ? b.parse(a, this) : a }
	}), p = (p.kdf = {}).OpenSSL = { execute: function (a, b, c, d) { d || (d = s.random(8)); a = w.create({ keySize: b + c }).compute(a, d); c = s.create(a.words.slice(b), 4 * c); a.sigBytes = 4 * b; return n.create({ key: a, iv: c, salt: d }) } }, c = d.PasswordBasedCipher = a.extend({
		cfg: a.cfg.extend({ kdf: p }), encrypt: function (b, c, d, l) {
			l = this.cfg.extend(l); d = l.kdf.execute(d,
				b.keySize, b.ivSize); l.iv = d.iv; b = a.encrypt.call(this, b, c, d.key, l); b.mixIn(d); return b
		}, decrypt: function (b, c, d, l) { l = this.cfg.extend(l); c = this._parse(c, l.format); d = l.kdf.execute(d, b.keySize, b.ivSize, c.salt); l.iv = d.iv; return a.decrypt.call(this, b, c, d.key, l) }
	})
}();
(function () {
	for (var u = CryptoJS, p = u.lib.BlockCipher, d = u.algo, l = [], s = [], t = [], r = [], w = [], v = [], b = [], x = [], q = [], n = [], a = [], c = 0; 256 > c; c++)a[c] = 128 > c ? c << 1 : c << 1 ^ 283; for (var e = 0, j = 0, c = 0; 256 > c; c++) { var k = j ^ j << 1 ^ j << 2 ^ j << 3 ^ j << 4, k = k >>> 8 ^ k & 255 ^ 99; l[e] = k; s[k] = e; var z = a[e], F = a[z], G = a[F], y = 257 * a[k] ^ 16843008 * k; t[e] = y << 24 | y >>> 8; r[e] = y << 16 | y >>> 16; w[e] = y << 8 | y >>> 24; v[e] = y; y = 16843009 * G ^ 65537 * F ^ 257 * z ^ 16843008 * e; b[k] = y << 24 | y >>> 8; x[k] = y << 16 | y >>> 16; q[k] = y << 8 | y >>> 24; n[k] = y; e ? (e = z ^ a[a[a[G ^ z]]], j ^= a[a[j]]) : e = j = 1 } var H = [0, 1, 2, 4, 8,
		16, 32, 64, 128, 27, 54], d = d.AES = p.extend({
			_doReset: function () {
				for (var a = this._key, c = a.words, d = a.sigBytes / 4, a = 4 * ((this._nRounds = d + 6) + 1), e = this._keySchedule = [], j = 0; j < a; j++)if (j < d) e[j] = c[j]; else { var k = e[j - 1]; j % d ? 6 < d && 4 == j % d && (k = l[k >>> 24] << 24 | l[k >>> 16 & 255] << 16 | l[k >>> 8 & 255] << 8 | l[k & 255]) : (k = k << 8 | k >>> 24, k = l[k >>> 24] << 24 | l[k >>> 16 & 255] << 16 | l[k >>> 8 & 255] << 8 | l[k & 255], k ^= H[j / d | 0] << 24); e[j] = e[j - d] ^ k } c = this._invKeySchedule = []; for (d = 0; d < a; d++)j = a - d, k = d % 4 ? e[j] : e[j - 4], c[d] = 4 > d || 4 >= j ? k : b[l[k >>> 24]] ^ x[l[k >>> 16 & 255]] ^ q[l[k >>>
					8 & 255]] ^ n[l[k & 255]]
			}, encryptBlock: function (a, b) { this._doCryptBlock(a, b, this._keySchedule, t, r, w, v, l) }, decryptBlock: function (a, c) { var d = a[c + 1]; a[c + 1] = a[c + 3]; a[c + 3] = d; this._doCryptBlock(a, c, this._invKeySchedule, b, x, q, n, s); d = a[c + 1]; a[c + 1] = a[c + 3]; a[c + 3] = d }, _doCryptBlock: function (a, b, c, d, e, j, l, f) {
				for (var m = this._nRounds, g = a[b] ^ c[0], h = a[b + 1] ^ c[1], k = a[b + 2] ^ c[2], n = a[b + 3] ^ c[3], p = 4, r = 1; r < m; r++)var q = d[g >>> 24] ^ e[h >>> 16 & 255] ^ j[k >>> 8 & 255] ^ l[n & 255] ^ c[p++], s = d[h >>> 24] ^ e[k >>> 16 & 255] ^ j[n >>> 8 & 255] ^ l[g & 255] ^ c[p++], t =
					d[k >>> 24] ^ e[n >>> 16 & 255] ^ j[g >>> 8 & 255] ^ l[h & 255] ^ c[p++], n = d[n >>> 24] ^ e[g >>> 16 & 255] ^ j[h >>> 8 & 255] ^ l[k & 255] ^ c[p++], g = q, h = s, k = t; q = (f[g >>> 24] << 24 | f[h >>> 16 & 255] << 16 | f[k >>> 8 & 255] << 8 | f[n & 255]) ^ c[p++]; s = (f[h >>> 24] << 24 | f[k >>> 16 & 255] << 16 | f[n >>> 8 & 255] << 8 | f[g & 255]) ^ c[p++]; t = (f[k >>> 24] << 24 | f[n >>> 16 & 255] << 16 | f[g >>> 8 & 255] << 8 | f[h & 255]) ^ c[p++]; n = (f[n >>> 24] << 24 | f[g >>> 16 & 255] << 16 | f[h >>> 8 & 255] << 8 | f[k & 255]) ^ c[p++]; a[b] = q; a[b + 1] = s; a[b + 2] = t; a[b + 3] = n
			}, keySize: 8
		}); u.AES = p._createHelper(d)
})();
var key = CryptoJS.enc.Utf8.parse('8080808080808080');  //需要和伺服器端一致，否則… 無法解密
var iv = CryptoJS.enc.Utf8.parse('8080808080808080');   //需要和伺服器端一致，否則… 無法解密
var aesEncryDecry = {
	decryptStringAES: function (strEncryptText) {
		var decrypted = CryptoJS.AES.decrypt(strEncryptText, key, {
			keySize: 128 / 8,
			iv: iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		});
		return decrypted.toString(CryptoJS.enc.Utf8);
	},
	encryptStringAES: function (strOrignText) {
		var encrypted = CryptoJS.AES.encrypt(strOrignText, key, {
			keySize: 128 / 8,
			iv: iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		});
		return encrypted.toString();
	}
};
function AesStr(inputStr) {
	var rtn = 'No Data';
	try {
		var c = Ysias + Xsias;
		c = c.substring(4, 20);
		key = CryptoJS.enc.Utf8.parse(c);
		iv = CryptoJS.enc.Utf8.parse(Ysias);

		rtn = aesEncryDecry.encryptStringAES(inputStr);
	} catch (e) {
		rtn = 'ERROR : ' + e.message;
	}
	return rtn;

	return inputStr;
}

function DesStr(inputStr) {
	var rtn = 'No Data';
	try {
		var c = Ysias + Xsias;
		c = c.substring(4, 20);
		key = CryptoJS.enc.Utf8.parse(c);
		iv = CryptoJS.enc.Utf8.parse(Ysias);

		rtn = aesEncryDecry.decryptStringAES(inputStr.replace('"', ''));
	} catch(e) {
		rtn = 'ERROR : ' + e.message;
	}

	return rtn;

	return inputStr
}





var mouseEventTypes = {
    touchstart : "mousedown",
    touchmove : "mousemove",
    touchend : "mouseup",


};
for (originalType in mouseEventTypes) {
    document.addEventListener(originalType, function(originalEvent) {
        event = document.createEvent("MouseEvents");
        touch = originalEvent.changedTouches[0];
        event.initMouseEvent(mouseEventTypes[originalEvent.type], true, true,
                window, 0, touch.screenX, touch.screenY, touch.clientX,
                touch.clientY, touch.ctrlKey, touch.altKey, touch.shiftKey,
                touch.metaKey, 0, null);
        originalEvent.target.dispatchEvent(event);
    });
}