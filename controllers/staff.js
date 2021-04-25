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

module.exports.work = function(req, res, next) {
    var errStaff=req.cookies.errStaff
    var succStaff=req.cookies.succStaff
    res.clearCookie('guestPN', { })
    res.clearCookie('mkh', { })
    res.clearCookie('guestId', { })
    res.clearCookie('idStaff', { })

    
    res.render('staff/work',{ 
        errors:errStaff,
        success:succStaff
    })
}

module.exports.addGuest = function(req, res, next) {
    var sdt=req.cookies.guestPN
    res.render('staff/addGuest',{ sdt})
}
module.exports.addGuest2 = function(req, res, next) {
    var{fullname,gender}=req.body;

    var sdt=req.cookies.guestPN
    let maxMa,maNext
    
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
        return sql.query` INSERT INTO KHACHHANG VALUES(${maNext},${fullname},${sdt},${gender},'LK1',0)`  
    })
    .then((result)=>{
        res.clearCookie('errStaff', { })
        res.clearCookie('guestPN', { })
        res.cookie("succStaff",[`Thêm khách hàng ${sdt} thành công`],{
            maxAge:1000
        })
        res.redirect('/staff/work')
    })
    .catch(err => {
        // ... error checks
        console.log(err)
    }) 
}

module.exports.addBill = function(req, res, next) {
    let mkh=req.cookies.guestId
    sql.connect(config).then(() => {       
        return sql.query`select * from khachhang where MA=${mkh}`
    })
    .then(result=>{
        res.locals.user=result.recordset[0]
        return sql.query`select * from loaikhach where MA=${res.locals.user.MALK}`
    })
    .then(result=>{
        res.locals.tlgg=result.recordset[0].TILE_GIAMGIA
        return sql.query` select *  from DICHVU  as dv where dv.MALDV='LD001'`  
    })
    .then(result => {
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
        return sql.query` select MA  from Nhanvien Where TRANGTHAI=1`
    }) 
    .then(result=>{
        res.locals.nvs=result.recordset

        res.render('staff/addBill',{
          })
    })
    .catch(err => {
        console.log("err "+err)
    })
}
module.exports.addBill2 = function(req, res, next) {
    var{catTocDV,uonTocDV,nhuomTocDV,khacDV,orderTime,nvtn}=req.body
    console.log(req.body)
    var values=req.body   
    var mkh=req.cookies.guestId;
    var maxMa,maNext,tlgg,score=0,currScore=0;

    sql.connect(config).then(() => {       //   get id
        return sql.query`select lk.TILE_GIAMGIA  from khachhang kh,loaikhach lk where kh.MA=${mkh} and kh.MALK=lk.MA` 
    })
    .then(result =>{
        tlgg=result.recordset[0].TILE_GIAMGIA
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
        return   sql.query` INSERT INTO hoadon VALUES(${maNext},${mkh},${orderTime},${nvtn},${tlgg})`
    })
    .then(result=>{                 //insert SD_DICHVU             
        async function myPromiseAdd() {
            let myPromiseCT = new Promise(function(myResolve, myReject) {
                var maNVCT = func.findStaff(values, values.catTocDV)
                sql.connect(config).then(() => {
                    return sql.query`select GIA,DIEMCONGTICHLUY  from dichvu where MA = ${catTocDV}`
                }).then(result => {
                    var {
                        GIA,
                        DIEMCONGTICHLUY
                    } = result.recordset[0]
                    score += parseInt(DIEMCONGTICHLUY);
                    return sql.query` INSERT INTO SD_DICHVU values(${maNext},${maNVCT},${catTocDV},${GIA})`
                })
                .then(result => {
                    myResolve()
                })
                .catch(err => {

                })
    
            });
            let myPromiseUT = new Promise(function(myResolve, myReject) {
                var maNVUT=func.findStaff(values,values.uonTocDV)
                sql.connect(config).then(() => {
                    return sql.query`select GIA,DIEMCONGTICHLUY from dichvu where MA = ${uonTocDV}`
                }).then(result => {
                    var {GIA,DIEMCONGTICHLUY}=result.recordset[0]
                    score+=parseInt(DIEMCONGTICHLUY);
                    return sql.query` INSERT INTO SD_DICHVU VALUES(${maNext},${maNVUT},${uonTocDV},${GIA})` 
                })
                .then((result)=>{
                    myResolve()
                })
                .catch(err => {
                    
                })  
    
            });
            let myPromiseNT = new Promise(function(myResolve, myReject) {
                var maNVNT=func.findStaff(values,values.nhuomTocDV)
                sql.connect(config).then(() => {
                    return sql.query`select GIA,DIEMCONGTICHLUY from dichvu where MA = ${nhuomTocDV}`
                }).then(result => {
                    var {GIA,DIEMCONGTICHLUY}=result.recordset[0]
                    score+=parseInt(DIEMCONGTICHLUY);
                    return sql.query` INSERT INTO SD_DICHVU VALUES(${maNext},${maNVNT},${nhuomTocDV},${GIA})` 
                })
                .then((result) =>{
                    myResolve()
                })
                .catch(err => {
                    
                })    
            
            });
            let myPromiseK = new Promise(function(myResolve, myReject) {
                if(Array.isArray(khacDV) ){
                    async function myPromiseK1(){
                        for(let id of khacDV) {
                            let myPromise = new Promise(function(myResolve, myReject) {
                                var maNVK=func.findStaff(values,id)
                                sql.connect(config).then(() => {
                                    return sql.query`select DIEMCONGTICHLUY,GIA from dichvu where MA = ${id}`
                                }).then((result) => {
                                    var {GIA,DIEMCONGTICHLUY}=result.recordset[0]
                                    score=score+parseInt(DIEMCONGTICHLUY)
                                    return sql.query` INSERT INTO SD_DICHVU VALUES(${maNext},${maNVK},${id},${GIA})` 
                                })
                                .then((result) =>{
                                    myResolve()
                                })
                            });
                            await myPromise; 
                        }
                    }
                    myPromiseK1()
                    
                }
                else {
                    async function myPromiseK2(){
                        let myPromise = new Promise(function(myResolve, myReject) {
                            var maNVK=func.findStaff(values,values.khacDV)
                            sql.connect(config).then(() => {
                                return sql.query`select GIA,MA,DIEMCONGTICHLUY from dichvu where MA = ${khacDV}`
                            }).then((result) => {
                                var {GIA,MA,DIEMCONGTICHLUY}=result.recordset[0]
                                score+=parseInt(DIEMCONGTICHLUY);
                                sql.query` INSERT INTO SD_DICHVU VALUES(${maNext},${maNVK},${khacDV},${GIA})` 
                            })
                            .then((result) =>{
                                myResolve()
                            })
                            .catch(err => {
                                
                            })    
                        
                        });
                        await myPromise; 
                    }
                    myPromiseK2()
                    
                }         
            });
            let myPromiseKH = new Promise(function(myResolve, myReject) {
                sql.connect(config).then(() => {
                    return sql.query`select DIEMTICHLUY from khachhang where MA=${mkh}`
                }).then(result => {
                    currScore=parseInt(result.recordset[0].DIEMTICHLUY)
                    currScore+=score   
                    if(currScore>=200){
                        return sql.query`UPDATE khachhang SET DIEMTICHLUY = ${currScore},MALK='LK4'  where MA=${mkh}`
                    }else if(currScore>=150){
                            return sql.query`UPDATE khachhang SET DIEMTICHLUY = ${currScore},MALK='LK3'  where MA=${mkh}`
                    }else if(currScore>=70){
                        return sql.query`UPDATE khachhang SET DIEMTICHLUY = ${currScore},MALK='LK2'  where MA=${mkh}`
                    }else if(currScore>=0){
                        return sql.query`UPDATE khachhang SET DIEMTICHLUY = ${currScore},MALK='LK1'  where MA=${mkh}`
                    } 
                })
                .then((result)=>{
                    myResolve()
                })
                .catch(err => {
                    
                })   
            });

            if(catTocDV){
                await myPromiseCT;
            }
            if(nhuomTocDV){
                await myPromiseNT;
            }
            if(uonTocDV){
                await myPromiseUT;
            }
            if(khacDV){
                await myPromiseK
            }
            await myPromiseKH
        }
        myPromiseAdd()  
    })
    .then(result=>{
        console.log('inser thanh cong ')
        res.clearCookie('guestId', { })
        res.cookie("succStaff",['Thêm hóa đơn thành công'],{
            maxAge:1000
        })
        res.redirect('/staff/work')
    })
    .catch(err => {
        console.log(err)
    })
}

