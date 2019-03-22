const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const socketio = require('socket.io');
const show_tsc = require('./api/tsc/show_tsc');
const regis_1 = require('./tms_App/tms_registstep_1');
const regis_2 = require('./tms_App/tms_registstep_2');
const regis_3 = require('./tms_App/tms_registstep_3');
const info = require('./kerry_api/info');
const update_status = require('./kerry_api/update_status');
const tms_assign = require('./tms_App/tms_assignToMass');
var schedule = require('node-schedule');
const sendMail = require("./tms_api_web/TMS_sendMail")
const save_log_send_mail = require("./service")
const moment = require('moment')

////Body parser 
app.use(morgan('dev'));
app.use('/upload', express.static('upload'));
//app.use('/',express.static('regis_1'));
app.use(bodyParser.urlencoded({ extended: true, limit: 1024 * 1024 * 20, type: 'application/x-www-form-urlencoding' }));
app.use(bodyParser.json({ limit: 1024 * 1024 * 2000, type: 'application/json' }));

//-------Modify by SamuraiiHot 2018-10-31
const cors = require('cors')
app.use(cors())
const web_api = require("./tms_api_web/routes")
app.use("/web-api", web_api)
const app_api = require("./tms_App/routes")
app.use("/app-api", app_api)
//-------Modify by SamuraiiHot 2018-10-31

app.use('/show_tsc', show_tsc);
app.use('/', regis_1);
app.use('/', regis_2);
app.use('/', regis_3);
app.use("/", web_api)
app.use("/", info);
app.use("/", update_status);
app.use("/", tms_assign);
app.get('/', (req, res) => {
    res.render('index');
})

//Error url send//
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

// var j = schedule.scheduleJob('30 10 16 7 * *', function () {
//     sendMail.model.get_customer_sendmail(1,moment().format("YYYY-MM"),(res_data) => {
//         sendMail.model.set_form_data_send(res_data.result, (res_data2) => {
//             save_log_send_mail.save_log_send_mail(res_data.result)
//             console.log('Auto send email ::' + new Date(),res_data2);
//         })
//     })
// });
// var j = schedule.scheduleJob('0 0 6 15 * *', function () {
//     sendMail.model.get_customer_sendmail(1,moment().format("YYYY-MM"),(res_data) => {
//         sendMail.model.set_form_data_send(res_data.result, (res_data2) => {
//             save_log_send_mail.save_log_send_mail(res_data.result)
//             console.log('Auto send email ::' + new Date(),res_data2);
//         })
//     })
// });
// var z = schedule.scheduleJob('0 0 6 30 * *', function () {
//     sendMail.model.get_customer_sendmail(2,moment().format("YYYY-MM"),(res_data) => {
//         sendMail.model.set_form_data_send(res_data.result, (res_data2) => {
//             save_log_send_mail.save_log_send_mail(res_data.result)
//             console.log('Auto send email ::' + new Date(),res_data2);
//         })
//     })
// });

module.exports = app;
