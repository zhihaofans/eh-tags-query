var type = undefined;
var tags_date = [];
$(document).ready(function () {
    type = getQuery('type')
    if (type == undefined || type.length == 0) {
        $('#card_result').hide();
        $('#button_refresh').hide();
        mdui.snackbar({
            message: '加载标签失败，请返回首页',
            buttonText: '返回首页',
            onButtonClick: function () {
                location.href = 'index.html';
            }
        });
    } else {
        $('.back-to-index-button').attr('onclick', "location.href='index.html?t=" + new Date().getTime() + "';");
        $('.refresh-button').attr('onclick', "mdui.snackbar({ message: '刷新中' });location.href='" + location.pathname + "?type=" + type + "&t=" + new Date().getTime() + "';");
        setTitle(type);
        var thisUrl = "../api/tags/" + type + ".json";
        if (location.hostname == '127.0.0.1') {
            thisUrl += "?t=" + new Date().getTime();
        }
        $('#types').html('');
        $.ajax({
            dataType: "json",
            url: thisUrl,
            async: false,
            success: function (data) {
                tags_date = data;
                console.log('init', data);
                writeTypes();
                //console.log(JSON.stringify(tags_date).replace(/<[^>]+>/g, ""));
            }
        })
            .fail(function (data) {
                $('#card_result').hide();
                console.log("typeInit", "error", thisUrl, data);
                mdui.snackbar({ message: '加载标签失败', timeout: 100 });
            });
    }
});
function writeTypes() {
    setTitle(tags_date['cname']);
    $('#tag_result > ul').html('');
    for (var a = 0; a < tags_date['tags'].length; a++) {
        var thisTag = tags_date['tags'][a];
        var ename = thisTag['name'];
        var cname = thisTag['cname'].replace(/<[^>]+>/g,"");
        $('#tag_result > ul').append('<a href="javascript:;" onclick="mdui.snackbar({ message: \'复制成功\', timeout: 100 });" class="mdui-ripple copy-btn" data-clipboard-text="' + ename + '"><li class="mdui-list-item mdui-ripple "><div class="mdui-list-item-content"><div class="mdui-list-item-title mdui-list-item-one-line">' + ename + '</div><div class="mdui-list-item-text mdui-list-item-one-line">' + cname + '</div></div></li></a>');
    }
    mdui.snackbar({
        message: '数据加载完毕',
        timeout: 100,
        onClose: function () {
            $('#progress_auto_one').hide();
            $('#card_result').show();
            clipboardInit();
        }
    });
}
function getQuery(queryKey) {
    var aQuery = window.location.href.split("?");  //取得Get参数
    var aGET = new Array();
    if (aQuery.length > 1) {
        var aBuf = aQuery[1].split("&");
        for (var i = 0, iLoop = aBuf.length; i < iLoop; i++) {
            var aTmp = aBuf[i].split("=");  //分离key与Value
            aGET[aTmp[0]] = aTmp[1];
        }
    }
    return aGET[queryKey];
}
function clipboardInit() {
    $.getScript("js/clipboard.min.js", function () {
        var clipboard = new Clipboard('.copy-btn');
        clipboard.on('success', function (e) {
            console.info('Action:', e.action);
            console.info('Text:', e.text);
            console.info('Trigger:', e.trigger);

            e.clearSelection();
        });

        clipboard.on('error', function (e) {
            console.error('Action:', e.action);
            console.error('Trigger:', e.trigger);
        });
        console.log("加载clipboard.min.js成功");
    });
}