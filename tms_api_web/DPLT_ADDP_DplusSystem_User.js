var { dbConnectDplusSystem } = require('../connect_sql')
var sql = require('mssql')
const { save_log, server_response } = require("../service")

const model = {
    find_by_id_pass(id, pass, callback) {
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectDplusSystem)
        pool.connect(err => {
            if (err) {
                save_log("Connection is close", "find_by_id_pass", "DPLT_ADDP_DplusSystem_User", "No connection")
                callback(server_response(500, "Connection is close", ""))
            }
            var req = new sql.Request(pool)

            var sql_query = "SELECT   ID_User, Username, Password, Email, DepartmentNo, Last_Login, Name, NickName, Salecode, Level_User, Boss, Sup, Sup_dep, Tel_No, Tel_Dplus, Blocked, Remark, Position_No, ConfirmData, HcmUserId, \
            isChangePass, Sub_Dept, Create_Date \
            FROM            DPLT_ADDP_DplusSystem_User \
            WHERE(Username = '"+ id + "' ) AND(Password = '" + pass + "')"

            req.query(sql_query).then((result) => {
                pool.close()
                if (result.recordset.length > 0) {
                    save_log(result, "find_by_id_pass", "DPLT_ADDP_DplusSystem_User", id)
                    callback(server_response(200, "Success", result.recordset))
                } else {
                    save_log(result, "find_by_id_pass", "DPLT_ADDP_DplusSystem_User", id)
                    callback(server_response(204, "None data", result.recordset))
                }
            }).catch((err) => {
                if (err) {
                    save_log(err, "find_by_id_pass", "DPLT_ADDP_DplusSystem_User", id)
                    callback(server_response(501, "Error query SQL", err))
                }
            });

        })
    }
}

module.exports = {
    model: model
}