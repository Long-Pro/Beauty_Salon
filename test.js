let demo=document.querySelector('#demo')
console.log([demo])
let api='http://localhost:3000/test'
let api2='https://jsonplaceholder.typicode.com/users'
// fetch(api)
//     .then((response) =>{
//         return response.json()
//     })
//     .then((response)=>{
//         console.log(response)
//         let t=response.map((item)=>{
//             return `<p>${item.TEN}</p>`
//         })
//         t=t.join('')

//         demo.innerHTML=t
//     })
let test=document.querySelector('#test')
test.onkeydown=function(e){
    console.log(e)
    if(e.key==' '){
        e.preventDefault();
        let t=e.target.value
        
        // e.target.value=t.substring(0, t.length - 1);
    }
}
