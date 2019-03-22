var { dbConnectData_TransportApp } = require('../connect_sql')
const { Gen_Document5digit, save_log, server_response } = require("../service")
const moment = require('moment')
const Report =require("./Report")
var sql = require('mssql')

const model = {
    get_report_detail(invoice, callback) {
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            if (err) {
                save_log(err, "get_report_detail", "ReportDetail", err)
                callback(server_response(500, "Error", err))
            }
            var req = new sql.Request(pool)

            var sql_query = "SELECT      id,  INVOICEID, ItemCode, ItemName, QtyBill, QtyActual, AmountBill, AmountActaul, PriceOfUnit, ClearingStatus, ClearingDate \
            FROM            dbo.ReportDetail \
            WHERE        (INVOICEID = '"+ invoice + "')"
            // console.log("object",sql_query)
            req.query(sql_query).then((result, err) => {
                pool.close()
                if (result.recordset.length > 0) {
                    save_log(result.recordset, "get_report_detail", "ReportDetail", result.recordset)
                    callback(server_response(200, "Success", result.recordset))
                } else {
                    save_log(result.recordset, "get_report_detail", "ReportDetail", result.recordset)
                    callback(server_response(304, "None data this query", result.recordset))
                }
            }).catch((err) => {
                if (err) {
                    save_log(err, "get_report_detail", "ReportDetail", err)
                    callback(server_response(500, "Error", err))
                }
            });
        })
    },
    update_clear_bill(data, callback) {
        sql.close()
        var clear_date = moment().format("YYYY-MM-DD H:m:s")
        var clear_status = 9
        var sql_where = ""
        data.forEach((val, i) => {
            if ((i + 1) == data.length) {
                sql_where += "'" + val.INVOICEID + "'"
            } else {
                sql_where += "'" + val.INVOICEID + "',"
            }
        });
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            if (err) {
                save_log(err, "update_clear_bill", "ReportDetail", err)
                callback(server_response(500, "Error", err))
            }
            var req = new sql.Request(pool)

            var sql_query = " UPDATE ReportDetail SET ClearingStatus='" + clear_status + "', ClearingDate='" + clear_date + "' \
            WHERE (INVOICEID IN ("+ sql_where + ") ) "
            // console.log("object", sql_query)
            req.query(sql_query).then((result) => {
                pool.close()
                if (result.rowsAffected > 0) {
                    save_log(result.recordset, "update_clear_bill", "ReportDetail", result.recordset)
                    callback(server_response(200, "Success", result.recordset))
                } else {
                    save_log(result.recordset, "update_clear_bill", "ReportDetail", result.recordset)
                    callback(server_response(304, "Error", result.recordset))
                }
            }).catch((err) => {
                if (err) {
                    save_log(err, "update_clear_bill", "ReportDetail", err)
                    callback(server_response(500, "Error", err))
                }
            });
        })
    },
    update_arr_data_detail(data, callback) {
        var sql_query=""
        var get_inv=""
        // console.log("data", data);
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            if (err) {
                save_log(err, "update_arr_data_detail", "ReportDetail", err)
                callback(server_response(500, "Error", err))
            }
            var req = new sql.Request(pool)
            data.forEach((val, i) => {
                get_inv=val.INVOICEID
                var get_id = val.id
                var get_QtyActual = val.new_QtyActual
                var get_AmountBill= val.new_AmountBill
                var get_AmountActaul = val.new_AmountActaul
                sql_query += "UPDATE ReportDetail SET QtyActual='" + get_QtyActual + "', \
                AmountActaul='"+ get_AmountActaul + "' \
            WHERE id='"+ get_id + "'"
            });

            // console.log("object", sql_query)
            req.query(sql_query).then((result, err) => {
                pool.close()
                console.log("result.rowsAffected",result.rowsAffected,get_inv);
                if (result.rowsAffected > 0) {
                    console.log("result",result)
                    save_log(result.recordset, "update_arr_data_detail", "ReportDetail", result.recordset)
                    Report.model.update_clear_detail(get_inv,(res_data)=>{
                        callback(res_data)
                    })
                    // callback(server_response(200, "Success", result.recordset))
                } else {
                    save_log(result.recordset, "update_arr_data_detail", "ReportDetail", result.recordset)
                    callback(server_response(304, "None data this query", result.recordset))
                }
            }).catch((err) => {
                if (err) {
                    save_log(err, "update_arr_data_detail", "ReportDetail", err)
                    callback(server_response(500, "Error", err))
                }
            });
        })
    }
}
module.exports = {
    model: model
}