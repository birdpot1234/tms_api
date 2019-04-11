var { dbConnectData_TransportApp, dbConnectData_Temp } = require('../connect_sql')
const { select_query, insert_query } = require("../service")
var name_function = "", name_table = "", sql_query = "", res_data = ""


const model = {
    async get_report_costmess_MDL(month, callback) {
        name_function = "get_report_costmess_MDL"
        name_table = "TMS_jar_reportCostMess_Monthly"
        sql_query =  " SELECT *"+
        " FROM [Data_TransportApp].[dbo].[TMS_jar_reportCostMess_Monthly]"+
        " where MessengerID like 'MDL%' and month = '"+month+"'"
        //console.log("object", sql_query)
        res_data = await select_query(dbConnectData_TransportApp, name_function, name_table, sql_query)
        callback(res_data)
    },
    async get_report_costmess_MCV(month, callback) {
        name_function = "get_report_costmess_MCV"
        name_table = "TMS_jar_reportCostMess_Monthly"
        sql_query =  " SELECT *"+
        " FROM [Data_TransportApp].[dbo].[TMS_jar_reportCostMess_Monthly]"+
        " where MessengerID like 'MCV%' and month = '"+month+"'"
        //console.log("object", sql_query)
        res_data = await select_query(dbConnectData_TransportApp, name_function, name_table, sql_query)
        callback(res_data)
    },
    async get_daily_costmess_MCV(date,id, callback) {
        name_function = "get_daily_costmess_MCV"
        name_table = "TMS_jar_daily_cashvan"
        sql_query =  " SELECT * "+
        " FROM [Data_TransportApp].[dbo].[TMS_jar_daily_cashvan]  "+
        " where MessengerID = '"+id+"' and Datetime = '"+date+"'"
        //console.log("object", sql_query)
        res_data = await select_query(dbConnectData_TransportApp, name_function, name_table, sql_query)
        callback(res_data)
    },
    async get_daily_costmess_MDL(date,id,type, callback) {
        name_function = "get_daily_costmess_MCV"
        name_table = "TMS_jar_daily_dealer"
        sql_query =  " SELECT * "+
        " FROM [Data_TransportApp].[dbo].[TMS_jar_daily_dealer]  "+
        " where MessengerID = '"+id+"' and Datetime = '"+date+"' and car_type like '"+type+"%'"
        //console.log("object", sql_query)
        res_data = await select_query(dbConnectData_TransportApp, name_function, name_table, sql_query)
        callback(res_data)
    },
}


module.exports = {
    model: model
}