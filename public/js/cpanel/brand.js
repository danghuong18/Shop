function getList(limit, page, isLoadPagination = false){
    let sort = $(".sort__task").val();
    $.ajax({
        url: "/brand?limit=" + limit + "&page=" + page + "&sort=" + sort,
        type: "GET"
    }).then((data)=>{
        if(data.status == 200){
            let list = ``

            for(x in data.data){
                list += `
                <li class="main-body__container__item" id="item-${data.data[x]._id}">
                <input type="checkbox" class="checkbox-item" value="${data.data[x]._id}">
                <div class="body-item">
                    <a href="#" class="body-item__title one-line">
                        <span><img src="${data.data[x].logo}" alt="Logo ${data.data[x].brandName}"></span>
                        <label>${data.data[x].brandName}</label>
                    </a>
                </div>
                <div class="action-item">
                    <span class="action-item__delete" onclick="action('delete', '${data.data[x]._id}')">Xoá</span>
                    <span class="action-item__edit" onclick="action('edit', '${data.data[x]._id}')">Sửa</span>
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
                Không có thương hiệu nào để hiển thị ở đây cả!
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

function add(){
    let brand_name = $(".add-brand").val();
    var createForm = $("#create-brand");
    var formData = new FormData(createForm[0]);
    $.ajax({
        url: "/brand/create",
        type: "POST",
        processData: false,
        contentType: false,
        data: formData
    }).then((data)=>{
        if(data.status == 200){
            notification(".main-body__container", "success", `Tạo thương hiệu "${brand_name}"`);
            reloadData(true);
        }else if(data.status == 406){
            notification(".main-body__container", "warning", `Lỗi format file upload, tạo thương hiệu "${brand_name}"`);
        }else if(data.status == 500){
            notification(".main-body__container", "error", `Tạo thương hiệu "${brand_name}"`);
        }else{
            notification(".main-body__container", "warning", `Tạo thương hiệu "${brand_name}"`);
        }
    });
    modal(false);
}

function edit(item_id=null){
    if(item_id != null && item_id != undefined){
        let brand_name = $(`#item-${item_id} .body-item__title`)[0].innerText;
        // let edit_brand_name = $(".edit-brand").val();
        // let brand_name = $(".add-brand").val();
        var createForm = $("#create-brand");
        var formData = new FormData(createForm[0]);
        $.ajax({
            url: "/brand/edit",
            type: "POST",
            processData: false,
            contentType: false,
            data: formData
        }).then((data)=>{
            if(data.status == 200){
                notification(".main-body__container", "success", `Sửa thương hiệu "${brand_name}"`);
                reloadData();
            }else if(data.status == 406){
                notification(".main-body__container", "warning", `Lỗi format file upload, sửa thương hiệu "${brand_name}"`);
            }else{
                notification(".main-body__container", "warning", `Sửa thương hiệu "${brand_name}"`);
            }
        });
        modal(false);
    }
}

function delete_item(list_item=[]){
    if(list_item != [] && list_item != undefined){
        let notif = ``;
        console.log(list_item.length);
        console.log(list_item);
        if(list_item.length == 1){
            notif = $(`#item-${list_item[0]} .body-item__title`)[0].innerText;
        }else{
            notif = `đã chọn`;
        }
        $.ajax({
            url: "/brand/delete",
            type: "POST",
            data: {
                list_item: list_item
            }
        }).then((data)=>{
            if(data.status != 200){
                notification(".main-body__container", "warning", `Xoá thương hiệu "${notif}"`);
            }else{
                notification(".main-body__container", "success", `Xoá thương hiệu "${notif}"`);
                reloadData(true);
            }
        });
        modal(false);
    }
}

function action(action="create", item_id=null){
    if(action == "create"){
        let body = `<form action="#" id="create-brand" method="post" enctype="multipart/form-data">
                        <div class="form-group">
                            <label>Tên thương hiệu</label>
                            <input type="text" name="title" class="add-brand" placeholder="Nhập vào tên thương hiệu">
                        </div>
                        <div class="form-group">
                            <label>Logo thương hiệu</label>
                            <input type="file" name="brandlogo" class="logo-brand" accept="image/gif, image/jpeg, image/png">
                        </div>
                    </form>`;
        modal(true, `Tạo thương hiệu`, body, `Tạo`, `add()`);
    }else if(action == "edit"){
        let brand_name = $(`#item-${item_id} .body-item__title`)[0].innerText;
        let body = `<form action="#" id="create-brand" method="post" enctype="multipart/form-data">
                        <div class="form-group" style="display: none">
                            <label>ID</label>
                            <input type="text" name="id" class="id-brand" placeholder="ID thương hiệu" value="${item_id}">
                        </div>
                        <div class="form-group">
                            <label>Tên thương hiệu</label>
                            <input type="text" name="title" class="edit-brand" placeholder="Nhập vào tên thương hiệu" value="${brand_name}">
                        </div>
                        <div class="form-group">
                            <label>Logo thương hiệu (Để trống nếu không muốn thay logo)</label>
                            <input type="file" name="brandlogo" class="logo-brand" accept="image/gif, image/jpeg, image/png">
                        </div>
                    </form>`;
        modal(true, `Sửa thương hiệu`, body, `Sửa`, `edit('${item_id}')`);
    }else if(action == "delete"){
        let brand_name = $(`#item-${item_id} .body-item__title`)[0].innerText;
        let body = `Bạn muốn xoá thương hiệu "${brand_name}" hay không?`;
        modal(true, `Xoá thương hiệu`, body, `Xác nhận`, `delete_item(${JSON.stringify([item_id])})`);
    }
}

$(document).ready(()=>{
    reloadData(true);
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
                let body = `Bạn muốn xoá thương hiệu đã chọn hay không?`;
                modal(true, `Xoá thương hiệu`, body, `Xác nhận`, `delete_item(${JSON.stringify(list_item)})`);
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