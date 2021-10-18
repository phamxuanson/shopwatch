const token = getCookie("token");
const baseUrlApi = "http://localhost:8088";
const baseUrlXampp = "http://localhost/shop24h";

// xử lí khi không phải admin
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

var lCustomer = [];
var lTotalMoney = [];

var lCustomerLoad = [];
var lTotalMoneyLoad = [];
var listLink = [
    "http://localhost:8088/customer/customerplatinum",
    "http://localhost:8088/customer/customergold",
    "http://localhost:8088/customer/customersilver",
    "http://localhost:8088/customer/customervip"
]

// luôn load ra biểu đồ lọc những khách hàng có cấp độ cao nhất (bạch kim)
$.ajax({
    url: listLink[0],
    type: "GET",
    dataType: 'json',
    async: false,
    success: function(res) {
        console.log(res);
        for (let index = 0; index < res.length; index++) {
            const element = res[index];
            lCustomerLoad.push(element[0]);
            lTotalMoneyLoad.push(element[1]);
        }
        var areaChartDataCustomer = {
                labels: lCustomerLoad,
                datasets: [{
                    label: 'Tổng tiền đã mua',
                    backgroundColor: 'rgba(60,141,188,0.9)',
                    borderColor: 'rgba(60,141,188,0.8)',
                    pointRadius: false,
                    pointColor: '#3b8bba',
                    pointStrokeColor: 'rgba(60,141,188,1)',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(60,141,188,1)',
                    data: lTotalMoneyLoad
                }]
            }
            //-------------
            //- BAR CHART -
            //-------------
        var barChartCanvas = $('#barTotalMoney').get(0).getContext('2d')
        var barChartData = $.extend(true, {}, areaChartDataCustomer)
        var temp0 = areaChartDataCustomer.datasets[0]
            //var temp1 = areaChartData.datasets[1]
        barChartData.datasets[0] = temp0
            //barChartData.datasets[1] = temp0

        var barChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            datasetFill: false
        }

        new Chart(barChartCanvas, {
            type: 'bar',
            data: barChartData,
            options: barChartOptions
        })

        var donutData = {
            labels: [
                'Chrome',
                'IE',
                'FireFox',
                'Safari',
                'Opera',
                'Navigator',
            ],
            datasets: [{
                data: [700, 500, 400, 600, 300, 100],
                backgroundColor: ['#f56954', '#00a65a', '#f39c12', '#00c0ef', '#3c8dbc', '#d2d6de'],
            }]
        }

    },
    error: function(error) {
        console.log(error);
    }
});

// lọc những khách hàng theo cấp độ mà người dùng chọn
$("#customerLv").on("change", function() {
    console.log($("#customerLv").val());
    // $("#barTotalMoney").html("");
    lCustomer = [];
    lTotalMoney = [];
    var totalMoney = parseInt($("#customerLv").val());
    var link = "";
    if (totalMoney === 1) {
        link = listLink[0];
    } else if (totalMoney === 2) {
        link = listLink[1];
    } else if (totalMoney === 3) {
        link = listLink[2];
    } else if (totalMoney === 4) {
        link = listLink[3];
    }

    $.ajax({
        url: link,
        type: "GET",
        dataType: 'json',
        async: false,
        success: function(res) {
            console.log(res);
            for (let index = 0; index < res.length; index++) {
                const element = res[index];
                lCustomer.push(element[0]);
                lTotalMoney.push(element[1]);
            }
            var areaChartDataCustomer = {
                    labels: lCustomer,
                    datasets: [{
                        label: 'Tổng tiền đã mua',
                        backgroundColor: 'rgba(60,141,188,0.9)',
                        borderColor: 'rgba(60,141,188,0.8)',
                        pointRadius: false,
                        pointColor: '#3b8bba',
                        pointStrokeColor: 'rgba(60,141,188,1)',
                        pointHighlightFill: '#fff',
                        pointHighlightStroke: 'rgba(60,141,188,1)',
                        data: lTotalMoney
                    }]
                }
                //-------------
                //- BAR CHART -
                //-------------
            var barChartCanvas = $('#barTotalMoney').get(0).getContext('2d')
            var barChartData = $.extend(true, {}, areaChartDataCustomer)
            var temp0 = areaChartDataCustomer.datasets[0]
                //var temp1 = areaChartData.datasets[1]
            barChartData.datasets[0] = temp0
                //barChartData.datasets[1] = temp0

            var barChartOptions = {
                responsive: true,
                maintainAspectRatio: false,
                datasetFill: false
            }

            new Chart(barChartCanvas, {
                type: 'bar',
                data: barChartData,
                options: barChartOptions
            })

            var donutData = {
                labels: [
                    'Chrome',
                    'IE',
                    'FireFox',
                    'Safari',
                    'Opera',
                    'Navigator',
                ],
                datasets: [{
                    data: [700, 500, 400, 600, 300, 100],
                    backgroundColor: ['#f56954', '#00a65a', '#f39c12', '#00c0ef', '#3c8dbc', '#d2d6de'],
                }]
            }
        },
        error: function(error) {
            console.log(error);
        }
    });
});

// khi ấn nút xuất excel bên biểu đồ lọc khách hàng theo level sẽ xuất ra file excel 
// có danh sách khách hàng theo level được chọn
$("#excelcustomerbylevel").on("click", function() {
    var totalMoney = parseInt($("#customerLv").val());
    var listLinkExcel = [
        "http://localhost:8088/export/customerplatinum/excel",
        "http://localhost:8088/export/customergold/excel",
        "http://localhost:8088/export/customersilver/excel",
        "http://localhost:8088/export/customervip/excel"
    ]

    var excelLink = "";
    if (totalMoney === 1) {
        excelLink = listLinkExcel[0];
        window.location.href = excelLink;
    } else if (totalMoney === 2) {
        excelLink = listLinkExcel[1];
        window.location.href = excelLink;
    } else if (totalMoney === 3) {
        excelLink = listLinkExcel[2];
        window.location.href = excelLink;
    } else if (totalMoney === 4) {
        excelLink = listLinkExcel[3];
        window.location.href = excelLink;
    }
});