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
<<<<<<< HEAD
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


=======
router.post("/special-circles/add-task/",(req,resp)=>{
    TMS_Special_Circles.model.create_tsc_one(req.body[0],(res_data)=>{
        resp.json(res_data)
    })
>>>>>>> 10874e86bc3d93c2269e87c807ddfbad22e1be9d
})

module.exports = router