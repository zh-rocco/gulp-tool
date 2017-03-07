/**
 * Popup 1.1
 *
 * no-nothing @ github
 * Copyright 2017, MIT License
 *
 */

function Popup() {
    "use strict";

    //判断DOM中是否存在id为"popup-box"的元素，没有的话创建
    var flag = document.getElementById('popup-box') || document.getElementsByClassName('popup-box')[0];
    if (flag) {
        console.warn('请删除HTML中的"#popup-box"和".popup-box"元素,否则会出现意想不到的BUG');
    } else {
        var create_popupBox = document.createElement('div');
        var create_popupMask = document.createElement('div');
        create_popupBox.setAttribute('id', 'popup-box');
        create_popupBox.classList.add('popup-box');
        create_popupMask.classList.add('popup-mask');
        create_popupBox.appendChild(create_popupMask);
        document.getElementsByTagName('body')[0].appendChild(create_popupBox);
    }

    //HTML模板
    var popupHTML = {
        confirm: "<div class=\"confirm-text\"><p class=\"text\"><\/p><\/div>" +
        "<div class=\"confirm-button clear-fix\">" +
        "    <button class=\"button no\">取消<\/button>" +
        "    <button class=\"button yes\">确定<\/button>" +
        "<\/div>",

        loading: "<span class=\"icon loading\"><\/span>" +
        "<p class=\"text\"><\/p>",

        success: "<span class=\"icon\"><\/span>" +
        "<p class=\"text\"><\/p>",

        failure: "<span class=\"icon\"><\/span>" +
        "<p class=\"text\"><\/p>"
    };

    var popupBox = document.getElementById('popup-box');
    var popupMask = popupBox.getElementsByClassName('popup-mask')[0];
    var popupType = ['confirm', 'loading', 'success', 'failure']; //目前支持的弹窗类型
    var options = {
        confirm: {
            maskColor: 'rgba(67, 67, 67, 0.5)',
            text: '解绑后将无法收到该设备的任何消息。您确定要解绑吗?',
            buttonReverse: false,
            success: function () {
                var popupConfirm = popupBox.getElementsByClassName('popup-confirm')[0];
                popupBox.style.display = 'none';
                popupConfirm.style.display = 'none';
                console.log('click success');
            },
            failure: function () {
                var popupConfirm = popupBox.getElementsByClassName('popup-confirm')[0];
                popupBox.style.display = 'none';
                popupConfirm.style.display = 'none';
                console.log('click failure');
            }
        },
        loading: {
            maskColor: 'transparent',
            text: '解绑中...'
        },
        success: {
            maskColor: 'transparent',
            text: '该设备已解除绑定'
        },
        failure: {
            maskColor: 'transparent',
            text: '该设备解绑失败 请重试'
        }
    }; //弹窗样式配置

    var prevent = function (e) {
        e.preventDefault();
        e.stopPropagation();
    };

    var stop = function (e) {
        e.stopPropagation();
    };

    // 阻止用户滑动，防止弹窗内的按钮点透
    popupBox.addEventListener('touchmove', prevent, false);
    popupMask.addEventListener('touchstart', stop, false);
    popupMask.addEventListener('touchend', stop, false);
    popupMask.addEventListener('click', stop, false);

    //展示指定的popupItem，传入参数 confirm:确认? loading:加载动画 success:成功 failure:失败
    function show(type, opt) {
        //若不支持报错，停止运行
        if (popupType.indexOf(type) === -1) {
            console.error('请输入合法的"show(arg)",arg可选"confirm" "success" "failure" "loading"');
            return false;
        }

        //未传入opt的时候opt={}
        opt = opt || {};

        //若DOM无相应节点，创建
        if (!popupBox.getElementsByClassName('popup-' + type)[0]) {
            create(type);
        }

        //重置默认内容
        if (opt.text) {
            options[type].text = opt.text;
        }
        if (opt.maskColor) {
            options[type].maskColor = opt.maskColor;
        }

        //配置样式和内容等
        popupMask.style.backgroundColor = options[type].maskColor;
        close();
        var popupItem = popupBox.getElementsByClassName('popup-' + type)[0];
        var text = popupItem.getElementsByClassName('text')[0];
        text.textContent = options[type].text;

        //confirm添加点击事件
        if (type === 'confirm') {
            if (opt.buttonReverse) {
                options['confirm'].buttonReverse = opt.buttonReverse;
            }
            var buttons = popupItem.getElementsByClassName('button');
            if (options['confirm'].buttonReverse) {
                buttons[0].style.float = 'right';
                buttons[1].style.float = 'left';
            } else {
                buttons[0].style.float = 'left';
                buttons[1].style.float = 'right';
            }

            var yes = popupItem.getElementsByClassName('yes')[0];
            var no = popupItem.getElementsByClassName('no')[0];
            addEvent(yes, opt.success, options.confirm.success);
            addEvent(no, opt.failure, options.confirm.failure);
        }

        //自动关闭
        if (opt.timeout) {
            setTimeout(function () {
                close();
            }, opt.timeout);
        }

        popupItem.style.display = 'block';
        popupBox.style.display = 'block';
    }

    //生成HTML，type取 'confirm','loading','success','failure'
    function create(type) {
        var popupItem = document.createElement('div');
        popupItem.classList.add('popup-item', 'popup-' + type);
        popupItem.innerHTML = popupHTML[type];
        popupBox.appendChild(popupItem);
    }

    //confirm弹窗添加回掉函数
    function addEvent(ele, cb, def) {
        isFunction(cb) ? ele.onclick = function () {
                def();
                cb();
            } :
            ele.onclick = def;
    }

    //判断是否为函数
    function isFunction(fn) {
        return Object.prototype.toString.call(fn) === '[object Function]';
    }

    /* 关闭所有弹窗 */
    function close() {
        var popupItems = popupBox.getElementsByClassName('popup-item'); //popupBox下的所有已使用的弹窗集合
        popupBox.style.display = 'none';
        for (var i = 0, len = popupItems.length; i < len; i++) {
            popupItems[i].style.display = 'none';
        }
    }

    //暴露API
    return {
        show: function (type, opt) {
            show(type, opt);
        },
        close: function () {
            close();
        }
    }
}
