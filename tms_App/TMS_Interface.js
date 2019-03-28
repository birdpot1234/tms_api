var { dbConnectData_TransportApp } = require('../connect_sql')
const { save_log, server_response } = require("../service")
var sql = require('mssql')

const model = {
    check_status_claim(tms_doc, status, check_status, callback) {
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            if (err) {
                save_log("Connection is close", "update_status_claim_confirm", "TMS_Interface", "No connection")
                callback(server_response(500, "Connection is close", ""))
            }
            var req = new sql.Request(pool)

            var sql_query = "SELECT tms_document,claim_document,  status \
            FROM TMS_Interface \
            WHERE        (tms_document = '"+ tms_doc + "') AND (claim_document LIKE 'itr%') AND (status='" + check_status + "') "
            req.query(sql_query).then((result) => {
                pool.close()
                if (result.recordset.length > 0) {
                    save_log(result, "check_status_claim", "TMS_Interface", "อัพเดทสเตตัสงานเคลมขั้นที่3")
                    callback(server_response(200, "Success", result.recordset))
                } else {
                    save_log(result, "check_status_claim", "TMS_Interface", "อัพเดทสเตตัสงานเคลมขั้นที่3")
                    callback(server_response(204, "Unsuccess", result.recordset))
                }

            }).catch((err) => {
                pool.close()
                save_log(err, "check_status_claim", "TMS_Interface", "อัพเดทสเตตัสงานเคลมขั้นที่3")
                callback(server_response(501, "Error อัพเดทสเตตัสงานเคลมขั้นที่1", err))
            });
        })
    },
