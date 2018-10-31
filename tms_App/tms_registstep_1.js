const express = require('express');

const router = express.Router();

var moment = require("moment");
var datetime = require('node-datetime');

var con = require('../connect_sql');


var respons ='';
var responstatus ='';
var arr ={};
var re_count ={};
exports.genOTP =function(){
    genotp();
  
  }

  router.post('/tms/api/regis_1', function(req, res) { 
    let tms_doc = req.body.tms_doc;
    let invoice = req.body.invoice;
    
     async function main(){ 
       let sEmail =  selectEmail(tms_doc,invoice); 
       let b = await delay(); 
     
      // console.log(respons);
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
            
        let sInserTMS_Box = await InserTMS_Box(tms_doc,invoice,3);
        if(responstatus==200){
            let b = await delay(); 
            let sUpdateTMS_Box =  await updateTMS_Box(tms_doc,invoice);
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
        }else{
            res.status(500).json({
                result: respons,
                status:500,
                detail:'Insert false'
           });
        }
           
        
       }
   
    //    let b = await delay(); 

        //    if(check)
        //    {
        //     let sCheck = await selectforCheck(email,arr[0].phon);
        //     let b = await delay(); 
        //     if(re_count[0].count==0){//insert only
        //         let ins = await insert(OTP,arr[0].phon,email);
        //          let wait = await delay(); 
        //          let send = await sendSMS(arr[0].phon,OTP);
        //     }
            
        //     else{//delete and insert 
        //         console.log(arr[0].phon);
        //         let delt = await del(arr[0].phon);
        //         let b = await delay(); 
        //         let ins = await insert(OTP,arr[0].phon,email);
        //         let wait = await delay(); 
        //       let send = await sendSMS(arr[0].phon,OTP);
        //     }
        //     res.status(200).json({
        //         result: OTP,
        //         status:200
        //    });

        //    }

     
   } 
   main(); 
    
   }); 


