const express = require('express');

const router = express.Router();

var moment = require("moment");
var datetime = require('node-datetime');

var con = require('../connect_sql');
const multer = require('multer')


var respons ='';
var responstatus ='';
var arr =[];
var re_count ={};
var sql = require("mssql");

const Storage = multer.diskStorage({
    destination(req, file, callback) {
      callback(null, './images')
     // console.log('logfile',file)
    },
    filename(req, file, callback) {
      callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`)
      //console('logfile2',faile)
    },
  })
  
const upload = multer({ storage: Storage })

router.get('/upload', (req, res) => {
        res.status(200).send('You can post to /api/upload.')
      })
 router.post('/tms/api/uploadslip', upload.array('photo', 3), (req, res) => {
    //console.log('file', req.files)
    //console.log('body', req.body)
    //console.log(req.files[0].filename)
    
    
    // res.status(200).json({
    //     message: 'success!',
    //   })

    // let con_no = req.body.req.status.con_no;
    // let status_code = req.body.req.status.status_code;
    // let status_desc = req.body.req.status.status_desc;

   
     async function main(){ 
    // let upload_slip =  uploadslip(req.body.userId,req.files[0].filename,req.body.amount,req.body.transfer); 
     let upload_slip =  uploadslip(req.body.userId,req.files[0].filename,req.body.amount||req.body.transfer,req.body.transfer,req.body.InvocieDate,req.body.coupong,req.body.amountBill||0.00,req.body.InvocieDate_forClear||req.body.InvocieDate); 
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
                          status_code: "200",
                          status_desc: respons
                          }   
                 } 
       });
 
       }
   
   
   
   } 
   main(); 
    
   }); 


//async function uploadslip(messNO,file,amount,transfer){
    async function uploadslip(messNO,file,amount,transfer,InvoiceDate,coupong,amountbill,inv_forClear){ 
        amount = amount==0?transfer:amount
     //   async function uploadslip(messNO,file,amount,transfer,InvoiceDate,coupong){  
   var sql = require("mssql");
   let filename = 'http://www.dplus-system.com:3499/images/'+file
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
      //    var result_tms = "INSERT INTO TMS_SlipPic(Date,Time,MessNo,URL,Amount,Tranfer_amount)VALUES(CONVERT(date,getdate()),CONVERT(time,getdate()),'"+messNO+"','"+filename+"','"+amount+"','"+transfer+"')"
         var result_tms = "INSERT INTO TMS_SlipPic(Date,Time,MessNo,URL,Amount,Tranfer_amount,invoiceDate,coupon)VALUES(CONVERT(date,getdate()),CONVERT(time,getdate()),'"+messNO+"','"+filename+"','"+amount+"','"+transfer+"','"+InvoiceDate+"','"+coupong+"')"+
         "INSERT INTO UpdateStatus_ClearSlipTB(InvoiceDate,amountActual,amountBill,MessengerID,status)VALUES('"+InvoiceDate+"','"+amount+"','"+amount+"','"+messNO+"','1')"
         console.log(result_tms)
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
                // console.log('console',result_hold)
               
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