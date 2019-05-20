const express = require('express');

const router = express.Router();

var moment = require("moment");
var datetime = require('node-datetime');

var con = require('../connect_sql');


var respons ='';
var responstatus ='';
var arr ={};
var re_count ={};
var sql = require("mssql");
const TMS_Interface = require("./TMS_Interface")

  router.post('/tms/api/regis_1', function(req, res) { 
     // console.log(req);
   
    let tms_doc = req.body.tms_doc;
    let invoice = req.body.invoice;
    let box     = req.body.box;
    let sub_invoice_1 = invoice.substring(0,3)
    let sub_invoice = sub_invoice_1.toUpperCase()
if(sub_invoice!="ITR" ){
     async function main(){ 
       let sCheck_TMSBox =  checkTMS_Box(tms_doc,invoice,box); 
       let b = await delay(); 
     
    
       if(responstatus==500)
       {
        res.status(500).json({
            result: respons,
            status:500
       });
       }
       else if(responstatus==201)
       {
        res.status(201).json({
            result: respons,
            status:201
       });
       }
       else if(responstatus==202)
       {
        res.status(202).json({
            result: respons,
            status:202
       });
       }
       else if(responstatus==203)
       {
        res.status(203).json({
            result: respons,
            status:203
       });
       }
       
       else{
     
        //let b = await delay(); 
        let sInserTMS_Box = await InserTMS_Box(tms_doc,invoice,box);
        let b = await delay(); 
        if(responstatus==200){
      
            let sUpdateTMS_Box =  await updateTMS_Box(tms_doc,invoice,box);
            if(responstatus==500)
            {
                res.status(500).json({
                    result: respons,
                    status:500,
                    detail:'Update false'
               });
            }
            else{
                res.status(200).json({
                 
                            
                            status:200,
                            //detail:'Update success',
							result: [{
								"tms_document":tms_doc,
								"invoice":invoice,
								"box":box,
								"status":1
							}],
                        
                      
                    
                 
               });
            }
        }else{
            res.status(500).json({
                result: respons,
                status:500,
                detail:'Insert false'
           });
        }
           
        
       }
   
   
   } 
   main(); 
}else if(sub_invoice=="ITR"){
    console.log('ITR')
    TMS_Interface.model.update_status_claim(tms_doc,1,0,invoice,(res_data)=>{
        res.json(res_data)
    })
}
   }); 



