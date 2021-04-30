var token = '' //图片上传token
var getTokenTimes = 0 //token获取失败最多调用几次获取token方法
var fileIsClick = true; //预览标志位
var tpjyflag = false //图片校验flag
var bpmid = '' //bpmid
var Token_URL = '/STMS/common/getToken$m=query.service' //Token接口
var UpLoad_URL = '/STMS/common/uploadFile$m=query.service' //上传中台接口
var DleFile_URL = '/STMS/common/deletePath$m=deletezt.service' //删除中台接口
var SavePath_URL = '/STMS/common/savePath$m=query.service' //保存图片路径接口
var DelPath_URL = '/STMS/common/deletePath$m=query.service' //保存图片路径接口
var fileUrl = {} //存放路径
var fileNumber = {} //上传了几张反参
var tpflag = {} //是否上传反参
var tpUrl = {} //图片路径反参
var tpMustUpload = {} //图片是否必传
/**
 *
 * @param {*页面中的bpmid} bpmid
 * @param {*图片上传字段和字段名集合} List
 * @param {*类名为picture-box的div对应id} id
 * @returns
 */
function initAddMorePicture(bpmid, List, id) {
    if (List.length === 0) {
        console.log('初始化失败，请开发者检查List传参')
        return
    }
    bpmid = bpmid
    console.log('bpmid', bpmid)
    initMorePicturePage(List, id)

}

/**
 *调用此方法可以查询到哪些材料上传了 哪些没有上传
 */
function getUploadState() {
    console.log('tpflag', tpflag)
    return tpflag
}
/**
 *调用此方法可以查询到已上传的图片的中台存储路径
 */
function getUrl() {
    console.log('tpUrl', tpUrl)
    return tpUrl
}
// 初始化页面
function initMorePicturePage(List, id) {
    $("#" + id).html('')
    let html = ''
    if ($("#myModal").length > 0 && $("#addPicture_title").length > 0) {
        html = ' <div class="addPicture" id="' + `add_${id}` + '">\n' +
            '        </div>\n' +
            '            <div class="error" id="' + `lxdh_${id}` + '"></div>' +
            '        <div class="shadeImg"  id="shadeImg">\n' +
            '            <div class="shadeDiv">\n' +
            '                <img class="showImg" id="showImg" src="">\n' +
            '            </div>\n' +
            '        </div>\n'
    } else {
        html = ' <div class="addPicture" id="' + `add_${id}` + '">\n' +
            '        </div>\n' +
            '            <div class="error" id="' + `lxdh_${id}` + '"></div>' +
            '        <div class="shadeImg"  id="shadeImg">\n' +
            '            <div class="shadeDiv">\n' +
            '                <img class="showImg" id="showImg" src="">\n' +
            '            </div>\n' +
            '        </div>\n' +
            '        <div id="myModal" class="myModal">\n' +
            '           <div class="addPicture1" >\n' +
            '           <span class="close">&times;</span>\n' +
            '               <div class="addPicture_title" id="addPicture_title">材料上传</div>\n' +
            '               <div class="myModal_content" id="addPicture_content">\n' +
            '           </div>\n' +
            '           </div>\n' +
            '       </div>\n'
    }
    $("#" + id).html(html)
    console.log('list', List)
    $.each(List, function (index, value) {
        fileUrl[value.nameTag] = "";
        fileNumber[value.nameTag] = 0;
        tpflag[value.nameTag] = false;
        tpUrl[value.nameTag] = "";
        tpMustUpload[value.nameTag] = value.isMustUpload;
        let pictureModel = '<div>\n' +
            '                <div class="a-upload" name="' + `div_${value.nameTag}` + '" id="' + `div_${value.nameTag}` + '">\n' +
            '                    <img/> \n' +
            '                    <div class="picture-num-box">(<span>0</span>)</div>\n' +
            '                </div>\n' +
            '                <div class="namezj">' + value.name + '</div>\n' +
            '            </div>'

        $("#" + `add_${id}`).append(pictureModel)
        // 默认值
        let isClick = value.isClick === 0 ? value.isClick : 1
        let fileType = value.fileType ? value.fileType : 1
        let fileSize = value.fileSize ? value.fileSize : 1
        let fileNum = value.fileNum ? value.fileNum : 5
        initMoudleClick(value.nameTag, value.name, isClick, fileType, fileSize, fileNum);
    });

}
// 初始化弹窗点击事件
function initMoudleClick(id, name, isClick, fileType, fileSize, fileNum) {
    console.log('弹窗的初始化', id, $("#div_" + id))
    let html_modal = '<div class="addPicture2" id="' + `Modal_${id}` + '"></div>'
    // 打开弹窗
    $("#addPicture_content").append(html_modal)
    $("#div_" + id).click(function () {
        console.log('弹窗的点击事件')
        $("#myModal").show()
        $('#myModal .addPicture1').addClass("animated zoomIn").css("animation-duration", "300ms")
        console.log('弹窗打开', id);
        let html = '<div>\n' +
            '                <div class="a-upload" name="' + `input_${id}` + '" id="' + `input_${id}` + '">\n' +
            '                    <input type="file" name="' + id + '" id="' + `${id}` + '"/> \n' +
            '                </div>\n'
        // 弹窗名称赋值
        $("#addPicture_title").html(name)
        $("#Modal_" + id).css("display", "flex")
        // 如果已经上传过图片 需要反显
        if (fileNumber[id] > 0) {

        } else {
            $("#Modal_" + id).html(html)
            // modalPlsc(input, id, type, currentIndex, applyer)
            initInputClick(id, isClick, fileType, fileSize, fileNum)
        }
    })

    // 点击 <span> (x), 关闭弹窗
    $(".close").click(function () {
        $("#myModal").css("display", "none");
        $(".addPicture2").hide()
        console.log('弹窗关闭')
    })
    // 在用户点击其他地方时，关闭弹窗
    let modal = document.getElementById('myModal');
    window.onclick = function (event) {
        if (event.target == modal) {
            $("#myModal").css("display", "none");
            $(".addPicture2").hide()
            console.log('弹窗关闭')
        }
    }
    //加载中图片旋转
    let angle = 0;
    window.int = setInterval(function () {
        angle += 45 % 360;
        $("#rotateImg").css("transform", "rotate(" + angle + "deg)")
    }, 100);
}

