var { dbConnectData_TransportApp, dbConnectData_WEBSaleClaim } = require('../connect_sql')
const { Gen_Document5digit, save_log, server_response, select_query, insert_query } = require("../service")
const moment = require('moment')
var sql = require('mssql')
var nameFN, nameTB, sql_query, sql_where = []

const model = {
    async get_modal_remarkTMS(inDoc, callback) {
        nameFN = "get_modal_remarkTMS"
        nameTB = "TMS_Interface"
        sql_query = `SELECT RemarkTMS
        FROM            TMS_Interface
        WHERE so LIKE '${inDoc}'`
        try {
            var res_data = await select_query(dbConnectData_TransportApp, nameFN, nameTB, sql_query)
            callback(res_data)
        } catch (error) {
            callback(error)
        }
    },
    async get_modal_get_TMS_Status_API_Tracking(inDoc, callback) {
        nameFN = "get_modal_Issues"
        nameTB = "TMS_Interface"
        sql_query = `SELECT Issues
        FROM            TMS_Interface
        WHERE so LIKE '${inDoc}'`
        try {
            var res_data = await select_query(dbConnectData_TransportApp, nameFN, nameTB, sql_query)
            callback(res_data)
        } catch (error) {
            callback(error)
        }
    },
    async post_modal_remarkTMS(inDoc, inData, callback) {
        nameFN = "post_modal_remarkTMS"
        nameTB = "TMS_Interface"
        sql_query = `UPDATE [dbo].[TMS_Interface]
        SET [RemarkTMS]='${inData}'
        WHERE so LIKE '${inDoc}' `
        console.log("sql_query",sql_query)
        try {
            var res_data = await insert_query(dbConnectData_TransportApp, nameFN, nameTB, sql_query)
            callback(res_data)
        } catch (error) {
            callback(error)
        }
    },
    async post_modal_Issues(inDoc, inData, callback) {
        nameFN = "post_modal_remarkTMS"
        nameTB = "TMS_Interface"
        sql_query = `UPDATE [dbo].[TMS_Interface]
        SET [Issues]='${inData}'
        WHERE so LIKE '${inDoc}' `
        try {
            var res_data = await insert_query(dbConnectData_TransportApp, nameFN, nameTB, sql_query)
            callback(res_data)
        } catch (error) {
            callback(error)
        }
    },
    async get_modal_inv_detail(inDoc, callback) {
        nameFN = "get_modal_inv_detail"
        nameTB = "ZTSV_TMS_SalesLine_less"
        sql_query = `SELECT        ITEMID, NAME, QTYORDERED AS deliveryRemainder
        FROM            DPLUSAX63_GOLIVE_2017.dbo.SALESLINE
        WHERE        (SALESID = N'${inDoc}')`
        try {
            var res_data = await select_query(dbConnectData_TransportApp, nameFN, nameTB, sql_query)
            callback(res_data)
        } catch (error) {
            callback(error)
        }
    },
    async get_modal_back_order(inDoc, callback) {
        nameFN = "get_modal_back_order"
        nameTB = "ZTSV_TMS_SalesLine_less"
        sql_query = `SELECT        ITEMID, NAME, ISNULL(REMAINSALESPHYSICAL, 0) AS deliveryRemainder
        FROM            DPLUSAX63_GOLIVE_2017.dbo.SALESLINE
        WHERE    ISNULL(REMAINSALESPHYSICAL, 0) > 0 AND    (SALESID = N'${inDoc}')`
        try {
            var res_data = await select_query(dbConnectData_TransportApp, nameFN, nameTB, sql_query)
            callback(res_data)
        } catch (error) {
            callback(error)
        }
    },
    async get_status_main(stDate, enDate, cExpress, fSalesGroup, callback) {
        nameFN = "get_status_main"
        nameTB = "ReportMain"
        sql_where = []
        console.log("fSalesGroup",fSalesGroup)

        if (stDate <= enDate) {
            sql_where.push(`WHERE DLV_Date BETWEEN '${stDate}' AND '${enDate}'`)
        } else {
            sql_where.push(`WHERE DLV_Date BETWEEN '${enDate}' AND '${enDate}'`)
        }
        if (cExpress == "1") sql_where.push(`Express = 1`)
        if (fSalesGroup != "ALL") sql_where.push(`INVENTLOCATIONID LIKE '${fSalesGroup}'`)
        var sqlWhere = sql_where.join(` AND `)
        sql_query = `SELECT        *
        FROM            dbo.ZTSV_TMS_Report_StatusMain_Track2
        ${sqlWhere}
        ORDER BY DLV_Date`
        console.log("sql_query",sql_query)
        try {
            var res_data = await select_query(dbConnectData_TransportApp, nameFN, nameTB, sql_query)
            callback(res_data)
        } catch (error) {
            callback(error)
        }
    },
    get_ITR_Detail(itr_no, callback) {
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_WEBSaleClaim)
        pool.connect(err => {
            if (err) {
                save_log(err, "get_ITR_Detail", "DPLV_SCSC_ClaimLineNomal", err)
                callback(server_response(500, "Error", err))
            }
            var req = new sql.Request(pool)
            var sql_query = "SELECT        itemNo, itemName, Qty, ITRNo \
            FROM            dbo.TMS_ITR_Detail \
            WHERE        (ITRNo = '"+ itr_no + "')"
            // console.log("object",sql_query)
            req.query(sql_query).then((result) => {
                pool.close()
                // console.log("result",result)
                if (result.recordset.length > 0) {
                    save_log(result.recordset, "get_ITR_Detail", "DPLV_SCSC_ClaimLineNomal", result.recordset)
                    callback(server_response(200, "Success", result.recordset))
                } else {
                    save_log(result.recordset, "get_ITR_Detail", "DPLV_SCSC_ClaimLineNomal", result.recordset)
                    callback(server_response(500, "Error", result.recordset))
                }
            }).catch((err) => {
                if (err) {
                    save_log(err, "get_ITR_Detail", "DPLV_SCSC_ClaimLineNomal", err)
                    callback(server_response(500, "Error", err))
                }
            });
        })
    },
    get_TMS_Status_Surach_API_Tracking(date_start, date_end, callback) {
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            if (err) {
                save_log(err, "get_TMS_Status_Surach_API_Tracking", "TMS_Status_API_Tracking", err)
                callback(server_response(500, "Error", err))
            }
            var req = new sql.Request(pool)

            var sql_query = "SELECT        document_main, document_sub, customer_name, sales_group, store_zone, code_zone, invoice_qty, invoice_amount, box_amount, dlv_term, delivery_date, status, confirm_scan, receive_scan, send_scan, MessName, \
            stamp_workapp, stamp_finishapp, stamp_report, create_date, invoice_date,dpl_hub_dlvterm,inventlocationid \
            FROM            dbo.TMS_Status_API_Tracking \
            WHERE (document_sub LIKE 'IN%') AND (inventlocationid LIKE 'WS1') AND (invoice_date BETWEEN '"+ date_start + "' AND '" + date_end + "' )"
            console.log("status-surach", sql_query)
            req.query(sql_query).then((result) => {
                pool.close()
                if (result.recordset.length > 0) {
                    save_log(result.recordset, "get_TMS_Status_Surach_API_Tracking", "TMS_Status_API_Tracking", result.recordset)
                    callback(server_response(200, "Success", result.recordset))
                } else {
                    save_log(result.recordset, "get_TMS_Status_Surach_API_Tracking", "TMS_Status_API_Tracking", result.recordset)
                    callback(server_response(500, "Error", result.recordset))
                }
            }).catch((err) => {
                if (err) {
                    save_log(err, "get_TMS_Status_Surach_API_Tracking", "TMS_Status_API_Tracking", err)
                    callback(server_response(500, "Error", err))
                }
            });
        })
    },
    get_TMS_Status_Phitsanulok_API_Tracking(date_start, date_end, callback) {
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            if (err) {
                save_log(err, "get_TMS_Status_Phitsanulok_API_Tracking", "TMS_Status_API_Tracking", err)
                callback(server_response(500, "Error", err))
            }
            var req = new sql.Request(pool)

            var sql_query = "SELECT        document_main, document_sub, customer_name, sales_group, store_zone, code_zone, invoice_qty, invoice_amount, box_amount, dlv_term, delivery_date, status, confirm_scan, receive_scan, send_scan, MessName, \
            stamp_workapp, stamp_finishapp, stamp_report, create_date, invoice_date,dpl_hub_dlvterm,inventlocationid \
            FROM            [Data_TransportApp].[dbo].TMS_Status_API_Tracking \
            WHERE (document_sub LIKE 'IN%') AND (inventlocationid LIKE 'WN1') AND (invoice_date BETWEEN '"+ date_start + "' AND '" + date_end + "' )"
            console.log("status-phitsanulok", sql_query)
            req.query(sql_query).then((result) => {
                pool.close()
                if (result.recordset.length > 0) {
                    save_log(result.recordset, "get_TMS_Status_Phitsanulok_API_Tracking", "TMS_Status_API_Tracking", result.recordset)
                    callback(server_response(200, "Success", result.recordset))
                } else {
                    save_log(result.recordset, "get_TMS_Status_Phitsanulok_API_Tracking", "TMS_Status_API_Tracking", result.recordset)
                    callback(server_response(500, "Error", result.recordset))
                }
            }).catch((err) => {
                if (err) {
                    save_log(err, "get_TMS_Status_Phitsanulok_API_Tracking", "TMS_Status_API_Tracking", err)
                    callback(server_response(500, "Error", err))
                }
            });
        })
    },
    get_TMS_Status_Claim_API_Tracking(date_start, date_end, callback) {
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            if (err) {
                save_log(err, "get_TMS_Status_API_Tracking", "TMS_Status_API_Tracking", err)
                callback(server_response(500, "Error", err))
            }
            var req = new sql.Request(pool)

            // var sql_query = "SELECT        document_main, document_sub, customer_name, sales_group, store_zone, code_zone, invoice_qty, invoice_amount, box_amount, dlv_term, delivery_date, status, confirm_scan, receive_scan, send_scan, MessName, \
            // stamp_workapp, stamp_finishapp, stamp_report, create_date,invoice_date \
            // FROM            dbo.TMS_Status_API_Tracking \
            // WHERE  (document_sub LIKE 'ITR%') AND (invoice_date BETWEEN '"+ date_start + "' AND '" + date_end + "' )"
            var sql_query = "SELECT    customerNo, customerName, remark, saleCode, packingRemark, extDocNo, CONVERT(varchar(10),receiveDate,120) AS receiveDate, CONVERT(varchar(10),createDate,120) AS createDate, ITRNo, AXDocument, document_main, document_sub, customer_name, sales_group, store_zone, code_zone, \
            invoice_qty, invoice_amount, box_amount, dlv_term, delivery_date, status, confirm_scan, receive_scan, send_scan, MessName, stamp_workapp, stamp_finishapp, stamp_report, create_date, invoice_date \
            FROM            TMS_Status_API_Tracking_Claim \
            WHERE(ITRNo LIKE 'ITR%') AND(CONVERT(varchar(10),receiveDate,120) BETWEEN '"+ date_start + "' AND '" + date_end + "')"
            // console.log("object", sql_query)
            req.query(sql_query).then((result) => {
                pool.close()
                if (result.recordset.length > 0) {
                    save_log(result.recordset, "get_TMS_Status_API_Tracking", "TMS_Status_API_Tracking", result.recordset)
                    callback(server_response(200, "Success", result.recordset))
                } else {
                    save_log(result.recordset, "get_TMS_Status_API_Tracking", "TMS_Status_API_Tracking", result.recordset)
                    callback(server_response(500, "Error", result.recordset))
                }
            }).catch((err) => {
                if (err) {
                    save_log(err, "get_TMS_Status_API_Tracking", "TMS_Status_API_Tracking", err)
                    callback(server_response(500, "Error", err))
                }
            });
        })
    },
    get_TMS_Status_API_Tracking(date_start, date_end, callback) {
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            if (err) {
                save_log(err, "get_TMS_Status_API_Tracking", "TMS_Status_API_Tracking", err)
                callback(server_response(500, "Error", err))
            }
            var req = new sql.Request(pool)

            var sql_query = "SELECT        document_main, document_sub, customer_name, sales_group, store_zone, code_zone, invoice_qty, invoice_amount, box_amount, dlv_term, delivery_date, status, confirm_scan, receive_scan, send_scan, MessName, \
            stamp_workapp, stamp_finishapp, stamp_report, create_date, invoice_date, so \
            FROM            dbo.TMS_Status_API_Tracking \
            WHERE (document_sub LIKE 'IN%') AND (invoice_date BETWEEN '"+ date_start + "' AND '" + date_end + "' )"
            // console.log("object",sql_query)
            req.query(sql_query).then((result) => {
                pool.close()
                if (result.recordset.length > 0) {
                    save_log(result.recordset, "get_TMS_Status_API_Tracking", "TMS_Status_API_Tracking", result.recordset)
                    callback(server_response(200, "Success", result.recordset))
                } else {
                    save_log(result.recordset, "get_TMS_Status_API_Tracking", "TMS_Status_API_Tracking", result.recordset)
                    callback(server_response(500, "Error", result.recordset))
                }
            }).catch((err) => {
                if (err) {
                    save_log(err, "get_TMS_Status_API_Tracking", "TMS_Status_API_Tracking", err)
                    callback(server_response(500, "Error", err))
                }
            });
        })
    },
    get_TMS_Workloop(type_data, input_data, callback) {
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        var sqlWhere = ""
        switch (type_data) {
            case "DOC":
                if (input_data.substring(0, 2) == "TMS") {
                    sqlWhere = "DocumentSet LIKE '" + input_data + "'"
                } else {
                    sqlWhere = "INVOICEID LIKE '" + input_data + "'"
                }
                break;
            default: sqlWhere = "IDMess LIKE '" + input_data + "'"
                break;
        }
        pool.connect(err => {
            if (err) {
                save_log(err, "get_TMS_Workloop", "Report", err)
                callback(server_response(500, "Error", err))
            }
            var req = new sql.Request(pool)

            var sql_query = "SELECT  INVOICEID, DocumentSet, CustomerName, IDMess, MessName, Detail, box_amount \
            FROM TMS_Workloop \
            WHERE "+ sqlWhere + " \
            ORDER BY  INVOICEID"
            console.log("object", sql_query)
            req.query(sql_query).then((result, err) => {
                pool.close()
                if (result.recordset.length > 0) {
                    save_log(result.recordset, "get_TMS_Workloop", "Report", result.recordset)
                    callback(server_response(200, "Success", result.recordset))
                } else {
                    save_log(result.recordset, "get_TMS_Workloop", "Report", result.recordset)
                    callback(server_response(304, "None data this query", result.recordset))
                }
            }).catch((err) => {
                if (err) {
                    save_log(err, "get_TMS_Workloop", "Report", err)
                    callback(server_response(500, "Error", err))
                }
            });
        })
    }
}

module.exports = {
    model: model
}