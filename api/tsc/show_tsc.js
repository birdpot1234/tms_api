const express = require('express');
var con = require('../../connect_sql');
const router = express.Router();


router.get('/', function (req, res) {
    var sql = require("mssql");

     sql.connect(con.condb1(), function(err) {
        if (err) {
            console.log(err+"connect db not found");
            res.status(500).json({
                statuserr: 0
            });
        }
        else{
          const pool1 = new sql.ConnectionPool(con.condb1(), err => {
            var result_count = "SELECT * FROM StatusDetail ;";
            console.log(result_count);
            pool1.request().query(result_count, (err, recordsets) => {
            
              if (err) {
                 res.status(500).json({
                    statuserr: err
                });
                }
                else {
                 
                    res.status(200).json({
                        result: recordsets,
                        status:200
                });
               
               }
               sql.close()
          });
          }); 
       
        }
});
})

module.exports = router;