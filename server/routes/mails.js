const express = require('express');
const mailController = require('../controllers/mails');
const router = express.Router();

router.post('/send', mailController.sendMail);

module.exports = router;