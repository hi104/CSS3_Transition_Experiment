(function() {
  var ApplicationData, ElmStyleProp, ElmTransProp, Prop, PropFactory, SelectMovePositions, SelectOriginPositions, TransFormProp, anim_elm_data, applyStyle, current_trans_prop, easing_table, generateSelectItem, generateTransitionItem, getStyle, getTransProp, in_trans_prop, loadSampleData, make, makeCombination, makeStyle, origin_position_persent, out_trans_prop, position_persent, selectItem, selected_anim_id, setSampleDataUi, setSelectUi, vendor_prefixs, _fac;

  Prop = exports.Prop;

  ElmTransProp = exports.ElmTransProp;

  ElmStyleProp = exports.ElmStyleProp;

  TransFormProp = exports.TransFormProp;

  _.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g
  };

  PropFactory = (function() {

    function PropFactory() {}

    PropFactory.prototype.timing = function(selector) {
      return new ElmStyleProp(selector, "transition-timing-function", this.getVal, this.setVal);
    };

    PropFactory.prototype.delay = function(selector) {
      return new ElmStyleProp(selector, "transition-delay", this.getVal, this.setVal);
    };

    PropFactory.prototype.duration = function(selector) {
      return new ElmStyleProp(selector, "transition-duration", this.getVal, this.setVal);
    };

    PropFactory.prototype.origin = function(selector) {
      return new ElmStyleProp(selector, "transform-origin", this.getSelectData, this.setSelectData);
    };

    PropFactory.prototype.translate = function(selector) {
      return new ElmTransProp(selector, "translate", this.getSelectData, this.setSelectData);
    };

    PropFactory.prototype.rotate = function(selector) {
      return new ElmTransProp(selector, "rotate", this.getVal, this.setVal);
    };

    PropFactory.prototype.scale = function(selector) {
      return new ElmTransProp(selector, "scale", this.getVal, this.setVal);
    };

    PropFactory.prototype.getSelectData = function(elm) {
      return elm.find('.ui-selected').first().attr("data");
    };

    PropFactory.prototype.setSelectData = function(elm, val) {
      var data_selector;
      elm.find(".ui-selected").removeClass("ui-selected");
      data_selector = 'li[data="' + val + '"]';
      return elm.find(data_selector).addClass("ui-selected");
    };

    PropFactory.prototype.getVal = function(elm) {
      return elm.val();
    };

    PropFactory.prototype.setVal = function(elm, val) {
      return elm.val(val);
    };

    return PropFactory;

  })();

  PropFactory.prototype.func_prop_map = {
    "transition-timing-function": "timing",
    "transition-delay": "delay",
    "transition-duration": "duration",
    "transform-origin": "origin",
    "translate": "translate",
    "rotate": "rotate",
    "scale": "scale"
  };

  PropFactory.prototype.createFromDataObj = function(obj, factory) {
    return factory[PropFactory.prototype.func_prop_map[obj.prop]](obj.selector);
  };

  this.TransitionSet = (function() {

    function TransitionSet(props) {
      this.transition_prop = props.transition_prop;
      this.anim_trans = props.anim_trans;
      this.option = props.option;
    }

    TransitionSet.prototype.toDataObj = function() {
      var e, ret;
      ret = {};
      ret.anim_trans = (function() {
        var _i, _len, _ref, _results;
        _ref = this.anim_trans;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          e = _ref[_i];
          _results.push(e.toDataObj());
        }
        return _results;
      }).call(this);
      ret.option = (function() {
        var _i, _len, _ref, _results;
        _ref = this.option;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          e = _ref[_i];
          _results.push(e.toDataObj());
        }
        return _results;
      }).call(this);
      ret.transition_prop = (function() {
        var _i, _len, _ref, _results;
        _ref = this.transition_prop;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          e = _ref[_i];
          _results.push(e.toDataObj());
        }
        return _results;
      }).call(this);
      return ret;
    };

    return TransitionSet;

  })();

  this.TransitionSet.prototype.restore = function(obj) {
    return _(obj).each(function(v, k) {
      var propdata, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = v.length; _i < _len; _i++) {
        propdata = v[_i];
        _results.push((function(propdata) {
          if (propdata.selector) {
            return PropFactory.prototype.createFromDataObj(propdata, _fac).setValue(propdata.val);
          }
        })(propdata));
      }
      return _results;
    });
  };

  ApplicationData = (function() {

    function ApplicationData() {}

    ApplicationData.prototype.getTransDataJson = function() {
      return JSON.stringify({
        in_trans_prop: in_trans_prop.toDataObj(),
        current_trans_prop: current_trans_prop.toDataObj(),
        out_trans_prop: out_trans_prop.toDataObj()
      });
    };

    ApplicationData.prototype.loadTransDataJson = function(json) {
      var obj;
      obj = JSON.parse(json);
      return _(obj).each(function(v, k) {
        return this.TransitionSet.prototype.restore(v);
      });
    };

    return ApplicationData;

  })();

  exports.appData = new ApplicationData();

  _fac = new PropFactory;

  in_trans_prop = new TransitionSet({
    transition_prop: [_fac.origin("#origin-table2"), new Prop("transition-duration", "0s")],
    anim_trans: [_fac.translate("#translate2"), _fac.rotate("#rotate2"), _fac.scale("#scale2")],
    option: [new Prop("opacity", "0"), new Prop("z-index", "1000")]
  });

  current_trans_prop = new TransitionSet({
    transition_prop: [_fac.timing("#transition-timing-function2"), _fac.duration("#transition-duration2"), _fac.delay("#transition-delay2")],
    anim_trans: [],
    option: [new Prop("z-index", "1000")]
  });

  out_trans_prop = new TransitionSet({
    transition_prop: [_fac.origin("#origin-table"), _fac.timing("#transition-timing-function"), _fac.duration("#transition-duration"), _fac.delay("#transition-delay")],
    anim_trans: [_fac.translate("#translate"), _fac.rotate("#rotate"), _fac.scale("#scale")],
    option: [new Prop("opacity", "0"), new Prop("z-index", "1000")]
  });

  vendor_prefixs = ["-webkit-", "-moz-", "-o-"];

  getTransProp = function(prop) {
    var css_props, vender_props;
    vender_props = [];
    _(prop.transition_prop).each(function(e) {
      return vender_props.push(e);
    });
    if (prop.anim_trans.length > 0) {
      vender_props.push(new TransFormProp("transform", prop.anim_trans));
    }
    css_props = [];
    _(vendor_prefixs).each(function(prefix) {
      return _(vender_props).each(function(e) {
        return css_props.push(prefix + e.toCss());
      });
    });
    _(prop.option).each(function(e) {
      return css_props.push(e.toCss());
    });
    return css_props;
  };

  getStyle = function(prop) {
    return getTransProp(prop).join("\n    ");
  };

  origin_position_persent = [-50, 0, 50, 100, 150];

  position_persent = [-200, -100, 0, 100, 200];

  makeCombination = function(array, fn) {
    var ret;
    ret = _.map(array, function(e) {
      return _.map(array, function(e2) {
        return fn(e2, e);
      });
    });
    return _.flatten(ret);
  };

  SelectMovePositions = makeCombination(position_persent, function(e2, e) {
    return e2 + "%, " + e + "%";
  });

  SelectOriginPositions = makeCombination(origin_position_persent, function(e2, e) {
    return e2 + "% " + e + "%";
  });

  make = function(text, background) {
    return {
      text: text,
      background: background
    };
  };

  anim_elm_data = [make("1", "#FFAEAE"), make("2", "#FFF0AA"), make("3", "#B0E57C"), make("4", "#B4D8E7")];

  generateSelectItem = function() {
    var base, index, temp;
    base = $("#select-animation");
    temp = _.template('<li style="background:{{background}}" value="anim{{index}}">\
               <div value="anim{{index}}">{{text}}</div>\
            </li>');
    index = 0;
    return _(anim_elm_data).each(function(e) {
      index += 1;
      return base.append(temp(_.extend(e, {
        index: index
      })));
    });
  };

  generateTransitionItem = function() {
    var base, index, temp;
    base = $(".transition-space");
    temp = _.template('<div id="anim{{index}}" class="transition-wrap" >\
             <div class="transition-item"  style="background:{{background}}">\
                     <div><p>{{text}}</p></div>\
              </div>\
         </div>');
    index = 0;
    return _(anim_elm_data).each(function(e) {
      index += 1;
      return base.append(temp(_.extend(e, {
        index: index
      })));
    });
  };

  setSelectUi = function() {
    var rotate_range, scale_range;
    generateTransitionItem();
    generateSelectItem();
    _.each(SelectOriginPositions, function(e) {
      var templi;
      templi = _.template('<li class="ui-widget-content" data="{{val}}"></li>');
      return $(".select-origin").append(templi({
        val: e
      }));
    });
    _.each(SelectMovePositions, function(e) {
      var templi;
      templi = _.template('<li class="ui-widget-content" data="{{val}}"></li>');
      return $(".select-translate").append(templi({
        val: e
      }));
    });
    $(".selectable-wrap").selectable();
    $(".transition-space-wrap").resizable({
      handles: "se",
      aspectRatio: true
    });
    rotate_range = _.map(_.range(-360, 361), function(e) {
      return e;
    });
    scale_range = _.map(_.range(0, 30), function(e) {
      return 0.1 * e;
    });
    _.each(_.range(1, 10), function(e) {
      return scale_range.push(e * 5);
    });
    _.each(_.range(5, 10), function(e) {
      return scale_range.push(e * 10);
    });
    _.each(rotate_range, function(e) {
      var temp;
      temp = _.template('<option value="{{val +"deg"}}"> {{val}}</option>');
      return $(".select-rotate").append(temp({
        val: e
      }));
    });
    _.each(scale_range, function(elm) {
      var e, temp;
      e = Math.round(elm * 10) / 10;
      temp = _.template('<option value="{{val}}""> {{name}}</option>');
      $(".scale-select").append(temp({
        name: e,
        val: e + ", " + e
      }));
      $(".select-duration").append(temp({
        name: e + "s",
        val: e + "s"
      }));
      return $(".select-delay").append(temp({
        name: e + "s",
        val: e + "s"
      }));
    });
    _.each(easing_table, function(v, k) {
      var temp;
      temp = _.template("<option value=\"{{v}}\" name=\"{{k}}\"> {{k}}</option>");
      return $(".select-timing").append(temp({
        k: k,
        v: v
      }));
    });
    $(".select-duration").val("1s");
    $(".select-delay").val("0s");
    $(".select-rotate").val("0deg");
    $(".scale-select").val("1, 1");
    $("#fade").val("on");
    return _([".select-translate", ".select-origin"]).each(function(selector) {
      return _($(selector)).each(function(e) {
        return $($(e).children()[12]).addClass("ui-selected");
      });
    });
  };

  selected_anim_id = void 0;

  setSampleDataUi = function() {
    var json, name, select, templi, _ref;
    select = $("#select-sample");
    templi = _.template("<li><a href='#' data='{{name}}'>{{name}}</a></li>");
    _ref = exports.sampleData;
    for (name in _ref) {
      json = _ref[name];
      select.append(templi({
        name: name
      }));
    }
    return $("#select-sample a").click(function(e) {
      var key;
      e.preventDefault();
      key = $(this).attr("data");
      return loadSampleData(key);
    });
  };

  loadSampleData = function(key) {
    exports.appData.loadTransDataJson(exports.sampleData[key]);
    makeStyle();
    applyStyle();
    return selectItem("#anim1");
  };

  makeStyle = function() {
    var css, current_style, in_style, out_style, selector;
    css = new CssUtil();
    selector = function(e) {
      return ".transition-space " + e + " .transition-item";
    };
    in_style = css.makeStyleRule(selector(".in"), getStyle(in_trans_prop));
    out_style = css.makeStyleRule(selector(".out"), getStyle(out_trans_prop));
    current_style = css.makeStyleRule(selector(".current"), getStyle(current_trans_prop));
    return $("#styleText").val(in_style + out_style + current_style);
  };

  applyStyle = function() {
    var css;
    selected_anim_id = void 0;
    $(".transition-wrap").removeClass("current").removeClass("out").addClass("in");
    css = new CssUtil();
    return css.putCSSRule("animate-style", $("#styleText").val());
  };

  selectItem = function(anim_id) {
    if (selected_anim_id !== void 0 && selected_anim_id === anim_id) return;
    if (selected_anim_id) {
      $(".out").addClass("in");
      $(".out").removeClass("out");
      $(selected_anim_id).removeClass("current");
      $(selected_anim_id).addClass("out");
    }
    return setTimeout(function() {
      $(anim_id).removeClass("in");
      $(anim_id).addClass("current");
      return selected_anim_id = anim_id;
    }, 1);
  };

  $(document).ready(function() {
    setSelectUi();
    setSampleDataUi();
    $("#select-animation li div").click(function(e) {
      var anim_id;
      anim_id = "#" + $(this).attr("value");
      return selectItem(anim_id);
    });
    $("#makeButton").click(function(e) {
      e.preventDefault();
      return makeStyle();
    });
    $("#applyButton").click(function(e) {
      e.preventDefault();
      applyStyle();
      return selectItem("#anim1");
    });
    return loadSampleData("crossFade");
  });

  easing_table = {
    'in': 'ease-in',
    'out': 'ease-out',
    'in-out': 'ease-in-out',
    'snap': 'cubic-bezier(0,1,.5,1)',
    'linear': 'cubic-bezier(0.250, 0.250, 0.750, 0.750)',
    'ease-in-quad': 'cubic-bezier(0.550, 0.085, 0.680, 0.530)',
    'ease-in-cubic': 'cubic-bezier(0.550, 0.055, 0.675, 0.190)',
    'ease-in-quart': 'cubic-bezier(0.895, 0.030, 0.685, 0.220)',
    'ease-in-quint': 'cubic-bezier(0.755, 0.050, 0.855, 0.060)',
    'ease-in-sine': 'cubic-bezier(0.470, 0.000, 0.745, 0.715)',
    'ease-in-expo': 'cubic-bezier(0.950, 0.050, 0.795, 0.035)',
    'ease-in-circ': 'cubic-bezier(0.600, 0.040, 0.980, 0.335)',
    'ease-in-back': 'cubic-bezier(0.600, -0.280, 0.735, 0.045)',
    'ease-out-quad': 'cubic-bezier(0.250, 0.460, 0.450, 0.940)',
    'ease-out-cubic': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
    'ease-out-quart': 'cubic-bezier(0.165, 0.840, 0.440, 1.000)',
    'ease-out-quint': 'cubic-bezier(0.230, 1.000, 0.320, 1.000)',
    'ease-out-sine': 'cubic-bezier(0.390, 0.575, 0.565, 1.000)',
    'ease-out-expo': 'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
    'ease-out-circ': 'cubic-bezier(0.075, 0.820, 0.165, 1.000)',
    'ease-out-back': 'cubic-bezier(0.175, 0.885, 0.320, 1.275)',
    'ease-out-quad': 'cubic-bezier(0.455, 0.030, 0.515, 0.955)',
    'ease-out-cubic': 'cubic-bezier(0.645, 0.045, 0.355, 1.000)',
    'ease-in-out-quart': 'cubic-bezier(0.770, 0.000, 0.175, 1.000)',
    'ease-in-out-quint': 'cubic-bezier(0.860, 0.000, 0.070, 1.000)',
    'ease-in-out-sine': 'cubic-bezier(0.445, 0.050, 0.550, 0.950)',
    'ease-in-out-expo': 'cubic-bezier(1.000, 0.000, 0.000, 1.000)',
    'ease-in-out-circ': 'cubic-bezier(0.785, 0.135, 0.150, 0.860)',
    'ease-in-out-back': 'cubic-bezier(0.680, -0.550, 0.265, 1.550)'
  };

}).call(this);
