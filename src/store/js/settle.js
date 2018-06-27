(function() {
  // 商品列表
  var GOODS_LIST = [];

  var Settle = {
    // 当前登录的用户名
    userName: '',

    // 购物车内的商品数量
    cartGoodsCount: 0,

    // 加入购物车的商品
    selectedGoods: [],

    // 入口函数
    init() {
      this.getCurrentUserName();
      this.getGoodsList();
      this.filterSelectedGoods(GOODS_LIST);
      this.getCartGoodsCount();
      this.renderCartGoodsCount();
      // this.renderSummaryInfo();
      this.addEvents();
    },

    // 从 localStorage 中获取当前登录的用户信息
    getCurrentUserName() {
      var userName = window.localStorage.getItem('USER_NAME');
      // 如果已登录，渲染用户名
      if (userName) {
        this.userName = userName;
        this.renderLoginInfo();
      }
    },

    // 渲染登录信息
    renderLoginInfo(userName) {
      var $login = document.getElementById('$_Login');
      $login.textContent = this.userName;
      $login.setAttribute('href', 'javascript:;');
      $login.parentNode.classList.add('is-login');
    },

    // 从 localStorage 中获取商品列表
    getGoodsList() {
      var goodsList = window.localStorage.getItem('GOODS_LIST');
      if (goodsList) {
        GOODS_LIST = JSON.parse(goodsList);
      }
    },

    // 筛选加入购物车的商品
    filterSelectedGoods(list) {
      this.selectedGoods = list.filter(item => item.count);
    },

    // 添加事件
    addEvents() {
      this.addOrderEvent();
      this.addLogoutEvent();
    },

    // 提交订单事件
    addOrderEvent() {
      var $submitBtn = document.getElementById('$_SubmitBtn');
      var $consignee = document.getElementById('$_Consignee');
      var $phone = document.getElementById('$_Phone');
      var $address = document.getElementById('$_Address');

      $submitBtn.addEventListener('click', event => {
        event.preventDefault();

        var consignee = $consignee.value;
        var phone = $phone.value;
        var address = $address.value;

        if (!consignee) {
          $consignee.focus();
          alert('请输入收货人');
          return;
        }

        if (!phone) {
          $phone.focus();
          alert('请输入手机号');
          return;
        }

        if (!address) {
          $address.focus();
          alert('请输入收获地址');
          return;
        }

        alert('下单成功');
        window.localStorage.removeItem('GOODS_LIST');
        window.location.href = './index.html';
      });
    },

    // 退出登录事件
    addLogoutEvent() {
      var $logout = document.getElementById('$_Logout');
      $logout.addEventListener('click', () => {
        window.localStorage.removeItem('USER_NAME');
        window.location.href = './login.html';
      });
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

    // 渲染商品价格
    renderGoodsPrice(index, goods) {
      var $goodsPrice = document.querySelectorAll('.goods-list .total-price');
      $goodsPrice[index].textContent = `¥ ${(goods.price * goods.count).toFixed(
        2
      )}`;
    },

    // 获取购物车中的商品数量
    getCartGoodsCount() {
      var count = this.selectedGoods.reduce((prev, curr) => {
        return prev + curr.count;
      }, 0);
      this.cartGoodsCount = count;
    },

    // 渲染购物车汇总信息
    renderSummaryInfo() {
      var $totalGoodsNum = document.querySelector(
        '.total-panel .total-goods-num'
      );
      var $allprice = document.querySelector('.total-panel .all-price');

      $totalGoodsNum.textContent = this.cartGoodsCount;
      var allprice = this.selectedGoods.reduce((prev, curr) => {
        return prev + curr.price * curr.count;
      }, 0);
      $allprice.textContent = `¥ ${allprice.toFixed(2)}`;
    }
  };

  Settle.init();
})();
