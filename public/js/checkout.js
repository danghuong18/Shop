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

//append info
$(document).ready(function () {
  $.ajax({
    url: "/user/getuserinfo",
    type: "POST",
  })
    .then(function (data) {
      if (data.UserInfo.addressList.length == 0) {
        window.location.href = "/user/profile#address";
      } else if (data.UserInfo.addressList.length > 0) {
        for (let i = 0; i < data.UserInfo.addressList.length; i++) {
          $(".user-address-list").append(`
            <div class="user-address-item ${i}">
                <input type="radio" name="address" class="user-address-item-checkbox">
                </input>
                <span class="user-address-span">${data.UserInfo.addressList[i].address}</span>
            </div>
            `);
        }
      }
    })
    .catch(function (err) {
      toastr[err.toastr](err.mess);
    });
  $.ajax({
    url: "/user/getcheckout",
    type: "POST",
  })
    .then(function (data) {
      console.log(48, data);
      if (data.status == 400) {
        toastr[data.toastr](data.mess);
        setTimeout(function () {
          window.location.href = "/";
        }, 2000);
      } else {
        let total = 0;
        for (let i = 0; i < data.data.listProduct.length; i++) {
          total =
            total +
            data.data.listProduct[i].quantity *
              data.data.listProduct[i].productID.price;
          $(".checkout-item-list").append(`
                <div class="checkout-item ${i}">
                    <img src="${
                      data.data.listProduct[i].productID.thumb
                    }" alt="" class="checkout-item-thumb">
                    <span class="checkout-item-name">${
                      data.data.listProduct[i].productName
                    }</span>
                    <span class="checkout-item-choose">Phân loại: ${
                      data.data.listProduct[i].productID.color
                    } - ${data.data.listProduct[i].productID.size}</span>
                    <span class="checkout-item-unitprice">đ${data.data.listProduct[
                      i
                    ].productID.price.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}</span>
                    <span class="checkout-item-quantity">${
                      data.data.listProduct[i].quantity
                    }</span>
                    <span class="checkout-item-totalprice">đ${(
                      data.data.listProduct[i].quantity *
                      data.data.listProduct[i].productID.price
                    ).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}</span>
                </div>
                `);
        }
        $(".checkout-block-total").text(
          total.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })
        );
      }
    })
    .catch(function (err) {
      toastr[err.toastr](err.mess);
    });
});

//buy
$(".buy-btn").on("click", function () {
  let address = "";
  for (let i = 0; i < $(".user-address-item").length; i++) {
    if (
      $(".user-address-item." + i)
        .children(".user-address-item-checkbox")
        .prop("checked") == true
    ) {
      address = $(".user-address-item." + i)
        .children(".user-address-span")
        .text();
    }
  }
  $.ajax({
    url: "/order/create",
    type: "POST",
    data: {
      address: address,
    },
  })
    .then(function (data) {
      toastr[data.toastr](data.mess);
      if (data.status == 200) {
        setTimeout(function () {
          window.location.href = "/user/profile?tab=order";
        }, 2000);
      }
    })
    .catch(function (err) {
      toastr[err.toastr](err.mess);
    });
});
