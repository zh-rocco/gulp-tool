(function() {
  // 商品列表
  var GOODS_LIST = [];

  var Cart = {
    // 当前登录的用户名
    userName: '',

    // 购物车内的商品数量
    cartGoodsCount: 0,

    // 加入购物车的商品
    selectedGoods: [],

    // 入口函数
    init: function init() {
      this.getCurrentUserName();
      this.getGoodsList();
      this.filterSelectedGoods(GOODS_LIST);
      this.getCartGoodsCount();
      this.renderGoodsList(this.selectedGoods);
      this.renderSummaryInfo();
    },

    // 从 localStorage 中获取当前登录的用户信息
    getCurrentUserName: function getCurrentUserName() {
      var userName = window.localStorage.getItem('USER_NAME');
      // 如果已登录，渲染用户名
      if (userName) {
        this.userName = userName;
        this.renderLoginInfo();
      }
    },

    // 渲染登录信息
    renderLoginInfo: function renderLoginInfo(userName) {
      var $login = document.getElementById('$_Login');
      $login.textContent = this.userName;
      $login.setAttribute('href', 'javascript:;');
      $login.parentNode.classList.add('is-login');
    },

    // 从 localStorage 中获取商品列表
    getGoodsList: function getGoodsList() {
      var goodsList = window.localStorage.getItem('GOODS_LIST');
      if (goodsList) {
        GOODS_LIST = JSON.parse(goodsList);
      }
    },

    // 筛选加入购物车的商品
    filterSelectedGoods: function filterSelectedGoods(list) {
      this.selectedGoods = list.filter(function(item) {
        return item.count;
      });
    },

    // 渲染商品列表
    renderGoodsList: function renderGoodsList(list) {
      var _this = this;

      var $goodsList = document.getElementById('$_GoodsList');
      var html = '';
      list.forEach(function(item) {
        html += _this.renderGoodsItem(item);
      });
      $goodsList.innerHTML = html;
      this.addEvents();
    },

    // 渲染商品
    renderGoodsItem: function renderGoodsItem(data) {
      return (
        '<li class="goods">\
        <div class="goods-img">\
        <img src="' +
        data.image +
        '" alt="' +
        data.name +
        '">\
        </div>\
        <span class="name">' +
        data.name +
        '</span>\
        <span class="price">¥ ' +
        data.price.toFixed(2) +
        '</span>\
        <div class="goods-num-wrap">\
        <div class="goods-num">\
        <span class="goods-minus">\
        <span></span>\
        </span>\
        <span class="goods-count">' +
        data.count +
        '</span>\
        <span class="goods-plus">\
        <span></span>\
        <span></span>\
        </span>\
        </div>\
        </div>\
        <span class="total-price">¥ ' +
        (data.price * data.count).toFixed(2) +
        '</span>\
        <span class="delete-btn">+</span>\
        </li>'
      );
    },

    // 添加事件
    addEvents: function addEvents() {
      this.addChangeCountEvent();
      this.addDeleteEvent();
      this.addLogoutEvent();
    },

    // 退出登录事件
    addLogoutEvent: function addLogoutEvent() {
      var $logout = document.getElementById('$_Logout');
      $logout.addEventListener('click', function() {
        window.localStorage.removeItem('USER_NAME');
        window.location.href = './login.html';
      });
    },

    // 添加修改商品数量事件
    addChangeCountEvent: function addChangeCountEvent() {
      var _this2 = this;

      var $minusBtn = document.querySelectorAll('.goods-list .goods-minus');
      var $plusBtn = document.querySelectorAll('.goods-list .goods-plus');
      $minusBtn.forEach(function(item, index) {
        item.addEventListener(
          'click',
          _this2.changeCountHandler.bind(_this2, index, 'minus')
        );
      });
      $plusBtn.forEach(function(item, index) {
        item.addEventListener(
          'click',
          _this2.changeCountHandler.bind(_this2, index, 'plus')
        );
      });
    },

    // 移除修改商品数量事件
    removeChangeCountEvent: function removeChangeCountEvent() {
      var _this3 = this;

      var $minusBtn = document.querySelectorAll('.goods-list .goods-minus');
      var $plusBtn = document.querySelectorAll('.goods-list .goods-plus');
      $minusBtn.forEach(function(item, index) {
        item.removeEventListener('click', _this3.changeCountHandler);
      });
      $plusBtn.forEach(function(item, index) {
        item.removeEventListener('click', _this3.changeCountHandler);
      });
    },

    // 修改数量事件函数
    changeCountHandler: function changeCountHandler(index, type) {
      var goods = this.selectedGoods[index];
      var count = goods.count;
      if (type === 'minus') {
        if (count > 0) {
          goods.count -= 1;
          this.cartGoodsCount -= 1;
        } else {
          return;
        }
      } else {
        goods.count += 1;
        this.cartGoodsCount += 1;
      }
      this.renderGoodsCount(index, goods);
      this.renderGoodsPrice(index, goods);
      this.renderSummaryInfo();
      this.storeCartGoods();
    },

    // 渲染商品数量
    renderGoodsCount: function renderGoodsCount(index, goods) {
      var $goodsCount = document.querySelectorAll('.goods-list .goods-count');
      $goodsCount[index].textContent = goods.count;
    },

    // 渲染商品价格
    renderGoodsPrice: function renderGoodsPrice(index, goods) {
      var $GoodsPrice = document.querySelectorAll('.goods-list .total-price');
      $GoodsPrice[index].textContent =
        '¥ ' + (goods.price * goods.count).toFixed(2);
    },

    // 添加删除商品事件
    addDeleteEvent: function addDeleteEvent() {
      var _this4 = this;

      var $deleteBtn = document.querySelectorAll('.goods-list .delete-btn');
      $deleteBtn.forEach(function(item, index) {
        item.addEventListener(
          'click',
          _this4.deleteHandler.bind(_this4, index)
        );
      });
    },

    // 删除商品事件函数
    deleteHandler: function deleteHandler(index) {
      console.log('clicked:', index);
      this.cartGoodsCount -= this.selectedGoods[index].count;
      this.selectedGoods[index].count = 0;
      this.selectedGoods.splice(index, 1);
      this.removeChangeCountEvent();
      this.removeDeleteEvent();
      this.renderGoodsList(this.selectedGoods);
      this.renderSummaryInfo();
      this.storeCartGoods();
    },

    // 移除购买事件
    removeDeleteEvent: function removeDeleteEvent() {
      var _this5 = this;

      var $deleteBtn = document.querySelectorAll('.goods-list .delete-btn');
      $deleteBtn.forEach(function(item, index) {
        item.removeEventListener('click', _this5.deleteHandler);
      });
    },

    // 获取购物车中的商品数量
    getCartGoodsCount: function getCartGoodsCount() {
      var count = this.selectedGoods.reduce(function(prev, curr) {
        return prev + curr.count;
      }, 0);
      this.cartGoodsCount = count;
    },

    // 渲染购物车汇总信息
    renderSummaryInfo: function renderSummaryInfo() {
      var $totalGoodsNum = document.querySelector(
        '.total-panel .total-goods-num'
      );
      var $allPrice = document.querySelector('.total-panel .all-price');

      $totalGoodsNum.textContent = this.cartGoodsCount;
      var allPrice = this.selectedGoods.reduce(function(prev, curr) {
        return prev + curr.price * curr.count;
      }, 0);
      $allPrice.textContent = '¥ ' + allPrice.toFixed(2);
    },

    // 存储购物车数据
    storeCartGoods: function storeCartGoods() {
      window.localStorage.setItem('GOODS_LIST', JSON.stringify(GOODS_LIST));
    }
  };

  Cart.init();
})();
