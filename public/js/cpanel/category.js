function add(){
    let category_name = $(".add-category").val();
    console.log(category_name);
    notification(".main-body__container", "success", `Tạo danh mục "${category_name}"`);
    modal(false);
}

function edit(){
    let category_name = $(".edit-category").val();
    console.log(category_name);
    notification(".main-body__container", "success", `Sửa danh mục "${category_name}"`);
    modal(false);
}

$(".create-item").on("click", function(){
    let body = `<input type="text" class="add-category" placeholder="Nhập vào tên danh mục">`;
    modal(true, "Tạo danh mục", body, "Tạo", "add()");
});

$(".action-item__delete").on("click", function(){
    console.log(this);
    let body = `Bạn muốn xoá danh mục "${this.innerHTML}" hay không?`;
    modal(true, "Xoá danh mục", body, "Xác nhận", "edit()");
});

$(".action-item__edit").on("click", function(){
    let body = `<input type="text" class="edit-category" placeholder="Nhập vào tên danh mục">`;
    modal(true, "Sửa danh mục", body, "Sửa", "edit()");
});

