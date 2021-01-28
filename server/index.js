require('dotenv').config({path: '.env'});
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const users = require('./routes/users');
const crosswords = require('./routes/crosswords');
const mails = require('./routes/mails');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoLink = process.env.DBCONNECTION;


const port = process.env.PORT;
app.listen(port, () => console.log(`Listening on port ${port}...`))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(mongoLink, { useFindAndModify: false, useNewUrlParser: true,useUnifiedTopology: true })
    .then (() => console.log("Connected.."))
    .catch (err => console.error(err));

app.use(express.json());
app.use('/user', users);
app.use('/crossword', crosswords);
app.use('/mail', mails);



