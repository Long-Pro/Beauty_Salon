

//      get Data        ---------------------------------------------------------------------------------
let apiGetUserMainInfo='http://localhost:3000/staff/api/getUserMainInfo'               // []
let apiGetStaffMainInfo='http://localhost:3000/staff/api/getStaffMainInfo'             // []
let apiGetBillMainInfo='http://localhost:3000/staff/api/getBillMainInfo'               // []
let apiGetServices='http://localhost:3000/staff/api/getServices'                       // [{},{}]
let apiGetAvailableStaff='http://localhost:3000/staff/api/getAvailableStaff'           // [{},{}]
let apiGetCurrentStaff='http://localhost:3000/staff/api/getCurrentStaff'               // {}
let apiGetOnlineBill='http://localhost:3000/staff/api/getOnlineBill'                   // {}


let apiPostContentBill='http://localhost:3000/staff/api/addBill'                       // post [{},{}]
let apiPostPhone='http://localhost:3000/staff/api/findPhone'                           // post true/false
let apiPostAccount='http://localhost:3000/staff/api/findAccount'                       // post true/false
let apiPostPhoneStaff='http://localhost:3000/staff/api/findPhoneStaff'                 // post true/false

let apiPostBill='http://localhost:3000/staff/api/findBill'                             // post {}
let apiPostRemoveBill='http://localhost:3000/staff/api/removeBill'                     // post {}
let apiPostGuest='http://localhost:3000/staff/api/findGuest'                           // post {}
let apiPostStaff='http://localhost:3000/staff/api/findStaff'                           // post {}
let apiPostAddGuest='http://localhost:3000/staff/api/addGuest'                         // post {}
let apiPostAddStaff='http://localhost:3000/staff/api/addStaff'                         // post {}

let apiPostEditGuest='http://localhost:3000/staff/api/editGuest'                       // post {}
let apiPostEditStaff='http://localhost:3000/staff/api/editStaff'                       // post {}
let apiPostRemoveStaff='http://localhost:3000/staff/api/removeStaff'                   // post {}

let apiPostDate='http://localhost:3000/staff/api/statistic'                            // post {}

let apiPostRemoveOnlineBill='http://localhost:3000/staff/api/removeOnlineBill'         // {}
let apiPostRemoveOnlineDelayBill='http://localhost:3000/staff/api/removeOnlineDelayBill'    // {}
let apiPostCompleteOnlineBill='http://localhost:3000/staff/api/completeOnlineBill'     // {}
let apiPostFindOnlineBill='http://localhost:3000/staff/api/findOnlineBill'             // {}









//    ch???y dau tien
resetBase()
//      func            ---------------------------------------------------------------------------------
function openNewTab(url) {
    window.open(
      `${url}`, "_blank");
}
function createDatalisttUserMainInfo(querySelector,api){
    fetch(api)
        .then((response) =>{
            return response.json()
        })
        .then((response)=>{
            console.log(response)
            let t=response.map((item)=>{
                return `<option >${item}</option>`
            })
            t=t.join('')
            let demo=document.querySelector(querySelector)
            console.log(demo,t)
            console.log(querySelector)
            demo.innerHTML=t
        })
}
function getParent(element,selector){
    while(element.parentElement){
        if(element.parentElement.matches(selector)){
            return element.parentElement
        }
        element=element.parentElement
    }

}
function showSuccessToast(mess) {
    toastCus({
      title: "Th??nh c??ng!",
      message: mess||"B???n ???? ????ng k?? th??nh c??ng t??i kho???n t???i F8.",
      type: "success",
      duration: 5000
    });
}
function showErrorToast(mess) {
    toastCus({
        title: "Th???t b???i!",
        message: mess||"C?? l???i x???y ra, vui l??ng li??n h??? qu???n tr??? vi??n.",
        type: "error",
        duration: 5000
    });
}
function resetBase(selector){
    let bases=document.querySelectorAll('.base')
    bases=Array.from(bases)
    bases.forEach(item=>{
        item.innerHTML='<div class="content"></div>'
    })
}
function covertTime(time){
    //2021-05-19T17:50
    let times=time.split('T')
    let date=times[0].split('-')
    let t=times[1].split(':')
    let kq=`${t[0]}:${t[1]} ${date[2]}-${date[1]}-${date[0]}`
    return kq

}
function resetInput(...inputs) {
    inputs.forEach(item=>item.value='')

}
function isEmptyObj(object) {
    return Object.keys(object).length === 0?true:false;
 }
function isObjhas(object, key) {
    if(isEmptyObj(object)) return false;
    return object ? hasOwnProperty.call(object, key) : false;
}
//---------------------------------------------------------------------------------------------------------



