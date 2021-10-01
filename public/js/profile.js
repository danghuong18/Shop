function reloadAddress(data){
    if(data){
        if(data.addressList.length > 0){
            let list = ``
            for(x in data.addressList){
                let status = data.addressList[x].active? `<span class="status">Địa chỉ mặc định</span>`: ``;
                let default_button = data.addressList[x].active? ``: `<div class="address-item__action--bottom"><span class="set-default" id="${data.addressList[x]._id}">Đặt làm địa chỉ mặc định</span></div>`;
                list += `
                <span class="address-item" id="address-${data.addressList[x]._id}">
                    <div class="address-item__content">
                        <span class="text">${data.addressList[x].address}</span>
                        ${status}
                    </div>
                    <div class="address-item__action">
                        <div class="address-item__action--top">
                            <span class="edit" id="${data.addressList[x]._id}">Sửa</span>
                            <span class="delete" id="${data.addressList[x]._id}">Xoá</span>
                        </div>
                        ${default_button}
                    </div>
                </span>`;
            }
        
            let script = `
            <script>
                $(".address-item__action .edit").on("click", function(){
                    $("#add-address").hide();
                    $("#edit-address").slideDown();
                    let id = $(this).attr("id");
                    let address = $("#address-" + id + " .address-item__content .text").html();
                    $(".id-address").val(id);
                    $(".old-address").val(address);
                });
    
                $(".address-item__action .delete").on("click", function(){
                    let id = $(this).attr("id");
                    $.ajax({
                        url: "/user/deleteAddress",
                        type: "POST",
                        data: {
                            id: id
                        }
                    }).then((data)=>{
                        if(data.status == 200){
                            $("#address-" + id).slideUp();
                            notification(".content", data.status, data.message);
                        }else{
                            notification(".content", data.status, data.message);
                        }
                    });
                });
    
                $(".address-item__action .set-default").on("click", function(){
                    let id = $(this).attr("id");
                    $.ajax({
                        url: "/user/setDefaultAddress",
                        type: "POST",
                        data: {
                            id: id
                        }
                    }).then((data)=>{
                        if(data.status == 200){
                            reloadAddress(data.data);
                            notification(".content", data.status, data.message);
                        }else{
                            notification(".content", data.status, data.message);
                        }
                    });
                });
            </script>`;
    
            $(".address-list").html(list);
            $(".address-list").append(script);
        }
    }
}

function readImage(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $(".avatar-profile .border-avatar img").attr({"src": e.target.result});
        }
        reader.readAsDataURL(input.files[0]);
    }
}

$('#profile-form').on('submit', () => {
    return false;
});

$(".submit-button").on("click", async function(){
    try {
        let fullName = $(".full-name").val();
        let email = $(".email").val();
        let phone = $(".phone").val();

        let day = $(".day").val();
        let month = $(".month").val();
        let year = $(".year").val();
        let dob = new Date(year + "/" + month + "/" + day);


        if(dob.getDate() != day){
            let status = `Ngày tháng năm sinh bị sai, mời chọn lại.`;
            notification(".content", 400, status);
        }else if(fullName != "" && fullName != undefined && email != "" && email != undefined
        && validateEmail(email) && phone != "" && phone != undefined){

        var createForm = $("#profile-form");
        var formData = new FormData(createForm[0]);
          const res = await $.ajax({
            url: "/user/editProfile",
            type: "POST",
            processData: false,
            contentType: false,
            data: formData
          });
      
          if (res.status == 200) {
            if(res.data.avatar){
                $(".header__navbar-user-img").attr({"src": res.data.avatar, "style": ""});
                $(".sidebar__avatar .avatar-image img").attr({"src": res.data.avatar, "style": ""});
                $(".avatar-profile .border-avatar img").attr({"src": res.data.avatar, "style": ""});
            }
            notification(".content", res.status, res.message); 
          }else{
            notification(".content", res.status, res.message);
          }
        }else{
            if(!validateEmail(email)){
                let message = `Sai địa chỉ email mời chọn lại.`;
                notification(".content", 400, message);
            }
        }
    
    } catch (error) {
        console.log(error);
    }
});

$('#add-address').on('submit', () => {
    return false;
});

$(".add-address-button").on("click", async function(){
    try {
        let address = $(".new-address").val();

        if(address){
            const res = await $.ajax({
                url: "/user/addAddress",
                type: "POST",
                data: {
                    address: address
                }
            });
          
            if (res.status == 200) {
                $('#add-address').slideUp();
                $(".new-address").val("");
                reloadAddress(res.data);
                notification(".content", res.status, res.message);
            }else{
                notification(".content", res.status, res.message);
            }
        }
    
    } catch (error) {
        console.log(error);
    }
});

$('#edit-address').on('submit', () => {
    return false;
});

$(".edit-address-button").on("click", async function(){
    try {
        let id_address = $(".id-address").val();
        let address = $(".old-address").val();

        if(address){
            const res = await $.ajax({
                url: "/user/editAddress",
                type: "POST",
                data: {
                    id: id_address,
                    address: address
                }
            });
          
            if (res.status == 200) {
                $('#edit-address').slideUp();
                reloadAddress(res.data);
                notification(".content", res.status, res.message);
            }else{
                notification(".content", res.status, res.message);
            }
        }
    
    } catch (error) {
        console.log(error);
    }
});

$('#password-form').on('submit', () => {
    return false;
});

$(".password-button").on("click", async function(){
    try {
        let current_password = $(".current-password").val();
        let new_password = $(".new-password").val();
        let confirm_password = $(".confirm-password").val();

        if(current_password != undefined && current_password != "" && new_password != undefined && new_password != "" && confirm_password != undefined && confirm_password != ""){
            if(new_password != confirm_password){
                let status = `Mật khẩu mới và mật khẩu xác minh không trùng khớp.`;
                notification(".content", 400, status);
            }else{
                const res = await $.ajax({
                    url: "/user/editPassword",
                    type: "POST",
                    data: {
                        current_password: current_password,
                        new_password: new_password,
                        confirm_password: confirm_password
                    }
                });
              
                if (res.status == 200) {
                    notification(".content", res.status, res.message);
                }else{
                    notification(".content", res.status, res.message);
                }
            }
        }
    
    } catch (error) {
        console.log(error);
    }
});

$(".add-address").on("click", function(){
    $("#edit-address").hide();
    $("#add-address").slideDown();
});

$(".choose-avatar").on("click", function(){
    $(".edit-avatar").click();
});

$(".border-avatar").on("click", function(){
    $(".edit-avatar").click();
});

$(".edit-avatar").on("change", function(){
    readImage(this);
});

$(".sidebar__item").on("click", function(){
    let id = $(this).attr("id");
    if(!$(this).hasClass("active")){
        $(".sidebar__item").removeClass("active");
        $(this).addClass("active");
        $("#profile-form").hide();
        $("#address-form").hide();
        $("#password-form").hide();
        $("#" + id + "-form").show();
    }
});

$(".sidebar__avatar .avatar-image img").on("load", function(){
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
    let split_link = (document.URL).split("#");
    if(split_link.length == 2){
        if(split_link[1]){
            $("#" + split_link[1]).click();
        }
    }
});