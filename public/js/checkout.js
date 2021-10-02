$(document).ready(function () {
  $.ajax({
    url: "/user/getuserinfo",
    type: "POST",
  })
    .then(function (data) {
      console.log(data);
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
      console.log(data);
      for (let i = 0; i < data.data[0].listProduct.length; i++) {
        $(".checkout-item-list").append(`
                <div class="checkout-item ${i}">
                    <img src="${
                      data.data[0].listProduct[i].productID.thumb
                    }" alt="" class="checkout-item-thumb">
                    <span class="checkout-item-name">${
                      data.data[0].listProduct[i].productName
                    }</span>
                    <span class="checkout-item-choose">Phân loại: ${
                      data.data[0].listProduct[i].productID.color
                    } - ${data.data[0].listProduct[i].productID.size}</span>
                    <span class="checkout-item-unitprice">đ${
                      data.data[0].listProduct[i].productID.price
                    }</span>
                    <span class="checkout-item-quantity">${
                      data.data[0].listProduct[i].quantity
                    }</span>
                    <span class="checkout-item-totalprice">đ${
                      data.data[0].listProduct[i].quantity *
                      data.data[0].listProduct[i].productID.price
                    }</span>
                </div>
                `);
      }
    })
    .catch(function (err) {
      toastr[err.toastr](err.mess);
    });
});
