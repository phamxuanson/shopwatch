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
    $("#username").append(getUser[0].username);
}

$("#btn-logout").on("click", function() {
    redirectToLogin();
});

function redirectToLogin() {
    // Trước khi logout cần xóa token đã lưu trong cookie
    setCookie("token", "", 1);
    window.location.href = baseUrlXampp + "/dmsanpham.html";
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

// load ra front end dòng phân trang của all product
function loadPaginationWithAllProduct() {
    $.ajax({
        url: baseUrlApi + "/product/length",
        type: "GET",
        dataType: 'json',
        success: function(res) {
            // trang 1
            var number = { num: 1 }
            var ul = $("#allProduct");
            ul.append("<li class='page-item'><a href='#' class='page-link'>&laquo;</a></li>");
            for (var i = 0; i < res; i++) {
                if (i % 12 == 0) {
                    ul.append("<li class='page-item' data=" + (number.num - 1) + "><a href='#' class='page-link'>" + (number.num++) + "</a></li>");
                }
            }
            ul.append("<li class='page-item'><a href='#' class='page-link'>&raquo;</a></li>");
        },
        error: function(error) {
            console.log(error);
        }
    });
}

// gọi hàm trả ra frontend danh sách sản phẩm theo trang được chọn
responseContent();

$('#allProduct').on('click', '.page-item', function() {
    $("#loadContent").html('');
    $("#allProduct").html('');

    var data = this.getAttribute("data");
    responseContent(data);
});

// hàm trả ra frontend các sản phẩm theo trang được chọn
function responseContent(page = 0) {
    loadPaginationWithAllProduct();
    $.ajax({
        url: baseUrlApi + "/product/pageable/" + page,
        type: "GET",
        dataType: 'json',
        async: false,
        success: function(res) {
            var oldItems = JSON.parse(localStorage.getItem('itemsArray')) || [];
            // Load icon giỏ hàng nếu có --------
            var spanElement = "";
            spanElement = `<span class="badge bg-danger navbar-badge", id="cartSo"">${oldItems.length}</span>`;
            $("#cart").append(spanElement);

            var formatter = new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            });
            for (var i = 0; i < res.length; i++) {
                var divCol = $("<div/>", { "class": "col-sm-4 mt-2 khung-product" });
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

// click vào ảnh chuyển trang chi tiết
$('#loadContent').on('click', '.bamvao', function() {
    console.log("click");
    console.log(this.getAttribute("data"));
    var data = this.getAttribute("data");
    const detailFormURL = "chitietsanpham.html";
    urlSiteToOpen = detailFormURL + "?" +
        "id=" + data;
    window.location.href = urlSiteToOpen;
});

// click vào mua ngay chuyển trang chi tiết
$('#loadContent').on('click', '.anvao', function() {
    console.log("click");
    console.log(this.getAttribute("data"));
    var data = this.getAttribute("data");
    const detailFormURL = "chitietsanpham.html";
    urlSiteToOpen = detailFormURL + "?" +
        "id=" + data;
    window.location.href = urlSiteToOpen;
});

//===================== lọc theo nam và nữ =======================//

var filter = {
    vendor: "aaa",
    price: 0,
    line: 0
};

// sự kiện click lọc product nam
$("#1").on("click", function() {
    resetPaginationProduct();
    $('input[name=price]:checked').prop("checked", false);
    $('input[name=brand]:checked').prop("checked", false);
    filter.vendor = "aaa";
    filter.price = 0;
    filter.line = 1;
    getProductByProductLineId(1);
    loadPaginationByLengthProductLineid(1);
});

//sự kiện click lọc product nữ
$("#2").on("click", function() {
    resetPaginationProduct();
    $('input[name=price]:checked').prop("checked", false);
    $('input[name=brand]:checked').prop("checked", false);
    filter.vendor = "aaa";
    filter.price = 0;
    filter.line = 2;
    getProductByProductLineId(2);
    loadPaginationByLengthProductLineid(2);
});

function resetPaginationProduct() {
    $("#nam").html('');
    $("#nu").html('');
    $("#loadContent").html('');
    $("#allProduct").html('');
    $("#vendor").html('');
    $("#pricedown").html('');
    $("#priceup").html('');
    $("#vendorpricedown").html('');
    $("#vendorpriceup").html('');
    $("#pricedownline").html('');
    $("#priceupline").html('');
    $("#vendorline").html('');
    $("#vendorpricedownline").html('');
    $("#vendorpriceupline").html('');
}

//================================= Get product by productLineId ===================================================================

// load productline id chia trang
function getProductByProductLineId(productLineId, page = 0) {
    $.ajax({
        url: "http://localhost:8088/product/byproductlineid/" + productLineId + "/" + page,
        type: "GET",
        dataType: 'json',
        async: false,
        success: function(res) {
            var formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'VND'
            });
            console.log(res);
            for (var i = 0; i < res.length; i++) {
                var divCol = $("<div/>", { "class": "col-sm-4 mt-2 khung-product" });
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

$('#nam').on('click', '.page-item', function() {
    $("#loadContent").html('');

    var page = this.getAttribute("data");
    getProductByProductLineId(filter.line, page);
});

// load all productlint id
function loadPaginationByLengthProductLineid(productLineId) {
    $.ajax({
        url: baseUrlApi + "/product/lengthproductlineid/" + productLineId,
        type: "GET",
        dataType: 'json',
        success: function(res) {
            var number = { num: 1 }
            var ul = $("#nam");
            ul.append("<li class='page-item'><a href='#' class='page-link'>&laquo;</a></li>");
            for (var i = 0; i < res; i++) {
                if (i % 12 == 0) {
                    ul.append("<li class='page-item' data=" + (number.num - 1) + "><a href='#' class='page-link'>" + (number.num++) + "</a></li>");
                }
            }
            ul.append("<li class='page-item'><a href='#' class='page-link'>&raquo;</a></li>");
        },
        error: function(error) {
            console.log(error);
        }
    });
}

// sự kiện nút lọc product theo giá và theo thương hiệu
$("#filter").on("click", function() {

    resetPaginationProduct();

    var price = $('input[name=price]:checked').prop("id");
    var buyPrice = $('input[name=price]:checked').val();
    var brand = $('input[name=brand]:checked').val();

    // filter by price 0 to price and productLineId
    if (filter.line === 1 && price === "duoi2" && brand === undefined) {
        console.log(filter.line);
        resetPaginationProduct();
        getProductByPriceDownProductLineId(filter.line, buyPrice);
        loadPaginationByLengthPriceDownProductLineid(filter.line, buyPrice);
        filter.price = buyPrice;
    }

    if (filter.line === 2 && price === "duoi2" && brand === undefined) {
        console.log(filter.line);
        resetPaginationProduct();
        getProductByPriceDownProductLineId(filter.line, buyPrice);
        loadPaginationByLengthPriceDownProductLineid(filter.line, buyPrice);
        filter.price = buyPrice;
    }
    //===============================================

    // filter by price to max price and productLineId
    if (filter.line === 1 && price === "tren2" && brand === undefined) {
        resetPaginationProduct();
        getProductByPriceUpProductLineId(filter.line, buyPrice);
        loadPaginationByLengthPriceUpProductLineid(filter.line, buyPrice);
        filter.price = buyPrice;
    }

    if (filter.line === 2 && price === "tren2" && brand === undefined) {
        resetPaginationProduct();
        getProductByPriceUpProductLineId(filter.line, buyPrice);
        loadPaginationByLengthPriceUpProductLineid(filter.line, buyPrice);
        filter.price = buyPrice;
    }
    //===============================================

    // filter by vendor and productLineId
    if (filter.line === 1 && price === undefined && brand !== undefined) {
        resetPaginationProduct();
        getByVendorProductLineId(filter.line, brand);
        loadPaginationByLengthVendorProductLineId(filter.line, brand);
        filter.brand = brand;
    }

    if (filter.line === 2 && price === undefined && brand !== undefined) {
        resetPaginationProduct();
        getByVendorProductLineId(filter.line, brand);
        loadPaginationByLengthVendorProductLineId(filter.line, brand);
        filter.brand = brand;
    }
    //===============================================

    // filter by vendor and productLineId
    if (filter.line === 1 && price === "duoi2" && brand !== undefined) {
        resetPaginationProduct();
        getByPriceDownVendorProductLineId(filter.line, brand, buyPrice);
        loadPaginationByLengthPriceDownVendorProductLineId(filter.line, brand, buyPrice);
        filter.brand = brand;
        filter.price = buyPrice;
    }
    if (filter.line === 1 && price === "tren2" && brand !== undefined) {
        resetPaginationProduct();
        getByPriceUpVendorProductLineId(filter.line, brand, buyPrice);
        loadPaginationByLengthPriceUpVendorProductLineId(filter.line, brand, buyPrice);
        filter.brand = brand;
        filter.price = buyPrice;
    }

    if (filter.line === 2 && price === "duoi2" && brand !== undefined) {
        resetPaginationProduct();
        getByPriceDownVendorProductLineId(filter.line, brand, buyPrice);
        loadPaginationByLengthPriceDownVendorProductLineId(filter.line, brand, buyPrice);
        filter.brand = brand;
        filter.price = buyPrice;
    }
    if (filter.line === 2 && price === "tren2" && brand !== undefined) {
        resetPaginationProduct();
        getByPriceUpVendorProductLineId(filter.line, brand, buyPrice);
        loadPaginationByLengthPriceUpVendorProductLineId(filter.line, brand, buyPrice);
        filter.brand = brand;
        filter.price = buyPrice;
    }

    if (filter.line === 0 && brand !== undefined && price === undefined) {
        resetPaginationProduct();
        getProductByVendor(brand);
        loadPaginationByLengthVendorProduct(brand);
        filter.brand = brand;
    }

    if (filter.line === 0 && price === "duoi2" && brand === undefined) {

        resetPaginationProduct();
        getProductByPriceDown(buyPrice);
        loadPaginationByLengthPriceDown(buyPrice);
        filter.price = buyPrice;
    }
    if (filter.line === 0 && price === "tren2" && brand === undefined) {

        resetPaginationProduct();
        getProductByPriceUp(buyPrice);
        loadPaginationByLengthPriceUp(buyPrice);
        filter.price = buyPrice;
    }

    if (filter.line === 0 && price === "duoi2" && brand !== undefined) {
        console.log("duoi 2 tr + brand :" + brand, buyPrice);
        resetPaginationProduct();
        getProductByVendorAndPriceDown(brand, buyPrice);
        loadPaginationLengthVendorPriceDown(brand, buyPrice);
        filter.price = buyPrice;
        filter.brand = brand;
    }
    if (filter.line === 0 && price === "tren2" && brand !== undefined) {
        resetPaginationProduct();
        console.log("tren 2 tr + brand :" + brand, buyPrice);
        getProductByVendorAndPriceUp(brand, buyPrice);
        loadPaginationByLengthVendorPriceUp(brand, buyPrice);
        filter.price = buyPrice;
        filter.brand = brand;
    }
});

// sự kiện nút bỏ lọc sẽ trả về all product lại
$("#noFilter").on("click", function() {
    $('input[name=price]:checked').prop("checked", false);
    $('input[name=brand]:checked').prop("checked", false);
    filter = {
        vendor: "aaa",
        price: 0,
        line: 0
    };
    const detailFormURL = "dmsanpham.html";
    window.location.href = detailFormURL;
});

//================================= Get product by vendor and productLineId ===========================================================
function getByVendorProductLineId(productLineId, brand, page = 0) {
    $.ajax({
        url: baseUrlApi + "/product/vendorline/" + productLineId + "/" + brand + "/" + page,
        type: "GET",
        dataType: 'json',
        async: false,
        success: function(res) {
            var formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'VND'
            });
            console.log(res);
            for (var i = 0; i < res.length; i++) {
                var divCol = $("<div/>", { "class": "col-sm-4 mt-2 khung-product" });
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

$('#vendorline').on('click', '.page-item', function() {
    $("#loadContent").html('');
    var page = this.getAttribute("data");
    getByVendorProductLineId(filter.line, filter.brand, page);
});

function loadPaginationByLengthVendorProductLineId(productLineId, brand) {
    $.ajax({
        url: baseUrlApi + "/product/lengthvendorline/" + productLineId + "/" + brand,
        type: "GET",
        dataType: 'json',
        success: function(res) {
            var number = { num: 1 }
            var ul = $("#vendorline");
            ul.append("<li class='page-item'><a href='#' class='page-link'>&laquo;</a></li>");
            for (var i = 0; i < res; i++) {
                if (i % 12 == 0) {
                    ul.append("<li class='page-item' data=" + (number.num - 1) + "><a href='#' class='page-link'>" + (number.num++) + "</a></li>");
                }
            }
            ul.append("<li class='page-item'><a href='#' class='page-link'>&raquo;</a></li>");
        },
        error: function(error) {
            console.log(error);
        }
    });
}

//================================= Get product by price from 0 to price and productLineId ==================================================

function getProductByPriceDownProductLineId(productLineId, buyPrice, page = 0) {
    $.ajax({
        url: "http://localhost:8088/product/pricedownline/" + productLineId + "/" + buyPrice + "/" + page,
        type: "GET",
        dataType: 'json',
        async: false,
        success: function(res) {
            var formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'VND'
            });
            console.log(res);
            for (var i = 0; i < res.length; i++) {
                var divCol = $("<div/>", { "class": "col-sm-4 mt-2 khung-product" });
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

$('#pricedownline').on('click', '.page-item', function() {
    $("#loadContent").html('');
    var page = this.getAttribute("data");
    getProductByPriceDownProductLineId(filter.line, filter.price, page);
});

function loadPaginationByLengthPriceDownProductLineid(productLineId, buyPrice) {
    $.ajax({
        url: "http://localhost:8088/product/lengthpricedownline/" + productLineId + "/" + buyPrice,
        type: "GET",
        dataType: 'json',
        success: function(res) {
            var number = { num: 1 }
            var ul = $("#pricedownline");
            ul.append("<li class='page-item'><a href='#' class='page-link'>&laquo;</a></li>");
            for (var i = 0; i < res; i++) {
                if (i % 12 == 0) {
                    ul.append("<li class='page-item' data=" + (number.num - 1) + "><a href='#' class='page-link'>" + (number.num++) + "</a></li>");
                }
            }
            ul.append("<li class='page-item'><a href='#' class='page-link'>&raquo;</a></li>");
        },
        error: function(error) {
            console.log(error);
        }
    });
}

//================================= Get product by price to max price and productLineId ==================================================

function getProductByPriceUpProductLineId(productLineId, buyPrice, page = 0) {
    $.ajax({
        url: "http://localhost:8088/product/priceupline/" + productLineId + "/" + buyPrice + "/" + page,
        type: "GET",
        dataType: 'json',
        async: false,
        success: function(res) {
            var formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'VND'
            });
            console.log(res);
            for (var i = 0; i < res.length; i++) {
                var divCol = $("<div/>", { "class": "col-sm-4 mt-2 khung-product" });
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

$('#priceupline').on('click', '.page-item', function() {
    $("#loadContent").html('');
    var page = this.getAttribute("data");
    getProductByPriceUpProductLineId(filter.line, filter.price, page);
});

function loadPaginationByLengthPriceUpProductLineid(productLineId, buyPrice) {
    $.ajax({
        url: "http://localhost:8088/product/lengthpriceupline/" + productLineId + "/" + buyPrice,
        type: "GET",
        dataType: 'json',
        success: function(res) {
            var number = { num: 1 }
            var ul = $("#priceupline");
            ul.append("<li class='page-item'><a href='#' class='page-link'>&laquo;</a></li>");
            for (var i = 0; i < res; i++) {
                if (i % 12 == 0) {
                    ul.append("<li class='page-item' data=" + (number.num - 1) + "><a href='#' class='page-link'>" + (number.num++) + "</a></li>");
                }
            }
            ul.append("<li class='page-item'><a href='#' class='page-link'>&raquo;</a></li>");
        },
        error: function(error) {
            console.log(error);
        }
    });
}

//================================= Get product by price  to max price , vendor and productLineId ===========================================================
function getByPriceUpVendorProductLineId(productLineId, brand, price, page = 0) {
    $.ajax({
        url: baseUrlApi + "/product/priceupvendorline/" + productLineId + "/" + brand + "/" + price + "/" + page,
        type: "GET",
        dataType: 'json',
        async: false,
        success: function(res) {
            var formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'VND'
            });
            console.log(res);
            for (var i = 0; i < res.length; i++) {
                var divCol = $("<div/>", { "class": "col-sm-4 mt-2 khung-product" });
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

$('#vendorpriceupline').on('click', '.page-item', function() {
    $("#loadContent").html('');
    var page = this.getAttribute("data");
    getByPriceUpVendorProductLineId(filter.line, filter.brand, filter.price, page);
});

function loadPaginationByLengthPriceUpVendorProductLineId(productLineId, brand, price) {
    $.ajax({
        url: baseUrlApi + "/product/lengthpriceupvendorline/" + productLineId + "/" + brand + "/" + price,
        type: "GET",
        dataType: 'json',
        success: function(res) {
            var number = { num: 1 }
            var ul = $("#vendorpriceupline");
            ul.append("<li class='page-item'><a href='#' class='page-link'>&laquo;</a></li>");
            for (var i = 0; i < res; i++) {
                if (i % 12 == 0) {
                    ul.append("<li class='page-item' data=" + (number.num - 1) + "><a href='#' class='page-link'>" + (number.num++) + "</a></li>");
                }
            }
            ul.append("<li class='page-item'><a href='#' class='page-link'>&raquo;</a></li>");
        },
        error: function(error) {
            console.log(error);
        }
    });
}

//================================= Get product by price from 0 to price , vendor and productLineId ===========================================================
function getByPriceDownVendorProductLineId(productLineId, brand, price, page = 0) {
    $.ajax({
        url: baseUrlApi + "/product/pricedownvendorline/" + productLineId + "/" + brand + "/" + price + "/" + page,
        type: "GET",
        dataType: 'json',
        async: false,
        success: function(res) {
            var formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'VND'
            });
            console.log(res);
            for (var i = 0; i < res.length; i++) {
                var divCol = $("<div/>", { "class": "col-sm-4 mt-2 khung-product" });
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

$('#vendorpricedownline').on('click', '.page-item', function() {
    $("#loadContent").html('');
    var page = this.getAttribute("data");
    getByPriceDownVendorProductLineId(filter.line, filter.brand, filter.price, page);
});

function loadPaginationByLengthPriceDownVendorProductLineId(productLineId, brand, price) {
    $.ajax({
        url: baseUrlApi + "/product/lengthpricedownvendorline/" + productLineId + "/" + brand + "/" + price,
        type: "GET",
        dataType: 'json',
        success: function(res) {
            var number = { num: 1 }
            var ul = $("#vendorpricedownline");
            ul.append("<li class='page-item'><a href='#' class='page-link'>&laquo;</a></li>");
            for (var i = 0; i < res; i++) {
                if (i % 12 == 0) {
                    ul.append("<li class='page-item' data=" + (number.num - 1) + "><a href='#' class='page-link'>" + (number.num++) + "</a></li>");
                }
            }
            ul.append("<li class='page-item'><a href='#' class='page-link'>&raquo;</a></li>");
        },
        error: function(error) {
            console.log(error);
        }
    });
}

//================================= Get product by price from 0 to price ==================================================

// hàm trả ra frontend các sản phẩm theo price from 0 to price
function getProductByPriceDown(price, page = 0) {

    $.ajax({
        url: baseUrlApi + "/product/pricedown/" + price + "/" + page,
        type: "GET",
        dataType: 'json',
        async: false,
        success: function(res) {
            var formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'VND'
            });
            for (var i = 0; i < res.length; i++) {
                var divCol = $("<div/>", { "class": "col-sm-4 mt-2 khung-product" });
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
// sự kiện sẽ thay đổi trang của price 0 to price
$('#pricedown').on('click', '.page-item', function() {

    $("#loadContent").html('');
    //$("#price").html('');

    var page = this.getAttribute("data");
    getProductByPriceDown(filter.price, page);
    //loadPaginationByLengthPriceDown(filter.price);
});

// get length list product by price 0 to price
function loadPaginationByLengthPriceDown(price) {
    $.ajax({
        url: baseUrlApi + "/product/lengthpricedown/" + price,
        type: "GET",
        dataType: 'json',
        success: function(res) {
            var number = { num: 1 }
            var ul = $("#pricedown");
            ul.append("<li class='page-item'><a href='#' class='page-link'>&laquo;</a></li>");
            for (var i = 0; i < res; i++) {
                if (i % 12 == 0) {
                    ul.append("<li class='page-item' data=" + (number.num - 1) + "><a href='#' class='page-link'>" + (number.num++) + "</a></li>");
                }
            }
            ul.append("<li class='page-item'><a href='#' class='page-link'>&raquo;</a></li>");
        },
        error: function(error) {
            console.log(error);
        }
    });
}

//================================= Get product by price from price to max ==================================================

// hàm trả ra frontend các sản phẩm theo price from price to max
function getProductByPriceUp(price, page = 0) {

    $.ajax({
        url: baseUrlApi + "/product/priceup/" + price + "/" + page,
        type: "GET",
        dataType: 'json',
        async: false,
        success: function(res) {
            var formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'VND'
            });
            console.log(res);
            for (var i = 0; i < res.length; i++) {
                var divCol = $("<div/>", { "class": "col-sm-4 mt-2 khung-product" });
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
// sự kiện sẽ thay đổi trang của price from price to max
$('#priceup').on('click', '.page-item', function() {

    $("#loadContent").html('');

    var page = this.getAttribute("data");
    getProductByPriceUp(filter.price, page);
});

// get length list product by price from price to max
function loadPaginationByLengthPriceUp(price) {
    $.ajax({
        url: baseUrlApi + "/product/lengthpriceup/" + price,
        type: "GET",
        dataType: 'json',
        success: function(res) {
            var number = { num: 1 }
            var ul = $("#priceup");
            ul.append("<li class='page-item'><a href='#' class='page-link'>&laquo;</a></li>");
            for (var i = 0; i < res; i++) {
                if (i % 12 == 0) {
                    ul.append("<li class='page-item' data=" + (number.num - 1) + "><a href='#' class='page-link'>" + (number.num++) + "</a></li>");
                }
            }
            ul.append("<li class='page-item'><a href='#' class='page-link'>&raquo;</a></li>");
        },
        error: function(error) {
            console.log(error);
        }
    });
}

//================================= Get product by vendor and price from price to max ==================================================
// hàm trả ra frontend các sản phẩm theo vendor and price from price to max
function getProductByVendorAndPriceUp(brand, price, page = 0) {

    $.ajax({
        url: baseUrlApi + "/product/vendorpriceup/" + brand + "/" + price + "/" + page,
        type: "GET",
        dataType: 'json',
        async: false,
        success: function(res) {
            var formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'VND'
            });
            console.log(res);
            for (var i = 0; i < res.length; i++) {
                var divCol = $("<div/>", { "class": "col-sm-4 mt-2 khung-product" });
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
// sự kiện sẽ thay đổi trang theo vendor and price from price to max
$('#vendorpriceup').on('click', '.page-item', function() {
    $("#loadContent").html('');

    var page = this.getAttribute("data");
    getProductByVendorAndPriceUp(filter.brand, filter.price, page);
});

// get length list product by vendor and price from price to max
function loadPaginationByLengthVendorPriceUp(brand, price) {
    $.ajax({
        url: baseUrlApi + "/product/lengthvendorpriceup/" + brand + "/" + price,
        type: "GET",
        dataType: 'json',
        success: function(res) {
            var number = { num: 1 }
            var ul = $("#vendorpriceup");
            ul.append("<li class='page-item'><a href='#' class='page-link'>&laquo;</a></li>");
            for (var i = 0; i < res; i++) {
                if (i % 12 == 0) {
                    ul.append("<li class='page-item' data=" + (number.num - 1) + "><a href='#' class='page-link'>" + (number.num++) + "</a></li>");
                }
            }
            ul.append("<li class='page-item'><a href='#' class='page-link'>&raquo;</a></li>");
        },
        error: function(error) {
            console.log(error);
        }
    });
}

//================================= Get product by vendor and price from 0 to price =====================================================
// hàm trả ra frontend các sản phẩm theo vendor and price from price to max
function getProductByVendorAndPriceDown(brand, price, page = 0) {

    $.ajax({
        url: baseUrlApi + "/product/vendorpricedown/" + brand + "/" + price + "/" + page,
        type: "GET",
        dataType: 'json',
        async: false,
        success: function(res) {
            var formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'VND'
            });
            console.log(res);
            for (var i = 0; i < res.length; i++) {
                var divCol = $("<div/>", { "class": "col-sm-4 mt-2 khung-product" });
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
// sự kiện sẽ thay đổi trang theo vendor and price from price to max
$('#vendorpricedown').on('click', '.page-item', function() {
    $("#loadContent").html('');

    var page = this.getAttribute("data");
    getProductByVendorAndPriceDown(filter.brand, filter.price, page);
});

// get length list product by vendor and price from price to max
function loadPaginationLengthVendorPriceDown(brand, price) {
    $.ajax({
        url: baseUrlApi + "/product/lengthvendorpricedown/" + brand + "/" + price,
        type: "GET",
        dataType: 'json',
        success: function(res) {
            var number = { num: 1 }
            var ul = $("#vendorpricedown");
            ul.append("<li class='page-item'><a href='#' class='page-link'>&laquo;</a></li>");
            for (var i = 0; i < res; i++) {
                if (i % 12 == 0) {
                    ul.append("<li class='page-item' data=" + (number.num - 1) + "><a href='#' class='page-link'>" + (number.num++) + "</a></li>");
                }
            }
            ul.append("<li class='page-item'><a href='#' class='page-link'>&raquo;</a></li>");
        },
        error: function(error) {
            console.log(error);
        }
    });
}