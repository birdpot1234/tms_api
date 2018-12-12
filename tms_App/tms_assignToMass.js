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

  router.post('/tms/api/assign', function(req, res) { 
    var jsonRequest = req.body.tms


    // let tms_doc = req.body.tms_doc;
    // let invoice = req.body.invoice;
    // let box     = req.body.box;
    // let car_type = req.body.car_type;
    // let staff1   = req.body.staff1;
    // let staff2   = req.body.staff2;
    // let staff3   = req.body.staff3;
    // let trip     = req.body.trip;
    // let Mess     = req.body.Mess;
    
    //let Zone     = req.body.Zone;
     async function main(){ 
         var strInsertBill =''
        for(let i in jsonRequest)
        {
           // console.log(jsonRequest.shipment[val].tms_doc)
           console.log(jsonRequest[i])
          if(jsonRequest[i].Mess == 'kerry')
          {
            strInsertBill = strInsertBill +" update [dbo].[TMS_Box_Amount]  SET [status] ='3' where tms_document ='" + jsonRequest[i].tms_doc+ "' AND invoice = '" + jsonRequest[i].invoice + "' AND box = '"+jsonRequest[i].box+"' ;"+
          "  IF(SELECT count([status]) from TMS_Box_Amount where tms_document ='"+jsonRequest[i].tms_doc+"' AND invoice = '"+jsonRequest[i].invoice+"' AND [status] =2)=0 " +
           " BEGIN " +
           " UPDATE TMS_Interface set [status] = 3 where tms_document='"+jsonRequest[i].tms_doc+"' AND invoice = '"+jsonRequest[i].invoice+"'  AND [status] = 2 " +
           " END " 
          }
          else{
            strInsertBill = strInsertBill +"IF(SELECT COUNT(INVOICEID) from BillToApp WHERE DocumentSet = '"+jsonRequest[i].tms_doc+"' AND INVOICEID = '"+jsonRequest[i].invoice+"' AND NumBox = '"+jsonRequest[i].box+"')=(0)"+
            " BEGIN "+
            " INSERT INTO BillToApp(INVOICEID,DocumentSet,CustomerID,CustomerName,AddressShipment,SaleID,Sale_Name "+
            ",StoreZone,[Status],MessengerID,MessengerName,Trip,DELIVERYNAME,[datetime],TelCustomer,StatusRework,car_type "+
            ",shipment_staff_1,shipment_staff_2,QtyBox,NumBox,shipment_staff_3) "+
            " SELECT INVOICEID,DocumentSet,CustomerID,CustomerName,AddressShipment,SaleID,Sale_Name,StoreZone,3,'"+jsonRequest[i].Mess+"','','"+jsonRequest[i].trip+"',DELIVERYNAME,getdate(),'','','"+jsonRequest[i].car_type+"','"+jsonRequest[i].staff1+"','"+jsonRequest[i].staff2+"',QTYbox,'"+jsonRequest[i].box+"','"+jsonRequest[i].staff3+"' FROM ConfirmBill "+
            " WHERE INVOICEID = '"+jsonRequest[i].invoice+"' AND DocumentSet ='"+jsonRequest[i].tms_doc+"' AND NumBox ='"+jsonRequest[i].box+"' ;  "+
            " update [dbo].[TMS_Box_Amount]  SET [status] ='3',send_scan = getdate() where tms_document ='" + jsonRequest[i].tms_doc+ "' AND invoice = '" + jsonRequest[i].invoice + "' AND box = '"+jsonRequest[i].box+"' ;"+
            " END "+
            "  IF(SELECT count([status]) from TMS_Box_Amount where tms_document ='"+jsonRequest[i].tms_doc+"' AND invoice = '"+jsonRequest[i].invoice+"' AND [status] =2)=0 " +
            " BEGIN " +
            " UPDATE TMS_Interface set [status] = 3 where tms_document='"+jsonRequest[i].tms_doc+"' AND invoice = '"+jsonRequest[i].invoice+"'  AND [status] = 2 " +
            " END " 
          }
           
        }


           
            let sInserTMS_Box = await InserTMS_BillToApp(strInsertBill);
             let a = await delay(); 
         if(responstatus==200){
           
               
                   res.status(200).json({
                       result: respons,
                       status:200,
                       detail:'Assign succss'
                  });
              
           
           }
           else{
               res.status(500).json({
                   result: respons,
                   status:500,
                   detail:'Insert false'
              });
           }

        //}
        console.log(strInsertBill)
    
       
 
   } 
   main(); 
    
   }); 

   async function InserTMS_BillToApp(strQuery){
    // Update stattus from 2 to 3 at TMS_BOX  take bacode
    //Check TMS_Box_Amount fully Then update TMS_Interface set status 2 to 3  
    let setStep =3
    sql.close()
 //   var sql = require("mssql");
      var queryString =strQuery
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
            console.log(result_query);
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
                  arr =result_hold;
                  responstatus =200;
                 // console.log(re_count);

               }
               sql.close()
          });
          }); 
       
        }
        
    })
  }
   async function InserTMS_BillToApp11(tms_doc,inv,numBox,car_type,staff1,staff2,staff3,trip,Mess){
    // Check if Invoice have in BillToApp will not insert to BillToApp
    
  sql.close()
    var queryString = "IF(SELECT COUNT(INVOICEID) from BillToApp WHERE INVOICEID = '"+inv+"' AND NumBox = '"+numBox+"')=(0)"+
    "BEGIN "+
    " INSERT INTO BillToApp(INVOICEID,DocumentSet,CustomerID,CustomerName,AddressShipment,SaleID,Sale_Name "+
      ",StoreZone,[Status],MessengerID,MessengerName,Trip,DELIVERYNAME,[datetime],TelCustomer,StatusRework,car_type "+
      ",shipment_staff_1,shipment_staff_2,QtyBox,NumBox) "+
      " SELECT INVOICEID,DocumentSet,CustomerID,CustomerName,AddressShipment,SaleID,Sale_Name,StoreZone,3,'"+Mess+"','','"+trip+"',DELIVERYNAME,getdate(),'','','"+car_type+"','"+staff1+"','"+staff2+"',QTYbox,'"+numBox+"' FROM ConfirmBill "+
      " WHERE INVOICEID = '"+inv+"' AND DocumentSet ='"+tms_doc+"' AND NumBox ='"+numBox+"'  "+
      
      " END"+
      " ELSE "+
      " BEGIN "+
      "SELECT TOP(1)* FROM BillToApp WHERE  INVOICEID = '"+inv+"' AND NumBox = '"+numBox+"'" +
  
      " END"+
      
  
      
  console.log(queryString)
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
            
             
            
    
              if (err) {
                  console.log("error select data" + err);
        
               respons = err.name;
               responstatus =500;
     
                 
                }
                else {
              
                  var result = '';
                  result = recordsets['recordsets'];
                  console.log(result.length)
                  result_hold = result[0];
                
                  arr =result_hold;
                  responstatus =result.length>0?204:200;
             
               
               }
               sql.close()
          });
          }); 
       
        }
        
    })
  }

