function getItemList(limit, page, isLoadPagination = false){
    let sort = $(".sort__task").val();
    let product_id = $(".product-id").val();
    $.ajax({
        url: "/product/item?product_id=" + product_id + "&limit=" + limit + "&page=" + page + "&sort=" + sort,
        type: "GET"
    }).then((data)=>{
        if(data.status == 200){
            let list = ``
            for(x in data.data){
                let quantity = ``
                let color = ``
                let size = ``

                if(data.data[x].quantity != undefined && data.data[x].quantity != ""){
                    quantity = `<span class="body-item__details-amount">
                                    <span class="title">Số lượng:</span>
                                    <span class="desc">${data.data[x].quantity}</span>
                                </span>`;
                }

                if(data.data[x].color != undefined && data.data[x].color != ""){
                    color = `<span class="body-item__details-color">
                                    <span class="title">Màu sắc:</span>
                                    <span class="desc">${data.data[x].color}</span>
                                </span>`;
                }

                if(data.data[x].size != undefined && data.data[x].size != ""){
                    size = `<span class="body-item__details-size">
                                    <span class="title">Size:</span>
                                    <span class="desc">${data.data[x].size}</span>
                                </span>`;
                }

                list += `
                <li class="main-body__container__item" id="item-${data.data[x]._id}">
                    <input type="checkbox" class="checkbox-item" value="${data.data[x]._id}">
                    <div class="body-item inline">
                        <span class="item-image">
                            <img src="${data.data[x].thumb}">
                        </span>
                        <div class="body-item__info">
                             <span class="body-item__details">
                                ${quantity}

                                ${color}

                                ${size}
                            </span>
                            <span class="body-item__details">
                                <span class="item-price">${(data.data[x].price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND'})}</span>
                            </span>
                        </div>
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
                            reloadItemData();
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
                ${data.message}
            </li>`;
            $(".main-body__container__list").html(list);
        }else{
            console.log(data);
        }
    })
}

function reloadItemData(isLoadPagination = false){
    let current_page = ($(".pagination__item.active").attr("id") != undefined)? $(".pagination__item.active").attr("id") : 1;
    
    let limit = $(".pagination__selection").val();
    getItemList(limit, current_page, isLoadPagination);
}

function RemoveDetail(id){
    $("#detail-" + id).delay(200).fadeOut();
    setTimeout(function(){
        $("#detail-" + id).remove();
    }, 1000);
}

function add(){
    var createForm = $("#create-product");
    var formData = new FormData(createForm[0]);

    let product_name = $(".product-name").val();
    let product_image = $(".product-image").val();
    let product_category = $(".product-category").val();
    let product_description = $(".product-description").val();
    console.log(product_category);

    let isNotAcceptName = product_name.length < 2 || product_name == undefined || product_name == "";
    let isNotAcceptListThumb = product_image == undefined || product_image == "";
    let isNotAcceptCategory = !product_category || product_category == undefined || product_category == ""; 
    let isNotAcceptDescription = product_description.length < 50 || product_description == undefined || product_description == "";

    if(isNotAcceptName || isNotAcceptListThumb || isNotAcceptCategory || isNotAcceptDescription){
        let message = "";
        if(isNotAcceptName){
            message = "Tên sản phẩm không được để trống hoặc nhỏ hơn 2 ký tự"
            notification("#form-body", 400, message);
        }

        if(isNotAcceptListThumb){
            message = "Chưa có hình ảnh nào được chọn."
            notification("#form-body", 400, message);
        }

        if(isNotAcceptCategory){
            message = "Bạn chưa chọn danh mục cho sản phẩm"
            notification("#form-body", 400, message);
        }

        if(isNotAcceptDescription){
            message = "Mô tả sản phẩm không được để trống hoặc nhỏ hơn 50 ký tự"
            notification("#form-body", 400, message);
        }

    }else{
        $.ajax({
            url: "/product/create",
            type: "POST",
            processData: false,
            contentType: false,
            data: formData
        }).then((data)=>{
            if(data.status == 200){
                notification("#form-body", data.status, data.message);
                setTimeout(function(){
                    window.location.href = "/cpanel/product/" + data.data;
                }, 3000);
    
            }else{
                notification("#form-body", data.status, data.message);
            }
        });
    }
}

function edit() {
    var createForm = $("#edit-product");
    var formData = new FormData(createForm[0]);

    let product_name = $(".product-name").val();
    let product_category = $(".product-category").val();
    let product_description = $(".product-description").val();
    console.log(product_category);

    let isNotAcceptName = product_name.length < 2 || product_name == undefined || product_name == "";
    let isNotAcceptCategory = !product_category || product_category == undefined || product_category == ""; 
    let isNotAcceptDescription = product_description.length < 50 || product_description == undefined || product_description == "";
    
    if(isNotAcceptName || isNotAcceptCategory || isNotAcceptDescription){
        let message = "";
        if(isNotAcceptName){
            message = "Tên sản phẩm không được để trống hoặc nhỏ hơn 2 ký tự"
            notification("#form-body", 400, message);
        }

        if(isNotAcceptCategory){
            message = "Bạn chưa chọn danh mục cho sản phẩm"
            notification("#form-body", 400, message);
        }

        if(isNotAcceptDescription){
            message = "Mô tả sản phẩm không được để trống hoặc nhỏ hơn 50 ký tự"
            notification("#form-body", 400, message);
        }

    }else{
        $.ajax({
            url: "/product/edit",
            type: "POST",
            processData: false,
            contentType: false,
            data: formData
        }).then((data)=>{
            console.log(data);
            if(data.status == 200){
                notification("#form-body", data.status, data.message);
                let list_image = ``;
    
                if(data.data.listImg.length > 0){
                    for(x in data.data.listImg){
                        list_image += `<li class="product-images-item" id="image-${x}">
                                            <img src="${data.data.listImg[x]}">
                                            <a title="Xoá ảnh này"><span class="delete-image-button" id="${x}">X</span></a>
                                        </li>`;
                    }
                }
                let script = `
                <script>
                    $(".delete-image-button").on("click", function(){
                        let id = $(this).attr("id");
                    
                        $("#image-" + id).delay(200).fadeOut();
                    
                        setTimeout(function(){
                            $("#image-" + id).remove();
                        }, 1000);
                    
                        delete_image(id);
                    });
                </script>`
                $(".product-images").html(list_image);
                $(".product-images").append(script);
                $(".main-body__container__title").html(product_name);
            }else{
                notification("#form-body", data.status, data.message);
            }
        });
    }
}

function add_item() {
    var createForm = $("#create-product-item");
    var formData = new FormData(createForm[0]);
    $.ajax({
        url: "/product/create-product-item",
        type: "POST",
        processData: false,
        contentType: false,
        data: formData
    }).then((data)=>{
        console.log(data);
        if(data.status == 200){
            notification("#list-body", data.status, data.message);
            reloadItemData(true);
            modal(false);
        }else{
            notification(".modal-body", data.status, data.message);
        }
    });
}

function edit_item(){
    var createForm = $("#edit-product-item");
    var formData = new FormData(createForm[0]);
    $.ajax({
        url: "/product/edit-product-item",
        type: "POST",
        processData: false,
        contentType: false,
        data: formData
    }).then((data)=>{
        if(data.status == 200){
            notification("#list-body", data.status, data.message);
            reloadItemData();
            modal(false);
        }else{
            notification(".modal-body", data.status, data.message);
        }
    });
}

function delete_item(list_item=[]){
    let product_id = ($(".product-id").val() != undefined) ? $(".product-id").val() : "";

    if(product_id != "") {
        $.ajax({
            url: "/product/delete-product-item",
            type: "POST",
            data: {
                product_id: product_id,
                list_item: list_item
            }
        }).then((data)=>{
            if(data.status == 200){
                notification("#list-body", data.status, data.message);
                reloadItemData(true);
            }else{
                notification("#list-body", data.status, data.message);
            }
        });
        modal(false);
    }
}

function delete_image(id){
    let product_id = ($(".product-id").val() != undefined) ? $(".product-id").val() : "";
    let image_url = $("#image-" + id + " img").attr("src");

    if(product_id != "" && image_url ) {
        $.ajax({
            url: "/product/delete-image",
            type: "POST",
            data: {
                product_id: product_id,
                image_url: image_url
            }
        }).then((data)=>{
            if(data.status == 200){
                notification("#form-body", data.status, data.message);
            }else{
                notification("#form-body", data.status, data.message);
            }
        });
    }
}

function action(action="create", item_id=null){
    let product_id = ($(".product-id").val() != undefined) ? $(".product-id").val() : "";
    if(action == "create"){
        let body = `<form action="#" id="create-product-item" method="post" enctype="multipart/form-data">
                        <div class="form-group" style="display: none">
                            <label>Product ID</label>
                            <input type="text" name="product_id" value="${product_id}" readonly>
                        </div>
                        <div class="form-group">
                            <label>Màu sắc sản phẩm</label>
                            <input type="text" name="color" class="color-product-item" placeholder="Nhập vào màu sắc sản phẩm">
                        </div>
                        <div class="form-group">
                            <label>Size sản phẩm (Quần áo: S M L XL, Giày dép: 38, 39, 40...)</label>
                            <input type="text" name="size" class="size-product-item" placeholder="Nhập vào size sản phẩm">
                        </div>
                        <div class="form-group">
                            <label>Giá sản phẩm (VNĐ)</label>
                            <input type="number" name="price" min="0" oninput="this.value = 
                            !!this.value && Math.abs(this.value) >= 0 ? Math.abs(this.value) : null" class="price-product-item" placeholder="Nhập vào giá sản phẩm">
                        </div>
                        <div class="form-group">
                            <label>Số lượng</label>
                            <input type="number" name="quantity" min="0" oninput="this.value = 
                            !!this.value && Math.abs(this.value) >= 0 ? Math.abs(this.value) : null" class="quantity-product-item" placeholder="Nhập vào số lượng sản phẩm">
                        </div>
                        <div class="form-group">
                            <label>Hình sản phẩm</label>
                            <input type="file" name="thumbnail-product-item" class="thumbnail-product-item" accept="image/gif, image/jpeg, image/png">
                        </div>
                        <button style="position: absolute; visibility: hidden;">Tạo</button>
                    </form>
                    <script>
                        $('#create-product-item').on('submit', () => {
                            add_item();
                            return false;
                        });
                    </script>`;
        modal(true, `Tạo item sản phẩm`, body, `Tạo`, `add_item()`);
    }else if(action == "edit"){
        $.ajax({
            url: "/product/item/" + item_id,
            type: "GET"
        }).then((data)=>{
            if(data.status == 200){
                let body = `<form action="#" id="edit-product-item" method="post" enctype="multipart/form-data">
                                <div class="form-group" style="display: none">
                                    <label>Item ID</label>
                                    <input type="text" name="item_id" value="${item_id}" readonly>
                                </div>
                                <div class="form-group">
                                    <label>Màu sắc sản phẩm</label>
                                    <input type="text" name="color" class="color-product-item" value="${data.data.color}" placeholder="Nhập vào màu sắc sản phẩm">
                                </div>
                                <div class="form-group">
                                    <label>Size sản phẩm (Quần áo: S M L XL, Giày dép: 38, 39, 40...)</label>
                                    <input type="text" name="size" class="size-product-item" value="${data.data.size}" placeholder="Nhập vào size sản phẩm">
                                </div>
                                <div class="form-group">
                                    <label>Giá sản phẩm (VNĐ)</label>
                                    <input type="number" name="price" min="0" oninput="this.value = 
                                    !!this.value && Math.abs(this.value) >= 0 ? Math.abs(this.value) : null" class="price-product-item" value="${data.data.price}" placeholder="Nhập vào giá sản phẩm">
                                </div>
                                <div class="form-group">
                                    <label>Số lượng</label>
                                    <input type="number" name="quantity" min="0" oninput="this.value = 
                                    !!this.value && Math.abs(this.value) >= 0 ? Math.abs(this.value) : null" class="quantity-product-item" value="${data.data.quantity}" placeholder="Nhập vào số lượng sản phẩm">
                                </div>
                                <div class="form-group">
                                    <label>Hình sản phẩm (Để trống nếu không muốn thay đổi)</label>
                                    <input type="file" name="thumbnail-product-item" class="thumbnail-product-item" accept="image/gif, image/jpeg, image/png">
                                </div>
                                <button style="position: absolute; visibility: hidden;">Sửa</button>
                            </form>
                            <script>
                                $('#edit-product-item').on('submit', () => {
                                    edit_item();
                                    return false;
                                });
                            </script>`;
                modal(true, `Sửa item sản phẩm`, body, `Sửa`, `edit_item()`);
            }
        });

    }else if(action == "delete"){
        let body = `Bạn muốn xoá item sản phẩm này không?`;
        modal(true, `Xoá item sản phẩm`, body, `Xác nhận`, `delete_item(${JSON.stringify([item_id])})`);
    }
}

$('#create-product').on('submit', () => {
    return false;
});

$('#edit-product').on('submit', () => {
    return false;
});

$(".plus-button").on("click", function(){
    let count = $(".product-details-item").length;
    let body = `<li class="product-details-item" id="detail-${count + 1}">
                    <input type="text" name="detail-title" class="product-details-item-title" placeholder="Tiêu đề">
                    <input type="text" name="detail-content" class="product-details-item-content" placeholder="Nội dung">
                    <a href="#" class="minus-button" onclick="RemoveDetail(${count + 1})">-</a>
                </li>`;

    $(".product-details").append(body);
});

$(document).ready(()=>{
    reloadItemData(true);
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
                let body = `Bạn muốn xoá item sản phẩm đã chọn hay không?`;
                modal(true, `Xoá item sản phẩm`, body, `Xác nhận`, `delete_item(${JSON.stringify(list_item)})`);
            }
        }
    }

    $(this).val("");
});

$(".sort__task").on("change", function(){
    let sort = $(this).val();
    if(sort != null && sort != "" && sort != undefined){
        reloadItemData();
    }
});

$(".pagination__selection").on("change", function(){
    reloadItemData(true);
});