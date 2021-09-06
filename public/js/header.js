//append cart
$.ajax({
  url: "/user/cart",
  type: "POST",
}).then(function (data) {
  $(".header__cart-notice").text(data.data.length);
  for (let i = 0; i < 4; i++) {
    $(".header__cart-list-item").prepend(`
      <li class="header__cart-item" id="${data.data[i]._id}">
          <img
            src="${data.data[i].thumb}"
            class="header__cart-img"
          />
          <div class="header__cart-item-info">
            <div class="header__cart-item-head">
              <h5 class="header__cart-item-name">
                ${data.data[i].title}
              </h5>
              <div class="header__cart-item-price-wrap">
                <span class="header__cart-item-price">₫${data.data[i].price}</span>
                <span class="header__cart-item-multiply">x</span>
                <span class="header__cart-item-qnt">${data.data[i].quantity}</span>
              </div>
            </div>
            <div class="header__cart-item-body">
              <span class="header__cart-item-description">
                Phân loại:
                <span class="header__cart-item-classify"
                  >${data.data[i].color} - ${data.data[i].size}</span
                >
              </span>
              <span class="header__cart-item-remove">Xóa</span>
            </div>
          </div>
      </li>
      `);
  }
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
    toastr[data.toastr](data.mess);
    $(".header__cart-notice").text(
      parseInt($(".header__cart-notice").text()) - 1
    );
  });
});
