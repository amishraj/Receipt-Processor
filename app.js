const http = require('http');
const express = require('express');

const app = express();

app.use(express.json());
const receiptRoutes= require('./routes/receipts')

app.use('/', (req, res, next)=>{
    next();
});

app.use('/receipts', receiptRoutes);

app.use('/', (req, res, next)=>{
    res.send("Invalid Endpoint Reached")
});

const server=  http.createServer(app);
server.listen(3000);