const express = require('express');
const router = express.Router();
const DPLT_ADDP_DplusSystem_User = require("./DPLT_ADDP_DplusSystem_User")
const TMS_Special_Circles = require("./TMS_Special_Circles")
const TMS_Special_Circles_develop = require("./TMS_Special_Circles_develop")
const View_Report = require("./View_Report")
const TBL_Report = require("./Report")
const TBL_ReportDetail = require("./ReportDetail")
const BillToApp = require("./BillToApp")
const Workloop = require("./Workloop")
const App_SignaturePic = require("./App_SignaturePic")
const TMS_Interface = require("./TMS_Interface")
const Rating = require("./Rating")
const sendMail = require("./TMS_sendMail")
const TMS_Calendar = require("./TMS_Calendar")
const TMS_Monitor = require("./TMS_Monitor")
const TMS_MessRound = require("./TMS_MessRound")
const TMS_costRound = require("./TMS_costRound")

//----------------All TMS คิดค่ารอบ
router.post("/import/excel-round-mess/", (req, resp) => TMS_MessRound.model.import_excel_round(req.body, (res_data) => resp.json(res_data)))
router.get("/round-cost/get-round-mess/:inDate&:messCode&:numShip", (req, resp) => {
    TMS_MessRound.model.get_round_mess(req.params.inDate, req.params.messCode,req.params.numShip, (res_data) => resp.json(res_data))
})
router.get("/round-cost/get-group-shipCode/:inDate&:messCode&:numShip", (req, resp) => {
    TMS_MessRound.model.get_group_shipCode(req.params.inDate, req.params.messCode,req.params.numShip, (res_data) => resp.json(res_data))
})
router.get("/round-cost/get-group-billCost/:inDate&:messCode&:numShip", (req, resp) => {
    TMS_MessRound.model.get_group_billCost(req.params.inDate, req.params.messCode,req.params.numShip, (res_data) => resp.json(res_data))
})
router.post("/round-cost/cost-round-mess/", (req, resp) => {
    TMS_MessRound.model.post_insert_roundCost(req.body, (res_data) => resp.json(res_data))
})
router.get("/round-cost/get-round-report/:stDate&:enDate&:messCode&:numShip", (req,resp)=>{
    TMS_MessRound.model.get_round_report(req.params.stDate,req.params.enDate,req.params.messCode,req.params.numShip,(res_data)=>resp.json(res_data))
})
//----------------All TMS คิดค่ารอบ

//----------------All TMS Monitor
// router.get("/monitor/search_data/:stDate&:enDate",(req,resp)=>TMS_Monitor.model.get_data_monitorTL_1(req.params.stDate,req.params.enDate,(res_data)=>resp.json(res_data)))
router.get("/monitor/get_data_monitorTL_1/:stDate&:enDate", (req, resp) => TMS_Monitor.model.get_data_monitorTL_1(req.params.stDate, req.params.enDate, (res_data) => resp.json(res_data)))
router.get("/monitor/get_data_monitorTR_1/:stDate&:enDate", (req, resp) => TMS_Monitor.model.get_data_monitorTR_1(req.params.stDate, req.params.enDate, (res_data) => resp.json(res_data)))
router.get("/monitor/get_data_monitorTL_2/:stDate&:enDate", (req, resp) => TMS_Monitor.model.get_data_monitorTL_2(req.params.stDate, req.params.enDate, (res_data) => resp.json(res_data)))
router.get("/monitor/get_data_monitorTR_2/:stDate&:enDate", (req, resp) => TMS_Monitor.model.get_data_monitorTR_2(req.params.stDate, req.params.enDate, (res_data) => resp.json(res_data)))
router.get("/monitor/get_data_monitorTL_3/:stDate&:enDate", (req, resp) => TMS_Monitor.model.get_data_monitorTL_3(req.params.stDate, req.params.enDate, (res_data) => resp.json(res_data)))
router.get("/monitor/get_data_monitorTR_3/:stDate&:enDate", (req, resp) => TMS_Monitor.model.get_data_monitorTR_3(req.params.stDate, req.params.enDate, (res_data) => resp.json(res_data)))
router.get("/monitor/get_data_monitorBelow/:stDate&:enDate&:group", (req, resp) => TMS_Monitor.model.get_data_monitorBelow(req.params.stDate, req.params.enDate, req.params.group, (res_data) => resp.json(res_data)))
//----------------All TMS Monitor