module.exports.addStaff=function(req, res, next){
    res.render('staff/addStaff',{ 

    })
}
module.exports.addStaff2=function(req, res, next){
    var{fullname,sdt,gender,email,cmnd,address,birth}=req.body;
    console.log(req.body)
    var errors=[];
    var maxMa,maNext;
    sql.connect(config).then(() => {       //   validate sdt
        return sql.query` select nv.SDT  from nhanvien nv where nv.SDT=${sdt}`  
    }).then(result => { 
        if(result.recordset.length==0){//sdt k ton tai
            
        }else{//sdt da ton tai
            errors.push("Số điện thoại nhân viên đã tồn tại") 
        } 
                               //   validate tai khoan 
        return errors
    })        
    .then(errors =>{
        if(errors.length){//neu co loi
            res.render('staff/addStaff',{ 
                errors:errors,
                values:req.body,
            })
        }else{
            sql.connect(config).then(() => {       //   get id
                return sql.query`select MA from nhanvien` 
            }).then(result => {
                maxMa='01'
                let names=fullname.split(' ')
                let name=names[names.length-1]
                for(let ma of result.recordset){
                    let t=ma.MA
                    t=(t.substring(t.length-2, t.length))
                    if(t>maxMa) maxMa=t;
                }
                maNext=name+(parseInt(maxMa) +1).toString().padStart(2,0);
                if(maxMa=='01') maNext=name+'01'
                return maNext
            })       
            .then(maNext=>{                 //insert khach hang
        
                return sql.query` INSERT INTO nhanvien VALUES(${maNext},${fullname},${sdt},${gender},${email},${cmnd},${birth},${address},1)`
                
            })
            .then((result)=>{
                console.log('inser thanh cong ')
                res.clearCookie('errStaff', { })
                res.cookie('succStaff',[`Thêm nhân viên thần công`],{
                    maxAge:1000
                })
                res.redirect('/staff/work') 
            })
            .catch(err => {
                // ... error checks
                console.log(err)
            })
        }
    })
    .catch(err => {
        console.log("err "+err)
    })

}
module.exports.deleteStaff=function(req, res, next){
    console.log(req.query)
    let staffId=req.query.id
    sql.connect(config).then(() => {       //   validate sdt
        return sql.query` update nhanvien set TRANGTHAI=0 where MA=${staffId}`  
    })
    .then(result => {
        res.cookie('succStaff',[`Đã xóa nhân viên mã ${staffId}`],{
            maxAge:1000
        })
        res.redirect('/staff/work')
    })

}
module.exports.csnv2=function(req, res, next){
    var{fullname,sdt,gender,email,cmnd,address,birth}=req.body;

    console.log(req.body)
    var errors=[],maxMa,maNext;
    var mnv=req.cookies.idStaff
    sql.connect(config).then(() => {       //   get id
        return sql.query`select MA from nhanvien` 
    }).then(result => {
        let names=fullname.split(' ')
        let name=names[names.length-1]
        let t=mnv
        t=(t.substring(t.length-2, t.length))
        maNext=name+t
        if(maxMa=='01') maNext=name+'01'
        return sql.query`update nhanvien set MA=${maNext},TEN=${fullname}, GIOITINH=${gender},EMAIL=${email},CMND=${cmnd},DIACHI=${address},NGAYSINH=${birth} where MA=${mnv}`
    })       
    .then(result=>{
        res.cookie('succStaff',[`Đã cập nhật thông tin nhân viên ma ${mnv}`],{
            maxAge:1000
        })
        res.clearCookie('idStaff', { })
        res.redirect('/staff/work')
    })
    .catch(err => {
        console.log("err "+err)
    })

}






module.exports.thd = function(req, res, next) {
    res.clearCookie('errStaff', { })
    res.clearCookie('succStaff', { })
    let {value,filter}=req.body
    console.log(req.body)
    console.log(value,filter)
    var rePhone = /^\d{10}$/;
    let ma
    if(!value.match(rePhone)&&filter=='SDT'){
        res.cookie("errStaff",['Số điện thoại không chính xác'],{
            maxAge:1000
        }) 
        res.redirect('/staff/work')
        return;
    }
    sql.connect(config).then(() => {
        if(filter=='SDT'){
            return sql.query`select * from khachhang kh where kh.SDT=${value}`
        } 
        else if(filter=='MKH'){
            return sql.query`select * from khachhang kh where kh.MA=${value}`
        }      
    }).then(result => {
        if(result.recordset.length==0){// khachhang k co
            res.cookie("errStaff",[`Không tồn tại khách hàng có ${filter} là ${value}`],{
                maxAge:1000
            })
            res.redirect('/staff/work')
        }else{//khach hang da co
            ma=result.recordset[0].MA
            res.cookie("guestId",ma)
            res.redirect('/staff/work/addBill',)
        }
    }).catch(err => {
        // ... error checks
    })
    
    
   
}
module.exports.tkh = function(req, res, next) {
    res.clearCookie('errStaff', { })
    res.clearCookie('succStaff', { })
    let {sdt}=req.body,mkh
    var rePhone = /^\d{10}$/;
    if(!sdt.match(rePhone)){
        res.cookie("errStaff",[`Số điện thoại ${sdt} không chính xác`],{
            maxAge:1000
        })
            
        res.redirect('/staff/work')
        return
    }
    sql.connect(config).then(() => {
        return sql.query`select * from khachhang kh where kh.SDT=${sdt}`
    }).then(result => {
        console.log(result)
        if(result.recordset.length==0){// sdt chua co
            res.cookie("guestPN",sdt)
            res.redirect('/staff/work/addGuest')
        }else{//sdt da có
            res.cookie('errStaff', [`Số điện thoại ${sdt} đã tồn tại`],{
                maxAge:1000
            })
            res.redirect('/staff/work')
        }
    }).catch(err => {
        // ... error checks
    })
   
}

