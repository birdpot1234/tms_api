var { dbConnectData_TransportApp } = require('../connect_sql')
const { save_log, server_response } = require("../service")
const moment = require('moment')
const ReportDetail =require("./ReportDetail")
var sql = require('mssql')

const model = {
    take_workloop(mess_id,mess_name,invoice,id_user,callback) {
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        var date_now = moment().format("YYYY-MM-DD H:m:s")
        pool.connect(err => {
            if (err) {
                save_log(err, "take_workloop", "Report", err)
                callback(server_response(500, "Error", err))
            }
            var req = new sql.Request(pool)
            var sql_query="DELETE FROM [dbo].[App_workApp] \
            WHERE invoiceNumber = '"+invoice+"' \
            DELETE FROM [dbo].[App_Detail] \
            WHERE invoiceNumber = '"+invoice+"' \
            DELETE FROM [dbo].[App_FinishApp] \
            WHERE invoiceNumber = '"+invoice+"' \
            DELETE FROM [dbo].[App_finishDetail] \
            WHERE invoiceNumber = '"+invoice+"' \
            UPDATE BillToApp SET MessengerID='"+mess_id+"', \
            MessengerName='"+mess_name+"', \
            update_time=NULL, \
            update_billtoapp=0, \
            receive_success=0, \
            status_receive=0, \
            datetime='"+date_now+"' \
            WHERE INVOICEID LIKE '"+invoice+"' \
            UPDATE Report SET ClearingStatus=8,LastUpdateBy='"+id_user+"' \
            WHERE INVOICEID LIKE '"+invoice+"' \
            UPDATE ReportDetail SET ClearingStatus=8 \
            WHERE INVOICEID LIKE '"+invoice+"' "
            // console.log("result", sql_query)
            req.query(sql_query).then((result, err) => {
                pool.close()
                // console.log("result", result)
                // result.rowsAffected.forEach((val,index) => {
                //     if(val)
                // });
                if (result.rowsAffected.length > 0) {
                    save_log(result.recordset, "take_workloop", "Report", result.recordset)
                    callback(server_response(200, "Success", result.recordset))
                } else {
                    save_log(result.recordset, "take_workloop", "Report", result.recordset)
                    callback(server_response(304, "None data this query", result.recordset))
                }
            }).catch((err) => {
                if (err) {
                    save_log(err, "take_workloop", "Report", err)
                    callback(server_response(500, "Error", err))
                }
            });
        })
    }
}

module.exports = {
    model: model
}