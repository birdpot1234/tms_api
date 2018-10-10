
var express = require('express'); 
var router = express.Router(); 
 
//var async = require("async"); 
 
router.get('/', function(req, res) { 
 
 // async function main() { 
  // try { 
  // let result = await getData(); 
  // res.send(result); 
  // console.log('result one',result); 
  // } catch (err) { 
 
  // console.log('case error',err); 
  // } 
  // } 
  // main(); 
  async function main(){ 
    let a = sayHello(); 
    let b = await delaySayHello(); 
    let c = await longTimeHello(); 
    res.send(c); 
    console.log(a); 
    console.log(c); 
    console.log(b); 
} 
main(); 
 
}); 
 function longTimeHello(){ 
 
  return "Long Time Hello"; 
} 
async function sayHello(){ 
 
    var sql = require("mssql"); 
  var config = { 
      user: 'WebProduction', 
      password: 'dplusProduction', 
      server: '192.168.3.21', 
      database: 'SalebotPromotion_2017' 
  }; 
 
  sql.connect(config, function (err) { 
 
      if (err) console.log(err); 
      var request = new sql.Request(); 
      //saleno = "T1X-002"; 
 
      //var queryString = "SELECT * FROM Pro"; 
      var queryString = "SELECT * FROM Agent_Product_Bastseller_Homeload"; 
      request.query(queryString, function (err, recordset) { 
 
        if (err){ 
          console.log(err) 
        } 
        else { 
          var result = ''; 
          result = recordset['recordset']; 
 
          console.log(result.length); 
          return result; 
         // a = result; 
        } 
        sql.close(); 
 
 
        //myArray[0] = setData2(); 
 
 
      }); 
  }); 
  //return a; 
 
  //return "Hello"; 
 
} 
function delaySayHello() { 
  return new Promise((resolve, reject) => { 
      setTimeout(()=>{ 
          resolve("Delay Hello"); 
      }, 3000); 
  }); 
} 
// function getB(gate){ 
// var tam = "kittikhun"; 
// var gt = gate+" "+ tam; 
// console.log("2") 
// return gt; 
 
// } 
// async function getA(){ 
// await setTimeout(()=>{}, 5000); // เพื่อทำการ delay การทำงาน 
// var gate = "gatetip"; 
// console.log("1") 
// return gate; 
// } 
 
// async function getData() { 
// const a = await getA(); 
// const b = await getB(a) 
// return await b; 
// } 
 
module.exports = router;