var colorChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']; //颜色
var footI = 0;
var time = 100000; //延时时间
$(function () {
  footTextChange()
  initPage()
})
// 底部字体循环
function footTextChange() {
  $.ajax({
    type: "GET",
    url: "../txt/words.json",
    dataType: "json",
    success: function (data) {
      console.log('data==========', data);
     footPage(data)
    },
    error: function () {
      console.log('error')
    }
  });
}
function footPage(footList){
  let color = generateMixed(6)
  let backgroundColor = colorReverse(color)
  if (footI === 0) {
    $("#foot_text").text(footList[footI].text).css("color", "#" + color).css("background-color", "#" + backgroundColor)
    footI++
    footPage(footList)
  } else if (footI < footList.length) {
    setTimeout(() => {
      $("#foot_text").text(footList[footI].text).css("color", "#" + color).css("background-color", "#" + backgroundColor)
      footI++
      footPage(footList)
    }, time)
  } else {
    footI = 0;
    $("#foot_text").text(footList[footI].text).css("color", "#" + color).css("background-color", "#" + backgroundColor)
    footPage(footList)
  }
}
// 随机颜色
function generateMixed(n) {
  var res = "";
  for (var i = 0; i < n; i++) {
    var id = Math.ceil(Math.random() * 16);
    res += colorChars[id];
  }
  return res;
}
// 取颜色的反色
function colorReverse(oldColor) {
  var oldColor = '0x' + oldColor.replace(/#/g, '');
  var str = '000000' + (0xFFFFFF - oldColor).toString(16);
  return str.substring(str.length - 6, str.length);
}

function initPage() {
  $.ajax({
    type: 'GET',
    url: '../txt/block.json',
    dataType: 'json',
    success: function (data) {
      console.log('data==========', data);
      let dataList = data
      if (dataList.length) {
        let html = ''
        $.each(dataList, function (index,item ) {
          html = '<div class="block">' +
            '<div class="block_content">' +
            '</div>' +
            '<div class="block_text"><a href="'+item.url+'">'+item.title+'</a></div>' +
            '</div>'
            console.log('html',html,item)
          $('#blockPage').append(html)
        })
      }
    },
    error: function () {
      console.log('error')
    }
  })
}