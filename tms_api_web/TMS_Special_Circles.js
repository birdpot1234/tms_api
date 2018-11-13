var { dbConnectData_TransportApp } = require('../connect_sql')
const { Gen_Document5digit, save_log,server_response } = require("../service")
const moment = require('moment')
var sql = require('mssql')
//11//
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
                        save_log(res_data,"gen_tsc_document","TSC",res_data)
                        callback(res_data)
                    })
                } else {
                    Gen_Document5digit("TSC", "", (res_data) => {
                        save_log(res_data,"gen_tsc_document","TSC",res_data)
                        callback(res_data)
                    })
                }
            }).catch((err) => {
                if (err) throw err;
            });
        })
    },
    create_tsc_one(data,callback) {
        this.gen_tsc_document((res_data) => {
            //------กำหนดค่าให้กับตัวแปรตามฟิลด์

            var tsc_document = res_data
            var create_date = moment().format("YYYY-MM-DD H:m:s")
            var user_request_code=data.user_request_code
            var user_request_name=data.user_request_name
            var user_request_department=data.user_request_department
            var user_request_tel=data.user_request_tel
            var receive_from=data.receive_from
            var receive_date=data.receive_date
            var receive_time_first=data.receive_time_first
            var receive_time_end=data.receive_time_end
            var send_to=data.send_to
            var send_date=data.send_date
            var send_time_first=data.send_time_first
            var send_time_end=data.send_time_end
            var send_tel=data.send_tel
            var task_group=data.task_group
            var task_group_document=data.task_group_document
            var task_group_amount=data.task_group_amount
            var task_group_quantity=data.task_group_quantity
            var task_group_pic=data.task_group_pic
            var comment=data.comment
            var work_type=data.work_type
            var status=data.status
            var messenger_code=data.messenger_code
            var messenger_name=data.messenger_name
            var car_type=data.car_type
            var shipment_staff_1=data.shipment_staff_1
            var shipment_staff_2=data.shipment_staff_2
            var messenger_comment=data.messenger_comment
            var task_detail=data.task_detail
            var status_finish=data.status_finish
            var customerID=data.customerID
            var customerName=data.customerName
            var Zone=data.Zone
            var address_shipment=data.address_shipment
            var detail_cn=data.detail_cn
          
            sql.close()
            const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
            pool.connect(err => {
                if (err) {
                    save_log("Connection is close","create_tsc_one","TMS_Special_Circles","No connection")
                    callback(server_response(500,"Connection is close",""))
                }
                const transaction = new sql.Transaction(pool)
                transaction.begin(err => {
                    if (err) callback(server_response(500,"Connection is close",""));
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
                     ( '"+ tsc_document +"'\
                     ,'"+create_date+"'\
                     ,'"+user_request_code+"'\
                     ,'"+user_request_name+"'\
                     ,'"+user_request_department+"'\
                     ,'"+user_request_tel+"'\
                     ,'"+receive_from+"'\
                     ,'"+receive_date+"'\
                     ,'"+receive_time_first+"'\
                     ,'"+receive_time_end+"'\
                     ,'"+send_to+"'\
                     ,'"+send_date+"'\
                     ,'"+send_time_first+"'\
                     ,'"+send_time_end+"'\
                     ,'"+send_tel+"'\
                     ,'"+task_group+"'\
                     ,'"+task_group_document+"'\
                     ,'"+task_group_amount+"'\
                     ,'"+task_group_quantity+"'\
                     ,'"+task_group_pic+"'\
                     ,'"+comment+"'\
                     ,'"+work_type+"'\
                     ,'"+status+"'\
                     ,'"+messenger_code+"'\
                     ,'"+messenger_name+"'\
                     ,'"+car_type+"'\
                     ,'"+shipment_staff_1+"'\
                     ,'"+shipment_staff_2+"'\
                     ,'"+messenger_comment+"'\
                     ,'"+task_detail+"'\
                     ,'"+status_finish+"'\
                     ,'"+customerID+"'\
                     ,'"+customerName+"'\
                     ,'"+Zone+"'\
                     ,'"+address_shipment+"'\
                     ,'"+detail_cn+"' )"

                    req.query(sql_query, (err, result) => {
                        if (err) {
                            if (!rolledBack) {
                                transaction.rollback(err => {
                                    if (err) callback(server_response(501,"Error query SQL",err));
                                    pool.close()
                                    console.log("sql_query",sql_query)
                                    save_log(result,"create_tsc_one","TMS_Special_Circles",data)
                                    callback(server_response(501,"Error query SQL",err))
                                })
                            }
                        } else {
                            transaction.commit(err => {
                                pool.close()
                                if (err) callback(server_response(501,"Error query SQL",err));
                                save_log(result,"create_tsc_one","TMS_Special_Circles",data)
                                callback(server_response(200,"Success",result.recordset))
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