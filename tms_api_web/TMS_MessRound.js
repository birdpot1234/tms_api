var { dbConnectData_TransportApp, dbConnectData_Temp } = require('../connect_sql')
const { select_query, insert_query } = require("../service")
var name_function = "", name_table = "", sql_query = "", res_data = ""


const model = {
    async import_excel_round(start_date, end_date, callback) {
        name_function = "get_data_monitorTL_1"
        name_table = "TMS_Monitor_1"
        sql_query = "SELECT        dbo.OrderGroup.Name AS group_customer, SUM(dbo.TMS_Monitor_1.wait_pick_order_qty) AS wait_pick_order_qty, SUM(dbo.TMS_Monitor_1.wait_pick_order_amt) AS wait_pick_order_amt,  \
        SUM(dbo.TMS_Monitor_1.start_pick_order_qty) AS start_pick_order_qty, SUM(dbo.TMS_Monitor_1.start_pick_order_amt) AS start_pick_order_amt, SUM(dbo.TMS_Monitor_1.back_order_qty) AS back_order_qty, \
        SUM(dbo.TMS_Monitor_1.back_order_amt) AS back_order_amt \
        FROM            dbo.TMS_Monitor_1 LEFT OUTER JOIN \
        dbo.OrderGroup ON dbo.TMS_Monitor_1.group_customer = dbo.OrderGroup.Code \
        WHERE (dbo.TMS_Monitor_1.[date] BETWEEN '"+ start_date + "' AND '" + end_date + "' ) \
        GROUP BY dbo.OrderGroup.Name"
        res_data = await select_query(dbConnectData_TransportApp, name_function, name_table, sql_query)
        callback(res_data)
    },
}



module.exports = {
    model: model
}