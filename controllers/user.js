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
        res.render('user/createAcc',{
            userId:req.cookies.userId
          })
    }
    createAcc2(req, res){      
        var{fullname,sdt,gender,account,password}=req.body;
        var errors=[];
        var maxMa,maNext;


        sql.connect(config).then(() => {       //   validate sdt
            return sql.query` select kh.SDT as sdt from khachhang as kh where kh.SDT=${sdt}`  
        }).then(result => {
            var isSdt=result.recordset.length;       
            if(isSdt){//sdt dax ton tai
                errors.push("Số điện thoại đã tồn tại") 
                console.log("sdt "+errors) 
            }else{
                
            } 
                                                //   validate tai khoan 
            return sql.query`  select tk.TAIKHOAN as acc from taikhoan as tk where tk.TAIKHOAN=${account}`
        })        
        .then(result => {
            var isAcc=result.recordset.length;   
            if(isAcc){
                errors.push("Tài khoản đã tồn tại")   
                console.log("taikhoan "+errors)            
            }else{

            }
            return errors;
        })
        .then(errors =>{
            if(errors.length){//neu co loi
                res.render('user/createAcc',{ 
                    errors:errors,
                    values:req.body,
                    userId:req.cookies.userId
                })

            }else{
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
                .then(maNext=>{                 //insert tai khoan
                    password=md5(password)
                    sql.query` INSERT INTO taikhoan VALUES(${maNext},${account},${password})`
                    return maNext
                })
                .then((maNext)=>{
                    res.cookie("userId",maNext)
                    console.log('inser thanh cong ')
                    res.redirect('/')
                    
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

    loginAcc(req, res) {
        res.render('user/loginAcc',{
            userId:req.cookies.userId
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
            // console.log(result.recordset[0])
            res.locals.user=result.recordset[0]
            return sql.query` select lk.TENLOAI  from loaikhach as lk, khachhang as kh where kh.MA=${req.cookies.userId} and lk.MA=kh.MALK` 
        })
        .then((result) => {
            // res.send(result.recordset[0])
            // console.log(res.locals.user)
            res.locals.loaiKhach=result.recordset[0]
            return sql.query`select tk.TAIKHOAN  from taikhoan as tk ,khachhang as kh where kh.MA=${req.cookies.userId} and tk.MAKH=kh.MA ` 
        })
        .then((result)=>{
            res.locals.taiKhoan=result.recordset[0]
            res.render('user/userDetail',{
                    userId:req.cookies.userId,
                    ...res.locals.user,
                    ...res.locals.loaiKhach,
                    ...res.locals.taiKhoan
                
            })
            console.log({
                userId:req.cookies.userId,
                    ...res.locals.user,
                    ...res.locals.loaiKhach,
                    ...res.locals.taiKhoan
            })
            
        })

    }
    userDetail2(req,res){
        console.log(req.body)
        var{fullname,sdt,gender,account,password}=req.body;
        var errors=[];



        sql.connect(config).then(() => {      
            return sql.query` UPDATE KHACHHANG  SET TEN=${fullname}, GIOITINH=${gender} WHERE MA=${req.cookies.userId}`  
        }).then(result => {
            
                                               
            return sql.query`  UPDATE TAIKHOAN  SET MATKHAU=${md5(password)} WHERE MAKH=${req.cookies.userId}`
        }) 
        .then(()=>{
            console.log("update thanh cong")
            res.render('index',{
                userId: req.body.userId
            })
        })
        .catch(err => {
            console.log("err "+err)
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
            return res.locals
        }) 
        .then(result=>{
            res.render('user/userOrder',{
                userId:req.cookies.userId,
                ...result
              })
        })
        .catch(err => {
            console.log("err "+err)
        })
       
    }
    userOrder2(req,res){
        console.log(req.body)
        

        var{catTocDV,uonTocDV,nhuomTocDV,khacDV,orderTime}=req.body
        var maxMa,maNext;
        sql.connect(config).then(() => {       //   get id
            return sql.query`select max(ma) as ma from DATTRUOC` 
        }).then(result => {
            if(result.recordset[0].ma){
                maxMa=result.recordset[0].ma;
                maNext =maxMa.slice(0,2) +(parseInt(maxMa.slice(2)) +1).toString().padStart(8,0);
            }else{
                maNext='DT00000001'
            }
            return maNext
        })       
        .then(maNext=>{                 //insert DATTRUOC
            // var time2=func.convertTime(orderTime)
            sql.query` INSERT INTO DATTRUOC VALUES(${maNext},${req.cookies.userId},${orderTime},0)`
            return maNext
        })
        .then(maNext=>{                 //insert SD_DICHVU_DATTRUOC
            if(catTocDV){
                sql.connect(config).then(() => {
                    return sql.query`select GIA from dichvu where MA = ${catTocDV}`
                }).then(result => {
                    var {GIA}=result.recordset[0]
                    sql.query` INSERT INTO SD_DICHVU_DATTRUOC VALUES(${maNext},${catTocDV},${GIA})` 
                }).catch(err => {
                    
                })
                      
            }
            if(uonTocDV){
                sql.connect(config).then(() => {
                    return sql.query`select GIA from dichvu where MA = ${uonTocDV}`
                }).then(result => {
                    var {GIA}=result.recordset[0]
                    sql.query` INSERT INTO SD_DICHVU_DATTRUOC VALUES(${maNext},${uonTocDV},${GIA})` 
                }).catch(err => {
                    
                })      
            }
            if(nhuomTocDV){
                sql.connect(config).then(() => {
                    return sql.query`select GIA from dichvu where MA = ${nhuomTocDV}`
                }).then(result => {
                    var {GIA}=result.recordset[0]
                    sql.query` INSERT INTO SD_DICHVU_DATTRUOC VALUES(${maNext},${nhuomTocDV},${GIA})` 
                }).catch(err => {
                    
                }) 
            }
            if(khacDV){
                // console.log(khacDV)
                if(Array.isArray(khacDV) ){
                    for(var id of khacDV) {
                        func.insertSVDV(maNext,id)
                    }
                }
                else {
                    sql.connect(config).then(() => {
                        return sql.query`select GIA,MA from dichvu where MA = ${khacDV}`
                    }).then((result) => {
                        var {GIA,MA}=result.recordset[0]
                        sql.query` INSERT INTO SD_DICHVU_DATTRUOC VALUES(${maNext},${MA},${GIA})` 
                    }).catch(err => {
                        
                    }) 
                    
                }         
            }
            return maNext
        })
        .then((maNext)=>{
            console.log('inser thanh cong ')
            res.redirect('/')
            
        })
        .catch(err => {
            // ... error checks
            console.log(err)
        })

    }
    userOrderOnline(req, res){
        var kq=[]
        sql.connect(config).then(() => {       //   get id
            return sql.query`select * from DATTRUOC where MAKHACH=${req.cookies.userId}` 
        })
        .then(result => {
            // console.log(result)
            res.locals.mangHD=result.recordset
            return result.recordset  
        })
        .then( result=> {
            
            for(var item of result){
                func.selectSDDT(item,kq)
            }
        })
        .catch((err)=>{
            console.log(err)
        })

        setTimeout(()=>{
            console.log('#3333333333',kq)
            res.render('user/userOrderOnline',{
                userId:req.cookies.userId,
                kq
            })
        },1000)



        
    }
    userOrderHistory(req, res){
        var kq=[]
        sql.connect(config).then(() => {       //   get id
            return sql.query`select * from hoadon where MAKHACH=${req.cookies.userId} ORDER BY MA DESC;` 
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
        .catch((err)=>{
            console.log(err)
        })

        setTimeout(()=>{
            console.log(kq)
            res.render('user/userOrderHistory',{
                userId:req.cookies.userId,
                kq
            })
        },2000)

    }
    deleteOrder(req, res){
        let ma=req.query.ma
        sql.connect(config).then(() => {       //   validate tai khoan
            return sql.query`  UPDATE DATTRUOC SET TRANGTHAI=2 WHERE MA=${ma}`
 
        }).then(result => {
            console.log(`Hủy đặt trước đơn hàng mã ${ma} thành công`)
            
        })        
        .catch(err => {
            console.log("err "+err)
        })
        res.redirect('/user/userOrderOnline')
        
    }
    
}

module.exports = new User