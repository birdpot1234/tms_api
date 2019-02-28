var { dbConnectData_TransportApp } = require('../connect_sql')
const { Gen_Document5digit, save_log, server_response } = require("../service")
const moment = require('moment')
const ReportDetail =require("./ReportDetail")
var sql = require('mssql')

const model = {
    get_clear_bill_claim_find_by_mess(mess_code, date, callback) {
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            if (err) {
                save_log(err, "get_clear_bill_find_by_mess", "Report", err)
                callback(server_response(500, "Error", err))
            }
            var req = new sql.Request(pool)

            var sql_query = "SELECT        dbo.Report.id, dbo.Report.INVOICEID, dbo.Report.DocumentSet, dbo.Report.CustomerID, dbo.Report.CustomerName, dbo.Report.AddressShipment, dbo.Report.Status, dbo.Report.AmountBill, dbo.Report.AmountActual, \
            dbo.Report.Type, dbo.Report.Datetime, dbo.Report.ReasonCN, dbo.Report.ClearingStatus, dbo.Report.ClearingDate, dbo.Report.paymentType, dbo.Report.MessengerID, dbo.Report.MessengerName, dbo.StatusDetail.Detail, \
            dbo.App_FinishApp.paymentType AS Expr1, dbo.App_FinishApp.tranType, dbo.App_FinishApp.CheckboxTranfer \
            FROM            dbo.Report INNER JOIN \
            dbo.App_FinishApp ON dbo.Report.INVOICEID = dbo.App_FinishApp.invoiceNumber LEFT OUTER JOIN \
            dbo.StatusDetail ON dbo.Report.Status = dbo.StatusDetail.Status \
            WHERE(dbo.Report.INVOICEID LIKE 'ITR%') AND (dbo.Report.MessengerID = '"+ mess_code + "') AND (convert(varchar(10),dbo.Report.Datetime,120) LIKE '" + date + "') \
            ORDER BY INVOICEID"
            // console.log("object",sql_query)
            req.query(sql_query).then((result, err) => {
                pool.close()
                if (result.recordset.length > 0) {
                    save_log(result.recordset, "get_clear_bill_find_by_mess", "Report", result.recordset)
                    callback(server_response(200, "Success", result.recordset))
                } else {
                    save_log(result.recordset, "get_clear_bill_find_by_mess", "Report", result.recordset)
                    callback(server_response(304, "None data this query", result.recordset))
                }
            }).catch((err) => {
                if (err) {
                    save_log(err, "get_clear_bill_find_by_mess", "Report", err)
                    callback(server_response(500, "Error", err))
                }
            });
        })
    },
    get_clear_bill_find_by_mess(mess_code, date, callback) {
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            if (err) {
                save_log(err, "get_clear_bill_find_by_mess", "Report", err)
                callback(server_response(500, "Error", err))
            }
            var req = new sql.Request(pool)

            var sql_query = "SELECT        dbo.Report.id, dbo.Report.INVOICEID, dbo.Report.DocumentSet, dbo.Report.CustomerID, dbo.Report.CustomerName, dbo.Report.AddressShipment, dbo.Report.Status, dbo.Report.AmountBill, dbo.Report.AmountActual, \
            dbo.Report.Type, dbo.Report.Datetime, dbo.Report.ReasonCN, dbo.Report.ClearingStatus, dbo.Report.ClearingDate, dbo.Report.paymentType, dbo.Report.MessengerID, dbo.Report.MessengerName, dbo.StatusDetail.Detail, \
            dbo.App_FinishApp.paymentType AS Expr1, dbo.App_FinishApp.tranType, dbo.App_FinishApp.CheckboxTranfer \
            FROM            dbo.Report INNER JOIN \
            dbo.App_FinishApp ON dbo.Report.INVOICEID = dbo.App_FinishApp.invoiceNumber LEFT OUTER JOIN \
            dbo.StatusDetail ON dbo.Report.Status = dbo.StatusDetail.Status \
            WHERE (dbo.Report.INVOICEID LIKE 'INA%') AND (dbo.Report.MessengerID = '"+ mess_code + "') AND (convert(varchar(10),dbo.Report.Datetime,120) LIKE '" + date + "') \
            ORDER BY INVOICEID"
            // console.log("object",sql_query)
            req.query(sql_query).then((result, err) => {
                pool.close()
                if (result.recordset.length > 0) {
                    save_log(result.recordset, "get_clear_bill_find_by_mess", "Report", result.recordset)
                    callback(server_response(200, "Success", result.recordset))
                } else {
                    save_log(result.recordset, "get_clear_bill_find_by_mess", "Report", result.recordset)
                    callback(server_response(304, "None data this query", result.recordset))
                }
            }).catch((err) => {
                if (err) {
                    save_log(err, "get_clear_bill_find_by_mess", "Report", err)
                    callback(server_response(500, "Error", err))
                }
            });
        })
    },
    update_clear_bill(data, callback) {
        sql.close()
        var clear_date = moment().format("YYYY-MM-DD H:m:s")
        var clear_status = 9
        var sql_where = ""
        data.forEach((val, i) => {
            if ((i + 1) == data.length) {
                sql_where += "'" + val.id + "'"
            } else {
                sql_where += "'" + val.id + "',"
            }
        });
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            if (err) {
                save_log(err, "update_clear_bill", "Report", err)
                callback(server_response(500, "Error", err))
            }
            var req = new sql.Request(pool)

            var sql_query = " UPDATE Report SET ClearingStatus='" + clear_status + "', ClearingDate='" + clear_date + "' \
            WHERE (id IN ("+ sql_where + ") ) "
            // console.log("object",sql_query)
            req.query(sql_query).then((result) => {
                pool.close()
                if (result.rowsAffected > 0) {
                    // console.log("object",result.rowsAffected)
                    save_log(result.recordset, "update_clear_bill", "Report", result.recordset)
                    // callback(server_response(200, "Success", result.recordset))
                    ReportDetail.model.update_clear_bill(data,(res_data)=>{
                        callback(res_data)
                    })
                } else {
                    save_log(result.recordset, "update_clear_bill", "Report", result.recordset)
                    callback(server_response(304, "Error", result.recordset))
                }
            }).catch((err) => {
                if (err) {
                    save_log(err, "update_clear_bill", "Report", err)
                    callback(server_response(500, "Error", err))
                }
            });
        })
    },
    get_report_form_account(mess_code, date, callback) {
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            if (err) {
                save_log(err, "get_report_form_account", "Report", err)
                callback(server_response(500, "Error", err))
            }
            var req = new sql.Request(pool)

            var sql_query = "SELECT        dbo.Report.ClearingStatus, dbo.Report.INVOICEID, dbo.Report.DocumentSet, dbo.Report.CustomerID, dbo.Report.CustomerName, dbo.Report.AddressShipment, dbo.Report.Status, dbo.Report.AmountBill, \
            dbo.Report.AmountActual, dbo.Report.Type, dbo.Report.Datetime, dbo.Report.ReasonCN, dbo.Report.ClearingDate, dbo.Report.paymentType, dbo.Report.MessengerID, CONVERT(varchar(10), dbo.TMS_Interface.create_date, 120) \
             AS interface_date,  dbo.BillToApp.car_type \
             FROM            dbo.Report INNER JOIN \
                                      dbo.TMS_Interface ON dbo.Report.DocumentSet = dbo.TMS_Interface.tms_document INNER JOIN \
                                      dbo.BillToApp ON dbo.Report.DocumentSet = dbo.BillToApp.DocumentSet \
            WHERE        (dbo.Report.ClearingStatus = '0') AND (CONVERT(varchar(10), dbo.TMS_Interface.create_date, 120) LIKE '"+ date + "' ) AND (dbo.Report.MessengerID LIKE '" + mess_code + "%')"
            console.log("object", sql_query)
            req.query(sql_query).then((result, err) => {
                pool.close()
                if (result.recordset.length > 0) {
                    save_log(result.recordset, "get_report_form_account", "Report", result.recordset)
                    callback(server_response(200, "Success", result.recordset))
                } else {
                    save_log(result.recordset, "get_report_form_account", "Report", result.recordset)
                    callback(server_response(304, "None data this query", result.recordset))
                }
            }).catch((err) => {
                if (err) {
                    save_log(err, "get_report_form_account", "Report", err)
                    callback(server_response(500, "Error", err))
                }
            });
        })
    },
    update_clear_detail(invoice,callback) {
        console.log("result",invoice)
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            if (err) {
                save_log(err, "update_clear_detail", "Report", err)
                callback(server_response(500, "Error", err))
            }
            var req = new sql.Request(pool)
            var sql_query="UPDATE Report \
            SET \
            AmountActual=detail.sum_AmtAct\
            FROM \
            ( \
                SELECT INVOICEID,SUM(AmountBill) AS sum_AmtBill,SUM(AmountActaul) AS sum_AmtAct \
                FROM ReportDetail \
                WHERE INVOICEID = '"+invoice+"' \
                GROUP BY INVOICEID \
            ) detail \
            WHERE Report.INVOICEID = '"+invoice+"' "
            console.log("result", sql_query)
            req.query(sql_query).then((result, err) => {
                pool.close()
                console.log("result", result)
                if (result.recordset.length > 0) {
                    save_log(result.recordset, "update_clear_detail", "Report", result.recordset)
                    callback(server_response(200, "Success", result.recordset))
                } else {
                    save_log(result.recordset, "update_clear_detail", "Report", result.recordset)
                    callback(server_response(304, "None data this query", result.recordset))
                }
            }).catch((err) => {
                if (err) {
                    save_log(err, "update_clear_detail", "Report", err)
                    callback(server_response(500, "Error", err))
                }
            });
        })
    }
}

module.exports = {
    model: model
}