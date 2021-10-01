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

function loadOrder(isLoad = false, page = 1, limit = 10){
    let filter = $(".action-filter").val();
    $.ajax({
        url: "/order/myOrder?limit=" + limit + "&page=" + page + "&sort=" + filter,
        type: "GET"
    }).then((data)=>{
        if(data.status == 200){
            let list = ``

            for(x in data.data){
                let list_item = ``;
                let button = ``;
                let status = ``;
                let all_products = ``;

                if(data.data[x].listProduct.length > 0) {
                    let data_item = data.data[x].listProduct;
                    for(i in data_item){
                        let details_item = ``
                        if(data_item[i].productID){
                            if(data_item[i].productID.color && data_item[i].productID.size){
                                details_item = `<div class="order__detail__classify">Phân loại: ${data_item[i].productID.color}, ${data_item[i].productID.size}</div>`;
                            }else{
                                if(data_item[i].productID.color) {
                                    details_item = `<div class="order__detail__classify">Phân loại: ${data_item[i].productID.color}</div>`;
                                }else if(data_item[i].productID.size){
                                    details_item = `<div class="order__detail__classify">Phân loại: ${data_item[i].productID.size}</div>`;
                                }
                            }
    
                            if(i > 0){
                                all_products += `, ` + data_item[i].productID.productCode.productName;
                            }else{
                                all_products += data_item[i].productID.productCode.productName;
                            }
    
                            list_item += `
                            <li class="order__detail__item">
                                <span class="order__detail__left">
                                    <div class="order__detail__image">
                                        <img src="${data_item[i].productID.thumb}" alt="${data_item[i].productID.productCode.productName}">
                                    </div>
                                    <div class="order__detail__content">
                                        <div class="order__detail__title"><a href="/product/${data_item[i].productID.productCode._id}" target="_blank">${data_item[i].productID.productCode.productName}</a></div>
                                        ${details_item}
                                        <div class="order__detail__amount">x${data_item[i].quantity}</div>
                                    </div>
                                </span>
                                <span class="order__detail__right">
                                    ${(data_item[i].quantity * data_item[i].productID.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND'})}
                                </span>
                            </li>`;
                        }else{

                            if(i > 0){
                                all_products += `, Sản phẩm bị xoá`;
                            }else{
                                all_products += `Sản phẩm bị xoá`;
                            }

                            list_item += `
                            <li class="order__detail__item">
                                <span class="order__detail__left">
                                    <div class="order__detail__image">
                                        <img src="/public/upload/no-image.jpg">
                                    </div>
                                    <div class="order__detail__content">
                                        <div class="order__detail__title">Sản phẩm bị xoá</div>
                                        <div class="order__detail__amount">x${data_item[i].quantity}</div>
                                    </div>
                                </span>
                                <span class="order__detail__right">
                                    Không xác định
                                </span>
                            </li>`;
                        }
                    }
                }

                if(data.data[x].status == "pending"){
                    button = `<span class="cancel-button" onclick="cancelOrder('${data.data[x]._id}')">Huỷ Đơn</span>`;
                }else{
                    button = `<span class="reorder-button" onclick="reOrder('${data.data[x]._id}')">Đặt Lại</span>`;
                }

                if(data.data[x].status == "success"){
                    status = `<div class="order__status order__status--success">Thành công</div>`;
                }else if(data.data[x].status == "pending"){
                    status = `<div class="order__status order__status--pending">Đang chờ</div>`;
                }else if(data.data[x].status == "fail"){
                    status = `<div class="order__status order__status--fail">Thất bại</div>`;
                }

                list += `
                <li class="order__item">
                    ${status}
                    <div class="order__body" order-id="${data.data[x]._id}">
                        <span class="order__body__title">${all_products}</span>
                        <span class="order__body__price">${(data.data[x].price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND'})}</span>
                    </div>
                    <ul class="order__detail" id="order-${data.data[x]._id}" style="display: none">
                        ${list_item}
                        <li class="order__detail__info">
                            <span class="info-title">Thông Tin Đặt Hàng</span>
                            <span class="info-full-name">${data.data[x].userID.fullName}</span>
                            <span class="info-phone-number">${data.data[x].phone}</span>
                            <span class="info-address">${data.data[x].address}</span>
                        </li>
                        <li class="order__detail__footer">
                            ${button}
                        </li>
                    </ul>
                </li>`;
            }

            let load = ``

            if(page < data.pages){
                load = `<span class="see-more" page="${parseInt(page) + 1}">Xem Thêm</span>`
            }

            let script = `
            <script>
                $(document).ready(function() {
                    $(".order__body").off("click");
                    $(".order__body").on("click", function(){
                        let id = $(this).attr("order-id");
                        if($(this).hasClass("active")){
                            $("#order-" + id).slideUp();
                            $(this).removeClass("active");
                        }else{
                            $("#order-" + id).slideDown();
                            $(this).addClass("active");
                        }
                    });

                    $(".see-more").on("click", function(){
                        let page = $(this).attr("page");

                        if(page){
                            loadOrder(true, page);
                        }
                    });
                });
            </script>`;

            if(isLoad){
                $(".order__list").append(list);
            }else{
                $(".order__list").html(list);
            }
            $(".order__footer").html(load);
            $(".content__order").append(script);
        }else if (data.status == 400){
            let list = `
            <li class="order__item__empty">
                Không có đơn hàng nào hiển thị ở đây cả
            </li>`;
            $(".order__list").html(list);
            $(".order__footer").html(``);
        }else{
            console.log(data);
        }
    })
}

function reOrder(id){
    if(id != undefined && id != ""){
        $.ajax({
            url: "/order/reOrder",
            type: "POST",
            data: {
                id: id
            }
        }).then((data)=>{
            if(data.status == 200){
                notification(".content", data.status, data.message);
                loadCart();
                $([document.documentElement, document.body]).animate({
                    scrollTop: $(".header__cart-list").offset().top
                }, 500);
            }else{
                notification(".content", data.status, data.message);
            }
        })
    }
}

function cancelOrder(id){
    if(id != undefined && id != ""){
        $.ajax({
            url: "/order/cancelOrder",
            type: "POST",
            data: {
                id: id
            }
        }).then((data)=>{
            if(data.status == 200){
                notification(".content", data.status, data.message);
                loadOrder();
            }else{
                notification(".content", data.status, data.message);
            }
        })
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
        $("#order-form").hide();
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

$(".action-filter").on("change", function(){
    let filter = $(this).val();
    if(filter != null && filter != "" && filter != undefined){
        loadOrder();
    }
});

$(document).ready(()=>{
    loadOrder();
    let split_link = (document.URL).split("#");
    if(split_link.length == 2){
        if(split_link[1]){
            $("#" + split_link[1]).click();
        }
    }
});