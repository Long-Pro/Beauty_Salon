var express = require('express')
var router = express.Router()
var userController = require('../controllers/user')
const auth=require('../middleWare/auth')


router.get('/createAcc', userController.createAcc)
router.post('/createAcc', userController.createAcc2)


router.get('/loginAcc', userController.loginAcc)
router.post('/loginAcc', userController.loginAcc2)

router.get('/userDetail',auth.requireAuth, userController.userDetail)
router.post('/userDetail',auth.requireAuth, userController.userDetail2)


router.get('/userOrder',auth.requireAuth, userController.userOrder)
router.post('/userOrder',auth.requireAuth, userController.userOrder2)

router.get('/userOrderOnline',auth.requireAuth, userController.userOrderOnline)
router.get('/userOrderHistory',auth.requireAuth, userController.userOrderHistory)
router.get('/deleteOrder',auth.requireAuth, userController.deleteOrder)






router.get('/userLogout',auth.requireAuth, userController.userLogout)



module.exports=router