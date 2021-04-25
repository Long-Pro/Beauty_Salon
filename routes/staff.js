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

router.get('/work/deleteStaff',staffController.deleteStaff)







router.post('/work/thd',staffController.thd)
router.post('/work/tkh',staffController.tkh)
router.post('/work/tchd',staffController.tchd)

router.get('/work/tckh',staffController.tckh)
router.post('/work/tckh',staffController.tckh2)

router.get('/work/dt',staffController.dt)
router.get('/work/deleteOrder',staffController.deleteOrder)
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
router.get('/work/tkTuan',staffController.tkTuan)
router.get('/work/tkGiua',staffController.tkGiua)






















module.exports=router