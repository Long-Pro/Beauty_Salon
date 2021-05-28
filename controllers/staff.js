const sql = require("mssql");
const func = require("../func");
const { nanoid,customAlphabet } = require('nanoid')



var md5 = require("md5");
const config = {
  user: "sa",
  password: "123",
  // server: 'DESKTOP-ABNCINT', // You can use 'localhost\\instance' to connect to named instance
  server: "localhost", // You can use 'localhost\\instance' to connect to named instance

  database: "BEAUTY_SALON",
  options: {
    encrypt: true,
    enableArithAbort: true,
  },
};
module.exports.login = function (req, res, next) {

  if (req.cookies.staffId) {
    res.redirect("/staff/work");
    return;
  }
  res.clearCookie('staffId', { })
  res.clearCookie('typeOfStaff', { })


  // res.clearCookie('guestPN', { })
  // res.clearCookie('guestId', { })
  // res.clearCookie('idStaff', { })

  res.render("staff/login", {
    values: req.body,
  });
};
module.exports.login2 = function (req, res, next) {
  let { account, password } = req.body;
  sql
    .connect(config)
    .then(() => {
      //   get id
      return sql.query`select * from nhanvien where TAIKHOAN=${account} COLLATE SQL_Latin1_General_CP1_CS_AS`;
    })
    .then((result) => {
      if (result.recordset.length == 0) {
        res.render("staff/login", {
          values: req.body,
          errors: [`Tài khoản không chính xác`],
        });
      } else {
        if (result.recordset[0].MATKHAU == md5(password)) {
          res.cookie("staffId", result.recordset[0].MA, {
            signed: true,
          });
          if (result.recordset[0].LOAINHANVIEN == "admin") {
            res.cookie("typeOfStaff", 'admin', {
              signed: true,
            });
            res.redirect("/staff/work");
          } else {
            res.cookie("typeOfStaff", 'nv', {
              signed: true,
            });
            res.redirect("/staff/work");

          }
        } else {
          res.render("staff/login", {
            values: req.body,
            errors: [`Mật khẩu không chính xác`],
          });
        }
      }
    });
};
module.exports.work = function (req, res, next) {
  var errStaff = req.cookies.errStaff;
  var succStaff = req.cookies.succStaff;
  // res.clearCookie("guestPN", {});
  // res.clearCookie("mkh", {});
  // res.clearCookie("guestId", {});
  // res.clearCookie("idStaff", {});
  let typeOfStaff=req.signedCookies.typeOfStaff
  res.render("staff/work", {
    errors: errStaff,
    success: succStaff,
    typeOfStaff
  });
};