<<<<<<< HEAD
    update_status_claim(tms_doc, status, check_status, callback) {
=======
    update_status_claim(tms_doc, status, check_status,itr, callback) {
>>>>>>> f8fcc0ed2a5f8a3e2c5b8cd9485067943c660782
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            if (err) {
                save_log("Connection is close", "update_status_claim_confirm", "TMS_Interface", "No connection")
                callback(server_response(500, "Connection is close", ""))
            }
            var req = new sql.Request(pool)
<<<<<<< HEAD

            var sql_query = "UPDATE TMS_Interface SET status=" + status + " \
            WHERE        (tms_document = '"+ tms_doc + "') AND (claim_document LIKE 'itr%') AND (status='" + check_status + "') "
            req.query(sql_query).then((result) => {
                pool.close()
                if (result.rowsAffected > 0) {
                    save_log(result, "update_status_claim_confirm", "TMS_Interface", "อัพเดทสเตตัสงานเคลมขั้นที่1")
                    callback(server_response(200, "Success", result.recordset))
                } else {
                    save_log("err", "update_status_claim_confirm", "TMS_Interface", "อัพเดทสเตตัสงานเคลมขั้นที่1")
                    callback(server_response(203, "Error อัพเดทสเตตัสงานเคลมขั้นที่1", err))
=======
            if(status==1)
            {
                var sql_query = "IF(SELECT count(INVOICEID) FROM ConfirmBillDetail WHERE INVOICEID = '"+itr+"')<1 "+
                " BEGIN "+
                " INSERT INTO [dbo].[ConfirmBillDetail](INVOICEID,ItemID,ItemName,Qty,Amount,PriceOfUnit) "+
                " SELECT  DPLUSAX63_GOLIVE_2017.dbo.INVENTJOURNALTRANS.VOUCHER," +
                " DPLUSAX63_GOLIVE_2017.dbo.INVENTJOURNALTRANS.ITEMID AS itemNo,Data_Temp.dbo.DPLT_SCSO_Product.ProductName AS itemName, SUM(ABS(convert(int,DPLUSAX63_GOLIVE_2017.dbo.INVENTJOURNALTRANS.QTY))) AS Qty,0,0"+
                " FROM  DPLUSAX63_GOLIVE_2017.dbo.INVENTJOURNALTRANS LEFT OUTER JOIN"+
                " Data_Temp.dbo.DPLT_SCSO_Product ON DPLUSAX63_GOLIVE_2017.dbo.INVENTJOURNALTRANS.ITEMID = Data_Temp.dbo.DPLT_SCSO_Product.Item_Number"+
                " GROUP BY DPLUSAX63_GOLIVE_2017.dbo.INVENTJOURNALTRANS.JOURNALID, DPLUSAX63_GOLIVE_2017.dbo.INVENTJOURNALTRANS.VOUCHER, DPLUSAX63_GOLIVE_2017.dbo.INVENTJOURNALTRANS.JOURNALTYPE,"+ 
                " DPLUSAX63_GOLIVE_2017.dbo.INVENTJOURNALTRANS.ITEMID, Data_Temp.dbo.DPLT_SCSO_Product.ProductName"+
                " HAVING  (DPLUSAX63_GOLIVE_2017.dbo.INVENTJOURNALTRANS.JOURNALTYPE = 2) AND (DPLUSAX63_GOLIVE_2017.dbo.INVENTJOURNALTRANS.VOUCHER LIKE '"+itr+"')"+
                " END "+
                " IF(SELECT COUNT(INVOICEID) FROM ConfirmBill where INVOICEID ='"+itr+"' AND DocumentSet = '"+tms_doc+"')=(0)"+
                " BEGIN"+
                " INSERT INTO [dbo].[ConfirmBill](INVOICEID,SO,DocumentSet,CustomerID,CustomerName,AddressShipment,SaleID,Sale_Name,StoreZone,Remark,[Status],QTYbox,DELIVERYNAME,CreateDate,Counting,NumBox) "+
                " select claim_document,so,tms_document,customer_code,customer_name,address_shipment,sales_code,sales_name,store_zone,'',1,box_amount,customer_name,delivery_date,3,1 FROM [dbo].[TMS_Interface] where tms_document ='"+tms_doc+"' "+
                " END"+
                " UPDATE TMS_Interface SET status='"+status+"',claim_confirm_scan = Getdate() WHERE (tms_document = '"+ tms_doc + "') AND (claim_document LIKE 'itr%') AND (status='" + check_status + "') " 
              
                
            
            }
            else{
                
                    var sql_query =  "UPDATE TMS_Interface SET status='"+status+"',claim_receive_scan = Getdate() WHERE (tms_document = '"+ tms_doc + "') AND (claim_document LIKE 'itr%') AND (status='" + check_status + "') "
                }
              
               
            
            
            req.query(sql_query).then((result) => {
                pool.close()
                console.log(result.rowsAffected[2])
                if (result.rowsAffected > 0) {
                    save_log(result, "update_status_claim_confirm", "TMS_Interface", "อัพเดทสเตตัสงานเคลมขั้นที่1")
                    callback(server_response(200, "Success", result.recordset))
                
                }
                else if(result.rowsAffected[2]>0){
                    save_log(result, "update_status_claim_confirm", "TMS_Interface", "อัพเดทสเตตัสงานเคลมขั้นที่1")
                    callback(server_response(200, "Success", result.recordset))
                }
                 else {
                    this.find_by_tms(tms_doc, (res_data) => {
                        if (res_data != false) {
                            save_log("err", "update_status_claim_confirm", "TMS_Interface", "อัพเดทสเตตัสงานเคลมขั้นที่1")
                            callback(server_response(203, "Error อัพเดทสเตตัสงานเคลมขั้นที่1", res_data))
                        } else {
                            save_log("err", "update_status_claim_confirm", "TMS_Interface", "อัพเดทสเตตัสงานเคลมขั้นที่1")
                            callback(server_response(501, "Error อัพเดทสเตตัสงานเคลมขั้นที่1", res_data))
                        }
                    })
>>>>>>> f8fcc0ed2a5f8a3e2c5b8cd9485067943c660782
                }
            }).catch((err) => {
                pool.close()
                save_log(err, "update_status_claim_confirm", "TMS_Interface", "อัพเดทสเตตัสงานเคลมขั้นที่1")
                callback(server_response(501, "Error อัพเดทสเตตัสงานเคลมขั้นที่1", err))
            });
        })
<<<<<<< HEAD
=======
    },
    find_by_tms(tms_doc, callback) {
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            if (err) {
                save_log("Connection is close", "update_status_claim_confirm", "TMS_Interface", "No connection")
                callback(server_response(500, "Connection is close", ""))
            }
            var req = new sql.Request(pool)

            var sql_query = "SELECT * FROM TMS_Interface  WHERE    (tms_document = '" + tms_doc + "')"
            req.query(sql_query).then((result) => {
                pool.close()
                if (result.recordset.length > 0) {
                    callback(result.recordset)
                } else {
                    callback(false)
                }
            }).catch((err) => {
                pool.close()
                save_log(err, "update_status_claim_confirm", "TMS_Interface", "อัพเดทสเตตัสงานเคลมขั้นที่1")
                callback(server_response(501, "Error อัพเดทสเตตัสงานเคลมขั้นที่1", err))
            })
        })
>>>>>>> f8fcc0ed2a5f8a3e2c5b8cd9485067943c660782
    }
}

module.exports = {
    model: model
}