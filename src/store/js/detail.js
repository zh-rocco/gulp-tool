(function() {
  // 商品列表
  var GOODS_LIST = [
    {
      id: '01',
      name: '旅行双肩包',
      image: './img/index/goods-01.png',
      price: 399,
      sales: 500,
      count: 0
    },
    {
      id: '02',
      name: '旅行单肩包',
      image: './img/index/goods-02.png',
      price: 199,
      sales: 130,
      count: 0
    },
    {
      id: '03',
      name: '行李牌',
      image: './img/index/goods-03.png',
      price: 39,
      sales: 88,
      count: 0
    },
    {
      id: '04',
      name: '环保圆珠笔',
      image: './img/index/goods-04.png',
      price: 19,
      sales: 220,
      count: 0
    },
    {
      id: '05',
      name: '钢化玻璃保护膜',
      image: './img/index/goods-05.png',
      price: 129,
      sales: 2000,
      count: 0
    },
    {
      id: '06',
      name: '充电套装',
      image: './img/index/goods-06.png',
      price: 159,
      sales: 650,
      count: 0
    },
    {
      id: '07',
      name: '数据线',
      image: './img/index/goods-07.png',
      price: 59,
      sales: 980,
      count: 0
    },
    {
      id: '08',
      name: '耳机 1',
      image: './img/index/goods-08.png',
      price: 499,
      sales: 360,
      count: 0
    },
    {
      id: '09',
      name: '耳机 2',
      image: './img/index/goods-09.png',
      price: 119,
      sales: 550,
      count: 0
    }
  ];

  // 从 URL 中获取数据
  function getQueryString(name) {
    const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    const result = window.location.search.slice(1).match(reg);
    return result === null ? null : decodeURI(result[2]);
  }

  var Detail = {
    // 当前登录的用户名
    userName: '',

    // 当前的商品 ID
    id: getQueryString('id'),

    // 当前的商品信息
    goodsInfo: {},

    // 购物车内的商品数量
    cartGoodsCount: 0,

    // 入口函数
    init() {
      this.getCurrentUserName();
      this.getGoodsList();
      this.getCartGoodsCount();
      this.renderCartGoodsCount();

      if (this.isValidGoods()) {
        this.renderGoodsInfo();
        this.addEvents();
      } else {
        document.querySelector('.main').innerHTML = '<h1>未找到该商品</h1>';
      }
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

    // 获取购物车中的商品数量
    getCartGoodsCount() {
      var count = GOODS_LIST.reduce((prev, curr) => {
        return prev + curr.count;
      }, 0);
      this.cartGoodsCount = count;
    },

    // 检查是否存在该商品
    isValidGoods() {
      return !!GOODS_LIST.find(item => {
        var flag = item.id === this.id;
        if (flag) {
          this.goodsInfo = item;
        }
        return flag;
      });
    },

    // 渲染商品信息
    renderGoodsInfo() {
      var goods = this.goodsInfo;
      var $banner = document.querySelector('.banner');
      $banner.innerHTML = `
        <div class="left">
          <img src="${goods.image}" alt="${goods.name}">
        </div>
        <div class="right">
          <h1>${goods.name}</h1>
          <p class="price">¥ ${goods.price.toFixed(2)}</p>
          <a class="buy-btn" href="javascript:;">加入购物车</a>
        </div>`;
    },

    // 添加事件
    addEvents() {
      this.addBuyEvent();
      this.addLogoutEvent();
    },

    addLogoutEvent() {
      var $logout = document.getElementById('$_Logout');
      $logout.addEventListener('click', () => {
        window.localStorage.removeItem('USER_NAME');
        window.location.href = '/login.html';
      });
    },

    // 添加购买事件
    addBuyEvent() {
      var $goodsBtn = document.querySelector('.buy-btn');
      $goodsBtn.addEventListener('click', this.buyHandler.bind(this));
    },

    // 购买事件函数
    buyHandler() {
      this.cartGoodsCount += 1;
      this.renderCartGoodsCount();
      this.storeCartGoods();
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

    // 存储购物车数据
    storeCartGoods() {
      this.goodsInfo.count += 1;
      window.localStorage.setItem('GOODS_LIST', JSON.stringify(GOODS_LIST));
    }
  };

  Detail.init();
})();
