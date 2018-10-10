const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const socketio = require('socket.io');
const show_tsc = require('./api/tsc/show_tsc');




////Body parser 
app.use(morgan('dev'));
app.use('/upload',express.static('upload'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.use('/show_tsc',show_tsc);
app.get('/',(req,res)=>{
    res.render('index');
})

//Error url send//
app.use((req,res,next)=>{
    const error = new Error('Not found');
    error.status=404;
    next(error);
})
app.use((error,req,res,next)=>{
    res.status(error.status||500);
    res.json({
        error:{
            message:error.message
        }
    })
})


// 
module.exports = app;
