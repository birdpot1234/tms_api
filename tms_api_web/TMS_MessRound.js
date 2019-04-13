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
    async get_round_mess(date,mess_code,callback){
        name_function = "get_round_mess"
        name_table = "ZTS_TMS_RoundCost_Personal"
        sql_query="SELECT   ClearingDate, MessengerID, MessName, car_type, ship_cost, Trip \
        FROM            dbo.ZTS_TMS_RoundCost_Personal \
        WHERE (MessengerID LIKE '"+mess_code+"') AND (ClearingDate LIKE '"+date+"') \
        ORDER BY MessengerID, car_type, Trip, ship_cost DESC"
        console.log("sql_query",sql_query)
        res_data = await select_query(dbConnectData_TransportApp, name_function, name_table, sql_query)
        callback(res_data)
    }
}

function _calRoundCost_Mess_Dealer(arrData){
    var totalCost=0,roundCost=0,shopCost=0
    var trip=0,cost=0,carType="",messID=""
    switch(carType){
        case 2:
        roundCost=roundCost+(cost/2)
        shopCost=shopCost+10

        roundCost=roundCost*0.69
        totalCost=roundCost+shopCost-3000
        break;
        case 4:
        roundCost=roundCost+(cost/2)
        shopCost=shopCost+10

        if(messID==="MDL_05"){
            totalCost=roundCost+shopCost
        }else{
            totalCost=roundCost+shopCost-3000
        }
        break;
        case 6:
        roundCost=roundCost+cost
        shopCost=shopCost+10

        totalCost=roundCost+shopCost
        break;
        default:break;
    }
    
}

module.exports = {
    model: model
}