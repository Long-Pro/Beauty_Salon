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
module.exports.insertSVDV=function(idHD,id){
    sql.connect(config).then(() => {
        return sql.query`select GIA,MA from dichvu where MA = ${id}`
        
    }).then((result) => {
        // console.log(result)
        var {GIA,MA}=result.recordset[0]
        return sql.query`INSERT INTO SD_DICHVU_DATTRUOC VALUES(${idHD},${MA},${GIA})` 
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
module.exports.getDCTL=function(id){
    let DIEMCONGTICHLUY
    sql.connect(config).then(() => {
        return sql.query`select DIEMCONGTICHLUY from dichvu where MA = ${id}`
        
    }).then((result) => {
        // console.log(result)
        DIEMCONGTICHLUY=result.recordset[0].DIEMCONGTICHLUY
        return DIEMCONGTICHLUY
        
    })
    .catch(err => {
        console.log('error', err)
    }) 
    return DIEMCONGTICHLUY
}
module.exports.deleteUser= function(id){
    let hds,a
    sql.connect(config).then(() => {
        return sql.query`select * from hoadon where MAKHACH = ${id}`
    })
    .then(result => {
        hds=result.recordset
        async function myDisplay() {
            for(let item of hds){
                let myPromise = new Promise(function(myResolve, myReject) {
                    sql.connect(config).then(() => {
                        return sql.query`delete from sd_dichvu where MAHD=${item.MA}`
                    })
                    .then(result => {
                        myResolve()
                    })
                  });
                await myPromise;
          }
        }
        myDisplay().then(()=>{
            return sql.query`delete from hoadon where MAKHACH = ${id}`
        })
        // 
    })
    .then((result)=>{
        return sql.query`select * from dattruoc where MAKHACH = ${id}`
    })
    .then(result => {
        hds=result.recordset
        console.log(hds)
        async function myDisplay() {
            for(let item of hds){
                let myPromise = new Promise(function(myResolve, myReject) {
                    sql.connect(config).then(() => {
                        return sql.query`delete from SD_DICHVU_DATTRUOC where MAHD=${item.MA}`
                    })
                    .then(result => {
                        myResolve()
                    })
                  });
                await myPromise;
          }
        }
        myDisplay().then(()=>{
            return sql.query`delete from dattruoc where MAKHACH = ${id}`
        })   
    })
    .then(result => {

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

module.exports.selectInfoDV=function(item,kq){
    var data
    sql.connect(config).then(() => {
        return sql.query`select * from  dichvu dv where  dv.MA=${item.MADV}`
    })
    .then(result =>{
        data=result.recordset[0]
        kq.push(data)
        return data
    })

}

module.exports.selectSDDT=function(item,kq){
    var t={}
    var ten
    sql.connect(config).then(() => {
        return sql.query`select TEN from khachhang where MA=${item.MAKHACH}`
        
    })
    .then((result)=>{
        ten=result.recordset[0].TEN
        return sql.query`select dv.TEN,dv.GIA from sd_Dichvu_dattruoc sd,dichvu dv where sd.MAHD=${item.MA} and dv.MA=sd.MADV`
    })
    .then((result) => {
        t.data=result.recordset
        return sql.query`select SUM(GIA) as SUM from sd_Dichvu_dattruoc where MAHD=${item.MA} `
    }).then(result=>{
        t.sum=result.recordset[0]
        var x={
            info:item,
            sum:t.sum.SUM,
            data:t.data,
            ten:ten
        }
        kq.push(x)
        return {
            info:item,
            sum:t.sum.SUM,
            data:t.data,
            
        }
    })
    .catch(err => {
        console.log('error', err)
    }) 
}


module.exports.selectSDHD=async function(item,kq){
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
            console.log({...x}+'111111111111111111111111111111')
            myResolve()
        })
        .catch(err => {
            console.log('error', err)
        }) 
        
    });
    await myPromise;
    
}
module.exports.findStaff=function(values,dv){
    
    for(var item in values){
        if(Array.isArray(values[item])==false ) if(dv!=values[item]&&values[item].includes(dv)) return values[item].substring(0,values[item].length-5)
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