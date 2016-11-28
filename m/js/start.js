$.toast.prototype.defaults.duration = 1200;
var
    index_title = $('#index_title'),
    types_bar = $('#types'),
    types_list = $('#types_result'),
    tags_bar = $('#tags'),
    tags_list = $('#tags_result'),
    btn_back_to_type = $('#btn_back_to_type'),
    curr_type = '',
    json_data = {};
//URL跳转
window.addEventListener("popstate", function(e) {
    $.closeModal();
    switch (e.state.area) {
        case 'showType':
            showtypes();
            break;
        case 'showTags':
            typechoose(e.state.type);
            break;
    }
});
function typechoose(type) {
    function addItem(field) {
        var cname = field.cname.replace('<br>','');
        if (cname.indexOf('<img')!==-1) {
            cname = cname.substr(cname.lastIndexOf('>')+1);
        }
        var item = '';
        item += '<a class="weui_cell" id="tag_';
        item += field.name;
        item += '" href="javascript:;" onclick="tagchoose(\'';
        item += field.name;
        item += '\',\'';
        item += cname;
        item += '\')"><div class="weui_cell_bd weui_cell_primary"><p>';
        item += field.name;
        item += '</p></div><div class="weui_cell_ft">';
        item += field.cname;
        item += '</div></a>';
        tags_list.append(item);
    }
    curr_type = type;
    var state = {
        area: 'showTags',
        type: type
    };
    window.history.pushState(state, '类别 - ' + type, '#type_' + type);
    document.title = '类别 - ' + type;
    tags_bar.show();
    types_bar.hide();
    index_title.hide();
    btn_back_to_type.show();
    tags_list.html('');
    $.showLoading("加载中...");
    //仅加载一次
    if (typeof json_data[type] !== 'undefined') {
        json_data[type].tags.forEach(addItem);
        $.hideLoading();
        tags_bar.hide().fadeIn();
    } else {
        $.getJSON('../api/tags/' + type + '.json').success(function(items){
            json_data[type] = items;
            items.tags.forEach(addItem);
            $.hideLoading();
            tags_bar.hide().fadeIn();
        }).error(function(){
            $.hideLoading();
            $.toptip("加载失败", "error");
        });
    }
}

function tagchoose(tag, cname) {
    $.modal({
        title: '要复制吗？',
        text: '<p class="weui-prompt-text">'+cname+'</p><input type="text" class="weui_input weui-prompt-input" id="weui-prompt-input" value="' + tag + '" />',
        autoClose: false,
        buttons: [
            {
                text: '取消',
                className: "default",
                onClick: function () {
                    $.closeModal();
                }
            },
            {
                text: '复制',
                className: "primary",
                onClick: function() {
                    $(this).find('input.weui-prompt-input')[0].select();
                    document.execCommand("Copy");
                    $.closeModal();
                    $.toast("复制成功");
                }

            }
        ]
    });
}

function showtypes() {
    var state = {area: 'showType'};
    window.history.pushState(state, '选择分类', '#choose_type');
    document.title = '选择分类';
    tags_bar.hide();
    types_bar.show();
    index_title.show();
    btn_back_to_type.hide();
}
btn_back_to_type.click(showtypes);

$(function(){
    var hash = window.location.hash;
    var state = {area: 'showType'};
    window.history.pushState(state, '选择分类', '#choose_type');
    document.title = '选择分类';
    $.showLoading('获取类别...');
    types_list.html('');
    $.getJSON('../api/types.json').success(function(items){
        items.forEach(function(field){
            var item = '';
            item += '<a class="weui_cell types_choose" id="type_';
            item += field.name;
            item += '" href="javascript:;" onclick="typechoose(\'';
            item += field.name;
            item += '\')"><div class="weui_cell_bd weui_cell_primary"><p>';
            item += field.cname;
            item += '</p></div><div class="weui_cell_ft">';
            item += field.info;
            item += '</div></a>';
            types_list.append(item + "\n");
        });
        $.hideLoading();
        if (hash.substr(0, 6)==='#type_') {
            typechoose(hash.substr(6));
        }
    }).error(function(){
        $.hideLoading();
        $.toptip('获取类别失败', 'error');
    });
});