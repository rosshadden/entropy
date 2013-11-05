var $__getProtoParent = function(superClass) {
  if (typeof superClass === 'function') {
    var prototype = superClass.prototype;
    if (Object(prototype) === prototype || prototype === null) return superClass.prototype;
  }
  if (superClass === null) return null;
  throw new TypeError();
}, $__getDescriptors = function(object) {
  var descriptors = {}, name, names = Object.getOwnPropertyNames(object);
  for (var i = 0; i < names.length; i++) {
    var name = $traceurRuntime.elementGet(names, i);
    $traceurRuntime.elementSet(descriptors, name, Object.getOwnPropertyDescriptor(object, name));
  }
  return descriptors;
}, $__createClass = function(object, staticObject, protoParent, superClass, hasConstructor) {
  var ctor = object.constructor;
  if (typeof superClass === 'function') ctor.__proto__ = superClass;
  if (!hasConstructor && protoParent === null) ctor = object.constructor = function() {};
  var descriptors = $__getDescriptors(object);
  descriptors.constructor.enumerable = false;
  ctor.prototype = Object.create(protoParent, descriptors);
  Object.defineProperties(ctor, $__getDescriptors(staticObject));
  return ctor;
}, $__toObject = function(value) {
  if (value == null) throw TypeError();
  return Object(value);
}, $__spread = function() {
  var rv = [], k = 0;
  for (var i = 0; i < arguments.length; i++) {
    var value = $__toObject($traceurRuntime.elementGet(arguments, i));
    for (var j = 0; j < value.length; j++) {
      $traceurRuntime.elementSet(rv, k++, $traceurRuntime.elementGet(value, j));
    }
  }
  return rv;
};
export var Set = function($__super) {
  'use strict';
  var $__proto = $__getProtoParent($__super);
  var $Set = ($__createClass)({
    constructor: function() {
      var $__9;
      for (var args = [], $__1 = 0; $__1 < arguments.length; $__1++) $traceurRuntime.elementSet(args, $__1, $traceurRuntime.elementGet(arguments, $__1));
      ($__9 = this).add.apply($__9, $__toObject(args));
    },
    get type() {
      return "set";
    },
    has: function(element) {
      return !!~this.indexOf(element);
    },
    add: function() {
      for (var elements = [], $__2 = 0; $__2 < arguments.length; $__2++) $traceurRuntime.elementSet(elements, $__2, $traceurRuntime.elementGet(arguments, $__2));
      elements.forEach((function(element) {
        if (!this.has(element)) {
          Array.prototype.push.call(this, element);
        }
      }).bind(this));
      return this;
    },
    remove: function() {
      for (var elements = [], $__3 = 0; $__3 < arguments.length; $__3++) $traceurRuntime.elementSet(elements, $__3, $traceurRuntime.elementGet(arguments, $__3));
      elements.forEach((function(element) {
        if (this.has(element)) {
          Array.prototype.splice.call(this, this.indexOf(element), 1);
        }
      }).bind(this));
      return this;
    },
    splice: function() {
      for (var args = [], $__4 = 0; $__4 < arguments.length; $__4++) $traceurRuntime.elementSet(args, $__4, $traceurRuntime.elementGet(arguments, $__4));
      var spliced = Array.prototype.splice.apply(this, args);
      return new (Function.prototype.bind.apply(Set, $__spread([null], spliced)))();
    },
    empty: function() {
      this.splice(0, this.length);
      return this;
    },
    slice: function() {
      var begin = $traceurRuntime.elementGet(arguments, 0) !== (void 0) ? $traceurRuntime.elementGet(arguments, 0): 0;
      var end = $traceurRuntime.elementGet(arguments, 1) !== (void 0) ? $traceurRuntime.elementGet(arguments, 1): Infinity;
      if (begin < 0) begin += this.length;
      if (end < 0) end += this.length;
      return this.filter((function(element, e) {
        return (e >= begin && e < end);
      }));
    },
    map: function(callback, self) {
      if (this == null) throw new TypeError(" this is null or not defined");
      var O = Object(this);
      var len = O.length >>> 0;
      if (typeof callback !== "function") {
        throw new TypeError(callback + " is not a function");
      }
      var s = new Set();
      var k = 0;
      while (k < len) {
        try {
          throw undefined;
        } catch (mappedValue) {
          try {
            throw undefined;
          } catch (kValue) {
            ;
            if ($traceurRuntime.elementHas(O, k)) {
              kValue = $traceurRuntime.elementGet(O, k);
              mappedValue = callback.call(self, kValue, k, O);
              s.add(mappedValue);
            }
            k++;
          }
        }
      }
      return s;
    },
    filter: function(callback, self) {
      if (this == null) throw new TypeError();
      if (typeof callback !== "function") throw new TypeError();
      var set = new Set();
      var O = Object(this);
      for (var $i in O) {
        try {
          throw undefined;
        } catch (i) {
          i = $i;
          if (O.hasOwnProperty(i) && callback.call(self, $traceurRuntime.elementGet(O, i), i, O)) {
            set.add($traceurRuntime.elementGet(O, i));
          }
        }
      }
      return set;
    },
    union: function() {
      for (var sets = [], $__5 = 0; $__5 < arguments.length; $__5++) $traceurRuntime.elementSet(sets, $__5, $traceurRuntime.elementGet(arguments, $__5));
      var s = this.slice();
      sets.forEach((function(set) {
        return set.forEach((function(element) {
          return s.add(element);
        }));
      }));
      return s;
    },
    intersection: function() {
      for (var sets = [], $__6 = 0; $__6 < arguments.length; $__6++) $traceurRuntime.elementSet(sets, $__6, $traceurRuntime.elementGet(arguments, $__6));
      return this.slice().filter((function(element) {
        return sets.every((function(set) {
          if (Array.isArray(set)) set = new (Function.prototype.bind.apply(Set, $__spread([null], set)))();
          return set && set.type === "set" && set.has(element);
        }));
      }));
    },
    difference: function() {
      for (var sets = [], $__7 = 0; $__7 < arguments.length; $__7++) $traceurRuntime.elementSet(sets, $__7, $traceurRuntime.elementGet(arguments, $__7));
      var s = this.slice();
      sets.forEach((function(set) {
        return set.forEach((function(element) {
          return s.remove(element);
        }));
      }));
      return s;
    },
    symmetricDifference: function() {
      for (var sets = [], $__8 = 0; $__8 < arguments.length; $__8++) $traceurRuntime.elementSet(sets, $__8, $traceurRuntime.elementGet(arguments, $__8));
      return new (Function.prototype.bind.apply(Set, $__spread([null], sets)))().reduce((function(result, set) {
        return result.union(set).difference(result.intersection(set));
      }), this);
    },
    pop: function() {},
    push: function() {},
    shift: function() {},
    unshift: function() {},
    concat: function() {},
    toArray: function() {
      return Array.prototype.slice.call(this);
    },
    toString: function() {
      return (!this.length) ? "∅": ("{ " + this.join(", ") + " }");
    }
  }, {}, $__proto, $__super, true);
  return $Set;
}(Array);
