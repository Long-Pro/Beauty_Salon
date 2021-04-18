var x=document.querySelectorAll('input[type=radio]')
console.log(x)
for(let i=0;i<x.length;i++){
    x[i].onclick=function(e){
        // console.log(e)
        e.target.preventDefault()
        // e.target.checked=!e.target.checked
        // if(x[i].checked) x[i].checked=false;
        console.log()
        // e.preventDefault()
        // if(e.target.checked) e.target.checked=false;
        
    }
}
var y=document.querySelectorAll('input[type=checkbox]')
for(let item of y){
    
}









module.exports.completeOrder2=function(req, res, next){
    console.log(req.body)
    var ma=req.cookies.mkh
        

    var{catTocDV,uonTocDV,nhuomTocDV,khacDV,orderTime}=req.body
    var maxMa,maNext,ma;
    sql.connect(config).then(() => {       //   get id
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
        res.clearCookie('mkh', { })
        res.redirect('/staff/work')
        
    })
    .catch(err => {
        // ... error checks
        console.log(err)
    })



}




