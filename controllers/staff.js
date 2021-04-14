const sql = require('mssql')
const func=require('../func')

var md5 = require('md5');
const config = {
  user: 'sa',
  password: '123',
  // server: 'DESKTOP-ABNCINT', // You can use 'localhost\\instance' to connect to named instance
  server: 'localhost', // You can use 'localhost\\instance' to connect to named instance

  database: 'BEAUTY_SALON',
  "options": {
      "encrypt": true,
      "enableArithAbort": true
  }
}

module.exports.addGuest = function(req, res, next) {
    var sdt=req.cookies.guestPN

    res.render('staff/addGuest',{ sdt})
}
module.exports.addGuest2 = function(req, res, next) {
    var{fullname,gender}=req.body;
    var sdt=req.cookies.guestPN
    console.log(req.body)
    
    sql.connect(config).then(() => {       //   get id
        return sql.query`select max(ma) as ma from khachhang` 
    }).then(result => {
        if(result.recordset[0].ma){
            maxMa=result.recordset[0].ma;
            maNext =maxMa.slice(0,2) +(parseInt(maxMa.slice(2)) +1).toString().padStart(8,0);
        }else{
            maNext='KH00000001'
        }
        return maNext
    })       
    .then(maNext=>{                 //insert khach hang

        sql.query` INSERT INTO KHACHHANG VALUES(${maNext},${fullname},${sdt},${gender},'LK1',0)`
        return maNext
    })
    .then(()=>{
        res.clearCookie('guestPN', { })
        res.render('staff/work')
        
    })
    .catch(err => {
        // ... error checks
        console.log(err)
    })
    


    
}
module.exports.addBill = function(req, res, next) {
    sql.connect(config).then(() => {       
        return sql.query` select *  from DICHVU  as dv where dv.MALDV='LD001'`  
    }).then(result => {
        res.locals.catToc=result.recordset
        return sql.query` select *  from DICHVU  as dv where dv.MALDV='LD002'`                                       //   validate tai khoan    
    })      
    .then(result=>{
        res.locals.uonToc=result.recordset
        return sql.query` select *  from DICHVU  as dv where dv.MALDV='LD003'`
    })  
    .then(result=>{
        res.locals.nhuomToc=result.recordset
        return sql.query` select *  from DICHVU  as dv where dv.MALDV='LD004'`
    }) 
    
    .then(result=>{
        res.locals.khac=result.recordset
        return sql.query` select MA  from Nhanvien`
    }) 
    .then(result=>{
        res.locals.nvs=result.recordset
        // console.log(res.locals.nvs)

        res.render('staff/addBill',{
            
            

          })
    })
    .catch(err => {
        console.log("err "+err)
    })
}
module.exports.addBill2 = function(req, res, next) {
    console.log(req.body)
        

    var{catTocDV,uonTocDV,nhuomTocDV,khacDV,orderTime}=req.body
    var sdt=req.cookies.guestPN;
    var maxMa,maNext,ma;
    sql.connect(config).then(() => {       //   get id
        return sql.query`select MA as ma from khachhang kh where kh.SDT=${sdt}` 
    })
    .then((result)=>{
        ma=result.recordset[0].ma
        return sql.query`select max(ma) as ma from HOADON` 
    })
    .then(result => {
        if(result.recordset[0].ma){
            maxMa=result.recordset[0].ma;
            maNext =maxMa.slice(0,2) +(parseInt(maxMa.slice(2)) +1).toString().padStart(8,0);
        }else{
            maNext='HD00000001'
        }
        return maNext
    })       
    .then(maNext=>{                 //insert HOADON
        // var time2=func.convertTime(orderTime)
        return         sql.query` INSERT INTO hoadon VALUES(${maNext},${ma},${orderTime})`
    })
    .then(result=>{       
        var values=req.body          //insert SD_DICHVU
        if(catTocDV){
            var maNVCT=func.findStaff(values,values.catTocDV)
            
            sql.connect(config).then(() => {
                return sql.query`select GIA from dichvu where MA = ${catTocDV}`
            }).then(result => {
                var {GIA}=result.recordset[0]
                sql.query` INSERT INTO SD_DICHVU values(${maNext},${maNVCT},${catTocDV},${GIA})` 
            }).catch(err => {
                
            })
                    
        }
        if(uonTocDV){
            var maNVUT=func.findStaff(values,values.uonTocDV)
            sql.connect(config).then(() => {
                return sql.query`select GIA from dichvu where MA = ${uonTocDV}`
            }).then(result => {
                var {GIA}=result.recordset[0]
                sql.query` INSERT INTO SD_DICHVU VALUES(${maNext},${maNVUT},${uonTocDV},${GIA})` 
            }).catch(err => {
                
            })      
        }
        if(nhuomTocDV){
            var maNVNT=func.findStaff(values,values.nhuomTocDV)
            sql.connect(config).then(() => {
                return sql.query`select GIA from dichvu where MA = ${nhuomTocDV}`
            }).then(result => {
                var {GIA}=result.recordset[0]
                sql.query` INSERT INTO SD_DICHVU VALUES(${maNext},${maNVNT},${nhuomTocDV},${GIA})` 
            }).catch(err => {
                
            }) 
        }
        if(khacDV){
            if(Array.isArray(khacDV) ){
                for(var id of khacDV) {
                    var maNVK=func.findStaff(values,id)

                    func.insertSDDV(maNext,maNVK,id)
                }
            }
            else {
                sql.connect(config).then(() => {
                    return sql.query`select GIA,MA from dichvu where MA = ${khacDV}`
                }).then((result) => {
                    var {GIA,MA}=result.recordset[0]
                    sql.query` INSERT INTO SD_DICHVU VALUES(${maNext},${maNVK},${khacDV},${GIA})` 
                }).catch(err => {
                    
                }) 
                
            }         
        }
        return maNext
    })
    .then((maNext)=>{
        console.log('inser thanh cong ')
        res.clearCookie('guestPN', { })
        res.render('staff/work',{ 
        
        })
        
    })
    .catch(err => {
        // ... error checks
        console.log(err)
    })
}
module.exports.work = function(req, res, next) {
    res.render('staff/work')
}


module.exports.sdthd = function(req, res, next) {
    console.log(req.body)
    let {sdt}=req.body
    sql.connect(config).then(() => {
        return sql.query`select * from khachhang kh where kh.SDT=${sdt}`
    }).then(result => {
        console.log(result)
        if(result.recordset.length==0){// sdt chua co
            res.cookie("guestPN",sdt)
            res.redirect('/staff/addGuest')
        }else{//sdt da có
            res.cookie("guestPN",sdt)
            res.redirect('/staff/addBill',)
        }
    }).catch(err => {
        // ... error checks
    })
   
}
module.exports.sdtkh = function(req, res, next) {
    console.log(req.body)
    let {sdt}=req.body
    sql.connect(config).then(() => {
        return sql.query`select * from khachhang kh where kh.SDT=${sdt}`
    }).then(result => {
        console.log(result)
        if(result.recordset.length==0){// sdt chua co
            res.cookie("guestPN",sdt)
            res.redirect('/staff/addGuest')
        }else{//sdt da có
            res.cookie("guestPN",sdt)
            res.redirect('/staff/work')
        }
    }).catch(err => {
        // ... error checks
    })
   
}