module.exports.tchd = function(req, res, next) {
    let {mhd}=req.body
    let kq=[]
    sql.connect(config).then(() => {
        return sql.query`select * from hoadon hd where MA=${mhd}`
    })
    .then(result => {
        if(result.recordset.length==0){// mhd sai
            res.cookie("errStaff",[`Mã hóa đơn ${mhd} không tồn tại`],{
                maxAge:1000
            })
            res.redirect('/staff/work')        
        }else{//mhd dung
            res.locals.hd=result.recordset
            
            sql.connect(config).then(() => {
                return sql.query`select kh.* from khachhang kh,hoadon hd where kh.MA=hd.MAKHACH and hd.MA=${mhd}`
            })
            .then((result) => {
                res.locals.user=result.recordset[0]
            })
            .then(result=>{
                async function myDisplay(){
                    for(let item of res.locals.hd){
                        var t={}
                        let myPromise = new Promise(function(myResolve, myReject) {
                            sql.connect(config).then(() => {
                                return sql.query`select dv.TEN,dv.GIA,sd.MANV from sd_dichvu  sd,dichvu dv where sd.MAHD=${item.MA} and dv.MA=sd.MADV`
                            }).then((result) => {
                                t.data=result.recordset
                                return sql.query`select SUM(GIA) as SUM from sd_dichvu where MAHD=${item.MA} `
                            }).then(result=>{
                                t.sum=result.recordset[0].SUM
                                return sql.query`select TILE_GIAMGIA from hoadon where MA=${item.MA} `
                            })
                            .then(result=>{
                                t.tlgg=result.recordset[0].TILE_GIAMGIA
                                t.price=parseInt( t.sum*(100-t.tlgg)/100)
                                var x={
                                    info:item,
                                    value:t
                                }
                                kq.push(x)
                                myResolve()
                            })
                            .catch(err => {
                                console.log('error', err)
                            }) 
        
                        });
                        await myPromise;
                    }
                    console.log(kq)
                    res.clearCookie('errStaff', { })
                    res.clearCookie('succStaff', { })

                    res.render('staff/viewBill',{
                        kq:kq
                    })
                }
                myDisplay()
            })
            .catch(err => {
                // ... error checks
            })

        }
    })
}

