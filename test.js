let inputs=document.querySelectorAll('input[name="vehicle"]')
for(let item of inputs){
    item.onchange=()=>{
        let t=item.checked
        for(let item2 of inputs) item2.checked=false;
        item.checked=t
    }
}
let cars=document.querySelector('#cars')
cars.onchange=function(e){
    console.log(cars.value)
}