//                                    dialog them hoa don               -----------------------------------------------
let btnDialogTHD=document.querySelector('a[href="#dialogTHD"][purpose="dialog"]')
btnDialogTHD.onclick= ()=>{
    resetBase()
    createDatalisttUserMainInfo(`#dialogTHD #datalistOptionsTHD`,apiGetUserMainInfo)
}
let dialogTHD=document.getElementById('dialogTHD')
let dialogTHD_btn=dialogTHD.querySelector('.form #dialogTHD_XN')
let dialogTHDNP_btn=dialogTHD.querySelector('.form #dialogTHD_NP')
dialogTHDNP_btn.onclick=async()=>{

    let data={value:'KH00000001',filter:'MA'}
    let res=await fetch(apiPostGuest,{
        method: 'POST', 
        body: JSON.stringify(data), 
        headers:{
            'Content-Type': 'application/json'
        }
    })
    let user=await res.json()
    console.log(user)

    if(Object.keys(user).length === 0){// k tim dc user
        
        toastCus({
            title: "Th???t b???i!",
            message: `Kh??ng t???n t???i kh??ch h??ng c?? ${inputFilter.value} l?? ${inputValue.value}`,
            type: "error",
            duration: 3000
          });
        return;
    }else{
        
    }

    let staff= await fetch(apiGetAvailableStaff)
    staff=await staff.json()

    let currentStaff=await fetch(apiGetCurrentStaff)
    currentStaff=await currentStaff.json()

    let services=await fetch(apiGetServices)
    services=await services.json()

    let thd=document.querySelector('.thd')
    let content=document.querySelector('.thd .content')
    content.style.borderWidth='1px'
    content.style.borderColor='red'
    content.style.borderStyle='solid'

    let nv=staff.map(item=>{
        return `   
            <option value='${item.MA}'>${item.MA}</option> 
        `
    })
    nv=nv.join('')
    kq=`
        <div class='d-flex justify-content-between'>
            <strong>T??n: ${user.TEN}</strong>
            <strong>M??: ${user.MA}</strong>
            <strong>SDT: ${user.SDT}</strong>
        </div>
        <hr>
    `
    let a={
        catToc:"C???T T??C",
        uonToc:"U???N T??C",
        nhuomToc:"NHU???M T??C",
        khac:"D???CH V??? KH??C",
    }
    for (let key in services) {
        if (services.hasOwnProperty(key)) {
            let selectNV=`<select>${nv}</select>`
            
            kq+=`<h2>${a[key]}</h2>`
            let t=services[key].map((item)=>{
                return `
                    <div class='DV d-flex align-items-center ' >
                        <input class='mx-4' type='checkbox' name=${key} value=${item.MA} id=${item.MA} price=${item.GIA} plusMark=${item.DIEMCONGTICHLUY}>
                        <label class=' d-flex justify-content-between flex-grow-1 ' for=${item.MA}>
                            <div class='DV_info d-flex flex-column w-100 flex-grow-1  ' style='border-bottom: 1px solid #ccc '>
                                <div class='d-flex justify-content-between '>
                                    <h5 class='DV_info_name'>${item.TEN}</h5>
                                    <div class='DV_info_price'>${item.GIA}??</div>
                                </div>
                                <div class='DV_info_des'>
                                    ${item.MOTA}
                                </div>
                            </div>  

                        </label>
                        
                        <div class='d-flex flex-column mb-1 align-items-center' style='padding-left:20px;'>
                            <label class='mb-1' style='width:110px' ><strong>NV th???c hi???n</strong></label>
                            ${selectNV}
                        </div> 
                        
                    </div>    
                `
            })
            kq+=t.join('')   
        }  
    }
    kq+=`
        <div class='d-flex justify-content-between'>
            <span>Nh??n vi??n th???c hi???n:${currentStaff.MA}</span>
            <div>
                <label for='orderTime'> Ch???n ng??y gi??? c???t:</label>
                <input id='orderTime' type='datetime-local' name='orderTime' required>
            </div>
        </div>
        <div class='d-flex justify-content-between'>
            <span id='sumPrice'>T???ng ti???n: 0??</span>
            <span id=''>Gi???m gi??: ${user.TILE_GIAMGIA}%</span>
        </div>
        <div>
            <span id='currPrice'>Ti???n thanh to??n: 0??</span>
        </div>
        <div>
            <span id='errMess' style='display:block;color:red'></span>
        </div>
        <div>
            <button id='btnTHD' class='btn btn-primary'>Th??m h??a ????n</button>
            <button id='btnHuyTHD' class='btn btn-danger'>H???y</button>

        </div>
    `
    content.innerHTML=kq

    let errMess=document.querySelector('.thd #errMess')
    let btnTHD=document.querySelector('.thd #btnTHD')
    let btnHuyTHD=document.querySelector('.thd #btnHuyTHD')
    // Xu li thoi gian
    let orderTime=document.querySelector('.thd #orderTime')
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1).toString().padStart(2,0)+'-'+today.getDate().toString().padStart(2,0);
    var time = today.getHours().toString().padStart(2,0) + ":" + today.getMinutes().toString().padStart(2,0) ;
    var dateTime = date+'T'+time;
    orderTime.value=dateTime
    orderTime.onchange=()=>{
        errMess.textContent=''
        btnTHD.removeAttribute("disabled");
    }
    //X??? l?? click checkbox for
    let sumPrice=document.querySelector('#sumPrice')
    let currPrice=document.querySelector('#currPrice')
    let price=0;
    let inputsCheckbox=Array.from(document.querySelectorAll('.thd  input[type=checkbox]'))
    let tlgg=parseInt(user.TILE_GIAMGIA)
    
    for(let item of inputsCheckbox){
        item.onchange=function(e){
            errMess.textContent=''
            btnTHD.removeAttribute("disabled");

            if(item.getAttribute('name')!='khac'){
                let t=item.checked
                for(let item2 of inputsCheckbox ) if(item2.getAttribute('name')==item.getAttribute('name')){
                    item2.checked=false
                }
                item.checked=t;
            }
            price=0;
            for(let item2 of inputsCheckbox){ 
                let priceEle=parseInt(item2.getAttribute('price'))
                if(item2.checked) price+=priceEle
            }
            sumPrice.innerText='T???ng ti???n: ' +price+'??';
            currPrice.innerText=`Ti???n thah to??n: ${Math.ceil(price*(100-tlgg)/100)}??`  
        }
    }
    // Xu li su kien them hoa don
    btnTHD.onclick=async ()=>{
        let time=orderTime.value;
        if(time=='') {
            errMess.textContent='Th???i gian kh??ng h???p l???'
            btnTHD.setAttribute('disabled',true)
            return
        }
        let kt=inputsCheckbox.some((item)=>{
            return item.checked
        })
        if(kt) {
            let data={}
            data.doServices=[]
            for(let item of inputsCheckbox){
                if(item.checked){
                    let t={}
                    t.MDV=item.getAttribute('value')
                    t.GIA=parseInt(item.getAttribute('price'))
                    t.plusMark=parseInt(item.getAttribute('plusMark'))

                    let parent =getParent(item,'.DV')
                    let selectNV=parent.querySelector('select')
                    t.MNV=selectNV.value
                    data.doServices.push(t)
                }
            }
            data.cashier=currentStaff.MA
            data.time=orderTime.value
            data.MKH=user.MA
            data.plusMark=parseInt(user.DIEMTICHLUY)
            data.tlgg=tlgg
            console.log(data)
            let res=await fetch(apiPostContentBill,{
                method: 'POST', 
                body: JSON.stringify(data), 
                headers:{
                  'Content-Type': 'application/json'
                }
            })
            res=await res.json()
            res=res.mhd
            console.log(res)
            toastCus({
                title: "Th??nh c??ng!",
                message: `Th??m h??a ????n th??nh c??ng`,
                type: "success",
                duration: 3000
              });
            document.querySelector('.thd').innerHTML=`<div class='content'></div>`
            setTimeout(function() {openNewTab(`http://localhost:3000/test2?mhd=${res}`)},1000)
            

        }else{
            errMess.textContent='Ch???n ??t nh???t m???t d???ch v???'
            btnTHD.setAttribute('disabled',true)
        }
    }
    // Xu li su kien huy them hoa don
    btnHuyTHD.onclick=()=>{
        document.querySelector('.thd').innerHTML='<div class="content"></div>'
    }
}
dialogTHD_btn.onclick=async()=>{
    let inputValue=dialogTHD.querySelector('input')
    let inputFilter=dialogTHD.querySelector('select')
    let value=inputValue.value
    let filter=inputFilter.value;
    let data={value,filter}
    let res=await fetch(apiPostGuest,{
        method: 'POST', 
        body: JSON.stringify(data), 
        headers:{
            'Content-Type': 'application/json'
        }
    })
    let user=await res.json()
    console.log(user)

    if(Object.keys(user).length === 0){// k tim dc user
        
        toastCus({
            title: "Th???t b???i!",
            message: `Kh??ng t???n t???i kh??ch h??ng c?? ${inputFilter.value} l?? ${inputValue.value}`,
            type: "error",
            duration: 3000
          });
        return;
    }else{
        
    }

    let staff= await fetch(apiGetAvailableStaff)
    staff=await staff.json()

    let currentStaff=await fetch(apiGetCurrentStaff)
    currentStaff=await currentStaff.json()

    let services=await fetch(apiGetServices)
    services=await services.json()

    let thd=document.querySelector('.thd')
    let content=document.querySelector('.thd .content')
    content.style.borderWidth='1px'
    content.style.borderColor='red'
    content.style.borderStyle='solid'


    let nv=staff.map(item=>{
        return `   
            <option value='${item.MA}'>${item.MA}</option> 
        `
    })
    nv=nv.join('')
    kq=`
        <div class='d-flex justify-content-between'>
            <strong>T??n: ${user.TEN}</strong>
            <strong>M??: ${user.MA}</strong>
            <strong>SDT: ${user.SDT}</strong>
        </div>
        <hr>
    `
    let a={
        catToc:"C???T T??C",
        uonToc:"U???N T??C",
        nhuomToc:"NHU???M T??C",
        khac:"D???CH V??? KH??C",
    }
    for (let key in services) {
        if (services.hasOwnProperty(key)) {
            let selectNV=`<select  >${nv}</select>`
            
            kq+=`<h2>${a[key]}</h2>`
            let t=services[key].map((item)=>{
                return `
                    <div class='DV d-flex align-items-center ' >
                        <input class='mx-4' type='checkbox' name=${key} value=${item.MA} id=${item.MA} price=${item.GIA} plusMark=${item.DIEMCONGTICHLUY}>
                        <label class=' d-flex justify-content-between flex-grow-1 ' for=${item.MA}>
                            <div class='DV_info d-flex flex-column w-100 flex-grow-1  ' style='border-bottom: 1px solid #ccc '>
                                <div class='d-flex justify-content-between '>
                                    <h5 class='DV_info_name'>${item.TEN}</h5>
                                    <div class='DV_info_price'>${item.GIA}??</div>
                                </div>
                                <div class='DV_info_des'>
                                    ${item.MOTA}
                                </div>
                            </div>  
                        </label>
                        <div class='d-flex flex-column align-items-center ' style='padding-left:20px;'>
                            <label class='mb-1' style='width:110px' ><strong>NV th???c hi???n</strong></label>
                            ${selectNV}
                        </div> 
                    </div>    
                `
            })
            kq+=t.join('')   
        }  
    }
    kq+=`
        <div class='d-flex justify-content-between'>
            <span>Nh??n vi??n th???c hi???n:${currentStaff.MA}</span>
            <div>
                <label for='orderTime'> Ch???n ng??y gi??? c???t:</label>
                <input id='orderTime' type='datetime-local' name='orderTime' required>
            </div>
        </div>
        <div class='d-flex justify-content-between'>
            <span id='sumPrice'>T???ng ti???n: 0??</span>
            <span id=''>Gi???m gi??: ${user.TILE_GIAMGIA}%</span>
        </div>
        <div>
            <span id='currPrice'>Ti???n thanh to??n: 0??</span>
        </div>
        <div>
            <span id='errMess' style='display:block;color:red'></span>
        </div>
        <div>
            <button id='btnTHD' class='btn btn-primary'>Th??m h??a ????n</button>
            <button id='btnHuyTHD' class='btn btn-danger'>H???y</button>

        </div>
    `
    content.innerHTML=kq

    let errMess=document.querySelector('.thd #errMess')
    let btnTHD=document.querySelector('.thd #btnTHD')
    let btnHuyTHD=document.querySelector('.thd #btnHuyTHD')

    // Xu li thoi gian
    let orderTime=document.querySelector('.thd #orderTime')
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1).toString().padStart(2,0)+'-'+today.getDate().toString().padStart(2,0);
    var time = today.getHours().toString().padStart(2,0) + ":" + today.getMinutes().toString().padStart(2,0) ;
    var dateTime = date+'T'+time;
    orderTime.value=dateTime
    orderTime.onchange=()=>{
        errMess.textContent=''
        btnTHD.removeAttribute("disabled");

    }
    
    //X??? l?? click checkbox for
    let sumPrice=document.querySelector('#sumPrice')
    let currPrice=document.querySelector('#currPrice')
    let price=0;
    let inputsCheckbox=Array.from(document.querySelectorAll('.thd  input[type=checkbox]'))
    let tlgg=parseInt(user.TILE_GIAMGIA)
    
    for(let item of inputsCheckbox){
        item.onchange=function(e){
            errMess.textContent=''
            btnTHD.removeAttribute("disabled");

            if(item.getAttribute('name')!='khac'){
                let t=item.checked
                for(let item2 of inputsCheckbox ) if(item2.getAttribute('name')==item.getAttribute('name')){
                    item2.checked=false
                }
                item.checked=t;
            }
            price=0;
            for(let item2 of inputsCheckbox){ 
                let priceEle=parseInt(item2.getAttribute('price'))
                if(item2.checked) price+=priceEle
            }
            sumPrice.innerText='T???ng ti???n: ' +price+'??';
            currPrice.innerText=`Ti???n thah to??n: ${Math.ceil(price*(100-tlgg)/100)}??`  
        }
    }
    // Xu li su kien them hoa don
    btnTHD.onclick=async ()=>{
        // alert(`${orderTime.value}`)
        // console.log(orderTime.value)
        let time=orderTime.value;
        if(time=='') {
            errMess.textContent='Th???i gian kh??ng h???p l???'
            btnTHD.setAttribute('disabled',true)
            return

        }
        let kt=inputsCheckbox.some((item)=>{
            return item.checked
        })
        if(kt) {
            let data={}
            data.doServices=[]
            for(let item of inputsCheckbox){
                if(item.checked){
                    let t={}
                    t.MDV=item.getAttribute('value')
                    t.GIA=parseInt(item.getAttribute('price'))
                    t.plusMark=parseInt(item.getAttribute('plusMark'))

                    let parent =getParent(item,'.DV')
                    let selectNV=parent.querySelector('select')
                    t.MNV=selectNV.value
                    data.doServices.push(t)
                }
            }
            data.cashier=currentStaff.MA
            data.time=orderTime.value
            data.MKH=user.MA
            data.plusMark=parseInt(user.DIEMTICHLUY)
            data.tlgg=tlgg
            console.log(data)
            let res=await fetch(apiPostContentBill,{
                method: 'POST', 
                body: JSON.stringify(data), 
                headers:{
                  'Content-Type': 'application/json'
                }
            })
            res=await res.json()
            res=res.mhd
            console.log(res)
            toastCus({
                title: "Th??nh c??ng!",
                message: `Th??m h??a ????n th??nh c??ng`,
                type: "success",
                duration: 3000
              });
            document.querySelector('.thd').innerHTML=`<div class='content'></div>`
            setTimeout(function() {openNewTab(`http://localhost:3000/test2?mhd=${res}`)},1000)
            

        }else{
            errMess.textContent='Ch???n ??t nh???t m???t d???ch v???'
            btnTHD.setAttribute('disabled',true)
        }
    }
    // Xu li su kien huy them hoa don
    btnHuyTHD.onclick=()=>{
        document.querySelector('.thd').innerHTML='<div class="content"></div>'
    }
}
//                                   h??a ????n ?????t tr?????c                      ------------------------------------------------
let btnDT=document.querySelector('#btnDT')
btnDT.addEventListener('click',async (e)=>{
    resetBase()
    let content=document.querySelector('.hddt .content')
    let kq=`
        <div class='d-flex justify-content-between' >
            <div class='' style='width:260px'>
                <div class='bg-info' style='line-height: 38px;font-size: 20px;'>
                    L???c h??a ????n ?????t tr?????c theo
                </div>
                <select id='filter' name='filter' style='width: 100%;font-size: 16px;height: 38px;' >
                    <option value='dd' selected>H??a ????n ?????t tr?????c ??ang ?????t</option>
                    <option value='dh' >H??a ????n ?????t tr?????c ???? h???y</option>
                    <option value='ht' >H??a ????n ?????t tr?????c ho??n th??nh</option>
                </select>
            </div>
            <div class='d-flex flex-column p-1' style='border:1px red solid'>
                <div >
                    <label for='hourDelay'>X??a h??a ????n ?????t tr?????c qu?? h???n </label> <input  style='width:50px'type="number" id="quantity" name="quantity" value='3'> gi???
                </div>
                <div id='btnRemoveDelay' class='btn btn-danger mx-auto'>X??a</div>
            </div>
        </div>
        <div id='listBill' class='mt-5'></div>
    `
    content.innerHTML=kq
    let  listBill=content.querySelector('#listBill')

    async  function renderBill(filter){
        let kq2=''
        let res= await fetch(apiGetOnlineBill)
        res=await res.json()
        console.log(res)
        let {kqdd,kqdh,kqht}=res   
        let hddd=kqdd.map((item=>{
            let {billInfo,billData}=item;
            let tlgg=billInfo.TILE_GIAMGIA
            let price=0
            let table=billData.map((item,index)=>{
                price+=item.GIA
                return`
                    <tr>
                        <th scope="row">${index+1}</th>
                        <td>${item.TEN}</td>
                        <td>${item.GIA}</td>   
                    </tr>
                `
            })
            table=table.join('')
            let kq=`
                
                <div id='${billInfo.MA}' style='border:1px solid red;' class='mb-5'>
                    <div class='d-flex justify-content-between '>
                        <a id='btnXNDT' class='btn btn-success' data-id='${billInfo.MA}' href='#dialogTHDT' >Th???c hi???n</a>
                        <h3 style='color:blue'>??ang ?????t</h3>
                        <button id='btnHuyDT' class='btn btn-danger' data-id='${billInfo.MA}'>H???y</button>
                    </div>
                    <div class='d-flex justify-content-between '>
                        <strong>T??n: ${billInfo.TEN}</strong>
                        <strong>MKH: ${billInfo.MAKHACH}</strong>
                        <strong>SDT: ${billInfo.SDT}</strong>
                    </div>
                    <div class='d-flex justify-content-between'>
                        <strong>MHD: ${billInfo.MA}</strong>
                        <strong>Th???i gian ?????t: ${covertTime(billInfo.THOIGIAN)}</strong>   
                    </div>
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">T??n D???ch V???</th> 
                                <th scope="col">Gi?? Ti???n</th>   
                            </tr>
                        </thead>
                        <tbody>
                            ${table}
                        </tbody>
                    </table>
                    <div class='d-flex justify-content-between'>
                        <span>T???ng ti???n: ${price}??</span>
                        <span>Gi???m gi??: ${tlgg}%</span>
                    </div>
                    <span>Ti???n thanh to??n: ${Math.ceil(price*(100-tlgg)/100)}??</span>
                </div>
            `
            return kq
        }))
        hddd=hddd.join('')   
        let hddh=kqdh.map((item=>{
            let {billInfo,billData}=item;
            let tlgg=billInfo.TILE_GIAMGIA
            let price=0
            let table=billData.map((item,index)=>{
                price+=item.GIA
                return`
                    <tr>
                        <th scope="row">${index+1}</th>
                        <td>${item.TEN}</td>
                        <td>${item.GIA}</td>   
                    </tr>
                `
            })
            table=table.join('')
            let kq=`
                <div style='border:1px solid red;' class='mb-5'>
                    <div class=' text-center'>
                        
                        <h3 style='color:red'>???? H???y</h3>
                        
                    </div>
                    <div class='d-flex justify-content-between '>
                        <strong>T??n: ${billInfo.TEN}</strong>
                        <strong>MKH: ${billInfo.MAKHACH}</strong>
                        <strong>SDT: ${billInfo.SDT}</strong>
                    </div>
                    <div class='d-flex justify-content-between'>
                        <strong>MHD: ${billInfo.MA}</strong>
                        <strong>Th???i gian ?????t: ${covertTime(billInfo.THOIGIAN)}</strong>   
                    </div>
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">T??n D???ch V???</th> 
                                <th scope="col">Gi?? Ti???n</th>   
                            </tr>
                        </thead>
                        <tbody>
                            ${table}
                        </tbody>
                    </table>
                    <div class='d-flex justify-content-between'>
                        <span>T???ng ti???n: ${price}??</span>
                        <span>Gi???m gi??: ${tlgg}%</span>
                    </div>
                    <span>Ti???n thanh to??n: ${Math.ceil(price*(100-tlgg)/100)}??</span>
                </div>
            `
            return kq
        }))
        hddh=hddh.join('')   
        let hdht=kqht.map((item=>{
            let {billInfo,billData}=item;
            let tlgg=billInfo.TILE_GIAMGIA
            let price=0
            let table=billData.map((item,index)=>{
                price+=item.GIA
                return`
                    <tr>
                        <th scope="row">${index+1}</th>
                        <td>${item.TEN}</td>
                        <td>${item.GIA}</td>   
                    </tr>
                `
            })
            table=table.join('')
            let kq=`
                <div style='border:1px solid red;' class='mb-5'>
                    <div class=' text-center'>
                        
                        <h3 style=''>Ho??n th??nh</h3>
                        
                    </div>
                    <div class='d-flex justify-content-between '>
                        <strong>T??n: ${billInfo.TEN}</strong>
                        <strong>MKH: ${billInfo.MAKHACH}</strong>
                        <strong>SDT: ${billInfo.SDT}</strong>
                    </div>
                    <div class='d-flex justify-content-between'>
                        <strong>MHD: ${billInfo.MA}</strong>
                        <strong>Th???i gian ?????t: ${covertTime(billInfo.THOIGIAN)}</strong>   
                    </div>
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">T??n D???ch V???</th> 
                                <th scope="col">Gi?? Ti???n</th>   
                            </tr>
                        </thead>
                        <tbody>
                            ${table}
                        </tbody>
                    </table>
                    <div class='d-flex justify-content-between'>
                        <span>T???ng ti???n: ${price}??</span>
                        <span>Gi???m gi??: ${tlgg}%</span>
                    </div>
                    <span>Ti???n thanh to??n: ${Math.ceil(price*(100-tlgg)/100)}??</span>
                </div>
            `
            return kq
        }))
        hdht=hdht.join('')
        if(filter=='dd') kq2=hddd;
        if(filter=='dh') kq2=hddh;
        if(filter=='ht') kq2=hdht;
        listBill.innerHTML=kq2


        
        if(filter=='dd'){
            XNDT()
            HuyDT()
            RemoveDelay()
        }
        
        
    }
    async function XNDT(){
        let btnXNDTs=listBill.querySelectorAll('#btnXNDT')
        if(btnXNDTs){
            for(let item of btnXNDTs) item.onclick=async ()=>{
                let id=item.dataset.id
                let dialogTHDT=document.querySelector('#dialogTHDT')
                let orderBill=dialogTHDT.querySelector('#orderBill')

                let staff= await fetch(apiGetAvailableStaff)
                staff=await staff.json()

                let currentStaff=await fetch(apiGetCurrentStaff)
                currentStaff=await currentStaff.json()

                let nv=staff.map(item=>{
                    return `   
                        <option value='${item.MA}'>${item.MA}</option> 
                    `
                })
                nv=nv.join('')

                let res=await fetch(apiPostFindOnlineBill,{
                    method: 'POST', 
                    body: JSON.stringify({data:id}), 
                    headers:{
                        'Content-Type': 'application/json'
                    }
                })
                res=await res.json()
                console.log(res)
                console.log(id)
                let {billData,billInfo}=res.res

                
                let tlgg=billInfo.TILE_GIAMGIA
                let price=0;
                
                orderBill.style.borderWidth='1px'
                orderBill.style.borderColor='red'
                orderBill.style.borderStyle='solid'
                let table=billData.map((item,index)=>{
                    price+=item.GIA
                    return`
                        <tr class='item' data-DIEMCONGTICHLUY=${item.DIEMCONGTICHLUY} data-MDV=${item.MADV} data-GIA=${item.GIA}>
                            <th scope="row">${index+1}</th>
                            <td>${item.TEN}</td>
                            <td>${item.GIA}</td>   
                            <td>
                                <select>
                                    ${nv}
                                </select>
                            </td>
                        </tr>
                    `
                })
                table=table.join('')
                let kq=`
                    <div class='d-flex justify-content-between'>
                        <strong>T??n: ${billInfo.TEN}</strong>
                        <strong>MKH: ${billInfo.MAKHACH}</strong>
                        <strong>SDT: ${billInfo.SDT}</strong>
                    </div>
                    <div class='d-flex justify-content-between'>
                        <strong>MHD: ${billInfo.MA}</strong>
                    </div>
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">T??n D???ch V???</th>
                                <th scope="col">Gi?? Ti???n</th>   
                                <th scope="col">Nh??n Vi??n Th???c Hi???n</th> 
                            </tr>
                        </thead>
                        <tbody>
                            ${table}
                        </tbody>
                    </table>
                    <div>
                        <label for='orderTime'>Ch???n ng??y gi??? c???t</label>
                        <input id='orderTime' name="orderTime" type="datetime-local">
                    </div>
                    <div class='d-flex justify-content-between'>
                        <span>T???ng ti???n: ${price}??</span>
                        <span>Gi???m gi??: ${tlgg}%</span>
                    </div>
                    <div class='d-flex justify-content-between'>
                        <span>Ti???n thanh to??n: ${Math.ceil(price*(100-tlgg)/100)}??</span>
                        <span>Nh??n vi??n th???c hi???n:${currentStaff.MA}</span> 
                    </div>   
                `
                orderBill.innerHTML=kq
                let btnTHD=dialogTHDT.querySelector('#btnTHD')
                let orderTime=dialogTHDT.querySelector('#orderTime')
                orderTime.addEventListener('change',async (e)=>{
                    if(orderTime.value=='') btnTHD.setAttribute('disabled','true')
                    else{
                        btnTHD.removeAttribute('disabled')
                    }
                })
                btnTHD.onclick=async (e)=>{
                    let data={}
                    data.doServices=[]
                    data.time=orderTime.value
                    data.MKH=billInfo.MAKHACH
                    data.tlgg=tlgg
                    data.cashier=currentStaff.MA
                    data.plusMark=parseInt(billInfo.DIEMTICHLUY)
                    let select=dialogTHDT.querySelectorAll('td select')
                    select=Array.from(select)
                    for(let item of select){
                        console.log(item)
                        let t={}
                        t.MNV=item.value

                        let parent=getParent(item,'.item')
                        t.MDV=parent.dataset.mdv
                        t.GIA=parent.dataset.gia
                        t.plusMark=parseInt(parent.dataset.diemcongtichluy)
                        data.doServices.push(t)
                    }      
                    console.log(data)

                    let res=await fetch(apiPostContentBill,{
                        method: 'POST', 
                        body: JSON.stringify(data), 
                        headers:{
                          'Content-Type': 'application/json'
                        }
                    })
                    // res=await res.text()
                    // showSuccessToast(`${res}`)
                    // console.log(res)
                    
                    res=await res.json()
                    res=res.mhd
                    console.log(res)
                    toastCus({
                        title: "Th??nh c??ng!",
                        message: `Th??m h??a ????n th??nh c??ng`,
                        type: "success",
                        duration: 3000
                      });
                    // document.querySelector('.thd').innerHTML=`<div class='content'></div>`
                    setTimeout(function() {openNewTab(`http://localhost:3000/test2?mhd=${res}`)},1000)       




                    let completeBill=await fetch(apiPostCompleteOnlineBill,{
                        method: 'POST', 
                        body: JSON.stringify({data:id}), 
                        headers:{
                            'Content-Type': 'application/json'
                        }
                    })
                    completeBill=await completeBill.json()
                    btnTHD.setAttribute('disabled','true')
                    let hdHuy=listBill.querySelector(`#${id}`)

                    if(hdHuy) hdHuy.remove()
                                
                }
            }
        }
    }
    async function HuyDT(){
        let btnHuyDTs=listBill.querySelectorAll('#btnHuyDT')
        if(btnHuyDTs){
            for(let item of btnHuyDTs) item.addEventListener('click',async ()=>{
                let id=item.dataset.id
                console.log(id)
                let check=confirm(`X??c nh???n h???y h??a ????n ?????t tr?????c ${id}`)
                if(check==false) return
                let res=await fetch(apiPostRemoveOnlineBill,{
                    method: 'POST', 
                    body: JSON.stringify({data:id}), 
                    headers:{
                        'Content-Type': 'application/json'
                    }
                })
                res=await res.json()
                let hdHuy=listBill.querySelector(`#${id}`)
                if(hdHuy) hdHuy.remove()

            })
        }

    }
    async function RemoveDelay(){
        
        btnRemoveDelay.onclick=async(e)=>{
            let btnRemoveDelay=content.querySelector('#btnRemoveDelay')
            let data=content.querySelector('#quantity').value
            console.log(data)
            let res=await fetch(apiPostRemoveOnlineDelayBill,{
                method: 'POST', 
                body: JSON.stringify({data}), 
                headers:{
                    'Content-Type': 'application/json'
                }
            })
            res=await res.json()
            if(res.res==0){
                showErrorToast(`Kh??ng c?? h??a ????n ?????t tr?????c n??o qu?? h???n ${data} gi???`)
                return
            }
            showSuccessToast(`???? x??a ${res.res} h??a ????n ?????t tr?????c qu?? h???n`)
            renderBill('dd')
            // renderBill('dh')
        }
    }
    


    let select=content.querySelector('select')
    let filter=select.value
    if(filter=='dd')renderBill('dd')
    if(filter=='dh')renderBill('dh')
    if(filter=='ht')renderBill('ht')
    select.addEventListener('change',async(e)=>{
        let filter=select.value
        console.log(filter)
        if(filter=='dd')renderBill('dd')
        if(filter=='dh')renderBill('dh')
        if(filter=='ht')renderBill('ht')
    });

    
})

