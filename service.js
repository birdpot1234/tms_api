const moment = require('moment')
const log = require('log-to-file');

const save_log = (res_data, type, tbl_name, input_data) => {
    //-----Parameter 
    //-----1. res_data = ข้อมูลตอบกลับหลังทำงานเสร็จ เช่น ข้อมูลที่ดึงได้จากระบบ
    //-----2. type = ประเภทของการทำงาน เช่น Insert, Select, Update
    //-----3. tbl_name = ชื่อของตารางที่เกี่ยวข้อง
    //-----4. input_data = ข้อมูลที่นำเข้ามา

    if (typeof res_data.length != "undefined") {
        res_data.forEach((val, index) => {
            const lognow = moment().format("YYYY-MM-DD H:m:s")
            log(lognow + " :: " + type + " " + tbl_name + " :: " + JSON.stringify(input_data[index]), "log-server.txt")
        });
    } else {
        console.log(input_data.length);
        if (Array.isArray(input_data)) {
            const lognow = moment().format("YYYY-MM-DD H:m:s")
            log(lognow + " :: " + type + " " + tbl_name + " :: " + JSON.stringify(input_data[0]), "log-server.txt")
        } else {
            const lognow = moment().format("YYYY-MM-DD H:m:s")
            log(lognow + " :: " + type + " " + tbl_name + " :: " + JSON.stringify(input_data), "log-server.txt")
        }
    }
}

const Gen_Document5digit = (char_doc, last_doc, callback) => {
    let new_doc = "", document = ""
    let docYear = moment().format("YY")
    let docMonth = moment().format("MM")
    if (last_doc != "") {
        get_number_run = last_doc.split("-");
        get_number_run = get_number_run[1]
        get_number_run++
        if (get_number_run < 10) {
            new_doc = "0000" + get_number_run
        } else if (get_number_run < 100) {
            new_doc = "000" + get_number_run
        } else if (get_number_run < 1000) {
            new_doc = "00" + get_number_run
        } else if (get_number_run < 10000) {
            new_doc = "0" + get_number_run
        } else {
            new_doc = get_number_run
        }
        document = char_doc + docYear + docMonth + "-" + new_doc
    } else {
        document = char_doc + docYear + docMonth + "-00001"
    }
    callback(document)
}

module.exports = {
    save_log: save_log,
    Gen_Document5digit: Gen_Document5digit
}