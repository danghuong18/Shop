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

function notification(prepend_class=null, status=200, action=null, delay=5000){
    if(prepend_class!=null && status!=null && action!=null ){
        let notif_class = "";
        if(status == 200) {
            notif_class = "success";
        }else if(status == 500){
            notif_class = "error";
        }else {
            notif_class = "warning";
        }

        let id = Date.now();
        let notif = `<div class="notification notification--${notif_class}" id="notif-${id}">${action}</div>`;

        $(prepend_class).prepend(notif);
        $("#notif-" + id).delay(delay).fadeOut();

        setTimeout(function(){
            $("#notif-" + id).remove();
        }, delay + 1000);
    }
}

function random(max){
    return Math.floor(Math.random() * max);
}

function delete_cookie(name) {
    document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

$(window).on("resize", function(){
    dropdown();
});

$(".log-out").on("click", function(){
    $.ajax({
        url: "/user/logout",
        type: "POST",
    }).then((data)=>{
        if(data.status == 200){
            delete_cookie("cookie");
            delete_cookie("cpanel");
            location.reload();
        }else{
            console.log(data.message);
        }
    });
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
        $.ajax({
            url: "/cpanel/search?q=" + query,
            type: "GET"
        }).then((data)=>{

            if(data.status == 200){
                let search_droplist = ``

                for(x in data.data){
                    let thumb = ``;
                    if(data.data[x].listImg.length > 0){
                        thumb = data.data[x].listImg[random(data.data[x].listImg.length)];
                    }else{
                        thumb = `https://cdn1.vectorstock.com/i/thumb-large/46/50/missing-picture-page-for-website-design-or-mobile-vector-27814650.jpg`;
                    }
                    search_droplist += `<li class="dropdown-item"><a href="/cpanel/product/${data.data[x]._id}"><span class="dropdown-item__body"><span class="dropdown-item__image"><img src="${thumb}"></span><label>${data.data[x].productName}</label></span></a></li>`
                }

                $(".header__item-search .dropdown-list").html(search_droplist);

                dropdown();
            }else if(data.status == 400){
                $(".header__item-search .dropdown-list").html(`<li class="dropdown-item"><a>Không có gì để hiển thị cả.</a></li>`);
            }
        });
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

$(".modal-close").on("click", function(){
    modal(false);
});

$(".modal-button-close").on("click", function(){
    modal(false);
});

$(document).ready(()=>{
    let sidebar_item = $(".sidebar__item");
    let dropdown_item = $(".header__item-bars .dropdown-item");
    var current_url = window.location.href;
    sidebar_item.each(function(i)
    {
        let url = $(this.getElementsByTagName("a")[0]).attr("href");
        if(current_url.includes(url)){
            sidebar_item.removeClass("active");
            $(this).addClass("active");
        }
     });

     dropdown_item.each(function(i)
     {
         let url = $(this.getElementsByTagName("a")[0]).attr("href");
         if(current_url.includes(url)){
            dropdown_item.removeClass("active");
             $(this).addClass("active");
         }
      });
});