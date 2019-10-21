var { dbConnectData_TransportApp, dbConnectData_Temp } = require('../connect_sql')
const { select_query, insert_query } = require("../service")
var name_function = "", name_table = "", sql_query = "", sql_where = "", sql_insert = "", res_data = ""
const moment = require("moment")

const model = {
    async import_excel_round(inData, callback) {
        name_function = "import_excel_round"
        name_table = "TMS_Monitor_1"

        inData.forEach((val, i) => {
            if (i + 1 == inData.length) {
                sql_insert += " ('" + val.ship_code + "','" + val.ship_name + "','" + val.ship_cost + "','" + val.ship_cost2 + "','" + val.ship_type + "') "
            } else {
                sql_insert += " ('" + val.ship_code + "','" + val.ship_name + "','" + val.ship_cost + "','" + val.ship_cost2 + "','" + val.ship_type + "'), "
            }
        });
        sql_query = " INSERT INTO [dbo].[RoundCost] \
        ([ship_code] \
        ,[ship_name] \
        ,[ship_cost] \
        ,[ship_cost2] \
        ,[ship_type]) \
         VALUES  "+ sql_insert
        //  console.log("sql_query",sql_query)
        try {
            res_data = await insert_query(dbConnectData_TransportApp, name_function, name_table, sql_query)
            sql_query = "SELECT        ship_code, ship_name, ship_cost,ship_cost2,ship_type FROM            RoundCost"
            res_data = await select_query(dbConnectData_TransportApp, name_function, name_table, sql_query)
            callback(res_data)
        } catch (error) {
            console.log("error", error)
        }
    },
    async get_round_mess(date, mess_code, num_ship, callback) {
        name_function = "get_round_mess"
        name_table = "ZTS_TMS_RoundCost_Personal"
        if (mess_code.substring(0, 1) === "M") {
            sql_query = "SELECT   ClearingDate, MessengerID, MessName, car_type, ship_cost, Trip, ship_name, CustomerID, CustomerName, INVOICEID, \
        ship_code        FROM            dbo.ZTS_TMS_RoundCost_Personal \
        WHERE (MessengerID LIKE '"+ mess_code + "') AND (ClearingDate LIKE '" + date + "') AND (ship_type LIKE '" + mess_code.substring(1, 3) + "') \
        GROUP BY ClearingDate, Trip, MessengerID, car_type, ship_code, ship_name, bill_count, ship_cost, round_cost \
        ORDER BY MessengerID, car_type, Trip, ship_cost DESC"
        } else if (mess_code.substring(0, 1) === "S") {
            if (num_ship === "Staff Ship1") {
                sql_query = "SELECT   ClearingDate, MessengerID, MessName, car_type, ship_cost,ship_cost2, Trip, ship_name, CustomerID, CustomerName, INVOICEID, \
                ship_code        FROM            dbo.ZTS_TMS_RoundCost_Personal \
                WHERE (shipment_staff_1 LIKE '"+ mess_code + "') AND (ClearingDate LIKE '" + date + "') AND (ship_type LIKE '" + mess_code.substring(1, 3) + "') \
                GROUP BY ClearingDate, Trip, MessengerID, car_type, ship_code, ship_name, bill_count, ship_cost, round_cost \
                ORDER BY MessengerID, car_type, Trip, ship_cost DESC"
            } else if (num_ship === "Staff Ship2") {
                sql_query = "SELECT   ClearingDate, MessengerID, MessName, car_type, ship_cost,ship_cost2, Trip, ship_name, CustomerID, CustomerName, INVOICEID, \
                ship_code        FROM            dbo.ZTS_TMS_RoundCost_Personal \
                WHERE (shipment_staff_2 LIKE '"+ mess_code + "') AND (ClearingDate LIKE '" + date + "') AND (ship_type LIKE '" + mess_code.substring(1, 3) + "') \
                GROUP BY ClearingDate, Trip, MessengerID, car_type, ship_code, ship_name, bill_count, ship_cost, round_cost \
                ORDER BY MessengerID, car_type, Trip, ship_cost DESC"
            } else if (num_ship === "Staff Ship3") {
                sql_query = "SELECT   ClearingDate, MessengerID, MessName, car_type, ship_cost,ship_cost2, Trip, ship_name, CustomerID, CustomerName, INVOICEID, \
                ship_code        FROM            dbo.ZTS_TMS_RoundCost_Personal \
                WHERE (shipment_staff_3 LIKE '"+ mess_code + "') AND (ClearingDate LIKE '" + date + "') AND (ship_type LIKE '" + mess_code.substring(1, 3) + "') \
                GROUP BY ClearingDate, Trip, MessengerID, car_type, ship_code, ship_name, bill_count, ship_cost, round_cost \
                ORDER BY MessengerID, car_type, Trip, ship_cost DESC"
            }
        }
        try {
            res_data = await select_query(dbConnectData_TransportApp, name_function, name_table, sql_query)
            callback(res_data)
        } catch (error) {
            console.log("error", error)
            callback(error)
        }
    },
    async get_group_shipCode(date, mess_code, num_ship, callback) {
        name_function = "get_group_shipCode"
        name_table = "ZTS_TMS_RoundMess_GShipCode"
        if (mess_code.substring(0, 1) === "M") {
            sql_query = "SELECT    ClearingDate, MessengerID, ship_code, ship_name, Trip, car_type, ship_cost, round_cost \
            ,ship_cost2,staff_cost \
            FROM            dbo.ZTS_TMS_RoundMess_GShipCode \
            WHERE (MessengerID LIKE '"+ mess_code + "') AND (ClearingDate LIKE '" + date + "') AND (ship_type LIKE '" + mess_code.substring(1, 3) + "') \
            ORDER BY MessengerID, Trip, ship_cost DESC"
        } else if (mess_code.substring(0, 1) === "S") {
            if (num_ship === "Staff Ship1") {
                sql_query = "SELECT    ClearingDate, MessengerID, ship_code, ship_name, Trip, car_type, ship_cost, round_cost \
                ,ship_cost2,staff_cost \
                FROM            dbo.ZTS_TMS_RoundMess_GShipCode \
                WHERE (shipment_staff_1 LIKE '"+ mess_code + "') AND (ClearingDate LIKE '" + date + "') AND (ship_type LIKE '" + mess_code.substring(1, 3) + "') \
                ORDER BY MessengerID, Trip, ship_cost DESC"
            } else if (num_ship === "Staff Ship2") {
                sql_query = "SELECT    ClearingDate, MessengerID, ship_code, ship_name, Trip, car_type, ship_cost, round_cost \
                ,ship_cost2,staff_cost \
                FROM            dbo.ZTS_TMS_RoundMess_GShipCode \
                WHERE (shipment_staff_2 LIKE '"+ mess_code + "') AND (ClearingDate LIKE '" + date + "') AND (ship_type LIKE '" + mess_code.substring(1, 3) + "') \
                ORDER BY MessengerID, Trip, ship_cost DESC"
            } else if (num_ship === "Staff Ship3") {
                sql_query = "SELECT    ClearingDate, MessengerID, ship_code, ship_name, Trip, car_type, ship_cost, round_cost \
                ,ship_cost2,staff_cost \
                FROM            dbo.ZTS_TMS_RoundMess_GShipCode \
                WHERE (shipment_staff_3 LIKE '"+ mess_code + "') AND (ClearingDate LIKE '" + date + "') AND (ship_type LIKE '" + mess_code.substring(1, 3) + "') \
                ORDER BY MessengerID, Trip, ship_cost DESC"
            }
        }
        res_data = await select_query(dbConnectData_TransportApp, name_function, name_table, sql_query)
        callback(res_data)
    },
    async get_group_billCost(date, mess_code, num_ship, callback) {
        name_function = "get_group_billCost"
        name_table = "ZTS_TMS_RoundCost_BillCost"
        sql_query = "SELECT        TOP (100) PERCENT ClearingDate, MessengerID, car_type, bill_cost \
        FROM            dbo.ZTS_TMS_RoundCost_BillCost \
        WHERE (MessengerID LIKE '"+ mess_code + "') AND (ClearingDate LIKE '" + date + "') AND (ship_type LIKE '" + mess_code.substring(1, 3) + "')"
        res_data = await select_query(dbConnectData_TransportApp, name_function, name_table, sql_query)
        callback(res_data)
    },
    async post_insert_roundCost(inData, callback) {
        name_function = "post_insert_roundCost"
        name_table = "TMS_RoundCost"
        var dataNow = moment().format("YYYY-MM-DD")
        console.log("inData", inData)
        inData.forEach((val) => {
            sql_insert = `('${val.mess_code}','${val.mess_name}','${val.clear_date}','${dataNow}'
            ,'${val.bill_count}','${val.bill_cost}','${val.rate_cost}','${val.round_cost}','${val.oil_cost}'
            ,'${val.net_cost}','${val.car_type}')`
        });
        sql_query=`IF EXISTS (SELECT id FROM TMS_RoundCost WHERE clear_date LIKE '${va}' )`
        sql_query = "INSERT INTO [dbo].[TMS_RoundCost] \
        ([mess_code] \
        ,[mess_name] \
        ,[create_date] \
        ,[bill_count] \
        ,[bill_cost] \
        ,[rate_cost] \
        ,[round_cost] \
        ,[oil_cost] \
        ,[net_cost] \
        ,[car_type]) \
        VALUES "+ sql_insert
        var res_query = await insert_query(dbConnectData_TransportApp, name_function, name_table, sql_query)
        callback(res_query)
    },
    async get_round_report(stDate, enDate, mess_code, num_ship, callback) {
        name_function = "get_round_report"
        name_table = "ZTS_TMS_Roundcost_Report"
        var mess1digit = mess_code.substring(0, 1)
        if (mess1digit == "M") {
            sql_query = "SELECT        ClearingDate,Trip, MessengerID,car_type, ship_code, ship_name, bill_count, ship_cost, round_cost \
        FROM            dbo.ZTS_TMS_Roundcost_Report \
        WHERE        (ClearingDate BETWEEN '"+ stDate + "' AND '" + enDate + "') AND (MessengerID = '" + mess_code + "') AND (ship_type LIKE '" + mess_code.substring(1, 3) + "') \
        GROUP BY ClearingDate, Trip, MessengerID, car_type, ship_code, ship_name, bill_count, ship_cost, round_cost \
        ORDER BY ship_cost DESC,Trip"
        } else if (mess1digit == "S") {
            if (num_ship === "Staff Ship1") {
                sql_query = "SELECT        * \
            FROM            dbo.ZTS_TMS_Roundcost_Report \
            WHERE        (ClearingDate BETWEEN '"+ stDate + "' AND '" + enDate + "') AND (shipment_staff_1 = '" + mess_code + "') AND (ship_type LIKE '" + mess_code.substring(1, 3) + "') \
            GROUP BY ClearingDate, Trip, MessengerID, car_type, ship_code, ship_name, bill_count, ship_cost, round_cost \
            ORDER BY ship_cost DESC,Trip"
            } else if (num_ship === "Staff Ship2") {
                sql_query = "SELECT        * \
            FROM            dbo.ZTS_TMS_Roundcost_Report \
            WHERE        (ClearingDate BETWEEN '"+ stDate + "' AND '" + enDate + "') AND (shipment_staff_2 = '" + mess_code + "') AND (ship_type LIKE '" + mess_code.substring(1, 3) + "') \
            GROUP BY ClearingDate, Trip, MessengerID, car_type, ship_code, ship_name, bill_count, ship_cost, round_cost \
            ORDER BY ship_cost DESC,Trip"
            } else if (num_ship === "Staff Ship3") {
                sql_query = "SELECT        * \
            FROM            dbo.ZTS_TMS_Roundcost_Report \
            WHERE        (ClearingDate BETWEEN '"+ stDate + "' AND '" + enDate + "') AND (shipment_staff_3 = '" + mess_code + "') AND (ship_type LIKE '" + mess_code.substring(1, 3) + "') \
            GROUP BY ClearingDate, Trip, MessengerID, car_type, ship_code, ship_name, bill_count, ship_cost, round_cost \
            ORDER BY ship_cost DESC,Trip"
            }
        }
        console.log("sql_query", sql_query);
        res_data = await select_query(dbConnectData_TransportApp, name_function, name_table, sql_query)
        callback(res_data)
    }
}

function _calRoundCost_Mess_Dealer(arrData) {
    var totalCost = 0, roundCost = 0, shopCost = 0
    var trip = 0, cost = 0, carType = "", messID = ""
    switch (carType) {
        case 2:
            roundCost = roundCost + (cost / 2)
            shopCost = shopCost + 10

            roundCost = roundCost * 0.69
            totalCost = roundCost + shopCost - 3000
            break;
        case 4:
            roundCost = roundCost + (cost / 2)
            shopCost = shopCost + 10

            if (messID === "MDL_05") {
                totalCost = roundCost + shopCost
            } else {
                totalCost = roundCost + shopCost - 3000
            }
            break;
        case 6:
            roundCost = roundCost + cost
            shopCost = shopCost + 10

            totalCost = roundCost + shopCost
            break;
        default: break;
    }

}

module.exports = {
    model: model
}