//----------------TMS Plan
router.get("/TMSPlan/get_tms_plan/:stDate&:enDate&:express",(req,resp)=>TMS_costRound.model.get_tms_plan(req.params.stDate,req.params.enDate,req.params.express,(res_data)=>resp.json(res_data)))
//----------------TMS Plan

//----------------All TMS Calendar
router.get("/calendar/get-cause/", (req, resp) => TMS_Calendar.model.get_cause_data((res_data) => resp.json(res_data)))

router.post("/calendar/create-task/", (req, resp) => {
    var inData = req.body
    TMS_Calendar.model.get_last_calendar((last_doc) => {
        TMS_Calendar.model.create_task(inData, last_doc.result, (res_data) => resp.json(res_data))
    })
})

router.get("/calendar/get-all-calendar/:stDate&:endDate", (req, resp) => {
    TMS_Calendar.model.get_all_calendar(req.params.stDate, req.params.endDate, (res_data) => resp.json(res_data))
})

router.get("/calendar/get-report-calendar/:stDate&:endDate", (req, resp) => {
    TMS_Calendar.model.get_report_calendar(req.params.stDate, req.params.endDate, (res_data) => resp.json(res_data))
})
router.get("/calendar/get-cars/:stDate&:endDate", (req, resp) => {
    var stDate = req.params.stDate, endDate = req.params.endDate
    TMS_Calendar.model.get_cars(stDate, endDate, (res_data) => resp.json(res_data))
})
router.put("/calendar/update-report-calendar/", (req, resp) => {
    req.body.forEach(element => {
        TMS_Calendar.model.update_report_calendar(element, async (res_data) => await resp.json(res_data))
    });
})
// async function arr_update(){}
router.post("/calendar/create-cause/", (req, resp) => {
    var inData = req.body
    TMS_Calendar.model.create_cause_data(inData, (res_data) => resp.json(res_data))
})
//----------------All TMS Calendar

//----------------Delete Calendar *******Jar
router.delete("/calendar/delete-task/", (req, resp) => {
    var document = req.body
    TMS_Monitor.model.delete_task(document, (res_data) => resp.json(res_data))
})
router.get("/calendar/get-calendar/:document", (req, resp) => {
    TMS_Monitor.model.get_calendar(req.params.document, (res_data) => resp.json(res_data))
})
router.put("/calendar/update-task/", (req, resp) => {
    var inData = req.body
    TMS_Monitor.model.update_task(inData, async (res_data) => await resp.json(res_data))
})

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
router.post("/edit/take-loop/", (req, resp) => {
    // console.log('req',req);
    var data = req.body
    Workloop.model.take_workloop(data.mess_id, data.mess_name, data.invoice, data.id_user, (res_data) => {
        resp.json(res_data)
    })
})

