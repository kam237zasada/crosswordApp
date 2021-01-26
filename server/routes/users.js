const express = require('express');
const userController = require('../controllers/users');
const router = express.Router();
const { verifyUser } = require('../controllers/auth')

router.get('/singleuser', userController.getUser);
router.get('/query/:query', userController.getUsersByQuery)
router.get('/admins', userController.getAdmins);
router.get('/id/:id', userController.getUserById);
router.post('/login', userController.userLogin);
router.post('/register', userController.addUser);
router.post('/resend/:id', userController.resendActivation);
router.post('/reminder', userController.passwordReminder);
router.put('/reset-password/:id', verifyUser, userController.resetPassword);
router.put('/activate/:id', verifyUser, userController.accountActivation)
router.put('/update', userController.updateUser);
router.put('/password/update', userController.updatePassword);
router.put('/appoint', userController.appointAdmin);


module.exports = router;