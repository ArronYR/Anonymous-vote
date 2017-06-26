var socket = io.connect(window.location.host);

$(function () {
    var $fullText = $('.full-text');
    $('#btn-fullscreen').on('click', function () {
        $.AMUI.fullscreen.toggle();
    });
    $(document).on($.AMUI.fullscreen.raw.fullscreenchange, function () {
        $fullText.text($.AMUI.fullscreen.isFullscreen ? '退出全屏' : '开启全屏');
    });

    autoLeftNav();
    $(window).resize(function () {
        autoLeftNav();
    });

    $('#score-form').submit(function () {
        return false;
    });
    $('#score-form').validator({
        submit: function (e) {
            var uid = $('#uid').val();
            var score = $('#score').val();
            if (!uid || uid == 0) {
                new PNotify({
                    title: '提示',
                    text: '请选择打分对象',
                    type: 'error'
                });
            }
            if (this.isFormValid()) {
                var queries = new getRequest(window.location.search);
                submitVote({
                    token: queries.token,
                    uid: uid,
                    score: score
                });
            }
            return false;
        }
    });

    $('#btn-start-vote').unbind('click').bind('click', function (event) {
        var uid = $('#uid').val();
        if (uid && uid > 0) {
            startVote(uid);
        } else {
            new PNotify({
                title: '提示',
                text: '请选择打分对象',
                type: 'error'
            });
        }
    });

});

/**
 * 获取url中"?"符后的字串 
 * 
 * @param {any} url 
 * @returns 
 */
function getRequest(url) {
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

/**
 * 侧边菜单开关
 * 
 */
function autoLeftNav() {
    $('.tpl-header-switch-button').on('click', function () {
        if ($('.left-sidebar').is('.active')) {
            if ($(window).width() > 1024) {
                $('.tpl-content-wrapper').removeClass('active');
            }
            $('.left-sidebar').removeClass('active');
        } else {

            $('.left-sidebar').addClass('active');
            if ($(window).width() > 1024) {
                $('.tpl-content-wrapper').addClass('active');
            }
        }
    })
    if ($(window).width() < 1024) {
        $('.left-sidebar').addClass('active');
    } else {
        $('.left-sidebar').removeClass('active');
    }
}

/**
 * 提交投票信息
 * 
 * @param {any} data 
 */
function submitVote(data) {
    httpRequest('/users/vote', "GET", data, function (res) {
        if (res.error == 302) {
            window.location.href = '/';
        }
        var type = 'success';
        if (res.error) {
            type = 'default';
        } else {
            socket.emit('vote', {
                vote: data
            });
        }
        new PNotify({
            title: '提示',
            text: res.message,
            type: type
        });
    }, function () {
        new PNotify({
            title: '提示',
            text: '网络请求失败',
            type: 'error'
        });
    });
}

/**
 * 开始投票
 * 
 * @param {any} uid 
 */
function startVote(uid) {
    httpRequest('/users/start', "GET", {
        uid: uid,
        token: 'ae0fdb6f2512df5fcf712da4ed7b5daf'
    }, function (res) {
        if (res.error == 302) {
            window.location.href = '/';
        }
        var type = 'success';
        if (res.error) {
            type = 'default';
        } else {
            socket.emit('vote', {
                vote: {
                    token: 0,
                    uid: uid,
                    score: 0
                }
            });
        }
        new PNotify({
            title: '提示',
            text: res.message,
            type: type
        });
    }, function () {
        new PNotify({
            title: '提示',
            text: '网络请求失败',
            type: 'error'
        });
    });
}

/**
 * 
 * 渲染投票人列表
 * 
 * @param {any} callback 
 */
function renderVoters(callback) {
    httpRequest('/users/voters', "GET", {
        token: 'ae0fdb6f2512df5fcf712da4ed7b5daf'
    }, function (res) {
        if (res.error) {
            typeof callback == "function" && callback([]);
        } else {
            typeof callback == "function" && callback(res);
        }
    }, function () {
        typeof callback == "function" && callback([]);
    });
}

function renderResult($ele, data, callback) {
    if (typeof data == 'undefined') {
        return;
    }
    $ele.find('#vote_count').text(data.vote_count);
    $ele.find('#max_score').text(data.max_score);
    $ele.find('#min_score').text(data.min_score);
    $ele.find('#total_score').text(data.total_score);
    $ele.find('#fatal_score').text(data.fatal_score);
    $ele.find('#average_score').text(data.average_score);
    $ele.find('#convert_score').text(data.convert_score);

    typeof callback == "function" && callback();
}

/**
 * 渲染图表
 * 
 * @param {any} echarts 
 * @param {any} subtext 
 * @param {any} options 
 */
function renderEcharts(echarts, subtext, options) {
    option = {
        title: {
            text: '计研167班同学相互打分情况',
            subtext: typeof subtext != 'undefined' ? subtext : ' '
        },
        legend: {
            data: ['分值']
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        toolbox: {
            show: true,
            feature: {
                dataView: {
                    show: true,
                    readOnly: false
                },
                magicType: {
                    show: true,
                    type: ['line', 'bar']
                },
                restore: {
                    show: true
                },
                saveAsImage: {
                    show: true
                }
            }
        },
        grid: {
            top: '16%',
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            data: typeof options != 'undefined' ? options.keys : [],
            axisTick: {
                alignWithLabel: true
            }
        }],
        yAxis: [{
            type: 'value'
        }],
        series: [{
            name: '分值',
            type: 'bar',
            barWidth: '60%',
            data: typeof options != 'undefined' ? options.values : [],
            label: {
                normal: {
                    show: true,
                    position: 'insideTop'
                }
            },
            markPoint: {
                data: [{
                        type: 'max',
                        name: '最大值'
                    },
                    {
                        type: 'min',
                        name: '最小值'
                    }
                ]
            }
        }]
    };
    echarts.setOption(option);
}

/**
 * 发起网络请求
 * @param {*} url 请求地址
 * @param {*} method 请求方法
 * @param {*} data 请求参数
 * @param {*} done 完成回调
 * @param {*} fail 失败回调
 * @param {*} always 成功会失败均执行的回调
 */
function httpRequest(url, method, data, done, fail, always) {
    $.ajax({
            url: url,
            type: method == 'POST' ? 'POST' : 'GET',
            dataType: 'json',
            data: data,
            cache: false
        })
        .done(function (res) {
            typeof done == 'function' && done(res);
        })
        .fail(function () {
            typeof fail == 'function' && fail();
        })
        .always(function () {
            typeof always == 'function' && always();
        });
}