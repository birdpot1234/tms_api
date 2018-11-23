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
  
     async function main(){ 
       let sCheck_TMSBox =  checkTMS_BeforAssign(tms_doc,invoice,box); 
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
       else{
            
        let sInserTMS_Box = await CheckCount_Box(tms_doc,invoice,box);
        let b = await delay(); 
        if(responstatus==200){
        
                res.status(200).json({
                    result: arr,
                    status:200,
                    detail:'TMS check success'
               });
            
        }else if(responstatus==201){
            console.log('status 201')
            res.status(201).json({
                result: respons,
                status:201,
                detail:'false'
           });
        }
        else{
            res.status(500).json({
                result: respons,
                status:500,
                detail:'false'
           });
        }
           
        
       }
 
   } 
   main(); 
    
   }); 


async function checkTMS_BeforAssign(tms_doc,inv,NumBox){
  
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
          var result_tms = "SELECT COUNT(invoice) as inv_count from TMS_Box_Amount where tms_document LIKE '"+tms_doc+"' AND invoice LIKE '"+inv+"' AND status < '2';";
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
                 console.log(result_hold[0].inv_count)
                  if (result_hold[0].inv_count > 0) {
              
                  respons = 'TMS:'+tms_doc+' ยังยิงไม่ครบขาดอีก'+ result_hold[0].inv_count+ 'กล่อง';
                  responstatus =201;
                  }
                  else{
                    arr =result_hold[0].inv_count ;
                    responstatus =200;
                  }
             
               
             }
             sql.close()
          
  
            
        });
        }); 
     
      }
      
  })
}

async function CheckCount_Box(tms_doc,inv,numBox){
    sql.close()
  var queryString = "SELECT COUNT(tms_document) as tms_count from  TMS_Box_Amount WHERE tms_document = '"+tms_doc+"' AND invoice = '"+inv+"' AND box = '"+numBox+"' "
  
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
                if (result_hold[0].tms_count =0) {
              
                    respons = 'TMS :'+tms_doc +'ไม่มี';
                    responstatus =201;
                }
                else{
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




function delay() { 
    return new Promise((resolve, reject) => { 
         setTimeout(()=>{ 
             resolve("Delay Hello"); 
         }, 500); 
     }); 
   } 

module.exports = router;