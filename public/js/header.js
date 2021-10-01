//append cart
function loadCart(){
  $.ajax({
    url: "/user/cart",
    type: "POST",
  }).then(function (data) {
    if(data.status == 200){
      $(".header__cart-notice").html(data.data.length);
      if (data.data.length > 0) {
        let list_item = ``;
        let cart_title = `<h4 class="header__cart-heading">Sản phẩm đã thêm</h4>`;

        for(i in data.data){
          list_item += `
          <li class="header__cart-item" id="${data.data[i]._id}">
            <img src="${data.data[i].thumb}" class="header__cart-img"/>
            <div class="header__cart-item-info">
              <div class="header__cart-item-head">
                <h5 class="header__cart-item-name">
                  ${data.data[i].title}
                </h5>
                <div class="header__cart-item-price-wrap">
                  <span class="header__cart-item-price">${(data.data[i].price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND'})}</span>
                  <span class="header__cart-item-multiply">x</span>
                  <span class="header__cart-item-qnt">${data.data[i].quantity}</span>
                </div>
              </div>
              <div class="header__cart-item-body">
                <span class="header__cart-item-description">
                  Phân loại:
                  <span class="header__cart-item-classify">${data.data[i].color} - ${data.data[i].size}</span>
                </span>
                <span class="header__cart-item-remove">Xóa</span>
              </div>
            </div>
        </li>
            `
        }

        let cart_footer = `
          <a href="/user/cart">
            <button class="btn btn--primary header__cart-view-cart">
            Xem giỏ hàng
            </button>
          </a>
        `

        let cart_header = `
          ${cart_title}
          <ul class="header__cart-list-item">
            ${list_item}
          </ul>
          ${cart_footer}
        `;

        $(".header__cart-list").html(cart_header);

      } else {

        let cart_header = `
          <div class="header__cart-list--no-cart">
          <img src="/public/img/no_cart.png" alt=""
          class="header__cart-no-cart-img"/>
          <p class="header__cart-no-cart-msg">Chưa có sản phẩm</p>
          </div>
          <a href="/">
            <button class="btn btn--primary header__cart-view-cart">
              Mua sắm ngay
            </button>
          </a>
        `;

        $(".header__cart-list").html(cart_header);
      }
    }
  });
}

$(document).ready(function () {
  loadCart();
});

//cart delete
$(document).on("click", ".header__cart-item-remove", function () {
  let thisEle = $(this).parent().parent().parent();
  let productID = thisEle.attr("id");
  console.log(productID);
  $.ajax({
    url: "/user/cart/delete",
    type: "DELETE",
    data: {
      productID: productID,
    },
  }).then(function (data) {
    console.log(data);
    thisEle.remove();
    loadCart();
  });
});