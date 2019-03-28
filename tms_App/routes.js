const express = require('express');
const router = express.Router();
const Messenger = require("./Messenger")
const TMS_Special_Circles = require("../tms_api_web/TMS_Special_Circles")
// const TMS_Special_Circles =require("./TMS_Special_Circles")

router.get("/login/:id&:pass&:token", (req, resp) => {
    var id = req.params.id, pass = req.params.pass, token = req.params.token
    Messenger.model.find_by_token(id,pass,token, (res_data) => {
        // console.log("res_data",res_data);
        resp.json(res_data)
    })
})
router.get("/get-submessenger/",(req,resp)=>{
    Messenger.model.find_sub_messenger((res_data) => {
        resp.json(res_data)
    })
})
router.get("/get-messenger/:type_mess",(req,resp)=>{
    var type_mess=req.params.type_mess
    Messenger.model.find_no_admin(type_mess,(res_data) => {
        resp.json(res_data)
    })
})
router.get("/tsc/check-status/:tsc_document",(req,resp)=>{
    var tsc_document = req.params.tsc_document
<<<<<<< HEAD
=======
    console.log("tsc_document",tsc_document)
>>>>>>> f8fcc0ed2a5f8a3e2c5b8cd9485067943c660782
    TMS_Special_Circles.model.check_status(tsc_document,(res_data)=>{
        resp.json(res_data)
    })
})
router.put("/tsc/update-status/",(req,resp)=>{
    TMS_Special_Circles.model.update_status(req.body,(res_data)=>{
        resp.json(res_data)
    })
})
// router.post("/special-circles/add-task/",(req,resp)=>{
//     TMS_Special_Circles.model.create_tsc_one(req.body[0],(res_data)=>{
//         resp.json(res_data)
//     })
// })

module.exports = router