var express = require('express')
var router = express.Router()
var staffController = require('../controllers/staff')
const auth=require('../middleWare/auth')


router.get('/login', staffController.login)
router.post('/login', staffController.login2)

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
router.post('/api/completeOnlineBill',auth.requireAuthStaff, staffController.completeOnlineBill)








///////////////////////////////////////////////////////////////


router.get('/work',auth.requireAuthStaff, staffController.work)



// router.get('/work/addBill',auth.requireAuthStaff, staffController.addBill)
// router.post('/work/addBill',auth.requireAuthStaff, staffController.addBill2)

router.get('/work/addStaff',auth.requireAuthStaff, staffController.addStaff)
router.post('/work/addStaff',auth.requireAuthStaff, staffController.addStaff2)

router.get('/work/deleteStaff',auth.requireAuthStaff,staffController.deleteStaff)







router.post('/work/thd',staffController.thd)
router.post('/work/tkh',staffController.tkh)
router.post('/work/tchd',staffController.tchd)

router.get('/work/tckh',staffController.tckh)
router.post('/work/tckh',staffController.tckh2)

router.get('/work/dt',staffController.dt)
router.get('/work/deleteOrder',staffController.deleteOrder)
router.get('/work/deleteAllOrder',staffController.deleteAllOrder)
router.get('/work/completeOrder',staffController.completeOrder)
router.post('/work/completeOrder',staffController.completeOrder2)


router.post('/work/xhd',staffController.xhd)
router.post('/work/tnv',staffController.tnv)
router.post('/work/csnv',staffController.csnv)
router.post('/work/csnv2',staffController.csnv2)
router.post('/work/dmk',staffController.dmk)

router.get('/work/tkNgay',staffController.tkNgay)
router.get('/work/tkThang',staffController.tkThang)
router.get('/work/tkNam',staffController.tkNam)
router.get('/work/tkGiua',staffController.tkGiua)






















module.exports=router