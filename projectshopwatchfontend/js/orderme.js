var oldItems = JSON.parse(localStorage.getItem('itemsArray')) || [];
console.log(oldItems);

// Load icon giỏ hàng nếu có --------
var spanElement = "";
spanElement = `<span class="badge bg-danger navbar-badge", id="cartSo"">${oldItems.length}</span>`;
$("#cart").append(spanElement);

//===========================================login and logout==================================================
const token = getCookie("token");

const baseUrlApi = "http://localhost:8088";
const baseUrlXampp = "http://localhost/shop24h";

// if (token === "") {
//     window.location.href = baseUrlXampp + "/login.html";
// }

var customer = {
    "id": 0
};

var listOrderDetailId = [];

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
            getRateByCustomerId(pRes.customer.id);
            loadProductBought(pRes.customer.id);

        },
        error: function(pAjaxContext) {
            console.log(pAjaxContext);
        }
    });
}

function getRateByCustomerId(customerId) {
    $.ajax({
        url: baseUrlApi + "/rate/listratebycustomerid/" + customerId,
        type: "GET",
        dataType: 'json',
        async: false,
        success: function(res) {
            console.log(res);
            for (let index = 0; index < res.length; index++) {
                const element = res[index];
                console.log(element);
                listOrderDetailId.push(element.orderdetails.id);
            }
        },
        error: function(res) {
            console.log(res);
        }
    });
}


