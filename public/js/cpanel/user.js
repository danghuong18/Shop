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
                                <img src="${data.data[x].avatar? data.data[x].avatar: "data:image/jpeg;base64,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"}">
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
    let day = $(".day").val();
    let month = $(".month").val();
    let year = $(".year").val();
    let dob = new Date(year + "-" + month + "-" + day);

    if(dob.getDate() != day){
        let status = `Ngày tháng năm sinh bị sai, mời chọn lại.`;
        notification(".main-body__container", 400, status);
    }else{
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