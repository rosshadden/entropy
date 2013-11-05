(function() {
  "use strict";
  entropy.register("all", {
    check: /^\*$/,
    filter: function() {
      return true;
    }
  });
  entropy.register("id", {
    check: /^#([\w\-_]+)$/,
    hooks: {"element.create": function(element, value) {
        for (var args = [], $__15 = 2; $__15 < arguments.length; $__15++) $traceurRuntime.elementSet(args, $__15 - 2, $traceurRuntime.elementGet(arguments, $__15));
        args.forEach((function(arg) {
          element.data.id = "";
          var match = ("" + arg).match(this.check);
          if (match) element.data.id = $traceurRuntime.elementGet(match, 1);
        }).bind(this));
      }},
    filter: function(item, i, $id) {
      return this.data.id === $id;
    }
  });
  entropy.register("class", {
    check: /^\.([\w\-_]+)$/,
    hooks: {"element.create": function(element, value) {
        for (var args = [], $__16 = 2; $__16 < arguments.length; $__16++) $traceurRuntime.elementSet(args, $__16 - 2, $traceurRuntime.elementGet(arguments, $__16));
        element.data.classes = [];
        args.forEach((function(arg) {
          var match = ("" + arg).match(this.check);
          if (match) element.data.classes.push($traceurRuntime.elementGet(match, 1));
        }).bind(this));
      }},
    init: function() {
      entropy.Element.prototype.hasClass = function(klass) {
        return !!~this.data.classes.indexOf(klass);
      };
      entropy.Element.prototype.addClass = function() {
        for (var classes = [], $__17 = 0; $__17 < arguments.length; $__17++) $traceurRuntime.elementSet(classes, $__17, $traceurRuntime.elementGet(arguments, $__17));
        classes.forEach((function(klass) {
          if (!this.hasClass(klass)) this.data.classes.push(klass);
        }).bind(this));
        return this;
      };
      entropy.Element.prototype.removeClass = function() {
        for (var classes = [], $__18 = 0; $__18 < arguments.length; $__18++) $traceurRuntime.elementSet(classes, $__18, $traceurRuntime.elementGet(arguments, $__18));
        classes.forEach((function(klass) {
          var index = this.data.classes.indexOf(klass);
          if (!!~index) this.data.classes.splice(index, 1);
        }).bind(this));
        return this;
      };
      entropy.Element.prototype.toggleClass = function() {
        for (var classes = [], $__19 = 0; $__19 < arguments.length; $__19++) $traceurRuntime.elementSet(classes, $__19, $traceurRuntime.elementGet(arguments, $__19));
        classes.forEach((function(klass) {
          var hasClass = this.hasClass(klass);
          if (!hasClass) return this.addClass(klass);
          if (hasClass) return this.removeClass(klass);
        }).bind(this));
        return this;
      };
    },
    filter: function(item, i, $class) {
      return this.hasClass($class);
    }
  });
  entropy.register("key", {
    check: /^([\w\-_]+)$/,
    hooks: {"element.create": function(element, value) {
        for (var args = [], $__19 = 2; $__19 < arguments.length; $__19++) $traceurRuntime.elementSet(args, $__19 - 2, $traceurRuntime.elementGet(arguments, $__19));
        args.forEach((function(arg) {
          element.data.key = "";
          var match = ("" + arg).match(this.check);
          if (match) element.data.key = $traceurRuntime.elementGet(match, 1);
        }).bind(this));
      }},
    filter: function(item, i, $key) {
      return this.data.key === $key;
    }
  });
  entropy.register("property-presence", {
    check: /^\[\s*(!?[\w+\-]+)\s*\]$/,
    filter: function(item, i, $property) {
      return $traceurRuntime.elementHas(item, $property);
    }
  });
  entropy.register("property-comparison", {
    check: /^\[\s*(!?[\w\-_]+)\s*(!?)(=|\^=|\$=|\*=|<|>)(=?)\s*([""]?)(.*)\5\s*\]$/,
    filter: function(item, i, $property, $not, $operator, $isStrict, $quote, $value) {
      var $__26;
      var property = $traceurRuntime.elementGet(item, $property);
      var test = ($isStrict) ? property: !!item && ("" + property).toLowerCase(), control = ($isStrict) ? $value: ("" + $value).toLowerCase(), isNegated = !!$not;
      var cases = {
        "=": function() {
          return test == control;
        },
        "^=": function() {
          var regex = new RegExp("^" + control);
          return regex.test(test, ($isStrict) ? "": "i");
        },
        "$=": function() {
          var regex = new RegExp(control + "$");
          return regex.test(test, ($isStrict) ? "": "i");
        },
        "*=": function() {
          var regex = new RegExp(control);
          return regex.test(test, ($isStrict) ? "": "i");
        },
        "<": function() {
          return ($isStrict) ? parseInt(test, 10) <= parseInt(control, 10): parseInt(test, 10) < parseInt(control, 10);
        },
        ">": function() {
          return ($isStrict) ? parseInt(test, 10) >= parseInt(control, 10): parseInt(test, 10) > parseInt(control, 10);
        }
      };
      var result = ($__26 = cases, $traceurRuntime.elementGet($__26, $operator).call($__26));
      return (isNegated) ? !result: result;
    }
  });
  entropy.register("type", {
    check: /^~(\w+)$/,
    filter: function(item, i, $type) {
      var type = Object.prototype.toString.call(item).replace(/\[object (\w+)\]/, "$1");
      return type.toLowerCase() === $type.toLowerCase();
    }
  });
  entropy.register("index", {
    check: /^(\d+)$/,
    type: "number",
    filter: function(item, i, $index) {
      return i == $index;
    }
  });
  entropy.register("children", {
    hooks: {"element.create": function(element, value) {
        for (var args = [], $__18 = 2; $__18 < arguments.length; $__18++) $traceurRuntime.elementSet(args, $__18 - 2, $traceurRuntime.elementGet(arguments, $__18));
        var children;
        if (typeof value === "object" && value !== null) {
          children = entropy.from (value);
        } else {
          children = new entropy.Set();
        }
        element.data.children = children;
      }},
    init: function() {
      entropy.Set.prototype.find = function() {
        for (var args = [], $__17 = 0; $__17 < arguments.length; $__17++) $traceurRuntime.elementSet(args, $__17, $traceurRuntime.elementGet(arguments, $__17));
        var s = new entropy.Set();
        var addChildren = function() {
          var $__25;
          var filter = ($__25 = this).filter.apply($__25, $__toObject(args));
          s.addAll(filter);
          this.forEach((function(element) {
            if (element != null && element.data != null) {
              addChildren.call(element.data.children);
            }
          }));
        };
        addChildren.call(this);
        return s;
      };
      entropy.Set.prototype.cd = function() {
        var $__25;
        for (var selectors = [], $__20 = 0; $__20 < arguments.length; $__20++) $traceurRuntime.elementSet(selectors, $__20, $traceurRuntime.elementGet(arguments, $__20));
        var s = ($__25 = this).filter.apply($__25, $__toObject(selectors));
        if (s.length) return $traceurRuntime.elementGet(s, 0).data.children;
        return new entropy.Element(new Error("The requested child does not exist."));
      };
      entropy.Element.prototype.cd = function() {
        var $__25;
        for (var selectors = [], $__21 = 0; $__21 < arguments.length; $__21++) $traceurRuntime.elementSet(selectors, $__21, $traceurRuntime.elementGet(arguments, $__21));
        var children = ($__25 = this.data.children).filter.apply($__25, $__toObject(selectors));
        if (children.length) return $traceurRuntime.elementGet(children, 0);
        return new entropy.Element(new Error("The requested child does not exist."));
      };
      entropy.Element.prototype.addChild = function() {
        var $__25;
        for (var args = [], $__22 = 0; $__22 < arguments.length; $__22++) $traceurRuntime.elementSet(args, $__22, $traceurRuntime.elementGet(arguments, $__22));
        ($__25 = this.data.children).add.apply($__25, $__toObject(args));
        return this;
      };
      entropy.Element.prototype.addChildren = function() {
        var $__25;
        for (var args = [], $__23 = 0; $__23 < arguments.length; $__23++) $traceurRuntime.elementSet(args, $__23, $traceurRuntime.elementGet(arguments, $__23));
        ($__25 = this.data.children).addAll.apply($__25, $__toObject(args));
        return this;
      };
      entropy.Element.prototype.removeChild = function() {
        var $__25;
        for (var args = [], $__24 = 0; $__24 < arguments.length; $__24++) $traceurRuntime.elementSet(args, $__24, $traceurRuntime.elementGet(arguments, $__24));
        ($__25 = this.data.children).remove.apply($__25, $__toObject(args));
        return this;
      };
    }
  });
})();
