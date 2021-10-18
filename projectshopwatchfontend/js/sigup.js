$(document).ready(function () {
    function validate() {
        var firstname = $("#firstname").val().trim();
        var lastname = $("#lastname").val().trim();
        var email = $("#email").val().trim();
        var phone = $("#phone").val().trim();
        var city = $("#citySelect").val().trim();
        var state = $("#stateSelect").val().trim();
        var address = $("#address").val().trim();
        var username = $("#username").val().trim();
        var password = $("#password").val().trim();
        var cfmpassword = $("#cfmpassword").val().trim();

        var check = false;

        if (firstname === "" && lastname === "") {
            alert("bạn chưa nhập tên hoặc họ");
            return check;
        }
        if (phone === "" ) {
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

        if (password === "") {
            alert("bạn chưa nhập password");
            return check;
        }
        if (cfmpassword != password) {
            alert("mật khẩu không khớp nhau");
            return check;
        }

        check = true;
        return check;
    }
    var gToken = "";

    $("#btn-signup").on("click", signupClient);
    function signupClient() {
        var firstname = $("#firstname").val().trim();
        var lastname = $("#lastname").val().trim();
        var email = $("#email").val().trim();
        var phone = $("#phone").val().trim();
        var city = $("#citySelect option:selected").text();
        var state = $("#stateSelect option:selected").text();
        var address = $("#address").val().trim();
        var username = $("#username").val().trim();
        var password = $("#password").val().trim();
        var cfmpassword = $("#cfmpassword").val().trim();


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
                "password": password,
                "phoneNumber": phone,
                "level": "customer"
            }
            signUpUserServer(user, customer);
        }
    }

    // Hàm validate email bằng regex
    function validateEmail(email) {
        const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(String(email).toLowerCase());
    }

    function signUpUserServer(userData, customerData) {
        $.ajax({
            url: "http://localhost:8088/user",
            type: 'POST',
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            async: false,
            data: JSON.stringify(userData),          
            success: function (res) {
                console.log(res);
                gToken = res.phone_number;
                if (gToken !== "") {
                    createCustomer(customerData, res.id);
                    setTimeout(reponseSignup, 3000);
                }

            },
            error: function (res) {
                console.log(res);
            }
        });
    }
    function createCustomer(customerData, userId) {
        $.ajax({
            url: "http://localhost:8088/customer/createbyuserid/" + userId,
            type: 'POST',
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            async: false,
            data: JSON.stringify(customerData),           
            success: function (res) {
                console.log(res);
                loadSuccess();
            },
            error: function (res) {
                console.log(res);
            }
        });
    }


    function reponseSignup() {
        window.location.href = "http://localhost/shop24h/login.html";
    }

    function loadSuccess() {
        $(document).Toasts('create', {
            class: 'bg-success',
            title: 'Toast Title',
            subtitle: 'Subtitle',
            body: 'Bạn đã tạo tài khoản thành công, sẽ chuyển sang đăng nhập trong 3s !!.'
        })
    }

    $('#password, #cfmpassword').on('keyup', function () {
        if ($('#password').val() == $('#cfmpassword').val()) {
            $('#message').html('Matching').css('color', 'green');
        } else
            $('#message').html('Not Matching').css('color', 'red');
    });
});