// 初始化点击事件
function initInputClick(id, isClick, fileType, fileSize, fileNum) {
    var objUrl;
    var img_html;
    /* 上传图片 */
    $("#" + id).change(function () {
        $.showLoading('上传中...')
        if (fileIsClick) {
            fileIsClick = false;
            /* 制作图片返显的路径、分离类型 */
            var img_div = $("#div_" + this.name + "");
            var filepath = $("#" + this.name + "").val();
            console.log('this', this.files[0])
            objUrl = getObjectURL(this.files[0]);
            // 类型
            var extStart = filepath.lastIndexOf(".");
            var ext = filepath.substring(extStart, filepath.length).toUpperCase();
            // 数量
            let Img_length = modalCountImgLength(type, currentIndex)
            /* 判断图片类型 */
            if (fileType === 1 && ext != ".BMP" && ext != ".PNG" && ext != ".GIF" && ext != ".JPG" && ext != ".JPEG") {
                $.hideLoading()
                $.toast("图片限于bmp,png,gif,jpeg,jpg格式", "text");
                removeCatch(this.name);
                fileIsClick = true;
                return
            } else if (fileType === 2 && ext != ".BMP" && ext != ".PNG" && ext != ".GIF" && ext != ".JPG" && ext != ".JPEG" && ext != ".PDF") {
                $.hideLoading()
                $.toast("文件限于bmp,png,gif,jpeg,jpg,pdf格式", "text");
                removeCatch(this.name);
                fileIsClick = true;
                return
            } else if (fileType === 3 && ext != ".BMP" && ext != ".PNG" && ext != ".GIF" && ext != ".JPG" && ext != ".JPEG" && ext != ".PDF" && ext != ".TXT" && ext != ".DOC" && ext != ".DOCX") {
                $.hideLoading()
                $.toast("文件限于bmp,png,gif,jpeg,jpg,pdf,txt,doc,docx格式", "text");
                removeCatch(this.name);
                fileIsClick = true;
                return
            } else if (fileType === 4 && ext != ".TXT" && ext != ".DOC" && ext != ".DOCX") {
                $.hideLoading()
                $.toast("文件限于txt,doc,docx格式", "text");
                removeCatch(this.name);
                fileIsClick = true;
                return
            }
            /* 判断图片大小 */
            else if (this.files[0].size / 1024 / 1024 > fileSize) {
                $.hideLoading()
                $.toast("上传的图片大小不能超过" + fileSize + "M", "text");
                removeCatch(this.name);
                fileIsClick = true;
                return
            }else if(Img_length==fileNum){
                $.hideLoading()
                $.toast("最多上传"+fileNum+"个文件", "text");
                removeCatch(this.name);
                fileIsClick = true;
            }
            /* 上传图片 */
            else {
                getToken();
                if (token === '') {
                    $.toast("token获取失败", "text");
                    removeCatch(this.name);
                    fileIsClick = true;
                    $.hideLoading()
                    return
                }
                uploadFile(token, this.files[0], this.name);
                if (fileUrl[this.name] === '') {
                    $.toast("图片上传中台失败", "text");
                    removeCatch(this.name);
                    $.hideLoading()
                    fileIsClick = true;
                    return
                }
                savePath(this.name, fileUrl[this.name])
                if (tpflag[this.name] === true) {
                    console.log("tpflag[this.name]", tpflag[this.name])
                    if (isClick === 1) {
                        img_html = "<div class='isImg' id='" + `img_${this.name}` + "'><img src='" + objUrl + "' onclick='javascript:lookBigImg(this)' style='height: 100%; width: 100%;' /><button type='button' class='pxoveBtn' onclick='javascript:removeImg(" + this.name + ")'>x</button></div>";
                    } else {
                        img_html = "<div class='isImg' id='" + `img_${this.name}` + "'><img src='" + objUrl + "' style='height: 100%; width: 100%;' /><button type='button' class='pxoveBtn' onclick='javascript:removeImg(" + this.name + ")'>x</button></div>";
                    }
                    img_div.append(img_html);
                }
                setTimeout("$.hideLoading()", 600)
                $("#input_"+id).hide()
                fileIsClick = true;
            }
        }
    });
}

