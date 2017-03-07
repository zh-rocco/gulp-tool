var myPopup = new Popup();

myPopup.show('confirm', {
    maskColor: 'transparent',
    text: 'Sure?',
    buttonReverse: true,
    success: function () {
        alert('yes');
    },
    failure: function () {
        alert('no');
    }
});
