function dropdown(isLoadSearchList = false){
    if($(window).width() < 768){
        $(".dropdown-list").css({"width": $(window).width() - 10});
        if($(window).width() == 767) {
            setTimeout(function(){
                $(".dropdown-list").offset({"left": 5});
            }, 200);
        }else{
            $(".dropdown-list").offset({"left": 5});
        }

        if(!isLoadSearchList){
            if($(".header__item-search .dropdown-list").is(":visible")) {
                $(".header__input").css({"display": "block"});
                $(".header__item-search i").css({"display": "none"});
                $(".header__item").css({"display": "none"});
                $(".header__item-search").css({"display": "block", "width": "100%"});
            }else{
                $(".header__input").css({"display": ""});
                $(".header__item-search i").css({"display": ""});
                $(".header__item").css({"display": ""});
                $(".header__item-search").css({"display": "", "width": ""});
            }
        }
    }else{
        $(".dropdown-list").css({"width": "", "left": ""});
        $(".header__item").css({"display": ""});
        $(".header__item-search").css({"display": "", "width": ""});
    }
}

function modal(isOpen=true, title=null, body=null, button=null, buttonfunc=null){
    if(isOpen){
        $("body").addClass("modal-open");
        $(".modal").addClass("open");
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

        $(".modal__container").css({"margin-top": $(this).height()/2 - $(".modal__container").height()/2});
    }else{
        $("body").removeClass("modal-open");
        $(".modal").removeClass("open");
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
  
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

function deleteCookie(name) {
    document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}  

$(window).on("resize", function(){
    dropdown();
    $(".modal__container").css({"margin-top": $(this).height()/2 - $(".modal__container").height()/2});
});

$(".log-out").on("click", function(){
    $.ajax({
        url: "/user/logout",
        type: "POST",
    }).then((data)=>{
        if(data.status == 200){
            deleteCookie("cookie");
            deleteCookie("cpanel");
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
        deleteCookie("toggle");
        $(this).removeClass("toggled");
        $(this).html(`<i class="fas fa-outdent"></i>`);
        $(".sidebar").removeClass("toggled");
        $(".header").removeClass("toggled");
        $(".main-body").removeClass("toggled");

    }else{
        setCookie("toggle", "enabled", 30);
        $(this).addClass("toggled");
        $(this).html(`<i class="fas fa-indent"></i>`);
        $(".sidebar").addClass("toggled");
        $(".header").addClass("toggled");
        $(".main-body").addClass("toggled");
    }
});

$(".header__input").on("input", function(){
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

            }else if(data.status == 400){
                $(".header__item-search .dropdown-list").html(`<li class="dropdown-item"><a>Không có gì để hiển thị cả.</a></li>`);
            }

            dropdown();
        });
    }else{
        $(".header__item-search .dropdown-list").css({"display": ""});
    }
});

$(".header__item-search").on("click", function(){

    if($(window).width() < 768){
        $(".header__input").css({"display": "block"});
        $(".header__input").focus();
        $(".header__item-search i").css({"display": "none"});
        $(".header__item").css({"display": "none"});
        $(".header__item-search").css({"display": "block", "width": "100%"});
    }
    
    let query = $(".header__input").val();
    if(query.length >= 4){
        $(".header__item-search .dropdown-list").css({"display": "block"});
        dropdown(true);
    }
});

$(".header__item-search").on("clickout", function(){
    $(".header__item-search .dropdown-list").css({"display": ""});
    if($(window).width() < 768){
        $(".header__input").css({"display": ""});
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

$(".header__item-profile .avatar img").on("load", function(){
    if($(this).height() < $(this).width()) {
        $(this).css({"height": "100%", "width" : "auto"});
    }else{
        $(this).css({"height": "auto", "width" : "100%"});
    }
});

$(".avatar-profile .border-avatar img").on("load", function(){
    if($(this).height() < $(this).width()) {
        $(this).css({"height": "100%", "width" : "auto"});
    }else{
        $(this).css({"height": "auto", "width" : "100%"});
    }
});

$(document).ready(()=>{

    let sidebar_item = $(".sidebar__item");
    let dropdown_item = $(".header__item-bars .dropdown-item");
    var current_url = window.location.href;
    let toggle = getCookie("toggle");

    if(toggle === "enabled") {
        $(".header__item-toggle").addClass("toggled");
        $(".header__item-toggle").html(`<i class="fas fa-indent"></i>`);
        $(".sidebar").addClass("toggled");
        $(".header").addClass("toggled");
        $(".main-body").addClass("toggled");
    }else{
        $(".header__item-toggle").removeClass("toggled");
        $(".header__item-toggle").html(`<i class="fas fa-outdent"></i>`);
        $(".sidebar").removeClass("toggled");
        $(".header").removeClass("toggled");
        $(".main-body").removeClass("toggled");
    }

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

    $(window).on('click', function (e) {
        if ($(e.target).is('.modal.open') || $(e.target).is('.modal-close') || $(e.target).is('.modal-button-close')) {
            modal(false);
        }
    });
});