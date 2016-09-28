'use strict';
/*----------------------------------------------------------------
Promises Workshop: build the pledge.js deferral-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:

class $Promise {

  constructor() {
    this._handlerGroups = [];
    this._state = 'pending';
    this._value = undefined;
  }


  resolve(data) {
    if (this.isPending()) {
      this._value = data;
      this._handlerGroups.forEach(o => {
        if (o && o.successCb && typeof o.successCb === 'function') {
          try {
            o.downstream.resolve(o.successCb(this._value));
          } catch(err) {
            o.downstream.reject(err);
          }
        } else if (o && o.downstream) {
          o.downstream.resolve(this._value);
        }
      });
      this._state = 'resolved';
      this._handlerGroups = [];
    }
  }

  reject(data) {
    if (this.isPending()) {
      this._value = data;
      this._handlerGroups.forEach(o => {
        if (o && o.errorCb && typeof o.errorCb === 'function') {
          try {
            o.downstream.resolve(o.errorCb(this._value));
          } catch(err) {
            o.downstream.reject(err);
          }
        } else if (o && o.downstream) {
          o.downstream.reject(this._value);
        }
      });
      this._state = 'rejected';
      this._handlerGroups = [];
    }
  }

  isPending() {
    return this._state === 'pending';
  }

  isResolved() {
    return this._state === 'resolved'
  }

  isNotResolved() {
    return this._state !== 'resolved'
  }

  isNotRejected() {
    return this._state !== 'rejected'
  }

  isRejected() {
    return this._state === 'rejected'
  }

  then(resolveFn, rejectFn) {
    let success = resolveFn;
    let failure = rejectFn;
    let newDef = defer();

    if (!rejectFn || typeof rejectFn !== 'function') {
      failure = false;
    }

    if (!resolveFn || typeof resolveFn !== 'function') {
      success = false;
    }

    // console.log(`adding ${success} to handler groups`);

    if (this.isResolved()) {
      if (success) {
        success(this._value);
        this._state = 'resolved';
        this._handlerGroups = [];
        newDef.resolve(this._value);
      }
    } else if (this.isRejected()) {
      if (failure) {
        failure(this._value);
        this._state = 'rejected';
        this._handlerGroups = [];
        newDef.reject(this._value);
      }
    } else {
      this._handlerGroups.push({
        successCb: success,
        errorCb: failure,
        downstream: newDef
      });
    }
    return newDef.$promise;
  }

  catch(rejectFunction) {
    return this.then(null, rejectFunction);
  }
}

class Deferral {

  constructor() {

    this.$promise = new $Promise();
  }

  resolve(someValue) {
    this.$promise.resolve(someValue);
    // console.log('resolving with value ', someValue);
  }

  reject(someValue) {
    this.$promise.reject(someValue);
  }
}

function defer() {
  return new Deferral();
};



/*-------------------------------------------------------
The spec was designed to work with Test'Em, so we don't
actually use module.exports. But here it is for reference:

module.exports = {
  defer: defer,
};

So in a Node-based project we could write things like this:

var pledge = require('pledge');
…
var myDeferral = pledge.defer();
var myPromise1 = myDeferral.$promise;
--------------------------------------------------------*/
