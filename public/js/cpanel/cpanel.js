function dropdown(){
    if($(window).width() <= 768){
        $(".dropdown-list").css({"width": $(".header").width() - 10});
        $(".dropdown-list").offset({left: 5 });
    }else{
        $(".dropdown-list").css({"width": "", left: ""});
    }
}

function modal(isOpen=true, title=null, body=null, button=null, buttonfunc=null){
    if(isOpen){
        $("body").addClass("modal-open");
        $(".modal").addClass("open");
        $(".modal-background").addClass("open");
        if(title != null){
            $(".modal-title").html(title);
        }
        if(body != null){
            $(".modal-body").html(body);
        }
        if(button != null){
            $(".modal-button-confirm").html(button);
        }
        if(buttonfunc != null){
            $(".modal-button-confirm").attr("onclick", buttonfunc);
        }
    }else{
        $("body").removeClass("modal-open");
        $(".modal").removeClass("open");
        $(".modal-background").removeClass("open");
    }
}

function notification(prepend_class=null, status="success", action=null, delay=5000){
    if(prepend_class!=null && status!=null && action!=null ){
        let notif_text = "";
        if(status=="success"){
            notif_text = action + " thành công!"
        }else if(status=="warning") {
            notif_text = action + " chưa thành công!"
        }else if(status=="error") {
            notif_text = action + " xảy ra lỗi!"
        }

        let notif = `<div class="notification notification--${status}">${notif_text}</div>`;
        $(".notification").remove();
        $(prepend_class).prepend(notif);
        $(".notification").delay(3000).fadeOut();
    }
}

$(window).on("resize", function(){
    dropdown();
});

$(".header__item-bars").on("click", function(){
    $(".header__item-bars .dropdown-list").css({"display": "block"});
    dropdown();
});

$(".header__item-bars").on("clickout", function(){
    $(".header__item-bars .dropdown-list").css({"display": ""});
});

$(".header__item-toggle").on("click", function(){
    if($(this).hasClass("toggled")) {
        $(this).removeClass("toggled");
        $(this).html(`<i class="fas fa-outdent"></i>`);
        $(".sidebar").removeClass("toggled");
        $(".header").removeClass("toggled");
        $(".main-body").removeClass("toggled");

    }else{
        $(this).addClass("toggled");
        $(this).html(`<i class="fas fa-indent"></i>`);
        $(".sidebar").addClass("toggled");
        $(".header").addClass("toggled");
        $(".main-body").addClass("toggled");
    }
});

$(".header__input").on("input", function(){
    // console.log($(this).val());
    let query = $(this).val();
    if(query.length >= 4){
        $(".header__item-search .dropdown-list").css({"display": "block"});
        dropdown();
    }else{
        $(".header__item-search .dropdown-list").css({"display": ""});
    }
});

$(".header__item-search").on("click", function(){

    if($(window).width() <= 768){
        $(".header__input").css({"display": "block"});
        $(".header__input").focus();
        $(".header__item-search i").css({"display": "none"});
        $(".header__item").css({"display": "none"});
        $(".header__item-search").css({"display": "block", "width": "100%"});
    }
    
    let query = $(".header__input").val();
    if(query.length >= 4){
        $(".header__item-search .dropdown-list").css({"display": "block"});
        dropdown();
    }
});

$(".header__item-search").on("clickout", function(){
    $(".header__item-search .dropdown-list").css({"display": ""});
    if($(window).width() <= 768){
        $(".header__input").css({"display": ""});
        // $(".header__input").focusout();
        $(".header__item-search i").css({"display": ""});
        $(".header__item").css({"display": ""});
        $(".header__item-search").css({"width": ""});
    }
});

$(".header__item-notification").on("click", function(){
    $(".header__item-notification .dropdown-list").css({"display": "block"});
    dropdown();
});

$(".header__item-notification").on("clickout", function(){
    $(".header__item-notification .dropdown-list").css({"display": ""});
});

$(".header__item-tasks").on("click", function(){
    $(".header__item-tasks .dropdown-list").css({"display": "block"});
    dropdown();
});

$(".header__item-tasks").on("clickout", function(){
    $(".header__item-tasks .dropdown-list").css({"display": ""});
});

$(".header__item-profile").on("click", function(){
    $(".header__item-profile .dropdown-list").css({"display": "block"});
    dropdown();
});

$(".header__item-profile").on("clickout", function(){
    $(".header__item-profile .dropdown-list").css({"display": ""});
});

// $("input.checkbox-item[type='checkbox']").on("click", function(i){
//     let item_id = $(this).val();
//     if($("#item-" + item_id).hasClass("checked")){
//         $("#item-" + item_id).removeClass("checked");
//     }else{
//         $("#item-" + item_id).addClass("checked");
//     }
// });

$(".uncheck-item").on("click", function(){
    let item_checked = $(".checkbox-item");
    item_checked.each(function(i)
    {
        if($(this).is(":checked")){
            $(this).prop("checked", false);
            $("#item-" + $(this).val()).removeClass("checked");

            console.log($(this).val()); // This is your rel value
        }
     });
});

$(".pagination__item").on("click", function(){
    let current_id = $(".pagination__item.active").prop("id");
    let this_id =  $(this).prop("id");
    if(current_id != this_id) {
        $(".pagination__item").removeClass("active");
        $(this).addClass("active");
    }
});

$(".modal-close").on("click", function(){
    modal(false);
});

$(".modal-button-close").on("click", function(){
    modal(false);
});