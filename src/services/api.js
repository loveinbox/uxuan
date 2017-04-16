var baseUrl = 'http://www.lifeuxuan.com/index.php';
var serviceURLs = {
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
  /*
   * Order Action
   */
  FruitOrder: '/order/insert/fruit',
  WashOrder: '/order/insert/wash',
  WashReserve: '/order/reserve/wash',
  WxPay: '/wxctrl/pay',
  WxPayConfirmFruit: '/payconfirm/fruit',
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
  NearByCoffeeShops: '/shoplist/coffee',
  CoffeeByShop: '/shop/coffee',
};
ServiceFactory(serviceURLs);

function ServiceFactory(serviceURLs) {
  for (var p in serviceURLs) {
    (function(param) {
      angular.module('starter.services')
        .factory(p, function($resource) {
          return $resource(baseUrl + serviceURLs[param]);
        })
    })(p);
  }
};
