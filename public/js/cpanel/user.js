function getList(limit, page, isLoadPagination = false){
    let sort = $(".sort__task").val();
    $.ajax({
        url: "/user?limit=" + limit + "&page=" + page + "&sort=" + sort,
        type: "GET"
    }).then((data)=>{
        if(data.status == 200){
            let list = ``

            for(x in data.data){
                let role = ``
                let avatar = ``
                let gender = ``
                let dob = ``
                let email = ``
                let edit_role = ``

                if(data.data[x].role == "admin"){
                    role = `  <div class="role-item">${data.data[x].role}</div>`;
                    edit_role = `<span class="action-item__edit" onclick="setRole('${data.data[x]._id}', false)">Bỏ quyền admin</span>`;
                }else{
                    edit_role = `<span class="action-item__edit" onclick="setRole('${data.data[x]._id}')">Thêm quyền admin</span>`;
                }

                avatar = `  <span class="item-avatar">
                                <img src="${data.data[x].avatar? data.data[x].avatar: "/public/upload/default-avatar.jpg"}">
                            </span>`;

                if(data.data[x].gender){
                    gender = `  <span class="body-item__details-category">
                                    <span class="title">Giới tính:</span>
                                    <span class="desc">${data.data[x].gender == "male"? "Nam": "Nữ"}</span>
                                </span>`;
                }

                if(data.data[x].DOB){
                    dob = `  <span class="body-item__details-category">
                                    <span class="title">DOB:</span>
                                    <span class="desc">${new Date(data.data[x].DOB).toLocaleDateString("vi-VN")}</span>
                                </span>`;
                }

                if(data.data[x].email){
                    email = `  <span class="body-item__details-category">
                                    <span class="title">Email:</span>
                                    <span class="desc">${data.data[x].email}</span>
                                </span>`;
                }

                list += `
                    <li class="main-body__container__item" id="item-${data.data[x]._id}">
                        ${role}
                        <input type="checkbox" class="checkbox-item" value="${data.data[x]._id}">
                        
                        <div class="body-item">
                            <a href="#" class="body-item__title user-item">
                                ${avatar}
                                <san class="item-username">
                                    <label>${data.data[x].username}</label>
                                    <label>${data.data[x].fullName}</label>
                                </span>
                            </a>
                            <div class="body-item__info">
                                <span class="body-item__details">
                                    ${gender}
                                    ${dob}
                                    ${email}
                                </span>
                            </div>
                        </div>
                        <div class="action-item">
                            <span class="action-item__delete" onclick="action('delete','${data.data[x]._id}')">Xoá</span>
                            ${edit_role}
                        </div>
                    </li>`
            }

            let script = `
            <script>
                $("input.checkbox-item[type='checkbox']").on("click", function(i){
                    let item_id = $(this).val();
                    if($("#item-" + item_id).hasClass("checked")){
                        $("#item-" + item_id).removeClass("checked");
                    }else{
                        $("#item-" + item_id).addClass("checked");
                    }
                });
            </script>`;

            if(isLoadPagination){
                let pagination =``;
                let current_page = ($(".pagination__item.active").attr("id") != undefined)? $(".pagination__item.active").attr("id") : 1;
                for(x = 1; x <= data.pages; x++){
                    pagination += `<li class="pagination__item ${x==current_page?"active":""}" id="${x}">${x}</li>`
                }

                let pagination_script = `
                <script>
                    $(".pagination__item").on("click", function(){
                        let current_id = $(".pagination__item.active").prop("id");
                        let this_id =  $(this).prop("id");
                        if(current_id != this_id) {
                            $(".pagination__item").removeClass("active");
                            $(this).addClass("active");
                            reloadData();
                        }
                    });
                </script>`;
                $(".pagination__list").html(pagination);
                $(".pagination__list").append(pagination_script);
            }

            $(".main-body__container__list").html(list)
            $(".main-body__container__list").append(script);
        }else if (data.status == 400){
            let list = `
            <li class="main-body__container__item no-item">
                Không có user nào để hiển thị ở đây cả!
            </li>`;
            $(".main-body__container__list").html(list);
        }else{
            console.log(data);
        }
    })
}

