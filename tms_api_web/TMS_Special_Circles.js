var { dbConnectData_TransportApp } = require('../connect_sql')
const { Gen_Document5digit, save_log, server_response } = require("../service")
const moment = require('moment')
var sql = require('mssql')
//11//
const model = {
    check_status(tsc_document, callback) {
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            var req = new sql.Request(pool)

            var sql_query = "SELECT        tsc_document, status \
            FROM            dbo.TMS_Special_Circles \
            WHERE        (status = 0) AND (tsc_document = '"+ tsc_document + "')"

            req.query(sql_query).then((result) => {
                pool.close()
                if (result.recordset.length > 0) {
                    save_log(result, "check_status", "TMS_Special_Circles", result)
                    callback(server_response(204, "Status not 0", result.recordset))
                } else {
                    save_log(result, "check_status", "TMS_Special_Circles", result)
                    callback(server_response(200, "Success", result.recordset))
                }
            }).catch((err) => {
                if (err) throw err;
            });
        })
    },
    update_status(data, callback) {
        //--------------Status = 3
        let status, tsc_document, invoice, car_type, staff1, staff2, staff3, zone, trip, messenger_code, messenger_name
        let sql_where_in=""
        data.forEach((val, i) => {
            status = 3, invoice = val.invoice, car_type = val.car_type, staff1 = val.staff1, staff2 = val.staff2, staff3 = val.staff3, zone = val.zone, trip = val.trip, messenger_code = val.Mess, messenger_name = val.Mess_name
            tsc_document = val.tms_doc
            sql_where_in += "'" + tsc_document + "',"
        });
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            var req = new sql.Request(pool)
            var sql_query = "UPDATE TMS_Special_Circles SET \
                status="+ status + ",\
                messenger_code='"+ messenger_code + "',\
                messenger_name='"+ messenger_name + "',\
                car_type='"+ car_type + "',\
                shipment_staff_1='"+ staff1 + "',\
                shipment_staff_2='"+ staff2 + "',\
                shipment_staff_3='"+ staff3 + "',\
                trip='"+ trip + "',\
                Zone='"+ zone + "' \
                WHERE (tsc_document IN ("+ sql_where_in + "'inwadmin') )"
                // console.log(sql_query);
            req.query(sql_query).then((result) => {
                console.log(result);
                pool.close()
                if (result.rowsAffected > 0) {
                    save_log(result, "update_status", "TMS_Special_Circles", data)
                    callback(server_response(200, "Success", result.rowsAffected))
                }else{
                    save_log(result, "update_status", "TMS_Special_Circles", data)
                    callback(server_response(203, "None data query", result.rowsAffected))
                }
            }).catch((err) => {
                save_log(err, "update_status", "TMS_Special_Circles", data)
                callback(server_response(501, "Error query SQL", err))
            })
        })
    },
    gen_tsc_document(callback) {
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            var req = new sql.Request(pool)

            var sql_query = "SELECT        TOP (1) tsc_document \
            FROM           TMS_Special_Circles \
            ORDER BY tsc_document DESC"

            req.query(sql_query).then((result) => {
                pool.close()
                if (result.recordset.length > 0) {
                    Gen_Document5digit("TSC", result.recordset[0].tsc_document, (res_data) => {
                        save_log(res_data, "gen_tsc_document", "TSC", res_data)
                        callback(res_data)
                    })
                } else {
                    Gen_Document5digit("TSC", "", (res_data) => {
                        save_log(res_data, "gen_tsc_document", "TSC", res_data)
                        callback(res_data)
                    })
                }
            }).catch((err) => {
                if (err) throw err;
            });
        })
    },
    create_tsc_one(data, callback) {
        this.gen_tsc_document((res_data) => {
            //------กำหนดค่าให้กับตัวแปรตามฟิลด์

            var tsc_document = res_data
            var create_date = moment().format("YYYY-MM-DD H:m:s")
            var user_request_code = data.user_request_code
            var user_request_name = data.user_request_name
            var user_request_department = data.user_request_department
            var user_request_tel = data.user_request_tel
            var receive_from = data.receive_from
            var receive_date = data.receive_date
            var receive_time_first = data.receive_time_first
            var receive_time_end = data.receive_time_end
            var send_to = data.send_to
            var send_date = data.send_date
            var send_time_first = data.send_time_first
            var send_time_end = data.send_time_end
            var send_tel = data.send_tel
            var task_group = data.task_group
            var task_group_document = data.task_group_document
            var task_group_amount = data.task_group_amount
            var task_group_quantity = data.task_group_quantity
            var task_group_pic = data.task_group_pic
            var comment = data.comment
            var work_type = data.work_type
            var status = data.status
            var messenger_code = data.messenger_code
            var messenger_name = data.messenger_name
            var car_type = data.car_type
            var shipment_staff_1 = data.shipment_staff_1
            var shipment_staff_2 = data.shipment_staff_2
            var messenger_comment = data.messenger_comment
            var task_detail = data.task_detail
            var status_finish = data.status_finish
            var customerID = data.customerID
            var customerName = data.customerName
            var Zone = data.Zone
            var address_shipment = data.address_shipment
            var detail_cn = data.detail_cn

            sql.close()
            const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
            pool.connect(err => {
                if (err) {
                    save_log("Connection is close", "create_tsc_one", "TMS_Special_Circles", "No connection")
                    callback(server_response(500, "Connection is close", ""))
                }
                const transaction = new sql.Transaction(pool)
                transaction.begin(err => {
                    if (err) callback(server_response(500, "Connection is close", ""));
                    let rolledBack = false
                    transaction.on("rollback", aborted => {
                        rolledBack = true
                    })
                    var req = new sql.Request(transaction)

                    var sql_query = "INSERT INTO TMS_Special_Circles \
                    ([tsc_document]\
                     ,[create_date]\
                     ,[user_request_code]\
                     ,[user_request_name]\
                     ,[user_request_department]\
                     ,[user_request_tel]\
                     ,[receive_from]\
                     ,[receive_date]\
                     ,[receive_time_first]\
                     ,[receive_time_end]\
                     ,[send_to]\
                     ,[send_date]\
                     ,[send_time_first]\
                     ,[send_time_end]\
                     ,[send_tel]\
                     ,[task_group]\
                     ,[task_group_document]\
                     ,[task_group_amount]\
                     ,[task_group_quantity]\
                     ,[task_group_pic]\
                     ,[comment]\
                     ,[work_type]\
                     ,[status]\
                     ,[messenger_code]\
                     ,[messenger_name]\
                     ,[car_type]\
                     ,[shipment_staff_1]\
                     ,[shipment_staff_2]\
                     ,[messenger_comment]\
                     ,[task_detail]\
                     ,[status_finish]\
                     ,[customerID]\
                     ,[customerName]\
                     ,[Zone]\
                     ,[address_shipment] \
                     ,[detail_cn])\
                     VALUES \
                     ( '"+ tsc_document + "'\
                     ,'"+ create_date + "'\
                     ,'"+ user_request_code + "'\
                     ,'"+ user_request_name + "'\
                     ,'"+ user_request_department + "'\
                     ,'"+ user_request_tel + "'\
                     ,'"+ receive_from + "'\
                     ,'"+ receive_date + "'\
                     ,'"+ receive_time_first + "'\
                     ,'"+ receive_time_end + "'\
                     ,'"+ send_to + "'\
                     ,'"+ send_date + "'\
                     ,'"+ send_time_first + "'\
                     ,'"+ send_time_end + "'\
                     ,'"+ send_tel + "'\
                     ,'"+ task_group + "'\
                     ,'"+ task_group_document + "'\
                     ,'"+ task_group_amount + "'\
                     ,'"+ task_group_quantity + "'\
                     ,'"+ task_group_pic + "'\
                     ,'"+ comment + "'\
                     ,'"+ work_type + "'\
                     ,'"+ status + "'\
                     ,'"+ messenger_code + "'\
                     ,'"+ messenger_name + "'\
                     ,'"+ car_type + "'\
                     ,'"+ shipment_staff_1 + "'\
                     ,'"+ shipment_staff_2 + "'\
                     ,'"+ messenger_comment + "'\
                     ,'"+ task_detail + "'\
                     ,'"+ status_finish + "'\
                     ,'"+ customerID + "'\
                     ,'"+ customerName + "'\
                     ,'"+ Zone + "'\
                     ,'"+ address_shipment + "'\
                     ,'"+ detail_cn + "' )"

                    req.query(sql_query, (err, result) => {
                        if (err) {
                            if (!rolledBack) {
                                transaction.rollback(err => {
                                    if (err) callback(server_response(501, "Error query SQL", err));
                                    pool.close()
                                    // console.log("sql_query", sql_query)
                                    save_log(result, "create_tsc_one", "TMS_Special_Circles", data)
                                    callback(server_response(501, "Error query SQL", err))
                                })
                            }
                        } else {
                            transaction.commit(err => {
                                pool.close()
                                if (err) callback(server_response(501, "Error query SQL", err));
                                save_log(result, "create_tsc_one", "TMS_Special_Circles", data)
                                callback(server_response(200, "Success", result.recordset))
                            })
                        }
                    })
                })
            })
        })
    },
    find_between_date(date_start, date_end, callback) {
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            var req = new sql.Request(pool)

            var sql_query = "SELECT        id, tsc_document, create_date, user_request_code, user_request_name, user_request_department, user_request_tel, receive_from, CONVERT(varchar(10), receive_date, 120) AS receive_date, receive_time_first \
            ,receive_time_end, send_to, send_date, send_time_first, send_time_end, send_tel, task_group, task_group_document, task_group_amount, task_group_quantity, task_group_pic, comment, work_type, status, messenger_code \
            ,messenger_name, car_type, shipment_staff_1, shipment_staff_2, shipment_staff_3, messenger_comment, task_detail, status_finish, customerID, customerName, Zone, address_shipment, detail_cn, status_clear \
            ,time_update \
            FROM            dbo.TMS_Special_Circles \
            WHERE        (CONVERT(varchar(10), receive_date, 120) BETWEEN '"+ date_start + "' AND '" + date_end + "')"

            req.query(sql_query).then((result) => {
                pool.close()
                if (result.recordset.length > 0) {
                    save_log(result.recordset, "find_between_date", "TMS_Special_Circles", result.recordset)
                    callback(server_response(200, "Success", result.recordset))
                } else {
                    save_log(result.recordset, "find_between_date", "TMS_Special_Circles", result.recordset)
                    callback(server_response(500, "Error", result.recordset))
                }
            }).catch((err) => {
                if (err) throw err;
            });
        })
    }
}

module.exports = {
    model: model
}