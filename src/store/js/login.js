(function() {
  // 商品列表
  var GOODS_LIST = [];

  var Login = {
    // 购物车内的商品数量
    cartGoodsCount: 0,

    // 入口函数
    init() {
      this.checkLogin();
      this.getGoodsList();
      this.addEvents();
      this.getCartGoodsCount();
      this.renderCartGoodsCount();
    },

    // 判断是否已登录
    checkLogin() {
      var userName = window.localStorage.getItem('USER_NAME');
      // 如果已登录，跳至首页
      if (userName) {
        window.location.href = './index.html';
      }
    },

    // 从 localStorage 中获取商品列表
    getGoodsList() {
      var goodsList = window.localStorage.getItem('GOODS_LIST');
      if (goodsList) {
        GOODS_LIST = JSON.parse(goodsList);
      }
    },

    // 获取购物车中的商品数量
    getCartGoodsCount() {
      var count = GOODS_LIST.reduce((prev, curr) => {
        return prev + curr.count;
      }, 0);
      this.cartGoodsCount = count;
    },

    // 渲染购物车商品数量
    renderCartGoodsCount() {
      var $cartCount = document.getElementById('$_CartCount');
      if (this.cartGoodsCount > 0) {
        $cartCount.textContent = this.cartGoodsCount;
        $cartCount.style.display = 'block';
      } else {
        $cartCount.style.display = 'none';
      }
    },

    // 添加事件
    addEvents() {
      this.addLoginEvent();
    },

    // 登录事件
    addLoginEvent() {
      var $submitBtn = document.getElementById('$_SubmitBtn');
      var $userName = document.getElementById('$_UserName');
      var $password = document.getElementById('$_Password');

      $submitBtn.addEventListener('click', event => {
        event.preventDefault();
        var userName = $userName.value;
        var password = $password.value;

        console.log(userName, password);

        if (!userName) {
          $userName.focus();
          alert('请输入用户名');
          return;
        }

        if (!password) {
          $password.focus();
          alert('请输入密码');
          return;
        }

        window.localStorage.setItem('USER_NAME', userName);

        window.location.href = './index.html';
      });
    }
  };

  Login.init();
})();
