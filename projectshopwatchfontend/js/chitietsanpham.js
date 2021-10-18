const token = getCookie("token");
const baseUrlApi = "http://localhost:8088";
const baseUrlXampp = "http://localhost/shop24h";

// get cookie
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
    console.log(getUser);
    $("#username").append(getUser[0].username);
}

$("#btn-logout").on("click", function() {
    redirectToLogin();
});

function redirectToLogin() {
    // Trước khi logout cần xóa token đã lưu trong cookie
    setCookie("token", "", 1);
    window.location.href = baseUrlXampp + "/chitietsanpham.html";
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


// gọi api load 8 sản phẩm bên dưới phần chi tiết
$.ajax({
    url: baseUrlApi + "/product/limit8",
    type: "GET",
    dataType: 'json',
    async: false,
    success: function(res) {
        var formatter = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        });
        console.log(res);
        for (var i = 0; i < res.length; i++) {
            var divCol = $("<div/>", { "class": "col-sm-3 mt-2 khung-product" });
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

// click ảnh chuyển trang chi tiết sản phẩm đó
$('#loadContent').on('click', '.bamvao', function() {
    console.log("click");
    console.log(this.getAttribute("data"));
    var data = this.getAttribute("data");
    const detailFormURL = "chitietsanpham.html";
    urlSiteToOpen = detailFormURL + "?" +
        "id=" + data;
    window.location.href = urlSiteToOpen;
});

// click mua ngay chuyển trang chi tiết sản phẩm đó
$('#loadContent').on('click', '.anvao', function() {
    console.log("click");
    console.log(this.getAttribute("data"));
    var data = this.getAttribute("data");
    const detailFormURL = "chitietsanpham.html";
    urlSiteToOpen = detailFormURL + "?" +
        "id=" + data;
    window.location.href = urlSiteToOpen;
});

//đường đẫn gọi đến  đến trang
var urlString = window.location.href;
console.log(urlString);
var url = new URL(urlString);

//get a parameter
var productId = url.searchParams.get("id");
console.log(productId);

// $.ajax({
//     url: baseUrlApi + "/product/details/" + productId,
//     type: "GET",
//     // dataType: 'json',
//     data: 'json',
//     async: false,
//     success: function (res) {
//         var formatter = new Intl.NumberFormat('en-US', {
//             style: 'currency',
//             currency: 'VND'
//         });
//         console.log(res);

//         $("#productCode").html(res.productCode);
//         $("#productVendor").html(res.productVendor);
//         $("#productImage").prop("src", baseUrlXampp + res.productImage);
//         $("#productName").html(res.productName);
//         $("#product-desc").html(res.productDescription);
//         $("#price").html(formatter.format(res.buyPrice));

//     },
//     error: function (error) {
//         console.log(error);

//     }
// });

// hàm gọi chi tiết 1 sản phẩm được chọn
var settings = {
    "url": baseUrlApi + "/product/details/" + productId,
    "method": "GET",
    "timeout": 0,
};

$.ajax(settings).done(function(res) {
    console.log(res);
    loadLocal = res;
    var formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    });
    console.log(res);

    // gán vào html
    $("#productCode").html(res.productCode);
    $("#productVendor").html(res.productVendor);
    $("#productImage").prop("src", res.productImage);
    $("#productName").html(res.productName);
    $("#product-desc").html(res.productDescription);
    $("#price").html(formatter.format(res.buyPrice));

    // Load icon giỏ hàng nếu có --------
    var oldItems = JSON.parse(localStorage.getItem('itemsArray')) || [];
    var spanElement = "";
    spanElement = `<span class="badge bg-danger navbar-badge", id="cartSo"">${oldItems.length}</span>`;
    $("#cart").append(spanElement);

});

var loadLocal = null;
// hàm click nút thêm vào giỏ hàng
$("#addtocard").on("click", function() {
    // tạo localstorage chuyển string thành object để xử lí 
    var oldItems = JSON.parse(localStorage.getItem('itemsArray')) || [];

    var checkExist = false;
    for (i = 0; i < oldItems.length; i++) {
        if (productId == oldItems[i].product_id) {
            oldItems[i].qty_product++;

            checkExist = true;
        }
    }
    if (checkExist == false) {
        var newItem = {
            'product_name': loadLocal.productName,
            'product_image': loadLocal.productImage,
            'product_price': loadLocal.buyPrice,
            'product_id': loadLocal.id,
            'qty_product': 1
        };
        console.log(newItem);

        oldItems.push(newItem);
    }
    // Load icon giỏ hàng nếu có --------
    var spanElement = "";
    spanElement = `<span class="badge bg-danger navbar-badge", id="cartSo"">${oldItems.length}</span>`;
    $("#cart").append(spanElement);

    // chuyển object thành chuỗi để lưu object đã xử lí lưu trên localstorage
    localStorage.setItem('itemsArray', JSON.stringify(oldItems));

});

// load rate
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

var getCookies = function() {
    var pairs = document.cookie.split(";");
    var cookies = [];
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split("=");
        cookies[(pair[0] + '').trim()] = unescape(pair.slice(1).join('='));
    }
    return cookies;
}

