var { dbConnectData_TransportApp } = require('../connect_sql')
const { Gen_Document5digit, save_log, server_response } = require("../service")
const moment = require('moment')
var sql = require('mssql')

const model = {
    get_cause_data(callback) {
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            if (err) {
                save_log(err, "get_cause_data", "TMS_Cause_Cars_Round", err)
                callback(server_response(500, "Error", err))
            }
            var req = new sql.Request(pool)
            var sql_query = "SELECT       id, cause\
            FROM            TMS_Cause_Cars_Round"
            // console.log("object", sql_query)
            req.query(sql_query).then((result, err) => {
                pool.close()
                // console.log("res", result)
                if (result.recordset.length > 0) {
                    save_log(result.recordset, "get_cause_data", "TMS_Cause_Cars_Round", result.recordset)
                    callback(server_response(200, "Success", result.recordset))
                } else {
                    save_log(result.recordset, "get_cause_data", "TMS_Cause_Cars_Round", result.recordset)
                    callback(server_response(304, "None data this query", result.recordset))
                }
            }).catch((err) => {
                if (err) {
                    save_log(err, "get_cause_data", "TMS_Cause_Cars_Round", err)
                    callback(server_response(500, "Error", err))
                }
            });
        })
    },
    create_cause_data(in_data, callback) {
        sql.close()
        var in_text = ""
        in_data = (typeof in_data == "undefined") ? [] : in_data
        in_data.forEach((val, i) => {
            in_text = val.cause
        });
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            if (err) {
                save_log(err, "create_cause_data", "TMS_Calendar", err)
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
                var sql_query = "INSERT INTO [dbo].[TMS_Cause_Cars_Round]\
                ([cause])\
                    VALUES\
                ('"+ in_text + "')"
                req.query(sql_query).then((result, err) => {
                    if (err) {
                        if (!rolledBack) {
                            transaction.rollback(err => {
                                if (err) callback(server_response(501, "Error query SQL", err));
                                pool.close()
                                // console.log("sql_query", sql_query)
                                save_log(result, "create_cause_data", "TMS_Calendar", in_data)
                                callback(server_response(501, "Error query SQL", err))
                            })
                        }
                    } else {
                        transaction.commit(err => {
                            pool.close()
                            if (err) callback(server_response(501, "Error query SQL", err));
                            save_log(result, "create_cause_data", "TMS_Calendar", in_data)
                            callback(server_response(200, "Success", result.recordset))
                        })
                    }
                }).catch((err) => {
                    if (err) {
                        save_log(err, "create_cause_data", "TMS_Calendar", err)
                        callback(server_response(500, "Error", err))
                    }
                });
            })
        })
    },
    get_cars(start_date, end_date, callback) {
        sql.close()
        
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            if (err) {
                save_log(err, "get_cars", "TMS_Check_Cars", err)
                callback(server_response(500, "Error", err))
            }
            var req = new sql.Request(pool)
            var sql_query = "SELECT * FROM TMS_Cars WHERE license NOT IN(\
                SELECT        dbo.TMS_Cars.license\
                FROM            dbo.TMS_Cars_Calendar RIGHT OUTER JOIN\
                                         dbo.TMS_Cars ON dbo.TMS_Cars_Calendar.car_license = dbo.TMS_Cars.license\
                WHERE       (CONVERT(varchar(20), dbo.TMS_Cars_Calendar.end_date, 120) > '"+start_date+"') AND (CONVERT(varchar(20), dbo.TMS_Cars_Calendar.start_date, 120) < '"+end_date+"') )"
            console.log("object",sql_query)
            req.query(sql_query).then((result, err) => {
                pool.close()
                // console.log("res", result)
                if (result.recordset.length > 0) {
                    save_log(result.recordset, "get_cars", "TMS_Check_Cars", result.recordset)
                    callback(server_response(200, "Success", result.recordset))
                } else {
                    save_log(result.recordset, "get_cars", "TMS_Check_Cars", result.recordset)
                    callback(server_response(304, "None data this query", result.recordset))
                }
            }).catch((err) => {
                if (err) {
                    save_log(err, "get_cars", "TMS_Check_Cars", err)
                    callback(server_response(500, "Error", err))
                }
            });
        })
    },
    get_last_calendar(callback) {
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            if (err) {
                save_log(err, "get_last_calendar", "TMS_Calendar", err)
                callback(server_response(500, "Error", err))
            }
            var req = new sql.Request(pool)
            var sql_query = "SELECT        TOP (1) document_no\
            FROM            TMS_Cars_Calendar\
            ORDER BY document_no DESC"
            // console.log("object", sql_query)
            req.query(sql_query).then((result, err) => {
                pool.close()
                callback(server_response(200, "Success", result.recordset))
            }).catch((err) => {
                if (err) {
                    save_log(err, "get_last_calendar", "TMS_Calendar", err)
                    callback(server_response(500, "Error", err))
                }
            });
        })
    },
    create_task(in_data, last_doc, callback) {
        sql.close()
        var document_no, linenumber, car_license, car_type, create_date, start_date, end_date, start_point, end_point, remark, status, qty_product, rec_time, exit_time, finish_time, mess_code, cause_id
        in_data = (typeof in_data == "undefined") ? [] : in_data
        var sql_insert = ""
        // console.log("last_doc",last_doc.length)
        last_doc = (last_doc.length==0) ? "" : last_doc[0].document_no
        in_data.forEach((val, i) => {
            Gen_Document5digit("TCD", last_doc, (get_doc) => {
                document_no = get_doc
                car_license = val.car_license
                car_type = val.car_type
                create_date = moment().format("YYYY-MM-DD H:m:s")
                start_date = val.start_date
                end_date = val.end_date
                start_point = val.start_point
                end_point = val.end_point
                remark = val.remark
                status = 0
                // rec_time = moment().format("H:m:s")
                // exit_time = moment().format("H:m:s")
                // finish_time = moment().format("H:m:s")
                mess_code = val.mess_code
                last_doc = get_doc

                if (in_data.length == (i + 1)) {
                    sql_insert += "'" + document_no + "',\
                    '"+ car_license + "',\
                    '"+ car_type + "',\
                    '"+ create_date + "',\
                    '"+ start_date + "',\
                    '"+ end_date + "',\
                    '"+ start_point + "',\
                    '"+ end_point + "',\
                    '"+ remark + "',\
                    '"+ status + "',\
                    '"+ mess_code + "'"
                } else {
                    sql_insert += "'" + document_no + "',\
                    '"+ car_license + "',\
                    '"+ car_type + "',\
                    '"+ create_date + "',\
                    '"+ start_date + "',\
                    '"+ end_date + "',\
                    '"+ start_point + "',\
                    '"+ end_point + "',\
                    '"+ remark + "',\
                    "+ status + ",\
                    '"+ mess_code + "',"
                }
            })
        });
        // console.log("sql_insert",sql_insert)
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            if (err) {
                save_log(err, "create_task", "TMS_Calendar", err)
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
                var sql_query = "INSERT INTO [dbo].[TMS_Cars_Calendar]\
                ([document_no]\
                ,[car_license]\
                ,[car_type]\
                ,[create_date]\
                ,[start_date]\
                ,[end_date]\
                ,[start_point]\
                ,[end_point]\
                ,[remark]\
                ,[status]\
                ,[mess_code])\
          VALUES\
                ( "+ sql_insert + " )"
                // console.log("sql_query",sql_query)
                req.query(sql_query).then((result, err) => {
                    if (err) {
                        if (!rolledBack) {
                            transaction.rollback(err => {
                                if (err) callback(server_response(501, "Error query SQL", err));
                                pool.close()
                                // console.log("sql_query", sql_query)
                                save_log(result, "create_task", "TMS_Calendar", in_data)
                                callback(server_response(501, "Error query SQL", err))
                            })
                        }
                    } else {
                        transaction.commit(err => {
                            pool.close()
                            if (err) callback(server_response(501, "Error query SQL", err));
                            save_log(result, "create_task", "TMS_Calendar", in_data)
                            callback(server_response(200, "Success", result.recordset))
                        })
                    }
                }).catch((err) => {
                    if (err) {
                        save_log(err, "create_task", "TMS_Calendar", err)
                        callback(server_response(500, "Error", err))
                    }
                });
            })
        })
    },
    get_all_calendar(stMonth, endMonth, callback) {
        stMonth = moment(stMonth).format("YYYY-MM")
        endMonth = moment(endMonth).format("YYYY-MM")
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            if (err) {
                save_log(err, "get_all_calendar", "TMS_Cars_Calendar", err)
                callback(server_response(500, "Error", err))
            }
            var req = new sql.Request(pool)
            var sql_query = "SELECT  *\
            FROM            dbo.TMS_Cars_Calendar LEFT OUTER JOIN\
            dbo.Messenger ON dbo.TMS_Cars_Calendar.mess_code = dbo.Messenger.IDMess\
            WHERE        (CONVERT(varchar(10), start_date, 120) LIKE '"+ stMonth + "%') OR\
                         (CONVERT(varchar(10), end_date, 120) LIKE '"+ endMonth + "%')"
            console.log("object", sql_query)
            req.query(sql_query).then((result, err) => {
                pool.close()
                // console.log("res", result)
                if (result.recordset.length > 0) {
                    save_log(result.recordset, "get_all_calendar", "TMS_Cars_Calendar", result.recordset)
                    callback(server_response(200, "Success", result.recordset))
                } else {
                    save_log(result.recordset, "get_all_calendar", "TMS_Cars_Calendar", result.recordset)
                    callback(server_response(304, "None data this query", result.recordset))
                }
            }).catch((err) => {
                if (err) {
                    save_log(err, "get_all_calendar", "TMS_Cars_Calendar", err)
                    callback(server_response(500, "Error", err))
                }
            });
        })
    },
    get_report_calendar(stDate, endDate, callback) {
        stMonth = moment(stDate).format("YYYY-MM-DD")
        endMonth = moment(endDate).format("YYYY-MM-DD")
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            if (err) {
                save_log(err, "get_all_calendar", "TMS_Cars_Calendar", err)
                callback(server_response(500, "Error", err))
            }
            var req = new sql.Request(pool)
            var sql_query = "SELECT  *,cause as cause_name \
            FROM            dbo.TMS_Cars_Calendar LEFT OUTER JOIN\
            dbo.TMS_Cause_Cars_Round ON dbo.TMS_Cars_Calendar.cause_id = dbo.TMS_Cause_Cars_Round.id\
            WHERE        (CONVERT(varchar(10), start_date, 120) BETWEEN '"+ stMonth + "' AND '" + endMonth + "' ) OR\
            (CONVERT(varchar(10), end_date, 120) BETWEEN '"+ stMonth + "' AND '" + endMonth + "' ) "
            // console.log("object", sql_query)
            req.query(sql_query).then((result, err) => {
                pool.close()
                // console.log("res", result)
                if (result.recordset.length > 0) {
                    save_log(result.recordset, "get_all_calendar", "TMS_Cars_Calendar", result.recordset)
                    callback(server_response(200, "Success", result.recordset))
                } else {
                    save_log(result.recordset, "get_all_calendar", "TMS_Cars_Calendar", result.recordset)
                    callback(server_response(304, "None data this query", result.recordset))
                }
            }).catch((err) => {
                if (err) {
                    save_log(err, "get_all_calendar", "TMS_Cars_Calendar", err)
                    callback(server_response(500, "Error", err))
                }
            });
        })
    },
    update_report_calendar(in_data, callback) {
        // console.log("moment",moment(Date parse).format("H:m:s"))
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            if (err) {
                save_log(err, "update_report_calendar", "TMS_Calendar", err)
                callback(server_response(500, "Connection Error", err))
            }
            var req = new sql.Request(pool)
            // in_data.forEach((val, i) => {
                var in_rec=(in_data.rec_time!=null)?",[rec_time] = '"+in_data.rec_time+"'":""
                var in_ext=(in_data.exit_time!=null)?",[exit_time] = '"+in_data.exit_time+"'":""
                var in_fin=(in_data.finish_time!=null)?",[finish_time] = '"+in_data.finish_time+"'":""
                var sql_query = "UPDATE [dbo].[TMS_Cars_Calendar]\
                SET \
                   [remark] = '"+in_data.remark+"'\
                   ,[qty_product] = '"+in_data.qty_product+"' "+in_rec+in_ext+in_fin+"  \
                   ,[cause_id] = '"+in_data.cause_id+"'\
              WHERE [document_no] LIKE '"+in_data.document_no+"' "
                // console.log("object", sql_query)
                req.query(sql_query).then((result, err) => {
                    pool.close()
                    callback(server_response(200, "Success", result.recordset))
                }).catch((err) => {
                    if (err) {
                        save_log(err, "update_report_calendar", "TMS_Calendar", err)
                        callback(server_response(502, "Error", err))
                    }
                });
            });
        // })
    }
}

module.exports = {
    model: model
}