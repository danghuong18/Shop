function getList(limit, page, isLoadPagination = false){
    let sort = $(".sort__task").val();
    $.ajax({
        url: "/product?limit=" + limit + "&page=" + page + "&sort=" + sort,
        type: "GET"
    }).then((data)=>{
        if(data.status == 200){
            let list = ``

            for(x in data.data){
                let category = ``
                let list_image = ``

                if(data.data[x].categoryID){
                    for(i in data.data[x].categoryID){
                        category += data.data[x].categoryID[i].categoryName + ((data.data[x].categoryID.length - i != 1)? ", ": "");
                    }
                }

                if(data.data[x].listImg){
                    for(i in data.data[x].listImg){
                        list_image += `<li class="item-image">
                                            <img src="${data.data[x].listImg[i]}">
                                        </li>`;
                    }
                }

                list += `
                <li class="main-body__container__item" id="item-${data.data[x]._id}">
                    <input type="checkbox" class="checkbox-item" value="${data.data[x]._id}">
                    <div class="body-item">
                        <a href="/cpanel/product/${data.data[x]._id}" class="body-item__title">
                            ${data.data[x].productName}
                        </a>
                        <div class="body-item__info">
                            <span class="body-item__details">
                                <span class="body-item__details-category">
                                    <span class="title">Danh mục:</span>
                                    <span class="desc">${category}</span>
                                </span>
                                <span class="body-item__details-brand">
                                    <span class="title">Nhãn hiệu:</span>
                                    <span class="desc">${data.data[x].brand.brandName}</span>
                                </span>
                            </span>
                            <span class="body-item__details body-item__details-image">
                                <ul class="list-image">
                                    ${list_image}
                                </ul>
                            </span>
                        </div>
                    </div>
                    <div class="action-item">
                        <span class="action-item__delete" onclick="action('delete','${data.data[x]._id}')">Xoá</span>
                        <span class="action-item__edit" onclick="edit('${data.data[x]._id}')">Sửa</span>
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
                Không có sản phẩm nào để hiển thị ở đây cả!
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

function edit(id) {
    if(id != undefined && id != ""){
        window.location.href = "/cpanel/product/" + id;
    }
}

function delete_product(list_item = []) {
    if(list_item && list_item != undefined && list_item != "") {
        $.ajax({
            url: "/product/delete",
            type: "POST",
            data: {
                list_product: list_item
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
    if(action == "delete"){
        let body = `Nếu xoá thì những item thuộc sản phẩm và hình ảnh sẽ bị xoá, bạn muốn xoá sản phẩm này không?`;
        modal(true, `Xoá sản phẩm`, body, `Xác nhận`, `delete_product(${JSON.stringify([item_id])})`);
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

            if(action == "delete"){
                let body = `Nếu xoá thì những item thuộc sản phẩm và hình ảnh sẽ bị xoá, bạn muốn xoá item sản phẩm đã chọn hay không?`;
                modal(true, `Xoá sản phẩm`, body, `Xác nhận`, `delete_product(${JSON.stringify(list_item)})`);
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