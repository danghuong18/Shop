function getList(limit, page, isLoadPagination = false){
    let sort = $(".sort__task").val();
    $.ajax({
        url: "/order?limit=" + limit + "&page=" + page + "&sort=" + sort,
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
                        if(data_item[i].productID.color && data_item[i].productID.size){
                            details_item = `<span class="details">(Màu sắc: ${data_item[i].productID.color}, Size: ${data_item[i].productID.size})</span>`;
                        }else{
                            if(data_item[i].productID.color) {
                                details_item = `<span class="details">(Màu sắc: ${data_item[i].productID.color})</span>`;
                            }else if(data_item[i].productID.size){
                                details_item = `<span class="details">(Màu sắc: ${data_item[i].productID.size})</span>`;
                            }
                        }

                        if(i > 0){
                            all_products += `, ` + data_item[i].productID.productCode.productName;
                        }else{
                            all_products += data_item[i].productID.productCode.productName;
                        }

                        list_item += `
                        <div class="body-item">
                            <span class="body-item__details">
                                <span class="body-item__details-product">
                                    <span class="multiplier">${data_item[i].quantity}</span> x 
                                    <span class="title"><a href="/product/${data_item[i].productID.productCode._id}" target="_blank">${data_item[i].productID.productCode.productName}</a></span>
                                    ${details_item}
                                </span>
                                <span class="body-item__details-price">
                                    ${(data_item[i].quantity * data_item[i].productID.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND'})}
                                </span>
                            </span>
                        </div>`;
                    }
                }

                if(data.data[x].status == "pending"){
                    button = `
                    <div class="body-item">
                        <span class="body-item__details">
                            <span class="body-item__details-product">
                            </span>
                            <span class="body-item__details-price">
                                <a href="#" class="order-confirm" onclick="confirmOrder('${data.data[x]._id}')">Xác nhận đơn</a>
                            </span>
                        </span>
                    </div>`;
                }

                if(data.data[x].status == "success"){
                    status = `<span class="body-item__status body-item__status--success">Thành công</span>`;
                }else if(data.data[x].status == "pending"){
                    status = `<span class="body-item__status body-item__status--pending">Đang chờ</span>`;
                }else if(data.data[x].status == "fail"){
                    status = `<span class="body-item__status body-item__status--fail">Thất bại</span>`;
                }

                list += `
                <li class="main-body__container__item order" id="item-${data.data[x]._id}">
                    <div class="body-item body-item__width-70">
                        ${status}
                        <a class="body-item__title one-line">${data.data[x].listProduct.length} sản phẩm: ${all_products}</a>
                        <div class="body-item__info">
                            <span class="body-item__details">
                                <span class="body-item__details-category">
                                    <span class="title">Khách hàng:</span>
                                    <span class="desc">${data.data[x].userID.username}</span>
                                </span>
                            </span>
                        </div>
                    </div>
                    <div class="body-item body-item__width-30">
                        <div class="body-item__info">
                            <span class="body-item__total-price">Tổng: ${(data.data[x].price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND'})}</span>
                        </div>
                    </div>
                    <div class="action-item">
                        <span class="action-item__extend" id="${data.data[x]._id}">Xem thêm <i class="fas fa-angle-double-down"></i></span>
                        <span class="action-item__collapse" id="${data.data[x]._id}">Thu gọn <i class="fas fa-angle-double-up"></i></span>
                    </div>
                </li>
                <li class="main-body__container__item__extend" id="extend-${data.data[x]._id}">
                    ${list_item}
                    ${button}
                </li>
                <li class="main-body__container__item__bottom"></li>`;
            }

            let script = `
            <script>
                $(".action-item__extend").on("click", function(){
                    let id = $(this).attr("id");
                    $("#item-" + id).addClass("extend");
                    $("#extend-" + id).slideDown();
                });
                
                $(".action-item__collapse").on("click", function(){
                    let id = $(this).attr("id");
                    $("#item-" + id).removeClass("extend");
                    $("#extend-" + id).slideUp();
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
                Không có đơn hàng nào để hiển thị ở đây cả!
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

function confirmOrder(id) {
    if(id != undefined && id != ""){
        $.ajax({
            url: "/order/confirmOrder",
            type: "POST",
            data: {
                id: id
            }
        }).then((data)=>{
            if(data.status == 200){
                notification(".main-body__container", data.status, data.message);
                reloadData();
            }else{
                notification(".main-body__container", data.status, data.message);
            }
        })
    }
}

$(document).ready(()=>{
    reloadData(true);
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