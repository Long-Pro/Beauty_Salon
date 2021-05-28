var express = require('express')
var router = express.Router()
var staffController = require('../controllers/staff')
const auth=require('../middleWare/auth')


router.get('/login', staffController.login)
router.post('/login', staffController.login2)
router.get('/work',auth.requireAuthStaff, staffController.work)

///////////////////////////////////////////////////////////////////
router.get('/api/getServices', staffController.getServices)
router.get('/api/getOnlineBill', staffController.getOnlineBill)
router.get('/api/getUserMainInfo', staffController.getUserMainInfo)
router.get('/api/getStaffMainInfo', staffController.getStaffMainInfo)
router.get('/api/getBillMainInfo', staffController.getBillMainInfo)
router.get('/api/getAvailableStaff', staffController.getAvailableStaff)
router.get('/api/getCurrentStaff', staffController.getCurrentStaff)

router.post('/api/findPhone',auth.requireAuthStaff, staffController.findPhone)
router.post('/api/findAccount',auth.requireAuthStaff, staffController.findAccount)
router.post('/api/findPhoneStaff',auth.requireAuthStaff, staffController.findPhoneStaff)

router.post('/api/statistic',auth.requireAuthStaff, staffController.statistic)


router.post('/api/addBill',auth.requireAuthStaff, staffController.addBill)
router.post('/api/findBill',auth.requireAuthStaff, staffController.findBill)

router.post('/api/removeBill',auth.requireAuthStaff, staffController.removeBill)
router.post('/api/findGuest', staffController.findGuest)
router.post('/api/findStaff', staffController.findStaff)
router.post('/api/addGuest', staffController.addGuest)
router.post('/api/editGuest', staffController.editGuest)

router.post('/api/addStaff', staffController.addStaff)
router.post('/api/editStaff', staffController.editStaff)
router.post('/api/removeStaff', staffController.removeStaff)


router.post('/api/removeOnlineBill', staffController.removeOnlineBill)
router.post('/api/findOnlineBill',auth.requireAuthStaff, staffController.findOnlineBill)
router.post('/api/removeOnlineDelayBill',auth.requireAuthStaff, staffController.removeOnlineDelayBill)
router.post('/api/completeOnlineBill',auth.requireAuthStaff, staffController.completeOnlineBill)








///////////////////////////////////////////////////////////////




module.exports=router