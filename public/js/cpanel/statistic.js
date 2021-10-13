function loadData(){
    $.ajax({
        url: "/statistic",
        type: "GET"
    }).then((data)=>{
        if(data.status == 200){
            let list = `
            <li class="main-body__statistic__item" title="Doanh thu: ${data.data.revenue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND'})}">
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
        url: "/user?limit=10&sort=date-desc",
        type: "GET"
    }).then((data)=>{
        if(data.status == 200){
            let list = ``;
            for(x in data.data){
                // let avatar = (data.data[x].avatar) ? data.data[x].avatar : "";
                list += `
                <li class="member-item">
                    <span class="member-item-avatar">
                        <img src="${(data.data[x].avatar) ? data.data[x].avatar : "/public/upload/default-avatar.jpg"}">
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
        url: "/order?limit=10&sort=date-desc",
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
                        if(data_item[i].productID){
                            if(i > 0){
                                all_products += `, ` + data_item[i].productID.productCode.productName;
                            }else{
                                all_products += data_item[i].productID.productCode.productName;
                            }
                        }else{
                            if(i > 0){
                                all_products += `, Sản phẩm đã bị xoá`;
                            }else{
                                all_products += `Sản phẩm đã bị xoá`;
                            }
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
        url: "/product?limit=5&sort=date-desc",
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