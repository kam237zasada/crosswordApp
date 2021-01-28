const express = require('express');
const userController = require('../controllers/users');
const router = express.Router();
const { verifyUser, tokenVerifyAdmin } = require('../controllers/auth')

router.get('/singleuser/:id', verifyUser, userController.getUser);
router.get('/query/:query', tokenVerifyAdmin, userController.getUsersByQuery)
router.get('/admins', tokenVerifyAdmin, userController.getAdmins);
router.get('/id/:id', tokenVerifyAdmin, userController.getUserById);
router.post('/login', userController.userLogin);
router.post('/register', userController.addUser);
router.post('/resend/:id', userController.resendActivation);
router.post('/reminder', userController.passwordReminder);
router.put('/reset-password/:id', verifyUser, userController.resetPassword);
router.put('/activate/:id', verifyUser, userController.accountActivation)
router.put('/update/:id', verifyUser, userController.updateUser);
router.put('/password/update/:id', verifyUser, userController.updatePassword);
router.put('/appoint', tokenVerifyAdmin, userController.appointAdmin);


module.exports = router;