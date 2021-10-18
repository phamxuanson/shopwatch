$(document).ready(function() {

    const token = getCookie("token");
    const baseUrlXampp = "http://localhost/shop24h";

    $("#showBody").prop("class", "hold-transition sidebar-mini layout-fixed hide");
    if (token === "" || token !== "01699999999") {
        window.location.href = baseUrlXampp + "/login.html";
    } else {
        $("#showBody").prop("class", "hold-transition sidebar-mini layout-fixed");
    }

    var isEdit = false;
    var indexOfCustomer = -1;

    var table = $("#customer-table").DataTable({
        // Khai báo các cột của datatable (Chú ý tên cột phải giống thuộc tính của object trong mảng đã khai báo)
        "columns": [
            { "data": "id" },
            { "data": "lastName" },
            { "data": "firstName" },
            { "data": "phoneNumber" },
            { "data": "email" },
            // { "data": "message" },
            { "data": "address" },
            { "data": "city" },
            { "data": "state" },
            // { "data": "country" },
            { "data": "action" }
        ],
        "columnDefs": [{
                targets: -1,
                defaultContent: `<button class='edit-customer fas fa-edit'></button> 
                                  
                                <button class='all-order fab fa-first-order'></button>
                                `
            },

        ]
    });

    reloadTable();

    function deleteForm() {
        $("#input-last-name").val("");
        $("#input-first-name").val("");
        $("#input-phone-number").val("");
        $("#input-email").val("");
        $("#input-message").val("");
        $("#input-adress").val("");
        $("#input-city").val("");
        $("#input-state").val("");
        $("#input-country").val("");

    }


    function reloadTable() {
        $.ajax({
            url: "http://localhost:8088/customers",
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
    $("#customer-table").on("click", ".edit-customer", function() {
        console.log("edit");
        isEdit = true;
        editButton(this);
        $("#modal-customer").modal("show");
    });

    $("#customer-table").on("click", ".all-order", function() {
        // console.log("all answer");
        // window.location.href = "answer.html";
        getOrderData(this);
    });

    function getOrderData(paramOrderButton) {
        var vRowIndex = $(paramOrderButton).parents("tr");
        var vCurrentProduct = table.row(vRowIndex).data();
        const detailFormURL = "../admin/order.html";
        var urlSiteToOpen = detailFormURL + "?" + "id=" + vCurrentProduct.id + "&firstName=" + vCurrentProduct.firstName + "&lastName=" + vCurrentProduct.lastName;
        window.location.href = urlSiteToOpen;
    }

    // $("#customer-table").on("click", ".all-payment", function() {
    //     // console.log("all answer");
    //     // window.location.href = "answer.html";
    //     getPaymentData(this);
    // });

    // function getPaymentData(paramPaymentButton) {
    //     var vRowIndex = $(paramPaymentButton).parents("tr");
    //     var vCurrentProduct = table.row(vRowIndex).data();
    //     const detailFormURL = "../projectsql/Payment.html";
    //     var urlSiteToOpen = detailFormURL + "?" + "id=" + vCurrentProduct.id + "&firstName=" + vCurrentProduct.firstName + "&lastName=" + vCurrentProduct.lastName;
    //     window.location.href = urlSiteToOpen;
    // }

    $("#customer-table").on("click", ".delete-customer", function() {
        console.log("delete");
        //Xác định thẻ tr là cha của nút được chọn
        var rowSelected = $(this).parents('tr');

        //Lấy datatable row
        var datatableRow = table.row(rowSelected);

        //Lấy data của dòng 
        var data = datatableRow.data();
        if (confirm("bạn có muốn xóa customer có id: " + data.id)) {
            $.ajax({
                url: "http://localhost:8088/customers/" + data.id,
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

        indexOfCustomer = data.id;

        console.log(indexOfCustomer);

        $("#input-last-name").val(data.lastName);
        $("#input-first-name").val(data.firstName);
        $("#input-phone-number").val(data.phoneNumber);
        $("#input-email").val(data.email);
        // $("#input-message").val(data.message);
        $("#input-adress").val(data.address);
        $("#input-city").val(data.city);
        $("#input-state").val(data.state);
        // $("#input-country").val(data.country);


    }

    $("#save_data").on("click", function() {
        saveData();
        reloadTable();
    });

    function saveData() {
        if (isEdit == true && validateData()) {
            updateData(indexOfCustomer);
        } else {
            insertData();
        }
        reloadTable();
        deleteForm();
        $("#modal-customer").modal("hide");
    }

    function insertData() {
        var lName = $("#input-last-name").val().trim();
        var fName = $("#input-first-name").val().trim();
        var phoneNumber = $("#input-phone-number").val().trim();
        var email = $("#input-email").val().trim();
        // var message = $("#input-message").val().trim();
        var address = $("#input-adress").val().trim();
        var city = $("#input-city").val().trim();
        var state = $("#input-state").val().trim();
        // var country = $("#input-country").val().trim();

        if (validateData()) {
            customer = {
                "lastName": lName,
                "firstName": fName,
                "phoneNumber": phoneNumber,
                "email": email,
                // "message": message,
                "address": address,
                "city": city,
                "state": state,
                // "country": country,
            }

            $.ajax({
                url: "http://localhost:8088/customers",
                type: 'POST',
                contentType: 'application/json;charset=UTF-8',
                data: JSON.stringify(customer),
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
        var lName = $("#input-last-name").val().trim();
        var fName = $("#input-first-name").val().trim();
        var phoneNumber = $("#input-phone-number").val().trim();
        var email = $("#input-email").val().trim();
        // var message = $("#input-message").val().trim();
        var address = $("#input-adress").val().trim();
        var city = $("#input-city").val().trim();
        var state = $("#input-state").val().trim();
        // var country = $("#input-country").val().trim();

        customer = {
            "lastName": lName,
            "firstName": fName,
            "phoneNumber": phoneNumber,
            "email": email,

            "address": address,
            "city": city,
            "state": state,

        }

        $.ajax({
            url: "http://localhost:8088/customers/" + id,
            type: 'PUT',
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify(customer),
            dataType: 'json',
            success: function(res) {
                console.log(res);
                alert("bạn đã sửa thành công");
            },
            error: function(ajaxContext) {
                alert(ajaxContext.responseText);
            }

        });

        indexOfCustomer = -1;
        isEdit = false;
        reloadTable();
        deleteForm();
    }

    function validateData() {
        var lName = $("#input-last-name").val().trim();
        var fName = $("#input-first-name").val().trim();
        var phoneNumber = $("#input-phone-number").val().trim();
        var email = $("#input-email").val().trim();

        var address = $("#input-adress").val().trim();
        var city = $("#input-city").val().trim();
        var state = $("#input-state").val().trim();


        var check = false;

        if (lName === "") {
            alert("bạn phải nhập last name");
            return check;
        }
        if (fName === "") {
            alert("bạn phải nhập first name");
            return check;
        }
        if (phoneNumber === "") {
            alert("bạn phải nhập phoneNumber");
            return check;
        }
        if (email === "") {
            alert("bạn phải nhập email");
            return check;
        }

        if (address === "") {
            alert("bạn phải nhập address");
            return check;
        }
        if (city === "") {
            alert("bạn phải nhập city");
            return check;
        }
        if (state === "") {
            alert("bạn phải nhập state");
            return check;
        }

        check = true;
        return check;
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

});