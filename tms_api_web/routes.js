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
router.post('/special-circles',function(req,resp){
    let tms_doc = req.body.tms_doc;
    let invoice = req.body.invoice;

    async function main(){ 
        resp.status(500).json({
            result: tms_doc,
            status:500
       });
       
    }
    main()


})

module.exports = router