// API -------------------------------------------------------------------------------------------------------------------
module.exports.getServices = function (req, res, next) {
  let services = {};

  sql.connect(config)
    .then(() => {
      return sql.query` select *  from DICHVU  as dv where dv.MALDV='LD001'`;
    })
    .then((result) => {
      services.catToc = result.recordset;
      return sql.query` select *  from DICHVU  as dv where dv.MALDV='LD002'`; //   validate tai khoan
    })
    .then((result) => {
      services.uonToc = result.recordset;
      return sql.query` select *  from DICHVU  as dv where dv.MALDV='LD003'`;
    })
    .then((result) => {
      services.nhuomToc = result.recordset;
      return sql.query` select *  from DICHVU  as dv where dv.MALDV='LD004'`;
    })
    .then((result) => {
      services.khac = result.recordset;
      
    })
    .then((result) => {
      
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.json(services);
      // res.status(500).json({ error: "message" });
    })
    .catch((err) => {
      console.log("err " + err);
    });
};
module.exports.getOnlineBill = async (req, res, next)=>{
  // 0 - dang dat
  // 1 - da huy
  // 2 - hoan thanh
  let hddd,hddh,hdht,kqdd=[],kqdh=[],kqht=[]
  await sql.connect(config)
  hddd=await sql.query`select * from DATTRUOC where TRANGTHAI=0 ORDER BY MA DESC` 
  hddd=hddd.recordset
  hddh=await sql.query`select * from DATTRUOC where TRANGTHAI=1 ORDER BY MA DESC` 
  hddh=hddh.recordset
  hdht=await sql.query`select * from DATTRUOC where TRANGTHAI=2 ORDER BY MA DESC` 
  hdht=hdht.recordset


  if(hddd)for(let itemBill of hddd){
    let t=await sql.query`select TEN,SDT from khachhang where MA=${itemBill.MAKHACH}`
    t=t.recordset[0]
    itemBill.TEN=t.TEN
    itemBill.SDT=t.SDT
    t=await sql.query`select lk.TILE_GIAMGIA from khachhang kh,loaikhach lk where kh.MA=${itemBill.MAKHACH} and kh.MALK=lk.MA`
    itemBill.TILE_GIAMGIA=t.recordset[0].TILE_GIAMGIA
    let billInfo=itemBill
    let billData=[]
    let response=await sql.query`select * from sd_Dichvu_dattruoc where MAHD=${itemBill.MA}`
    for(let itemData of response.recordset ) {
      let t=await sql.query`select TEN from dichvu where MA=${itemData.MADV}`  
      itemData.TEN=t.recordset[0].TEN
      billData.push(itemData) 
    }
    kqdd.push({
      billInfo,billData
    }); 
  }
  if(hddh)for(let itemBill of hddh){
    let t=await sql.query`select TEN,SDT from khachhang where MA=${itemBill.MAKHACH}`
    t=t.recordset[0]
    itemBill.TEN=t.TEN
    itemBill.SDT=t.SDT
    t=await sql.query`select lk.TILE_GIAMGIA from khachhang kh,loaikhach lk where kh.MA=${itemBill.MAKHACH} and kh.MALK=lk.MA`
    itemBill.TILE_GIAMGIA=t.recordset[0].TILE_GIAMGIA
    let billInfo=itemBill
    let billData=[]
    let response=await sql.query`select * from sd_Dichvu_dattruoc where MAHD=${itemBill.MA}`
    for(let itemData of response.recordset ) {
      let t=await sql.query`select TEN from dichvu where MA=${itemData.MADV}`  
      itemData.TEN=t.recordset[0].TEN
      billData.push(itemData) 
    }
    kqdh.push({
      billInfo,billData
    }); 
  }
  if(hdht)for(let itemBill of hdht){
    let t=await sql.query`select TEN,SDT from khachhang where MA=${itemBill.MAKHACH}`
    t=t.recordset[0]
    itemBill.TEN=t.TEN
    itemBill.SDT=t.SDT
    t=await sql.query`select lk.TILE_GIAMGIA from khachhang kh,loaikhach lk where kh.MA=${itemBill.MAKHACH} and kh.MALK=lk.MA`
    itemBill.TILE_GIAMGIA=t.recordset[0].TILE_GIAMGIA
    let billInfo=itemBill
    let billData=[]
    let response=await sql.query`select * from sd_Dichvu_dattruoc where MAHD=${itemBill.MA}`
    for(let itemData of response.recordset ) {
      let t=await sql.query`select TEN from dichvu where MA=${itemData.MADV}`  
      itemData.TEN=t.recordset[0].TEN
      billData.push(itemData) 
    }
    kqht.push({
      billInfo,billData
    }); 
  }

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json({kqdd,kqdh,kqht});

};
module.exports.getUserMainInfo = function (req, res, next) {
  let info = [];
  sql.connect(config)
    .then(() => {
      return sql.query` select MA,SDT  from khachhang`;
    })
    .then((result) => {
      for (let item of result.recordset)
        info = info.concat(Object.values(item));
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.json(info);
      // res.status(500).json({ error: "message" });
    });
};
module.exports.getStaffMainInfo = function (req, res, next) {
  let info = [];
  sql.connect(config)
    .then(() => {
      return sql.query` select MA,SDT  from nhanvien`;
    })
    .then((result) => {
      for (let item of result.recordset)
        info = info.concat(Object.values(item));
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.json(info);
      // res.status(500).json({ error: "message" });
    });
};
module.exports.getBillMainInfo = async  (req, res, next) =>{
  let info = [];
  await sql.connect(config)
  let response=await sql.query` select MA from hoadon`;
  response=response.recordset   
  response.forEach(item=>{
    info.push(item.MA)
  })
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json(info);
};
module.exports.getAvailableStaff = function (req, res, next) {
  let staffs = [];
  sql.connect(config)
    .then(() => {
      return sql.query` select * from nhanvien where TRANGTHAI=1`;
    })
    .then((result) => {
      for (let item of result.recordset) staffs.push(item);
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.json(staffs);
      // res.status(500).json({ error: "message" });
    });
};
module.exports.getCurrentStaff = async (req, res, next)=> {
  let staffId=req.signedCookies.staffId
  await sql.connect(config)   
  let staff=await sql.query` select * from nhanvien where MA=${staffId}`;
  staff=staff.recordset[0]  
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json(staff);
   
};

