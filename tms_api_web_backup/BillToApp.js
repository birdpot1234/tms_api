var { dbConnectData_TransportApp } = require('../connect_sql')
const { save_log, server_response } = require("../service")
const moment = require('moment')
const ReportDetail =require("./ReportDetail")
var sql = require('mssql')

const model = {
    get_data_change_mess(type_data, input_data, callback) {
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        var sqlWhere=""
        switch(type_data){
            case "DOC":
            if(input_data.substring(0,2)=="TMS"){
                sqlWhere="BillToApp.DocumentSet LIKE '"+input_data+"'"
            }else{
                sqlWhere="BillToApp.INVOICEID LIKE '"+input_data+"'"
            }
            break;
            default:sqlWhere="IDMess LIKE '"+input_data+"'"
            break;
        }
        pool.connect(err => {
            if (err) {
                save_log(err, "get_report_form_account", "Report", err)
                callback(server_response(500, "Error", err))
            }
            var req = new sql.Request(pool)

            var sql_query = "SELECT        dbo.BillToApp.INVOICEID, dbo.BillToApp.DocumentSet, dbo.BillToApp.CustomerName, dbo.Messenger.IDMess, dbo.Messenger.MessName \
            FROM            dbo.BillToApp LEFT OUTER JOIN \
                                     dbo.Messenger ON dbo.BillToApp.MessengerID = dbo.Messenger.IDMess \
                WHERE "+sqlWhere+" AND update_billtoapp=0 AND receive_success=0  \
                ORDER BY dbo.BillToApp.INVOICEID DESC"
            console.log("object", sql_query)
            req.query(sql_query).then((result, err) => {
                pool.close()
                if (result.recordset.length > 0) {
                    save_log(result.recordset, "get_report_form_account", "Report", result.recordset)
                    callback(server_response(200, "Success", result.recordset))
                } else {
                    save_log(result.recordset, "get_report_form_account", "Report", result.recordset)
                    callback(server_response(304, "None data this query", result.recordset))
                }
            }).catch((err) => {
                if (err) {
                    save_log(err, "get_report_form_account", "Report", err)
                    callback(server_response(500, "Error", err))
                }
            });
        })
    },
    update_change_mess(mess_id,mess_name,invoice,callback) {
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            if (err) {
                save_log(err, "update_change_mess", "Report", err)
                callback(server_response(500, "Error", err))
            }
            var req = new sql.Request(pool)
            var sql_query="UPDATE BillToApp SET MessengerID='"+mess_id+"', \
            MessengerName='"+mess_name+"' \
            WHERE INVOICEID LIKE '"+invoice+"' AND update_billtoapp=0 AND receive_success=0 "
            console.log("result", sql_query)
            req.query(sql_query).then((result, err) => {
                pool.close()
                // console.log("result", result)
                if (result.rowsAffected > 0) {
                    save_log(result.recordset, "update_change_mess", "Report", result.recordset)
                    callback(server_response(200, "Success", result.recordset))
                } else {
                    save_log(result.recordset, "update_change_mess", "Report", result.recordset)
                    callback(server_response(304, "None data this query", result.recordset))
                }
            }).catch((err) => {
                if (err) {
                    save_log(err, "update_change_mess", "Report", err)
                    callback(server_response(500, "Error", err))
                }
            });
        })
    }
}

module.exports = {
    model: model
}