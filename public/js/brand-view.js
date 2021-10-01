function reloadData(isLoadPagination = false, page = undefined){
    let current_page = (page != undefined)? page: (($(".container__pagination__item.active").attr("id") != undefined)? $(".container__pagination__item.active").attr("id") : 1);
    loadProduct(current_page, false, true, isLoadPagination);
}