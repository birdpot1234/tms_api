var { dbConnectData_TransportApp } = require('../connect_sql')
const { save_log, server_response, set_encryption } = require("../service")
const moment = require('moment')
var sql = require('mssql')
var nodemailer = require('nodemailer')
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'System@dplusonline.net',
        pass: 'dplus1234'
    }
})

const model = {
    get_customer_sendmail(round_seed,rate_date,callback) {
        var in_data = ""
        sql.close()
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            var req = new sql.Request(pool)
            var sql_query = "SELECT  customerCode, customerName, Email, roundSeed, rateDate\
            FROM            TMS_Rate_Mail\
            WHERE roundSeed LIKE '"+round_seed+"' AND rateDate LIKE '"+rate_date+"' "
            // console.log("sql_query",sql_query);
            req.query(sql_query).then((result) => {
                // console.log("update_tms_kerry_dhl",result.rowsAffected.length);
                pool.close()
                if (result.recordset.length > 0) {
                    save_log(result, "get_customer_sendmail", "TMS_sendMail", in_data)
                    callback(server_response(200, "Success", result.recordset))
                } else {
                    save_log(result, "get_customer_sendmail", "TMS_sendMail", in_data)
                    callback(server_response(203, "None data query", result.recordset))
                }
            }).catch((err) => {
                save_log(err, "get_customer_sendmail", "TMS_sendMail", in_data)
                callback(server_response(501, "Error query SQL", err))
            })
        })
    },
    set_form_data_send(result, callback) {
        var from = "System@dplusonline.net"
        var to = ""
        var subject = "แบบฟอร์มการประเมินพนักงานจัดส่งสินค้าบริษัท ดีพลัส อินเตอร์เทรด จำกัด"
        var content = "", url = "", check_send = false, resp = ""
        result.forEach((val, i) => {
            var codeData = val.customerCode + ":" + val.rateDate + ":" + val.roundSeed
            set_encryption(codeData, (res_data) => {
                to = val.Email
                url = "http://dplus-system.com:3029/rate/addRate/" + res_data
                content = "เรียน ท่าน " + val.customerName + " ค่ะ <br><br>\
                ขออนุญาติรบกวนลูกค้าช่วยทำแบบฟอร์มการประเมินพนักงานจัดส่ง เพื่อรักษาและพัฒนาคุณภาพการจัดส่งสินค้าและบริการให้ดียิ่งขึ้น <br>\
                โดยท่านสามารถเข้าไปทำการประเมินพนักงานจัดส่งผ่านระบบเว็บไซต์จากที่อยู่ด้านล่างนี้ <br><br> \
                <h3>กรุณาคลิ๊ก-->  "+ url + "</h3> <br><br>\
                ทั้งนี้ทางเรา บริษัท ดีพลีส อินเตอร์เทรด จำกัด หวังเป็นอย่างยิ่งที่จะพัฒนาคุณภาพการจัดส่งสินค้าและบริการ <br>\
                เพื่อตอบสนองความพึ่งพอใจของลูกค้าทุกท่าน<br>\
                ขอขอบพระคุณที่เชื่อมั่นและไว้ใจในสินค้าและบริการของเรานะค่ะ<br>\
                ขอบคุณค่ะ"
                this.send_mail(from, to, subject, content, (res_data_mail) => {
                    // console.log("object", res_data_mail)
                    if (res_data_mail.status === 200) {
                        this.update_status_send(val.customerCode, val.roundSeed, val.rateDate, (res_data_update) => {
                            if (res_data_update.status === 200) {
                                sql.close()
                                check_send = true
                                resp = res_data_update
                            } else {
                                check_send = false
                            }
                            if( i+1===result.length && check_send)callback({status:200,dev_msg:"Success",result:resp})
                        })
                    } else {
                        check_send = false
                    }
                })
            })
        });
    },
    send_mail(from_mail, to_mail, subject_mail, content_mail, callback) {
        var mailOptions = {
            from: from_mail,
            to: to_mail,
            subject: subject_mail,
            html: content_mail
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("ERR", error);
                save_log("send_mail", "send_mail", "send_mail", error)
                callback(server_response(200, "Error", error))
            } else {
                console.log('Email sent: ' + info.response);
                save_log("send_mail", "send_mail", "send_mail", info.response)
                callback(server_response(200, "Success", info.response))
            }
        });
    },
    update_status_send(customer_code, round_seed, rate_date, callback) {
        // sql.close()
        var in_data = ""
        const pool = new sql.ConnectionPool(dbConnectData_TransportApp)
        pool.connect(err => {
            var req = new sql.Request(pool)
            var sql_query = "UPDATE TMS_sendMail SET status=1,send_datetime=GETDATE() WHERE customerCode LIKE '" + customer_code + "' AND roundSeed LIKE '" + round_seed + "' AND convert(varchar(7),datetime,120) LIKE '" + rate_date + "' "
            // console.log("sql_query",sql_query);
            req.query(sql_query).then((result) => {
                // console.log("update_tms_kerry_dhl",result.rowsAffected.length);
                pool.close()
                if (result.rowsAffected > 0) {
                    save_log(result, "update_status_send", "TMS_sendMail", in_data)
                    callback(server_response(200, "Success", result.rowsAffected))
                } else {
                    save_log(result, "update_status_send", "TMS_sendMail", in_data)
                    callback(server_response(203, "None data query", result.rowsAffected))
                }
            }).catch((err) => {
                save_log(err, "update_status_send", "TMS_sendMail", in_data)
                callback(server_response(501, "Error query SQL", err))
            })
        })
    }
}

module.exports = {
    model: model
}