module.exports.tckh=function(req, res, next) {
    res.clearCookie('errStaff', { })
    res.clearCookie('succStaff', { })
    console.log(req.query)
    let {value,filter}=req.query

    var rePhone = /^\d{10}$/;
    let kq=[],tam,ma
    if(!value.match(rePhone)&&filter=='SDT'){
        res.cookie("errStaff",[`Số điện thoại ${value} không chính xác`],{
            maxAge:1000
        }) 
        res.redirect('/staff/work')
        return;
    }
    sql.connect(config).then(() => {
        if(filter=='SDT'){
            return sql.query`select * from khachhang kh where kh.SDT=${value}`
        } 
        else if(filter=='MKH'){
            return sql.query`select * from khachhang kh where kh.MA=${value}`
        }      
    }).then(result => {
        if(result.recordset.length==0){// khachhang k co
            res.cookie("errStaff",[`Không tồn tại khách hàng có ${filter} là ${value}`],{
                maxAge:1000
            })
            res.redirect('/staff/work')
        }else{//khach hang da co
            ma=result.recordset[0].MA
            res.locals.user=result.recordset[0]
            res.cookie('guestId',ma)

            sql.connect(config).then(() => {
                return sql.query`select tk.TAIKHOAN  from taikhoan as tk ,khachhang as kh where kh.MA=${ma} and tk.MAKH=kh.MA `
            })
            .then(result=>{
                if(result.recordset.length==0){// kh k co tk
                    res.locals.taiKhoan=''
                }else{//kh co tk
                    res.locals.taiKhoan=result.recordset[0].TAIKHOAN
                }
                return sql.query` select lk.TENLOAI  from loaikhach as lk, khachhang as kh where kh.MA=${ma} and lk.MA=kh.MALK`
            })
            .then(result => {
                res.locals.loaiKhach=result.recordset[0].TENLOAI
                return sql.query`select * from hoadon where MAKHACH=${ma} ORDER BY MA DESC;` 
            })
            .then(result=>{
                res.locals.hd=result.recordset
                async function myDisplay(){
                    for(let item of res.locals.hd){
                        var t={}
                        let myPromise = new Promise(function(myResolve, myReject) {
                            sql.connect(config).then(() => {
                                return sql.query`select dv.TEN,dv.GIA,sd.MANV from sd_dichvu  sd,dichvu dv where sd.MAHD=${item.MA} and dv.MA=sd.MADV`
                            }).then((result) => {
                                t.data=result.recordset
                                return sql.query`select SUM(GIA) as SUM from sd_dichvu where MAHD=${item.MA} `
                            }).then(result=>{
                                t.sum=result.recordset[0].SUM
                                return sql.query`select TILE_GIAMGIA from hoadon where MA=${item.MA} `
                            })
                            .then(result=>{
                                t.tlgg=result.recordset[0].TILE_GIAMGIA
                                t.price=parseInt( t.sum*(100-t.tlgg)/100)
                                var x={
                                    info:item,
                                    value:t
                                }
                                kq.push(x)
                                myResolve()
                            })
                            .catch(err => {
                                console.log('error', err)
                            }) 
        
                        });
                        await myPromise;
                    }
                    console.log(kq)
                    res.clearCookie('errStaff', { })
                    res.clearCookie('succStaff', { })
                    console.log({
                        user:res.locals.user,
                        loaiKhach:res.locals.loaiKhach,
                        hd:res.locals.hd,
                        taiKhoan:res.locals.taiKhoan,


                    })

                    res.render('staff/viewGuest',{
                        kq:kq
                    })
                }
                myDisplay()

            })
            
            
        }
    })
    .catch(err=>{

    })  
}
module.exports.tckh2=function(req, res, next) {
    console.log(req.body)
    var{fullname,sdt,gender}=req.body;
    var ma=req.cookies.guestId 
    let kq=[]
    sql.connect(config).then(() => {      
          return sql.query`select * from khachhang where MA!=${ma} and SDT=${sdt} `
    })
    .then(result=>{
        if(result.recordset.length==0){//sdt hop le
            console.log('sdt hop le')
            sql.connect(config).then(() => {      
                return sql.query` UPDATE KHACHHANG  SET TEN=${fullname}, GIOITINH=${gender},SDT=${sdt} WHERE MA=${ma}`
            })
            .then(result=>{
                console.log("update thanh cong")
                sql.connect(config).then(() => {
                    return sql.query`select * from khachhang where MA=${ma} `
                })
                .then(result=>{
                    res.locals.user=result.recordset[0]
                    return sql.query`select tk.TAIKHOAN  from taikhoan as tk ,khachhang as kh where kh.MA=${ma} and tk.MAKH=kh.MA `
                })
                .then(result=>{
                    if(result.recordset.length==0){// kh k co tk
                        res.locals.taiKhoan=''
                    }else{//kh co tk
                        res.locals.taiKhoan=result.recordset[0].TAIKHOAN
                    }
                    return sql.query` select lk.TENLOAI  from loaikhach as lk, khachhang as kh where kh.MA=${ma} and lk.MA=kh.MALK`
                })
                .then(result => {
                    res.locals.loaiKhach=result.recordset[0].TENLOAI
                    return sql.query`select * from hoadon where MAKHACH=${ma} ORDER BY MA DESC;` 
                })
                .then(result=>{
                    res.locals.hd=result.recordset
                    async function myDisplay(){
                        for(let item of res.locals.hd){
                            var t={}
                            let myPromise = new Promise(function(myResolve, myReject) {
                                sql.connect(config).then(() => {
                                    return sql.query`select dv.TEN,dv.GIA,sd.MANV from sd_dichvu  sd,dichvu dv where sd.MAHD=${item.MA} and dv.MA=sd.MADV`
                                }).then((result) => {
                                    t.data=result.recordset
                                    return sql.query`select SUM(GIA) as SUM from sd_dichvu where MAHD=${item.MA} `
                                }).then(result=>{
                                    t.sum=result.recordset[0].SUM
                                    return sql.query`select TILE_GIAMGIA from hoadon where MA=${item.MA} `
                                })
                                .then(result=>{
                                    t.tlgg=result.recordset[0].TILE_GIAMGIA
                                    t.price=parseInt( t.sum*(100-t.tlgg)/100)
                                    var x={
                                        info:item,
                                        value:t
                                    }
                                    kq.push(x)
                                    myResolve()
                                })
                                .catch(err => {
                                    console.log('error', err)
                                }) 
            
                            });
                            await myPromise;
                        }
                        res.render('staff/viewGuest',{
                            success:[`Lưu thay đổi thông tin khách hàng ${ma} thành công`],
                            kq:kq
                        })
                    }
                    myDisplay()
    
                })

                // res.redirect('/staff/work')
            })
        }else{//sdt k hop le
            sql.connect(config).then(() => {
                return sql.query`select * from khachhang where MA=${ma} `
            })
            .then(result=>{
                res.locals.user=result.recordset[0]
                return sql.query`select tk.TAIKHOAN  from taikhoan as tk ,khachhang as kh where kh.MA=${ma} and tk.MAKH=kh.MA `
            })
            .then(result=>{
                if(result.recordset.length==0){// kh k co tk
                    res.locals.taiKhoan=''
                }else{//kh co tk
                    res.locals.taiKhoan=result.recordset[0].TAIKHOAN
                }
                return sql.query` select lk.TENLOAI  from loaikhach as lk, khachhang as kh where kh.MA=${ma} and lk.MA=kh.MALK`
            })
            .then(result => {
                res.locals.loaiKhach=result.recordset[0].TENLOAI
                return sql.query`select * from hoadon where MAKHACH=${ma} ORDER BY MA DESC;` 
            })
            .then(result=>{
                res.locals.hd=result.recordset
                async function myDisplay(){
                    for(let item of res.locals.hd){
                        var t={}
                        let myPromise = new Promise(function(myResolve, myReject) {
                            sql.connect(config).then(() => {
                                return sql.query`select dv.TEN,dv.GIA,sd.MANV from sd_dichvu  sd,dichvu dv where sd.MAHD=${item.MA} and dv.MA=sd.MADV`
                            }).then((result) => {
                                t.data=result.recordset
                                return sql.query`select SUM(GIA) as SUM from sd_dichvu where MAHD=${item.MA} `
                            }).then(result=>{
                                t.sum=result.recordset[0].SUM
                                return sql.query`select TILE_GIAMGIA from hoadon where MA=${item.MA} `
                            })
                            .then(result=>{
                                t.tlgg=result.recordset[0].TILE_GIAMGIA
                                t.price=parseInt( t.sum*(100-t.tlgg)/100)
                                var x={
                                    info:item,
                                    value:t
                                }
                                kq.push(x)
                                myResolve()
                            })
                            .catch(err => {
                                console.log('error', err)
                            }) 
        
                        });
                        await myPromise;
                    }
                    console.log(kq)
                    res.clearCookie('errStaff', { })
                    res.clearCookie('succStaff', { })
                    console.log({
                        user:res.locals.user,
                        loaiKhach:res.locals.loaiKhach,
                        hd:res.locals.hd,
                        taiKhoan:res.locals.taiKhoan,


                    })

                    res.render('staff/viewGuest',{
                        errors:[`Số điện thoại ${sdt} đã tồn tại`],
                        kq:kq
                    })
                }
                myDisplay()

            })



        }
        
    })


}

