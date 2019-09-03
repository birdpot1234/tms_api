var { dbConnectData_TransportApp } = require('../connect_sql')
const { Gen_Document5digit, save_log, server_response, select_query, insert_query } = require("../service")
const moment = require('moment')
var sql = require('mssql')
var nameFN, nameTB, sql_query, sql_where = []

const model = {
    get_tms_kerry_dhl(in_type, in_date, callback) {
        in_type = (in_type === "ALL") ? "" : in_type
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            var req = new sql.Request(pool)
            var sql_query = "SELECT        tms_document, document_sub, document_tran, status, date, dlv_term, customer_name, invoice_qty, invoice_amount, address_shipment, delivery_date, code_zone, store_zone,dpl_hub_dlvterm,inventlocationid \
            FROM            TMS_Clearbill_kerry_dhl \
            WHERE document_sub LIKE 'INA%' AND inventlocationid NOT LIKE 'WS1' AND dlv_term LIKE '"+ in_type + "%' AND CONVERT(VARCHAR(10),date,120) LIKE '" + in_date + "'"
            // console.log("sql_query",sql_query)
            req.query(sql_query).then((result) => {
                pool.close()
                // console.log("get_tms_kerry_dhl",result);
                if (result.recordset.length > 0) {
                    save_log(result.recordset, "get_tms_kerry_dhl", "TMS_Clearbill_kerry_dhl", result.recordset)
                    callback(server_response(200, "Success", result.recordset))
                } else {
                    save_log(result.recordset, "get_tms_kerry_dhl", "TMS_Clearbill_kerry_dhl", result.recordset)
                    callback(server_response(500, "Error", result.recordset))
                }
            }).catch((err) => {
                if (err) throw err;
            });
        })
    },
    get_tms_surach_kerry_dhl(in_type, in_date, callback) {
        in_type = (in_type === "ALL") ? "" : in_type
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            var req = new sql.Request(pool)
            var sql_query = "SELECT        tms_document, document_sub, document_tran, status, date, dlv_term, customer_name, invoice_qty, invoice_amount, address_shipment, delivery_date, code_zone, store_zone,dpl_hub_dlvterm,inventlocationid \
            FROM            TMS_Clearbill_kerry_dhl \
            WHERE document_sub LIKE 'INA%' AND inventlocationid LIKE 'WS1' AND dlv_term LIKE '"+ in_type + "%' AND CONVERT(VARCHAR(10),date,120) LIKE '" + in_date + "'"
            console.log("sql_query", sql_query)
            req.query(sql_query).then((result) => {
                pool.close()
                // console.log("get_tms_kerry_dhl",result);
                if (result.recordset.length > 0) {
                    save_log(result.recordset, "get_tms_kerry_dhl", "TMS_Clearbill_kerry_dhl", result.recordset)
                    callback(server_response(200, "Success", result.recordset))
                } else {
                    save_log(result.recordset, "get_tms_kerry_dhl", "TMS_Clearbill_kerry_dhl", result.recordset)
                    callback(server_response(500, "Error", result.recordset))
                }
            }).catch((err) => {
                if (err) throw err;
            });
        })
    },
    get_tms_phitsanulok_kerry_dhl(in_type, in_date, callback) {
        in_type = (in_type === "ALL") ? "" : in_type
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            var req = new sql.Request(pool)
            var sql_query = "SELECT        tms_document, document_sub, document_tran, status, date, dlv_term, customer_name, invoice_qty, invoice_amount, address_shipment, delivery_date, code_zone, store_zone,dpl_hub_dlvterm,inventlocationid \
            FROM            TMS_Clearbill_kerry_dhl \
            WHERE document_sub LIKE 'INA%' AND inventlocationid LIKE 'WN1' AND dlv_term LIKE '"+ in_type + "%' AND CONVERT(VARCHAR(10),date,120) LIKE '" + in_date + "'"
            console.log("sql_query", sql_query)
            req.query(sql_query).then((result) => {
                pool.close()
                // console.log("get_tms_kerry_dhl",result);
                if (result.recordset.length > 0) {
                    save_log(result.recordset, "get_tms_kerry_dhl", "TMS_Clearbill_kerry_dhl", result.recordset)
                    callback(server_response(200, "Success", result.recordset))
                } else {
                    save_log(result.recordset, "get_tms_kerry_dhl", "TMS_Clearbill_kerry_dhl", result.recordset)
                    callback(server_response(500, "Error", result.recordset))
                }
            }).catch((err) => {
                if (err) throw err;
            });
        })
    },
    update_tms_kerry_dhl(in_data, callback) {
        let status, dlv_term, sql_where_in = []
        in_data.forEach((val, i) => {
            status = 10
            dlv_term = val.dlv_term
            if (in_data.length === (i + 1)) {
                sql_where_in += "'" + val.tms_document + "'"
            } else {
                sql_where_in += "'" + val.tms_document + "',"
            }
        });
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            var clear_date = moment().format("YYYY-MM-DD")
            var req = new sql.Request(pool)
            var sql_query = "UPDATE TMS_Interface SET \
            status="+ status + ",\
            dlv_term='"+ dlv_term + "', \
            clear_date='"+ clear_date + "' \
            WHERE (tms_document IN ("+ sql_where_in + ") )"
            console.log("update_tms_kerry_dhl", sql_query);
            req.query(sql_query).then((result) => {
                // console.log("update_tms_kerry_dhl",result.rowsAffected.length);
                pool.close()
                if (result.rowsAffected.length > 0) {
                    // console.log("object")
                    save_log(result, "update_status", "TMS_Interface", in_data)
                    callback(server_response(200, "Success", result.rowsAffected))
                } else {
                    save_log(result, "update_status", "TMS_Interface", in_data)
                    callback(server_response(203, "None data query", result.rowsAffected))
                }
            }).catch((err) => {
                save_log(err, "update_status", "TMS_Interface", in_data)
                callback(server_response(501, "Error query SQL", err))
            })
        })
    },
    async get_outsideTask(inType, inDate, callback) {
        nameFN = "get_outsideTask"
        nameTB = "TMS_Interface"
        sql_query = `SELECT        outside_status,dpl_hub_dlvterm, CONVERT(varchar(10), create_date, 120) AS create_date, tms_document, invoice, customer_name, address_shipment, box_amount, box_weight, status,kerry_document,dhl_document
        FROM            dbo.TMS_Interface
        WHERE       (status<>10) AND (outside_status=0) AND (dpl_hub_dlvterm LIKE '${inType}' ) AND (CONVERT(varchar(10), create_date, 120) LIKE '${inDate}' )
        ORDER BY status DESC`
        try {
            var res_data = await select_query(dbConnectData_TransportApp, nameFN, nameTB, sql_query)
            callback(res_data)
        } catch (error) {
            console.log("error",error)
            callback(error)
        }
    },
    async update_outsideStatus(inData, callback) {
        nameFN = "update_outsideStatus"
        nameTB = "TMS_Interface"
        sql_where = []
        inData.forEach((val, i) => {
            sql_where.push(`'${val.invoice}'`)
        });
        var sqlWhere = sql_where.join(` , `)
        sql_query = `UPDATE TMS_Interface SET outside_status=1 WHERE invoice IN (${sqlWhere}) `
        // console.log("sql_query",sql_query)
        try {
            var res_data = await insert_query(dbConnectData_TransportApp, nameFN, nameTB, sql_query)
            callback(res_data)
        } catch (error) {
            callback(error)
        }
    }
}

module.exports = {
    model: model
}