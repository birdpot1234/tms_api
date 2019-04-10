var { dbConnectData_TransportApp, dbConnectData_Temp } = require('../connect_sql')
const { select_query, insert_query } = require("../service")
var name_function = "", name_table = "", sql_query = "", sql_where = "", sql_insert = "", res_data = ""

const model = {
    async import_excel_round(inData, callback) {
        name_function = "import_excel_round"
        name_table = "TMS_Monitor_1"

        inData.forEach((val, i) => {
            if (i + 1 == inData.length) {
                sql_insert += " ('" + val.ship_code + "','" + val.ship_name + "','" + val.ship_cost + "') "
            } else {
                sql_insert += " ('" + val.ship_code + "','" + val.ship_name + "','" + val.ship_cost + "'), "
            }
        });
        sql_query = " INSERT INTO [dbo].[RoundCost] \
        ([ship_code] \
        ,[ship_name] \
        ,[ship_cost]) \
         VALUES  "+ sql_insert
        res_data = await insert_query(dbConnectData_TransportApp, name_function, name_table, sql_query)
        sql_query = "SELECT        ship_code, ship_name, ship_cost FROM            RoundCost"
        res_data = await select_query(dbConnectData_TransportApp, name_function, name_table, sql_query)
        callback(res_data)
    },
}



module.exports = {
    model: model
}