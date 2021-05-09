function Validator(formSelector,options={}){
    let formRules={
        
    };
    function getParent(element,selector){
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement
            }
            element=element.parentElement
        }

    }
    /**
     * Quy uoc tao rule:
     * -neu co loi thi return 'error message'
     * -neu k loi thi return undefined
     */
    let validatorRules={
        required:function(value){
            return value?undefined:'Vui long nhập trường này';
        },
        email:function(value){
            let regex=/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
            return regex.test(value)?undefined:'Email không đúng';
        },
        phone:function(value){
            let regex=/(84|0[3|5|7|8|9])+([0-9]{8})\b/
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
        size:function(max){
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
        min:function(min){
            return function(value){
                return value.length>=min?undefined:`Vui lòng nhập ít nhất ${min} kí tự`;   
            }
        },
        max:function(max){
            return function(value){
                return value.length<=max?undefined:`Vui lòng nhập nhiều nhất ${max} kí tự`;
            }
        },
        childMax:function(max){
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
    // Lay ra formElement
    let formElement = document.querySelector(formSelector)
    // Chi xu li khi co formElement
    if(formElement){
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
                //Lang nghe su kien
                input.onblur=handleValidate
                input.oninput=handleClearError
                

            }

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
        // input không nhận kí tự space
        let inputsNoSpace=formElement.querySelectorAll('[inputNoSpace]')
        for(let input of inputsNoSpace){
            input.onkeydown=function(e){
                if(e.key==' '){
                    e.preventDefault();
                }
            }
        }
    }
    // Xu li hanh vi submit form
    formElement.onsubmit=function(e){
        e.preventDefault();
        let inputs=formElement.querySelectorAll('[name][rules]')
        let isValid=true,isValid2=true;
        for(let  input of inputs){

            isValid2=handleValidate({
                target:input
            })
            if(isValid2==false){isValid=false}
            
        }
        // Khi khong co loi thi submit form
        if(isValid){
            formElement.submit();
        }
    }
}