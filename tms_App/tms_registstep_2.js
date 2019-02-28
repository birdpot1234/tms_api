const express = require('express');

const router = express.Router();

var moment = require("moment");
var datetime = require('node-datetime');

var con = require('../connect_sql');
const TMS_Interface = require("./TMS_Interface")

var respons ='';
var responstatus ='';
var arr ={};
var re_count ={};
var sql = require("mssql");

  router.post('/tms/api/regis_2', function(req, res) { 
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
            
        let recheck = await recheck_confirmbill(tms_doc,invoice,box);
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
                    result: [{
								"tms_document":tms_doc,
								"invoice":invoice,
								"box":box,
								"status":2
							}],
                    status:200,
                    detail:'Update success'
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
    TMS_Interface.model.update_status_claim(tms_doc,2,1,invoice,(res_data)=>{
        res.json(res_data)
    })
}
    
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
                 else if(result_hold[0].status!=1)
                 {
                    respons = result_hold ;
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

async function recheck_confirmbill(tms_doc,inv,numBox){
  
    sql.close()
    var queryString = "IF(SELECT count(INVOICEID) FROM ConfirmBillDetail WHERE INVOICEID = '"+inv+"')=(0) "+
                      " BEGIN "+
                      " INSERT INTO [dbo].[ConfirmBillDetail](INVOICEID,ItemID,ItemName,Qty,Amount,PriceOfUnit) "+
                      " SELECT INVOICEID,ITEMID, ItemName, QTY,TotalAmount,TotalAmount/QTY FROM DPLV_SCSO_InvoiceAndPreL2  "+
                      " WHERE  INVOICEID = '"+inv+"' "+
                      " END "
                    
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
    let setStep = 2
   
    sql.close()
      var queryString = "update [dbo].[TMS_Box_Amount]  SET [status] ="+setStep+",receive_scan = getdate() where tms_document ='" + tms_doc + "' AND invoice = '" + inv + "' AND box = '"+numBox+"' "+
                        "  IF(SELECT count([status]) from TMS_Box_Amount where tms_document ='"+tms_doc+"' AND invoice = '"+inv+"' AND [status] =1)>=1 " +
                        " BEGIN " +
                        " select top(1)* from TMS_Box_Amount " +
                        " END " +
                        " ELSE " +
                        " BEGIN " +
                        " UPDATE TMS_Interface set [status] = 2 where tms_document='"+tms_doc+"' AND invoice = '"+inv+"'  AND [status] = 1 " +
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
                  arr =result_hold;
                  responstatus =200;
             
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