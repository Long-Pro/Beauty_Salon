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


class User{
    createAcc(req, res){
        res.clearCookie('sdtDK', { })
        let sdt=req.query.sdt
        console.log(req.query.sdt)
        sql.connect(config).then(() => {       //   validate sdt
            return sql.query` select * from khachhang as kh where kh.SDT=${sdt}`  
        })
        .then(result=>{
            if(result.recordset.length==0){//sdt chua tont tai
                // console.log(sdt+' k ton tai'),
                
                res.locals.values={}
                res.locals.values.sdt=sdt
                res.cookie('sdtDK',sdt)
                res.render('user/createAcc',{
                    userId:req.cookies.userId
                })
            }else{//sdt da ton tai
                let user=result.recordset[0]
                
                res.locals.values={}
                res.locals.values.ma=user.MA
                res.locals.values={}
                res.locals.values.fullname=user.TEN
                res.locals.values.sdt=user.SDT
                res.locals.values.gender=user.GIOITINH

                sql.connect(config).then(() => {       //   validate sdt
                    return sql.query` select tk.* from taikhoan tk, khachhang kh where kh.SDT=${sdt} and kh.MA=tk.MAKH`  
                })
                .then(result =>{
                    if(result.recordset.length==0){// co sdt, k co tk
                        res.cookie('idDK',user.MA)
                        res.cookie('sdtDK',sdt)

                        
                        res.render('user/createAcc',{
                            userId:req.cookies.userId,
                        })
                    }else{//co sdt, co tk
                        res.cookie('sdtDK',sdt,
                            {
                                maxAge:1000
                            }
                        )
                        res.redirect('/user/loginAcc')

                    }
                })
            }
        })

        
    }
    createAcc2(req, res){      
        var{fullname,gender,account,password}=req.body;
        let sdt=req.cookies.sdtDK
        let mkh=req.cookies.idDK
        var errors=[];
        var maxMa,maNext;
        if(mkh){//co sdt,k tk
            sql.connect(config).then(() => {       //   validate sdt
                return sql.query` select * from taikhoan where TAIKHOAN=${account}`  
            })
            .then(result=>{
                if(result.recordset.length==0){//tk hop le
                    sql.connect(config).then(() => {       //   validate sdt
                        let newPass=md5(password)
                        sql.query` INSERT INTO taikhoan VALUES(${mkh},${account},${newPass})` 
                    })
                    .then(result=>{
                        sql.query` update khachhang set TEN=${fullname}, GIOITINH=${gender} where MA=${mkh}`
                    })
                    .then(result=>{
                        res.cookie("userId",mkh)
                        res.clearCookie('sdtDK', { })
                        res.clearCookie('idDK', { })

                        console.log('inser thanh cong ')
                        res.redirect('/')
                    })
                    
                }else{//tk k hop le
                    errors.push(`Tài khoản ${account} đã tồn tại`)
                    let values=req.body
                    values.sdt=sdt 
                    res.render('user/createAcc',{ 
                        errors:errors,
                        values,
                        userId:req.cookies.userId
                    })
                }
            })

        }else{//k co sdt,k co tk
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
                return sql.query` INSERT INTO KHACHHANG VALUES(${maNext},${fullname},${sdt},${gender},'LK1',0)`
            })       
            .then(result=>{                 //insert tai khoan
                let newPassword=md5(password)
                return sql.query` INSERT INTO taikhoan VALUES(${maNext},${account},${newPassword})`
            })
            .then((result)=>{
                res.cookie("userId",maNext)
                res.clearCookie('sdtDK', { })
                res.clearCookie('idDK', { })

                console.log('inser thanh cong ')
                res.redirect('/')
                
            })
        }


        

  
    }

    loginAcc(req, res) {
        let errors=[]
        if(req.cookies.sdtDK) errors.push(`Số điện thoại ${req.cookies.sdtDK} thuộc khách hàng khác` )
        res.render('user/loginAcc',{
            errors
          })
    }
    loginAcc2(req, res){
        var{account,password}=req.body;
        var errors=[];

        sql.connect(config).then(() => {       //   validate tai khoan
            return sql.query`  select tk.makh as ma from taikhoan as tk where tk.TAIKHOAN=${account}`
 
        }).then(result => {
            var makh;
            // res.send(result)
            var isAcc=result.recordset.length;   
            if(isAcc){// neu tk ton tai
                makh=result.recordset[0].ma 
            }else{
                errors.push("Tài khoản chưa tồn tại") 
                console.log("taikhoan "+errors) 
            }
            return {
                errors,
                makh
            }
            
        })        
        .then(({errors,makh}) => {
            if(makh){// neu co makh
                var passConvert=md5(password)
                

                sql.connect(config).then(() => {       //   get pass
                    return sql.query`select tk.MATKHAU as mk from taikhoan as tk where tk.MATKHAU=${passConvert} and tk.makh=${makh}` 
                }).then(result => {
                    if(result.recordset.length){//neu pass ton tai
                        res.cookie('userId',makh)
                        console.log(req.cookies)
                        
                        res.redirect('/')
                    }else{
                        errors.push("Mật khẩu không chính xác")
                        res.render('user/loginAcc',{
                            errors,
                            values:req.body, 
                            userId:req.cookies.userId
                        })
                    }  
                })    
                .catch(err => {
                    // ... error checks
                    console.log(err)
                })
            }else{
                res.render('user/loginAcc',{ 
                    errors,
                    values:req.body, 
                    userId:req.cookies.userId
                })
            }  
        })
        .catch(err => {
            console.log("err "+err)
        })
    }
    userLogout(req,res){
        res.clearCookie('userId', { })

        res.redirect('/')
    }
    userDetail(req,res){
        sql.connect(config).then(() => {       //   validate sdt
            return sql.query` select *  from khachhang as kh where kh.MA=${req.cookies.userId}`  
        })
        .then((result) => {
            res.locals.user=result.recordset[0]
            return sql.query` select lk.TENLOAI  from loaikhach as lk, khachhang as kh where kh.MA=${req.cookies.userId} and lk.MA=kh.MALK` 
        })
        .then((result) => {
            res.locals.loaiKhach=result.recordset[0].TENLOAI
            return sql.query`select tk.TAIKHOAN  from taikhoan as tk ,khachhang as kh where kh.MA=${req.cookies.userId} and tk.MAKH=kh.MA ` 
        })
        .then((result)=>{
            res.locals.taiKhoan=result.recordset[0].TAIKHOAN
            res.render('user/userDetail',{
                    userId:req.cookies.userId,
            })
            console.log(res.locals)
        })

    }
    userDetail2(req,res){
        console.log(req.body)
        var{fullname,sdt,gender,account,password}=req.body;
        var errors=[];

        sql.connect(config).then(() => {      
            return sql.query` select SDT from khachhang WHERE MA!=${req.cookies.userId} and SDT=${sdt}`
        })
        .then(result=>{
            if(result.recordset.length==0){// sdt moi hợp lệ
                sql.connect(config).then(() => {      
                    return sql.query` UPDATE KHACHHANG  SET TEN=${fullname}, GIOITINH=${gender},SDT=${sdt} WHERE MA=${req.cookies.userId}`
                })
                .then(result => {                           
                    return sql.query`  UPDATE TAIKHOAN  SET MATKHAU=${md5(password)} WHERE MAKH=${req.cookies.userId}`
                }) 
                .then((result)=>{
                    console.log("update thanh cong")
                    return sql.query` select *  from khachhang as kh where kh.MA=${req.cookies.userId}`
                })
                .then((result) => {
                    res.locals.user=result.recordset[0]
                    return sql.query` select lk.TENLOAI  from loaikhach as lk, khachhang as kh where kh.MA=${req.cookies.userId} and lk.MA=kh.MALK` 
                })
                .then((result) => {
                    res.locals.loaiKhach=result.recordset[0].TENLOAI
                    return sql.query`select tk.TAIKHOAN  from taikhoan as tk ,khachhang as kh where kh.MA=${req.cookies.userId} and tk.MAKH=kh.MA ` 
                })
                .then((result)=>{
                    res.locals.taiKhoan=result.recordset[0].TAIKHOAN
                    res.render('user/userDetail',{
                            userId:req.cookies.userId, 
                            success:[`Chỉnh sửa thông tin thành công`]
                    })
                })
            }else{// sdt mới k hợp lệ
                sql.connect(config).then(() => {       //   validate sdt
                    return sql.query` select *  from khachhang as kh where kh.MA=${req.cookies.userId}`  
                })
                .then((result) => {
                    res.locals.user=result.recordset[0]
                    res.locals.user.SDT=sdt
                    return sql.query` select lk.TENLOAI  from loaikhach as lk, khachhang as kh where kh.MA=${req.cookies.userId} and lk.MA=kh.MALK` 
                })
                .then((result) => {
                    res.locals.loaiKhach=result.recordset[0].TENLOAI
                    return sql.query`select tk.TAIKHOAN  from taikhoan as tk ,khachhang as kh where kh.MA=${req.cookies.userId} and tk.MAKH=kh.MA ` 
                })
                .then((result)=>{
                    res.locals.taiKhoan=result.recordset[0].TAIKHOAN
                    res.render('user/userDetail',{
                            userId:req.cookies.userId,
                            errors:[`Số điện thoại ${sdt} đã tồn tại`]
                    })
                })

            }
            
        })
        
       
    }
    userOrder(req,res){
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
            return sql.query` select * from khachhang   where MA=${req.cookies.userId}`
        }) 
        .then(result=>{
            res.locals.user=result.recordset[0]
            return sql.query` select TILE_GIAMGIA from loaikhach lk,khachhang kh  where kh.MA=${req.cookies.userId} and kh.MALK=lk.MA`
        })
        .then(result=>{
            res.locals.tlgg=result.recordset[0].TILE_GIAMGIA
            res.render('user/userOrder',{
                userId:req.cookies.userId,
              })
        })
        .catch(err => {
            console.log("err "+err)
        })
       
    }
    userOrder2(req,res){
        var{catTocDV,uonTocDV,nhuomTocDV,khacDV,orderTime}=req.body
        console.log(req.body)
        var values=req.body   
        var mkh=req.cookies.userId;
        var maxMa,maNext,tlgg
        console.log(mkh)

        sql.connect(config).then(() => {       //   get id
            return sql.query`select max(ma) as ma from DATTRUOC` 
        })
        .then(result => {
            if(result.recordset[0].ma){
                maxMa=result.recordset[0].ma;
                maNext =maxMa.slice(0,2) +(parseInt(maxMa.slice(2)) +1).toString().padStart(8,0);
            }else{
                maNext='DT00000001'
            }
            return maNext
        })       
        .then(maNext=>{                 //insert HOADON
            return   sql.query` INSERT INTO DATTRUOC VALUES(${maNext},${mkh},${orderTime},0)`
        })
        .then(result=>{                 //insert SD_DICHVU_datTruoc             
            async function myPromiseAdd() {
                let myPromiseCT = new Promise(function(myResolve, myReject) {
                    sql.connect(config).then(() => {
                        return sql.query`select GIA,DIEMCONGTICHLUY  from dichvu where MA = ${catTocDV}`
                    }).then(result => {
                        var {
                            GIA,
                            DIEMCONGTICHLUY
                        } = result.recordset[0]
                        
                        return sql.query` INSERT INTO SD_DICHVU_DATTRUOC values(${maNext},${catTocDV},${GIA})`
                    })
                    .then(result => {
                        myResolve()
                    })
                    .catch(err => {

                    })
        
                });
                let myPromiseUT = new Promise(function(myResolve, myReject) {
                    sql.connect(config).then(() => {
                        return sql.query`select GIA,DIEMCONGTICHLUY from dichvu where MA = ${uonTocDV}`
                    }).then(result => {
                        var {GIA,DIEMCONGTICHLUY}=result.recordset[0]
                        return sql.query` INSERT INTO SD_DICHVU_DATTRUOC VALUES(${maNext},${uonTocDV},${GIA})` 
                    })
                    .then((result)=>{
                        myResolve()
                    })
                    .catch(err => {
                        
                    })  
        
                });
                let myPromiseNT = new Promise(function(myResolve, myReject) {
                    sql.connect(config).then(() => {
                        return sql.query`select GIA,DIEMCONGTICHLUY from dichvu where MA = ${nhuomTocDV}`
                    }).then(result => {
                        var {GIA,DIEMCONGTICHLUY}=result.recordset[0]
                        return sql.query` INSERT INTO SD_DICHVU_DATTRUOC VALUES(${maNext},${nhuomTocDV},${GIA})` 
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
                                    sql.connect(config).then(() => {
                                        return sql.query`select DIEMCONGTICHLUY,GIA from dichvu where MA = ${id}`
                                    }).then((result) => {
                                        var {GIA,DIEMCONGTICHLUY}=result.recordset[0]
                                        return sql.query` INSERT INTO SD_DICHVU_DATTRUOC VALUES(${maNext},${id},${GIA})` 
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
                                sql.connect(config).then(() => {
                                    return sql.query`select GIA,MA,DIEMCONGTICHLUY from dichvu where MA = ${khacDV}`
                                }).then((result) => {
                                    var {GIA,MA,DIEMCONGTICHLUY}=result.recordset[0]
                                    sql.query` INSERT INTO SD_DICHVU_DATTRUOC VALUES(${maNext},${khacDV},${GIA})` 
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
            }
            myPromiseAdd()  
        })
        .then(result=>{
            console.log('inser thanh cong ')

            res.redirect('/')
        })
        .catch(err => {
            console.log(err)
        })
    }
    userOrderOnline(req, res){
        var kq=[]
        let mkh=req.cookies.userId
        sql.connect(config).then(() => {       //   get id
            return sql.query`select * from DATTRUOC where MAKHACH=${req.cookies.userId} ORDER BY MA DESC`
        })
        .then( result=> {
            res.locals.hddt=result.recordset
            async function datTruoc(){
                for(let item of res.locals.hddt){//Dd
                    let myPromise = new Promise(function(myResolve, myReject) {
                        let t={}
                        sql.connect(config).then(() => {
                            return sql.query`select dv.TEN,dv.GIA from sd_Dichvu_dattruoc sd,dichvu dv where sd.MAHD=${item.MA} and dv.MA=sd.MADV` 
                        }).then((result) => {
                            t.data=result.recordset
                            return sql.query`select SUM(GIA) as SUM from sd_Dichvu_dattruoc where MAHD=${item.MA} `
                        }).then(result=>{
                            t.sum=result.recordset[0]
                            return sql.query`select TILE_GIAMGIA from loaikhach lk,khachhang kh where kh.MA=${req.cookies.userId} and kh.MALK=lk.MA`
                            
                            
                        })    
                        .then(result=>{
                            t.tlgg=result.recordset[0].TILE_GIAMGIA
                            var x={
                                info:item,
                                sum:t.sum.SUM,
                                data:t.data,
                                tlgg:t.tlgg
                            }
                            kq.push(x)
                            myResolve()
                        }) 

                    });
                    await myPromise;
                }
                res.render('user/userOrderOnline',{
                    userId:req.cookies.userId,
                    kq:kq
                }) 
            }
            datTruoc()
        })
        .catch((err)=>{
            console.log(err)
        })  
    }
    userOrderHistory(req, res){
        let mkh=req.cookies.userId
        var kq=[]
        sql.connect(config).then(() => {       //   get id
            return sql.query`select * from hoadon where MAKHACH=${mkh} ORDER BY MA DESC;` 
        })
        .then(result => {
            // console.log(result)
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
                console.log({
                    user:res.locals.user,
                    loaiKhach:res.locals.loaiKhach,
                    hd:res.locals.hd,
                    taiKhoan:res.locals.taiKhoan,


                })

                res.render('user/userOrderHistory',{
                    userId:req.cookies.userId,
                    kq:kq
                })
            }
            myDisplay()
        })
        .catch((err)=>{
            console.log(err)
        })

    }
    deleteOrder(req, res){
        let ma=req.query.ma
        sql.connect(config).then(() => {       //   validate tai khoan
            return sql.query`  UPDATE DATTRUOC SET TRANGTHAI=1 WHERE MA=${ma}`
 
        }).then(result => {
            console.log(`Hủy đặt trước đơn hàng mã ${ma} thành công`)
            res.redirect('/user/userOrderOnline')
        })        
        .catch(err => {
            console.log("err "+err)
        })
        
        
    }
    
}

module.exports = new User