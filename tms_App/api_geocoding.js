const express = require('express');

const router = express.Router();

var moment = require("moment");
var datetime = require('node-datetime');

var con = require('../connect_sql');


var respons ='';
var responstatus ='';
var arr =[];
var re_count ={};
var sql = require("mssql");

  router.get('/tms/api/token', function(req, res) { 
    let request =  req.body.req;
    // let con_no = req.body.req.status.con_no;
    // let status_code = req.body.req.status.status_code;
    // let status_desc = req.body.req.status.status_desc;

   
     async function main(){ 
     let sCheck_TMSBox =  getToken(request); 
        let b = await delay(); 
    // console.log('con',arr)
    
       if(responstatus==500)
       {
        res.status(500).json({
            res: {
                status: {
                          status_code: "500",
                          status_desc: respons
                          }   
                 } 
       });
   
       }
       else{
        res.status(200).json({
            res: {
                status: {
                          status_code: "000",
                          status_desc: respons
                          }   
                 } 
       });
 
       }
   
   
   
   } 
   main(); 
    
   }); 


async function getToken(){
   var sql = require("mssql");
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
          var result_tms = "SELECT * FROM  API_Geocoding"

          //console.log(result_tms);
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
                 console.log('console',result_hold)
               
                    respons =result_hold;
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