async function checkTMS_Box(tms_doc,inv,NumBox){
   //var sql = require("mssql");
  // console.log("checkTMS_Box",tms_doc,inv,NumBox)
   sql.close()
   sql.connect(con.condb1(), function(err) {

      if (err) {
          console.log(err+"connect db not found");
          response.status(500).json({
              statuserr: 0
          });
      }
      else{
          const pool1 = new sql.ConnectionPool(con.condb1(), err => {
          var result_tms = "SELECT * from TMS_Box_Amount where tms_document LIKE '"+tms_doc+"' AND invoice LIKE '"+inv+"' AND box = '"+NumBox+"';";
         // console.log(result_tms);
          pool1.request().query(result_tms, (err, recordsets) => {
          
            if (err) {
                console.log("error select data" + err);
      
             respons = err.name;
             responstatus =500;
   
               
              }
              else {
               
                 var result = '';
                 result = recordsets['recordsets'];
                 result_hold = result[0];
                 if (result_hold == "") {
              
                 respons = result_hold;
                 responstatus =201;
                 }
             
                 else if(result_hold.length >1)
                 {
               
                 respons = 'TMS_BOX length > 1 please check data:'+tms_doc;
                 responstatus =202;
                 }
                 else if(result_hold[0].status!=0)
                 {
					 respons = result_hold;
                    //respons = 'TMS :'+tms_doc+' is pass'+result_hold[0].status ;
                    responstatus =203;
                 }
                 else
                 {
                    arr =result_hold;
                    responstatus =200;
                    
                 }
                    
          
             }
             sql.close()
          
  
            
        });
        }); 
     
      }
      
  })
}
async function InserTMS_Box(tms_doc,inv,numBox){
  
    
  
  
  sql.close()
  var queryString = "IF(SELECT count(INVOICEID) FROM ConfirmBillDetail WHERE INVOICEID = '"+inv+"')=(0) "+
                    " BEGIN "+
                    " INSERT INTO [dbo].[ConfirmBillDetail](INVOICEID,ItemID,ItemName,Qty,Amount,PriceOfUnit) "+
                    " SELECT INVOICEID,ITEMID, ItemName, QTY,TotalAmount,TotalAmount/QTY FROM DPLV_SCSO_InvoiceAndPreL2  "+
                    " WHERE  INVOICEID = '"+inv+"' "+
                    " END "+
					" IF(SELECT COUNT(INVOICEID) FROM ConfirmBill where INVOICEID ='"+inv+"' AND DocumentSet = '"+tms_doc+"' AND NumBox = '"+numBox+"')=(0)"+
					" BEGIN"+
                    " INSERT INTO [dbo].[ConfirmBill](INVOICEID,SO,DocumentSet,CustomerID,CustomerName,AddressShipment,SaleID,Sale_Name,StoreZone,Remark,[Status],QTYbox,DELIVERYNAME,CreateDate,Counting,NumBox) "+
                    " select invoice,so,tms_document,customer_code,customer_name,address_shipment,sales_code,sales_name,store_zone,'',1,box_amount,customer_name,delivery_date,3,'"+numBox+"' FROM [dbo].[TMS_Interface] where invoice = '"+inv+"' AND tms_document ='"+tms_doc+"' "+
					" END"
//console.log(queryString) 
 sql.connect(con.condb1(), function(err) {

      if (err) {
          console.log(err+"connect db not found");
          response.status(500).json({
              statuserr: 0
          });
      }
      else{
        const pool1 = new sql.ConnectionPool(con.condb1(), err => {
          var result_query = queryString;
          //console.log(result_query);
          pool1.request().query(result_query, (err, recordsets) => {
          
           console.log(inv,recordsets)
         
  
            if (err) {
                console.log("error select data" + err);
      
             respons = [];
             responstatus =500;
   
               
              }
              else {
                var result = '';
                result = recordsets['recordsets'];
                result_hold = result[0];
                arr =result_hold;
                responstatus =200;
              
             
             }
             sql.close()
        });
        }); 
     
      }
      
  })
}


  async function updateTMS_Box(tms_doc,inv,numBox){

    let setStep =1 
    sql.close()
    //var sql = require("mssql");
      var queryString = "update [dbo].[TMS_Box_Amount]  SET [status] ='"+setStep+"',confirm_scan = getdate() where tms_document ='" + tms_doc + "' AND invoice = '" + inv + "' AND box = '"+numBox+"' "+
                        "  IF(SELECT count([status]) from TMS_Box_Amount where tms_document ='"+tms_doc+"' AND invoice = '"+inv+"' AND [status] =0)>=1 " +
                        " BEGIN " +
                        " select top(1) * from TMS_Box_Amount " +
                        " END " +
                        " ELSE " +
                        " BEGIN " +
                        " UPDATE TMS_Interface set [status] = 1 where tms_document='"+tms_doc+"' AND invoice = '"+inv+"'  AND [status] = 0 " +
                        "END"
    sql.connect(con.condb1(), function(err) {
  
        if (err) {
            console.log(err+"connect db not found");
            response.status(500).json({
                statuserr: 0
            });
        }
        else{
             const pool1 = new sql.ConnectionPool(con.condb1(), err => {
            var result_query = queryString;
           // console.log(result_query);
            pool1.request().query(result_query, (err, recordsets) => {
            
             
              if (err) {
              console.log("error select data" + err);
        
               respons = err.name;
               responstatus =500;
     
                 
                }
                else {
                  var result = '';
                  result = recordsets['recordsets'];
                  result_hold = result[0];
                  arr ='success';
                  responstatus =200;
                 // console.log(re_count);


               
               }
               sql.close()
          });
          }); 
      
        }
        
    })
    


  }

function delay() { 
    return new Promise((resolve, reject) => { 
         setTimeout(()=>{ 
             resolve("Delay Hello"); 
         }, 500); 
     }); 
   } 

module.exports = router;