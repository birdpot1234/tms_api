var { dbConnectData_TransportApp } = require('../connect_sql')
const { save_log, server_response } = require("../service")
var sql = require('mssql')
var jwt = require('jsonwebtoken');

const model = {
    gen_and_update_token(id, pass, token, callback) {
        var idMess = id
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            var req = new sql.Request(pool)
            jwt.sign({
                id: id,
                pass: pass
            }, "TmsDplus", (err, gen_token) => {
                // console.log("gen_token",gen_token);
                var sql_insert = "UPDATE Messenger SET Token='" + gen_token + "' WHERE IDMess='" + idMess + "' "
                req.query(sql_insert).then((result) => {
                    if (result.rowsAffected > 0) {
                        save_log(result, "find_by_token", "Messenger", gen_token)
                        callback(server_response(200, "Success", gen_token))
                    } else {
                        save_log("None Data", "find_by_token", "Messenger", gen_token)
                        callback(server_response(204, "Token Fails", gen_token))
                    }
                }).catch((err) => {
                    pool.close()
                    save_log(err, "find_by_token", "Messenger", gen_token)
                    callback(server_response(502, "Error query SQL", err))
                });
            })
        })
    },
    find_by_token(id, pass, token, callback) {
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            var req = new sql.Request(pool)
            if (token == 'none') {
                this.gen_and_update_token(id, pass, token, (res_data) => {
                    if (res_data.status === 200) {
                        // console.log("res_data", res_data)
                        var sql_query = "SELECT IDMess, MessNO, MessName, Password, IMEI, Tel, Sale, Zone, Activate, [Level], Token FROM Messenger WHERE (IDMess='" + id + "') AND (Password='" + pass + "') AND (Token LIKE '" + res_data.result + "')"
                        req.query(sql_query).then((result) => {
                            if (result.recordset[0].Token === res_data.result) {
                                save_log(result, "find_by_token", "Messenger", res_data.result)
                                callback(server_response(200, "Success", result.recordset))
                            } else if (result.recordset[0].Token != res_data.result) {
                                save_log("None Data", "find_by_token", "Messenger", res_data.result)
                                callback(server_response(204, "Token invalid", result.recordset))
                            }
                        }).catch((err) => {
                            pool.close()
                            save_log(err, "find_by_token", "Messenger", res_data.result)
                            callback(server_response(501, "Error query SQL", err))
                        });
                    } else {
                        save_log(err, "find_by_token", "Messenger", token)
                        callback(server_response(501, "Error query SQL", err))
                    }
                })
            } else {
                var sql_query = "SELECT IDMess, MessNO, MessName, Password, IMEI, Tel, Sale, Zone, Activate, [Level], Token FROM Messenger WHERE (IDMess='" + id + "') AND (Password='" + pass + "') AND (Token LIKE '" + token + "')"
                req.query(sql_query).then((result) => {
                    if (result.recordset[0].Token === token) {
                        save_log(result, "find_by_token", "Messenger", result.result)
                        callback(server_response(200, "Success", result.recordset))
                    } else if (result.recordset[0].Token != token) {
                        save_log("None Data", "find_by_token", "Messenger", result.result)
                        callback(server_response(204, "Token invalid", result.recordset))
                    }
                }).catch((err) => {
                    pool.close()
                    save_log(err, "find_by_token", "Messenger", result.result)
                    callback(server_response(501, "Error query SQL", err))
                });
            }
        })
    },
    find_sub_messenger(callback) {
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            if (err) {
                save_log("Connection is close", "find_no_admin", "Messenger", "No connection")
                callback(server_response(500, "Connection is close", ""))
            }
            var req = new sql.Request(pool)

            var sql_query = "SELECT IDMess, MessNO, MessName \
            FROM            Messenger\
            WHERE        (IDMess LIKE 'SDL%') AND (Activate = 1)"
            req.query(sql_query).then((result) => {
                pool.close()
                save_log(result, "find_sub_messenger", "Messenger", "ดึงข้อมูล Messenger")
                callback(server_response(200, "Success", result.recordset))
            }).catch((err) => {
                pool.close()
                save_log("ดึงข้อมูล Messenger", "find_sub_messenger", "Messenger", "ดึงข้อมูล Messenger")
                callback(server_response(501, "Error query SQL", err))
            });
        })
    },
    find_no_admin(type_mess,callback) {
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            if (err) {
                save_log("Connection is close", "find_no_admin", "Messenger", "No connection")
                callback(server_response(500, "Connection is close", ""))
            }
            var req = new sql.Request(pool)

            var sql_query = "SELECT IDMess, MessNO, MessName \
            FROM            Messenger\
            WHERE        (IDMess LIKE '"+type_mess+"%') AND (Activate = 1) \
            ORDER BY IDMess"
            req.query(sql_query).then((result) => {
                pool.close()
                save_log(result, "find_no_admin", "Messenger", "ดึงข้อมูล Messenger")
                callback(server_response(200, "Success", result.recordset))
            }).catch((err) => {
                pool.close()
                save_log("ดึงข้อมูล Messenger", "find_no_admin", "Messenger", "ดึงข้อมูล Messenger")
                callback(server_response(501, "Error query SQL", err))
            });
        })
    }
}
module.exports = {
    model: model
}