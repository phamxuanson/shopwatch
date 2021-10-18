const token = getCookie("token");
const baseUrlXampp = "http://localhost/shop24h";
const baseUrlApi = "http://localhost:8088";

// hàm get cookie
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
        url: baseUrlApi +"/user/userbyphonenumber/" + token,
        type: 'GET',
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        async: false,
        headers: {
            "Authorization": "Bearer " + token
        },
        success: function (pRes) {
            console.log(pRes);
            getUser.push(pRes);
        },
        error: function (pAjaxContext) {
            console.log(pAjaxContext.responseText);
        }
    });
}
{/* <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right" id="logout">
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
</div> */}
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

$("#btn-logout").on("click", function () {
    redirectToLogin();
});

function redirectToLogin() {
    // Trước khi logout cần xóa token đã lưu trong cookie
    setCookie("token", "", 1);
    window.location.href = baseUrlXampp + "/cart.html";
}

$("#detailcustomer").on("click", function(){
    var data = this.getAttribute("data");
    const detailcustomer = "orderme.html";
    urlSiteToOpen = detailcustomer + "?" +
        "id=" + data;
    window.location.href = urlSiteToOpen;
});

$("#detailorderme").on("click", function(){
    var data = this.getAttribute("data");
    const detailorderme = "orderme.html";
    urlSiteToOpen = detailorderme + "?" +
        "id=" + data;
    window.location.href = urlSiteToOpen;
});

// chuyển string trên localStorage về object để xử lí
var oldItems = JSON.parse(localStorage.getItem('itemsArray')) || [];
//console.log(oldItems);

// Load icon giỏ hàng nếu có --------
// var spanElement = "";
// if (oldItems === null) {
//     spanElement = `<span class="badge bg-danger navbar-badge">0</span>`;
//     $("#cart").append(spanElement).css("color", "rgb(36, 36, 36)");
// } else {
//     spanElement = `<span class="badge bg-danger navbar-badge">${oldItems.length}</span>`;
//     $("#cart").append(spanElement).css("color", "rgb(36, 36, 36)");
// }

// format theo tiền dạng đ
var formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
});

// Load icon giỏ hàng nếu có --------
var oldItems = JSON.parse(localStorage.getItem('itemsArray')) || [];
var spanElement = "";
spanElement = `<span class="badge bg-danger navbar-badge", id="cartSo"">${oldItems.length}</span>`;
$("#cart").append(spanElement);

// hàm load dữ liệu
function loadDataToTable() {
    for (i = 0; i < oldItems.length; i++) {
        var formatter = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        });

        var tr = $("<tr/>");

        var tdImg = $("<td/>");
        var img = $("<img/>", { "class": "image" });
        tdImg.append(img);
        img.prop("src", oldItems[i].product_image);

        var tdProductName = $("<td/>");
        var h5Name = $("<h5/>", { "id": "h5" });
        h5Name.html(oldItems[i].product_name);
        tdProductName.append(h5Name);

        var tdPrice = $("<td/>");
        var h5Price = $("<h5/>", { "id": "h5" });
        h5Price.html(formatter.format(oldItems[i].product_price * oldItems[i].qty_product));

        var tdAdd = $("<td/>");
        var divBtnAdd = $("<div/>", { "class": "buttons_added" });
        var inputMinus = $("<input/>", { "class": "minus is-form pd bamtru", "type": "button", "value": "-", "onClick": `minusQtyInCartById(${oldItems[i].product_id})` });
        var inputArea = $("<input/>", {
            "class": "input-qty", "aria-label": "quantity", "max": "10",
            "min": "1", "name": "", "type": "number", "value": oldItems[i].qty_product
        });
        var inputPlus = $("<input/>", {
            "class": "plus is-form pd", "type": "button", "value": "+",
            "onClick": `plusQtyInCartById(${oldItems[i].product_id})`
        });
        // inputMinus.attr("data", oldItems[i].product_id);
        // inputArea.attr("id", oldItems[i].product_id);
        // inputPlus.attr("data", oldItems[i].product_id);
        divBtnAdd.append(inputMinus, inputArea, inputPlus);
        tdAdd.append(divBtnAdd);

        var btn = $("<i/>", { "class": "btn fas fa-trash-alt trash", "onClick": `deleteInCartById(${oldItems[i].product_id})` });
        var tdDelete = $("<td/>");
        var h3Delete = $("<h3/>", { "class": "bamvao" });
        // h3Delete.attr("data", oldItems[i].product_id);
        h3Delete.append(btn);
        tdDelete.append(h3Delete);

        tr.append(tdImg, tdProductName, tdPrice, tdAdd, tdDelete);

        $("#loadProduct").append(tr);

    }
}
loadDataToTable();

function minusQtyInCartById(paramProductId) {
    console.log("them")
    for (i = 0; i < oldItems.length; i++) {
        if (oldItems[i].product_id == paramProductId) {
            oldItems[i].qty_product = oldItems[i].qty_product - 1;
            saveCart(); // lưu lại giỏ hàng
            // console.log(oldItems[i].qty_product);
            $("#loadProduct").empty();// xóa nội dung bảng để reload lại bảng
            loadDataToTable();           // reload lại bảng
            break;
        }
    }
}

function plusQtyInCartById(paramProductId) {
    for (i = 0; i < oldItems.length; i++) {
        if (oldItems[i].product_id == paramProductId) {
            oldItems[i].qty_product = oldItems[i].qty_product + 1;
            saveCart();
            $("#loadProduct").empty();// xóa nội dung bảng để reload lại bảng
            loadDataToTable();           // reload lại bảng
            break;
        }
    }
}

//cach 2
// $("#loadProduct").on("click",".bamtru", function(){
//     console.log("test");
//     var id = this.getAttribute("data");
//     console.log(id);
//     for (i = 0; i < oldItems.length; i++) {
//         if (oldItems[i].product_id == id) {
//             oldItems[i].qty_product = oldItems[i].qty_product - 1;
//             saveCart();
//             $("#loadProduct").empty();// xóa nội dung bảng để reload lại bảng
//             loadDataToTable();           // reload lại bảng
//             break;
//         }
//     }
// })

function deleteInCartById(paramProductId) {
    for (i = 0; i < oldItems.length; i++) {
        if (oldItems[i].product_id == paramProductId) {
            //chỉ mục bđ từ i, 1 là xóa thằng i
            oldItems.splice(i, 1);

            saveCart(); // lưu lại giỏ hàng
            $("#loadProduct").empty(); // xóa nội dung bảng để reload lại bảng
            removeCart();  // remove session nếu giỏ hàng đã rỗng
            loadDataToTable();  // reload lại bảng
            break;
        }
    }
}

function saveCart() {
    var cartJSON = JSON.stringify(oldItems); // convert sang String dạng JSON lưu lên localstorage
    localStorage.setItem("itemsArray", cartJSON); // Lưu vào giỏ hàng
    // console.log(localStorage.getItem("itemsArray"));
}

function removeCart() {
    if (oldItems.length == 0) {
        localStorage.removeItem("itemsArray");
    }
}