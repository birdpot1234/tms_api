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

  router.post('/kerry/api/update_status', function(req, res) { 
    let request =  req.body.req;
    // let con_no = req.body.req.status.con_no;
    // let status_code = req.body.req.status.status_code;
    // let status_desc = req.body.req.status.status_desc;
    // let status_date = req.body.req.status.status_date;
    // let update_date = req.body.req.status.update_date;
    // let ref_no      = req.body.req.status.ref_no;
    // let location    = req.body.req.status.location;


  //  console.log(request.status.con_no)
  //  console.log(request.status.con_no)
  //  request = req.body.req[0]
  //  console.log(request.shipment[0].tms_doc)
   
     async function main(){ 
     let sCheck_TMSBox =  insertHead_info(request); 
        let b = await delay(); 
     
    
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
       console.log("Kerry_FailUpdate",request.status.con_no)
       }
       else{
        res.status(200).json({
            res: {
                status: {
                          status_code: "000",
                          status_desc: "Successful"
                          }   
                 } 
       });
       console.log("Kerry_SuccessUpdate",request.status.con_no)
       }
   
   
   
   } 
   main(); 
    
   }); 


async function insertHead_info(shipment){
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
          var result_tms = "IF(SELECT count(con_no) FROM Kerry_Info WHERE con_no LIKE '"+shipment.status.con_no+"')=(0)" +
                           " BEGIN" +
                           " INSERT INTO [dbo].[Kerry_Info](con_no,status_code,status_desc,status_date,update_date,ref_no,location) VALUES" +
                           " ('"+shipment.status.con_no+"','"+shipment.status.status_code+"','"+shipment.status.status_desc+"','"+shipment.status.status_date+"','"+shipment.status.update_date+"','"+shipment.status.ref_no+"','"+shipment.status.location+"')" +
                           " INSERT INTO [dbo].[Kerry_Info_Tran](con_no,status_code,status_desc,status_date,update_date,ref_no,location) VALUES" +
                           " ('"+shipment.status.con_no+"','"+shipment.status.status_code+"','"+shipment.status.status_desc+"','"+shipment.status.status_date+"','"+shipment.status.update_date+"','"+shipment.status.ref_no+"','"+shipment.status.location+"')" +
                           " END" +
                           " ELSE" +
                           " BEGIN" +
                           " UPDATE [dbo].[Kerry_Info] SET status_code = '"+shipment.status.status_code+"',status_desc = '"+shipment.status.status_desc+"',status_date ='"+shipment.status.status_date+"',update_date = '"+shipment.status.ref_no+"',ref_no ='"+shipment.status.ref_no+"',location='"+shipment.status.location+"' "+
                           " WHERE con_no LIKE '"+shipment.status.con_no+"' "+
                           " INSERT INTO [dbo].[Kerry_Info_Tran](con_no,status_code,status_desc,status_date,update_date,ref_no,location) VALUES" +
                           " ('"+shipment.status.con_no+"','"+shipment.status.status_code+"','"+shipment.status.status_desc+"','"+shipment.status.status_date+"','"+shipment.status.update_date+"','"+shipment.status.ref_no+"','"+shipment.status.location+"')" +
                           " END "

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