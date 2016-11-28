// window.location.hash
$("#tags_back").click(function(){
    $('#index_title').show();
    $('#tags_back').hide();
    $('#tags').hide();
    $('#types').show();
    $('#tags_result').html('');
});
$("#tags_copy_back").click(function(){
    $('#tags_copy').hide();
    $('#tags').show();
    $('#index_title').hide();
    $('#tags_back').show();
    $('#tags_copy_editer').val('');
    $('#tags_copy_cname').html('');
});
function tagchoose(_tag,_cname){
    $.prompt({
        title: '请复制',
        text: '英文: '+_tag+'<br>中文: '+_cname,
        input: _tag,
        empty: true // 是否允许为空
    });
    // $('#index_title').show();
    // $('#tags_back').hide();
    // $('#tags').hide();
    // $('#tags_copy').show();
    // $('#tags_copy_editer').val(_tag);
    // $('#tags_copy_cname').html(_cname);
    // $('#tag_length').html(_tag.length);
}
function typechoose(_type){
    // $('#types').hide();
    // $('#tags').show();
    // $('#index_title').hide();
    // $('#tags_back').show();
    $("#tags_result_popup_list").html('');
    $.showLoading("加载中...");
    $.getJSON("../api/tags/"+_type+".json?t="+(new Date().getTime()),
    function(result,status){
        console.log(status);
        if(status=='success'){
            $.each(result.tags, function(i, field){
                var cname=field.cname;
                cname=cname.replace('<br>','');
                if(cname.indexOf('<img')!==-1){
                    cname=cname.substr(cname.lastIndexOf('>')+1);
                }
                var tag_list='<a class="weui_cell" id="tag_'+field.name+'" href="javascript:;" onclick="tagchoose(\''+field.name+'\',\''+cname+'\')"><div class="weui_cell_bd weui_cell_primary"><p>'+field.name+'</p></div><div class="weui_cell_ft">'+field.cname+'</div></a>';
                $("#tags_result_popup_list").append(tag_list + "\n");
            });
            $("#tags_result_popup").popup();
            $.hideLoading();
        }else{
            $.hideLoading();
            $.toptip("加载失败", "error");
        }
    });
}
$(document).ready(function(){
    $.showLoading("初始化中...");
    $("#types_result").html('');
    $.getJSON("../api/types.json?t="+(new Date().getTime()),
    function(result,status){
        console.log(status);
        if(status=='success'){
            $.each(result, function(i, field){
                var type_list='<a class="weui_cell types_choose" id="type_'+field.name+'" href="javascript:;" onclick="typechoose(\''+field.name+'\')"><div class="weui_cell_bd weui_cell_primary"><p>'+field.cname+'</p></div><div class="weui_cell_ft">'+field.info+'</div></a>';
                $("#types_result").append(type_list + "\n");
                $.hideLoading();
            });
        }else{
            $.hideLoading();
            $.toptip("初始化失败", "error");
        }
    });
});