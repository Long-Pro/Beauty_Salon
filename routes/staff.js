var express = require('express')
var router = express.Router()
var staffController = require('../controllers/staff')
const auth=require('../middleWare/auth')



router.get('/work', staffController.work)

router.get('/work/addGuest', staffController.addGuest)
router.post('/work/addGuest', staffController.addGuest2)

router.get('/work/addBill', staffController.addBill)
router.post('/work/addBill', staffController.addBill2)

router.get('/work/addStaff', staffController.addStaff)
router.post('/work/addStaff', staffController.addStaff2)






router.post('/work/thd',staffController.thd)
router.post('/work/tkh',staffController.tkh)
router.post('/work/tchd',staffController.tchd)
router.post('/work/tckh',staffController.tckh)
router.post('/work/tckh2',staffController.tckh2)
router.get('/work/dt',staffController.dt)
router.get('/work/deleteOrder',staffController.deleteOrder)
router.get('/work/completeOrder',staffController.completeOrder)
router.post('/work/completeOrder',staffController.completeOrder2)


router.post('/work/xhd',staffController.xhd)
router.post('/work/tnv',staffController.tnv)
router.post('/work/csnv',staffController.csnv)













// router.get('/userDetail',auth.requireAuth, userController.userDetail)
// router.post('/userDetail',auth.requireAuth, userController.userDetail2)


// router.get('/userOrder',auth.requireAuth, userController.userOrder)
// router.post('/userOrder',auth.requireAuth, userController.userOrder2)

// router.get('/userOrderOnline',auth.requireAuth, userController.userOrderOnline)
// router.get('/userOrderHistory',auth.requireAuth, userController.userOrderHistory)
// router.get('/deleteOrder',auth.requireAuth, userController.deleteOrder)

// router.get('/userLogout',auth.requireAuth, userController.userLogout)



module.exports=router