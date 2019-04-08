var { dbConnectData_TransportApp, dbConnectData_Temp } = require('../connect_sql')
const { select_query, insert_query } = require("../service")
var name_function = "", name_table = "", sql_query = "", sql_where = "", sql_insert = "", res_data = ""


const model = {
    async import_excel_round(inData, callback) {
        name_function = "import_excel_round"
        name_table = "TMS_Monitor_1"
        inData.forEach((val, i) => {
            if(i+1 == inData.length){
                sql_insert += " ('" + val.ship1 + "','" + val.ship2 + "','" + val.ship3 + "') "
            }else{
                sql_insert += " ('" + val.ship1 + "','" + val.ship2 + "','" + val.ship3 + "'), "
            }
        });
        sql_query = ""
        res_data = await select_query(dbConnectData_TransportApp, name_function, name_table, sql_query)
        callback(res_data)
    },
}



module.exports = {
    model: model
}