module.exports.findPhone = async (req, res, next)=>{
  console.log(req.body)
  let {data}=req.body
  await sql.connect(config)
  let response=await sql.query`select SDT from khachhang where SDT=${data}`
  console.log(response.recordset)
  if(response.recordset.length==0){//sdt chua ton tai
    res.setHeader("Access-Control-Allow-Origin", "*");
  	res.json({res:false});
  }else{//sdt ton tai
    res.setHeader("Access-Control-Allow-Origin", "*");
  	res.json({res:true});
  }
};
module.exports.findAccount = async (req, res, next)=>{
  console.log(req.body)
  let {data}=req.body
  await sql.connect(config)
  let response=await sql.query`select TAIKHOAN from nhanvien where TAIKHOAN=${data}`
  console.log(response.recordset)
  if(response.recordset.length==0){//sdt chua ton tai
    res.setHeader("Access-Control-Allow-Origin", "*");
  	res.json({res:false});
  }else{//sdt ton tai
    res.setHeader("Access-Control-Allow-Origin", "*");
  	res.json({res:true});
  }
};
module.exports.findPhoneStaff = async (req, res, next)=>{
  console.log(req.body)
  let {data}=req.body
  await sql.connect(config)
  let response=await sql.query`select SDT from nhanvien where SDT=${data}`
  console.log(response.recordset)
  if(response.recordset.length==0){//sdt chua ton tai
    res.setHeader("Access-Control-Allow-Origin", "*");
  	res.json({res:false});
  }else{//sdt ton tai
    res.setHeader("Access-Control-Allow-Origin", "*");
  	res.json({res:true});
  }
};
module.exports.statistic = async (req, res, next)=>{
  console.log(req.body)
  let {data}=req.body
  var kq=[]
  let tongTien=0,tongHD=0,hd
  
  await sql.connect(config)
  if(data[0].day){
    let par=`${data[0].day}T%`
    let result=await sql.query`select * from hoadon where THOIGIAN LIKE ${par} ORDER BY MA DESC;` 
    tongHD=result.recordset.length
    hd=result.recordset
  }
  if(data[0].month){
    let par=`${data[0].month}-__T%`
    let result=await sql.query`select * from hoadon where THOIGIAN LIKE ${par} ORDER BY MA DESC;` 
    tongHD=result.recordset.length
    hd=result.recordset
  }
  if(data[0].year){
    let par=`${data[0].year}-__-__T%`
    let result=await sql.query`select * from hoadon where THOIGIAN LIKE ${par} ORDER BY MA DESC;` 
    tongHD=result.recordset.length
    hd=result.recordset
  }
  if(data[0].day1){
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
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json({res:kq,tongHD});
  

};
module.exports.findGuest  = async (req, res, next)=> {
	let user = {};
	console.log(req.body);
	let { value, filter } = req.body;


  await sql.connect(config)
	if(filter=='MA') user= await sql.query` select * from khachhang where MA=${value}`
	if(filter=='SDT')user= await sql.query` select * from khachhang where SDT=${value}`
	user=user.recordset
	if(user.length==0 ) {
    await res.setHeader("Access-Control-Allow-Origin", "*");
	  res.json({});
    return
  }
	user=user[0]
	let t=await sql.query`select lk.* from loaikhach lk,khachhang kh where kh.MALK=lk.MA and kh.MA=${user.MA}`
	user.TENLOAI=t.recordset[0].TENLOAI
	user.TILE_GIAMGIA=t.recordset[0].TILE_GIAMGIA
	console.log(user)
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.json(user);
};
module.exports.findStaff  = async (req, res, next)=> {
	let user = {};
	console.log(req.body);
	let { value, filter } = req.body;


  await sql.connect(config)
	if(filter=='MA') staff= await sql.query` select * from nhanvien where MA=${value}`
	if(filter=='SDT')staff= await sql.query` select * from nhanvien where SDT=${value}`
	staff=staff.recordset
	if(staff.length==0 ) {
    await res.setHeader("Access-Control-Allow-Origin", "*");
	  res.json({});
    return
  }
	staff=staff[0]
  console.log(staff)
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.json(staff);
};
module.exports.editGuest  = async (req, res, next)=> {
	let data={}
	console.log(req.body);
	let { id,fullname, phone,gender } = req.body;
  await sql.connect(config)
	try {
    await sql.query` update khachhang set TEN=${fullname},SDT=${phone},GIOITINH=${gender} where MA=${id}`
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json({res:true});
  } catch (error) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json({res:false});
  }
};
module.exports.editStaff  = async (req, res, next)=> {
	let data={}
	console.log(req.body);
	let { id,address,birth,email,fullname,gender,identityCard,phone,type } = req.body;
  await sql.connect(config)
	try {
    await sql.query` update nhanvien set DIACHI=${address},NGAYSINH=${birth},EMAIL=${email}, TEN=${fullname},SDT=${phone},GIOITINH=${gender},LOAINHANVIEN=${type},CMND=${identityCard} where MA=${id}`
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json({res:true});
  } catch (err) {
    console.log('editStaff',err)
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json({res:false});
  }
};
module.exports.removeStaff  = async (req, res, next)=> {
	
	console.log(req.body);
	let { data} = req.body;
  await sql.connect(config)
	try {
    await sql.query` update nhanvien set TRANGTHAI=0 where MA=${data}`
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json({res:true});
  } catch (error) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json({res:false});
  }
};
module.exports.removeBill  = async (req, res, next)=> {
	
	console.log(req.body);
	let { data} = req.body;
  await sql.connect(config)
	
    await sql.query` DELETE FROM SD_DICHVU WHERE  MAHD=${data}`
    await sql.query` DELETE FROM hoadon WHERE  MA=${data}`

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json({res:true});

  
};
module.exports.removeOnlineBill  = async (req, res, next)=> {
	
	console.log(req.body);
	let { data} = req.body;
  await sql.connect(config)
	
  await sql.query`Update dattruoc set TRANGTHAI=1 where MA=${data}`

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json({res:true});

  
};
module.exports.removeOnlineDelayBill  = async (req, res, next)=> {
	console.log(req.body);
	let { data} = req.body;
  var d = new Date().getTime();
  d -= parseInt(data, 10) * 60 * 60;
  let kq = 0;
  await sql.connect(config)
  let result=await sql.query`  select * from dattruoc where TRANGTHAI=0`;
  let dt = result.recordset;
  for (let item of dt) {
    let t = new Date(item.THOIGIAN + ":00Z");
    if (t.getTime() <= d) {
      kq++;
      await sql.query`UPDATE DATTRUOC SET TRANGTHAI=1 WHERE MA=${item.MA}`; 
    }
  }

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json({res:kq});
};
module.exports.completeOnlineBill  = async (req, res, next)=> {
	
	console.log(req.body);
	let { data} = req.body;
  await sql.connect(config)
	
  await sql.query`Update dattruoc set TRANGTHAI=2 where MA=${data}`

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json({res:true});

  
};
module.exports.addGuest = async (req, res, next) =>{
  var { fullname, gender,phone } = req.body;
  console.log(req.body)
  await sql.connect(config)
  let mkh=nanoid(10)
  let response=await sql.query`insert into khachhang values(${mkh},${fullname},${phone},${gender},'LK1',0)`
  res.setHeader("Access-Control-Allow-Origin", "*");
	res.json({res:true});
};
module.exports.addStaff = async (req, res, next) =>{
  var { fullname, gender,phone,email,address,identityCard,birth,account,password,type } = req.body;
  console.log(req.body)
  await sql.connect(config)
  // nanoid = customAlphabet('1234567890', 2)
  let mnv=fullname.split(' ')
  mnv=mnv[mnv.length-1]
  mnv=mnv+'-'+nanoid(2)
  let response=await sql.query`insert into nhanvien values(${mnv},${fullname},${phone},${gender},${email},${identityCard},${birth},${address},1,${account},${md5(password)},${type})`
  res.setHeader("Access-Control-Allow-Origin", "*");
	res.json({res:true});
};

