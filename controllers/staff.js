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
    res.clearCookie('guestPN', { })
    res.clearCookie('mkh', { })
    res.clearCookie('userId', { })
    res.render('staff/work',{ 
        errors:errStaff
    })
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
        return sql.query`select * from khachhang where SDT=${req.cookies.guestPN}`
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
    var maxMa,maNext,ma,tlgg,score=0,currScore=0;
    sql.connect(config).then(() => {       //   get id
        return sql.query`select lk.TILE_GIAMGIA  from khachhang kh,loaikhach lk where kh.SDT=${sdt} and kh.MALK=lk.MA` 
    })
    .then(result =>{
        tlgg=result.recordset[0].TILE_GIAMGIA
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
        return         sql.query` INSERT INTO hoadon VALUES(${maNext},${ma},${orderTime},${tlgg})`
    })
    .then(result=>{       
        var values=req.body          //insert SD_DICHVU
        if(catTocDV){
            var maNVCT=func.findStaff(values,values.catTocDV)
            
            sql.connect(config).then(() => {
                return sql.query`select GIA,DIEMCONGTICHLUY  from dichvu where MA = ${catTocDV}`
            }).then(result => {
                var {GIA,DIEMCONGTICHLUY}=result.recordset[0]
                score+=parseInt(DIEMCONGTICHLUY);
                console.log(DIEMCONGTICHLUY)
                sql.query` INSERT INTO SD_DICHVU values(${maNext},${maNVCT},${catTocDV},${GIA})` 
            }).catch(err => {
                
            })
                    
        }
        if(uonTocDV){
            var maNVUT=func.findStaff(values,values.uonTocDV)
            sql.connect(config).then(() => {
                return sql.query`select GIA,DIEMCONGTICHLUY from dichvu where MA = ${uonTocDV}`
            }).then(result => {
                var {GIA,DIEMCONGTICHLUY}=result.recordset[0]
                score+=parseInt(DIEMCONGTICHLUY);
                console.log(DIEMCONGTICHLUY)
                sql.query` INSERT INTO SD_DICHVU VALUES(${maNext},${maNVUT},${uonTocDV},${GIA})` 
            }).catch(err => {
                
            })      
        }
        if(nhuomTocDV){
            var maNVNT=func.findStaff(values,values.nhuomTocDV)
            sql.connect(config).then(() => {
                return sql.query`select GIA,DIEMCONGTICHLUY from dichvu where MA = ${nhuomTocDV}`
            }).then(result => {
                var {GIA,DIEMCONGTICHLUY}=result.recordset[0]
                score+=parseInt(DIEMCONGTICHLUY);
                console.log(DIEMCONGTICHLUY)
                sql.query` INSERT INTO SD_DICHVU VALUES(${maNext},${maNVNT},${nhuomTocDV},${GIA})` 
            }).catch(err => {
                
            }) 
        }
        if(khacDV){
            if(Array.isArray(khacDV) ){
                for(var id of khacDV) {
                    var maNVK=func.findStaff(values,id)
                    sql.connect(config).then(() => {
                        return sql.query`select DIEMCONGTICHLUY from dichvu where MA = ${id}`
                        
                    }).then((result) => {
                        var DIEMCONGTICHLUY=result.recordset[0].DIEMCONGTICHLUY
                        score=score+parseInt(DIEMCONGTICHLUY)

                        
                    })

                    func.insertSDDV(maNext,maNVK,id)
                }
            }
            else {
                var maNVK=func.findStaff(values,values.khacDV)
                sql.connect(config).then(() => {
                    return sql.query`select GIA,MA,DIEMCONGTICHLUY from dichvu where MA = ${khacDV}`
                }).then((result) => {
                    var {GIA,MA,DIEMCONGTICHLUY}=result.recordset[0]
                    score+=parseInt(DIEMCONGTICHLUY);
                    console.log(DIEMCONGTICHLUY)
                    sql.query` INSERT INTO SD_DICHVU VALUES(${maNext},${maNVK},${khacDV},${GIA})` 
                }).catch(err => {
                    
                }) 
                
            }         
        }
        return maNext
    })
    .then((maNext)=>{
        setTimeout(()=>{
            sql.connect(config).then(() => {
                return sql.query`select DIEMTICHLUY from khachhang where SDT=${sdt}`
            }).then((result) => {
               currScore=parseInt(result.recordset[0].DIEMTICHLUY)
               currScore+=score
               if(currScore>=200){
                    sql.query`UPDATE khachhang SET DIEMTICHLUY = ${currScore},MALK='LK4'  where SDT=${sdt}`

               }else if(currScore>=150){
                     sql.query`UPDATE khachhang SET DIEMTICHLUY = ${currScore},MALK='LK3'  where SDT=${sdt}`
               }else if(currScore>=70){
                    sql.query`UPDATE khachhang SET DIEMTICHLUY = ${currScore},MALK='LK2'  where SDT=${sdt}`
               }else if(currScore>=0){
                     sql.query`UPDATE khachhang SET DIEMTICHLUY = ${currScore},MALK='LK1'  where SDT=${sdt}`
               }
                 
            }).catch(err => {
                console.log(err)
            }) 

            console.log('inser thanh cong ')
            res.clearCookie('guestPN', { })
            res.render('staff/work',{ 
        
        })
        },500)
        
        
    })
    .catch(err => {
        // ... error checks
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
        return sql.query` select nv.SDT as sdt from nhanvien nv where nv.SDT=${sdt}`  
    }).then(result => {
        var isSdt=result.recordset.length;       
        if(isSdt){//sdt dax ton tai
            errors.push("Số điện thoại đã tồn tại") 
        }else{
            
        } 
                                            //   validate tai khoan 
        return errors
    })        
    .then(errors =>{
        if(errors.length){//neu co loi
            res.render('user/createAcc',{ 
                errors:errors,
                values:req.body,
            })
        }else{
            sql.connect(config).then(() => {       //   get id
                return sql.query`select max(ma) as ma from nhanvien` 
            }).then(result => {
                if(result.recordset[0].ma){
                    maxMa=result.recordset[0].ma;
                    maNext =maxMa.slice(0,2) +(parseInt(maxMa.slice(2)) +1).toString().padStart(3,0);
                }else{
                    maNext='NV001'
                }
                return maNext
            })       
            .then(maNext=>{                 //insert khach hang
        
                return sql.query` INSERT INTO nhanvien VALUES(${maNext},${fullname},${sdt},${gender},${email},${cmnd},${address})`
                
            })
            .then((result)=>{
                console.log('inser thanh cong ')
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








module.exports.sdthd = function(req, res, next) {
    res.clearCookie('errStaff', { })
    let {sdt}=req.body
    var rePhone = /^\d{10}$/;
    if(!sdt.match(rePhone)){
        res.cookie("errStaff",['Số điện thoại không chính xác'])
            
        res.redirect('/staff/work')

    }else{
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
    
   
}
module.exports.sdtkh = function(req, res, next) {
    res.clearCookie('errStaff', { })
    let {sdt}=req.body
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
            res.redirect('/staff/addGuest')
        }else{//sdt da có
            
            res.cookie('errStaff', ['Số điện thoại đã tồn tại'])
            res.redirect('/staff/work')
        }
    }).catch(err => {
        // ... error checks
    })
   
}
module.exports.mknv = function(req, res, next) {
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
            res.clearCookie('errStaff', { })
            res.redirect('/staff/addStaff')

        }
    }).catch(err => {
        // ... error checks
    })
   
}
module.exports.mhd = function(req, res, next) {
    let {mhd}=req.body
    let kq=[]
    sql.connect(config).then(() => {
        return sql.query`select * from hoadon hd where MA=${mhd}`
    })
    .then(result => {
        // console.log(result)
        if(result.recordset.length==0){// mhd sai
            res.cookie("errStaff",[`Mã hóa đơn ${mhd} không tồn tại`])
            
            res.redirect('/staff/work')        
        }else{//mhd dung
            res.locals.hd=result.recordset
            
            sql.connect(config).then(() => {
                return sql.query`select kh.TEN from khachhang kh,hoadon hd where kh.MA=hd.MAKHACH and hd.MA=${mhd}`
            })
            .then((result) => {
                console.log(result)
                res.locals.ten=result.recordset[0].TEN
                return 1
                
            })
            .then(result=>{
                for(var item of res.locals.hd){
                        
                     func.selectSDHD(item,kq)
                }
                setTimeout(()=>{
                    console.log(kq)
                    res.clearCookie('errStaff', { })
                    res.render('staff/viewBill',{
                        ten:res.locals.ten,
                        kq:kq
                    })
                },500)
            })
            .catch(err => {
                // ... error checks
            })

        }
    })
    
    

   
}
module.exports.khv=function(req, res, next) {
    let {sdt}=req.body
    var kq=[],tam,ma

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
        if(result.recordset.length==0){// sdt k co
            res.cookie('errStaff', [`Số điện thoại ${sdt} không tồn tại`])
            res.redirect('/staff/addGuest')
        }else{//sdt da có
            res.clearCookie('errStaff', { })
            res.cookie('guestPN',sdt);

            ///////////////////////////////////////////////////////////////////////////////////////////
            sql.connect(config).then(() => {       //   get id
                return sql.query`select MA from khachhang where SDT=${sdt}`
                
            })
            .then(result=>{
                ma=result.recordset[0].MA
                return sql.query`select * from hoadon where MAKHACH=${ma} ORDER BY MA DESC;` 
            })
            .then(result => {
                // console.log(result)
                res.locals.mangHD=result.recordset
                
                return result.recordset  
            })
            .then( result=> {
                
                for(var item of result){
                    
                    func.selectSDHD(item,kq)
                }
            })
            .then(()=>{////////////////////////////////////////////////////////////////////////////////////////
                return sql.query`select * from khachhang kh where kh.SDT=${sdt}`
            })
            .then((result) => {
                // console.log(result.recordset[0])
                res.locals.user=result.recordset[0]
                return sql.query` select lk.TENLOAI  from loaikhach as lk, khachhang as kh where kh.SDT=${sdt} and lk.MA=kh.MALK` 
            })
            .then((result) => {

                res.locals.loaiKhach=result.recordset[0]
                return sql.query`select tk.TAIKHOAN  from taikhoan as tk ,khachhang as kh where kh.SDT=${sdt} and tk.MAKH=kh.MA ` 
            })
            .then((result)=>{
                res.locals.taiKhoan=result.recordset[0]
                setTimeout(()=>{
                    res.render('staff/viewGuest',{
                        userId:req.cookies.userId,
                        ...res.locals.user,
                        ...res.locals.loaiKhach,
                        ...res.locals.taiKhoan,
                        kq
                    })
                },500)

            })
            .then(()=>{
                ///////////////////////////////////
                
                
            })

            
        }
    }).catch(err => {
        // ... error checks
    })
    
}
module.exports.khv2=function(req, res, next) {
    console.log(req.body)
    var{fullname,sdt,gender,account,password}=req.body;
    var ma
    sql.connect(config).then(() => {      
        return sql.query` select MA from khachhang where SDT=${req.cookies.guestPN}`  
    })
    .then((result) => { 
        ma=result.recordset[0].MA
        return sql.query` UPDATE KHACHHANG  SET TEN=${fullname}, GIOITINH=${gender} WHERE MA=${ma}`  
    }).then(result => {
        
                                            
        return sql.query`  UPDATE TAIKHOAN  SET MATKHAU=${md5(password)} WHERE MAKH=${ma}`
    }) 
    .then(()=>{
        console.log("update thanh cong")
        res.clearCookie('guestPN', { })
        res.clearCookie('errStaff', { })
        res.redirect('/staff/work')
    })
    .catch(err => {
        console.log("err "+err)
    })
}
module.exports.dt =function(req, res, next) {
    var kq=[]
    sql.connect(config).then(() => {       //   get id
        return sql.query`select * from DATTRUOC where TRANGTHAI=0 ORDER BY MA DESC` 
    })
    .then(result => {
        res.locals.mangHD=result.recordset
        return result.recordset  
    })
    .then( result=> {
        
        for(var item of result){
            func.selectSDDT2(item,kq)
        }
    })
    .catch((err)=>{
        console.log(err)
    })

    setTimeout(()=>{
        
        res.render('staff/guestOrderOnline',{
           
            kq
        })
    },500)
}
module.exports.deleteOrder=function(req, res, next) {
    let ma=req.query.ma
    sql.connect(config).then(() => {       //   validate tai khoan
        return sql.query`  UPDATE DATTRUOC SET TRANGTHAI=2 WHERE MA=${ma}`

    }).then(result => {
        console.log(`Hủy đặt trước đơn hàng mã ${ma} thành công`)
        
    })        
    .catch(err => {
        console.log("err "+err)
    })
    res.redirect('/staff/work/dt')
}
module.exports.completeOrder=function(req, res, next) {
    let ma=req.query.ma,data,info,kq=[],user




    sql.connect(config).then(() => {       //   
        return sql.query`  select * from dattruoc dt where MA=${ma}`

    }).then(result => {
        info=result.recordset[0]
        // console.log(info)
        return sql.query`select * from khachhang kh where kh.MA=${info.MAKHACH}`
    })    
    .then(result => {
        user=result.recordset[0];
        res.cookie("mkh",user.MA)
        return sql.query`select * from loaikhach where MA=${user.MALK}`
    })   
    .then(result =>{
        res.locals.tlgg=result.recordset[0].TILE_GIAMGIA
        return sql.query`select * from sd_Dichvu_dattruoc sd where MAHD=${ma}`
    })  
    .then(result => {
        data=result.recordset
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
        return sql.query` select MA  from Nhanvien`
    }) 
    .then(result=>{
        res.locals.nvs=result.recordset

        for(let item of data){
            func.selectInfoDV(item,kq)
        } 
    })
    .then(result=>{

    })
    .catch(err => {
        console.log("err "+err)
    })
    setTimeout(()=>{
        console.log({
            info,
            data,
            user,
            kq
        })
        
        res.render('staff/completeOrder',{
            info,
            data,
            user,
            kq
          })
    },500)
}
module.exports.completeOrder2=function(req, res, next){
    console.log(req.body)
    
        
    var mkh=req.cookies.mkh
    var{catTocDV,uonTocDV,nhuomTocDV,khacDV,orderTime}=req.body
    var sdt=req.cookies.guestPN;
    var maxMa,maNext,ma,tlgg,score=0,currScore=0;
    sql.connect(config).then(() => {       //   get id
        return sql.query`select lk.TILE_GIAMGIA  from khachhang kh,loaikhach lk where kh.MA=${mkh} and kh.MALK=lk.MA` 
    })
    .then(result =>{
        tlgg=result.recordset[0].TILE_GIAMGIA
        return sql.query`select MA as ma from khachhang kh where kh.MA=${mkh}` 
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
        return         sql.query` INSERT INTO hoadon VALUES(${maNext},${ma},${orderTime},${tlgg})`
    })
    .then(result=>{       
        var values=req.body          //insert SD_DICHVU
        if(catTocDV){
            var maNVCT=func.findStaff(values,values.catTocDV)
            
            sql.connect(config).then(() => {
                return sql.query`select GIA,DIEMCONGTICHLUY  from dichvu where MA = ${catTocDV}`
            }).then(result => {
                var {GIA,DIEMCONGTICHLUY}=result.recordset[0]
                score+=parseInt(DIEMCONGTICHLUY);
                console.log(DIEMCONGTICHLUY)
                sql.query` INSERT INTO SD_DICHVU values(${maNext},${maNVCT},${catTocDV},${GIA})` 
            }).catch(err => {
                
            })
                    
        }
        if(uonTocDV){
            var maNVUT=func.findStaff(values,values.uonTocDV)
            sql.connect(config).then(() => {
                return sql.query`select GIA,DIEMCONGTICHLUY from dichvu where MA = ${uonTocDV}`
            }).then(result => {
                var {GIA,DIEMCONGTICHLUY}=result.recordset[0]
                score+=parseInt(DIEMCONGTICHLUY);
                console.log(DIEMCONGTICHLUY)
                sql.query` INSERT INTO SD_DICHVU VALUES(${maNext},${maNVUT},${uonTocDV},${GIA})` 
            }).catch(err => {
                
            })      
        }
        if(nhuomTocDV){
            var maNVNT=func.findStaff(values,values.nhuomTocDV)
            sql.connect(config).then(() => {
                return sql.query`select GIA,DIEMCONGTICHLUY from dichvu where MA = ${nhuomTocDV}`
            }).then(result => {
                var {GIA,DIEMCONGTICHLUY}=result.recordset[0]
                score+=parseInt(DIEMCONGTICHLUY);
                console.log(DIEMCONGTICHLUY)
                sql.query` INSERT INTO SD_DICHVU VALUES(${maNext},${maNVNT},${nhuomTocDV},${GIA})` 
            }).catch(err => {
                
            }) 
        }
        if(khacDV){
            if(Array.isArray(khacDV) ){
                for(var id of khacDV) {
                    var maNVK=func.findStaff(values,id)
                    sql.connect(config).then(() => {
                        return sql.query`select DIEMCONGTICHLUY from dichvu where MA = ${id}`
                        
                    }).then((result) => {
                        var DIEMCONGTICHLUY=result.recordset[0].DIEMCONGTICHLUY
                        score=score+parseInt(DIEMCONGTICHLUY)

                        
                    })

                    func.insertSDDV(maNext,maNVK,id)
                }
            }
            else {
                var maNVK=func.findStaff(values,values.khacDV)
                sql.connect(config).then(() => {
                    return sql.query`select GIA,MA,DIEMCONGTICHLUY from dichvu where MA = ${khacDV}`
                }).then((result) => {
                    var {GIA,MA,DIEMCONGTICHLUY}=result.recordset[0]
                    score+=parseInt(DIEMCONGTICHLUY);
                    console.log(DIEMCONGTICHLUY)
                    sql.query` INSERT INTO SD_DICHVU VALUES(${maNext},${maNVK},${khacDV},${GIA})` 
                }).catch(err => {
                    
                }) 
                
            }         
        }
        return maNext
    })
    .then((maNext)=>{
        setTimeout(()=>{
            sql.connect(config).then(() => {
                return sql.query`select DIEMTICHLUY from khachhang where MA=${mkh}`
            }).then((result) => {
               currScore=parseInt(result.recordset[0].DIEMTICHLUY)
               currScore+=score
               if(currScore>=200){
                    sql.query`UPDATE khachhang SET DIEMTICHLUY = ${currScore},MALK='LK4'  where MA=${mkh}`

               }else if(currScore>=150){
                     sql.query`UPDATE khachhang SET DIEMTICHLUY = ${currScore},MALK='LK3'  where MA=${mkh}`
               }else if(currScore>=70){
                    sql.query`UPDATE khachhang SET DIEMTICHLUY = ${currScore},MALK='LK2'  where MA=${mkh}`
               }else if(currScore>=0){
                     sql.query`UPDATE khachhang SET DIEMTICHLUY = ${currScore},MALK='LK1'  where MA=${mkh}`
               }
                 
            }).catch(err => {
                console.log(err)
            }) 

            console.log('inser thanh cong ')
            res.clearCookie('guestPN', { })
            res.render('staff/work',{ 
        
        })
        },500)
        
        
    })
    .catch(err => {
        // ... error checks
        console.log(err)
    })

}