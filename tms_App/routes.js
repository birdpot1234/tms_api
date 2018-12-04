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
router.get("/get-messenger/",(req,resp)=>{
    Messenger.model.find_no_admin((res_data) => {
        resp.json(res_data)
    })
})
router.get("/tsc/check-status/:tsc_document",(req,resp)=>{
    var tsc_document = req.params.tsc_document
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