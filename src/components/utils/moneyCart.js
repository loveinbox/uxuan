angular.module('starter.services')

/*
 * typeCart:{
 * shopCart:[{
 *     shopId:123,
 *     goodCart:[]
 *   }]
 * }
 */

.service('MoneyCart', function($rootScope, ShoppingCart) {

  this.getTypeMoney = function({ type, shop }) {
    return calculateTypeMoney(ShoppingCart.utils.typeWrap(type))
  }

  this.getShopMoney = function({ type, shop }) {
    return calculateShopMoney(ShoppingCart.utils.typeWrap(type), ShoppingCart.utils.ShopCartItem(shop))
  }

  function _cartChange() {
    $rootScope.$broadcast('cartChange');
  }

  function calculateTypeMoney(type) {
    const _shopCart = ShoppingCart.getTypeCart({ type });
    let _shopCartMoney = 0;

    _shopCart.forEach(shopCart => {
      shopCart.productsList.forEach(value => {
        _shopCartMoney += calculateShopMoney(type, shopCart).total
      });
    });
    return { total: _shopCartMoney }
  }


  function calculateShopMoney(type, shop) {
    const typeCart = ShoppingCart.getTypeCart({ type });
    const _shopCart = typeCart.filter(value => shop.shopId === value.shopId)[0];
    let _shopCartMoney = 0;
    let result = {}

    _shopCart.productsList.forEach(value => {
      if (value.isChecked) {
        _shopCartMoney += value.productPrice * value.productQuantity;
      }
    });
    // shopCart.singleCartTotalNumber = tempTotalMoney;
    // // 是否达到起送价
    // if (shopCart.singleCartTotalNumber < shopCart.shopInfo.sendStartPrice * 100) {
    //   shopCart.isReachStartPrice = false;
    // } else {
    //   shopCart.isReachStartPrice = true;
    // }
    // // 是否计算运费
    // if (tempTotalMoney > 0) {
    //   if (!(type == 'wash' && shopCart.isReachStartPrice))
    //     shopCart.singleCartTotalNumber += shopCart.shopInfo.sendPrice * 100;
    // }
    // money += shopCart.singleCartTotalNumber;
    // });


    if (_shopCartMoney < shop.shopStartMoney * 100) {
      result.showSendStartPrice = true
    }

    if (!shop.shopFreeDeliveryMoney) {
      _shopCartMoney += shop.shopDeliveryFee * 100
      result.showSendFreePrice = false
    } else if (shop.shopFreeDeliveryMoney * 100 > _shopCartMoney) {
      _shopCartMoney += shop.shopDeliveryFee * 100
      result.showSendFreePrice = true
      result.showSendFreePriceDanger = true
    } else {
      result.showSendFreePrice = true
    }

    // shopDeliveryFee
    // shopStartMoney
    // shopFreeDeliveryMoney
    result.total = _shopCartMoney
    return Object.assign(result, shop)

    // return { total: _shopCartMoney, showSendPrice: true } //Object.assign({ total: _shopCartMoney }, _shopCart.shopInfo)
  }

})
