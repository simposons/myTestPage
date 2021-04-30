
(function($){

  // a case insensitive jQuery :contains selector
  $.expr[":"].searchableSelectContains = $.expr.createPseudo(function(arg) {
    return function( elem ) {
      return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
  });
   
  /*$.expr[":"].searchableSelectContains = function(obj,index,meta){  
     return $(obj).text().toUpperCase().indexOf(meta[3].toUpperCase()) >= 0;
  };*/
   
 
  $.searchableSelect = function(element, options) {
    this.element = element;
    this.options = options || {};
    this.init();
 
    var _this = this;
 
    this.searchableElement.click(function(event){
      // event.stopPropagation();
      _this.show();
    }).on('keydown', function(event){
      if (event.which === 13 || event.which === 40 || event.which == 38){
        event.preventDefault();
        _this.show();
      }
    });
 
    $(document).on('click', null, function(event){
      if(_this.searchableElement.has($(event.target)).length === 0)
        _this.hide();
    });
 
    this.input.on('keydown', function(event){
      event.stopPropagation();
      if(event.which === 13){         //enter
        event.preventDefault();
        _this.selectCurrentHoverItem();
        _this.hide();
      } else if (event.which == 27) { //ese
        _this.hide();
      } else if (event.which == 40) { //down
        _this.hoverNextItem();
      } else if (event.which == 38) { //up
        _this.hoverPreviousItem();
      }
    }).on('keyup', function(event){
      if(event.which != 13 && event.which != 27 && event.which != 38 && event.which != 40)
        _this.filter();
    })
  }
 
  var $sS = $.searchableSelect;
 
  $sS.fn = $sS.prototype = {
    version: '0.0.1'
  };
 
  $sS.fn.extend = $sS.extend = $.extend;
 
  $sS.fn.extend({
    init: function(){
      var _this = this;
      this.element.hide();
 
      this.searchableElement = $('<div tabindex="0" class="searchable-select"></div>');
      this.holder = $('<div class="searchable-select-holder"></div>');
      this.dropdown = $('<div class="searchable-select-dropdown searchable-select-hide"></div>');
      this.header = $('<div class="header1"></div>')
      this.input = $('<input type="text" class="searchable-select-input" />');
      // this.img = $('<img arc="zp_app/images/big_glass.svg" class="searchable-select-img" />');
      this.items = $('<div class="searchable-select-items"></div>');
      this.caret = $('<span class="searchable-select-caret"></span>');
 
      this.scrollPart = $('<div class="searchable-scroll"></div>');
      this.hasPrivious = $('<div class="searchable-has-privious">...</div>');
      this.hasNext = $('<div class="searchable-has-next">...</div>');
 
      this.hasNext.on('mouseenter', function(){
        _this.hasNextTimer = null;
 
        var f = function(){
          var scrollTop = _this.items.scrollTop();
          _this.items.scrollTop(scrollTop + 20);
          _this.hasNextTimer = setTimeout(f, 50);
        }
 
        f();
      }).on('mouseleave', function(event) {
        clearTimeout(_this.hasNextTimer);
      });
 
      this.hasPrivious.on('mouseenter', function(){
        _this.hasPriviousTimer = null;
 
        var f = function(){
          var scrollTop = _this.items.scrollTop();
          _this.items.scrollTop(scrollTop - 20);
          _this.hasPriviousTimer = setTimeout(f, 50);
        }
 
        f();
      }).on('mouseleave', function(event) {
        clearTimeout(_this.hasPriviousTimer);
      });
      this.dropdown.append(this.header);
      this.dropdown.append(this.input);
      // this.dropdown.append(this.img);
      this.dropdown.append(this.scrollPart);
 
      this.scrollPart.append(this.hasPrivious);
      this.scrollPart.append(this.items);
      this.scrollPart.append(this.hasNext);
 
      this.searchableElement.append(this.caret);
      this.searchableElement.append(this.holder);
      this.searchableElement.append(this.dropdown);
      this.element.after(this.searchableElement);
 
      this.buildItems();
      this.setPriviousAndNextVisibility();
    },
 
    filter: function(){
      var text = this.input.val();
      this.items.find('.searchable-select-item').addClass('searchable-select-hide');
      if(text != ''){
        this.items.find('.searchable-select-item:searchableSelectContains('+text+')').removeClass('searchable-select-hide');
      }else{
        this.items.find('.searchable-select-item').removeClass('searchable-select-hide'); 
      }
      if(this.currentSelectedItem.hasClass('searchable-select-hide') && this.items.find('.searchable-select-item:not(.searchable-select-hide)').length > 0){
        this.hoverFirstNotHideItem();
      }
 
      this.setPriviousAndNextVisibility();
    },
 
    hoverFirstNotHideItem: function(){
      this.hoverItem(this.items.find('.searchable-select-item:not(.searchable-select-hide)').first());
    },
 
    selectCurrentHoverItem: function(){
      if(!this.currentHoverItem.hasClass('searchable-select-hide'))
        this.selectItem(this.currentHoverItem);
    },
 
    hoverPreviousItem: function(){
      if(!this.hasCurrentHoverItem())
        this.hoverFirstNotHideItem();
      else{
        var prevItem = this.currentHoverItem.prevAll('.searchable-select-item:not(.searchable-select-hide):first')
        if(prevItem.length > 0)
          this.hoverItem(prevItem);
      }
    },
 
    hoverNextItem: function(){
      if(!this.hasCurrentHoverItem())
        this.hoverFirstNotHideItem();
      else{
        var nextItem = this.currentHoverItem.nextAll('.searchable-select-item:not(.searchable-select-hide):first')
        if(nextItem.length > 0)
          this.hoverItem(nextItem);
      }
    },
 
    buildItems: function(){
      var _this = this;
      this.element.find('option').each(function(){
        var item = $('<div class="searchable-select-item" data-value="'+$(this).attr('value')+'">'+$(this).text()+'</div>');
 
        if(this.selected){
          _this.selectItem(item);
          _this.hoverItem(item);
        }
 
        item.on('mouseenter', function(){
          $(this).addClass('hover');
        }).on('mouseleave', function(){
          $(this).removeClass('hover');
        }).click(function(event){
          event.stopPropagation();
          _this.selectItem($(this));
          _this.hide();
        });
 
        _this.items.append(item);
      });
 
      this.items.on('scroll', function(){
        _this.setPriviousAndNextVisibility();
      })
    },
    show: function(){
      this.dropdown.removeClass('searchable-select-hide');
      this.input.focus();
      this.status = 'show';
      this.setPriviousAndNextVisibility();
      this.dropdown.css('z-index', 100); //打开下拉列表时调高z-index层级
    },
 
    hide: function(){
      if(!(this.status === 'show'))
        return;
 
//      if(this.items.find(':not(.searchable-select-hide)').length === 0)
//          this.input.val('');
      this.dropdown.addClass('searchable-select-hide');
      this.searchableElement.trigger('focus');
      this.status = 'hide';
      this.dropdown.css('z-index', 1); //关闭下拉列表时恢复z-index层级
    },
 
    hasCurrentSelectedItem: function(){
      return this.currentSelectedItem && this.currentSelectedItem.length > 0;
    },
 
    selectItem: function(item){
      if(this.hasCurrentSelectedItem())
        this.currentSelectedItem.removeClass('selected');
 
      this.currentSelectedItem = item;
      item.addClass('selected');
 
      this.hoverItem(item);
 
      this.holder.text(item.text());
      var value = item.data('value');
      this.holder.data('value', value);
      this.element.val(value);
      
      this.element.trigger('change');
 
      if(this.options.afterSelectItem){
        this.options.afterSelectItem.apply(this);
      }
    },
 
    hasCurrentHoverItem: function(){
      return this.currentHoverItem && this.currentHoverItem.length > 0;
    },
 
    hoverItem: function(item){
      if(this.hasCurrentHoverItem())
        this.currentHoverItem.removeClass('hover');
 
      if(item.outerHeight() + item.position().top > this.items.height())
        this.items.scrollTop(this.items.scrollTop() + item.outerHeight() + item.position().top - this.items.height());
      else if(item.position().top < 0)
        this.items.scrollTop(this.items.scrollTop() + item.position().top);
 
      this.currentHoverItem = item;
      item.addClass('hover');
    },
 
    setPriviousAndNextVisibility: function(){
      if(this.items.scrollTop() === 0){
        this.hasPrivious.addClass('searchable-select-hide');
        this.scrollPart.removeClass('has-privious');
      } else {
        this.hasPrivious.removeClass('searchable-select-hide');
        this.scrollPart.addClass('has-privious');
      }
 
      if(this.items.scrollTop() + this.items.innerHeight() >= this.items[0].scrollHeight){
        this.hasNext.addClass('searchable-select-hide');
        this.scrollPart.removeClass('has-next');
      } else {
        this.hasNext.removeClass('searchable-select-hide');
        this.scrollPart.addClass('has-next');
      }
    }
  });
 
  $.fn.searchableSelect = function(options){
    this.each(function(){
      var sS = new $sS($(this), options);
    });
 
    return this;
  };
 
})(jQuery);

var url = "STMS/common/common/bmxxcx$m=query.service"
/**
 * 下拉选择框的onchange方法
 * @param obj 当前元素
 * @param type  选择框名字
 */
function lxOnchange(obj, type) {
  var val = obj.value
  $(`#${type}Input`).val(val).change().focus().blur()
}

/**
 * 编码表查询
 * @param divId 当前元素
 * @param params  调编码表查询需要传的参数
 * @param dataSource   不调接口需要传数据源
 * @param flag  ajax请求是否同步。false:异步 不传/true：同步
 * @param cxurl  查询的接口 默认是编码表查询
 * @constructor
 */
function selectBMsearch(divId, params,dataSource ,flag,cxurl) {

  if(dataSource && dataSource.length > 0){
    // 自己拼数据
    renderSelect(dataSource,divId)
  }else{
    // 先渲染一个空的，防止页面初始加载出来的样式不好看
    renderSelect([],divId)
    // 调接口
    // 给参数默认值，解决ie不兼容
    if (flag == undefined) {
      flag = true
    }
    var list = { ...params}

    $.ajax({
      // 请求方式
      type : "POST",
      // 请求的媒体类型
      contentType : "application/json;charset=UTF-8",
      // 请求地址
      url : cxurl?cxurl:url,
      // 数据，json字符串
      data : JSON.stringify(list),
      async : flag,
      // 请求成功
      success : function(result) {
        renderSelect(result.results,divId)
      },
      // 请求失败，包含具体的错误信息
      error : function(e) {
        console.log(e.status);
        console.log(e.responseText);
      }
    });
  }

}

/**
 * 渲染select
 * @param BMres  数据源
 * @param divId  渲染到哪个元素
 */
function renderSelect(BMres,divId) {
  // 有数据的直接渲染
  if(BMres.length>0){
    // 置空dom
    $("#" + divId).empty()
    $("#" + divId).append("<option value=''>请选择</option>");
    $("#" + divId).siblings(".searchable-select").remove()
    // 遍历编码表内容数组
    $.each(BMres, function(index, value) {
      {
        $("#" + divId).append("<option value=" + value.bm + ">" + value.mc + "</option>")
      }
    });

    $("#" + divId).searchableSelect();
  }else{
    // 没有数据的渲染一个请选择
    $("#" + divId).append( "<option value=''>请选择</option>")
    $("#" + divId).searchableSelect();
  }

}
