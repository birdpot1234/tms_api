var { dbConnectData_TransportApp } = require('../connect_sql')
const { Gen_Document5digit, save_log, server_response, select_query, insert_query } = require("../service")
const moment = require('moment')
var sql = require('mssql')
var sql_insert = []


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
                    callback(server_response(200, "Success", result.recordset))
                } else {
                    save_log(result, "check_status", "TMS_Special_Circles", result)
                    callback(server_response(204, "Status not 0", result.recordset))
                }
            }).catch((err) => {
                save_log(err, "check_status", "TMS_Special_Circles", err)
                callback(server_response(500, "Query Error", err))
            });
        })
    },
    update_status(data, callback) {
        //--------------Status = 3
        let status, tsc_document, invoice, car_type, staff1, staff2, staff3, zone, trip, messenger_code, messenger_name
        let sql_where_in = ""
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
                } else {
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
    create_tsc_one(inData, callback) {
        nameFN = "create_tsc_one"
        nameTB = "[TMS_Special_Circles]"
        this.gen_tsc_document(async (res_data) => {
            sql_insert = []
            console.log("inData", inData)
            inData.forEach((val, i) => {
                if (val.pictures.length > 0) {
                    val.pictures.forEach((valPic, iPic) => {
                        sql_insert.push(`
                    INSERT INTO [dbo].[TMS_Special_Picture]
                        ([tsc_document]
                        ,[picture])
                    VALUES
                        ('${res_data}'
                        ,'${valPic}')
                    `)
                    });
                }
                sql_insert.push(`INSERT INTO [dbo].[TMS_Special_Circles]
                ([tsc_document]
                ,[create_date]
                ,[user_request_email]
                ,[user_request_code]
                ,[user_request_name]
                ,[user_request_department]
                ,[user_request_tel]
                ,[receive_from]
                ,[receive_date]
                ,[receive_time_first]
                ,[send_to]
                ,[send_date]
                ,[send_time_first]
                ,[send_tel]
                ,[task_group]
                ,[task_group_document]
                ,[task_group_amount]
                ,[comment]
                ,[typework]
                ,[Code_Zone]
                ,[Zone])
          VALUES
                ('${res_data}'
                ,GETDATE()
                ,'${val.user_request_email}'
                ,'${val.user_request_code}'
                ,'${val.user_request_name}'
                ,'${val.user_request_department}'
                ,'${val.user_request_tel}'
                ,'${val.receive_from}'
                ,'${moment(val.receive_date).format("YYYY-MM-DD")}'
                ,'${moment(val.receive_time_first).format('H:m:s')}'
                ,'${val.send_to}'
                ,'${moment(val.send_date).format("YYYY-MM-DD")}'
                ,'${moment(val.send_time_first).format('H:m:s')}'
                ,'${val.send_tel}'
                ,'${val.task_group}'
                ,'${val.task_group_document}'
                ,'${val.task_group_amount}'
                ,'${val.comment}'
                ,'${val.typework}'
                ,'${val.code_zone}'
                ,'${val.zone}')`)
            });
            // console.log("sql_insert",sql_insert.join(" "))
            try {
                var res_query = await insert_query(dbConnectData_TransportApp, nameFN, nameTB, sql_insert.join(" "))
                if(res_query.status==200){
                    this.find_by_tsc(res_data,(res_tsc)=>{
                        callback(res_tsc)
                    })
                }
            } catch (error) {
                callback(error)
            }
        })
    },
    async find_by_tsc(in_tsc,callback){
        var nameFN = "find_by_tsc"
        var nameTB = "TMS_Special_Circles"
        var sql_query = `SELECT * FROM TMS_Special_Circles WHERE tsc_document = '${in_tsc}'`
        var res_query = await select_query(dbConnectData_TransportApp, nameFN, nameTB, sql_query)
        callback(res_query)
    },
    find_today_date(date_start, callback) {
        let whereDate = moment(date_start).day(-1)
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            var req = new sql.Request(pool)

            var sql_query = `SELECT        id, tsc_document, create_date, user_request_code, user_request_name, user_request_department, user_request_tel, receive_from, CONVERT(varchar(10), receive_date, 120) AS receive_date, CONVERT(varchar(5), 
            receive_time_first, 114) AS receive_time_first, receive_time_end, send_to, CONVERT(varchar(10), send_date, 120) AS send_date, CONVERT(varchar(5), send_time_first, 114) AS send_time_first, send_time_end, send_tel, 
            task_group, task_group_document, task_group_amount, task_group_quantity, task_group_pic, comment, work_type, status, messenger_code, messenger_name, car_type, shipment_staff_1, shipment_staff_2, shipment_staff_3, 
            messenger_comment, task_detail, status_finish, customerID, customerName, Zone, address_shipment, detail_cn, status_clear, time_update, CASE WHEN CONVERT(varchar(2), create_date, 114) 
            > 16 THEN 2 ELSE 0 END AS day_task
            FROM            dbo.TMS_Special_Circles
            WHERE          (CONVERT(VARCHAR(10), create_date, 120) = CONVERT(varchar(10), GETDATE(), 120)) AND (status = 0)
            ORDER BY create_date DESC `
            // console.log("sql_query",sql_query)
            req.query(sql_query).then((result) => {
                pool.close()
                // console.log(sql_query,result);
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
    },
    find_over_date(date_start, callback) {
        let whereDate = moment(date_start).day(-1)
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            var req = new sql.Request(pool)

            var sql_query = "SELECT        id, tsc_document, create_date, user_request_code, user_request_name, user_request_department, user_request_tel, receive_from, CONVERT(varchar(10), receive_date, 120) AS receive_date, CONVERT (varchar(5), receive_time_first, 114) AS receive_time_first \
            ,receive_time_end, send_to, CONVERT(varchar(10), send_date, 120) AS send_date, CONVERT (varchar(5), send_time_first, 114) AS send_time_first, send_time_end, send_tel, task_group, task_group_document, task_group_amount, task_group_quantity, task_group_pic, comment, work_type, status, messenger_code \
            ,messenger_name, car_type, shipment_staff_1, shipment_staff_2, shipment_staff_3, messenger_comment, task_detail, status_finish, customerID, customerName, Zone, address_shipment, detail_cn, status_clear \
            ,time_update,CASE WHEN CONVERT (varchar(2) , create_date , 114) > 16 THEN 2 ELSE 0 END AS day_task \
            FROM            dbo.TMS_Special_Circles \
            WHERE       ( CONVERT(VARCHAR(10),create_date,120) BETWEEN '"+moment().subtract(60,"days").format("YYYY-MM-DD")+"' AND GETDATE() ) AND (CONVERT(VARCHAR(10), create_date, 120) < CONVERT(varchar(10), GETDATE(), 120)) AND (status <> 10)\
            ORDER BY create_date DESC "

            req.query(sql_query).then((result) => {
                pool.close()
                // console.log(sql_query,result);
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
    },
    async get_zone(callback) {
        var nameFN = "get_zone"
        var nameTB = "RoundCost"
        var sql_query = `SELECT ship_code, ship_name
        FROM dbo.RoundCost
        GROUP BY ship_code, ship_name
        ORDER BY ship_code`
        var res_query = await select_query(dbConnectData_TransportApp, nameFN, nameTB, sql_query)
        callback(res_query)
    },
    async delete_task(tsc,callback){
        var nameFN = "delete_task"
        var nameTB = "TMS_Special_Circles"
        var sql_query = `DELETE FROM TMS_Special_Circles
        WHERE tsc_document LIKE '${tsc}'`
        console.log("sql_query",sql_query);
        var res_query = await insert_query(dbConnectData_TransportApp, nameFN, nameTB, sql_query)
        console.log("res_query",res_query);
        callback(res_query)
    }
}

module.exports = {
    model: model
}