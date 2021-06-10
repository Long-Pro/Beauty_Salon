const express = require('express')
const app = express()
const userRoute = require('./routes/user')
const staffRoute = require('./routes/staff')

var cookieParser = require('cookie-parser')

 
const port = 3000

app.use(cookieParser('LongPro'))

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(express.urlencoded({
    extended: true
}))

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


app.set('view engine', 'pug')
app.set('views', './views')

app.use(express.static('public'))

////////////////


var fs = require('fs');
var path = require('path');
var pdf = require('html-pdf');

app.get('/test',async  (req, res) => {
  // var html = fs.readFileSync('./test/businesscard.html', 'utf8');
  let html2=`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
    </head>
    <body>
      <h1>LongPro</h1>
      <h1>LongProNo1</h1>
    </body>
    </html>
  `
  await pdf.create(html2, options).toFile('./bill.pdf', function(err, res) {
    if (err) return console.log(err);
    console.log(res); // { filename: '/app/businesscard.pdf' }
  });
  res.send("123")
})
app.get('/test2',async(req, res)=>{

  let data=req.query.mhd
  await sql.connect(config)
  let response=await sql.query`select * from hoadon where MA=${data}`
  
  let t=await sql.query`select TEN,SDT from khachhang where MA=${response.recordset[0].MAKHACH}`
  t=t.recordset[0]
  response.recordset[0].TEN=t.TEN
  response.recordset[0].SDT=t.SDT
  let billInfo=response.recordset[0]
  let billData=[]
  response=await sql.query`select * from sd_dichvu where MAHD=${billInfo.MA}`
  response=response.recordset
 
  for(let item of response){
    let t=await sql.query`select TEN from dichvu where MA=${item.MADV}`  
    item.TEN=t.recordset[0].TEN
    billData.push(item) 
  }


  let tlgg=billInfo.TILE_GIAMGIA
  let price=0;
  let table=billData.map((item,index)=>{
    price+=item.GIA
    return`
        <tr>
            <th scope="row">${index+1}</th>
            <td>${item.TEN}</td>
            <td>${item.MANV}</td>
            <td>${item.GIA}</td>   
        </tr>
    `
  })
  table=table.join('')
  let kq=`
    <div style="height:2px;background-color:red"></div>
    <div style='background-color: DodgerBlue;color:red;'>
      <div  style='display:flex; '>
          <div>Tên: ${billInfo.TEN}</div>
          <div>MKH: ${billInfo.MAKHACH}</div>
          <div>SDT: ${billInfo.SDT}</div>
      </div>
      <div class='d-flex justify-content-between'>
          <div >MHD: ${billInfo.MA}</div>
          <div>Nhân viên thu ngân: ${billInfo.MANV}</div>   
      </div>
    
    </div>
    <table class="table">
      <thead>
          <tr>
              <th scope="col">#</th>
              <th scope="col">Tên Dịch Vụ</th>
              <th scope="col">Nhân Viên Thực Hiện</th>  
              <th scope="col">Giá Tiền</th>   

          </tr>
      </thead>
      <tbody>
          ${table}
      </tbody>
    </table>
    <div>Thời gian: ${covertTime(billInfo.THOIGIAN)}</div>
    <div class='d-flex justify-content-between'>
        <div>Tổng tiền: ${price}đ</div>
        <div>Giảm giá: ${tlgg}%</div>
    </div>
    <div>Tiền thanh toán: ${Math.ceil(price*(100-tlgg)/100)}đ</div>
    <div style="height:2px;background-color:red"></div>
  `
  let html=`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x" crossorigin="anonymous">
      <style>
        
      </style>
    </head>
    <body>
      
      ${kq}
      
    </body>
    </html>
  `
  var options = { format: 'Letter' };
  await pdf.create(html, options).toFile('./bill.pdf', function(err, res2) {
    if (err) return ;
    // console.log(err);
    var filePath = path.join(__dirname, 'bill.pdf');
    var stat = fs.statSync(filePath);
  
    res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Length': stat.size
    });
  
    var readStream = fs.createReadStream(filePath);
    // We replaced all the event handlers with a simple call to readStream.pipe()
    readStream.pipe(res);
  });

})
app.get('/test3',async(req, res)=>{
  let data=req.query.time
  let length=data.length
  console.log(data.length)
  
  let kq=[]
  let tongTien=0,tongHD=0,hd
  
  await sql.connect(config)
  if(length==10){
    let par=`${data}T%`
    let result=await sql.query`select * from hoadon where THOIGIAN LIKE ${par} ORDER BY MA DESC;` 
    tongHD=result.recordset.length
    hd=result.recordset
  }
  if(length==7){
    let par=`${data}-__T%`
    let result=await sql.query`select * from hoadon where THOIGIAN LIKE ${par} ORDER BY MA DESC;` 
    tongHD=result.recordset.length
    hd=result.recordset
  }
  if(length==4){
    let par=`${data}-__-__T%`
    let result=await sql.query`select * from hoadon where THOIGIAN LIKE ${par} ORDER BY MA DESC;` 
    tongHD=result.recordset.length
    hd=result.recordset
  }
  if(length==21){
    data=data.split(' ')
    let par1=`${data[0].day1}T00:00%`
    let par2=`${data[1].day2}T00:00%`
    let result=await sql.query`select * from hoadon where THOIGIAN LIKE ${par} ORDER BY MA DESC;` 
    let t=result.recordset
    t.forEach((item,index)=>{
      if(par1<=item.THOIGIAN&&item.THOIGIAN<=par2)
      hd.push(item)
    })
    tongHD=hd.length
  }
  console.log('hd',hd)
  for(let itemBill of hd){
    let t=await sql.query`select TEN,SDT from khachhang where MA=${itemBill.MAKHACH}`
    t=t.recordset[0]
    console.log(t)
    itemBill.TEN=t.TEN
    itemBill.SDT=t.SDT
    let billInfo=itemBill
    let billData=[]
    let response=await sql.query`select * from sd_dichvu where MAHD=${itemBill.MA}`
    for(let itemData of response.recordset ) {
      let t=await sql.query`select TEN from dichvu where MA=${itemData.MADV}`  
      itemData.TEN=t.recordset[0].TEN
      billData.push(itemData) 
    }
    kq.push({
      billInfo,billData
    }); 
  }

  tongHD=kq.length
  tongTien=0

  let kq2=kq.map((item=>{
    console.log(item)
    let {billInfo,billData}=item;
    let tlgg=billInfo.TILE_GIAMGIA
    let price=0;
    let table=billData.map((item,index)=>{
        price+=item.GIA
        return`
            <tr>
                <th scope="row">${index+1}</th>
                <td>${item.TEN}</td>
                <td>${item.MANV}</td>
                <td>${item.GIA}</td>   
            </tr>
        `
    })
    tongTien+=Math.ceil(price*(100-tlgg)/100)

    table=table.join('')
    let kq=`
        <div style='border:1px solid red;margin-bottom:50px;background-color:#7ed6df' >
          <div style='background-color: DodgerBlue;color:red;'>
            <div class='d-flex justify-content-between '>
                <div>Tên: ${billInfo.TEN}</div>
                <div>MKH: ${billInfo.MAKHACH}</div>
                <div>SDT: ${billInfo.SDT}</div>
            </div>
            <div class='d-flex justify-content-between'>
                <div>MHD: ${billInfo.MA}</div>
                <div>Nhân viên thu ngân: ${billInfo.MANV}</div>   
            </div>
          </div>
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Tên Dịch Vụ</th>
                        <th scope="col">Nhân Viên Thực Hiện</th>  
                        <th scope="col">Giá Tiền</th>   

                    </tr>
                </thead>
                <tbody>
                    ${table}
                </tbody>
            </table>
            <div>Thời gian: ${covertTime(billInfo.THOIGIAN)}</div>
            <div class='d-flex justify-content-between'>
                <div>Tổng tiền: ${price}đ</div>
                <div>Giảm giá: ${tlgg}%</div>
            </div>
            <span>Tiền thanh toán: ${Math.ceil(price*(100-tlgg)/100)}đ</span>
        </div>
    `
    return kq
  }))
  kq2=kq2.join('')
  kq2=`
    <div class='mb-5' style='border:2px red solid;margin-bottom:50px;background-color:#eb4d4b' >
        <h3 class='text-center'>Thống kê doanh thu ${data}</h3>
        <div class='d-flex justify-content-between'>
            <div>Tổng số hóa đơn: ${tongHD}</div>
            
            <div>Tổng doanh thu: ${tongTien}đ</div>

        </div>
    </div>`+kq2
  let html=`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x" crossorigin="anonymous">
      <style>
        
      </style>
    </head>
    <body>
      
      ${kq2}
      
    </body>
    </html>
  `
  var options = { format: 'Letter' };
  await pdf.create(html, options).toFile('./statisticalBill.pdf', function(err, res2) {
    if (err) return ;
    // console.log(err);
    var filePath = path.join(__dirname, 'statisticalBill.pdf');
    var stat = fs.statSync(filePath);
  
    res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Length': stat.size
    });
  
    var readStream = fs.createReadStream(filePath);
    // We replaced all the event handlers with a simple call to readStream.pipe()
    readStream.pipe(res);
  });

  
})

app.get('/', (req, res) => {
    res.render('index',{
      userId:req.cookies.userId
    })
})
app.get('/dichvu', (req, res) => {
  
  // res.sendFile(__dirname + '/views/user/Service/services.html',{
  //   dotfiles: 'allow',
  // })
  res.render('service',{})
})

app.use('/user', userRoute)
app.use('/staff', staffRoute)


function covertTime(time){
  //2021-05-19T17:50
  let times=time.split('T')
  let date=times[0].split('-')
  let t=times[1].split(':')
  let kq=`${t[0]}:${t[1]} ${date[2]}-${date[1]}-${date[0]}`
  return kq

}




app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})