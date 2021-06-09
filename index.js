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
var options = { format: 'Letter' };
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
  // res.setHeader("Access-Control-Allow-Origin", "*");
  // res.json({res:{
  //   billInfo,billData
  // }});

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
    <div class='d-flex justify-content-between'>
        <strong>Tên: ${billInfo.TEN}</strong>
        <strong>MKH: ${billInfo.MAKHACH}</strong>
        <strong>SDT: ${billInfo.SDT}</strong>
    </div>
    <div class='d-flex justify-content-between'>
        <strong>MHD: ${billInfo.MA}</strong>
        <strong>Nhân viên thu ngân: ${billInfo.MANV}</strong>   
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
        <span>Tổng tiền: ${price}đ</span>
        <span>Giảm giá: ${tlgg}%</span>
    </div>
    <span>Tiền thanh toán: ${Math.ceil(price*(100-tlgg)/100)}đ</span>
  `
  let html=`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
    </head>
    <body>
      ${kq}
    </body>
    </html>
  `
  await pdf.create(html, options).toFile('./bill.pdf', function(err, res) {
    if (err) return console.log(err);
    console.log(res); // { filename: '/app/businesscard.pdf' }
  });

  var filePath = path.join(__dirname, 'bill.pdf');
    var stat = fs.statSync(filePath);

    res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Length': stat.size
    });

    var readStream = fs.createReadStream(filePath);
    // We replaced all the event handlers with a simple call to readStream.pipe()
    readStream.pipe(res);
  // res.send('123')
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