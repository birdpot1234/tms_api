var { dbConnectData_TransportApp } = require('../connect_sql')
const { save_log,server_response } = require("../service")
var sql = require('mssql')

const model = {
    find_by_token(token, callback) {
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            if (err) {
                save_log("Connection is close", "find_no_admin", "Messenger", "No connection")
                callback(server_response(500,"Connection is close",""))
            }
            var req = new sql.Request(pool)

            var sql_query = "SELECT IDMess, MessNO, MessName, Password, IMEI, Tel, Sale, Zone, Activate, [Level], Token\
            FROM            Messenger\
            WHERE        (Token LIKE '"+ token + "')"

            req.query(sql_query).then((result) => {
                pool.close()
                if(result.recordset.length>0){
                    save_log(result, "find_by_token", "Messenger", token)
                    callback(server_response(200,"Success",result.recordset))
                }else{
                    save_log("None Data", "find_by_token", "Messenger", token)
                    callback(server_response(204,"None Data",result.recordset))
                }
            }).catch((err) => {
                pool.close()
                save_log(err, "find_by_token", "Messenger", token)
                callback(server_response(501,"Error query SQL",err))
            });
        })
    },
    find_no_admin(callback) {
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            if (err) {
                save_log("Connection is close", "find_no_admin", "Messenger", "No connection")
                callback(server_response(500,"Connection is close",""))
            }
            var req = new sql.Request(pool)

            var sql_query = "SELECT IDMess, MessNO, MessName \
            FROM            Messenger\
            WHERE        ([Level] NOT LIKE 'admin' OR [Level] IS NULL) AND (Activate = 1)"
            req.query(sql_query).then((result) => {
                pool.close()
                save_log(result, "find_no_admin", "Messenger", "ดึงข้อมูล Messenger")
                callback(server_response(200,"Success",result.recordset))
            }).catch((err) => {
                pool.close()
                save_log("ดึงข้อมูล Messenger", "find_no_admin", "Messenger", "ดึงข้อมูล Messenger")
                callback(server_response(501,"Error query SQL",err))
            });
        })
    }
}
module.exports = {
    model: model
}