if (token) {
    console.log("vooo");
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
    window.location.href = baseUrlXampp + "/orderme.html";
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


function reponseCustomerInfo() {
    console.log(getUser);
    $("#input-usernameinfo").val(getUser[0].username);
    $("#input-teninfo").val(getUser[0].customer.firstName);
    $("#input-hoinfo").val(getUser[0].customer.lastName);
    $("#input-emailinfo").val(getUser[0].customer.email);
    $("#input-emailinfo").val(getUser[0].customer.email);
    $("#input-phoneinfo").val(getUser[0].customer.phoneNumber);
    $("#citySelect option:selected").text(getUser[0].customer.city);
    $("#stateSelect option:selected").text(getUser[0].customer.state);
    $("#input-addressinfo").val(getUser[0].customer.address);

}

var urlString = window.location.href; //đường đẫn gọi đến  đến trang
console.log(urlString);
var url = new URL(urlString);

//get a parameter
var pageId = url.searchParams.get("id");
console.log(pageId);


if (pageId == 1) {
    $("#productlist").prop("class", "row hide");
    $("#infocustomer").prop("class", "row");
    reponseCustomerInfo();
} else {
    $("#infocustomer").prop("class", "row hide");
    $("#productlist").prop("class", "row");
}

$("#o1").on("click", function() {
    console.log("data");
    $("#productlist").prop("class", "row hide");
    $("#infocustomer").prop("class", "row");
    reponseCustomerInfo();
});

$("#o2").on("click", function() {
    console.log("data");
    $("#infocustomer").prop("class", "row hide");
    $("#productlist").prop("class", "row");
    loadProductBought(getUser[0].customer.id);
});

$("#btn-saveinfo").on("click", function() {
    customerId = getUser[0].customer.id;
    userId = getUser[0].id;
    console.log(customerId, userId);

    var firstname = $("#input-teninfo").val().trim();
    var lastname = $("#input-hoinfo").val().trim();
    var email = $("#input-emailinfo").val().trim();
    var phone = $("#input-phoneinfo").val().trim();
    var city = $("#citySelect").val().trim();
    var state = $("#stateSelect").val().trim();
    var address = $("#input-addressinfo").val().trim();
    var username = $("#input-usernameinfo").val().trim();

    if (validate()) {
        var customer = {
            "firstName": firstname,
            "lastName": lastname,
            "phoneNumber": phone,
            "address": address,
            "email": email,
            "city": city,
            "state": state
        }
        var user = {
            "username": username,
            "phoneNumber": phone,
        }
        console.log(customer, user);

        $.ajax({
            url: baseUrlApi + "/customers/" + customerId,
            type: 'PUT',
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify(customer),
            dataType: 'json',
            async: false,
            success: function(res) {
                console.log(res);
            },
            error: function(ajaxContext) {
                alert(ajaxContext.responseText);
            }

        });

        $.ajax({
            url: baseUrlApi + "/user/" + userId,
            type: 'PUT',
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify(user),
            dataType: 'json',
            async: false,
            success: function(res) {
                console.log(res);
            },
            error: function(ajaxContext) {
                alert(ajaxContext.responseText);
            }

        });

        window.location.href = baseUrlXampp + "/orderme.html?id=1";
    }
});

function validate() {
    var firstname = $("#input-teninfo").val().trim();
    var lastname = $("#input-hoinfo").val().trim();
    var email = $("#input-emailinfo").val().trim();
    var phone = $("#input-phoneinfo").val().trim();
    var city = $("#citySelect").val().trim();
    var state = $("#stateSelect").val().trim();
    var address = $("#input-addressinfo").val().trim();
    var username = $("#input-usernameinfo").val().trim();


    var check = false;

    if (firstname === "" && lastname === "") {
        alert("bạn chưa nhập tên hoặc họ");
        return check;
    }
    if (phone === "") {
        alert("bạn chưa nhập phone");
        return check;
    }
    if (email === "" && !validateEmail(email)) {
        alert("bạn chưa nhập email hoặc email chưa phù hợp");
        return check;
    }
    if (city === "" && state === "") {
        alert("bạn chưa chọn thành phố hoặc quận huyện");
        return check;
    }
    if (address === "") {
        alert("bạn chưa nhập địa chỉ");
        return check;
    }
    if (username === "") {
        alert("bạn chưa nhập tên đăng nhập");
        return check;
    }

    check = true;
    return check;
}

// Hàm validate email bằng regex
function validateEmail(email) {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
}

//================================= load đơn hàng ==============================================================

// load đơn hàng của khách hàng ra front-end
function loadProductBought(customerId) {
    console.log(listOrderDetailId);
    var totalMoney = {
        sum: 0
    };

    $.ajax({
        url: baseUrlApi + "/order/listorderbycustomerid/" + customerId,
        type: "GET",
        dataType: 'json',
        async: false,
        success: function(res) {
            var formatter = new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            });
            console.log(res);
            if (res.length == 0) {
                console.log("khonog cos");
                $("#productlist").append(`
                <div class="card text-center mt-5">
                    <div class="card-body text-center">        
                        <h5 class="card-title"></h5>   
                        <p class="card-text fs-5">Bạn chưa mua sản phẩm nào, hãy mua một món nhé</p>
                        <a href="dmsanpham.html" class="btn btn-primary">Tới trang mua hàng</a>
                    </div>
                </div>
                `);
            } else {
                const filterArray = arr => {
                    const listOrderId = new Set(res.map(item => item.orderid));
                    const listOrderIdArr = [...listOrderId];

                    const result = listOrderIdArr.map(order => {
                        return {
                            order: res.filter(item => item.orderid === order),
                        };
                    });

                    return result;
                };
                const listOrder = filterArray(res);

                for (let index = 0; index < listOrder.length; index++) {
                    const orderObject = listOrder[index];
                    var orderValue = orderObject.order;

                    var divCardHeader = $("<div/>", { "class": "card-header" });
                    pTotal = $("<p/>", { "class": "card-text float-right" });
                    divCardHeader.html("order id: " + orderValue[0].orderid + " ----- Số lượng: " + orderValue.length);

                    divCardHeader.append(pTotal);
                    var divCardmb3 = $("<div/>", { "class": "card mb-3", "style": "max-width: 540px;" });
                    var hr = $("<hr/>");
                    divCardmb3.append(divCardHeader);
                    for (let index = 0; index < orderValue.length; index++) {
                        const orderChild = orderValue[index];
                        totalMoney.sum += orderChild.price;

                        var divCardRowg0 = $("<div/>", { "class": "row g-0" });
                        var divColmd4img = $("<div/>", { "class": "col-md-4" });

                        var aBtnReBuy = $("<a/>", { "class": "btn btn-danger text-white float-right btnrebuy" });
                        var img = $("<img/>", { "class": "image img-fluid rounded-start float-left" });


                        aBtnReBuy.html("Mua lần nữa");
                        aBtnReBuy.attr("productid", orderChild.productid);
                        aBtnReBuy.attr("orderdetailid", orderChild.orderdetailid);
                        aBtnReBuy.attr("customerid", orderChild.customerid);
                        aBtnReBuy.prop("id", orderChild.productid);

                        if (listOrderDetailId.includes(orderChild.orderdetailid)) {
                            var aBtnRating = $("<a/>", { "class": "btn btn-light text-dark float-right ml-3 btnrated" });
                            aBtnRating.html("Xem đánh giá");
                            aBtnRating.attr("ratecheck", 1);
                            aBtnRating.attr("productid", orderChild.productid);
                            aBtnRating.attr("orderdetailid", orderChild.orderdetailid);
                            aBtnRating.attr("customerid", orderChild.customerid);
                            aBtnRating.prop("id", orderChild.productid);
                        }
                        if (!listOrderDetailId.includes(orderChild.orderdetailid)) {
                            var aBtnRating = $("<a/>", { "class": "btn btn-primary text-white float-right ml-3 btnrating" });
                            aBtnRating.html("Đánh giá");
                            aBtnRating.attr("ratecheck", 0);
                            aBtnRating.attr("productid", orderChild.productid);
                            aBtnRating.attr("orderdetailid", orderChild.orderdetailid);
                            aBtnRating.attr("customerid", orderChild.customerid);
                            aBtnRating.prop("id", orderChild.productid);
                        }



                        aBtnReBuy.attr("data", orderChild.productid);
                        aBtnReBuy.prop("id", "btnrebuy");

                        divColmd8 = $("<div/>", { "class": "col-md-8" });
                        divBody = $("<div/>", { "class": "card-body" });
                        h5productName = $("<h5/>", { "class": "card-title" });
                        pQuantity = $("<p/>", { "class": "card-text" });
                        pPrice = $("<p/>", { "class": "card-text" });


                        img.prop("src", orderChild.productimage);
                        divColmd4img.append(img);


                        h5productName.html(orderChild.productname);
                        pQuantity.html("x" + orderChild.quantityorder);
                        pPrice.html(formatter.format(orderChild.price));

                        divBody.append(h5productName, pQuantity, pPrice, aBtnRating, aBtnReBuy);
                        divColmd8.append(divBody);

                        divCardRowg0.append(divColmd4img, divColmd8);
                        divCardmb3.append(hr, divCardRowg0);
                    }
                    pTotal.html("Tổng Tiền: " + formatter.format(totalMoney.sum))
                    $("#productlist").append(divCardmb3);
                    totalMoney.sum = 0;
                }

            }
        },
        error: function(error) {
            console.log(error);

        }
    });
}

