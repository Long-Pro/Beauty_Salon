function Validator(formSelector,options={}){

    let formElement =document.querySelector(formSelector)
    let inputsCheckbox=Array.from(document.querySelectorAll('input[type=checkbox]'))
    let inputsRadio=Array.from(document.querySelectorAll('input[type=radio]'))
    let inputs=[].concat(inputsCheckbox,inputsRadio)
    let isValid=true;
    var errMess=document.querySelector('#errMess')
    errMess.style.color='red'
    errMess.style.fontWeight='100'
    errMess.style.fontSize='14px'
    inputs.forEach(function(item){
        item.onclick=(e)=>{
            errMess.innerText=''
        }
    })

    
    
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
        if(isValid){
                
            formElement.submit();
        }else{
            errMess.innerText='Bạn chưa chọn dịch vụ nào'
        }

    }
}


let inputsCheckbox=Array.from(document.querySelectorAll('input[type=checkbox]'))
let inputsRadio=Array.from(document.querySelectorAll('input[type=radio]'))
let inputs=[].concat(inputsCheckbox,inputsRadio)
let sumPrice=document.querySelector('#sumPrice')
let currPrice=document.querySelector('#currPrice')
let price=0;
let tlgg=parseInt(document.querySelector('#userInfo').getAttribute('tlgg'))
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

