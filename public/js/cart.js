toastr.options = {
  closeButton: true,
  debug: false,
  newestOnTop: false,
  progressBar: true,
  positionClass: "toast-top-right",
  preventDuplicates: false,
  onclick: null,
  showDuration: "300",
  hideDuration: "1000",
  timeOut: "2000",
  extendedTimeOut: "1000",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut",
};

let oldQuantity;

$(document).ready(function () {
  $.ajax({
    url: "/user/cart",
    type: "POST",
  })
    .then(function (data) {
      for (let i = 0; i < data.data.length; i++) {
        $(".cart-item-container").append(`
              <div class="cart-item" id="${data.data[i]._id}">
                <input type="checkbox" class="cart-checkbox cart-item-check" />
                <a
                  href="/product/${data.data[i].productCodeID}"
                >
                  <img src="${
                    data.data[i].thumb
                  }" alt="" class="cart-item-img" />
                </a>
                <div class="cart-item-title">
                  <a
                    href="/product/${data.data[i].productCodeID}"
                    >${data.data[i].title}</a
                  >
                </div>
                <div class="cart-item-choose">
                  Phân Loại Hàng: <br />
                  ${data.data[i].color} - ${data.data[i].size}
                </div>
                <div class="cart-item-price">₫${data.data[i].price}</div>
                <div class="cart-item-quantity">
                  <input
                    type="number"
                    class="cart-item-quantity-input"
                    value="${data.data[i].quantity}"
                    old="${data.data[i].quantity}"
                  />
                </div>
                <div class="cart-item-total-price">
                  ₫${data.data[i].price * data.data[i].quantity}
                </div>
                <div class="cart-item-action">Xóa</div>
              </div>    
              `);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  console.log("trigger");
});

$(document).on("change", ".cart-item-quantity-input", function () {
  let productID = $(this).parent().parent().attr("id");
  let newQuantity = parseInt($(this).val());
  let price = parseInt(
    $(this).parent().parent().children(".cart-item-price").text().split("₫")[1]
  );
  let thisEle = $(this);
  oldQuantity = parseInt(thisEle.attr("old"));
  let totalPriceEle = $(this)
    .parent()
    .parent()
    .children(".cart-item-total-price");
  if (newQuantity - oldQuantity <= 0) {
    $.ajax({
      url: "/user/cart/delete",
      type: "DELETE",
      data: {
        productID: productID,
      },
    })
      .then(function (data) {
        toastr[data.toastr](data.mess);
        thisEle.parent().parent().remove();
      })
      .catch(function (err) {
        toastr[err.toastr](err.mess);
      });
  } else {
    $.ajax({
      url: "/user/addcart",
      type: "POST",
      data: {
        productID: productID,
        quantity: newQuantity - oldQuantity,
      },
    })
      .then(function (data) {
        toastr[data.toastr](data.mess[1]);
        totalPriceEle.text("₫" + price * newQuantity);
        if (data.status == 400) {
          thisEle.val(oldQuantity);
        }
        thisEle.attr("old", parseInt(thisEle.val()));
      })
      .catch(function (err) {
        console.log(err);
        toastr[err.toastr](err.mess);
      });
  }
});

$(".cart-check-all").on("click", function () {
  if ($(this).prop("checked")) {
    $(".cart-checkbox").prop("checked", true);
  } else {
    $(".cart-checkbox").prop("checked", false);
  }
});

$(document).on("click", ".cart-item-action", function () {
  let parentEle = $(this).parent();
  $.ajax({
    url: "/user/cart/delete",
    type: "DELETE",
    data: {
      productID: parentEle.attr("id"),
    },
  })
    .then(function (data) {
      toastr[data.toastr](data.mess);
      parentEle.remove();
    })
    .catch(function (err) {
      toastr[err.toastr](err.mess);
    });
});
