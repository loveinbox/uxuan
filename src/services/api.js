let baseUrl = 'http://www.lifeuxuan.com/index.php';
let serviceURLs = {
  /*
   * Common
   */
  NearByEguard: '/eguards',
  Search: '/search/normal',
  /*
   * Index
   */
  BannerIndex: '/banner/index',
  MainPageHot: '/hot/index',
  FruitRank: '/rank/index/fruit',
  WashRank: '/rank/index/wash',
  /*
   * User
   */
  userWechatInfo: '/user/basicinfo',
  userRegister: '/user/register',
  SendCheckCode: '/code/send',
  CheckCheckCode: '/code/check',
  /*
   * Order show
   */
  OrderList: '/orderlist/customer',
  FruitOrderDetail: '/orderdetail/customer/fruit',
  WashOrderDetail: '/orderdetail/customer/wash',
  CoffeeOrderDetail: '/orderdetail/customer/drink',
  /*
   * Order Action
   */
  FruitOrder: '/order/insert/drink',
  WashOrder: '/order/insert/wash',
  WashReserve: '/order/reserve/wash',
  WxRegister: '/wxctrl/register',
  WxPay: '/wxctrl/pay2',
  WxPayConfirmFruit: '/payconfirm/drink',
  WxPayConfirmWash: '/payconfirm/wash',
  StartPrice: '/communicate/customer/wash/startprice',
  cancelFruit: '/communicate/customer/fruit/cancel',
  cancelWash: '/communicate/customer/wash/cancel',
  /*
   * Fruit
   */
  BannerFruit: '/banner/shoplist/fruit',
  NearByFruitShops: '/shoplist/fruit',
  FruitByShop: '/shop/fruit',
  FruitHot: '/hot/shoplist/fruit',
  FruitDetail: '/product/fruit',
  FruitPicShow: '/productshow/fruit',
  /*
   * Wash
   */
  BannerWash: '/banner/shoplist/wash',
  NearByWashShops: '/shoplist/wash',
  WashByShop: '/shop/wash',
  WashHot: '/hot/shoplist/wash',
  /*
   * Coffee
   */
  CoffeeByShop: '/shop/drink',
};
ServiceFactory(serviceURLs);

function ServiceFactory(serviceURLs) {
  for (let p in serviceURLs) {
    (function(param) {
      angular.module('starter.services')
        .factory(p, function($resource) {
          return $resource(baseUrl + serviceURLs[param]);
        })
    })(p);
  }
};
