var footText=['1111','22222','33333','4444'];
var footI=0;
$(function(){
  footTextChange()
})
// 底部字体循环
function footTextChange(){
  $.ajax({
    type: "GET",
    url: "js/words.txt",
    dataType: "json",
    success: function (data) {
        console.log('data==========',data);
    },
    error: function(){
     console.log('error')     
    }
});
  if(footI<=footText.length){
    setTimeout(()=>{
    $("#foot_text").text(footText[footI])
    footI++
    footTextChange()
    },1000000)
  }else{
    footI=0;
    $("#foot_text").text(footText[footI])
    footTextChange()
  }
}