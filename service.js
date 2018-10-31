const moment = require('moment')
const log = require('log-to-file');

const save_log = (res_data, type, tbl_name, data) => {
    if (typeof res_data.length != "undefined") {
        res_data.forEach((val, index) => {
            const lognow = moment().format("YYYY-MM-DD H:m:s")
            log(lognow + " :: " + type + " " + tbl_name + " :: " + JSON.stringify(data[index]), "log-server.txt")
        });
    } else {
        const lognow = moment().format("YYYY-MM-DD H:m:s")
        log(lognow + " :: " + type + " " + tbl_name + " :: " + JSON.stringify(data[0]), "log-server.txt")
    }
}
module.exports = {
    save_log: save_log
}