//========================================== rating ================================================

var rate = {
    "productid": 0,
    "customerid": 0,
    "orderdetailid": 0
};

$('#productlist').on('click', '.btnrating', function() {
    $('#ratingmodal').modal('show');

    var productId = this.getAttribute("productid");
    var customerId = this.getAttribute("customerid");
    var orderdetailId = this.getAttribute("orderdetailid");

    rate.productid = productId;
    rate.customerid = customerId;
    rate.orderdetailid = orderdetailId;


    console.log(productId);
    // console.log(customerId);
    // console.log(orderdetailId);
    $.ajax({
        url: baseUrlApi + "/product/details/" + productId,
        type: "GET",
        dataType: 'json',
        async: false,
        success: function(res) {
            console.log(res);
            // $("#imgRating").prop("src", "." + res.productImage);
            $("#productNameRating").html(res.productName);
        },
        error: function(error) {
            console.log(error);
        }
    });

});


$('#productlist').on('click', '.btnrated', function() {
    var rateCheck = this.getAttribute("ratecheck");
    if (rateCheck == 1) {
        $('#ratedmodal').modal('show');
        var productId = this.getAttribute("productid");
        var orderdetailId = this.getAttribute("orderdetailid");
        console.log(orderdetailId);
        console.log(productId);
        $("#fixrate").attr("productid", productId);
        $.ajax({
            url: baseUrlApi + "/rate/ratebyorderdetailId/" + orderdetailId,
            type: "GET",
            dataType: 'json',
            async: false,
            success: function(res) {
                console.log(res);
                $("#fixrate").attr("rateid", res.id);

                $("input[name='rated'][value='" + res.rateScore + "']").attr('checked', 'checked');

                $("#commentRated").html(res.comments);
                $("#customerName").html(res.customer.firstName + " " + res.customer.lastName);
                // 
            },
            error: function(error) {
                console.log(error);
            }
        });

        $.ajax({
            url: baseUrlApi + "/product/details/" + productId,
            type: "GET",
            dataType: 'json',
            async: false,
            success: function(res) {
                // $("#imgRated").prop("src", res.productImage);
                $("#productNameRated").html(res.productName);
            },
            error: function(error) {
                console.log(error);
            }
        });
    }
});


$("#close1").on("click", function() {
    $('#ratingmodal').modal('hide');
});

$("#close").on("click", function() {
    $('#ratingmodal').modal('hide');
});


$("#ok").on("click", function() {
    $('#ratedmodal').modal('hide');
    $("input[name='rated']").attr('checked', false);
});

$("#saveRating").on("click", function() {
    console.log($("#scores").html());
    var scoreRate = $("#scores").html();
    var commentRating = $("#commentRating").val();

    var rateObject = {
        rateScore: scoreRate,
        comments: commentRating
    }
    if (scoreRate == 0 && commentRating === "") {
        alert("bạn chưa đánh giá sản phẩm!!!");
    } else {
        // console.log(rate);
        // console.log(scoreRate, commentRating);
        createRate(rateObject, rate.orderdetailid, rate.productid, rate.customerid);
        window.location.href = "orderme.html";
    }
});

function createRate(rateObject, orderdetailId, productId, customerId) {
    $.ajax({
        url: baseUrlApi + "/rate/create/" + orderdetailId + "/" + productId + "/" + customerId,
        type: 'POST',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(rateObject),
        dataType: 'json',
        async: false,
        success: function(res) {
            console.log(res);
        },
        error: function(res) {
            alert(res);
        }
    });
}


$(document).ready(function() {

    $("input[type='radio']").click(function() {
        var sim = $("input[type='radio']:checked").val();
        //alert(sim);
        if (sim < 3) {
            $('.myratings').css('color', 'red');
            $(".myratings").text(sim);
        } else {
            $('.myratings').css('color', 'green');
            $(".myratings").text(sim);
        }
    });
});
//=================================================================================================

// sự kiện khi bấm vào sẽ vào trang mua lại

$('#productlist').on('click', '.btnrebuy', function() {


    var productId = this.getAttribute("productid");


    console.log("click", productId);

    const detailFormURL = "chitietsanpham.html";
    urlSiteToOpen = detailFormURL + "?" +
        "id=" + productId;
    window.location.href = urlSiteToOpen;
});