module.exports.dt =function(req, res, next) {
    var kqdd=[],kqdh=[],kqht=[]
    let hddd,hddh,hdht;
    // 0 - dang dat
    // 1 - da huy
    // 2 - hoan thanh
    sql.connect(config).then(() => {       //   get id
        return sql.query`select * from DATTRUOC where TRANGTHAI=0 ORDER BY MA DESC` 
    })
    .then(result=>{
        hddd=result.recordset
        return sql.query`select * from DATTRUOC where TRANGTHAI=1 ORDER BY MA DESC` 
    })
    .then(result=>{
        hddh=result.recordset
        return sql.query`select * from DATTRUOC where TRANGTHAI=2 ORDER BY MA DESC` 
    })
    .then(result=>{
        hdht=result.recordset
    })
    .then(()=>{
        async function datTruoc(){
            for(let item of hddd){//Dd
                let myPromise = new Promise(function(myResolve, myReject) {
                    let t={}
                    sql.connect(config).then(() => {
                        return sql.query`select dv.TEN,dv.GIA from sd_Dichvu_dattruoc sd,dichvu dv where sd.MAHD=${item.MA} and dv.MA=sd.MADV` 
                    }).then((result) => {
                        t.data=result.recordset
                        return sql.query`select SUM(GIA) as SUM from sd_Dichvu_dattruoc where MAHD=${item.MA} `
                    }).then(result=>{
                        t.sum=result.recordset[0]
                        return sql.query`select * from khachhang where MA=${item.MAKHACH}`
                        
                    })     
                    .then(result=>{
                        t.user=result.recordset[0]
                        return sql.query`select TILE_GIAMGIA from loaikhach lk,khachhang kh where kh.MA=${item.MAKHACH} and kh.MALK=lk.MA`
                    })
                    .then(result=>{
                        t.tlgg=result.recordset[0].TILE_GIAMGIA;
                    })
                    .then(res=>{
                        var x={
                            info:item,
                            sum:t.sum.SUM,
                            data:t.data,
                            user:t.user,
                            tlgg:t.tlgg
                        }
                        kqdd.push(x)
                        myResolve()
                    })
                });
                await myPromise;
            }
            for(let item of hddh){
                let myPromise = new Promise(function(myResolve, myReject) {
                    let t={}
                    sql.connect(config).then(() => {
                        return sql.query`select dv.TEN,dv.GIA from sd_Dichvu_dattruoc sd,dichvu dv where sd.MAHD=${item.MA} and dv.MA=sd.MADV` 
                    }).then((result) => {
                        t.data=result.recordset
                        return sql.query`select SUM(GIA) as SUM from sd_Dichvu_dattruoc where MAHD=${item.MA} `
                    }).then(result=>{
                        t.sum=result.recordset[0]
                        return sql.query`select * from khachhang where MA=${item.MAKHACH}`
                        
                    })     
                    .then(result=>{
                        t.user=result.recordset[0]
                        return sql.query`select TILE_GIAMGIA from loaikhach lk,khachhang kh where kh.MA=${item.MAKHACH} and kh.MALK=lk.MA`
                    })
                    .then(result=>{
                        t.tlgg=result.recordset[0].TILE_GIAMGIA;
                    })
                    .then(res=>{
                        var x={
                            info:item,
                            sum:t.sum.SUM,
                            data:t.data,
                            user:t.user,
                            tlgg:t.tlgg
                        }
                        kqdh.push(x)
                        myResolve()
                    }) 
                });
                await myPromise;
            }
            for(let item of hdht){
                let myPromise = new Promise(function(myResolve, myReject) {
                    let t={}
                    sql.connect(config).then(() => {
                        return sql.query`select dv.TEN,dv.GIA from sd_Dichvu_dattruoc sd,dichvu dv where sd.MAHD=${item.MA} and dv.MA=sd.MADV` 
                    }).then((result) => {
                        t.data=result.recordset
                        return sql.query`select SUM(GIA) as SUM from sd_Dichvu_dattruoc where MAHD=${item.MA} `
                    }).then(result=>{
                        t.sum=result.recordset[0]
                        return sql.query`select * from khachhang where MA=${item.MAKHACH}`
                        
                    })     
                    .then(result=>{
                        t.user=result.recordset[0]
                        return sql.query`select TILE_GIAMGIA from loaikhach lk,khachhang kh where kh.MA=${item.MAKHACH} and kh.MALK=lk.MA`
                    })
                    .then(result=>{
                        t.tlgg=result.recordset[0].TILE_GIAMGIA;
                    })
                    .then(res=>{
                        var x={
                            info:item,
                            sum:t.sum.SUM,
                            data:t.data,
                            user:t.user,
                            tlgg:t.tlgg
                        }
                        kqht.push(x)
                        myResolve()
                    })
                });
                await myPromise;
            }
            console.log(kqdd)
            console.log(kqdh)
            console.log(kqht) 
            res.render('staff/guestOrderOnline',{
                errors:req.cookies.errStaff,
                success:req.cookies.succStaff,
                kqdd,
                kqdh,
                kqht
            }) 
        }
        datTruoc()
       

    })
    
    

    
}
module.exports.deleteOrder=function(req, res, next) {
    let ma=req.query.ma
    sql.connect(config).then(() => {       //   validate tai khoan
        return sql.query`  UPDATE DATTRUOC SET TRANGTHAI=1 WHERE MA=${ma}`

    }).then(result => {
        res.cookie('succStaff',[`Hủy đặt trước đơn hàng mã ${ma} thành công`],{
            maxAge:1000
        })
        res.redirect('/staff/work/dt')
    })        
    .catch(err => {
        console.log("err "+err)
    })
    
}
module.exports.completeOrder=function(req, res, next) {
    let ma=req.query.ma,kq=[]
    res.cookie('mhd',ma)
    res.locals.ma=ma;
    sql.connect(config).then(() => {       //   
        return sql.query`  select * from dattruoc dt where MA=${ma}`

    }).then(result => {
        res.locals.info=result.recordset[0]
        return sql.query`select * from khachhang kh where kh.MA=${res.locals.info.MAKHACH}`
    })    
    .then(result => {
        res.locals.user=result.recordset[0];
        res.cookie("guestId",res.locals.user.MA)
        return sql.query`select * from loaikhach where MA=${res.locals.user.MALK}`
    })   
    .then(result =>{
        res.locals.tlgg=result.recordset[0].TILE_GIAMGIA
        return sql.query`select * from sd_Dichvu_dattruoc sd where MAHD=${ma}`
    })  
    .then(result => {
        res.locals.data=result.recordset
        // console.log(data)
        return sql.query` select *  from DICHVU  as dv where dv.MALDV='LD001'`  
    })
    .then(result => {
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
        return sql.query` select MA  from Nhanvien where TRANGTHAI=1`
    }) 
    .then(result=>{
        res.locals.nvs=result.recordset
        async function selectInfoDV(){
            for(let item of res.locals.data){
                let myPromise = new Promise(function(myResolve, myReject) {
                    let data
                    sql.connect(config).then(() => {
                        return sql.query`select * from  dichvu dv where  dv.MA=${item.MADV}`
                    })
                    .then(result =>{
                        data=result.recordset[0]
                        kq.push(data)
                        myResolve()
                    })
                });
                await myPromise;

            }
           
            res.render('staff/completeOrder',{
                
            }) 
        }
        selectInfoDV()

        
        
    })

}
module.exports.completeOrder2=function(req, res, next){
    console.log(req.body)
    
    var{catTocDV,uonTocDV,nhuomTocDV,khacDV,orderTime,nvtn}=req.body
    var mkh=req.cookies.guestId
    var maxMa,maNext,tlgg,score=0,currScore=0,values=req.body;
    sql.connect(config).then(() => {       //   get id
        return sql.query`select lk.TILE_GIAMGIA  from khachhang kh,loaikhach lk where kh.MA=${mkh} and kh.MALK=lk.MA` 
    })
    .then(result =>{
        tlgg=result.recordset[0].TILE_GIAMGIA
        return sql.query`select max(ma) as ma from HOADON` 
    })
    .then(result => {
        if(result.recordset[0].ma){
            maxMa=result.recordset[0].ma;
            maNext =maxMa.slice(0,2) +(parseInt(maxMa.slice(2)) +1).toString().padStart(8,0);
        }else{
            maNext='HD00000001'
        }
        //          insert HOADON
        return  sql.query` INSERT INTO hoadon VALUES(${maNext},${mkh},${orderTime},${nvtn},${tlgg})`
    })       
    .then(result=>{   //                        insert sd_dv_dattruoc
        async function myPromiseAdd() {
            let myPromiseCT = new Promise(function(myResolve, myReject) {
                var maNVCT = func.findStaff(values, values.catTocDV)
                sql.connect(config).then(() => {
                    return sql.query`select GIA,DIEMCONGTICHLUY  from dichvu where MA = ${catTocDV}`
                }).then(result => {
                    var {
                        GIA,
                        DIEMCONGTICHLUY
                    } = result.recordset[0]
                    score += parseInt(DIEMCONGTICHLUY);
                    return sql.query` INSERT INTO SD_DICHVU values(${maNext},${maNVCT},${catTocDV},${GIA})`
                })
                .then(result => {
                    myResolve()
                })
                .catch(err => {

                })
    
            });
            let myPromiseUT = new Promise(function(myResolve, myReject) {
                var maNVUT=func.findStaff(values,values.uonTocDV)
                sql.connect(config).then(() => {
                    return sql.query`select GIA,DIEMCONGTICHLUY from dichvu where MA = ${uonTocDV}`
                }).then(result => {
                    var {GIA,DIEMCONGTICHLUY}=result.recordset[0]
                    score+=parseInt(DIEMCONGTICHLUY);
                    return sql.query` INSERT INTO SD_DICHVU VALUES(${maNext},${maNVUT},${uonTocDV},${GIA})` 
                })
                .then((result)=>{
                    myResolve()
                })
                .catch(err => {
                    
                })  
    
            });
            let myPromiseNT = new Promise(function(myResolve, myReject) {
                var maNVNT=func.findStaff(values,values.nhuomTocDV)
                sql.connect(config).then(() => {
                    return sql.query`select GIA,DIEMCONGTICHLUY from dichvu where MA = ${nhuomTocDV}`
                }).then(result => {
                    var {GIA,DIEMCONGTICHLUY}=result.recordset[0]
                    score+=parseInt(DIEMCONGTICHLUY);
                    return sql.query` INSERT INTO SD_DICHVU VALUES(${maNext},${maNVNT},${nhuomTocDV},${GIA})` 
                })
                .then((result) =>{
                    myResolve()
                })
                .catch(err => {
                    
                })    
            
            });
            let myPromiseK = new Promise(function(myResolve, myReject) {
                if(Array.isArray(khacDV) ){
                    async function myPromiseK1(){
                        for(let id of khacDV) {
                            let myPromise = new Promise(function(myResolve, myReject) {
                                var maNVK=func.findStaff(values,id)
                                sql.connect(config).then(() => {
                                    return sql.query`select DIEMCONGTICHLUY,GIA from dichvu where MA = ${id}`
                                }).then((result) => {
                                    var {GIA,DIEMCONGTICHLUY}=result.recordset[0]
                                    score=score+parseInt(DIEMCONGTICHLUY)
                                    return sql.query` INSERT INTO SD_DICHVU VALUES(${maNext},${maNVK},${id},${GIA})` 
                                })
                                .then((result) =>{
                                    myResolve()
                                })
                            });
                            await myPromise; 
                        }
                    }
                    myPromiseK1()
                    
                }
                else {
                    async function myPromiseK2(){
                        let myPromise = new Promise(function(myResolve, myReject) {
                            var maNVK=func.findStaff(values,values.khacDV)
                            sql.connect(config).then(() => {
                                return sql.query`select GIA,MA,DIEMCONGTICHLUY from dichvu where MA = ${khacDV}`
                            }).then((result) => {
                                var {GIA,MA,DIEMCONGTICHLUY}=result.recordset[0]
                                score+=parseInt(DIEMCONGTICHLUY);
                                sql.query` INSERT INTO SD_DICHVU VALUES(${maNext},${maNVK},${khacDV},${GIA})` 
                            })
                            .then((result) =>{
                                myResolve()
                            })
                            .catch(err => {
                                
                            })    
                        
                        });
                        await myPromise; 
                    }
                    myPromiseK2()
                    
                }         
            });
            let myPromiseKH = new Promise(function(myResolve, myReject) {
                sql.connect(config).then(() => {
                    return sql.query`select DIEMTICHLUY from khachhang where MA=${mkh}`
                }).then(result => {
                    currScore=parseInt(result.recordset[0].DIEMTICHLUY)
                    currScore+=score   
                    if(currScore>=200){
                        return sql.query`UPDATE khachhang SET DIEMTICHLUY = ${currScore},MALK='LK4'  where MA=${mkh}`
                    }else if(currScore>=150){
                            return sql.query`UPDATE khachhang SET DIEMTICHLUY = ${currScore},MALK='LK3'  where MA=${mkh}`
                    }else if(currScore>=70){
                        return sql.query`UPDATE khachhang SET DIEMTICHLUY = ${currScore},MALK='LK2'  where MA=${mkh}`
                    }else if(currScore>=0){
                        return sql.query`UPDATE khachhang SET DIEMTICHLUY = ${currScore},MALK='LK1'  where MA=${mkh}`
                    } 
                })
                .then((result)=>{
                    myResolve()
                })
                .catch(err => {
                    
                })   
            });

            if(catTocDV){
                await myPromiseCT;
            }
            if(nhuomTocDV){
                await myPromiseNT;
            }
            if(uonTocDV){
                await myPromiseUT;
            }
            if(khacDV){
                await myPromiseK
            }
            await myPromiseKH
            
        }
        myPromiseAdd()  
    })
    .then(()=>{
        return sql.query`UPDATE DATTRUOC SET TRANGTHAI=2 WHERE MA=${req.cookies.mhd}`
        
    })
    .then(()=>{
        console.log('inser thanh cong ')
        res.clearCookie('guestId', { })
        res.clearCookie('mhd', { })
        res.cookie("succStaff",[`Thêm hóa đơn thành công`],{
            maxAge:1000
        })
        res.redirect('/staff/work/dt')
    })
    
}
    



