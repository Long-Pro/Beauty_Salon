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
    function isEmptyObj(object) {
        return Object.keys(object).length === 0?true:false;
     }
    function isObjhas(object, key) {
        if(isEmptyObj(object)) return false;
        return object ? hasOwnProperty.call(object, key) : false;
    }
    // input không nhận kí tự space
    let inputNoSpace=formElement.querySelectorAll('[inputNoSpace]')
    for(let input of inputNoSpace){
        input.onkeydown=function(e){
            if(e.key==' '){
                e.preventDefault();
            }
        }
    }
    // input không nhận kí tự 2space
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
            return value?undefined:'Vui lòng nhập trường này';
        },
        email:function(value){
            let regex=/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
            return regex.test(value)?undefined:'Email không đúng';
        },
        phone:function(value){
            let regex=/((09|03|07|08|05)+([0-9]{8})\b)/g
            return regex.test(value)?undefined:'Số điện thoại không đúng ';
        },
        digits:function(limit){
            return function(value){
                let regexs={
                    '3':/^\d{3}$/,
                    '9':/^\d{9}$/,
                    '10':/^\d{10}$/,
                }
                return regexs[limit].test(value)?undefined:'Nhập sai định dạng';
                
            }
        },
        length:function(max){
            return function(value){
                return value.length==max?undefined:`Vui lòng nhập chính xác ${max} kí tự`;
            }
        },
        equal:function(selector){
            return function(value){
                let originEleValue=document.querySelector(selector).value
                return value==originEleValue?undefined:'Mật khẩu xác thực không chính xác'
            }
        },
        minLength:function(min){
            return function(value){
                return value.length>=min?undefined:`Vui lòng nhập ít nhất ${min} kí tự`;   
            }
        },
        min:function(min){
            return function(value){
                return value>=min?undefined:`Vui lòng nhập lớn hơn hoặc bằng ${min}`;   
            }
        },
        maxLength:function(max){
            return function(value){
                return value.length<=max?undefined:`Vui lòng nhập nhiều nhất ${max} kí tự`;
            }
        },
        max:function(max){
            return function(value){
                return value<=max?undefined:`Vui lòng nhập bé hơn hoặc bằng ${max}`;
            }
        },
        childMaxLength:function(max){
            return function(value){
                let kq=undefined;
                let childs=value.split(' ')
                for(let item of childs){
                    if(item.length<=max){

                    }else{
                        kq='Không hợp lệ'
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
        // Xóa dau cach du thua
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
        console.log(isValid)
        // Khi khong co loi thi submit form
        if(isValid){
            if(isObjhas(options,'submit')){
                console.log('submit fetch')
                options.submit()
            }else{
                if(options.valiCode){
                    var txt;
                    var txt = prompt("Nhập mã xác thực đươc gửi về SDT:", "");
                    if(txt=='123456'){
                        console.log('submit form')
                        formElement.submit();
                    }else{
                        alert("MÃ xác thực không đúng");
                        return
                    }

                }else{
                    console.log('submit form')
                    formElement.submit();
                }

                
            }

        }
    }
}
