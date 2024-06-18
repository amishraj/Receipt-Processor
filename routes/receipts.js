const express = require('express');
const router= express.Router();
const { v4: uuidv4 } = require('uuid');
const receipts = new Map();

router.get('/:id/points', (req, res, next)=>{
    const id = req.params.id;
    const receipt = receipts.get(id);
    
    if (receipt) {
        const points = calculatePoints(receipt);
        res.send({"points": points });
    } else {
        res.status(404).send({ "error": "No receipt found for that id" });
    }
});

router.post('/process', (req, res, next)=>{
    //Unique ID Generation
    const id = uuidv4();

    //Receipt Validation
    if(!req.body){
        return res.status(400).send({ error: "Invalid Request"})
    }

    const { retailer, purchaseDate, purchaseTime, total, items } = req.body;

    //Check for Invalid retailer property
    if (!retailer || typeof retailer !== 'string') {
        return res.status(400).send({ error: 'Invalid retailer' });
    }

    //Check for Invalid purchaseDate property
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!purchaseDate || !datePattern.test(purchaseDate)) {
        return res.status(400).send({ error: 'Invalid purchase date' });
    }

    //Check for Invalid purchaseTime property
    const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!purchaseTime || !timePattern.test(purchaseTime)) {
        return res.status(400).send({ error: 'Invalid purchase time' });
    }

    //Check for Invalid total property
    if (!total || isNaN(total)) {
        return res.status(400).send({ error: 'Invalid total' });
    }

    //Check for Invalid items property
    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).send({ error: 'Items must be a non-empty array' });
    }

    //Check for Invalid item objects
    for (const item of items) {
        if (!item.shortDescription || typeof item.shortDescription !== 'string') {
            return res.status(400).send({ error: 'Invalid item short description' });
        }
        if (!item.price || isNaN(item.price)) {
            return res.status(400).send({ error: 'Invalid item price' });
        }
    }

    //Generate the receipt object and set it in the map
    const receipt = {
        id: id,
        retailer: req.body.retailer,
        purchaseDate: req.body.purchaseDate,
        purchaseTime: req.body.purchaseTime,
        total: req.body.total,
        items: req.body.items
    };
    receipts.set(id, receipt);

    //Return Object id as a response
    res.send({ "id": id }); 
});

const calculatePoints = (receipt) => {
    let points = 0;

    // One point for every alphanumeric character in the retailer name
    points += receipt.retailer.replace(/[^a-z0-9]/gi, '').length;

    // 50 points if the total is a round dollar amount with no cents
    if (parseFloat(receipt.total) % 1 === 0){
        points += 50;
    }

    // 25 points if the total is a multiple of 0.25
    if (parseFloat(receipt.total)% 0.25 === 0){
        points += 25;
    }

    // 5 points for every two items on the receipt
    points += Math.floor(receipt.items.length/ 2)* 5;

    // Points based on item description length
    receipt.items.forEach(item => {
        const descriptionLength = item.shortDescription.trim().length;
        if (descriptionLength % 3 === 0) {
            points += Math.ceil(parseFloat(item.price) * 0.2);
        }
    });

    // 6 points if the day in the purchase date is odd
    const [year, month, day] = receipt.purchaseDate.split('-').map(Number);
    const purchaseDay = new Date(Date.UTC(year, month - 1, day)).getUTCDate();
    if (purchaseDay % 2 !== 0) {
        points += 6;
    }

    // 10 points if the time of purchase is after 2:00pm and before 4:00pm
    const [hour, minute] = receipt.purchaseTime.split(':').map(Number);
    if (hour === 14 || (hour === 15 && minute === 0)) {
        points += 10;
    }

    return points;
};

module.exports = router;