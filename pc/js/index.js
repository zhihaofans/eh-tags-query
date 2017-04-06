var tags_date = undefined;
var search_type = '';
$(document).ready(function () {
    var thisUrl = "../api/tags.json";
    if (location.hostname == '127.0.0.1') {
        thisUrl += "?t=" + new Date().getTime();
    }
    $.ajax({
        dataType: "json",
        url: thisUrl,
        async: false,
        success: function (data) {
            tags_date = data;
            console.log('tags_date', tags_date);
            writeTypeList();
        }
    })
        .fail(function (data) {
            console.log("typeInit", "error", thisUrl, data);
            mdui.snackbar({ message: '加载数据失败', timeout: 100 });
            $('#progress_auto_one').hide();
        });
    $('.refresh-button').attr('onclick', "mdui.snackbar({ message: '刷新中' });location.href='" + location.pathname + "?t=" + new Date().getTime() + "';");
    //console.log(JSON.stringify(tags_date).replace(/<[^>]+>/g,""));

});
$('#submit').click(function () {
    $('#card_result').hide();
    search_type = $('input.search_input:checked').attr('data-id');
    switch (search_type) {
        case 'type':
            if (tags_date == undefined) {
                mdui.snackbar({
                    message: '发生未知错误，已删除按钮，刷新试试？',
                    buttonText: '好的',
                    onClose: function () {
                        $('.refresh-button').click();
                    }
                });
                $('#submit').remove();
            } else {
                //location.href = 'type.html';
                $('#card_home').hide();
                $('#card_result').show();
                $('#toolbar-left-button > i').html('arrow_back');
                $('.back-to-index-button').attr('data-page', 'result');
                $('.back-to-index-button').show();
            }
            break;
        default:
            mdui.snackbar({ message: '暂时不支持', timeout: 100 });

    }
});
function writeTypeList() {
    $('#type_result > ul').html('');
    for (var a = 0; a < tags_date.length; a++) {
        var thisType = tags_date[a];
        var ename = thisType['name'];
        var cname = thisType['cname'];
        $('#type_result > ul').append('<a href="type.html?type=' + ename + '&t=' + new Date().getTime() + '" class="mdui-ripple"><li class="mdui-list-item mdui-ripple "><div class="mdui-list-item-content"><div class="mdui-list-item-title mdui-list-item-one-line">' + ename + '</div><div class="mdui-list-item-text mdui-list-item-one-line">' + cname + '</div></div></li></a>');
    }
    mdui.snackbar({
        message: '数据加载完毕',
        timeout: 100,
        onClose: function () {
            clipboardInit();
            $('#progress_auto_one').hide();
            $('#submit').removeAttr('disabled');
        }
    });
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