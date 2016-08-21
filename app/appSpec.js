/**
 * Created by dalia on 18/08/16.
 */

describe ( 'app.js - cart' , function(){

    beforeEach(function() {
        var item = {name: 'apple', price: '2.99'};
        cart.addToCart(item);
    });

    afterEach(function() {
        cart.clearStorage();
    });

    it ( 'should add to cart', function(){
        expect(cart.getCart()).toBeTruthy();
    });

    it ( 'should show cart length', function(){
        expect(cart.cartLength()).toBe(1);
    });

    it ( 'should remove from cart', function(){
        cart.removeFromCart('apple');
        expect(cart.cartLength()).toBe(0);
    });

    it ( 'should should show cart value', function(){
        var item = {name: 'orange', price: '3.00'};
        cart.addToCart(item);
        item = {name: 'apple', price: '2.99'};
        cart.addToCart(item);
        expect(cart.cartValue()).toBe('8.98');
    });

    it ( 'total to pay should add £10', function(){
        expect(cart.totalToPay()).toBe('12.99');
    });

    it ( 'should add to favourite', function(){
        var item = {name: 'apple', price: '2.99'};
        cart.addToFav(item);
        expect(cart.getFav()).toBeTruthy();
    });

    it ( 'should remove from fav', function(){
        var item = {name: 'apple', price: '2.99'};
        cart.addToFav(item);
        cart.removeFromFav('apple');
        expect(cart.favLength()).toBe(0);
    });
} );

describe ( 'app.js - app' , function(){
    it ( 'should call handleAddToCart function', function(){
        var spyEvent = spyOnEvent('.addCart', 'click');
        $('.addCart').click();
        expect(spyEvent).toHaveBeenTriggered();
    });

    it ( 'should show cart page', function(){
        spyOn(app, 'showCartPage').and.callFake();
        $('.cartLink').click();
        expect(app.showCartPage).toHaveBeenCalled();
    });
});