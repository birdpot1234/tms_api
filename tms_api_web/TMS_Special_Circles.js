var { dbConnectData_TransportApp } = require('../connect_sql')
const { Gen_Document5digit, save_log } = require("../service")
var sql = require('mssql')

const model = {
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
                        callback(res_data)
                    })
                } else {
                    Gen_Document5digit("TSC", "", (res_data) => {
                        callback(res_data)
                    })
                }
            }).catch((err) => {
                if (err) throw err;
            });
        })
    },
    create_tsc_one(callback) {
        this.gen_tsc_document((res_data) => {
            var tsc_document = res_data
            sql.close()
            const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
            pool.connect(err => {
                if(err)throw err;
                const transaction = new sql.Transaction(pool)
                transaction.begin(err => {
                    if(err)throw err;
                    let rolledBack = false
                    transaction.on("rollback", aborted => {
                        rolledBack = true
                    })
                    var req = new sql.Request(transaction)

                    var sql_query = "INSERT INTO TMS_Special_Circles \
                    ([tsc_document]) VALUES ('"+ tsc_document + "')"
                   /* ,[create_date]\
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
                    ,[detail_cn]) \ 
                    VALUES \
                    ( '"+ tsc_document + "',\
                    '',\
                    '',\
                    '',\
                    '',\
                    '',\
                    '',\
                    '',\
                    '',\
                    '',\
                    '',\
                    '',\
                    '',\
                    '',\
                    '',\
                    '',\
                    '',\
                    '',\
                    '',\
                    '',\
                    '',\
                    '',\
                    '',\
                    '',\
                    '',\
                    '',\
                    '',\
                    '',\
                    '',\
                    '',\
                    '',\
                    '',\
                    '',\
                    '',\
                    '',\
                    '',\
                    '',\ )"*/

                    req.query(sql_query, (err, result) => {
                        console.log("object",result)
                        if (err) {
                            if(err)throw err;
                            if (!rolledBack) {
                                transaction.rollback(err => {
                                    if(err)throw err;
                                })
                            } 
                        }else {
                            transaction.commit(err => {
                                pool.close()
                                if(err)throw err;
                                callback(result)
                            })
                        }
                    })
                })
            })
        })
    },
    find_by_id_pass(id, pass, callback) {
        // sql.close()
        // const pool = new sql.ConnectionPool(dbConnectDplusSystem)
        // pool.connect(err => {
        //     if (err) throw err;
        //     var req = new sql.Request(pool)
        //     req.input("in_id", sql.VarChar, id)
        //     req.input("in_pass", sql.VarChar, pass)

        //     var sql_query = "SELECT   ID_User, Username, Password, Email, DepartmentNo, Last_Login, Name, NickName, Salecode, Level_User, Boss, Sup, Sup_dep, Tel_No, Tel_Dplus, Blocked, Remark, Position_No, ConfirmData, HcmUserId, \
        //     isChangePass, Sub_Dept, Create_Date \
        //     FROM            DPLT_ADDP_DplusSystem_User \
        //     WHERE(ID_User = @in_id) AND(Password = @in_pass)"

        //     req.query(sql_query).then((result) => {
        //         pool.close()
        //         callback(result)
        //     }).catch((err) => {
        //         if (err) throw err;
        //     });

        // })
    }
}

module.exports = {
    model: model
}