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
        res.clearCookie('succStaff', { })
        res.cookie("succStaff",[`Thêm khách hàng ${sdt} thành công`])
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
        res.cookie("succStaff",['Thêm hóa đơn thành công'])
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
    var{fullname,sdt,gender,email,cmnd,address}=req.body;
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
                // if(result.recordset[0].ma){
                //     maxMa=result.recordset[0].ma;
                //     maNext =maxMa.slice(0,2) +(parseInt(maxMa.slice(2)) +1).toString().padStart(3,0);
                // }else{
                //     maNext='NV001'
                // }
                // return maNext
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
        
                return sql.query` INSERT INTO nhanvien VALUES(${maNext},${fullname},${sdt},${gender},${email},${cmnd},${address},1)`
                
            })
            .then((result)=>{
                console.log('inser thanh cong ')
                res.cookie('succStaff',[`Thêm nhân viên thần công`])
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





module.exports.thd = function(req, res, next) {
    res.clearCookie('errStaff', { })
    res.clearCookie('succStaff', { })
    let {value,filter}=req.body
    console.log(req.body)
    console.log(value,filter)
    var rePhone = /^\d{10}$/;
    let ma
    if(!value.match(rePhone)&&filter=='SDT'){
        res.cookie("errStaff",['Số điện thoại không chính xác']) 
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
            res.cookie("errStaff",[`Không tồn tại khách hàng có ${filter} là ${value}`])
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
        res.cookie("errStaff",['Số điện thoại không chính xác'])
            
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
            res.cookie('errStaff', ['Số điện thoại đã tồn tại'])
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
            res.cookie("errStaff",[`Mã hóa đơn ${mhd} không tồn tại`])
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

//tckh nên có tinh nag thay doi sdt              00000000000000000000000000000000000000000000000000000000000000000000000000000
module.exports.tckh=function(req, res, next) {
    res.clearCookie('errStaff', { })
    res.clearCookie('succStaff', { })
    let {value,filter}=req.body
    console.log(req.body)

    var rePhone = /^\d{10}$/;
    let kq=[],tam,ma
    if(!value.match(rePhone)&&filter=='SDT'){
        res.cookie("errStaff",['Số điện thoại không chính xác']) 
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
            res.cookie("errStaff",[`Không tồn tại khách hàng có ${filter} là ${value}`])
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
    sql.connect(config).then(() => {      
        return sql.query` UPDATE KHACHHANG  SET TEN=${fullname}, GIOITINH=${gender} WHERE MA=${ma}`  
    })
    .then(()=>{
        console.log("update thanh cong")
        res.clearCookie('guestId', { })
        res.clearCookie('errStaff', { })
        res.cookie("succStaff",[`Lưu thay đổi thông tin khách hàng ${ma} thành công`])
        res.redirect('/staff/work')
    })
    .catch(err => {
        console.log("err "+err)
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
        console.log(`Hủy đặt trước đơn hàng mã ${ma} thành công`)
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
        res.cookie("succStaff",['Thêm hóa đơn thành công'])
        res.redirect('/staff/work')
    })
    
}
    



// xoa diem tich luy kh
module.exports.xhd = function(req, res, next) {
    res.clearCookie('errStaff', { })
    res.clearCookie('succStaff', { })

    let {mhd,password}=req.body
    sql.connect(config).then(() => {
        return sql.query`select * from password pass where MA=${md5(password)}`
    })
    .then(result=>{
        if(result.recordset.length==0){// mk sai
            res.cookie("errStaff",['Mật khẩu không chính xác'])
            
            res.redirect('/staff/work')
            
        }else{//mk dung
            sql.connect(config).then(() => {
                return sql.query`select * from hoadon hd where MA=${mhd}`
            })
            .then(result =>{
                if(result.recordset.length==0){// mhd sai
                    res.cookie("errStaff",[`Mã hóa đơn ${mhd} không tồn tại`])   
                    res.redirect('/staff/work')        
                }else{//mhd dung        
                    sql.connect(config).then(() => {
                        return sql.query`delete from SD_DICHVU where MAHD=${mhd}`
                    })
                    .then(result => {
                        return sql.query`delete from hoadon where MA=${mhd}`
                    })
                    .then((result) => {
                        res.cookie("succStaff",[`Hóa đơn ${mhd} đã xóa`])
                        res.clearCookie('errStaff', { })
                        res.redirect('/staff/work')
                    })
                    .catch(err => {
                        console.log(err)
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
            res.cookie("errStaff",['Mật khẩu không chính xác'])   
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
    let {value,filter}=req.body
    console.log(req.body)

    var rePhone = /^\d{10}$/;
    let kq=[],tam,ma
    if(!value.match(rePhone)&&filter=='SDT'){
        res.cookie("errStaff",['Số điện thoại không chính xác']) 
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
        else if(filter=='CMND'){
            return sql.query`select * from nhanvien  where CMND=${value}`
        }   
    }).then(result => {
        if(result.recordset.length==0){// nhan vien k co
            res.cookie("errStaff",[`Không tồn tại nhân viên có ${filter} là ${value}`])
            res.redirect('/staff/work')
        }else{//nhan vien da co
           res.locals.staff=result.recordset[0]
           res.render('staff/viewStaff')
        }
    })
    .catch(err=>{

    })  
   
}