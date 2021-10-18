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
//Date range picker
$('#reservation').daterangepicker()

$('#daterangeforweek').each(function() {
    $(this).datepicker({
        autoclose: true,
        format: " yyyy",
        viewMode: "years",
        minViewMode: "years"
    });
    $(this).datepicker('clearDates');
});

//==================== report every day===========================
var day = [];
var sumMoney = [];

var date = new Date();
var today = date.getDate();
var dayLoadFirst = [];
var sumMoneyLoadFirst = [];

// hiện sẵn báo cáo tổng tiền của 7 ngày trước 
$.ajax({
    url: "http://localhost:8088/order/datereport/" + (today - 7) + "/" + (today - 1),
    type: "GET",
    dataType: 'json',
    async: false,
    success: function(res) {
        console.log(res);
        for (let index = 0; index < res.length; index++) {
            const element = res[index];
            dayLoadFirst.push(element[0]);
            sumMoneyLoadFirst.push(element[3]);
        }
        console.log(sumMoneyLoadFirst);
        var areaChartDataOrder = {
                labels: dayLoadFirst,
                datasets: [{
                    label: 'Tổng tiền theo từng ngày',
                    backgroundColor: 'rgba(60,141,188,0.9)',
                    borderColor: 'rgba(60,141,188,0.8)',
                    pointRadius: false,
                    pointColor: '#3b8bba',
                    pointStrokeColor: 'rgba(60,141,188,1)',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(60,141,188,1)',
                    data: sumMoneyLoadFirst
                }]
            }
            //-------------
            //- BAR CHART -
            //-------------
        var barChartCanvas = $('#barDateSum').get(0).getContext('2d')
        var barChartData = $.extend(true, {}, areaChartDataOrder)
        var temp0 = areaChartDataOrder.datasets[0]
            // var temp1 = areaChartDataOrder.datasets[1]
        barChartData.datasets[0] = temp0

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

// khi người dùng chọn lọc ngày thì sẽ hiện theo những ngày mà người dùng chọn
$('#reservation').on('apply.daterangepicker', function(ev, picker) {
    $("#barDateSum").html("");

    $("#exceltotalmoneyeday").on("click", function() {
        var dateBegin = picker.startDate.format('DD')
        var dateEnd = picker.endDate.format('DD');
        console.log(dateBegin, dateEnd);
        window.location.href = "http://localhost:8088/order/datereportexcell/" + dateBegin + "/" + dateEnd;
    });

    day = [];
    sumMoney = [];
    var dateBegin = picker.startDate.format('DD')
    var dateEnd = picker.endDate.format('DD');

    console.log(picker.startDate);
    console.log(picker.startDate.format('YYYY-MM-DD'));
    console.log(picker.endDate.format('YYYY-MM-DD'));

    $.ajax({
        url: "http://localhost:8088/order/datereport/" + dateBegin + "/" + dateEnd,
        type: "GET",
        dataType: 'json',
        async: false,
        success: function(res) {
            console.log(res);
            for (let index = 0; index < res.length; index++) {
                const element = res[index];
                day.push(element[0]);
                sumMoney.push(element[3]);
                // areaChartDataOrder.labels.push(element[0]);
                // areaChartDataOrder.datasets[0].data.push(element[2]);
            }
            console.log(day, sumMoney);
            var areaChartDataOrder = {
                    labels: day,
                    datasets: [{
                        label: 'Tổng tiền theo từng ngày',
                        backgroundColor: 'rgba(60,141,188,0.9)',
                        borderColor: 'rgba(60,141,188,0.8)',
                        pointRadius: false,
                        pointColor: '#3b8bba',
                        pointStrokeColor: 'rgba(60,141,188,1)',
                        pointHighlightFill: '#fff',
                        pointHighlightStroke: 'rgba(60,141,188,1)',
                        data: sumMoney
                    }]
                }
                //-------------
                //- BAR CHART -
                //-------------
            var barChartCanvas = $('#barDateSum').get(0).getContext('2d')
            var barChartData = $.extend(true, {}, areaChartDataOrder)
            var temp0 = areaChartDataOrder.datasets[0]
                // var temp1 = areaChartDataOrder.datasets[1]
            barChartData.datasets[0] = temp0

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