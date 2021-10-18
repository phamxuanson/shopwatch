const token = getCookie("token");
const baseUrlApi = "http://localhost:8088";
const baseUrlXampp = "http://localhost/shop24h";

// gọi ra 8 sản phẩm ra trang chủ
loadProduct();

function loadProduct() {
    $.ajax({
        url: baseUrlApi + "/product/limit8",
        type: "GET",
        dataType: 'json',
        async: false,
        success: function(res) {

            // Load icon giỏ hàng nếu có --------
            var oldItems = JSON.parse(localStorage.getItem('itemsArray')) || [];
            var spanElement = "";
            spanElement = `<span class="badge bg-danger navbar-badge", id="cartSo"">${oldItems.length}</span>`;
            $("#cart").append(spanElement);

            // format theo số tiền
            var formatter = new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            });
            console.log(res);
            for (var i = 0; i < res.length; i++) {
                var divCol = $("<div/>", { "class": "col-sm-3 mt-2 khung-product " });
                var divWrapper = $("<div/>", { "class": "thumb-wrapper" });
                var divImgBox = $("<div/>", { "class": "img-box" });
                var divContent = $("<div/>", { "class": "thumb-content text-center bg-light" });
                var divBtn = $("<button/>", { "class": "btn btn-primary btn-sm anvao", "text": "Mua Ngay" });
                var divIcon = $("<i/>", { "class": "fas fa-shopping-cart" });
                divBtn.prepend(divIcon);

                var aImg = $("<a/>", { "alt": "p1", "href": "#", "class": "bamvao cdt-product" });

                var img = $("<img/>", { "class": "img-responsive img-fluid" });
                var h4 = $("<h5/>", { "class": "text-center" });
                var p = $("<p/>", { "class": "text-center price" });

                aImg.append(img);
                aImg.attr("data", res[i].id);
                divBtn.attr("data", res[i].id);
                divContent.append(h4, p);
                divImgBox.append(aImg, divContent);
                divContent.append(divBtn);
                divWrapper.append(divImgBox);
                divCol.append(divWrapper);

                img.prop("src", res[i].productImage);
                h4.html(res[i].productName);
                p.html(formatter.format(res[i].buyPrice));
                $("#loadContent").append(divCol);

            }
        },
        error: function(error) {
            console.log(error);
        }
    });
}


// click ảnh chuyển trang chi tiết
$('#loadContent').on('click', '.bamvao', function() {
    console.log("click");
    console.log(this.getAttribute("data"));
    var data = this.getAttribute("data");
    const detailFormURL = "chitietsanpham.html";
    urlSiteToOpen = detailFormURL + "?" +
        "id=" + data;
    window.location.href = urlSiteToOpen;
});

// click mua ngay chuyển trang chi tiết
$('#loadContent').on('click', '.anvao', function() {
    console.log("click");
    console.log(this.getAttribute("data"));
    var data = this.getAttribute("data");
    const detailFormURL = "chitietsanpham.html";
    urlSiteToOpen = detailFormURL + "?" +
        "id=" + data;
    window.location.href = urlSiteToOpen;
});

// Hàm getcookie
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    console.log(decodedCookie)
    var ca = decodedCookie.split(';');
    console.log(ca)
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
        async: false,
        contentType: "application/json; charset=utf-8",
        headers: {
            "Authorization": "Bearer " + token
        },
        success: function(pRes) {
            console.log(pRes);
            getUser.push(pRes);
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

// else {
//     loadProduct();
// }

$("#btn-logout").on("click", function() {
    redirectToLogin();
});

function redirectToLogin() {
    // Trước khi logout cần xóa token đã lưu trong cookie
    setCookie("token", "", 1);
    window.location.href = baseUrlXampp + "/index.html";
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