//const token = getCookie("token");


$(document).ready(function() {
    const token = getCookie("token");
    const baseUrlApi = "http://localhost:8088";
    const baseUrlXampp = "http://localhost/shop24h";

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
    const tableRate = $("#rate-table").DataTable({
        // Khai báo các cột của datatable (Chú ý tên cột phải giống thuộc tính của object trong mảng đã khai báo)
        "columns": [
            { "data": "id" },
            { "data": "rateScore" },
            { "data": "comments" },
            { "data": "orderdetails.product.productName" },
            { "data": "orderdetails.product.productCode" },
            { "data": "customer.firstName" },
            { "data": "customer.lastName" },
            { "data": "customer.phoneNumber" },
            { "data": "updateDate" },
            { "data": "action" },
        ],
        "columnDefs": [{
            targets: -1,
            defaultContent: "<i class='delete-rate fas fa-trash-alt btn btn-danger btn-sm'></i>"
        }, ]


    });

    function loadTableRate() {
        $.ajax({
            url: baseUrlApi + "/rate",
            type: "GET",
            dataType: 'json',
            success: function(responseObject) {
                console.log(responseObject);
                //Xóa toàn bộ dữ liệu đang có của bảng
                tableRate.clear();

                //Cập nhật data cho bảng 
                tableRate.rows.add(responseObject);

                //Cập nhật lại giao diện hiển thị bảng
                tableRate.draw();
            },
            error: function(error) {
                console.log(error.responseText);
            }
        });
    }

    loadTableRate();

    // sự kiện click vào nút edit
    $("#rate-table").on("click", ".delete-rate", function() {
        console.log("delete");
        //Xác định thẻ tr là cha của nút được chọn
        var rowSelected = $(this).parents('tr');

        //Lấy datatable row
        var datatableRow = tableRate.row(rowSelected);

        //Lấy data của dòng 
        var dataRate = datatableRow.data();
        var rateId = dataRate.id;
        if (confirm("bạn có muốn xóa phần đánh giá có id: " + rateId)) {
            $.ajax({
                url: baseUrlApi + "/rate/delete/" + rateId,
                type: "DELETE",
                dataType: 'json',
                async: false,
                success: function(responseObject) {
                    console.log(responseObject);
                    loadTableRate();
                },
                error: function(error) {
                    console.log(error.responseText);
                }
            });
        }

    });

});