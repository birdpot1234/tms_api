var { dbConnectData_TransportApp, dbConnectData_Temp } = require('../connect_sql')
const { select_query, insert_query } = require("../service")
var name_function = "", name_table = "", sql_query = "", res_data = ""


const model = {
    async get_report_costmess_MDL(start, end, callback) {
        name_function = "get_report_costmess_MDL"
        name_table = "TMS_jar_reportCostMess_Monthly"
        sql_query = " SELECT MessNO, MessName, MessengerID, SUM(Trip) AS trip, SUM(shop) AS shop, SUM(Bill) AS bill, SUM(round_cost) AS round_cost \
        , SUM(bill_cost) AS bill_cost, SUM(oil_cost) AS oil_cost, SUM(net_cost) AS net_cost \
        FROM TMS_jar_reportCostMess_Monthly \
        WHERE (MessengerID like 'MDL%' AND DateTime BETWEEN '"+ start + "' AND '" + end + "') \
        GROUP BY MessNO, MessName, MessengerID \
        ORDER BY MessNO"
        //console.log("object", sql_query)
        res_data = await select_query(dbConnectData_TransportApp, name_function, name_table, sql_query)
        callback(res_data)
    },
    async get_report_costmess_MCV(start, end, callback) {
        name_function = "get_report_costmess_MCV"
        name_table = "TMS_jar_reportCostMess_Monthly"
        sql_query = " SELECT MessNO, MessName, MessengerID, SUM(Trip) AS trip, SUM(shop) AS shop, SUM(Bill) AS bill, SUM(round_cost) AS round_cost \
        , SUM(bill_cost) AS bill_cost, SUM(oil_cost) AS oil_cost, SUM(net_cost) AS net_cost \
        FROM TMS_jar_reportCostMess_Monthly \
        WHERE (MessengerID like 'MCV%' AND DateTime BETWEEN '"+ start + "' AND '" + end + "') \
        GROUP BY MessNO, MessName, MessengerID \
        ORDER BY MessNO"
        //console.log("object", sql_query)
        res_data = await select_query(dbConnectData_TransportApp, name_function, name_table, sql_query)
        callback(res_data)
    },
    async get_daily_costmess_MCV(date, id, trip, callback) {
        console.log(date, id, trip)
        name_function = "get_daily_costmess_MCV"
        name_table = "TMS_jar_daily_cashvan"
        if (trip === 'all') {
            sql_query = " SELECT * " +
                " FROM [Data_TransportApp].[dbo].[TMS_jar_daily_cashvan]  " +
                " where MessengerID = '" + id + "' and Datetime = '" + date + "'"
        } else {
            sql_query = " SELECT * " +
                " FROM [Data_TransportApp].[dbo].[TMS_jar_daily_cashvan]  " +
                " where MessengerID = '" + id + "' and Datetime = '" + date + "' and Trip = " + trip 
        }

        console.log("object", sql_query)
        res_data = await select_query(dbConnectData_TransportApp, name_function, name_table, sql_query)
        callback(res_data)
    },
    async get_daily_costmess_MDL(date, id, type, trip, callback) {
        name_function = "get_daily_costmess_MCV"
        name_table = "TMS_jar_daily_dealer"
        if (trip === 'all') {
            sql_query = " SELECT * " +
            " FROM [Data_TransportApp].[dbo].[TMS_jar_daily_dealer]  " +
            " where MessengerID = '" + id + "' and Datetime = '" + date + "' and car_type like '" + type + "%'"
        } else {
            sql_query = " SELECT * " +
            " FROM [Data_TransportApp].[dbo].[TMS_jar_daily_dealer]  " +
            " where MessengerID = '" + id + "' and Datetime = '" + date + "' and car_type like '" + type + "%' and Trip = " + trip 
        }
        console.log("object", sql_query)
        res_data = await select_query(dbConnectData_TransportApp, name_function, name_table, sql_query)
        callback(res_data)
    },
    async get_tms_plan(start_date, end_date, express, callback) {
        name_function = "get_tms_plan"
        name_table = "TMS_jar_TMSPlan"
        sql_query = "SELECT * FROM [Data_TransportApp].[dbo].[TMS_jar_TMSPlan+BoxAmount] " +
            "WHERE [delivery_date] BETWEEN '" + start_date + "' AND '" + end_date + "' " +
            "AND [Express] = " + express
        console.log()
        res_data = await select_query(dbConnectData_TransportApp, name_function, name_table, sql_query)
        callback(res_data)
    },
    // async get_tms_plan(start_date, end_date, express, callback) {
    //     name_function = "get_tms_plan"
    //     name_table = "TMS_jar_TMSPlan"
    //     sql_query = "SELECT DISTINCT "+
    //     "dbo.TMS_Interface.so, dbo.TMS_Interface.customer_name, dbo.TMS_Interface.invoice, dbo.TMS_Interface.box_amount, CASE WHEN dbo.TMS_Interface.box_weight IS NULL  "+
    //     "THEN 0 ELSE dbo.TMS_Interface.box_weight END AS box_weight, CASE WHEN dbo.TMS_Interface.contact_phone IS NULL THEN '-' ELSE dbo.TMS_Interface.contact_phone END AS contact_phone, dbo.TMS_Interface.remark,  "+
    //     "CASE WHEN dbo.TMS_Interface.dlv_term IS NULL THEN '-' ELSE dbo.TMS_Interface.dlv_term END AS dlv_term, dbo.TMS_Interface.delivery_date, dbo.TMS_Interface.sales_group,  "+
    //     "Data_Temp.dbo.DPLV_SCSO_Transport_L1.DPL_SO_STATUS, Data_WebSalesOrder.dbo.DPLV_SO_Shipto.STREET, Data_WebSalesOrder.dbo.DPLV_SO_Shipto.CITY, dbo.TMS_State_Name.STATE_Name,  "+
    //     "CASE WHEN dbo.DPLV_SCSO_InvoiceMain.Express IS NULL THEN 0 ELSE dbo.DPLV_SCSO_InvoiceMain.Express END AS Express  "+
    //     "FROM            dbo.TMS_Interface LEFT OUTER JOIN  "+
    //     "dbo.DPLV_SCSO_InvoiceMain ON dbo.TMS_Interface.so = dbo.DPLV_SCSO_InvoiceMain.No_ LEFT OUTER JOIN  "+
    //     "Data_Temp.dbo.DPLV_SCSO_Transport_L1 ON dbo.TMS_Interface.so = Data_Temp.dbo.DPLV_SCSO_Transport_L1.SALESID LEFT OUTER JOIN  "+
    //     "Data_WebSalesOrder.dbo.DPLV_SO_Shipto INNER JOIN  "+
    //     "dbo.TMS_State_Name ON Data_WebSalesOrder.dbo.DPLV_SO_Shipto.STATE = dbo.TMS_State_Name.STATEID ON   "+
    //     "Data_Temp.dbo.DPLV_SCSO_Transport_L1.DELIVERYPOSTALADDRESS = Data_WebSalesOrder.dbo.DPLV_SO_Shipto.POSTALADDRESS "+
    //     "WHERE        (dbo.TMS_Interface.so IS NOT NULL) AND (dbo.TMS_Interface.invoice IS NOT NULL) "
    //     " AND dbo.TMS_Interface.delivery_date BETWEEN '"+ start_date + "' AND '"+ end_date + "' "+
    //     "AND dbo.DPLV_SCSO_InvoiceMain.Express = " + express
    //     res_data = await select_query(dbConnectData_TransportApp, name_function, name_table, sql_query)
    //     callback(res_data)
    // },
    async get_yearly_costmess_MCV(year, callback) {
        name_function = "get_yearly_costmess_MCV"
        name_table = "TMS_jar_CostMess_Yearly_MCV"
        sql_query = " SELECT *" +
            " FROM [Data_TransportApp].[dbo].[TMS_jar_CostMess_Yearly_MCV]" +
            " WHERE year = '" + year + "'"
        console.log("object", sql_query)
        res_data = await select_query(dbConnectData_TransportApp, name_function, name_table, sql_query)
        callback(res_data)
    },
    async get_yearly_costmess_MDL(year, callback) {
        name_function = "get_yearly_costmess_MDL"
        name_table = "TMS_jar_CostMess_Yearly_MDL"
        sql_query = " SELECT *" +
            " FROM [Data_TransportApp].[dbo].[TMS_jar_CostMess_Yearly_MDL]" +
            " WHERE year = '" + year + "'"
        //console.log("object", sql_query)
        res_data = await select_query(dbConnectData_TransportApp, name_function, name_table, sql_query)
        callback(res_data)
    },

}



module.exports = {
    model: model
}