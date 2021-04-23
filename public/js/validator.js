function Validator(formSelector,options={}){
    var formRules={
        
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
    var validatorRules={
        required:function(value){
            return value?undefined:'Vui long nhập trường này';
        },
        email:function(value){
            var regex=/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
            return regex.test(value)?undefined:'Email không đúng';
        },
        phone:function(value){
            var regex=/(84|0[3|5|7|8|9])+([0-9]{8})\b/
            return regex.test(value)?undefined:'Số điện thoại không đúng ';
        },
        digits9:function(value){
            var regex=/^\d{9}$/
            return regex.test(value)?undefined:'Nhập sai định dạng';
        },
        size:function(max){
            return function(value){
                return value.length==max?undefined:`Vui lòng nhập chính xác ${max} kí tự`;
            }
        },
        equal:function(selector){
            return function(value){
                var originEleValue=document.querySelector(selector).value
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
        
        
    };
    // Lay ra formElement
    var formElement = document.querySelector(formSelector)
    // Chi xu li khi co formElement
    if(formElement){
        var inputs=formElement.querySelectorAll('[name][rules]')
        for(var  input of inputs){
            var rules=input.getAttribute('rules').split('|')
            for(var rule of rules){
                var ruleInfo
                var isRuleHasValue=rule.includes(':');
                if(isRuleHasValue){
                    ruleInfo=rule.split(':');
                    rule=ruleInfo[0]
                }
                var ruleFunc=validatorRules[rule]
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
            var rules=formRules[e.target.name];
            var errorMessage
            for(var rule of rules){
                errorMessage= rule(e.target.value)
                if(errorMessage) break;
            }
            
            // Neu co loi thi hien thi message ra UI
            if(errorMessage){
                var formGroup=getParent(e.target,'.form-group')
                if(formGroup){
                    formGroup.classList.add('invalid')
                    var formMessage=formGroup.querySelector('.form-message')
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
            var formGroup=getParent(e.target,'.form-group')
            if(formGroup.classList.contains('invalid')){
                formGroup.classList.remove('invalid')
                var formMessage=formGroup.querySelector('.form-message')
                if(formMessage){
                    formMessage.innerText=""
                }
            }
        }
        
        console.log(formRules)
    }
    // Xu li hanh vi submit form
    formElement.onsubmit=function(e){
        e.preventDefault();
        var inputs=formElement.querySelectorAll('[name][rules]')
        var isValid=true,isValid2=true;
        for(var  input of inputs){

            isValid2=handleValidate({
                target:input
            })
            if(isValid2==false){isValid=false}
            
        }



        // Khi khong co loi thi submit form
        if(isValid){
            // if(typeof options.onSubmit==='function'){
            //     var enableInputs = formElement.querySelectorAll('[name]');
            //     var formValues = Array.from(enableInputs).reduce(function (values, input) {
            //         switch(input.type) {
            //             case 'radio':
            //                 values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
            //                 break;
            //             case 'checkbox':
            //                 if (!input.matches(':checked')) {
            //                     values[input.name] = '';
            //                     return values;
            //                 }
            //                 if (!Array.isArray(values[input.name])) {
            //                     values[input.name] = [];
            //                 }
            //                 values[input.name].push(input.value);
            //                 break;
            //             case 'file':
            //                 values[input.name] = input.files;
            //                 break;
            //             default:
            //                 values[input.name] = input.value;
            //         }

            //         return values;
            //     }, {});

            //     options.onSubmit(formValues)
            //     formElement.submit();
            // }
            // else{ 
            //     formElement.submit();
            // }
            formElement.submit();
        }
    }
}