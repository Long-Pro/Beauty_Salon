const sql = require('mssql')
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


module.exports.convertTime =function(time){
    // 2021-04-04T19:12
    var times=time.split('T')

    // var dates=times[0].split('-')
    // var t=dates[1]
    // dates[1]=dates[2]
    // dates[2]=t
    // dates=dates.join('-')
    
    // return times.join(' ');
    return time;

}
module.exports.insertSVDV=function(idHD,maNVK,id){
    sql.connect(config).then(() => {
        return sql.query`select GIA,MA from dichvu where MA = ${id}`
        
    }).then((result) => {
        // console.log(result)
        var {GIA,MA}=result.recordset[0]
        return sql.query`INSERT INTO SD_DICHVU VALUES(${maNext},${maNVK},${khacDV},${GIA})` 
    }).then(result=>{
       console.log('insert success')
    })
    .catch(err => {
        console.log('error', err)
    }) 
}
module.exports.insertSDDV=function(idHD,maNVK,id){
    sql.connect(config).then(() => {
        return sql.query`select GIA,MA from dichvu where MA = ${id}`
        
    }).then((result) => {
        // console.log(result)
        var {GIA,MA}=result.recordset[0]
        return sql.query` INSERT INTO SD_DICHVU VALUES(${idHD},${maNVK},${id},${GIA})` 
    }).then(result=>{
       console.log('insert success')
    })
    .catch(err => {
        console.log('error', err)
    }) 
}

module.exports.selectSDDT=function(item,kq){
    var t={}
    sql.connect(config).then(() => {
        return sql.query`select dv.TEN,dv.GIA from sd_Dichvu_dattruoc sd,dichvu dv where sd.MAHD=${item.MA} and dv.MA=sd.MADV`
        
    }).then((result) => {
        t.data=result.recordset
        return sql.query`select SUM(GIA) as SUM from sd_Dichvu_dattruoc where MAHD=${item.MA} `
    }).then(result=>{
        t.sum=result.recordset[0]
        var x={
            info:item,
            sum:t.sum.SUM,
            data:t.data
        }
        kq.push(x)
        return {
            info:item,
            sum:t.sum.SUM,
            data:t.data
        }
    })
    .catch(err => {
        console.log('error', err)
    }) 
}

module.exports.selectSDHD=function(item,kq){
    var t={}
    sql.connect(config).then(() => {
        return sql.query`select dv.TEN,dv.GIA,sd.MANV from sd_dichvu  sd,dichvu dv where sd.MAHD=${item.MA} and dv.MA=sd.MADV`
        
    }).then((result) => {
        t.data=result.recordset
        console.log(result)
        return sql.query`select SUM(GIA) as SUM from sd_dichvu where MAHD=${item.MA} `
    }).then(result=>{
        t.sum=result.recordset[0]
        var x={
            info:item,
            sum:t.sum.SUM,
            data:t.data
        }
        kq.push(x)
        return {
            info:item,
            sum:t.sum.SUM,
            data:t.data
        }
    })
    .catch(err => {
        console.log('error', err)
    }) 
}
module.exports.findStaff=function(values,dv){
    
    for(var item in values){
        if(Array.isArray(values[item])==false ) if(dv!=values[item]&&values[item].includes(dv)) return values[item].substring(0,5)
    }
    
}
module.exports.findStaffFromArray=function(arr,dv){
    if(dv){
        for(var item in arr){
            if(dv!=item&&arr(dv)) return values[item].substring(0,5)
        }
    }else{

    }
}

module.exports.test=function(time){
    console.log(time)
}