module.exports.xhd = function(req, res, next) {
    res.clearCookie('errStaff', { })
    res.clearCookie('succStaff', { })

    let {mhd,password}=req.body
    let maKhach,diem,total=0
    sql.connect(config).then(() => {
        return sql.query`select * from password pass where MA=${md5(password)}`
    })
    .then(result=>{
        if(result.recordset.length==0){// mk sai
            res.cookie("errStaff",['Mật khẩu không chính xác'],{
                maxAge:1000
            })
            
            res.redirect('/staff/work')
            
        }else{//mk dung
            sql.connect(config).then(() => {
                return sql.query`select * from hoadon hd where MA=${mhd}`
            })
            .then(result =>{
                if(result.recordset.length==0){// mhd sai
                    res.cookie("errStaff",[`Mã hóa đơn ${mhd} không tồn tại`],{
                        maxAge:1000
                    })   
                    res.redirect('/staff/work')        
                }else{//mhd dung       
                    sql.connect(config).then(() => {
                        return sql.query`select MAKHACH from hoadon where MA=${mhd}`
                    })
                    .then(result =>{
                        maKhach=result.recordset[0].MAKHACH
                        return sql.query`select * from SD_DICHVU where MAHD=${mhd}`
                    })
                    .then(result =>{
                        async function truDiem(){
                            for(let item of result.recordset){
                                let myPromise = new Promise(function(myResolve, myReject) {
                                    sql.connect(config).then(() => {
                                        return sql.query`select DIEMCONGTICHLUY from dichvu dv where dv.MA=${item.MADV} `
                                    })
                                    .then(result=>{
                                        total+=result.recordset[0].DIEMCONGTICHLUY
                                        myResolve()
                                    })
                                });
                                await myPromise;
                            }
                            sql.connect(config).then(() => {
                                return sql.query`select DIEMTICHLUY from khachhang where MA=${maKhach}`
                            })
                            .then(result =>{
                                diem=result.recordset[0].DIEMTICHLUY
                                console.log(total,diem)

                                return sql.query`update   khachhang set DIEMTICHLUY=${diem-total} where MA=${maKhach}`
                            })
                            .then(result=>{
                                let currScore=diem-total
                                if(currScore>=200){
                                    return sql.query`UPDATE khachhang SET DIEMTICHLUY = ${currScore},MALK='LK4'  where MA=${maKhach}`
                                }else if(currScore>=150){
                                        return sql.query`UPDATE khachhang SET DIEMTICHLUY = ${currScore},MALK='LK3'  where MA=${maKhach}`
                                }else if(currScore>=70){
                                    return sql.query`UPDATE khachhang SET DIEMTICHLUY = ${currScore},MALK='LK2'  where MA=${maKhach}`
                                }else if(currScore>=0){
                                    return sql.query`UPDATE khachhang SET DIEMTICHLUY = ${currScore},MALK='LK1'  where MA=${maKhach}`
                                } 
                            })
                            .then(result=>{
                                return sql.query`delete from SD_DICHVU where MAHD=${mhd}`
                            })
                            .then(result => {
                                return sql.query`delete from hoadon where MA=${mhd}`
                            })
                            .then((result) => {
                                res.cookie("succStaff",[`Hóa đơn ${mhd} đã xóa`],{
                                    maxAge:1000
                                })
                                res.clearCookie('errStaff', { })
                                res.redirect('/staff/work')
                            })

                        }
                        truDiem()

                        
                        
                    })
                    
                }
            })
        }
        
    })

}
module.exports.tnv = function(req, res, next) {
    res.clearCookie('errStaff', { })
    let {password}=req.body
    sql.connect(config).then(() => {
        return sql.query`select * from password pass where MA=${md5(password)}`
    }).then(result => {
        console.log(result)
        if(result.recordset.length==0){// mk sai
            res.cookie("errStaff",['Mật khẩu không chính xác'],{
                maxAge:1000
            })   
            res.redirect('/staff/work')
        }else{//mk dung
            res.redirect('/staff/work/addStaff')
        }
    }).catch(err => {
        // ... error checks
    })
   
}
module.exports.csnv = function(req, res, next) {
    res.clearCookie('errStaff', { })
    res.clearCookie('succStaff', { })

    let {value,filter,password}=req.body
    console.log(req.query)

    var rePhone = /^\d{10}$/;
    let kq=[],tam,ma

    sql.connect(config).then(() => {
        return sql.query`select * from password pass where MA=${md5(password)}`
    }).then(result => {
        console.log(result)
        if(result.recordset.length==0){// mk sai
            res.cookie("errStaff",['Mật khẩu không chính xác'],{
                maxAge:1000
            })   
            res.redirect('/staff/work')
        }else{//mk dung
            if(!value.match(rePhone)&&filter=='SDT'){
                res.cookie("errStaff",['Số điện thoại không chính xác'],{
                    maxAge:1000
                }) 
                res.redirect('/staff/work')
                return;
            }
            sql.connect(config).then(() => {
                if(filter=='SDT'){
                    return sql.query`select * from nhanvien  where SDT=${value}`
                } 
                else if(filter=='MNV'){
                    return sql.query`select * from nhanvien  where MA=${value}`
                }     
            }).then(result => {
                if(result.recordset.length==0){// nhan vien k co
                    res.cookie("errStaff",[`Không tồn tại nhân viên có ${filter} là ${value}`])
                    res.redirect('/staff/work')
                }else{//nhan vien da co
                   res.locals.staff=result.recordset[0]
                   res.cookie('idStaff',res.locals.staff.MA)
                   console.log(res.locals.staff)
                   res.render('staff/viewStaff')
                }
            })
        }
    })
    
    
   
}
module.exports.dmk = function(req, res, next) {
    res.clearCookie('errStaff', { })
    let {password,newPassword,confirm_newPassword}=req.body
    sql.connect(config).then(() => {
        return sql.query`select * from password pass where MA=${md5(password)}`
    }).then(result => {
        console.log(result)
        if(result.recordset.length==0){// mk sai
            res.cookie("errStaff",['Mật khẩu không chính xác'],{
                maxAge:1000
            })   
            res.redirect('/staff/work')
        }else{//mk dung
            if(newPassword==confirm_newPassword){
                sql.connect(config).then(() => {
                    return sql.query`delete from password`
                })
                .then(result=>{
                    return sql.query`insert into password values(${md5(newPassword)})`
                })
                .then(result=>{
                    res.cookie('succStaff',[`Thay đổi mật khẩu admin thành công`],{
                        maxAge:1000
                    })
                    res.redirect('/staff/work')
                })
                
            }else{
                res.cookie('errStaff',[`Mật khẩu và mật khẩu xác nhận không giống nhau`],{
                    maxAge:1000
                })
                res.redirect('/staff/work/')
            }
            
        }
    }).catch(err => {
        // ... error checks
    })
   
}

