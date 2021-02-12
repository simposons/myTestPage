var GRXX=1; //个人信息新增标志位 主要用来计数自增来更改每个对象的id，使得每个id不同
var grxxList=[];// 给后台传参的集成数组
$(async function(){
   await $("#xingbie1").searchableSelect();//美化首个下拉框  
}
)
function toPage(){
   console.log('111')
   // window.location.href='step1.html'
}
function toPage1(){
   console.log('22222')
   // window.location.href='step2.html'
}