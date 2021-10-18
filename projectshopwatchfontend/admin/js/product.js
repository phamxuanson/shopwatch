var gUrlString = window.location.href;
var gNewUrl = new URL(gUrlString);
var gId = gNewUrl.searchParams.get("id");
console.log(gId);

var formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
});

$(document).ready(function() {

    const token = getCookie("token");
    const baseUrlApi = "http://localhost:8088";
    const baseUrlXampp = "http://localhost/shop24h";

    // xử lí khi không phải admin
    $("#showBody").prop("class", "hold-transition sidebar-mini layout-fixed hide");
    if (token === "" || token !== "01699999999") {
        window.location.href = baseUrlXampp + "/login.html";
    } else {
        $("#showBody").prop("class", "hold-transition sidebar-mini layout-fixed");
    }

    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    //Hàm setCookie
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function getUserInfo(token) {
        $.ajax({
            url: baseUrlApi + "/user/userbyphonenumber/" + token,
            type: 'GET',
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            headers: {
                "Authorization": "Bearer " + token
            },
            success: function(pRes) {
                console.log(pRes);
            },
            error: function(pAjaxContext) {
                console.log(pAjaxContext.responseText);
            }
        });
    }

    if (token) {
        $("#logindiv").remove();
        $("#userLogin").append(
            `<div class="dropdown-menu dropdown-menu-lg dropdown-menu-right" id="logout">
            <span class="dropdown-header">Thông tin của tôi</span>
            <div class="dropdown-divider"></div>
            <a class="btn dropdown-item" id="btn-logout">
                <i class="fas fa-file mr-2"></i>Đăng xuất
            </a>
        </div>
          `
        );
        //getUserInfo(token);
    }

    $("#btn-logout").on("click", function() {
        redirectToLogin();
    });


    function redirectToLogin() {
        // Trước khi logout cần xóa token đã lưu trong cookie
        setCookie("token", "", 1);
        window.location.href = baseUrlXampp + "/login.html";
    }

    // load dư liệu ra bảng
    var isEdit = false;
    var indexOfProduct = -1;

    var table = $("#product-table").DataTable({
        // Khai báo các cột của datatable (Chú ý tên cột phải giống thuộc tính của object trong mảng đã khai báo)
        "columns": [
            { "data": "id" },
            {
                "data": "buyPrice",
                render: function(data, type, row) {
                    return formatter.format(data);
                }

            },
            { "data": "productCode" },
            { "data": "productDescription" },
            { "data": "productName" },
            {
                "data": "productImage",
                render: function(data, type, row) {
                    return '<img src="' + data + '" alt="' + data + '"height="150px" width="150px"/>';
                }

            },
            { "data": "productVendor" },
            { "data": "quantityInStock" },
            { "data": "action" }
        ],
        "columnDefs": [{
                targets: -1,
                defaultContent: "<button class='edit-product fas fa-edit'></button> <button class='delete-product fas fa-trash'></button>  <button class='all-orderdetail fas fa-info'></button>"
            },

        ]
    });

    reloadTable();

    function deleteForm() {
        $("#input-buy-price").val("");
        $("#input-product-code").val("");
        $("#input-product-description").val("");
        $("#input-product-name").val("");
        $("#input-product-scale").val("");
        $("#input-product-vendor").val("");
        $("#input-quantity-in-stock-scale").val("");

    }


    function reloadTable() {
        $.ajax({
            url: "http://localhost:8088/productlines/" + gId + "/product",
            type: "GET",
            dataType: 'json',
            success: function(responseObject) {
                console.log(responseObject);
                //Xóa toàn bộ dữ liệu đang có của bảng
                table.clear();

                //Cập nhật data cho bảng 
                table.rows.add(responseObject);

                //Cập nhật lại giao diện hiển thị bảng
                table.draw();
            },
            error: function(error) {
                console.log(error.responseText);
            }
        });
    }

    // sự kiện click vào nút edit
    $("#product-table").on("click", ".edit-product", function() {
        console.log("edit");
        isEdit = true;
        editButton(this);
        $("#modal-produsct-line").modal("show");
    });

    $("#product-table").on("click", ".all-orderdetail", function() {
        // console.log("all answer");
        // window.location.href = "answer.html";
        getOrderDetailData(this);
    });

    function getOrderDetailData(paramOrderDetailButton) {
        var vRowIndex = $(paramOrderDetailButton).parents("tr");
        var vCurrentProduct = table.row(vRowIndex).data();
        const detailFormURL = "../admin/orderdetail.html";
        var urlSiteToOpen = detailFormURL + "?" + "id=" + vCurrentProduct.id + "&productName=" + vCurrentProduct.productName;
        window.location.href = urlSiteToOpen;
    }

    $("#product-table").on("click", ".delete-product", function() {
        console.log("delete");
        //Xác định thẻ tr là cha của nút được chọn
        var rowSelected = $(this).parents('tr');

        //Lấy datatable row
        var datatableRow = table.row(rowSelected);

        //Lấy data của dòng 
        var data = datatableRow.data();
        if (confirm("bạn có muốn xóa product có id: " + data.id)) {
            $.ajax({
                url: "http://localhost:8088/products/" + data.id,
                type: "DELETE",
                dataType: 'json',
                success: function(responseObject) {
                    console.log(responseObject);
                    reloadTable();
                },
                error: function(error) {
                    console.log(error.responseText);
                }
            });
        }

    });



    // editButton 
    function editButton(button) {
        //Xác định thẻ tr là cha của nút được chọn
        var rowSelected = $(button).parents('tr');

        //Lấy datatable row
        var datatableRow = table.row(rowSelected);

        //Lấy data của dòng 
        var data = datatableRow.data();

        //lấy id của voucher

        indexOfProduct = data.id;

        console.log(indexOfProduct);

        $("#input-buy-price").val(data.buyPrice);
        $("#input-product-code").val(data.productCode);
        $("#input-product-description").val(data.productDescription);
        $("#input-product-name").val(data.productName);
        $("#input-product-scale").val(data.productImage);
        $("#input-product-vendor").val(data.productVendor);
        $("#input-quantity-in-stock-scale").val(data.quantityInStock);

    }

    $("#save_data").on("click", function() {
        saveData();
        reloadTable();
    });

    function saveData() {
        if (isEdit == true && validateData()) {
            updateData(indexOfProduct);
        } else {
            insertData();
        }
        reloadTable();
        deleteForm();
        $("#modal-produsct-line").modal("hide");
    }

    function insertData() {
        var buyPrice = $("#input-buy-price").val().trim();
        var productCode = $("#input-product-code").val().trim();
        var productDescription = $("#input-product-description").val().trim();
        var productName = $("#input-product-name").val().trim();
        var productImage = $("#input-product-scale").val().trim();
        var productVendor = $("#input-product-vendor").val().trim();
        var quantity = $("#input-quantity-in-stock-scale").val().trim();


        if (validateData()) {
            product = {
                "buyPrice": buyPrice,
                "productCode": productCode,
                "productDescription": productDescription,
                "productName": productName,
                "productImage": productImage,
                "productVendor": productVendor,
                "quantityInStock": quantity

            }

            $.ajax({
                url: "http://localhost:8088/productlines/" + gId + "/product",
                type: 'POST',
                contentType: 'application/json;charset=UTF-8',
                data: JSON.stringify(product),
                dataType: 'json',
                success: function(res) {
                    console.log(res);
                    alert("bạn đã thêm thành công");
                },
                error: function(ajaxContext) {
                    alert(ajaxContext.responseText);
                }

            });
        }
        reloadTable();
    }

    function updateData(id) {

        var buyPrice = $("#input-buy-price").val().trim();
        var productCode = $("#input-product-code").val().trim();
        var productDescription = $("#input-product-description").val().trim();
        var productName = $("#input-product-name").val().trim();
        var productImage = $("#input-product-scale").val().trim();
        var productVendor = $("#input-product-vendor").val().trim();
        var quantity = $("#input-quantity-in-stock-scale").val().trim();

        product = {
            "buyPrice": buyPrice,
            "productCode": productCode,
            "productDescription": productDescription,
            "productName": productName,
            "productImage": productImage,
            "productVendor": productVendor,
            "quantityInStock": quantity

        }

        $.ajax({
            url: "http://localhost:8088/products/" + id,
            type: 'PUT',
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify(product),
            dataType: 'json',
            success: function(res) {
                console.log(res);
                alert("bạn đã sửa thành công");
            },
            error: function(ajaxContext) {
                alert(ajaxContext.responseText);
            }

        });

        indexOfProduct = -1;
        isEdit = false;
        reloadTable();
        deleteForm();
    }

    function validateData() {
        var buyPrice = $("#input-buy-price").val().trim();
        var productCode = $("#input-product-code").val().trim();
        var productDescription = $("#input-product-description").val().trim();
        var productName = $("#input-product-name").val().trim();
        var productImage = $("#input-product-scale").val().trim();
        var productVendor = $("#input-product-vendor").val().trim();
        var quantity = $("#input-quantity-in-stock-scale").val().trim();

        var check = false;

        if (buyPrice === "") {
            alert("bạn phải nhập buy price");
            return check;
        }
        if (productCode === "") {
            alert("bạn phải nhập productCode");
            return check;
        }
        if (productDescription === "") {
            alert("bạn phải nhập productDescription");
            return check;
        }
        if (productName === "") {
            alert("bạn phải nhập productName");
            return check;
        }
        if (productImage === "") {
            alert("bạn phải nhập productImg");
            return check;
        }
        if (productVendor === "") {
            alert("bạn phải nhập productVendor");
            return check;
        }
        if (quantity === "") {
            alert("bạn phải nhập quantity in stock scale");
            return check;
        }
        check = true;
        return check;
    }

});