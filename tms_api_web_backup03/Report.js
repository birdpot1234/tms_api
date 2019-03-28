var { dbConnectData_TransportApp } = require('../connect_sql')
const { Gen_Document5digit, save_log, server_response } = require("../service")
const moment = require('moment')
const ReportDetail = require("./ReportDetail")
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
            WHERE (dbo.Report.ClearingStatus <> 9 ) AND (dbo.Report.INVOICEID LIKE 'ITR%') AND (dbo.Report.MessengerID = '"+ mess_code + "') AND (convert(varchar(10),dbo.Report.Datetime,120) LIKE '" + date + "') \
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
            dbo.App_FinishApp.paymentType AS Expr1, dbo.App_FinishApp.tranType, dbo.App_FinishApp.CheckboxTranfer,dbo.Report.Comment \
            FROM            dbo.Report INNER JOIN \
            dbo.App_FinishApp ON dbo.Report.INVOICEID = dbo.App_FinishApp.invoiceNumber LEFT OUTER JOIN \
            dbo.StatusDetail ON dbo.Report.Status = dbo.StatusDetail.Status \
            WHERE (dbo.Report.ClearingStatus <> 9 ) AND (dbo.Report.INVOICEID NOT LIKE 'INB%') AND (dbo.Report.INVOICEID NOT LIKE 'ITR%') AND (dbo.Report.MessengerID = '"+ mess_code + "') AND (convert(varchar(10),dbo.Report.Datetime,120) LIKE '" + date + "') \
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
                    ReportDetail.model.update_clear_bill(data, (res_data) => {
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
    get_report_form_account(date, callback) {
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            if (err) {
                save_log(err, "get_report_form_account", "Report", err)
                callback(server_response(500, "Error", err))
            }
            var req = new sql.Request(pool)
            var sql_query = "SELECT * FROM            TMS_Report_Form_Account \
        WHERE sales_group LIKE 'Dealer - กรุงเทพฯ' AND payment_type LIKE 'CASH' AND convert(varchar(10),invoice_date,120) ='"+ date + "' \
        ORDER BY invoice \
        SELECT * FROM            TMS_Report_Form_Account \
        WHERE sales_group LIKE 'Dealer - กรุงเทพฯ' AND payment_type NOT LIKE 'CASH' AND convert(varchar(10),invoice_date,120) ='"+ date + "' \
        ORDER BY invoice \
        SELECT *  FROM            TMS_Report_Form_Account \
        WHERE sales_group NOT LIKE 'Dealer - กรุงเทพฯ' AND convert(varchar(10),invoice_date,120) ='"+ date + "' \
        ORDER BY invoice "
        // console.log("sql_query",sql_query);
            req.query(sql_query).then((result, err) => {
                // console.log("result",result.recordsets[0]);
                pool.close()
                if (result.recordset.length > 0) {
                    save_log(result.recordsets, "get_report_form_account", "Report", result.recordsets)
                    callback(server_response(200, "Success", result.recordsets))
                } else {
                    save_log(result.recordsets, "get_report_form_account", "Report", result.recordsets)
                    callback(server_response(304, "None data this query", result.recordsets))
                }
            }).catch((err) => {
                if (err) {
                    save_log(err, "get_report_form_account", "Report", err)
                    callback(server_response(500, "Error", err))
                }
            });
        })
    },
    create_report_account(date, callback) {
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            if (err) {
                save_log(err, "get_report_form_account", "Report", err)
                callback(server_response(500, "Error", err))
            }
            var req = new sql.Request(pool)
            var sql_query = "MERGE INTO \
            TMS_Report_Form_Account \
          USING \
          (SELECT * FROM TMS_Report_Account WHERE [INVOICEID] NOT LIKE 'ITR%' AND [DocumentSet] LIKE 'TMS%'  AND convert(varchar(10),[ClearingDate],120)='"+ date + "' ) TMS_Report_Account \
          ON \
            TMS_Report_Form_Account.[tms_doc] = TMS_Report_Account.[DocumentSet] \
          WHEN MATCHED THEN \
            UPDATE SET \
                     TMS_Report_Form_Account.[ship_address]	=TMS_Report_Account.[AddressShipment] \
                     ,TMS_Report_Form_Account.[ship_delivery]	=TMS_Report_Account.[dlv_term] \
                     ,TMS_Report_Form_Account.[amount_bill]	=TMS_Report_Account.[AmountBill] \
                     ,TMS_Report_Form_Account.[amount_actual]	=TMS_Report_Account.[AmountActual] \
                     ,TMS_Report_Form_Account.[clear_date]	=TMS_Report_Account.[ClearingDate] \
                     ,TMS_Report_Form_Account.[clear_status]	=TMS_Report_Account.[ClearingStatus] \
                     ,TMS_Report_Form_Account.[mess_id]		=TMS_Report_Account.[MessengerID] \
                     ,TMS_Report_Form_Account.[mess_name]		=TMS_Report_Account.[MessName] \
                     ,TMS_Report_Form_Account.[sales_group]	=TMS_Report_Account.[sales_group] \
                     ,TMS_Report_Form_Account.[payment_type]	=TMS_Report_Account.[paymentType] \
                     ,TMS_Report_Form_Account.[check_tranfer]	=TMS_Report_Account.[CheckboxTranfer] \
                     ,TMS_Report_Form_Account.[cn_doc]		=TMS_Report_Account.[CNDoc] \
                     ,TMS_Report_Form_Account.[cn_amount]		=TMS_Report_Account.[Amount] \
                     ,TMS_Report_Form_Account.[comment]		=TMS_Report_Account.[Comment] \
                     ,TMS_Report_Form_Account.[car_type]		=TMS_Report_Account.[car_type] \
          WHEN NOT MATCHED THEN \
            INSERT  \
                      ([tms_doc] \
                     ,[tms_date] \
                     ,[invoice] \
                     ,[invoice_date] \
                     ,[customer_id] \
                     ,[customer_name] \
                     ,[ship_address] \
                     ,[ship_delivery] \
                     ,[amount_bill] \
                     ,[amount_actual] \
                     ,[clear_date] \
                     ,[clear_status] \
                     ,[mess_id] \
                     ,[mess_name] \
                     ,[sales_group] \
                     ,[payment_type] \
                     ,[check_tranfer] \
                     ,[cn_doc] \
                     ,[cn_amount] \
                     ,[comment] \
                     ,[car_type]) \
            VALUES \
              (TMS_Report_Account.[DocumentSet] \
              ,TMS_Report_Account.[create_date] \
              ,TMS_Report_Account.[INVOICEID] \
              ,TMS_Report_Account.[invoice_date] \
              ,TMS_Report_Account.[CustomerID] \
              ,TMS_Report_Account.[CustomerName] \
              ,TMS_Report_Account.[AddressShipment] \
              ,TMS_Report_Account.[dlv_term] \
              ,TMS_Report_Account.[AmountBill] \
              ,TMS_Report_Account.[AmountActual] \
              ,TMS_Report_Account.[ClearingDate] \
              ,TMS_Report_Account.[ClearingStatus] \
              ,TMS_Report_Account.[MessengerID] \
              ,TMS_Report_Account.[MessName] \
              ,TMS_Report_Account.[sales_group] \
              ,TMS_Report_Account.[paymentType] \
              ,TMS_Report_Account.[CheckboxTranfer] \
              ,TMS_Report_Account.[CNDoc] \
              ,TMS_Report_Account.[Amount] \
              ,TMS_Report_Account.[Comment] \
              ,TMS_Report_Account.[car_type]); \
              MERGE INTO \
                TMS_Report_Form_Account\
                USING\
                (SELECT * FROM TMS_Interface WHERE [invoice] NOT LIKE 'ITR%' AND convert(varchar(10),[clear_date],120)='"+ date + "' ) TMS_Report_Account\
                ON\
                TMS_Report_Form_Account.[tms_doc] = TMS_Report_Account.[tms_document]\
                WHEN MATCHED THEN\
                UPDATE SET\
                        TMS_Report_Form_Account.[ship_address]	=TMS_Report_Account.[address_shipment]\
                        ,TMS_Report_Form_Account.[ship_delivery]	=TMS_Report_Account.[dlv_term]\
                        ,TMS_Report_Form_Account.[amount_bill]	=TMS_Report_Account.[invoice_amount]\
                        ,TMS_Report_Form_Account.[amount_actual]	=TMS_Report_Account.[invoice_amount]\
                        ,TMS_Report_Form_Account.[clear_date]	=TMS_Report_Account.[clear_date]\
                        ,TMS_Report_Form_Account.[clear_status]	=TMS_Report_Account.[status]\
                        ,TMS_Report_Form_Account.[mess_id]		='MDL_55'\
                        ,TMS_Report_Form_Account.[mess_name]		='Kerry-DHL'\
                        ,TMS_Report_Form_Account.[sales_group]	=TMS_Report_Account.[sales_group]\
                WHEN NOT MATCHED THEN\
                INSERT \
                            ([tms_doc]\
                        ,[tms_date]\
                        ,[invoice]\
                        ,[invoice_date]\
                        ,[customer_id]\
                        ,[customer_name]\
                        ,[ship_address]\
                        ,[ship_delivery]\
                        ,[amount_bill]\
                        ,[amount_actual]\
                        ,[clear_date]\
                        ,[clear_status]\
                        ,[mess_id]\
                        ,[mess_name]\
                        ,[sales_group]\
                )\
                VALUES\
                    (TMS_Report_Account.[tms_document]\
                    ,TMS_Report_Account.[create_date]\
                    ,TMS_Report_Account.[invoice]\
                    ,TMS_Report_Account.[invoice_date]\
                    ,TMS_Report_Account.[customer_code]\
                    ,TMS_Report_Account.[customer_name]\
                    ,TMS_Report_Account.[address_shipment]\
                    ,TMS_Report_Account.[dlv_term]\
                    ,TMS_Report_Account.[invoice_amount]\
                    ,TMS_Report_Account.[invoice_amount]\
                    ,TMS_Report_Account.[clear_date]\
                    ,TMS_Report_Account.[status]\
                    ,'MDL-55'\
                    ,'Kerry-DHL'\
                    ,TMS_Report_Account.[sales_group]\
                );"
            // var sql_query = "SELECT        dbo.Report.ClearingStatus, dbo.Report.INVOICEID, dbo.Report.DocumentSet, dbo.Report.CustomerID, dbo.Report.CustomerName, dbo.Report.AddressShipment, dbo.Report.Status, dbo.Report.AmountBill, \
            // dbo.Report.AmountActual, dbo.Report.Type, dbo.Report.Datetime, dbo.Report.ReasonCN, dbo.Report.ClearingDate, dbo.Report.paymentType, dbo.Report.MessengerID, CONVERT(varchar(10), dbo.TMS_Interface.create_date, 120) \
            //  AS interface_date,  dbo.BillToApp.car_type \
            //  FROM            dbo.Report INNER JOIN \
            //                           dbo.TMS_Interface ON dbo.Report.DocumentSet = dbo.TMS_Interface.tms_document INNER JOIN \
            //                           dbo.BillToApp ON dbo.Report.DocumentSet = dbo.BillToApp.DocumentSet \
            // WHERE        (dbo.Report.ClearingStatus = '0') AND (CONVERT(varchar(10), dbo.TMS_Interface.create_date, 120) LIKE '"+ date + "' ) AND (dbo.Report.MessengerID LIKE '" + mess_code + "%')"
            // console.log("object", sql_query)
            req.query(sql_query).then((result, err) => {
                pool.close()
                // console.log("result",result);
                if (result.rowsAffected.length > 0) {
                    save_log(result.recordset, "create_report_account", "Report", result.recordset)
                    callback(server_response(200, "Success", result.recordset))
                } else {
                    save_log(result.recordset, "create_report_account", "Report", result.recordset)
                    callback(server_response(304, "None data this query", result.recordset))
                }
            }).catch((err) => {
                if (err) {
                    save_log(err, "create_report_account", "Report", err)
                    callback(server_response(500, "Error", err))
                }
            });
        })
    },
    update_clear_detail(invoice, callback) {
        console.log("result", invoice)
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            if (err) {
                save_log(err, "update_clear_detail", "Report", err)
                callback(server_response(500, "Error", err))
            }
            var req = new sql.Request(pool)
            var sql_query = "UPDATE Report \
            SET \
            AmountActual=detail.sum_AmtAct\
            FROM \
            ( \
                SELECT INVOICEID,SUM(AmountBill) AS sum_AmtBill,SUM(AmountActaul) AS sum_AmtAct \
                FROM ReportDetail \
                WHERE INVOICEID = '"+ invoice + "' \
                GROUP BY INVOICEID \
            ) detail \
            WHERE Report.INVOICEID = '"+ invoice + "' "
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