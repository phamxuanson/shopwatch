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
    var isEditOrder = false;
    var indexOfOrder = -1;


    var tableOrder = $("#order-table").DataTable({
        // Khai báo các cột của datatable (Chú ý tên cột phải giống thuộc tính của object trong mảng đã khai báo)
        "columns": [
            { "data": "id" },
            { "data": "orderDate" },
            { "data": "requiredDate" },
            { "data": "shippedDate" },
            { "data": "status" },
            { "data": "comments" },
            { "data": "customer.firstName" },
            { "data": "customer.lastName" },
            { "data": "customer.id" },
            { "data": "action" },
        ],
        "columnDefs": [{
            targets: -1,
            defaultContent: "<i class='edit-order fas fa-edit btn btn-primary btn-sm'></i>"
        }, ]


    });

    function loadTableOrder() {
        $.ajax({
            url: baseUrlApi + "/orders",
            type: "GET",
            dataType: 'json',
            success: function(responseObject) {
                console.log(responseObject);
                //Xóa toàn bộ dữ liệu đang có của bảng
                tableOrder.clear();

                //Cập nhật data cho bảng 
                tableOrder.rows.add(responseObject);

                //Cập nhật lại giao diện hiển thị bảng
                tableOrder.draw();
            },
            error: function(error) {
                console.log(error.responseText);
            }
        });
    }

    loadTableOrder();
    // sự kiện click vào nút edit
    $("#order-table").on("click", ".edit-order", function() {
        console.log("edit");
        isEditOrder = true;
        editButtonOrder(this);
    });

    // editButton 
    function editButtonOrder(button) {
        console.log("lấy thông tin order");
        //Xác định thẻ tr là cha của nút được chọn
        var rowSelected = $(button).parents('tr');

        //Lấy datatable row
        var datatableRow = tableOrder.row(rowSelected);

        //Lấy data của dòng 
        var dataOrder = datatableRow.data();

        //lấy id của voucher

        indexOfOrder = dataOrder.id;

        console.log(indexOfOrder);
        console.log(tableOrder);

        $("#inputOrderDate").val(dataOrder.orderDate.split("-").reverse().join("-"));
        $("#inputRequiredDate").val(dataOrder.requiredDate.split("-").reverse().join("-"));
        $("#inputShippedDate").val(dataOrder.shippedDate.split("-").reverse().join("-"));
        $("#inputStatus").val(dataOrder.status);
        $("#inputComments").val(dataOrder.comments)
        $("#inputCustomerId").val(dataOrder.customer.id);
    }

    $("#saveOrder").on("click", function() {
        console.log(isEditOrder);
        saveDataOrder();
        loadTableOrder();
    });

    function saveDataOrder() {
        if (isEditOrder == true && validateDataOrder()) {
            updateDataOrder(indexOfOrder);
        } else {
            insertDataOrder();
        }
    }

    function insertDataOrder() {
        console.log("save order");
        var orderDate = $("#inputOrderDate").val().split("-").reverse().join("-");
        var requiredDate = $("#inputRequiredDate").val().split("-").reverse().join("-");
        var shippedDate = $("#inputShippedDate").val().split("-").reverse().join("-");
        var status = $("#inputStatus").val();
        var comments = $("#inputComments").val()
        var customerId = $("#inputCustomerId").val();


        if (validateDataOrder()) {

            var order = {
                // "orderDate": orderDate,
                // "requiredDate": requiredDate,
                // "shippedDate": shippedDate,
                "status": status,
                "comments": comments,
            }

            $.ajax({
                url: baseUrlApi + "/customers/" + customerId + "/order",
                type: 'POST',
                contentType: 'application/json;charset=UTF-8',
                data: JSON.stringify(order),
                dataType: 'json',
                success: function(res) {
                    console.log(res);
                    loadTableOrder();
                },
                error: function(ajaxContext) {
                    alert(ajaxContext.responseText);
                }

            });

        }

        reloadFormOrder()
    }

    function updateDataOrder(orderId) {

        // var orderDate = $("#inputOrderDate").val().split("-").reverse().join("-");
        // var requiredDate = $("#inputRequiredDate").val().split("-").reverse().join("-");
        // var shippedDate = $("#inputShippedDate").val().split("-").reverse().join("-");
        var status = $("#inputStatus").val();
        var comments = $("#inputComments").val()
        var customerId = $("#inputCustomerId").val();


        var order = {
            // "orderDate": orderDate,
            // "requiredDate": requiredDate,
            // "shippedDate": shippedDate,
            "status": status,
            "comments": comments,
        }

        console.log(order);
        $.ajax({
            url: baseUrlApi + "/order/update/" + orderId + "/" + customerId,
            type: 'PUT',
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify(order),
            dataType: 'json',
            success: function(res) {
                console.log(res);
                loadTableOrder();
            },
            error: function(ajaxContext) {
                alert(ajaxContext.responseText);
            }

        });
        loadTableOrder();
        reloadFormOrder()
        indexOfOrder = -1;
        isEditOrder = false;

    }

    function validateDataOrder() {
        // var orderDate = $("#inputOrderDate").val().split("-").reverse().join("-");
        // var requiredDate = $("#inputRequiredDate").val().split("-").reverse().join("-");
        // var shippedDate = $("#inputShippedDate").val().split("-").reverse().join("-");
        var status = $("#inputStatus").val();
        var comments = $("#inputComments").val()
        var customerId = $("#inputCustomerId").val();


        var check = false;
        // if (orderDate === "" && requiredDate === "") {
        //     alert("bạn đang chưa nhập họ hoặc tên");
        //     return check;
        // }
        if (status == "") {
            alert("bạn chưa nhập họ và tên hoặc ngày sinh");
            return check;
        }
        if (comments == "0" && customerId == "0") {
            alert("bạn chưa chọn thành phố hoặc quận huyện");
            return check;
        }

        check = true;
        return check;

    }

    function reloadFormOrder() {
        $("#inputOrderDate").val("");
        $("#inputRequiredDate").val("");
        $("#inputShippedDate").val("");
        $("#inputStatus").val("");
        $("#inputComments").val("")
        $("#inputCustomerId").val("");
    }

    $("#cancleOrder").on("click", function() {
        reloadFormOrder();
    });

    //===================orderdetail==========================
    var isEditOrderDetail = false;
    var indexOfOrderDetail = -1;


    var tableOrderDetail = $("#orderdetail-table").DataTable({
        // Khai báo các cột của datatable (Chú ý tên cột phải giống thuộc tính của object trong mảng đã khai báo)
        "columns": [
            { "data": "id" },
            { "data": "order.id" },
            { "data": "product.productName" },
            { "data": "quantityOrder" },
            { "data": "product.buyPrice" },
            { "data": "action" },
        ],
        "columnDefs": [{
            targets: -1,
            defaultContent: "<i class='edit-orderdetail fas fa-edit btn btn-primary btn-sm'></i>"
        }, ]


    });
    // inputOrderId
    // inputProductId
    // inputQuantityOrder
    // inputPrice
    // cancleOrderDetail
    // saveOrderDetail
    function loadTableOrderDetail() {
        $.ajax({
            url: baseUrlApi + "/orderdetails",
            type: "GET",
            dataType: 'json',
            success: function(responseObject) {
                console.log(responseObject);
                //Xóa toàn bộ dữ liệu đang có của bảng
                tableOrderDetail.clear();

                //Cập nhật data cho bảng 
                tableOrderDetail.rows.add(responseObject);

                //Cập nhật lại giao diện hiển thị bảng
                tableOrderDetail.draw();
            },
            error: function(error) {
                console.log(error.responseText);
            }
        });
    }

    loadTableOrderDetail();
    // sự kiện click vào nút edit
    $("#orderdetail-table").on("click", ".edit-orderdetail", function() {
        console.log("edit");
        isEditOrderDetail = true;
        editButtonOrderDetail(this);
    });

    // editButton 
    function editButtonOrderDetail(button) {
        console.log("lấy thông tin order");
        //Xác định thẻ tr là cha của nút được chọn
        var rowSelected = $(button).parents('tr');

        //Lấy datatable row
        var datatableRow = tableOrderDetail.row(rowSelected);

        //Lấy data của dòng 
        var dataOrderDetail = datatableRow.data();

        //lấy id của voucher

        indexOfOrderDetail = dataOrderDetail.id;

        console.log(indexOfOrderDetail);
        console.log(tableOrderDetail);

        $("#inputOrderId").val(dataOrderDetail.order.id);
        $("#inputProductId").val(dataOrderDetail.product.id);
        $("#inputQuantityOrder").val(dataOrderDetail.quantityOrder);
        $("#inputPrice").val(dataOrderDetail.priceEach);

    }

    $("#saveOrderDetail").on("click", function() {
        console.log(isEditOrderDetail);
        saveDataOrderDetail();
        loadTableOrderDetail();
    });

    function saveDataOrderDetail() {
        if (isEditOrderDetail == true && validateDataOrderDetail()) {
            updateDataOrderDetail(indexOfOrderDetail);
        } else {
            insertDataOrderDetail();
        }
    }

    function insertDataOrderDetail() {
        console.log("save order");
        var orderId = $("#inputOrderId").val();
        var productId = $("#inputProductId").val();
        var quantity = $("#inputQuantityOrder").val();


        if (validateDataOrderDetail()) {

            var orderDetail = {
                "quantityOrder": quantity,
            }

            $.ajax({
                url: baseUrlApi + "/orders/" + orderId + "/products/" + productId + "/orderdetail",
                type: 'POST',
                contentType: 'application/json;charset=UTF-8',
                data: JSON.stringify(orderDetail),
                dataType: 'json',
                success: function(res) {
                    console.log(res);
                    loadTableOrderDetail();
                },
                error: function(ajaxContext) {
                    alert(ajaxContext.responseText);
                }

            });

        }

        reloadFormOrderDetail()
    }

    function updateDataOrderDetail(orderDetailId) {

        var orderId = $("#inputOrderId").val().trim();
        var productId = $("#inputProductId").val().trim();
        var quantity = $("#inputQuantityOrder").val().trim();

        var orderDetail = {
            "quantityOrder": quantity
        }

        console.log(orderDetail);
        $.ajax({
            url: baseUrlApi + "/orderdetail/update/" + orderDetailId + "/" + orderId + "/" + productId,
            type: 'PUT',
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify(orderDetail),
            dataType: 'json',
            success: function(res) {
                console.log(res);
                loadTableOrderDetail();
            },
            error: function(ajaxContext) {
                alert(ajaxContext.responseText);
            }

        });
        loadTableOrderDetail();
        reloadFormOrderDetail()
        indexOfOrderDetail = -1;
        isEditOrderDetail = false;

    }

    function validateDataOrderDetail() {
        var orderId = $("#inputOrderId").val().trim();
        var productId = $("#inputProductId").val().trim();
        var quantity = $("#inputQuantityOrder").val().trim();

        var check = false;
        if (orderId === "" && productId === "") {
            alert("bạn chưa nhập id hóa đơn hoặc id sản phẩm");
            return check;
        }
        if (quantity == "") {
            alert("bạn chưa nhập số lượng");
            return check;
        }

        check = true;
        return check;

    }

    function reloadFormOrderDetail() {
        $("#inputOrderId").val("");
        $("#inputProductId").val("");
        $("#inputQuantityOrder").val("");
    }

    $("#cancleOrderDetail").on("click", function() {
        reloadFormOrderDetail();
    });

});