function RemoveDetail(id){
    $("#detail-" + id).remove();
}

function add(){
    let product_name = $(".product-name").val();
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
            notification(".main-body__container", "success", `Tạo sản phẩm "${product_name}"`);
            window.location.href = "/cpanel/product/edit/" + data.data;

        }else if(data.status == 406){
            notification(".main-body__container", "warning", `Lỗi format file upload, tạo sản phẩm "${product_name}"`);
        }else if(data.status == 500){
            notification(".main-body__container", "error", `Tạo sản phẩm "${product_name}"`);
        }else{
            notification(".main-body__container", "warning", `Tạo sản phẩm "${product_name}"`);
        }
    });
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