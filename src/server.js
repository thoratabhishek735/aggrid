import express from "express";
import compression from "compression";
import index from "./routes/index";
import queryRoute from "./routes/queryroute"
import path from "path";
import bodyParser from "body-parser";
var logger = require('morgan');
var cookieParser = require('cookie-parser');
// Server var
var app = express();

// // View engine setup
// app.set("views", path.join(__dirname, 'static', "views"));
// app.set("view engine", "ejs");


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(logger('dev'));
app.use(express.json())
app.use(cookieParser());

app.use(compression());
app.use(express.static(path.join(__dirname, 'client')));


//Routes
app.use("/", index);

app.use('/api',queryRoute)

const port = process.env.PORT || 3000;

app.listen(port, function listenHandler() {
    console.info(`Running on ${port}`)
});