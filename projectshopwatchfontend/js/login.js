$(document).ready(function () {
    //----Phần này làm sau khi đã làm trang info.js
    //Kiểm tra token nếu có token tức người dùng đã đăng nhập
    const token = getCookie("token");
    var user = [];
    // if (token) {
    //     window.location.href = "http://localhost/pizza365/index.html";
    // }
    //----Phần này làm sau khi đã làm trang info.js

    //Sự kiện bấm nút login
    $("#btn-login").on("click", function () {
        var username = $("#username-login").val().trim();
        var password = $("#password-login").val().trim();
        
        if (validateForm(username, password)) {
            signinForm(username, password);
        }
    });

    function signinForm(username, password) {
        $.ajax({
            url: "http://localhost:8088/user/userbyusername/" + username +"/"+ password,
            type: 'GET',
            async: "false",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (res) {
                console.log(res);
                if(res.username  !== "" && res.level === "customer") {
                    console.log("a");
                    // loadSuccessCustomer();
                    setTimeout(() => {
                        responseCustomerPage(res.phoneNumber);
                    }, 1500);
                }
                if(res.username  !== "" && res.level === "admin") {
                    console.log("admin");
                    // loadSuccesAdmin();
                    setTimeout(() => {
                        responseAdminPage(res.phoneNumber);
                    }, 1500);
                }
                
            },
            error: function (res) {
                console.log(res.responseText);
                alert("Tên đăng nhập hoặc mật khẩu chưa đúng !!!")
            }
        });
    }
    
    //Xử lý object trả về khi login thành công
    function responseCustomerPage(data) {
        //Lưu token vào cookie trong 1 ngày
        setCookie("token", data, 1);
        window.location.href = "http://localhost/shop24h/index.html";

    }

    function responseAdminPage(data) {
        //Lưu token vào cookie trong 1 ngày
        setCookie("token", data, 1);
        window.location.href = "http://localhost/shop24h/admin/customer.html";

    }
    function loadSuccessCustomer() {
        $(document).Toasts('create', {
            class: 'bg-success',
            title: 'Toast Title',
            subtitle: 'Subtitle',
            body: 'Đăng nhập thành công, sẽ qua trang shop trong 2s !!.'
        })
    }

    function loadSuccesAdmin() {
        $(document).Toasts('create', {
            class: 'bg-success',
            title: 'Toast Title',
            subtitle: 'Subtitle',
            body: 'Đăng nhập thành công, sẽ qua trang admin trong 2s !!.'
        })
    }

    //Hàm setCookie đã giới thiệu ở bài trước
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    //Hiển thị lỗi lên form 
    function showError(message) {
        var errorElement = $("#error");

        errorElement.html(message);
        errorElement.addClass("d-block");
        errorElement.addClass("d-none");
    }

    //Validate dữ liệu từ form
    function validateForm(username, password) {
        if (username === "") {
            alert("bạn chưa nhập username");
            return false;
        };

        if (password === "") {
            alert("Password bạn chưa nhập password");
            return false;
        }

        return true;
    }


    //Hàm get Cookie đã giới thiệu ở bài trước
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
});