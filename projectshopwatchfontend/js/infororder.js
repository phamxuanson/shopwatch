const token = getCookie("token");
const baseUrlApi = "http://localhost:8088";
const baseUrlXampp = "http://localhost/shop";

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

var getUser = [];

function getUserInfo(token) {
    $.ajax({
        url: baseUrlApi + "/user/userbyphonenumber/" + token,
        type: 'GET',
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        async: false,
        headers: {
            "Authorization": "Bearer " + token
        },
        success: function(pRes) {
            console.log(pRes);
            getUser.push(pRes);
            $("#firstName").val(pRes.customer.firstName);
            $("#lastName").val(pRes.customer.lastName);
            $("#email").val(pRes.customer.email);
            $("#phoneNumber").val(pRes.customer.phoneNumber);
            $("#address").val(pRes.customer.address);
            $("#city").val(pRes.customer.city);
            $("#state").val(pRes.customer.state);

        },
        error: function(pAjaxContext) {
            console.log(pAjaxContext.responseText);
        }
    });
} {
    /* <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right" id="logout">
        <span class="dropdown-header">Thông tin của tôi</span>
        <div class="dropdown-divider"></div>
        <a href="#" class="dropdown-item">
            <i class="fas fa-envelope mr-2"></i>Chi tiết
        </a>
        <div class="dropdown-divider"></div>
        <a href="#" class="dropdown-item">
            <i class="fas fa-users mr-2"></i>Đơn hàng của tôi
        </a>
        <div class="dropdown-divider"></div>
        <a href="#" class="dropdown-item">
            <i class="fas fa-file mr-2"></i>Đăng xuất
        </a>
    </div> */
}
if (token) {
    // console.log("voo");
    $("#logindiv").remove();
    $("#userLogin").append(
        `<div class="dropdown-menu dropdown-menu-lg dropdown-menu-right" id="logout">
            <span class="dropdown-header">Thông tin của tôi</span>
            <div class="dropdown-divider"></div>
            <a class="btn dropdown-item" id="detailcustomer" data="1">
                <i class="fas fa-envelope mr-2"></i>Tài khoản của tôi
            </a>
            <div class="dropdown-divider"></div>
            <a  class="btn dropdown-item" id="detailorderme" data="2">
                <i class="fas fa-users mr-2"></i>Đơn hàng của tôi
            </a>
            <div class="dropdown-divider"></div>
            <a class="btn dropdown-item" id="btn-logout">
                <i class="fas fa-file mr-2"></i>Đăng xuất
            </a>
        </div>
        `
    );
    getUserInfo(token);
    $("#username").append(getUser[0].username);
    console.log(getUser[0]);
}

$("#btn-logout").on("click", function() {
    redirectToLogin();
});

function redirectToLogin() {
    // Trước khi logout cần xóa token đã lưu trong cookie
    setCookie("token", "", 1);
    window.location.href = baseUrlXampp + "/infororder.html";
}

$("#detailcustomer").on("click", function() {
    var data = this.getAttribute("data");
    const detailcustomer = "orderme.html";
    urlSiteToOpen = detailcustomer + "?" +
        "id=" + data;
    window.location.href = urlSiteToOpen;
});

$("#detailorderme").on("click", function() {
    var data = this.getAttribute("data");
    const detailorderme = "orderme.html";
    urlSiteToOpen = detailorderme + "?" +
        "id=" + data;
    window.location.href = urlSiteToOpen;
});

var oldItems = JSON.parse(localStorage.getItem('itemsArray')) || [];
console.log(oldItems);

// format tiền kiểu đ
var formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
});

// Load icon giỏ hàng nếu có --------
var spanElement = "";
spanElement = `<span class="badge bg-danger navbar-badge", id="cartSo"">${oldItems.length}</span>`;
$("#cart").append(spanElement);

var sum = 0;
// hàm tính tổng tiền số sản phẩm
function loadTongTien() {
    for (i = 0; i < oldItems.length; i++) {
        sum += parseInt(oldItems[i].product_price) * oldItems[i].qty_product;
        $("#loadTongTien").html("Tổng tiền: " + formatter.format(sum));

    }
}
loadTongTien();
// var tongTien = loadTongTien();

// tạo object mới cho order
var order = {
    status: "Open",
    comments: "ok"
}

// các sự kiện bật tắt modal
$("#tat").on("click", function() {
    $('#ModalCenter').modal('hide');
});
$("#xBtn").on("click", function() {
    $('#ModalCenter').modal('hide');
});

// testttttt------------------------------------------------------
// var getCookies = function() {
//     var pairs = document.cookie.split(";");
//     var cookies = [];
//     for (var i = 0; i < pairs.length; i++) {
//         var pair = pairs[i].split("=");
//         cookies[(pair[0] + '').trim()] = unescape(pair.slice(1).join('='));
//     }
//     return cookies;
// }

