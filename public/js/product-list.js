function loadProduct(page, isCategory = false, isBrand = false, isLoadPagination = false){
    let query = loadQueryProduct(page, isCategory, isBrand);

    $.ajax({
      url: "/product/showProduct?limit=12" + query,
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

          if(data.total){
              if($("span").hasClass("total-result")){
                  $(".total-result").html(data.total);
              }
          }

          if(isLoadPagination){
            let pagination =``;
            let current_page = ((page <= data.pages)? page*1: 1);
            if(current_page > 1) {
                pagination += `<li class="container__pagination__item" id="prev-${current_page - 1}"><</li>`
            }else{
                pagination += `<li class="container__pagination__item" id="prev"><</li>`
            }

            for(x = (current_page > 5)? current_page - 4 : 1; x <= ((current_page > 5)? current_page : ((data.pages <= 5)? data.pages : 5)); x++){
                pagination += `<li class="container__pagination__item ${x==current_page?"active":""}" id="${x}">${x}</li>`
            }

            if(current_page <= data.pages - 1) {
                pagination += `<li class="container__pagination__item" id="next-${current_page + 1}">></li>`
            }else{
                pagination += `<li class="container__pagination__item" id="next">></li>`
            }

            let pagination_script = `
            <script>
                $(".container__pagination__item").on("click", function(){
                    let id = $(this).attr("id");
                    if(id != "next" && id != "prev" ){
                        if(!$(this).hasClass("active")){
                            if(id.includes("prev-") || id.includes("next-")){
                                $(".container__pagination__item").removeClass("active");
                                reloadData(true, id.replace("prev-", "").replace("next-", ""));
                            }else{
                                $(".container__pagination__item").removeClass("active");
                                $(this).addClass("active");
                                reloadData(true);
                            }
                        }
                    }
                });
            </script>`;
            $(".container__pagination").html(pagination);
            $(".container__pagination").append(pagination_script);
        }
  
          $(".container__product__list").html(list)
      }else if (data.status == 400){
        let pagination =`<li class="container__pagination__item" id="prev"><</li>
                        <li class="container__pagination__item active" id="1">1</li>
                        <li class="container__pagination__item" id="next">></li>`;
        let list = `
        <span class="container__product__no-item">
            Không có sản phẩm nào hiển thị ở đây cả.
        </span>`;
        
        $(".container__product__list").html(list);
        $(".container__pagination").html(pagination);
      }else{
          console.log(data);
      }
  })
}

function loadQueryProduct(page, isCategory = false, isBrand = false){
    let query = ``;
    let category_query = `?`;

    let q = $(".query-result").html();
    if(q){
        query += `&q=${q}`;
        category_query += `&q=${q}`;
        $(".header__search-input").val(q);
        $(".header__mobile-search-input").val(q);
    }

    let category = ``;
    $(".checkbox-category:checked").each(function(i) {
        if(category.length > 0){
            category += `,${$(this).attr("id").replace("cat-", "")}`;

        }else{
            category += `&category=${$(this).attr("id").replace("cat-", "")}`;
        }
    });

    query += category;
    if(!isCategory){
        category_query += category;
    }

    let brand = ``;
    $(".checkbox-brand:checked").each(function(i) {
        if(brand.length > 0){
            brand += `,${$(this).attr("id").replace("brand-", "")}`;
        }else{
            brand += `&brand=${$(this).attr("id").replace("brand-", "")}`;
        }
    });

    query += brand;
    if(!isBrand){
        category_query += brand;
    }

    let from = $(".from-price").val();
    let to = $(".to-price").val();

    if(from && to && !isNaN(from) && !isNaN(to)){
        if(from <= to){
            query += `&from=${from}&to=${to}`;
            category_query += `&from=${from}&to=${to}`;
        }
    }

    if($(".oldest-sort").hasClass("active")) {
        query += `&sort=date-asc`;
        category_query += `&sort=date-asc`;
    }

    if($(".action-sort").val()){
        query += `&sortPrice=${$(".action-sort").val()}`;
        category_query += `&sortPrice=${$(".action-sort").val()}`;
    }

    let similar_product = $(".container__product__top-view--product").attr("id");
    if(similar_product){
        query += `&similar=${similar_product}`;
    }

    if(page && !isNaN(page)){
        if(!isNaN(page)){
            query += `&page=` + page;
            if(page > 1){
                category_query +=  `&page=` + page;
            }
        }
    }

    if(category_query.length > 2){
        history.pushState(null, "", category_query.replace("?&", "?")) ;
    }

    return query;
}

$(".checkbox-category").on("click", function(){
    reloadData(true, 1);
});
  
$(".text-category").on("click", function(){
    let id = $(this).attr("id");
    $("#cat-" + id).click();
});
  
$(".checkbox-brand").on("click", function(){
    reloadData(true, 1);
});
  
$(".text-brand").on("click", function(){
    let id = $(this).attr("id");
    $("#brand-" + id).click();
});

$(".newest-sort").on("click", function(){
    if(!$(this).hasClass("active")){
        $(this).addClass("active")
        $(".oldest-sort").removeClass("active");
        reloadData();
    }
});

$(".oldest-sort").on("click", function(){
    if(!$(this).hasClass("active")){
        $(this).addClass("active")
        $(".newest-sort").removeClass("active");
        reloadData();
    }
});

$(".action-sort").on("change", function(){
    let sort = $(this).val();
    if(sort != null && sort != "" && sort != undefined){
        reloadData();
    }
});

$('#price-range').on('submit', () => {
    let from = $(".from-price").val();
    let to = $(".to-price").val();

    if((from || from == 0) && to && !isNaN(from) && !isNaN(to)){
        if(from <= to){
            reloadData(true, 1);
        }else{
            let message = `Khoảng giá không hợp lệ.`;
            notification(".container__product__main", 400, message);
        }
    }else{
        let message = `Lỗi định dạng khoảng giá.`;
        notification(".container__product__main", 400, message);
    }

    return false;
});

$(document).ready(()=>{
    reloadData(true);
});