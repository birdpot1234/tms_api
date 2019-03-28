var { dbConnectData_TransportApp, dbConnectData_Temp } = require('../connect_sql')
const { select_query, insert_query, server_response } = require("../service")
const moment = require('moment')
var sql = require('mssql')

const model = {
    async search_data(start_date, end_date, callback) {
        const name_function = "get_data_monitorTL_1"
        const name_table = "TMS_Monitor_1"
        const sql_query = "MERGE INTO \
        ZTS_TMS_Transsport_L1 \
        USING \
        ( \
        SELECT        TOP (100) PERCENT DPLUSAX63_GOLIVE_2017.dbo.SALESTABLE.SALESSTATUS, DPLUSAX63_GOLIVE_2017.dbo.SALESTABLE.DOCUMENTSTATE, \
                                 DPLUSAX63_GOLIVE_2017.dbo.SALESTABLE.DPLB_SCIN_SALESINVENTORYSTATUS, DPLUSAX63_GOLIVE_2017.dbo.SALESTABLE.DPL_SO_STATUS, DPLUSAX63_GOLIVE_2017.dbo.SALESTABLE.DPL_SO_CONFIRM, \
                                 DPLUSAX63_GOLIVE_2017.dbo.SALESTABLE.SALESID, DPLUSAX63_GOLIVE_2017.dbo.SALESTABLE.CUSTACCOUNT, DPLUSAX63_GOLIVE_2017.dbo.SALESTABLE.SALESNAME, \
                                 DPLUSAX63_GOLIVE_2017.dbo.SMMBUSRELSALESDISTRICTGROUP.SALESDISTRICTID, DPLUSAX63_GOLIVE_2017.dbo.SMMBUSRELSALESDISTRICTGROUP.DESCRIPTION, \
                                 DPLUSAX63_GOLIVE_2017.dbo.SALESTABLE.DLVMODE, LEFT(DPLUSAX63_GOLIVE_2017.dbo.SALESTABLE.DLVMODE, 7) AS Zone, DPLUSAX63_GOLIVE_2017.dbo.DLVMODE.TXT, \
                                 DPLUSAX63_GOLIVE_2017.dbo.SALESTABLE.RECID, SUM(ISNULL(DPLUSAX63_GOLIVE_2017.dbo.SALESLINE.QTYORDERED, 0)) AS QTYORDER, DPLUSAX63_GOLIVE_2017.dbo.SALESTABLE.SHIPPINGDATEREQUESTED, \
                                 DPLUSAX63_GOLIVE_2017.dbo.SALESTABLE.ECL_SALESREMARK AS Remark, DPLUSAX63_GOLIVE_2017.dbo.SALESTABLE.DELIVERYPOSTALADDRESS, CONVERT(varchar(10), \
                                 DPLUSAX63_GOLIVE_2017.dbo.SALESTABLE.DELIVERYDATE, 120) AS DELIVERYDATE, DPLUSAX63_GOLIVE_2017.dbo.SMMBUSRELSALESDISTRICTGROUP.DATAAREAID, \
                                 SUM(ISNULL(DPLUSAX63_GOLIVE_2017.dbo.SALESLINE.REMAINSALESPHYSICAL, 0)) AS deliveryRemainder, SUM(ISNULL(DPLUSAX63_GOLIVE_2017.dbo.SALESLINE.REMAINSALESFINANCIAL, 0)) AS invoiceRemainder, \
                                 DPLUSAX63_GOLIVE_2017.dbo.SALESTABLE.CUSTGROUP, MAX(LEFT(DPLUSAX63_GOLIVE_2017.dbo.SALESLINE.ITEMID, 3)) AS L2, DPLUSAX63_GOLIVE_2017.dbo.SALESTABLE.DLVTERM, \
                                 DPLUSAX63_GOLIVE_2017.dbo.SALESTABLE.INVENTLOCATIONID, DPLUSAX63_GOLIVE_2017.dbo.CUSTTABLE.DPL_HUB_DLVTERM \
        FROM            DPLUSAX63_GOLIVE_2017.dbo.SMMBUSRELSALESDISTRICTGROUP RIGHT OUTER JOIN \
                                 DPLUSAX63_GOLIVE_2017.dbo.CUSTTABLE ON DPLUSAX63_GOLIVE_2017.dbo.SMMBUSRELSALESDISTRICTGROUP.SALESDISTRICTID = DPLUSAX63_GOLIVE_2017.dbo.CUSTTABLE.SALESDISTRICTID RIGHT OUTER JOIN \
                                 DPLUSAX63_GOLIVE_2017.dbo.SALESTABLE ON DPLUSAX63_GOLIVE_2017.dbo.CUSTTABLE.ACCOUNTNUM = DPLUSAX63_GOLIVE_2017.dbo.SALESTABLE.INVOICEACCOUNT LEFT OUTER JOIN \
                                 DPLUSAX63_GOLIVE_2017.dbo.DLVMODE ON DPLUSAX63_GOLIVE_2017.dbo.SALESTABLE.DLVMODE = DPLUSAX63_GOLIVE_2017.dbo.DLVMODE.CODE LEFT OUTER JOIN \
                                 DPLUSAX63_GOLIVE_2017.dbo.SALESLINE ON DPLUSAX63_GOLIVE_2017.dbo.SALESTABLE.SALESID = DPLUSAX63_GOLIVE_2017.dbo.SALESLINE.SALESID \
        WHERE        (DPLUSAX63_GOLIVE_2017.dbo.SALESTABLE.SALESTYPE <> 4) AND (DPLUSAX63_GOLIVE_2017.dbo.SMMBUSRELSALESDISTRICTGROUP.DATAAREAID = N'DPL') AND (CONVERT(varchar(10), \
                                 DPLUSAX63_GOLIVE_2017.dbo.SALESTABLE.DELIVERYDATE, 120) BETWEEN '"+ start_date + "' AND '" + end_date + "') \
        GROUP BY DPLUSAX63_GOLIVE_2017.dbo.SALESTABLE.SALESID, DPLUSAX63_GOLIVE_2017.dbo.SALESTABLE.SALESSTATUS, DPLUSAX63_GOLIVE_2017.dbo.SALESTABLE.DOCUMENTSTATE, \
                                 DPLUSAX63_GOLIVE_2017.dbo.SALESTABLE.DPLB_SCIN_SALESINVENTORYSTATUS, DPLUSAX63_GOLIVE_2017.dbo.SALESTABLE.DPL_SO_STATUS, DPLUSAX63_GOLIVE_2017.dbo.SALESTABLE.DPL_SO_CONFIRM, \
                                 DPLUSAX63_GOLIVE_2017.dbo.SALESTABLE.CUSTACCOUNT, DPLUSAX63_GOLIVE_2017.dbo.SALESTABLE.SALESNAME, DPLUSAX63_GOLIVE_2017.dbo.SMMBUSRELSALESDISTRICTGROUP.SALESDISTRICTID, \
                                 DPLUSAX63_GOLIVE_2017.dbo.SMMBUSRELSALESDISTRICTGROUP.DESCRIPTION, DPLUSAX63_GOLIVE_2017.dbo.SALESTABLE.DLVMODE, DPLUSAX63_GOLIVE_2017.dbo.DLVMODE.TXT, \
                                 LEFT(DPLUSAX63_GOLIVE_2017.dbo.SALESTABLE.DLVMODE, 7), DPLUSAX63_GOLIVE_2017.dbo.SALESTABLE.RECID, DPLUSAX63_GOLIVE_2017.dbo.SALESTABLE.SHIPPINGDATEREQUESTED, \
                                 DPLUSAX63_GOLIVE_2017.dbo.SALESTABLE.ECL_SALESREMARK, DPLUSAX63_GOLIVE_2017.dbo.SALESTABLE.DELIVERYPOSTALADDRESS, CONVERT(varchar(10), \
                                 DPLUSAX63_GOLIVE_2017.dbo.SALESTABLE.DELIVERYDATE, 120), DPLUSAX63_GOLIVE_2017.dbo.SMMBUSRELSALESDISTRICTGROUP.DATAAREAID, DPLUSAX63_GOLIVE_2017.dbo.SALESTABLE.CUSTGROUP, \
                                 DPLUSAX63_GOLIVE_2017.dbo.SALESTABLE.DLVTERM, DPLUSAX63_GOLIVE_2017.dbo.SALESTABLE.INVENTLOCATIONID, DPLUSAX63_GOLIVE_2017.dbo.CUSTTABLE.DPL_HUB_DLVTERM \
         ) DPLV_SCSO_Transport_L1 \
        ON \
        ZTS_TMS_Transsport_L1.SALESID = DPLV_SCSO_Transport_L1.SALESID \
        WHEN MATCHED THEN \
        UPDATE SET \
        ZTS_TMS_Transsport_L1.SALESSTATUS = DPLV_SCSO_Transport_L1.SALESSTATUS \
        ,ZTS_TMS_Transsport_L1.DOCUMENTSTATE  =DPLV_SCSO_Transport_L1.DOCUMENTSTATE \
        ,ZTS_TMS_Transsport_L1.DPLB_SCIN_SALESINVENTORYSTATUS    =DPLV_SCSO_Transport_L1.DPLB_SCIN_SALESINVENTORYSTATUS \
        ,ZTS_TMS_Transsport_L1.DPL_SO_STATUS      =DPLV_SCSO_Transport_L1.DPL_SO_STATUS \
        ,ZTS_TMS_Transsport_L1.DPL_SO_CONFIRM  =DPLV_SCSO_Transport_L1.DPL_SO_CONFIRM \
        ,ZTS_TMS_Transsport_L1.CUSTACCOUNT =DPLV_SCSO_Transport_L1.CUSTACCOUNT \
        ,ZTS_TMS_Transsport_L1.SALESNAME            =DPLV_SCSO_Transport_L1.SALESNAME \
        ,ZTS_TMS_Transsport_L1.SALESDISTRICTID=DPLV_SCSO_Transport_L1.SALESDISTRICTID \
        ,ZTS_TMS_Transsport_L1.[DESCRIPTION]      =DPLV_SCSO_Transport_L1.[DESCRIPTION] \
        ,ZTS_TMS_Transsport_L1.DLVMODE  =DPLV_SCSO_Transport_L1.DLVMODE \
        ,ZTS_TMS_Transsport_L1.[Zone] =DPLV_SCSO_Transport_L1.[Zone] \
        ,ZTS_TMS_Transsport_L1.TXT           =DPLV_SCSO_Transport_L1.TXT \
        ,ZTS_TMS_Transsport_L1.RECID           =DPLV_SCSO_Transport_L1.RECID \
        ,ZTS_TMS_Transsport_L1.QTYORDER            =DPLV_SCSO_Transport_L1.QTYORDER \
        ,ZTS_TMS_Transsport_L1.SHIPPINGDATEREQUESTED         =DPLV_SCSO_Transport_L1.SHIPPINGDATEREQUESTED \
        ,ZTS_TMS_Transsport_L1.Remark          =DPLV_SCSO_Transport_L1.DELIVERYPOSTALADDRESS \
        ,ZTS_TMS_Transsport_L1.DELIVERYDATE           =DPLV_SCSO_Transport_L1.DELIVERYDATE \
        ,ZTS_TMS_Transsport_L1.[DATAAREAID]           =DPLV_SCSO_Transport_L1.[DATAAREAID] \
        ,ZTS_TMS_Transsport_L1.[deliveryRemainder]              =DPLV_SCSO_Transport_L1.[deliveryRemainder] \
        ,ZTS_TMS_Transsport_L1.[invoiceRemainder]              =DPLV_SCSO_Transport_L1.[invoiceRemainder] \
        ,ZTS_TMS_Transsport_L1.[CUSTGROUP]              =DPLV_SCSO_Transport_L1.[CUSTGROUP] \
        ,ZTS_TMS_Transsport_L1.L2              =DPLV_SCSO_Transport_L1.L2 \
        ,ZTS_TMS_Transsport_L1.[DLVTERM]              =DPLV_SCSO_Transport_L1.[DLVTERM] \
        ,ZTS_TMS_Transsport_L1.INVENTLOCATIONID              =DPLV_SCSO_Transport_L1.INVENTLOCATIONID \
        ,ZTS_TMS_Transsport_L1.[DPL_HUB_DLVTERM]              =DPLV_SCSO_Transport_L1.[DPL_HUB_DLVTERM] \
        WHEN NOT MATCHED THEN \
        INSERT \
                    ([SALESSTATUS] \
                   ,[DOCUMENTSTATE] \
                   ,[DPLB_SCIN_SALESINVENTORYSTATUS] \
                   ,[DPL_SO_STATUS] \
                   ,[DPL_SO_CONFIRM] \
                   ,[SALESID] \
                   ,[CUSTACCOUNT] \
                   ,[SALESNAME] \
                   ,[SALESDISTRICTID] \
                   ,[DESCRIPTION] \
                   ,[DLVMODE] \
                   ,[Zone] \
                   ,[TXT] \
                   ,[RECID] \
                   ,[QTYORDER] \
                   ,[SHIPPINGDATEREQUESTED] \
                   ,[Remark] \
                   ,[DELIVERYPOSTALADDRESS] \
                   ,[DELIVERYDATE] \
                   ,[DATAAREAID] \
                   ,[deliveryRemainder] \
                   ,[invoiceRemainder] \
                   ,[CUSTGROUP] \
                   ,[L2] \
                   ,[DLVTERM] \
                   ,[INVENTLOCATIONID] \
                   ,[DPL_HUB_DLVTERM]) \
        VALUES \
        (DPLV_SCSO_Transport_L1.[SALESSTATUS] \
        ,DPLV_SCSO_Transport_L1.[DOCUMENTSTATE] \
        ,DPLV_SCSO_Transport_L1.[DPLB_SCIN_SALESINVENTORYSTATUS] \
        ,DPLV_SCSO_Transport_L1.[DPL_SO_STATUS] \
        ,DPLV_SCSO_Transport_L1.[DPL_SO_CONFIRM] \
        ,DPLV_SCSO_Transport_L1.[SALESID] \
        ,DPLV_SCSO_Transport_L1.[CUSTACCOUNT] \
        ,DPLV_SCSO_Transport_L1.[SALESNAME] \
        ,DPLV_SCSO_Transport_L1.[SALESDISTRICTID] \
        ,DPLV_SCSO_Transport_L1.[DESCRIPTION] \
        ,DPLV_SCSO_Transport_L1.[DLVMODE] \
        ,DPLV_SCSO_Transport_L1.[Zone] \
        ,DPLV_SCSO_Transport_L1.[TXT] \
        ,DPLV_SCSO_Transport_L1.[RECID] \
        ,DPLV_SCSO_Transport_L1.[QTYORDER] \
        ,DPLV_SCSO_Transport_L1.[SHIPPINGDATEREQUESTED] \
        ,DPLV_SCSO_Transport_L1.[Remark] \
        ,DPLV_SCSO_Transport_L1.[DELIVERYPOSTALADDRESS] \
        ,DPLV_SCSO_Transport_L1.[DELIVERYDATE] \
        ,DPLV_SCSO_Transport_L1.[DATAAREAID] \
        ,DPLV_SCSO_Transport_L1.[deliveryRemainder] \
        ,DPLV_SCSO_Transport_L1.[invoiceRemainder] \
        ,DPLV_SCSO_Transport_L1.[CUSTGROUP] \
        ,DPLV_SCSO_Transport_L1.[L2] \
        ,DPLV_SCSO_Transport_L1.[DLVTERM] \
        ,DPLV_SCSO_Transport_L1.[INVENTLOCATIONID] \
        ,DPLV_SCSO_Transport_L1.[DPL_HUB_DLVTERM]);"
        const res_data = await insert_query(dbConnectData_Temp, name_function, name_table, sql_query)
        const sql_query1 = "MERGE INTO \
        [TMS_Monitor_1] \
        USING \
        ( \
        SELECT        DLV_Date_WaitPick, GCode_WaitPick, GName_WaitPick, WaitPick_so_amt, WaitPick_bill \
        FROM            dbo.ZTS_TMS_SO_WaitPick \
        WHERE DLV_Date_WaitPick BETWEEN '"+ start_date + "' AND '" + end_date + "' \
         ) ZTS_TMS_Monitor_1 \
        ON \
        [TMS_Monitor_1].[date] = ZTS_TMS_Monitor_1.DLV_Date_WaitPick \
        AND \
        [TMS_Monitor_1].[group_customer] = ZTS_TMS_Monitor_1.GCode_WaitPick \
        WHEN MATCHED THEN \
        UPDATE SET \
        [TMS_Monitor_1].[wait_pick_order_qty]=ZTS_TMS_Monitor_1.WaitPick_bill \
        ,[TMS_Monitor_1].[wait_pick_order_amt]=ZTS_TMS_Monitor_1.WaitPick_so_amt \
        ,[TMS_Monitor_1].[last_update]=GETDATE() \
        WHEN NOT MATCHED THEN \
        INSERT \
        ([date] \
        ,[group_customer] \
        ,[wait_pick_order_qty] \
        ,[wait_pick_order_amt] \
        ,[last_update]) \
        VALUES \
        (ZTS_TMS_Monitor_1.DLV_Date_WaitPick \
                   ,ZTS_TMS_Monitor_1.GCode_WaitPick \
                   ,ZTS_TMS_Monitor_1.WaitPick_bill \
                   ,ZTS_TMS_Monitor_1.WaitPick_so_amt \
                   ,GETDATE()); \
        MERGE INTO \
        [TMS_Monitor_1] \
        USING \
        ( \
        SELECT        DLV_Date_StartPick, GCode_StartPick, GName_StartPick, StartPick_so_amt, StartPick_bill \
        FROM            dbo.ZTS_TMS_SO_StartPick \
        WHERE DLV_Date_StartPick BETWEEN '"+ start_date + "' AND '" + end_date + "' \
         ) ZTS_TMS_Monitor_1 \
        ON \
        [TMS_Monitor_1].[date] = ZTS_TMS_Monitor_1.DLV_Date_StartPick \
        AND \
        [TMS_Monitor_1].[group_customer] = ZTS_TMS_Monitor_1.GCode_StartPick \
        WHEN MATCHED THEN \
        UPDATE SET \
        [TMS_Monitor_1].[start_pick_order_qty]=[ZTS_TMS_Monitor_1].StartPick_bill \
        ,[TMS_Monitor_1].[start_pick_order_amt]=[ZTS_TMS_Monitor_1].StartPick_so_amt \
        ,[TMS_Monitor_1].[last_update]=GETDATE() \
        WHEN NOT MATCHED THEN \
        INSERT \
        ([date] \
        ,[group_customer] \
        ,[start_pick_order_qty] \
        ,[start_pick_order_amt] \
        ,[last_update]) \
        VALUES \
        (ZTS_TMS_Monitor_1.DLV_Date_StartPick \
                   ,ZTS_TMS_Monitor_1.GCode_StartPick \
                   ,[ZTS_TMS_Monitor_1].StartPick_bill \
                   ,[ZTS_TMS_Monitor_1].StartPick_so_amt \
                   ,GETDATE()); \
        MERGE INTO \
        [TMS_Monitor_1] \
        USING \
        ( \
        SELECT        DLV_Date_Total, GCode_Total, GName_Total, Total_bill, Total_so_amt \
        FROM            dbo.ZTS_TMS_SO_Total \
        WHERE DLV_Date_Total BETWEEN '"+ start_date + "' AND '" + end_date + "' \
         ) ZTS_TMS_Monitor_1 \
        ON \
        [TMS_Monitor_1].[date] = ZTS_TMS_Monitor_1.DLV_Date_Total \
        AND \
        [TMS_Monitor_1].[group_customer] = ZTS_TMS_Monitor_1.GCode_Total \
        WHEN MATCHED THEN \
        UPDATE SET \
        [TMS_Monitor_1].[total_order_qty]=[ZTS_TMS_Monitor_1].Total_bill \
        ,[TMS_Monitor_1].[total_order_amt]=[ZTS_TMS_Monitor_1].Total_so_amt \
        ,[TMS_Monitor_1].[last_update]=GETDATE() \
        WHEN NOT MATCHED THEN \
        INSERT \
        ([date] \
        ,[group_customer] \
        ,[total_order_qty] \
        ,[total_order_amt] \
        ,[last_update]) \
        VALUES \
        (ZTS_TMS_Monitor_1.DLV_Date_Total \
                   ,ZTS_TMS_Monitor_1.GCode_Total \
                   ,ZTS_TMS_Monitor_1.Total_bill \
                   ,ZTS_TMS_Monitor_1.Total_so_amt \
                   ,GETDATE()); \
        MERGE INTO \
        [TMS_Monitor_1] \
        USING \
        ( \
        SELECT        DLV_Date_FinishPick, GCode_FinishPick, GName_FinishPick, FinishPick_so_amt, FinishPick_bill \
        FROM            dbo.ZTS_TMS_SO_FinishPick \
        WHERE DLV_Date_FinishPick BETWEEN '"+ start_date + "' AND '" + end_date + "' \
         ) ZTS_TMS_Monitor_1 \
        ON \
        [TMS_Monitor_1].[date] = ZTS_TMS_Monitor_1.DLV_Date_FinishPick \
        AND \
        [TMS_Monitor_1].[group_customer] = ZTS_TMS_Monitor_1.GCode_FinishPick \
        WHEN MATCHED THEN \
        UPDATE SET \
        [TMS_Monitor_1].[finish_pick_order_qty]=[ZTS_TMS_Monitor_1].[FinishPick_bill] \
        ,[TMS_Monitor_1].[finish_pick_order_amt]=[ZTS_TMS_Monitor_1].[FinishPick_so_amt] \
        ,[TMS_Monitor_1].[last_update]=GETDATE() \
        WHEN NOT MATCHED THEN \
        INSERT \
        ([date] \
        ,[group_customer] \
        ,[finish_pick_order_qty] \
        ,[finish_pick_order_amt] \
        ,[last_update]) \
        VALUES \
        (ZTS_TMS_Monitor_1.DLV_Date_FinishPick \
                   ,ZTS_TMS_Monitor_1.GCode_FinishPick \
                   ,[ZTS_TMS_Monitor_1].FinishPick_bill \
                   ,[ZTS_TMS_Monitor_1].FinishPick_so_amt \
                   ,GETDATE()); \
        MERGE INTO \
        [TMS_Monitor_1] \
        USING \
        ( \
        SELECT        DLV_Date_RemainPick, GCode_RemainPick, GName_RemainPick, RemainPick_so_amt, RemainPick_bill \
        FROM            dbo.ZTS_TMS_SO_RemainPick \
        WHERE DLV_Date_RemainPick BETWEEN '"+ start_date + "' AND '" + end_date + "' \
         ) ZTS_TMS_Monitor_1 \
        ON \
        [TMS_Monitor_1].[date] = ZTS_TMS_Monitor_1.DLV_Date_RemainPick \
        AND \
        [TMS_Monitor_1].[group_customer] = ZTS_TMS_Monitor_1.GCode_RemainPick \
        WHEN MATCHED THEN \
        UPDATE SET \
        [TMS_Monitor_1].[remain_order_qty]=[ZTS_TMS_Monitor_1].RemainPick_bill \
        ,[TMS_Monitor_1].[remain_order_amt]=[ZTS_TMS_Monitor_1].RemainPick_so_amt \
        ,[TMS_Monitor_1].[last_update]=GETDATE() \
        WHEN NOT MATCHED THEN \
        INSERT \
        ([date] \
        ,[group_customer] \
        ,[remain_order_qty] \
        ,[remain_order_amt] \
        ,[last_update]) \
        VALUES \
        (ZTS_TMS_Monitor_1.DLV_Date_RemainPick \
                   ,ZTS_TMS_Monitor_1.GCode_RemainPick \
                   ,[ZTS_TMS_Monitor_1].RemainPick_bill \
                   ,[ZTS_TMS_Monitor_1].RemainPick_so_amt \
                   ,GETDATE());"
        const res_data1 = await insert_query(dbConnectData_TransportApp, name_function, name_table, sql_query1)
        callback(res_data)
    },
    async get_data_monitorTL_1(start_date, end_date, callback) {
        const name_function = "get_data_monitorTL_1"
        const name_table = "TMS_Monitor_1"
        const sql_query = "SELECT       id, date, group_customer, CASE WHEN wait_pick_order_qty IS NULL THEN 0 ELSE wait_pick_order_qty END AS wait_pick_order_qty, CASE WHEN wait_pick_order_amt IS NULL \
        THEN 0 ELSE wait_pick_order_amt END AS wait_pick_order_amt, CASE WHEN start_pick_order_qty IS NULL THEN 0 ELSE start_pick_order_qty END AS start_pick_order_qty, CASE WHEN start_pick_order_amt IS NULL \
        THEN 0 ELSE start_pick_order_amt END AS start_pick_order_amt, CASE WHEN back_order_qty IS NULL THEN 0 ELSE back_order_qty END AS back_order_qty, CASE WHEN back_order_amt IS NULL \
        THEN 0 ELSE back_order_amt END AS back_order_amt \
        FROM            TMS_Monitor_1 \
         WHERE ([date] BETWEEN '"+ start_date + "' AND '" + end_date + "' )"
        const res_data = await select_query(dbConnectData_TransportApp, name_function, name_table, sql_query)
        callback(res_data)
        // var data1 = await select_query("","","select top(10) * FROM            TMS_Report_Account")

        // const [d1,d2]=await Promise.all([select_query("","","select top(1) * FROM            TMS_Report_Account"),select_query("","","select top(1000) * FROM            TMS_Monitor_1")])
        //--- Promise.all คือสั่งให้ทำงานเป็น Parallel กันและจะรอผลลัพท์ทั้งหมดก่อนจะคืนค่า
        // resp.json(data2)
        // console.log("res_data",res_data)
    },
    async get_data_monitorTR_1(start_date, end_date, callback) {
        const sql_query = "SELECT id, date, group_customer, CASE WHEN total_order_qty IS NULL THEN 0 ELSE total_order_qty END AS total_order_qty, CASE WHEN total_order_amt IS NULL THEN 0 ELSE total_order_amt END AS total_order_amt, \
        CASE WHEN finish_pick_order_qty IS NULL THEN 0 ELSE finish_pick_order_qty END AS finish_pick_order_qty, CASE WHEN finish_pick_order_amt IS NULL THEN 0 ELSE finish_pick_order_amt END AS finish_pick_order_amt, \
        CASE WHEN remain_order_qty IS NULL THEN 0 ELSE remain_order_qty END AS remain_order_qty, CASE WHEN remain_order_amt IS NULL THEN 0 ELSE remain_order_amt END AS remain_order_amt \
        FROM            TMS_Monitor_1 \
         WHERE ([date] BETWEEN '"+ start_date + "' AND '" + end_date + "' )"
        const res_data = await select_query(dbConnectData_TransportApp, name_function, name_table, sql_query)
        callback(res_data)
    },
    get_data_monitorB_1(start_date, end_date, callback) {

    },

    get_data_monitorTL_2(start_date, end_date, callback) {

    },
    get_data_monitorTR_2(start_date, end_date, callback) {

    },
    get_data_monitorB_2(start_date, end_date, callback) {

    }
}



module.exports = {
    model: model
}