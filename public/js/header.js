//append cart
$(document)
  .ready(function () {
    $.ajax({
      url: "/user/cart",
      type: "POST",
    }).then(function (data) {
      console.log(data.data);
      $(".header__cart-notice").text(data.data.length);
      if (data.data.length > 0) {
        $(".header__cart-list").prepend(`
        <h4 class="header__cart-heading">Sản phẩm đã thêm</h4>
      `);
        $(".header__cart-list").append(`
      <a href="/user/cart"
      ><button class="btn btn--primary header__cart-view-cart">
        Xem giỏ hàng
      </button></a
      >
      `);
        for (let i = 0; i < 3; i++) {
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
      } else {
        $(".header__cart-list").append(`
      <div class="header__cart-list--no-cart">
        <img
        src="../../public/img/no_cart.png"
        alt=""
        class="header__cart-no-cart-img"
        />
        <p class="header__cart-no-cart-msg">Chưa có sản phẩm</p>
        </div>
      `);
        $(".header__cart-list").append(`
      <a href="/"
      ><button class="btn btn--primary header__cart-view-cart">
        Mua sắm ngay
      </button></a
      >
      `);
      }
    });
  })
  .catch(function (err) {
    toastr["error"]("Đã xảy ra lỗi, vui lòng thử lại");
    console.log(err);
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

// $(".item-add-to-cart")
//   .on("click", function () {
//     $(".header__cart-list-item").html("");
//     $.ajax({
//       url: "/user/cart",
//       type: "POST",
//     }).then(function (data) {
//       console.log(data.data);
//       $(".header__cart-notice").text(data.data.length);
//       $(".header__cart-list").prepend(`
//       <h4 class="header__cart-heading">Sản phẩm đã thêm</h4>
//     `);
//       $(".header__cart-list").append(`
//     <a href="/user/cart"
//     ><button class="btn btn--primary header__cart-view-cart">
//       Xem giỏ hàng
//     </button></a
//     >
//     `);
//       for (let i = 0; i < 4; i++) {
//         $(".header__cart-list-item").prepend(`
//       <li class="header__cart-item" id="${data.data[i]._id}">
//           <img
//             src="${data.data[i].thumb}"
//             class="header__cart-img"
//           />
//           <div class="header__cart-item-info">
//             <div class="header__cart-item-head">
//               <h5 class="header__cart-item-name">
//                 ${data.data[i].title}
//               </h5>
//               <div class="header__cart-item-price-wrap">
//                 <span class="header__cart-item-price">₫${data.data[i].price}</span>
//                 <span class="header__cart-item-multiply">x</span>
//                 <span class="header__cart-item-qnt">${data.data[i].quantity}</span>
//               </div>
//             </div>
//             <div class="header__cart-item-body">
//               <span class="header__cart-item-description">
//                 Phân loại:
//                 <span class="header__cart-item-classify"
//                   >${data.data[i].color} - ${data.data[i].size}</span
//                 >
//               </span>
//               <span class="header__cart-item-remove">Xóa</span>
//             </div>
//           </div>
//       </li>
//       `);
//       }
//     });
//   })
//   .catch(function (err) {
//     toastr["error"]("Đã xảy ra lỗi, vui lòng thử lại");
//     console.log(err);
//   });
