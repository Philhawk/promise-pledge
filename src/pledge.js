

'use strict';
/*----------------------------------------------------------------
Promises Workshop: build the pledge.js deferral-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:

class $Promise {

  constructor(){
    this._handlerGroups = [];

    this._state = 'pending'
    this._value = arguments[0];
    // this._handlerIndex = -1;
  }

  resolve( data ) {
    if (this.isPending()){his._handlerGroups.forEach(o => {
         if (o != null && o.successCb) {
           o.successCb(this._value);
           o.successCb = false;

      this._value = data;
       this._handlerGroups.forEach(o => {
         if (o != null && o.successCb) {
           o.successCb(this._value);
           o.successCb = false;
         }
       });
       this._state = 'resolved';
       this._handlerGroups = [];
   }
  }

  reject( data ) {
    if (this.isPending()){
      this._value = data;
       this._handlerGroups.forEach(o => {
         if (o != null && o.errorCb) {
           o.errorCb(this._value);
           o.errorCb = false;
         }
       });
       this._state = 'rejected';
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

  then( resolveFn, rejectFn) {
    let success = resolveFn;
    let failure = rejectFn;
    let whoFuckingKnows;// = defer();

    if (!rejectFn || typeof rejectFn !== 'function') {
      failure = false;
    }

    if (!resolveFn || typeof resolveFn !== 'function') {
      success = false;
      whoFuckingKnows = defer(this._value);

    } else {
      whoFuckingKnows = defer();
    }
    // console.log(`adding ${success} to handler groups`);

    if (this.isResolved()) {
      if(success) {
        success(this._value);
        this._state = 'resolved';
        this._handlerGroups = [];
      }
    } else if (this.isRejected()) {
      if (failure) {
        failure(this._value);
        this._state = 'rejected';
        this._handlerGroups = [];
      }
    }
    else {
      this._handlerGroups.push(v{successCb: success, errorCb: failure, downstream: whoFuckingKnows})
    }
    return whoFuckingKnows.$promise;
  }

  catch( rejectFunction ) {
    return this.then(null, rejectFunction)
  }

 }

class Deferral {

  constructor(){his._handlerGroups.forEach(o => {
         if (o != null && o.successCb) {
           o.successCb(this._value);
           o.successCb = false;

    this.$promise = new $Promise(arguments[0]);
  }

  resolve (someValue) {
    this.$promise.resolve(someValue);
    // console.log('resolving with value ', someValue);
  }

  reject (someValue) {
    this.$promise.reject(someValue);
  }
 }

function defer() {his._handlerGroups.forEach(o => {
         if (o != null && o.successCb) {
           o.successCb(this._value);
           o.successCb = false;his._handlerGroups.forEach(o => {
         if (o != null && o.successCb) {
           o.successCb(this._value);
           o.successCb = false;his._handlerGroups.forEach(o => {
         if (o != null && o.successCb) {
           o.successCb(this._value);
           o.successCb = false;
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