//                                   dialog tra cuu tt khach hang           -------------------------------------------------
let btnDialogTCKH=document.querySelector('a[href="#dialogTCKH"][purpose="dialog"]')
btnDialogTCKH.onclick= ()=>{
    createDatalisttUserMainInfo(`#dialogTCKH #datalistOptionsTCKH`,apiGetUserMainInfo)
}
let dialogTCKH=document.getElementById('dialogTCKH')
let dialogTCKH_btn=dialogTCKH.querySelector('.form #dialogTCKH_XN')
dialogTCKH_btn.addEventListener('click',async (e)=>{
    let inputValue=dialogTCKH.querySelector('input')
    let inputFilter=dialogTCKH.querySelector('select')
    let value=inputValue.value
    let filter=inputFilter.value;
    let data={value,filter}
    let res=await fetch(apiPostGuest,{
        method: 'POST', 
        body: JSON.stringify(data), 
        headers:{
            'Content-Type': 'application/json'
        }
    })
    let user=await res.json()
    console.log(user)
    if(isEmptyObj(user)){
        showErrorToast(`kh??ch h??ng ${filter} l?? ${value} kh??ng t???n t???i`)
        return
    }
    let userData=dialogTCKH.querySelector('#data')
    
    let kq=`
        <form id='formTCKH' method='post'>
            <div  class='row' style='width:597px'>
                <div class='col-6 d-flex flex-column'>
                    <label for="id">M?? kh??ch h??ng</label>
                    <input id='id' type='text' value=${user.MA} name='id' disabled>
                </div>
                <div class='col-6 d-flex flex-column form-group'>
                    <label for="fullname">T??n</label>
                    <input id='fullname' type='text' value='${user.TEN}' name='fullname' rules='required|childMaxLength:7|maxLength:30'>
                    <span class='form-message'></span>
                </div>
                <div class='col-6 d-flex flex-column form-group'>
                    <label for="phone">SDT</label>
                    <input id='phone' type='text' value=${user.SDT} name='phone' rules='required|phone'>
                    <span class='form-message'></span>
                </div>
                <div class='col-6 d-flex flex-column'>
                    <label for="gender">Gi???i t??nh</label>
                    <select id='gender'>
                        <option value='Nam'>Nam</option>
                        <option value='N???'>N???</option>
                        <option value='Kh??c'>Kh??c</option>
                    </select>
                </div>
                <div class='col-6 d-flex flex-column'>
                    <label for="type">Lo???i kh??ch</label>
                    <input id='type' type='text' value='${user.TENLOAI}' name='type' disabled>
                </div>
                <div class='col-6 d-flex flex-column'>
                    <label for="score">??i???m t??ch l??y</label>
                    <input id='score' type='text' value=${user.DIEMTICHLUY} name='score' disabled>
                </div>
                <div class='col-6 d-flex flex-column'>
                    <label for="rate">T??? l??? gi???m gi?? (%)</label>
                    <input id='rate' type='text' value=${user.TILE_GIAMGIA} name='rate' disabled>
                </div>
            </div>   
            <div class='d-flex mt-3'>
                <button class='btn btn-primary mx-auto editBtn' type="submit">Ch???nh s???a</button>
            </div>     
        </form>

    `
    userData.innerHTML =kq
    let phone=dialogTCKH.querySelector('#phone')
    let dialogTCKH_btnXN=dialogTCKH.querySelector('.editBtn')

    validator('#formTCKH',{
        run:async ()=>{
            phone.addEventListener('input',async (e)=>{
                let data=phone.value
                console.log(data)
                let regex=/((09|03|07|08|05)+([0-9]{8})\b)/g
                if(regex.test(data)==false) return;
                if(data==user.SDT){
                    dialogTCKH_btnXN.removeAttribute('disabled')   
                    return
                } 
                let res=await fetch(apiPostPhone,{
                    method: 'POST', 
                    body: JSON.stringify({data:data}), 
                    headers:{
                      'Content-Type': 'application/json'
                    }
                })
                res=await res.json()
                let formGroup=getParent(e.target,'.form-group')
                let formMessage=formGroup.querySelector('.form-message')
                if(res.res){//sdt da ton tai
                    formGroup.classList.add('invalid')
                    formMessage.innerText='SDT ???? t???n t???i'    
                    dialogTCKH_btnXN.setAttribute('disabled',true)   
                }else{
                    dialogTCKH_btnXN.removeAttribute('disabled')   
                }
                console.log(res)
            })
            
        },
        submit:async ()=>{
            let fullname=dialogTCKH.querySelector('#fullname').value
            let phone=dialogTCKH.querySelector('#phone').value
            let gender=dialogTCKH.querySelector('#gender').value
            let id=dialogTCKH.querySelector('#id').value


            let res=await fetch(apiPostEditGuest,{
                method: 'POST', 
                body: JSON.stringify({fullname,id,phone,gender}), 
                headers:{
                    'Content-Type': 'application/json'
                }
            })
            res=await res.json()
            if(res.res){
                showSuccessToast(`Ch???nh s???a th??ng tin kh??ch h??ng ${phone} th??nh c??ng`)
            }
            console.log(res)
        }
    })
    

})
//                                     dialog tra c???u nh??n vien                 --------------------------------------------------
let btnDialogTCNV=document.querySelector('a[href="#dialogTCNV"][purpose="dialog"]')
if(btnDialogTCNV)    btnDialogTCNV.onclick= ()=>{
    createDatalisttUserMainInfo(`#dialogTCNV #datalistOptionsTCNV`,apiGetStaffMainInfo)
}
let dialogTCNV=document.getElementById('dialogTCNV')
let dialogTCNV_btn=dialogTCNV.querySelector('.formFilter #dialogTCNV_XN')
dialogTCNV_btn.addEventListener('click',async (e)=>{
    let inputValue=dialogTCNV.querySelector('.formFilter input')
    let inputFilter=dialogTCNV.querySelector(' .formFilter select')
    let value=inputValue.value
    let filter=inputFilter.value;
    let btnDel=dialogTCNV.querySelector('#btnDel')
    let btnEdit=dialogTCNV.querySelector('#btnEdit')

    let data={value,filter}
    let res=await fetch(apiPostStaff,{
        method: 'POST', 
        body: JSON.stringify(data), 
        headers:{
            'Content-Type': 'application/json'
        }
    })
    let staff=await res.json()
    console.log(staff)
    if(isEmptyObj(staff)){
        showErrorToast(`kh??ch h??ng ${filter} l?? ${value} kh??ng t???n t???i`)
        return
    }
    let formTCNV=dialogTCNV.querySelector('form')
    formTCNV.style.display='block'
    let inputs=dialogTCNV.querySelectorAll('#formTCNV input')
    inputs=Array.from(inputs)
    let gender=dialogTCNV.querySelector('#gender')
    let phone=dialogTCNV.querySelector('#phone')
    let type=dialogTCNV.querySelector('#type')
    let isWork=dialogTCNV.querySelector('#isWork')

    let convert={
        gender:'GIOITINH',
        id:'MA',
        identityCard:"CMND",
        address:'DIACHI',
        email:'EMAIL',
        type:'LOAINHANVIEN',
        password:'MATKHAU',
        birth:'NGAYSINH',
        phone:'SDT',
        account:'TAIKHOAN',
        fullname:'TEN',
        isWork:'TRANGTHAI'

    }
    
    inputs.forEach(item=>{
        item.value=staff[convert[item.name]]
    })
    gender.value=staff.GIOITINH
    type.value=staff.LOAINHANVIEN
    isWork.value=isWork.value=='1'?'??ang l??m vi???c':'???? ngh?? vi???c'
    
    if(staff.TRANGTHAI==0){
        btnDel.setAttribute('disabled',true)
    }else{
        btnDel.removeAttribute('disabled')
    }
    btnDel.onclick=async(e)=>{
        console.log('123')
        e.preventDefault()
        
        let res=await fetch(apiPostRemoveStaff,{
            method: 'POST', 
            body: JSON.stringify({data:staff.MA}), 
            headers:{
                'Content-Type': 'application/json'
            }
        })
        res=await res.json()
        console.log(res)
        if(res.res){
            showSuccessToast(`X??a nh??n vi??n m?? ${staff.MA} th??nh c??ng`)
            btnDel.setAttribute('disabled',true)
            isWork.value='???? ngh?? vi???c'
            
        }
    }

    validator('#formTCNV',{
        run:async ()=>{
            phone.addEventListener('input',async (e)=>{
                let data=phone.value
                console.log(data)
                let regex=/((09|03|07|08|05)+([0-9]{8})\b)/g
                if(regex.test(data)==false) return;
                if(data==staff.SDT){
                    btnEdit.removeAttribute('disabled')   
                    return
                } 
                let res=await fetch(apiPostPhoneStaff,{
                    method: 'POST', 
                    body: JSON.stringify({data:data}), 
                    headers:{
                      'Content-Type': 'application/json'
                    }
                })
                res=await res.json()
                let formGroup=getParent(e.target,'.form-group')
                let formMessage=formGroup.querySelector('.form-message')
                if(res.res){//sdt da ton tai
                    formGroup.classList.add('invalid')
                    formMessage.innerText='SDT ???? t???n t???i'    
                    btnEdit.setAttribute('disabled',true)   
                }else{
                    btnEdit.removeAttribute('disabled')   
                }
                console.log(res)
            })
            
        },
        submit:async ()=>{
            let inputs=dialogTCNV.querySelectorAll('#formTCNV input')
            inputs=Array.from(inputs)

            let gender=dialogTCNV.querySelector('#gender')
            let phone=dialogTCNV.querySelector('#phone')
            let type=dialogTCNV.querySelector('#type')
            
            let data={}
            data.id=staff.id
            inputs.forEach(item =>{
                data[item.name]=item.value
            })
            data.gender=gender.value
            data.type=type.value
            console.log(data)


            let res=await fetch(apiPostEditStaff,{
                method: 'POST', 
                body: JSON.stringify(data), 
                headers:{
                    'Content-Type': 'application/json'
                }
            })
            res=await res.json()
            console.log(res)
            if(res.res){
                showSuccessToast(`Ch???nh s???a th??ng tin nh??n vi??n ${staff.MA} th??nh c??ng`)
                // resetInput(...inputs)
                
            }
        }
    })
    

})
//                                    dialog them khach h??ng                    -----------------------------------------------
let dialogTKH=document.getElementById('dialogTKH')
let btnDialogTKH=document.querySelector('a[href="#dialogTKH"][purpose="dialog"]')
btnDialogTKH.addEventListener('click',async()=>{
    console.log('btnDialogTKH')
    let dialogTKH_btnXN=dialogTKH.querySelector('.form button')
    let dialogTKH_btnHuy=dialogTKH.querySelector('#btnHuy')
    let form=dialogTKH.querySelector('form')
    let phone=dialogTKH.querySelector('.form #phone')
    validator('#formTKH',{
        run:async ()=>{
            phone.addEventListener('input',async (e)=>{
                let data=phone.value
                console.log(data)
                let regex=/((09|03|07|08|05)+([0-9]{8})\b)/g
                if(regex.test(data)==false) return;
                let res=await fetch(apiPostPhone,{
                    method: 'POST', 
                    body: JSON.stringify({data:data}), 
                    headers:{
                      'Content-Type': 'application/json'
                    }
                })
                res=await res.json()
                let formGroup=getParent(e.target,'.form-group')
                let formMessage=formGroup.querySelector('.form-message')
                if(res.res){//sdt da ton tai
                    formGroup.classList.add('invalid')
                    formMessage.innerText='SDT ???? t???n t???i'    
                    dialogTKH_btnXN.setAttribute('disabled',true)   
                }else{
                    dialogTKH_btnXN.removeAttribute('disabled')   
                }
                console.log(res)
            })
        },
        submit:async()=>{
            let fullname=dialogTKH.querySelector('#fullname')
            let phone=dialogTKH.querySelector('#phone')
            let gender=dialogTKH.querySelector('#gender')
            let data={fullname:fullname.value,phone:phone.value,gender:gender.value}
            let res=await fetch(apiPostAddGuest,{
                method: 'POST', 
                body: JSON.stringify(data), 
                headers:{
                    'Content-Type': 'application/json'
                }
            })
            res=await res.json()
            console.log(res)
            if(res.res){
                showSuccessToast(`Th??m kh??ch h??ng ${phone.value} th??nh c??ng`)
                fullname.value=""
                phone.value=''
                
            }

        }
    })
    
    
})
//                                      dialog them nhan vien                   -------------------------------------------
let dialogTNV=document.getElementById('dialogTNV')
let btnDialogTNV=document.querySelector('a[href="#dialogTNV"][purpose="dialog"]')
if(btnDialogTNV)    btnDialogTNV.addEventListener('click',async()=>{
    console.log('11111')
    let dialogTNV_btnXN=dialogTNV.querySelector('.form button')
    let dialogTNV_btnHuy=dialogTNV.querySelector('#btnHuy')
    let form=dialogTNV.querySelector('form')
    let phone=dialogTNV.querySelector('.form #phone')
    let account=dialogTNV.querySelector('.form #account')

    validator('#formTNV',{
        run:async ()=>{
            phone.addEventListener('input',async (e)=>{
                let data=phone.value
                console.log(data)
                let regex=/((09|03|07|08|05)+([0-9]{8})\b)/g
                if(regex.test(data)==false) return;
                let res=await fetch(apiPostPhoneStaff,{
                    method: 'POST', 
                    body: JSON.stringify({data:data}), 
                    headers:{
                      'Content-Type': 'application/json'
                    }
                })
                res=await res.json()
                console.log(res)
                let formGroup=getParent(e.target,'.form-group')
                let formMessage=formGroup.querySelector('.form-message')
                if(res.res){//sdt da ton tai
                    formGroup.classList.add('invalid')
                    formMessage.innerText='SDT ???? t???n t???i'    
                    dialogTNV_btnXN.setAttribute('disabled',true)   
                }else{
                    dialogTNV_btnXN.removeAttribute('disabled')   
                }

            })
            account.addEventListener('input',async (e)=>{
                let data=account.value
                console.log(data)
                let regex=/[0-9a-zA-Z]{6,12}/g
                if(regex.test(data)==false) return;
                let res=await fetch(apiPostAccount,{
                    method: 'POST', 
                    body: JSON.stringify({data:data}), 
                    headers:{
                      'Content-Type': 'application/json'
                    }
                })
                res=await res.json()
                console.log(res)
                let formGroup=getParent(e.target,'.form-group')
                let formMessage=formGroup.querySelector('.form-message')
                if(res.res){//sdt da ton tai
                    formGroup.classList.add('invalid')
                    formMessage.innerText='T??i kho???n ???? t???n t???i'    
                    dialogTNV_btnXN.setAttribute('disabled',true)   
                }else{
                    dialogTNV_btnXN.removeAttribute('disabled')   
                }

            })
        },
        submit:async()=>{
            let inputs=dialogTNV.querySelectorAll('input')
            inputs=Array.from(inputs)
            let gender=dialogTNV.querySelector('#gender')
            let phone=dialogTNV.querySelector('#phone')
            let type=dialogTNV.querySelector('#type')
            
            let data={}
            inputs.forEach(item =>{
                data[item.name]=item.value
            })
            data.gender=gender.value
            data.type=type.value
            console.log(data)

            let res=await fetch(apiPostAddStaff,{
                method: 'POST', 
                body: JSON.stringify(data), 
                headers:{
                    'Content-Type': 'application/json'
                }
            })
            res=await res.json()
            console.log(res)
            if(res.res){
                showSuccessToast(`Th??m nh??n vi??n ${phone.value} th??nh c??ng`)
                resetInput(...inputs)
                
            }

        }
    })
    
    
})
//                                       dialog tra cuu hoa don                 ----------------------------------------------
let btnDialogTCHD=document.querySelector('a[href="#dialogTCHD"][purpose="dialog"]')
btnDialogTCHD.onclick= ()=>{
    resetBase()
    createDatalisttUserMainInfo(`#dialogTCHD #datalistOptionsTCHD`,apiGetBillMainInfo)
}
let dialogTCHD=document.getElementById('dialogTCHD')
let dialogTCHD_btn=dialogTCHD.querySelector('.form #dialogTHD_XN')
let dialogTCHD_btnHuy=dialogTCHD.querySelector('.form #dialogTHD_Huy')
dialogTCHD_btn.addEventListener('click',async (e)=>{
    
    let input =dialogTCHD.querySelector('#value')
    let data=input.value
    let res=await fetch(apiPostBill,{
        method: 'POST', 
        body: JSON.stringify({data:data}), 
        headers:{
          'Content-Type': 'application/json'
        }
    })
    res=await res.json()
    console.log(res)
    if(Object.keys(res.res).length === 0){//MHD sai
        showErrorToast(`MHD ${data} kh??ng t???n t???i`)
        return
    }else{//MHD dung

    }
    console.log(res.res)

    let {billData,billInfo}=res.res

    let tchd=document.querySelector('.tchd')
    let tlgg=billInfo.TILE_GIAMGIA
    let price=0;
    let content=tchd.querySelector('.content')
    content.style.borderWidth='1px'
    content.style.borderColor='red'
    content.style.borderStyle='solid'
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
            <strong>T??n: ${billInfo.TEN}</strong>
            <strong>MKH: ${billInfo.MAKHACH}</strong>
            <strong>SDT: ${billInfo.SDT}</strong>
        </div>
        <div class='d-flex justify-content-between'>
            <strong>MHD: ${billInfo.MA}</strong>
            <strong>Nh??n vi??n thu ng??n: ${billInfo.MANV}</strong>   
        </div>
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">T??n D???ch V???</th>
                    <th scope="col">Nh??n Vi??n Th???c Hi???n</th>  
                    <th scope="col">Gi?? Ti???n</th>   

                </tr>
            </thead>
            <tbody>
                ${table}
            </tbody>
        </table>
        <div>Th???i gian: ${covertTime(billInfo.THOIGIAN)}</div>
        <div class='d-flex justify-content-between'>
            <span>T???ng ti???n: ${price}??</span>
            <span>Gi???m gi??: ${tlgg}%</span>
        </div>
        <span>Ti???n thanh to??n: ${Math.ceil(price*(100-tlgg)/100)}??</span>
    `
    content.innerHTML=kq

})
//                                      dialog xoa hoa don            -----------------------------------------
let btnDialogXHD=document.querySelector('a[href="#dialogXHD"][purpose="dialog"]')
if(btnDialogXHD)    btnDialogXHD.onclick= ()=>{
    createDatalisttUserMainInfo(`#dialogXHD #datalistOptionsXHD`,apiGetBillMainInfo)
}
let dialogXHD=document.getElementById('dialogXHD')
let dialogXHD_btn=dialogXHD.querySelector('.form #dialogXHD_XN')
let dialogXHD_btnHuy=dialogXHD.querySelector('.form #dialogXHD_Huy')
dialogXHD_btn.addEventListener('click',async (e)=>{
    let dataDiv=dialogXHD.querySelector('#data')
    let input =dialogXHD.querySelector('#value')
    let data=input.value
    let res=await fetch(apiPostBill,{
        method: 'POST', 
        body: JSON.stringify({data:data}), 
        headers:{
          'Content-Type': 'application/json'
        }
    })
    res=await res.json()
    console.log(res)
    if(Object.keys(res.res).length === 0){//MHD sai
        showErrorToast(`MHD ${data} kh??ng t???n t???i`)
        dataDiv.innerHTML=''
        return
    }else{//MHD dung

    }
    console.log(res.res)

    let {billData,billInfo}=res.res
    let tlgg=billInfo.TILE_GIAMGIA
    let price=0;
    dataDiv.style.borderWidth='1px'
    dataDiv.style.borderColor='red'
    dataDiv.style.borderStyle='solid'
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
            <strong>T??n: ${billInfo.TEN}</strong>
            <strong>MKH: ${billInfo.MAKHACH}</strong>
            <strong>SDT: ${billInfo.SDT}</strong>
        </div>
        <div class='d-flex justify-content-between'>
            <strong>MHD: ${billInfo.MA}</strong>
            <strong>Nh??n vi??n thu ng??n: ${billInfo.MANV}</strong>   
        </div>
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">T??n D???ch V???</th>
                    <th scope="col">Nh??n Vi??n Th???c Hi???n</th>  
                    <th scope="col">Gi?? Ti???n</th>   

                </tr>
            </thead>
            <tbody>
                ${table}
            </tbody>
        </table>
        <div>Th???i gian: ${covertTime(billInfo.THOIGIAN)}</div>
        <div class='d-flex justify-content-between'>
            <span>T???ng ti???n: ${price}??</span>
            <span>Gi???m gi??: ${tlgg}%</span>
        </div>
        <span>Ti???n thanh to??n: ${Math.ceil(price*(100-tlgg)/100)}??</span>
        <div class='text-center mt-4'>
            <button id='btnXoaHD' class='btn btn-danger'>X??a</button>
        </div>
    `
    dataDiv.innerHTML=kq
    let btnXoaHD=dialogXHD.querySelector('#btnXoaHD')
    btnXoaHD.addEventListener('click',async (e)=>{
        let res=await fetch(apiPostRemoveBill,{
            method: 'POST', 
            body: JSON.stringify({data:billInfo.MA}), 
            headers:{
              'Content-Type': 'application/json'
            }
        })
        res=await res.json();
        console.log(res)
        if(res.res){
            showSuccessToast(`X??a h??a ????n ${billInfo.MA} th??nh c??ng`)
            dataDiv.innerHTML=''
        }
    })

})
//                                      dialog th???ng k?? doanh thu               ----------------------------------------------
let btnDialogTKDT=document.querySelector('a[href="#dialogTKDT"][purpose="dialog"]')
btnDialogTKDT.addEventListener('click',()=>{
    resetBase()
})
let dialogTKDT=document.querySelector('#dialogTKDT')
let dialogTKDTYear=dialogTKDT.querySelector('#year')
dialogTKDTYear.addEventListener('keydown',async(e)=>{
    // console.log(e)
    if(!('0'<=e.key&&e.key<='9')){
        e.preventDefault();
    }
})
btnDialogTKDT.addEventListener('click',async()=>{
    tabs()
    let dialogTKDT_XN=dialogTKDT.querySelector('#dialogTKDT_XN')
    dialogTKDT_XN.addEventListener('click',async (e)=>{
        
        let input =dialogTKDT.querySelectorAll('.tab-pane.active input')
        input=Array.from(input)
        input.forEach(item=>{
            if(item.value=='') {
                e.preventDefault();
                return
            }   
        })
        if(input.length==2&&input[0].value>input[1].value){
            e.preventDefault();
                return
        }
        let data=input.map(item=>{
            return{[item.name]:item.value}
        })
        console.log(data)

        let timeString=''
        input.forEach(item=>{
             timeString+=(item.value+' ')
        })
        let res=await fetch(apiPostDate,{
            method: 'POST', 
            body: JSON.stringify({data}), 
            headers:{
                'Content-Type': 'application/json'
            }
        })
        res=await res.json();
        console.log(res)
        let tongHD=res.tongHD
        let tongTien=0

        res=res.res
        console.log(res,tongHD)
        let tkhd=document.querySelector('.tkhd')
        let content=tkhd.querySelector('.content')
        
        let kq=res.map((item=>{
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
                <div style='border:1px solid red;' class='mb-5'>
                    <div class='d-flex justify-content-between '>
                        <strong>T??n: ${billInfo.TEN}</strong>
                        <strong>MKH: ${billInfo.MAKHACH}</strong>
                        <strong>SDT: ${billInfo.SDT}</strong>
                    </div>
                    <div class='d-flex justify-content-between'>
                        <strong>MHD: ${billInfo.MA}</strong>
                        <strong>Nh??n vi??n thu ng??n: ${billInfo.MANV}</strong>   
                    </div>
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">T??n D???ch V???</th>
                                <th scope="col">Nh??n Vi??n Th???c Hi???n</th>  
                                <th scope="col">Gi?? Ti???n</th>   

                            </tr>
                        </thead>
                        <tbody>
                            ${table}
                        </tbody>
                    </table>
                    <div>Th???i gian: ${covertTime(billInfo.THOIGIAN)}</div>
                    <div class='d-flex justify-content-between'>
                        <span>T???ng ti???n: ${price}??</span>
                        <span>Gi???m gi??: ${tlgg}%</span>
                    </div>
                    <span>Ti???n thanh to??n: ${Math.ceil(price*(100-tlgg)/100)}??</span>
                </div>
            `
            return kq
        }))
        kq=kq.join('')
        kq=`
            <div class='mb-5' style='border:1px blue solid;'>
                <h3 class='text-center'>Th???ng k?? doanh thu ${timeString}</h3>
                <div class='d-flex justify-content-between'>
                    <span>T???ng s??? h??a ????n: ${tongHD}</span>
                    <button id='longPro' class='btn btn-warning pb-0'  )>Xu???t file pdf</button>
                    <span>T???ng doanh thu: ${tongTien}??</span>

                </div>
            </div>`+kq
        content.innerHTML=kq
        let btnOpenNewTab=content.querySelector('#longPro')//
        btnOpenNewTab.onclick=()=>{
            openNewTab(`http://localhost:3000/test3?time=${timeString}`)
            
        }

    })
})
//                                          dialog dang xuat                       ----------------------------------------
let btnDialogDX=document.querySelector('a[href="#dialogDX"][purpose="dialog"]')
let dialogDX=document.querySelector('#dialogDX')
btnDialogDX.addEventListener('click',(e)=>{
    let dialogDX_XN=dialogDX.querySelector('#dialogDX_XN')
    console.log(dialogDX_XN)

    dialogDX_XN.addEventListener('click',async(e)=>{
        console.log(123)
        // e.preventDefault()

    })
})