var listScore = [];

var listRate = [
    `<span class="fa fa-star checked"></span>
    <span class="fa fa-star "></span>
    <span class="fa fa-star "></span>
    <span class="fa fa-star"></span>
    <span class="fa fa-star"></span>
    `,
    `<span class="fa fa-star checked"></span>
    <span class="fa fa-star checked"></span>
    <span class="fa fa-star "></span>
    <span class="fa fa-star"></span>
    <span class="fa fa-star"></span>
    `,
    `<span class="fa fa-star checked"></span>
    <span class="fa fa-star checked"></span>
    <span class="fa fa-star checked"></span>
    <span class="fa fa-star"></span>
    <span class="fa fa-star"></span>
    `,
    `<span class="fa fa-star checked"></span>
    <span class="fa fa-star checked"></span>
    <span class="fa fa-star checked"></span>
    <span class="fa fa-star checked"></span>
    <span class="fa fa-star"></span>
    `,
    `<span class="fa fa-star checked"></span>
    <span class="fa fa-star checked"></span>
    <span class="fa fa-star checked"></span>
    <span class="fa fa-star checked"></span>
    <span class="fa fa-star checked"></span>
    `,
]

$.ajax({
    url: baseUrlApi + "/rate/listratebyproductid/" + productId,
    type: "GET",
    dataType: 'json',
    async: false,
    success: function(res) {
        console.log(res);

        for (let index = 0; index < res.length; index++) {
            const element = res[index];
            console.log(element);
            listScore.push(element.rateScore);

            var hr = $("<hr/>", { "class": "ml-4 mr-4" });
            var divBody = $("<div/>", { "class": "card-body" });

            var h5Name = $("<h5/>", { "class": "card-title" });
            // h5Name.html(element.orderdetails.order.customer.firstName);
            h5Name.html(element.customer.firstName + " " + element.customer.lastName);

            var divRate = $("<div/>", { "class": "rate card-text" });
            if (element.rateScore == 1) {
                divRate.append(listRate[0]);
            }
            if (element.rateScore == 2) {
                divRate.append(listRate[1]);
            }
            if (element.rateScore == 3) {
                divRate.append(listRate[2]);
            }
            if (element.rateScore == 4) {
                divRate.append(listRate[3]);
            }
            if (element.rateScore == 5) {
                divRate.append(listRate[4]);
            }
            var pComment = $("<p/>", { "class": "card-text" });
            pComment.text(element.comments);


            var pDate = $("<p/>", { "class": "card-text" });
            var smallDate = $("<small/>", { "class": "text-muted" });
            smallDate.text(element.updateDate);
            pDate.append(smallDate);
            if (index >= 1) {
                divBody.append(hr, h5Name, divRate, pComment, pDate);
                $("#loadRate").append(divBody);
            } else if (index <= 1) {
                divBody.append(h5Name, divRate, pComment, pDate);
                $("#loadRate").append(divBody);
            }


        }

    },
    error: function(error) {
        console.log(error);

    }
});

var sum = listScore.reduce(function(a, b) {
    return a + b;
}, 0);

const rateScore = sum / listScore.length;

$("input[name='rating'][value='" + rateScore + "']").attr('checked', 'checked');
$("#rateLength").html(listScore.length + " Đánh giá");