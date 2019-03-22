var { dbConnectData_TransportApp } = require('../connect_sql')
const { get_decryption, save_log, server_response } = require("../service")
const moment = require('moment')
var sql = require('mssql')

const model = {
    get_head_rate(callback) {
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            if (err) {
                save_log(err, "get_head_rate", "TMS_Assessment_Head", err)
                callback(server_response(500, "Error", err))
            }
            var req = new sql.Request(pool)
            var sql_query = "SELECT  assessment_id, subject, group_id \
            FROM            TMS_Assessment_Head \
            ORDER BY group_id ASC"
            // console.log("object",sql_query)
            req.query(sql_query).then((result, err) => {
                pool.close()
                if (result.recordset.length > 0) {
                    save_log(result.recordset, "get_head_rate", "TMS_Assessment_Head", result.recordset)
                    callback(server_response(200, "Success", result.recordset))
                } else {
                    save_log(result.recordset, "get_head_rate", "TMS_Assessment_Head", result.recordset)
                    callback(server_response(304, "None data this query", result.recordset))
                }
            }).catch((err) => {
                if (err) {
                    save_log(err, "get_head_rate", "TMS_Assessment_Head", err)
                    callback(server_response(500, "Error", err))
                }
            });
        })
    },
    get_data_customer(data, callback) {
        get_decryption(data.rate.customer, (res_data) => {

            var getCustomer = res_data.split(":")
            // console.log("res_data",getCustomer)
            var cusCode = getCustomer[0], roundSeed = getCustomer[2], rateDate = getCustomer[1]
            sql.close()
            const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
            pool.connect(err => {
                if (err) {
                    save_log(err, "get_data_customer", "TMS_sendMail", err)
                    callback(server_response(500, "Error", err))
                }
                var req = new sql.Request(pool)
                var sql_query = "SELECT  customerCode, customerName, Email, Invoice, MessNo, roundSeed, convert(varchar(7),datetime,120) AS rate_date, id, status \
                FROM            TMS_sendMail\
                WHERE customerCode LIKE '"+ cusCode + "' AND roundSeed LIKE '" + roundSeed + "' AND convert(varchar(7),datetime,120) LIKE '" + rateDate + "' "
                console.log("object", sql_query)
                req.query(sql_query).then((result, err) => {
                    pool.close()
                    console.log("res", result)
                    if (result.recordset.length > 0) {
                        save_log(result.recordset, "get_data_customer", "TMS_sendMail", result.recordset)
                        callback(server_response(200, "Success", result.recordset))
                    } else {
                        save_log(result.recordset, "get_data_customer", "TMS_sendMail", result.recordset)
                        callback(server_response(304, "None data this query", result.recordset))
                    }
                }).catch((err) => {
                    if (err) {
                        save_log(err, "get_data_customer", "TMS_sendMail", err)
                        callback(server_response(500, "Error", err))
                    }
                });
            })
        })
    },
    create_assessment_rate(data, callback) {
        // console.log("object",data)
        // let callback=callback
        var point, create_date, rate_date, customer_code, customer_name, customer_email, comment, round, rate_id, rate_group
        this.get_data_customer(data, (res_data_customer) => {
            customer_code = res_data_customer.result[0].customerCode
            customer_name = res_data_customer.result[0].customerName
            round = res_data_customer.result[0].roundSeed
            create_date = moment().format("YYYY-MM-DD H:m:s")
            rate_date = res_data_customer.result[0].rate_date
            customer_email = res_data_customer.result[0].Email

            sql.close()
            const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
            pool.connect(err => {
                if (err) {
                    save_log(err, "create_assessment_rate", "TMS_Assessment_Rate", err)
                    callback(server_response(500, "Error", err))
                }
                const transaction = new sql.Transaction(pool)
                transaction.begin(err => {
                    if (err) callback(server_response(500, "Connection is close", ""));
                    let rolledBack = false
                    transaction.on("rollback", aborted => {
                        rolledBack = true
                    })
                    var req = new sql.Request(transaction)
                    var sql_query = ""

                    point = data.rate.point
                    comment = data.rate.comment

                    var sql_query_rate = "INSERT INTO [dbo].[TMS_Assessment_Rate] \
            ([point] \
            ,[create_date] \
            ,[rate_date]\
            ,[customer_code]\
            , [customer_name]\
            ,[round]\
            ,[comment]\
            , [customer_email]) \
            VALUES \
                ('"+ point + "', \
                '"+ create_date + "', \
                '"+ rate_date + "',\
                '"+ customer_code + "'\
                ,'"+ customer_name + "'\
                ,'"+ round + "'\
                ,'"+ comment + "'\
                ,'"+ customer_email + "')"
                    if (data.rate.point < 4) {
                        rate_id = data.tran.rate_id
                        rate_group = data.tran.rate_group
                        point = data.tran.point
                        var sql_query_tran = "INSERT INTO [dbo].[TMS_Assessment_Tran]\
                    ([customer_code]\
                        , [customer_name]\
                        , [customer_email]\
                        , [create_date]\
                        , [rate_id]\
                        , [rate_group]\
                        , [rate_date]\
                        ,[round]\
                        , [point])\
                VALUES\
                    ('"+ customer_code + "'\
                    ,'"+ customer_name + "'\
                    ,'"+ customer_email + "'\
                    ,'"+ create_date + "'\
                    ,'"+ rate_id + "'\
                    ,'"+ rate_group + "'\
                    ,'"+ rate_date + "'\
                    ,'"+ round + "'\
                    ,'"+ point + "')"
                        sql_query = sql_query_rate + sql_query_tran
                    } else {
                        sql_query = sql_query_rate
                    }
                    // console.log("sql_query",sql_query)
                    req.query(sql_query).then((result, err) => {
                        if (err) {
                            if (!rolledBack) {
                                transaction.rollback(err => {
                                    if (err) callback(server_response(501, "Error query SQL", err));
                                    pool.close()
                                    // console.log("sql_query", sql_query)
                                    save_log(result, "create_assessment_rate", "TMS_Assessment_Rate", data)
                                    callback(server_response(501, "Error query SQL", err))
                                })
                            }
                        } else {
                            transaction.commit(err => {
                                pool.close()
                                if (err) callback(server_response(501, "Error query SQL", err));
                                save_log(result, "create_assessment_rate", "TMS_Assessment_Rate", data)
                                callback(server_response(200, "Success", result.recordset))
                            })
                        }
                    }).catch((err) => {
                        if (err) {
                            save_log(err, "create_assessment_rate", "TMS_Assessment_Rate", err)
                            callback(server_response(500, "Error", err))
                        }
                    });
                })
            })
        })
    },
    get_check_rate_already(in_data, callback) {
        get_decryption(in_data, (res_data) => {

            var getCustomer = res_data.split(":")
            // console.log("res_data",getCustomer)
            var cusCode = getCustomer[0], roundSeed = getCustomer[2], rateDate = getCustomer[1]
            sql.close()
            const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
            pool.connect(err => {
                if (err) {
                    save_log(err, "get_check_rate_already", "TMS_sendMail", err)
                    callback(server_response(500, "Error", err))
                }
                var req = new sql.Request(pool)
                var sql_query = "SELECT     COUNT(rate_date) AS rate \
                FROM            TMS_Assessment_Rate  \
                WHERE customer_code LIKE '"+ cusCode + "' AND round LIKE '" + roundSeed + "' AND rate_date LIKE '" + rateDate + "' "
                // console.log("object", sql_query)
                req.query(sql_query).then((result, err) => {
                    pool.close()
                    // console.log("res", result)
                    if (result.recordset.length > 0) {
                        save_log(result.recordset, "get_check_rate_already", "TMS_sendMail", result.recordset)
                        callback(server_response(200, "Success", result.recordset))
                    } else {
                        save_log(result.recordset, "get_check_rate_already", "TMS_sendMail", result.recordset)
                        callback(server_response(304, "None data this query", result.recordset))
                    }
                }).catch((err) => {
                    if (err) {
                        save_log(err, "get_data_customer", "TMS_sendMail", err)
                        callback(server_response(500, "Error", err))
                    }
                });
            })
        })
    }
}

module.exports = {
    model: model
}