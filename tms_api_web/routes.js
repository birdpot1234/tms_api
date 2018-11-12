const express = require('express');
const router = express.Router();
const DPLT_ADDP_DplusSystem_User = require("./DPLT_ADDP_DplusSystem_User")
const TMS_Special_Circles =require("./TMS_Special_Circles")

router.get("/login/:id&:pass", (req, resp) => {
    var id = req.params.id, pass = req.params.pass
    DPLT_ADDP_DplusSystem_User.model.find_by_id_pass(id, pass, (res_data) => {
        resp.json(res_data)
    })
})
router.post("/special-circles/add-task/",(req,resp)=>{
    TMS_Special_Circles.model.create_tsc_one(req.body[0],(res_data)=>{
        //------------Commit
        resp.json(res_data)
    })
})

module.exports = router