function getList(limit, page){
    $.ajax({
        url: "/category?limit=" + limit + "&page=" + page,
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

function add(){
    let category_name = $(".add-category").val();
    $.ajax({
        url: "/category/create",
        type: "POST",
        data: {
            title: category_name
        }
    }).then((data)=>{
        if(data.status != 200){
            notification(".main-body__container", "warning", `Tạo danh mục "${category_name}"`);
        }else{
            notification(".main-body__container", "success", `Tạo danh mục "${category_name}"`);
            getList(10, 1);
        }
    });
    modal(false);
}

function edit(item_id=null){
    if(item_id != null && item_id != undefined){
        let category_name = $(`#item-${item_id} .body-item__title`)[0].innerText;
        let edit_category_name = $(".edit-category").val();
        $.ajax({
            url: "/category/edit",
            type: "POST",
            data: {
                id: item_id,
                title: edit_category_name
            }
        }).then((data)=>{
            if(data.status != 200){
                notification(".main-body__container", "warning", `Sửa danh mục "${category_name}"`);
            }else{
                notification(".main-body__container", "success", `Sửa danh mục "${category_name}"`);
                getList(10, 1);
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
            url: "/category/delete",
            type: "POST",
            data: {
                list_item: list_item
            }
        }).then((data)=>{
            if(data.status != 200){
                notification(".main-body__container", "warning", `Xoá danh mục "${notif}"`);
            }else{
                notification(".main-body__container", "success", `Xoá danh mục "${notif}"`);
                getList(10, 1);
            }
        });
        modal(false);
    }
}

function action(action="create", item_id=null){
    if(action == "create"){
        let body = `<input type="text" class="add-category" placeholder="Nhập vào tên danh mục">`;
        modal(true, `Tạo danh mục`, body, `Tạo`, `add()`);
    }else if(action == "edit"){
        let category_name = $(`#item-${item_id} .body-item__title`)[0].innerText;
        let body = `<input type="text" class="edit-category" placeholder="Nhập vào tên danh mục" value="${category_name}">`;
        modal(true, `Sửa danh mục`, body, `Sửa`, `edit('${item_id}')`);
    }else if(action == "delete"){
        let category_name = $(`#item-${item_id} .body-item__title`)[0].innerText;
        let body = `Bạn muốn xoá danh mục "${category_name}" hay không?`;
        modal(true, `Xoá danh mục`, body, `Xác nhận`, `delete_item(${JSON.stringify([item_id])})`);
    }
}

$(document).ready(()=>{
    getList(10, 1);
});

$(".action__task").on("change", function(){
    let value = $(this).val();
    if(value != null && value != "" && value != undefined){
        let item_checked = $(".checkbox-item:checked");
        let list_item = [];
        item_checked.each(function(i)
        {
            if($(this).is(":checked")){
                let item = $(this).val();
                list_item.push(item);
                // $(this).prop("checked", false);
                // $("#item-" + $(this).val()).removeClass("checked");
    
                // console.log($(this).val()); // This is your rel value
            }
        });

        console.log(list_item);

        let body = `Bạn muốn xoá danh mục đã chọn hay không?`;
        modal(true, `Xoá danh mục`, body, `Xác nhận`, `delete_item(${JSON.stringify(list_item)})`);
    }

    $(this).val("");
});