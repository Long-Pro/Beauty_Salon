var express = require('express')
var router = express.Router()
var staffController = require('../controllers/staff')
const auth=require('../middleWare/auth')



router.get('/work', staffController.work)

router.get('/addGuest', staffController.addGuest)
router.post('/addGuest', staffController.addGuest2)

router.get('/addBill', staffController.addBill)
router.post('/addBill', staffController.addBill2)

router.get('/addStaff', staffController.addStaff)
router.post('/addStaff', staffController.addStaff2)






router.post('/work/sdthd',staffController.sdthd)
router.post('/work/sdtkh',staffController.sdtkh)
router.post('/work/mknv',staffController.mknv)
router.post('/work/mhd',staffController.mhd)
router.post('/work/khv',staffController.khv)
router.post('/work/khv2',staffController.khv2)
router.get('/work/dt',staffController.dt)
router.get('/deleteOrder',staffController.deleteOrder)
router.get('/completeOrder',staffController.completeOrder)
router.post('/completeOrder',staffController.completeOrder2)












// router.get('/userDetail',auth.requireAuth, userController.userDetail)
// router.post('/userDetail',auth.requireAuth, userController.userDetail2)


// router.get('/userOrder',auth.requireAuth, userController.userOrder)
// router.post('/userOrder',auth.requireAuth, userController.userOrder2)

// router.get('/userOrderOnline',auth.requireAuth, userController.userOrderOnline)
// router.get('/userOrderHistory',auth.requireAuth, userController.userOrderHistory)
// router.get('/deleteOrder',auth.requireAuth, userController.deleteOrder)

// router.get('/userLogout',auth.requireAuth, userController.userLogout)



module.exports=router