//获取图片上传token
function getToken() {
    $.ajax({
        async: false,
        // 请求方式
        type: "POST",
        // 请求的媒体类型
        contentType: "application/json;charset=UTF-8",
        // 请求地址
        url: Token_URL,
        // 数据，json字符串
        data: JSON.stringify(),
        // 请求成功
        success: function (result) {
            console.log('查询token---result==', result)
            if (result.success) {
                getTokenTimes = 0
                console.log('查询token==', result.data.token)
                token = result.data.token
            } else if (getTokenTimes < 5) {
                getTokenTimes++
                console.log("token获取失败")
                getToken()
            }
        },
        // 请求失败，包含具体的错误信息
        error: function (e) {
            console.log(e)
        }
    });
}
// 图片上传中台
function uploadFile(token, file, divname) {
    console.log(divname)
    var formData = new FormData();
    var file = file
    formData.append("file", file);
    formData.append("token", token);
    $.ajax({
        url: UpLoad_URL,
        type: 'post',
        data: formData,
        contentType: false,
        processData: false,
        async: false,
        success: function (result) {
            console.log('图片上传中台---result==', result)
            fileUrl[divname] = result.data.path
            tpUrl[divname] = result.data.path
        },
        // 请求失败，包含具体的错误信息
        error: function (e) {
            console.log(e)
        }
    });
}
// 保存图片路径
function savePath(filename, filePath) {
    var list = {
        prePid: bpmid + '-' + filename + '-',
        path: filePath
    }
    $.ajax({
        // 请求方式
        type: "POST",
        // 请求的媒体类型
        contentType: "application/json;charset=UTF-8",
        // 请求地址
        url: SavePath_URL,
        // 数据，json字符串
        data: JSON.stringify(list),
        async: false,
        // 请求成功
        success: function (result) {
            if (result.success) {
                tpflag[filename] = true
            }
        },
        // 请求失败，包含具体的错误信息
        error: function (e) {}
    });
}
/* 上传图片附带删除 再次地方可以加上一个ajax进行提交到后台进行删除 */
function removeImg(r) {
    $("#input_"+id).show()
    console.log('r.name', r.name)
    delFile_zt(r.name)
    // delFile_bd(r.name)
    if (fileUrl[r.name] == '') {
        $("#img_" + r.name + "").remove()
        $("#" + r.name).val('')
    }
}

