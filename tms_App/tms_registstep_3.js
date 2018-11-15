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

  router.post('/tms/api/regis_3', function(req, res) { 
    let tms_doc = req.body.tms_doc;
    let invoice = req.body.invoice;
    let box     = req.body.box;
    let car_type = req.body.car_type;
    let staff1   = req.body.staff1;
    let staff2   = req.body.staff2;
    let trip     = req.body.trip;
    let Mess     = req.body.Mess;
    let Zone     = req.body.Zone;
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
            
        let sInserTMS_Box = await InserTMS_Box(tms_doc,invoice,box,car_type,staff1,staff2,trip,Mess);
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
                    result: arr,
                    status:200,
                    detail:'Update success'
               });
            }
        }else if(responstatus==204){
            console.log('status 204')
            res.status(500).json({
                result: respons,
                status:500,
                detail:'Invoice duplicate at billtoapp'
           });
        }
        else{
            res.status(500).json({
                result: respons,
                status:500,
                detail:'Insert false'
           });
        }
           
        
       }
 
   } 
   main(); 
    
   }); 


async function checkTMS_Box(tms_doc,inv,NumBox){
  
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
          console.log(result_tms);
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
              
                 respons = 'TMS is colect';
                 responstatus =201;
                 }
             
                 else if(result_hold.length >1)
                 {
               
                 respons = 'TMS_BOX length > 1 please check data:'+tms_doc;
                 responstatus =202;
                 }
                 else if(result_hold[0].status!=2)
                 {
                    respons = result_hold[0].status>=2?'TMS :'+tms_doc+' is pass'+result_hold[0].status:'TMS :'+tms_doc+' is less'+result_hold[0].status ;
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

async function InserTMS_Box(tms_doc,inv,numBox,car_type,staff1,staff2,trip,Mess,Zone){
  // Check if Invoice have in BillToApp will not insert to BillToApp
  
sql.close()
  var queryString = "IF(SELECT COUNT(INVOICEID) from BillToApp WHERE INVOICEID = '"+inv+"' AND NumBox = '"+numBox+"')=(0)"+
  "BEGIN "+
  " INSERT INTO BillToApp(INVOICEID,DocumentSet,CustomerID,CustomerName,AddressShipment,SaleID,Sale_Name "+
    ",StoreZone,[Status],MessengerID,MessengerName,Trip,DELIVERYNAME,[datetime],TelCustomer,StatusRework,car_type "+
    ",shipment_staff_1,shipment_staff_2,QtyBox,NumBox) "+
    " SELECT INVOICEID,DocumentSet,CustomerID,CustomerName,AddressShipment,SaleID,Sale_Name,'"+Zone+"',3,'"+Mess+"','','"+trip+"',DELIVERYNAME,getdate(),'','','"+car_type+"','"+staff1+"','"+staff2+"',QTYbox,'"+numBox+"' FROM ConfirmBill "+
    " WHERE INVOICEID = '"+inv+"' AND DocumentSet ='"+tms_doc+"' AND NumBox ='"+numBox+"' END"+
    " ELSE "+
    " BEGIN "+
    "SELECT TOP(1)* FROM BillToApp WHERE  INVOICEID = '"+inv+"' AND NumBox = '"+numBox+"'" +
    " END"

    
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