function reloadData(isLoadPagination = false){
    let current_page = ($(".pagination__item.active").attr("id") != undefined)? $(".pagination__item.active").attr("id") : 1;
    
    let limit = $(".pagination__selection").val();
    getList(limit, current_page, isLoadPagination);
}

function save(){
    let fullName = $(".full-name").val();
    let email = $(".email").val();
    let phone = $(".phone").val();

    let day = $(".day").val();
    let month = $(".month").val();
    let year = $(".year").val();
    let dob = new Date(year + "/" + month + "/" + day);

    if(dob.getDate() != day){
        let status = `Ngày tháng năm sinh bị sai, mời chọn lại.`;
        notification(".main-body__container", 400, status);
    }else if(fullName != "" && fullName != undefined && email != "" && email != undefined
    && validateEmail(email) && phone != "" && phone != undefined){
        var createForm = $("#edit-profile");
        var formData = new FormData(createForm[0]);
        $.ajax({
            url: "/user/editProfile",
            type: "POST",
            processData: false,
            contentType: false,
            data: formData
        }).then((data)=>{
            if(data.status == 200){
                notification(".main-body__container", data.status, data.message);
    
                if(data.data.avatar){
                    $(".header__item-profile .avatar img").attr({"src": data.data.avatar, "style": ""});
                    $(".avatar-profile .border-avatar img").attr({"src": data.data.avatar, "style": ""});
                }
    
            }else{
                notification(".main-body__container", data.status, data.message);
            }
        });
    }else {
        if(!validateEmail(email)){
            let message = `Sai địa chỉ email mời chọn lại.`;
            notification(".main-body__container", 400, message);
        }
    }
}

function delete_user(list_user = []){
    if(list_user && list_user != undefined && list_user != "") {
        $.ajax({
            url: "/user/deleteCpanel",
            type: "POST",
            data: {
                list_user: list_user
            }
        }).then((data)=>{
            if(data.status == 200){
                notification(".main-body__container", data.status, data.message);
                reloadData(true);
            }else{
                notification(".main-body__container", data.status, data.message);
            }
        });
        modal(false);
    }
}

function getMeta(url){
    var r = $.Deferred();

    $('<img/>').attr('src', url).load(function(){
        var s = {w:this.width, h:this.height};
        r.resolve(s)
    });
    return r;
}

function action(action="create", item_id=null){
    if(action == "delete"){
        let body = `Bạn muốn xoá user này không?`;
        modal(true, `Xoá user`, body, `Xác nhận`, `delete_user(${JSON.stringify([item_id])})`);
    }
}

function setRole(id, isSetAdmin = true){
    $.ajax({
        url: "/user/setRoleCpanel",
        type: "POST",
        data: {
            user_id: id,
            set_role: (isSetAdmin ? "admin" : "user")
        }
    }).then((data)=>{
        if(data.status == 200){
            notification(".main-body__container", data.status, data.message);
            reloadData();
        }else{
            notification(".main-body__container", data.status, data.message);
        }
    });
}

$('#edit-profile').on('submit', () => {
    return false;
});

$(".avatar-profile").on("click", function(){
    $(".edit-avatar").click();
});

$(".action__task").on("change", function(){
    let action = $(this).val();
    if(action != null && action != "" && action != undefined){
        let item_checked = $(".checkbox-item:checked");
        if(item_checked.length > 0) {
            let list_item = [];
            item_checked.each(function(i)
            {
                if($(this).is(":checked")){
                    let item = $(this).val();
                    list_item.push(item);
                }
            });

            console.log(list_item);

            if(action == "delete"){
                let body = `Bạn muốn xoá user đã chọn hay không?`;
                modal(true, `Xoá user`, body, `Xác nhận`, `delete_user(${JSON.stringify(list_item)})`);
            }
        }
    }

    $(this).val("");
});

$(".sort__task").on("change", function(){
    let sort = $(this).val();
    if(sort != null && sort != "" && sort != undefined){
        reloadData();
    }
});

$(".pagination__selection").on("change", function(){
    reloadData(true);
});

$(document).ready(()=>{
    reloadData(true);
});