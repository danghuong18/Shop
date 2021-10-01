$("#logout").on("click", async () => {
  try {
    const res = await $.ajax({
      url: "/user/logout",
      type: "POST",
    });
    if (res.status === 200) {
      delete_cookie("cookie");
      window.location.href = "/";
    }
  } catch (error) {
    console.log(error);
  }
});

$("#logout-mobile").on("click", async () => {
  try {
    const res = await $.ajax({
      url: "/user/logout",
      type: "POST",
    });
    if (res.status === 200) {
      delete_cookie("cookie");
      window.location.href = "/";
    }
  } catch (error) {
    console.log(error);
  }
});

function random(max){
  return Math.floor(Math.random() * max);
}

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function delete_cookie(name) {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

async function search() {
  try {
    const search = $("#search").val();
    const res = await $.ajax({
      type: "GET",
      url: "/productCode/search?search=" + search,
    });
    console.log(res);
  } catch (error) {
    console.log(error);
  }
}
function notification(
  prepend_class = null,
  status = 200,
  action = null,
  delay = 5000
) {
  if (prepend_class != null && status != null && action != null) {
    let notif_class = "";
    if (status == 200) {
      notif_class = "success";
    } else if (status == 500) {
      notif_class = "error";
    } else {
      notif_class = "warning";
    }

    let id = Date.now();
    let notif = `<div class="notification notification--${notif_class}" id="notif-${id}">${action}</div>`;

    $(prepend_class).prepend(notif);
    $("#notif-" + id)
      .delay(delay)
      .fadeOut();

    setTimeout(function () {
      $("#notif-" + id).remove();
    }, delay + 1000);
  }
}

$(".header__search-input").on("input", function(){
  let query = $(this).val();
  $(".header__mobile-search-input").val(query);
  if(query.length >= 4){
      $(".header__search-history").css({"display": "block"});
      $.ajax({
          url: "/product/showProduct?limit=5&q=" + query,
          type: "GET"
      }).then((data)=>{
          if(data.status == 200){
              let search_droplist = ``
              let search_droplist_mobile = ``

              for(x in data.data){
                  let thumb = ``;
                  if(data.data[x].listImg.length > 0){
                      thumb = data.data[x].listImg[random(data.data[x].listImg.length)];
                  }else{
                      thumb = `https://cdn1.vectorstock.com/i/thumb-large/46/50/missing-picture-page-for-website-design-or-mobile-vector-27814650.jpg`;
                  }

                  let price = (data.data[x].min)? ((data.data[x].min != data.data[x].max)? `${(data.data[x].min).toLocaleString('vi-VN', { style: 'currency', currency: 'VND'})} - ${(data.data[x].max).toLocaleString('vi-VN', { style: 'currency', currency: 'VND'})}`: (data.data[x].min).toLocaleString('vi-VN', { style: 'currency', currency: 'VND'})) : (0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND'});

                  search_droplist += `<li class="header__search-history-item"><a href="/product/${data.data[x]._id}"><span class="header__search-history-item__body"><span class="header__search-history-item__image"><img src="${thumb}"></span><span class="header__search-history-item__detail"><label>${data.data[x].productName}</label><span class="price">${price}</span></span></span></a></li>`
                  search_droplist_mobile +=  `<li class="header__mobile-item"><a href="/product/${data.data[x]._id}" class="header__mobile-link"><span class="header__search-history-item__body"><span class="header__search-history-item__image"><img src="${thumb}"></span><span class="header__search-history-item__detail"><label>${data.data[x].productName}</label><span class="price">${price}</span></span></span></a></li>`
              }

              if(data.pages > 1){
                search_droplist += `<li class="header__search-history-item"><a href="/search-result?q=${query}">Xem thêm kết quả</a></li>`
                search_droplist_mobile += `<li class="header__mobile-item"><a href="/search-result?q=${query}" class="header__mobile-link">Xem thêm kết quả</a></li>`
              }

              $(".header__search-history-list").html(search_droplist);
              $(".header__mobile-list--search-result").html(search_droplist_mobile);
          }else if(data.status == 400){
              $(".header__search-history-list").html(`<li class="header__search-history-item"><a>Không có gì để hiển thị cả.</a></li>`);
              $(".header__mobile-list--search-result").html(`<li class="header__mobile-item"><a class="header__mobile-link">Không có gì để hiển thị cả.</a></li>`);
          }
      });
  }else{
      $(".header__search-history").css({"display": ""});
  }
});

$(".header__search-input").on("focus", function(){
  
  let query = $(this).val();
  if(query.length >= 4){
      $(".header__search-history").css({"display": "block"});
  }
});

$("#search-form").on("clickout", function(){
  $(".header__search-history").css({"display": ""});
});

$('#search-form').on('submit', () => {
  let q = $(".header__search-input").val();

  if(q){
    window.location.href = "/search-result?q=" + q;
  }

  return false;
});

$(".header__mobile-search-input").on("input", function(){
  let query = $(this).val();
  $(".header__search-input").val(query);
  if(query.length >= 4){
      $(".header__mobile-list--search-result").css({"display": "block"});
      $(".header__mobile-list--link").css({"display": "none"});
      $.ajax({
          url: "/product/showProduct?limit=5&q=" + query,
          type: "GET"
      }).then((data)=>{

          if(data.status == 200){
              let search_droplist = ``
              let search_droplist_mobile = ``

              for(x in data.data){
                  let thumb = ``;
                  if(data.data[x].listImg.length > 0){
                      thumb = data.data[x].listImg[random(data.data[x].listImg.length)];
                  }else{
                      thumb = `https://cdn1.vectorstock.com/i/thumb-large/46/50/missing-picture-page-for-website-design-or-mobile-vector-27814650.jpg`;
                  }

                  let price = (data.data[x].min)? ((data.data[x].min != data.data[x].max)? `${(data.data[x].min).toLocaleString('vi-VN', { style: 'currency', currency: 'VND'})} - ${(data.data[x].max).toLocaleString('vi-VN', { style: 'currency', currency: 'VND'})}`: (data.data[x].min).toLocaleString('vi-VN', { style: 'currency', currency: 'VND'})) : (0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND'});

                  search_droplist += `<li class="header__search-history-item"><a href="/product/${data.data[x]._id}"><span class="header__search-history-item__body"><span class="header__search-history-item__image"><img src="${thumb}"></span><span class="header__search-history-item__detail"><label>${data.data[x].productName}</label><span class="price">${price}</span></span></span></a></li>`
                  search_droplist_mobile +=  `<li class="header__mobile-item"><a href="/product/${data.data[x]._id}" class="header__mobile-link"><span class="header__search-history-item__body"><span class="header__search-history-item__image"><img src="${thumb}"></span><span class="header__search-history-item__detail"><label>${data.data[x].productName}</label><span class="price">${price}</span></span></span></a></li>`
              }

              if(data.pages > 1){
                search_droplist += `<li class="header__search-history-item"><a href="/search-result?q=${query}">Xem thêm kết quả</a></li>`
                search_droplist_mobile += `<li class="header__mobile-item"><a href="/search-result?q=${query}" class="header__mobile-link">Xem thêm kết quả</a></li>`
              }

              $(".header__search-history-list").html(search_droplist);
              $(".header__mobile-list--search-result").html(search_droplist_mobile);
          }else if(data.status == 400){
            $(".header__search-history-list").html(`<li class="header__search-history-item"><a>Không có gì để hiển thị cả.</a></li>`);
            $(".header__mobile-list--search-result").html(`<li class="header__mobile-item"><a class="header__mobile-link">Không có gì để hiển thị cả.</a></li>`);
          }
      });
  }else{
    $(".header__mobile-list--search-result").css({"display": ""});
    $(".header__mobile-list--link").css({"display": ""});
  }
});

$(".header__mobile-search-input").on("focus", function(){
  let query = $(this).val();
  if(query.length >= 4){
      $(".header__mobile-list--search-result").css({"display": "block"});
      $(".header__mobile-list--link").css({"display": "none"});
  }
});

$("#mobile-search-form").on("clickout", function(){
  $(".header__mobile-list--search-result").css({"display": ""});
  $(".header__mobile-list--link").css({"display": ""});
});

$('#mobile-search-form').on('submit', () => {
  let q = $(".header__mobile-search-input").val();

  if(q){
    window.location.href = "/search-result?q=" + q;
  }

  return false;
});