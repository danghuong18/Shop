function loadData(){
    $.ajax({
        url: "/statistic",
        type: "GET"
    }).then((data)=>{
        if(data.status == 200){
            let list = `
            <li class="main-body__statistic__item">
                <div class="icon"><i class="fas fa-money-bill-wave"></i></div>
                <div class="info">
                    <div class="heading">${data.data.revenue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND'})}</div>
                    <span class="desc">Doanh thu</span>
                </div>
            </li>
            <li class="main-body__statistic__item main-body__statistic__item--new">
                <div class="icon"><i class="fas fa-users"></i></div>
                <div class="info">
                    <div class="heading">${data.data.user}</div>
                    <span class="desc">Thành viên</span>
                </div>
            </li>
            <li class="main-body__statistic__item main-body__statistic__item--total">
                <div class="icon"><i class="fas fa-shopping-bag"></i></div>
                <div class="info">
                    <div class="heading">${data.data.product}</div>
                    <span class="desc">Sản phẩm</span>
                </div>
            </li>
            <li class="main-body__statistic__item  main-body__statistic__item--visitor">
                <div class="icon"><i class="fas fa-shopping-cart"></i></div>
                <div class="info">
                    <div class="heading">${data.data.order}</div>
                    <span class="desc">Đơn hàng</span>
                </div>
            </li>`

            $(".main-body__statistic__list").html(list)
        }else{
            console.log(data);
        }
    });
}

function loadUserData(){
    $.ajax({
        url: "/user",
        type: "GET"
    }).then((data)=>{
        if(data.status == 200){
            let list = ``;
            for(x in data.data){
                // let avatar = (data.data[x].avatar) ? data.data[x].avatar : "";
                list += `
                <li class="member-item">
                    <span class="member-item-avatar">
                        <img src="${(data.data[x].avatar) ? data.data[x].avatar : "data:image/jpeg;base64,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"}">
                    </span>
                    <span class="member-item-username">${data.data[x].username}</span>
                </li>`;
            }

            $(".member-list").html(list)
        }else{
            console.log(data);
        }
    });
}

function loadRevenueData() {
    $.ajax({
        url: "/statistic/revenue",
        type: "GET"
    }).then((data)=>{
        if(data.status == 200){
            let list = ``;
            let max = data.max;

            for(x in data.data){
                let percent = Math.floor((data.data[x].revenue/max)*100);
                list += `
                <tr style="height:${percent}%">
                    <th scope="row">${data.data[x].day}</th>
                    <td><div class="tooltip">${(data.data[x].revenue).toLocaleString('vi-VN', { style: 'currency', currency: 'VND'})}</div></td>
                </tr>`;
            }

            let style = `<style>
                            .graph tbody:before {
                                content: "${max.toLocaleString('vi-VN', { style: 'currency', currency: 'VND'})}";
                                top: -1.6em;
                            }

                            .graph tbody:after {
                                content: "0";
                                bottom: -0.6em;
                            }
                        </style>`;

            let final_list = `
                <caption>Doanh Thu Theo Ngày</caption>
                <thead>
                    <tr>
                        <th scope="col">Item</th>
                        <th scope="col">Percent</th>
                    </tr>
                </thead>
                ${max}
                <tbody>
                    ${list}
                </tbody>
                ${style}`;

            $(".graph").html(final_list)
        }else{
            console.log(data);
        }
    });
}

function loadOrderData(){
    $.ajax({
        url: "/order?limit=10",
        type: "GET"
    }).then((data)=>{
        if(data.status == 200){
            let list = ``;
            for(x in data.data){
                let status = (data.data[x].status == "success") ? `<span class="status-order status-order--success">Thành công</span>` : (data.data[x].status == "pending") ? `<span class="status-order status-order--pending">Đang chờ</span>` : `<span class="status-order status-order--fail">Thất bại</span>`;
                let all_products = ``;
                if(data.data[x].listProduct.length > 0) {
                    let data_item = data.data[x].listProduct;
                    for(i in data_item){
                        if(i > 0){
                            all_products += `, ` + data_item[i].productID.productCode.productName;
                        }else{
                            all_products += data_item[i].productID.productCode.productName;
                        }
                    }
                }

                list += `
                <tr>
                    <td class="product-name" title="${all_products}">
                        ${all_products}
                    </td>
                    <td>
                        ${data.data[x].userID.username}
                    </td>
                    <td>
                        ${status}
                    </td>
                    <td>
                        ${new Date(data.data[x].createDate).toLocaleDateString("vi-VN")}
                    </td>
                </tr>`;
            }

            let final_list = `
            <tbody>
                <tr>
                    <th style="width: 40%">
                        Sản phẩm
                    </th>
                    <th style="width: 20%">
                        Khách hàng
                    </th>
                    <th style="width: 20%">
                        Trạng thái
                    </th>
                    <th style="width: 20%">
                        Ngày mua
                    </th>
                </tr>
                ${list}
            </tbody>`;

            $(".recent-order").html(final_list)
        }else{
            console.log(data);
        }
    });
}

function loadProductData(){
    $.ajax({
        url: "/product?limit=5",
        type: "GET"
    }).then((data)=>{
        if(data.status == 200){
            let list = ``;
            for(x in data.data){
                list += `
                <li class="hot-product-item">
                    <a href="/product/${data.data[x]._id}" title="${data.data[x].productName}">
                        <span class="hot-product-item-image">
                            <img src="${data.data[x].listImg[0]}">
                            <span class="hot-product-item-background"></span>
                            <span class="hot-product-item-title">${data.data[x].productName}</span>
                        </span>
                    </a>
                </li>`;
            }

            for(x=1; x <= 5 - data.data.length; x++){
                list += `
                <li class="hot-product-item">
                    <span class="hot-product-item-image">
                        <span class="hot-product-item-nonbackground"></span>
                    </span>
                </li>`;
            }

            $(".hot-product-list").html(list)
        }else{
            console.log(data);
        }
    });
}

$(document).ready(()=>{
    loadData();
    loadOrderData();
    loadRevenueData();
    loadUserData();
    loadProductData();
});