async function selectEmail(tms_doc,inv){
    console.log("tms:",tms_doc)
  
    var sql = require("mssql");

  sql.connect(con.condb1(), function(err) {

      if (err) {
          console.log(err+"connect db not found");
          response.status(500).json({
              statuserr: 0
          });
      }
      else{
          const pool1 = new sql.ConnectionPool(con.condb1(), err => {
          var result_tms = "SELECT * from TMS_Interface where tms_document LIKE '"+tms_doc+"' AND invoice LIKE '"+inv+"';";
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
                 console.log(result_hold);
                 if (result_hold == "") {
              
                 respons = 'TMS is colect';
                 responstatus =201;
                 }
             
                 else if(result_hold.length >1)
                 {
               
                 respons = 'email length > 1 please check data:'+email;
                 responstatus =202;
                 }
                 else if(result_hold[0].status!=0)
                 {
                    respons = 'TMS :'+tms_doc+' is pass'+result_hold[0].status ;
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

  
  var sql = require("mssql");
  var queryString = "INSERT INTO [dbo].[ConfirmBill](INVOICEID,SO,DocumentSet,CustomerID,CustomerName,AddressShipment,SaleID,Sale_Name,StoreZone,Remark,[Status],QTYbox,DELIVERYNAME,CreateDate,Counting,NumBox) "+
              "select invoice,so,tms_document,customer_code,customer_name,address_shipment,sales_code,sales_name,store_zone,'TEST DEALER',1,box_amount,customer_name,delivery_date,3,'"+numBox+"' FROM [dbo].[TMS_Interface] where invoice = '"+inv+"' AND tms_document ='"+tms_doc+"'"
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
              
             
             }
             sql.close()
        });
        }); 
     
      }
      
  })
}
async function updateTMS_Box(tms_doc,inv,numBox){

  
    var sql = require("mssql");
    var queryString = "update [dbo].[TMS_Box_Amount]  SET [status] =1 where tms_document ='"+tms_doc+"' AND invoice = '"+inv+"' "
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
  async function updateTMS_Box(tms_doc,inv,numBox){

  
    var sql = require("mssql");
    var queryString = "update [dbo].[TMS_Box_Amount]  SET [status] =1 where tms_document ='"+tms_doc+"' AND invoice = '"+inv+"' "
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
  }async function checkTMS_Box_Fully(tms_doc,inv,numBox){

  
    var sql = require("mssql");
    var queryString = "IF(SELECT count([status]) from TMS_Box_Amount where tms_document ='TMS1810-00006' AND invoice = 'INB1809-01736' AND [status] =0)>1 "+
                       " BEGIN "+
                       " select * from TMS_Box_Amount "+
                       " END "+
                       " ELSE "+
                       " BEGIN "+
                       " UPDATE TMS_Interface set [status] = 1 where tms_document='TMS1810-00006' AND invoice = 'INB1809-01736'  AND [status] <> 1 "+
                       "END "
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
// async function del(phon){

//     var sql = require("mssql");
//     var config = {
//       user: 'WebProduction',
//       password: 'dplusProduction',
//       server: '192.168.3.21',
//       database: 'DataRedar_Report',
//       requestTimeout: 300000,
//       pool: {
//           idleTimeoutMillis: 300000,
//           max: 100
//       },
   
//   };
//   sql.close();
//      sql.connect(config, function (err) { 
//         if (err) {
//             console.log(err+"connect db not found");
//             response.status(500).json({
//                 statuserr: 0
//             });
//         }
//         else{
//             const pool1 = new sql.ConnectionPool(config, err => {
//                 var insert = "DELETE FROM [dbo].[OTP_insert] WHERE  phon LIKE '"+phon+"';"
//                 console.log(insert);
//                  pool1.request().query(insert, (err, recordsets) => {
        
         
        

//                     if (err) {
//                       console.log(err);
                    
         
                     
//                     }
//                     else{
//                         console.log('del success');
//                         //return  'insert success';

//                     }
//                     sql.close();
//                 })

//             })
       
//         }
        
//     })
    
// }
// function insert(OTP,phon,email){
   
//     var sql = require("mssql");
//     var config = {
//       user: 'WebProduction',
//       password: 'dplusProduction',
//       server: '192.168.3.21',
//       database: 'DataRedar_Report',
//       requestTimeout: 300000,
//       pool: {
//           idleTimeoutMillis: 300000,
//           max: 100
//       },
   
//   };
  
//      sql.connect(config, function (err) { 
//         if (err) {
//             console.log(err+"connect db not found");
//             response.status(500).json({
//                 statuserr: 0
//             });
//         }
//         else{
//             const pool1 = new sql.ConnectionPool(config, err => {
//                 var insert = "INSERT INTO [dbo].[OTP_insert]([email],[phon],[OTP],[datetime])VALUES('"+email+"','"+phon+"','"+OTP+"',getdate())";
//                  pool1.request().query(insert, (err, recordsets) => {
        
         
        

//                     if (err) {
//                       console.log(err);
                  
         
                     
//                     }
//                     else{
//                         console.log('succ');
                      

//                     }
//                     sql.close();
//                 })

//             })
       
//         }
        
//     })

 
    
// }

// function sendSMS(phon,OTP){
//     const from = 'DPLUS';

//     const text = "DPLUS verify code:"+OTP+".Valid for 5 minutes";
//     phon66=phon.substring(1)
//     phon66= "66"+phon66;
//     const to = phon66;6555555555556
//     console.log(phon66);
//     // nexmo.message.sendSMS(
//       //   '66948645005',number,OTP,{type:'unicode'},
//     //     (err,responsData)=>{
//     //         if(err)
//     //         {
//     //             console.log(err);
//     //         }
//     //         else
//     //         {
//     //             console.dir(responsData);
//     //         }
//     //     }
//     // );
    
//     nexmo.message.sendSms(from, to, text, (error, response) => {
//         if(error) {
//           throw error;
//         } else if(response.messages[0].status != '0') {
//           console.error(response);
//           throw 'Nexmo returned back a non-zero status';
//         } else {
//           console.log(response);
//         }
//       });
// }
function delay() { 
    return new Promise((resolve, reject) => { 
         setTimeout(()=>{ 
             resolve("Delay Hello"); 
         }, 500); 
     }); 
   } 

module.exports = router;