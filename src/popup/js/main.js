let myPopup = new Popup();

myPopup.show('confirm', {
    text: '点击按钮关闭弹窗。',
    buttonReverse: true,
    success: function () {
        alert('您点击了 确认');
    },
    failure: function () {
        alert('您点击了 取消');
    }
});
