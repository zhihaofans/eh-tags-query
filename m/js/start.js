var
    index_title = $('#index_title'),
    types_bar = $('#types'),
    types_list = $('#types_result'),
    tags_bar = $('#tags'),
    tags_list = $('#tags_result'),
    copy_bar = $('#tags_copy'),
    tag_copy_cname = $('#tag_copy_cname'),
    tag_copy_editer = $('#tag_copy_editer'),
    tag_copy_length = $('#tag_length'),
    btn_back_to_type = $('#btn_back_to_type'),
    btn_copy_back = $('#btn_copy_back'),
    curr_type = '',
    json_data = {};
//URL跳转
window.addEventListener("popstate", function(e) {
    switch (e.state.area) {
        case 'showType':
            showtypes();
            break;
        case 'showTags':
            typechoose(e.state.type);
            break;
        case 'copyTag':
            tagchoose(e.state.tag, e.state.cname);
            break;
    }
});
btn_copy_back.click(function(){
    typechoose(curr_type);
});
function typechoose(type) {
    curr_type = type;
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
    var state = {
        area: 'showTags',
        type: type
    };
    window.history.pushState(state, '类别 - ' + type, '#type_' + type);
    document.title = '类别 - ' + type;
    tags_bar.show();
    copy_bar.hide();
    types_bar.hide();
    index_title.hide();
    btn_back_to_type.show();
    btn_copy_back.hide();
    tags_list.html('');
    $.showLoading("加载中...");
    //仅加载一次
    if (typeof json_data[type] !== 'undefined') {
        json_data[type].tags.forEach(addItem);
        $.hideLoading();
    } else {
        $.getJSON('../api/tags/' + type + '.json').success(function(items){
            json_data[type] = items;
            items.tags.forEach(addItem);
            $.hideLoading();
        }).error(function(){
            $.hideLoading();
            $.toptip("加载失败", "error");
        });
    }
}

function tagchoose(tag, cname) {
    var state = {
        area: 'copyTag',
        tag: tag,
        cname: cname
    };
    var hash = '#tag_' + tag.replace(' ', '_');
    window.history.pushState(state, '标签 - ' + tag, hash);
    document.title = '标签 - ' + tag;
    tags_bar.hide();
    copy_bar.show();
    types_bar.hide();
    index_title.hide();
    btn_back_to_type.show();
    btn_copy_back.show();
    tag_copy_editer.val(tag);
    tag_copy_cname.html(cname);
    tag_copy_length.html(tag.length);
}

function showtypes() {
    var state = {area: 'showType'};
    window.history.pushState(state, '选择分类', '#choose_type');
    document.title = '选择分类';
    tags_bar.hide();
    types_bar.show();
    copy_bar.hide();
    index_title.show();
    btn_back_to_type.hide();
    btn_copy_back.hide();
}
btn_back_to_type.click(showtypes);

$(function(){
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
    }).error(function(){
        $.hideLoading();
        $.toptip('获取类别失败', 'error');
    });
});