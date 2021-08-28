function RemoveDetail(id){
    $("#detail-" + id).delay(200).fadeOut();
    setTimeout(function(){
        $("#detail-" + id).remove();
    }, 1000);
}

function add(){
    var createForm = $("#create-product");
    var formData = new FormData(createForm[0]);
    
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

function edit() {
    var createForm = $("#edit-product");
    var formData = new FormData(createForm[0]);
    
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
        }else{
            notification("#form-body", data.status, data.message);
        }
    });
}

function delete_product() {
    let product_id = ($(".product-id").val() != undefined) ? $(".product-id").val() : "";

    if(product_id != "") {
        $.ajax({
            url: "/product/delete",
            type: "POST",
            data: {
                product_id: product_id
            }
        }).then((data)=>{
            if(data.status == 200){
                notification("#list-body", data.status, data.message);
            }else{
                notification("#list-body", data.status, data.message);
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
            }else{
                notification("#list-body", data.status, data.message);
            }
        });
    }
    modal(false);
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
                            <input type="number" name="price" min="0" step="10000" oninput="this.value = 
                            !!this.value && Math.abs(this.value) >= 0 ? Math.abs(this.value) : null" class="price-product-item" placeholder="Nhập vào giá sản phẩm">
                        </div>
                        <div class="form-group">
                            <label>Số lượng</label>
                            <input type="number" name="quantity" min="0" step="5" oninput="this.value = 
                            !!this.value && Math.abs(this.value) >= 0 ? Math.abs(this.value) : null" class="quantity-product-item" placeholder="Nhập vào số lượng sản phẩm">
                        </div>
                        <div class="form-group">
                            <label>Hình sản phẩm</label>
                            <input type="file" name="thumbnail-product-item" class="thumbnail-product-item" accept="image/gif, image/jpeg, image/png">
                        </div>
                    </form>`;
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
                                    <input type="number" name="price" min="0" step="10000" oninput="this.value = 
                                    !!this.value && Math.abs(this.value) >= 0 ? Math.abs(this.value) : null" class="price-product-item" value="${data.data.price}" placeholder="Nhập vào giá sản phẩm">
                                </div>
                                <div class="form-group">
                                    <label>Số lượng</label>
                                    <input type="number" name="quantity" min="0" step="5" oninput="this.value = 
                                    !!this.value && Math.abs(this.value) >= 0 ? Math.abs(this.value) : null" class="quantity-product-item" value="${data.data.quantity}" placeholder="Nhập vào số lượng sản phẩm">
                                </div>
                                <div class="form-group">
                                    <label>Hình sản phẩm (Để trống nếu không muốn thay đổi)</label>
                                    <input type="file" name="thumbnail-product-item" class="thumbnail-product-item" accept="image/gif, image/jpeg, image/png">
                                </div>
                            </form>`;
                modal(true, `Sửa item sản phẩm`, body, `Sửa`, `edit_item()`);
            }
        });

    }else if(action == "delete"){
        let body = `Bạn muốn xoá item sản phẩm này không?`;
        modal(true, `Xoá item sản phẩm`, body, `Xác nhận`, `delete_item(${JSON.stringify([item_id])})`);
    }
}

$(".plus-button").on("click", function(){
    let count = $(".product-details-item").length;
    let body = `<li class="product-details-item" id="detail-${count + 1}">
                    <input type="text" name="detail-title" class="product-details-item-title" placeholder="Tiêu đề">
                    <input type="text" name="detail-content" class="product-details-item-content" placeholder="Nội dung">
                    <a href="#" class="minus-button" onclick="RemoveDetail(${count + 1})">-</a>
                </li>`;

    $(".product-details").append(body);
});

$(".delete-image-button").on("click", function(){
    let id = $(this).attr("id");

    $("#image-" + id).delay(200).fadeOut();

    setTimeout(function(){
        $("#image-" + id).remove();
    }, 1000);

    delete_image(id);
});