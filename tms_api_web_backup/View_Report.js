var { dbConnectData_TransportApp } = require('../connect_sql')
const { Gen_Document5digit, save_log, server_response } = require("../service")
const moment = require('moment')
var sql = require('mssql')

const model = {
    get_TMS_Status_Claim_API_Tracking(date_start, date_end, callback) {
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            if (err) {
                save_log(err, "get_TMS_Status_API_Tracking", "TMS_Status_API_Tracking", err)
                callback(server_response(500, "Error", err))
            }
            var req = new sql.Request(pool)

            var sql_query = "SELECT        document_main, document_sub, customer_name, sales_group, store_zone, code_zone, invoice_qty, invoice_amount, box_amount, dlv_term, delivery_date, status, confirm_scan, receive_scan, send_scan, MessName, \
            stamp_workapp, stamp_finishapp, stamp_report, create_date,invoice_date \
            FROM            dbo.TMS_Status_API_Tracking \
            WHERE  (document_sub LIKE 'ITR%') AND (create_date BETWEEN '"+ date_start + "' AND '" + date_end + "' )"
            console.log("object",sql_query)
            req.query(sql_query).then((result) => {
                pool.close()
                if (result.recordset.length > 0) {
                    save_log(result.recordset, "get_TMS_Status_API_Tracking", "TMS_Status_API_Tracking", result.recordset)
                    callback(server_response(200, "Success", result.recordset))
                } else {
                    save_log(result.recordset, "get_TMS_Status_API_Tracking", "TMS_Status_API_Tracking", result.recordset)
                    callback(server_response(500, "Error", result.recordset))
                }
            }).catch((err) => {
                if (err) {
                    save_log(err, "get_TMS_Status_API_Tracking", "TMS_Status_API_Tracking", err)
                    callback(server_response(500, "Error", err))
                }
            });
        })
    },
    get_TMS_Status_API_Tracking(date_start, date_end, callback) {
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            if (err) {
                save_log(err, "get_TMS_Status_API_Tracking", "TMS_Status_API_Tracking", err)
                callback(server_response(500, "Error", err))
            }
            var req = new sql.Request(pool)

            var sql_query = "SELECT        document_main, document_sub, customer_name, sales_group, store_zone, code_zone, invoice_qty, invoice_amount, box_amount, dlv_term, delivery_date, status, confirm_scan, receive_scan, send_scan, MessName, \
            stamp_workapp, stamp_finishapp, stamp_report, create_date,invoice_date \
            FROM            dbo.TMS_Status_API_Tracking \
            WHERE (document_sub LIKE 'IN%') AND (create_date BETWEEN '"+ date_start + "' AND '" + date_end + "' )"
            // console.log("object",sql_query)
            req.query(sql_query).then((result) => {
                pool.close()
                if (result.recordset.length > 0) {
                    save_log(result.recordset, "get_TMS_Status_API_Tracking", "TMS_Status_API_Tracking", result.recordset)
                    callback(server_response(200, "Success", result.recordset))
                } else {
                    save_log(result.recordset, "get_TMS_Status_API_Tracking", "TMS_Status_API_Tracking", result.recordset)
                    callback(server_response(500, "Error", result.recordset))
                }
            }).catch((err) => {
                if (err) {
                    save_log(err, "get_TMS_Status_API_Tracking", "TMS_Status_API_Tracking", err)
                    callback(server_response(500, "Error", err))
                }
            });
        })
    },
    get_TMS_Workloop(type_data, input_data,callback){
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        var sqlWhere=""
        switch(type_data){
            case "DOC":
            if(input_data.substring(0,2)=="TMS"){
                sqlWhere="DocumentSet LIKE '"+input_data+"'"
            }else{
                sqlWhere="INVOICEID LIKE '"+input_data+"'"
            }
            break;
            default:sqlWhere="IDMess LIKE '"+input_data+"'"
            break;
        }
        pool.connect(err => {
            if (err) {
                save_log(err, "get_TMS_Workloop", "Report", err)
                callback(server_response(500, "Error", err))
            }
            var req = new sql.Request(pool)

            var sql_query = "SELECT  INVOICEID, DocumentSet, CustomerName, IDMess, MessName, Detail, box_amount \
            FROM TMS_Workloop \
            WHERE "+sqlWhere+" \
            ORDER BY  INVOICEID"
            console.log("object", sql_query)
            req.query(sql_query).then((result, err) => {
                pool.close()
                if (result.recordset.length > 0) {
                    save_log(result.recordset, "get_TMS_Workloop", "Report", result.recordset)
                    callback(server_response(200, "Success", result.recordset))
                } else {
                    save_log(result.recordset, "get_TMS_Workloop", "Report", result.recordset)
                    callback(server_response(304, "None data this query", result.recordset))
                }
            }).catch((err) => {
                if (err) {
                    save_log(err, "get_TMS_Workloop", "Report", err)
                    callback(server_response(500, "Error", err))
                }
            });
        })
    }
}

module.exports = {
    model: model
}