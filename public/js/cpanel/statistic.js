function loadData(){
    let sort = $(".sort__task").val();
    $.ajax({
        url: "/cpanel/statistic",
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
    })
}

$(document).ready(()=>{
    loadData();
});