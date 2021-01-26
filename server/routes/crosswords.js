const express = require('express');
const crosswordController = require('../controllers/crosswords');
const router = express.Router();

router.get('/:id', crosswordController.getCrossword)
router.get('/r/random', crosswordController.getRandomCrossword)
router.get('/a/approved', crosswordController.getAppCrosswords);
router.get('/u/unapproved', crosswordController.getUnapprovedCrosswords)
router.get('/addedby/:id/:page', crosswordController.getAddedCrosswords);
router.get('/solvedby/:id/:page', crosswordController.getSolvedCrosswords);
router.get('/inprogress/:id/:page', crosswordController.getProgressCrosswords)
router.post('/add', crosswordController.addCrossword)
router.post('/tries/save', crosswordController.saveCrossword);
router.post('/solve/:id', crosswordController.solveCrossword);
router.post('/approve/:id', crosswordController.approveCrossword);
router.post('/review/:id', crosswordController.reviewCrossword)
router.put('/try/:id', crosswordController.addTry)


module.exports = router;