router.get("/edit/change-mess/:type_data&:input_data", (req, resp) => {
    var type_data = req.params.type_data, input_data = req.params.input_data
    BillToApp.model.get_data_change_mess(type_data, input_data, (res_data) => {
        resp.json(res_data)
    })
})
router.post("/edit/update-mess/", (req, resp) => {
    // console.log('req',req);
    var data = req.body
    BillToApp.model.update_change_mess(data.mess_id, data.mess_name, data.invoice, (res_data) => {
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
router.post("/edit/return-mess/", (req, resp) => {
    // console.log('req',req);
    var data = req.body[0]
    BillToApp.model.return_mess(data.invoice, data.id_user, (res_data) => {
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
router.get("/webno/:idUser&:webNo",(req,resp)=>DPLT_ADDP_DplusSystem_User.model.find_username(req.params.idUser,req.params.webNo,(res_data)=>resp.json(res_data)))
router.post("/special-circles/add-task/", (req, resp) => {
    console.log("req",req.body)
    TMS_Special_Circles.model.create_tsc_one(req.body[0], (res_data) => {
        //------------Commit
        resp.json(res_data)
    })
})
router.post("/special-circles-dev/add-task/", (req, resp) => {
    TMS_Special_Circles_develop.model.create_tsc_one(req.body[0], (res_data) => {
        //------------Commit
        resp.json(res_data)
    })
})
router.get("/special-circles/get-today-task/:dateSt&:dateEn", (req, resp) => {
    let date_start = req.params.dateSt, date_end = req.params.dateEn
    TMS_Special_Circles.model.find_today_date(date_start, (res_data) => {
        resp.json(res_data)
    })
})
router.get("/special-circles/get-over-task/:dateSt&:dateEn", (req, resp) => {
    let date_start = req.params.dateSt, date_end = req.params.dateEn
    TMS_Special_Circles.model.find_over_date(date_start, (res_data) => {
        resp.json(res_data)
    })
})

//----------------All Report
router.get("/report/report-status/:dateSt&:dateEn", (req, resp) => {
    let date_start = req.params.dateSt
    let date_end = req.params.dateEn
    View_Report.model.get_TMS_Status_API_Tracking(date_start, date_end, (res_data) => {
        resp.json(res_data)
    })
})
router.get("/report/report-status-claim/:dateSt&:dateEn", (req, resp) => {
    let date_start = req.params.dateSt
    let date_end = req.params.dateEn
    View_Report.model.get_TMS_Status_Claim_API_Tracking(date_start, date_end, (res_data) => {
        resp.json(res_data)
    })
})
router.get("/report/report-status-surach/:dateSt&:dateEn", (req, resp) => {
    let date_start = req.params.dateSt
    let date_end = req.params.dateEn
    View_Report.model.get_TMS_Status_Surach_API_Tracking(date_start, date_end, (res_data) => {
        resp.json(res_data)
    })
})
router.get("/report/report-formaccount/:inHUB&:inDate", (req, resp) => {
    let check_hub = req.params.inHUB
    let input_date = req.params.inDate
    // console.log("object",req.params)
    TBL_Report.model.create_report_account(input_date, (res_data) => {
        if (res_data.status == 200) {
            // console.log("res_data",res_data);
            TBL_Report.model.get_report_form_account(input_date, check_hub, (res_data) => {
                // console.log("res_data",res_data);
                resp.json(res_data)
            })
        } else {
            resp.json(res_data)
        }
    })
})
router.get("/report/report-clearcash-by-cleardate/:mess_no&:clear_date", (req, resp) => {  //---Update 2019-01-28 by SamuraiiHot
    let mess_no = req.params.mess_no
    let clear_date = req.params.clear_date
    View_Report.model.get_TMS_Status_Claim_API_Tracking(mess_no, clear_date, (res_data) => {
        resp.json(res_data)
    })
})
router.get("/report/report-status-claim/detail/:itr_no", (req, resp) => {
    View_Report.model.get_ITR_Detail(req.params.itr_no, (res_data) => {
        resp.json(res_data)
    })
})
//----------------All Report

//----------------All Clearbill
router.post("/clearbill/update-comment/", (req, resp) => {
    TBL_Report.model.update_comment(req.body[0].id, req.body[0].comment, (res_data) => {
        resp.json(res_data)
    })
})
router.post("/clearbill/update-clearbill-kerry-dhl/", (req, resp) => {
    // console.log("req",req.body)
    TMS_Interface.model.update_tms_kerry_dhl(req.body, (res_data) => {
        // console.log("res_data",res_data);
        resp.json(res_data)
    })
})
router.get("/clearbill/get-clearbill-kerry-dhl/:inType&:inDate", (req, resp) => {
    let in_type = req.params.inType, in_date = req.params.inDate
    TMS_Interface.model.get_tms_kerry_dhl(in_type, in_date, (res_data) => {
        // console.log("res_data",res_data);
        resp.json(res_data)
    })
})
router.get("/clearbill/get-clearbill-surach-kerry-dhl/:inType&:inDate", (req, resp) => {
    let in_type = req.params.inType, in_date = req.params.inDate
    TMS_Interface.model.get_tms_surach_kerry_dhl(in_type, in_date, (res_data) => {
        // console.log("res_data",res_data);
        resp.json(res_data)
    })
})
router.get("/clearbill/clearbill-mess-claim/:messNo&:inDate", (req, resp) => {
    let mess_code = req.params.messNo
    let input_date = req.params.inDate
    // console.log("object",req)
    TBL_Report.model.get_clear_bill_claim_find_by_mess(mess_code, input_date, (res_data) => {
        // console.log("res_data",res_data);
        resp.json(res_data)
    })
})

router.get("/clearbill/clearbill-mess/:messNo&:inDate", (req, resp) => {
    let mess_code = req.params.messNo
    let input_date = req.params.inDate
    // console.log("object",req)
    TBL_Report.model.get_clear_bill_find_by_mess(mess_code, input_date, (res_data) => {
        // console.log("res_data",res_data);
        resp.json(res_data)
    })
})

router.post("/clearbill/update-status/", (req, resp) => {
    TBL_Report.model.update_clear_bill(req.body, (res_data) => {
        //------------Commit
        resp.json(res_data)
    })
})
router.get("/clearbill-detail/get-detail/:invoice", (req, resp) => {
    let invoice = req.params.invoice
    TBL_ReportDetail.model.get_report_detail(invoice, (res_data) => {
        resp.json(res_data)
    })
})
router.post("/clearbill-detail/update-detail/", (req, resp) => {
    // console.log('req',req);
    TBL_ReportDetail.model.update_arr_data_detail(req.body, (res_data) => {
        resp.json(res_data)
    })
})
//----------------All Clearbill

//----------------All Rating
router.get("/rate/check-rate-already/:rate", (req, resp) => {
    Rating.model.get_check_rate_already(req.params.rate, (res_data) => {
        resp.json(res_data)
    })
})
router.get("/rate/get-head-rate/", (req, resp) => {
    Rating.model.get_head_rate((res_data) => {
        resp.json(res_data)
    })
})
router.post("/rate/create-rate/", (req, resp) => {
    var data = req.body
    Rating.model.create_assessment_rate(data, (res_data) => {
        console.log("res_data", res_data)
        resp.json(res_data)
    })
})
//----------------All Rating

//---------for Develop
router.get("/special-circles-dev/get-today-task/:dateSt&:dateEn", (req, resp) => {
    let date_start = req.params.dateSt, date_end = req.params.dateEn
    TMS_Special_Circles_develop.model.find_today_date(date_start, (res_data) => {
        resp.json(res_data)
    })
})
router.get("/special-circles-dev/get-over-task/:dateSt&:dateEn", (req, resp) => {
    let date_start = req.params.dateSt, date_end = req.params.dateEn
    TMS_Special_Circles_develop.model.find_over_date(date_start, (res_data) => {
        resp.json(res_data)
    })
})
router.get("/email", (req, resp) => {
    sendMail.model.get_customer_sendmail(1, "2019-03", (res_data) => {
        sendMail.model.set_form_data_send(res_data.result, (res_data2) => {
            save_log_send_mail.save_log_send_mail(res_data.result)
            console.log('Auto send email ::' + new Date(), res_data2);
        })
    })
})

////////////costRound
router.get("/get_report_costmess_MDL/:month", (req, resp) => {
    TMS_costRound.model.get_report_costmess_MDL(req.params.month, (res_data) => resp.json(res_data))
})

router.get("/get_report_costmess_MCV/:month", (req, resp) => {
    TMS_costRound.model.get_report_costmess_MCV(req.params.month, (res_data) => resp.json(res_data))
})

router.get("/get-daily-costmess-MCV/:date&:id", (req, resp) => {
    TMS_costRound.model.get_daily_costmess_MCV(req.params.date, req.params.id, (res_data) => resp.json(res_data))
})

router.get("/get-daily-costmess-MDL/:date&:id&:type", (req, resp) => {
    TMS_costRound.model.get_daily_costmess_MDL(req.params.date, req.params.id, req.params.type, (res_data) => resp.json(res_data))
})

module.exports = router