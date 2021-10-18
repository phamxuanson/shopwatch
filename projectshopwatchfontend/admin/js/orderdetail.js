var gUrlString = window.location.href;
var gNewUrl = new URL(gUrlString);
var gId = gNewUrl.searchParams.get("id");
console.log(gId);

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

    // load dữ liệu ra bảng
    var isEdit = false;
    var indexOfOrderDetail = -1;

    var table = $("#orderdetail-table").DataTable({
        // Khai báo các cột của datatable (Chú ý tên cột phải giống thuộc tính của object trong mảng đã khai báo)
        "columns": [
            { "data": "id" },
            { "data": "priceEach" },
            { "data": "quantityOrder" },
            { "data": "action" }
        ],
        "columnDefs": [{
                targets: -1,
                defaultContent: "<button class='edit-orderdetail fas fa-edit'></button> <button class='delete-orderdetail fas fa-trash'></button>"
            },

        ]
    });

    reloadTable();

    function deleteForm() {
        $("#input-price-each").val("");
        $("#input-quantity-order").val("");

    }


    function reloadTable() {
        $.ajax({
            url: "http://localhost:8088/orders/" + gId + "/ordersdetails",
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
    reloadTable2();

    function reloadTable2() {
        $.ajax({
            url: "http://localhost:8088/products/" + gId + "/ordersdetails",
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
    $("#orderdetail-table").on("click", ".edit-orderdetail", function() {
        console.log("edit");
        isEdit = true;
        editButton(this);
    });


    $("#orderdetail-table").on("click", ".delete-orderdetail", function() {
        console.log("delete");
        //Xác định thẻ tr là cha của nút được chọn
        var rowSelected = $(this).parents('tr');

        //Lấy datatable row
        var datatableRow = table.row(rowSelected);

        //Lấy data của dòng 
        var data = datatableRow.data();
        if (confirm("bạn có muốn xóa orderdetail có id: " + data.id)) {
            $.ajax({
                url: "http://localhost:8088/orderdetails/" + data.id,
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


        $("#input-price-each").val(data.priceEach);
        $("#input-quantity-order").val(data.quantityOrder);

    }

    $("#save_data").on("click", function() {
        saveData();
        reloadTable();
    });

    function saveData() {
        if (isEdit == true && validateData()) {
            updateData(indexOfOrderDetail);
        } else {
            insertData();

        }
        reloadTable();
        deleteForm();
    }

    function insertData() {
        var priceEach = $("#input-price-each").val().trim();
        var quantityOrder = $("#input-quantity-order").val().trim();


        if (validateData()) {

            orderDetail = {
                "priceEach": priceEach,
                "quantityOrder": quantityOrder
            }

            $.ajax({
                url: "http://localhost:8088/orders/" + gId + "/orderdetail",
                type: 'POST',
                contentType: 'application/json;charset=UTF-8',
                data: JSON.stringify(orderDetail),
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

        var priceEach = $("#input-price-each").val().trim();
        var quantityOrder = $("#input-quantity-order").val().trim();

        orderDetail = {
            "priceEach": priceEach,
            "quantityOrder": quantityOrder
        }

        $.ajax({
            url: "http://localhost:8088/orderdetails/" + id,
            type: 'PUT',
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify(orderDetail),
            dataType: 'json',
            success: function(res) {
                console.log(res);
                alert("bạn đã sửa thành công");
            },
            error: function(ajaxContext) {
                alert(ajaxContext.responseText);
            }

        });

        indexOfOrderDetail = -1;
        isEdit = false;
        reloadTable();
        deleteForm();
    }

    function validateData() {
        var priceEach = $("#input-price-each").val().trim();
        var quantityOrder = $("#input-quantity-order").val().trim();

        var check = false;

        if (priceEach === "") {
            alert("bạn phải nhập priceEach");
            return check;
        }
        if (quantityOrder === "") {
            alert("bạn phải nhập quantityOrder");
            return check;
        }
        check = true;
        return check;
    }

});