// Thống kê
module.exports.tkNgay=function(req, res, next) {
    console.log(req.query)
    let{day}=req.query
    var kq=[]
    let tongTien=0,tongHD=0
    let par=`%${day}%`
    sql.connect(config).then(() => {       //   get id
        return sql.query`select * from hoadon where THOIGIAN LIKE ${par} ORDER BY MA DESC;` 
    })
    .then(result => {
        // console.log(result)
        console.log(result.recordset)
        res.locals.hd=result.recordset
        tongHD=result.recordset.length
        async function myDisplay(hd){
            for(let item of hd){
                var t={}
                let myPromise = new Promise(function(myResolve, myReject) {
                    sql.connect(config).then(() => {
                        return sql.query`select * from khachhang where MA=${item.MAKHACH}`
                        
                    })
                    .then(result=>{
                        t.user=result.recordset[0]
                        return sql.query`select dv.TEN,dv.GIA,sd.MANV from sd_dichvu  sd,dichvu dv where sd.MAHD=${item.MA} and dv.MA=sd.MADV`
                    })
                    .then((result) => {
                        t.data=result.recordset
                        return sql.query`select SUM(GIA) as SUM from sd_dichvu where MAHD=${item.MA} `
                    }).then(result=>{
                        t.sum=result.recordset[0].SUM
                        return sql.query`select TILE_GIAMGIA from hoadon where MA=${item.MA} `
                    })
                    .then(result=>{
                        t.tlgg=result.recordset[0].TILE_GIAMGIA
                        t.price=parseInt( t.sum*(100-t.tlgg)/100)
                        tongTien+=t.price
                        var x={
                            info:item,
                            value:t
                        }
                        kq.push(x)
                        myResolve()
                    })
                    .catch(err => {
                        console.log('error', err)
                    }) 

                });
                await myPromise;
            }
            res.render('staff/statistic',{
                kq,
                tongTien,
                tongHD,
                loai:{
                    loai:'ngay',
                    giaTri:func.convertTimeYMD(day)
                    
                }
            })
        }
        myDisplay(res.locals.hd)
    })
    .catch((err)=>{
        console.log(err)
    })
    

}
module.exports.tkThang=function(req, res, next) {
    console.log(req.query)//{ month: '2021-04' }
    let{month}=req.query//
    var kq=[]
    let tongTien=0,tongHD=0//2021-04-25T13:31
    let par=`${month}-__T%`
    sql.connect(config).then(() => {       //   get id
        return sql.query`select * from hoadon where THOIGIAN LIKE ${par} ORDER BY MA DESC;` 
    })
    .then(result => {
        // console.log(result)
        console.log(result.recordset)
        res.locals.hd=result.recordset
        tongHD=result.recordset.length
        async function myDisplay(hd){
            for(let item of hd){
                var t={}
                let myPromise = new Promise(function(myResolve, myReject) {
                    sql.connect(config).then(() => {
                        return sql.query`select * from khachhang where MA=${item.MAKHACH}`
                        
                    })
                    .then(result=>{
                        t.user=result.recordset[0]
                        return sql.query`select dv.TEN,dv.GIA,sd.MANV from sd_dichvu  sd,dichvu dv where sd.MAHD=${item.MA} and dv.MA=sd.MADV`
                    })
                    .then((result) => {
                        t.data=result.recordset
                        return sql.query`select SUM(GIA) as SUM from sd_dichvu where MAHD=${item.MA} `
                    }).then(result=>{
                        t.sum=result.recordset[0].SUM
                        return sql.query`select TILE_GIAMGIA from hoadon where MA=${item.MA} `
                    })
                    .then(result=>{
                        t.tlgg=result.recordset[0].TILE_GIAMGIA
                        t.price=parseInt( t.sum*(100-t.tlgg)/100)
                        tongTien+=t.price
                        var x={
                            info:item,
                            value:t
                        }
                        kq.push(x)
                        myResolve()
                    })
                    .catch(err => {
                        console.log('error', err)
                    }) 

                });
                await myPromise;
            }
            res.render('staff/statistic',{
                kq,
                tongTien,
                tongHD,
                loai:{
                    loai:'thang',
                    giaTri:func.convertTimeYM(month)
                    
                }
            })
        }
        myDisplay(res.locals.hd)
    })
    .catch((err)=>{
        console.log(err)
    })
}
module.exports.tkNam=function(req, res, next) {
    console.log(req.query)//{ month: '2021-04' }
    let{year}=req.query//
    var regex=/^\d{4}$/
    if( regex.test(year)){

    }else{
        res.cookie('errStaff',[`Năm ${year} không đúng định dạng`],{
            maxAge:1000
        })
        res.redirect('/staff/work')
        return
    }
    var kq=[]
    let tongTien=0,tongHD=0//2021-04-25T13:31
    let par=`${year}-__-__T%`
    sql.connect(config).then(() => {       //   get id
        return sql.query`select * from hoadon where THOIGIAN LIKE ${par} ORDER BY MA DESC;` 
    })
    .then(result => {
        // console.log(result)
        console.log(result.recordset)
        res.locals.hd=result.recordset
        tongHD=result.recordset.length
        async function myDisplay(hd){
            for(let item of hd){
                var t={}
                let myPromise = new Promise(function(myResolve, myReject) {
                    sql.connect(config).then(() => {
                        return sql.query`select * from khachhang where MA=${item.MAKHACH}`
                        
                    })
                    .then(result=>{
                        t.user=result.recordset[0]
                        return sql.query`select dv.TEN,dv.GIA,sd.MANV from sd_dichvu  sd,dichvu dv where sd.MAHD=${item.MA} and dv.MA=sd.MADV`
                    })
                    .then((result) => {
                        t.data=result.recordset
                        return sql.query`select SUM(GIA) as SUM from sd_dichvu where MAHD=${item.MA} `
                    }).then(result=>{
                        t.sum=result.recordset[0].SUM
                        return sql.query`select TILE_GIAMGIA from hoadon where MA=${item.MA} `
                    })
                    .then(result=>{
                        t.tlgg=result.recordset[0].TILE_GIAMGIA
                        t.price=parseInt( t.sum*(100-t.tlgg)/100)
                        tongTien+=t.price
                        var x={
                            info:item,
                            value:t
                        }
                        kq.push(x)
                        myResolve()
                    })
                    .catch(err => {
                        console.log('error', err)
                    }) 

                });
                await myPromise;
            }
            res.render('staff/statistic',{
                kq,
                tongTien,
                tongHD,
                loai:{
                    loai:'nam',
                    giaTri:year
                    
                }
            })
        }
        myDisplay(res.locals.hd)
    })
    .catch((err)=>{
        console.log(err)
    })
}
module.exports.tkTuan=function(req, res, next) {
    
}
module.exports.tkGiua=function(req, res, next) {
    console.log(req.query)//{ month: '2021-04' }
    let{day1,day2}=req.query//
    let d1=func.convertCountTime(day1),d2=func.convertCountTime(day2)
    if(d2>d1 ){

    }else{
        res.cookie('errStaff',[`Nhập thời gian không hợp lê`],{
            maxAge:1000
        })
        res.redirect('/staff/work')
        return
    }
    var kq=[]
    let tongTien=0,tongHD=0//2021-04-25T13:31
    sql.connect(config).then(() => {       //   get id
        return sql.query`select * from hoadon  ORDER BY MA DESC` 
    })
    .then(result => {
        // console.log(result)
        console.log(result.recordset)
        let hds=result.recordset
        let hd=[]
        for(let item of hds){
            let time=item.THOIGIAN.substring(0,10)
            if(d1<=func.convertCountTime(time)&&func.convertCountTime(time)<=d2) hd.push(item)
        }
        tongHD=hd.length
        async function myDisplay(hd){
            for(let item of hd){
                var t={}
                let myPromise = new Promise(function(myResolve, myReject) {
                    sql.connect(config).then(() => {
                        return sql.query`select * from khachhang where MA=${item.MAKHACH}`
                        
                    })
                    .then(result=>{
                        t.user=result.recordset[0]
                        return sql.query`select dv.TEN,dv.GIA,sd.MANV from sd_dichvu  sd,dichvu dv where sd.MAHD=${item.MA} and dv.MA=sd.MADV`
                    })
                    .then((result) => {
                        t.data=result.recordset
                        return sql.query`select SUM(GIA) as SUM from sd_dichvu where MAHD=${item.MA} `
                    }).then(result=>{
                        t.sum=result.recordset[0].SUM
                        return sql.query`select TILE_GIAMGIA from hoadon where MA=${item.MA} `
                    })
                    .then(result=>{
                        t.tlgg=result.recordset[0].TILE_GIAMGIA
                        t.price=parseInt( t.sum*(100-t.tlgg)/100)
                        tongTien+=t.price
                        var x={
                            info:item,
                            value:t
                        }
                        kq.push(x)
                        myResolve()
                    })
                    .catch(err => {
                        console.log('error', err)
                    }) 

                });
                await myPromise;
            }
            res.render('staff/statistic',{
                kq,
                tongTien,
                tongHD,
                loai:{
                    loai:'giua',
                    giaTri:`${func.convertTimeYMD(day1)} đến ${func.convertTimeYMD(day2)}`
                    
                }
            })
        }
        myDisplay(hd)
    })
    .catch((err)=>{
        console.log(err)
    })
}