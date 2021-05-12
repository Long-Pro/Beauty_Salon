

/////////////////////////////////////////////////////////////////////////////////
function Validator(formSelector,options={}){

    let formElement =document.querySelector(formSelector)
    let inputsCheckbox=Array.from(document.querySelectorAll('input[type=checkbox]'))
    let inputsRadio=Array.from(document.querySelectorAll('input[type=radio]'))
    let inputs=[].concat(inputsCheckbox,inputsRadio)
    let isValid=false,isValidTG=false;
    var errMess=document.querySelector('#errMess')
    errMess.style.color='red'
    errMess.style.fontWeight='100'
    errMess.style.fontSize='14px'
    inputs.forEach(function(item){
        item.onclick=(e)=>{
            errMess.innerText=''
        }
    })
    var today = new Date();
    var date=today.getFullYear()+'-'+(today.getMonth()+1).toString().padStart(2,0)+'-'+today.getDate().toString().padStart(2,0)
    var tg=document.querySelector('#orderTime')
    tg.onblur=function(e){
        console.log( e.target.value)//2000-04-30T22:37
        errMess.innerText=''
        var dates= e.target.value.split('T')
        var date=dates[0].split('-')
        var time=dates[1].split(':')
        var d = new Date(date[0], parseInt(date[1])-1, date[2], time[0], time[1]);
        console.log(d+'--'+today)
        var x=(d.getTime()-today.getTime())
        console.log(x)
        if(x>=1000*60*60*24*3||x<=1000*60*60) isValidTG=false;else isValidTG=true;   
        if(isValidTG==false) errMess.innerText='Thời gian đặt trước tối thiểu 1 tiếng và tối đa 3 ngày'
    }

    
    
    formElement.onsubmit=function(e){
        e.preventDefault();
        
        
        
        if(inputsCheckbox.every((item,index)=>{
            return item.checked==false
        })
        &&
        inputsRadio.every((item,index)=>{
            return item.checked==false
        })) isValid=false;else isValid=true;

        
        // Khi khong co loi thi submit form
        if(isValid&&isValidTG){
                
            formElement.submit();
        }else if(isValid==false){
            errMess.innerText='Bạn chưa chọn dịch vụ nào'
        }else if(isValidTG==false){
            errMess.innerText='Thời gian đặt trước tối thiểu 1 tiếng và tối đa 3 ngày'

        }

    }
}


let inputsCheckbox=Array.from(document.querySelectorAll('input[type=checkbox]'))
let inputsRadio=Array.from(document.querySelectorAll('input[type=radio]'))
let inputs=[].concat(inputsCheckbox,inputsRadio)
let sumPrice=document.querySelector('#sumPrice')
let currPrice=document.querySelector('#currPrice')
let price=0;
let tlgg=parseInt(document.querySelector('#tlgg').getAttribute('tlgg'))
for(let item of inputs){
    let priceEle=parseInt(item.getAttribute('price'))
    if(item.checked) price+=priceEle;
    sumPrice.innerText='Tổng tiền: ' +price+'đ';
    currPrice.innerText=`Tiền thah toán: ${Math.ceil(price*(100-tlgg)/100)}đ`
}
for(let item of inputs){
    item.onchange=function(e){
        if(item.getAttribute('name')!='khacDV'){
            let t=item.checked
            for(let item2 of inputs ) if(item2.getAttribute('name')==item.getAttribute('name')){
                item2.checked=false
            }
            item.checked=t;
        }
        price=0;
        for(let item2 of inputs){ 
            let priceEle=parseInt(item2.getAttribute('price'))
            if(item2.checked) price+=priceEle
        }
        sumPrice.innerText='Tổng tiền: ' +price+'đ';
        currPrice.innerText=`Tiền thah toán: ${Math.ceil(price*(100-tlgg)/100)}đ`


 
    }
}



