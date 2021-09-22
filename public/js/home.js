function loadSlide(){
    $.ajax({
        url: "/category?sort=name-az",
        type: "GET"
    }).then((data)=>{
        if(data.status == 200){
            let list = ``
  
            let device_width = $(window).width();
            let item_length = (data.data.length > 20) ? Math.ceil(data.data.length/2) : data.data.length;
            let list_width = 0;
          
            if(device_width < 480) {
              list_width = 50*item_length;
            } else if(device_width < 1024){
              list_width = 20*item_length;
            }else{
              list_width = 10*item_length;
            }
          
            $(".container__category__list").css({"width": (list_width > 100? list_width : 100) + "%"});
  
            if(data.data.length > 20) {
              for(x in data.data){
                  if(x%2 == 0){
                    list += `
                    <li class="container__category__item">
                      <div class="category__group">
                          <a href="/category-view/${data.data[x]._id}" title="${data.data[x].categoryName}">
                              <div class="category__group__image">
                                  <div class="category__group__image--circle">
                                      <ul class="circle__list">
                                          <li class="circle__item"></li>
                                          <li class="circle__item circle__item--second"></li>
                                          <li class="circle__item circle__item--third"></li>
                                          <li class="circle__item circle__item--fourth"></li>
                                      </ul>
                                  </div>
                              </div>
                              <div class="category__group__details">
                              ${data.data[x].categoryName}
                              </div>
                          </a>`;
                  }else{
                    list += `
                          <a href="/category-view/${data.data[x]._id}" title="${data.data[x].categoryName}">
                              <div class="category__group__image">
                                  <div class="category__group__image--circle">
                                      <ul class="circle__list">
                                          <li class="circle__item"></li>
                                          <li class="circle__item circle__item--second"></li>
                                          <li class="circle__item circle__item--third"></li>
                                          <li class="circle__item circle__item--fourth"></li>
                                      </ul>
                                  </div>
                              </div>
                              <div class="category__group__details">
                              ${data.data[x].categoryName}
                              </div>
                          </a>
                      </div>
                  </li>`;
                }
              }
    
              if(data.data.length%2 != 0){
                list += `</div></li>`;
              }
            }else{
              for(x in data.data){
                list += `
                <li class="container__category__item">
                  <div class="category__group">
                      <a href="/category-view/${data.data[x]._id}" title="${data.data[x].categoryName}">
                          <div class="category__group__image">
                              <div class="category__group__image--circle">
                                  <ul class="circle__list">
                                      <li class="circle__item"></li>
                                      <li class="circle__item circle__item--second"></li>
                                      <li class="circle__item circle__item--third"></li>
                                      <li class="circle__item circle__item--fourth"></li>
                                  </ul>
                              </div>
                          </div>
                          <div class="category__group__details">
                          ${data.data[x].categoryName}
                          </div>
                      </a>
                  </div>
                </li>`;
              }
            }
  
            $(".container__category__list").html(list)
        }else if (data.status == 400){
  
          
        }else{
            console.log(data);
        }
    })
}
  
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
  
function home_slide(){
    let device_width = $(window).width();
    let item_length = $(".container__category__item").length;
    let list_width = 0;
  
    if(device_width < 480) {
      list_width = 50*item_length;
    } else if(device_width < 1024){
      list_width = 20*item_length;
    }else{
      list_width = 10*item_length;
    }
  
    $(".container__category__list").css({"width": (list_width > 100? list_width : 100) + "%"});
  
    let slide_width = $(".container__category").width();
    let item_width = $(".container__category__item").width();
    let offset_slide_left = Math.floor($(".container__category__item:first-child").offset()? $(".container__category__item:first-child").offset()["left"] : 0);
    let offset_slide_right = Math.floor($(".container__category__item:last-child").offset()? $(".container__category__item:last-child").offset()["left"] : 0);
    let offset_left = Math.floor($(".container__category").offset()["left"]);
    let offset_right = Math.floor(slide_width + offset_left - item_width);
  
    if(offset_slide_left >= offset_left){
      $(".container__arrow--prev").fadeOut(200);
    }else if(offset_slide_left < offset_left) {
      $(".container__arrow--prev").fadeIn(200);
    }
  
    if(offset_slide_right <= offset_right){
      $(".container__arrow--next").fadeOut(200);
    }else if(offset_slide_right > offset_right) {
      $(".container__arrow--next").fadeIn(200);
    }
  
}
  
var old_slide = 0; 
  
$(document).ready(()=>{
    loadSlide();
    home_slide();
    loadProduct();
});
  
$(window).on("resize", function(){
    home_slide();
  
    setTimeout(function(){
      let max_translate = - ($(".container__category__list").width() - $(".container__category").width());
      let translate = old_slide*$(".container__category").width();
    
      $(".container__category__list").css({"transform": "translate(" + (translate < 0 ? (translate > max_translate? translate : max_translate) : 0) + "px, 0px)"});
    }, 500);
  });
  
$(".container__arrow--prev").on("click", function(){
    let current_slide = Math.floor($(".container__category__item:first-child").offset()["left"]/$(".container__category").width()) + 1;
    let translate = current_slide*$(".container__category").width();
  
    old_slide = Math.floor(current_slide);
    $(".container__category__list").css({"transform": "translate(" + (translate < 0? translate : 0) + "px, 0px)"});
  
    setTimeout(function(){
      home_slide();
    }, 1000);
});
  
$(".container__arrow--next").on("click", function(){
    let current_slide = Math.floor($(".container__category__item:first-child").offset()["left"]/$(".container__category").width()) - 1;
    let max_translate = - ($(".container__category__list").width() - $(".container__category").width());
    let translate = current_slide*$(".container__category").width();
  
    old_slide = Math.floor(current_slide);
    $(".container__category__list").css({"transform": "translate(" + (translate > max_translate ? translate : max_translate) + "px, 0px)"});
  
    setTimeout(function(){
      home_slide();
    }, 1000);
});