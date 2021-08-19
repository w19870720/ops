
function ref_mapping(ref_list, code_ele, symbol) {
    var return_val = "";
    (symbol == undefined) && (symbol = ",");
    if (code_ele != "") {
        ref_list.forEach(function (element) {
            if (typeof code_ele == "string") {
                if (element.cod == code_ele) {
                    return_val += element.val;
                }
            } else if (code_ele) {
                code_ele.forEach(function (code_, idx) {
                    if (element.cod == code_) {
                        return_val += element.val + symbol;
                    }
                })
            }
        })
        if (typeof code_ele !== "string") {
            return_val = return_val.slice(0, -1);
        }
    }

    return return_val;
}

function ref_map_else_id(ref_list, code_ele, Akey , Bkey){
    var return_val = "";
    ref_list.forEach(function (element) {
        if (element[Akey] == code_ele) {
            // console.log(element[Akey], code_ele, Bkey, element[Bkey])
            return_val = element[Bkey];
        }
    })
    if( return_val!== ""){
        return return_val;
    }
    
}

var ANES_TPYE = [
    {
        cod: "Epidural anes",
        val: "Epidural anes",
    },
    {
        cod: "Local anes",
        val: "Local anes",
    },
    {
        cod: "IV/IM",
        val: "IV/IM",
    },
    {
        cod: "Mask GA",
        val: "Mask GA",
    },
    {
        cod: "球後麻醉",
        val: "球後麻醉",
    },
    {
        cod: "endo GA",
        val: "endo GA",
    },
    {
        cod: "Nerve plexus block",
        val: "Nerve plexus block",
    },
    {
        cod: "Spinal anes",
        val: "Spinal anes",
    },
]
var SCHEDULE_TYPE = [
    {
        cod: "W",
        val: "等待刀",
        idx: 5,
    },
    {
        cod: "G",
        val: "排程刀",
        idx: 6,
    },
    {
        cod: "E1",
        val: "急刀 30",
        idx: 1,
    },
    {
        cod: "E2",
        val: "急刀 60",
        idx: 2,
    },
    {
        cod: "E3",
        val: "急刀 2H",
        idx: 3,
    },
    {
        cod: "E4",
        val: "急刀 4H",
        idx: 4,
    },
]
var PUSH_TYPE = [
    {
        cod: "0",
        val: "未發送",
        idx: 0,
    },
    {
        cod: "1",
        val: "已發送",
        idx: 1,
    },
    {
        cod: "2",
        val: "已收",//不會發生
        idx: 2,
    },
    {
        cod: "3",
        val: "已回覆",
        idx: 3,
    },
    {
        cod: "4",
        val: "取消發送",
        idx: 4,
    },
    {
        cod: "5",
        val: "群 等待KILL",
        idx: 5,
    },
    {
        cod: "6",
        val: "群 已回覆",
        idx: 6,
    },

]

// ANE_REPLY: "",//麻醉諮詢
// ANES_NAME: "",//麻醉方式
// BIRTH_DATE: "",//生日
// BLOOD: "",//血型
// CDIAG_DESC: "",//手術診斷
// DIAG_TYPE: "F",//診別 初診:F|U  複診:R
// DIVISION_ID: (user.ROLE_CODE == "DOCTOR") ? user.DIVISION_ID : "",//科別 
// DOCTOR_ID: (user.ROLE_CODE == "DOCTOR") ? user.ID : "",//手術者
// EDIAG_DESC: "",//入院診斷
// ER_REMARK: "",//急刀備註
// OPERATION_DATE: "",//日 不寫入資料庫
// OPERATION_HOUR: "",//時 不寫入資料庫
// OPERATION_MINUTE: "",//分 不寫入資料庫
// OPERATION_DESC_ONE: "",//術式一                
// OPERATION_DESC_TWO: "",//術式二
// OPERATION_DESC_THREE: "",//術式三
// OPERATION_SIDE_ONE: "3",//施術側  0左側 1右側 2雙側 3無左右雙側之分
// OPERATION_SIDE_TWO: "",//施術側
// OPERATION_SIDE_THREE: "",//施術側
// OPERATION_TIME_START: moment().format("YYYY-MM-DD HH:mm"),//預定時間
// OPERATION_TIME_END: "",//結束時間
// OPERATION_TIME_SPEND_HOUR: "00",//耗時 不寫入資料庫
// OPERATION_TIME_SPEND_MINUTE: 15,//耗時 不寫入資料庫
// OPERATION_TIME_SPEND: 15,//耗時 不寫入資料庫
// OPERATION_POSITION: "",// 姿勢
// PATIENT_BED: "",//病床
// PATIENT_CODE: "",//病歷號
// PATIENT_NAME: "",//姓名
// PATIENT_ROOM_ID: "",//病房
// PHONE_ONE: "",//電話
// PHONE_TWO: "",//手機
// REMARK: "",//備註      
// ROOM_ID: "",//手術房
// SCHEDULE_TYPE: "G",//排程種類 SCHEDULE_TYPES => G:排程刀
// SELF_MEDICAL_MATERIALS: "0",//自費器具 0:否 1:是
// SERIAL_NO: paddingLeft(user.HOSPITAL.ID.toString(), 3) + moment().format("YYYYMMDDHHmmssSSS"),//編號 主鍵
// SEX_TYPE: "M",//性別 F女 M男
// SOURCE_TYPE: "",//O門、E急、I住、H待住院
// SPECIAL_MEDICAL_MATERIALS: "",//特殊醫材
// SCHEDULE_ID: "",
// USER_ID: user.ID,
// history_action: "",//歷史紀錄
// sDateTimeO: "",//原本的時間 用來判斷時間是否有被修改 2018-10-31 08:30:00 會用字串來判斷
// oldTime: "",