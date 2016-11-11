'use strict';

import {EventEmitter} from 'events';
import Assign from 'object-assign';
import Immutable from 'immutable';

import Dispatcher from '../dispatcher';
import CartActionTypes from './cartActionTypes';

const CHANGE_EVENT = 'change';
let _cart = Immutable.List();
const Product = Immutable.Record({
    id: 0,
    name: '',
    shortDescription: '',
    description: '',
    price: 0
});

const CartStore = Assign({}, EventEmitter.prototype, {

    getCart () {
        return _cart.toJS();
    },

    emitChange () {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener (callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }

});

Dispatcher.register((action) => {
    switch (action.type) {
        case CartActionTypes.ADD:
            _cart = _cart.push(new Product(action.product));

            CartStore.emitChange();
            break;

        case CartActionTypes.CLEAR:
            _cart = _cart.clear();

            CartStore.emitChange();
            break;

        case CartActionTypes.REMOVE:
            _cart = _cart.filter(product => product.id !== action.productId);

            CartStore.emitChange();
            break;
    }
});

export default CartStore;
