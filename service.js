const moment = require('moment')
const log = require('log-to-file');

const response = (status, dev_msg, data) => {
    switch (status) {
        case 200: return { status: 200, message: "OK", dev_msg: dev_msg, result: data }
        case 201: return { status: 201, message: "Created", dev_msg: dev_msg, result: data }
        case 202: return { status: 202, message: "Accepted", dev_msg: dev_msg, result: data }
        case 203: return { status: 203, message: "Non-Authoritative Information", dev_msg: dev_msg, result: data }
        case 204: return { status: 204, message: "No Content", dev_msg: dev_msg, result: data }
        case 205: return { status: 205, message: "Reset Content", dev_msg: dev_msg, result: data }
        case 206: return { status: 206, message: "Partial Content", dev_msg: dev_msg, result: data }

        case 300: return { status: 300, message: "OK", dev_msg: dev_msg, result: data }
        case 301: return { status: 301, message: "OK", dev_msg: dev_msg, result: data }
        case 302: return { status: 302, message: "OK", dev_msg: dev_msg, result: data }
        case 303: return { status: 303, message: "OK", dev_msg: dev_msg, result: data }
        case 304: return { status: 304, message: "OK", dev_msg: dev_msg, result: data }

        case 401: return { status: 401, message: "OK", dev_msg: dev_msg, result: data }
        case 402: return { status: 402, message: "OK", dev_msg: dev_msg, result: data }
        case 403: return { status: 403, message: "OK", dev_msg: dev_msg, result: data }
        case 404: return { status: 404, message: "OK", dev_msg: dev_msg, result: data }
        case 405: return { status: 405, message: "OK", dev_msg: dev_msg, result: data }
        case 401: return { status: 406, message: "OK", dev_msg: dev_msg, result: data }
        case 402: return { status: 413, message: "OK", dev_msg: dev_msg, result: data }
        case 403: return { status: 414, message: "OK", dev_msg: dev_msg, result: data }
        case 404: return { status: 415, message: "OK", dev_msg: dev_msg, result: data }

        case 500: return { status: 500, message: "Internal Server Error", dev_msg: dev_msg, result: data }
        case 501: return { status: 501, message: "Not Implemented", dev_msg: dev_msg, result: data }
        case 502: return { status: 502, message: "Bad Gateway", dev_msg: dev_msg, result: data }
        case 503: return { status: 503, message: "Service Unavailable", dev_msg: dev_msg, result: data }
        case 504: return { status: 504, message: "Gateway Timeout", dev_msg: dev_msg, result: data }
    }
}

const save_log = (res_data, type, tbl_name, input_data) => {
    //-----Parameter 
    //-----1. res_data = ข้อมูลตอบกลับหลังทำงานเสร็จ เช่น ข้อมูลที่ดึงได้จากระบบ
    //-----2. type = ประเภทของการทำงาน เช่น Insert, Select, Update
    //-----3. tbl_name = ชื่อของตารางที่เกี่ยวข้อง
    //-----4. input_data = ข้อมูลที่นำเข้ามา

    if (Array.isArray(res_data)) {
        res_data.forEach((val, index) => {
            const lognow = moment().format("YYYY-MM-DD H:m:s")
            log(lognow + " :: " + type + " " + tbl_name + " :: " + JSON.stringify(input_data[index]), "log-server.txt")
        });
    } else {
        // console.log(input_data.length);
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
    Gen_Document5digit: Gen_Document5digit,
    server_response: response,
}