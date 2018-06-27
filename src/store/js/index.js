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

  var Index = {
    // 当前登录的用户名
    userName: '',

    // 购物车内的商品数量
    cartGoodsCount: 0,

    // 入口函数
    init() {
      this.getCurrentUserName();
      this.getGoodsList();
      this.renderGoodsList(GOODS_LIST);
      this.addEvents();
      this.getCartGoodsCount();
      this.renderCartGoodsCount();
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

    // 渲染商品列表
    renderGoodsList(list) {
      var $goodsList = document.getElementById('$_GoodsList');
      var html = '';
      list.forEach(item => {
        html += this.renderGoodsItem(item);
      });
      $goodsList.innerHTML = html;
    },

    // 渲染商品
    renderGoodsItem(data) {
      return `
        <li class="goods">
          <a href="./detail.html?id=${data.id}">
            <img src="${data.image}" alt="${data.name}">
            <h3>${data.name}</h3>
            <p class="price">
              <span class="sale-price">
                <span>¥</span>
                <span>${data.price.toFixed(2)}</span>
              </span>
            </p>
            <p class="sales">
              <span>
                <span>已售:</span>
                <span>${data.sales}</span>
                <span>件</span>
              </span>
            </p>
          </a>
        </li>`;
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
      this.addSortEvent();
      this.addLogoutEvent();
    },

    // 退出登录事件
    addLogoutEvent() {
      var $logout = document.getElementById('$_Logout');
      $logout.addEventListener('click', () => {
        window.localStorage.removeItem('USER_NAME');
        window.location.href = './login.html';
      });
    },

    // 排序事件
    addSortEvent() {
      var $sortItems = document.querySelectorAll('.sort-wrap a');
      $sortItems.forEach(item => {
        item.addEventListener('click', event => {
          var $item = event.target;
          var type = $item.getAttribute('data-type');
          if ($item.classList.contains('active')) {
            return;
          }
          $sortItems.forEach(item => {
            item.classList.remove('active');
          });
          $item.classList.add('active');
          var list = GOODS_LIST.slice();
          switch (type) {
            case '0':
              list = GOODS_LIST.slice();
              break;
            case '1':
              list.sort((a, b) => {
                return b.sales - a.sales;
              });
              break;
            case '2':
              list.sort((a, b) => {
                return b.price - a.price;
              });
              break;
            default:
          }
          this.renderGoodsList(list);
        });
      });
    }
  };

  Index.init();
})();
