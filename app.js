const dotenv = require('dotenv');
dotenv.config({path:'./.env'})
require('./db');
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors');
const Port = 5000;
//midlleware
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cors());



//routes
app.use('/api/v1',require('./routes/UserRoute'))
//server listening on port
app.listen(Port,()=>{
    console.log(`server listening on ${Port}`);
})