toastr.options = {
  closeButton: true,
  debug: false,
  newestOnTop: false,
  progressBar: true,
  positionClass: "toast-top-right",
  preventDuplicates: true,
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
      if (data.logged_in == false) {
        window.location.href = "/user/login";
      } else {
        for (let i = 0; i < data.data.length; i++) {
          $(".cart-item-container").prepend(`
                <div class="cart-item ${i}" id="${data.data[i]._id}">
                  <input type="checkbox" class="cart-checkbox cart-item-check"/>
                  <div class="cart-item-content">
                    <a href="/product/${data.data[i].productCodeID}" class="cart-item-img">
                      <img src="${data.data[i].thumb}"/>
                    </a>
                    <div class="cart-item-detail">
                      <span class="cart-item-title">
                        <a href="/product/${data.data[i].productCodeID}">${data.data[i].title}</a>
                      </span>
                      <span class="cart-item-choose">
                        Phân Loại Hàng: ${data.data[i].color} - ${data.data[i].size}
                      </span>
                    </div>
                  </div>
                  <div class="cart-item-price">${(data.data[i].price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND'})}</div>
                  <div class="cart-item-quantity">
                    <input type="number" class="cart-item-quantity-input" value="${data.data[i].quantity}" old="${data.data[i].quantity}"/>
                  </div>
                  <div class="cart-item-total-price">
                    ${(data.data[i].price * data.data[i].quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND'})}
                  </div>
                  <div class="cart-item-action">Xóa</div>
                </div>    
                `);
        }
      }
    })
    .catch(function (err) {
      console.log(err);
    });
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
  if (newQuantity - oldQuantity == 0) {
    $.ajax({
      url: "/user/cart/delete",
      type: "DELETE",
      data: {
        productID: productID,
      },
    })
      .then(function (data) {
        loadCart();
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
        loadCart();
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
      loadCart();
      toastr[data.toastr](data.mess);
      parentEle.remove();
    })
    .catch(function (err) {
      toastr[err.toastr](err.mess);
    });
});

//buy
$(".cart-buy").on("click", function () {
  let data = [];
  for (let i = 0; i < $(".cart-item").length; i++) {
    data.push($(".cart-item." + i).attr("id"));
  }
  $.ajax({
    url: "/user/addcheckout",
    type: "POST",
    data: { addcheckout: data },
  }).then(function (data) {
    console.log(data);
  });
});
