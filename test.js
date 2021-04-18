var x=document.querySelectorAll('input[type=radio]')
console.log(x)
for(let i=0;i<x.length;i++){
    x[i].onclick=function(e){
        // console.log(e)
        e.target.preventDefault()
        // e.target.checked=!e.target.checked
        // if(x[i].checked) x[i].checked=false;
        console.log()
        // e.preventDefault()
        // if(e.target.checked) e.target.checked=false;
        
    }
}

var today = new Date();
    var date=today.getFullYear()+'-'+(today.getMonth()+1).toString().padStart(2,0)+'-'+today.getDate().toString().padStart(2,0)
    var time = today.getHours() + ":" + today.getMinutes() 
    var dateTime = date+' '+time;
    var a=document.querySelector('#aaa')
    a.onblur=function(e){
    console.log( e.target.value)//2000-04-30T22:37
    var dates= e.target.value.split('T')
    var date=dates[0].split('-')
    var time=dates[1].split(':')
    var d = new Date(date[0], parseInt(date[1])-1, date[2], time[0], time[1]);
    console.log(d)
    console.log(d.getTime()-today.getTime())
    

}

console.log(today.getTime())