async function InserTMS_Box(tms_doc,inv,numBox,car_type,staff1,staff2,staff3,trip,Mess){
  // Check if Invoice have in BillToApp will not insert to BillToApp
  
sql.close()
  var queryString = "IF(SELECT COUNT(INVOICEID) from BillToApp WHERE INVOICEID = '"+inv+"' AND NumBox = '"+numBox+"')=(0)"+
  "BEGIN "+
  " INSERT INTO BillToApp(INVOICEID,DocumentSet,CustomerID,CustomerName,AddressShipment,SaleID,Sale_Name "+
    ",StoreZone,[Status],MessengerID,MessengerName,Trip,DELIVERYNAME,[datetime],TelCustomer,StatusRework,car_type "+
    ",shipment_staff_1,shipment_staff_2,QtyBox,NumBox) "+
    " SELECT INVOICEID,DocumentSet,CustomerID,CustomerName,AddressShipment,SaleID,Sale_Name,StoreZone,3,'"+Mess+"','','"+trip+"',DELIVERYNAME,getdate(),'','','"+car_type+"','"+staff1+"','"+staff2+"',QTYbox,'"+numBox+"' FROM ConfirmBill "+
    " WHERE INVOICEID = '"+inv+"' AND DocumentSet ='"+tms_doc+"' AND NumBox ='"+numBox+"'  "+
    
    " END"+
    " ELSE "+
    " BEGIN "+
    "SELECT TOP(1)* FROM BillToApp WHERE  INVOICEID = '"+inv+"' AND NumBox = '"+numBox+"'" +

    " END"+
    

    
console.log(queryString)
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
          
           
          
  
            if (err) {
                console.log("error select data" + err);
      
             respons = err.name;
             responstatus =500;
   
               
              }
              else {
            
                var result = '';
                result = recordsets['recordsets'];
                console.log(result.length)
                result_hold = result[0];
              
                arr =result_hold;
                responstatus =result.length>0?204:200;
           
             
             }
             sql.close()
        });
        }); 
     
      }
      
  })
}

  async function updateTMS_Box(tms_doc,inv,numBox){
    // Update stattus from 2 to 3 at TMS_BOX  take bacode
    //Check TMS_Box_Amount fully Then update TMS_Interface set status 2 to 3  
    let setStep =3
    sql.close()
 //   var sql = require("mssql");
      var queryString = "update [dbo].[TMS_Box_Amount]  SET [status] ='"+setStep+"' where tms_document ='" + tms_doc + "' AND invoice = '" + inv + "' AND box = '"+numBox+"' "+
                        "  IF(SELECT count([status]) from TMS_Box_Amount where tms_document ='"+tms_doc+"' AND invoice = '"+inv+"' AND [status] =2)>=1 " +
                        " BEGIN " +
                        " select top(1) * from TMS_Box_Amount " +
                        " END " +
                        " ELSE " +
                        " BEGIN " +
                        " UPDATE TMS_Interface set [status] = 3 where tms_document='"+tms_doc+"' AND invoice = '"+inv+"'  AND [status] = 2 " +
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
            console.log(result_query);
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
                  arr =result_hold;
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