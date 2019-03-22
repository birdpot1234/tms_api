const express = require('express');
const router = express.Router();
const DPLT_ADDP_DplusSystem_User = require("./DPLT_ADDP_DplusSystem_User")
const TMS_Special_Circles =require("./TMS_Special_Circles")
const TMS_Special_Circles_develop =require("./TMS_Special_Circles_develop")
const View_Report=require("./View_Report")
const TBL_Report=require("./Report")
const TBL_ReportDetail=require("./ReportDetail")
const BillToApp=require("./BillToApp")
const Workloop =require("./Workloop")
const App_SignaturePic =require("./App_SignaturePic")
const TMS_Interface = require("./TMS_Interface")

//----------------All App_SignaturePic
router.get("/signature/get-signature/:invoice", (req, resp) => {
    var invoice = req.params.invoice
    App_SignaturePic.model.get_data_signature(invoice, (res_data) => {
        resp.json(res_data)
    })
})
//----------------All App_SignaturePic

//----------------Edit
router.get("/edit/work-loop/:type_data&:input_data", (req, resp) => {
    var type_data = req.params.type_data, input_data = req.params.input_data
    View_Report.model.get_TMS_Workloop(type_data, input_data, (res_data) => {
        resp.json(res_data)
    })
})
router.post("/edit/take-loop/",(req,resp)=>{
    // console.log('req',req);
    var data=req.body
    Workloop.model.take_workloop(data.mess_id,data.mess_name,data.invoice,data.id_user,(res_data)=>{
        resp.json(res_data)
    })
})

router.get("/edit/change-mess/:type_data&:input_data", (req, resp) => {
    var type_data = req.params.type_data, input_data = req.params.input_data
    BillToApp.model.get_data_change_mess(type_data, input_data, (res_data) => {
        resp.json(res_data)
    })
})
router.post("/edit/update-mess/",(req,resp)=>{
    // console.log('req',req);
    var data=req.body
    BillToApp.model.update_change_mess(data.mess_id,data.mess_name,data.invoice,(res_data)=>{
        resp.json(res_data)
    })
})
router.get("/edit/get-return-mess/:type_data&:input_data", (req, resp) => {
    var type_data = req.params.type_data, input_data = req.params.input_data
    BillToApp.model.get_data_return_mess(type_data, input_data, (res_data) => {
        console.log("res_data", res_data)
        resp.json(res_data)
    })
})
router.post("/edit/return-mess/",(req,resp)=>{
    // console.log('req',req);
    var data=req.body[0]
    BillToApp.model.return_mess(data.invoice,data.id_user,(res_data)=>{
        resp.json(res_data)
    })
})
//----------------Edit

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
router.post("/special-circles-dev/add-task/",(req,resp)=>{
    TMS_Special_Circles_develop.model.create_tsc_one(req.body[0],(res_data)=>{
        //------------Commit
        resp.json(res_data)
    })
})
router.get("/special-circles/get-today-task/:dateSt&:dateEn",(req,resp)=>{
    let date_start=req.params.dateSt,date_end=req.params.dateEn
    TMS_Special_Circles.model.find_today_date(date_start,(res_data)=>{
        resp.json(res_data)
    })
})
router.get("/special-circles/get-over-task/:dateSt&:dateEn",(req,resp)=>{
    let date_start=req.params.dateSt,date_end=req.params.dateEn
    TMS_Special_Circles.model.find_over_date(date_start,(res_data)=>{
        resp.json(res_data)
    })
})

