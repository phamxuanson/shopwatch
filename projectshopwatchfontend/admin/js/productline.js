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

    // load dữ liệu
    var isEdit = false;
    var indexOfProductLine = -1;

    var table = $("#product-line-table").DataTable({
        // Khai báo các cột của datatable (Chú ý tên cột phải giống thuộc tính của object trong mảng đã khai báo)
        "columns": [
            { "data": "id" },
            { "data": "description" },
            { "data": "productLine" },
            { "data": "action" }
        ],
        "columnDefs": [{
                targets: -1,
                defaultContent: `
                        <button class='edit-product-line fas fa-edit'></button> 
                        
                        <button class='all-product fas fa-info'></button>`
            },

        ]
    });

    reloadTable();

    function deleteForm() {
        $("#input-mo-ta").val("");
        $("#input-productLine").val("");
    }

    function reloadTable() {
        $.ajax({
            url: "http://localhost:8088/productlines",
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
    $("#product-line-table").on("click", ".edit-product-line", function() {
        console.log("edit");
        isEdit = true;
        editButton(this);
        $("#modal-produsct-line").modal("show");
    });

    $("#product-line-table").on("click", ".all-product", function() {
        // console.log("all answer");
        // window.location.href = "answer.html";
        getProductData(this);
    });

    function getProductData(paramProductButton) {
        var vRowIndex = $(paramProductButton).parents("tr");
        var vCurrentVoucher = table.row(vRowIndex).data();
        const detailFormURL = "../admin/product.html";
        urlSiteToOpen = detailFormURL + "?" + "id=" + vCurrentVoucher.id;
        window.location.href = urlSiteToOpen;
    }

    $("#product-line-table").on("click", ".delete-product-line", function() {
        console.log("delete");
        //Xác định thẻ tr là cha của nút được chọn
        var rowSelected = $(this).parents('tr');

        //Lấy datatable row
        var datatableRow = table.row(rowSelected);

        //Lấy data của dòng 
        var data = datatableRow.data();

        if (confirm("bạn có muốn xóa product line có id: " + data.id)) {
            $.ajax({
                url: "http://localhost:8088/productlines/" + data.id,
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
        console.log("lấy thông tin product line");
        //Xác định thẻ tr là cha của nút được chọn
        var rowSelected = $(button).parents('tr');

        //Lấy datatable row
        var datatableRow = table.row(rowSelected);

        //Lấy data của dòng 
        var data = datatableRow.data();

        //lấy id của voucher

        indexOfProductLine = data.id;

        console.log(indexOfProductLine);


        $("#input-mo-ta").val(data.description);
        $("#input-productLine").val(data.productLine);

    }

    $("#save_data").on("click", function() {
        saveData();
    });

    function saveData() {
        if (isEdit == true && validateData()) {
            updateData(indexOfProductLine);
        } else {
            insertData();
        }
        deleteForm();
        reloadTable();
        $("#modal-produsct-line").modal("hide");
    }

    function insertData() {
        var description = $("#input-mo-ta").val().trim();
        var productLine = $("#input-productLine").val().trim();


        if (validateData()) {
            productLine = {
                "description": description,
                "productLine": productLine,
            }

            $.ajax({
                url: "http://localhost:8088/productlines",
                type: 'POST',
                contentType: 'application/json;charset=UTF-8',
                data: JSON.stringify(productLine),
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

        var description = $("#input-mo-ta").val().trim();
        var productLine = $("#input-productLine").val().trim();

        productLine = {
            "description": description,
            "productLine": productLine,
        }

        $.ajax({
            url: "http://localhost:8088/productlines/" + id,
            type: 'PUT',
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify(productLine),
            dataType: 'json',
            success: function(res) {
                console.log(res);
                alert("bạn đã update thành công");
            },
            error: function(ajaxContext) {
                alert(ajaxContext.responseText);
            }

        });

        indexOfProductLine = -1;
        isEdit = false;
        reloadTable();
        deleteForm();
    }

    function validateData() {
        var description = $("#input-mo-ta").val().trim();
        var productLine = $("#input-productLine").val().trim();

        if (description === "") {
            alert("bạn đang để trống description");
            return false;
        }
        if (productLine === "") {
            alert("bạn đang để trống productLine");
            return false;
        }

        return true;
    }


});