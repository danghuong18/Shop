function getList(limit, page, isLoadPagination = false){
    let sort = $(".sort__task").val();
    $.ajax({
        url: "/category?limit=" + limit + "&page=" + page + "&sort=" + sort,
        type: "GET"
    }).then((data)=>{
        if(data.status == 200){
            let list = ``

            for(x in data.data){
                list += `
                <li class="main-body__container__item" id="item-${data.data[x]._id}">
                <input type="checkbox" class="checkbox-item" value="${data.data[x]._id}">
                <div class="body-item">
                    <a href="#" class="body-item__title one-line">${data.data[x].categoryName}</a>
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
                Không có danh mục nào để hiển thị ở đây cả!
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
    let category_name = $(".add-category").val();
    if(category_name.length < 2 || category_name == undefined || category_name == ""){
        let message = "Tên danh mục không được để trống hoặc nhỏ hơn 2 ký tự"
        notification(".modal-body", 400, message);
    }else{
        $.ajax({
            url: "/category/create",
            type: "POST",
            data: {
                title: category_name
            }
        }).then((data)=>{
            if(data.status == 200){
                notification(".main-body__container", data.status, data.message);
                reloadData(true);
                modal(false);
            }else{
                notification(".modal-body", data.status, data.message);
            }
        });
    }
}

function edit(item_id=null){
    if(item_id != null && item_id != undefined){
        let edit_category_name = $(".edit-category").val();

        if(edit_category_name.length < 2 || edit_category_name == undefined || edit_category_name == ""){
            let message = "Tên danh mục không được để trống hoặc nhỏ hơn 2 ký tự"
            notification(".modal-body", 400, message);
        }else{
            $.ajax({
                url: "/category/edit",
                type: "POST",
                data: {
                    id: item_id,
                    title: edit_category_name
                }
            }).then((data)=>{
                if(data.status == 200){
                    notification(".main-body__container", data.status, data.message);
                    reloadData();
                    modal(false);
                }else{
                    notification(".modal-body", data.status, data.message);
                }
            });
        }
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
            url: "/category/delete",
            type: "POST",
            data: {
                list_item: list_item
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

function action(action="create", item_id=null){
    if(action == "create"){
        let body = `<form action="#" id="create-category" method="post">
                        <div class="form-group">
                            <input type="text" name="title" class="add-category" placeholder="Nhập vào tên danh mục">
                        </div>
                        <button style="position: absolute; visibility: hidden;">Tạo</button>
                    </form>
                    <script>
                        $('#create-category').on('submit', () => {
                            add();
                            return false;
                        });
                    </script>`;
        modal(true, `Tạo danh mục`, body, `Tạo`, `add()`);
    }else if(action == "edit"){
        let category_name = $(`#item-${item_id} .body-item__title`)[0].innerText;
        let body = `<form action="#" id="edit-category" method="post">
                        <div class="form-group">
                            <input type="text" name="title" class="edit-category" placeholder="Nhập vào tên danh mục" value="${category_name}">
                        </div>
                        <button style="position: absolute; visibility: hidden;">Sửa</button>
                    </form>
                    <script>
                        $('#edit-category').on('submit', () => {
                            edit('${item_id}');
                            return false;
                        });
                    </script>`;
        modal(true, `Sửa danh mục`, body, `Sửa`, `edit('${item_id}')`);
    }else if(action == "delete"){
        let category_name = $(`#item-${item_id} .body-item__title`)[0].innerText;
        let body = `Bạn muốn xoá danh mục "${category_name}" hay không?`;
        modal(true, `Xoá danh mục`, body, `Xác nhận`, `delete_item(${JSON.stringify([item_id])})`);
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
                let body = `Bạn muốn xoá danh mục đã chọn hay không?`;
                modal(true, `Xoá danh mục`, body, `Xác nhận`, `delete_item(${JSON.stringify(list_item)})`);
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