var { dbConnectData_TransportApp } = require('../connect_sql')
const { save_log } = require("../service")
var sql = require('mssql')

const model = {
    find_by_token(token, callback) {
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            if (err) {
                save_log("Connection is close", "find_no_admin", "Messenger", "No connection")
                callback({ status: false, message: "Connection is close" })
            }
            var req = new sql.Request(pool)

            var sql_query = "SELECT IDMess, MessNO, MessName, Password, IMEI, Tel, Sale, Zone, Activate, [Level], Token\
            FROM            Messenger\
            WHERE        (Token LIKE '"+ token + "')"

            req.query(sql_query).then((result) => {
                pool.close()
                if(result.recordset.length>0){
                    save_log(result, "find_by_token", "Messenger", token)
                    callback({ status: true, resp: result.recordset })
                }else{
                    save_log("None Data", "find_by_token", "Messenger", token)
                    callback({ status: false, message: "None Data" })
                }
            }).catch((err) => {
                pool.close()
                save_log(err, "find_by_token", "Messenger", token)
                callback({ status: false, message: "Error SQL query" })
            });
        })
    },
    find_no_admin(callback) {
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            if (err) {
                save_log("Connection is close", "find_no_admin", "Messenger", "No connection")
                callback({ status: false, message: "Connection is close" })
            }
            var req = new sql.Request(pool)

            var sql_query = "SELECT IDMess, MessNO, MessName \
            FROM            Messenger\
            WHERE        (Level NOT LIKE 'admin') AND (Activate=1)"
            req.query(sql_query).then((result) => {
                pool.close()
                save_log(result, "find_no_admin", "Messenger", "ดึงข้อมูล Messenger")
                callback(result)
            }).catch((err) => {
                pool.close()
                save_log("ดึงข้อมูล Messenger", "find_no_admin", "Messenger", "ดึงข้อมูล Messenger")
                callback({ status: false, message: "Error SQL query" })
            });
        })
    }
}
module.exports = {
    model: model
}