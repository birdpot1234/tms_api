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

  router.post('/kerry/api/shipment_info', function(req, res) { 
    let request = []
    // let tms_doc = req.body.status.tms_doc;
    // let invoice = req.body.status.invoice;
    // let box     = req.body.status.box;
    console.log('6555555')
    request = req.body.req[0]
    console.log(request.shipment[0].tms_doc)
   
     async function main(){ 
       //let sCheck_TMSBox =  checkTMS_Box(shipment[0]); 
    //    let b = await delay(); 
     
    
    //    if(responstatus==500)
    //    {
    //     res.status(500).json({
    //         result: respons,
    //         status:500
    //    });
    //    }
    //    else if(responstatus==201)
    //    {
    //     res.status(201).json({
    //         result: respons,
    //         status:201
    //    });
    //    }
    //    else if(responstatus==202)
    //    {
    //     res.status(202).json({
    //         result: respons,
    //         status:202
    //    });
    //    }
    //    else if(responstatus==203)
    //    {
    //     res.status(203).json({
    //         result: respons,
    //         status:203
    //    });
    //    }
       
    //    else{
     
    //     let b = await delay(); 
    //     let sInserTMS_Box = await InserTMS_Box(tms_doc,invoice,box);
    //     let b = await delay(); 
    //     if(responstatus==200){
      
    //         let sUpdateTMS_Box =  await updateTMS_Box(tms_doc,invoice,box);
    //         if(responstatus==500)
    //         {
    //             res.status(500).json({
    //                 result: respons,
    //                 status:500,
    //                 detail:'Update false'
    //            });
    //         }
    //         else{
    //             res.status(200).json({
                 
    //                         result: arr,
    //                         status:200,
    //                         detail:'Update success'
                        
                      
                    
                 
    //            });
    //         }
    //     }else{
    //         res.status(500).json({
    //             result: respons,
    //             status:500,
    //             detail:'Insert false'
    //        });
    //     }
           
        
    //    }
   
   
   } 
   main(); 
    
   }); 


async function insert_info(shipment){
   //var sql = require("mssql");
  // sql.close()
  // sql.connect(con.condb1(), function(err) {
   console.log(shipment[0].length)
//       if (err) {
//           console.log(err+"connect db not found");
//           response.status(500).json({
//               statuserr: 0
//           });
//       }
//       else{
//           const pool1 = new sql.ConnectionPool(con.condb1(), err => {
//           var result_tms = "SELECT * from TMS_Box_Amount where tms_document LIKE '"+tms_doc+"' AND invoice LIKE '"+inv+"' AND box = '"+NumBox+"';";
//           console.log(result_tms);
//           pool1.request().query(result_tms, (err, recordsets) => {
          
//             if (err) {
//                 console.log("error select data" + err);
      
//              respons = err.name;
//              responstatus =500;
   
               
//               }
//               else {
               
//                  var result = '';
//                  result = recordsets['recordsets'];
//                  result_hold = result[0];
//                  if (result_hold == "") {
              
//                  respons = 'TMS is colect';
//                  responstatus =201;
//                  }
             
//                  else if(result_hold.length >1)
//                  {
               
//                  respons = 'TMS_BOX length > 1 please check data:'+tms_doc;
//                  responstatus =202;
//                  }
//                  else if(result_hold[0].status!=0)
//                  {
//                     respons = 'TMS :'+tms_doc+' is pass'+result_hold[0].status ;
//                     responstatus =203;
//                  }
//                  else
//                  {
//                     arr =result_hold;
//                     responstatus =200;
                    
//                  }
                    
          
//              }
//              sql.close()
          
  
            
//         });
//         }); 
     
//       }
      
//   })
}

function delay() { 
    return new Promise((resolve, reject) => { 
         setTimeout(()=>{ 
             resolve("Delay Hello"); 
         }, 500); 
     }); 
   } 

module.exports = router;