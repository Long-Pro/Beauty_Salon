var express = require('express')
var router = express.Router()
var staffController = require('../controllers/staff')
const auth=require('../middleWare/auth')


// router.get('/createAcc', userController.createAcc)
// router.post('/createAcc', userController.createAcc2)




router.get('/work', staffController.work)
router.get('/addGuest', staffController.addGuest)
router.post('/addGuest', staffController.addGuest2)
router.get('/addBill', staffController.addBill)
router.post('/addBill', staffController.addBill2)




router.post('/work/sdthd',staffController.sdthd)
router.post('/work/sdtkh',staffController.sdtkh)





// router.get('/userDetail',auth.requireAuth, userController.userDetail)
// router.post('/userDetail',auth.requireAuth, userController.userDetail2)


// router.get('/userOrder',auth.requireAuth, userController.userOrder)
// router.post('/userOrder',auth.requireAuth, userController.userOrder2)

// router.get('/userOrderOnline',auth.requireAuth, userController.userOrderOnline)
// router.get('/userOrderHistory',auth.requireAuth, userController.userOrderHistory)
// router.get('/deleteOrder',auth.requireAuth, userController.deleteOrder)

// router.get('/userLogout',auth.requireAuth, userController.userLogout)



module.exports=router