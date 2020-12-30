const { Router } = require('express');

const LogEntry = require('../models/LogEntry');
const { API_KEY } = process.env;

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        const allLogs = await LogEntry.find();
        res.json(allLogs);
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        if (req.get('X-API-KEY') !== API_KEY) {
            res.status(401);
            throw new Error('UnAuthorized');
        }
        const logEntry = new LogEntry(req.body);
        const createdDocument = await logEntry.save();
        res.json(createdDocument);
    } catch (error) {
        if (error.name === "ValidationError") {
            res.status(422);
        }
        next(error);
    }
});

module.exports = router;