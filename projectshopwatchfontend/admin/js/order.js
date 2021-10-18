var gUrlString = window.location.href;
var gNewUrl = new URL(gUrlString);
var gId = gNewUrl.searchParams.get("id");
var gFirstName = gNewUrl.searchParams.get("firstName");
var gLastName = gNewUrl.searchParams.get("lastName");
console.log(gId);

function getFullName() {
    var fullName = gLastName + " " + gFirstName;
    return fullName;
}

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
    var indexOfOrder = -1;

    var table = $("#order-table").DataTable({
        // Khai báo các cột của datatable (Chú ý tên cột phải giống thuộc tính của object trong mảng đã khai báo)
        "columns": [
            { "data": "id" },
            { "data": "fullName" },
            { "data": "comments" },
            { "data": "orderDate" },
            { "data": "requiredDate" },
            { "data": "shippedDate" },
            { "data": "status" },
            { "data": "action" }
        ],
        "columnDefs": [{
                "targets": 1,
                render: function(data, type, full, meta) {
                    return getFullName();
                },
                "width": "20%"
            },
            {
                targets: -1,
                defaultContent: "<button class='edit-order fas fa-edit'></button> <button class='delete-order fas fa-trash'></button>  <button class='all-orderdetail fas fa-info'></button>"
            },

        ]
    });

    reloadTable();

    function deleteForm() {
        $("#input-comment").val("");
        $("#input-order-date").val("");
        $("#input-required-date").val("");
        $("#input-shipped-date").val("");
        $("#input-status").val("");

    }


    function reloadTable() {
        $.ajax({
            url: "http://localhost:8088/customers/" + gId + "/order",
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
    $("#order-table").on("click", ".edit-order", function() {
        console.log("edit");
        isEdit = true;
        editButton(this);
        $("#modal-order").modal("show");
    });

    $("#order-table").on("click", ".all-orderdetail", function() {
        // console.log("all answer");
        // window.location.href = "answer.html";
        getOrderDetailData(this);
    });

    function getOrderDetailData(paramOrderDetailButton) {
        var vRowIndex = $(paramOrderDetailButton).parents("tr");
        var vCurrentProduct = table.row(vRowIndex).data();
        const detailFormURL = "../admin/orderdetail.html";
        var urlSiteToOpen = detailFormURL + "?" + "id=" + vCurrentProduct.id;
        window.location.href = urlSiteToOpen;
    }

    $("#order-table").on("click", ".delete-order", function() {
        console.log("delete");
        //Xác định thẻ tr là cha của nút được chọn
        var rowSelected = $(this).parents('tr');

        //Lấy datatable row
        var datatableRow = table.row(rowSelected);

        //Lấy data của dòng 
        var data = datatableRow.data();
        if (confirm("bạn có muốn xóa order có id: " + data.id)) {
            $.ajax({
                url: "http://localhost:8088/orders/" + data.id,
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

        indexOfOrder = data.id;

        console.log(indexOfOrder);

        var orderDateNew = data.orderDate.split("-").reverse().join("-");
        var requiredDateNew = data.requiredDate.split("-").reverse().join("-");
        // var shippedDateNew = data.shippedDate.split("-").reverse().join("-");

        $("#input-comment").val(data.comments);
        $("#input-order-date").val(orderDateNew);
        $("#input-required-date").val(requiredDateNew);
        $("#input-shipped-date").val(data.shippedDate);
        $("#input-status").val(data.status);

    }

    $("#save_data").on("click", function() {
        saveData();
        reloadTable();
    });

    function saveData() {
        if (isEdit == true && validateData()) {
            updateData(indexOfOrder);
        } else {
            insertData();
        }
        reloadTable();
        deleteForm();
        $("#modal-order").modal("hide");
    }

    function insertData() {

        var comment = $("#input-comment").val().trim();
        var orderDate = $("#input-order-date").val().trim();
        var requiredDate = $("#input-required-date").val().trim();
        var shippedDate = $("#input-shipped-date").val().trim();
        var status = $("#input-status").val().trim();


        if (validateData()) {
            order = {
                "comments": comment,
                "orderDate": orderDate,
                "requiredDate": requiredDate,
                "shippedDate": shippedDate,
                "status": status
            }

            $.ajax({
                url: "http://localhost:8088/customers/" + gId + "/order",
                type: 'POST',
                contentType: 'application/json;charset=UTF-8',
                data: JSON.stringify(order),
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

        var comment = $("#input-comment").val().trim();
        var orderDate = $("#input-order-date").val().trim();
        var requiredDate = $("#input-required-date").val().trim();
        var shippedDate = $("#input-shipped-date").val().trim();
        var status = $("#input-status").val().trim();

        order = {
            "comments": comment,
            "orderDate": orderDate,
            "requiredDate": requiredDate,
            "shippedDate": shippedDate,
            "status": status
        }

        $.ajax({
            url: "http://localhost:8088/orders/" + id,
            type: 'PUT',
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify(order),
            dataType: 'json',
            success: function(res) {
                console.log(res);
                alert("bạn đã sửa thành công");
            },
            error: function(ajaxContext) {
                alert(ajaxContext.responseText);
            }

        });

        indexOfOrder = -1;
        isEdit = false;
        reloadTable();
        deleteForm();
    }

    function validateData() {
        var comment = $("#input-comment").val().trim();
        var orderDate = $("#input-order-date").val().trim();
        var requiredDate = $("#input-required-date").val().trim();
        var shippedDate = $("#input-shipped-date").val().trim();
        var status = $("#input-status").val().trim();

        var check = false;

        if (comment === "") {
            alert("bạn phải nhập comment");
            return check;
        }
        if (orderDate === "") {
            alert("bạn phải nhập orderDate");
            return check;
        }
        if (requiredDate === "") {
            alert("bạn phải nhập requiredDate");
            return check;
        }
        if (shippedDate === "") {
            alert("bạn phải nhập shippedDate");
            return check;
        }
        if (status === "") {
            alert("bạn phải nhập status");
            return check;
        }
        check = true;
        return check;
    }
});