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


module.exports.convertTimeYMD =function(time){//nam-thang-ngay
    // 2021-04-04T19:12
    var times=time.split('-')
    return `${times[2]}-${times[1]}-${times[0]}`
}
module.exports.convertTimeYM =function(time){//month: '2021-04' }
    // 2021-04-04T19:12
    var times=time.split('-')
    return `${times[1]}-${times[0]}`
}
module.exports.convertCountTime =function(time){//nam-thang-ngay
    // 2021-04-04T19:12
    var times=time.split('-')
    let nam=parseInt(times[0]),thang=parseInt(times[1]),ngay=parseInt(times[2])
    let kq=0
    if((nam%4==0&&nam%100!=0)||nam%400==0){// nam nhuan
        let days=[0,31,29,31,30,31,30,31,31,30,31,30,31]
        for(let i=1;i<thang;i++) kq+=days[i]
        kq+=ngay
    }else{//nam khong nhuan
        let days=[0,31,28,31,30,31,30,31,31,30,31,30,31]
        for(let i=1;i<thang;i++) kq+=days[i]
        kq+=ngay
    }
    return kq
    
}

module.exports.findStaff=function(values,dv){
    
    for(var item in values){
        if(Array.isArray(values[item])==false ) if(dv!=values[item]&&values[item].includes(dv)) return values[item].substring(0,values[item].length-5)
    }
    
}
module.exports.statistic=async function(kq){

}