//---------------------------------------------------------------

function toastCus({ title = "", message = "", type = "info", duration = 3000 }) {
    const main = document.getElementById("toastCus");
    if (main) {
      const toastCus = document.createElement("div");
  
      // Auto remove toast
      const autoRemoveId = setTimeout(function () {
        main.removeChild(toastCus);
      }, duration + 1000);
  
      // Remove toast when clicked
      toastCus.onclick = function (e) {
        if (e.target.closest(".toastCus__close")) {
          main.removeChild(toastCus);
          clearTimeout(autoRemoveId);
        }
      };
  
      const icons = {
        success: "fas fa-check-circle",
        info: "fas fa-info-circle",
        warning: "fas fa-exclamation-circle",
        error: "fas fa-exclamation-circle"
      };
      const icon = icons[type];
      const delay = (duration / 1000).toFixed(2);
  
      toastCus.classList.add("toastCus", `toastCus--${type}`);
      toastCus.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${delay}s forwards`;
  
      toastCus.innerHTML = `
                      <div class="toastCus__icon">
                          <i class="${icon}"></i>
                      </div>
                      <div class="toastCus__body">
                          <h3 class="toastCus__title">${title}</h3>
                          <p class="toastCus__msg">${message}</p>
                      </div>
                      <div class="toastCus__close">
                          <i class="fas fa-times"></i>
                      </div>
                  `;
      main.appendChild(toastCus);
    }
}
function validator(formSelector,options={}){
    console.log('validator')
    if(isObjhas(options,'run')){
        options.run()
    }
    let formRules={   
    };
    let formElement = document.querySelector(formSelector)
    console.log(formElement)
    function getParent(element,selector){
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement
            }
            element=element.parentElement
        }

    }
    // input kh??ng nh???n k?? t??? space
    let inputNoSpace=formElement.querySelectorAll('[inputNoSpace]')
    for(let input of inputNoSpace){
        input.onkeydown=function(e){
            if(e.key==' '){
                e.preventDefault();
            }
        }
    }
    // input kh??ng nh???n k?? t??? 2space
    let inputNo2Space=formElement.querySelectorAll('[inputNo2Space]')
    for(let input of inputNo2Space){
        input.onkeydown=function(e){
            if(e.key==' '){
                let value=e.target.value
                if(value.length==0&&value[0]==' ') {
                    e.preventDefault();
                    return
                }
                if(value.length>0&&value[value.length-1]==' '){
                    e.preventDefault();
                    return
                }   
            }
        }
    }
    let validatorRules={
        required:function(value){
            return value?undefined:'Vui l??ng nh???p tr?????ng n??y';
        },
        email:function(value){
            let regex=/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
            return regex.test(value)?undefined:'Email kh??ng ????ng';
        },
        phone:function(value){
            let regex=/((09|03|07|08|05)+([0-9]{8})\b)/g
            return regex.test(value)?undefined:'S??? ??i???n tho???i kh??ng ????ng ';
        },
        digits:function(limit){
            return function(value){
                let regexs={
                    '3':/^\d{3}$/,
                    '9':/^\d{9}$/,
                    '10':/^\d{10}$/,
                }
                return regexs[limit].test(value)?undefined:'Nh???p sai ?????nh d???ng';
                
            }
        },
        length:function(max){
            return function(value){
                return value.length==max?undefined:`Vui l??ng nh???p ch??nh x??c ${max} k?? t???`;
            }
        },
        equal:function(selector){
            return function(value){
                let originEleValue=document.querySelector(selector).value
                return value==originEleValue?undefined:'M???t kh???u x??c th???c kh??ng ch??nh x??c'
            }
        },
        minLength:function(min){
            return function(value){
                return value.length>=min?undefined:`Vui l??ng nh???p ??t nh???t ${min} k?? t???`;   
            }
        },
        min:function(min){
            return function(value){
                return value>=min?undefined:`Vui l??ng nh???p l???n h??n ho???c b???ng ${min}`;   
            }
        },
        maxLength:function(max){
            return function(value){
                return value.length<=max?undefined:`Vui l??ng nh???p nhi???u nh???t ${max} k?? t???`;
            }
        },
        max:function(max){
            return function(value){
                return value<=max?undefined:`Vui l??ng nh???p b?? h??n ho???c b???ng ${max}`;
            }
        },
        childMaxLength:function(max){
            return function(value){
                let kq=undefined;
                let childs=value.split(' ')
                for(let item of childs){
                    if(item.length<=max){

                    }else{
                        kq='Kh??ng h???p l???'
                        break;
                    }
                }
                return kq;
            }
        },    
    };
    let inputs=formElement.querySelectorAll('[name][rules]')
    for(let  input of inputs){
        let rules=input.getAttribute('rules').split('|')
        for(let rule of rules){
            let ruleInfo
            let isRuleHasValue=rule.includes(':');
            if(isRuleHasValue){
                ruleInfo=rule.split(':');
                rule=ruleInfo[0]
            }
            let ruleFunc=validatorRules[rule]
            if(isRuleHasValue){
                ruleFunc=ruleFunc(ruleInfo[1])
            }
            if(Array.isArray(formRules[input.name])){
                formRules[input.name].push(ruleFunc)
            }else{
                formRules[input.name]=[ruleFunc];
            }
        }
        //Lang nghe su kien
        input.onblur=handleValidate
        input.oninput=handleClearError
    }
    // ham thuc hien Validate
    function handleValidate(e){
        let rules=formRules[e.target.name];
        let errorMessage
        // Trim
        e.target.value=e.target.value.trim()
        // X??a dau cach du thua
        e.target.value=e.target.value.replace(/ {2,}/g,' ')
        for(let rule of rules){
            errorMessage= rule(e.target.value)
            if(errorMessage) break;
        }
        // Neu co loi thi hien thi message ra UI
        if(errorMessage){
            let formGroup=getParent(e.target,'.form-group')
            if(formGroup){
                formGroup.classList.add('invalid')
                let formMessage=formGroup.querySelector('.form-message')
                if(formMessage){
                    formMessage.innerText=errorMessage
                }
            }   
        }else{

        }
        return !errorMessage;
    }
    // Clear message loi
    function handleClearError(e){
        let formGroup=getParent(e.target,'.form-group')
        if(formGroup.classList.contains('invalid')){
            formGroup.classList.remove('invalid')
            let formMessage=formGroup.querySelector('.form-message')
            if(formMessage){
                formMessage.innerText=""
            }
        }
    }

    let btnSubmit=formElement.querySelector('[type="submit"]')
    formElement.onsubmit=function(e){
        e.preventDefault();
        let inputs=formElement.querySelectorAll('[name][rules]')
        let isValid=true
        for(let  input of inputs){
            let kt=handleValidate({
                target:input
            }) 
            if(kt==false)  isValid=false  
            
        }
        // Khi khong co loi thi submit form
        if(isValid){
            if(isObjhas(options,'submit')){
                console.log('submit fetch')
                options.submit()
            }else{
                console.log('submit form')

                formElement.submit();
            }

        }
    }
}
function tabs(){
        
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);

    const tabs = $$(".tab-item");
    const panes = $$(".tab-pane");

    const tabActive = $(".tab-item.active");

    tabs.forEach((tab, index) => {
        const pane = panes[index];

        tab.onclick = function () {
            $(".tab-item.active").classList.remove("active");
            $(".tab-pane.active").classList.remove("active");

           

            this.classList.add("active");
            pane.classList.add("active");
        };
    });
}




