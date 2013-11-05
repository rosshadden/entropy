var $__getDescriptors = function(object) {
  var descriptors = {}, name, names = Object.getOwnPropertyNames(object);
  for (var i = 0; i < names.length; i++) {
    var name = $traceurRuntime.elementGet(names, i);
    $traceurRuntime.elementSet(descriptors, name, Object.getOwnPropertyDescriptor(object, name));
  }
  return descriptors;
}, $__createClassNoExtends = function(object, staticObject) {
  var ctor = object.constructor;
  Object.defineProperty(object, 'constructor', {enumerable: false});
  ctor.prototype = object;
  Object.defineProperties(ctor, $__getDescriptors(staticObject));
  return ctor;
}, $__getProtoParent = function(superClass) {
  if (typeof superClass === 'function') {
    var prototype = superClass.prototype;
    if (Object(prototype) === prototype || prototype === null) return superClass.prototype;
  }
  if (superClass === null) return null;
  throw new TypeError();
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
(function() {
  "use strict";
  var $__1;
  var $___hooks = $traceurRuntime.createName();
  var hooks = ($__1 = {}, Object.defineProperty($__1, $___hooks, {
    value: {},
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__1, "on", {
    value: function(event, handler, plugin) {
      if (!($traceurRuntime.elementHas($traceurRuntime.getProperty(this, $___hooks), event))) $traceurRuntime.elementSet($traceurRuntime.getProperty(this, $___hooks), event, []);
      $traceurRuntime.elementGet($traceurRuntime.getProperty(this, $___hooks), event).push({
        handler: handler,
        plugin: plugin
      });
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__1, "trigger", {
    value: function(event) {
      for (var data = [], $__2 = 1; $__2 < arguments.length; $__2++) $traceurRuntime.elementSet(data, $__2 - 1, $traceurRuntime.elementGet(arguments, $__2));
      if ($traceurRuntime.elementHas($traceurRuntime.getProperty(this, $___hooks), event)) {
        $traceurRuntime.elementGet($traceurRuntime.getProperty(this, $___hooks), event).forEach((function(hook) {
          return hook.handler.apply(hook.plugin, data);
        }));
      }
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__1, "list", {
    get: function() {
      return $traceurRuntime.getProperty(this, $___hooks);
    },
    configurable: true,
    enumerable: true
  }), $__1);
  var isSet = (function() {
    var value = $traceurRuntime.elementGet(arguments, 0) !== (void 0) ? $traceurRuntime.elementGet(arguments, 0): null;
    return value != null && value.type === "set";
  });
  var isElement = (function() {
    var value = $traceurRuntime.elementGet(arguments, 0) !== (void 0) ? $traceurRuntime.elementGet(arguments, 0): null;
    return value != null && value.type === "element";
  });
  var Element = function() {
    'use strict';
    var $Element = ($__createClassNoExtends)({
      constructor: function() {
        var $__14;
        var value = $traceurRuntime.elementGet(arguments, 0) !== (void 0) ? $traceurRuntime.elementGet(arguments, 0): null;
        for (var args = [], $__3 = 1; $__3 < arguments.length; $__3++) $traceurRuntime.elementSet(args, $__3 - 1, $traceurRuntime.elementGet(arguments, $__3));
        Object.defineProperty(this, "data", {
          writable: true,
          enumerable: false,
          configurable: false,
          value: {}
        });
        this.value = value;
        ($__14 = hooks).trigger.apply($__14, $__spread(["element.create", this, value], args));
      },
      get type() {
        return "element";
      },
      toString: function() {
        if (Array.isArray(this.value)) return ("[" + this.value.toString() + "]");
        if (typeof this.value === "object") return ("{" + Object.keys(this.value) + "}");
        return "" + this.value;
      },
      get: function(key) {
        if (typeof key === "undefined") return this.value;
        if (/^!/.test(key)) {
          key = ("" + key).slice(1);
          if (~["type"].indexOf(key)) return $traceurRuntime.elementGet(this, key);
          return $traceurRuntime.elementGet(this.data, key);
        }
        return $traceurRuntime.elementGet(this.value, key);
      },
      set: function(key, value) {
        $traceurRuntime.elementSet(this.value, key, value);
        return this;
      }
    }, {});
    return $Element;
  }();
  var Set = function($__super) {
    'use strict';
    var $__proto = $__getProtoParent($__super);
    var $Set = ($__createClass)({
      constructor: function() {
        var $__14;
        for (var args = [], $__3 = 0; $__3 < arguments.length; $__3++) $traceurRuntime.elementSet(args, $__3, $traceurRuntime.elementGet(arguments, $__3));
        Object.defineProperty(this, "length", {
          enumerable: false,
          configurable: false,
          get: function() {
            return Object.keys(this).filter((function(key) {
              return /^\d+$/.test(key);
            })).length;
          }
        });
        Object.defineProperty(this, "data", {
          writable: true,
          enumerable: false,
          configurable: false,
          value: {}
        });
        hooks.trigger("set.create", this);
        if (args.length)($__14 = this).addAll.apply($__14, $__toObject(args));
      },
      get type() {
        return "set";
      },
      toArray: function() {
        return Array.prototype.slice.call(this);
      },
      toString: function() {
        return (!this.length) ? "∅": ("{ " + this.join(", ") + " }");
      },
      get: function() {
        var index = $traceurRuntime.elementGet(arguments, 0) !== (void 0) ? $traceurRuntime.elementGet(arguments, 0): 0;
        return $traceurRuntime.elementGet(this, index) && $traceurRuntime.elementGet(this, index).value || undefined;
      },
      has: function(value) {
        return !!~this.indexOf(value);
      },
      contains: function(value) {
        return !!this.filter(value).length;
      },
      indexOf: function(value) {
        if (value && value.type === "element") return Array.prototype.indexOf.call(this, value);
        for (var $element in this) {
          try {
            throw undefined;
          } catch (element) {
            element = $element;
            if ($traceurRuntime.elementGet(this, element).value === value) return + element;
          }
        }
        return - 1;
      },
      set: function() {
        for (var args = [], $__4 = 0; $__4 < arguments.length; $__4++) $traceurRuntime.elementSet(args, $__4, $traceurRuntime.elementGet(arguments, $__4));
        return this.forEach(function() {
          var $__14;
          ($__14 = this).set.apply($__14, $__toObject(args));
        });
      },
      add: function(item) {
        var $__14;
        for (var args = [], $__5 = 1; $__5 < arguments.length; $__5++) $traceurRuntime.elementSet(args, $__5 - 1, $traceurRuntime.elementGet(arguments, $__5));
        if (!this.has(item)) {
          if (!isElement(item)) item = new (Function.prototype.bind.apply(Element, $__spread([null, item], args)))();
          Array.prototype.push.call(this, item) - 1;
          ($__14 = hooks).trigger.apply($__14, $__spread(["set.add", this, item], args));
        }
        return this;
      },
      addAll: function() {
        for (var items = [], $__6 = 0; $__6 < arguments.length; $__6++) $traceurRuntime.elementSet(items, $__6, $traceurRuntime.elementGet(arguments, $__6));
        if (items.length === 1 && (Array.isArray($traceurRuntime.elementGet(items, 0)) || isSet($traceurRuntime.elementGet(items, 0)))) items = $traceurRuntime.elementGet(items, 0);
        items.forEach(this.add, this);
        return this;
      },
      remove: function() {
        for (var items = [], $__7 = 0; $__7 < arguments.length; $__7++) $traceurRuntime.elementSet(items, $__7, $traceurRuntime.elementGet(arguments, $__7));
        items.forEach((function(item) {
          if (this.has(item)) {
            Array.prototype.splice.call(this, this.indexOf(item), 1);
            hooks.trigger("set.remove", this, item);
          }
        }).bind(this));
        return this;
      },
      splice: function() {
        for (var args = [], $__8 = 0; $__8 < arguments.length; $__8++) $traceurRuntime.elementSet(args, $__8, $traceurRuntime.elementGet(arguments, $__8));
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
        return this.filter((function(item, i) {
          return (i >= begin && i < end);
        }));
      },
      map: function(to) {
        if (typeof to === "function") {
          try {
            throw undefined;
          } catch (k) {
            try {
              throw undefined;
            } catch (s) {
              var O = Object(this);
              var len = O.length >>> 0;
              s = new Set();
              k = 0;
              while (k < len) {
                try {
                  throw undefined;
                } catch (mappedValue) {
                  ;
                  if ($traceurRuntime.elementHas(O, k)) {
                    mappedValue = to.call(self || $traceurRuntime.elementGet(O, k), $traceurRuntime.elementGet(O, k).value, k, this);
                    s.add(mappedValue);
                  }
                  k++;
                }
              }
              return s;
            }
          }
        } else if (~["string", "number", "date"].indexOf(typeof to)) {
          return this.toArray().map((function(element) {
            return element.get(to);
          }));
        } else if (Array.isArray(to)) {
          return this.toArray().map((function(element) {
            return to.reduce((function(output, property) {
              $traceurRuntime.elementSet(output, property, element.get(property));
              return output;
            }), {});
          }));
        } else if (typeof to === "object") {
          return this.toArray().map((function(element) {
            return Object.keys(to).reduce((function(output, property) {
              if (property == $traceurRuntime.elementGet(to, property)) {
                $traceurRuntime.elementSet(output, property, element.get(property));
              } else {
                $traceurRuntime.elementSet(output, property, $traceurRuntime.elementGet(to, property).replace(/\[([\w .-]*)\]/g, function(string, $property) {
                  return element.get($property) || "";
                }));
              }
              return output;
            }), {});
          }));
        }
        return this.toArray().map((function(element) {
          return element.value;
        }));
      },
      filter: function() {
        for (var selectors = [], $__9 = 0; $__9 < arguments.length; $__9++) $traceurRuntime.elementSet(selectors, $__9, $traceurRuntime.elementGet(arguments, $__9));
        var s;
        if (typeof $traceurRuntime.elementGet(selectors, 0) === "function") {
          try {
            throw undefined;
          } catch (O) {
            s = new Set();
            O = Object(this);
            for (var $i in O) {
              try {
                throw undefined;
              } catch (i) {
                i = $i;
                if (O.hasOwnProperty(i) && $traceurRuntime.elementGet(selectors, 0).call($traceurRuntime.elementGet(selectors, 1) || $traceurRuntime.elementGet(O, i), $traceurRuntime.elementGet(O, i).value, i, this)) {
                  s.add($traceurRuntime.elementGet(O, i));
                }
              }
            }
          }
        } else {
          try {
            throw undefined;
          } catch (existRelevantPlugins) {
            s = this.slice();
            existRelevantPlugins = entropy.plugins.map().some((function(plugin) {
              var $__14;
              if (typeof plugin.filter === "function") {
                try {
                  throw undefined;
                } catch (match) {
                  match = ($__14 = plugin).relevance.apply($__14, $__toObject(selectors));
                  if (match && match.length) {
                    s = s.filter(function(item, i) {
                      var $__14;
                      return ($__14 = plugin.filter).call.apply($__14, $__spread([this, item, i], match));
                    });
                    return true;
                  }
                }
              }
            }));
            if (!existRelevantPlugins) s = new Set();
          }
        }
        return s;
      },
      forEach: function(fn, self) {
        var e, length = this.length;
        for (e = 0; e < length; e++) {
          try {
            throw undefined;
          } catch (element) {
            element = $traceurRuntime.elementGet(this, e);
            if (typeof fn === "function") {
              try {
                fn.call(self || element, element.value, e, this);
              } catch (error) {
                fn.call(self || null, element.value, e, this);
              }
            }
          }
        }
        return this;
      },
      every: function(fn, self) {
        var e, length = this.length;
        for (e = 0; e < length; e++) {
          try {
            throw undefined;
          } catch (element) {
            element = $traceurRuntime.elementGet(this, e);
            if (typeof fn === "function") {
              if (!fn.call(self || element, element.value, e, this)) return false;
            }
          }
        }
        return true;
      },
      some: function(fn, self) {
        var e, length = this.length;
        for (e = 0; e < length; e++) {
          try {
            throw undefined;
          } catch (element) {
            element = $traceurRuntime.elementGet(this, e);
            if (typeof fn === "function") {
              if (fn.call(self || element, element.value, e, this)) return true;
            }
          }
        }
        return false;
      },
      reduce: function(fn, initial) {
        if (typeof fn === "function") {
          var i, value, length = this.length >>> 0, isValueSet = false;
          if (typeof initial !== "undefined") {
            value = initial;
            isValueSet = true;
          }
          for (i = 0; i < length; i++) {
            if (this.hasOwnProperty(i)) {
              if (isValueSet) {
                value = fn.call($traceurRuntime.elementGet(this, i), value, $traceurRuntime.elementGet(this, i).value, i, this);
              } else {
                value = $traceurRuntime.elementGet(this, i).value;
                isValueSet = true;
              }
            }
          }
          if (!isValueSet) {
            throw new TypeError("Reduce of empty array with no initial value");
          }
        }
        return value;
      },
      reduceRight: function(fn, initial) {
        if (typeof fn === "function") {
          var i, value, length = this.length >>> 0, isValueSet = false;
          if (typeof initial !== "undefined") {
            value = initial;
            isValueSet = true;
          }
          for (i = length; i >= 0; i--) {
            if (this.hasOwnProperty(i)) {
              if (isValueSet) {
                value = fn.call($traceurRuntime.elementGet(this, i), value, $traceurRuntime.elementGet(this, i).value, i, this);
              } else {
                value = $traceurRuntime.elementGet(this, i).value;
                isValueSet = true;
              }
            }
          }
          if (!isValueSet) {
            throw new TypeError("Reduce of empty array with no initial value");
          }
        }
        return value;
      },
      union: function() {
        for (var sets = [], $__10 = 0; $__10 < arguments.length; $__10++) $traceurRuntime.elementSet(sets, $__10, $traceurRuntime.elementGet(arguments, $__10));
        var s = this.slice();
        sets.forEach((function(set) {
          return set.forEach(function(item) {
            s.add(this);
          });
        }));
        return s;
      },
      intersection: function() {
        for (var sets = [], $__11 = 0; $__11 < arguments.length; $__11++) $traceurRuntime.elementSet(sets, $__11, $traceurRuntime.elementGet(arguments, $__11));
        return this.slice().filter(function(item) {
          sets.every((function(set) {
            if (Array.isArray(set)) set = new (Function.prototype.bind.apply(Set, $__spread([null], set)))();
            return set && set.type === "set" && set.has(this);
          }).bind(this));
        });
      },
      difference: function() {
        for (var sets = [], $__12 = 0; $__12 < arguments.length; $__12++) $traceurRuntime.elementSet(sets, $__12, $traceurRuntime.elementGet(arguments, $__12));
        var s = this.slice();
        sets.forEach((function(set) {
          return set.forEach(function(item) {
            s.remove(this);
          });
        }));
        return s;
      },
      symmetricDifference: function() {
        for (var sets = [], $__13 = 0; $__13 < arguments.length; $__13++) $traceurRuntime.elementSet(sets, $__13, $traceurRuntime.elementGet(arguments, $__13));
        return new (Function.prototype.bind.apply(Set, $__spread([null], sets)))().reduce((function(result, set) {
          return result.union(set).difference(result.intersection(set));
        }), this);
      },
      pop: function() {},
      push: function() {},
      shift: function() {},
      unshift: function() {},
      concat: function() {}
    }, {}, $__proto, $__super, true);
    return $Set;
  }(Array);
  var entropy = (function() {
    var entropy = new Set();
    var writable = false, configurable = false, enumerable = false;
    Object.defineProperties(entropy, {
      version: {
        value: 0.7,
        writable: writable,
        configurable: configurable,
        enumerable: enumerable
      },
      Set: {
        value: Set,
        writable: writable,
        configurable: configurable,
        enumerable: enumerable
      },
      Element: {
        value: Element,
        writable: writable,
        configurable: configurable,
        enumerable: enumerable
      },
      plugins: {
        value: new Set(),
        writable: writable,
        configurable: configurable,
        enumerable: enumerable
      },
      hooks: {
        value: hooks,
        writable: true,
        configurable: configurable,
        enumerable: enumerable
      },
      create: {
        value: (function() {
          for (var items = [], $__13 = 0; $__13 < arguments.length; $__13++) $traceurRuntime.elementSet(items, $__13, $traceurRuntime.elementGet(arguments, $__13));
          return new (Function.prototype.bind.apply(Set, $__spread([null], items)))();
        }),
        writable: writable,
        configurable: configurable,
        enumerable: enumerable
      },
      of: {
        value: (function() {
          for (var items = [], $__12 = 0; $__12 < arguments.length; $__12++) $traceurRuntime.elementSet(items, $__12, $traceurRuntime.elementGet(arguments, $__12));
          return new (Function.prototype.bind.apply(Set, $__spread([null], items)))();
        }),
        writable: writable,
        configurable: configurable,
        enumerable: enumerable
      },
      from: {
        value: (function(iterable) {
          if (iterable == null) iterable = [];
          var s = new (Function.prototype.bind.apply(Set, $__spread([null], iterable)))();
          if (!Array.isArray(iterable)) {
            for (var $item in iterable) {
              try {
                throw undefined;
              } catch (item) {
                item = $item;
                s.add($traceurRuntime.elementGet(iterable, item), item);
              }
            }
          }
          return s;
        }),
        writable: writable,
        configurable: configurable,
        enumerable: enumerable
      },
      register: {
        value: function(name, plugin) {
          if (!plugin.type) plugin.type = "string";
          if (!plugin.relevance) {
            plugin.relevance = function() {
              for (var selectors = [], $__11 = 0; $__11 < arguments.length; $__11++) $traceurRuntime.elementSet(selectors, $__11, $traceurRuntime.elementGet(arguments, $__11));
              var match = ("" + $traceurRuntime.elementGet(selectors, 0)).match(plugin.check);
              return (selectors.length === 1 && (plugin.type === "array" && Array.isArray($traceurRuntime.elementGet(selectors, 0)) || plugin.type === typeof $traceurRuntime.elementGet(selectors, 0)) && match && match.slice(1) || []);
            };
          }
          this.plugins.add(plugin);
          for (var $hook in plugin.hooks) {
            try {
              throw undefined;
            } catch (hook) {
              hook = $hook;
              hooks.on(hook, $traceurRuntime.elementGet(plugin.hooks, hook), plugin);
            }
          }
          if (plugin.init) plugin.init();
          return this;
        },
        writable: writable,
        configurable: configurable,
        enumerable: enumerable
      }
    });
    return entropy;
  })();
  if (typeof module !== "undefined" && typeof require !== "undefined") {
    module.exports = entropy;
  } else {
    window.entropy = window.S = entropy;
  }
})();
