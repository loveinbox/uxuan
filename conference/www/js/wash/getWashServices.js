angular.module('starter.services')

.factory('getWashShops', function($resource, $http) {
    return $resource('http://www.lifeuxuan.com/backend/api/NearByWashShops.php');
})

.factory('getWashShop', function($resource, $http) {
    return $resource('http://www.lifeuxuan.com/backend/api/WashsByShop.php');
})

.service('WashShoppingCart', function() {

  var cart = JSON.parse(localStorage.getItem('washCart')) || [];
  var number = 1;
  this.add = function(event, good) {
    cartFly();

    var cartGood = {
      'sellerId': good.sellerId,
      'seller': {
        sellerName: good.sellerName,
        sellerPicUrl: good.sellerPicUrl,
        sendPrice: good.sendPrice,
        sendStartPrice: good.sendStartPrice
      },
      'goodsList': [good]
    }
    var sellerIndex = _.findIndex(cart, { 'sellerId': good.sellerId });
    // 商店第一次被添加
    if (sellerIndex < 0) {
      good.quantity = 1;
      cart.push(cartGood);
      number = 1;
    } else {
      var goodIndex = _.findIndex(cart[sellerIndex]['goodsList'], { 'productId': good.productId });
      // 商品第一次被添加
      if (goodIndex < 0) {
        good.quantity = 1;
        cart[sellerIndex]['goodsList'].push(good);
        number = 1;
      } else {
        // 商品第二次被添加
        number = ++cart[sellerIndex]['goodsList'][goodIndex]['quantity'];
      }
    }
    localStorage.setItem('washCart', JSON.stringify(cart));
    return number;
  }

  this.remove = function(good) {
    var sellerIndex = _.findIndex(cart, { 'sellerId': good.sellerId });
    var goodIndex = _.findIndex(cart[sellerIndex]['goodsList'], { 'productId': good.productId });
    var number = --cart[sellerIndex]['goodsList'][goodIndex]['quantity'];
    if (number == 0) {
      cart[sellerIndex]['goodsList'].splice([goodIndex], 1);
      if (cart[sellerIndex]['goodsList'].length == 0) {
        cart.splice(sellerIndex, 1);
      }
      localStorage.setItem('washCart', JSON.stringify(cart));
      return 0;
    } else {
      localStorage.setItem('washCart', JSON.stringify(cart));
      return cart[sellerIndex]['goodsList'][goodIndex]['quantity'];
    }
  }

  this.getCart = function(good) {
    return cart;
  }

  this.get = function(good) {
    var sellerIndex = _.findIndex(cart, { 'sellerId': good.sellerId });
    if (sellerIndex < 0) {
      return 0;
    } else {
      var goodIndex = _.findIndex(cart[sellerIndex]['goodsList'], { 'productId': good.productId });
      if (goodIndex < 0) {
        return 0;
      } else {
        return cart[sellerIndex]['goodsList'][goodIndex]['quantity'];
      }
    }
  }

  this.getSellerCartNumber = function(sellerId) {
    var sellerIndex = _.findIndex(cart, { 'sellerId': sellerId });
    var sellerCartNumber = 0;
    var goodCartNumber = 0;
    if (sellerIndex < 0) {
      return 0;
    } else {
      $.each(cart[sellerIndex]['goodsList'], function(index, value) {
        sellerCartNumber += value.quantity;
      });
      return sellerCartNumber;
    }
  }

  this.getSellerProductList = function(sellerId) {
    var sellerIndex = _.findIndex(cart, { 'sellerId': sellerId });
    if (sellerIndex < 0) {
      return [];
    } else {
      return cart[sellerIndex]['goodsList'];
    }
  }

  this.getGoodsCartNumber = function(sellerId, good) {
    var sellerIndex = _.findIndex(cart, { 'sellerId': sellerId });
    var sellerCartNumber = 0;
    var goodCartNumber = 0;
    if (sellerIndex < 0) {
      return 0;
    } else {
      var goodIndex = _.findIndex(cart[sellerIndex]['goodsList'], { 'productId': good.productId });
      if (goodIndex < 0) {
        return 0;
      } else {
        return cart[sellerIndex]['goodsList'][goodIndex]['quantity'];
      }
    }
  }

  function cartFly() {
    if ($(".icon-cart:visible").length < 1) {
      return;
    }
    var offset = $(".icon-cart:visible").offset();

    var flyer = $('<i class="u-flyer icon ion-ios-color-filter"><i/>');
    flyer.fly({
      start: {
        left: event.pageX,
        top: event.pageY
      },
      end: {
        left: offset.left + 50,
        top: offset.top + 20,
        width: 0,
        height: 0
      },
      onEnd: function() {
        this.destory();
      }
    });
  }

})

;