module.exports.addBill=async (req, res,next)=>{
  console.log(req.body)
  let {MKH,tlgg,time,cashier,doServices,plusMark}=req.body
  await sql.connect(config)
  let mhd=nanoid(10)
  await sql.query`insert into hoadon values(${mhd},${MKH},${time},${cashier},${tlgg})`
  doServices.forEach(async item=>{
    await sql.query`insert into SD_DICHVU values(${mhd},${item.MNV},${item.MDV},${item.GIA})`
  })
  if(MKH=='KH00000001'){
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send('Thêm hóa đơn thành công')
    return
  }
  let diemCong=plusMark;
  doServices.forEach(async item=>{
    diemCong+=item.plusMark
  })
  if(diemCong>=200){
    await sql.query`UPDATE khachhang SET DIEMTICHLUY = ${diemCong},MALK='LK4'  where MA=${MKH}`
  }else if(diemCong>=150){
    await sql.query`UPDATE khachhang SET DIEMTICHLUY = ${diemCong},MALK='LK3'  where MA=${MKH}`
  }else if(diemCong>=70){
    await sql.query`UPDATE khachhang SET DIEMTICHLUY = ${diemCong},MALK='LK2'  where MA=${MKH}`
  }else if(diemCong>=0){
    await sql.query`UPDATE khachhang SET DIEMTICHLUY = ${diemCong},MALK='LK1'  where MA=${MKH}`
  } 
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send('Thêm hóa đơn thành công')


  

}
module.exports.findBill = async (req, res, next)=>{
  console.log(req.body)
  let {data}=req.body
  await sql.connect(config)
  let response=await sql.query`select * from hoadon where MA=${data}`
  if(response.recordset.length==0){//MHD chua ton tai
    res.setHeader("Access-Control-Allow-Origin", "*");
  	res.json({res:{}});
    return
  }else{//MHD ton tai 
  }
  let t=await sql.query`select TEN,SDT from khachhang where MA=${response.recordset[0].MAKHACH}`
  t=t.recordset[0]
  console.log(t)
  response.recordset[0].TEN=t.TEN
  response.recordset[0].SDT=t.SDT
  let billInfo=response.recordset[0]
  let billData=[]
  response=await sql.query`select * from sd_dichvu where MAHD=${billInfo.MA}`
  response=response.recordset
  console.log(response)
  response.forEach(async (item,index)=> {
    let t=await sql.query`select TEN from dichvu where MA=${item.MADV}`  
    item.TEN=t.recordset[0].TEN
    billData.push(item) 
    if(index==response.length-1){
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.json({res:{
        billInfo,billData
      }});
    }
    
  }) 
};
module.exports.findOnlineBill = async (req, res, next)=>{
  console.log(req.body)
  let {data}=req.body
  await sql.connect(config)
  let response=await sql.query`select * from dattruoc where MA=${data}`
  if(response.recordset.length==0){//MHD chua ton tai
    res.setHeader("Access-Control-Allow-Origin", "*");
  	res.json({res:{}});
    return
  }else{//MHD ton tai 
  }
  

  let t=await sql.query`select TEN,SDT,DIEMTICHLUY from khachhang where MA=${response.recordset[0].MAKHACH}`
  t=t.recordset[0]
  console.log(t)
  response.recordset[0].TEN=t.TEN
  response.recordset[0].SDT=t.SDT
  response.recordset[0].DIEMTICHLUY=t.DIEMTICHLUY

  let billInfo=response.recordset[0]
  let tl=await sql.query`select TILE_GIAMGIA from khachhang kh,loaikhach lk where kh.MA=${billInfo.MAKHACH} and lk.MA=kh.MALK`
  billInfo.TILE_GIAMGIA=tl.recordset[0].TILE_GIAMGIA
  let billData=[]
  response=await sql.query`select * from sd_Dichvu_dattruoc where MAHD=${billInfo.MA}`
  response=response.recordset
  console.log(response)
  response.forEach(async (item,index)=> {
    let t=await sql.query`select * from dichvu where MA=${item.MADV}`  
    item.TEN=t.recordset[0].TEN
    item.DIEMCONGTICHLUY=t.recordset[0].DIEMCONGTICHLUY

    
    billData.push(item) 
    if(index==response.length-1){
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.json({res:{
        billInfo,billData
      }});
    }
    
  }) 
};


// ---------------------------------------------------------------------------------------------------------------------