var { dbConnectData_TransportApp } = require('../connect_sql')
const { save_log, server_response } = require("../service")
const moment = require('moment')
var sql = require('mssql')

const model = {
    get_data_signature(invoice, callback) {
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            if (err) {
                save_log(err, "get_data_signature", "App_SignaturePic", err)
                callback(server_response(500, "Error", err))
            }
            var req = new sql.Request(pool)

            var sql_query = "SELECT    invoice, url, creatdate \
            FROM            App_SignaturePic \
            WHERE        (invoice LIKE '"+invoice+"')"
            console.log("object", sql_query)
            req.query(sql_query).then((result, err) => {
                pool.close()
                if (result.recordset.length > 0) {
                    save_log(result.recordset, "get_data_signature", "App_SignaturePic", result.recordset)
                    callback(server_response(200, "Success", result.recordset))
                } else {
                    save_log(result.recordset, "get_data_signature", "App_SignaturePic", result.recordset)
                    callback(server_response(304, "None data this query", result.recordset))
                }
            }).catch((err) => {
                if (err) {
                    save_log(err, "get_data_signature", "App_SignaturePic", err)
                    callback(server_response(500, "Error", err))
                }
            });
        })
    }
}

module.exports = {
    model: model
}