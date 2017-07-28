var imagesLoadList = [
    /* 第 1 屏 */
    './img/1_01.png',
    './img/1_02.png',
    './img/1_03.png',
    './img/1_04.png',
    './img/1_05.png',
    /* 第 2 屏 */
    './img/2_introduce.png',
    './img/2_left_icon.png',
    './img/2_left_line.png',
    './img/2_person.png',
    './img/2_right_icon.png',
    './img/2_right_line.png',
    './img/2_sign.png',
    './img/2_title.png',
    /* 第 3 屏 */
    './img/3_icon.png',
    './img/3_introduce.png',
    './img/3_line.png',
    './img/3_person.png',
    './img/3_sign.png',
    './img/3_title.png',
    /* 第 4 屏 */
    './img/4_introduce.png',
    './img/4_left_icon.png',
    './img/4_line.png',
    './img/4_person.png',
    './img/4_right_icon.png',
    './img/4_sign.png',
    './img/4_title.png',
    /* 第 5 屏 */
    './img/5_01.png',
    './img/5_02.png',
    './img/5_03.jpg',
    './img/5_04.png',
    './img/5_05.png',
    './img/5_06.png',
    './img/5_07.png',
    /* 通用 */
    './img/logo.png',
    './img/background.jpg',
    './img/star.png',
    './img/up-icon.png',
    './img/bottom_border.png',
    './img/weixin-share.jpg',
    './img/weixin-share.png'
];

/* 通用方法 */
const Utils = {
    isFunction(fn) {
        return Object.prototype.toString.call(fn) === '[object Function]';
    }
};

var Page = {
    mySwiper: {},
    init() {
        Page.loadImages(Page.initSwiper);
        _uxt.push(['_trackEvent', '专题', '天翼云盘6.0-H5', '打开H5页面', 1]);

    },
    initSwiper() {
        Page.mySwiper = new Swiper('.swiper-container', {
            direction: 'vertical',
            initialSlide: 0,
            onInit: function (swiper) { //Swiper2.x的初始化是onFirstInit
                swiperAnimateCache(swiper); //隐藏动画元素
                swiperAnimate(swiper); //初始化完成开始动画

                $('#J_open').click(function () {
                    Page.mySwiper.slideTo(1, 600, false);//切换到第一个slide，速度为1秒
                    swiperAnimate(swiper)
                })
            },
            onSlideChangeEnd: function (swiper) {
                swiperAnimate(swiper); //每个slide切换结束时也运行当前slide动画
            }
        });

        /* 添加事件 */
        Page.addEvents();
    },
    loadImages(cb) {
        var unloaded = imagesLoadList.length;

        /*for (var i = 0, len = imagesLoadList.length; i < len; i++) {
            var img = new Image();
            img.src = imagesLoadList[i];
            img.onload = () => {
                unloaded--;
                if (!unloaded) {
                    $('#J_Loading').hide();
                    $('.swiper-container').css('display', 'block');

                    Utils.isFunction(cb) && cb();
                }
            }
        }*/
        $('#J_Loading').hide();
        $('.swiper-container').css('display', 'block');
        cb();
    },
    addEvents() {
        var that = this;
        var musicSwitch = $('#J_musicButton'),
            audio = $('#J_audio')[0],
            qrCode = $(".qr-code");

        /* 默认播放 */
        var audioFlag = true;
        audio.play();

        musicSwitch.on('click', function () {
            if (audioFlag) {
                musicSwitch.removeClass('playing');
                audio.pause();
                audioFlag = !audioFlag;
            } else {
                musicSwitch.addClass('playing');
                audio.play();
                audioFlag = !audioFlag;
            }
        });

        qrCode.on('touchstart', function () {
            _uxt.push(['_trackEvent', '专题', '天翼云盘6.0-H5', '长按二维码', 1]);
        });
    }
};

/* 初始化页面 */
Page.init();

var wxShare = {
    init: function () {
        var that = this;
        var lineLink = encodeURIComponent(window.location.href);
        var url = 'http://event.21cn.com/api/v1/wxin/getSign2.do';
        var shareTitle = '天翼云盘6.0隆重上线  极速安全大有不同';
        var shareDesc = '天翼云盘6.0隆重上线，极速安全全面升级！传输更快，文件加密更安全，超级会员体验更尊贵！';
        var shareLink = 'http://m.cloud.189.cn/zhuanti/2017/h5/ecloud-6/index2.html';
        var shareImg = 'http://m.cloud.189.cn/zhuanti/2017/h5/ecloud-6/img/weixin-share.jpg';
        $.ajax({
            async: false,
            url: url,
            type: "get",
            data: {'url': lineLink},
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.withCredentials = true;
            },
            success: function (json) {
                var signature = json.signature;
                var noncestr = json.nonceStr;
                var timestamp = json.timeStr;
                wx.config({
                    debug: false,
                    appId: "wxe632d63bbcfe4e6c",
                    timestamp: timestamp,
                    nonceStr: noncestr,
                    signature: signature,
                    jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline', 'onMenuShareWeibo', 'onMenuShareQQ', 'onMenuShareQZone'] //      б       Ҫʹ  JS-SDK  ʲô
                });
            }
        });

        wx.ready(function () {
            wx.onMenuShareAppMessage({
                title: shareTitle,
                desc: shareDesc,
                link: shareLink,
                imgUrl: shareImg,
                success: function (res) {
                },
                cancel: function (res) {
                },
                fail: function (res) {
                }
            });
            wx.onMenuShareTimeline({
                title: shareTitle,
                desc: shareDesc,
                link: shareLink,
                imgUrl: shareImg,
                success: function (res) {
                },
                cancel: function (res) {
                },
                fail: function (res) {
                }
            });
            wx.onMenuShareWeibo({
                title: shareTitle,
                desc: shareDesc,
                link: shareLink,
                imgUrl: shareImg,
                success: function (res) {
                },
                cancel: function (res) {
                },
                fail: function (res) {
                }
            });
            wx.onMenuShareQQ({
                title: shareTitle,
                desc: shareDesc,
                link: shareLink,
                imgUrl: shareImg,
                success: function (res) {
                },
                cancel: function (res) {
                },
                fail: function (res) {
                }
            });
            wx.onMenuShareQZone({
                title: shareTitle,
                desc: shareDesc,
                link: shareLink,
                imgUrl: shareImg,
                success: function (res) {
                },
                cancel: function (res) {
                },
                fail: function (res) {
                }
            });
        });
        wx.error(function (res) {
        });
    }
};

wxShare.init();