// var myorder = getCookies();

// console.log(myorder);

// customer = {
//     "lastName": lName,
//     "firstName": fName,
//     "email": email,
//     "phoneNumber": phoneNumber,
//     "address": address,
//     "city": city,
//     "state": state,
// }

// hàm click nút đặt hàng 
console.log(token);
$("#datHang").on("click", function() {

    if (oldItems.length == 0 && token == "") {
        alert("Bạn chưa có sản phẩm nào hoặc chưa đăng nhập!");
    } else {
        insertData();
        // $('#ModalCenter').modal('show');
        // $("#nameModal").html("Họ Tên: " + lName + " " + fName);
        // $("#phoneModal").html("Số điện thoại: " + phoneNumber);
        // $("#addressModal").html("Địa chỉ: " + address);
        // $("#toPayModal").html("Tổng tiền: " + tongTien);

    }
})

// thêm khách hàng hoặc sửa khách hàng nếu trùng sđt
function insertData() {

    var fName = $("#firstName").val().trim();
    var lName = $("#lastName").val().trim();
    var email = $("#email").val().trim();
    var phoneNumber = $("#phoneNumber").val().trim();
    var address = $("#address").val().trim();
    var city = $("#city").val().trim();
    var state = $("#state").val().trim();

    // $("#name").html("Họ Tên: " + lName + " " + fName);
    // $("#phone").html("Số điện thoại: " + phoneNumber);
    // $("#address").html("Địa chỉ: " + address);
    // $("#toPay").html("Tổng tiền: " + tongTien);

    if (validateData()) {
        customer = {
            "lastName": lName,
            "firstName": fName,
            "email": email,
            "phoneNumber": phoneNumber,
            "address": address,
            "city": city,
            "state": state,
        }

        // gọi api thêm hoặc sửa kh theo sđt
        $.ajax({
            url: baseUrlApi + "/customer/create",
            type: "POST",
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify(customer),
            dataType: 'json',
            success: function(res) {
                console.log(res);
                createOrder(res.id);
            },
            error: function(ajaxContext) {
                alert(ajaxContext.responseText);
            }
        });
    }
}

// hàm gọi api thêm order
function createOrder(id) {
    $.ajax({
        url: baseUrlApi + "/customers/" + id + "/order",
        type: 'POST',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(order),
        dataType: 'json',
        success: function(res) {
            console.log(res);
            // var vId = res.orders[res.orders.length - 1].id;
            insertOrderDetailData(res.id);
        },
        error: function(ajaxContext) {
            alert(ajaxContext);
        }
    });
}

// hàm gọi api thêm orderdetail
function insertOrderDetailData(id) {

    oldItems.forEach(element => {

        var orderDetailObj = {
            quantityOrder: element.qty_product,
            priceEach: element.qty_product * parseInt(element.product_price)
        }

        $.ajax({
            url: baseUrlApi + "/orders/" + id + "/products/" + element.product_id + "/orderdetail",
            type: "POST",
            contentType: "application/json;charset=UTF-8",
            data: JSON.stringify(orderDetailObj),
            dataType: "json",
            success: function(paramRes) {
                console.log(paramRes);
            },
            error: function(xhr) {
                alert(xhr.status);
            }
        })
    });

    $('#ModalCenter').modal('show');
    localStorage.removeItem("itemsArray");
    // $("#nameModal").html("Họ Tên: " + lName + " " + fName);
    // $("#phoneModal").html("Số điện thoại: " + phoneNumber);
    // $("#addressModal").html("Địa chỉ: " + address);
    // $("#toPayModal").html("Tổng tiền: " + tongTien);
    // resetForm();


}

// load lại form khi thêm mới khác hàng thành công
// function resetForm() {
//     $("#firstName").val("");
//     $("#lastName").val("");
//     $("#email").val("");
//     $("#phoneNumber").val("");
//     $("#address").val("");
//     $("#city").val("");
//     $("#country").val("");
//     $("#state").val("");
//     $("#message").val("");
// }

// validate dữ liệu nhập ở form
function validateData() {
    var fName = $("#firstName").val().trim();
    var lName = $("#lastName").val().trim();
    var email = $("#email").val().trim();
    var phoneNumber = $("#phoneNumber").val().trim();
    var address = $("#address").val().trim();
    var city = $("#city").val().trim();
    var state = $("#state").val().trim();


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
    // if (validateEmail(email)) {
    //     alert("Email chưa đứng ");
    //     return false;
    // }

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
// function validateEmail(email) {
//     const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     return re.test(String(email).toLowerCase());
// }   const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     return re.test(String(email).toLowerCase());
// }