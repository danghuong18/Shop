function loadProduct(){
    $.ajax({
      url: "/product/showProduct?limit=30&sort=date-desc",
      type: "GET"
  }).then((data)=>{
      if(data.status == 200){
          let list = ``
  
          for(x in data.data){
            let price = (data.data[x].min)? ((data.data[x].min != data.data[x].max)? `${(data.data[x].min).toLocaleString('vi-VN', { style: 'currency', currency: 'VND'})} - ${(data.data[x].max).toLocaleString('vi-VN', { style: 'currency', currency: 'VND'})}`: (data.data[x].min).toLocaleString('vi-VN', { style: 'currency', currency: 'VND'})) : (0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND'});
            list += `
            <li class="container__product__item">
              <a href="/product/${data.data[x]._id}" title="${data.data[x].productName}">
                  <div class="product__image">
                      <img src="${data.data[x].listImg[0]}" alt="${data.data[x].productName}">
                  </div>
                  <div class="product__details">
                      <div class="product__title">${data.data[x].productName}</div>
                      <div class="product__price">${price}</div>
                  </div>
              </a>
              <div class="product__footer">
                <a href="/similar-product/${data.data[x]._id}">Tìm sản phẩm tương tự</a>
              </div>
            </li>`;
          }
  
          $(".container__product__list").html(list)
      }else if (data.status == 400){
        let list = `
        <span class="container__product__no-item">
            Không có sản phẩm nào hiển thị ở đây cả.
        </span>`;
        
        $(".container__product__list").html(list);
      }else{
          console.log(data);
      }
  })
}
  
function home_slide(__item = "category"){
  let __class = ".container__" + __item;
  let device_width = $(window).width();
  let item_length = $(__class + "__item").length;
  let list_width = 0;
  let slide_item_width = $(__class).attr("slide-width");
  
  if(slide_item_width){
    let split_width = slide_item_width.split(",");

    if(device_width < 480) {
      $(__class + "__item").css({width: (split_width[0]? split_width[0] : 50) + "%"});
      list_width = (split_width[0]? split_width[0] : 50)*item_length;
    } else if(device_width < 1024){
      $(__class + "__item").css({width: (split_width[1]? split_width[1] : 20) + "%"});
      list_width = (split_width[1]? split_width[1] : 20)*item_length;
    }else{
      $(__class + "__item").css({width: (split_width[2]? split_width[2] : 10) + "%"});
      list_width = (split_width[2]? split_width[2] : 10)*item_length;
    }
  }else{
    if(device_width < 480) {
      list_width = 50*item_length;
    } else if(device_width < 1024){
      list_width = 20*item_length;
    }else{
      list_width = 10*item_length;
    }
  }

  $(__class + "__list").css({"width": (list_width > 100? list_width : 100) + "%"});

  let slide_width = $(__class).width();
  let item_width = $(__class + "__item").width();
  let offset_slide_left = Math.floor($(__class + "__item:first-child").offset()? $(__class + "__item:first-child").offset()["left"] : 0);
  let offset_slide_right = Math.floor($(__class + "__item:last-child").offset()? $(__class + "__item:last-child").offset()["left"] : 0);
  let offset_left = Math.floor($(__class).offset()? $(__class).offset()["left"] : 0);
  let offset_right = Math.floor(slide_width + offset_left - item_width);

  if(offset_slide_left >= offset_left){
    $(__class + " .container__arrow--prev").fadeOut(200);
  }else if(offset_slide_left < offset_left) {
    $(__class + " .container__arrow--prev").fadeIn(200);
  }

  if(offset_slide_right <= offset_right){
    $(__class + " .container__arrow--next").fadeOut(200);
  }else if(offset_slide_right > offset_right) {
    $(__class + " .container__arrow--next").fadeIn(200);
  }
}

function home_slide_resize(__item = "category"){
  let __class = ".container__" + __item;
  let current_slide = $(__class).attr("current-slide");
  
  home_slide(__item);
  setTimeout(function(){
    let max_translate = - ($(__class + "__list").width() - $(__class).width());
    let translate = current_slide*$(__class).width();
  
    $(__class + "__list").css({"transform": "translate(" + (translate < 0 ? (translate > max_translate? translate : max_translate) : 0) + "px, 0px)"});
  }, 500);
}

function home_slide_js(__item = "category"){
  let __class = ".container__" + __item;
  let status = $(__class).attr("slide-status");
  let __auto = ``;

  if(status){
    if(status == "play"){
      __auto = `
      $(document).ready(()=>{
        setInterval(function(){
          let status = $("${__class}").attr("slide-status");
          if(status){
            if(status == "play"){
              let arrow = $("${__class}").attr("slide-arrow");
              if(arrow){
                if($("${__class} .container__arrow--next").is(":visible") && arrow == "next"){
                  arrow_next("${__item}");
                }else if($("${__class} .container__arrow--prev").is(":visible") && arrow == "prev"){
                  arrow_prev("${__item}");
                }else{
                  if(arrow == "next"){
                    $("${__class}").attr("slide-arrow", "prev");
                  }else{
                    $("${__class}").attr("slide-arrow", "next");
                  }
                }
              }
            }
          }
        },3000);
      });
  
      $("${__class}").mouseenter(function(){
        $(this).attr("slide-status", "pause");
      }).mouseleave(function(){
        $(this).attr("slide-status", "play");
      });
      `
    }
  }

  let script = `
  <script>
    $("${__class} .container__arrow--prev").on("click", function(){
      arrow_prev("${__item}");
    });
    
    $("${__class} .container__arrow--next").on("click", function(){
      arrow_next("${__item}");
    });
    
    ${__auto}
  </script>`;
  
  $(__class).append(script);
}

function arrow_prev(__item = "category"){
  let __class = ".container__" + __item;
  let current_slide = Math.floor($(__class + "__item:first-child").offset()["left"]/$(__class).width()) + 1;
  let translate = current_slide*$(__class).width();

  $(__class).attr("current-slide", current_slide);
  $(__class + "__list").css({"transform": "translate(" + (translate < 0? translate : 0) + "px, 0px)"});

  setTimeout(function(){
    home_slide(__item);
  }, 1000);
}

function arrow_next(__item = "category"){
  let __class = ".container__" + __item;
  let current_slide = Math.floor($(__class + "__item:first-child").offset()["left"]/$(__class).width()) - 1;
  let max_translate = - ($(__class + "__list").width() - $(__class).width());
  let translate = current_slide*$(__class).width();

  $(__class).attr("current-slide", current_slide);
  $(__class + "__list").css({"transform": "translate(" + (translate > max_translate ? translate : max_translate) + "px, 0px)"});

  setTimeout(function(){
    home_slide(__item);
  }, 1000);
}
  
$(document).ready(()=>{
    home_slide();
    home_slide("brand");
    home_slide_js();
    home_slide_js("brand");
    loadProduct();
});
  
$(window).on("resize", function(){
  home_slide_resize();
  home_slide_resize("brand");
});