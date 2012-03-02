(function() {
  var ElmStyleProp, ElmTransProp, Prop, TransFormProp,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Prop = (function() {

    function Prop(prop_name, value) {
      this.prop_name = prop_name;
      this.value = value;
    }

    Prop.prototype.getPropName = function() {
      return this.prop_name;
    };

    Prop.prototype.getProp = function() {
      var ret;
      ret = {};
      ret[this.getPropName()] = this.getValue();
      return ret;
    };

    Prop.prototype.getValue = function() {
      return this.value;
    };

    Prop.prototype.setValue = function(val) {
      return this.value = val;
    };

    Prop.prototype.toCss = function() {
      return this.getPropName() + ":" + this.getValue() + ";";
    };

    Prop.prototype.toDataObj = function() {
      return {
        selector: void 0,
        prop: this.getPropName(),
        val: this.getValue()
      };
    };

    return Prop;

  })();

  ElmStyleProp = (function(_super) {

    __extends(ElmStyleProp, _super);

    function ElmStyleProp(elm, prop_name, getfn, setfn) {
      this.elm = elm;
      this.prop_name = prop_name;
      this.getfn = getfn;
      this.setfn = setfn;
    }

    ElmStyleProp.prototype.getValue = function() {
      return this.getfn($(this.elm));
    };

    ElmStyleProp.prototype.setValue = function(val) {
      return this.setfn($(this.elm), val);
    };

    ElmStyleProp.prototype.toDataObj = function() {
      return {
        selector: this.elm,
        prop: this.getPropName(),
        val: this.getValue()
      };
    };

    return ElmStyleProp;

  })(Prop);

  ElmTransProp = (function(_super) {

    __extends(ElmTransProp, _super);

    function ElmTransProp() {
      ElmTransProp.__super__.constructor.apply(this, arguments);
    }

    ElmTransProp.prototype.toCss = function() {
      return this.getPropName() + "(" + this.getValue() + ")";
    };

    return ElmTransProp;

  })(ElmStyleProp);

  TransFormProp = (function(_super) {

    __extends(TransFormProp, _super);

    function TransFormProp(prop_name, props) {
      this.prop_name = prop_name;
      this.props = props;
    }

    TransFormProp.prototype.getValue = function() {
      var prop, propvalues;
      propvalues = (function() {
        var _i, _len, _ref, _results;
        _ref = this.props;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          prop = _ref[_i];
          _results.push(prop.toCss());
        }
        return _results;
      }).call(this);
      return propvalues.join(" ");
    };

    return TransFormProp;

  })(Prop);

  if (typeof exports !== "undefined" && exports !== null) exports.Prop = Prop;

  if (typeof exports !== "undefined" && exports !== null) {
    exports.ElmTransProp = ElmTransProp;
  }

  if (typeof exports !== "undefined" && exports !== null) {
    exports.ElmStyleProp = ElmStyleProp;
  }

  if (typeof exports !== "undefined" && exports !== null) {
    exports.TransFormProp = TransFormProp;
  }

}).call(this);
