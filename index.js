const express = require('express')
const app = express()
const userRoute = require('./routes/user')
const staffRoute = require('./routes/staff')

var cookieParser = require('cookie-parser')
 
const port = 3000

app.use(cookieParser())

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



app.get('/test', (req, res) => {
    
  // sql.connect(config).then(() => {       
  //     return sql.query` select max(ma) as ma from hoadon`  
  // }).then(result => {
  //     res.send(result)
  //     return
  // })
  sql.connect(config);     
  var promise=new Promise(function(res,rej){
    res(sql.query` select max(ma) as ma from hoadon`)
  }).then((result=>{
    console.log(result)
  }))
  .catch(function(err){
    console.log(err)
  })

  promise=new Promise(function(res,rej){
    res(sql.query` select ma as ma from khachhang`)
  }).then((result=>{
    console.log(result)
  }))
  .catch(function(err){
    console.log(err)
  })

  res.send("aaaaaaa")
   
  


})
app.get('/test2', (req, res) => {
   res.render('test/index',{ 
     x:"123456"
   })

 


})
app.get('/cookie', (req, res)=>{
  res.cookie("userId",12345)
  res.send("hello Long")
})
app.get('/clearCookie', (req, res)=>{
  res.clearCookie('userId', { })
  res.send("hello Long")
})
app.get('/cookieTest', (req, res)=>{
  console.log(req.cookies)
  res.send("hello Long")
})


app.get('/', (req, res) => {
    res.render('index',{
      userId:req.cookies.userId
    })
})

app.use('/user', userRoute)
app.use('/staff', staffRoute)







app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})