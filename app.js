const http = require('http');
const express = require('express');

const app = express();

app.use(express.json());
const receiptRoutes= require('./routes/receipts')

// /receipts requests are routed to receiptRoutes in receipts.js
app.use('/receipts', receiptRoutes);

//default error case
app.use('/', (req, res, next)=>{
    res.send("Invalid Endpoint Reached")
});

//create the server on port 3000
const server=  http.createServer(app);
server.listen(3000);