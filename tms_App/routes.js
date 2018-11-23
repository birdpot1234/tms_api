const express = require('express');
const router = express.Router();
const Messenger = require("./Messenger")
const TMS_Special_Circles = require("../tms_api_web/TMS_Special_Circles")
// const TMS_Special_Circles =require("./TMS_Special_Circles")

router.get("/login/:token", (req, resp) => {
    var token = req.params.token
    Messenger.model.find_by_token(token, (res_data) => {
        resp.json(res_data)
    })
})
router.get("/get-messenger/",(req,resp)=>{
    Messenger.model.find_no_admin((res_data) => {
        resp.json(res_data)
    })
})
router.put("/tsc/update-status/",(req,resp)=>{
    TMS_Special_Circles.model.update_status(req.body[0],(res_data)=>{
        resp.json(res_data)
    })
})
// router.post("/special-circles/add-task/",(req,resp)=>{
//     TMS_Special_Circles.model.create_tsc_one(req.body[0],(res_data)=>{
//         resp.json(res_data)
//     })
// })

module.exports = router