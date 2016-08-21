/**
 * Created by dalia on 17/08/16.
 */

var cart = (function(){
    return {
        setApp: function () {
            var cartval = JSON.parse(sessionStorage.getItem('cart'));
            this.cart = cartval || {};
            var favval = JSON.parse(sessionStorage.getItem('fav'));
            this.fav = favval || {};
        },
        getCart: function () {
            return this.cart;
        },
        getFav: function () {
            return this.fav;
        },
        addToCart: function (item) {
            var cart = this.cart;
            var entity = {};
            if (item.name in cart) {
                cart[item.name].quantity += 1;
                cart[item.name].price = parseFloat(cart[item.name].price) + parseFloat(item.price);
            } else {
                entity.price = parseFloat(item.price);
                entity.quantity = 1;
                entity.unitprice = parseFloat(item.price);
                cart[item.name] = entity;
            }
            sessionStorage.setItem('cart', JSON.stringify(cart));
        },
        cartLength: function () {
            var cart = this.cart;
            var length = 0;
            for (var key in cart) {
                if (cart.hasOwnProperty(key)){
                    length += parseInt(cart[key].quantity);
                }
            }
            return length;
        },
        favLength: function () {
            var fav = this.fav;
            var length = 0;
            for (var key in fav) {
                length += 1;
            }
            return length;
        },
        removeFromCart: function (item) {
            var cart = this.cart;
            delete cart[item];
            sessionStorage.setItem('cart', JSON.stringify(cart));
        },
        removeFromFav: function (item) {
            var fav = this.fav;
            delete fav[item];
            sessionStorage.setItem('fav', JSON.stringify(fav));
        },
        cartValue: function () {
            var cart = this.cart;
            var value = 0;
            for (var key in cart) {
                if (cart.hasOwnProperty(key)){
                    value += parseFloat(cart[key].price);
                }
            }
            return value.toFixed(2);
        },
        totalToPay: function(){
            return (parseFloat(this.cartValue()) + 10.00).toFixed(2);
        },
        ifInFav : function(item){
            var fav = this.fav;
            if (item.name in fav) {
                return true;
            } else {
                return false;
            }
        },
        addToFav: function (item) {
            var fav = this.fav;
            var entity = {};
            if (!this.ifInFav(item)) {
                entity.price = parseFloat(item.price);
                fav[item.name] = entity;
            }
            sessionStorage.setItem('fav', JSON.stringify(fav));
            return true;
        },
        clearStorage: function(){
            this.cart = {};
            this.fav = {};
            sessionStorage.removeItem('cart');
            sessionStorage.removeItem('fav');
        }
    };
})();

