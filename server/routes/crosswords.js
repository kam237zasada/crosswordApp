const express = require('express');
const crosswordController = require('../controllers/crosswords');
const router = express.Router();
const { verifyUser, tokenVerifyAdmin } = require('../controllers/auth')

router.get('/:id', crosswordController.getCrossword)
router.get('/r/random', crosswordController.getRandomCrossword)
router.get('/a/approved', crosswordController.getAppCrosswords);
router.get('/u/unapproved', tokenVerifyAdmin, crosswordController.getUnapprovedCrosswords)
router.get('/addedby/:id/:page', crosswordController.getAddedCrosswords);
router.get('/solvedby/:id/:page', crosswordController.getSolvedCrosswords);
router.get('/inprogress/:id/:page', crosswordController.getProgressCrosswords)
router.post('/add/:id', verifyUser, crosswordController.addCrossword)
router.post('/tries/save/:id', verifyUser, crosswordController.saveCrossword);
router.post('/solve/:id/:crosswordId', verifyUser, crosswordController.solveCrossword);
router.post('/approve/:id', tokenVerifyAdmin, crosswordController.approveCrossword);
router.post('/review/:id', crosswordController.reviewCrossword)
router.put('/try/:id', crosswordController.addTry)


module.exports = router;