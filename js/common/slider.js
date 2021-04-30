var spages = 1;
var shtml = '';
var sloading = false;//防止上滑加载连击
var sloadable = true
var loadings = true

var loadData1 = function (a) {}
var slider = {
	creat: function (obj) {
		var { loadData, loading = false, refresh = false, height, width } = obj
		if (typeof loadData === "function") {
            loadData1 = loadData
        }

		// 渲染DOM
	   let shtml1 = `<div class="infinite weui-pull-to-refresh" id="listwrap">
			<div class="weui-pull-to-refresh__layer">
				<div class="weui-pull-to-refresh__arrow"></div>
				<div class="weui-pull-to-refresh__preloader"></div>
				<div class="down">下拉刷新</div>
				<div class="up">释放刷新</div>
				<div class="refresh">正在刷新</div>
			</div>
			<div id="Tolist"></div>
			<div class="weui-loadmore">
				<i class="weui-loading"></i>
				<span class="weui-loadmore__tips">正在加载</span>
			</div>
			<div class="loadnone">
				<img class="loadnone_img" alt="暂无更多数据" src="zp_app/images/zwgd.png"/>
				<div class="loadnone_text">暂无更多数据</div>
			</div>
		</div>`
		$(".scontent").append(shtml1)

		$(".scontent").height(obj.height).width(obj.width)
		$(".infinite").height($(".scontent").height() + $(".weui-pull-to-refresh__layer").innerHeight())
		
		loadlist();
	   
	    if (obj.refresh == false) {
	    	$("#listwrap").removeClass("infinite")
	    }
		// 下拉刷新
		$(".infinite").pullToRefresh().on("pull-to-refresh", function () {
	       setTimeout(function () {
	           spages = 1;
	           sloadable = true;
	           $(".weui-loadmore__tips").html('正在加载');
	           $("#Tolist").html("");
			   loadings = true
			   $(".loadnone").hide()
	           loadlist();
	           if (loading) loading = false;
	           $(".infinite").pullToRefreshDone();// 重置下拉刷新
	       }, 200);  //模拟延迟
	   });
	   // 滚动加载
	   $("#listwrap").infinite().on("infinite", function () {
	       if (obj.loading == false || sloading || !loadings) return;
	       sloading = true;
	       spages++;//页数
	       $('.weui-loadmore').show();
	       setTimeout(function () {
	           loadlist();
	           sloading =false;
			   $('.weui-loadmore').hide();
	       }, 200);  //模拟延迟
	   });
	}
}
    
function loadlist() {
	loadData1()
	if(shtml == '' || sloadable == false){
		if(spages == 1){
			$(".loadnone_img").show()
		}else{
			$(".loadnone_img").hide()
		}
		$(".loadnone").css("display","flex")
		$(".weui-loadmore").hide()
		sloadable = false
		loadings = false
	}else{
		sloadable = true
	   $("#Tolist").append(shtml);
	   $(".weui-loadmore").hide();
	}
}