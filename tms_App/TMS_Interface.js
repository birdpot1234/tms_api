var { dbConnectData_TransportApp } = require('../connect_sql')
const { save_log, server_response } = require("../service")
var sql = require('mssql')

const model = {
    check_status_claim(tms_doc, status, check_status, callback) {
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            if (err) {
                save_log("Connection is close", "update_status_claim_confirm", "TMS_Interface", "No connection")
                callback(server_response(500, "Connection is close", ""))
            }
            var req = new sql.Request(pool)

            var sql_query = "SELECT tms_document,claim_document,  status \
            FROM TMS_Interface \
            WHERE        (tms_document = '"+ tms_doc + "') AND (claim_document LIKE 'itr%') AND (status='" + check_status + "') "
            req.query(sql_query).then((result) => {
                pool.close()
                if (result.recordset.length > 0) {
                    save_log(result, "check_status_claim", "TMS_Interface", "อัพเดทสเตตัสงานเคลมขั้นที่3")
                    callback(server_response(200, "Success", result.recordset))
                } else {
                    save_log(result, "check_status_claim", "TMS_Interface", "อัพเดทสเตตัสงานเคลมขั้นที่3")
                    callback(server_response(204, "Unsuccess", result.recordset))
                }

            }).catch((err) => {
                pool.close()
                save_log(err, "check_status_claim", "TMS_Interface", "อัพเดทสเตตัสงานเคลมขั้นที่3")
                callback(server_response(501, "Error อัพเดทสเตตัสงานเคลมขั้นที่1", err))
            });
        })
    },
    update_status_claim(tms_doc, status, check_status, callback) {
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            if (err) {
                save_log("Connection is close", "update_status_claim_confirm", "TMS_Interface", "No connection")
                callback(server_response(500, "Connection is close", ""))
            }
            var req = new sql.Request(pool)

            var sql_query = "UPDATE TMS_Interface SET status=" + status + " \
            WHERE        (tms_document = '"+ tms_doc + "') AND (claim_document LIKE 'itr%') AND (status='" + check_status + "') "
            req.query(sql_query).then((result) => {
                pool.close()
                if (result.rowsAffected > 0) {
                    save_log(result, "update_status_claim_confirm", "TMS_Interface", "อัพเดทสเตตัสงานเคลมขั้นที่1")
                    callback(server_response(200, "Success", result.recordset))
                } else {
                    save_log("err", "update_status_claim_confirm", "TMS_Interface", "อัพเดทสเตตัสงานเคลมขั้นที่1")
                    callback(server_response(203, "Error อัพเดทสเตตัสงานเคลมขั้นที่1", err))
                }
            }).catch((err) => {
                pool.close()
                save_log(err, "update_status_claim_confirm", "TMS_Interface", "อัพเดทสเตตัสงานเคลมขั้นที่1")
                callback(server_response(501, "Error อัพเดทสเตตัสงานเคลมขั้นที่1", err))
            });
        })
    }
}

module.exports = {
    model: model
}