//----------------All Report
router.get("/report/report-status/:dateSt&:dateEn",(req,resp)=>{
    let date_start=req.params.dateSt
    let date_end=req.params.dateEn
    View_Report.model.get_TMS_Status_API_Tracking(date_start,date_end,(res_data)=>{
        resp.json(res_data)
    })
})
router.get("/report/report-status-claim/:dateSt&:dateEn",(req,resp)=>{
    let date_start=req.params.dateSt
    let date_end=req.params.dateEn
    View_Report.model.get_TMS_Status_Claim_API_Tracking(date_start,date_end,(res_data)=>{
        resp.json(res_data)
    })
})
router.get("/report/report-formaccount/:inDate",(req,resp)=>{
    let mess_code=req.params.messNo
    let input_date=req.params.inDate
    TBL_Report.model.create_report_account(input_date,(res_data)=>{
        if(res_data.status==200){
            // console.log("res_data",res_data);
            TBL_Report.model.get_report_form_account(input_date,(res_data)=>{
                // console.log("res_data",res_data);
                resp.json(res_data)
            })
        }else{
            resp.json(res_data)
        }
    })
})
router.get("/report/report-clearcash-by-cleardate/:mess_no&:clear_date",(req,resp)=>{  //---Update 2019-01-28 by SamuraiiHot
    let mess_no=req.params.mess_no
    let clear_date=req.params.clear_date
    View_Report.model.get_TMS_Status_Claim_API_Tracking(mess_no,clear_date,(res_data)=>{
        resp.json(res_data)
    })
})
router.get("/report/report-status-claim/detail/:itr_no",(req,resp)=>{
    View_Report.model.get_ITR_Detail(req.params.itr_no,(res_data)=>{
        resp.json(res_data)
    })
})
//----------------All Report

//----------------All Clearbill
router.post("/clearbill/update-clearbill-kerry-dhl/",(req,resp)=>{
    // console.log("req",req.body)
    TMS_Interface.model.update_tms_kerry_dhl(req.body,(res_data)=>{
        // console.log("res_data",res_data);
        resp.json(res_data)
    })
})
router.get("/clearbill/get-clearbill-kerry-dhl/:inType&:inDate",(req,resp)=>{
    let in_type=req.params.inType,in_date=req.params.inDate
    TMS_Interface.model.get_tms_kerry_dhl(in_type,in_date,(res_data)=>{
        // console.log("res_data",res_data);
        resp.json(res_data)
    })
})

router.get("/clearbill/clearbill-mess-claim/:messNo&:inDate",(req,resp)=>{
    let mess_code=req.params.messNo
    let input_date=req.params.inDate
    // console.log("object",req)
    TBL_Report.model.get_clear_bill_claim_find_by_mess(mess_code,input_date,(res_data)=>{
        // console.log("res_data",res_data);
        resp.json(res_data)
    })
})

router.get("/clearbill/clearbill-mess/:messNo&:inDate",(req,resp)=>{
    let mess_code=req.params.messNo
    let input_date=req.params.inDate
    // console.log("object",req)
    TBL_Report.model.get_clear_bill_find_by_mess(mess_code,input_date,(res_data)=>{
        // console.log("res_data",res_data);
        resp.json(res_data)
    })
})

router.post("/clearbill/update-status/",(req,resp)=>{
    TBL_Report.model.update_clear_bill(req.body,(res_data)=>{
        //------------Commit
        resp.json(res_data)
    })
})
router.get("/clearbill-detail/get-detail/:invoice",(req,resp)=>{
    let invoice=req.params.invoice
    TBL_ReportDetail.model.get_report_detail(invoice,(res_data)=>{
        resp.json(res_data)
    })
})
router.post("/clearbill-detail/update-detail/",(req,resp)=>{
    // console.log('req',req);
    TBL_ReportDetail.model.update_arr_data_detail(req.body,(res_data)=>{
        resp.json(res_data)
    })
})
//----------------All Clearbill

//---------for Develop
router.get("/special-circles-dev/get-today-task/:dateSt&:dateEn",(req,resp)=>{
    let date_start=req.params.dateSt,date_end=req.params.dateEn
    TMS_Special_Circles_develop.model.find_today_date(date_start,(res_data)=>{
        resp.json(res_data)
    })
})
router.get("/special-circles-dev/get-over-task/:dateSt&:dateEn",(req,resp)=>{
    let date_start=req.params.dateSt,date_end=req.params.dateEn
    TMS_Special_Circles_develop.model.find_over_date(date_start,(res_data)=>{
        resp.json(res_data)
    })
})

module.exports = router