// 文件删除-删除中台路径
function delFile_zt(divId) {
    var param = {
        'path': fileUrl[divId]
    }
    $.ajax({
        async: false,
        // 请求方式
        type: "POST",
        // 请求的媒体类型
        contentType: "application/json;charset=UTF-8",
        // 请求地址
        url: DleFile_URL,
        // 数据，json字符串
        data: JSON.stringify(param),
        // 请求成功
        success: function (result) {
            if (result.status === 'ok') {
                delFile_bd(divId);
            } else {
                $.toast("材料删除失败，请稍后再试", "text");
            }
        },
        // 请求失败，包含具体的错误信息
        error: function (e) {
            $.toast("材料删除失败，请稍后再试", "text");
        }
    });
}

// 文件删除-删除本地路径
function delFile_bd(fileType) {
    var param = {
        'prePid': bpmid + '-' + fileType + '-', // 文件唯一标识
    }
    $.ajax({
        async: false,
        // 请求方式
        type: "POST",
        // 请求的媒体类型
        contentType: "application/json;charset=UTF-8",
        // 请求地址
        url: DelPath_URL,
        // 数据，json字符串
        data: JSON.stringify(param),
        // 请求成功
        success: function (result) {
            if (result.success) {
                fileUrl[fileType] = ''
                tpflag[fileType] = false
            }
        },
        // 请求失败，包含具体的错误信息
        error: function (e) {
            console.log(e)
        }
    });
}
// 设置弹窗的封面图
function modalSetFmImg(name, currentIndex) {
    // 判断 该类元素是否上传了图片
    let length = modalCountImgLength(name, currentIndex)
    console.log('弹窗图片length', length)
    if (length == 1) {
        // 获取该类图片的第一个图片
        let $firstDiv = $(`#${name}Modal-${currentIndex} .${name}-${currentIndex}`).children().get(0)
        let src = $($firstDiv).children('img').get(0).src
        console.log('src==', src)
        $("#" + name + "1-" + currentIndex).children("img").css('opacity', 1);
        $("#" + name + "1-" + currentIndex).children("img").attr('src', src)
    }
}

// 获取图片长度
function modalCountImgLength(type, currentIndex) {
    return $(`#${type}Modal-${currentIndex} .${type}-${currentIndex}`).children().length
}

/**
 * 计算该组图片数量
 * @param name 哪种图片
 */
function modalCountImgNum(name, currentIndex) {
    let length = modalCountImgLength(name, currentIndex)
    $("#" + name + "1-" + currentIndex + " span").html(length)

    // 判断是否还有图
    if (length === 0) {// 没图
        $("#" + name + "1-" + currentIndex).children("img").attr('src', '')
        $("#" + name + "1-" + currentIndex).children("img").css('opacity', 0);

        modalChangeTpFlag(name, false, currentIndex)
        modalGetTpError(currentIndex)
    }
}

/* 制作图片返显路径 */
function getObjectURL(file) {
    var url = null;
    if (window.createObjectURL != undefined) { // basic
        url = window.createObjectURL(file);
    } else if (window.URL != undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
}

// 移除图片上传之后的缓存

function removeCatch(name) {
    // $("." + name + "").html('');
    $("#" + name + "").val('');
    // $("." + name + "").hide();
    // $("." + name + "").next().show();
}

/*上传图片附带放大查看处理*/
function lookBigImg(b) {
    $("#shadeImg").fadeIn(500);
    $("#shadeImg").css("position", "fixed");
    $("#showImg").attr("src", $(b).attr("src"))
}

/*关闭弹出层*/
function closeShadeImg() {
    $("#shadeImg").fadeOut(500);
}