var app = {
    init: function(){
        cart.setApp();
        this.showUpdatedCart();
        this.getLocInfo();
        $('.addCart').on('click', this.handleAddToCart);
        $('.cartLink').on('click', this.showCartPage);
        $('.mainLink').on('click', this.showMainPage);
        $('.addFav').on('click', this.handleAddToFav);
        $('.favLink').on('click', this.showFavPage);
        $('.footerContent').on('click', this.handleFooterNav);
        app.handleFavIcon();
    },
    showUpdatedCart: function(){
        $('#cartL').empty().append(cart.cartLength());
        $('#total').empty().append('£'+cart.cartValue());
        $('.totalToPay').empty().append('<h3>£'+cart.totalToPay()+'</h3>');
        $('#favL').empty().append(cart.favLength());
    },
    getLocInfo: function(){
        var requestUrl = "http://ip-api.com/json";
        $.ajax({
            url: requestUrl,
            type: 'GET',
            success: function(json)
            {
                $('.userlocation').empty().append(json.country);
            },
            error: function(err)
            {
                $('.userlocation').empty().append('UK');
                console.log("Request failed, error= " + err);
            }
        });
    },
    getItemInfo: function(){
        var item = {};
        var elm = $('.mains.show');
        item.name = $(elm).find('span.pid')[0].innerHTML;
        item.price = $(elm).find('span.unitprice')[0].innerHTML.slice(1);
        return item;
    },
    getItem: function(elm){
        var item = {};
        var parents = $(elm).siblings();
        item.name = parents[1].innerHTML;
        item.price = parents[2].innerHTML;
        return item;
    },
    showCartItems: function(){
        var busket = cart.getCart();
        var i = 1;
        var html = '<thead><th>#</th><th>Item</th><th>Unit Price</th><th>Quantity</th><th>Total Price</th><th>Remove</th></thead><tbody>';
        for (var key in busket){
            if (busket.hasOwnProperty(key)){
                html += '<tr><td>'+i+'</td><td>'+key+'</td><td>£'+busket[key].unitprice+'</td><td>'+
                    busket[key].quantity+'</td><td>£'+busket[key].price+
                    '</td><td><button class="deleteCart">REMOVE FROM BASKET</button></td></tr>';
                i++;
            }
        }
        html += '</tbody>';
        if (i == 1){
            html = 'No items in cart, continue shopping';
        }
        $('table#cartTable').empty().append(html);
    },
    showFavItems: function(){
        var busket = cart.getFav();
        var i = 1;
        var html = '<thead><th>#</th><th>Item</th><th>Price</th><th>Remove</th></thead><tbody>';
        for (var key in busket){
            if (busket.hasOwnProperty(key)){
                html += '<tr><td>'+i+'</td><td>'+key+'</td><td>£'+busket[key].price+'</td><td><button class="deleteFav">REMOVE FROM FAVORITES</button></td></tr>';
                i++;
            }
        }
        html += '</tbody>';
        if (i == 1){
            html = 'No items in favorites';
        }
        $('table#favTable').empty().append(html);
    },
    handleAddToCart: function(){
        var item = app.getItemInfo();
        cart.addToCart(item);
        app.showUpdatedCart();
    },
    showCartPage: function(){
        $('#cart').removeClass('hide').addClass('show');
        $('#main').removeClass('show').addClass('hide');
        $('#favorites').removeClass('show').addClass('hide');
        $('#resttopfooter').removeClass('hide').addClass('show');
        $('#maintopfooter').removeClass('show').addClass('hide');
        app.showCartItems();
    },
    showMainPage:function(){
        $('#main').removeClass('hide').addClass('show');
        $('#cart').removeClass('show').addClass('hide');
        $('#favorites').removeClass('show').addClass('hide');
        $('#cartL').empty().append(cart.cartLength());
        $('#maintopfooter').removeClass('hide').addClass('show');
        $('#resttopfooter').removeClass('show').addClass('hide');
        app.handleFavIcon();
    },
    handleFavIcon: function(){
       var item = app.getItemInfo();
        var ret = cart.ifInFav(item);
        if (ret){
            $('.addFav').empty().html('<img src="images/favorite-2.png">');
        }else {
            $('.addFav').empty().html('<img src="images/favorite-1.png">');
        } 
    },
    handleAddToFav: function(){
        var item = app.getItemInfo();
        var ret = cart.addToFav(item);
        $('#favL').empty().append(cart.favLength());
        if (ret){
            $('.addFav').empty().html('<img src="images/favorite-2.png">');
        }
    },
    showFavPage: function(e){
        e.preventDefault();
        $('#favorites').removeClass('hide').addClass('show');
        $('#main').removeClass('show').addClass('hide');
        $('#cart').removeClass('show').addClass('hide');
        $('#resttopfooter').removeClass('hide').addClass('show');
        $('#maintopfooter').removeClass('show').addClass('hide');
        app.showFavItems();
    },
    handleFooterNav: function(e){
        e.preventDefault();
        var li = $(e.target).closest('li');
        $(li).siblings().removeClass('active');
        $(li).addClass('active');
        $('#main').find('.mains').removeClass('show').addClass('hide');

        if ($(li).prop('id') == 'list1') $('#main1').addClass('show').removeClass('hide');
        if ($(li).prop('id') == 'list2') $('#main2').addClass('show').removeClass('hide');
        if ($(li).prop('id') == 'list3') $('#main3').addClass('show').removeClass('hide');
        if ($(li).prop('id') == 'list4') $('#main4').addClass('show').removeClass('hide');
        if ($(li).prop('id') == 'list5') $('#main5').addClass('show').removeClass('hide');
        
        app.showMainPage();
    }
};

app.init();

jQuery(document).on("click", '.deleteCart', function(e){
    var item = app.getItem(e.target.parentElement);
    cart.removeFromCart(item.name);
    app.showCartItems();
    app.showUpdatedCart();
});

jQuery(document).on("click", '.deleteFav', function(e){
    var item = app.getItem(e.target.parentElement);
    cart.removeFromFav(item.name);
    app.showFavItems();
    $('#favL').empty().append(cart.favLength());
});



