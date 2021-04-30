/**
 * 提示弹窗
 * @param content 提示内容
 * @param spleed 关闭时间
 * @param url 可设置自己的图片
 * @returns
 */
var stmsToast=function({spleed,content,url}){
	var imgHtml="";
	//默认关闭时间
	var spleeds = spleed||3000;
	imgHtml='<img class="alertImg" src="'+ url + '" height="20%;text-align:center">';
	$("body")
	.append(
		'<div class="weui-mask weui-mask--visible"></div>'
			+ '<div class="weui-dialog weui-dialog--visible" style="height:180px;width:204px">'
			+ '<div class="con-div" style="margin-top: 17%">'
			+ imgHtml
			+ '<p style="text-align:center;margin-top:8px;">'
			+ content + '</p>' + '</div></div>');
	setTimeout(function() {
		$(".weui-mask,.weui-dialog").remove();
	}, spleeds);
}
/**
 * 提示弹窗
 * @param title 提示标题
 * @param content 提示内容
 * @param buttons 按钮组 可设置ClassName自定义class属性，onlick自定义点击事件
 * @returns
 */
var stmsTipModal=function({title,content,buttons}){
	var buttonsHtml = buttons.map(function(d, i) {
	      return '<a href="javascript:;" class="weui-dialog__btn ' + (d.className || "") + '">' + d.text + '</a>';
	    }).join("");
	var tpl = '<div class="weui-mask weui-mask--visible">'
			+ '  <div class="weui-dialog weui-dialog--visible" style="height:180px;width:220px">'
			+ '    <div class="weui-dialog__hd" style="padding: 1.5em 1.6em 1em;">'
			+ '      <strong class="weui-dialog__title">'+ title +'</strong>'
			+ '    </div>'
			+ '    <div class="weui-dialog__bd" style="padding: 0 1.6em 1.8em;">'+ content +'</div>'
			+ '    <div class="weui-dialog__ft" >'
			+         buttonsHtml
			+ '    </div>'
			+ '</div>'
			+ '</div>';
	var dialog = $(tpl).appendTo(document.body);
	dialog.find(".weui-dialog__btn").each(function(i, e) {
	      var el = $(e);
	      el.click(function() {
	        //先关闭对话框，再调用回调函数
	    	  $(".weui-mask,.weui-dialog").remove();
	        if(buttons[i].onClick) {
	          buttons[i].onClick.call(dialog);
	        }
	      });
	 });

}