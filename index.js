const express = require('express')
const app = express()
const userRoute = require('./routes/user')
const staffRoute = require('./routes/staff')

var cookieParser = require('cookie-parser')
let fs=require('fs')
 
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

////////////////



app.get('/test', (req, res) => {
    
  sql.connect(config).then(() => {       
      return sql.query` select * from khachhang`  
  }).then(result => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.json(result.recordset)
      res.status(500).json({ error: 'message' })
  })
  
 

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
app.get('/dichvu', (req, res) => {
  
  // res.sendFile(__dirname + '/views/user/Service/services.html',{
  //   dotfiles: 'allow',
  // })
  res.render('service',{})
})

app.use('/user', userRoute)
app.use('/staff', staffRoute)







app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})