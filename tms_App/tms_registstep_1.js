const express = require('express');

const router = express.Router();
// const Nexmo    = require('nexmo');
// const SendOtp = require('sendotp');
// const sendOtp = new SendOtp('AuthKey');
var moment = require("moment");
var datetime = require('node-datetime');
//var con = require('../../connect');
var con = require('../connect_sql');
//var diff = require('datetime-diff');
//var f_genOTP = require('../function/genOTP');

var respons ='';
var responstatus ='';
var arr ={};
var re_count ={};
exports.genOTP =function(){
    genotp();
  
  }
//   const nexmo = new Nexmo({
//     apiKey:'1d3bdf1b',
//     apiSecret:'9lN92Kf3HsEhO7Uk'
// });

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
     //   var OTP= f_genOTP.data.getotp();
      //  var check = true;
        
       }

       let sCheck = await selectforCheck(email,arr[0].phon);
       let b = await delay(); 

           if(check)
           {
            let sCheck = await selectforCheck(email,arr[0].phon);
            let b = await delay(); 
            if(re_count[0].count==0){//insert only
                let ins = await insert(OTP,arr[0].phon,email);
                 let wait = await delay(); 
                 let send = await sendSMS(arr[0].phon,OTP);
            }
            
            else{//delete and insert 
                console.log(arr[0].phon);
                let delt = await del(arr[0].phon);
                let b = await delay(); 
                let ins = await insert(OTP,arr[0].phon,email);
                let wait = await delay(); 
              let send = await sendSMS(arr[0].phon,OTP);
            }
            res.status(200).json({
                result: OTP,
                status:200
           });

           }

     
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
// async function selectforCheck(email,phon){
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
//   sql.connect(config, function (err) { 
//       if (err) {
//           console.log(err+"connect db not found");
//           response.status(500).json({
//               statuserr: 0
//           });
//       }
//       else{
//         const pool1 = new sql.ConnectionPool(config, err => {
//           var result_count = "SELECT COUNT(id) AS count FROM     dbo.OTP_insert  WHERE  (email LIKE '"+email+"') AND  (phon LIKE '"+phon+"');";
//           console.log(result_count);
//           pool1.request().query(result_count, (err, recordsets) => {
          
           
          
  
//             if (err) {
//                 console.log("error select data" + err);
      
//              respons = err.name;
//              responstatus =500;
   
               
//               }
//               else {
               
//                  var result = '';
//                  result = recordsets['recordsets'];
            
//                  re_count = result[0];
//                  console.log(re_count);
             
//              }
//              sql.close()
//         });
//         }); 
     
//       }
      
//   })
// }
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