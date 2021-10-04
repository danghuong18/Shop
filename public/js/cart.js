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

function totalAndQuantity() {
  let total = 0;
  let totalQuantity = 0;
  for (let i = 0; i < $(".cart-item").length; i++) {
    if (
      $(".cart-item." + i)
        .children(".cart-item-check")
        .prop("checked") == true
    ) {
      totalQuantity++;
      total =
        total +
        parseInt(
          $(".cart-item." + i)
            .children(".cart-item-total-price")
            .text()
            .replace(/[^0-9.-]+/g, "")
            .replaceAll(".", "")
        );
    }
    $(".cart-total-quantity").text(
      "Tổng thanh toán (" + totalQuantity + " sản phẩm)"
    );
  }
  $(".cart-total-price").text(
    total.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    })
  );
}

function changeChecked() {
  let data = [];
  for (let i = 0; i < $(".cart-item").length; i++) {
    if (
      $(".cart-item." + i)
        .children(".cart-checkbox")
        .prop("checked") == true
    ) {
      data.push($(".cart-item." + i).attr("id"));
    }
  }
  console.log(data);
  $.ajax({
    url: "/user/addcheckout",
    type: "POST",
    data: { addcheckout: data },
  })
    .then(function (data) {})
    .catch(function (err) {
      toastr[err.toastr](err.mess);
    });
}

$(document).ready(function () {
  $.ajax({
    url: "/user/cart",
    type: "POST",
  })
    .then(function (data) {
      let total = 0;
      if (data.logged_in == false) {
        window.location.href = "/user/login";
      } else {
        for (let i = 0; i < data.data.length; i++) {
          total = total + data.data[i].price * data.data[i].quantity;
          $(".cart-item-container").prepend(`
                <div class="cart-item ${i}" id="${data.data[i]._id}">
                  <input type="checkbox" class="cart-checkbox cart-item-check"/>
                  <div class="cart-item-content">
                    <a href="/product/${
                      data.data[i].productCodeID
                    }" class="cart-item-img">
                      <img src="${data.data[i].thumb}"/>
                    </a>
                    <div class="cart-item-detail">
                      <span class="cart-item-title">
                        <a href="/product/${data.data[i].productCodeID}">${
            data.data[i].title
          }</a>
                      </span>
                      <span class="cart-item-choose">
                        Phân Loại Hàng: ${data.data[i].color} - ${
            data.data[i].size
          }
                      </span>
                    </div>
                  </div>
                  <div class="cart-item-price">${data.data[
                    i
                  ].price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}</div>
                  <div class="cart-item-quantity">
                    <input type="number" class="cart-item-quantity-input" value="${
                      data.data[i].quantity
                    }" old="${data.data[i].quantity}"/>
                  </div>
                  <div class="cart-item-total-price">
                    ${(
                      data.data[i].price * data.data[i].quantity
                    ).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </div>
                  <div class="cart-item-action">Xóa</div>
                </div>    
                `);
          if (data.data[i].selected == 1) {
            $(".cart-item." + i)
              .children(".cart-item-check")
              .prop("checked", true);
          }
          $(".cart-select-all").text("Chọn tất cả (" + (i + 1) + " sản phẩm)");
        }
      }
      totalAndQuantity();
    })
    .catch(function (err) {
      console.log(err);
    });
});

//change quantity
$(document).on("change", ".cart-item-quantity-input", function () {
  let oldQuantity;
  let productID = $(this).parent().parent().attr("id");
  let newQuantity = parseInt($(this).val());
  let price = parseInt(
    $(this)
      .parent()
      .parent()
      .children(".cart-item-price")
      .text()
      .replace(/[^0-9.-]+/g, "")
      .replaceAll(".", "")
  );
  let thisEle = $(this);
  oldQuantity = parseInt(thisEle.attr("old"));
  let totalPriceEle = $(this)
    .parent()
    .parent()
    .children(".cart-item-total-price");
  console.log(newQuantity, oldQuantity);
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
        toastr[data.toastr](data.mess[1]);
        if (data.status == 200) {
          loadCart();
          totalPriceEle.text(
            (price * newQuantity).toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })
          );
          totalAndQuantity();
        } else if (data.status == 400) {
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

//check one
$(document).on("click", ".cart-checkbox", function () {
  totalAndQuantity();
  changeChecked();
});

//check all
$(".cart-check-all").on("click", function () {
  if ($(this).prop("checked")) {
    $(".cart-checkbox").prop("checked", true);
  } else {
    $(".cart-checkbox").prop("checked", false);
  }
});

//delete
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

// $(".cart-delete").on("click", function () {
//   let delete = "";
//   for (let i = 0; i <$(".cart-item").length; i++){
//     delete = $(".cart-item."+i).attr("id");
//     $.ajax({
//       url: "/user/cart/delete",
//       type: "DELETE",
//       data: {
//         productID: parentEle.attr("id"),
//       },
//     })
//       .then(function (data) {
//         toastr[data.toastr](data.mess);
//         parentEle.remove();
//       })
//       .catch(function (err) {
//         toastr[err.toastr](err.mess);
//       });
//   }
// });

//buy
$(".cart-buy").on("click", async function () {
  changeChecked();
  window.location.href = "/user/checkout";
});
